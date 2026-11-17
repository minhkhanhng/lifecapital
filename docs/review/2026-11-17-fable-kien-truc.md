# Review độc lập (fable) · Lượt 1 · Kiến trúc và code · 2026-11-17

Phạm vi: `index.html` (10 434 dòng; CSS 140 KB, JS 505 KB; gzip cả tệp 186 KB), `sw.js`, `api/ai_plan.py`, `vercel.json`. Chỉ đọc + chạy trên http://127.0.0.1:8790 (1440×900, dữ liệu `loadDemo()` + 3 năm × 10 hoạt động/ngày = 10 950 hoạt động, `lc2` 1,17 MB). Không sửa code, không gọi production/Supabase.

## Critical
1. **Mất việc âm thầm khi Hộp việc quá 500** — `index.html:5677` (`.slice(0, 500)` trong `cleanState`), việc đã xong không bao giờ bị dọn (`:7165` vẫn liệt kê). Tái hiện: đẩy 520 việc vào `S.tasks`, `save()`, tải lại → đĩa 525, bộ nhớ 500, lần `save()` kế tiếp ghi 500 (đã tái hiện; cùng cơ chế: `projects` 200 `:5678`, `habits` 100 `:5679`, `subs` 100 `:6120`). Vi phạm rule.md §11. Sửa 1 dòng: bỏ `.slice(0, 500)` (hoặc chỉ cắt khi nhập JSON lạ, có cảnh báo). **Chắc.**

## Important
2. **`save()` phân tích lại toàn bộ dữ liệu mỗi lần lưu** — `:2515-2520` (`stampEdits`: `stampRaw !== lastRaw` luôn đúng sau mỗi lần lưu vì `save()` không gọi `stampBase`), `JSON.parse` + `cleanState` 1,17 MB. Đo: `save()` 128 ms/lần ở 11k hoạt động; `stampEdits` 79 ms có parse lại, 14 ms không. Sửa 1 dòng: thêm `stampBase(S);` ngay sau `lastRaw = out;` (`:2457`). Hiệu quả ước giảm ~50 %. **Chắc (số đo) / có thể (mức giảm).**
3. **Đếm thay đổi chưa đồng bộ chạy sau mỗi lần lưu khi đã đăng nhập** — `:7443` → `cloudSet("wait")` → `:7434` `cloudPendingCount()` → `:7412` `JSON.parse(canonState(cloudView(S)))` (sao chép sâu + sắp khóa + stringify + parse) + parse `lc_sync_base`. Đo riêng `canonState`+parse 41 ms ở 11k hoạt động; chưa đo khi đăng nhập thật. Sửa 1 dòng: trong `cloudSoon` chỉ đặt `cloud.st = "wait"` và vẽ lại, tính `cloud.n` khi mở Cài đặt/trước khi gửi. **Có thể.**
4. **`save()` nuốt mọi lỗi và báo sai "bộ nhớ đầy"** — `:2461-2464`: `catch (e)` không `console.error`, lỗi lập trình trong `stampEdits`/`absorb`/`mergeStates` (TypeError) hiện thành "Không lưu được dữ liệu, bộ nhớ có thể đã đầy". Tái hiện: trong console `stampEdits = () => { throw new Error("x") }; save()`. Sửa 1 dòng: `console.error("save:", e);` và chỉ hiện thông điệp bộ nhớ khi `e.name === "QuotaExceededError"`. **Chắc.**
5. **Service worker trả trang lỗi thay vì bản đã lưu** — `sw.js:33-36`: `networkFirst` `finish(res)` cả khi `!res.ok` (Vercel 404/5xx lúc deploy) dù cache có "./". Sửa 1 dòng: `if (!res.ok) return caches.match("./").then(h => finish(h || res));`. Chưa tái hiện (SW chỉ đăng ký ở `https:`/`localhost`, `index.html:7847`; 127.0.0.1 không có SW nên e2e chưa phủ offline). **Có thể.**

## Minor
6. Kiến trúc: 756 khai báo toàn cục, 406 handler inline `on*=` so với 37 `addEventListener`; ranh giới 13 "module" chỉ là chú thích. `draw()` (`:5818`) thay toàn bộ `#v` bằng `innerHTML` rồi khôi phục focus/scroll bằng tay (`:5812`, `:5858`); đo 2–27 ms/tab ở 11k hoạt động, DOMContentLoaded 168 ms (máy chủ cục bộ). **Không đề xuất tách tệp**: chưa có lợi đo được; nếu tách thì chỉ lazy-load `hl`/`pj`/`me` (3 tab chiếm phần lớn JS). Chắc.
7. Trùng lặp: biểu thức chọn 3 bên (mine/theirs/base) lặp 4 lần `:2539`, `:2566`, `:2576`, `:2584` → một hàm `pick3`; khởi tạo caps từ `DCAP` lặp 3 lần `:2324`, `:2403`, `:5658` → `defCaps()`; tách giờ `split(":")` lặp `:2441`, `:2952`, `:3894`, `:4788`. Chắc.
8. `index.html:5686` `window.claude.use("downloads")`: mã chỉ có trong môi trường artifact, không tồn tại trên lifecapital.vercel.app; bỏ để `saveFile` ngắn và rõ. Chắc.
9. `SB_URL`/`SB_KEY` khai báo hai nơi (`index.html:7372-7373`, `api/ai_plan.py:15-16`); đổi dự án Supabase phải sửa cả hai. Chắc.
10. `tick()` chạy hai lần khi quay lại tab (`focus` `:5880` và `visibilitychange` `:5878`); đo 0 ms, chỉ thừa. Chắc.
11. Dead code: **không thấy** — 756 khai báo đầu tệp đều được tham chiếu; 571 lớp CSS đều dùng (24 lớp "không thấy" đều ghép động: `m${v}`, `q${t.q}`, `l${v}`…); dọn ở v0.7.1 có hiệu lực. `innerHTML` 30 điểm + 1 `insertAdjacentHTML`: các đường dữ liệu người dùng đã xem (ghi nhanh, toast, `ask`, AI, Cài đặt, tooltip `dTip`) đều qua `esc()`; `ask({html})` 3 nơi đều tĩnh. Chắc (trong mẫu đã xem; lượt 3 rà kỹ).
12. 69 `catch` rỗng, phần lớn bọc `localStorage` (chấp nhận được); đáng chú ý `absorb` `:2683` và `restoreSnapshot` `:2711` bỏ qua lỗi parse không ghi log → thêm `console.warn`. Chắc.

Chưa xem được: service worker/offline thật (không đăng ký ở 127.0.0.1), chi phí khi đăng nhập Supabase thật, lớp `.dash .d4/.d6` (`:1926`) có được ghép động không, tỷ lệ JS từng module (chưa đo), Python runtime trên Vercel.
