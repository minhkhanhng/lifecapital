# 📋 Hướng Dẫn & Tài Liệu Đánh Giá Dự Án (Claude Review Guide)
## Dự án: Life Capital · Quản trị Năng lượng & Thời gian 168 Giờ

Tài liệu này được chuẩn bị để gửi kèm dự án cho **Claude** (Anthropic) đánh giá, review mã nguồn và đề xuất cải tiến toàn diện.

---

## 1. Tổng Quan Dự Án (Executive Summary)

- **Tên dự án**: Life Capital (Quản trị Năng lượng & Thời gian 168 Giờ).
- **Mục tiêu**: Ứng dụng web cá nhân hoá giúp người dùng thoát khỏi bẫy kiệt sức (burnout), tối ưu hoá quỹ 168 giờ mỗi tuần và cân bằng 5 loại vốn cuộc sống.
- **Triết lý cốt lõi**:
  1. **5 Loại Vốn Cuộc Sống (5 Life Capitals)**:
     - 🌿 **Sức khỏe (Health - `sk`)**: Thể lực, giấc ngủ, rèn luyện, dinh dưỡng, tái tạo sinh học.
     - 🌸 **Quan hệ (Relationship - `qh`)**: Gia đình, bạn bè, kết nối xã hội sâu sắc.
     - 🔮 **Trải nghiệm (Experience - `tn`)**: Khám phá, du lịch, nghệ thuật, niềm vui sống.
     - 🌊 **Kỹ năng (Skill - `kn`)**: Học hỏi, đọc sách, tri thức, kỹ năng chuyên môn.
     - 🪙 **Tài chính / Công việc (Finance & Career - `tc`)**: Sự nghiệp, tạo ra giá trị, quản lý tài sản.
  2. **Cơ chế Nạp ▲ (Recharge) vs Tiêu ▼ (Drain)**:
     - Đo lường năng lượng ròng hàng ngày: $\text{Net} = \sum \text{Nạp (▲)} - \sum \text{Tiêu (▼)}$.
     - Cảnh báo kiệt sức (Burnout Alert) tự động khi thâm hụt năng lượng nghiêm trọng.
  3. **Khung Quỹ 168 Giờ (168-Hour Framework)**:
     - $24\text{h} \times 7\text{ ngày} = 168\text{ giờ/tuần}$. Đo lường tổng số giờ đã phân bổ, quỹ giờ tự do còn lại và cảnh báo quá tải $>168\text{h}$.
  4. **Bánh Xe Cuộc Đời (Wheel of Life)**:
     - Biểu đồ đa giác Radar SVG 5 trục, đo lường tỷ lệ đạt mục tiêu tuần và tính Điểm cân bằng (Balance Score).

---

## 2. Kiến Trúc Kỹ Thuật (Technical Architecture)

- **Hình thức**: **Pure Single-File SPA** (`index.html`) tích hợp toàn bộ HTML, CSS và JavaScript thuần (Vanilla JS ES6+).
- **Thư viện bên ngoài**: **Zero dependencies** (Không dùng React, Vue, jQuery, Tailwind hay bất kỳ npm package nào).
- **Thư viện tích hợp duy nhất**: Google Identity Services (`https://accounts.google.com/gsi/client`) cho OAuth 2.0 phía client.
- **Lưu trữ dữ liệu**: Local-first qua `localStorage` (khóa `lc2`), hoàn toàn chạy offline.
- **Hệ thống Design System**: Bảng màu Mauve Rose (`#E0A3BB`) kết hợp 4 màu bổ trợ, hỗ trợ Dark Mode / Light Mode chuẩn công thái học.
- **Tiêu chuẩn PWA**: Có `manifest.json` và `icon.svg` vector độc quyền, cài đặt chạy toàn màn hình như native app trên iOS và Android.

---

## 3. Các Module Chính Trong Mã Nguồn (`index.html`)

