# Gói 1 · mat-du-lieu (A1: bỏ ngưỡng cắt cứng) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `cleanState` và gộp đồng bộ không còn cắt dữ liệu người dùng âm thầm khi vượt các ngưỡng cũ (việc 500, dự án 200, thói quen 100, subs 100, ticks 1000, thuốc 100, triệu chứng 50, phần/mốc/cập nhật dự án 20/50/30, lệnh xóa Google 500).

**Architecture:** Thay mọi ngưỡng cũ bằng một trần an toàn duy nhất `SANE_MAX = 100000` (chỉ để chặn tệp hỏng/độc hại, người dùng thật không bao giờ chạm). Không đổi cấu trúc dữ liệu, không migration, không đổi giao diện. Test e2e mới `tests/e2e/e2e-lim.js` (đỏ trước, xanh sau).

**Tech Stack:** `index.html` (JS thuần), e2e chạy trong trang bằng `tests/e2e/runner.js`.

**Spec:** `docs/review/2026-11-17-tong-hop.md` mục A1; `docs/review/2026-11-17-fable-kien-truc.md` #1; `docs/review/2026-11-17-fable-du-lieu.md` #1; `rule.md` §11.

## Global Constraints
- Không mất dữ liệu người dùng; trường lạ/cũ giữ nguyên (`rule.md` §11).
- `cleanState` được gọi lúc tải trang (`index.html:2392`) trước các khai báo ở sau: hằng mới phải khai báo TRƯỚC dòng `let S, rawSaved` (cạnh `GCAL_CID`, ~:2388), nếu không rơi vào vùng chết TDZ.
- Không nâng `APPV`/`VERSION`, không sửa CHANGELOG (chưa phát hành). Không push, không deploy.
- Không đổi `p.ups = [...].slice(0, 30)` ở `:8469` (hành vi giao diện "giữ 30 cập nhật gần nhất", ngoài phạm vi, hỏi PO riêng) và `GX_SEEN.slice(-2000)` ở `:4124`.

## Review Focus
- Đúng bằng ngưỡng cũ (500 việc) và vượt ngưỡng (600) đều giữ nguyên toàn bộ, thứ tự không đổi.
- Thói quen vượt 100 vẫn khử trùng `id` (không nhân đôi).
- Vòng JSON stringify → `cleanState` lặp 2 lần cho kết quả giống nhau (idempotent), không mất gì ở lần 2.
- Hai máy gộp `gdel` tổng > 500 giữ đủ lệnh xóa.
- `cleanState` vẫn chạy được khi mảng là `[]`/thiếu (dữ liệu cũ, người mới).

---

### Task 1: Test đỏ cho A1

**Files:**
- Create: `tests/e2e/e2e-lim.js`
- Modify: `tests/e2e/README.md` (thêm dòng bảng: `e2e-lim.js | E2ELIM | Gói 1: không cắt cứng dữ liệu`)

**Interfaces:**
- Consumes: `cleanState(d)`, `mergeStates(base, mine, theirs, trust)`, `loadDemo()`, `nid(prefix)`, `S` (toàn cục trong trang). Chạy sau `loadDemo()`, qua `await __run("tests/e2e/e2e-lim.js", "E2ELIM")`.
- Produces: `window.E2ELIM = async () => ({ pass, total, fail })`, cùng khuôn với `window.E2EPJL`.

- [ ] **Step 1: Viết `tests/e2e/e2e-lim.js`** theo khuôn `e2e-pjlist.js` (mảng `out`, hàm `ok(id, pass, info)`, trả `{ pass, total, fail }`). Dựng dữ liệu bằng `cleanState({ ...JSON.parse(JSON.stringify(S)), <trường> })` rồi kiểm độ dài. Các ca (mỗi ca một `ok`):
  - `L1.1`: 600 việc hợp lệ (`{id:"t"+i, t:"Việc "+i, c:"sk", m:"u", subs:[]}`, 100 cái `done`) → `cleanState(...).tasks.length === 600`, phần tử đầu/cuối giữ đúng `id`.
  - `L1.2`: đúng 500 việc → 500.
  - `L1.3`: 250 dự án (`{id, n, col:PJ_COLORS[0], st:"run", pr:"m", sd:tk, caps:[]}`) → 250.
  - `L1.4`: 150 thói quen khác `id` → 150; thêm 3 thói quen trùng `id` → vẫn 150 (khử trùng).
  - `L1.5`: một việc có 150 `subs` (`{id, t, h:1}`) → 150.
  - `L1.6`: thói quen hằng ngày có 1100 ngày tick (từ `2023-01-01` liên tiếp) → `Object.keys(ticks).length === 1100`, còn ngày `2023-01-01`.
  - `L1.7`: 120 thuốc (`{id:"m"+i, n, kind:"med"}`) → 120; 60 triệu chứng tự đặt (`syc: {id:"y"+i, n}`) → 60.
  - `L1.8`: một dự án có 25 `secs`, 60 `ms` (`{id,n,d:tk}`), 40 `ups` (`{id,d:tk,hs:"ok",note:""}`) → 25/60/40.
  - `L1.9`: `gdel` 600 id hợp lệ (`"g"+padded 6 chữ số`, khớp `GID`) qua `cleanState` → 600.
  - `L1.10`: `mergeStates(null, A, B, true)` với `A.gdel` 300 id và `B.gdel` 300 id khác → kết quả `gdel.length === 600` (gọi trên trạng thái đã `cleanState`).
  - `L1.11`: idempotent: `JSON.stringify(cleanState(JSON.parse(JSON.stringify(x))))` bằng `JSON.stringify(x)` với `x = cleanState(<dữ liệu ca L1.1+L1.4+L1.6 gộp>)`.
  - `L1.12`: `cleanState({ev:{}, caps:...})` kiểu dữ liệu cũ thiếu `tasks/projects/habits/gdel` vẫn chạy, không ném lỗi.
  Cuối hàm không đổi `S` thật (không gọi `save()`); chỉ dùng biến cục bộ.

