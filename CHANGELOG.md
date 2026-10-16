# Ghi chú phát hành Life Capital

Địa chỉ: https://lifecapital.vercel.app · Dữ liệu nằm trong trình duyệt của từng máy; cập nhật phiên bản không xóa dữ liệu.

## v0.3.0 · Giao diện kính · 16/10/2026

Giao diện mới, cách dùng gần như giữ nguyên. Dữ liệu cũ dùng tiếp, không cần làm gì.

**Mới**
- Giao diện kính mờ, giữ bảng màu cũ; chế độ sáng và tối đều dễ đọc.
- Chọn ảnh nền riêng và độ mờ của kính (Cài đặt → Giao diện). Ảnh chỉ lưu trên máy đó.
- Trên điện thoại: thanh tab Lịch · Hộp việc · Tổng quan · Vốn ở đáy màn hình; ô Ghi nhanh luôn nằm ngay trên thanh tab và bám theo bàn phím.
- Xóa có nút **Hoàn tác** trong 6 giây (máy tính: ⌘Z / Ctrl+Z). Lệnh xóa trên Google Calendar chờ hết 6 giây mới gửi.
- Chế độ Ngày: vuốt ngang để sang ngày trước hoặc sau.
- Chế độ Năm trên điện thoại: bản đồ nhiệt theo quý, chạm một ngày để mở ngày đó.
- Phím tắt trên máy tính: `/` ghi nhanh, `N` thêm, `T` hôm nay, `←` `→` đổi ngày hoặc tuần, `1`–`4` đổi tab, `?` xem tất cả.
- Hướng dẫn 3 bước cho người mới mở app lần đầu.
- Cài đặt chia thành mục, nhớ mục đang mở; thêm tùy chọn **Giảm hiệu ứng** cho máy yếu.

**Thay đổi**
- Chữ trong app viết lại ngắn gọn hơn.
- Hộp xác nhận của trình duyệt thay bằng hộp thoại trong app, nêu rõ từng lựa chọn (vd “Xóa cả trên lịch” / “Giữ trên lịch”).
- Header chỉ hiện nút có tác dụng ở tab đang mở; trên Lịch chỉ hiện một thông báo quan trọng nhất.
- Lưới tuần tự chọn 7, 4 hoặc 2 cột theo chỗ trống.

**Sửa lỗi**
- Lưới tuần bị ép 4 cột trên điện thoại khi bật cột Hộp việc.
- Kéo thanh độ mờ vẫn hiện thanh cuộn.
- Nhãn 06:00 ở chế độ Ngày bị cắt; tên loại vốn dài bị gãy dòng.

**Ghi chú quy trình:** lên production theo quyết định của chủ dự án, chưa qua UAT trên staging; hậu kiểm làm bù trên production.

## v0.2.0 · Hộp việc chờ · 15/10/2026

- Tab **Hộp việc**: ghi việc chưa có giờ, chia thành việc nhỏ có thời lượng, đổi thứ tự, đánh dấu xong.
- Kéo việc nhỏ hoặc cả việc vào lịch trên máy tính; trên iPhone chạm “Xếp lịch” và chọn khung trống.
- Gõ `+ tên việc` ở ô Ghi nhanh để cất vào hộp.
- Xóa hoạt động xếp từ hộp thì việc nhỏ quay lại hộp.
- Gồm cả bản vá v0.1.1.

## v0.1.1 · Hotfix mất dữ liệu · 13/10/2026

- Không còn mất dữ liệu khi mở app ở nhiều tab, hoặc khi một tab bản cũ còn mở: dữ liệu được gộp khi lưu thay vì ghi đè.
- Tự lưu một bản sao mỗi ngày (giữ 7 ngày), khôi phục được trong Cài đặt → Dữ liệu.

## v0.1.0 · Hotfix · 12/10/2026

- Sửa các lỗi dữ liệu, đồng bộ Google Calendar (thêm, xóa một buổi, xóa chuỗi), gõ tiếng Việt và hiển thị.
- Phiên bản đầu tiên đi qua quy trình UAT và staging.
