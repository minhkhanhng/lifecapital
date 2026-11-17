# Gói 1b · importdata-khong-cat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** Nhập JSON chế độ "Gộp" không còn cắt `secs`/`ms`/`ups` của dự án đã có ở 20/50/30.

**Architecture:** Bỏ `.slice(0, max)` ở vòng gộp dự án trong `importData` (`index.html:~5743-5749`): thay `max` bằng `SANE_MAX` (đã khai báo ở `:2389` gói 1). Một task: test đỏ rồi sửa. Không đổi giao diện, cấu trúc dữ liệu, `APPV`, `VERSION`, CHANGELOG. Không push.

**Spec:** `docs/review/2026-11-17-fable-goi1-task2.md` (Important ngoài phạm vi), `rule.md` §11.

## Global Constraints
- Không mất dữ liệu người dùng; không đụng `p.ups = [...].slice(0, 30)` (~:8469, hành vi UI) và `GX_SEEN.slice(-2000)`.
- Test chạy trong trang (≥ 1400px), khuôn như `tests/e2e/e2e-lim.js`; chỉ đọc dữ liệu thật qua bản sao, không `save()` lên dữ liệu thật.
- Dùng cổng lạ (8795), kiểm `document.title === "Life Capital"`; cổng 8765 là dự án khác.

## Review Focus
- Dự án đã có 20 secs + tệp có 5 secs mới → 25 secs, giữ nguyên thứ tự của cái đã có; `ups` vẫn sắp mới nhất trước.
- Mục trùng `id` không bị nhân đôi.
- Dự án chưa có (chỉ trong tệp) vẫn được thêm nguyên vẹn.

### Task 1: test đỏ rồi sửa

**Files:**
- Create: `tests/e2e/e2e-imp.js` (`window.E2EIMP`, khuôn `e2e-lim.js`), thêm dòng vào bảng `tests/e2e/README.md`
- Modify: `index.html:~5743-5749`

- [ ] **Step 1: Viết `E2EIMP`**: dựng `S.projects` có 1 dự án 20 secs, 50 ms, 30 ups (id riêng, `d` hợp lệ cho ms/ups); tạo tệp JSON `{app:"life-capital", data: cleanState(<dữ liệu có cùng dự án nhưng thêm 5 secs, 5 ms, 5 ups id mới + 1 sec trùng id>)}` bằng `new File([...])`, gán vào `<input id="setFile">` qua `DataTransfer`, gọi `importData(el)`, bấm nút "Gộp" của hộp `ask`, chờ vài trăm ms. Ca: `I1.1` secs = 25; `I1.2` ms = 55; `I1.3` ups = 35 và `ups[0].d >= ups[1].d`; `I1.4` id trùng không nhân đôi; `I1.5` dự án chỉ có trong tệp được thêm đủ phần. Khôi phục `S.projects` ban đầu sau test (không `save()`).
- [ ] **Step 2: Chạy, phải ĐỎ** (I1.1–I1.3 đỏ vì 20/50/30), commit test.
- [ ] **Step 3: Sửa**: trong vòng `[["secs", 20], ["ms", 50], ["ups", 30]]` đổi các số thành `SANE_MAX` (hoặc bỏ `.slice`).
- [ ] **Step 4: Chạy lại `E2EIMP` 5/5, rồi E2ELIM 12/12 và bộ E2E cũ liên quan (E2E, E2EUAT2, E2E63) cùng `tests/merge-tests.html` 30/30, `node --check` khối script chính. Commit.**
