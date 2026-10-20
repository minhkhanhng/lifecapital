# Dọn CSS không đổi giao diện

Dùng ở v0.6.2 để dọn khối `<style>` của `index.html`. Nguyên tắc: chỉ xóa thứ chứng minh được là không có tác dụng, rồi chụp so sánh kiểu hiển thị trước/sau, phải trùng 100%.

## Dọn

```bash
python3 tests/css/cssclean.py index.html index.clean.html longhands.json --merge-root
```

- Xóa khai báo bị đè bởi khai báo sau có **cùng bộ chọn**, cùng điều kiện `@media` (hoặc không điều kiện), phủ hết các thuộc tính con (xét `!important`). Khai báo lặp trong cùng một khối giữ nguyên (dự phòng trình duyệt cũ).
- Xóa bộ chọn trỏ tới class/id không còn ở đâu ngoài CSS (class kết thúc bằng số luôn giữ vì hay ghép động: `"m" + v`).
- Xóa biến `--x` không còn `var(--x)` ở đâu.
- `--merge-root`: gom các khối `:root…` cùng bộ chọn, cùng điều kiện về một khối.

`longhands.json`: bảng thuộc tính viết gọn → thuộc tính con, lấy từ trình duyệt (đặt `el.style.setProperty(p, "initial")` rồi đọc `[...el.style]`).

## Chụp và so sánh

1. `python3 tests/css/snapsrv.py <thư mục lưu>` (cổng 8799, nhận ảnh chụp).
2. Mở app ở http://localhost:8765/, Console: tải `/tests/css/snap.js`, chạy `__snapPrep()` rồi `await __runStates("base-1400", [["sys"], ["light"], ["dark"], ["light", 1], ["dark", 1]])`.
3. Thay `index.html` bằng bản dọn, tải lại, chụp tên khác (vd `new-1400`), rồi `python3 tests/css/cmp.py base-1400-dark.json new-1400-dark.json`.
4. Lặp ở khổ 375 (điện thoại) và 820, chế độ tối của hệ thống. Kết quả phải là `TỔNG KHÁC: 0`.

Ảnh chụp ghi ~100 thuộc tính đã tính (cả `::before`, `::after`) và kích thước của mọi phần tử trên 35 màn hình và popup; dữ liệu được đặt lại trước mỗi lượt để kết quả ổn định.
