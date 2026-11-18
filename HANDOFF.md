# HANDOFF · Bàn giao cho session sau (mục mới nhất ở trên)

## 2026-11-18 · ĐÃ PHÁT HÀNH v0.9.3 LÊN PRODUCTION (PO: "Phát hành v0.9.3")
- `git merge --ff-only refs/heads/feature/v0.9.3` vào `main`, `git tag v0.9.3`, `git push origin main` (`fd0c79e..e28c0f6`), `git push origin v0.9.3`; Vercel `success`; kiểm production: sw `lc-0.9.3`, `APPV 76`, `/api/ai_plan` 200, vendor/icon/CSP đạt, `index.html` và `sw.js` khớp byte với repo. Số liệu: CURRENT.md "Bản đang chạy".
- Nội dung: dàn lại chiều dọc tab Lịch (Hướng B). Chi tiết và đánh đổi: mục "Dàn lại chiều dọc tab Lịch" bên dưới.
- HOÀN TÁC: commit revert `8787bbf` trên nhánh mới từ `main` (KHÔNG force-push), nâng `APPV` 77/`VERSION` `lc-0.9.4`/CHANGELOG; dữ liệu không đổi.
- Việc còn lại: PO xem v0.9.3 thật (nhất là tên hoạt động bị cắt ở cột hẹp, màn 900–1199 px) và thử đăng nhập/đồng bộ/Google Calendar/PWA/điện thoại thật; quyết giữ hay xóa mã chết `capSumHTML`; lỗi mức thấp số 6 của việc con (đẩy Google khi chỉ tích việc con); gói 9 `hieu-nang-sau`, 10 `don-nhe`; mục E4.
- Next step: PO dùng v0.9.3, báo lỗi/ý kiến giao diện; tôi sửa trên nhánh mới từ `main` (không dùng fable).

## 2026-11-18 · Dàn lại chiều dọc tab Lịch (Hướng B, PO chọn) trên `claude/lich-chieu-doc` (từ `main` = v0.9.2; chưa push, chưa deploy)
- PO nhận xét phần đầu trang Lịch trống còn lưới tuần chi chít (lưới bắt đầu y≈400 của 900). Hướng B (3 mockup): ô ghi nhanh vào hàng tiêu đề, "Hôm nay" thành thanh mảnh, thẻ hoạt động gọn.
- Thay đổi (index.html, ≥ 900 px chuột; dưới 900 px giữ bố cục di động): `.quick-capture-box` chuyển vào `.app-header` (giữa tiêu đề và nút; `#nlpInput`, `aria-label`, nút Ghi, `#nlpPreview` giữ nguyên, xem trước thành hộp thả xuống tuyệt đối); `.page-sub` ẩn (còn trong DOM); `.today-hero` thành thanh một hàng (cao 56 px: lời chào + 3 vòng + ô Tiếp theo); `.wk-bar` margin-bottom 8; thẻ `.event-item` padding 6×10, tên luôn 1 dòng ellipsis (bỏ container query ≤150 px làm xuống 2 dòng); cột không phải hôm nay bóng nhẹ hơn. Không có cuộn lồng nhau.
- Đo ở 1440×900 (demo): lưới tuần y 416 → 214 (có dải "Dữ liệu mẫu" 28–36 px; bản thật ≈ 180); hero cao 137 → 56; header 83 → 48; ô ghi nhanh 52 (riêng hàng) → 40 trong header; thẻ hoạt động 64 → 49; số dòng tên 1–3 → 1.
- Test: E2EUIALL V1.* (ghi nhanh trong header ở Lịch/Hộp việc/Dự án, đỉnh lưới ≤ 240, hero ≤ 64 và 3 vòng + Tiếp theo + lời chào bấm được, thẻ 1 dòng gap ≥ 6, gõ "Mai 18h cầu lông 2 tiếng" Enter đúng, hộp "Trùng giờ", 375 vẫn thanh cố định dưới) đỏ 61/74 rồi 75/75 ở 1440; sửa 1 ca H1 (ô ghi nhanh nằm trong header thì kiểm "giữa tiêu đề và nút"). Sonnet, sau thay đổi cuối: 1440: 27 bộ xanh (E2E 95, E2EUX 124, E2EUAT2 72, E2EUAT3 63, E2EA11Y 41, E2ETABHB 32, E2ESUB 48, ...); 820: UIALL 27, TABHB 34, A11Y 44, UI 18, HB 34, SUB 48; 375: UIALL 32 và các bộ cùng loại xanh; merge-tests 35/35. Tôi tự đo y đỉnh lưới 214, hero 56, header 48 và xem ảnh 1440.
- Đánh đổi/chưa kiểm: tên hoạt động trong cột hẹp (ví dụ khi cột Hộp việc mở) cắt mạnh hơn, đọc đủ bằng tooltip hoặc mở hoạt động; 900–1199 px: ô ghi nhanh hẹp (~306 px ở 920) và nhãn vòng bị ellipsis; xem trước ghi nhanh đè lên nội dung bên dưới thay vì đẩy; padding thẻ 6 px áp dụng cả dưới 900 px (thẻ mobile thấp hơn ~2 px); thiết bị thật, chế độ tối/lite bằng mắt.
- Muốn lên production: nâng `APPV` 76, `VERSION` `lc-0.9.3`, CHANGELOG; PO nói rõ mới push.

