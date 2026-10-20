# Ghi chú phát hành Life Capital

Địa chỉ: https://lifecapital.vercel.app · Dữ liệu nằm trong trình duyệt của từng máy; cập nhật phiên bản không xóa dữ liệu.

## v0.6.0 · Dự án kiểu Asana · đang UAT trên staging

Làm lại phần Dự án theo cách Asana tổ chức dự án, vì bản v0.5.0 khó theo dõi và khó dùng. Dữ liệu cũ dùng tiếp, không cần làm gì.

**Mới**
- Bấm một dự án để mở **trang riêng**, có nút ← và nút Quay lại của trình duyệt; trên app cài ở iPhone vuốt từ cạnh trái để quay lại. Máy tính rộng có cột danh sách dự án bên trái.
- 4 chế độ xem trong mỗi dự án, nhớ chế độ dùng gần nhất:
  - **Tổng quan:** cập nhật trạng thái (Đúng tiến độ / Có rủi ro / Chậm, kèm ghi chú và lịch sử), % việc xong, giờ đã dành, thời gian đã trôi, việc quá hạn và việc tiếp theo, mốc, mô tả, giờ theo tuần và theo loại vốn.
  - **Danh sách:** các mục chia theo phần, cột loại vốn, ngày, tiến độ, giờ; xổ việc nhỏ hoặc các buổi ngay tại chỗ.
  - **Bảng:** mỗi phần một cột, mỗi mục một thẻ.
  - **Timeline:** thay biểu đồ Gantt cũ; mỗi việc hoặc chuỗi hoạt động một dòng, các buổi là vạch trong thanh, hạn và mốc là dấu ◆; thu phóng Ngày / Tuần / Tháng.
- **Phần** (section) tự đặt tên cho từng dự án, có 2 mẫu bấm một lần (“Cần làm · Đang làm · Xong”, “Giai đoạn 1 · 2 · 3”). Đổi tên, đổi thứ tự, xóa phần (có Hoàn tác).
- Hoạt động lặp lại cùng tên gom thành một **chuỗi** một dòng (vd 12 buổi “Chạy dài”), thay vì mỗi buổi một dòng.
- Thêm việc ngay trong từng phần (gõ tên, Enter); tích xong có Hoàn tác; máy tính kéo thả mục sang phần khác, điện thoại dùng ô Chuyển.
- **Bảng chi tiết** khi bấm một mục: sửa tên, phần, hạn, loại vốn, việc nhỏ, xếp lịch, xem các buổi. Máy tính trượt ra bên phải, điện thoại trượt từ dưới lên.
- Việc có **hạn**, hiện cả ở Hộp việc; quá hạn thì nhãn đỏ.

**Thay đổi**
- Bỏ biểu đồ Gantt mỗi hoạt động một dòng và kiểu bấm dự án xổ ra tại chỗ.
- Khôi phục từ tệp sao lưu ở chế độ Gộp: dự án đã có cũng được thêm lại phần, mốc, cập nhật trạng thái còn thiếu.
- Dữ liệu ghi số phiên bản 60; máy còn chạy bản cũ giữ nguyên phần, hạn, mốc khi lưu và đồng bộ.
- Test gộp dữ liệu 28 tình huống (thêm 8 cho phần, hạn, mốc, cập nhật trạng thái).

