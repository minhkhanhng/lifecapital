# ROADMAP · Gói công việc

Mỗi gói = một plan (`docs/superpowers/plans/<ngày>-<gói>.md`) = một nhánh `claude/<gói>` trong worktree riêng `.claude/worktrees/<gói>`, tách từ `main`. Mã mục (A1, B1…) xem `docs/review/2026-11-17-tong-hop.md`. PO đã duyệt toàn bộ mục nhóm A, B, C, D, E ngày 2026-11-17. Mỗi gói: test đỏ trước (lỗi), chạy đủ kiểm tra, đo trước/sau (hiệu năng), không push/deploy.

Thứ tự đề xuất (an toàn dữ liệu → bảo mật → hiệu năng → giao diện → dọn dẹp). Chờ PO chốt thứ tự.

| # | Gói (nhánh `claude/…`) | Mục | Model gợi ý | Trạng thái |
|---|---|---|---|---|
| 0 | quy-trinh (review-2026-11-17) | Tài liệu quy trình + 5 báo cáo review + tổng hợp | Sonnet | Xong, chưa commit |
| 1 | mat-du-lieu | A1 bỏ ngưỡng cắt cứng (Critical) | Sonnet | Xong (commit `3cd4c61`, E2ELIM 12/12, tổng 844/844), chưa push |
| 1b | importData-khong-cat | `importData` chế độ Gộp còn cắt `secs/ms/ups` 20/50/30 (`index.html:~5743`), cùng cơ chế A1 | Sonnet | Xong (E2EIMP 5/5, nhánh `claude/importdata-khong-cat`), chưa push |
| 2 | dong-bo-an-toan | A2 base đồng bộ, A3 nhập Gộp theo id, A4 token Google khi xóa máy, A7 lỗi save(), A8 SW trả trang lỗi | Sonnet | Xong (nhánh `claude/dong-bo-an-toan`, E2ESYNC 14/14, 832/832 cũ), chưa push |
| 3 | xss-va-token | B1 XSS tên triệu chứng, B6 token Google ở sessionStorage. B3 (hàm AI) BỎ: PO không dùng AI | Sonnet | Chưa (B4 PO đã tắt sign-up Supabase) |
| 4 | gop-hai-may | A5 `gi` Google trong `markPending`, A6 gộp `bl`/`cfg` từng khóa | Opus | Chưa (chạm logic gộp, rủi ro trung bình) |
| 5 | sw-mo-nhanh | C1 mở bản đã lưu ngay (đã đo: chờ 4,07 s), A8 trả bản cache khi 404/500, C4 giảm CORE tải trước + nén icon 512, MỚI: hiện dấu hiệu offline khi chưa đăng nhập | Opus | Chưa (đổi hành vi nhận bản mới; không đo được SW ở 127.0.0.1, cần https/localhost) |
| 6 | dong-bo-nhe | C2 đồng bộ mỗi phút + `stampBase` + `cloudPendingCount`, C3 Cài đặt | Opus | Chưa (cần số đo trước/sau) |
| 7 | csp-staging | B2 CSP, B5 tự host supabase-js | Opus | Chưa (thử ở `staging`; PO cho phép push staging riêng) |
| 8 | truy-cap-va-cam-ung | E1 bàn phím mở hoạt động, E2 vùng bấm 36 px, E3 nhãn truy cập/focus/báo lỗi JSON/tour | Sonnet | Chưa (E2 nhìn thấy được; kiểm 390/820/1440) |
| 9 | hieu-nang-sau | C5 ghi `lc2_mine` trễ, C6 tách tab/minify/kính mờ tự nhẹ | Opus | Chưa (rủi ro cao hơn; làm sau cùng và chỉ khi số đo gói 5–6 chưa đủ) |
| 10 | don-nhe | D1–D6 (pick3, defCaps, bỏ `window.claude.use`, SB_URL trùng, `tick()` 2 lần, `console.warn` catch rỗng, README 30/30, `.gitignore`) + A9 nợ nhỏ nếu PO duyệt | Haiku/Sonnet | Chưa |

## Nợ nhỏ chưa duyệt
A9 (`tt()` 23:59, `clearDemo`, nhập Ghi đè mồ côi sự kiện Google, `lc_state_hist`, giờ máy sai, báo số bị bỏ khi nhập), E4 (cỡ chữ px, toast chồng, chữ "…", 820 px chuột), tách `index.html` (chưa có lợi đo được), `tests/e2e` chưa có lệnh một dòng/CI.