## 2026-11-18 · ĐÃ PHÁT HÀNH v0.9.2 LÊN PRODUCTION (PO: "Phát hành v0.9.2 ngay")
- `git merge --ff-only refs/heads/feature/v0.9.2` vào `main`, `git tag v0.9.2`, `git push origin main` (`14e7326..fd0c79e`), `git push origin v0.9.2`; Vercel `success`; kiểm production: sw `lc-0.9.2`, `APPV 75`, `/api/ai_plan` 200, vendor/icon/CSP đạt, `index.html` và `sw.js` khớp byte với repo. Số liệu: CURRENT.md "Bản đang chạy".
- Nội dung: Hộp việc, Dự án (danh sách), Thói quen, Tôi giãn hết bề ngang cột (gỡ cap 980 px). Chi tiết: mục "SỬA LỆCH LẦN 2" bên dưới.
- HOÀN TÁC: commit revert `14899fb` trên nhánh mới từ `main` (KHÔNG force-push), nâng `APPV` 76/`VERSION` `lc-0.9.3`/CHANGELOG; dữ liệu không đổi.
- Việc kế tiếp (PO đã chọn Hướng B): dàn lại chiều dọc tab Lịch. Việc còn lại khác: PO thử đăng nhập/đồng bộ/Google Calendar/PWA/điện thoại thật; quyết giữ hay xóa mã chết `capSumHTML`; lỗi mức thấp số 6 của việc con; gói 9, 10; mục E4.
- Next step: xem nhánh chiều dọc (Lịch) khi xong; không dùng fable.

## 2026-11-18 · SỬA LỆCH LẦN 2 sau v0.9.1: các tab giãn hết bề ngang (Hướng C, PO chọn) trên `claude/hotfix-bo-cuc-2` (từ `main` = v0.9.1; chưa push, chưa deploy)
- PO báo "vẫn bị" sau v0.9.1 (ảnh production: tiêu đề và nội dung đã thẳng lề phải nhưng cả cột lệch trái, trống bên phải ~180 px). Hỏi PO với 3 hướng (A giữ canh trái 980 px, B căn giữa, C giãn hết bề ngang): PO chọn C.
- Sửa: gỡ MỌI giới hạn 980 px (`.pj-list`, `.hbt`, `body[data-tab="me"] #v`, style inline `.hv-card`, và luật cap `.app-container` thêm ở v0.9.1), nên Hộp việc, Dự án (danh sách), Thói quen, Tôi giãn hết cột như Lịch (đo ở 1440: cả 7 tab lề phải 1424). Chi tiết dự án (`.pj-shell` 1240 px) giữ nguyên. Ở 1920 px cột nội dung bị chặn khoảng 1190 px bởi bố cục `.app-shell` (max 1480 px).
- Test: `E2EUIALL` H1 đổi kỳ vọng (lề phải thẳng hàng và rộng bằng cột của Lịch, so với bề ngang cột Lịch để tránh xanh giả) đỏ 48/56 rồi 56/56 (1440), 27/27 (820), 31/31 (375). Hồi quy (Sonnet, 09:12–09:48, trên chính nhánh): 27 bộ 1440 xanh (E2E 95, E2EUX 124, E2EUAT2 72, E2EUAT3 63, E2EHL 85, E2ESUB 48, E2EA11Y 41, E2ETABHB 32, ...), 820 và 375: E2EUIALL, E2ETABHB, E2EA11Y, E2EUI, E2EHB, E2ESUB xanh, CSP thật E2E/E2EUIALL 0 vi phạm, E2ECSP 21/21, merge-tests 35/35, `test_sw` 23/23, `test_csp` 19/19. Tôi tự chạy E2EUIALL 56/56 và xem ảnh Hộp việc ở 1440.
- Lưu ý thẩm mỹ: tab Tôi, hàng form có nhãn trái và ô nhập dạt phải nên khoảng trống giữa khá rộng (ô giữ cỡ cũ); không phải lỗi.
- Chưa kiểm: thiết bị thật; khoảng 900–1200 px; ảnh chế độ tối.
- Muốn lên production: nâng `APPV` 75, `VERSION` `lc-0.9.2`, CHANGELOG; PO nói rõ mới push. Mã chết `capSumHTML` vẫn chờ PO quyết.

## 2026-11-18 · ĐÃ PHÁT HÀNH v0.9.1 LÊN PRODUCTION (PO: "Phát hành v0.9.1")
- `git merge --ff-only refs/heads/feature/v0.9.1` vào `main`, `git tag v0.9.1`, `git push origin main` (`c1849e7..14e7326`), `git push origin v0.9.1`; Vercel `success`; kiểm production: sw `lc-0.9.1`, `APPV 74`, `/api/ai_plan` 200, vendor/icon/CSP đạt, `index.html` và `sw.js` khớp byte với repo. Số liệu: CURRENT.md "Bản đang chạy".
- Nội dung: sửa lệch lề phải các tab canh trái (một luật CSS cap `.app-container` 980 px ≥ 900 px) và bỏ "Giờ theo loại vốn" khỏi Lịch. Chi tiết: mục "SỬA NHANH" bên dưới.
- HOÀN TÁC: commit revert `47908f6` trên nhánh mới từ `main` (KHÔNG force-push), nâng `APPV` 75/`VERSION` `lc-0.9.2`/CHANGELOG; dữ liệu không đổi.
- Việc còn lại: PO xem giao diện thật (Hộp việc, Dự án, Thói quen, Tôi) và thử đăng nhập/đồng bộ/Google Calendar/cài PWA/điện thoại thật; quyết giữ hay xóa mã chết `capSumHTML`; lỗi mức thấp số 6 của việc con (đẩy Google khi chỉ tích việc con); gói 9 `hieu-nang-sau`, 10 `don-nhe`; mục E4.
- Next step: PO dùng v0.9.1, báo lỗi/ý kiến giao diện; tôi sửa trên nhánh mới từ `main` (không dùng fable).