**Thêm trong UAT (20/10): Sức khỏe, phần 2** (học từ Bearable, Daylio, Clue, Flo, Apple Health, Oura)
- **Điều ảnh hưởng tới bạn:** tự so các ngày có và không có một hoạt động trên lịch, một loại thuốc, căng thẳng cao, ngủ ít với tâm trạng và từng triệu chứng trong 90 ngày; chỉ kết luận khi mỗi bên có ít nhất 4 ngày và chênh lệch đủ lớn, vd "Ngày có Gym: tâm trạng 4,6/5, ngày khác 3,4/5", "Nhức đầu vào 4/5 ngày có Họp dài (80%), ngày khác 11%".
- **Check-in tối:** 4–5 bước ngắn (tâm trạng, triệu chứng, giấc ngủ và căng thẳng, thuốc), có chuỗi ngày; tab Lịch nhắc sau 19h nếu hôm nay chưa ghi; nút Nhắc trên điện thoại tải tệp lịch (.ics) có nhắc lặp mỗi tối để thêm vào app Lịch.
- **Chu kỳ theo giai đoạn:** hành kinh, nang noãn, rụng trứng, hoàng thể, mỗi giai đoạn có gợi ý; tự phát hiện triệu chứng hay đến trong 5 ngày trước kỳ kinh; ghi thêm dịch âm đạo, nhiệt độ buổi sáng, que thử rụng trứng LH để biết ngày rụng trứng (que dương: ~1 ngày sau; nhiệt độ tăng từ 0,2°C 3 ngày liền) và dự đoán kỳ tới chính xác hơn; chế độ kín đáo trên Lịch chỉ hiện chấm màu.
- **Báo cáo cho bác sĩ:** tóm tắt 30 hoặc 90 ngày (thông tin, thẻ y tế, thuốc và tỷ lệ dùng đủ liều, triệu chứng, tâm lý, giấc ngủ, chu kỳ, ghi chú theo ngày); In, lưu PDF hoặc lưu tệp HTML. **Thẻ y tế khẩn cấp** ở tab Tôi: nhóm máu, dị ứng, bệnh nền, liên hệ khẩn cấp.
- **Vận động trong tuần:** vòng 150 phút (khuyến nghị WHO), tự tính từ hoạt động trên lịch như gym, chạy, bơi, đi bộ, đạp xe; mục Duyệt › Vận động có 8 tuần gần nhất. **Điểm Sẵn sàng** 0–100 mỗi ngày từ giấc ngủ, triệu chứng, căng thẳng, tâm trạng hôm qua, nợ ngủ; hiện trên thẻ hôm nay ở Lịch. Điểm dưới 50 thì Xếp hết chỉ đặt tối đa một nửa giới hạn giờ hôm nay.

**Thêm trong UAT (20/10): Sức khỏe và hồ sơ** (PO yêu cầu thêm vào bản này)
- Tab mới **Sức khỏe**, bố cục theo app Sức khỏe của iPhone: **Tóm tắt** (ghi nhanh hôm nay, Điểm nổi bật, thẻ ghim), **Duyệt** theo nhóm (Triệu chứng, Tâm lý, Giấc ngủ, Thuốc và thực phẩm chức năng, Cơ thể, Chu kỳ) với biểu đồ 7 ngày / 30 ngày / 6 tháng, **Nhật ký** từng ngày.
- Ghi mỗi ngày: tâm trạng (5 mức), căng thẳng, giờ ngủ, triệu chứng (18 loại có sẵn + tự thêm, mỗi loại 3 mức nặng), thuốc và thực phẩm chức năng đã dùng, cân nặng, chiều cao, ghi chú. Ghi được cho ngày đã qua, không ghi trước cho ngày tới.
- **Thuốc và TPCN:** tên, liều, hằng ngày (1–4 lần) hoặc khi cần, ngày bắt đầu và kết thúc; tích mỗi lần dùng; theo dõi tỷ lệ dùng đủ liều 7 ngày.
- **Tâm lý:** tâm trạng, căng thẳng mỗi ngày; bài kiểm tra nhanh PHQ-2 và GAD-2 (4 câu) có lịch sử điểm.
- **Chu kỳ (khi hồ sơ là Nữ):** ghi ngày hành kinh (ít / vừa / nhiều); dự đoán kỳ tới, ngày rụng trứng, giai đoạn dễ thụ thai theo độ dài chu kỳ tự tính từ các kỳ đã ghi hoặc theo số tự nhập; báo trễ kinh, chu kỳ không đều, kỳ kéo dài. Ghi rõ không dùng để tránh thai.
- **Gợi ý theo quy tắc, không dùng AI**, có số liệu cụ thể: triệu chứng lặp lại kèm mẹo tự chăm sóc và dấu hiệu cần đi khám, triệu chứng nặng hoặc sốt kéo dài (đi khám), triệu chứng hay đi cùng ngày làm việc nhiều hay đêm ngủ ít (lấy từ lịch), giấc ngủ, tâm trạng thấp (gợi ý xếp giờ cho Quan hệ, Sức khỏe), cân nặng thay đổi nhanh, BMI theo ngưỡng châu Á kèm số kg cần đổi, uống thuốc chưa đều, chu kỳ. Luôn ghi chú không thay cho bác sĩ, cấp cứu gọi 115.
- **Lịch:** thẻ ngày và chế độ Ngày có chip sức khỏe (tâm trạng, triệu chứng, hành kinh, dự kiến hành kinh, dễ thụ thai); bấm để ghi. Tổng kết tuần có mục Sức khỏe.
- **Tab Tôi** thay ô Cài đặt ở thanh dưới điện thoại và tab Vốn: hồ sơ (tên gọi, ngày sinh và tuổi, giới tính, chiều cao, cân nặng theo ngày, BMI), Danh mục vốn, nút mở Cài đặt. Thanh dưới điện thoại: Lịch, Việc, Dự án, Sức khỏe, Số liệu, Tôi. Phím tắt 1–6.
- **Riêng tư:** công tắc Đồng bộ dữ liệu sức khỏe (mặc định bật). Tắt thì nhật ký sức khỏe chỉ nằm trên máy, không gửi lên tài khoản. Dữ liệu sức khỏe không bao giờ gửi sang Google Calendar, không có trong tệp CSV. Đồng bộ gộp từng ngày; máy chạy bản cũ giữ nguyên hồ sơ và nhật ký.

