# Bài học (mới nhất ở trên)

## 2026-11-17 · Ngưỡng `.slice` "phòng thủ" trong `cleanState` cắt dữ liệu thật
- Lỗi: việc >500, dự án >200, thói quen >100, ticks >1000, thuốc >100, triệu chứng >50, lệnh xóa Google >500 bị cắt âm thầm mỗi lần mở app và lần lưu kế tiếp ghi đè mất vĩnh viễn.
- Nguyên nhân: giới hạn đặt để chặn tệp độc hại nhưng `cleanState` cũng chạy trên dữ liệu thật của người dùng khi tải, gộp, đồng bộ.
- Cách tránh: không cắt dữ liệu người dùng; chỉ dùng một trần an toàn rất lớn (`SANE_MAX`); test ở biên (đúng ngưỡng, vượt ngưỡng, vòng JSON hai lần).

## 2026-11-17 · Pane trình duyệt tích hợp không đăng ký được service worker
- Lỗi: ở `http://localhost:8792` pane báo "unknown error fetching the script" nên không đo được SW.
- Nguyên nhân: pane hạn chế đăng ký SW; Claude in Chrome không kết nối.
- Cách tránh: đo SW bằng Chrome headless profile riêng (CDP) rồi dọn profile; không kết luận SW từ 127.0.0.1.

## 2026-11-17 · Mở nhầm trang của dự án khác trên cổng 8765
- Lỗi: tôi chạy máy chủ xem thử Life Capital ở cổng 8765, nhưng cổng đã bị dự án Career OS (thư mục `~/Desktop/Career OS`) chiếm. Tôi giấu đầu ra và chỉ kiểm `curl` ra 200, nên trình duyệt mở trang Career OS; tôi còn chạy `localStorage.clear()` trên trang đó (xóa localStorage của origin 127.0.0.1:8765 trong khung Browser).
- Nguyên nhân: không kiểm tiêu đề/nguồn của trang; ẩn lỗi bind cổng.
- Cách tránh: dùng cổng lạ (8790); kiểm `curl -s URL | grep "<title>Life Capital"` và `lsof -iTCP:<cổng> -sTCP:LISTEN` trước; trong trình duyệt kiểm `document.title === "Life Capital"` rồi mới `localStorage.clear()`; không giấu đầu ra khi chạy máy chủ; không kill tiến trình của dự án khác.

## 2026-11-17 · Test e2e "A4 cột trái" đỏ khi cửa sổ hẹp
- Lỗi: bộ E2E (e2e6.js) báo 94/95, ca "A4 cột trái hiện ở màn rộng" đỏ.
- Nguyên nhân: khung trình duyệt chỉ rộng 575px; test yêu cầu ≥ 1400px (tests/e2e/README.md). Đặt lại 1440×900 và chạy lại riêng thì 95/95.
- Cách tránh: `resize_window` 1440×900 SAU mỗi `navigate` và kiểm `innerWidth` trước khi chạy e2e; ca đỏ chạy lại riêng trước khi kết luận.
