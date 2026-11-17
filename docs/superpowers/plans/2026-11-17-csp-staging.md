# Gói 7 (ROADMAP) · csp-staging Implementation Plan

> Lưu ý đặt tên: session khác đang làm "gói chu-ky-mt" (sửa chữ ký `mt`), không liên quan gói này. Gói này là dòng 7 trong ROADMAP.md.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** (B2) thêm `Content-Security-Policy` vào `vercel.json` để giới hạn nơi mã được tải và nơi dữ liệu có thể gửi đi (Supabase, Google), chặn plugin/nhúng khung/đổi `<base>`. (B5) tự host `supabase-js` 2.117.0 (đã tải về `vendor/supabase-2.117.0.umd.js` với sự cho phép của PO; 217 874 byte, SHA-256 `7b9e9c64109e15c338fa58c2bc77c32fb1c459bd587e22fc6b72cca80a388645`) thay vì nạp ESM từ jsDelivr (bớt ~8 kết nối lúc đăng nhập, bỏ jsDelivr khỏi `script-src`).

**Architecture:** `vercel.json` thêm một header CSP (chưa deploy; thử ở `staging` khi PO cho phép push staging). `index.html` đổi cách nạp thư viện: chèn thẻ `<script src="vendor/supabase-2.117.0.umd.js">` khi cần (như hiện nay chỉ nạp khi đăng nhập), rồi dùng `window.supabase.createClient`. Không đổi cấu trúc dữ liệu, giao diện, `APPV`, `VERSION`, CHANGELOG, `lc_push`/schema. Không push/deploy; commit cục bộ trên nhánh gói (PO đã cho phép).

**Spec:** `docs/review/2026-11-17-fable-bao-mat.md` mục B2, B5; `docs/review/2026-11-17-tong-hop.md` B2, B5; `rule.md` §0, §1, §13.

## Điều đã biết (đừng làm lại)
- Nguồn bên ngoài của app (`grep` `index.html`): Supabase `https://bvuvgjiufpjsidyyigkb.supabase.co` (REST/Auth/Realtime `wss://`), `https://www.googleapis.com` (Calendar), `https://accounts.google.com` (thư viện đăng nhập Google, `gsiLoad`), `https://cdn.jsdelivr.net` (nạp `supabase-js` `index.html:~7427`, `import(SB_LIB)` `:~7646`), `https://claude.ai` (chỉ là liên kết điều hướng). Không có font/ảnh/CSS ngoài; nền ảnh người dùng là `blob:` (`index.html:~7354`).
- Script và hơn ~400 handler `on*=` nằm inline, style inline nhiều: CSP BẮT BUỘC có `'unsafe-inline'` ở `script-src` và `style-src`. Vì vậy CSP này không chặn được XSS đã có (B1 đã sửa riêng), giá trị là: giới hạn nơi dữ liệu rò đi (`connect-src`), chặn script ngoài lạ (`script-src` không có `https:`), chặn `object-src`, `base-uri`, `frame-ancestors`, `form-action`.
- `sw.js` hằng `CDN` (`cacheFirst` cho jsDelivr) giữ nguyên, vô hại sau khi bỏ nạp CDN; không sửa `sw.js` ngoài nếu cần để `vendor/` vào cache bằng `cacheFirst` (đã đúng: cùng nguồn).
- `.vercelignore` không loại `vendor/` (cần deploy). Giữ.

## Thiết kế CSP (khởi điểm, điều chỉnh theo bằng chứng)
```
default-src 'self';
script-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/client;
style-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/style;
img-src 'self' data: blob:;
font-src 'self' data:;
connect-src 'self' https://bvuvgjiufpjsidyyigkb.supabase.co wss://bvuvgjiufpjsidyyigkb.supabase.co https://www.googleapis.com https://accounts.google.com;
frame-src https://accounts.google.com;
manifest-src 'self';
worker-src 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none'
```
Ghi chú: Google Identity Services cần `script-src https://accounts.google.com/gsi/client`, `frame-src` và `connect-src https://accounts.google.com/gsi/`, `style-src https://accounts.google.com/gsi/style`. KHÔNG dùng `'unsafe-eval'`, `https:` trần, hay `*`. Nếu `index.html` có dùng `eval`/`new Function` thì dừng và báo. `Content-Security-Policy-Report-Only` KHÔNG dùng (không có điểm nhận báo cáo); dùng header cưỡng chế và thử ở staging.

