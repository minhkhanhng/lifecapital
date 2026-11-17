# Review độc lập (fable) · SW/offline thật + tái hiện A5, A6 · 2026-11-17 · main v0.7.1

**Cách làm.** Pane tích hợp (Claude/Electron, Chrome 152) **không đăng ký được SW** ở `http://localhost:8792` ("unknown error when fetching the script", máy chủ không nhận GET `/sw.js` dù `fetch("sw.js")` từ trang vẫn 200) và Claude in Chrome không kết nối → VIỆC 1 chạy bằng **Google Chrome 157 headless** (`--remote-debugging-port=9333`, profile riêng trong scratchpad, cửa sổ 1440×900, innerWidth 1440) điều khiển qua CDP (`scratchpad/cdp.mjs`), tệp tĩnh `python3 -m http.server 8792`. Mạng chậm/treo/404/500 mô phỏng bằng máy chủ Python riêng (`scratchpad/srv.py`) **cùng cổng 8792** sau khi tắt máy chủ tĩnh; trước mỗi lần đo xóa HTTP cache (`Network.clearBrowserCache`) vì `http.server` gửi `Last-Modified` → Chrome coi tươi theo heuristic, còn Vercel mặc định `max-age=0, must-revalidate` (xác nhận `vercel.json` không đặt `Cache-Control`). VIỆC 2 chạy trong pane ở `http://127.0.0.1:8794` với `loadDemo()`, stub `fetch` (không gọi Google/Supabase), chỉ ghi localStorage của origin 8794 rồi xóa.

