# Quy tắc bắt buộc v2 (ĐANG ÁP DỤNG, đọc đầu mỗi session)
Áp dụng từ 2026-11-19 theo quyết định của PO (chủ dự án). File này THAY `rule.md`: `rule.md` được giữ nguyên chỉ để đọc tham khảo, KHÔNG áp dụng (kể cả dòng "file này thắng" trong đó). Mâu thuẫn với file khác thì file này thắng; chỉ PO được đổi.
Mục tiêu: giữ nguyên mọi bảo vệ dữ liệu và bản đang chạy (mục A), cắt các bước tốn token ít giá trị (mục B đến G).

## A. Bất biến (giữ từ rule.md, không nới)
A1. Life Capital đang chạy thật (https://lifecapital.vercel.app, nhánh `main`). Không chạy lệnh nào trong trình duyệt trên bản thật (chỉ GET chỉ đọc bằng `curl`). Không chạm dữ liệu thật, không migration trên dữ liệu thật.
A2. Commit cục bộ được phép trên nhánh làm việc (`claude/*`, `feature/*`) và commit tài liệu bàn giao ở `main` cục bộ (PO đã cho phép từ 2026-11-17). Push, deploy, tag, xóa nhánh/tệp: chỉ khi PO nói rõ, mỗi lần đồng ý chỉ áp dụng cho đúng lần đó. Lệnh rõ như "Phát hành vX" hoặc "deploy" là đủ, không hỏi lại.
A3. Agent review chỉ đọc/chạy, KHÔNG sửa code; người điều phối hoặc implementer sửa.
A4. Không được làm mất dữ liệu người dùng. Thay đổi cấu trúc dữ liệu phải đọc được dữ liệu cũ (không đổi tên/bỏ trường đang dùng; trường lạ giữ nguyên vì máy chạy bản cũ vẫn đồng bộ). Dữ liệu thật không bao giờ dùng để test (dùng `loadDemo()` hoặc dữ liệu giả). Không commit bí mật (khóa `sb_publishable_...` là khóa công khai; `ANTHROPIC_API_KEY` chỉ đặt trên Vercel).
A5. KHÔNG dùng fable (PO, từ 2026-11-17). Không rõ thì hỏi PO bằng MỘT câu (AskUserQuestion), đừng đoán; gom các câu hỏi vào một lần.
A6. Trả lời tiếng Việt, ngắn; Claude xưng "tôi", gọi PO là "bạn". Mỗi câu trả lời kết thúc bằng **Next step**: việc, model + effort, worktree. Context vượt 70%: hỏi PO "Chuyển session mới" / "Tiếp tục ở đây".
A7. Cổng 8765 thuộc dự án khác: dùng cổng lạ (`python3 -m http.server <cổng> --bind 127.0.0.1` bằng Bash nền, không giấu đầu ra); không kill tiến trình không phải của mình; `preview_start` đọc nhầm cấu hình trong worktree nên không dùng.

## B. Khởi động (đọc có giới hạn)
B1. Đọc theo thứ tự: CLAUDE.md → rule-v2.md → 5 mục đầu lesson.md → mục "Bản đang chạy" của CURRENT.md → mục ĐẦU của HANDOFF.md. KHÔNG đọc toàn bộ CURRENT/HANDOFF/ROADMAP/PRODUCT/rule.md trừ khi việc cần (phát hành, gộp nhánh, điều tra lịch sử).
B2. Brief cho agent phụ: ghi sẵn tệp và đoạn cần đọc (kèm mục liên quan của rule-v2.md); không bảo agent đọc cả bộ tài liệu.
B3. Không đọc lại lịch sử chat. Chạy `bash scripts/status.sh` chỉ khi cần báo tiến độ tổng thể.

## C. Giao diện (mockup theo ngưỡng)
C1. BẮT BUỘC 3 mockup khác hướng, PO chọn trước khi code, khi: màn/tab/luồng MỚI; đổi bố cục tổng thể; đổi ngôn ngữ thị giác (màu, thang chữ, vùng bấm); thêm hoặc bớt khối lớn.
C2. KHÔNG cần 3 mockup (chỉ báo số đo hoặc ảnh trước/sau): sửa lỗi bố cục so với thiết kế đã duyệt; chỉnh khoảng cách/đệm/cỡ trong biên đã có ở mockup đã duyệt; đổi chữ; bỏ phần tử PO nêu đích danh; sửa theo ảnh lỗi PO gửi; PO nói "sửa nhanh" hoặc "làm ngay".
C3. Có từ hai cách hợp lý mà PO chưa chọn (ví dụ căn trái, giữa hay giãn): hỏi PO MỘT câu kèm một hình so sánh, không dựng lại 3 mockup đầy đủ.
C4. Giữ thang chữ 8 bậc (11/12/13/14/16/18/22/28) và vùng bấm tối thiểu 24 px (chuột), 36 px (cảm ứng).

## D. Kiểm thử (đúng chỗ, đúng lúc)
D1. TDD (test đỏ trước, sửa sau) cho lỗi nghiệp vụ, thay đổi dữ liệu/đồng bộ/service worker/bảo mật, và hành vi mới đo được. Thay đổi chỉ CSS/chữ không đo được thì không bắt buộc test đỏ, nhưng phải có số đo hoặc ảnh trước/sau.
D2. Khi đang sửa: chỉ chạy bộ test liên quan trực tiếp và bộ test mới, không chạy cả 29 bộ sau mỗi sửa nhỏ.
D3. Chạy ĐẦY ĐỦ đúng MỘT lần trước khi gộp/phát hành, trên đúng commit sẽ phát hành (sau khi nâng phiên bản): mọi bộ e2e ở 1440; các bộ UI chính (E2EUIALL, E2ETABHB, E2EA11Y, E2EUI, E2EHB, E2ESUB, E2ESTAR hoặc bộ liên quan) ở 820 và 375 nếu thay đổi chạm giao diện; E2E và các bộ chính dưới CSP thật (`tests/csp/serve.py`; E2EUX cần `--test-eval`); `tests/merge-tests.html`; `test_sw`; `test_csp`; `node --check`. Cần chạy trên 5 bộ: giao MỘT agent kiểm chứng (Sonnet hoặc Haiku); người điều phối chỉ tự chạy 1 đến 2 bộ để đối chiếu.
D4. Số liệu báo là số của lần chạy sau thay đổi code cuối; ca đỏ chạy lại riêng một lần trước khi kết luận. Sau khi sửa theo review mà không đổi logic (chỉ CSS/chữ/test): chạy lại bộ liên quan, không chạy lại toàn bộ.
D5. Thao tác trình duyệt (giữ vì từng gây lỗi, xem lesson.md): sau MỖI lần navigate hoặc reload kiểm `document.title === "Life Capital"` và cổng đúng một lần (không cần trước từng lệnh); mỗi bộ test chạy trên trang mới tải; đặt khung SAU reload; agent dùng tab trình duyệt riêng.
D6. Báo web 1440×900 luôn; mobile 375/390 và 820 chỉ khi thay đổi chạm giao diện hoặc bố cục. Trình duyệt giả lập không phải thiết bị thật: luôn ghi "chưa kiểm thiết bị thật" nếu chưa kiểm.

## E. Review và model
E1. Reviewer KHÁC model với implementer là BẮT BUỘC cho thay đổi logic dữ liệu, gộp/đồng bộ, bảo mật, service worker, CSP và bản phát hành lớn; mỗi lỗi Critical/Important có test đỏ trước khi sửa.
E2. Sửa giao diện thuần CSS/chữ và sửa nhanh: không cần agent review riêng; implementer rẻ cộng người điều phối kiểm chứng bằng số đo, ảnh và test là đủ.
E3. Model: Haiku cho CSS/chữ/việc cơ học; Sonnet cho phần lớn code và tài liệu; Opus chỉ khi logic dữ liệu/kiến trúc/debug khó hoặc PO yêu cầu.

## F. Nhánh, plan, tài liệu
F1. Gói lớn (đổi dữ liệu, đồng bộ, logic, service worker, bảo mật): một plan `docs/superpowers/plans/…`, một nhánh `claude/<tên>`, một worktree riêng như cũ. Sửa nhỏ/UI nhanh: không cần plan riêng; vẫn nhánh `claude/<tên>` từ `main` trong worktree riêng. Không refactor ngoài phạm vi.
F2. Nhánh gói/sửa nhanh KHÔNG sửa CURRENT/HANDOFF/ROADMAP (tránh xung đột khi gộp). Ghi kết quả vào tài liệu riêng của gói (plan, hoặc `docs/review/<ngày>-<tên>.md` nếu chi tiết) và báo trong câu trả lời; người điều phối cập nhật CURRENT/HANDOFF/ROADMAP MỘT lần khi gộp hoặc phát hành.
F3. Giới hạn kích thước: mỗi gói hoặc bản phát hành tối đa một mục HANDOFF ≤ 12 dòng và một mục CURRENT ≤ 12 dòng. Số liệu test ghi gộp ("toàn bộ 29 bộ xanh ở 1440; các bộ UI chính xanh ở 820 và 375") thay vì liệt kê từng bộ; bảng đo và danh sách ca đã sửa để ở plan hoặc `docs/review/`. Khi HANDOFF có hơn 20 mục: chuyển các mục cũ sang `docs/lich-su-handoff.md` (giữ nguyên chữ).
F4. `lesson.md`: chỉ ghi lỗi có thể tái diễn hoặc đã gây hại, ≤ 5 dòng mỗi bài, mới nhất ở trên.
F5. Gộp nhiều nhánh: gộp hết rồi chạy kiểm thử đầy đủ MỘT lần (D3); xung đột tài liệu giữ cả hai phía rồi dọn trong một commit.

## G. Phát hành
G1. Chỉ khi PO nói rõ (A2). Hỏi PO phát hành MỘT lần ở cuối gói (một câu); gom nhiều thay đổi UI nhỏ vào một bản khi PO không yêu cầu ra ngay.
G2. Làm đúng `docs/huong-dan-day-code-github.md`: nâng đủ 3 chỗ (`APPV` trong index.html, `VERSION` trong sw.js, CHANGELOG.md) TRƯỚC khi chạy kiểm thử đầy đủ (D3) trên nhánh phát hành; gộp `--ff-only`; không force-push `main`; gắn tag; kiểm production bằng GET chỉ đọc (`sw.js`, `APPV`, `/api/ai_plan`, SHA-256 vendor, header CSP, `index.html` và `sw.js` khớp byte với repo, icon).
G3. Sau phát hành cập nhật tài liệu một lần (F2, F3). Hoàn tác = commit revert trên nhánh mới, kèm nâng phiên bản (không force-push).

## H. Khi PO yêu cầu "tiết kiệm" hoặc "ít bước"
H1. Dùng model rẻ nhất đủ dùng, bỏ agent review riêng nếu thuộc E2, chỉ chạy test liên quan cộng kiểm chứng bằng số đo; mục A vẫn giữ nguyên, không nới.
