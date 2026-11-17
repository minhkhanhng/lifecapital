# CURRENT · Hiện trạng (cập nhật 2026-11-17)

## Bản đang chạy (đã xác nhận)
- Production https://lifecapital.vercel.app: `sw.js` = `lc-0.7.1`, `APPV = 71; // v0.7.1` (đối chiếu bằng GET chỉ đọc ngày 2026-11-17); `/api/ai_plan` GET trả 200; có HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`.
- Commit `7dabf5f` trên `main` = `origin/main` (2026-11-05 12:59 +0700). Tag mới nhất `v0.7.1`. CHANGELOG ghi v0.7.1 ngày 05/11/2026. Ngày deploy chính xác: chưa kiểm (không xem được lịch sử Vercel).
- `staging` cũ hơn `main` (commit cuối 2026-10-19, v0.6.0), không phải bản đang chạy.
- Người dùng thật: chỉ PO (xác nhận 2026-11-17).

## Kết quả kiểm tra (chạy 2026-11-17 trên worktree `claude/review-2026-11-17`, tách từ `main`, chưa sửa code)
| Hạng mục | Kết quả |
|---|---|
| Test API `tests/api/test_ai_plan.py` | 12/12 đạt |
| Cú pháp JS index.html (khối script chính), sw.js, manifest.json | hợp lệ |
| e2e 14 bộ, web 1440×900, trình duyệt tích hợp, dữ liệu demo | E2E 95/95, E2E61 41/41, E2ESCHED 28/28, E2EHB 34/34, E2EUAT2 71/71, E2EHL 85/85, E2EHL2 53/53, E2EUAT3 62/62, E2EUX 124/124, E2EAI 44/44, E2EPLAN 46/46, E2EDASH 36/36, E2EPJL 36/36, E2E63 77/77. Tổng 832/832, 0 lỗi console |
| `tests/merge-tests.html` | PASS 30/30 |
| typecheck, lint, build, CI | Không tồn tại trong dự án |
| npm audit | Không áp dụng (không có npm); phụ thuộc duy nhất ở trình duyệt là supabase-js 2.117.0 ghim phiên bản trên jsDelivr |

Ghi chú: lần chạy đầu E2E báo 94/95 (ca "A4 cột trái hiện ở màn rộng") vì cửa sổ chỉ 575px; chạy lại riêng ở 1440px thì 95/95 (lesson.md).

## Chưa kiểm
- e2e ở khổ mobile 390×844 (các bộ test được viết cho ≥ 1400px); sáng/tối, `audit2/crdrive/stdrive/uiaudit`, kiểm tra Python 3.9 vs runtime Vercel.
- Thiết bị thật (iPhone/Android), Google Calendar thật, đăng nhập/đồng bộ Supabase thật, `/api/ai_plan` có khóa thật: chưa kiểm, cần PO.
- Bản Vercel: biến môi trường (`ANTHROPIC_API_KEY`, `AI_ALLOWED_EMAILS`) đã đặt hay chưa: chưa biết.
- Review độc lập bằng fable: ĐÃ chạy 5 lượt ngày 2026-11-17 (`docs/review/`): 2 Critical (cùng một gốc, gộp thành A1), 20 Important, nhiều Minor. Chưa sửa gì; bản đang chạy vẫn v0.7.1. Việc fable chưa xem được: SW/offline thật, Supabase và Google thật, biến môi trường Vercel, cài đặt Supabase Auth, thiết bị thật.

## Việc PO phải tự làm (nhắc sớm)
Đã xong (PO báo 2026-11-17): B4 tắt "Allow new users to sign up" trong Supabase Auth; tải sao lưu JSON; thử trên điện thoại thật bản đang chạy. PO không dùng AI (không có chi phí) nên B3 và `AI_ALLOWED_EMAILS` bỏ khỏi phạm vi.
Còn lại:
1. Trước MỖI lần ra bản mới: tải sao lưu JSON mới.
2. Quyền ghi GitHub / push / deploy: chỉ khi PO nói rõ (đã có đăng nhập qua Keychain theo `docs/huong-dan-day-code-github.md`).
3. Thử trên thiết bị thật trước khi ra bản mới.
4. Nếu dùng Career OS trong khung Browser của Claude: localStorage của `127.0.0.1:8765` đã bị `clear()` nhầm ngày 2026-11-17 (lesson.md); kiểm tra xem có mất gì không.