**Làm lại Cài đặt (20/10)**
- Thanh kéo **Độ mờ nền** mượt: trước đây mỗi lần kéo làm cả trang tính lại và vẽ lại mọi lớp kính mờ (Chrome báo chặn giao diện ~200ms); giờ chỉ vẽ lại lớp ảnh nền. Có số độ mờ bên cạnh; thanh chỉ hiện khi đã chọn ảnh nền. Kính mờ của thẻ, thanh bên giữ một độ cố định.
- Mỗi mục là một thẻ riêng; hàng cao đều, nhãn bên trái, nút và ô chọn bên phải, cùng cỡ; kẻ mảnh giữa các hàng. Nền bảng gần đặc để dễ đọc.
- Dữ liệu: Sao lưu, Xuất CSV, Khôi phục thành từng hàng có giải thích. Đồng bộ: nút Đăng nhập Google nằm cùng hàng mô tả. Google Calendar: ô Client ID rộng hết hàng, Tự động đồng bộ là công tắc bật/tắt. Mục Xóa dữ liệu viền đỏ.
- Điện thoại: hàng tự xuống dòng khi không đủ chỗ, không ép mọi hàng thành hai dòng.

**Thống nhất số giờ (20/10)**
- Mọi chỗ hiển thị số giờ dùng dấu phẩy thập phân: "32,5h", "1,5h" (trước đây chỗ "32.5h", chỗ "0,5h"), gồm cả đoạn sao chép Tổng kết tuần và mô tả sự kiện Google Calendar. Ô nhập số không đổi.
- Ô **Tổng giờ** ở tab Lịch và cột giờ tuần của lịch năm trên điện thoại cộng cả giờ cố định mỗi tuần (tab Vốn), khớp Giờ đã ghi ở Tổng kết tuần, Tổng quan và lịch năm trên máy tính.

**Thêm trong UAT (20/10): Bỏ Nạp / Tiêu** (PO yêu cầu gộp vào bản này)
Mọi hoạt động đều là đầu tư vào một loại vốn, nên app không chia ▲ Nạp / ▼ Tiêu nữa; câu hỏi chính chỉ còn: bánh xe 5 loại vốn tuần này có cân bằng không.
- Bỏ ▲ / ▼ ở mọi nơi: thẻ hoạt động, ghi nhanh, popup thêm hoạt động (bỏ ô Tác động), Hộp việc (bỏ nút đổi tác động), lịch năm, tiêu đề sự kiện Google Calendar, tệp CSV (bỏ cột Tác động).
- Bỏ pin năng lượng từng ngày, nhãn Kiệt sức và cài đặt Ngưỡng kiệt sức. Thẻ ngày hiện tổng giờ đã ghi.
- Mọi giờ đã ghi, kể cả hoạt động cũ ghi là Tiêu, đều cộng vào loại vốn của nó trên bánh xe.
- Ô số liệu tuần: Hoạt động · Tổng giờ · **Cân bằng** (điểm %) · **Yếu nhất** (vốn đạt % mục tiêu thấp nhất), thay cho ▲ Nạp / ▼ Tiêu.
- Tổng kết tuần: thẻ Cân bằng, Giờ đã ghi, Yếu nhất; bỏ phần Cán cân năng lượng và “Tiêu nhiều hơn nạp”. Sao chép tổng kết ghi giờ từng vốn và điểm cân bằng.
- Tổng quan: bảng giờ theo loại vốn chỉ còn một cột giờ; bỏ nhận định “Tiêu nhiều hơn nạp”.
- Tab Vốn: giờ cố định mỗi tuần gộp thành một cột (bản cũ có ▲ và ▼ thì cộng lại).
- Lịch năm trên điện thoại tô màu theo tổng giờ, cột cuối là tổng giờ của tuần.
- Trường ▲ / ▼ cũ vẫn giữ trong dữ liệu (không còn dùng) để máy chạy bản cũ đồng bộ không lỗi.

