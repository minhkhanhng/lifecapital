# Life Capital: Senior Code Review & Product Review

**Phạm vi:** `index.html` (3.496 dòng: ~1.000 dòng CSS, ~2.400 dòng JS), `life-capital.md` (= `README.md`, phần code nhúng giống hệt `index.html`), `manifest.json`, `icon.svg`.
**Cách review:** đọc toàn bộ mã nguồn, sau đó **chạy app thật trong trình duyệt** và gọi trực tiếp các hàm (`parseNLPText`, `cleanState`, `buildGCalEventPayload`, `getWeeksOfYear`…) để kiểm chứng. Những mục ghi **[Đã kiểm chứng]** là lỗi tôi đã tái hiện được, không phải suy đoán.
**Bối cảnh bạn đã xác nhận:** đồng bộ GCal **một chiều** là đủ · chia sẻ cho **vài người quen** · dùng **cả iPhone lẫn máy tính, cần đồng bộ** · **thoải mái** về công nghệ (chấp nhận build tool và backend nhỏ).

Mức độ: 🔴 Nghiêm trọng (mất hoặc hỏng dữ liệu) · 🟠 Cao (sai chức năng chính) · 🟡 Trung bình · 🔵 Thấp hoặc cần dọn dẹp

---

## 0. Tóm tắt điều hành

**Điểm mạnh thật sự** (không phải lời khen xã giao):
- Triết lý sản phẩm rõ ràng và khác biệt: 168h + Nạp/Tiêu + 5 loại vốn là một khung tư duy tốt, không phải "thêm một app lịch nữa".
- Engine ISO 8601 **đúng**: tôi đã kiểm chứng các năm 2020/2026/2032/2037 có 53 tuần, 2021/2024/2025/2027 có 52 tuần, và Thứ Hai của W1 đều chính xác. Phép tính tuần dùng `Math.round(ms/864e5)` nên không bị lệch khi đổi giờ mùa hè (DST).
- `cleanState` + `SAFE_K` + `esc()` được áp dụng khá nhất quán. Tôi không tìm thấy đường XSS khai thác được từ dữ liệu người dùng hay file import.
- Thuật toán chia làn của timeline (gom cụm, rồi tô màu tham lam theo thời điểm bắt đầu) đúng về mặt lý thuyết và cho số làn tối thiểu.
- Đã làm nhiều việc về a11y mà các dự án cá nhân hay bỏ qua: focus trap, khôi phục focus, `aria-modal`, `prefers-reduced-motion`, `:focus-visible`.
- Chống CSV injection đúng chuẩn OWASP (thêm `'` trước `= + - @ \t \r`).

**Vấn đề lớn nhất:** phần **đồng bộ Google Calendar hỏng âm thầm sau mỗi lần tải lại trang**, và lớp lưu trữ **localStorage không đủ an toàn** cho một app "local-first" dùng trên iPhone. Hai việc này nên sửa trước mọi tính năng mới.

| # | Vấn đề | Mức |
|---|---|---|
| 1 | `cleanEv` xóa `gid` mỗi lần tải trang, làm mất liên kết với GCal: sửa thì không sync, xóa thì để lại sự kiện mồ côi, "Đồng bộ tuần" thì tạo bản trùng | 🔴 |
| 2 | `cleanState` xóa `gcalAutoSync`: người dùng tắt đồng bộ, tải lại trang thì đồng bộ **tự bật lại** | 🔴 |
| 3 | Token hết hạn sau 1 giờ thì sync **dừng im lặng**, không báo, không xếp hàng chờ, mất thay đổi | 🔴 |
| 4 | Safari xóa localStorage của website sau 7 ngày không mở; không có service worker, không có `storage.persist()` | 🔴 |
| 5 | Mở 2 tab cùng lúc thì tab cũ ghi đè dữ liệu của tab mới (không lắng nghe sự kiện `storage`) | 🟠 |
| 6 | Dữ liệu mẫu chứa **lịch cá nhân thật** của bạn ("Dinner w LHương"…) và sẽ hiện ra với mọi người bạn chia sẻ link | 🟠 |
| 7 | NLP: "1h30" thành 01:30 sáng, "5h sáng" thành 5 tiếng, "học tiếng Anh" bị xếp vào vốn Quan hệ… | 🟠 |
| 8 | GCal: sự kiện kết thúc 24:00 bị cắt còn 23:00; sự kiện 23:00 dài 1h có start = end nên API trả lỗi 400 | 🟠 |
| 9 | Chuỗi lặp "hằng ngày" bắn ~365 request song song, dính rate limit, phần lớn thất bại im lặng | 🟠 |
| 10 | Khi xem năm khác, **mọi tuần** đều hiện nhãn "Tuần hiện tại" | 🟡 |

---

## 1. Kiến trúc mã nguồn & chất lượng code

### 1.1 Bức tranh tổng thể
- **119 khai báo top-level** nằm trên global scope (`S`, `W`, `CW`, `N`, `V`, `ed`, `ei`, `al`, `ad`, `wk`, `tt`, `ky`, `CH`, `PV`, `LF`, `LFi`…). Tên 1–2 ký tự khiến code khó đọc, khó tìm kiếm, và dễ đụng độ với script khác (GIS tạo global `google`; extension trình duyệt cũng có thể chèn biến).
- **78 inline handler** (`onclick="..."`) và **168 thuộc tính `style="..."`** inline. Hậu quả:
  - Không thể bật CSP chặt (`script-src` không có `'unsafe-inline'`), mà CSP là lớp phòng thủ thứ hai rất quan trọng vì access token Google đang nằm trong localStorage (xem §3).
  - Code bị buộc phải là global, nên không tách được thành module.
  - Theme/dark mode bị phân tán: màu nằm trong chuỗi template thay vì CSS class.
- Phần view là **template string khổng lồ** (`V.ca`, `V.su`, `openWeeklyReviewModal`…), logic tính toán và markup trộn lẫn nhau. Các hàm domain thuần (NLP, lịch, thống kê) **không thể unit test** vì phụ thuộc biến global `S`, `W`, `CW`.

### 1.2 State management
- Một object `S` duy nhất, có thể sửa từ bất kỳ đâu (kể cả trong `onchange="BL('sk').u=..."` inline). Không có lớp "action" nên không có undo, không có log thay đổi, không biết cái gì đã đổi để sync.
- **Getter có side effect:** `BL(k)` tạo `S.bl[k]` ngay trong lúc render (`wk()` gọi `BL`), tức là đọc dữ liệu cũng làm thay đổi state.
- **Không có schema version cho `S`.** Migration đang làm rải rác (`if (!S.caps)`, `S.tg` cũ, `S.lb`). Bản export có `v:1` nhưng state lưu trong localStorage thì không có.
- **Sự kiện không có ID ổn định.** Mọi tham chiếu đều qua `(dateKey, index)` (`openEditor('2026-10-08', 2)`). Index thay đổi sau mỗi lần `sortL`, nên không làm được undo, sync, khử trùng khi import hay kéo-thả một cách an toàn. Import "Gộp" khử trùng bằng chữ ký `t|s|c|m|h|r`, vì vậy hai hoạt động giống hệt nhau trong cùng một ngày sẽ bị gộp làm một.

