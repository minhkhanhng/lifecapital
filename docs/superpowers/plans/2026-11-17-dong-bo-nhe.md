# Gói 6 · dong-bo-nhe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** (C2) khi đã đăng nhập, mỗi phút app không còn tốn ~100 ms (ước 300–500 ms trên điện thoại) cho 2 lần `canonState` + 1 request dù không sửa gì; `save()` bớt một lần parse. (C3) mở và bấm trong Cài đặt không còn parse lại 7 bản tự lưu mỗi lần vẽ (42 ms ở 8 bản × 1 MB). KẾT QUẢ ĐỒNG BỘ KHÔNG ĐỔI: không bỏ sót việc gửi, không gửi thừa, số "chưa gửi" không đổi, gộp không đổi.

**Architecture:** Thêm bộ nhớ đệm chính xác (khóa = chuỗi đầy đủ, không phải đoán) cho `canonState`/số chưa gửi và cho số hoạt động của bản tự lưu; làm chậm vòng dự phòng mỗi phút. Không đổi cấu trúc dữ liệu, giao diện, `APPV`, `VERSION`, CHANGELOG, `lc_push`/schema, `mergeStates`. Không push/deploy; commit cục bộ trên nhánh gói (PO đã cho phép).

**Spec:** `docs/review/2026-11-17-fable-hieu-nang.md` mục 2, 3 (C2, C3), `docs/review/2026-11-17-tong-hop.md` C2, C3; `rule.md` §11, §12, §14.

## Hiện trạng (đọc `index.html`, số dòng gần đúng)
- `tick()` (`:~5904`, mỗi 60 s và khi `focus`/`visibilitychange`) gọi `cloudSoon(0)` nếu đã đăng nhập → `cloudSet("wait")` → `cloudPendingCount()` (parse base + `canonState(cloudView(S))`) → `cloudSync()` hỏi `select rev` → nếu rev không đổi: `canonState(cloudView(S))` lần nữa để so với `lc_sync_base`. Đã có kênh thời gian thực `lc_ping`, vòng 60 s chỉ là dự phòng.
- `stampEdits()` (`:~2520`) khi `stampRaw !== lastRaw` parse `lastRaw` + `cleanState` rồi `stampBase`; `save()` (`:~2455`) ghi `lc2` và `lc2_mine` (hai bản 1 MB).
- `renderSettingsModal` (`:~4446`) với `snapKeys().reverse().map(...)`: `JSON.parse(localStorage.getItem(k))` cho từng `lc2_bk_*` để đếm hoạt động; chạy lại sau mỗi nút bấm trong Cài đặt.

## Thiết kế
**Nguyên tắc an toàn:** mọi bộ nhớ đệm phải đúng theo cấu trúc, không dựa vào cờ "bẩn" có thể sót.
1. **C3 `snapCount`:** `Map(key → {raw, n})`; mỗi lần vẽ lấy `raw = localStorage.getItem(k)` (rẻ) và so `cached.raw === raw` (so sánh chuỗi); khác hoặc chưa có thì parse và đếm như cũ. Giữ nguyên cách đếm (`.flat().length` trên `ev`) và xử lý lỗi parse hiện có. Dọn mục của khóa đã bị xóa.
2. **C2a memo `canonState` chính xác:** hàm bao `canonView()` = `src = JSON.stringify(cloudView(S))` (rẻ hơn nhiều so với `canonState`; ĐO số ms của nó trước khi chọn), nếu `src === memo.src` trả `memo.canon`, ngược lại tính `canonState` rồi ghi nhớ. Dùng `canonView()` ở `cloudPendingCount`, ở so sánh `cur === cloudBaseRaw()` và `canonState(cloudView(S)) === baseRaw` trong `cloudSync`. Nếu `JSON.stringify(cloudView(S))` KHÔNG rẻ hơn rõ rệt (< 50% thời gian `canonState`) thì dừng và báo, đừng ép.
3. **C2b `cloudPendingCount` memo:** kết quả theo cặp (`memo.src`, `lc_sync_base` raw); cùng khóa thì trả số cũ. Phần parse base cũng nhớ theo chuỗi `raw`.
4. **C2c vòng dự phòng:** tách `tick(force)`. Chỉ vòng `setInterval` (60 s) là `force = false`: gọi `cloudSoon(0)` khi `cloud.st !== "ok"` (kể cả `wait`, `err`, `offline`), hoặc chưa có `cloud.at`, hoặc `Date.now() - cloud.at > 5 * 60000`. Các đường `focus`, `visibilitychange`, `online`, mở app, đăng nhập luôn `force` (đồng bộ ngay như cũ). Kênh `lc_ping` giữ nguyên. Ghi rõ trong CURRENT: dự phòng khi tab mở lâu chậm hơn (từ 1 phút lên tối đa 5 phút khi đang ổn).
5. **C2d `save()`/`stampBase` (tùy chọn, chỉ khi chứng minh được):** thay lần parse `lastRaw` + `cleanState` ở `stampEdits` bằng dùng thẳng trạng thái vừa ghi NẾU test chứng minh chữ ký (`taskSig`/`evCore`) bằng nhau trên bộ dữ liệu lớn (11k hoạt động) và trên các bộ e2e cũ; nếu không chứng minh được hoặc chênh lệch thì BỎ mục này và báo (không đổi `mt` lệch gây mất bản sửa khi gộp).