**Thêm trong UAT (20/10): Thói quen** (PO yêu cầu thêm vào bản này)
- **Dải Thói quen** ngay dưới 4 ô số liệu ở tab Lịch: mỗi thói quen một chip gồm tên, số chuỗi và 7 chấm của tuần. Trên điện thoại dải vuốt ngang.
- Hai cách đếm: **tự đếm** các buổi cùng tên trên lịch (không phân biệt hoa thường, có dấu hay không), hoặc **tích tay** bằng nút ✓ cho việc nhỏ không cần xếp lịch.
- Chuỗi kiểu mềm: **số lần mỗi tuần** thì đếm số tuần liên tiếp đạt; **mỗi ngày** thì mỗi tuần được nghỉ 1 ngày không đứt chuỗi. Hôm nay hay tuần này chưa xong không làm đứt chuỗi; buổi đã xếp cho ngày tới chưa tính là đã làm.
- Bấm một chip mở bảng chi tiết: chuỗi, kỷ lục, lưới 26 tuần, sửa tên, cách đếm, loại vốn, tần suất; tích bù các ngày trong tuần; lưu trữ, xóa (có Hoàn tác). Thói quen tự đếm còn thiếu lần trong tuần có nút **Xếp 1 buổi**.
- Popup hoạt động có ô **Theo dõi thành thói quen**; thẻ hoạt động thuộc thói quen có dấu ✓.
- App **gợi ý** khi một hoạt động có từ 3 ngày trở lên trong 2 tuần; Bỏ qua thì không hỏi lại trên máy đó.
- Mốc 7, 21, 30, 66 ngày (hoặc 4, 8, 12, 26, 52 tuần) báo bằng một thông báo nhỏ.
- Tổng kết tuần và Tổng quan có thẻ Thói quen; tab Vốn có danh sách quản lý, gồm cả mục đã lưu trữ.
- Đồng bộ: hai máy tích ngày khác nhau thì giữ cả hai; máy bản cũ giữ nguyên thói quen khi lưu.
- Không xóa được loại vốn đang có thói quen dùng (báo tên thói quen); gợi ý dùng cách viết hay gặp nhất và viết hoa chữ đầu.

**Thêm trong UAT (20/10): Xếp thông minh** (PO yêu cầu thêm vào bản này)
- **Xếp hết** lách qua lịch bận, vẫn giữ đúng thứ tự các việc nhỏ.
- Rải sang nhiều ngày, chỉ trong **khung giờ xếp việc** (mặc định 08:00–22:00) và **tối đa 2 giờ mỗi ngày** cho một việc; cả hai đổi được trong Cài đặt › Mặc định.
- Có **hạn** thì xong trước hạn ít nhất 1 ngày. Hạn đứng trên mọi kiểu cân bằng: không kịp thì dồn làm sớm nhất (bỏ giới hạn mỗi ngày), vẫn không kịp thì nới khung giờ 06:00–24:00, cuối cùng mới báo "Không kịp hạn" và để phần còn lại trong hộp.
- Cân bằng: không có hạn gấp thì để sau những tuần mà loại vốn của việc đã đạt mục tiêu.
- Việc nhỏ đã qua giờ mà chưa xong được đánh dấu **lỡ**; nút **Xếp lại** dời chúng sang khoảng trống từ bây giờ. Cả lần Xếp hết có **Hoàn tác**.
- Phần xem trước sửa được: đổi thứ tự (↑ ↓), bỏ bớt việc (ô tích). Trên màn cảm ứng ô tích và nút ↑ ↓ to hơn cho dễ bấm.
- Sửa: bấm "Dời" ở việc chưa chia nhỏ đã có giờ báo nhầm "Không còn việc nhỏ để xếp".

