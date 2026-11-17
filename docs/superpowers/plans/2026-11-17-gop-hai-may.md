# Gói 4 · gop-hai-may Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** (A5) hai máy cùng liên kết Google không tạo hai sự kiện cho một hoạt động mới. (A6) gộp hai máy giữ được cài đặt khác khóa của cả hai bên ở `bl` (giờ cố định) và `cfg`, thay vì lấy nguyên khối của một bên.

**Architecture:** Hai task độc lập, mỗi task: test đỏ rồi sửa. Không đổi cấu trúc dữ liệu, giao diện, `APPV`, `VERSION`, CHANGELOG. Không push/deploy; commit chỉ khi PO cho phép (PO đã cho commit cục bộ trên nhánh gói này).

**Spec:** `docs/review/2026-11-17-fable-du-lieu.md` mục 5, 6; `docs/review/2026-11-17-fable-sw-offline.md` (đã mô phỏng A5, A6); `rule.md` §11.

## A5: hiện trạng và sửa
`markPending` (`index.html:~3929`) chỉ tăng `ds`, không cấp `gi`; `gi` chỉ sinh ở `gcalCreateEvent` (`:~3993`) lúc đẩy, nên hai máy cùng thấy hoạt động `ds:1` không `gi` sẽ tự sinh hai `gi` khác nhau và POST hai sự kiện. Sửa: trong `markPending`, khi sự kiện đủ điều kiện đánh dấu (không `demo`, không `gx`, đã liên kết/chia sẻ) và CHƯA có `gi` và CHƯA có `gid`, gán `e.gi = gcalNewId()`. Không gán cho sự kiện đã có `gid` (đã nằm trên Google, `gi` vô nghĩa). Giữ nguyên chú thích và nhánh `:4014` (đổi `gi` khi mã cũ đã bị xóa). `gi` đã được `cleanState` (`:~5664`, regex `^[0-9a-v]{20,64}$`) và `mergeEv` (`:~2612`) giữ.

## A6: hiện trạng và sửa
`mergeStates` (`:~2638`): `pick(f)` lấy nguyên `mine[f]` hoặc `theirs[f]`; với `bl`, `cfg` (và `mem`, `pm`, `memV`) hai máy sửa KHÁC khóa thì một bên mất. Sửa chỉ cho `bl` và `cfg`: thêm hàm gộp ba bên THEO TỪNG KHÓA cho giá trị vô hướng/đối tượng nhỏ (`mergeKeys`). KHÔNG dùng `mergeMap` hiện có: nó dùng `if (m && t)`/`if (x)` nên bỏ giá trị `0`/`false` (vd `cfg.gcalAutoSync:false`, `cfg.mods[k]:false`), và so `mt` không có ở `bl`/`cfg`.
Quy tắc theo từng khóa k (B/M/T = base/mine/theirs; dùng `k in obj` để phân biệt vắng và `0/false`; so bằng `sameJ`):
- Cả hai có: bằng nhau → giữ; `trust` và có B: M = B → lấy T; T = B → lấy M; đều khác B (xung đột) → lấy M (mine thắng, như `pick` hiện nay).
- Chỉ một bên có: `trust` và B có k và bên đó = B → bên kia đã xóa thật → bỏ khóa; ngược lại giữ.
- Khóa lạ (không có trong code) vẫn giữ (rule §11). Kết quả là đối tượng mới; B/M/T là `undefined` thì xem như `{}`. Nếu cả M và T đều không có gì, giữ hành vi cũ (không tạo `bl`/`cfg` rỗng nếu trước đó không có).
`mem`, `pm`, `memV` KHÔNG đổi trong gói này (ngoài phạm vi ROADMAP); implementer chỉ báo hình dạng của chúng và có cùng lỗi không.

## Global Constraints
- Không mất dữ liệu người dùng; không đổi tên/bỏ trường; dữ liệu cũ đọc được.
- Test chạy trong trang (≥ 1400px) khuôn `e2e-sync.js`/`e2e-xss.js` (có chốt chỉ chạy trên dữ liệu demo); chỉ dùng `loadDemo()` và dữ liệu giả; khôi phục `S`, `localStorage`, `sessionStorage` sau test.
- Cổng lạ 8798 (`python3 -m http.server 8798 --bind 127.0.0.1` từ thư mục worktree, bằng Bash nền, không giấu đầu ra; `preview_start` đọc nhầm cấu hình, xem lesson.md); kiểm `document.title === "Life Capital"`; cổng 8765 là dự án khác.
- Không refactor ngoài phạm vi; không sửa `mergeEv`, `mergeHealth`, `mergeById`, `mergeMap`.

