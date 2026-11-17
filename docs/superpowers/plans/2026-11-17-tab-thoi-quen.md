# Gói tab-thoi-quen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** Tách phần thói quen khỏi tab Lịch thành MỘT tab riêng "Thói quen". Lịch chỉ còn lịch và "Giờ theo loại vốn". Mọi thứ về thói quen (tích hôm nay, thêm/sửa/lưu trữ/xóa, chấm tuần, chuỗi ngày, gợi ý, đã lưu trữ) nằm ở tab mới.

**Architecture:** Không đổi cấu trúc dữ liệu `S.habits` (`rule.md` §11), `APPV`, `VERSION`, CHANGELOG. Một tab mới `hb` trong `TABS`, bật/tắt theo module `hb` sẵn có (`modOn("hb")`). Một tệp test mới `tests/e2e/e2e-tabhb.js` (`window.E2ETABHB`).

## Thiết kế PO đã chọn
- **Bố cục C "tập trung hôm nay":** đầu tab ghi "Hôm nay · thứ, ngày · n/m đã tích" và nút "Thêm thói quen"; dưới là lưới thẻ thói quen (nút tích to, tên, chuỗi, 7 chấm tuần, "Tuần này x/y", nút Sửa); hộp gợi ý; mục "Xem đã lưu trữ"; trạng thái rỗng.
- **Điều hướng N2:** trên desktop tab "Thói quen" nằm ngay sau "Sức khỏe" ở thanh trái (7 tab). Trên mobile (≤899px) tab "Tổng quan" ẩn khỏi thanh dưới để còn 6 tab; đường vào Tổng quan là thẻ "Mở Tổng quan" ở đầu tab Tôi (`.me-su`, chỉ hiện ≤899px). PO đã xác nhận chấp nhận điểm này.

## Thay đổi chính (`index.html`)
- `TABS`, `ICO.hb`, `tabsOn` (lọc `hb` theo `modOn`), mô tả module `hb`, `renderNav` thêm `data-tab`.
- `weekStatsHTML` chỉ còn `capSumHTML` (bỏ thanh thói quen khỏi Lịch). `hbStripHTML` thay bằng `hbTabHTML`; `hbManageHTML` bỏ khỏi tab Vốn/Tôi.
- `V.hb`, `headerAdd` (nút Thêm ở tab hb mở `hbOpen()`), phím tắt `1–7`, nút "Quản lý" ở dashboard chuyển tới tab hb.
- CSS `.hbt*`, `.me-su`, ẩn `#reviewBtn` và ô ghi nhanh ở tab hb, ẩn tab Tổng quan ở ≤899px.
- Còn lại: CSS cũ `.hb-strip`, `.hb-chip` không dùng nữa, để nguyên cho gọn diff.

## Test (đỏ trước, rồi xanh)
- [x] Viết `e2e-tabhb.js` (32 ca: điều hướng, Lịch sạch, thẻ, tích, thêm/sửa/lưu trữ/xóa, liên kết, tắt/bật module, kích thước, khôi phục) và commit bản đỏ.
- [x] Cài đặt đến khi `E2ETABHB` 32/32 ở 1440 và 34/34 ở 390.
- [x] Sửa test cũ CHỈ ở chỗ kiểm vị trí cũ, không nới ý nghĩa: `e2e-hb.js` (`.hb-chip`→`.hbt-card`, vào tab hb), `e2e-uat2.js` (như trên, I1.2/I2.1 sang tab Lịch/hb, I5.5 đọc tab hb), `e2e-uat3.js` L1.3 (Tôi không còn thẻ quản lý thói quen; thêm L1.3b kiểm tab hb), `e2e-v063.js` M7.1 (đủ 7 tab).

## Lệnh test
Server riêng: `python3 -m http.server 8804 --bind 127.0.0.1` ở thư mục worktree. Mỗi bộ trên trang mới tải, cửa sổ 1440×900:
```js
localStorage.clear(); localStorage.setItem("lc_onb","1"); location.reload();
// sau khi tải lại:
await new Promise(r => { const s = document.createElement("script"); s.src = "/tests/e2e/runner.js"; s.onload = r; document.head.appendChild(s); });
loadDemo();
await __run("tests/e2e/e2e-tabhb.js", "E2ETABHB");
```
Các bộ cần xanh: E2ETABHB 32/32, E2EHB 34/34, E2E 95/95, E2EUAT2 71/71, E2EUAT3 63/63, E2EDASH 36/36, E2EUX 124/124, E2E61 41/41, E2E63 77/77, `tests/merge-tests.html` 35/35, `node --check` trên script đã tách. E2ETABHB chạy thêm ở 390×844.

## Ngoài phạm vi
Nhớ tab đang mở khi mở lại app (hiện chưa có khóa nhớ tab nào), dọn CSS cũ, đổi `APPV`/`VERSION`/CHANGELOG, push/deploy.