**Sửa trong UAT (19/10)**
- Thêm việc trong trang dự án bằng bộ gõ tiếng Việt: một lần Enter có lúc thêm 2 việc giống nhau. Bộ gõ phát thêm một Enter sau Enter chốt chữ; nay mỗi lần nhấn chỉ làm một lần ở mọi ô (thêm việc, việc nhỏ, phần, mốc, ghi nhanh, chuyển ô trong popup). Ghi nhanh gõ có dấu thì Enter cũng chọn gợi ý #dự án như khi gõ không dấu.
- Bảng chi tiết: sửa tên rồi bấm ngay dropdown Phần, Loại vốn hay ô Hạn thì dropdown không mở hoặc đóng ngay, vì bảng vẽ lại đúng lúc bấm. Nay bảng chờ bấm xong hoặc rời ô mới vẽ lại.
- Ô ngày (Hạn, Xếp lịch): gõ tay tới chữ số đầu của năm là lưu luôn năm 0002 rồi mất con trỏ. Nay gõ tay thì lưu khi Enter hoặc rời ô, chọn trên lịch thì lưu ngay; năm phải trong 2000–2100, gõ dở rồi bỏ thì giữ ngày cũ.
- Chuyển tab khi con trỏ đang ở một ô nhập thì con trỏ nhảy vào một ô bất kỳ của trang mới (Bảng bị kéo về cột đầu).

**Sửa trong UAT (20/10)**
- Bấm Lưu ở popup dự án (và lưu hoạt động, xếp lịch, thói quen, cập nhật trạng thái, nhật ký sức khỏe) chặn giao diện khoảng 300ms vì vẽ lại cả trang cùng lúc đóng popup. Nay popup đóng ngay, trang vẽ lại ngay sau đó (khoảng 10ms cho lần bấm).
- Cập nhật trạng thái dự án ghi nhầm thì xóa được: mỗi cập nhật có nút Xóa, có Hoàn tác.

**Rà soát UX/UI (20/10): đơn giản, dễ hiểu hơn**
- Lịch: một hàng chọn tuần cạnh Tuần/Ngày/Năm, qua đầu/cuối năm tự sang năm kề bên; bỏ chọn năm trên tiêu đề và nhãn "Tuần hiện tại" (có nút Tuần này khi xem tuần khác). Dữ liệu mẫu thu thành một dòng. Điện thoại: tiêu đề và nút cùng một hàng, ngày đầu tiên của tuần lên giữa màn hình thay vì gần đáy.
- Hộp việc: thẻ chỉ còn tên, Xếp/Xếp hết và ⋯; loại vốn, hạn, dự án, Lên/Xuống, Xóa vào khay ⋯ (một khay mở một lúc). Dòng dưới ghi loại vốn · đã xếp · giờ · hạn · dự án. Số trên tab là số việc (khớp số thẻ), dòng đầu ghi thêm số phần chưa có lịch; bỏ dòng Mẹo.
- Một nút Thêm cho mỗi tab: bỏ "+ Dự án", "+ Hoạt động" (vào menu ⋯ của dự án), nút Thêm riêng ở chế độ Ngày (nút Thêm đầu trang thêm vào ngày đang xem), "Ghi chi tiết" và "Ghi hôm nay" ở Sức khỏe. Nút thêm ở mỗi ngày thu thành dấu +.
- Sức khỏe: thẻ Hôm nay lên đầu; thẻ Sẵn sàng chỉ hiện khi tính được và không lặp vòng Vận động (đã có ở thẻ ghim); nút Check-in tối hiện ở thẻ Hôm nay sau 19h khi chưa ghi tâm trạng; giờ nhắc và tệp nhắc chuyển sang tab Tôi; bỏ banner Thêm hồ sơ, gợi ý Hoàn thiện hồ sơ có nút Mở hồ sơ.
- Ô ghi nhanh ẩn ở Sức khỏe, Tổng quan, Tôi (phím / chuyển về Lịch). Tên tab trên điện thoại giống máy tính (Hộp việc, Tổng quan). Thanh bên bỏ nút Cài đặt; Cài đặt mở từ tab Tôi.
- Tổng quan: Nhận định mặc định theo tuần đang xem để khớp bánh xe (trước đây là trung bình 4 tuần nên có lúc vênh với bánh xe); bỏ thẻ Nhận định khi chưa đặt mục tiêu, chỉ còn một nút Đặt mục tiêu; "Giờ trong tuần" thành "Giờ đã ghi" chia theo loại vốn, bỏ "Còn trống" tính trên 168h; số vừa đổi tô nền 4 giây rồi tự tắt, bỏ dòng "Số tô nền vừa thay đổi · Bỏ đánh dấu". Ghi "Tuần 43" thay cho "W43".
- Lịch: chưa có mục tiêu thì chỉ 2 ô Hoạt động, Tổng giờ (không hiện "–"). Dữ liệu mẫu có sẵn mục tiêu giờ/tuần.
- Tab Tôi: nút Xóa từng loại vốn ẩn sau "Xóa bớt"; giải thích Mục tiêu và Cố định; Từ khóa nhận diện thu gọn. Popup hoạt động chỉ hiện ô Đến ngày khi chọn lặp lại.