## 2026-11-18 · SỬA NHANH sau v0.9.0 trên `claude/hotfix-bo-cuc` (từ `main` = v0.9.0; chưa push, chưa deploy)
- PO báo các tab Hộp việc, Dự án, Thói quen "méo" và yêu cầu bỏ "Giờ theo loại vốn" khỏi tab Lịch. Nguyên nhân đo được ở 1440: nội dung bị cap 980 px canh trái nhưng `.app-header` kéo hết cột, lề phải lệch ~170 px (nội dung x=1254, tiêu đề/nút x=1424) ở hv, pj (danh sách), hb, me.
- Sửa: một luật CSS `@media (min-width: 900px)` cap `.app-container` 980 px cho hv, hb, me và pj khi không có `.pj-shell` (chi tiết dự án 1240 px không cap), nên tiêu đề, ô ghi nhanh, nội dung thẳng hàng (đo sau sửa: cả 4 tab đều 1254; Lịch/Sức khỏe/Tổng quan không đổi, 1424). Bỏ khối `.cap-sum` khỏi tab Lịch (tuần và ngày), xóa `weekStatsHTML`.
- LƯU Ý: `capSumHTML` + CSS `.cap-sum`/`.cap-s` giờ LÀ MÃ CHẾT (không còn nơi gọi trong `index.html`, chỉ test gọi qua helper `__capBox`); comment trên hàm đã sửa cho đúng. Cần PO quyết giữ hay xóa (xóa thì chuyển/loại các ca test cap-s).
- Test: E2EUIALL đỏ 10/46 trước sửa (H1 lệch 170 px ở 4 tab, H2 Lịch còn `.cap-sum`) rồi 46/46 (1440), 27/27 (820), 31/31 (375). Chuyển (không xóa) các ca cũ kiểm `.cap-sum` trên Lịch sang kiểm `capSumHTML(CW)` trong phần tử tạm: e2e-uat2 J3.1/J3.3, e2e-ux A9.1/A9.2/V2.16–V2.18, e2e61 1.4/4.4, e2e-uiall B12; e2e-tabhb H2.3 đổi thành "Lịch KHÔNG có cap-sum"; e2e-v063 M3.1 bỏ tham chiếu `.cap-sum`. Sau sửa (Sonnet báo, 1440): E2E 95, E2E61 41, E2EUAT2 72, E2EUAT3 63, E2EUX 124, E2ETABHB 32, E2EHB 34, E2EUI 18, E2EA11Y 41, E2ESUB 48, E2EDASH 36, E2E63 77, E2EHL 85, E2EHL2 53; 820/375: UIALL, TABHB, A11Y, UI xanh; merge-tests 35/35. Tôi tự đo lề phải 7 tab ở 1440 và xem ảnh Hộp việc.
- Chưa kiểm: khoảng 900–1200 px; thiết bị thật; ca H1 chỉ chạy ≥ 900 px.
- Muốn lên production: nâng `APPV` 74, `VERSION` `lc-0.9.1`, CHANGELOG; PO nói rõ mới push.

## 2026-11-18 · ĐÃ PHÁT HÀNH v0.9.0 LÊN PRODUCTION (PO: "xong thì gộp rồi deploy luôn")
- `git merge --ff-only refs/heads/feature/v0.9.0` vào `main`, `git tag v0.9.0`, `git push origin main` (`28adc46..c1849e7`), `git push origin v0.9.0`; Vercel `success`; production khớp repo (sw `lc-0.9.0`, `APPV 73`, `index.html` khớp byte, vendor/icon/CSP đạt). Số liệu: CURRENT.md "Bản đang chạy".
- Gồm: UI "Hôm nay trước" (khối Hôm nay, ô Tuần này ở thanh bên, Thói quen dạng hàng, tuần 7 cột, một nút chính) và tab Sức khỏe › Tóm tắt gọn. Không đổi dữ liệu/đồng bộ/SW/CSP. Chi tiết: `docs/review/2026-11-18-ui-toan-bo-ra-soat.md`, CURRENT.md mục Gói 12.
- HOÀN TÁC nếu PO không ưng giao diện: tạo commit revert các commit `b22beb3` và `f659602` trên nhánh mới từ `main` (KHÔNG force-push `main`), nâng `APPV` 74/`VERSION` `lc-0.9.1`/CHANGELOG để máy đã cài nhận bản; hoặc về v0.8.0 bằng nhánh từ tag `v0.8.0` kèm số phiên bản cao hơn. Dữ liệu không đổi nên không mất.
- Việc còn lại: PO xem giao diện thật trên production và điện thoại, thử đăng nhập/đồng bộ/Google Calendar/cài PWA (v0.8.0 vẫn chưa ai thử); lỗi mức thấp số 6 của việc con (đẩy Google khi chỉ tích việc con); gói 9 `hieu-nang-sau`, 10 `don-nhe`; mục E4; `crdrive.js`/`stdrive.js` cho khối mới.
- Next step: PO dùng v0.9.0 vài ngày, báo lỗi/ý kiến giao diện; tôi sửa trên nhánh mới từ `main` (không dùng fable).

## 2026-11-18 · Gói 12 ui-toan-bo xong ở local (hướng A "Hôm nay trước", PO chọn; chưa push, chưa deploy)
- Nhánh `claude/ui-toan-bo` (worktree `.claude/worktrees/ui-toan-bo`) từ `claude/ui-suc-khoe-2` (`f659602`, cũng chưa push). Số liệu: CURRENT.md mục Gói 12.
- Thay đổi nhìn thấy được: khối Hôm nay đầu tab Lịch (tuần hiện tại, Tuần/Ngày): lời chào theo giờ + tên gọi, 3 vòng (giờ hôm nay / mục tiêu tuần chia 7, thói quen x/y gồm cả tự đếm, tâm trạng) bấm được, ô Tiếp theo; ô Tuần này (vòng điểm cân bằng, thói quen x/y) ở đáy thanh bên desktop, bấm mở Tổng quan; tab Thói quen thành danh sách hàng + thanh tiến độ "x/y xong" ("Xong hết…" khi đủ), ô tích chưa tích là vòng rỗng, bỏ nút Thêm trùng ở đầu trang; lưới tuần 7 cột khi khung ≥ 760 px (tên hoạt động 2 dòng); "Tổng kết" thành nút phụ, "+ Thêm" là nút chính duy nhất; dải Dữ liệu mẫu một dòng; Hộp việc/Dự án/Tôi canh trái cùng tiêu đề, ô Ghi nhanh cùng bề rộng; điện thoại: hàng tuần một dòng, Giờ theo loại vốn một hàng cuộn ngang, chip Dự án 36 px, ◀ ▶ 36 px; tâm trạng desktop ≤ 168 px; cỡ 11.05 px ở bảng mục tiêu về 11 px.
- Công cụ: ảnh và test chạy bằng Chrome headless qua CDP (script ở scratchpad session, không trong repo); bộ E2E chạy được headless (lần mốc đầu báo lỗi "target navigated" một lần, chạy lại xanh).
- Next step: PO xem ảnh trước/sau rồi quyết: gộp vào nhánh phát hành và nâng phiên bản (`APPV`, `VERSION`, CHANGELOG) hay chỉnh thêm; thử trên iPhone thật. Không dùng fable.

