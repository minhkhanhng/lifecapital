# Life Capital · Quản trị Năng lượng & Thời gian

Ứng dụng web cá nhân hoá giúp quản trị năng lượng, tối ưu hoá quỹ 168 giờ và cân bằng 5 loại vốn cuộc sống (Health, Relationship, Experience, Skill, Finance & Career).

---

## 1. Triết lý & Mô hình Cốt lõi

- **5 Loại Vốn Cuộc Sống (The 5 Life Capitals)**:
  1. 🌿 **Sức khỏe (Health)** `#97A13B` - Thể lực, giấc ngủ, rèn luyện, dinh dưỡng, tái tạo năng lượng thể chất.
  2. 🌸 **Quan hệ (Relationship)** `#E0A3BB` - Gia đình, bạn bè, người thương, kết nối xã hội sâu sắc.
  3. 🔮 **Trải nghiệm (Experience)** `#8b6da9` - Khám phá, du lịch, nghệ thuật, niềm vui sống, mở rộng góc nhìn.
  4. 🌊 **Kỹ năng (Skill)** `#4a859c` - Học hỏi, đọc sách, tích luỹ tri thức, rèn luyện chuyên môn.
  5. 🪙 **Tài chính / Công việc (Finance & Career)** `#b88628` - Sự nghiệp, tạo ra giá trị, quản lý tài sản.

- **Cơ chế Nạp ▲ (Recharge) vs Tiêu ▼ (Drain)**:
  - **Nạp (▲)**: Hoạt động bồi đắp, tích luỹ và phục hồi vốn sống.
  - **Tiêu (▼)**: Hoạt động tiêu hao, sử dụng năng lượng hoặc tạo áp lực (họp hành, deadline, làm việc căng thẳng).

- **Khung 168 Giờ (The 168-Hour Framework)**:
  - 1 tuần = 24h × 7 ngày = 168 giờ.
  - Mọi người đều có 168 giờ bình đẳng như nhau. Ứng dụng giúp bạn nhìn rõ số giờ đã phân bổ, số giờ còn trống cho sinh hoạt cá nhân và cảnh báo khi ghi chép vượt quá 168h.

- **Chỉ số Pin Năng Lượng (Daily Battery & Burnout Warning)**:
  - Cán cân mỗi ngày: Net = Tổng Nạp (▲) - Tổng Tiêu (▼).
  - Pin xanh khi nạp dương, pin đỏ khi tiêu hao nhiều hơn nạp.
  - Cảnh báo **⚡ Kiệt sức** tự động kích hoạt nếu ngày đó có từ 6h tiêu hao hoặc thâm hụt ≥ 4h mà không được nghỉ ngơi bù đắp (có thể tùy chỉnh ngưỡng trong Cài đặt).

- **Bánh xe cuộc đời (Wheel of Life Radar Chart)**:
  - Biểu đồ radar 5 trục SVG chuẩn công thái học thể hiện độ tròn trịa và cân bằng giữa các nguồn vốn mỗi tuần.
  - Tích hợp vòng đo 33% - 66% - 100% mục tiêu, tính toán tự động Điểm cân bằng bánh xe (Balance Score).

---

## 2. Bảng Màu & Hệ thống Thiết kế (Design System)

- **Màu chủ đạo (Primary)**: `#E0A3BB` (Mauve Rose)
- **4 Màu bổ trợ (Supporting)**:
  - `#F4DFE6` (Blush Soft) - Nền thanh tiến trình, hover state, card phụ
  - `#D6E6E7` (Mist Cyan) - Nhãn thời gian, trạng thái pin cân bằng
  - `#C5CC82` (Sage Olive) - Trạng thái nạp nhẹ, nhãn đạt chuẩn
  - `#97A13B` (Deep Olive Green) - Chỉ báo Nạp ▲, pin sạc dương
- **Nền web**: Pha thêm 5% màu trắng (`#fdfcfd` / `color-mix(in srgb, #faf7f8 95%, #ffffff 5%)`) mang lại cảm giác sáng sủa, thanh lịch và trong trẻo.
- **Hỗ trợ giao diện Sáng / Tối (Light & Dark Mode) chuẩn công thái học**:
  - Hỗ trợ chuyển đổi thủ công hoặc tự động theo hệ điều hành (`color-scheme: dark`).
  - Nền tối sâu trầm ấm `#151113`, thẻ `#1f191c`, chữ tương phản cao, chống lóa mắt vào ban đêm.

---

## 3. Các Tính năng Nổi bật & Tối ưu Hoàn thiện

1. ⚡ **Command Bar Ghi nhanh bằng ngôn ngữ tự nhiên**:
   - Nhập: *"Mai 18h đánh cầu lông 2 tiếng"* hoặc *"Hôm nay 20h đọc sách 1h"*.
   - Tự động nhận diện ngày, giờ bắt đầu, thời lượng, loại vốn và tác động Nạp/Tiêu theo thời gian thực; dòng xem trước luôn ghi rõ thứ và ngày (vd *Hôm qua · Thứ 5, 08/10*).
   - **Ngày:** *hôm nay, mai, ngày kia/mốt, hôm qua, tối qua, hôm kia*; ngày cụ thể *ngày 9 tháng 10 (năm 2026), 9 tháng 11, 09/10, 09-10, 09.10, 9/10/2026, ngày 15*; thứ *thứ 2 / t2 / thứ hai / chủ nhật* kèm *tuần này, tuần sau, tuần tới, tuần trước, tuần sau nữa* (đứng trước hoặc sau). Không nói tuần thì hiểu là lần tới gần nhất.
   - **Giờ:** *18h, 6h30, 20:00, 5h sáng, 2 giờ chiều, tối 8h, 8 giờ rưỡi, 12h đêm, 14-16h, 2-4h chiều*.
   - **Thời lượng:** *2 tiếng, 1.5h, 1h30, 1 tiếng 30 phút, một tiếng rưỡi, hai tiếng, 45 phút, mười lăm phút, nửa tiếng*.
   - "Mai" là tên người khi đi sau *gặp, cho, với…* hoặc viết hoa giữa câu (*Gọi điện cho Mai 20h*).