## Review Focus
- `mergeKeys` giữ `false`/`0`; `gcalAutoSync:false` của một bên không bị bật lại; khóa lạ giữ.
- Đối xứng: gộp (base, A, B) và (base, B, A) cho cùng kết quả khi không xung đột; xung đột thì mine thắng (đã biết, ghi lại).
- `markPending` không gán `gi` cho `demo`, `gx`, sự kiện có `gid`, hay khi chưa liên kết; gọi nhiều lần không đổi `gi`.

### Task 1 (A5): test đỏ rồi sửa

**Files:** Create `tests/e2e/e2e-mrg.js` (`window.E2EMRG`) + dòng trong bảng `tests/e2e/README.md`; Modify `index.html` `markPending`.

- [ ] **Step 1: Ca `M5.*`**: bật liên kết giả (`localStorage.gcal_linked="1"` và khôi phục sau test). `M5.1` hoạt động mới (`{id,t,c,h,...}` không `gid`) sau `markPending` có `gi` khớp `/^[0-9a-v]{20,64}$/` và `ds===1`; `M5.2` gọi lại `markPending`: `gi` giữ nguyên, `ds===2`; `M5.3` sự kiện `demo`, sự kiện `gx`: không `gi`, không `ds`; `M5.4` sự kiện có `gid`: không đổi `gi`; `M5.5` chưa liên kết (xóa `gcal_linked`, không `sbUser`): không `gi`, không `ds`; `M5.6` gộp hai bản sao (mine/theirs, cùng hoạt động, cùng `gi`, `ds:1`) qua `mergeStates` và vòng `cleanState`: kết quả vẫn một `gi` duy nhất, bằng nhau ở cả hai chiều.
- [ ] **Step 2: Chạy, phải ĐỎ** (M5.1, M5.2, M5.6 đỏ vì thiếu `gi`). Ghi số đỏ.
- [ ] **Step 3: Sửa `markPending`.**
- [ ] **Step 4: Chạy lại M5.\* xanh.**

### Task 2 (A6): test đỏ rồi sửa

**Files:** Modify `tests/e2e/e2e-mrg.js` (ca `M6.*`), `tests/merge-tests.html` (thêm vài ca đơn vị cùng kiểu), `index.html` (`mergeStates`, thêm `mergeKeys`).

- [ ] **Step 1: Ca `M6.*`** gọi `mergeStates` (qua `cleanState` như `merge-tests.html`): `M6.1` base `bl{sk:1}`, mine `bl{sk:2}`, theirs `bl{sk:1,qh:3}`, trust → `{sk:2,qh:3}` ở cả hai chiều; `M6.2` `cfg`: mine `{x:2,defDuration:1}`, theirs `{x:1,defDuration:2}`, base `{x:1,defDuration:1}`, trust → `{x:2,defDuration:2}`; `M6.3` `false` giữ: mine `cfg{gcalAutoSync:false}`, theirs `cfg{gcalAutoSync:true}`, base `cfg{gcalAutoSync:true}`, trust → `false`; ngược lại theirs `false`, mine `true` (= base) → `false`; `M6.4` giá trị `0` ở `bl` giữ; `M6.5` xóa thật: base `bl{sk:1,qh:3}`, mine như base, theirs `bl{sk:1}`, trust → `{sk:1}`; `M6.6` không trust (không base): hợp hai bên, mine thắng khi cùng khóa khác giá trị; `M6.7` khóa lạ `cfg.zzz` một bên có thì giữ; `M6.8` không có `bl`/`cfg` ở cả hai thì không tạo mới; `M6.9` `mods` (đối tượng lồng trong `cfg`) so nguyên khối bằng `sameJ`, không làm mất khóa.
- [ ] **Step 2: Chạy, phải ĐỎ** (M6.1, M6.2, M6.3 một chiều, M6.5 đỏ tùy chiều; ghi số đỏ).
- [ ] **Step 3: Sửa**: thêm `mergeKeys(B, M, T, trust)` cạnh `mergeMap`; trong `mergeStates` thay `bl: pick("bl"), cfg: pick("cfg")` bằng `mergeKeys` (chỉ khi một bên có đối tượng; `mem`, `pm`, `memV` vẫn `pick`).
- [ ] **Step 4: Chạy lại `E2EMRG`, `tests/merge-tests.html` (PASS), E2ESYNC 14/14, E2ELIM 12/12, E2EIMP 5/5, E2EXSS 14/14, E2E 95/95, E2EUAT2 71/71, E2E63 77/77, E2EUAT3 62/62; `node --check` khối script chính và `sw.js`.**
