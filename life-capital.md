# Life Capital · Cân bằng thời gian cho 5 loại vốn

Ứng dụng web cá nhân hoá giúp tối ưu hoá quỹ 168 giờ, giữ thói quen và cân bằng 5 loại vốn cuộc sống (Health, Relationship, Experience, Skill, Finance & Career).

---

## 1. Triết lý & Mô hình Cốt lõi

- **5 Loại Vốn Cuộc Sống (The 5 Life Capitals)**:
  1. 🌿 **Sức khỏe (Health)** `#97A13B` - Thể lực, giấc ngủ, rèn luyện, dinh dưỡng, tái tạo năng lượng thể chất.
  2. 🌸 **Quan hệ (Relationship)** `#E0A3BB` - Gia đình, bạn bè, người thương, kết nối xã hội sâu sắc.
  3. 🔮 **Trải nghiệm (Experience)** `#8b6da9` - Khám phá, du lịch, nghệ thuật, niềm vui sống, mở rộng góc nhìn.
  4. 🌊 **Kỹ năng (Skill)** `#4a859c` - Học hỏi, đọc sách, tích luỹ tri thức, rèn luyện chuyên môn.
  5. 🪙 **Tài chính / Công việc (Finance & Career)** `#b88628` - Sự nghiệp, tạo ra giá trị, quản lý tài sản.

- **Mọi hoạt động đều là đầu tư (từ v0.6.0)**:
  - Không còn chia Nạp ▲ / Tiêu ▼: mỗi giờ đã ghi cộng vào loại vốn của nó. Câu hỏi chính là bánh xe 5 loại vốn tuần này có cân bằng không.
  - Dữ liệu cũ có trường Nạp/Tiêu vẫn giữ nguyên (không dùng) để máy chạy bản cũ đồng bộ không lỗi.

- **Khung 168 Giờ (The 168-Hour Framework)**:
  - 1 tuần = 24h × 7 ngày = 168 giờ.
  - Mọi người đều có 168 giờ bình đẳng như nhau. Ứng dụng giúp bạn nhìn rõ số giờ đã phân bổ, số giờ còn trống cho sinh hoạt cá nhân và cảnh báo khi ghi chép vượt quá 168h.

- **Bánh xe cuộc đời (Wheel of Life Radar Chart)**:
  - Biểu đồ radar 5 trục SVG chuẩn công thái học thể hiện độ tròn trịa và cân bằng giữa các nguồn vốn mỗi tuần.
  - Tích hợp vòng đo 33% - 66% - 100% mục tiêu, tính toán tự động Điểm cân bằng bánh xe (Balance Score) = 60% trung bình % đạt + 40% vốn thấp nhất; chỉ tính các vốn đã đặt mục tiêu.

---

## 2. Bảng Màu & Hệ thống Thiết kế (Design System)

- **Màu chủ đạo (Primary)**: `#E0A3BB` (Mauve Rose)
- **4 Màu bổ trợ (Supporting)**:
  - `#F4DFE6` (Blush Soft) - Nền thanh tiến trình, hover state, card phụ
  - `#D6E6E7` (Mist Cyan) - Nhãn thời gian
  - `#C5CC82` (Sage Olive) - Nhãn đạt chuẩn
  - `#97A13B` (Deep Olive Green) - Chỉ báo đạt mục tiêu, thói quen đã làm
- **Nền web**: Pha thêm 5% màu trắng (`#fdfcfd` / `color-mix(in srgb, #faf7f8 95%, #ffffff 5%)`) mang lại cảm giác sáng sủa, thanh lịch và trong trẻo.
- **Hỗ trợ giao diện Sáng / Tối (Light & Dark Mode) chuẩn công thái học**:
  - Hỗ trợ chuyển đổi thủ công hoặc tự động theo hệ điều hành (`color-scheme: dark`).
  - Nền tối sâu trầm ấm `#151113`, thẻ `#1f191c`, chữ tương phản cao, chống lóa mắt vào ban đêm.