## Gói 1 mat-du-lieu (nhánh `claude/mat-du-lieu`, chưa push)
- Commit `f3bc0bc` test đỏ E2ELIM (9/12 đỏ), `3cd4c61` bỏ ngưỡng cắt, thay bằng `SANE_MAX = 100000` (`index.html:2389`). Kiểm lại bởi fable (trước khi PO dừng dùng fable): E2ELIM 12/12; 14 bộ cũ 832/832; tổng 844/844; merge-tests 30/30; test_ai_plan 12/12; node --check đạt. Chưa chạy mobile 390×844.
- Gói 1b xong trên nhánh `claude/importdata-khong-cat` (commit test đỏ 3529600, sửa ade600b, test an toàn hơn ở commit kế tiếp): E2EIMP 5/5, E2ELIM 12/12, E2E 95/95, E2EUAT2 71/71, E2E63 77/77, merge 30/30 (số do implementer báo; E2EIMP chạy lại bởi tôi sau khi sửa test). Reviewer Haiku báo test ghi lc2 vào localStorage → đã sửa để khôi phục lc2/lc2_mine; ý kiến "chế độ Gộp không có hộp xác nhận" của Haiku sai (có `ask` "Gộp dữ liệu?"), giữ bước bấm xác nhận.
- Ngoài phạm vi gói 1, đã tách thành gói 1b: `importData` chế độ Gộp còn cắt `secs/ms/ups` dự án đã có ở 20/50/30 (`index.html:~5743`).
- Fable đo thêm (docs/review/2026-11-17-fable-sw-offline.md): C1 xác nhận (SW chờ tới 4,07 s khi mạng chậm/treo), A8 xác nhận (404/500 → trang lỗi dù có cache), cache cài đầu 1.354.082 B, A6 xác nhận, A5 xác nhận cơ chế; mục mới: offline không có dấu hiệu nào khi chưa đăng nhập.

## Gói 2 dong-bo-an-toan (nhánh `claude/dong-bo-an-toan`, từ `claude/importdata-khong-cat`, chưa push)
- A2 `cloudKeep` (chỉ xóa `lc_sync` khi ghi base lỗi), A3 nhập Gộp khử trùng theo `id`, A4 `wipeLocal` xóa token Google/`gcal_linked`/`lc_gx_seen`, A7 `save()` báo đúng nguyên nhân + `console.error`, A8 `sw.js networkFirst` trả cache khi 404/5xx. Mỗi mục có test đỏ trước.
- Kết quả (implementer Sonnet báo; A2 sau fix-loop tôi đã đọc lại code): E2ESYNC 14/14, E2ELIM 12/12, E2EIMP 5/5, 14 bộ cũ 832/832 (lần chạy trước fix; sau fix chỉ chạy lại E2E, E2EUAT2, E2E63), merge 30/30, `node tests/sw/test_sw.js` 3/3, node --check đạt. Reviewer Haiku tìm 2 Important (A2 quá tay, test dọn chưa sạch) → đã sửa. A8 chỉ test bằng Node giả lập, cần thử SW thật khi phát hành. Chưa chạy mobile 390×844.
- Minor ghi nhận: Gộp bỏ im lặng bản sửa trùng id (đúng plan); `sw.js` `.catch` của `caches.match` thiếu xử lý từ chối (có từ trước).

