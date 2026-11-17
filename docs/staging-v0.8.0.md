# Thử staging v0.8.0 (bản ứng viên)

Nhánh ứng viên `feature/v0.8.0` = nhánh tích hợp `claude/tich-hop` + nâng phiên bản (`APPV = 72`, `sw.js` `lc-0.8.0`, CHANGELOG). **Chưa push gì lên GitHub.** Đẩy lên staging chỉ khi chủ dự án nói rõ (rule.md §1). Production (`main`, v0.7.1) không đổi.

## 1. Có gì trong bản này
Gói 1 đến 8, sửa mt giả (chu-ky-mt), UI tab Sức khỏe, tab Thói quen riêng, việc con trong hoạt động, tự host `supabase-js` + CSP, SW mở bản đã lưu ngay + nhãn "Bản đã lưu". Chi tiết: `CHANGELOG.md` mục v0.8.0, `CURRENT.md`, `HANDOFF.md`.

Chỉ 4 thứ được deploy thay đổi: `index.html`, `sw.js`, `vercel.json` (thêm CSP), `vendor/supabase-2.117.0.umd.js` (217 874 B, SHA-256 `7b9e9c64109e15c338fa58c2bc77c32fb1c459bd587e22fc6b72cca80a388645`, `shasum -a 256` phải khớp). `api/`, icon, `manifest.json` không đổi.

## 2. Điều kiện đã kiểm (cục bộ)
- `origin/main` và `origin/staging` (`e5b871c`) đều là tổ tiên của nhánh này: đẩy lên staging là fast-forward, về sau gộp `main` bằng `--ff-only`.
- Không có bí mật trong phần thay đổi (quét `sk-ant`, `AKIA`, `ghp_`, `GOCSPX`, `service_role`, khóa riêng, JWT).
- `node --check` khối script chính và `sw.js`, `test_sw` 23/23, `test_csp` 19/19, JSON hợp lệ. Toàn bộ e2e (25 bộ ở 1440, các bộ ở 820 và 375, E2E/E2ESUB/E2EA11Y dưới CSP thật 0 vi phạm, merge-tests 35/35) xanh trên `claude/tich-hop` trước khi nâng phiên bản; nâng phiên bản chỉ đổi 2 hằng số và CHANGELOG.

## 3. RỦI RO DỮ LIỆU: staging dùng CHUNG Supabase với production
`SB_URL` trong `index.html` là một dự án Supabase duy nhất. Đăng nhập trên staging sẽ đọc và GHI dữ liệu THẬT của bạn (qua `lc_push`, có giữ 30 bản lịch sử). Bản mới thêm trường `subs` vào hoạt động và gộp `bl`/`cfg` khác cách; bản v0.7.1 trên production vẫn giữ trường lạ (rule §11) nên không mất dữ liệu, nhưng đây là dữ liệu thật. Chọn một:
- **A. Không đăng nhập trên staging** (an toàn nhất): thử CSP không bị chặn nhầm, mở bản đã lưu, nhãn "Bản đã lưu", giao diện, việc con, thói quen, bằng dữ liệu mẫu. Không thử được đồng bộ, đăng nhập Google/Email và Google Calendar.
- **B. Đăng nhập tài khoản thật sau khi tải sao lưu JSON mới** (Cài đặt → Dữ liệu → tải JSON, cất kỹ). Thử đầy đủ nhất; rủi ro giới hạn nhờ sao lưu và 30 bản lịch sử trên Supabase.
- **C. Dự án Supabase thử riêng** (tạo dự án mới, chạy `supabase/schema.sql`, đổi `SB_URL`/`SB_KEY` và `connect-src` chỉ trên nhánh staging): an toàn và đầy đủ nhưng tốn công, và nhánh staging khác bản production.