### 1.3 Draw loop & hiệu năng
- `draw()` = `$("v").innerHTML = V[cur]()`, render lại toàn bộ view sau mỗi thay đổi. Với quy mô dữ liệu cá nhân thì chấp nhận được, nhưng:
- 🟡 **Mỗi lần `draw()` đều render thêm toàn bộ tab "Tổng quan"** vào một `div` ẩn (`vals()` gọi `V.su()` rồi parse HTML) chỉ để tìm "số vừa thay đổi", **kể cả khi bạn đang ở tab Lịch**. Khi đang ở tab Tổng quan thì `V.su()` chạy 2 lần mỗi lần draw. Cơ chế này còn dựa vào regex trên HTML (`/(<[^>]*>)|(\d+(?:\.\d+)?[h%])/`) và đánh key theo **thứ tự xuất hiện** (`n0, n1, …`): chỉ cần thêm hay bớt một dòng là toàn bộ key lệch, đánh dấu sai số.
  - Cách sửa: tính diff từ **dữ liệu** (`{capKey: {u, d}}`) thay vì từ HTML, rồi render class `chg` ngay trong template.
- Lưới 53 tuần ở chế độ "Tất cả" tạo ~371 ô cộng toàn bộ chip sự kiện mỗi lần draw. Hiện vẫn ổn, nhưng sau 2–3 năm dữ liệu thì nên ảo hóa danh sách hoặc chỉ render các tuần trong viewport.
- `draw()` khôi phục focus bằng **index** của input (`[ai + TABDIR]`), sẽ vỡ khi số input thay đổi giữa hai lần render.

### 1.4 Memory leak / event listener
**Không tìm thấy leak thực sự**, đây là điểm tốt:
- Handler inline bị huỷ cùng `innerHTML`, không tích luỹ listener.
- Chỉ có 1 `setInterval(tick, 60000)` và 3 listener global, đăng ký một lần.
- Toast tự xóa sau 2,8 giây.

Rủi ro nhỏ:
- `S.mem` (bộ nhớ "tự học") **tăng vô hạn**: mỗi tiêu đề khác nhau thêm một key và không bao giờ bị dọn.
- Promise `fetch` của GCal giữ tham chiếu tới object sự kiện. Nếu người dùng xóa sự kiện trước khi request trả về thì `gid` được gán vào một object đã bị xóa, và sự kiện trên GCal thành mồ côi.

### 1.5 Code chết / trùng lặp
- `V.bak()` không còn được dùng.
- `.chg` khai báo 2 lần (dòng 993 và 995).
- `saveFile` gọi `window.claude.use("downloads")`, phần còn sót lại từ môi trường Claude Artifact và không có tác dụng khi deploy thật.
- Comment "Tính năng 4", "Tính năng 8" không khớp với thứ tự hiện tại.
- `PER` được khai báo nhưng không dùng.

### 1.6 Đề xuất kiến trúc (vì bạn chấp nhận build tool + backend)
```
src/
  domain/            ← THUẦN, không DOM, test được 100%
    calendar.ts      (ISO week, global week index, date math)
    nlp-vi.ts        (parser tiếng Việt)
    stats.ts         (battery, 168h, balance score, insights)
    model.ts         (types + schema version + migrations)
  store/
    store.ts         (state + actions + subscribe; mọi thay đổi đi qua action → có undo & outbox)
    persist.ts       (IndexedDB + navigator.storage.persist + BroadcastChannel đa tab)
  sync/
    gcal.ts          (outbox, retry/backoff, RRULE)
    cloud.ts         (đồng bộ đa thiết bị, xem §5)
  ui/                (Preact + signals hoặc lit-html; event delegation; CSS class thay inline style)
tests/               (Vitest: nlp-vi.test.ts có ≥100 câu mẫu, calendar.test.ts, stats.test.ts)
```
- **Vite + TypeScript + Preact (~4KB) + @preact/signals**: re-render theo từng component (không phải toàn trang), loại bỏ inline handler, bật được CSP.
- Nếu muốn giữ vanilla thì dùng **lit-html** (~3KB) để có diff DOM, kết hợp event delegation qua `data-action`.
- Viết test cho **NLP trước tiên**: đây là phần nhiều lỗi nhất và thuần nhất, nên dễ test nhất.

**Mô hình dữ liệu v2 đề xuất:**
```ts
type Event = {
  id: string;            // crypto.randomUUID(): ổn định cho sync/undo/dedupe
  date: string;          // "2026-10-08" (local)
  start?: string;        // "HH:MM"; undefined = cả ngày / chưa xếp giờ
  dur: number;           // giờ
  cap: string; mode: "u" | "d";
  energy?: 1 | 2 | 3;    // cường độ (xem §5 Product)
  status?: "plan" | "done" | "skipped";
  title: string;
  seriesId?: string;
  gcal?: { id: string; etag?: string; syncedAt?: number };
  updatedAt: number; deletedAt?: number;  // tombstone cho sync
};
type State = { schema: 2; events: Record<string, Event>; caps: Cap[]; baselines: Baseline[]; cfg: Cfg; mem: Record<string, MemEntry> };
```

---

## 2. UX/UI & Usability

### 2.1 Bảng màu Mauve Rose & Dark/Light
**Tốt:**
- Hệ thống token CSS rõ ràng, có cặp `--on-*` cho chữ trên nền màu.
- Dark mode được định nghĩa đúng cả hai cách: theo hệ điều hành (`prefers-color-scheme` với `:not([data-theme="light"])`) và theo lựa chọn thủ công (`[data-theme="dark"]`).
- Script đặt theme chạy trong `<head>` nên không bị nháy màu khi tải.
- Nút chính dùng `--on-ac #421629` trên `#E0A3BB`, contrast **7,35:1**, rất tốt.
- Chữ phụ `--mu` có contrast **4,94:1** trên nền sáng và **4,94:1** trên thẻ tối, đạt chuẩn AA.

**Vấn đề contrast [Đã kiểm chứng bằng công thức WCAG]:** chữ **trắng** đặt trên màu vốn (khối timeline, chip ở lưới năm, pill NLP):

| Màu vốn | Chữ trắng | WCAG AA (4,5) |
|---|---|---|
| Quan hệ `#E0A3BB` | **2,07:1** | ❌ |
| Sức khỏe `#97A13B` | **2,81:1** | ❌ |
| Tài chính `#b88628` | **3,24:1** | ❌ |
| Kỹ năng `#4a859c` | 4,10:1 | ❌ (sát ngưỡng) |
| Trải nghiệm `#8b6da9` | 4,32:1 | ❌ (sát ngưỡng) |

Thêm nữa: `color: var(--ok)` (`#97A13B`) dùng cho chữ "Còn Xh tự do" và "Chưa phân bổ" chỉ đạt **2,67:1**; phải đổi sang `--ok-text`.

Cách sửa: tự chọn màu chữ theo độ sáng của nền thay vì hardcode `#fff`:
```js
const onColor = hex => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.18 ? "#1f1418" : "#ffffff";
};
```
Một cách khác là dùng nền nhạt `color-mix(in srgb, ${cap.c} 22%, var(--card))` + viền trái đậm + chữ `--tx`. Cách này vừa đẹp hơn vừa đọc tốt ở cả hai theme.

Các điểm nhỏ:
- `meta theme-color` chỉ có một giá trị. Nên thêm `media="(prefers-color-scheme: dark)"` với `#151113`.
- Header bảng lưới năm dùng `color:#ffffff` hardcode (vẫn ổn trên `--hd`).