- [ ] **Step 2: Thêm dòng vào bảng `tests/e2e/README.md`.**

- [ ] **Step 3: Chạy test, phải ĐỎ.** Máy chủ: `python3 -m http.server 8790 --bind 127.0.0.1` ở thư mục worktree này (kiểm cổng, không dùng 8765). Trình duyệt 1440×900, kiểm `document.title === "Life Capital"`, rồi `localStorage.clear(); localStorage.setItem("lc_onb","1"); location.reload()`, nạp `runner.js`, `loadDemo()`, `await __run("tests/e2e/e2e-lim.js","E2ELIM")`. Kỳ vọng: các ca L1.1, 1.3–1.10 đỏ (còn L1.2, L1.12 xanh). Ghi số ca đỏ vào commit.

- [ ] **Step 4: Commit** `tests/e2e/e2e-lim.js`, `tests/e2e/README.md`: "Gói 1: test đỏ cho A1 (ngưỡng cắt cứng)".

### Task 2: Bỏ ngưỡng, test xanh, kiểm tra đầy đủ

**Files:**
- Modify: `index.html:~2388` (khai báo hằng), `:2670` (gộp `gdel`), `:5676-5679`, `:6042`, `:6050`, `:6068`, `:6095-6097`, `:6120`

**Interfaces:**
- Produces: `const SANE_MAX = 100000; // trần chặn tệp hỏng, không phải giới hạn dùng` (cạnh `GCAL_CID`).

- [ ] **Step 1: Thêm `SANE_MAX`** ngay sau dòng `const GCAL_CID = …` (trước `let S, rawSaved`).

- [ ] **Step 2: Thay từng ngưỡng bằng `SANE_MAX`**, giữ nguyên mọi phần còn lại của dòng: `:5676` `.slice(-500)` → `.slice(-SANE_MAX)`; `:5677` `.slice(0, 500)`; `:5678` `.slice(0, 200)`; `:5679` `.slice(0, 100)`; `:6042` `.slice(0, 100)` (meds); `:6050` `.slice(0, 50)` (syc); `:6068` `.slice(-1000)`; `:6095` `arr(x.secs, 20, …)`; `:6096` `arr(x.ms, 50, …)`; `:6097` `arr(x.ups, 30, …)`; `:6120` `.slice(0, 100)` (subs) → `SANE_MAX`; `:2670` `.slice(-500)` → `.slice(-SANE_MAX)`. Không đụng `caps.slice(0, 20)` (`:6083`, danh sách loại vốn của dự án).

- [ ] **Step 3: Chạy lại `E2ELIM`**: kỳ vọng 12/12 xanh.

- [ ] **Step 4: Kiểm tra đầy đủ** (báo riêng web 1440×900; mobile 390×844 chạy riêng nếu được): 14 bộ e2e (README `tests/e2e`), `tests/merge-tests.html` (30/30), `python3 tests/api/test_ai_plan.py` (12), `node --check` khối script chính và `sw.js`. Ca đỏ chạy lại riêng (nhớ resize 1440 sau mỗi navigate). So kết quả với `CURRENT.md` (832/832 trước gói).

- [ ] **Step 5: Commit** `index.html`: "Gói 1: bỏ ngưỡng cắt cứng dữ liệu (A1), thay bằng trần an toàn SANE_MAX".

### Task 3: Tài liệu gói 1

**Files:** `CURRENT.md`, `HANDOFF.md`, `ROADMAP.md` (gói 1 → Xong, chờ PO duyệt), `lesson.md`.

- [ ] **Step 1:** `lesson.md` mục mới: "Giới hạn `.slice` trong `cleanState` làm mất dữ liệu" (lỗi, nguyên nhân: giới hạn đặt như phòng thủ nhưng chạy cả trên dữ liệu thật mỗi lần mở app; cách tránh: không cắt dữ liệu người dùng; dùng một trần an toàn rất lớn và test ở biên). Cập nhật `CURRENT.md` (kết quả mới, tổng ca), `HANDOFF.md`, `ROADMAP.md`.
- [ ] **Step 2: Commit** tài liệu: "Gói 1: cập nhật CURRENT, HANDOFF, ROADMAP, lesson".
