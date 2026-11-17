// Gói UI toàn bộ (hướng A "Hôm nay trước", PO chọn 2026-11-18). Đo hình học nên chạy ở 1440 (chuột), 820 (chuột, hẹp), 375 (cảm ứng).
// Chạy sau loadDemo(). Khôi phục S, storage, tab, giao diện khi xong.
window.E2EUIALL = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  if (!Object.values(S.ev || {}).some(L => (L || []).some(e => e && e.demo))) return { pass: 0, total: 1, fail: [{ id: "A0", pass: false, info: "Chạy loadDemo() trước" }] };
  const sl = ms => new Promise(r => setTimeout(r, ms));
  const lsBefore = JSON.stringify(Object.assign({}, localStorage)), sBefore = JSON.stringify(S), tab0 = cur, sub0 = calSubView, sel0 = sel;
  const R = e => e.getBoundingClientRect(), q = (s, r = document) => [...r.querySelectorAll(s)];
  const vis = e => { if (!e) return false; const r = R(e), cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none"; };
  const W = innerWidth, touch = matchMedia("(pointer: coarse)").matches || W < 500, desk = W >= 1200;
  const alpha = c => { const m = (c.match(/[\d.]+/g) || []).map(Number); return m.length >= 4 ? m[3] : 1; };
  const SC = [11, 12, 13, 14, 16, 18, 22, 28], WT = [400, 500, 600, 700];
  const nt = document.createElement("style"); nt.textContent = "*, *::before, *::after { transition: none !important; animation: none !important; }"; document.head.appendChild(nt);
  const go = async (t, sub) => { switchTab(t); if (sub) { calSubView = sub; if (sub === "timeline") openDayView(); } draw(true); await sl(60); };
  const textEls = root => q("*", root).filter(e => !e.closest("svg") && vis(e) && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
  try {
    const TABS6 = [["ca", "focus"], ["ca", "timeline"], ["ca", "year"], ["hv"], ["pj"], ["hl"], ["hb"], ["su"], ["me"]];
    // A1 không tràn ngang; A2 cỡ chữ trong thang 8 bậc; A3 độ đậm chỉ 400/500/600/700
    const over = [], badF = new Set(), badW = new Set();
    for (const [t, sub] of TABS6) {
      await go(t, sub);
      if (document.documentElement.scrollWidth > W + 1) over.push(t + (sub || "") + ":" + document.documentElement.scrollWidth);
      textEls(document.querySelector(".app-shell")).forEach(e => { const cs = getComputedStyle(e), f = parseFloat(cs.fontSize), w = +cs.fontWeight; if (!SC.includes(f)) badF.add(t + ":" + f + ":" + e.className); if (!WT.includes(w)) badW.add(t + ":" + w + ":" + e.className); });
    }
    ok("A1 không tràn ngang ở mọi tab", over.length === 0, over);
    ok("A2 cỡ chữ nằm trong thang 8 bậc (11/12/13/14/16/18/22/28)", badF.size === 0, [...badF].slice(0, 8));
    ok("A3 độ đậm chỉ 400/500/600/700", badW.size === 0, [...badW].slice(0, 8));

    // ---- Lịch: khối Hôm nay ----
    sel = CW; await go("ca", "focus");
    const hero = document.querySelector("#v .today-hero");
    ok("B1 tab Lịch (tuần này) có khối Hôm nay", vis(hero));
    ok("B2 khối Hôm nay có lời chào và ngày", !!hero && /^Chào buổi (sáng|chiều|tối)/.test(hero.querySelector(".th-greet")?.textContent.trim() || "") && hero.querySelector(".th-date")?.textContent.includes(dm(tk)), hero && hero.querySelector(".th-greet")?.textContent);
    const stats = hero ? q(".th-stat", hero) : [];
    ok("B3 ba chỉ số: giờ hôm nay, thói quen, tâm trạng", stats.length === 3 && /h/.test(stats[0].textContent) && /Thói quen/.test(stats[1].textContent) && /Tâm trạng/.test(stats[2].textContent), stats.map(s => s.textContent.trim().replace(/\s+/g, " ")));
    ok("B4 mỗi chỉ số có vòng tiến độ (svg, có vạch nền)", stats.length === 3 && stats.every(s => s.querySelectorAll(".th-ring circle").length >= 2), stats.map(s => s.querySelectorAll(".th-ring circle").length));
    const hbAll = hbList(), hbDone = hbAll.filter(h => hbStats(h).doneToday).length;
    ok("B5 số thói quen hôm nay = số đã xong / tổng", stats[1] && stats[1].textContent.includes(`${hbDone}/${hbAll.length}`), [stats[1] && stats[1].textContent, hbDone, hbAll.length]);
    ok("B6 giờ hôm nay khớp dayH(tk)", stats[0] && stats[0].textContent.includes(r1(dayH(tk)) + "h"), [stats[0] && stats[0].textContent, dayH(tk)]);
    ok("B7b khối Hôm nay không có nút tích thói quen (chỉ số x/y)", hero && !hero.querySelector(".hb-tick, .hb-dot, .hb-chip"));
    const nx = hero && hero.querySelector(".th-next");
    ok("B7 có ô Tiếp theo (việc kế tiếp hoặc nút thêm)", vis(nx) && (nx.querySelector("button, [role=button]")), nx && nx.textContent);
    sel = CW - 1 >= 0 ? CW - 1 : CW + 1; draw(true); await sl(40);
    ok("B8 tuần khác: không có khối Hôm nay", !document.querySelector("#v .today-hero"));
    sel = CW; draw(true); await sl(40);
    if (W >= 900) {
      const cols = getComputedStyle(document.querySelector(".week-cards-grid")).gridTemplateColumns.split(" ").length, ww = document.querySelector(".wk-wrap").clientWidth;
      ok("B9 lưới tuần 7 cột một hàng khi rộng ≥ 760px", ww >= 760 ? cols === 7 : cols <= 4, [ww, cols]);
    }
    // hàng điều hướng tuần một dòng
    const nav = document.querySelector(".wk-bar .wk-nav, .wk-bar > :first-child"), seg = document.querySelector(".wk-bar .segmented-control");
    ok("B10 điều hướng tuần và Tuần/Ngày/Năm cùng một hàng", nav && seg && Math.abs(R(nav).top + R(nav).height / 2 - (R(seg).top + R(seg).height / 2)) <= 6, nav && seg && [R(nav).top, R(seg).top]);
    const demo = document.querySelector(".demo-line");
    ok("B11 dải Dữ liệu mẫu một dòng (≤ 32px)", !demo || R(demo).height <= 32, demo && R(demo).height);
    if (touch) {
      const cs = document.querySelector(".cap-sum");
      ok("B12 điện thoại: Giờ theo loại vốn gọn (≤ 110px)", cs && R(cs).height <= 110, cs && R(cs).height);
      ok("B13 điện thoại: khối Hôm nay ở màn đầu (top ≤ 220)", hero && R(hero).top + scrollY <= 220, hero && R(hero).top + scrollY);
      const wb = q(".wk-bar button").filter(vis).map(b => [b.textContent.trim(), Math.round(R(b).width), Math.round(R(b).height)]).filter(([, w, h]) => w < 36 || h < 36);
      ok("B14 điện thoại: nút hàng tuần ≥ 36×36", wb.length === 0, wb);
    }

    // ---- Đầu trang: một nút chính ----
    const hdr = q(".header-actions .btn").filter(vis);
    const filled = hdr.filter(b => alpha(getComputedStyle(b).backgroundColor) > 0.5 && !/rgba?\(255, 255, 255/.test(getComputedStyle(b).backgroundColor));
    ok("C1 đầu trang tab Lịch chỉ một nút tô màu", filled.length <= 1, hdr.map(b => b.id + ":" + getComputedStyle(b).backgroundColor));

    // ---- Thanh bên (desktop): Tuần này ----
    const sw = $("sideWeek");
    if (W >= 900) {
      const b = balanceOf(CW);
      ok("D1 thanh bên có ô Tuần này với vòng cân bằng", vis(sw) && sw.querySelectorAll("svg circle").length >= 2, !!sw);
      ok("D2 ô Tuần này ghi đúng điểm cân bằng", sw && (b.score == null ? /Chưa đặt mục tiêu/.test(sw.textContent) : sw.textContent.includes(b.score + "%")), [sw && sw.textContent, b.score]);
      ok("D3 ô Tuần này ghi thói quen hôm nay", sw && sw.textContent.includes(`${hbDone}/${hbAll.length}`), sw && sw.textContent);
      ok("D4 nhãn tab thanh bên một dòng", q("nav.main-nav button").filter(vis).every(x => R(x).height <= 44), q("nav.main-nav button").map(x => R(x).height));
    } else ok("D1 điện thoại/hẹp: ô Tuần này ẩn", !vis(sw));

    // ---- Thói quen ----
    await go("hb");
    const prog = document.querySelector("#v .hbt-prog");
    ok("E1 tab Thói quen có thanh tiến độ hôm nay (progressbar)", vis(prog) && prog.getAttribute("role") === "progressbar" && +prog.getAttribute("aria-valuenow") === hbDone && +prog.getAttribute("aria-valuemax") === hbAll.length, prog && [prog.getAttribute("aria-valuenow"), prog.getAttribute("aria-valuemax")]);
    const rows = q("#v .hbt-card");
    ok("E2 thói quen dạng hàng (cao ≤ 84px, rộng gần hết khung danh sách)", rows.length >= 2 && rows.every(r => R(r).height <= 84) && R(rows[0]).width >= Math.min(560, R(document.querySelector("#v .hbt-list")).width - 40), rows.map(r => Math.round(R(r).height) + "x" + Math.round(R(r).width)));
    const tick = document.querySelector('#v .hbt-card button.hb-tick[aria-pressed="false"]');
    ok("E3 nút tích chưa tích không hiện dấu ✓", tick && alpha(getComputedStyle(tick).color) < 0.05, tick && getComputedStyle(tick).color);
    if (tick) { tick.click(); await sl(40); }
    const tick2 = document.querySelector('#v .hbt-card button.hb-tick[aria-pressed="true"]');
    ok("E4 đã tích thì hiện ✓ rõ (chữ đặc)", tick2 && alpha(getComputedStyle(tick2).color) > 0.9, tick2 && getComputedStyle(tick2).color);
    if (tick2) { tick2.click(); await sl(40); }
    const adds = [...q(".header-actions .btn"), ...q("#v button")].filter(vis).filter(b => /^Thêm( thói quen)?$/.test(b.textContent.trim()));
    ok("E5 chỉ một nút Thêm thói quen trên màn", adds.length === 1, adds.map(b => b.textContent.trim()));
    ok("E6 nút tích ≥ 36×36", q("#v .hb-tick").filter(vis).every(b => R(b).width >= 36 && R(b).height >= 36));

    // ---- Độ rộng nhất quán (desktop) ----
    if (desk) {
      const lefts = [];
      for (const [t, sel2] of [["hv", ".hv-list, .hv-wrap, #v > .card"], ["pj", ".pj-list, #v > *"], ["me", "#v > *"], ["hb", "#v > *"], ["hl", "#v > *"]]) {
        await go(t);
        const c = q(sel2).find(vis), ttl = $("pageTitle");
        lefts.push([t, Math.round(R(c).left), Math.round(R(ttl).left)]);
        const qc = document.querySelector(".quick-capture-box");
        if (vis(qc)) ok(`F2 ${t}: ô Ghi nhanh không rộng hơn nội dung`, R(qc).right <= R(c).right + 4 || R(c).width >= R(qc).width - 4, [R(qc).right, R(c).right]);
      }
      ok("F1 nội dung các tab canh trái cùng tiêu đề (lệch ≤ 8px)", lefts.every(([, a, b]) => Math.abs(a - b) <= 8), lefts);
    }

    // ---- Sức khỏe, Dự án ----
    await go("hl"); hlGo("sum"); await sl(40);
    if (desk) { const ms = q("#v .hl-m").filter(vis); ok("G1 desktop: nút tâm trạng không giãn quá 180px", ms.length === 5 && ms.every(m => R(m).width <= 180), ms.map(m => Math.round(R(m).width))); }
    await go("pj");
    if (touch) { const ch = q("#v .pill, #v .pj-capchip, #v .seg button, #v .segmented-control button").filter(vis).filter(b => b.tagName === "BUTTON" && R(b).height < 36).map(b => b.textContent.trim() + ":" + Math.round(R(b).height)); ok("G2 điện thoại: chip lọc Dự án ≥ 36px", ch.length === 0, ch); }

    // ---- Tổng quan: vòng điểm cân bằng có vạch nền ----
    await go("su");
    const ring = q("#v svg").find(s => s.closest("[class*=tile], [class*=dash], .card") && /cân bằng/i.test(s.closest("[class*=tile], .card, [class*=dash]").textContent) && s.querySelectorAll("circle, path").length >= 1);
    ok("H1 Tổng quan: vòng Điểm cân bằng có vạch nền", ring && ring.querySelectorAll("circle").length >= 2, ring && ring.outerHTML.slice(0, 160));

    // ---- Tối: khối Hôm nay đọc được ----
    const root = document.documentElement, th0 = root.getAttribute("data-theme"); root.setAttribute("data-theme", "dark");
    await go("ca", "focus");
    const h2 = document.querySelector("#v .today-hero");
    const lum = c => { const m = (c.match(/[\d.]+/g) || []).map(Number); return (m[0] * 0.2126 + m[1] * 0.7152 + m[2] * 0.0722) / 255; };
    ok("I1 tối: chữ khối Hôm nay sáng (độ sáng > 0.6)", h2 && lum(getComputedStyle(h2.querySelector(".th-greet")).color) > 0.6, h2 && getComputedStyle(h2.querySelector(".th-greet")).color);
    if (th0 == null) root.removeAttribute("data-theme"); else root.setAttribute("data-theme", th0);
  } catch (e) { ok("Z lỗi chạy", false, String(e && e.stack || e).slice(0, 400)); }
  finally {
    nt.remove();
    localStorage.clear(); Object.entries(JSON.parse(lsBefore)).forEach(([k, v]) => localStorage.setItem(k, v));
    Object.keys(S).forEach(k => delete S[k]); Object.assign(S, JSON.parse(sBefore));
    calSubView = sub0; sel = sel0; switchTab(tab0); draw(true);
  }
  return { pass: out.filter(x => x.pass).length, total: out.length, fail: out.filter(x => !x.pass) };
};