## Gói 3 xss-va-token (nhánh `claude/xss-va-token`, từ `claude/dong-bo-an-toan`, CHƯA commit, chưa push)
- B1: `esc()` bọc tên triệu chứng ở `hlAdvice()` (6 điểm) và `hlSummary()` (1 điểm); `hlSyName` giữ nguyên. B6: `gcal_token`/`gcal_token_exp` chuyển sang `sessionStorage` (`getGCalToken`, `clearGCalToken`, callback đăng nhập, `disconnectGoogleCalendar`); `gcalMigrateToken()` chép token cũ còn hạn từ `localStorage` rồi xóa, giữ `gcal_linked`. Hệ quả: đóng tab là phải kết nối lại Google.
- Test đỏ trước: E2EXSS 4/16 (X1.1-X1.4, T6.1, T6.3-T6.6 đỏ, `window.__xss` đã chạy). Sau sửa, tôi chạy lại: E2EXSS 14/14 (có chốt: không có dữ liệu demo thì dừng), E2ESYNC 14/14, E2E63 77/77, node --check index.html/sw.js/e2e-xss.js đạt, `test_sw` 3/3. Sonnet báo thêm (chưa chạy lại sau chốt): E2E 95/95, E2EUAT2 71/71, E2EUAT3 62/62, E2EHL 85/85, E2EHL2 53/53, merge 30/30. Sáu bộ còn lại trong 14 bộ chưa chạy; chưa chạy mobile 390×844.
- Reviewer Haiku: 0 Critical, 1 Important (test gọi `wipeLocal` không có chốt dữ liệu thử) đã sửa. Minor: `onclick="hlSy('${k}'...)"` dùng id (id đã lọc `[\w-]{1,24}` trong `cleanState`, không đổi), token cũ không có hạn thì không hết trong phiên (như trước), `e2e-v063.js` xóa khóa gcal ở sessionStorage không khôi phục (chỉ token phiên).
- Dòng `<b>${a.t}</b><span>${a.d}</span>` vẫn in thô: mọi chuỗi lời khuyên mới phải `esc` dữ liệu người dùng ở nguồn.

## Gói 4 gop-hai-may (nhánh `claude/gop-hai-may`, từ `claude/xss-va-token`, chưa push)
- A5: `markPending` cấp `gi` ngay khi đánh dấu (chỉ khi đủ điều kiện, chưa có `gi` và `gid`). A6: hàm mới `mergeKeys` gộp `bl` và `cfg` ba bên theo từng khóa (giữ `0`/`false`, khóa lạ, `__proto__` bị bỏ); `mem`, `pm`, `memV` vẫn `pick`.
- Test đỏ trước: E2EMRG 12/20 (M5.1, M5.2, M5.6, M6.1, M6.2, M6.6, M6.7, M6.9 đỏ). Tôi chạy lại sau thay đổi cuối: E2EMRG 21/21 (thêm M5.7 sau review), `merge-tests.html` PASS 35/35 (30 cũ + 5 mới), `node --check` đạt. Opus báo (code không đổi sau đó): E2ESYNC 14/14, E2ELIM 12/12, E2EIMP 5/5, E2EXSS 14/14, E2E 95/95, E2EUAT2 71/71, E2E63 77/77, E2EUAT3 62/62. Chưa chạy mobile 390×844 và sáu bộ e2e còn lại.
- Reviewer Sonnet (implementer là Opus): 0 Critical, không có đường mất dữ liệu mới. Ghi nhận hành vi: (1) gộp KHÔNG có gốc chung là hợp hai bên, khóa máy này đã xóa có thể quay lại từ máy kia (`cfg.mods`, `bl[k]`, `gcalClientId`); (2) xung đột cùng khóa: máy này thắng (không có `mt`); (3) `cfg.mods` và `bl[k]={u,d}` so nguyên khối: hai máy sửa khác thành phần thì mất một; (4) `mem` còn lỗi gộp cũ (chỉ mất gợi ý đoán loại vốn); (5) sự kiện chờ gửi tạo TRƯỚC gói này vẫn đua ở `gcalCreateEvent` như cũ.
- Lệch plan: `bl[k]` có dạng `{u,d}` (không phải số); M6.3, M6.4 xanh sẵn vì `pick` cũ đã xử lý khi chỉ một khóa đổi.

