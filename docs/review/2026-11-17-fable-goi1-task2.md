# Review fable · Gói 1 mat-du-lieu · Task 2 (bỏ ngưỡng cắt cứng A1)

- Ngày: 2026-11-17 · Reviewer: Fable (chỉ đọc/chạy, không sửa code)
- Worktree: `.claude/worktrees/mat-du-lieu`, nhánh `claude/mat-du-lieu`, HEAD `f3bc0bc` + thay đổi working tree chưa commit (chỉ `index.html`, +13/−12).
- Đã kiểm `review-task2-working.diff` == `git diff -U10 index.html` (giống hệt). Máy chủ 8791 có cwd đúng worktree này, `index.html` phục vụ == tệp trong worktree (cmp). Mọi lệnh JS đều kiểm `document.title === "Life Capital"` và `location.port === "8791"` trước.

## Kết luận
- **Spec: ✅** — đúng plan Task 2, không lệch phạm vi.
- **Quality: approved** (có 1 phát hiện Important nằm NGOÀI phạm vi plan, cùng cơ chế A1, cần PO quyết: gộp vào gói 1 hay mở phiếu riêng).

## (A) Kết quả kiểm tra đầy đủ — web 1440×900 (trình duyệt tích hợp, dữ liệu demo `loadDemo()`, mỗi bộ trên trang nạp mới sau `localStorage.clear()`; `innerWidth === 1440` kiểm trước mỗi bộ)

| Bộ | Tệp | Kết quả | Cơ sở (CURRENT.md) |
|---|---|---|---|
| E2ELIM | e2e-lim.js | **12/12** | mới (trước Task 2: 3/12) |
| E2E | e2e6.js | 95/95 | 95/95 |
| E2E61 | e2e61.js | 41/41 | 41/41 |
| E2ESCHED | e2e-sched.js | 28/28 | 28/28 |
| E2EHB | e2e-hb.js | 34/34 | 34/34 |
| E2EUAT2 | e2e-uat2.js | 71/71 | 71/71 |
| E2EHL | e2e-hl.js | 85/85 | 85/85 |
| E2EHL2 | e2e-hl2.js | 53/53 | 53/53 |
| E2EUAT3 | e2e-uat3.js | 62/62 | 62/62 |
| E2EUX | e2e-ux.js | 124/124 | 124/124 |
| E2EAI | e2e-ai.js | 44/44 | 44/44 |
| E2EPLAN | e2e-plan.js | 46/46 | 46/46 |
| E2EDASH | e2e-dash.js | 36/36 | 36/36 |
| E2EPJL | e2e-pjlist.js | 36/36 | 36/36 |
| E2E63 | e2e-v063.js | 77/77 | 77/77 |
| **Tổng 14 bộ cũ** | | **832/832** | 832/832 |
| **Tổng 15 bộ** | | **844/844** | |

- `errs` (lỗi JS toàn cục do runner bắt) = `[]` ở cả 15 bộ.
- Ghi chú: lần chạy đầu của E2E (e2e6.js) đọc `__done` sau 10 s còn `null` (bộ chạy lâu hơn 10 s, không phải ca đỏ); chạy lại riêng (resize 1440 lại) chờ 20 s → 95/95. Không có ca đỏ nào.
- `tests/merge-tests.html`: tiêu đề **`PASS 30/30`** (cổng 8791).
- `python3 tests/api/test_ai_plan.py`: **Ran 12 tests … OK**.
- `node --check` khối `<script>` chính của index.html (trích ra scratchpad, 478 KB): **OK**; `node --check sw.js`: **OK**.
- Mobile 390×844: không chạy (ngoài yêu cầu (A); plan ghi "chạy riêng nếu được").
- Đã dọn: `localStorage.clear()` trên origin 8791 (0 khóa còn lại), `resize_window` preset desktop.

### Kịch bản JS thuần bổ sung (trên trang demo, chỉ biến cục bộ, không `save()`)
| Kiểm | Kết quả |
|---|---|
| 600 việc qua `cleanState`: thứ tự id giữ nguyên toàn bộ | ✅ `order600 = true` |
| 50 000 việc (1/10 có 5 việc con) qua `cleanState` | 50 000 giữ đủ, **94 ms** |
| `JSON.stringify` kết quả 50k | 12 ms, 3 735 KB |
| Vòng stringify → parse → `cleanState` lần 2 | 71 ms, **idempotent** (chuỗi JSON bằng nhau) |
| `mergeStates(null, A(30k), B(30k, chồng 10k), true)` | 50 000 việc, 38 ms |
| 100 500 việc | cắt còn 100 000 (đúng trần `SANE_MAX`) |
| 150 thói quen + 5 trùng id | 150 (khử trùng còn hoạt động) |
| 20 000 ngày tick một thói quen | 20 000 giữ đủ, 9 ms |
| `cleanState` với mảng `[]` / thiếu `tasks/projects/habits/gdel` | chạy, không ném lỗi |
| Ghi thử 3 735 KB vào `localStorage` (khóa tạm, đã xóa) | OK, chưa chạm hạn mức |

## (B) Review diff so với plan

