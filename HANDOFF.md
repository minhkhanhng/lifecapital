# HANDOFF · Bàn giao cho session sau (mục mới nhất ở trên)

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