### 2.2 Ba chế độ xem lịch
**Tuần chi tiết**
- ✅ Pin năng lượng mỗi ngày trực quan; nhãn "Kiệt sức" dễ thấy.
- 🟠 **Không đổi được ngày của sự kiện.** Editor không có trường ngày, nên muốn dời lịch phải xóa rồi tạo lại (và mất `gid`). Đây là thiếu sót UX lớn nhất của một app lịch. Cần thêm trường ngày, sau đó thêm kéo-thả.
- 🟡 Trên mobile (<640px), 7 thẻ xếp dọc, mỗi thẻ cao ≥200px, nên phải cuộn ~1.500px mới thấy Chủ nhật. Nên dùng dạng **agenda**: hôm nay ở trên cùng, gom các ngày trống lại, có thể vuốt ngang giữa các ngày.
- 🟡 Ở 7 cột trên desktop, tiêu đề bị cắt ("Dinner w L…"). Có thể cho phép xuống 2 dòng.
- 🔵 Item sự kiện là `<div onclick>` nên người dùng bàn phím không mở được. Cần `<button>` hoặc `role="button" tabindex="0"`.

**Dòng thời gian 24h**
- ✅ Chia làn đúng [Đã kiểm chứng: 3 sự kiện chồng nhau được chia thành 3 làn], có vạch giờ hiện tại, bấm vào lưới để tạo sự kiện mới.
- 🟠 **Tên gọi "24h" chưa đúng**: chỉ hiển thị **06:00–24:00**. Sự kiện trước 6h (ngủ, chạy bộ sáng sớm) bị **ẩn**, chỉ có một dòng cảnh báo bên dưới. Với khung 168h, **giấc ngủ (~56h/tuần) là khối lớn nhất** nhưng lại không thể hiển thị và cũng không thể nhập (xem §4.2: không cho sự kiện qua nửa đêm).
  - Đề xuất: lưới đủ 0–24h, tự cuộn tới 6h khi mở; hoặc làm thanh "Ngủ" thu gọn ở đầu và cuối ngày.
- 🔵 Bấm vào lưới chỉ chọn được giờ chẵn (`Math.floor(y/48)`). Nên làm tròn tới 15 phút. Ngoài ra `setTimeout(120ms)` chạy đua với `setTimeout(100ms)` của `openEditor`; nên truyền giờ vào thẳng `openEditor`.

**Lưới 53 tuần**
- ✅ Header dính khi cuộn, tự cuộn tới tuần hiện tại, có cột Σ/168h.
- 🟡 Mặc định "Từ tuần này" **ẩn các tuần đã qua**, trong khi giá trị của một lưới năm là nhìn lại quá khứ. Nên mặc định "Tất cả" và tự cuộn tới tuần hiện tại.
- 🟡 Ở dạng lưới năm, mật độ chip văn bản là quá nhiều. Nên thêm chế độ **heatmap** (mỗi ô là một màu theo net energy hoặc số giờ ▲), kiểu GitHub contributions: một cái nhìn là thấy cả năm.
- 🟡 [Đã kiểm chứng] Khi chuyển sang năm khác, `CW = -1` nên nhánh `else` hiển thị nhãn **"Tuần hiện tại" ở mọi tuần**. Lỗi này có ở cả header lịch (dòng 2310) và modal tổng kết (dòng 1728). Sửa:
  ```js
  ${CW >= 0 && sel === CW ? `<span class="pill pill-ok">Tuần hiện tại</span>`
    : CW >= 0 ? `<button … onclick="sel=CW; draw()">Về tuần này (W${CW+1})</button>` : ""}
  ```

### 2.3 Bánh xe cuộc đời (Radar SVG)
- ✅ Xử lý tốt trường hợp vốn không có mục tiêu (chấm rỗng, không tính điểm), cắt nhãn theo chỗ trống, có `<title>` và `aria-label`.
- ✅ Điểm cân bằng `0,6·avg + 0,4·min` hợp lý vì phạt trục yếu nhất.
- 🟡 **Vốn Tài chính/Công việc có mục tiêu mặc định = 0**, nên luôn bị loại khỏi điểm cân bằng và luôn là "chấm rỗng". Với hầu hết người đi làm, đây là trục chiếm nhiều giờ nhất.
- 🟡 Radar chỉ tính giờ **▲ Nạp**, bỏ qua ▼ Tiêu. Một tuần làm 60h căng thẳng ở vốn Tài chính vẫn cho bánh xe "tròn". Nên vẽ thêm một đa giác ▼ (nét đứt, màu `--bad`), hoặc dùng net = ▲ − ▼.
- 🟡 Vượt mục tiêu bị cắt ở 100% (`Math.min(1, …)`), nên không thấy được tình trạng "quá đà" (ví dụ Sức khỏe 200% trong khi Quan hệ 10%). Nên cho trục kéo tới 150% (vòng ngoài nhạt).
- 🔵 Radar 5 trục phóng đại diện tích (bình phương). Đi kèm nên có **bullet chart** ngang cho từng vốn (dễ đọc số hơn), giữ radar làm hình ảnh biểu tượng.
- 🔵 `fill="rgba(224,163,187,0.28)"` hardcode. Nên dùng `var(--ac-soft)`.

### 2.4 Bản tin tổng kết tuần
- ✅ Bộ chọn tuần linh hoạt, insight có cấu trúc, có nút sao chép.
- 🟠 **Insight là văn mẫu theo ngưỡng, chưa thực sự "nhìn" dữ liệu.** Ví dụ: "Lên lịch 1–2 buổi vào **Thứ 3 hoặc Thứ 5**" là cố định. Nên gợi ý **khe giờ trống thật** của tuần tới, kèm nút "➕ Đặt lịch ngay" tạo sẵn sự kiện.
- 🟠 Lời văn **quá chắc chắn về y khoa** ("Nguy cơ kiệt sức sinh học rất cao", "tâm lý tích cực và thể lực vững vàng") trong khi dữ liệu chỉ là số giờ tự khai. Nên viết lại khiêm tốn hơn, theo kiểu "Tuần này bạn ghi nhận…".
- 🟡 **Baseline ("Cố định nạp/tiêu") được cộng vào MỌI tuần**, kể cả các tuần trong quá khứ trước khi bạn dùng app và các tuần tương lai trống. Vì vậy một tuần "Chưa có dữ liệu" vẫn có thể hiện "Tổng nạp 6h" và bánh xe có hình. Sửa baseline hôm nay cũng **viết lại lịch sử** mọi tuần cũ. Cần lưu baseline có ngày hiệu lực: `{cap, u, d, from: "2026-10-05"}`.
- 🟡 Không có **so sánh với tuần trước hay xu hướng** trong bản tin (dữ liệu sparkline đã có ở tab Tổng quan).
- 🟡 Thống kê bị **reset mỗi đầu năm**: `W` chỉ chứa tuần của `activeYear`, nên "TB 4 tuần" và sparkline 8 tuần ở W1/2027 không nhìn thấy W50–52/2026. Nên dùng chỉ số tuần toàn cục (số tuần kể từ một mốc cố định).
- 🔵 Mở bản tin không gán `LF`, nên khi đóng, focus quay về phần tử cũ từ lần mở editor trước.