## 2026-11-18 · UI tab Sức khỏe › Tóm tắt gọn hơn (Hướng A, PO chọn) trên `claude/ui-suc-khoe-2` (từ `main` = v0.8.0; chưa push, chưa deploy)
- Chỉ CSS/HTML, không đổi logic hay dữ liệu: 5 nút tâm trạng một hàng khi khung ≥ 600 px (dưới đó vẫn dọc, cao 40 px); thẻ "Điểm nổi bật" và "Điều ảnh hưởng tới bạn" trống thu thành một dòng mảnh (cả hai trống gộp một dòng), có nội dung giữ như cũ; "Đã ghim" 3 cột ≥ 900 px, 2 cột dưới đó (6 ô thành 3+3 hoặc 2×3, hết ô lẻ).
- Test: `E2EUI` đỏ 15/18 (U9.1–U9.3) rồi xanh 18/18 ở 1440 và 375; E2EHL 85, E2EHL2 53, E2EUAT3 63, E2EUX 124, E2E 95, E2EDASH 36, E2EA11Y 41 (Haiku báo, 1440). Tôi tự đo bằng trình duyệt sau thay đổi cuối: 1440 ô ghim 3+3, tâm trạng một hàng 40 px; 820 ô ghim 2×3, tâm trạng một hàng, không tràn ngang; 375 không tràn ngang, tâm trạng dọc, ô ghim 2 cột.
- Chưa kiểm: trường hợp 5 ô ghim (hồ sơ nam: 3+2), nhánh "cả hai thẻ trống" chưa có ca tự động (kiểm tay: một dòng 45 px), chế độ sáng/tối bằng ảnh, thiết bị thật. Không có agent review riêng (PO muốn ít bước; Haiku implement, tôi kiểm chứng).
- Muốn lên production: nâng `APPV`, `VERSION`, CHANGELOG; PO nói rõ mới push.

## 2026-11-17 · ĐÃ PHÁT HÀNH v0.8.0 LÊN PRODUCTION (theo lệnh "deploy chính thức" của PO)
- Làm theo `docs/huong-dan-day-code-github.md` bước 6–8: `git merge --ff-only` `refs/heads/feature/v0.8.0` vào `main`, `git tag v0.8.0`, `git push origin main` (`7dabf5f..28adc46`), `git push origin v0.8.0`. Vercel `success`; kiểm production: `sw.js` `lc-0.8.0`, `APPV = 72`, `/api/ai_plan` 200, vendor SHA-256 khớp, header CSP có, icon khớp. Số liệu: CURRENT.md mục "Bản đang chạy".
- HOÀN TÁC nếu đăng nhập/đồng bộ/Google hỏng: (1) sửa nhanh nguồn CSP nếu chỉ là `connect-src`/`frame-src` thiếu (thêm ĐÚNG nguồn bị báo "Refused to ...", ví dụ `https://oauth2.googleapis.com`), làm trên nhánh mới từ `main`, nâng `APPV`/`VERSION`/CHANGELOG, thử rồi PO cho phép đẩy; (2) hoặc đưa về v0.7.1: nhánh mới từ tag `v0.7.1`, KHÔNG force-push `main`; tạo commit revert (`git revert -m 1`/`git revert <khoảng>`) hoặc nhánh từ `v0.7.1` rồi gộp có chủ ý, kèm nâng `VERSION` lên số cao hơn (`lc-0.8.1`) để máy đã cài nhận bản và bỏ bản cache; dữ liệu người dùng không mất vì cấu trúc chỉ thêm trường (rule §11), Supabase giữ 30 bản lịch sử.
- Việc còn lại: PO thử đăng nhập/đồng bộ/Google Calendar (kể cả nút Ngắt)/cài PWA/điện thoại thật trên production và báo lỗi; lỗi mức thấp số 6 của subtask (tích việc con có thể đẩy sự kiện lên Google dù không cần); gói 9 `hieu-nang-sau`, 10 `don-nhe`; mục E4 (cỡ chữ px, toast chồng, chữ "…"); đo lặp SW. Bản tải sao lưu JSON trước lần ra bản: PO tự làm, tôi không kiểm được.
- Next step: PO dùng v0.8.0 vài ngày, báo lỗi; tôi sửa trên nhánh mới từ `main` (không dùng fable).

## 2026-11-17 · BẢN ỨNG VIÊN v0.8.0 ĐÃ ĐẨY LÊN STAGING (production KHÔNG đổi)
- ĐÃ ĐẨY (PO cho phép rõ, chọn "thử KHÔNG đăng nhập"): `git push -u origin feature/v0.8.0` và `git push origin feature/v0.8.0:staging` (fast-forward `e5b871c..8010c7f`). `origin/main` vẫn `7dabf5f` (production v0.7.1). Vercel build `success` (21:41). Địa chỉ staging `https://lifecapital-git-staging-minhkhanhng.vercel.app` nằm sau đăng nhập Vercel: tôi KHÔNG mở được, chỉ chủ dự án thử. PO thử theo mục 6 của `docs/staging-v0.8.0.md` (không đăng nhập Supabase). Hoàn tác staging: mục 5 cùng tài liệu.
- Commit HANDOFF này chỉ ở máy (nhánh remote ở `8010c7f`).
- Nhánh `feature/v0.8.0` (worktree `.claude/worktrees/rc-v080`) = `claude/tich-hop` (`ef74d97`) + `APPV = 72`, `sw.js` `lc-0.8.0`, CHANGELOG v0.8.0. Toàn bộ kế hoạch thử, rủi ro dữ liệu (staging dùng CHUNG Supabase với production), việc PO phải làm trước (sao lưu JSON, thêm địa chỉ staging vào Supabase Redirect URLs và Google OAuth origins), lệnh đẩy và hoàn tác: `docs/staging-v0.8.0.md`.
- Đẩy lên staging là fast-forward từ `origin/staging` (`e5b871c`). Chỉ chạy lệnh đẩy khi PO nói rõ.
- Next step: PO tự thử staging (mục 6) và báo lỗi/đạt; nếu muốn thử đồng bộ/Google Calendar thì chọn B (sao lưu JSON + thêm địa chỉ staging vào Supabase Redirect URLs và Google OAuth origins) hoặc C; sau đó "phát hành lên production" (hướng dẫn bước 6–8) hoặc sửa lỗi trên nhánh mới từ `feature/v0.8.0`. Không dùng fable.

