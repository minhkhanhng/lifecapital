# Gói 8 · truy-cap-va-cam-ung Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** (E1) mở được hoạt động trên lịch bằng bàn phím. (E2) vùng bấm tối thiểu 36 px trên cảm ứng và cửa sổ hẹp, theo HƯỚNG C do PO chọn (2026-11-17): nút "+" cao 36 thật; nhãn tình trạng ngày (`.hl-day`) và nút thu gọn (`.hv-toggle`) giữ hình dạng nhưng mở rộng vùng bấm vô hình lên 36×36. (E3) nhãn truy cập cho ô ghi nhanh và ô Loại vốn, trả focus sau khi xóa, báo lỗi JSON dễ hiểu, tour lần đầu tự đóng khi đổi tab.

**Architecture:** Chỉ HTML/CSS/JS giao diện trong `index.html` + test. Không đổi cấu trúc dữ liệu, `APPV`, `VERSION`, CHANGELOG. Không đổi bố cục trên máy tính (chuột, ≥ 900 px). Không push/deploy; commit cục bộ trên nhánh gói (PO đã cho phép).

**Spec:** `docs/review/2026-11-17-fable-giao-dien.md` mục 1–8, `docs/review/2026-11-17-tong-hop.md` E1–E3, `rule.md` §10, §16.

## Điều đã biết (từ review, số dòng gần đúng, hãy xác nhận)
- E1: `div.event-item` (`index.html:~4741`), `timeline-event-block` (`:~4797`), `cd-ev` ở lưới năm (`:~4880`) chỉ có `onclick`. Hộp việc/Dự án/Sức khỏe đã là `<button>`. Quy tắc `:focus-visible { outline: 2px solid var(--ac-text); outline-offset: 2px }` toàn cục đã có (`:~1723`), nên thêm `tabindex` là có viền focus, KHÔNG cần mockup riêng. Popup đã có bẫy focus và Esc trả focus về nút Thêm.
- E2: `.hv-toggle` (`:~687`) bị `min-width/min-height: 24px` (`:~1934`) ghi đè luật cảm ứng 44 px (`:~946`) do thứ tự CSS; `.hl-day` (`:~812`, `:~1935` 24 px), `.day-card-add-btn` (`:~363`, `:~1573`, `:~1755` 28 px) không có luật cảm ứng. Khối cảm ứng hiện là `@media (pointer: coarse)` (`:~1939`) và `(hover: none), (pointer: coarse)`; cửa sổ hẹp không cảm ứng (820 px, chuột) dùng bố cục điện thoại nhưng nút vẫn 24–30 px (mục 8): dùng điều kiện `(pointer: coarse), (max-width: 899px)` cho các luật mới.
- E3: ô ghi nhanh (`:~2105`) không `aria-label`; tab Tôi › Loại vốn: 5 ô màu (`:~5048`), 5 ô tên, 5 ô từ khóa (`:~5085-5088`) không nhãn; `deleteCurrentEvent` (`:~5180`) vẽ lại rồi `closeEditor()` nên focus rơi về `body`; nhập tệp hỏng hiện lỗi thô `"Tệp sao lưu không hợp lệ: " + err.message` (`:~5770`); tour `#onb` (`:~4570-4592`) không đóng khi `switchTab` (`:~3637`).

## Thiết kế
1. **E1:** thêm cho 3 loại phần tử: `tabindex="0" role="button"` và `onkeydown` mở đúng việc `onclick` đang làm khi `Enter` hoặc `Space` (`event.preventDefault()` cho Space để không cuộn), bỏ qua phím khác; thêm `aria-label` ngắn (tên + giờ hoạt động, qua `esc()`). Không đổi `onclick`.
2. **E2 (C):** (a) `.day-card-add-btn { min-height: 36px }` trong `@media (pointer: coarse), (max-width: 899px)` (nút "+" đang là khối rộng hết thẻ); (b) `.hl-day`, `.hv-toggle`: `position: relative` + `::after { content:""; position:absolute; inset: -6px; }` (điều chỉnh để hộp bấm ≥ 36×36, KHÔNG đổi kích thước/bố cục nhìn thấy; kiểm hai nút kề nhau không chạm nhau), trong cùng điều kiện `@media`; (c) sửa thứ tự CSS để luật cảm ứng của `.hv-box .btn-sm, .hv-toggle, .hv-mini, .hv-when, .hv-name { min-height: 44px }` (`:~946`) và `.hv-toggle` không còn bị `:~1934` ghi đè nếu thiết kế ban đầu muốn 44 — nếu thay đổi này làm hộp Hộp việc đổi cao nhìn thấy, DỪNG và báo (không có trong mockup đã duyệt).
3. **E3:** `aria-label="Ghi nhanh"` cho ô ghi nhanh; `aria-label` `Màu ${esc(c.n)}`, `Tên ${esc(c.n)}`, `Từ khóa ${esc(c.n)}` cho 15 ô Loại vốn; trong `closeEditor` (hoặc sau `deleteCurrentEvent`) nếu phần tử đã mở không còn thì `$("addBtn").focus()`; lỗi nhập: `err.name === "SyntaxError"` → "Tệp không phải JSON hợp lệ", còn lại giữ thông điệp hiện có, thêm `console.warn(err)`; đầu `switchTab`: `if (onbIdx >= 0) onbEnd();` (tên biến theo mã).