---

## 3. Các Tính năng Nổi bật & Tối ưu Hoàn thiện

1. ⚡ **Command Bar Ghi nhanh bằng ngôn ngữ tự nhiên**:
   - Nhập: *"Mai 18h đánh cầu lông 2 tiếng"* hoặc *"Hôm nay 20h đọc sách 1h"*.
   - Tự động nhận diện ngày, giờ bắt đầu, thời lượng và loại vốn theo thời gian thực; dòng xem trước luôn ghi rõ thứ và ngày (vd *Hôm qua · Thứ 5, 08/10*).
   - **Ngày:** *hôm nay, mai, ngày kia/mốt, hôm qua, tối qua, hôm kia*; ngày cụ thể *ngày 9 tháng 10 (năm 2026), 9 tháng 11, 09/10, 09-10, 09.10, 9/10/2026, ngày 15*; thứ *thứ 2 / t2 / thứ hai / chủ nhật* kèm *tuần này, tuần sau, tuần tới, tuần trước, tuần sau nữa* (đứng trước hoặc sau). Không nói tuần thì hiểu là lần tới gần nhất.
   - **Giờ:** *18h, 6h30, 20:00, 5h sáng, 2 giờ chiều, tối 8h, 8 giờ rưỡi, 12h đêm, 14-16h, 2-4h chiều*.
   - **Thời lượng:** *2 tiếng, 1.5h, 1h30, 1 tiếng 30 phút, một tiếng rưỡi, hai tiếng, 45 phút, mười lăm phút, nửa tiếng*.
   - "Mai" là tên người khi đi sau *gặp, cho, với…* hoặc viết hoa giữa câu (*Gọi điện cho Mai 20h*).
2. 📅 **3 Chế độ Xem Lịch Biểu**:
   - **Tuần chi tiết**: 7 thẻ ngày responsive kèm tổng giờ mỗi ngày và nút thêm nhanh; phía trên là 4 ô số liệu (Hoạt động · Tổng giờ · Cân bằng · Yếu nhất) và dải Thói quen.
   - **Dòng thời gian 24h (Timeline)**: Trục thời gian dọc từ 06:00 đến 24:00, trực quan hoá các khối sự kiện. Tích hợp thuật toán **chia làn song song (Lane Splitting)** khi các sự kiện bị trùng khung giờ.
   - **Lưới 53 tuần**: Toàn cảnh cả năm có thanh cuộn và tự động định vị tuần hiện tại.
3. ⚙️ **Trung Tâm Cài Đặt & Dữ Liệu Tinh Gọn (Settings Modal)**:
   - Nút `⚙️` trên header tập trung toàn bộ cấu hình: Chuyển theme (Sáng/Tối/Theo máy), Sao lưu JSON/CSV, Khôi phục, Đặt thời lượng mặc định, khung giờ xếp việc và giới hạn giờ mỗi ngày cho Xếp hết.
   - Thanh điều hướng chính gồm 6 tab: **Lịch biểu**, **Hộp việc**, **Dự án**, **Sức khỏe**, **Tổng quan**, **Tôi** (hồ sơ, Danh mục vốn, Cài đặt).
4. 🏆 **Bản Tin Tổng Kết Tuần Linh Hoạt (Weekly Review with Week Selector)**:
   - Cho phép chọn xem báo cáo tổng kết của **bất kỳ tuần nào** trong năm (từ W1 đến W52/53) qua bộ chuyển tuần `[ ◀ | ▶ ]` và menu thả xuống ngay trong popup.
   - Thẻ Cân bằng, Giờ đã ghi, Yếu nhất; Điểm sáng của tuần, Vốn cần bù, Bánh xe cuộc đời, Thói quen và gợi ý kế hoạch tuần mới.