| Module | Vị trí / Hàm chính | Chức năng |
| :--- | :--- | :--- |
| **State Management** | `defState()`, `S`, `save()`, `cleanState()` | Quản lý state tập trung, tự động lưu `localStorage`, chống Prototype Pollution. |
| **ISO 8601 Engine** | `getWeeksOfYear(year)`, `changeYear(delta)` | Tính toán 52/53 tuần chính xác theo chuẩn ISO, chuyển đổi đa năm tự động. |
| **NLP Quick Input** | `parseNLPText()`, `executeNLP()`, `guess()` | Phân tích tiếng Việt tự nhiên (ngày, giờ, thời lượng, tác động, loại vốn, nhận diện xung đột giờ). |
| **Radar Chart Engine** | `renderRadarChartSVG(weekIdx)` | Vẽ biểu đồ Radar SVG thuần 5 trục, vòng cấp độ 33%–66%–100%, tính độ cân bằng. |
| **Review Engine** | `openWeeklyReviewModal(weekIdx)` | Báo cáo phân tích cao điểm nạp/tiêu, vốn dẫn đầu/tụt hậu, kế hoạch hành động theo tuần. |
| **Google Calendar Sync** | `gcalCreateEvent()`, `gcalUpdateEvent()`, `gcalDeleteEvent()`, `gcalSyncWeek()` | Tích hợp Google Calendar API v3 qua GIS OAuth 2.0: đồng bộ CRUD hai chiều thời gian thực, mapping màu 5 loại vốn, batch sync. |
| **View Controller** | `V.ca()` (Lịch biểu), `V.su()` (Hiệu suất & 168h), `V.set()` (Danh mục vốn & Từ khóa) | Hệ thống render view phản ứng tự động theo `draw()`. |

---

## 4. Các Tệp Tin Trong Gói Dự Án

1. `index.html`: Toàn bộ mã nguồn hoàn chỉnh của ứng dụng web.
2. `life-capital.md` / `README.md`: Bản đặc tả chi tiết về triết lý, thiết kế, tính năng và hướng dẫn triển khai.
3. `manifest.json`: Cấu hình Web App Manifest chuẩn PWA.
4. `icon.svg`: Biểu tượng vector ứng dụng (5 cánh hoa đại diện cho 5 loại vốn).
5. `CLAUDE_REVIEW_GUIDE.md`: Bản tài liệu này.

---

## 5. Mẫu Câu Lệnh (Prompt) Sẵn Sàng Gửi Cho Claude

Bạn có thể sao chép đoạn prompt dưới đây và gửi trực tiếp cho Claude cùng với tệp `index.html` và `life-capital.md`:

```text
Chào Claude,

Tôi gửi kèm mã nguồn của dự án "Life Capital" (gồm file index.html và file tài liệu life-capital.md). Đây là một ứng dụng web Single-Page Application (SPA) độc lập, không dùng framework (Vanilla JS/HTML/CSS), hoạt động offline-first với LocalStorage và tích hợp Google Calendar API v3 qua Google Identity Services (GIS).

Ứng dụng được xây dựng dựa trên triết lý quản trị năng lượng 168 giờ và cân bằng 5 loại vốn cuộc sống (Sức khỏe, Quan hệ, Trải nghiệm, Kỹ năng, Tài chính).

Nhờ Claude thực hiện một đợt Senior Code Review & Product Review toàn diện với các trọng tâm sau:

1. Kiến trúc mã nguồn & Chất lượng Code:
   - Đánh giá kiến trúc Single-File SPA: State management, cơ chế render phản ứng tự động (draw loop), hiệu năng bộ nhớ khi chạy lâu dài.
   - Khả năng mở rộng và tính module hóa của mã nguồn hiện tại. Có rủi ro nào về memory leak, event listener hay biến toàn cục không?

2. Trải nghiệm người dùng (UX/UI & Usability):
   - Đánh giá bảng màu Mauve Rose (#E0A3BB) và Dark/Light mode hiện tại.
   - Đánh giá 3 chế độ xem lịch (Tuần chi tiết, Dòng thời gian 24h có chia làn song song, Lưới 53 tuần).
   - Đánh giá Biểu đồ Bánh xe cuộc đời (SVG Radar chart) và Báo cáo tổng kết tuần (Weekly Review Sheet).

3. Tính năng Đồng bộ Google Calendar API v3:
   - Đánh giá luồng xác thực Client-side OAuth 2.0 (GIS Token Client), cách lưu trữ access token và cơ chế tự động đồng bộ khi Thêm / Sửa / Xóa.
   - Các edge case tiềm ẩn: Token hết hạn (401), mất mạng offline, xung đột mạng, đồng bộ hàng loạt (rate limit).

4. Robustness, Bảo mật & Xử lý biên (Edge Cases):
   - Tính toán lịch ISO 8601 (năm 52 vs 53 tuần, năm nhuận, múi giờ).
   - Bộ parser NLP tiếng Việt: độ nhạy, khả năng bắt lỗi, gõ tiếng Việt có dấu với phím Enter.
   - Xử lý giới hạn dung lượng localStorage và cơ chế phòng chống XSS / Prototype Pollution / CSV Injection.

5. Đề xuất cải tiến & Lộ trình phát triển tiếp theo (Next Steps Roadmap):
   - Những tính năng nào có giá trị cao nhất nên bổ sung tiếp theo để Life Capital trở thành một công cụ cá nhân xuất sắc?

Vui lòng đưa ra nhận xét chi tiết, thẳng thắn và kèm theo các đoạn code cải tiến mẫu cụ thể nếu có!
```