## 2026-11-17 · Gói 8 xong và ĐÃ GỘP vào `claude/tich-hop` (cục bộ, chưa push)
- Nhánh `claude/truy-cap-va-cam-ung` (worktree `.claude/worktrees/truy-cap-va-cam-ung`) từ `claude/tich-hop` (`6071adf`). Số liệu: CURRENT.md mục Gói 8. Đã gộp bằng `git merge --no-ff refs/heads/claude/truy-cap-va-cam-ung` (không xung đột). Nhánh tích hợp nay gồm gói 1–8, chu-ky-mt, ui-suc-khoe, tab-thoi-quen, csp-staging. KIỂM CHỨNG SAU GỘP (Sonnet, 21:15–21:20 ngày 2026-11-17, nhánh tại `51200af`): TẤT CẢ XANH. 1440 (25 bộ): E2E 95, E2E61 41, E2ESCHED 28, E2EHB 34, E2EUAT2 71, E2EHL 85, E2EHL2 53, E2EUAT3 63, E2EUX 124, E2EAI 44, E2EPLAN 46, E2EDASH 36, E2EPJL 36, E2ELIM 12, E2EIMP 5, E2ESYNC 14, E2ESYNC2 24, E2EXSS 14, E2EMRG 21, E2ESW 10, E2ESIG 34, E2EUI 16, E2ETABHB 32, E2EA11Y 41, E2E63 77; 820: E2ETABHB 34, E2EA11Y 44; 375: E2EA11Y 44, E2EHB 34, E2ETABHB 34, E2EUI 16, E2EXSS 14, E2ESW 10; dưới CSP thật: E2ECSP 21/21 (5 vi phạm cố ý), E2E 95/95 với 0 vi phạm; E2EUX 124/124 với `serve.py --test-eval` và 0 vi phạm; merge-tests 35/35, `test_sw` 23/23, `test_csp` 19/19, `node --check` sạch. Lưu ý: nếu reload sau khi resize thì cửa sổ về 1024 và E2E báo 94/95 (A4 cột trái): luôn resize SAU reload (lesson.md).
- Session subtask `local_eda3370d-8c69-45ce-a382-58a73aa65e71` (nhánh `claude/subtask`, từ `claude/tich-hop`) đã có plan commit `ff43e39`, CHƯA viết code; chờ PO bảo tiếp tục. Nó có thể chạm cùng popup Sửa hoạt động và thẻ hoạt động mà gói 8 đã đổi (tabindex/aria-label/evOpenKey).
- Next step: PO chọn: gộp gói 8 vào tích hợp; tiếp tục subtask; thử staging (CSP); hoặc gói 9 `hieu-nang-sau` / 10 `don-nhe`. Không dùng fable.

## 2026-11-17 · Gói 9 subtask xong ở local (nhánh `claude/subtask`, chưa push, chưa deploy)
- Số liệu và quyết định PO: CURRENT.md mục Gói 9. Plan: `docs/superpowers/plans/2026-11-17-subtask.md`. Nhánh tách từ `claude/tich-hop`; gói 8 `truy-cap-va-cam-ung` cũng sửa popup/thẻ hoạt động nên gộp có thể xung đột nhỏ (chip `.ev-subs` ở dòng `.event-title`, khối `subsHTML()` sau Loại vốn).
- Next step: gộp vào `claude/tich-hop` khi PO đồng ý, chạy lại toàn bộ e2e + mobile trước khi phát hành. Không dùng fable.