5. 🛠️ **Popup Thêm / Sửa Hoạt Động Tinh Gọn**:
   - Giao diện form tinh gọn chỉ gồm các trường thông tin cần thiết, tự động đóng popup khi bấm Lưu.
   - Nhập bằng bàn phím: trong popup, mỗi lần nhấn Enter chuyển sang ô kế tiếp (Tên → Loại vốn → Giờ bắt đầu → Thời lượng → Lặp lại → Đến hết ngày); Enter ở ô cuối cùng thì lưu. Khi đang gõ có dấu, một lần Enter vừa chốt chữ vừa chuyển ô. `Cmd/Ctrl + Enter` lưu ngay từ bất kỳ ô nào.
   - Thanh ghi nhanh: khi đang gõ có dấu, một lần Enter vừa chốt chữ vừa ghi hoạt động (Chrome và Safari).
   - Hỗ trợ tạo chuỗi lặp định kỳ (Hằng ngày, Ngày làm việc, Hằng tuần) kèm ngày kết thúc chuỗi, cả khi thêm mới lẫn khi sửa một hoạt động lẻ (hoạt động đó thành buổi đầu của chuỗi).
   - Xóa chuỗi có hai lựa chọn: **Xóa từ ngày này về sau** (giữ các buổi trước ngày đang mở) và **Xóa toàn bộ chuỗi**; hộp xác nhận ghi rõ số buổi bị xóa và được giữ.
6. 🎡 **Bánh Xe Cuộc Đời (Radar Chart) Chuẩn Hoá**:
   - Khung hình mở rộng chống cắt chữ trên mọi kích thước màn hình.
   - Người mới bắt đầu với mục tiêu tuần bằng 0 cho mọi loại vốn; bánh xe và bản tổng kết hiện nút **"Đặt mục tiêu"** dẫn tới tab Danh mục vốn, không chấm điểm hay đưa khuyến nghị dựa trên số giả định.
   - Tuần chưa có hoạt động nào: bản tổng kết hiện trạng thái trống kèm nút "Ghi hoạt động" thay vì đưa ra nhận định.
   - Tích hợp chỉ số Điểm cân bằng bánh xe (Balance Score) trực quan.
7. 🌐 **Động cơ Đa năm tự động (Multi-Year Engine)**:
   - Tự động nhận diện và tính toán 52/53 tuần theo chuẩn quốc tế **ISO 8601**.
   - Tự nhận năm ISO hiện tại mỗi khi mở app; có nút `[ ◀ | ▶ ]` chuyển năm linh hoạt.
8. 💾 **Bảo mật & Toàn vẹn Dữ liệu (Security & Data Integrity)**:
   - Bộ lọc `cleanState` khử mã độc và chống Prototype Pollution khi nhập sao lưu JSON.
   - Phòng chống CSV Injection tự động khi xuất dữ liệu bảng tính.
   - Tải tệp sao lưu `.json` và lịch trình `.csv` trực tiếp qua Native Blob Download.
   - Dữ liệu lưu trong `localStorage` của trình duyệt (khoảng 300 KB mỗi năm với 10 hoạt động/ngày). App xin trình duyệt giữ dữ liệu lâu dài (`navigator.storage.persist`), nhắc sao lưu khi quá 14 ngày chưa sao lưu, và hiện cảnh báo đỏ nếu không lưu được (bộ nhớ đầy hoặc bị chặn).
   - **Lưu ý Safari/iPhone:** Safari có thể tự xóa dữ liệu của trang web nếu bạn không mở trong 7 ngày. Hãy "Thêm vào Màn hình chính" và sao lưu `.json` định kỳ.
   - Mở nhiều tab cùng lúc an toàn: tab này lưu thì các tab khác tự nạp lại, không ghi đè dữ liệu của nhau.
   - **Gộp khi lưu (v0.1.1):** trước mỗi lần lưu, app kiểm tra xem tab hay cửa sổ khác có vừa ghi mà tab này chưa biết không (tab bị trình duyệt tạm dừng, trang mở lại từ bộ nhớ đệm, bản cũ của app còn mở). Nếu có thì gộp hai bên thay vì ghi đè. Bản cũ (không có cơ chế gộp) lưu đè thì app gộp lại ngay, hoặc ở lần mở sau nhờ bản sao lần ghi gần nhất (`lc2_mine`). Hộp việc được gộp theo từng việc.
   - **Bản tự lưu hằng ngày:** đầu mỗi ngày app giữ một bản (7 ngày gần nhất, trên máy đó). Cài đặt → Dữ liệu → *Bản tự lưu hằng ngày* → *Gộp lại* để thêm lại những hoạt động bị thiếu, không xóa gì.
