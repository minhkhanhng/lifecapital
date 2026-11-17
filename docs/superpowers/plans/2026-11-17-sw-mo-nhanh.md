# Gói 5 · sw-mo-nhanh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** (C1) mở app từ bản đã lưu ngay, không chờ mạng tới 4 s; bản mới tải nền. (C4) cài đặt đầu tiên nhẹ hơn: bỏ hai icon 512 khỏi `CORE`. (Mới) khi không với tới máy chủ, hiện nhãn nhỏ "Bản đã lưu" cạnh tiêu đề (PO chọn Hướng 2 ngày 2026-11-17). A8 (trả cache khi 404/5xx) ĐÃ xong ở gói 2, giữ nguyên.

**Architecture:** `sw.js` đổi `networkFirst` thành "bản lưu trước, làm mới nền" (stale-while-revalidate) cho điều hướng; chưa có bản lưu thì chờ mạng như cũ (kể cả nhánh 404/5xx). SW báo trạng thái mạng cho trang bằng `postMessage`; trang hiện/ẩn nhãn. Không đổi cấu trúc dữ liệu, `APPV`, `VERSION`, CHANGELOG (chưa phát hành; ghi vào CURRENT rằng phát hành gói này phải nâng đủ 3 chỗ). Không push/deploy; commit cục bộ trên nhánh gói (PO đã cho phép).

**Spec:** `docs/review/2026-11-17-fable-sw-offline.md` (số đo C1, dấu hiệu offline, kích thước cache), `docs/review/2026-11-17-tong-hop.md` C1, C4, `rule.md` §10, §11, §16.

## Thiết kế SW (`sw.js`)
- `revalidate()`: một lời hứa dùng chung (nếu đang chạy thì trả lại cái đó). Gọi `fetch("./", {cache: "no-store"})`; `res.ok` → `cache.put("./", res.clone())`, `lastNet = {ok: true, t: Date.now()}`; lỗi mạng hoặc `!res.ok` → `lastNet = {ok: false, t}`. Sau khi xong gọi `broadcast()` = `clients.matchAll({type:"window"})` rồi `postMessage({lc: "net", ok})`.
- Điều hướng (`mode === "navigate"`, cùng nguồn): `caches.match("./")` có → trả ngay bản đó và `e.waitUntil(revalidate())`; chưa có → hành vi cũ (chờ mạng; 404/5xx trả phản hồi của máy chủ vì không có gì khác; lỗi mạng `Response.error()`). Bỏ bộ đếm 4 giây (chỉ cần khi có bản lưu, nay trả ngay).
- Tin nhắn từ trang `"net?"`: nếu `lastNet` còn mới (< 30 s) trả ngay cho client gửi, ngược lại `revalidate()` rồi phát. Giữ `"skip-waiting"`. Không đổi nhánh `/api/*`, `cacheFirst` hay `activate`.
- C4: bỏ `icon-512.png` và `icon-maskable-512.png` khỏi `CORE` (vẫn vào cache khi trình duyệt tự yêu cầu qua `cacheFirst`). Không nén/đổi ảnh.
- Không đổi `VERSION`.

## Thiết kế trang (`index.html`)
- Thêm phần tử không tương tác `#netChip` ("Bản đã lưu", `hidden` mặc định) cạnh tiêu đề thanh trên (Hướng 2), dùng class/ token và bậc chữ có sẵn trong thang 8 bậc (không thêm cỡ chữ mới, không là vùng bấm); xem `.update-bar`, `#syncBadge` để lấy kiểu. Có `title`/`aria-label` giải thích "Chưa kết nối được máy chủ, đang xem bản đã lưu trên máy" và `role="status"`.
- Trong khối đăng ký SW (`index.html:~7891`): thêm lắng nghe `navigator.serviceWorker` `message` với `data.lc === "net"` → `#netChip.hidden = data.ok`; sau khi đăng ký và khi có controller, gửi `controller.postMessage("net?")` một lần; thêm sự kiện `window` `online` và `visibilitychange` (khi hiện lại) gửi `"net?"`. Khi không có SW (http, không controller) nhãn luôn ẩn. Không động tới thanh "Có bản mới".

## Global Constraints
- Không mất dữ liệu người dùng; không đụng `localStorage`/dữ liệu app; SW không lưu `/api/*`.
- Giữ thang chữ 8 bậc và vùng bấm tối thiểu (rule §10); kiểm 390 (mobile), 820, 1440; sáng/tối nếu app có.
- Test Node `tests/sw/test_sw.js` (giả lập SW) mở rộng; test trang `tests/e2e/e2e-sw.js` (`window.E2ESW`, có chốt dữ liệu demo, khôi phục DOM/storage) gửi `MessageEvent` giả vào `navigator.serviceWorker` (không cần đăng ký SW trên 127.0.0.1).
- Cổng lạ 8799 (`python3 -m http.server 8799 --bind 127.0.0.1` từ thư mục worktree, Bash nền, không giấu đầu ra; `preview_start` đọc nhầm cấu hình); kiểm `<title>Life Capital`; cổng 8765 là dự án khác.
- Số đo SW thật chỉ làm bằng Chrome headless profile riêng qua CDP ở `localhost` (lesson.md); việc này do người điều phối làm sau review, không thuộc implementer.