## Global Constraints
- Không gọi Supabase/Google thật trong test (rule §0, §12); không dùng dữ liệu thật. Bằng chứng CSP chia hai: (a) kiểm tĩnh bằng Node (đủ nguồn, không dư nguồn lỏng); (b) chạy app trong trình duyệt dưới máy chủ cục bộ gắn ĐÚNG header CSP lấy từ `vercel.json`, nghe `securitypolicyviolation` trong khi chạy các luồng chính, kỳ vọng 0 vi phạm. Phần không thử được cục bộ (Google đăng nhập, Calendar, Supabase thật) PHẢI ghi rõ "chưa kiểm, cần thử ở staging" trong CURRENT.
- Test trình duyệt ở cổng lạ 8806 (`python3 tests/csp/serve.py 8806` từ thư mục worktree, Bash nền, không giấu đầu ra; `preview_start` đọc nhầm cấu hình); kiểm `<title>Life Capital`; cổng 8765 là dự án khác; dùng tab trình duyệt riêng (`tabs_create`), các session khác có thể dùng pane; ≥ 1400px cho e2e.
- Không refactor ngoài phạm vi; không sửa logic đồng bộ; không đổi `SB_KEY`/`SB_URL`.

## Review Focus
- CSP có chặn nhầm tính năng đang chạy (nền ảnh blob, SW, manifest, biểu tượng `data:`, xuất/nhập tệp bằng `blob:`/`download`, in báo cáo sức khỏe, mở `claude.ai`)? Mỗi chỗ có bằng chứng (test hoặc đọc mã).
- `window.supabase` nạp đúng, `createClient` nhận cùng tham số như bản cũ (`auth.storageKey`, PKCE, `persistSession`...) — bản UMD có cùng API với ESM? Có chỗ dùng export khác (`createClient` là đủ)?
- Nạp thư viện lỗi (mất mạng, tệp chưa có trong cache SW): hành vi như trước (báo lỗi đăng nhập, không trang trắng).
- Hash tệp vendor cố định trong test: ai đó sửa/đổi tệp thì test đỏ.
- Không mở rộng quyền (không thêm `https:`/`*`/`'unsafe-eval'`).

### Task 1 (B5): tự host supabase-js, test đỏ rồi sửa

**Files:** Create `tests/csp/test_csp.js` (Node) + `tests/csp/serve.py` + `tests/e2e/e2e-csp.js` (`window.E2ECSP`, khuôn `e2e-sync2.js`) + dòng README; Modify `index.html` (`SB_LIB`, hàm nạp `sbLoading`).

- [ ] **Step 1: Ca đỏ.** `test_csp.js` ca `C5.1`: `index.html` không còn chuỗi `cdn.jsdelivr.net` ở mã (trừ chú thích) và `SB_LIB` trỏ `vendor/supabase-2.117.0.umd.js`; `C5.2`: tệp vendor tồn tại, SHA-256 đúng hằng ở đầu tệp này, chứa chuỗi `2.117.0` và `createClient`, không có `eval(`/`new Function(` mới (so với bản đã tải); `C5.3`: `sw.js` không cần đổi: `./vendor/...` cùng nguồn đi `cacheFirst` (đọc logic). `E2ECSP` ca `E5.1`: gọi hàm nạp thư viện (tên theo mã, `index.html:~7645`) KHÔNG gọi mạng Supabase: sau nạp `window.supabase.createClient` là hàm và client tạo được với `SB_URL`/`SB_KEY` giả; `E5.2`: nạp hai lần chỉ tạo một thẻ `<script>`; `E5.3`: tệp không tải được (đổi tên đường dẫn trong test) → lời hứa bị từ chối, `sbLoading` được đặt lại để thử lại như cũ; `E5.4`: không còn `import(` tới jsDelivr.
- [ ] **Step 2: Chạy, phải ĐỎ** (`C5.1`, `E5.1`, `E5.4`). Ghi số đỏ.
- [ ] **Step 3: Sửa.** **Step 4: Chạy lại xanh.**