9. 📱 **Chuẩn Progressive Web App (PWA)**:
   - Tích hợp `manifest.json` và `icon.svg` 5 cánh hoa độc quyền.
   - Cài đặt lên màn hình chính iPhone/Android, chạy toàn màn hình như Native App.
10. 📅 **Đẩy Một Chiều Sang Google Calendar (Google Calendar API v3)**:
   - Tích hợp chuẩn **Google Identity Services (GIS)** OAuth 2.0 cấp quyền trực tiếp phía Client (không cần máy chủ trung gian).
   - **Một chiều:** Life Capital → Google Calendar. Sửa hoặc xóa trực tiếp trên Google Calendar **không** cập nhật ngược về app, và có thể bị ghi đè ở lần đồng bộ sau.
   - Tự động đẩy khi **Thêm, Sửa, Xóa** hoạt động (kể cả chuỗi lặp định kỳ). Các thay đổi được xếp hàng và gửi lần lượt từng cái, nên không bị Google giới hạn tần suất khi tạo chuỗi dài.
   - **Không mất thay đổi:** quyền truy cập Google chỉ có hiệu lực 1 giờ. Khi hết hạn hoặc mất mạng, thay đổi được giữ ở trạng thái "chờ"; thanh tiêu đề hiện badge `⚠ GCal · Kết nối lại (N chờ)` hoặc `⏳ N chờ đồng bộ`. Bấm vào badge để kết nối lại, các thay đổi đang chờ sẽ được đẩy lên tự động.
   - Hoạt động chưa đặt giờ được tạo thành sự kiện cả ngày trên Google Calendar. Dữ liệu mẫu không bao giờ được đẩy lên.
   - Khi tắt *Tự động đồng bộ*: thêm và sửa không được gửi lên, nhưng lệnh **xóa** hoạt động đã có trên Google vẫn được ghi lại và hiện badge `⏳ N chờ đồng bộ (tự động đang tắt)`; bấm badge, bật lại tự động hoặc bấm *Đồng bộ tuần này* để gửi.
   - Tự động ánh xạ màu sắc Google Calendar (`colorId`) tương thích với 5 loại vốn sống (Xanh lá - Sức khỏe, Hồng - Quan hệ, Tím - Trải nghiệm, Xanh Cyan - Kỹ năng, Vàng - Tài chính).
   - Cung cấp nút đồng bộ hàng loạt `⟳ Đồng bộ tuần này` và công tắc bật/tắt tự động đồng bộ thời gian thực trong popup Cài đặt.
11. 🌱 **Khởi Đầu Trống & Dữ Liệu Mẫu Tùy Chọn**:
   - Lần đầu mở app, lịch trống kèm gợi ý cách ghi nhanh và nút **"Thử với dữ liệu mẫu"**: thêm khoảng 10 hoạt động ẩn danh vào tuần đang xem.
   - Dòng "Dữ liệu mẫu" có nút xóa toàn bộ dữ liệu mẫu bằng một chạm. Hoạt động mẫu nào bạn đã sửa sẽ được giữ lại như dữ liệu thật.
   - Dữ liệu mẫu đặt sẵn mục tiêu giờ/tuần cho các loại vốn chưa có mục tiêu, để bánh xe cân bằng có số ngay; Xóa mẫu thì bỏ các mục tiêu mẫu chưa sửa.
