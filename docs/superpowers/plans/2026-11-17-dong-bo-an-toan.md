# Gói 2 · dong-bo-an-toan Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** Sửa 5 lỗi an toàn dữ liệu nhỏ, mỗi lỗi một commit, test đỏ trước: A2 base đồng bộ ghi lỗi, A3 nhập JSON Gộp theo `id`, A4 "Xóa khỏi máy này" để sót token Google, A7 `save()` báo sai "bộ nhớ đầy", A8 service worker trả trang lỗi thay vì bản cache.

**Architecture:** Mỗi mục sửa 1–3 dòng trong `index.html` hoặc `sw.js`. Test e2e mới `tests/e2e/e2e-sync.js` (`window.E2ESYNC`, khuôn `e2e-lim.js`/`e2e-imp.js`: tự khôi phục `lc2`, `lc2_mine` và khóa nó đụng tới); test Node cho SW `tests/sw/test_sw.js` (chạy `node tests/sw/test_sw.js`, nạp `sw.js` trong `vm` với `self`/`caches`/`fetch` giả).

**Spec:** `docs/review/2026-11-17-fable-du-lieu.md` (#2, #3, #4), `docs/review/2026-11-17-fable-kien-truc.md` (#4, #5), `docs/review/2026-11-17-fable-sw-offline.md` (A8 đã đo), `rule.md` §11.

## Global Constraints
- Không mất dữ liệu người dùng. Không nâng `APPV`/`VERSION`, không sửa CHANGELOG, không push.
- Test chạy trên trang dữ liệu thử (`loadDemo()`), cổng lạ (8796), kiểm `document.title === "Life Capital"`; cổng 8765 là dự án khác. Test không để lại dữ liệu trong localStorage.
- Không đụng các ngưỡng `SANE_MAX` của gói 1 và logic gộp `bl`/`cfg` (thuộc gói 4).
- Số dòng dưới đây gần đúng: `grep -n` lại trước khi sửa.

## Review Focus
- A2: ghi base lỗi thì KHÔNG để lại `lc_sync` mồ côi; ghi thành công thì hành vi cũ giữ nguyên.
- A3: hoạt động khác `id` nhưng cùng nội dung vẫn bị khử trùng như cũ (`sg`); cùng `id` mà nội dung đã sửa không bị thêm lại.
- A4: `wipeLocal` vẫn đặt lại dữ liệu như cũ.
- A7: lỗi lập trình (TypeError) và lỗi hết dung lượng (`QuotaExceededError`) cho thông điệp khác nhau; cả hai vẫn bật cảnh báo vì dữ liệu chưa lưu.
- A8: `/` trả 404/500 mà cache có `"./"` → trả cache; không có cache → trả phản hồi lỗi như cũ; `res.ok` → hành vi cũ.

---

### Task 1: A2 `cloudKeep`
**Files:** Create `tests/e2e/e2e-sync.js` (+ dòng README), Modify `index.html` (`cloudKeep`, ~:7388).
- [ ] **Step 1: Test đỏ `S2.1`:** stub `Storage.prototype.setItem` ném lỗi khi khóa là `"lc_sync_base"`; gọi `cloudKeep({uid:"u",rev:7}, "x")`; khẳng định `cloudMeta() === null` và `cloudBaseRaw() === null`. `S2.2` (xanh trước và sau): không lỗi → `cloudMeta().rev === 7` và `cloudBaseRaw() === "x"`. Khôi phục `setItem` và dọn khóa `lc_sync*` trong `finally`.
- [ ] **Step 2: Chạy đỏ (S2.1), commit test. Step 3: Sửa:** nếu ghi base lỗi thì `localStorage.removeItem("lc_sync")` và `console.warn("cloudKeep: không ghi được bản gốc đồng bộ", e)`. **Step 4:** chạy xanh, commit.

### Task 2: A3 nhập JSON Gộp theo `id`
**Files:** Modify `tests/e2e/e2e-sync.js`, `index.html` (vòng gộp `d.ev` trong `importData`, ~:5766, có `const sg`).
- [ ] **Step 1: Test đỏ `S3.1`:** dùng khuôn `doImport` của `tests/e2e/e2e-imp.js` (bấm "Gộp" trong `ask`): `S.ev` có hoạt động `{id:"e1", t:"Họp nhóm (đã sửa)", ...}`; tệp có cùng `id:"e1"`, `t:"Họp nhóm"` → sau gộp ngày đó có đúng 1 hoạt động. `S3.2` (xanh): hai hoạt động khác `id` cùng `sg` → vẫn chỉ 1; hai hoạt động khác `id` khác nội dung → 2.
- [ ] **Step 2–4:** đỏ, commit; sửa `if (!L.some(y => y.id === e.id || sg(y) === sg(e)))`; xanh, commit.

### Task 3: A4 `wipeLocal`
**Files:** Modify `tests/e2e/e2e-sync.js`, `index.html` (`wipeLocal`, ~:7675; `clearGCalToken` ~:3780).
- [ ] **Step 1: Test đỏ `S4.1`:** đặt `gcal_token`, `gcal_token_exp`, `gcal_linked`, `lc_gx_seen` trong localStorage, gọi `wipeLocal()`; cả bốn khóa phải `null`. Khôi phục `lc2`/`lc2_mine` sau test (không để dữ liệu đã xóa).
- [ ] **Step 2–4:** đỏ, commit; thêm vào `wipeLocal`: `clearGCalToken(); ["gcal_linked", "lc_gx_seen"].forEach(k => localStorage.removeItem(k));` (xác nhận `clearGCalToken` xóa token + hạn); xanh, commit.

### Task 4: A7 `save()`
**Files:** Modify `tests/e2e/e2e-sync.js`, `index.html` (`catch` của `save`, ~:2461; `renderSaveAlert`).
- [ ] **Step 1: Test đỏ:** `S7.1` gán tạm `stampEdits = () => { throw new TypeError("x") }`, gọi `save()`: `console.error` được gọi (spy) và chữ cảnh báo (`renderSaveAlert`/phần tử cảnh báo) KHÔNG chứa "bộ nhớ". `S7.2` (xanh trước và sau): stub `Storage.prototype.setItem` ném `DOMException("q", "QuotaExceededError")` → cảnh báo bật và chứa "bộ nhớ". Khôi phục mọi stub, `saveFailed = false`, `renderSaveAlert()` trong `finally`.
- [ ] **Step 2–4:** đỏ, commit; sửa: `console.error("save:", e)`, ghi `saveErrQuota = e && e.name === "QuotaExceededError"`; `renderSaveAlert` chỉ nói "bộ nhớ có thể đã đầy" khi quota, ngược lại "Có lỗi khi lưu, hãy tải bản sao lưu". Xanh, commit.

### Task 5: A8 service worker
**Files:** Create `tests/sw/test_sw.js`, Modify `sw.js` (`networkFirst`, ~:33).
- [ ] **Step 1: Test đỏ (Node, `vm`):** nạp `sw.js` với `self.addEventListener` ghi lại handler, `caches.match` trả `{cached:true}`, `fetch` trả `{ok:false,status:500,clone(){return this}}`. Gọi handler `fetch` với request `mode:"navigate"` cùng origin → `respondWith` phải resolve ra `{cached:true}`. `SW8.2`: fetch trả `ok:true` → trả phản hồi mạng. `SW8.3`: không có cache + 500 → trả phản hồi 500 như cũ. In `OK n/n`, thoát mã khác 0 nếu đỏ.
- [ ] **Step 2–4:** đỏ, commit; sửa trong nhánh `fetch(req).then(res => ...)`: nếu `!res.ok` thì `caches.match("./").then(hit => finish(hit || res))`, ngược lại hành vi cũ. Xanh (`node tests/sw/test_sw.js`, `node --check sw.js`), commit.

### Task 6: kiểm tra đầy đủ và tài liệu
- [ ] Chạy E2ESYNC (xanh), E2ELIM 12/12, E2EIMP 5/5, 14 bộ cũ (số cơ sở 832/832), `tests/merge-tests.html` 30/30, `python3 tests/api/test_ai_plan.py`, `node tests/sw/test_sw.js`, `node --check` khối script chính và `sw.js`. Cập nhật `tests/e2e/README.md` (bảng) và `CLAUDE.md` (lệnh `node tests/sw/test_sw.js`); commit.