## Gói 5 sw-mo-nhanh (nhánh `claude/sw-mo-nhanh`, từ `claude/gop-hai-may`, chưa push)
- C1: điều hướng tới `/` và `/index.html` mở ngay bản đã lưu, làm mới nền (`cache:"no-cache"`, hạn chót 8 s, chỉ lưu phản hồi `ok`, không redirect, `basic`); chưa có bản lưu thì chờ mạng như cũ; HTML phụ không bị chặn. C4: `CORE` bỏ `icon-512.png`, `icon-maskable-512.png` (vẫn vào cache qua `cacheFirst`). Mới: nhãn `#netChip` "Bản đã lưu" cạnh tiêu đề (PO chọn Hướng 2 trong 3 mockup); SW báo `{lc:"net",ok}`; trang gửi `net?` lúc mở và `net!` khi `online`/`offline`/quay lại tab. A8 đã xong ở gói 2. KHÔNG đổi `VERSION`/`APPV`/CHANGELOG: phát hành gói này phải nâng đủ 3 chỗ (rule §18).
- Test đỏ trước: `test_sw.js` 8/15 (SW9.*), E2ESW 1/10; sau review thêm SW10.* đỏ 6 ca (17/23). Tôi chạy lại sau thay đổi cuối: `test_sw.js` 23/23, E2ESW 10/10 (1440; Opus báo 390 cũng 10/10), E2E 95/95, E2EUX 124/124, `merge-tests.html` PASS 35/35, `node --check` index.html và sw.js đạt. Opus báo (trước vài chỉnh nhỏ ở `index.html`, không đổi DOM): E2EUAT2 71/71, E2EUAT3 62/62, E2EDASH 36/36, E2ESYNC 14/14, E2EXSS 14/14, E2EMRG 21/21. Chưa chạy lại sau chỉnh `net!`: E2EUAT2, E2EUAT3, E2EDASH, E2ESYNC, E2EXSS, E2EMRG. Chụp màn hình: nhãn hiện cùng hàng tiêu đề ở 1440 và 390, không tràn; chưa thử khi đã đăng nhập (thêm `cloudBadge`) ở 390.
- SO ĐO THẬT (Chrome 157 headless, `localhost`, profile riêng; một lần đo mỗi kịch bản; chạy TRƯỚC khi thêm SW10.*, tức `sw.js` chưa có hạn chót/`net!`/lọc redirect): máy chủ trả `/` sau 6 s: 4067 ms → 33 ms; máy chủ treo 30 s: 4048 → 42 ms; máy chủ tắt: 35 → 36 ms (từ cache); 500/404 khi đã có bản lưu: ra từ bản lưu cả hai bản; Cache Storage lần cài đầu 1 357 172 B → 833 309 B (−523 863 B, −38,6%); icon-512 vẫn tải được và vào cache khi SW bật; làm mới nền hoạt động (mở ra bản cũ ngay, cache có bản mới sau ~60 ms, lần mở kế tiếp ra bản mới); nhãn hiện khi máy chủ tắt và ẩn sau 257 ms khi `online`. LƯU Ý: lần mở bình thường (a2, a3) của bản mới đo chậm hơn bản cũ (315/145 ms so với 47/53 ms), một lần đo, chưa rõ nhiễu hay chi phí làm mới nền; cần đo lặp trước khi phát hành. Chưa đo lại sau các sửa SW10.*.
- Reviewer Sonnet (implementer Opus): 0 Critical; Important đã sửa: #1 mọi điều hướng nhận `./` (nay chỉ `/`, `/index.html`), #2 phản hồi redirect/không `basic` vào cache; Minor đã sửa: hạn chót `revalidate`; thêm `net!` (phép đo thấy nhãn sai tới 30 s khi mạng đứt giữa phiên). Còn lại: bản deploy hỏng trả 200 vào cache sống tới lần làm mới thành công sau (cần thêm một lần mở để lấy bản tốt); `visibilitychange` thật, Safari/iOS, Vercel thật chưa kiểm; một ca E2ESW chỉ kiểm thang chữ bằng danh sách cứng.

