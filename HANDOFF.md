# HANDOFF · Bàn giao cho session sau (mục mới nhất ở trên)

## 2026-11-17 · Gói 6b xong (commit cục bộ, chưa push, chưa deploy)
- Nhánh `claude/chu-ky-mt` (worktree `.claude/worktrees/chu-ky-mt`) từ `claude/dong-bo-nhe`: sửa lỗi mt giả do chữ ký nhạy thứ tự khóa. Số liệu: CURRENT.md mục Gói 6b. Phải có trong mọi bản phát hành chứa gói 6.
- Các nhánh UI song song (`claude/ui-suc-khoe`, `claude/tab-thoi-quen`) tách từ `claude/sw-mo-nhanh`; thay đổi gói này gọn (khoảng 13 dòng ở vùng stamp/`sameJ`/`canonState`) nên dễ gộp.
- Next step: gói 7 `csp-staging` hoặc gói 8; hoặc gộp các nhánh và chạy lại 14 bộ e2e + mobile trước khi phát hành. Opus/Sonnet, reviewer khác model, không fable.

## 2026-11-17 · Gói 6 xong (đã commit cục bộ, chưa push, chưa deploy)
- Nhánh `claude/dong-bo-nhe` (worktree `.claude/worktrees/dong-bo-nhe`) chứa cả sáu nhánh gói. Số liệu và số đo trước/sau: CURRENT.md mục Gói 6.
- Phát hiện lỗi cũ có thể làm mất bản sửa task khi hai máy cùng mở (`stampEdits`/`taskSig` nhạy thứ tự khóa): cần gói riêng trước khi phát hành (đã đề xuất; xem CURRENT).
- Các nhánh song song chưa gộp: `claude/ui-suc-khoe` (UI tab Sức khỏe, xong), `claude/tab-thoi-quen` (đang làm). Cả hai tách từ `claude/sw-mo-nhanh` và sửa `index.html`; gộp sau bằng quyết định của PO.
- Next step: gói 7 `csp-staging` (B2 CSP, B5 tự host supabase-js; thử ở `staging`, PO phải cho phép push staging riêng) hoặc gói 8 `truy-cap-va-cam-ung`; PO chọn. Opus/Sonnet, reviewer khác model. Không dùng fable.

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
