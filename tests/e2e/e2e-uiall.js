window.__capBox = window.__capBox || function () { const o = document.getElementById("__capT"); if (o) o.remove(); const d = document.createElement("div"); d.id = "__capT"; d.innerHTML = capSumHTML(CW); document.body.appendChild(d); setTimeout(() => d.remove(), 0); return d; }; // chỉ kiểm HTML do capSumHTML(CW) trả về (popup Tổng kết dùng chung)
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
    // Việc 3 (2026-11-18): ô Tiếp theo chuyển khỏi khối Hôm nay sang hàng Lúc này (#now3) ngay dưới khối
    const n3 = document.getElementById("now3");
    ok("B7 hàng Lúc này có ô Tiếp theo (việc kế tiếp, hoặc 'Hết việc hôm nay'), nằm ngoài khối Hôm nay", vis(n3) && /Tiếp theo/.test(n3.textContent) && !(hero && hero.contains(n3)), n3 && n3.textContent);
    sel = CW - 1 >= 0 ? CW - 1 : CW + 1; draw(true); await sl(40);
    ok("B8 tuần khác: không có khối Hôm nay", !document.querySelector("#v .today-hero"));
    sel = CW; draw(true); await sl(40);
    if (W >= 900) {
      const g = document.querySelector(".week-cards-grid"), cards = q(".day-card", g);
      const isInboxOpen = !document.querySelector(".cal-with-inbox")?.classList.contains("collapsed");
      if (isInboxOpen && cards.length === 7) {
        const row1Top = Math.round(R(cards[0]).top), row2Top = Math.round(R(cards[4]).top);
        const row1Same = [0, 1, 2, 3].every(i => Math.abs(Math.round(R(cards[i]).top) - row1Top) <= 2);
        const row2Same = [4, 5, 6].every(i => Math.abs(Math.round(R(cards[i]).top) - row2Top) <= 2);
        ok("B9 mở Hộp việc: tách thành 4 ngày ở trên và 3 ngày ở dưới", row1Same && row2Same && row2Top > row1Top, [row1Top, row2Top]);
      } else {
        const cols = getComputedStyle(g).gridTemplateColumns.split(" ").length, ww = document.querySelector(".wk-wrap").clientWidth;
        ok("B9 lưới tuần 7 cột một hàng khi rộng ≥ 760px", ww >= 760 ? cols === 7 : cols <= 4, [ww, cols]);
      }
    }
    // hàng điều hướng tuần một dòng
    const nav = document.querySelector(".wk-bar .wk-nav, .wk-bar > :first-child"), seg = document.querySelector(".wk-bar .segmented-control");
    ok("B10 điều hướng tuần và Tuần/Ngày/Năm cùng một hàng", nav && seg && Math.abs(R(nav).top + R(nav).height / 2 - (R(seg).top + R(seg).height / 2)) <= 6, nav && seg && [R(nav).top, R(seg).top]);
    const demo = document.querySelector(".demo-line");
    ok("B11 dải Dữ liệu mẫu một dòng (≤ 32px)", !demo || R(demo).height <= 32, demo && R(demo).height);
    if (touch) {
      const cs = __capBox().querySelector(".cap-sum");
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
    // ---- H1: lề phải tiêu đề = lề phải nội dung và cùng giãn hết bề ngang cột ở mọi tab (chỉ màn >= 900 chuột); H2: Lịch không còn Giờ theo loại vốn ----
    if (W >= 900 && !touch) {
      const rr = e => Math.round(R(e).right); let inset = null, colW = null; // Lịch (không cap) cho độ thụt chuẩn của nút so với nội dung (tiêu đề có padding-inline 4px)
      for (const [t, sub, name] of [["ca", "focus", "Lịch"], ["hv", 0, "Hộp việc"], ["pj", 0, "Dự án (danh sách)"], ["hb", 0, "Thói quen"], ["me", 0, "Tôi"], ["hl", 0, "Sức khỏe"], ["su", 0, "Tổng quan"]]) {
        await go(t, sub || undefined);
        const hd = document.querySelector(".app-header"), v = document.querySelector("#v"), kids = [...v.children].filter(vis), qc = document.querySelector(".quick-capture-box");
        const vr = Math.max(...kids.map(rr)), ha = document.querySelector(".header-actions"), ct = document.querySelector(".app-container");
        if (t === "ca") { inset = vr - rr(ha); colW = R(ct).width; } // Lịch không bị cap: bề ngang cột chuẩn
        ok(`H1.${t} ${name}: lề phải tiêu đề = lề phải nội dung (±2px), nút cùng độ thụt như Lịch`, Math.abs(rr(hd) - vr) <= 2 && Math.abs((vr - rr(ha)) - inset) <= 2 && (!qc || !vis(qc) || (hd.contains(qc) ? rr(qc) <= R(ha).left && R(qc).left >= R(document.querySelector('.page-head')).right : Math.abs(rr(qc) - vr) <= 2)), [rr(hd), rr(ha), vr, qc && rr(qc)]); // Hướng B: ô ghi nhanh nằm trong header, giữa tiêu đề và nút (không còn hàng riêng)
        // PO chọn Hướng C (2026-11-18): mọi tab giãn hết bề ngang cột như Lịch, không còn cap 980px
        ok(`H1.${t} ${name}: tiêu đề giãn hết bề ngang cột (không cap 980px)`, R(hd).width >= colW - 2, [R(hd).width, colW]);
        ok(`H1.${t} ${name}: nội dung giãn hết bề ngang cột (lề phải nội dung = lề phải cột ±2px)`, Math.abs(R(ct).width - colW) <= 2 && Math.abs(vr - rr(ct)) <= 2, [vr, rr(ct), R(ct).width, colW]);
      }
    }
    {
      for (const sv of ["focus", "timeline"]) { sel = CW; await go("ca", sv); ok(`H2.${sv} tab Lịch (${sv}) không có Giờ theo loại vốn`, !document.querySelector("#v .cap-sum")); }
      ok("H2.3 capSumHTML(CW) vẫn trả khối .cap-sum (popup Tổng kết còn dùng)", !!__capBox().querySelector(".cap-sum .cap-s"));
    }

    // ---- V1: Lịch chiều dọc (PO chọn Hướng B, 2026-11-18): ghi nhanh vào hàng tiêu đề, Hôm nay thành thanh mảnh, thẻ hoạt động gọn ----
    // Hằng ĐO TRƯỚC khi sửa (1440x900, demo, cột Hộp việc mở): đỉnh lưới tuần y=416 (gồm dải Dữ liệu mẫu 28px), .today-hero cao 137, ô ghi nhanh cao 52 (riêng một hàng),
    // header cao 83, thẻ hoạt động cao 64 (tên tối đa 3 dòng, cột rộng ~106px), khoảng cách giữa hai thẻ 6px.
    const V_OLD = { gridTop: 416, hero: 137, qc: 52, hdr: 83, ev: 64 };
    sel = CW; await go("ca", "focus");
    if (W >= 900 && !touch) {
      // V1.1 ô ghi nhanh nằm trong hàng tiêu đề, cùng hàng với tiêu đề (Lịch, Hộp việc, Dự án)
      for (const [t, name] of [["ca", "Lịch"], ["hv", "Hộp việc"], ["pj", "Dự án"]]) {
        await go(t, t === "ca" ? "focus" : undefined);
        const hd = document.querySelector(".app-header"), inp = $("nlpInput"), tt = $("pageTitle"), box = document.querySelector(".quick-capture-box");
        const rh = R(hd), ri = R(inp), rt = R(tt);
        ok(`V1.1 ${name}: ô ghi nhanh nằm trong rect .app-header, cùng hàng với tiêu đề (lệch ≤ 12px)`, vis(inp) && ri.top >= rh.top - 1 && ri.bottom <= rh.bottom + 1 && ri.left >= rh.left && ri.right <= rh.right && Math.abs((ri.top + ri.height / 2) - (rt.top + rt.height / 2)) <= 12 && ri.left >= rt.right - 1, [rh, ri, rt]);
        ok(`V1.1b ${name}: header một hàng (cao ≤ ${V_OLD.hdr - 12}px, trước ${V_OLD.hdr}) và ô ghi nhanh không còn chiếm hàng riêng`, R(hd).height <= V_OLD.hdr - 12 && hd.contains(box), [R(hd).height, hd.contains(box)]);
      }
      sel = CW; await go("ca", "focus");
      // V1.2 đỉnh lưới tuần. Ngưỡng 360px (trước 416, có dải Dữ liệu mẫu khi test; loại trừ banner thông báo tạm thời nếu chạy sau 19h)
      const notif = document.querySelector("#v .review-prompt-banner:not([hidden])");
      const notifH = notif ? R(notif).height + parseFloat(getComputedStyle(notif).marginBottom || 0) : 0;
      const g = document.querySelector(".week-cards-grid"), top = R(g).top + scrollY, netTop = top - notifH;
      ok(`V1.2 đỉnh lưới tuần ≤ 360px (trước ${V_OLD.gridTop})`, netTop <= 360, netTop);
      ok("V1.2b lưới chiếm ≥ 60% chiều cao màn nằm dưới đỉnh lưới (lưới + cột Hộp việc)", (innerHeight - netTop) / innerHeight >= 0.6, [innerHeight, netTop]);
      // V1.3 khối Hôm nay thành thanh mảnh
      // Việc 3: ô Tiếp theo không còn trong khối Hôm nay; hero giữ lời chào + 3 vòng; hàng Lúc này nằm ngay dưới hero
      const hr = document.querySelector("#v .today-hero"), st = hr ? q(".th-stat", hr) : [], gr = hr && hr.querySelector(".th-greet"), n3r = document.getElementById("now3");
      ok(`V1.3 .today-hero cao ≤ 64px (trước ${V_OLD.hero}), vẫn có lời chào và 3 vòng cùng một hàng; không còn ô Tiếp theo trong hero (chuyển sang hàng Lúc này)`, hr && R(hr).height <= 64 && !!gr && st.length === 3 && !hr.querySelector(".th-next, .th-nx") && !/Tiếp theo/.test(hr.textContent) && [...st, gr].every(e => Math.abs((R(e).top + R(e).height / 2) - (R(hr).top + R(hr).height / 2)) <= 16), hr && [R(hr).height, st.length, /Tiếp theo/.test(hr.textContent)]);
      ok("V1.3c hàng Lúc này nằm ngay dưới khối Hôm nay (khoảng ≤ 16px)", !!n3r && R(n3r).top - R(hr).bottom <= 16 && R(n3r).top >= R(hr).bottom - 1, n3r && [R(hr).bottom, R(n3r).top]);
      const hit = st.map(b => { const r = R(b), el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!el && b.contains(el) && r.height >= 28; });
      ok("V1.3b 3 vòng bấm được (đúng phần tử ở tâm, aria-label giữ nguyên)", hit.length === 3 && hit.every(Boolean) && st.every(b => b.getAttribute("aria-label")), hit);
      // V1.4 thẻ hoạt động gọn
      const evs = q(".week-cards-grid .event-item").filter(vis), ttl = evs.map(e => e.querySelector(".event-title"));
      const oneLine = ttl.every(t => t.scrollHeight <= t.clientHeight + 1 && t.getClientRects().length > 0 && Math.round(R(t).height) <= 20);
      ok("V1.4a tên hoạt động đúng 1 dòng (ellipsis) ở mọi thẻ", evs.length >= 8 && oneLine, ttl.map(t => [t.scrollHeight, t.clientHeight]).slice(0, 12));
      ok(`V1.4b chiều cao thẻ ≤ 64px (thoáng, 2026-11-18; cũ ${V_OLD.ev})`, evs.every(e => R(e).height <= 64.5), evs.map(e => Math.round(R(e).height)));
      ok("V1.4f đệm thẻ ≥ 10px trên/dưới × 12px trái/phải (thoáng)", evs.every(e => { const cs = getComputedStyle(e); return parseFloat(cs.paddingTop) >= 10 && parseFloat(cs.paddingLeft) >= 12; }), evs.map(e => getComputedStyle(e).padding));
      const gaps = []; q(".week-cards-grid .day-events-list").forEach(l => { const c = q(".event-item", l); for (let i = 1; i < c.length; i++) gaps.push(Math.round(R(c[i]).top - R(c[i - 1]).bottom)); });
      ok("V1.4c khoảng cách giữa hai thẻ liên tiếp trong cột ≥ 12px (thoáng; cũ 6px)", gaps.length >= 1 && gaps.every(x => x >= 12), gaps);
      const cards = q(".week-cards-grid .day-card"), tdC = cards.find(c => c.classList.contains("today")), oth = cards.find(c => !c.classList.contains("today") && !c.classList.contains("past"));
      ok("V1.4d cột hôm nay nổi hơn: bóng/viền dày hơn cột khác", tdC && oth && (getComputedStyle(tdC).boxShadow.length > getComputedStyle(oth).boxShadow.length), tdC && oth && [getComputedStyle(tdC).boxShadow, getComputedStyle(oth).boxShadow]);
      ok("V1.4e lưới không cuộn lồng (document cuộn, .week-cards-grid và .wk-wrap không overflow auto/scroll)", ["overflowY", "overflowX"].every(p => !/auto|scroll/.test(getComputedStyle(document.querySelector(".week-cards-grid"))[p]) && !/auto|scroll/.test(getComputedStyle(document.querySelector(".wk-wrap"))[p])));
      // V1.5 ô ghi nhanh vẫn hoạt động: xem trước, không đẩy lưới xuống, Enter thêm đúng hoạt động
      const inp = $("nlpInput"), hd2 = document.querySelector(".app-header"), tom = ky(ad(new Date(), 1));
      const topBefore = R(document.querySelector(".week-cards-grid")).top, hBefore = R(hd2).height, n0 = (S.ev[tom] || []).length;
      inp.value = "Mai 18h cầu lông 2 tiếng"; handleNLPInput(inp.value); await sl(40);
      const pv = $("nlpPreview");
      ok("V1.5a xem trước hiện đúng (cầu lông, 18:00–20:00, 2h) và không đẩy lưới/header", vis(pv) && /cầu lông/.test(pv.textContent) && /18:00/.test(pv.textContent) && /20:00/.test(pv.textContent) && Math.abs(R(document.querySelector(".week-cards-grid")).top - topBefore) <= 1 && Math.abs(R(hd2).height - hBefore) <= 1, [pv.textContent.trim(), R(document.querySelector(".week-cards-grid")).top, topBefore, R(hd2).height, hBefore]);
      ok("V1.5b xem trước nằm trong khung nhìn ngang và dưới ô nhập (không cắt)", vis(pv) && R(pv).left >= 0 && R(pv).right <= innerWidth && R(pv).top >= R(inp).bottom - 2, [R(pv), R(inp)]);
      inp.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true })); await sl(150);
      // dữ liệu mẫu có bữa tối cùng giờ: hành vi cũ là hiện hộp "Trùng giờ" rồi "Vẫn thêm"; giữ nguyên hành vi đó
      const askBox = $("askOverlay").classList.contains("open") ? $("askTitle").textContent : "";
      if (askBox) { $("askActs").querySelector('[data-a="ok"]').click(); await sl(150); }
      ok("V1.5d nếu trùng giờ thì hộp 'Trùng giờ' hiện đúng (hành vi cũ)", askBox === "" || askBox === "Trùng giờ", askBox);
      const added = (S.ev[tom] || []).filter(e => /cầu lông/i.test(e.t) && e.s === "18:00" && e.h === 2);
      ok("V1.5c Enter thêm đúng hoạt động ngày mai 18:00, 2h và xóa ô nhập", added.length >= 1 && (S.ev[tom] || []).length === n0 + 1 && inp.value === "", [(S.ev[tom] || []).map(e => e.t + e.s + e.h), inp.value]);
    }
    if (touch && W < 500) {
      await go("ca", "focus");
      const qc = document.querySelector(".quick-capture-box"), r = R(qc), cs = getComputedStyle(qc);
      ok("V1.6 điện thoại: ô ghi nhanh vẫn là thanh cố định dưới, không tràn ngang", cs.position === "fixed" && r.left >= 0 && r.right <= W && r.top > innerHeight * 0.55 && document.documentElement.scrollWidth <= W + 1, [cs.position, r, document.documentElement.scrollWidth]);
    }

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
