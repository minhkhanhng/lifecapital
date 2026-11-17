# Brief review độc lập (fable) · 2026-11-17

Chạy tuần tự, mỗi lượt một agent model fable. Agent **chỉ đọc/chạy, KHÔNG sửa code**. Việc ghi duy nhất được phép: tạo đúng một tệp báo cáo `docs/review/2026-11-17-fable-<tên>.md`. Điều phối viên sửa sau.

## Phần chung (mọi lượt)
- Dự án: Life Capital, PWA một tệp `index.html` (~10,4k dòng, khối script ~478 KB), `sw.js`, `manifest.json`, `api/ai_plan.py`, `supabase/schema.sql`, test trong `tests/`. Không có npm, build, lint, CI. Đang chạy thật (v0.7.1, nhánh `main`), người dùng thật là chủ dự án. Đau nhất của PO: **chậm/nặng**. Không có phần nào bị cấm, mọi đề xuất vẫn qua duyệt.
- Làm việc trong worktree `/Users/khanhnguyen/Desktop/Life-Capital/.claude/worktrees/review-2026-11-17`. Đọc `rule.md`, `lesson.md`, `CURRENT.md`, `CLAUDE.md` trước.
- Cấm: sửa bất kỳ tệp nào ngoài tệp báo cáo; commit/push/deploy; gửi yêu cầu tới production hay Supabase thật (kể cả GET lên lifecapital.vercel.app); dùng dữ liệu thật; chạy lệnh làm đổi `.git`.
- Chạy thử trình duyệt: máy chủ tĩnh đã chạy ở http://127.0.0.1:8790 (nếu tắt: `python3 -m http.server 8790 --bind 127.0.0.1` ở worktree). **Cổng 8765 thuộc dự án khác: không dùng, không kill.** Trước mọi lệnh JS kiểm `document.title === "Life Capital"` và `location.port === "8790"`. Test e2e cần cửa sổ ≥ 1400px (resize 1440×900 sau mỗi navigate, kiểm innerWidth). Dữ liệu thử: `localStorage.clear(); localStorage.setItem("lc_onb","1")` rồi `loadDemo()`.
- Báo cáo ≤ 40 dòng, tiếng Việt, ba mục **Critical / Important / Minor**. Mỗi phát hiện: `file:dòng`, cách tái hiện, đề xuất sửa 1 dòng, độ chắc chắn (chắc/có thể/đoán). Không bịa; điều chưa kiểm ghi "chưa kiểm". Cuối báo cáo: một dòng "Chưa xem được".
- Trả về cho điều phối viên **chỉ bản tóm tắt** (≤ 12 dòng: số lượng theo mức, 3 phát hiện nặng nhất, đường dẫn báo cáo).

## Lượt 1 · Kiến trúc và code (tên: `kien-truc`)
Cấu trúc một tệp, ranh giới module logic (dữ liệu, gộp, vẽ, GCal, Supabase, AI, sức khỏe, dự án), trùng lặp, nợ kỹ thuật, xử lý lỗi (try/catch nuốt lỗi, lỗi mạng), kiểu/giá trị dữ liệu, dead code (hàm/biến/CSS không dùng, kiểm chứng bằng grep), biến toàn cục, `innerHTML`/escape, service worker. Đề xuất tách tệp chỉ khi có lợi đo được.

## Lượt 2 · Đúng đắn dữ liệu (tên: `du-lieu`)
Đồng thời nhiều tab/máy (gộp, `lc2_mine`, rev của `lc_push`), idempotency (đẩy GCal, nhập GCal, nhập JSON), mất/lệch dữ liệu, giá trị rỗng vs 0, múi giờ và ranh giới ngày/tuần ISO/năm/DST, migration dữ liệu cũ (`cleanState`, trường `av`), phân quyền theo người dùng (RLS, hàm `lc_push`, `lc_delete_me`, IDOR), nhật ký/lịch sử (`lc_state_hist`), xuất/nhập/xóa. Viết kịch bản tái hiện bằng `loadDemo()` hoặc đoạn JS thuần; không đụng dữ liệu thật.

## Lượt 3 · Bảo mật (tên: `bao-mat`)
Xác thực Supabase, phiên, lưu token Google (`localStorage`?), XSS (chèn tên hoạt động/dự án/nhập JSON/CSV vào HTML), CSRF/CORS/kiểm origin và xác thực của `api/ai_plan.py` (giới hạn đầu vào, chi phí AI, `AI_ALLOWED_EMAILS`), header trong `vercel.json` (thiếu CSP?), bí mật trong repo và lịch sử git (`git log -p` tìm khóa), phụ thuộc CDN (ghim phiên bản, SRI), upload/nhập JSON, log lộ dữ liệu sức khỏe, RLS trong `schema.sql`. Chỉ đọc code và cấu hình; không gửi yêu cầu tới dịch vụ thật.

## Lượt 4 · Hiệu năng và chi phí (tên: `hieu-nang`)
Đây là phần đau nhất của PO. Đo, không phỏng đoán: kích thước `index.html` (thô và gzip), thời gian tải/parse script, thời gian `draw()` từng tab với dữ liệu demo và với dữ liệu lớn (sinh bộ dữ liệu 1–3 năm, 10 hoạt động/ngày), kích thước và tần suất ghi `localStorage`/JSON.stringify, tải lại thừa, quét toàn mảng, listener rò rỉ, chi phí Supabase/Vercel/AI. Dùng `performance.now()`, Performance API trong trang demo. Mỗi đề xuất kèm số đo hiện tại và cách đo lại. Pane có thể ẩn nên đừng đo FPS bằng rAF.

## Lượt 5 · Giao diện và trải nghiệm (tên: `giao-dien`)
Duyệt luồng chính (ghi nhanh, thêm/sửa/xóa hoạt động, hộp việc, xếp lịch, dự án, sức khỏe, tổng quan, cài đặt, sao lưu/khôi phục) ở 390×844 và 1440×900 (thêm 820), sáng/tối, offline (service worker), chữ 200%, bàn phím và a11y (nhãn, focus, vùng bấm), trạng thái trống/lỗi/đang tải. Dùng dữ liệu thử, ảnh chụp lưu ở `.impeccable/review/` (tạo nếu cần, không commit). Chỉ báo, không đề xuất đổi bố cục nếu chưa có 3 mockup.