## Global Constraints
- Không mất dữ liệu người dùng; không gửi thừa/sót; `lc_sync`, `lc_sync_base`, `lc_push` giữ nguyên; không gọi Supabase thật (dùng `sb` giả); dữ liệu thật không bao giờ dùng để test.
- Test chạy trong trang (≥ 1400px) với chốt dữ liệu demo, khôi phục `S`, `localStorage`, `sessionStorage`, `sb`, `sbUser`, hàm đã thay thế; khuôn `e2e-mrg.js`.
- Cổng lạ 8803 (`python3 -m http.server 8803 --bind 127.0.0.1` từ thư mục worktree, Bash nền, không giấu đầu ra; `preview_start` đọc nhầm cấu hình); kiểm `<title>Life Capital`; cổng 8765 là dự án khác.
- Không refactor ngoài phạm vi; không sửa `mergeStates`, `mergeEv`, `cleanState`, `cloudSync` logic gộp/đẩy ngoài các chỗ gọi `canonState` nêu trên.

## Review Focus
- Bộ nhớ đệm có thể trả kết quả CŨ không (S đổi trong bộ nhớ chưa `save()`; `cloudApply`; đăng xuất/đăng nhập người khác; `lc_sync_base` đổi do `cloudKeep`)? Khóa đã gồm đủ đầu vào của hàm?
- `tick(false)` không làm sót đồng bộ: khi `cloud.st` là `wait/err/offline/sync` vẫn chạy; khi có thay đổi chưa gửi vẫn gửi (đường `save()` → `cloudSoon`).
- Số "chưa gửi" (`cloud.n`) bằng giá trị cũ trong mọi ca test.
- `snapCount`: không đếm sai khi bản tự lưu bị ghi đè cùng độ dài, bị xóa, hỏng JSON.

### Task 0 (đo trước): bộ đo `PERFSYNC`

**Files:** Create `tests/e2e/perf-sync.js` (`window.PERFSYNC`, trả số liệu, không phải đạt/trượt) + dòng trong `tests/e2e/README.md`.

- [ ] **Step 1:** Dựng dữ liệu lớn (khuôn đo cũ: `loadDemo()` rồi thêm 3 năm × 10 hoạt động/ngày ≈ 11k hoạt động, `lc2` ≈ 1 MB, có id/mt hợp lệ), `sb` giả (`from("lc_state").select().eq().maybeSingle()` trả `{data:{rev}}`; `rpc("lc_push")` ghi nhận gọi; có đếm số lần gọi), `sbUser` giả, `lc_sync`/`lc_sync_base` nhất quán với trạng thái hiện tại. Đếm số lần `canonState` bằng bọc hàm. Đo (trung vị 5 lần, `performance.now()`): `tick()`; `cloudPendingCount()`; `cloudSync()` khi không đổi gì (số request, số `canonState`, ms); `save()` sau một lần sửa một hoạt động; `renderSettingsModal()` với 7–8 bản `lc2_bk_*` (số `JSON.parse`, ms). Khôi phục mọi thứ sau đo.
- [ ] **Step 2:** Chạy trên mã HIỆN TẠI, ghi bảng SỐ ĐO TRƯỚC vào báo cáo (và dán vào đầu `perf-sync.js` dưới dạng chú thích để so sau).

### Task 1 (C3): test đỏ rồi sửa

