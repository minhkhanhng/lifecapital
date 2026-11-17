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
1. Trước khi ra bản mới: tải sao lưu JSON trong app (Cài đặt → Dữ liệu).
2. Quyền ghi GitHub / push / deploy: chỉ khi PO nói rõ (đã có đăng nhập qua Keychain theo `docs/huong-dan-day-code-github.md`).
3. Thử trên thiết bị thật trước khi ra bản mới.
4. Nếu dùng Career OS trong khung Browser của Claude: localStorage của `127.0.0.1:8765` đã bị `clear()` nhầm ngày 2026-11-17 (lesson.md); kiểm tra xem có mất gì không.

## Quyết định PO (2026-11-17)
- Đau nhất: chậm / nặng. Cấm đụng: không có phần nào (mọi đề xuất vẫn qua duyệt). Quy tắc dữ liệu: không mất dữ liệu người dùng. Đường quay lại: tải JSON + tag git. Mục tiêu từng tab: dùng README, chưa PO xác nhận.

## Tôi tự chốt
- Thêm `scripts/` vào `.vercelignore` để `scripts/status.sh` không bị deploy. Nếu sai thì tốn: một dòng, bỏ đi là xong.
- Dùng cổng 8790 cho máy chủ xem thử (8765 bị dự án khác chiếm).
