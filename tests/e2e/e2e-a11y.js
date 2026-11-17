// Gói 8 (truy-cap-va-cam-ung): E1 bàn phím mở hoạt động trên lịch (A1), E3 nhãn truy cập/focus/lỗi JSON/tour (A3), E2 vùng bấm (A2, hướng C).
// Chạy sau loadDemo(); khôi phục DOM, localStorage, sessionStorage, S và biến toàn cục đã đổi. Chạy ở 1440 (A2 xác nhận KHÔNG đổi), 820 (chuột, hẹp), 375 (cảm ứng).
// KÍCH THƯỚC NHÌN THẤY TRƯỚC KHI SỬA (đo ngày 2026-11-17 trên nhánh gộp, getBoundingClientRect làm tròn 0,1; loadDemo, tab Lịch/Tuần; chiều rộng phụ thuộc cột nên chỉ so ở đúng ba khung):
//   khung  | .day-card-add-btn (rộng×cao) | .hl-day (rộng×cao) | .hv-toggle (rộng×cao)
//   1440   | 177 × 28                      | 193 × 24           | 24 × 24
//   820    | 172 × 28                      | 188 × 24           | 24 × 24
//   375    | 333 × 28                      | 349 × 24           | 24 × 24
// Nút "+" ĐƯỢC PHÉP đổi cao (28 → 36, hướng C) ở 820/375; .hl-day và .hv-toggle KHÔNG được đổi hình dạng nhìn thấy ở mọi khung. Ở 1440 không đổi gì.
window.E2EA11Y = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  // Chốt an toàn (rule.md §12): chỉ chạy khi trang đang là dữ liệu thử của loadDemo()
  if (!Object.values(S.ev || {}).some(L => (L || []).some(e => e && e.demo))) return { pass: 0, total: 1, fail: [{ id: "A0", pass: false, info: "Trang không phải dữ liệu thử: chạy loadDemo() trước" }] };
  if (typeof snapshotDaily === "function") snapshotDaily();
  const BASE = { 1440: { add: [177, 28], hl: [193, 24], hv: [24, 24] }, 820: { add: [172, 28], hl: [188, 24], hv: [24, 24] }, 375: { add: [333, 28], hl: [349, 24], hv: [24, 24] } };
  const lsAll = st => { const o = {}; for (let i = 0; i < st.length; i++) { const k = st.key(i); o[k] = st.getItem(k); } return o; };
  const putAll = (st, o) => { Object.keys(lsAll(st)).forEach(k => { if (!(k in o)) st.removeItem(k); }); Object.entries(o).forEach(([k, v]) => { if (st.getItem(k) !== v) st.setItem(k, v); }); };
  const lsBefore = lsAll(localStorage), ssBefore = lsAll(sessionStorage), sBefore = JSON.stringify(S);
  const curBefore = cur, subBefore = calSubView, dayBefore = timelineDayIdx, selBefore = sel;
  const origOpen = window.openEditor, origWarn = console.warn;
  const errs = [], onErr = e => errs.push(String(e.message || e));
  addEventListener("error", onErr);
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const kd = (el, key, extra) => { const ev = new KeyboardEvent("keydown", Object.assign({ key, bubbles: true, cancelable: true }, extra || {})); el.dispatchEvent(ev); return ev; };
  const edOpen = () => document.getElementById("modalOverlay").classList.contains("open");
  let calls = [];
  const spy = () => { window.openEditor = function () { calls.push([...arguments]); return origOpen.apply(this, arguments); }; };
  const closeEd = () => { if (edOpen()) closeEditor(); };
  const toastTexts = () => [...document.querySelectorAll("#toastContainer .toast")].map(t => t.textContent);
  const drawView = (sub, jump) => { switchTab("ca"); calSubView = sub; draw(jump); };
  try {
    // ================= A1: E1 bàn phím mở hoạt động =================
    spy();
    const kinds = [
      ["A1.w tuần (.event-item)", "focus", ".event-item"],
      ["A1.d ngày (.timeline-event-block)", "timeline", ".timeline-event-block"],
      ["A1.y năm (.cd-ev)", "year", ".cd-ev"]
    ];
    for (const [name, sub, sel0] of kinds) {
      drawView(sub, sub === "year");
      let el = document.querySelector(sel0);
      if (!el && sub === "timeline") { for (let j = 0; j < 7 && !el; j++) { timelineDayIdx = j; draw(); el = document.querySelector(sel0); } }
      if (!el) { ok(name + " có phần tử để thử", false, "không thấy " + sel0); continue; }
      ok(name + " tabindex=0, role=button, aria-label không rỗng", el.getAttribute("tabindex") === "0" && el.getAttribute("role") === "button" && (el.getAttribute("aria-label") || "").trim().length > 0, el.outerHTML.slice(0, 200));
      calls = []; el.click(); const ref = calls[0] || []; const clickN = calls.length; const clickOpen = edOpen(); closeEd();
      ok(name + " click chuột mở đúng một lần", clickN === 1 && clickOpen && ref.length === 2, [clickN, clickOpen, ref]);
      const evObj = ref[0] != null && S.ev[ref[0]] ? S.ev[ref[0]][ref[1]] : null;
      ok(name + " aria-label chứa tên hoạt động", !!evObj && (el.getAttribute("aria-label") || "").includes(evObj.t), [el.getAttribute("aria-label"), evObj && evObj.t]);
      calls = []; const e1 = kd(el, "Enter"); await wait(30);
      ok(name + " Enter mở đúng việc, đúng một lần", calls.length === 1 && edOpen() && JSON.stringify(calls[0]) === JSON.stringify(ref), [calls, edOpen(), ref]);
      closeEd(); await wait(150);
      calls = []; const e2 = kd(el, " "); await wait(30);
      ok(name + " Space mở đúng việc, một lần, preventDefault", calls.length === 1 && edOpen() && JSON.stringify(calls[0]) === JSON.stringify(ref) && e2.defaultPrevented, [calls, edOpen(), e2.defaultPrevented]);
      closeEd(); await wait(150);
      calls = []; const ea = kd(el, "a"), et = kd(el, "Tab"), ee = kd(el, "Escape"); await wait(30);
      ok(name + " phím a/Tab/Esc không mở và không bị chặn", calls.length === 0 && !edOpen() && !ea.defaultPrevented && !et.defaultPrevented && !ee.defaultPrevented, [calls, edOpen(), ea.defaultPrevented, et.defaultPrevented]);
      calls = []; kd(el, "Enter", { ctrlKey: true }); await wait(30);
      ok(name + " Ctrl+Enter không mở (giữ phím tắt toàn cục)", calls.length === 0 && !edOpen(), [calls.length, edOpen()]);
      closeEd();
    }
    // Lưới năm: ô ngày bọc ngoài vẫn mở theo ngày (Enter) đúng một lần, không lẫn với cd-ev
    drawView("year", true);
    const cell = document.querySelector("td.cal-day-cell");
    if (cell) { calls = []; kd(cell, "Enter"); await wait(30); ok("A1.y ô ngày (td) Enter vẫn mở đúng một lần", calls.length === 1 && edOpen(), [calls, edOpen()]); closeEd(); }
    else ok("A1.y ô ngày (td) có để thử", false, "không có td.cal-day-cell");
    window.openEditor = origOpen;

    // ================= A3: E3 nhãn, focus, lỗi JSON, tour =================
    switchTab("ca"); calSubView = "focus"; draw(true);
    const nlp = document.getElementById("nlpInput");
    ok("A3.1 ô ghi nhanh có aria-label=\"Ghi nhanh\"", !!nlp && nlp.getAttribute("aria-label") === "Ghi nhanh", nlp && nlp.outerHTML.slice(0, 160));

    switchTab("me");
    const inputs = [...document.querySelectorAll("#v input")];
    const miss = [];
    S.caps.forEach(c => {
      [["Màu ", "color"], ["Tên ", "text"], ["Từ khóa ", "text"]].forEach(([p, type]) => {
        const f = inputs.filter(i => i.getAttribute("aria-label") === p + c.n);
        if (f.length !== 1 || f[0].type !== type) miss.push(p + c.n + " => " + f.length);
      });
    });
    ok("A3.2 15 ô Loại vốn (màu/tên/từ khóa x " + S.caps.length + ") có aria-label đúng tên vốn", S.caps.length === 5 && miss.length === 0, miss);

    // A3.3 xóa hoạt động qua popup rồi focus về #addBtn
    switchTab("ca"); calSubView = "focus"; draw(true);
    const it = document.querySelector(".event-item");
    if (!it) ok("A3.3 có hoạt động để xóa thử", false, "không có .event-item");
    else {
      spy(); calls = []; it.focus(); it.click(); const [kk, ii] = calls[0] || []; window.openEditor = origOpen; await wait(150); // openEditor focus ô tên sau 100 ms
      const dayCopy = JSON.stringify(S.ev[kk]);
      const delBtn = document.querySelector("#modalOverlay .btn-del");
      if (!delBtn) ok("A3.3 popup Sửa có nút Xóa", false, "không thấy .btn-del");
      else {
        delBtn.focus(); delBtn.click(); await wait(150);
        const ae = document.activeElement;
        ok("A3.3 xóa xong: popup đóng, focus ở #addBtn (không phải body)", !edOpen() && ae === document.getElementById("addBtn"), [edOpen(), ae && (ae.id || ae.tagName)]);
        S.ev[kk] = JSON.parse(dayCopy); save(); draw(true);
        document.querySelectorAll("#toastContainer .toast").forEach(t => t.remove());
      }
    }

    // A3.4/A3.5 nhập tệp hỏng
    const warns = []; console.warn = function () { warns.push([...arguments]); };
    const feed = async txt => { const t0 = toastTexts().length; importData({ files: [new File([txt], "x.json", { type: "application/json" })], value: "" }); for (let i = 0; i < 40 && toastTexts().length === t0; i++) await wait(50); return toastTexts().slice(t0).join(" | "); };
    const w0 = warns.length;
    const t1 = await feed("{khong-phai-json");
    ok("A3.4 tệp không phải JSON: báo 'Tệp không phải JSON hợp lệ', không lộ position/Unexpected, có console.warn", /Tệp không phải JSON hợp lệ/.test(t1) && !/position|Unexpected|line \d|column/i.test(t1) && warns.length > w0, [t1, warns.length - w0]);
    const w1 = warns.length;
    const t2 = await feed('{"a":1}');
    ok("A3.5 JSON đúng nhưng sai định dạng: giữ thông điệp cũ", /Tệp sao lưu không hợp lệ: Tệp không đúng định dạng Life Capital/.test(t2), t2);
    console.warn = origWarn;
    document.querySelectorAll("#toastContainer .toast").forEach(t => t.remove());

    // A3.6 tour tự đóng khi đổi tab
    const onbSeen = localStorage.getItem("lc_onb"); localStorage.removeItem("lc_onb");
    switchTab("ca"); onbStart(); await wait(50);
    const onbEl = document.getElementById("onb");
    const shownBefore = !onbEl.hidden && onbIdx >= 0; // .onb-target có thể rỗng khi mục tiêu cố định (offsetParent null)
    switchTab("su"); await wait(50);
    ok("A3.6 tour mở rồi switchTab('su') đóng: ẩn #onb, onbIdx=-1, không còn .onb-target", shownBefore && onbEl.hidden === true && onbIdx === -1 && document.querySelectorAll(".onb-target").length === 0, [shownBefore, onbEl.hidden, onbIdx]);
    const seenAfterTab = localStorage.getItem("lc_onb");
    if (onbSeen === null) localStorage.removeItem("lc_onb"); else localStorage.setItem("lc_onb", onbSeen);
    ok("A3.8 đổi tab chỉ ẨN tour, KHÔNG ghi lc_onb (người mới vẫn thấy lại tour lần sau)", seenAfterTab === null, seenAfterTab);
    ok("A3.7 sau khi đóng tour không khóa cuộn/lớp phủ (body overflow, #onb không che)", getComputedStyle(document.body).overflow !== "hidden" && getComputedStyle(onbEl).display === "none", [getComputedStyle(document.body).overflow, getComputedStyle(onbEl).display]);

    // ================= A2: E2 vùng bấm tối thiểu 36 px (hướng C) =================
    const narrow = matchMedia("(pointer: coarse), (max-width: 899px)").matches, W0 = innerWidth, base = BASE[W0], y0 = scrollY;
    const rectOf = el => { const r = el.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height, cx: (r.left + r.right) / 2, cy: (r.top + r.bottom) / 2 }; };
    const shown = sel => [...document.querySelectorAll(sel)].find(e => e.getClientRects().length && e.getBoundingClientRect().width > 0);
    const four = el => { el.scrollIntoView({ block: "center", behavior: "instant" }); const b = rectOf(el); return [[b.cx - 17, b.cy - 17], [b.cx + 17, b.cy - 17], [b.cx - 17, b.cy + 17], [b.cx + 17, b.cy + 17]].map(([x, y]) => { const h = document.elementFromPoint(x, y); return h ? (el.contains(h) ? "self" : (h.id || h.className || h.tagName)) : "none"; }); };
    // Điểm nằm NGOÀI hình nhìn thấy của el, el vẫn nhận bấm (trên cùng) và bên dưới có một nút/vùng bấm khác = el đè lên vùng bấm khác
    const steals = el => {
      el.scrollIntoView({ block: "center", behavior: "instant" }); const b = rectOf(el), bad = [];
      const SEL = 'button, a[href], input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])';
      for (let x = b.cx - 18; x <= b.cx + 18; x += 3) for (let y = b.cy - 18; y <= b.cy + 18; y += 2) {
        if (x > b.l && x < b.r && y > b.t && y < b.b) continue;
        const st = document.elementsFromPoint(x, y);
        if (!st.length || !el.contains(st[0])) continue;
        const o = st.find(n => n !== el && !n.contains(el) && !el.contains(n) && n.matches(SEL));
        if (o) { bad.push([Math.round(x), Math.round(y), o.className || o.tagName]); if (bad.length > 3) return bad; }
      }
      return bad;
    };
    const near = (a, b, d) => Math.abs(a - b) <= (d || 1);
    drawView("focus", false);
    const add = shown(".day-card-add-btn"), hlw = shown(".hl-day"), A = add && rectOf(add), H = hlw && rectOf(hlw);
    switchTab("hv"); await wait(50);
    const hv = shown(".hv-toggle"), V = hv && rectOf(hv);
    drawView("focus", false);
    const noOverflow = () => document.documentElement.scrollWidth <= innerWidth && document.body.scrollWidth <= innerWidth;
    if (!add || !hlw || !hv) ok("A2.0 có đủ nút để đo (+, .hl-day, .hv-toggle)", false, [!!add, !!hlw, !!hv]);
    else {
      ok("A2.1 nút '+' thẻ ngày: " + (narrow ? "cao >= 36 (w=" + W0 + ")" : "cao như cũ 28 ở máy tính (w=" + W0 + ")"), narrow ? A.h >= 35.5 : (base ? near(A.h, base.add[1], 0.6) : A.h === 28), A.h);
      const f = (c, nm, ex) => { const p = four(c); return [p.every(x => x === "self"), p]; };
      // A2.2: vùng bấm vô hình 36x36 (chỉ khi cảm ứng/hẹp); A2.6: ở máy tính chuột KHÔNG mở rộng
      if (narrow) {
        [["+ thẻ ngày", ".day-card-add-btn"], [".hl-day", ".hl-day"]].forEach(([n, q]) => { const c = shown(q), [good, p] = f(c); ok("A2.2 " + n + ": 4 điểm cách tâm +-17 vẫn trúng chính nó (w=" + W0 + ")", good, p); });
        switchTab("hv"); await wait(50);
        { const c = shown(".hv-toggle"), [good, p] = f(c); ok("A2.2 .hv-toggle: 4 điểm cách tâm +-17 vẫn trúng chính nó (w=" + W0 + ")", good, p); }
        drawView("focus", false);
      } else {
        [["+ thẻ ngày", ".day-card-add-btn"], [".hl-day", ".hl-day"]].forEach(([n, q]) => { const c = shown(q), p = four(c); ok("A2.6 " + n + " ở máy tính chuột: điểm +-17 KHÔNG trúng nó (không mở rộng vùng bấm)", p.every(x => x !== "self"), p); });
        switchTab("hv"); await wait(50);
        { const c = shown(".hv-toggle"), p = four(c); ok("A2.6 .hv-toggle ở máy tính chuột: điểm +-17 KHÔNG trúng nó", p.every(x => x !== "self"), p); }
        drawView("focus", false);
      }
      // A2.3: hình nhìn thấy không đổi so với hằng ghi trước khi sửa
      if (base) {
        const nowA = rectOf(shown(".day-card-add-btn")), nowH = rectOf(shown(".hl-day"));
        switchTab("hv"); await wait(50); const nowV = rectOf(shown(".hv-toggle")); drawView("focus", false);
        ok("A2.3 .hl-day nhìn thấy không đổi " + base.hl.join("x") + " (w=" + W0 + ")", near(nowH.w, base.hl[0]) && near(nowH.h, base.hl[1]), [nowH.w, nowH.h]);
        ok("A2.3 .hv-toggle nhìn thấy không đổi " + base.hv.join("x") + " (w=" + W0 + ")", near(nowV.w, base.hv[0]) && near(nowV.h, base.hv[1]), [nowV.w, nowV.h]);
        ok("A2.3 '+' thẻ ngày: rộng như cũ (±1), cao " + (narrow ? "36 (được đổi, hướng C)" : "28 như cũ"), near(nowA.w, base.add[0], 1.5) && (narrow ? near(nowA.h, 36, 0.6) : near(nowA.h, base.add[1], 0.6)), [nowA.w, nowA.h]);
      } else ok("A2.3 bỏ qua (không phải khung 1440/820/375)", true);
      // A2.4: vùng bấm vô hình không đè lên nút/vùng bấm khác (chỉ có nghĩa khi đã mở rộng)
      if (narrow) {
        const sA = steals(shown(".day-card-add-btn")), sH = steals(shown(".hl-day"));
        switchTab("hv"); await wait(50); const sV = steals(shown(".hv-toggle")); drawView("focus", false);
        ok("A2.4 '+' thẻ ngày không đè vùng bấm khác", sA.length === 0, sA);
        ok("A2.4 .hl-day (tuần) không đè vùng bấm khác", sH.length === 0, sH);
        ok("A2.4 .hv-toggle không đè vùng bấm khác (nút tên, nút thao tác)", sV.length === 0, sV);
        drawView("timeline", false);
        const hlt = shown(".hl-day");
        if (hlt) { const p = four(hlt), s = steals(hlt); ok("A2.2/A2.4 .hl-day ở dòng thời gian Ngày: +-17 trúng chính nó và không đè vùng bấm khác", p.every(x => x === "self") && s.length === 0, [p, s]); }
        drawView("focus", false);
      }
      // A2.5: không tràn ngang
      ok("A2.5 tab Lịch (Tuần): không tràn ngang (w=" + W0 + ")", noOverflow(), [document.documentElement.scrollWidth, innerWidth]);
      switchTab("hv"); await wait(50);
      ok("A2.5 tab Hộp việc: không tràn ngang (w=" + W0 + ")", noOverflow(), [document.documentElement.scrollWidth, innerWidth]);
      drawView("focus", false);
    }
    window.scrollTo(0, y0);
  } catch (e) { ok("A.err", false, String(e && e.stack || e)); }
  finally {
    window.openEditor = origOpen; console.warn = origWarn;
    removeEventListener("error", onErr);
    closeEd();
    document.querySelectorAll("#toastContainer .toast").forEach(t => t.remove());
    putAll(localStorage, lsBefore); putAll(sessionStorage, ssBefore);
    S = JSON.parse(sBefore); lastRaw = localStorage.getItem("lc2"); saveFailed = false;
    cur = curBefore; calSubView = subBefore; timelineDayIdx = dayBefore; sel = selBefore; draw(true);
  }
  ok("A9.0 không có lỗi JS trong lúc chạy", errs.length === 0, errs);
  ok("A9.1 sau khi chạy: localStorage, sessionStorage, S như trước", JSON.stringify(S) === sBefore && JSON.stringify(lsAll(localStorage)) === JSON.stringify(lsBefore) && JSON.stringify(lsAll(sessionStorage)) === JSON.stringify(ssBefore), "khác");
  const pass = out.filter(x => x.pass).length;
  return { pass, total: out.length, fail: out.filter(x => !x.pass) };
};