**Files:** Create `tests/e2e/e2e-sync2.js` (`window.E2ESYNC2`) + dòng README; Modify `index.html` (`renderSettingsModal` + `snapCount`).

- [ ] **Step 1: Ca `P3.*`**: `P3.1` tạo 7 bản `lc2_bk_*` giả, vẽ Cài đặt hai lần liên tiếp: lần hai không gọi `JSON.parse` cho bản nào (bọc `JSON.parse` đếm) và HTML danh sách y hệt lần một; `P3.2` ghi đè một bản bằng nội dung khác (cùng độ dài): số hoạt động cập nhật đúng; `P3.3` xóa một bản: dòng biến mất, không ném lỗi; `P3.4` bản JSON hỏng: hiển thị như hành vi cũ, không ném lỗi; `P3.5` số hoạt động từng bản bằng cách đếm cũ (`.flat().length`).
- [ ] **Step 2: Chạy, phải ĐỎ** (P3.1). Ghi số đỏ.
- [ ] **Step 3: Sửa**. **Step 4: Chạy lại `E2ESYNC2` P3.\* xanh.**

### Task 2 (C2a–c): test đỏ rồi sửa

**Files:** Modify `tests/e2e/e2e-sync2.js` (ca `P2.*`), `index.html` (`canonView`, `cloudPendingCount`, `cloudSync`, `tick`).

- [ ] **Step 1: Ca `P2.*`** (với `sb`/`sbUser` giả, `cloudBusy=false`): `P2.1` gọi `cloudPendingCount()` hai lần không đổi dữ liệu: `canonState` chỉ chạy 1 lần, hai kết quả bằng nhau và bằng giá trị của bản cũ (test tự dựng lại công thức cũ để so); `P2.2` sửa `S` TRONG BỘ NHỚ (chưa `save()`), gọi lại: kết quả cập nhật (không trả số cũ); `P2.3` `cloudSync()` khi không đổi gì: `canonState` ≤ 1 lần, không gọi `lc_push`; `P2.4` sau một lần sửa rồi `cloudSync()`: `lc_push` được gọi đúng 1 lần với `p_data` bằng `JSON.parse(canonState(cloudView(S)))` (như cũ); `P2.5` máy chủ có `rev` mới: tải về và gộp như cũ (kết quả `S` bằng bản tính theo logic cũ cho cùng đầu vào); `P2.6` `tick(false)` khi `cloud.st==="ok"` và `cloud.at` mới: không gọi `cloudSoon`; khi `cloud.st` là `wait`, `err`, `offline`, hoặc `cloud.at` cũ hơn 5 phút: có gọi; `tick(true)` (focus/visibilitychange/online) luôn gọi; `P2.7` đổi `lc_sync_base` (qua `cloudKeep`) rồi `cloudPendingCount()`: số mới đúng (không dùng bộ nhớ cũ); `P2.8` đăng xuất/đổi `sbUser`: số trả 0 như cũ.
- [ ] **Step 2: Chạy, phải ĐỎ** (P2.1, P2.3, P2.6 và có thể P2.2 nếu chưa có memo thì xanh sẵn; ghi rõ ca nào đỏ).
- [ ] **Step 3: Sửa** theo thiết kế 2–4. **Step 4: Chạy lại P2.\* xanh; chạy `PERFSYNC` ghi SỐ ĐO SAU.**

### Task 3 (C2d, tùy chọn): chỉ khi chứng minh được tương đương
- [ ] Viết ca `P5.*` so `stampBase` từ `lastRaw` (cách cũ) với từ trạng thái trực tiếp trên bộ dữ liệu lớn và demo; chỉ khi bằng nhau từng khóa thì thay, kèm ca kiểm `mt` không đổi sai. Không thì bỏ, ghi lý do vào báo cáo.

### Kiểm tra cuối
- [ ] `E2ESYNC2`, E2ESYNC 14/14, E2EMRG 21/21, E2ELIM 12/12, E2EIMP 5/5, E2EXSS 14/14, E2ESW 10/10, E2E 95/95, E2EUAT2 71/71, E2EUAT3 62/62, E2EUX 124/124, E2E63 77/77, merge-tests 35/35, `node tests/sw/test_sw.js` 23/23, `node --check` khối script chính và `sw.js`. Báo bảng SỐ ĐO TRƯỚC/SAU.
