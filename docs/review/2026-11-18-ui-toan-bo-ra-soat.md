# Rà soát giao diện toàn bộ · 2026-11-18

Nhánh `claude/ui-toan-bo` (tách từ `claude/ui-suc-khoe-2` @ `f659602`). Chỉ đọc/chạy, chưa sửa code.

## Cách đo
- Chrome headless (profile tạm, CDP), máy chủ `127.0.0.1:8840` từ worktree, `localStorage.clear()` + `loadDemo()` trước mỗi ảnh. 63 ảnh: 14 màn (Lịch tuần/ngày/năm, Hộp việc, Dự án, Sức khỏe Tóm tắt/Nhật ký, Thói quen, Tổng quan, Tôi, popup Thêm/Sửa hoạt động, popup thuốc, tour) × 1440×900 và 375×812 (cảm ứng), sáng và tối; 6 màn ở 820×1180. Ảnh nằm ngoài repo (scratchpad của session), tóm tắt bằng lời dưới đây.
- `tests/e2e/uiaudit.js` ở 1440 / 820 / 375. Không tràn ngang ở cả ba khổ. Không chữ < 11 px.
- Trình duyệt giả lập, không phải thiết bị thật.

## Số đo chính (uiaudit)
| Khổ | Cỡ/độ đậm phổ biến | Lệch thang 8 bậc | Nút nhỏ hơn vùng bấm | Chữ bị cắt "…" |
|---|---|---|---|---|
| 1440 | 12/600 (150), 13/400 (120), 12/400, 12/500, 11/400 | 11.05 px (3), 11.9 px (1); độ đậm dùng 5 mức 400/500/600/650/700 | 30 (đa số `.hv-toggle` 24 px và `.hl-day` 24 px, đã có vùng bấm vô hình theo gói 8) | 15 (tên loại vốn trong thẻ hoạt động, sự kiện ở lịch Năm) |
| 820 | như trên | như trên | 115 (nút `.btn-sm` cao 30 px: ◀ ▶, Tuần/Ngày/Năm, Xóa mẫu; khổ chuột nên chưa vi phạm 24 px) | 18 |
| 375 | 11/500 (388, lưới Năm) | như trên | 34: ◀ ▶ rộng 33–34 px; chip lọc Dự án cao 32 px (< 36 px cảm ứng) | 4 |

## Phát hiện, xếp theo tác động / công sức
Ký hiệu: TĐ = tác động (C cao, T trung bình, Th thấp), CS = công sức.

| # | Phát hiện | TĐ | CS | Chỗ |
|---|---|---|---|---|
| 1 | **Không có "màn hôm nay" tạo động lực.** Mở app là lưới tuần dày; không có lời chào, không có tiến độ hôm nay (giờ đã ghi, thói quen đã tích, tâm trạng). Thanh bên desktop trống 2/3 chiều cao. | C | T | thanh bên `index.html:2148`, tiêu đề trang `:2154` |
| 2 | **Thói quen thiếu cảm giác "hoàn thành".** Nút tích luôn hiện ✓ cả khi chưa tích (khó phân biệt trạng thái); không có vòng tiến độ ngày; thẻ cao 220 px nhưng nội dung ít; desktop trống ~75% màn; hai nút "Thêm" và "Thêm thói quen" trùng nhau; "0/1 đã tích" khi có 2 thói quen (thói quen tự đếm không tính) gây khó hiểu. Tối: thẻ màu ô-liu nâu đục. | C | T | `index.html:9445-9479` |
| 3 | **Đầu trang nặng và lặp.** Mọi tab có nút "Thêm" hồng đổ bóng; Lịch thêm "Tổng kết" màu ô-liu (hai màu nút chính cạnh nhau). Mobile: nút "Thêm" chiếm góc phải trong khi ô Ghi nhanh cố định đáy cũng là lối thêm. | C | Th | `index.html:2164-2165` |
| 4 | **Lịch mobile: nội dung đầu tiên xuất hiện quá thấp.** Trước thẻ ngày đầu là: dải "Dữ liệu mẫu" + Xóa mẫu (2 dòng), điều hướng tuần, Tuần/Ngày/Năm (một hàng riêng), tiêu đề "Giờ theo loại vốn" + 5 ô (2 hàng). Thẻ ngày đầu ở y≈450/812. Ô Ghi nhanh + thông báo nổi + thanh tab che ~130 px đáy. | C | T | `index.html:4856`, `:4873-4877`, `:3616` |
| 5 | **Độ rộng nội dung không nhất quán giữa các tab (desktop).** Lịch, Sức khỏe, Tổng quan rộng hết; Hộp việc, Dự án, Tôi khóa 980 px giữa màn, nhưng ô Ghi nhanh phía trên vẫn rộng hết nên lệch mép trái (274 px so với 359 px). | T | Th | `index.html:1262`, `:1950` |
| 6 | **Sức khỏe › Tóm tắt desktop:** 5 nút tâm trạng giãn mỗi nút ~215 px (đường bấm dài, nhìn trống); thẻ "Điểm nổi bật" là danh sách văn bản dài, thiếu thứ bậc. Mobile: tâm trạng xếp dọc 5 hàng chiếm nửa màn. | T | Th | phần Tóm tắt gần `index.html:10079` |
| 7 | **Lưới tuần desktop 4 + 3 cột, ô thứ 8 trống**, cột Hộp việc chen bên phải làm thẻ ngày hẹp, tên loại vốn bị cắt "Tài chính / công v…". | T | T | `index.html:7531` |
| 8 | **Dự án:** chỉ 1 dự án nhưng thanh lọc 2 nhóm chip (Nhóm theo + loại vốn) — nhiều điều khiển cho ít nội dung; chip lọc mobile cao 32 px (< 36). | T | Th | `index.html:8773` vùng danh sách dự án |
| 9 | **Hệ nút không thống nhất:** `.btn-primary` hồng có bóng ở đầu trang, `.btn-sm` trắng ở thẻ, "Xếp tất cả" hồng đậm, "Xếp hết" trắng, "Sửa" chữ trơn; 5 độ đậm chữ (400/500/600/650/700). | T | T | CSS nhiều lớp `index.html:965-2110` |
| 10 | **Tổng quan:** tốt nhất trong các tab (ô số, biểu đồ). Nhãn bánh xe radar nhỏ, vòng "Điểm cân bằng" là cung không có nền vòng (khó đọc 67%). Mobile: hai hàng ô số chiếm hết màn đầu. | Th | Th | Tổng quan dashboard |
| 11 | **Tôi:** form dài một cột; nhãn trái – ô phải ở desktop tốt, nhưng thẻ "Thẻ y tế khẩn cấp" đổi sang nhãn trên – ô dưới (không nhất quán). Mobile: mục đầu là thẻ "Mở Tổng quan" riêng, chưa có tóm tắt người dùng. | Th | Th | `index.html:1950` |
| 12 | **Popup Thêm hoạt động:** ổn; mobile dài (hơn 1 màn), nút Lưu/Hủy cố định đáy tốt. Ô "Gợi ý" chiếm 2 hàng. Popup thuốc ổn. Tour: thẻ hướng dẫn bị thông báo nổi che một phần ở mobile. | Th | Th | `openEditor` `index.html:5313` |
| 13 | Nhỏ: cỡ 11.05 px và 11.9 px lệch thang; độ đậm 650; mũi tên ◀ ▶ dạng ký tự; lịch Năm mobile 11/500 dày đặc nhưng đọc được. | Th | Th | — |