### 2.5 Các điểm UX khác
- 🟡 Cảnh báo kiệt sức `d ≥ 6h` sẽ bật vào **mọi ngày làm việc 8h** nếu bạn ghi "làm việc" là ▼. Cảnh báo bật quá thường xuyên thì người dùng sẽ bỏ qua. Nên tính kiệt sức theo **chuỗi ngày** (ví dụ 3 ngày liên tiếp net < 0) thay vì từng ngày.
- 🟡 Editor **mặc định ▲ Nạp** và không đoán chế độ (chỉ đoán loại vốn), trong khi NLP có đoán ▼ cho "họp/deadline". Hai luồng nhập cho ra kết quả khác nhau.
- 🟡 Chưa có **Undo**. Xóa sự kiện chỉ có `confirm()`. Nên dùng toast "Đã xóa · Hoàn tác" (cần event ID).
- 🔵 `confirm()` / `alert()` gốc trên iOS PWA trông lạc lõng. Nên thay bằng sheet tùy chỉnh.
- 🔵 Toast nằm ở `bottom: 24px` mà chưa cộng `env(safe-area-inset-bottom)`, nên bị thanh home của iPhone che.

---

## 3. Đồng bộ Google Calendar API v3

### 3.1 🔴 `gid` bị xóa mỗi lần tải trang [Đã kiểm chứng]
`cleanEv` (dòng 3269) chỉ giữ `{t, c, m, h, s, r}`. `cleanState` lại chạy **mỗi lần khởi động** (dòng 1194), nên toàn bộ `gid` biến mất. Tôi đã kiểm chứng: event `{…, gid:"abc123"}` sau khi qua `cleanState` thành `{c,h,m,s,t}`.

Hậu quả sau lần F5 đầu tiên:
- **Sửa** sự kiện: `gcalUpdateEvent` thoát sớm vì `!eventObj.gid`, nên GCal không cập nhật.
- **Xóa** sự kiện: `if (delEv.gid)` sai, nên sự kiện **mồ côi vĩnh viễn** trên GCal.
- **"⟳ Đồng bộ tuần này"**: mọi sự kiện đều không có `gid`, nên `POST` lại và tạo **bản trùng**. Bấm 3 lần thì có 3 bản.

```js
const GID = /^[\w-]{5,1024}$/; // id của Google là base32hex, instance của chuỗi lặp có thêm "_20261008T…Z"
function cleanEv(e) {
  if (!e || typeof e.t !== "string" || !(+e.h > 0 && +e.h <= 24) || !SAFE_K.test(e.c || "")) return null;
  return {
    t: e.t.slice(0, 120), c: e.c, m: e.m === "d" ? "d" : "u", h: +e.h,
    s: /^([01]\d|2[0-3]):[0-5]\d$/.test(e.s || "") ? e.s : "",   // chặn luôn "08:75"
    ...(SAFE_K.test(e.r || "") ? { r: e.r } : {}),
    ...(typeof e.gid === "string" && GID.test(e.gid) ? { gid: e.gid } : {}),
  };
}
```

### 3.2 🔴 `cleanState` xóa cấu hình GCal [Đã kiểm chứng]
`cfg` chỉ giữ `defDuration` và `burnoutHours`. Sau khi qua `cleanState`, `{gcalAutoSync:false, gcalClientId:"…"}` mất hết. Người dùng **tắt** đồng bộ, F5, thì đồng bộ **bật lại** (`gcalAutoSync !== false`). Đây vừa là lỗi chức năng vừa là lỗi tôn trọng lựa chọn của người dùng.
```js
const cfg = {
  defDuration: cl(d.cfg?.defDuration, 0.5, 24, 2),
  burnoutHours: cl(d.cfg?.burnoutHours, 1, 24, 6),
  gcalAutoSync: d.cfg?.gcalAutoSync !== false,
  ...(/^[\w.-]{10,200}\.apps\.googleusercontent\.com$/.test(d.cfg?.gcalClientId || "") ? { gcalClientId: d.cfg.gcalClientId } : {}),
};
```

### 3.3 🔴 Token hết hạn thì mất đồng bộ trong im lặng
- GIS Token Client cấp access token **1 giờ**, không có refresh token. Sau 1 giờ, `getGCalToken()` trả về `null` và `gcalCreateEvent` **`return null` mà không báo gì**. Người dùng tin rằng mọi thứ đã lên GCal trong khi không phải vậy.
- Chỉ khi server trả **401** mới có toast, mà trường hợp này hiếm, vì token hết hạn đã bị chặn ngay ở phía client.
- **Offline** hoặc lỗi mạng: `catch` → `console.warn`, thay đổi **mất luôn**, không có hàng đợi.
- **403/429 (rate limit)**: không xử lý, nuốt im lặng.
- `connectGoogleCalendar` luôn dùng `prompt: "consent"`, nên **mỗi giờ** phải bấm qua màn hình xin quyền đầy đủ.

**Giải pháp: Outbox pattern** (cốt lõi của sync đáng tin cậy):
```js
// Mọi thay đổi → ghi vào outbox (persist cùng state), KHÔNG gọi fetch trực tiếp
function enqueue(op) {           // op: {kind:"upsert"|"delete", eventId, gid?}
  S.outbox = S.outbox.filter(o => o.eventId !== op.eventId); // gộp: chỉ giữ thao tác mới nhất
  S.outbox.push({ ...op, tries: 0, at: Date.now() });
  save(); flushOutbox();
}

async function flushOutbox() {
  if (flushing || !navigator.onLine || !S.cfg.gcalAutoSync) return;
  const token = getGCalToken();
  if (!token) { setSyncBadge(`${S.outbox.length} thay đổi chờ đồng bộ · Kết nối lại`); return; }
  flushing = true;
  try {
    while (S.outbox.length) {
      const op = S.outbox[0];
      const res = await gcalApply(op, token);          // POST/PATCH/DELETE
      if (res.ok || res.status === 404 || res.status === 410) { S.outbox.shift(); save(); continue; }
      if (res.status === 401) { clearToken(); break; }  // giữ op, chờ kết nối lại
      if (res.status === 403 || res.status === 429 || res.status >= 500) {
        op.tries++; await sleep(Math.min(60000, 1000 * 2 ** op.tries) * (0.5 + Math.random()));
        if (op.tries > 6) { markFailed(op); S.outbox.shift(); }
        continue;
      }
      markFailed(op); S.outbox.shift();                 // 400: dữ liệu sai → báo người dùng
    }
  } finally { flushing = false; setSyncBadge(); }
}
addEventListener("online", flushOutbox);
document.addEventListener("visibilitychange", () => !document.hidden && flushOutbox());
```
- Nên có **badge trạng thái sync thường trực** trên header: `✓ Đã đồng bộ` / `⏳ 3 chờ` / `⚠ Cần kết nối lại`.
- Khi kết nối lại: dùng `requestAccessToken({ prompt: "", login_hint: email })` (không hiện màn hình consent lần nữa), sau đó `flushOutbox()`.
- **Giải pháp triệt để cho token 1 giờ**: chuyển sang **Authorization Code flow** qua backend nhỏ (xem §5, Giai đoạn 2), backend giữ refresh token. Vì bạn cần đồng bộ đa thiết bị, đằng nào cũng sẽ có backend, nên đây là lúc gộp hai việc.