12. 🏷️ **Tùy Biến Từ Khóa Nhận Diện & Trí Nhớ AI Tự Học (Keyword Auto-tagging & Self-learning)**:
   - Cho phép người dùng tự do thêm/bớt từ khóa nhận diện cho từng loại vốn trong tab Danh mục vốn.
   - Loại vốn được đoán theo từ khóa khớp dài nhất (*học tiếng Anh* → Kỹ năng, không bị nhầm sang Quan hệ vì chữ *anh*).
   - Bộ nhớ `S.mem` ghi nhớ loại vốn bạn chọn trong popup cho từng tên hoạt động, để lần sau ghi nhanh cùng tên sẽ đoán đúng.

13. 📥 **Hộp Việc Chờ (v0.2.0)**:
   - Ghi những việc còn mơ hồ chưa có ngày giờ: ở tab **Hộp việc**, hoặc gõ dấu `+` ở đầu thanh ⚡ (vd *+ Chuẩn bị chuyến đi Đà Lạt*).
   - Chia mỗi việc thành các **việc nhỏ** có thứ tự và thời lượng (*Đặt vé xe 30p*, *Đặt homestay 1h30*; không ghi thì 1h). Đổi thứ tự bằng kéo hoặc nút Lên/Xuống trong khay **⋯**; bấm tên để sửa; tick khi xong.
   - Thẻ việc gọn (v0.6.0): tên, nút **Xếp/Xếp hết** và **⋯**; dòng dưới ghi loại vốn, đã xếp bao nhiêu, hạn, dự án. Đổi loại vốn, hạn, dự án, thứ tự và xóa nằm trong khay ⋯. Số trên tab Hộp việc là số việc còn phần chưa xếp, khớp số thẻ.
   - **Máy tính:** ở Tuần chi tiết và Dòng thời gian 24h, hộp việc hiện thành cột bên phải. Kéo một việc nhỏ thả vào khung giờ (làm tròn 15 phút) hoặc vào một ngày (chọn giờ, gợi ý khung trống sớm nhất từ 08:00). Kéo dòng tên việc để **xếp cả việc** (xem mục 15 Xếp thông minh).
   - **iPhone:** bấm **Xếp lịch** trên việc nhỏ (hoặc **Xếp cả việc**), chọn ngày, giờ hoặc một khung trống gợi ý.
   - Việc nhỏ đã xếp là một hoạt động bình thường trên lịch (tính vào vốn, đồng bộ Google Calendar). Sửa giờ trên lịch thì nhãn "Đã xếp" trong hộp đổi theo; xóa hoạt động hoặc bấm **Đưa về hộp việc** trong popup thì việc nhỏ quay lại hộp.
   - Mỗi việc có thể đặt **hạn** (v0.6.0); việc chưa xong mà quá hạn hiện nhãn đỏ.

14. 🗂️ **Dự Án Kiểu Asana (v0.5.0, làm lại ở v0.6.0)**:
   - Gắn hoạt động và việc vào một dự án (không bắt buộc). Dự án có tên, màu, trạng thái, ưu tiên, ngày bắt đầu/kết thúc, loại vốn mặc định; tên dự án được ghi vào mô tả sự kiện Google Calendar.
   - Tab **Dự án** là danh sách dự án (sức khỏe, % việc xong, giờ tuần này). Bấm một dự án để mở trang riêng; nút ← hoặc Quay lại của trình duyệt về danh sách. Máy tính rộng có cột dự án bên trái.
   - Trang dự án có 4 chế độ xem: **Tổng quan** (cập nhật trạng thái Đúng tiến độ / Có rủi ro / Chậm, số liệu, việc cần chú ý, mốc, mô tả, giờ theo tuần), **Danh sách**, **Bảng**, **Timeline** (thu phóng Ngày / Tuần / Tháng).
   - Mỗi **mục** là một việc trong Hộp việc (kèm việc nhỏ và các buổi đã xếp) hoặc một **chuỗi hoạt động** cùng tên (vd 12 buổi "Chạy dài" thành một dòng). Chia mục theo **phần** tự đặt tên; đổi phần bằng kéo thả (máy tính) hoặc ô Chuyển (điện thoại).
   - Thêm việc ngay trong từng phần; tích xong có Hoàn tác; bấm một mục để mở bảng chi tiết (sửa tên, phần, hạn, loại vốn, việc nhỏ, xếp lịch).
   - Ghi nhanh: `#tên` gắn dự án cho hoạt động, `+ #tên việc` thêm việc vào dự án.