## 2026-11-17 · NHÁNH TÍCH HỢP `claude/tich-hop` (cục bộ, CHƯA push, CHƯA deploy). Đọc mục này trước
**Cập nhật: đã gộp thêm `claude/subtask` (việc con cho hoạt động, commit gốc `62d4b72`). Xung đột `index.html` duy nhất: `evOpenKey` (gói 8) và khối việc con cùng vị trí trước `closeEditor`, đã giữ cả hai. KIỂM CHỨNG SAU GỘP SUBTASK (Sonnet, 21:22–21:28 ngày 2026-11-17, nhánh tại `36d5a96`): TẤT CẢ XANH, 0 ca đỏ. 1440: E2E 95, E2E61 41, E2ESCHED 28, E2EHB 34, E2EUAT2 71, E2EHL 85, E2EHL2 53, E2EUAT3 63, E2EAI 44, E2EPLAN 46, E2EDASH 36, E2EPJL 36, E2ELIM 12, E2EIMP 5, E2ESYNC 14, E2ESYNC2 24, E2EXSS 14, E2EMRG 21, E2ESW 10, E2ESIG 34, E2EUI 16, E2ETABHB 32, E2EA11Y 41, E2E63 77, E2ESUB 48; 820: E2ETABHB 34, E2EA11Y 44, E2ESUB 48; 375: E2ESUB 48, E2EA11Y 44, E2EHB 34, E2ETABHB 34, E2EUI 16, E2EXSS 14, E2ESW 10; dưới CSP thật: E2E 95/95, E2ESUB 48/48, E2EA11Y 41/41 (0 vi phạm), E2ECSP 21/21 (5 vi phạm cố ý), E2EUX 124/124 với `--test-eval`; merge-tests 35/35, `test_sw` 23/23, `test_csp` 19/19, `node --check` sạch. Không có tương tác xấu giữa gói 8 (Enter/Space mở hoạt động, focus sau xóa) và subtask (popup việc con, Enter trong ô việc con). Còn lại: lỗi mức thấp số 6 của subtask (tích việc con có thể đẩy sự kiện lên Google dù không cần); thử staging (CSP; PO phải cho phép push staging riêng); thiết bị thật; gói 9, 10.**
**Nội dung:** `claude/chu-ky-mt` (đã chứa gói 1, 1b, 2, 3, 4, 5, 6, 6b) + gộp `claude/ui-suc-khoe` (UI Sức khỏe) + `claude/tab-thoi-quen` (tab Thói quen riêng) + `claude/csp-staging` (tự host supabase-js + CSP). Worktree `.claude/worktrees/tich-hop`. `index.html` cả ba lần gộp đều tự động (không xung đột); chỉ tài liệu xung đột và đã giữ cả hai phía.
**Kiểm tra trên nhánh tích hợp:** Sonnet chạy toàn bộ e2e ở 1440 (trước khi gộp csp-staging): E2E 95, E2E61 41, E2ESCHED 28, E2EHB 34, E2EUAT2 71, E2EHL 83/85, E2EHL2 53, E2EUAT3 63, E2EUX 123/124, E2EAI 44, E2EPLAN 46, E2EDASH 36, E2EPJL 36, E2ELIM 12, E2EIMP 5, E2ESYNC 14, E2ESYNC2 24, E2EXSS 14, E2EMRG 21, E2ESW 10, E2ESIG 34, E2EUI 16, E2ETABHB 32 (34 ở 390 và 820), E2E63 77, merge-tests 35/35, `test_sw` 23/23, `node --check` sạch; ở 390: E2EHB, E2EXSS, E2ESW, E2EUI, E2ETABHB xanh. 3 ca đỏ đều do test cũ, không hồi quy: E2EHL 10.1/10.3 (kiểm 6 tab, nay 7 tab; phím 7 mở Tôi) và E2EUX B2.1 (banner check-in sau 19h che dòng dữ liệu mẫu): đã sửa, tôi chạy lại: E2EHL 85/85, E2EUX 124/124 (lúc 20h). Commit `3f2b067`. SAU KHI gộp csp-staging (Sonnet chạy lại, 20h ngày 2026-11-17, nhánh tại `0f34b3b`): TẤT CẢ XANH ở 1440: E2E 95, E2E61 41, E2ESCHED 28, E2EHB 34, E2EUAT2 71, E2EHL 85, E2EHL2 53, E2EUAT3 63, E2EUX 124, E2EAI 44, E2EPLAN 46, E2EDASH 36, E2EPJL 36, E2ELIM 12, E2EIMP 5, E2ESYNC 14, E2ESYNC2 24, E2EXSS 14, E2EMRG 21, E2ESW 10, E2ESIG 34, E2EUI 16, E2ETABHB 32, E2E63 77; ở 375×812 (preset mobile): E2EHB, E2EXSS, E2ESW, E2EUI, E2ETABHB xanh (E2ETABHB 34/34 cả 820 và 375); dưới máy chủ CSP: E2E 95/95 và E2ECSP 21/21 (5 vi phạm cố ý), E2EUX 124/124 chỉ khi chạy `serve.py --test-eval` (E2EUX tự dùng `eval` cho tiện ích đo nên bị CSP thật chặn, không phải lỗi app); merge-tests 35/35, `test_sw` 23/23, `test_csp` 19/19, `node --check` sạch; console không lỗi. Chưa chạy: PERFSYNC, audit2, crdrive, stdrive, uiaudit, contrast, strokes.
**Việc còn lại / chưa kiểm:** (1) THỬ Ở STAGING (cần PO cho phép push staging riêng): danh sách trong CURRENT.md mục "Gói 7 csp-staging", đặc biệt nút "Ngắt" Google Calendar (có thể cần thêm `https://oauth2.googleapis.com` vào `connect-src`, I-1); (2) mobile cho các bộ còn lại (mới chạy 5 bộ ở 375), ảnh 820 và chế độ sáng/tối cho UI Sức khỏe; (3) thiết bị thật iPhone/Android; (4) đo lặp SW (lần mở bình thường chậm hơn bản cũ ở một lần đo); (5) gói 8 `truy-cap-va-cam-ung`, 9 `hieu-nang-sau`, 10 `don-nhe` chưa làm; (6) nhớ tab đang mở khi mở lại app (tab Thói quen chưa có khóa).
**Phát hành (chỉ khi PO nói rõ):** theo `docs/huong-dan-day-code-github.md`; nâng đủ `APPV`, `VERSION` (`sw.js`), CHANGELOG; tải sao lưu JSON mới; thử staging trước vì có CSP. Rút lại CSP: SW lưu header của `./` nên tải lại 2 lần mới hết CSP cũ.
**Môi trường:** không còn máy chủ thử của dự án này đang chạy; cổng 8765 là dự án khác (Career OS); `preview_start` đọc nhầm cấu hình trong worktree, dùng `python3 -m http.server <cổng lạ> --bind 127.0.0.1` bằng Bash nền (lesson.md); test CSP dùng `python3 tests/csp/serve.py <cổng>`.
Session đã mở (đang rảnh): UI Sức khỏe `local_16d8f0e0-be21-4596-8641-39a05673390a`, chu-ky-mt `local_93db5ae0-a870-4c11-93c8-22b57839683b`, tab thói quen `local_9fa65663-e6e0-4048-bee3-96784afb7497`.
- Next step: PO chọn: thử staging (push staging riêng), hoặc làm tiếp gói 8; hoặc chốt phát hành. Không dùng fable.

