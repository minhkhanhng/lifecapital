// v0.7.0: Tổng quan dạng dashboard (ô số, thanh so với mục tiêu, cột chồng 8 tuần và 7 ngày, thói quen, sức khỏe) và màu thanh tiêu đề. Chạy sau loadDemo().
window.E2EDASH = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const crCode = await (await fetch("/tests/e2e/contrast.js?" + Date.now())).text();
  const stCode = await (await fetch("/tests/e2e/strokes.js?" + Date.now())).text();
  const noAnim = document.createElement("style"); noAnim.textContent = "*{transition:none!important;animation:none!important}"; document.head.appendChild(noAnim);
  const keepCaps = JSON.stringify(S.caps), keepEv = JSON.stringify(S.ev), keepN = N;
  const v = () => $("v"), q = s => v().querySelector(s), qa = s => [...v().querySelectorAll(s)];
  const kpi = lb => qa(".dk").find(x => x.querySelector(".dk-l").textContent.startsWith(lb));
  sel = CW; N = 1; switchTab("su"); await sleep(20);

  // ===== K: 4 ô số
  ok("K1.1 bốn ô số đầu dashboard", qa(".dash > .dk").length === 4 && [...q(".dash").children].slice(0, 4).every(x => x.classList.contains("dk")));
  ok("K1.2 Giờ đã ghi = al(tuần)", kpi("Giờ đã ghi").querySelector(".dk-v").textContent.replace(/\s/g, "") === r1(al(sel)) + "h", kpi("Giờ đã ghi").textContent);
  const prev = sel > 0 ? al(sel - 1) : 0, dl = al(sel) - prev;
  ok("K1.3 so với tuần trước có dấu +/− đúng", !prev || kpi("Giờ đã ghi").querySelector(".dk-s").textContent === `${dl >= 0 ? "+" : "−"}${r1(Math.abs(dl))}h so với tuần trước`, kpi("Giờ đã ghi").querySelector(".dk-s").textContent);
  const bal = balanceOf(sel);
  ok("K1.4 Điểm cân bằng = balanceOf(), có vòng", kpi("Điểm cân bằng").querySelector(".dk-v").textContent.replace(/\s/g, "") === (bal.score == null ? "–" : bal.score + "%") && (bal.score == null || kpi("Điểm cân bằng").querySelector("svg")));
  const T = S.caps.filter(c => c.tg > 0), okN = T.filter(c => wk(sel, c.k) >= c.tg).length;
  ok("K1.5 Đạt mục tiêu = số vốn đạt / số vốn có mục tiêu, mỗi vốn một chấm", kpi("Đạt mục tiêu").querySelector(".dk-v").textContent.replace(/\s/g, "") === `${okN}/${T.length}` && kpi("Đạt mục tiêu").querySelectorAll(".dk-dots i").length === T.length && kpi("Đạt mục tiêu").querySelectorAll(".dk-dots i.on").length === okN);
  const worst = T.filter(c => wk(sel, c.k) < c.tg).sort((a, b) => (b.tg - wk(sel, b.k)) - (a.tg - wk(sel, a.k)))[0];
  ok("K1.6 Cần bù nhất = vốn thiếu nhiều giờ nhất, ghi số giờ thiếu", !worst || (kpi("Cần bù nhất").querySelector(".dk-v").textContent === worst.n && kpi("Cần bù nhất").textContent.includes("Thiếu " + r1(worst.tg - wk(sel, worst.k)) + "h")), kpi("Cần bù nhất") && kpi("Cần bù nhất").textContent);
  ok("K1.7 nút Sao chép nằm trên thanh chọn tuần", qa(".wk-bar button").some(b => b.textContent === "Sao chép"));

  // ===== B: Giờ so với mục tiêu
  const rows = qa(".dbl-r");
  ok("B1.1 mỗi loại vốn một dòng, đúng thứ tự", rows.length === S.caps.length && rows.every((r, i) => r.querySelector(".dbl-n").textContent.trim() === S.caps[i].n));
  const sc = Math.max(1, Math.min(1.5, ...T.map(c => wk(sel, c.k) / c.tg)));
  const r0 = rows[S.caps.findIndex(c => c.tg > 0)], c0 = S.caps.find(c => c.tg > 0), p0 = wk(sel, c0.k) / c0.tg;
  ok("B1.2 độ dài thanh = % mục tiêu trên cùng một thang, vạch 100% đúng chỗ", Math.abs(parseFloat(r0.querySelector(".dbl-f").style.width) - Math.min(p0, sc) / sc * 100) < 0.01 && Math.abs(parseFloat(r0.querySelector(".dbl-m").style.left) - 100 / sc) < 0.01);
  ok("B1.3 trạng thái bằng chữ (Đạt / Thiếu Xh), không chỉ bằng màu", rows.every(r => /✓ Đạt|Thiếu \d|Chưa đặt mục tiêu/.test(r.querySelector(".dbl-st").textContent)));
  N = 4; draw(); await sleep(10);
  ok("B1.4 Trung bình 4 tuần: thanh dùng giờ trung bình, tiêu đề ghi rõ", /Trung bình 4 tuần gần nhất/.test(v().textContent) && kpi("Đạt mục tiêu").textContent.includes("TB 4 tuần"));
  N = 1; draw(); await sleep(10);

  // ===== C: cột chồng
  const charts = qa(".dch");
  ok("C1.1 có 2 biểu đồ cột: 8 tuần và 7 ngày", charts.length === 2 && charts[0].querySelectorAll(".dch-col").length === Math.min(8, sel + 1) && charts[1].querySelectorAll(".dch-col").length === 7);
  const cols8 = [...charts[0].querySelectorAll(".dch-col")], last = cols8[cols8.length - 1];
  ok("C1.2 cột tuần đang xem được nhấn, các tuần khác mờ", last.classList.contains("on") && charts[0].classList.contains("dim") && !charts[1].classList.contains("dim"));
  ok("C1.3 mỗi đoạn một vốn có giờ, tỉ lệ đúng giờ", last.querySelectorAll(".dch-stack i").length === S.caps.filter(c => wk(sel, c.k) > 0).length && [...last.querySelectorAll(".dch-stack i")].every((x, i) => +x.style.flexGrow === wk(sel, S.caps.filter(c => wk(sel, c.k) > 0)[i].k)));
  const tg = S.caps.reduce((a, c) => a + (c.tg || 0), 0);
  ok("C1.4 vạch ngang = tổng mục tiêu, có nhãn", !tg || (charts[0].querySelector(".dch-ref > b").textContent === `Mục tiêu ${r1(tg)}h`));
  ok("C1.5 chú thích tên từng vốn có giờ (không chỉ dựa vào màu)", charts[0].querySelectorAll(".dch-lg span").length === S.caps.filter(c => cols8.some((_, j) => wk(sel - cols8.length + 1 + j, c.k) > 0)).length);
  const d0 = ky(W[sel]), dsum = (S.ev[d0] || []).reduce((a, e) => a + e.h, 0);
  ok("C1.6 cột Thứ 2 = tổng giờ hoạt động ngày đó (chú thích nổi)", charts[1].querySelector(".dch-col").dataset.tip.startsWith(`${DN_VI[0]} ${W[sel].getDate()}/${W[sel].getMonth() + 1}: ${r1(dsum)}h`), charts[1].querySelector(".dch-col").dataset.tip);
  ok("C1.7 cột hôm nay được nhấn ở biểu đồ ngày", sel !== CW || charts[1].querySelectorAll(".dch-col")[dow(new Date())].classList.contains("on"));

  // ===== T: chú thích nổi
  last.dispatchEvent(new PointerEvent("pointerover", { bubbles: true })); await sleep(10);
  const tip = document.querySelector(".dtip");
  ok("T1.1 rê chuột: hiện chú thích đúng nội dung", tip && tip.style.display === "block" && tip.textContent === last.dataset.tip);
  q(".wk-bar").dispatchEvent(new PointerEvent("pointerover", { bubbles: true })); await sleep(10);
  ok("T1.2 rời biểu đồ: ẩn chú thích", tip.style.display === "none");
  const fr = q(".dbl-r"); fr.focus(); fr.dispatchEvent(new FocusEvent("focusin", { bubbles: true })); await sleep(10); // khung xem thử không giữ tiêu điểm hệ điều hành nên tự phát sự kiện
  ok("T1.3 Tab tới (bàn phím): hiện chú thích", tip.style.display === "block" && tip.textContent === fr.dataset.tip);
  fr.blur(); fr.dispatchEvent(new FocusEvent("focusout", { bubbles: true })); await sleep(10);
  ok("T1.3b rời tiêu điểm: ẩn chú thích", tip.style.display === "none");
  ok("T1.4 mọi phần có chú thích nổi đều nhận được tiêu điểm bàn phím", qa("[data-tip]").every(x => x.tabIndex === 0 && x.getAttribute("aria-label")));

  // ===== E: trường hợp biên
  const empty = W.findIndex((_, i) => !evs(i).length && i > 0);
  if (empty >= 0) {
    sel = empty; draw(); await sleep(10);
    ok("E1.1 tuần trống: báo chưa có hoạt động, vẫn đủ 4 ô số và thanh từng vốn", /chưa có hoạt động/.test(v().textContent) && qa(".dk").length === 4 && qa(".dbl-r").length === S.caps.length);
    sel = CW; draw(); await sleep(10);
  }
  S.caps.forEach(c => { c.tg = 0; }); draw(); await sleep(10);
  ok("E1.2 chưa đặt mục tiêu: ô số ghi rõ, không vạch mục tiêu, còn đúng 1 nút Đặt mục tiêu", kpi("Điểm cân bằng").textContent.includes("Chưa đặt mục tiêu") && !q(".dch-ref") && !q(".dbl-f") && qa("button").filter(b => b.textContent === "Đặt mục tiêu").length === 1);
  S.caps = JSON.parse(keepCaps);
  const big = ky(ad(W[CW], 2));
  S.ev[big] = [...(S.ev[big] || []), ...[...Array(8)].map(() => ({ t: "Dồn", c: "tc", m: "u", h: 24, s: "" }))];
  draw(); await sleep(10);
  ok("E1.3 tổng giờ vượt 168h: có cảnh báo", /vượt 168h/.test(v().textContent));
  S.ev = JSON.parse(keepEv);
  S.caps[0].n = "<img src=x onerror=window.__xss=1>"; draw(); await sleep(10);
  ok("E1.4 tên vốn được thoát HTML trong mọi biểu đồ", !window.__xss && !q(".dash img"));
  S.caps = JSON.parse(keepCaps); draw(); await sleep(10);

  // ===== L: bố cục
  const cards = [...q(".dash").children].filter(x => !x.classList.contains("dk"));
  ok("L1.1 không tràn ngang", document.documentElement.scrollWidth <= innerWidth + 1, [document.documentElement.scrollWidth, innerWidth]);
  if (innerWidth > 1180) {
    const [b1, w1] = [qa(".dash > .d7")[0], qa(".dash > .d5")[0]];
    ok("L1.2 máy tính rộng: Giờ so với mục tiêu và Bánh xe cùng hàng, cao bằng nhau", Math.abs(b1.getBoundingClientRect().top - w1.getBoundingClientRect().top) < 1 && Math.abs(b1.offsetHeight - w1.offsetHeight) < 1);
  }
  ok("L1.3 bảng số liệu vẫn còn ở cuối (xem số chính xác)", cards[cards.length - 1].matches("details.fold") && /Bảng số liệu/.test(cards[cards.length - 1].textContent));

  // ===== A: tương phản, viền
  const cr = eval(crCode), st = eval(stCode);
  ok("A1.1 chữ đạt tương phản WCAG AA", !cr.length, cr.slice(0, 4));
  ok("A1.2 không có nét viền đen", !st.length, st.slice(0, 4));

  // ===== H: màu thanh tiêu đề
  const metas = [...document.querySelectorAll('meta[name="theme-color"]')];
  const m = await (await fetch("manifest.json?" + Date.now())).json();
  ok("H1.1 thanh tiêu đề: không còn màu hồng đậm, theo nền sáng / tối", metas.length === 2 && !metas.some(x => /E0A3BB/i.test(x.content)) && m.theme_color === "#fbf7f9", metas.map(x => x.media + "=" + x.content));
  const th0 = getThemePreference();
  setThemePreference("dark");
  ok("H1.2 chọn Tối trong Cài đặt: thanh tiêu đề tối dù máy đang để sáng", metas.every(x => x.content === "#151113"));
  setThemePreference("light");
  ok("H1.3 chọn Sáng: thanh tiêu đề sáng", metas.every(x => x.content === "#fbf7f9"));
  setThemePreference("auto");
  ok("H1.4 Tự động: theo hệ thống", metas.find(x => /light/.test(x.media)).content === "#fbf7f9" && metas.find(x => /dark/.test(x.media)).content === "#151113");
  setThemePreference(th0); closeSettingsModal && closeSettingsModal();

  // dọn
  N = keepN; sel = CW; noAnim.remove(); document.querySelectorAll(".toast").forEach(t => t.remove());
  switchTab("ca");
  const pass = out.filter(x => x.pass).length;
  return { pass, total: out.length, fail: out.filter(x => !x.pass) };
};