**Rà soát UX/UI vòng 2 (20/10): chính phụ rõ ràng, nút đồng bộ**
- Nút cùng loại cùng kiểu: mọi nút xóa trên một dòng (việc, việc nhỏ, cập nhật trạng thái, mốc, việc nhỏ trong bảng chi tiết dự án, loại vốn, triệu chứng tự thêm) là dấu ✕ giống nút xóa mốc; đổi thứ tự là ↑ ↓. Cùng cỡ, màu nhạt, rê chuột vào ✕ thì đỏ; tên đầy đủ ở chú thích. Nút Xóa ở cuối popup giữ chữ.
- Thứ bậc giao diện: tiêu đề trang, hàng chọn tuần nằm thẳng trên nền (không hộp); thẻ nội dung chính nền đặc, viền rõ, bóng nhẹ; phần phụ bên trong (việc trong hộp, thẻ ghim, thói quen, ô tổng kết) nền nhạt, không bóng.
- Lịch tuần theo kiểu lịch phổ biến: mỗi ngày một cột có viền, đầu cột tách riêng (thứ chữ nhỏ, ngày chữ lớn, tổng giờ bên phải); hôm nay viền màu nhấn và ngày tô nền; ngày đã qua nhạt hơn; cuối tuần đầu cột hơi đậm; hoạt động nền màu loại vốn nhạt với vạch màu bên trái. Đủ rộng (từ 960px) thì 7 cột một hàng.
- Tổng kết theo 5 loại vốn: ở tab Lịch và đầu popup Tổng kết, mỗi loại vốn một ô ghi số giờ trong tuần / mục tiêu kèm thanh màu, đánh dấu vốn yếu nhất; dòng trên ghi tổng giờ, số hoạt động, điểm cân bằng. Thay 4 ô Hoạt động · Tổng giờ · Cân bằng · Yếu nhất. Popup Tổng kết bỏ 3 thẻ cũ và nhận định 168 giờ; thứ tự: giờ theo loại vốn, bánh xe, nhận định, rồi dự án, sức khỏe, thói quen.

**Rà soát UX/UI vòng 3 (20/10): Ngày, Năm cùng kiểu Tuần; mọi nút một màu**
- Chế độ Ngày: hàng chọn ngày như đầu cột tuần (thứ chữ nhỏ, ngày chữ lớn; hôm nay viền màu nhấn, ngày đã qua nhạt, cuối tuần hơi đậm); đầu ngày ghi thứ, ngày (hôm nay tô nền), tổng giờ ở ô tròn; khối hoạt động nền màu loại vốn nhạt, vạch màu bên trái, chữ tối thay cho khối chuyển màu chữ trắng.
- Chế độ Năm: bỏ cột Năm lặp lại mỗi dòng; cột Tuần ghi "Tuần 43" và ngày đầu tuần; đầu bảng chữ nhỏ in hoa, Thứ 7 và CN tô nhẹ; tuần này có vạch màu nhấn; hôm nay viền màu nhấn và ngày tô nền (bỏ nhãn "Nay"); ngày đã qua nhạt; hoạt động trong ô cùng kiểu ở Tuần; tổng giờ ở ô tròn, đỏ khi quá 168h. Điện thoại: tuần này có vạch màu nhấn.
- Nút, thanh và nhãn một màu, bỏ hết kiểu chuyển màu (gradient) và vệt sáng trên kính: nút thường nền trắng viền mảnh, nút chính hồng đặc, nút Tổng kết oliu đặc, nút đang chọn (Tuần/Ngày/Năm, các lựa chọn trong Cài đặt) hồng đặc, số đếm trên tab, ô chọn loại vốn, thông báo lỗi lưu, thanh độ mờ nền, khối Gợi ý tuần tới.