2. 📅 **3 Chế độ Xem Lịch Biểu**:
   - **Tuần chi tiết**: 7 thẻ ngày responsive kèm Pin năng lượng và nút thêm nhanh.
   - **Dòng thời gian 24h (Timeline)**: Trục thời gian dọc từ 06:00 đến 24:00, trực quan hoá các khối sự kiện. Tích hợp thuật toán **chia làn song song (Lane Splitting)** khi các sự kiện bị trùng khung giờ.
   - **Lưới 53 tuần**: Toàn cảnh cả năm có thanh cuộn và tự động định vị tuần hiện tại.
3. ⚙️ **Trung Tâm Cài Đặt & Dữ Liệu Tinh Gọn (Settings Modal)**:
   - Nút `⚙️` trên header tập trung toàn bộ cấu hình: Chuyển theme (Sáng/Tối/Theo máy), Sao lưu JSON/CSV, Khôi phục, Đặt thời lượng mặc định và Ngưỡng báo kiệt sức.
   - Thanh điều hướng chính gồm 4 tab: **Lịch biểu**, **Hộp việc**, **Tổng quan & 168h**, **Danh mục vốn**.
4. 🏆 **Bản Tin Tổng Kết Tuần Linh Hoạt (Weekly Review with Week Selector)**:
   - Cho phép chọn xem báo cáo tổng kết của **bất kỳ tuần nào** trong năm (từ W1 đến W52/53) qua bộ chuyển tuần `[ ◀ | ▶ ]` và menu thả xuống ngay trong popup.
   - Đánh giá Điểm sáng của tuần, Vốn cần cứu trợ, Bánh xe cuộc đời và gợi ý kế hoạch tuần mới.
5. 🛠️ **Popup Thêm / Sửa Hoạt Động Tinh Gọn**:
   - Giao diện form tinh gọn chỉ gồm các trường thông tin cần thiết, tự động đóng popup khi bấm Lưu.
   - Nhập bằng bàn phím: trong popup, mỗi lần nhấn Enter chuyển sang ô kế tiếp (Tên → Loại vốn → Tác động → Giờ bắt đầu → Thời lượng → Lặp lại → Đến hết ngày); Enter ở ô cuối cùng thì lưu. Khi đang gõ có dấu, một lần Enter vừa chốt chữ vừa chuyển ô. `Cmd/Ctrl + Enter` lưu ngay từ bất kỳ ô nào.
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
   - Banner "Đang dùng dữ liệu mẫu" có nút xóa toàn bộ dữ liệu mẫu bằng một chạm. Hoạt động mẫu nào bạn đã sửa sẽ được giữ lại như dữ liệu thật.
12. 🏷️ **Tùy Biến Từ Khóa Nhận Diện & Trí Nhớ AI Tự Học (Keyword Auto-tagging & Self-learning)**:
   - Cho phép người dùng tự do thêm/bớt từ khóa nhận diện cho từng loại vốn trong tab Danh mục vốn.
   - Loại vốn được đoán theo từ khóa khớp dài nhất (*học tiếng Anh* → Kỹ năng, không bị nhầm sang Quan hệ vì chữ *anh*).
   - Bộ nhớ `S.mem` ghi nhớ loại vốn bạn chọn trong popup cho từng tên hoạt động, để lần sau ghi nhanh cùng tên sẽ đoán đúng.

13. 📥 **Hộp Việc Chờ (v0.2.0)**:
   - Ghi những việc còn mơ hồ chưa có ngày giờ: ở tab **Hộp việc**, hoặc gõ dấu `+` ở đầu thanh ⚡ (vd *+ Chuẩn bị chuyến đi Đà Lạt*).
   - Chia mỗi việc thành các **việc nhỏ** có thứ tự và thời lượng (*Đặt vé xe 30p*, *Đặt homestay 1h30*; không ghi thì 1h). Đổi thứ tự bằng kéo hoặc nút ↑ ↓; bấm tên để sửa; tick khi xong.
   - **Máy tính:** ở Tuần chi tiết và Dòng thời gian 24h, hộp việc hiện thành cột bên phải. Kéo một việc nhỏ thả vào khung giờ (làm tròn 15 phút) hoặc vào một ngày (chọn giờ, gợi ý khung trống sớm nhất từ 08:00). Kéo dòng tên việc để **xếp cả việc**: các việc nhỏ chưa xếp được đặt liền nhau theo thứ tự, có bản xem trước chỗ trùng và việc không vừa trong ngày.
   - **iPhone:** bấm **Xếp lịch** trên việc nhỏ (hoặc **Xếp cả việc**), chọn ngày, giờ hoặc một khung trống gợi ý.
   - Việc nhỏ đã xếp là một hoạt động bình thường trên lịch (tính vào vốn, đồng bộ Google Calendar). Sửa giờ trên lịch thì nhãn "Đã xếp" trong hộp đổi theo; xóa hoạt động hoặc bấm **Đưa về hộp việc** trong popup thì việc nhỏ quay lại hộp.

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
