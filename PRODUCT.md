# PRODUCT · Life Capital

Nguồn: README.md (v0.7.1). **Mọi mục tiêu từng tab dưới đây là bản nháp từ README, chưa PO xác nhận** (PO chọn cách này ngày 2026-11-17).

## Sản phẩm
PWA cá nhân giúp chia quỹ 168 giờ mỗi tuần cho 5 loại vốn cuộc sống và giữ cân bằng. Mọi hoạt động đều là đầu tư vào một loại vốn; câu hỏi chính là "bánh xe 5 loại vốn tuần này có cân bằng không".

## Người dùng
Chủ dự án (một người) là người dùng thật duy nhất hiện nay (xác nhận 2026-11-17). Ưu tiên iPhone (cài vào Màn hình chính) và máy tính; dữ liệu nằm trên máy, đồng bộ Supabase tùy chọn.

## 5 loại vốn
Sức khỏe, Quan hệ, Trải nghiệm, Kỹ năng, Tài chính/Công việc. Điểm cân bằng = 60% trung bình % đạt mục tiêu + 40% vốn thấp nhất; chỉ tính vốn đã đặt mục tiêu.

## Mục tiêu từng tab (chưa PO xác nhận)
| Tab | Mục tiêu |
|---|---|
| Lịch biểu | Ghi nhanh hoạt động bằng ngôn ngữ tự nhiên; xem Tuần/Ngày/Năm; thấy ngay giờ theo loại vốn, thói quen; đẩy một chiều sang Google Calendar |
| Hộp việc | Giữ việc mơ hồ chưa có giờ, chia việc nhỏ, xếp lịch thông minh (Xếp hết / Xếp tất cả), nhờ AI rà soát (tùy chọn) |
| Dự án | Gom hoạt động và việc theo dự án kiểu Asana: danh sách, bảng, timeline, trạng thái |
| Sức khỏe | Ghi tâm trạng, giấc ngủ, triệu chứng, thuốc, chu kỳ; gợi ý theo quy tắc cố định (không AI) |
| Tổng quan | Dashboard tuần: giờ so với mục tiêu, xu hướng 8 tuần, bánh xe, thói quen |
| Tôi | Hồ sơ, Danh mục vốn (mục tiêu, từ khóa nhận diện), Cài đặt, dữ liệu và sao lưu |

## Nguyên tắc sản phẩm (từ README, đã thấy trong code/test)
- Chưa đặt mục tiêu thì không chấm điểm hay đưa khuyến nghị dựa trên số giả định.
- AI chỉ là phần thêm; không có AI mọi thứ khác vẫn chạy.
- Dữ liệu sức khỏe không bao giờ gửi sang Google Calendar.
- Dữ liệu mẫu tách khỏi dữ liệu thật và xóa được một chạm.
- Giao diện: thang chữ 8 bậc, vùng bấm tối thiểu 24px (36px cảm ứng), chữ đạt WCAG AA.
- Đau nhất hiện nay (PO, 2026-11-17): chậm / nặng.
