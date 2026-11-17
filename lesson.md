# Bài học (mới nhất ở trên)

## 2026-11-17 · Mở nhầm trang của dự án khác trên cổng 8765
- Lỗi: tôi chạy máy chủ xem thử Life Capital ở cổng 8765, nhưng cổng đã bị dự án Career OS (thư mục `~/Desktop/Career OS`) chiếm. Tôi giấu đầu ra và chỉ kiểm `curl` ra 200, nên trình duyệt mở trang Career OS; tôi còn chạy `localStorage.clear()` trên trang đó (xóa localStorage của origin 127.0.0.1:8765 trong khung Browser).
- Nguyên nhân: không kiểm tiêu đề/nguồn của trang; ẩn lỗi bind cổng.
- Cách tránh: dùng cổng lạ (8790); kiểm `curl -s URL | grep "<title>Life Capital"` và `lsof -iTCP:<cổng> -sTCP:LISTEN` trước; trong trình duyệt kiểm `document.title === "Life Capital"` rồi mới `localStorage.clear()`; không giấu đầu ra khi chạy máy chủ; không kill tiến trình của dự án khác.

## 2026-11-17 · Test e2e "A4 cột trái" đỏ khi cửa sổ hẹp
- Lỗi: bộ E2E (e2e6.js) báo 94/95, ca "A4 cột trái hiện ở màn rộng" đỏ.
- Nguyên nhân: khung trình duyệt chỉ rộng 575px; test yêu cầu ≥ 1400px (tests/e2e/README.md). Đặt lại 1440×900 và chạy lại riêng thì 95/95.
- Cách tránh: `resize_window` 1440×900 SAU mỗi `navigate` và kiểm `innerWidth` trước khi chạy e2e; ca đỏ chạy lại riêng trước khi kết luận.