## Global Constraints
- Không mất dữ liệu; không đổi nghĩa thao tác (Enter/Space làm đúng việc của chuột); không đổi bố cục ở ≥ 900 px chuột (kiểm 1440: kích thước các nút này không đổi).
- Thang chữ 8 bậc và vùng bấm tối thiểu v0.7.1 (rule §10); không thêm cỡ chữ mới.
- Test chạy trong trang với chốt dữ liệu demo, khôi phục DOM/storage; khuôn `e2e-tabhb.js`/`e2e-sw.js`. Ca E2 chỉ có nghĩa ở 375 và 820: chạy ở cả 1440 (kiểm KHÔNG đổi), 820 (chuột, hẹp), 375 (cảm ứng; preset mobile của công cụ là 375×812).
- Cổng lạ 8814 (`python3 -m http.server 8814 --bind 127.0.0.1` từ thư mục worktree, Bash nền, không giấu đầu ra; `preview_start` đọc nhầm cấu hình); kiểm `<title>Life Capital`; cổng 8765 là dự án khác; dùng tab trình duyệt riêng (`tabs_create`, truyền `tabId`).
- Không refactor ngoài phạm vi; không đụng E4 (cỡ chữ px, toast chồng, chữ "…").

## Review Focus
- Enter/Space ở phần tử có `role="button"` không kích hoạt hai lần (onclick + keydown), không chặn Tab/Esc/phím tắt toàn cục (`shortcut()`), không làm bẫy focus của popup lệch.
- Vùng bấm mở rộng vô hình có đè lên nút/vùng bấm khác (ví dụ "Tốt" chen vào nút Thêm hoặc mục hoạt động kề bên) và đổi hành vi bấm không? Ở 375 và 820.
- `aria-label` có tên động qua `esc()`; focus sau xóa đúng nơi; tour đóng không để lại lớp phủ/khóa cuộn; lỗi JSON không lộ thông điệp kỹ thuật thô nhưng vẫn ghi `console.warn`.

### Task 1 (E1 + E3): test đỏ rồi sửa

**Files:** Create `tests/e2e/e2e-a11y.js` (`window.E2EA11Y`) + dòng README + CLAUDE.md; Modify `index.html`.

- [ ] **Step 1: Ca đỏ `A1.*`**: mỗi loại phần tử (tuần, ngày/dòng thời gian, năm): `tabindex="0"`, `role="button"`, `aria-label` không rỗng; `keydown Enter` mở bảng sửa (`ed`/popup mở, đúng hoạt động); `Space` mở và `defaultPrevented`; phím `a`/`Tab` không mở; `click` chuột vẫn mở đúng một lần; Enter không mở hai lần. `A3.*`: ô ghi nhanh có `aria-label="Ghi nhanh"`; 15 ô Loại vốn có `aria-label` đúng tên vốn; xóa hoạt động qua popup rồi `document.activeElement` là `#addBtn` (không phải `body`); nhập tệp "{khong-phai-json" báo "Tệp không phải JSON hợp lệ" (không có chữ `position`/`Unexpected`) và gọi `console.warn`; tệp JSON đúng nhưng sai định dạng giữ thông điệp cũ; tour `#onb` mở rồi `switchTab("su")` đóng được (không còn hộp tour).
- [ ] **Step 2: Chạy, phải ĐỎ.** Ghi số đỏ. **Step 3: Sửa.** **Step 4: xanh lại.**

### Task 2 (E2, hướng C): test đỏ rồi sửa

**Files:** Modify `tests/e2e/e2e-a11y.js` (ca `A2.*`), `index.html` (CSS).

- [ ] **Step 1: Ca đỏ `A2.*`** (chạy ở 375 và 820; ở 1440 các ca này xác nhận KHÔNG đổi): `A2.1` nút "+" của thẻ ngày (`.day-card-add-btn`) cao ≥ 36 và ở 1440 cao như cũ (ghi giá trị hiện tại trước khi sửa và so); `A2.2` `.hl-day` và `.hv-toggle`: tại 4 điểm cách tâm ±17 px (ngang/dọc) bên trong hộp 36×36, `document.elementFromPoint` trả chính phần tử hoặc con của nó (vùng bấm vô hình đạt 36); `A2.3` kích thước nhìn thấy (`getBoundingClientRect` của chính phần tử) KHÔNG đổi so với trước khi sửa (so với hằng ghi từ lần chạy đỏ); `A2.4` hai nút kề nhau trong cùng hàng không chồng vùng bấm: điểm giữa hai nút trả đúng nút gần hơn; `A2.5` không tràn ngang (`scrollWidth <= clientWidth`) ở 375/820; `A2.6` ở 1440 (chuột) `.hl-day`/`.hv-toggle`/`.day-card-add-btn` không có vùng bấm mở rộng (điểm cách tâm 17 px trả phần tử khác).
- [ ] **Step 2: Chạy ở 375 và 820, phải ĐỎ.** **Step 3: Sửa CSS.** **Step 4: xanh ở 375 và 820; 1440 không đổi.**

### Kiểm tra cuối
- [ ] `E2EA11Y` ở 1440/820/375; E2E 95/95, E2EUAT2 71/71, E2EUAT3 63/63, E2EHB 34/34, E2ETABHB 32/32 (34 ở 375), E2EUI 16/16 (375 cũng), E2EUX 124/124, E2EDASH 36/36, E2E61 41/41, E2E63 77/77, E2EHL 85/85, E2EHL2 53/53, merge-tests 35/35, `node --check`. Chụp ảnh trước/sau ở 375 và 820 cho thẻ ngày (nút +, nhãn "Tốt") và Hộp việc (nút thu gọn).