### 3.4 🟠 Payload sai giờ kết thúc & sự kiện chưa có giờ [Đã kiểm chứng]
- `22:00 + 2h` gửi lên `end 23:00` (sai 1 tiếng) do `Math.min(23, …)` cắt mất.
- `23:00 + 1h` gửi lên `start = end = 23:00`, Google trả **400**, mà lỗi này cũng bị nuốt im lặng.
- Sự kiện **chưa có giờ** (`s:""`) bị ép thành 07:00–08:00 trên GCal.
```js
function buildGCalEventPayload(e, dateStr) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Ho_Chi_Minh";
  const base = { summary: `${e.m === "u" ? "▲" : "▼"} ${e.t}`, description: "...", colorId: GCAL_COLOR_MAP[e.c] || "1",
                 extendedProperties: { private: { lcId: e.id } } };  // gắn ID nội bộ → khử trùng được
  if (!e.s) {                                              // chưa xếp giờ → sự kiện cả ngày
    const next = ky(ad(new Date(dateStr + "T00:00"), 1));
    return { ...base, start: { date: dateStr }, end: { date: next }, transparency: "transparent" };
  }
  const [h, m] = e.s.split(":").map(Number);
  const startD = new Date(`${dateStr}T00:00`); startD.setHours(h, m);
  const endD = new Date(startD.getTime() + Math.round(e.h * 60) * 60000); // 24:00 → 00:00 hôm sau, đúng
  const fmt = d => `${ky(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  return { ...base, start: { dateTime: fmt(startD), timeZone: tz }, end: { dateTime: fmt(endD), timeZone: tz } };
}
```

### 3.5 🟠 Chuỗi lặp & rate limit
- `rep()` gọi `gcalCreateEvent` **trong `forEach` không `await`**. Một chuỗi "hằng ngày" đến 31/12 tạo **hàng trăm POST cùng lúc**. Google Calendar có giới hạn tạo sự kiện theo người dùng, nên phần lớn request sẽ bị 403 `rateLimitExceeded` / `quotaExceeded`, và lỗi bị nuốt im lặng.
- **Giải pháp đúng: dùng recurrence gốc của Google**, mỗi chuỗi chỉ tốn **1 request**:
  ```js
  recurrence: [`RRULE:FREQ=${rp === "d" ? "DAILY" : "WEEKLY"}${rp === "wd" ? ";BYDAY=MO,TU,WE,TH,FR" : ""};UNTIL=${end.replace(/-/g, "")}T235959Z`]
  ```
  Sửa "một lần" thì PATCH instance (`events.instances` → id của instance); sửa "cả chuỗi từ ngày này" thì cắt `UNTIL` ở chuỗi cũ rồi tạo chuỗi mới.
- `gcalSyncWeek` báo `✓ Đã đồng bộ N hoạt động` bằng biến `count++` **bất kể thành công hay thất bại**. Cần đếm `ok` và `fail` riêng.

### 3.6 🟠 Bảo mật token & phạm vi quyền
- **Access token lưu trong `localStorage`**: bất kỳ lỗ XSS nào (hoặc extension độc hại) cũng đọc được token.
- Scope `calendar.events` cho phép **đọc, sửa, xóa mọi sự kiện trên mọi lịch** của người dùng, trong khi app chỉ cần ghi lịch của chính nó.
- Đề xuất:
  1. Dùng scope **`https://www.googleapis.com/auth/calendar.app.created`**: app chỉ được thao tác trên **lịch do chính nó tạo ra**. Tạo một lịch riêng "Life Capital" thay vì ghi vào `primary`. Cách này an toàn hơn nhiều, người dùng có thể ẩn hoặc hiện lịch đó trong Google Calendar, và xóa app thì chỉ cần xóa lịch.
  2. Giữ token **trong bộ nhớ** (biến JS) hoặc tối đa `sessionStorage`, không dùng `localStorage`.
  3. "Ngắt kết nối" phải gọi `google.accounts.oauth2.revoke(token)`, không chỉ xóa localStorage.
  4. Thêm CSP (sau khi bỏ inline handler):
     `default-src 'self'; script-src 'self' https://accounts.google.com/gsi/client; connect-src 'self' https://www.googleapis.com; frame-src https://accounts.google.com; style-src 'self' https://accounts.google.com/gsi/style`
  5. **Lazy-load GIS**: hiện script `accounts.google.com/gsi/client` được tải **mỗi lần mở app**, kể cả với người không dùng GCal (Google nhận được tín hiệu mỗi lần mở; lỗi tải khi offline). Chỉ nên inject script khi người dùng bật GCal.
- **Lưu ý khi chia sẻ cho người quen:** `calendar.events` là scope "sensitive" (hãy kiểm tra phân loại của `calendar.app.created` trong Google Cloud Console khi chuyển scope). Nếu OAuth consent screen ở chế độ **Testing**, bạn phải thêm email từng người vào danh sách *Test users* (tối đa 100 người); người khác đăng nhập sẽ gặp lỗi `access_denied`. Nếu chuyển sang Production mà không qua verification, họ sẽ thấy cảnh báo "Google hasn't verified this app". Với vài người quen, chế độ Testing là đủ, nhưng cần ghi rõ điều này trong tài liệu.
- **File://**: tài liệu ghi "nhấp đúp `index.html` để dùng offline", nhưng origin `file://` (`null`) **không thể đăng ký** làm Authorized JavaScript origin, nên GCal sẽ không hoạt động. Cần ghi rõ: GCal yêu cầu HTTPS hoặc localhost.

### 3.7 Tài liệu không khớp với code
README ghi *"đồng bộ CRUD **hai chiều** thời gian thực"*, nhưng code chỉ đẩy một chiều. Bạn đã xác nhận một chiều là đủ, vậy nên **sửa lại tài liệu** thành "Đẩy một chiều sang Google Calendar" để người dùng khác không hiểu nhầm rằng sửa trên GCal sẽ cập nhật ngược về app (hiện tại lần đồng bộ tuần tiếp theo sẽ **ghi đè** chỉnh sửa trên GCal bằng `PATCH`).

---

## 4. Robustness, bảo mật & xử lý biên

### 4.1 Lịch ISO 8601 / năm nhuận / múi giờ
- ✅ Số tuần và W1 đúng ([Đã kiểm chứng] với 8 năm). `isoYear()` đúng (theo Thứ Năm của tuần). Năm nhuận do `Date` tự xử lý.
- ✅ Toàn bộ khóa ngày là ngày **local** (`ky()`), parse bằng `"YYYY-MM-DDT00:00"` (cũng là giờ local). Nhất quán.
- 🟡 **Không tự chuyển năm khi app đang mở qua giao thừa ISO.** `tick()` chỉ tính lại `CW` trong `W` của `activeYear`, nên sang tuần W1 năm mới thì `CW = -1` và app kẹt ở năm cũ cho tới khi F5. Tài liệu lại ghi "Tự chuyển sang năm 2027". Với PWA để chạy nền nhiều ngày thì lỗi này sẽ xảy ra.
  ```js
  function tick() {
    if (ed) return;
    const y = isoYear(new Date());
    if (y !== activeYear && (CW >= 0 || sel === W.length - 1)) { changeYear(y - activeYear); return; }
    …
  }
  ```
- 🔵 Dữ liệu mẫu, `<title>`, và `manifest.name` hardcode "2026".
- 🔵 Nếu người dùng đi công tác khác múi giờ: sự kiện lưu theo ngày và giờ "trên tường" (đây là lựa chọn hợp lý cho app nhật ký), nhưng `buildGCalEventPayload` gắn **múi giờ hiện tại của thiết bị**. Một sự kiện tạo ở Hà Nội rồi sửa ở Tokyo sẽ bị dời 2 tiếng trên GCal. Nên lưu `tz` vào từng sự kiện khi tạo.
- 🔵 Nhập `5/1` vào cuối tháng 12 sẽ ra ngày 5/1 của **năm hiện tại** (đã qua), không phải năm sau.

### 4.2 Bộ parser NLP tiếng Việt [Đã kiểm chứng 19 câu thật]
| Câu nhập | Kết quả hiện tại | Đúng ra |
|---|---|---|
| `Mai 18h đánh cầu lông 2 tiếng` | ✅ mai 18:00, 2h, Sức khỏe | |
| `Hôm nay 20h đọc sách 1.5h` | ✅ 20:00, 1,5h, Kỹ năng | |
| `22h-24h đọc sách` | ✅ 22:00, 2h | |
| `5h sáng chạy bộ` | ❌ **07:00, dài 5 tiếng** | 05:00, 2h (mặc định) |
| `3h chiều họp` | ❌ 15:00, **dài 3 tiếng** | 15:00, 2h |
| `làm bánh 2h chiều` | ❌ **15:00**, 2h, vốn **Tài chính** | 14:00, Trải nghiệm |
| `chạy bộ 1h30` | ❌ **bắt đầu 01:30 sáng** | dài 1,5h |
| `1 tiếng 30 phút yoga` | ❌ 1h, tiêu đề "**30 phút yoga**" | 1,5h, "yoga" |
| `đọc sách hai tiếng` | ❌ tiêu đề giữ "hai tiếng" (số bằng chữ không hiểu) | 2h, "đọc sách" |
| `12h đêm xem phim` | ❌ **12:00 trưa** | 00:00 |
| `hôm qua 19h gym 1h` | ❌ **hôm nay**, tiêu đề "hôm qua gym" | hôm qua |
| `thứ 2 tuần sau họp 9h` | ⚠ đúng ngày (tình cờ), tiêu đề "**tuần sau** họp" | "họp" |
| `Gọi điện cho Mai 20h` | ❌ **ngày mai**, tiêu đề "Gọi điện cho" | hôm nay, giữ tên "Mai" |
| `học tiếng Anh 1 tiếng` | ❌ vốn **Quan hệ** (khớp từ khóa "anh") | Kỹ năng |
| `xem báo cáo 15h 1h` | ⚠ vốn **Trải nghiệm** (khớp "xem") | Tài chính |
| `8h75 họp` | ❌ lưu giờ **"08:75"** (không hợp lệ) | báo lỗi |
| `14-16h workshop` | ❌ 16:00, tiêu đề "**14-** workshop" | 14:00–16:00 |

**Nguyên nhân gốc và cách sửa:**
1. **Thứ tự bóc tách**: regex buổi (dòng 1406) cắt chữ "sáng/chiều" **trước** khi regex `Xh + buổi` (dòng 1446) kịp chạy, nên số giờ bị coi là thời lượng. Cách sửa: chạy các mẫu **giờ + buổi** (`(\d{1,2})\s*(h|giờ)?\s*(sáng|chiều…)` và `(sáng|chiều…)\s*(\d{1,2})h`) **trước** bước bóc buổi đứng riêng.
2. **"1h30" và "XhYY"**: nếu `X < 6`, không có từ chỉ buổi, và chưa có giờ bắt đầu nào khác, thì hiểu là **thời lượng**. Nên thêm luật cộng dồn: `(\d+)\s*(h|tiếng|giờ)\s*(\d+)\s*(p|phút)?` → `X + Y/60`.
3. **Số bằng chữ**: chuẩn hóa trước khi parse: `{một:1, hai:2, ba:3, bốn:4, tư:4, năm:5, sáu:6, bảy:7, tám:8, chín:9, mười:10, rưỡi:".5"}` (chỉ thay khi đứng trước `tiếng|giờ|phút|h`, để không hỏng "thứ năm" hay "năm nay").
4. **Ngày tương đối thiếu**: `hôm qua`, `hôm kia`, `tuần sau/tuần tới`, `cuối tuần`, `thứ X tuần sau`. Riêng **"hôm qua" rất quan trọng** vì đây là app ghi nhật ký.
5. **"12h đêm" / "12h trưa"**: `adj()` cần xử lý `đêm && hr === 12 → 0`.
6. **"Mai" là tên người**: chỉ hiểu "mai" là ngày khi nó đứng **đầu câu**, đi kèm từ chỉ buổi, hoặc có giờ/thời lượng ngay sau (`mai 18h`, `chiều mai`). Lookbehind hiện tại chỉ loại trừ một danh sách cố định ("gặp/với/cùng…") nên vẫn sót các động từ khác như "gọi", "nhắn", "đón".
7. **Validate phút ≤ 59** trong `hm()` và trong `cleanEv` (regex `^([01]\d|2[0-3]):[0-5]\d$`).
8. **Khoảng giờ `14-16h`**: cho phép số đầu không có `h`.

**Phân loại vốn (`guess`)** đang dùng **"khớp đầu tiên theo thứ tự vốn"**, nên Quan hệ (thứ 2) luôn thắng Kỹ năng (thứ 4). Các từ khóa ngắn và mơ hồ ("anh", "em", "chị", "xem", "làm", "thử", "bạn") là nguồn gây sai. Nên đổi sang **chấm điểm**:
```js
function guess(title) {
  const t = title.normalize("NFC").trim().toLowerCase();
  if (S.mem[t]?.c && S.caps.some(c => c.k === S.mem[t].c)) return S.mem[t].c;
  const w = " " + t.split(/[^\p{L}\p{N}]+/u).join(" ") + " ";
  let best = null, bestScore = 0;
  for (const c of S.caps) for (const k of c.kw) {
    const kk = k.normalize("NFC").toLowerCase().trim();
    if (kk && w.includes(" " + kk + " ")) {
      const score = kk.split(" ").length * 10 + kk.length;   // cụm nhiều từ & dài thắng: "tiếng anh" > "anh"
      if (score > bestScore) { best = c.k; bestScore = score; }
    }
  }
  return best ?? S.caps[0]?.k;
}
```
Đồng thời thêm `"tiếng anh"`, `"ngoại ngữ"` vào Kỹ năng, và bỏ `"làm"` khỏi Tài chính (đã có `"làm việc"`).

**"Trí nhớ tự học" `S.mem`**: `executeNLP` ghi lại **kết quả đoán** của chính nó (dòng 1506), tức là app đang **tự học cả lỗi của mình**. Chỉ nên ghi vào `mem` khi người dùng **chủ động sửa** loại vốn trong editor. Ngoài ra nên giới hạn kích thước (LRU khoảng 500 mục) và nhớ cả **chế độ ▲/▼**.

**Gõ tiếng Việt có dấu + Enter**:
- ✅ Editor đã chặn `e.isComposing` (dòng 2968).
- ❌ **Thanh ghi nhanh thì chưa**: `onkeydown="if(event.key==='Enter') executeNLP()"` (dòng 1053). Với bộ gõ có giai đoạn composition (bộ gõ tiếng Việt có sẵn của macOS/iOS, hoặc một số chế độ của EVKey/OpenKey), phím Enter dùng để chốt chữ cũng sẽ **gửi luôn câu đang gõ dở**:
  ```js
  nlpInput.addEventListener("keydown", e => {
    if (e.key !== "Enter" || e.isComposing || e.keyCode === 229) return;
    e.preventDefault(); executeNLP();
  });
  ```
- Mẹo: Safari phát `compositionend` **trước** `keydown Enter`, nên có thể cần thêm cờ `justComposed` kèm `setTimeout(0)`.
- Nên chuẩn hóa NFC cả **từ khóa** người dùng nhập (`updateCapKeywords` chưa gọi `normalize`). Văn bản copy từ một số nguồn trên macOS ở dạng NFD sẽ không khớp được.

**Sự kiện qua nửa đêm**: `chkEvent` từ chối mọi sự kiện vượt 24:00 ("Hãy tách thành hai hoạt động"). Như vậy **giấc ngủ, hoạt động vốn Sức khỏe quan trọng nhất, không thể nhập tự nhiên được**. Đề xuất cho phép `start + dur > 24h`, khi lưu thì tự tách thành 2 phần với cùng `groupId`; hoặc làm một trường "Giấc ngủ" riêng cho mỗi ngày (xem §5).

### 4.3 localStorage & toàn vẹn dữ liệu
- 🔴 **Safari/iOS (ITP)**: Safari **xóa toàn bộ dữ liệu script-writable (localStorage, IndexedDB) của website nếu người dùng không tương tác với site trong 7 ngày**. Ngoại lệ là web app **đã "Thêm vào Màn hình chính"**. Bạn dùng iPhone, nếu mở bằng tab Safari thường thì nghỉ một tuần đi du lịch là có thể mất hết dữ liệu.
- 🔴 **Không có service worker**, nên khi deploy lên Vercel/Netlify, app **không mở được khi offline** (ngược với "offline-first" trong tài liệu). Chrome cũng không coi đây là PWA đầy đủ.
- Biện pháp:
  ```js
  navigator.storage?.persist?.().then(ok => !ok && console.info("Storage có thể bị trình duyệt dọn"));
  navigator.storage?.estimate?.().then(({ usage, quota }) => usage / quota > 0.8 && showToast("Bộ nhớ sắp đầy", "bad"));
  ```
  - Chuyển sang **IndexedDB** (Dexie hoặc idb-keyval): quota lớn hơn nhiều, ghi được theo từng bản ghi thay vì serialize toàn bộ state mỗi lần `save()`.
  - **Nhắc sao lưu**: đã có `S.lb`; nên hiện banner khi quá 14 ngày chưa sao lưu. Về lâu dài, cloud sync (§5) giải quyết triệt để.
- 🟠 **Đa tab** (vấn đề số 5 ở bảng tóm tắt): mỗi tab giữ một bản `S` riêng trong bộ nhớ; `save()` ghi đè **toàn bộ** state. Ví dụ: tab A mở từ sáng, tab B thêm 5 sự kiện, sau đó sửa một sự kiện ở tab A thì **5 sự kiện của B biến mất**.
  ```js
  addEventListener("storage", e => {
    if (e.key !== "lc2" || !e.newValue) return;
    const d = cleanState(JSON.parse(e.newValue)); if (d) { S = d; draw(); }
  });
  ```
  Tốt hơn nữa là dùng `BroadcastChannel` kèm số phiên bản (`rev`) để phát hiện xung đột.
- 🟡 `save()` khi gặp `QuotaExceededError` chỉ hiện toast, state trong bộ nhớ đã đổi nhưng đĩa thì không. Nếu người dùng đóng tab thì mất dữ liệu mà không hay biết. Nên giữ banner đỏ thường trực cho tới khi lưu được.
- Về dung lượng: một sự kiện tốn khoảng 80–100 byte JSON. Với 10 sự kiện/ngày thì khoảng **300–350 KB/năm**, nên quota 5MB đủ cho khoảng 12–15 năm. Câu "bền bỉ 30–40 năm" trong tài liệu chỉ đúng với mức dùng rất nhẹ, và **không tính tới việc Safari tự xóa**. Nên bỏ câu này.
- 🟡 `setDefaultDuration(NaN)` lưu `NaN` (thành `null` khi qua JSON). Toast hiển thị giá trị chưa clamp.

### 4.4 XSS / Prototype Pollution / CSV Injection
- **XSS**: ✅ Không tìm thấy lỗ khai thác được. Tiêu đề và tên vốn đều qua `esc()`; khóa vốn qua `SAFE_K = [\w-]` nên không thể chèn dấu nháy vào `onclick="…('${c.k}')"`; màu vốn được kiểm tra `^#[0-9a-f]{6}$` trong `cleanCap`.
  - ⚠ Tuy vậy, an toàn hiện tại **phụ thuộc vào việc không ai quên `esc()`** ở bất kỳ chỗ nào trong hơn 100 template. Không có CSP làm lưới an toàn, và token Google lại nằm trong localStorage. Lỗi XSS đầu tiên sẽ đồng nghĩa với lộ quyền truy cập toàn bộ Google Calendar. Chuyển sang Preact/lit-html (tự escape) cộng với CSP sẽ loại bỏ cả nhóm lỗi này.
  - 🔵 `updateCap(k, "c", val)` không validate màu ở thời điểm gọi (chỉ lúc load). Thực tế an toàn vì `<input type=color>` luôn trả về `#rrggbb`, nhưng nên validate ở hàm.
- **Prototype pollution**: ✅ Không có deep-merge dữ liệu không tin cậy; khóa `ev` qua regex ngày; `mem` loại `__proto__`.
  - 🔵 Nhưng `executeNLP` ghi `S.mem[title.toLowerCase()]`. Gõ hoạt động tên **"__proto__"** sẽ làm đổi prototype của `S.mem`; `constructor` hay `tostring` thì trả về hàm có sẵn của Object (tác hại thấp vì `m.c` là `undefined`). Cách sửa gọn: `S.mem = Object.assign(Object.create(null), …)` hoặc dùng `Map`.
- **CSV injection**: ✅ Đúng chuẩn. 🔵 Có thể thêm `\n` vào bộ ký tự đầu dòng, và nên xuất thêm cột `ID` cùng `Múi giờ`.
- **Import**: ✅ Có kiểm tra `app === "life-capital"` và chạy `cleanState`. 🔵 Chưa giới hạn kích thước file (một file JSON 200MB sẽ làm treo tab). Nên chặn trên 20MB.

### 4.5 PWA / manifest
- 🟠 `apple-touch-icon` dạng **SVG**, mà iOS **không hỗ trợ**, nên icon trên màn hình chính sẽ là ảnh chụp trang. Cần PNG 180×180.
- 🟡 Manifest chỉ có icon SVG với `"purpose": "any maskable"`. Nên tách thành PNG 192 và 512 (`any`) cộng một bản `maskable` có vùng an toàn riêng; gộp hai purpose làm một bị Lighthouse cảnh báo.
- 🟡 `"orientation": "portrait-primary"` khóa xoay màn hình trên Android/iPad, nên không xem được lưới tuần ở chế độ ngang. Nên dùng `"any"`.
- Thêm `id`, `scope`, `description`, `screenshots` (giúp Chrome hiển thị giao diện cài đặt đẹp hơn).

### 4.6 🟠 Dữ liệu mẫu chứa thông tin cá nhân
`SEED` (dòng 1155) chứa **lịch thật** tháng 9–10/2026: "Dinner w LHương", "Dinner w bạn anh Tín", "Dinner w chị em GM", "Đám cưới bạn anh". Vì bạn sẽ chia sẻ link cho người quen, **mọi người mở app lần đầu sẽ thấy lịch riêng của bạn**, đồng thời dữ liệu mẫu bị trộn vào dữ liệu thật của họ.
- Sửa: dữ liệu khởi tạo rỗng, kèm màn hình chào với nút "Thử với dữ liệu mẫu", tạo các sự kiện **ẩn danh**, **tương đối theo tuần hiện tại**, và có cờ `demo: true` để xóa bằng một cú bấm.
- Cũng nên kiểm tra lịch sử commit và bản deploy hiện tại (nếu đã có) để gỡ những thông tin này.

---

## 5. Lộ trình đề xuất

Thứ tự ưu tiên dựa trên bối cảnh bạn đã cho: **chia sẻ vài người · iPhone + máy tính cần đồng bộ · thoải mái công nghệ · GCal một chiều**.

### Giai đoạn 0: Hotfix (1–2 ngày, làm ngay trên bản hiện tại)
1. Giữ `gid` trong `cleanEv` và giữ cấu hình GCal trong `cleanState` (§3.1, §3.2).
2. Sửa `buildGCalEventPayload`: giờ kết thúc 24:00, sự kiện không giờ thành cả ngày (§3.4).
3. Thêm cảnh báo **"⚠ Chưa đồng bộ, cần kết nối lại"** khi token hết hạn (tạm thời, chờ có outbox).
4. Thêm guard `isComposing` cho thanh ghi nhanh (§4.2).
5. Xóa dữ liệu mẫu cá nhân; bản mới khởi tạo rỗng (§4.6).
6. Thêm listener `storage` cho đa tab, gọi `navigator.storage.persist()`, thêm banner nhắc sao lưu (§4.3).
7. Sửa nhãn "Tuần hiện tại" khi `CW = -1` (§2.2).
8. Đổi `color: var(--ok)` sang `--ok-text`; tự chọn màu chữ theo nền cho chip/khối màu vốn (§2.1).
9. Sửa README: "một chiều", bỏ "30–40 năm", ghi rõ GCal cần HTTPS và danh sách Test users.

### Giai đoạn 1: Nền móng (1–2 tuần)
1. **Vite + TypeScript**, tách `domain/` thuần và **test NLP bằng ≥100 câu mẫu** (bắt đầu từ 19 câu trong bảng §4.2).
2. **Data model v2**: event ID (UUID), `schema` + migrations, tombstone khi xóa, baseline có ngày hiệu lực.
3. **IndexedDB** + **service worker** (Workbox hoặc `vite-plugin-pwa`) để app offline thật, kèm icon PNG.
4. **GCal v2**: outbox + retry/backoff, scope `calendar.app.created` với lịch riêng "Life Capital", RRULE cho chuỗi lặp, token trong bộ nhớ, revoke khi ngắt kết nối, lazy-load GIS, badge trạng thái sync.
5. UI: Preact (hoặc lit-html) + event delegation + CSS class, rồi bật CSP.
6. NLP v2: các sửa đổi ở §4.2 và `guess()` chấm điểm.

### Giai đoạn 2: Đồng bộ đa thiết bị (1–2 tuần)
Vì bạn cần iPhone ↔ máy tính, tôi đề xuất **Supabase** (Postgres + Auth với Google + Row-Level Security), gói miễn phí đủ dùng cho vài người:
- Đăng nhập bằng Google (một lần đăng nhập cho cả sync dữ liệu lẫn GCal). Khi đăng nhập với `access_type=offline` + `prompt=consent`, Supabase trả về `provider_refresh_token` **một lần**. Bạn tự lưu nó vào một bảng riêng (RLS, không cho client đọc) để **Edge Function** đổi lấy access token mới, nhờ đó GCal **không còn hết hạn mỗi giờ**: chuyển việc đẩy lên GCal sang Edge Function, client chỉ cần ghi vào DB.
- Bảng `events(id, user_id, …, updated_at, deleted_at)` + RLS `user_id = auth.uid()`. Client giữ IndexedDB làm nguồn chính, đẩy và kéo theo `updated_at` (last-write-wins theo từng sự kiện là đủ cho app cá nhân).
- Phương án thay thế không cần backend: lưu một file JSON vào **Google Drive `appDataFolder`** (scope `drive.appdata`). Đơn giản hơn, nhưng vẫn vướng vấn đề token 1 giờ và xung đột khi ghi cả file. Tôi không khuyến nghị vì bạn cần đồng bộ thường xuyên giữa hai thiết bị.

### Giai đoạn 3: Tính năng có giá trị cao nhất (theo thứ tự)
1. **Kế hoạch so với thực tế (Plan vs Actual)**: đây là khoảng trống lớn nhất về sản phẩm. Hiện mỗi sự kiện vừa là "kế hoạch" vừa là "nhật ký", nên không biết bạn **có thực sự làm** hay không. Thêm `status: plan|done|skipped`: sự kiện quá giờ hiện ✓ / ✗ để chấm nhanh (một chạm). Khi đó bản tin tuần mới có insight thật: "Bạn lên lịch 6h Sức khỏe, thực hiện 3,5h (58%)".
2. **Check-in năng lượng mỗi ngày** (1 chạm, thang 1–5, buổi tối) cộng **cường độ** cho từng sự kiện. Hiện "Nạp/Tiêu" đo bằng **số giờ**, nên 8 tiếng ngủ = 8 "đơn vị nạp", lấn át mọi thứ, và 1 tiếng họp căng thẳng = 1 tiếng họp nhẹ nhàng. Có check-in rồi thì app có thể **học xem hoạt động nào thực sự nạp năng lượng cho bạn** (tương quan giữa hoạt động và năng lượng ngày hôm sau). Đây là insight độc nhất mà không app lịch nào có.
3. **Giấc ngủ là công dân hạng nhất**: nhập "ngủ 23:30 → 6:30" một chạm, hiển thị trên timeline, đưa vào cảnh báo kiệt sức (ngủ < 6h là tín hiệu kiệt sức quan trọng hơn số giờ làm việc).
4. **Vòng lặp tổng kết → lập kế hoạch**: từ bản tin tuần, nút "Lên lịch tuần tới" gợi ý các **khe trống thật** cho vốn đang thiếu, chấp nhận là sự kiện được tạo ngay. Đây chính là cách biến "insight" thành "hành động".
5. **Dời và kéo-thả sự kiện**, thêm trường ngày trong editor, **Undo**, routine/template tuần ("Tuần làm việc chuẩn" áp dụng một lần).
6. **Heatmap năm** và **xu hướng xuyên năm** (chỉ số tuần toàn cục), kèm bản tin tháng/quý.
7. **Nhắc nhở** qua Web Push (iOS 16.4+ hỗ trợ cho PWA đã cài): "Tối Chủ nhật, tổng kết tuần nhé", "Hôm nay bạn chưa ghi gì".
8. *(Tùy chọn)* **Nhập từ GCal** (chỉ đọc lịch công việc để tính vào 168h). Bạn nói một chiều là đủ, nhưng nếu lịch họp công ty đã nằm trên GCal thì đây là cách nhanh nhất để có dữ liệu ▼ Tiêu mà không phải nhập tay.

---

## Phụ lục: chỉ số đo được
- 3.496 dòng; 119 khai báo global; 78 inline event handler; 168 inline `style`.
- ISO weeks: 2020=53 · 2021=52 · 2024=52 · 2025=52 · 2026=53 · 2027=52 · 2032=53 · 2037=53 ✅
- Contrast: `--on-ac`/`--ac` 7,35 ✅ · `--mu`/`--bg` 4,94 ✅ · trắng/`#E0A3BB` 2,07 ❌ · trắng/`#97A13B` 2,81 ❌ · `--ok`/thẻ 2,67 ❌