15. 🧭 **Xếp Thông Minh (v0.6.0)**:
   - **Xếp hết** đặt các việc nhỏ theo đúng thứ tự, lách qua lịch bận, rải sang nhiều ngày; chỉ trong khung giờ xếp việc (mặc định 08:00–22:00) và tối đa 2 giờ mỗi ngày cho một việc (đổi trong Cài đặt › Mặc định).
   - Có hạn thì xong trước hạn ít nhất 1 ngày. Hạn đứng trên mọi kiểu cân bằng: không kịp thì dồn làm sớm nhất (bỏ giới hạn mỗi ngày), vẫn không kịp thì nới khung 06:00–24:00, cuối cùng báo "Không kịp hạn" và giữ phần còn lại trong hộp.
   - Không có hạn gấp thì để sau những tuần mà loại vốn của việc đã đạt mục tiêu.
   - Việc nhỏ đã qua giờ mà chưa xong là **lỡ**; nút **Xếp lại** dời sang khoảng trống từ bây giờ. Mỗi lần Xếp hết có Hoàn tác; phần xem trước đổi thứ tự (↑ ↓) và bỏ bớt việc (ô tích) được.

16. 🔁 **Thói Quen (v0.6.0)**:
   - Dải **Thói quen** dưới 4 ô số liệu ở tab Lịch: tên, chuỗi hiện tại và 7 chấm của tuần; điện thoại vuốt ngang.
   - **Tự đếm** các buổi cùng tên trên lịch (không phân biệt hoa thường, có dấu hay không) hoặc **tích tay** bằng nút ✓.
   - Chuỗi kiểu mềm: theo **số lần mỗi tuần** thì đếm số tuần liên tiếp đạt; **mỗi ngày** thì mỗi tuần được nghỉ 1 ngày. Hôm nay, tuần này chưa xong không làm đứt chuỗi.
   - Bảng chi tiết: chuỗi, kỷ lục, lưới 26 tuần, tích bù trong tuần, **Xếp 1 buổi**, lưu trữ, xóa có Hoàn tác. Popup hoạt động có ô **Theo dõi thành thói quen**; app gợi ý khi một hoạt động lặp lại 3 ngày trong 2 tuần; mốc 7/21/30/66 ngày hoặc 4/8/12/26/52 tuần báo bằng thông báo nhỏ.

17. 🩺 **Sức Khỏe Và Hồ Sơ (v0.6.0)**:
   - Tab **Sức khỏe** theo bố cục app Sức khỏe của iPhone: Tóm tắt (thẻ Hôm nay đứng đầu để ghi nhanh, điểm Sẵn sàng khi tính được, Điểm nổi bật, thẻ ghim), Duyệt theo nhóm (Triệu chứng, Tâm lý, Giấc ngủ, Thuốc và TPCN, Cơ thể, Chu kỳ), Nhật ký từng ngày.
   - Ghi mỗi ngày: tâm trạng, căng thẳng, giờ ngủ, triệu chứng (có sẵn và tự thêm, 3 mức), thuốc và TPCN đã dùng, cân nặng, chiều cao, ghi chú. Chu kỳ kinh nguyệt khi hồ sơ là Nữ: dự đoán kỳ tới, rụng trứng (kỳ tới − 14 ngày), giai đoạn dễ thụ thai.
   - Gợi ý theo quy tắc cố định (không AI), có số cụ thể và dấu hiệu cần đi khám; dùng cả dữ liệu lịch (giờ làm việc, giờ cho Quan hệ, Sức khỏe). BMI theo ngưỡng châu Á; kiểm tra nhanh PHQ-2, GAD-2.
   - Tab **Tôi**: hồ sơ (tên gọi, ngày sinh, giới tính, chiều cao, cân nặng), Danh mục vốn (nút Xóa từng loại vốn chỉ hiện sau khi bấm **Xóa bớt**; Từ khóa nhận diện thu gọn), Cài đặt (lối vào duy nhất, thanh bên không còn nút Cài đặt). Công tắc đồng bộ dữ liệu sức khỏe; không bao giờ gửi sang Google Calendar.
   - Phần 2: Điều ảnh hưởng tới bạn (so ngày có/không có hoạt động, thuốc, căng thẳng với tâm trạng và triệu chứng), Check-in tối (nút hiện ở thẻ Hôm nay sau 19h khi chưa ghi tâm trạng; giờ nhắc và tệp lịch ở tab Tôi), chu kỳ theo 4 giai đoạn với tín hiệu rụng trứng (nhiệt độ, dịch, que LH) và chế độ kín đáo, Báo cáo cho bác sĩ (in, PDF, HTML) và Thẻ y tế khẩn cấp, vòng Vận động 150 phút/tuần từ lịch, điểm Sẵn sàng 0–100 nối với Xếp hết.

