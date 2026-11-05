// Rà soát thiết kế: thang chữ, nút, khoảng cách khung, chữ bị cắt. Gọi await __ui() sau loadDemo().
window.__ui = async function () {
  const W8 = ms => new Promise(r => setTimeout(r, ms));
  const st = document.createElement("style"); st.textContent = "*{transition:none!important;animation:none!important}"; document.head.appendChild(st);
  const vis = el => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity > 0.05; };
  const nm = el => el.tagName.toLowerCase() + (typeof el.className === "string" && el.className.trim() ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "") + ' "' + (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 22) + '"';
  const R = { fonts: {}, small: [], lh: [], btn: {}, btnSmall: [], pad: {}, gaps: {}, cut: [], titles: {}, edges: [], overflow: [] };
  const touch = innerWidth < 900;
  function scan(ctx, root) {
    root = root || $("v");
    if (document.documentElement.scrollWidth > innerWidth + 1) R.overflow.push(ctx);
    // chữ: phần tử có chữ trực tiếp
    [...root.querySelectorAll("*")].filter(vis).forEach(el => {
      const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (!own || el.closest("svg")) return;
      const cs = getComputedStyle(el), fs = parseFloat(cs.fontSize), fw = +cs.fontWeight, lh = parseFloat(cs.lineHeight);
      const k = fs + "/" + fw; R.fonts[k] = (R.fonts[k] || 0) + 1;
      if (fs < 11) R.small.push(ctx + " " + fs + "px " + nm(el));
      const r = el.getBoundingClientRect();
      if (lh && r.height > lh * 1.8 && lh / fs < 1.3) R.lh.push(ctx + " lh " + (lh / fs).toFixed(2) + " " + nm(el));
      if (el.scrollWidth > el.clientWidth + 1 && /ellipsis/.test(cs.textOverflow)) R.cut.push(ctx + " " + nm(el));
    });
    // tiêu đề
    root.querySelectorAll(".card-title, h1, h2, h3, .page-title").forEach(h => { if (!vis(h)) return; const cs = getComputedStyle(h); const k = h.tagName + "." + (h.className || "") + " " + cs.fontSize + "/" + cs.fontWeight; R.titles[k] = (R.titles[k] || 0) + 1; });
    // nút
    [...root.querySelectorAll("button, .btn, select")].filter(vis).forEach(b => {
      if (b.closest(".yr-day, .cal-day-cell, nav.main-nav, .hb-dot, .dhb")) return;
      const r = b.getBoundingClientRect(), cs = getComputedStyle(b);
      const v = b.classList.contains("btn-sm") ? "btn-sm" : b.classList.contains("btn") ? "btn" : b.tagName === "SELECT" ? "select" : "other";
      const k = v + " h" + Math.round(r.height) + " fs" + parseFloat(cs.fontSize) + " r" + cs.borderTopLeftRadius;
      R.btn[k] = (R.btn[k] || 0) + 1;
      const min = touch ? 36 : 28;
      if ((r.height < min || r.width < min) && b.textContent.trim().length < 40) R.btnSmall.push(ctx + " " + Math.round(r.width) + "x" + Math.round(r.height) + " " + nm(b));
    });
    // khung: padding và khoảng cách dọc giữa các khung liền kề ở cấp trên cùng
    [...root.querySelectorAll(".card")].filter(vis).forEach(c => { const cs = getComputedStyle(c); const k = cs.paddingTop + " " + cs.paddingLeft; R.pad[k] = (R.pad[k] || 0) + 1; });
    const top = [...root.children].filter(vis);
    for (let i = 1; i < top.length; i++) {
      const a = top[i - 1].getBoundingClientRect(), b = top[i].getBoundingClientRect();
      if (b.top >= a.bottom - 1) { const g = Math.round(b.top - a.bottom); R.gaps[g] = (R.gaps[g] || []); R.gaps[g].push(ctx + ":" + (top[i].className || top[i].tagName).toString().slice(0, 24)); }
    }
    const lefts = [...new Set(top.map(x => Math.round(x.getBoundingClientRect().left)))];
    if (lefts.length > 1) R.edges.push(ctx + " lề trái " + lefts.join(","));
  }
  const views = [["ca", () => { calSubView = "focus"; }], ["ca-day", () => { calSubView = "timeline"; }], ["ca-year", () => { calSubView = "year"; }], ["hv"], ["pj"], ["pj-page", () => { pjOpenId = S.projects[0].id; }], ["hl"], ["su"], ["me"]];
  for (const [t, pre] of views) {
    pjOpenId = null; if (pre) pre();
    switchTab(t.split("-")[0]); if (t === "ca-day" || t === "ca-year" || t === "ca") draw(); if (t === "pj-page") draw();
    window.scrollTo(0, 0); await W8(80); scan(t);
  }
  pjOpenId = null; calSubView = "focus";
  switchTab("ca"); openSettingsModal(); await W8(80); scan("settings", document.querySelector("#settingsModalOverlay .modal-sheet")); closeSettingsModal();
  openEditor(tk); await W8(80); scan("editor", document.querySelector(".modal-overlay.open .modal-sheet")); closeEditor();
  st.remove();
  const top = o => Object.entries(o).sort((a, b) => b[1] - a[1]);
  return { w: innerWidth, fonts: top(R.fonts), titles: top(R.titles), btn: top(R.btn), pad: top(R.pad), gaps: Object.fromEntries(Object.entries(R.gaps).map(([k, v]) => [k, v.length + " · " + v.slice(0, 3).join(" | ")])), small: R.small.slice(0, 25), smallN: R.small.length, lh: R.lh.slice(0, 15), btnSmall: R.btnSmall.slice(0, 30), btnSmallN: R.btnSmall.length, cut: R.cut.slice(0, 25), cutN: R.cut.length, edges: R.edges, overflow: R.overflow };
};
