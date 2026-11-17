// Gói UI (ui-suc-khoe): popup Thêm thuốc/TPCN, nút tâm trạng dọc, nhãn ô ngày Nhật ký, nút đóng.
// Chạy sau loadDemo(); đo hình học nên cần cửa sổ ổn định (1440 hoặc 390). Khôi phục S, storage, DOM khi xong.
window.E2EUI = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  if (!Object.values(S.ev || {}).some(L => (L || []).some(e => e && e.demo))) return { pass: 0, total: 1, fail: [{ id: "U0", pass: false, info: "Chạy loadDemo() trước" }] };
  const sl = ms => new Promise(r => setTimeout(r, ms));
  const lsBefore = JSON.stringify(Object.assign({}, localStorage)), sBefore = JSON.stringify(S);
  const R = e => e.getBoundingClientRect(), q = (s, r = document) => [...r.querySelectorAll(s)];
  const wide = innerWidth > 500;
  // Pane ẩn không chạy hoạt ảnh: popup kẹt ở scale(.95) làm số đo lệch 5%; tắt chuyển động khi đo
  const nt = document.createElement("style"); nt.textContent = ".modal-sheet, .modal-overlay { transition: none !important; animation: none !important; }"; document.head.appendChild(nt);
  try {
    closeHl(); await sl(300);
    hlMedOpen(); await sl(800);
    const body = $("hlBody"), sheet = body.querySelector(".hl-sheet");
    const rows = [...sheet.children].filter(e => !e.classList.contains("hl-acts") && !e.classList.contains("hl-disc") && !e.classList.contains("hl-hint") && R(e).height > 0);
    const gaps = rows.slice(1).map((e, i) => Math.round(R(e).top - R(rows[i]).bottom));
    ok("U1 các hàng cách nhau ≥ 12px", gaps.every(g => g >= 12), gaps);
    const ctl = q("input, select, .set-seg", body).filter(e => R(e).height > 0).map(e => Math.round(R(e).height));
    ok("U2 mọi ô và nút chọn cao đều 40px", ctl.length >= 6 && ctl.every(h => Math.abs(h - 40) <= 1), ctl);
    const lab = q(".form-label", body).map(e => Math.round(R(e).height));
    ok("U3 nhãn một dòng, không bị cắt", lab.every(h => h <= 20) && q(".form-label", body).every(e => e.scrollWidth <= e.clientWidth + 1), lab);
    const top = id => Math.round(R($(id)).top);
    ok("U4a ô Bắt đầu và Kết thúc cùng hàng (≥501px)", !wide || top("hlMedSd") === top("hlMedEd"), [top("hlMedSd"), top("hlMedEd")]);
    const segs = q(".set-seg", body);
    ok("U4b nút Lịch dùng và Số lần cùng hàng (≥501px)", !wide || Math.abs(R(segs[1]).top - R($("hlMedT")).top) <= 1, [R(segs[1]).top, R($("hlMedT")).top]);
    ok("U5 nút trong seg cao ≥ 32px", q(".set-seg button", body).every(b => R(b).height >= 32), q(".set-seg button", body).map(b => R(b).height));
    const acts = body.querySelector(".hl-acts"), al = (getComputedStyle(acts).backgroundColor.match(/[\d.]+/g) || []).map(Number);
    ok("U6 nền chân popup đặc", al.length === 3 || al[3] >= 0.99, getComputedStyle(acts).backgroundColor);
    body.scrollTop = body.scrollHeight; await sl(100);
    const root = document.documentElement, th0 = root.getAttribute("data-theme"); root.setAttribute("data-theme", "dark");
    const dk = (getComputedStyle(acts).backgroundColor.match(/[\d.]+/g) || []).map(Number); if (th0 == null) root.removeAttribute("data-theme"); else root.setAttribute("data-theme", th0);
    ok("U6b chân popup tối: nền đặc và tối", dk.length >= 3 && (dk.length === 3 || dk[3] >= 0.99) && (dk[0] + dk[1] + dk[2]) / 3 < 100, dk);
    const gap7 = R(acts).top - R(body.querySelector(".hl-disc")).bottom;
    ok("U7 ghi chú pháp lý cách chân ≥ 8px", gap7 >= 8, gap7);
    const sh = $("hlOverlay").querySelector(".modal-sheet");
    ok("U8 không tràn ngang", document.documentElement.scrollWidth <= innerWidth && R(sh).right <= innerWidth + 1 && R(sh).left >= -1, [document.documentElement.scrollWidth, innerWidth]);
    const x = $("hlOverlay").querySelector(".sheet-x");
    ok("U10 nút ✕ ≥ 36px", R(x).width >= 36 && R(x).height >= 36, [R(x).width, R(x).height]);
    ok("U9z nút Loại hiện TPCN/Thuốc", [...segs[0].querySelectorAll("button")].map(b => b.textContent.trim()).join("|") === "TPCN|Thuốc", segs[0].textContent);
    // U12 lưu thuốc còn chạy
    const n0 = S.health.meds.length;
    $("hlMedN").value = "Thử UI"; hlEd.d.n = "Thử UI"; hlMedSave(); await sl(300);
    ok("U12 Thêm thuốc vẫn lưu", S.health.meds.length === n0 + 1 && S.health.meds.some(m => m.n === "Thử UI"), S.health.meds.length);
    closeHl(); await sl(400);
    // U9 tâm trạng dọc: thẻ Hôm nay
    switchTab("hl"); await sl(400); [...q("#v .segmented-control button")].find(b => b.textContent.trim() === "Tóm tắt").click(); await sl(400);
    const vert = btns => { const r = btns.map(R); return r.length === 5 && r.every((b, i) => i === 0 || b.top > r[i - 1].top + 4) && r.every(b => Math.abs(b.width - r[0].width) <= 1); };
    const todayM = q(".hl-today .hl-m.m1, .hl-today .hl-m.m2, .hl-today .hl-m.m3, .hl-today .hl-m.m4, .hl-today .hl-m.m5");
    // U9.1 / U9.4 (ui-suc-khoe-2): thẻ Hôm nay ≥600px: 5 nút một hàng; dưới 600px: vẫn xếp dọc, không tràn
    if (innerWidth >= 600) {
      const tops = todayM.map(b => R(b).top), hs = todayM.map(b => Math.round(R(b).height));
      ok("U9.1 Hôm nay (≥600px): 5 nút tâm trạng cùng một hàng, cao 32–52px", todayM.length === 5 && tops.every(t => Math.abs(t - tops[0]) <= 2) && hs.every(h => h >= 32 && h <= 52), { tops: tops.map(Math.round), hs, w: innerWidth });
    } else {
      ok("U9.4 Hôm nay (<600px): 5 nút tâm trạng xếp dọc, cùng bề rộng, không tràn ngang", vert(todayM) && document.documentElement.scrollWidth <= innerWidth, { n: todayM.length, sw: document.documentElement.scrollWidth, w: innerWidth });
    }
    // U9.2 không có nhật ký: hai thẻ Điểm nổi bật / Điều ảnh hưởng gộp thành một thẻ cao ≤ 70px
    const savedDays = S.health.days;
    S.health.days = {}; draw(true); await sl(500);
    const slim = q(".hl-slim");
    ok("U9.2 không có nhật ký: hai thẻ trống gộp một thẻ cao ≤ 70px", slim.length === 1 && R(slim[0]).height <= 70, { n: slim.length, h: slim.map(e => Math.round(R(e).height)) });
    S.health.days = savedDays; draw(true); await sl(500);
    // U9.3 Đã ghim: 6 ô chia đều theo cột (3 cột ≥900px, 2 cột dưới 900px)
    const pins = q(".hl-pin"), prow = [];
    pins.forEach(b => { const t = R(b).top, g = prow.find(x => Math.abs(x.t - t) <= 2); if (g) g.n++; else prow.push({ t, n: 1 }); });
    const want = innerWidth >= 900 ? 3 : 2;
    ok("U9.3 Đã ghim: 6 ô chia đều, không ô lẻ hàng (3+3 ≥900px, 2+2+2 dưới 900px)", pins.length === 6 && prow.every(x => x.n === want), { n: pins.length, rows: prow.map(x => x.n) });
    hlCheckin(); await sl(800);
    const ciM = q(".hl-ci-big .hl-m");
    ok("U9b check-in: 5 nút dọc, cùng bề rộng", vert(ciM), ciM.map(b => [Math.round(R(b).top), Math.round(R(b).width)]));
    closeHl(); await sl(400);
    // U11 nhãn ô ngày Nhật ký
    [...q("#v .segmented-control button")].find(b => b.textContent.trim() === "Nhật ký").click(); await sl(400);
    const lb = $("hlPick") && $("hlPick").labels && [...$("hlPick").labels].map(l => l.textContent.trim()).join("|");
    ok("U11 ô ngày Nhật ký có nhãn Xem ngày hiện ra", /Xem ngày/.test(lb || "") && R($("hlPick").labels[0]).height > 0, lb);
  } catch (e) { ok("U-ERR", false, String(e && e.stack || e)); }
  finally {
    try { closeHl(); } catch (e) {}
    nt.remove();
    S = JSON.parse(sBefore); lastRaw = localStorage.getItem("lc2"); saveFailed = false;
    Object.keys(localStorage).forEach(k => { if (!(k in JSON.parse(lsBefore))) localStorage.removeItem(k); });
    Object.entries(JSON.parse(lsBefore)).forEach(([k, v]) => { if (localStorage.getItem(k) !== v) localStorage.setItem(k, v); });
    draw(true);
  }
  return { pass: out.filter(o => o.pass).length, total: out.length, fail: out.filter(o => !o.pass) };
};
