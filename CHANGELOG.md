# Ghi chú phát hành Life Capital

Địa chỉ: https://lifecapital.vercel.app · Dữ liệu nằm trong trình duyệt của từng máy; cập nhật phiên bản không xóa dữ liệu.

## v0.4.0 · Đồng bộ và cài app · 16/10/2026

Đăng nhập Google để dùng chung dữ liệu giữa iPhone và máy tính. Không đăng nhập thì app chạy như trước.

**Mới**
- Đăng nhập bằng Google (Cài đặt → Đồng bộ). Lần đầu đăng nhập, dữ liệu trên máy được cộng vào tài khoản, không mất gì; app tự lưu một bản trên máy trước khi gộp.
- Đồng bộ tự động: thay đổi trên máy này hiện ở máy kia trong vài giây. Mất mạng vẫn dùng bình thường, có mạng lại tự gửi.
- Hai máy cùng sửa một hoạt động: bản sửa sau cùng được giữ. Một máy xóa, máy kia sửa: giữ bản đã sửa.
- Huy hiệu trạng thái trên thanh tiêu đề: đã đồng bộ, đang chờ (kèm số thay đổi), ngoại tuyến, cần đăng nhập lại.
- Cài thành app trên máy tính (Chrome, Edge) và iPhone (Thêm vào MH chính); mở được khi mất mạng; báo “Có bản mới” khi có bản cập nhật.
- Đăng xuất: chọn giữ hoặc xóa dữ liệu trên máy. Xóa hẳn tài khoản và dữ liệu trên máy chủ trong Cài đặt.

**Thay đổi**
- Trên điện thoại, Cài đặt chuyển xuống thanh tab dưới đáy; số liệu tuần gọn thành một hàng.
- Thanh kéo độ mờ nền dễ kéo hơn trên iPhone.
- Hai máy cùng đẩy lên Google Calendar không tạo sự kiện trùng.

**Ghi chú quy trình:** lên production theo yêu cầu chủ dự án trong lúc UAT trên staging chưa xong; UAT tiếp tục như hậu kiểm. Màn hình đăng nhập Google còn hiện tên miền supabase.co (sẽ sửa trước khi mời người quen).

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