18. 🧹 **Giao Diện Gọn (v0.6.0)**:
   - Một hàng chọn tuần (◀ Tuần 43 · 19/10 – 25/10/2026 ▶) cạnh Tuần/Ngày/Năm; lùi qua tuần 1 hay tiến qua tuần cuối thì tự sang năm kề bên, không còn chọn năm trên tiêu đề. Đang xem tuần khác thì có nút **Tuần này**.
   - Mỗi tab một nút **Thêm** ở đầu trang (Lịch: hoạt động, ở chế độ Ngày thì thêm vào ngày đang xem; Hộp việc: việc; Dự án: dự án hoặc việc của dự án đang mở; Sức khỏe: nhật ký hôm nay). Thêm hoạt động cho dự án nằm trong menu ⋯ của trang dự án; mỗi ngày trong tuần có nút + nhỏ.
   - Ô ghi nhanh chỉ hiện ở Lịch, Hộp việc, Dự án; phím `/` ở tab khác sẽ chuyển về Lịch. Tên tab giống nhau trên máy tính và điện thoại; điện thoại ẩn dòng mô tả dưới tiêu đề.
   - Tổng quan: Nhận định mặc định tính theo tuần đang xem (khớp bánh xe), chọn được trung bình 4/8 tuần hoặc mọi tuần; chưa đặt mục tiêu thì chỉ còn một nút Đặt mục tiêu. Thẻ **Giờ đã ghi** chia theo loại vốn (không tính trên 168h). Số vừa đổi được tô nền 4 giây rồi tự tắt.
   - Popup hoạt động chỉ hiện ô Đến ngày khi chọn lặp lại.
   - Tổng kết theo loại vốn ở tab Lịch và đầu popup Tổng kết: mỗi loại vốn một ô (giờ trong tuần / mục tiêu, thanh màu, đánh dấu vốn yếu nhất), dòng trên ghi tổng giờ, số hoạt động, điểm cân bằng.
   - Thứ bậc chính phụ: tiêu đề và hàng chọn tuần nằm trên nền, thẻ nội dung nền đặc viền rõ, phần phụ nền nhạt. Lịch tuần mỗi ngày một cột có viền, đầu cột thứ/ngày/tổng giờ, hôm nay viền màu nhấn, ngày đã qua nhạt hơn; từ 960px là 7 cột.
   - Nút cùng loại cùng kiểu: xóa trên một dòng luôn là ✕, đổi thứ tự luôn là ↑ ↓.
   - Chế độ Ngày và Năm dùng cùng quy ước với Tuần (đầu cột thứ/ngày, hôm nay viền màu nhấn và ngày tô nền, ngày đã qua nhạt, hoạt động nền màu vốn nhạt có vạch trái). Mọi nút và thanh một màu, không chuyển màu.