## Số đo (Chrome headless, localhost:8792, SW `lc-0.7.1` active + controller = true sau lần mở đầu)
| Kịch bản | tải xong (ms, wall) | responseEnd / domInteractive (ms) | nguồn | Kết quả |
|---|---|---|---|---|
| (a) mở lần 1 (cài SW) | 408 | 21 / 324 | mạng, 655 375 B | SW activated ngay lần đầu, cache `lc-0.7.1` |
| (a) mở lần 2 | 321 | 254 / 260 | qua SW, fetch mạng | FCP 280 ms, transfer 0 |
| (a) mở lần 3 | 60 | 16 / 26 | HTTP cache (heuristic) | FCP 48 ms |
| (b) máy chủ trả `/` sau 6 s, SW bật | **4 068** | 4 014 / 4 043 | `cache-storage` | chờ đúng 4 s rồi mới lấy bản lưu |
| (b') cùng máy chủ 6 s, bypass SW (đối chứng) | 6 063 | 6 012 / 6 044 | mạng | không có SW: 6 s |
| (b'') máy chủ treo 30 s, SW bật | 4 065 | 4 011 / 4 037 | `cache-storage` | trần 4 s, không phụ thuộc mạng treo bao lâu |
| (c) tắt hẳn máy chủ (connection refused) | 61 | 6 / 31 | `cache-storage` | app mở bình thường; **không có dấu hiệu offline** (chưa đăng nhập → không badge; `navigator.onLine` vẫn true) |
| (d) máy chủ trả **500** cho `/` (cache vẫn có `./`) | 64 | 9 / 20 | mạng, 317 B | **hiện "500 fake"**, không dùng bản lưu; cache `./` còn nguyên |
| (d') máy chủ trả **404** cho `/` | 62 | 9 / 12 | mạng, 317 B | **hiện "404 fake"** |
| (e) Cache Storage sau lần cài đầu | — | — | — | **1 354 082 B** (11 mục: `./` 655 075, icon-maskable-512 267 455, icon-512 257 653, icon-192 44 508, apple-touch 39 655, logo-192 39 195, icon-144 26 569*, logo-96 12 658, favicon.ico 7 769, favicon-32 2 439, manifest 1 106); `storage.estimate` 1 366 171 B. Khớp ước 1,33 MB. (*icon-144 không trong CORE, vào qua `cacheFirst`) |

## Kết luận VIỆC 1 (đều **chắc**, đo trực tiếp)
- **hieu-nang #1 xác nhận**: `networkFirst` chờ mạng tới 4 s rồi mới mở bản lưu; mạng treo bao lâu cũng là 4 s màn trắng, mạng 6 s thì tiết kiệm 2 s so với không SW. Sửa 1 dòng (giữ nguyên đề xuất cũ, `sw.js:33`): `caches.match("./").then(hit => hit && finish(hit));` ngay đầu `networkFirst` (stale-while-revalidate; bản mới vẫn vào cache qua `fetch` và thanh "Có bản mới" do đổi `VERSION`).
- **kien-truc #5 / A8 xác nhận**: `finish(res)` với `res.ok === false` → người dùng thấy trang lỗi 404/500 của máy chủ dù app đã lưu sẵn (đúng lúc deploy Vercel lỗi). Sửa 1 dòng (`sw.js:35`): `if (!res.ok) return caches.match("./").then(h => finish(h || res));`. Nâng từ "có thể" lên **chắc** → giữ Important.
- Offline hoàn toàn: mở được từ cache trong 61 ms, đúng như thiết kế.

## Điều mới
- **Important** · Khi máy chủ không với tới (connection refused, captive portal) app mở từ cache nhưng không báo gì: `navigator.onLine` vẫn `true`, sự kiện `offline` không bắn, badge chỉ có khi đã đăng nhập (`index.html:5883`, `:7442`). Người dùng chưa đăng nhập tưởng dữ liệu "mới nhất". Sửa 1 dòng: trong `networkFirst` khi rơi vào bản lưu gửi `client.postMessage("served-from-cache")` và trang hiện toast "Đang dùng bản đã lưu". **Chắc** (quan sát), mức ảnh hưởng **có thể**.
- **Minor** · `cacheFirst` lưu cả PNG ngoài CORE (`icon-144.png` 26 KB) → mỗi tệp tĩnh mở lần đầu đều vào cache vĩnh viễn tới khi đổi `VERSION`; vô hại nhưng số 1,33 MB là sàn, không phải trần. Chắc.
- **Minor** · Ở Vercel (`max-age=0, must-revalidate`) mỗi lần mở là một GET có điều kiện qua SW; ở local số (a) lần 3 nhanh nhờ HTTP cache heuristic nên **không ngoại suy** 26 ms sang production — con số production nằm giữa (a) lần 2 và (b). Chắc.

## VIỆC 2 (127.0.0.1:8794, hàm nội bộ, stub fetch)
- **A6 xác nhận (chắc)**: `mergeStates(base, mine, theirs, true)` với base `bl{sk:1}`, mine `bl{sk:2}`, theirs `bl{sk:1,qh:3}` → máy A ra `bl{sk:2}` (mất `qh:3`); máy B gộp chiều ngược ra `bl{sk:1,qh:3}` (mất `sk:2`) → hai máy **lệch nhau** cho tới vòng đẩy/kéo sau, bên đẩy sau thắng. `cfg.defDuration` chỉ mất khi **cả hai** cùng sửa `cfg` (khóa khác nhau: mine `x:2`, theirs `defDuration:2` → A giữ `defDuration:1`, B giữ `x:1`); một bên sửa thì `pick` lấy đúng. Nguyên nhân: `pick` (`:2648`) so cả khối bằng `sameJ`. Sửa 1 dòng: `const pick = f => mergeMap(base && base[f], mine[f], theirs[f], trust)` (gộp ba bên theo từng khóa, cùng cách đã dùng cho `health.days`; cần kiểm `mergeMap` với giá trị vô hướng).
- **A5 xác nhận cơ chế (chắc), tần suất thật (có thể)**: hoạt động mới `markPending` chỉ có `ds:1`, **không có `gi`**; `gi` chỉ sinh tại `gcalCreateEvent` (`:3977`) lúc đẩy. Mô phỏng: máy A có sự kiện `ds:1`, bản sao `cleanState` (= bản B nhận qua cloud trước khi A đẩy) cũng `ds:1` không `gi`; chạy `gcalFlushRun` ở A rồi ở B → **2 POST với `id` khác nhau** (`t3n54…` và `h0psf…`), không có 409 → hai sự kiện trên Google. Đối chứng: nếu B nhận bản **sau** khi A đẩy xong (`gi`+`gid` đã có) → B không POST (1 POST tổng). **Điều kiện cần**: (1) cả hai máy `gcalLinked` + token còn hạn + `gcalAutoSync !== false` (máy chỉ `gcalShared` không đẩy); (2) bản có `ds` tới máy B (cloud: 2 s trễ + `lc_ping`) **trước khi** kết quả đẩy của A (`gi`,`gid`) lên cloud — tức POST của A chậm/lỗi > ~2 s (mạng Google chậm, 429/5xx → retry 30 s, token hết hạn rồi kết nối lại sau), hoặc A đóng tab ngay sau khi tạo; (3) khóa `navigator.locks` chỉ chặn tab **cùng trình duyệt**, không chặn máy khác. Sửa 1 dòng (`:3914`): `if (e && !e.demo && !e.gx && (gcalActive() || gcalShared())) { e.ds = (e.ds || 0) + 1; if (!e.gi) e.gi = gcalNewId(); }` → `gi` đi cùng bản ghi qua cloud, máy thứ hai POST trùng id nhận 409 và đi đường "nhận lấy" đã có sẵn (`:3980`).

## Chưa xem được
- SW trong pane tích hợp (không đăng ký được) và trên Safari/iOS thật; header `Cache-Control` thật của Vercel (không gọi production); hành vi khi `updateViaCache`/thanh "Có bản mới" lúc đổi `VERSION` (chỉ một VERSION); A5 với Google thật (stub); mergeMap với giá trị vô hướng (chưa chạy thử đề xuất sửa).

Dọn dẹp: unregister SW, xóa cache `lc-0.7.1`, localStorage/IndexedDB origin localhost:8792; tắt Chrome headless (xóa profile), máy chủ 8792/8794/srv.py; localStorage origin 127.0.0.1:8794 đã xóa.
