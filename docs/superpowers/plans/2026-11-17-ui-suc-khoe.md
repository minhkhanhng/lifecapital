# Gói UI · ui-suc-khoe Implementation Plan

> Sub-skill: superpowers:executing-plans (Sonnet implement; reviewer Haiku hoặc Opus, khác implementer). Không dùng fable.

**Goal:** Sửa giao diện popup "Thêm thuốc hoặc TPCN" (6 lỗi Important I1–I6) và các Minor đã duyệt (M5 nút tâm trạng, M6 nhãn ô ngày Nhật ký, M7 nút ✕). Báo cáo rà soát: `docs/review/2026-11-17-ui-suc-khoe-ra-soat.md`.

**PO đã chọn (2026-11-17):** popup Hướng B (gọn hai cột: Tên; Loại|Liều; Lịch dùng|Số lần; Bắt đầu|Kết thúc; gợi ý "để trống nếu dùng lâu dài" xuống dòng dưới hai ô ngày; nút Loại rút thành "TPCN"/"Thuốc"; ≤500px về một cột). Nút tâm trạng: xếp dọc (check-in và thẻ Hôm nay). Ô ngày Nhật ký có nhãn "Xem ngày"; nút ✕ trong `#hlOverlay` ≥ 36px.

**Phạm vi:** chỉ `index.html` (`hlMedRender`, `hlTodayCard`, `hlCiRender`, `hlLogHTML`, CSS `.hl-*`) và `tests/e2e/e2e-ui.js`. Không đổi dữ liệu, `APPV`, `VERSION`, CHANGELOG. Thang chữ 11/12/13/14/16/18/22/28; vùng bấm ≥ 24px (36px cảm ứng).

## Thiết kế
- Lớp `hl-form` trên `.hl-sheet` của popup: `gap: 14px`; mọi `input`, `select`, `.set-seg` cao 40px (`box-sizing: border-box`); nút trong `.set-seg` cao đủ lấp (≥ 32px).
- Nhãn `.form-label` một dòng; gợi ý là `<p class="hl-hint">` (12px, `--mu`).
- `.hl-acts` trong sheet: nền đặc (`--sheet-solid` đặt alpha 1 qua `--sheet-opaque`), `.hl-disc` cách chân ≥ 8px.
- Tâm trạng dọc: lớp `hl-vert` (`flex-direction: column`, nút cùng bề rộng, `min-height` 44px ở check-in, 36px ở thẻ).
- ✕: `#hlOverlay .sheet-x { min-width: 36px; min-height: 36px }`.

## Task 1: test đỏ (`tests/e2e/e2e-ui.js`, hàm `E2EUI`)
Chốt: chỉ chạy khi có dữ liệu demo. Ca: U1 khoảng cách dọc giữa các hàng ≥ 12px; U2 mọi ô và seg cao đều (±1); U3 nhãn một dòng; U4 ô Bắt đầu/Kết thúc cùng `top` và Lịch/Số lần cùng `top` (khi ≥ 501px); U5 nút seg ≥ 32px; U6 nền chân popup đặc; U7 ghi chú pháp lý cách chân ≥ 8px; U8 không tràn ngang; U9 nút tâm trạng xếp dọc cùng bề rộng (check-in và Hôm nay); U10 ✕ ≥ 36px; U11 có nhãn "Xem ngày" cho `#hlPick`; U12 lưu thuốc vẫn chạy (hlMedSave), hiện đúng sau khi Thêm. Chạy ở 1440 và 390. Khôi phục `S`, storage, DOM khi xong.
Chạy: kỳ vọng đỏ trước sửa.

## Task 2: sửa theo thiết kế; chạy lại xanh.
## Task 3: chạy E2E, E2EUAT3, E2EHL, E2EHL2, E2EUX; chụp trước/sau ở 390 và 1440; cập nhật CURRENT/HANDOFF/ROADMAP; commit cục bộ.