---

## 4. Hướng dẫn Triển khai & Sử dụng

### Cách 1: Sử dụng Offline trên máy tính
Chỉ cần nhấp đúp vào tệp `index.html` để mở trực tiếp trên trình duyệt (Chrome, Safari, Edge, Brave).
> ⚠ Khi mở trực tiếp từ tệp (`file://`), **Google Calendar không hoạt động**, vì Google chỉ chấp nhận trang chạy qua HTTPS hoặc `localhost`. Muốn dùng Google Calendar trên máy, hãy chạy `python3 -m http.server 8765` trong thư mục dự án rồi mở `http://localhost:8765`.

### Cách 2: Đưa lên Hosting miễn phí (Vercel / Netlify / GitHub Pages)
- **Qua Netlify Drop (30 giây)**: Kéo cả thư mục `life-capital` thả vào [app.netlify.com/drop](https://app.netlify.com/drop).
- **Qua GitHub + Vercel**: Đẩy 3 tệp (`index.html`, `manifest.json`, `icon.svg`) lên kho GitHub rồi kết nối với Vercel để nhận đường link HTTPS miễn phí vĩnh viễn (vd: `https://lifecapital.vercel.app`).

### Cài đặt thành App trên iPhone:
1. Mở link trên **Safari**.
2. Nhấn nút **Chia sẻ** (biểu tượng hình vuông có mũi tên lên).
3. Chọn **Thêm vào Màn hình chính** (Add to Home Screen).

Nên cài theo cách này thay vì dùng tab Safari thường: Safari có thể xóa dữ liệu của trang web không được mở trong 7 ngày, còn app đã thêm vào Màn hình chính thì không bị.

### Cấu hình Google Calendar (tùy chọn)
1. Vào [Google Cloud Console](https://console.cloud.google.com/) → tạo project → **APIs & Services → Library → Google Calendar API → Enable**. Thiếu bước này, Google từ chối mọi sự kiện và app báo "Google Calendar API chưa được bật".
2. **OAuth consent screen**: chọn *External*, giữ chế độ **Testing**, thêm scope `https://www.googleapis.com/auth/calendar.events`.
3. Ở mục **Test users**, thêm email Google của **từng người** sẽ dùng tính năng này (tối đa 100 người). Người không có trong danh sách sẽ gặp lỗi `access_denied`.
4. **Credentials** → *Create OAuth client ID* → *Web application*. Ở **Authorized JavaScript origins**, thêm địa chỉ bạn deploy (vd `https://lifecapital.vercel.app`) và `http://localhost:8765` nếu chạy trên máy.
5. Trong app: `⚙️ Cài đặt` → dán **Client ID** → **Kết nối Google Calendar**. Trên màn hình của Google, nhớ **tick ô cho phép truy cập Google Calendar**; nếu bỏ tick, app sẽ báo và yêu cầu kết nối lại.

---

## 5. Mã nguồn

Toàn bộ app nằm trong [`index.html`](index.html) ở thư mục gốc repo (HTML, CSS, JavaScript trong một tệp), kèm [`sw.js`](sw.js) (chạy khi mất mạng), [`manifest.json`](manifest.json) và các biểu tượng. Không cần bước build.

- Bản đang chạy: https://lifecapital.vercel.app
- Ghi chú phát hành từng phiên bản: [`CHANGELOG.md`](CHANGELOG.md)
- Cấu trúc bảng và quy tắc bảo mật trên Supabase: [`supabase/schema.sql`](supabase/schema.sql)
- Test tự động cho phần gộp dữ liệu: [`tests/merge-tests.html`](tests/merge-tests.html). Chạy `python3 -m http.server 8765` ở thư mục gốc repo rồi mở `http://localhost:8765/tests/merge-tests.html`; tiêu đề trang hiện `PASS 20/20` khi đạt.
- Chạy thử trên máy: `python3 -m http.server 8765` ở thư mục gốc repo rồi mở `http://localhost:8765`.
