# Gói 3 · xss-va-token Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** (B1) tên triệu chứng tự thêm không còn chạy được mã HTML/JS khi hiện trong lời khuyên và tóm tắt ngày. (B6) token Google Calendar chỉ nằm ở `sessionStorage`, hết khi đóng tab.

**Architecture:** Không đổi cấu trúc dữ liệu, giao diện, `APPV`, `VERSION`, CHANGELOG. Một tệp test mới `tests/e2e/e2e-xss.js` (`window.E2EXSS`), hai task độc lập: test đỏ rồi sửa. Không push, không deploy; commit chỉ khi PO yêu cầu.

**Spec:** `docs/review/2026-11-17-tong-hop.md` mục B1, B6; `rule.md` §11, §12, §14.

## Phạm vi B1 (đã rà `index.html`)
`hlSyName(k)` trả tên thô (tên tự thêm `h.syc[].n`, tối đa 40 ký tự, lọc từ nhập JSON/đồng bộ bởi `cleanState` chỉ bằng `trim`). Các chỗ ghép thẳng vào `innerHTML` không qua `esc()`:
- `hlAdvice()` (`:~9596, 9600, 9612, 9615, 9678`): trường `t`/`d`, in thô ở `hlAdviceHTML` (`:9757`) và `:10246`.
- `hlSummary(k)` (`:~9817`): in thô ở `:9806` và `:10244`.
Sửa: bọc `esc()` đúng tại điểm ghép chuỗi, KHÔNG đổi `hlSyName` (nhiều chỗ khác đã `esc` sẵn, đổi sẽ escape hai lần). Các chỗ đã `esc` (`:3577, 9741, 9769, 9833, 9863, 9868, 9903, 10200, 10201, 10362`) giữ nguyên.

## Phạm vi B6
`gcal_token`, `gcal_token_exp` chuyển sang `sessionStorage` (`getGCalToken`, `clearGCalToken`, callback `initGCalTokenClient`, `disconnectGoogleCalendar`, `wipeLocal`). `gcal_linked` (cờ, không bí mật) và `gcal_client_id` giữ ở `localStorage`. Di trú: lúc nạp, nếu còn `gcal_token` cũ trong `localStorage` thì chép sang `sessionStorage` (nếu chưa hết hạn) rồi xóa bản trong `localStorage`; không làm mất cờ `gcal_linked`. Đóng tab → mất token → app hiện "kết nối lại" (đúng hành vi hết hạn hiện có).

## Global Constraints
- Không mất dữ liệu người dùng; dữ liệu cũ vẫn đọc được; không đổi tên trường.
- Test chạy trong trang (≥ 1400px) khuôn `e2e-sync.js`/`e2e-imp.js`; chỉ dùng `loadDemo()` và dữ liệu giả; khôi phục `S`, `localStorage`, `sessionStorage` sau test; không chạm dữ liệu thật.
- Cổng lạ 8797; kiểm `document.title === "Life Capital"`; cổng 8765 thuộc dự án khác.
- Test cũ dùng `localStorage` cho token (`e2e-v063.js`, `e2e-sync.js` S4.1) phải đổi sang `sessionStorage` cùng lúc với sửa B6, không nới lỏng ý nghĩa.

## Review Focus
- Mọi chỗ in `hlSyName`/`x.n` vào chuỗi HTML đã qua `esc()` đúng một lần (không escape hai lần chữ có `&`).
- Không còn đọc/ghi `gcal_token`/`gcal_token_exp` ở `localStorage` ngoài đoạn di trú.
- Di trú không làm mất `gcal_linked`; `wipeLocal` xóa cả hai nơi.

### Task 1 (B1): test đỏ rồi sửa

**Files:** Create `tests/e2e/e2e-xss.js` + dòng trong bảng `tests/e2e/README.md`; Modify `index.html:~9596-9678, ~9817`.

- [ ] **Step 1: Viết `E2EXSS` ca X1.\***: gán `S.health.syc = [{id:"yxss", n:'<img src=x onerror="window.__xss=1">', mt:1}]`; ghi `S.health.days[tk].sy = {yxss: 3}` và 6 ngày trước đó cùng `{yxss:3}` (đủ điều kiện `freq>=3` và `sev>=2`); gọi `hlAdvice()` và dựng HTML qua `hlAdviceHTML(hlAdvice(), 0)` + `hlSummary(tk)`; gán vào một `<div>` tạm trong `document.body` (innerHTML). Ca: `X1.1` lời khuyên không tạo phần tử `img`; `X1.2` `hlSummary` không tạo `img`; `X1.3` `window.__xss` vẫn `undefined`; `X1.4` văn bản hiển thị vẫn chứa đúng chuỗi `<img src=x` (hiện thành chữ, không mất tên); `X1.5` tên có `&` ("Đau & mỏi") hiện đúng một lần escape (textContent chứa `Đau & mỏi`, không `&amp;`). Khôi phục `S.health`.
- [ ] **Step 2: Chạy, phải ĐỎ** (X1.1–X1.4 đỏ). Ghi số đỏ.
- [ ] **Step 3: Sửa** bọc `esc()` quanh `hlSyName(...)` ở các chỗ trên (kể cả `.toLowerCase()`: `esc(hlSyName(s)).toLowerCase()` hoặc `esc(hlSyName(s).toLowerCase())`).
- [ ] **Step 4: Chạy lại, X1.\* xanh; E2EUAT3, E2EHL, E2EHL2 không hỏng; `node --check` khối script chính.**

### Task 2 (B6): test đỏ rồi sửa

**Files:** Modify `tests/e2e/e2e-xss.js` (ca T6.\*), `tests/e2e/e2e-v063.js`, `tests/e2e/e2e-sync.js` (S4.1), `index.html:~3757-3785, ~3828, ~3861, ~7691`.

- [ ] **Step 1: Thêm ca T6.\***: `T6.1` sau khi giả lập callback thành công (hoặc gọi hàm lưu token) `sessionStorage.gcal_token` có và `localStorage.gcal_token` không có; `T6.2` `getGCalToken()` đọc từ `sessionStorage`; `T6.3` di trú: đặt `gcal_token`+`gcal_token_exp` còn hạn vào `localStorage`, gọi hàm di trú, kết quả token ở `sessionStorage`, `localStorage` hết token, `gcal_linked` còn; `T6.4` token cũ đã hết hạn thì bị xóa, không chép; `T6.5` `clearGCalToken` và `wipeLocal` xóa cả hai nơi; `T6.6` `disconnectGoogleCalendar` xóa token ở `sessionStorage`.
- [ ] **Step 2: Chạy, phải ĐỎ** (T6.1–T6.4, T6.6 đỏ).
- [ ] **Step 3: Sửa** thêm hàm `gcalMigrateToken()` (gọi ngay sau dòng suy ra `gcal_linked` `:3775`), đổi các chỗ trên sang `sessionStorage` (bọc `try/catch` như cũ). Đổi `e2e-v063.js`, `e2e-sync.js` S4.1 sang `sessionStorage` cho token/hạn.
- [ ] **Step 4: Chạy lại `E2EXSS`, E2ESYNC 14/14, E2E63 77/77, E2E 95/95, E2EUAT2 71/71, merge-tests 30/30, `node --check`.** Báo 14 bộ cũ đầy đủ nếu còn thời gian.