### Task 2 (B2): CSP, test đỏ rồi sửa

**Files:** Modify `tests/csp/test_csp.js`, `tests/e2e/e2e-csp.js`, `vercel.json`.

- [ ] **Step 1: Ca đỏ.** `test_csp.js` `C2.*`: `C2.1` `vercel.json` có header `Content-Security-Policy`; `C2.2` có đủ các chỉ thị (`default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`, `form-action 'self'`); `C2.3` `script-src` không chứa `https:` trần, `*`, `'unsafe-eval'`, `jsdelivr`; `C2.4` `connect-src` chứa Supabase `https` và `wss`, `www.googleapis.com`, KHÔNG chứa `*`/`https:` trần; `C2.5` mọi gốc `https?://` trong mã chạy của `index.html`/`sw.js` hoặc nằm trong CSP hoặc nằm trong danh sách điều hướng cho phép (`claude.ai`, khai báo rõ trong test); `C2.6` mọi header cũ (nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy, X-Robots-Tag) vẫn còn nguyên; `C2.7` JSON hợp lệ. `E2ECSP` `E2.*` (chạy dưới `serve.py` gắn header CSP đọc từ `vercel.json`): `E2.0` trang có header thật (kiểm bằng `fetch(location.href)`: header `content-security-policy` có mặt); `E2.1` nghe `securitypolicyviolation` rồi chạy: tải app, `loadDemo()`, mở từng tab (lịch, hộp việc, dự án, sức khỏe, tổng quan, tôi), mở Cài đặt, mở popup thêm hoạt động và thuốc, nhập nhanh một hoạt động, đổi nền bằng ảnh `blob:` (tạo ảnh giả), xuất JSON, `window.print` không gọi; kỳ vọng 0 vi phạm; `E2.2` nạp `supabase-js` (Task 1) dưới CSP: 0 vi phạm; `E2.3` chèn thử một `<script src="https://cdn.jsdelivr.net/...">` bị CHẶN (vi phạm được báo) — chứng minh CSP thực sự có hiệu lực.
- [ ] **Step 2: Chạy, phải ĐỎ** (`C2.1`–`C2.5`, `E2.0`, `E2.3`). Ghi số đỏ.
- [ ] **Step 3: Sửa `vercel.json`** theo thiết kế; nếu bằng chứng cho thấy chặn nhầm tính năng thì nới ĐÚNG nguồn cần (không `https:`/`*`) và giải thích trong báo cáo. **Step 4: xanh lại.**

### Kiểm tra cuối
- [ ] `node tests/csp/test_csp.js` (in `OK n/n`), `E2ECSP` dưới `serve.py`; các bộ cũ KHÔNG dưới CSP vẫn xanh: E2E 95/95, E2ESYNC 14/14, E2ESYNC2 24/24, E2EXSS 14/14, E2ESW 10/10, E2EUAT3 62/62, E2EUX 124/124, merge-tests 35/35, `node tests/sw/test_sw.js` 23/23; và chạy ÍT NHẤT bộ E2E (95) và E2EUX (124) DƯỚI `serve.py` (có CSP) với 0 vi phạm. `node --check` khối script chính và `sw.js`. JSON `vercel.json` hợp lệ. Ghi vào CURRENT các việc cần thử ở staging: đăng nhập Supabase (Google/Email), đồng bộ thời gian thực `wss`, Google Calendar (GIS popup, token, API), cài PWA, nền ảnh, in báo cáo.