## 4. Việc BẠN phải làm trước khi thử đăng nhập (chỉ khi chọn B hoặc C)
1. Tải sao lưu JSON mới (rule: trước mỗi lần ra bản).
2. Supabase → Authentication → URL Configuration: thêm địa chỉ staging (`https://lifecapital-git-staging-minhkhanhng.vercel.app`, kiểm lại đúng địa chỉ Vercel hiện) vào **Redirect URLs**, nếu không đăng nhập báo lỗi chuyển hướng.
3. Nếu thử Google Calendar: Google Cloud Console → OAuth client của app → **Authorized JavaScript origins**: thêm địa chỉ staging.
4. Staging nằm sau đăng nhập Vercel: mở bằng trình duyệt đã đăng nhập Vercel. Lưu ý service worker và `manifest.json` có thể bị Vercel chặn (401) khi không có cookie; nếu cài PWA hoặc SW lỗi ở staging, ghi lại: có thể là do Deployment Protection chứ không phải lỗi app.

## 5. Lệnh đẩy lên staging (CHỈ chạy khi bạn nói rõ "đẩy lên staging")
```bash
cd ~/Desktop/Life-Capital
git fetch -q --prune origin
git push -u origin feature/v0.8.0
git push origin feature/v0.8.0:staging        # fast-forward từ e5b871c, không ghi đè commit nào
# chờ Vercel build (đổi <mã> thành `git rev-parse HEAD` của nhánh):
curl -s https://api.github.com/repos/minhkhanhng/lifecapital/commits/<mã>/status | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['state'], [(s['context'], s['state']) for s in d['statuses']])"
```
Hoàn tác staging (không ảnh hưởng production): `git push origin e5b871c:staging` (đưa nhánh staging về commit cũ; đây là fast-backward nên có thể cần `--force-with-lease` CHỈ cho nhánh `staging` và chỉ khi bạn đồng ý).

## 6. Danh sách thử (mở DevTools → Console, theo dõi mọi dòng "Refused to ..." = CSP chặn nhầm)
Mọi mục: ghi "đạt / lỗi + mô tả + ảnh". Khổ: máy tính 1440 và điện thoại thật.
1. **Tải trang**: không trắng, không lỗi console; tiêu đề đúng; thanh "Có bản mới" không hiện vòng lặp.
2. **Thông thường (không đăng nhập)**: Dữ liệu mẫu, thêm/sửa/xóa hoạt động, việc con (thêm, tích, xóa, mở lại), tab Thói quen (tích hôm nay), Sức khỏe (popup thuốc), Hộp việc, Dự án, Tổng quan; nền ảnh; xuất JSON/CSV; in báo cáo sức khỏe; Enter/Space mở hoạt động trên lịch.
3. **Mạng**: tắt mạng (DevTools Offline) rồi tải lại: app mở từ bản đã lưu, nhãn "Bản đã lưu" hiện; bật mạng: nhãn ẩn trong vài giây. Tải lại 2 lần sau khi đổi bản: không còn bản cũ.
4. **Cài PWA** (điện thoại, nếu Vercel Protection không chặn): biểu tượng đúng (icon 512 tải qua SW), mở độc lập.
5. **Chỉ khi chọn B/C**: đăng nhập Google/Email; đăng xuất; đồng bộ 2 máy (sửa ở máy A, thấy ở máy B trong vài giây, `wss`); gộp hai máy sửa cùng lúc; Google Calendar: kết nối, nhập, đồng bộ một hoạt động, **Ngắt** (nếu console báo vi phạm `connect-src` tới `oauth2.googleapis.com` thì báo lại để thêm đúng nguồn đó vào CSP).
6. **Điện thoại thật**: vùng bấm nút "+", nhãn "Tốt", nút thu gọn; bàn phím ảo không che ô nhập việc con; chế độ sáng/tối.

## 7. Sau khi thử
- Đạt: bạn nói "phát hành lên production" (theo `docs/huong-dan-day-code-github.md` bước 6–8: `--ff-only`, tag `v0.8.0`, kiểm `sw.js`/`APPV`/`/api/ai_plan`).
- Có lỗi: ghi lại; việc sửa làm trên nhánh mới từ `feature/v0.8.0`, không sửa trực tiếp.
- Rút lại CSP nếu cần: SW lưu cả header của `./` nên máy đã tải bản mới vẫn dùng CSP cũ thêm ít nhất một lần mở (tải lại 2 lần mới hết).
