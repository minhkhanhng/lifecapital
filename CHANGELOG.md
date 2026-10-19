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

**Sửa trong UAT (19/10)**
- Thêm việc trong trang dự án bằng bộ gõ tiếng Việt: một lần Enter có lúc thêm 2 việc giống nhau. Bộ gõ phát thêm một Enter sau Enter chốt chữ; nay mỗi lần nhấn chỉ làm một lần ở mọi ô (thêm việc, việc nhỏ, phần, mốc, ghi nhanh, chuyển ô trong popup). Ghi nhanh gõ có dấu thì Enter cũng chọn gợi ý #dự án như khi gõ không dấu.
- Bảng chi tiết: sửa tên rồi bấm ngay dropdown Phần, Loại vốn hay ô Hạn thì dropdown không mở hoặc đóng ngay, vì bảng vẽ lại đúng lúc bấm. Nay bảng chờ bấm xong hoặc rời ô mới vẽ lại.
- Ô ngày (Hạn, Xếp lịch): gõ tay tới chữ số đầu của năm là lưu luôn năm 0002 rồi mất con trỏ. Nay gõ tay thì lưu khi Enter hoặc rời ô, chọn trên lịch thì lưu ngay; năm phải trong 2000–2100, gõ dở rồi bỏ thì giữ ngày cũ.
- Chuyển tab khi con trỏ đang ở một ô nhập thì con trỏ nhảy vào một ô bất kỳ của trang mới (Bảng bị kéo về cột đầu).

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
