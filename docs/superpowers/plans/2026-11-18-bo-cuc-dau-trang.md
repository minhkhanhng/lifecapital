# Plan · Bố cục đầu trang tab Lịch (Phương án A) · 2026-11-18

Nhánh `claude/bo-cuc-dau-trang` (worktree `.claude/worktrees/bo-cuc-dau-trang`), tách từ `main` @ `8b0396c` (v0.9.4).
PO chọn **Phương án A (Linear / Sunsama)**:
1. Gộp khối Hôm nay (`.today-hero`) và hàng Lúc này (`#now3`) vào chung **MỘT thẻ Card duy nhất** (`.today-box.card`).
2. Tinh gọn thanh điều hướng tuần (`.wk-bar`) thành toolbar phẳng, liền mạch với hệ thống điều khiển.
3. Chuẩn hóa khoảng cách dàn ngang (horizontal gap) và khoảng cách dọc (vertical rhythm) theo hệ 8pt Grid (`8px`, `12px`, `16px`, `20px`), giải quyết triệt để lỗi "xếp tầng dính lại".

Phạm vi: CSS, cấu trúc bọc HTML mẫu tab Lịch trong JS, kiểm tra responsive 1440 và 390. Không đổi dữ liệu, cấu trúc lưu trữ, SW, đồng bộ, CSP.

---

## 1. Phân tích chi tiết thiết kế

### 1.1. Thẻ Hôm nay hợp nhất (`.today-box.card`)
- Bọc `.today-hero` (phần trên: lời chào + 3 vòng tròn chỉ số) và `#now3` (phần dưới: 3 ô Đang làm / Tiếp theo / Nổi bật nhất) trong cùng một khung `.today-box.card`:
  - Khung ngoài: Nền kính mờ (`var(--sf-2)`), bo góc `20px`, đệm trong `12px 14px`, bóng đổ nhẹ.
  - Phần trên (`.today-hero`): Bỏ nền riêng, bỏ bóng riêng, cao gọn gàng.
  - Đường phân cách: Đường hairline mỏng (`1px solid var(--line-2, rgba(0,0,0,0.06))`) với khoảng cách `gap: 8px` / `margin-top: 8px`.
  - Phần dưới (`#now3`): 3 ô `n3-c` sử dụng nền `var(--th-fill)` tạo chiều sâu thị giác.
- Tương thích test:
  - `document.querySelector("#v .today-hero")` vẫn tồn tại và độc lập với `#now3` (`hero.contains(n3)` là `false`).
  - `#now3` nằm ngay dưới `.today-hero` trong DOM (`R(row).top >= R(hero).bottom - 1`).

### 1.2. Toolbar tuần tinh gọn (`.wk-bar`)
- Bỏ nền card trắng thô ráp của `.wk-bar`, chuyển thành toolbar phẳng thanh mảnh (`background: transparent; box-shadow: none; padding: 0 4px`).
- Trên Desktop (≥ 900px):
  - Nhóm điều hướng tuần (◀ Tuần 47 · 16/11–22/11/2026 ▶) căn trái, các nút ◀ ▶ đệm `6px`, nhãn tuần font 13px/600.
  - Nhóm chế độ (Tuần / Ngày / Năm) và nút Nhập GCal căn phải, nút gọn gàng với `gap: 8px`.
  - Chiều cao toolbar chỉ ~32px, tạo khoảng chuyển tiếp tự nhiên xuống Lưới 7 cột ngày.

### 1.3. Hệ khoảng cách chuẩn (8pt Grid & Gestalt Proximity)
- **Khoảng cách dọc (Vertical Rhythm)**:
  - Header (`.app-header`) ➔ Thẻ Hôm nay (`.today-box`): **16px** (trước là 10px).
  - Thẻ Hôm nay ➔ Toolbar tuần (`.wk-bar`): **16px** (trước là 10px).
  - Toolbar tuần ➔ Lưới 7 cột ngày (`.week-cards-grid`): **10px** (gắn kết trực tiếp).
- **Khoảng cách ngang (Horizontal Rhythm)**:
  - Header: Khoảng cách giữa các khối chức năng là `16px`.
  - Thẻ Hôm nay: Giữa lời chào và cụm 3 vòng tiến độ là `12px`; giữa 3 ô Lúc này là `8px`.
  - Toolbar tuần: Mũi tên và nhãn cách nhau `6px`; giữa bộ chọn và nút GCal là `8px`.

---

## 2. Các bước thực hiện (TDD)

1. **Kiểm tra hiện trạng test**:
   Chạy `E2EUIALL` và `E2ESTAR` trên bản gốc để xác nhận số ca đạt trước khi sửa.
2. **Cập nhật cấu trúc HTML & CSS trong `index.html`**:
   - Thêm container `.today-box` trong `calHTML()`.
   - Cập nhật CSS cho `.today-box`, `.today-hero`, `#now3`, và `.wk-bar`.
   - Cập nhật các quy tắc spacing dọc và ngang trong media query `min-width: 900px` và `max-width: 899px`.
3. **Chạy kiểm thử hồi quy**:
   - `E2ESTAR` (kiểm tra sao và hàng Lúc này).
   - `E2EUIALL` (kiểm tra thang chữ, không tràn ngang, khối Hôm nay).
   - `E2E` (95 ca cốt lõi).
   - `node tests/sw/test_sw.js` & `node tests/csp/test_csp.js`.
   - Đo giao diện ở 1440px (desktop) và 390px (mobile).