## 2026-11-17 · Gói 6b xong (commit cục bộ, chưa push, chưa deploy)
- Nhánh `claude/chu-ky-mt` (worktree `.claude/worktrees/chu-ky-mt`) từ `claude/dong-bo-nhe`: sửa lỗi mt giả do chữ ký nhạy thứ tự khóa. Số liệu: CURRENT.md mục Gói 6b. Phải có trong mọi bản phát hành chứa gói 6.
- Các nhánh UI song song (`claude/ui-suc-khoe`, `claude/tab-thoi-quen`) tách từ `claude/sw-mo-nhanh`; thay đổi gói này gọn (khoảng 13 dòng ở vùng stamp/`sameJ`/`canonState`) nên dễ gộp.
- Next step: gói 7 `csp-staging` hoặc gói 8; hoặc gộp các nhánh và chạy lại 14 bộ e2e + mobile trước khi phát hành. Opus/Sonnet, reviewer khác model, không fable.

## 2026-11-17 · Gói 6 xong (đã commit cục bộ, chưa push, chưa deploy)
- Nhánh `claude/dong-bo-nhe` (worktree `.claude/worktrees/dong-bo-nhe`) chứa cả sáu nhánh gói. Số liệu và số đo trước/sau: CURRENT.md mục Gói 6.
- Phát hiện lỗi cũ có thể làm mất bản sửa task khi hai máy cùng mở (`stampEdits`/`taskSig` nhạy thứ tự khóa): cần gói riêng trước khi phát hành (đã đề xuất; xem CURRENT).
- Các nhánh song song chưa gộp: `claude/ui-suc-khoe` (UI tab Sức khỏe, xong), `claude/tab-thoi-quen` (đang làm). Cả hai tách từ `claude/sw-mo-nhanh` và sửa `index.html`; gộp sau bằng quyết định của PO.
- Next step: gói 7 `csp-staging` (B2 CSP, B5 tự host supabase-js; thử ở `staging`, PO phải cho phép push staging riêng) hoặc gói 8 `truy-cap-va-cam-ung`; PO chọn. Opus/Sonnet, reviewer khác model. Không dùng fable.

## 2026-11-17 · Gói UI ui-suc-khoe xong (commit cục bộ, chưa push)
- Nhánh `claude/ui-suc-khoe` (worktree `.claude/worktrees/ui-suc-khoe`) từ `claude/sw-mo-nhanh`. Số liệu: CURRENT.md mục Gói UI.
- Next step: gói 6 `dong-bo-nhe` như cũ (từ `claude/sw-mo-nhanh`); nhánh UI độc lập, gộp khi phát hành. Reviewer khác model.

## 2026-11-17 · Gói tab-thoi-quen xong (commit cục bộ, chưa push, chưa deploy)
- Nhánh `claude/tab-thoi-quen` (worktree `.claude/worktrees/tab-thoi-quen`, từ `claude/sw-mo-nhanh`). Thay đổi hành vi, số liệu, rủi ro gộp với `claude/ui-suc-khoe` và `claude/chu-ky-mt`: CURRENT.md mục Gói tab-thoi-quen. Plan: `docs/superpowers/plans/2026-11-17-tab-thoi-quen.md`.
- Còn lại: nhớ tab đang mở khi mở lại app (chưa có khóa); thiết bị thật; sáng/tối ở 390/820; nâng đủ `APPV`/`VERSION`/CHANGELOG khi phát hành; dọn CSS `.hb-strip`/`.hb-chip` không còn dùng.
- Next step: phiên khác gộp các nhánh gói; sau gộp chạy lại E2ETABHB, E2EHL, E2EHL2, E2EUAT3, E2EHB.

## 2026-11-17 · Gói 5 xong (đã commit cục bộ, chưa push, chưa deploy)
- Nhánh `claude/sw-mo-nhanh` (worktree `.claude/worktrees/sw-mo-nhanh`) chứa cả năm nhánh gói trước. Số liệu và số đo SW thật: CURRENT.md mục Gói 5.
- Việc nên làm trước khi phát hành: đo lặp SW (mở bình thường a2/a3 chậm hơn bản cũ ở một lần đo), thử trên thiết bị thật (iPhone/Android: nhãn, mở nhanh, icon), chạy lại 6 bộ e2e chưa chạy sau chỉnh cuối, nâng đủ `APPV`, `VERSION`, CHANGELOG.
- Next step: gói 6 `dong-bo-nhe` (C2 đồng bộ mỗi phút + `stampBase` + `cloudPendingCount`, C3 Cài đặt; cần số đo trước/sau), Opus effort high, worktree `.claude/worktrees/dong-bo-nhe` từ `claude/sw-mo-nhanh`; reviewer khác model. Không dùng fable.

## 2026-11-17 · Gói 4 xong (đã commit cục bộ, chưa push, chưa deploy)
- Nhánh `claude/gop-hai-may` (worktree `.claude/worktrees/gop-hai-may`) chứa cả bốn nhánh gói trước. Chi tiết số liệu: CURRENT.md mục Gói 4.
- Next step: gói 5 `sw-mo-nhanh` (C1 mở bản đã lưu ngay, đã đo chờ 4,07 s; A8-offline hiển thị; C4 giảm CORE tải trước + nén icon 512; dấu hiệu offline khi chưa đăng nhập), Opus effort high, worktree `.claude/worktrees/sw-mo-nhanh` từ `claude/gop-hai-may`; reviewer khác model. Đổi hành vi nhận bản mới; không đo được SW ở 127.0.0.1 (cần https/localhost, Chrome headless profile riêng theo lesson). Không dùng fable.

## 2026-11-17 · Gói 3 xong (chưa commit, chưa push, chưa deploy)
- Nhánh `claude/xss-va-token` (worktree `.claude/worktrees/xss-va-token`) chứa cả ba nhánh trước. Thay đổi còn ở dạng chưa commit: `index.html`, `tests/e2e/{e2e-xss.js (mới),e2e-sync.js,e2e-v063.js,README.md}`, plan `docs/superpowers/plans/2026-11-17-xss-va-token.md`. Chi tiết số liệu: CURRENT.md mục Gói 3.
- Cần PO: cho phép commit cục bộ trên nhánh này. Chưa push.
- Next step: gói 4 `gop-hai-may` (A5 `gi` Google trong `markPending`, A6 gộp `bl`/`cfg` từng khóa), Opus effort high, worktree `.claude/worktrees/gop-hai-may` từ `claude/xss-va-token`; Haiku hoặc Sonnet review (khác implementer). Không dùng fable.