**Rà soát UX/UI vòng 4 (20/10): popup và thông báo cùng thứ bậc; kính mờ mềm, tương phản chuẩn**
- Popup (hoạt động, Tổng kết, xếp lịch, thói quen, sức khỏe, thuốc, dự án, bảng chi tiết, Cài đặt): đầu popup là dải nền nhạt có vạch dưới, tiêu đề đậm, nút đóng ✕ cùng kiểu nút trên dòng; nhóm bên trong nền nhạt viền mảnh; chân popup luôn nằm ở đáy (không phải cuộn mới thấy nút Lưu), tràn hết bề ngang, nút Xóa bên trái chữ đỏ, Hủy rồi nút chính bên phải.
- Thông báo: banner và thông báo nhỏ (toast) một kiểu, nền kính gần đặc, vạch màu bên trái theo loại (hồng: thông tin, oliu: xong, đỏ: lỗi).
- Kính mờ mềm: thẻ, thanh bên, ô ghi nhanh hơi trong suốt và làm mờ nền phía sau; popup trong hơn một chút trên lớp phủ tối nhẹ. Viền khung đậm hơn và có bóng đổ để vẫn tách khỏi nền. Chế độ "Bỏ kính mờ" giữ thẻ và popup gần như đặc.
- Tương phản theo WCAG 2.1 AA, đo bằng script trên mọi tab, chế độ xem và popup, cả Sáng, Tối, Bỏ kính mờ và điện thoại: mọi chữ ≥ 4.5:1 (chữ lớn ≥ 3:1), viền ô nhập ≥ 3:1. Đổi: chữ phụ đậm hơn (sáng #67595f, tối #a3949b), chữ phụ thứ hai #54484e, chữ xanh oliu #596021, chữ đỏ riêng (#a83a4a, tối #f08591), viền ô nhập #85737c, viền khi đặt con trỏ màu hồng đậm; tên nhóm ở Sức khỏe thành chữ đậm kèm chấm màu thay cho chữ màu nhạt; tên loại vốn trong thẻ hoạt động ngả màu vốn nhưng đủ đậm; ngày, tuần đã qua làm nhạt nền thay vì làm mờ chữ; nhãn giờ hiện tại ở chế độ Ngày đủ tương phản.

**Rà soát UX/UI vòng 5 (20/10): liquid glass toàn giao diện, không nét viền đen**
- Mọi bề mặt là kính trong (liquid glass): thẻ, cột ngày, dòng thời gian, bảng năm, cột Hộp việc, thanh bên, ô ghi nhanh, popup, thông báo. Kính làm mờ và tăng bão hòa nền phía sau, có ánh sáng trắng ở mép trên như mặt kính; bóng đổ ngả hồng. Popup và thông báo là kính dày hơn để chữ rõ trên nội dung.
- Không còn nét viền đen hay xám đậm: mép ngoài khung là kính nhuộm hồng (giữ tương phản khung khoảng 1.6:1), mép trong trắng; đường kẻ trong thẻ hồng nhạt; viền ô nhập hồng đậm (≥ 3:1); ô tích tự vẽ viền hồng thay cho ô xám của trình duyệt; các mũi tên mở/thu, ô ngày, vạch mốc, ô màu dự án, thanh kéo chuyển sang hồng hoặc trắng. Chế độ tối dùng mép sáng.
- Nút: nút thường là kính trong mép sáng; nút chính kính nhuộm hồng một màu; Tổng kết nhuộm oliu. Nút và ô nhập không làm mờ lần nữa (đã nằm trên kính) cho nhẹ máy.
- Đã kiểm bằng script: không còn nét đen ở mọi tab và popup (Sáng, Tối, Bỏ kính mờ, điện thoại); chữ vẫn đạt 4.5:1, viền ô nhập 3:1. Chế độ tối: chữ phụ sáng hơn (#c6b9bf, #b5a7ae) cho đủ tương phản trên kính.

**Rà soát UX/UI vòng 6 (20/10): khối nổi mềm, bỏ viền (theo mẫu liquid)**
- Bỏ viền quanh khung, cột ngày, thanh bên, ô ghi nhanh, popup, thông báo, nút, chip lựa chọn, tab dự án, nhóm trong Cài đặt. Khối nổi lên bằng bóng đổ nhiều lớp mềm ngả hồng (sát, gần, xa) và ánh sáng trắng ở mép trên, đáy hơi tối vào trong: cảm giác hơi 3D, mềm. Bo góc lớn hơn (khung 24px, popup 28px).
- Nút và chip là viên tròn nổi: rê chuột nổi cao hơn, bấm thì lún xuống. Thanh chọn (Tuần/Ngày/Năm…) là rãnh lún, lựa chọn đang bật nổi lên màu hồng. Thanh tab trên điện thoại là viên nổi.
- Hôm nay phát sáng hồng quanh cột thay cho viền. Đường ngăn trong thẻ, đầu popup, chân popup thay bằng khoảng trống hoặc bóng nhẹ.
- Vạch màu bên trái (một dạng viền) ở hoạt động, việc trong Hộp việc, thẻ dự án, gợi ý sức khỏe, thông báo chuyển thành chấm màu và nền nhuộm nhẹ.
- Chỉ ô nhập, ô tích và bảng giữ viền mảnh (ô nhập viền hồng để đạt chuẩn 3:1). Chữ vẫn đạt 4.5:1 ở Sáng, Tối, Bỏ kính mờ; chế độ tối: rãnh thanh chọn tối, chữ phụ và chữ đỏ sáng hơn.

## v0.5.1 · Dọn mã · 19/10/2026

Không đổi giao diện hay tính năng.

- Bỏ 122 khai báo CSS đã bị khai báo sau ghi đè và 11 quy tắc CSS rỗng, phần còn sót từ lần làm lại giao diện kính.
- Bỏ các biến JavaScript không còn dùng và biểu tượng emoji trong danh sách tab (không còn hiển thị).
- README.md và life-capital.md không còn chép nguyên mã app (mỗi tệp từ khoảng 362 KB còn 18 KB); mục Mã nguồn trỏ tới `index.html`, ghi chú phát hành và test.
- Đã so kiểu hiển thị của mọi phần tử giữa bản cũ và bản mới trên 88 màn hình (máy tính, điện thoại, cửa sổ hẹp; sáng, tối, giảm hiệu ứng): giống hệt. Test gộp dữ liệu 20/20 đạt.

## v0.5.0 · Dự án · 18/10/2026

Gắn hoạt động và việc vào dự án để biết thời gian đang dồn vào mục tiêu lớn nào. Không bắt buộc: ăn cơm, di chuyển… cứ để trống.

**Mới**
- Tab **Dự án**: danh sách xếp theo mức ưu tiên (Cao → Thấp, cùng mức thì hạn gần hơn ở trên). Mỗi dự án có màu, trạng thái, ngày bắt đầu và kết thúc, giờ tổng và giờ tuần này, số việc xong, vạch thời gian đã trôi, nhãn Quá hạn.
- Bấm vào một dự án để xem **biểu đồ Gantt**: mỗi dòng một hoạt động, cũ nhất ở trên, màu theo loại vốn, hoạt động sắp tới viền nét đứt. Kèm giờ theo từng tuần và theo loại vốn.
- Tạo và sửa dự án: tên, màu, trạng thái, ưu tiên, ngày, một hoặc nhiều loại vốn (loại đầu là mặc định). Xóa dự án chỉ bỏ nhãn, có Hoàn tác.
- Gắn dự án: ô Dự án trong popup hoạt động; gõ `#tên` ở ô ghi nhanh (Enter để chọn gợi ý); `+ #tên việc` để thêm việc vào Hộp việc.
- Hộp việc: chọn dự án cho từng việc, lọc theo dự án; xếp lịch thì hoạt động mang theo dự án.
- Tổng quan và Tổng kết tuần có mục **Giờ theo dự án**, kèm phần giờ không thuộc dự án nào.
- Google Calendar: mô tả sự kiện có thêm dòng “Dự án: …”.

**Thay đổi**
- Thanh tab trên điện thoại có 6 ô: Lịch · Việc · Dự án · Số liệu · Vốn · Cài đặt. Phím tắt 1–5 cho 5 tab.
- Có trang test tự động cho phần gộp dữ liệu (`tests/merge-tests.html`, 20 tình huống).

**Ghi chú quy trình:** lên production theo yêu cầu chủ dự án ngày 18/10 khi UAT trên staging chưa chấm bước nào; UAT tiếp tục như hậu kiểm.

## v0.4.1 · Giữ dữ liệu khi có bản mới · 17/10/2026

- App giữ nguyên các thông tin do bản mới hơn ghi (vd nhãn dự án sắp có ở v0.5.0) thay vì xóa khi lưu hoặc đồng bộ, nên máy chưa cập nhật không làm mất dữ liệu của máy đã cập nhật.
- Dữ liệu ghi kèm số phiên bản app, để bản sau nhận ra dữ liệu đến từ máy chưa cập nhật.
- Không đổi giao diện. Nên mở app trên mọi máy để nhận bản này trước khi v0.5.0 ra mắt.

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