### Đối chiếu Global Constraints / Step 2
| Mục | Kết quả |
|---|---|
| `const SANE_MAX = 100000;` khai báo trước `let S, rawSaved` | ✅ `index.html:2389` (ngay sau `GCAL_CID`), `let S, rawSaved` ở `:2390`; `cleanState` gọi ở `:2393` → không TDZ (và trang tải thật đã chứng minh: `typeof SANE_MAX === "number"`) |
| `:2671` mergeStates `gdel` `.slice(-500)` → `-SANE_MAX` | ✅ |
| `:5677` gdel, `:5678` tasks 500, `:5679` projects 200, `:5680` habits 100 | ✅ cả 4 |
| `:6043` meds 100, `:6051` syc 50 | ✅ |
| `:6069` ticks `.slice(-1000)` → `-SANE_MAX` | ✅ |
| `:6096-6098` `arr(x.secs/ms/ups, 20/50/30, …)` → `SANE_MAX` | ✅ |
| `:6121` subs 100 | ✅ |
| KHÔNG đổi `caps.slice(0, 20)` (`:6084`), `p.ups … .slice(0, 30)` (`:8470`), `GX_SEEN … .slice(-2000)` (`:4125`) | ✅ giữ nguyên |
| Không nâng `APPV` (`:2477` = 71) / `VERSION` (sw.js = `lc-0.7.1`) / CHANGELOG | ✅ `git diff` chỉ chạm `index.html` |
| Helper `arr(l, max, f)` (`:6102-6105`) có cắt theo `max`? | Có `.slice(0, max)` nhưng cả 3 nơi gọi đều truyền `SANE_MAX` → không còn cắt dữ liệu thật. Khử trùng theo `id` trong `arr` vẫn chạy. |
| Còn `.slice` cắt SỐ LƯỢNG trong cleanState/cleanHealth/cleanProject/cleanHabit/cleanSub/cleanTask/mergeStates? | Không. Các `.slice` còn lại đều là cắt ĐỘ DÀI chuỗi (t 160/120, n 60/40/80, desc 2000, note 280, dose 40, mem key 120…) — có từ trước, ngoài phạm vi A1. |

### Review Focus (plan)
| Mục | Bằng chứng |
|---|---|
| Đúng 500 và 600 việc giữ nguyên, thứ tự không đổi | L1.1, L1.2 xanh + kịch bản `order600` |
| Thói quen > 100 vẫn khử trùng id | L1.4 xanh + kịch bản 150+5 |
| Idempotent qua JSON | L1.11 xanh + kịch bản 50k |
| Hai máy gộp `gdel` > 500 | L1.10 xanh (600) |
| Mảng `[]`/thiếu | L1.12 xanh + kịch bản |

### Phát hiện
**Critical:** không có.

**Important**
1. `index.html:5743-5748` (`importData`, chế độ "Gộp" tệp sao lưu vào dự án ĐÃ CÓ): vẫn `[["secs", 20], ["ms", 50], ["ups", 30]]` rồi `x[f] = x[f].slice(0, max)`. Cùng cơ chế A1: phần/mốc/cập nhật thêm từ tệp bị cắt âm thầm khi dự án vượt 20/50/30 (với `ups` còn sort rồi cắt nên bỏ cập nhật cũ nhất). Plan Task 2 không liệt kê dòng này nên KHÔNG tính là lệch spec; nhưng mục tiêu gói ("gộp … không còn cắt dữ liệu người dùng âm thầm") chưa phủ hết. Đề nghị PO quyết: thêm vào gói 1 (cần test đỏ trước, rule §14) hoặc mở phiếu riêng. Độ chắc chắn: cao (đọc code; chưa dựng kịch bản import vì cần hộp thoại `ask()`).

**Minor**
2. `arr(l, max, f)` giờ luôn nhận `SANE_MAX`: tham số `max` thành thừa. Không nên sửa trong gói này (rule §17, không refactor ngoài phạm vi) — ghi nhận để dọn sau.
3. Rủi ro mới do bỏ ngưỡng: trần thật giờ là hạn mức `localStorage` (~5 MB/origin). 50k việc ≈ 3,7 MB vẫn ghi được; vượt nữa thì `save()` (`:2456-2457`) bắt `QuotaExceeded`, gọi `freeSpace()` rồi thử lại, nếu vẫn hỏng thì hiện cảnh báo cố định "Không lưu được dữ liệu" + nút Sao lưu (`:2752-2763`) — tức là KHÔNG mất âm thầm, hành vi tốt hơn cắt bớt. Chưa kiểm giới hạn payload khi đồng bộ Supabase với bản 3–7 MB (ngoài phạm vi, độ chắc chắn trung bình).
4. Hiệu năng: đường `cleanState`/`mergeStates`/JSON với 50k việc đều < 100 ms (bảng trên) → không lo. Chưa đo `draw()`/render với 50k việc (giao diện có thể chậm, nhưng đó là giới hạn hiển thị, không phải mất dữ liệu; người dùng thật không chạm).
5. `tests/merge-tests.html` phần hướng dẫn còn ghi "python3 -m http.server 8765" — cổng này đã bị dự án khác chiếm (lesson 2026-11-17). Có từ trước, không thuộc diff; nên sửa khi chạm tệp này lần sau.
6. Các cơ chế cắt cùng kiểu còn lại (đã được plan loại trừ có chủ ý): `caps.slice(0, 20)` `:6084`, `p.ups … slice(0, 30)` `:8470`, `GX_SEEN slice(-2000)` `:4125`, `lc_hb_dis slice(-200)` `:9170` (danh sách gợi ý thói quen đã bỏ qua — trạng thái UI, không phải dữ liệu người dùng).

## Độ chắc chắn
- Spec ✅ và các số liệu: cao (chạy trực tiếp, số khớp 832/832 cơ sở + 12/12 mới).
- Important #1: cao về mặt code; tác động thực tế phụ thuộc người dùng có dùng "Gộp" tệp sao lưu với dự án > 20 phần / 50 mốc / 30 cập nhật.
