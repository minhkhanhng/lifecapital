# Bài học (mới nhất ở trên)

## 2026-11-17 · Khi chạy đỏ cho test bảo mật, đừng dùng tên miền thật làm mồi
- Lỗi: ca thăm dò CSP dùng `cdn.jsdelivr.net/npm/csp-probe...`, nên ở pha đỏ (chưa có CSP) và khi chạy nhầm trên máy chủ không CSP, trình duyệt gửi GET thật ra Internet.
- Nguyên nhân: chọn host thật cho dễ đọc; plan không nói rõ.
- Cách tránh: mồi chặn dùng tên miền `.invalid` (không bao giờ ra mạng); test CSP chỉ chạy dưới máy chủ cục bộ gắn header; kiểm tĩnh `vercel.json` bằng Node trước.

## 2026-11-17 · Kiểm khi đo: số đo của implementer có thể là nhiễu
- Lỗi: Opus báo `save()` nhanh hơn (165 → 139 ms) nhưng tôi đo lại thì 165,5 ms, không đổi.
- Nguyên nhân: một lần đo mỗi lần chạy trên trang có nhiễu; gói không đụng đường `save()`.
- Cách tránh: tự đo lại số quan trọng trước khi ghi vào CURRENT; chỉ ghi mức giảm khi cơ chế giải thích được; ghi rõ "một lần đo, Chrome pane, không phải điện thoại".

## 2026-11-17 · Phép đo tìm ra lỗ hổng mà review và test không thấy
- Lỗi: đo SW thật cho thấy `net?` trả kết quả cũ tới 30 s nên nhãn "Bản đã lưu" sai khi mạng đứt giữa phiên; review chỉ ra mọi điều hướng đều nhận `index.html` và phản hồi redirect có thể vào cache.
- Nguyên nhân: test giả lập Node không chạy trình duyệt thật; plan giả định "30 s là đủ mới".
- Cách tránh: với service worker luôn đo bằng Chrome headless thật (profile riêng) cả trước và sau; viết ca cho đường "mạng vừa đổi", "đường dẫn khác `/`", "phản hồi lạ"; không sửa `sw.js` khi agent khác đang đo từ cùng worktree.

## 2026-11-17 · Plan viết sai hình dạng dữ liệu và ca test xanh giả
- Lỗi: plan gói 4 giả định `bl` là số (`bl{sk:1}`) nhưng thật là `{u,d}`; ca M5.6 ban đầu dùng chung một đối tượng cho cả hai bên nên không kiểm được "hai máy cấp `gi` khác nhau".
- Nguyên nhân: viết plan từ báo cáo review mà chưa đọc `cleanState`; test dựng dữ liệu từ cùng một biến.
- Cách tránh: trước khi viết ca test gộp, đọc hình dạng thật sau `cleanState`; mỗi ca "hai máy" phải dựng hai bản độc lập có giá trị khác nhau; `mergeMap` bỏ `0`/`false` nên không dùng cho giá trị vô hướng.

## 2026-11-17 · `preview_start` đọc nhầm cấu hình của thư mục chính
- Lỗi: trong worktree, `preview_start` báo lỗi đường dẫn `.../scratchpad/site` dù worktree có `.claude/launch.json` riêng.
- Nguyên nhân: công cụ dùng cấu hình `launch.json` của thư mục chính, không phải của worktree.
- Cách tránh: chạy `python3 -m http.server <cổng lạ> --bind 127.0.0.1` từ thư mục worktree bằng Bash nền (không giấu đầu ra), kiểm `<title>Life Capital` bằng `curl`, rồi `navigate`; dừng máy chủ do mình chạy khi xong.

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