## Tham khảo mô thức (chỉ ý tưởng bố cục, không sao chép tài sản)
- **Sunsama / Things (Hôm nay):** mở app vào "Hôm nay" với lời chào và danh sách ngắn; tuần là màn phụ. Chữ đen trên nền gần trắng, rất ít viền, nhấn bằng một màu.
- **Apple Fitness / Streaks:** vòng tiến độ đồng tâm hoặc vòng cho từng thói quen; con số lớn, nhãn nhỏ; "đóng vòng" là phần thưởng thị giác.
- **Habitify / TickTick:** danh sách thói quen dạng hàng (không thẻ to), ô tích tròn bên phải, chuỗi ngày dạng 7 chấm; tiến độ ngày ở đầu.
- **Structured / Notion Calendar:** dòng thời gian dọc với khối màu theo loại; điều khiển tuần gọn trong một hàng (◀ Tuần ▶ · Tuần/Ngày/Năm).

## Đề xuất hướng xử lý (để PO chọn ở bước 3 mockup)
Ba hướng tổng thể sẽ được trình kèm mockup: A "Hôm nay trước" (thêm màn/khối Hôm nay với vòng tiến độ), B "Tinh gọn kiểu Things" (bỏ kính mờ nặng, nền phẳng, một màu nhấn), C "Bảng điều khiển" (thanh bên giàu thông tin, ô số lớn). Mọi hướng đều sửa #3, #4, #5, #8, #9, #13 vì đó là lỗi nhất quán.

## Quyết định PO (2026-11-18)
PO chọn **hướng A "Hôm nay trước"** (AskUserQuestion, sau khi xem 3 mockup A/B/C ở 1440 và 390 cho tab Lịch và Thói quen). Plan: `docs/superpowers/plans/2026-11-18-ui-toan-bo.md`.

## Review sau khi làm (Sonnet, khác model implementer Opus; chỉ đọc)
Không có Critical. Đã sửa: (I1) thói quen đang thiếu mất dấu hiệu trên điện thoại → giữ dòng "tuần này thiếu N lần" màu cảnh báo và vạch màu cảnh báo; (I2) tắt module Sức khỏe làm ô Tiếp theo lệch cột → luôn ở cột cuối; (I3) vòng chưa tích nhạt → nét pha màu chữ; (M5) 0 thói quen thì ô rơi về điểm cân bằng; (M6) tâm trạng lạ không hiện "undefined"; (M7) dấu "+" của nút Thêm không bị trình đọc màn hình đọc; (M8) ô Tuần này ẩn khi chưa có dữ liệu tuần; thêm ca B7b (khối Hôm nay không có nút tích). Chưa sửa: (M9) `.demo-line .btn` dùng `!important` 28 px và vùng bấm 36 px nhờ `::after` (ổn hiện tại); (M10) hằng số chiều rộng E2EA11Y đo theo bố cục (đã ±1,5 px).
