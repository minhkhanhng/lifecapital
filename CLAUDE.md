# CLAUDE.md · Life Capital

Điểm vào cho agent. Quy tắc bắt buộc nằm ở `rule-v2.md` (áp dụng từ 2026-11-19, thắng file này nếu mâu thuẫn). `rule.md` chỉ để đọc tham khảo, KHÔNG áp dụng. Thứ tự đọc (có giới hạn, xem rule-v2.md mục B): rule-v2.md → 5 mục đầu lesson.md → mục "Bản đang chạy" của CURRENT.md → mục đầu HANDOFF.md.

## Là gì
PWA cá nhân chia 168 giờ/tuần cho 5 loại vốn (Sức khỏe, Quan hệ, Trải nghiệm, Kỹ năng, Tài chính/Công việc). Người dùng thật hiện tại: chỉ chủ dự án (PO). Chi tiết sản phẩm: PRODUCT.md, README.md.

## Stack (đã xác nhận bằng đọc code/lệnh)
- Toàn bộ app là một tệp `index.html` (~10.4k dòng, ~655 KB; HTML + CSS + JS thuần, một khối `<script>` ~478 KB). Không có package.json, bước build, lint, typecheck hay CI.
- `sw.js`: service worker (offline). `manifest.json`: PWA. Icon PNG/ICO ở thư mục gốc.
- Dữ liệu: `localStorage` trong trình duyệt (khóa như `lc2_*`, `lc_onb`); đồng bộ tùy chọn qua Supabase (`supabase/schema.sql`: bảng `lc_state`, `lc_ping`, `lc_state_hist`, hàm `lc_push`, `lc_delete_me`, RLS theo `auth.uid()`; thư viện `@supabase/supabase-js@2.117.0` tải từ jsDelivr).
- `api/ai_plan.py`: hàm Vercel Python gọi Anthropic (model `claude-opus-5-5`), tùy chọn, cần `ANTHROPIC_API_KEY` trên Vercel.
- Google Calendar: đẩy một chiều bằng Google Identity Services, Client ID do người dùng nhập; thư viện Google chỉ tải khi có Client ID.
- Hosting: Vercel, tự deploy khi push. `main` = production, `staging` = xem thử. `.vercelignore` loại `*.md`, `.claude/`, `supabase/`, `tests/`, `scripts/`.

## Lệnh kiểm tra (không có npm)
| Việc | Lệnh |
|---|---|
| Máy chủ xem thử | `python3 -m http.server 8790 --bind 127.0.0.1` ở thư mục gốc (cổng 8765 thuộc dự án khác) |
| Test API | `python3 tests/api/test_ai_plan.py` (12 test) |
| Cú pháp JS | trích khối `<script>` không có `src` của index.html, `node --check`; và `node --check sw.js` |
| Test service worker | `node tests/sw/test_sw.js` (23 test, in `OK n/n`, thoát mã khác 0 nếu đỏ) |
| Test CSP + supabase-js tự host | `node tests/csp/test_csp.js` (in `OK n/n`); trong trình duyệt: `python3 tests/csp/serve.py 8806` (gắn CSP từ vercel.json) rồi `E2ECSP` (tests/e2e/e2e-csp.js). Bộ e2e cũ chạy dưới serve.py để kiểm 0 vi phạm CSP (E2EUX thêm cờ `--test-eval`) |
| e2e trong trang | 29 bộ trong `tests/e2e/` theo `tests/e2e/README.md`; cửa sổ ≥ 1400px, mỗi bộ trên trang mới tải sau `localStorage.clear(); localStorage.setItem("lc_onb","1")`, rồi `loadDemo()` và `await __run(file, fn)` |
| Test gộp dữ liệu | mở `/tests/merge-tests.html`, tiêu đề trang phải `PASS n/n` (hiện 35/35) |
| Giao diện | `tests/e2e/audit2.js`, `crdrive.js` (tương phản), `stdrive.js` (nét viền), `uiaudit.js` |

## Cấu trúc
```
index.html  sw.js  manifest.json  vercel.json  .vercelignore  requirements.txt  *.png *.ico
api/ai_plan.py        supabase/schema.sql
tests/api  tests/e2e  tests/css  tests/merge-tests.html
docs/huong-dan-day-code-github.md   # quy trình đẩy lên GitHub và phát hành
docs/quy-trinh-san-pham-template.md # mẫu quy trình sản phẩm cũ
docs/review/  docs/superpowers/plans/   # báo cáo review, plan từng gói
CHANGELOG.md  README.md  rule.md  lesson.md  CURRENT.md  HANDOFF.md  ROADMAP.md  PRODUCT.md  scripts/status.sh
```

## Quy tắc dữ liệu cốt lõi
Không làm mất dữ liệu người dùng; trường lạ/cũ giữ nguyên (máy chạy bản cũ vẫn đồng bộ); `loadDemo()` cho test, không dùng dữ liệu thật. Xem rule.md mục Dữ liệu.

## Phát hành
Chỉ khi PO nói rõ. Làm theo `docs/huong-dan-day-code-github.md`. Mỗi bản phải đổi 3 chỗ: `APPV` (index.html), `VERSION` (sw.js), CHANGELOG.md.