## Review Focus
- Điều hướng có bản lưu: trả ngay, không chờ mạng; bản mới vẫn vào cache; cache hỏng/thiếu vẫn rơi về chờ mạng, không trang trắng.
- Chưa có bản lưu + 404/5xx/mất mạng không tệ hơn trước gói.
- Không gửi `postMessage` tới client đã đóng gây lỗi; `revalidate` không chạy chồng; tin nhắn lạ bị bỏ qua.
- Nhãn không lệch với `online/offline`: khi mạng về, nhãn tự ẩn; không hiện nhãn khi chưa có SW.
- Hai icon 512 không còn trong `CORE` nhưng vẫn nạp được qua `cacheFirst`.

### Task 1 (SW logic + C4): test đỏ rồi sửa

**Files:** Modify `tests/sw/test_sw.js`, `sw.js`.

- [ ] **Step 1: Ca `SW9.*` trong `test_sw.js`** (khuôn các ca SW8.*): `SW9.1` có bản lưu + `fetch` treo (không bao giờ resolve): `respondWith` trả bản lưu trong < 100 ms (đo bằng đồng hồ giả hoặc `Promise.race` với hạn ngắn); `SW9.2` có bản lưu + mạng trả 200 bản mới: phản hồi ngay là bản cũ, sau `waitUntil` cache `./` là bản mới; `SW9.3` có bản lưu + mạng lỗi: trả bản lưu, đã `postMessage({lc:"net",ok:false})`; `SW9.4` mạng 200 → `postMessage({lc:"net",ok:true})`; `SW9.5` không bản lưu + mạng 500: trả phản hồi 500 (như SW8.3), không bản lưu + mạng lỗi: `Response.error()`; `SW9.6` tin `"net?"` làm `revalidate` một lần, hai tin liên tiếp trong 30 s không gọi `fetch` hai lần; `SW9.7` `CORE` không còn `icon-512.png` và `icon-maskable-512.png` (đọc `CORE` từ nguồn `sw.js`), vẫn có `./`, `manifest.json`, `icon-192.png`; `SW9.8` `/api/*` vẫn không bị chặn. Các ca SW8.* cũ phải giữ nguyên ý nghĩa (SW8.1 và SW8.3 có thể cần chỉnh khung nhưng không nới lỏng).
- [ ] **Step 2: Chạy `node tests/sw/test_sw.js`, phải ĐỎ** (SW9.1–9.4, 9.6, 9.7). Ghi số đỏ.
- [ ] **Step 3: Sửa `sw.js`** theo thiết kế.
- [ ] **Step 4: Chạy lại, SW9.* và SW8.* xanh; `node --check sw.js`.**

### Task 2 (nhãn "Bản đã lưu" trên trang): test đỏ rồi sửa

**Files:** Create `tests/e2e/e2e-sw.js` + dòng trong bảng `tests/e2e/README.md`; Modify `index.html`.

- [ ] **Step 1: Ca `W1.*`**: `W1.1` `#netChip` có trong DOM, mặc định ẩn; `W1.2` gửi `MessageEvent` `{lc:"net",ok:false}` vào `navigator.serviceWorker` → chip hiện, chữ chứa "Bản đã lưu", có `role="status"`; `W1.3` `{lc:"net",ok:true}` → ẩn; `W1.4` tin nhắn lạ (`"skip-waiting"`, `{lc:"x"}`, `null`, chuỗi) không đổi chip và không ném lỗi; `W1.5` chip không phải vùng bấm (không là `button`/`a`, không có `onclick`); `W1.6` cỡ chữ của chip nằm trong thang 8 bậc của app (so với các cỡ chữ tính toán đã dùng ở các phần tử khác: đọc thang từ CSS, vd biến `--fs-*` hoặc danh sách trong CLAUDE.md); `W1.7` ở 1440 và 390 chip nằm cùng hàng tiêu đề, không tràn ngang (`scrollWidth <= clientWidth` của thanh trên); `W1.8` không tạo lỗi console khi trang không có SW.
- [ ] **Step 2: Chạy, phải ĐỎ** (W1.1–W1.3, W1.5–W1.7 đỏ vì chưa có chip).
- [ ] **Step 3: Sửa `index.html`** theo thiết kế (chip + lắng nghe + gửi `"net?"`).
- [ ] **Step 4: Chạy lại `E2ESW`, rồi E2E (e2e6.js) 95/95, E2EUAT2 71/71, E2EUAT3 62/62, E2EUX 124/124 (kiểm giao diện), E2EDASH 36/36, merge-tests 35/35, `node --check` khối script chính; ở 1440×900 và 390×844 chụp màn hình chip hiện.**
