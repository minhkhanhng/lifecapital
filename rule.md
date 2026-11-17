# Quy tắc bắt buộc (đọc đầu mỗi session)
Áp dụng cho mọi agent. Mâu thuẫn với file khác thì file này thắng; chỉ PO (chủ dự án) được đổi.

## Bản đang chạy là thiêng liêng
0. Life Capital đang chạy thật (https://lifecapital.vercel.app, nhánh `main`) và có người dùng thật. Không deploy, không push, không chạm dữ liệu thật, không migration trên dữ liệu thật. Không chạy lệnh nào trong trình duyệt trên bản thật.
1. Commit chỉ khi PO yêu cầu. Push, deploy, tag, xóa chỉ khi PO nói rõ, và mỗi lần đồng ý chỉ áp dụng cho đúng lần đó.
2. Fable (agent review) chỉ đọc/chạy, KHÔNG sửa code. Người điều phối sửa; mỗi lỗi Critical/Important có test đỏ trước.

## Khởi động
3. Đọc theo thứ tự: rule.md → lesson.md → CURRENT.md → HANDOFF.md. CLAUDE.md, PRODUCT.md, ROADMAP.md khi cần.
4. Không đọc lại lịch sử chat; trạng thái nằm trong CURRENT/HANDOFF.
5. Trước khi báo tiến độ, chạy `bash scripts/status.sh`.

## Giao tiếp
6. Trả lời tiếng Việt, ngắn; Claude xưng "tôi", gọi PO là "bạn". Mỗi câu kết thúc bằng **Next step**: việc, model + effort, worktree.
7. Chọn model theo độ khó: Haiku việc cơ học; Sonnet phần lớn code và tài liệu; Opus kiến trúc, debug khó; Fable là reviewer độc lập.
8. Context vượt 70% cửa sổ: hỏi PO (AskUserQuestion): "Chuyển session mới" / "Tiếp tục ở đây".
9. Không rõ thì hỏi PO, đừng đoán.

## Giao diện
10. Màn/luồng mới hoặc đổi nhìn thấy được: trình 3 mockup khác hướng, PO chọn trước khi code. Giữ thang chữ 8 bậc và vùng bấm tối thiểu của v0.7.1.

## Dữ liệu
11. **Không được làm mất dữ liệu người dùng.** Mọi thay đổi cấu trúc dữ liệu phải đọc được dữ liệu cũ (không đổi tên/bỏ trường đang dùng; trường lạ giữ nguyên, vì máy chạy bản cũ vẫn đồng bộ).
12. Dữ liệu thật (localStorage người dùng, Supabase) không bao giờ dùng để test; test dùng `loadDemo()` hoặc dữ liệu giả.
13. Không commit bí mật. Khóa Supabase `sb_publishable_...` là khóa công khai (đã nằm trong app); `ANTHROPIC_API_KEY` chỉ đặt trên Vercel.

## Quy trình
14. TDD: lỗi nghiệp vụ phải có test đỏ trước, sửa sau. Chỉ báo số của lần chạy SAU thay đổi code cuối.
15. Chạy trình duyệt thử: kiểm `document.title === "Life Capital"` và cổng đúng trước mọi lệnh (xem lesson.md 2026-11-17). Cổng 8765 đang bị dự án khác dùng; dùng cổng khác (vd 8790), không kill tiến trình của dự án khác.
16. Báo riêng web (1440×900) và mobile (390×844). Trình duyệt giả lập không phải thiết bị thật.
17. Mỗi gói = một plan = một nhánh `claude/<gói>` trong worktree riêng; không gộp nhiều ý, không "tiện tay" refactor ngoài phạm vi đã duyệt.
18. Phát hành (khi PO cho phép) làm đúng `docs/huong-dan-day-code-github.md`; nâng đủ 3 chỗ: `APPV` trong index.html, `VERSION` trong sw.js, CHANGELOG.md.
19. Cập nhật CURRENT/HANDOFF/ROADMAP khi trạng thái đổi; ghi lesson.md ngay khi gặp lỗi đáng nhớ.