## 2026-11-17 · Gói 1, 1b, 2 xong (chưa push, chưa deploy)
- Nhánh xếp chồng: `claude/review-2026-11-17` → `claude/mat-du-lieu` → `claude/importdata-khong-cat` → `claude/dong-bo-an-toan` (nhánh sau chứa nhánh trước). Mỗi gói có plan trong `docs/superpowers/plans/`. Worktree đã gỡ trừ khi tạo lại bằng `git worktree add .claude/worktrees/<tên> <nhánh>`.
- Next step: gói 3 `xss-va-token` (B1 XSS tên triệu chứng `index.html:~9473`, B6 token Google ở sessionStorage), nhánh mới từ `claude/dong-bo-an-toan`; Sonnet implement, Haiku review. Sau đó gói 4 (A5, A6), 5 (C1, A8-offline hiển thị, C4), 6, 7, 8, 9, 10 theo ROADMAP.md. B3 bỏ (PO không dùng AI). Không dùng fable.
- Phát hành chỉ khi PO nói rõ: PO đã tải sao lưu 2026-11-17 nhưng phải tải lại trước lần ra bản mới.

## 2026-11-17 · Gói 1 xong, chuyển sang gói 1b
- Xong gói 1 (A1) trên nhánh `claude/mat-du-lieu` (commit `3cd4c61`, tài liệu cập nhật ở commit kế tiếp). Chưa push, chưa deploy; production vẫn v0.7.1.
- PO báo: đã tắt sign-up Supabase (B4), đã tải sao lưu, đã thử điện thoại thật; không dùng AI nên bỏ B3; không dùng fable nữa; dùng model rẻ nhất mà hiệu quả.
- Next step: gói 1b `importData-khong-cat` (test đỏ trước), rồi gói 2 `dong-bo-an-toan` (A2, A3, A4, A7, A8). Sonnet implement, reviewer khác model (Haiku), worktree riêng mỗi gói.
- Báo cáo SW của fable đã lưu: `docs/review/2026-11-17-fable-sw-offline.md`.

## 2026-11-17 · Hết Giai đoạn B và C (chưa sửa code, chưa commit)
- Xong: 5 lượt fable (kien-truc, du-lieu, bao-mat, hieu-nang, giao-dien) ở `docs/review/`, brief `briefs-review.md`, tổng hợp `2026-11-17-tong-hop.md`. Lượt 4 từng dính giới hạn API, đã tiếp tục đúng agent bằng SendMessage.
- PO duyệt TOÀN BỘ nhóm A, B, C, D, E. 2 Critical cùng gốc (A1: mất dữ liệu do `.slice` cắt cứng, lượt 1 và 2), 20 Important.
- Việc PO phải tự làm: B4 tắt "Allow new users to sign up" trong Supabase Auth; đặt `AI_ALLOWED_EMAILS` trên Vercel trước khi ra gói 3; tải JSON sao lưu; thử thiết bị thật.
- Cần PO cho phép: commit cục bộ (không push) tài liệu của nhánh review, và commit trên từng nhánh gói; thứ tự gói trong ROADMAP.
- Next step: Giai đoạn D gói 1 `mat-du-lieu` (A1): worktree `.claude/worktrees/mat-du-lieu`, nhánh `claude/mat-du-lieu`; `superpowers:writing-plans` → test đỏ (520 việc, 1100 ngày tick, v.v.) → sửa → chạy đủ kiểm tra. Opus, effort high.
- `.impeccable/review/` (45 ảnh) chưa trong `.gitignore`: không commit.

## 2026-11-17 · Cuối Giai đoạn A (chưa sửa code, chưa commit)
- Việc đang làm: review toàn bộ Life Capital và chuẩn hóa quy trình theo `Nha-Minh-Dev-macOS/docs/HUONG-DAN-LAM-DU-AN.md`. Worktree `.claude/worktrees/review-2026-11-17`, nhánh `claude/review-2026-11-17` (từ `main` = production v0.7.1).
- Đã xong: Giai đoạn A (đọc hiện trạng, chạy mọi kiểm tra có sẵn, hỏi PO, tạo CLAUDE.md, rule.md, lesson.md, CURRENT.md, HANDOFF.md, ROADMAP.md, PRODUCT.md, scripts/status.sh). Tệp mới chưa commit.
- Chờ: PO duyệt tóm tắt Giai đoạn A.
- Next step: Giai đoạn B, lượt 1 (review kiến trúc và code) bằng subagent model fable, chỉ đọc/chạy. Brief lưu `docs/review/briefs-review.md`, báo cáo `docs/review/<ngày>-fable-<tên>.md` (≤ 40 dòng).
- Gợi ý lượt review (dự án một tệp index.html ~10k dòng, có Supabase, không có npm): 1 kiến trúc/code; 2 đúng đắn dữ liệu (gộp, đồng bộ rev, múi giờ/ISO tuần, idempotency GCal, IDOR/RLS); 3 bảo mật (RLS, `lc_push`, CSP/header, `api/ai_plan.py`, XSS/innerHTML, import JSON, CORS); 4 hiệu năng (đau nhất của PO: đo thời gian vẽ, kích thước index.html, localStorage đọc/ghi, bắt buộc có số đo); 5 giao diện (có UI: 390×844 và 1440×900, sáng/tối, offline, chữ 200%). Lượt 3 chỉ đọc code + `api/`, không có máy chủ nào khác để quét; nói rõ với PO nếu bỏ lượt nào.
- Lưu ý: cổng 8765 thuộc dự án khác (Career OS); dùng 8790. Máy chủ xem thử đang chạy nền ở 8790 từ worktree này (có thể đã tắt).
- Lưu ý: không chạy lệnh nào trên bản production ngoài GET chỉ đọc.
