# Test e2e trong trang

Chạy ngay trong `index.html` thật (không cần cài gì). Mỗi bộ đi theo các bước UAT như người test, rồi thêm các trường hợp biên.

## Cách chạy

1. Ở thư mục gốc repo: `python3 -m http.server 8765`, mở http://localhost:8765/ bằng Chrome (máy tính, cửa sổ rộng ≥ 1400px).
2. Mở Console, chạy (mỗi bộ trên một trang mới tải, dữ liệu sạch):

```js
localStorage.clear(); localStorage.setItem("lc_onb", "1"); location.reload();
```

rồi:

```js
await new Promise(r => { const s = document.createElement("script"); s.src = "/tests/e2e/runner.js"; s.onload = r; document.head.appendChild(s); });
loadDemo();
await __run("tests/e2e/e2e6.js", "E2E");   // trả về { r: [đạt, tổng], fail: [...], errs: [...] }
```

| Tệp | Hàm | Nội dung |
|---|---|---|
| e2e6.js | E2E | Dự án kiểu Asana (v0.6.0) |
| e2e61.js | E2E61 | Bỏ Nạp/Tiêu, bánh xe cân bằng |
| e2e-sched.js | E2ESCHED | Xếp thông minh |
| e2e-hb.js | E2EHB | Thói quen |
| e2e-uat2.js | E2EUAT2 | UAT phần H, I, J và trường hợp biên |
| e2e-hl.js | E2EHL | Sức khỏe phần 1 |
| e2e-hl2.js | E2EHL2 | Sức khỏe phần 2 |
| e2e-uat3.js | E2EUAT3 | UAT phần K, L, M (Cài đặt, Sức khỏe, tab Tôi) |
| e2e-ux.js | E2EUX | Rà soát giao diện các vòng 1–7 và hiệu năng v0.6.1 |
| e2e-ai.js | E2EAI | v0.6.4: Nhờ AI xếp (giả lập đăng nhập và máy chủ, không gọi AI thật), gồm các trường hợp không có AI |
| e2e-plan.js | E2EPLAN | v0.6.5: ưu tiên Eisenhower, Xếp tất cả, Nhờ AI rà soát bằng sao chép – dán |
| e2e-v063.js | E2E63 | v0.6.3: nhập Google Calendar (giả lập API), bật/tắt phần, Tổng quan gộp Tổng kết, biểu tượng tab |

Test gộp dữ liệu: mở http://localhost:8765/tests/merge-tests.html (tiêu đề trang ghi `PASS n/n`).

## Kiểm tra giao diện

Tải script vào trang rồi gọi:

- `audit2.js`: bố cục ở độ rộng hiện tại (tràn ngang, nút bị cắt, chồng nhau), kết quả ở `window.__audit`.
- `crdrive.js` → `await __crAll()`: tương phản chữ WCAG AA (4.5:1, chữ lớn 3:1) và viền ô nhập 3:1 trên mọi tab và popup.
- `stdrive.js` → `await __stAll()`: tìm nét viền đen/xám đậm.

Chạy ở cả chế độ Sáng, Tối, Bỏ kính mờ (`document.documentElement.classList.add("lite")`) và khổ điện thoại 375px.

## Lưu ý

- `runner.js` thay `drawSoon` bằng `draw` để test đọc được giao diện ngay sau mỗi thao tác.
- Một vài bước phụ thuộc thứ trong tuần của dữ liệu mẫu (vd H1.3 tính giờ theo buổi 9h thật của ngày mai).
- Khung trình duyệt bị ẩn thì `requestAnimationFrame` không chạy: đừng đo tốc độ khung hình bằng script khi khung ẩn.
