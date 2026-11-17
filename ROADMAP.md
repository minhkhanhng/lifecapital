# ROADMAP · Gói công việc

Mỗi gói = một plan (`docs/superpowers/plans/<ngày>-<gói>.md`) = một nhánh `claude/<gói>` trong worktree riêng `.claude/worktrees/<gói>`, tách từ `main`. Mã mục (A1, B1…) xem `docs/review/2026-11-17-tong-hop.md`. PO đã duyệt toàn bộ mục nhóm A, B, C, D, E ngày 2026-11-17. Mỗi gói: test đỏ trước (lỗi), chạy đủ kiểm tra, đo trước/sau (hiệu năng), không push/deploy.

Thứ tự đề xuất (an toàn dữ liệu → bảo mật → hiệu năng → giao diện → dọn dẹp). Chờ PO chốt thứ tự.

| # | Gói (nhánh `claude/…`) | Mục | Model gợi ý | Trạng thái |
|---|---|---|---|---|
| 0 | quy-trinh (review-2026-11-17) | Tài liệu quy trình + 5 báo cáo review + tổng hợp | Sonnet | Xong, chưa commit |
| 1 | mat-du-lieu | A1 bỏ ngưỡng cắt cứng (Critical) | Sonnet | Xong (commit `3cd4c61`, E2ELIM 12/12, tổng 844/844), chưa push |
| 1b | importData-khong-cat | `importData` chế độ Gộp còn cắt `secs/ms/ups` 20/50/30 (`index.html:~5743`), cùng cơ chế A1 | Sonnet | Xong (E2EIMP 5/5, nhánh `claude/importdata-khong-cat`), chưa push |
| 2 | dong-bo-an-toan | A2 base đồng bộ, A3 nhập Gộp theo id, A4 token Google khi xóa máy, A7 lỗi save(), A8 SW trả trang lỗi | Sonnet | Xong (nhánh `claude/dong-bo-an-toan`, E2ESYNC 14/14, 832/832 cũ), chưa push |
| 3 | xss-va-token | B1 XSS tên triệu chứng, B6 token Google ở sessionStorage. B3 (hàm AI) BỎ: PO không dùng AI | Sonnet | Xong (nhánh `claude/xss-va-token`, E2EXSS 14/14), chưa commit, chưa push |
| 4 | gop-hai-may | A5 `gi` Google trong `markPending`, A6 gộp `bl`/`cfg` từng khóa | Opus | Xong (nhánh `claude/gop-hai-may`, E2EMRG 21/21), chưa push |
| 5 | sw-mo-nhanh | C1 mở bản đã lưu ngay (đã đo: chờ 4,07 s), A8 trả bản cache khi 404/500, C4 giảm CORE tải trước + nén icon 512, MỚI: hiện dấu hiệu offline khi chưa đăng nhập | Opus | Xong (nhánh `claude/sw-mo-nhanh`, test_sw 23/23, E2ESW 10/10; đã đo SW thật), chưa push |
| 5b | ui-suc-khoe | UI popup Thêm thuốc/TPCN (6 Important), nút tâm trạng dọc, nhãn ô ngày Nhật ký, nút ✕ 36px (PO chọn popup Hướng B, tâm trạng xếp dọc) | Sonnet | Xong (nhánh `claude/ui-suc-khoe`, từ `claude/sw-mo-nhanh`, E2EUI 16/16), chưa push |
| 5c | tab-thoi-quen | Tách thói quen khỏi Lịch thành tab riêng (bố cục C, điều hướng N2) | Sonnet | Xong (nhánh `claude/tab-thoi-quen`, E2ETABHB 32/32, bộ cũ xanh), chưa push |
| 6 | dong-bo-nhe | C2 đồng bộ mỗi phút + `stampBase` + `cloudPendingCount`, C3 Cài đặt | Opus | Xong (nhánh `claude/dong-bo-nhe`, E2ESYNC2 24/24, có số đo trước/sau; C2d bỏ), chưa push |
| 6b | chu-ky-mt | Lỗi cũ: chữ ký `mt` (`taskSig`) và `sameJ` nhạy thứ tự khóa làm bản cũ thắng khi gộp hai máy (task, dự án, thói quen) | Sonnet (reviewer Opus) | Xong (nhánh `claude/chu-ky-mt`, E2ESIG 29/29, save() không đổi: ~71 ms), chưa push; làm TRƯỚC khi phát hành |
| 7 | csp-staging | B2 CSP, B5 tự host supabase-js | Sonnet+Opus review | Xong ở local (nhánh `claude/csp-staging`: test_csp 19/19, E2ECSP 21/21, 0 vi phạm CSP ở E2E 95/95); CHƯA thử staging (đăng nhập Google/Supabase, wss, Calendar, cài PWA); chưa push |
| 8 | truy-cap-va-cam-ung | E1 bàn phím mở hoạt động, E2 vùng bấm 36 px, E3 nhãn truy cập/focus/báo lỗi JSON/tour | Sonnet | Chưa (E2 nhìn thấy được; kiểm 390/820/1440) |
| 9 | hieu-nang-sau | C5 ghi `lc2_mine` trễ, C6 tách tab/minify/kính mờ tự nhẹ | Opus | Chưa (rủi ro cao hơn; làm sau cùng và chỉ khi số đo gói 5–6 chưa đủ) |
| 10 | don-nhe | D1–D6 (pick3, defCaps, bỏ `window.claude.use`, SB_URL trùng, `tick()` 2 lần, `console.warn` catch rỗng, README 30/30, `.gitignore`) + A9 nợ nhỏ nếu PO duyệt | Haiku/Sonnet | Chưa |
| 11 | subtask | Việc con (`subs`) cho hoạt động trên lịch: popup thu gọn, chip n/m, gộp hai máy theo id | Sonnet (gộp dữ liệu: reviewer Opus) | Xong ở local (nhánh `claude/subtask`: E2ESUB 42/42 ở 1440 và 390, các bộ cũ xanh); chưa push/gộp |

## Nợ nhỏ chưa duyệt
A9 (`tt()` 23:59, `clearDemo`, nhập Ghi đè mồ côi sự kiện Google, `lc_state_hist`, giờ máy sai, báo số bị bỏ khi nhập), E4 (cỡ chữ px, toast chồng, chữ "…", 820 px chuột), tách `index.html` (chưa có lợi đo được), `tests/e2e` chưa có lệnh một dòng/CI.
