# Rà soát UI tab Sức khỏe (2026-11-17, chỉ đọc/đo, chưa sửa code)
Nhánh `claude/ui-suc-khoe` (từ `claude/sw-mo-nhanh`). Đo bằng pane trình duyệt, máy chủ cổng 8800, dữ liệu `loadDemo()`. Ảnh: `docs/review/ui-suc-khoe/`.
Số đo ở 1440 (cảm ứng: không), 820 (không), 390 (cảm ứng: có). Sáng và tối đều có.

## Critical
Không có (không tràn ngang ở cả ba khổ; không vùng bấm < 24px; Esc đóng được popup).

## Important (popup Thêm thuốc/TPCN, `hlMedRender` index.html:10072)
| # | Lỗi | Bằng chứng | Nguyên nhân |
|---|---|---|---|
| I1 | Nhãn dính ô phía trên, các nhóm trường không có khoảng cách | 1440: nhóm Tên y=273 cao 60, nhóm Loại y=333 (cách đúng 60 = nhãn 17 + 6 + ô 37, khoảng giữa nhóm = 0). Cả 390 và tối | `.hl-sheet{display:flex;column}` (index.html:821) không có `gap`; `.form-group` (615) chỉ có gap 6 bên trong |
| I2 | Nhãn "Kết thúc (để trống nếu dùng lâu dài)" xuống 2 dòng làm cột phải lệch hàng | 1440/820: nhãn cao 34 (cột trái 17); ô Kết thúc y=553, ô Bắt đầu y=536 | `<small>` trong `.form-label` (10087), nhãn viết hoa dài trong cột 244px |
| I3 | Chiều cao ô không đều | Tên 37, Liều 37, select 35, ngày 39 (1440) / 41 (390), seg 38 | `input,select{padding:8px 12px}` (283) không có `height`; ô ngày/select có chiều cao nội tại khác nhau |
| I4 | Nút segmented thấp hơn ô nhập | seg ngoài 38, nút trong 30 (1440/820), ô 37-39 | `.set-seg button` (1162) padding 6px; `min-height:36` chỉ ở `pointer:coarse` (1918) |
| I5 | Chân popup trong suốt 84%: nội dung cuộn xuyên qua | 390 ngày: "Thuốc, thực phẩm chức năng" lộ dưới "Chưa ghi gì…" (ảnh truoc-ngay-390); nền `.hl-acts` rgba(255,255,255,.84) | `.hl-acts` sticky (1654, 1748) dùng `--sf-pop` mờ |
| I6 | Ghi chú pháp lý `.hl-disc` nằm sát chân, cách chân 6px và bị chân trắng cắt | 1440 ảnh: disc y=600-633, acts y=639 | `.hl-disc{margin:8px 0 0}` (776), `.hl-acts` margin 6px |

## Minor
- M1 Popup rộng 532px ở 820 và 1440; hẹp so với các sheet khác (680). Hai cột 244px làm nhãn dài xuống dòng.
- M2 Viền ô thường là hồng đậm như viền focus; focus chỉ khác ở độ dày, khó phân biệt (`--field-bd`, 1688).
- M3 `small` trong nhãn có cỡ 11,05px (`max(11px, 0.85em)`, 1908) lệch thang (11 hay 12).
- M4 `.hl-sheet` có `scrollWidth 542 > clientWidth 524` (lề âm -18px của `.hl-acts`); không gây cuộn ngang thật nhưng là nợ kỹ thuật.
- M5 Check-in tối (390): 5 nút tâm trạng xuống 3+2 hàng với bề rộng giãn khác nhau (`.hl-ci-big .hl-m{flex:1 1 100px}`, 830). Tóm tắt "Hôm nay" (390): "Rất tốt" mồ côi ở hàng 2.
- M6 Nhật ký (390/1440): ô ngày lọc trống không có nhãn, hiện "dd/mm/yyyy" khô khan, không rõ để làm gì.
- M7 Nút `✕` đóng sheet 27-28px ở khổ không cảm ứng (≥24 nên đạt mức tối thiểu v0.7.1, nhưng nhỏ so với ô 37).
- M8 Nút nhỏ ở desktop 30px (◀ ▶ −0,5 +0,5, Mở hồ sơ, Xem báo cáo, seg Tóm tắt/Duyệt/Nhật ký); đạt ≥24, không đạt 36 chỉ khi cảm ứng đã được xử lý.

## Đã đạt (không cần sửa)
Không tràn ngang ở 390/820/1440; mọi chữ nằm trong thang 11/12/13/14/16/18/22/28; Esc đóng popup; chế độ tối cùng lỗi bố cục nhưng màu đủ đọc; 4 màn (Tóm tắt, Duyệt, Nhật ký, ngày, check-in) không có vùng bấm < 24px, ở 390 không < 36px.

## Đề xuất (chờ PO duyệt, rồi 3 mockup rule §10)
Popup: khoảng cách dọc cố định (nhóm cách nhau 14-16px), chiều cao mọi ô = 40px, nhãn ngắn một dòng ("Kết thúc" + gợi ý "để trống = dùng lâu dài" xuống dòng riêng dưới ô), chân popup nền đặc, ghi chú pháp lý trong khung nền nhạt trước chân. Màn hằng ngày: chỉ sửa M5-M7 nếu PO muốn.