## Gói tab-thoi-quen (nhánh `claude/tab-thoi-quen`, từ `claude/sw-mo-nhanh`, chưa push)
- Tách thói quen khỏi Lịch thành tab riêng "Thói quen" (PO chọn bố cục C "tập trung hôm nay", điều hướng N2). Lịch chỉ còn lịch + "Giờ theo loại vốn". Không đổi `S.habits`, `APPV`, `VERSION`, CHANGELOG (phát hành phải nâng đủ 3 chỗ, rule §18).
- THAY ĐỔI HÀNH VI: (1) thêm tab `hb` ngay sau "Sức khỏe" (7 tab trên desktop); ẩn khi tắt module `hb`. (2) ≤899px tab "Tổng quan" bị ẩn khỏi thanh dưới (còn 6 tab), vào Tổng quan qua thẻ "Mở Tổng quan" đầu tab Tôi. (3) phím `1–7` theo tab đang hiện. (4) nút Thêm ở tab hb mở form thêm thói quen; ở tab hb ẩn nút Tổng kết tuần và ô ghi nhanh. (5) Thẻ quản lý thói quen không còn ở tab Tôi/Vốn; nút "Quản lý" ở dashboard nhảy sang tab hb. (6) Chưa có khóa nhớ tab: mở lại app luôn vào tab mặc định (hành vi cũ, không đổi).
- Test: `tests/e2e/e2e-tabhb.js` (`E2ETABHB`) đỏ trước (commit `17dd35a`), sau cài 32/32 ở 1440, 34/34 ở 390×844. Sau thay đổi cuối `index.html`, chạy lại ở 1440 (mỗi bộ trang mới tải): E2EHB 34/34, E2E 95/95, E2EUAT2 71/71, E2EUAT3 63/63 (62 cũ + L1.3b mới), E2EDASH 36/36, E2EUX 124/124, E2E61 41/41, E2E63 77/77, `merge-tests.html` 35/35, `node --check` đạt.
- Test cũ sửa chỉ ở chỗ kiểm vị trí cũ: `e2e-hb.js`, `e2e-uat2.js` (thẻ `.hb-chip`→`.hbt-card`, vào tab hb), `e2e-uat3.js` L1.3 (Tôi không còn thẻ quản lý thói quen + L1.3b kiểm tab hb), `e2e-v063.js` M7.1 (6→7 tab).
- Kiểm tay: 390×844 (6 nút thanh dưới 56×44, không tràn ngang, nút tích 56×56 trên cảm ứng), 820 (cùng bố cục, không tràn), 1440 sáng và tối (tối chỉ xem một ảnh ở 1440, chưa xem ở 390/820). Chưa kiểm thiết bị thật, chưa chạy các bộ e2e ngoài danh sách trên (HL, HL2, SCHED, AI, PLAN, PJL, SW, SYNC, XSS, MRG, LIM, IMP).
- Reviewer Haiku (implementer Sonnet, chỉ đọc code): 0 lỗi làm hỏng chức năng. Ghi nhận: (a) H3.6 bỏ `mt` khi so thói quen khác vì `save()` đóng dấu lại `mt` mọi thói quen (có từ trước, đã ghi chú trong test; không sửa vì đổi dữ liệu); (b) nghi breakpoint ẩn tab Tổng quan lệch 640/899: đã đo ở 820 thấy nút Tổng quan 0×0, đúng; (c) phím 6 vẫn mở Tổng quan trên màn hẹp (bàn phím vật lý), Minor; (d) CSS `.hb-chip/.hb-strip/.hb-list` chết, để nguyên.
- Rủi ro gộp: `claude/ui-suc-khoe` và `claude/chu-ky-mt` đều sửa `index.html` từ cùng gốc `7cd70be`; vùng sửa khác nhau (CSS ~960/1700/1917 và hlTodayCard/hlLogHTML/hlMed* ở ui-suc-khoe; dữ liệu/đồng bộ ở chu-ky-mt) nên ít xung đột chữ, nhưng nhánh này sửa CSS gần `body[data-tab="me"]` (~2044) và `V.me` (~10176) cùng khu với ui-suc-khoe; chạy lại E2EHL/E2EHL2/E2EUAT3 sau khi gộp.

## Quyết định PO (2026-11-17)
- Từ 2026-11-17: không dùng fable nữa; ưu tiên model ít tốn token nhất mà vẫn hiệu quả (Haiku việc cơ học, Sonnet code, reviewer khác model với implementer).
- Đau nhất: chậm / nặng. Cấm đụng: không có phần nào (mọi đề xuất vẫn qua duyệt). Quy tắc dữ liệu: không mất dữ liệu người dùng. Đường quay lại: tải JSON + tag git. Mục tiêu từng tab: dùng README, chưa PO xác nhận.

## Tôi tự chốt
- Thêm `scripts/` vào `.vercelignore` để `scripts/status.sh` không bị deploy. Nếu sai thì tốn: một dòng, bỏ đi là xong.
- Dùng cổng 8790 cho máy chủ xem thử (8765 bị dự án khác chiếm).
