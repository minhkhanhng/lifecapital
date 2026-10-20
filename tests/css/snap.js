// Chụp kiểu hiển thị đã tính của mọi phần tử (và ::before/::after) trên mọi màn hình, gửi về máy chủ ghi tệp.
// Dùng để chứng minh dọn CSS không đổi giao diện: chụp trước và sau, so từng phần tử.
(() => {
  const P = ["display", "position", "box-sizing", "margin-top", "margin-right", "margin-bottom", "margin-left", "padding-top", "padding-right", "padding-bottom", "padding-left",
    "border-top-width", "border-right-width", "border-bottom-width", "border-left-width", "border-top-style", "border-right-style", "border-bottom-style", "border-left-style",
    "border-top-color", "border-right-color", "border-bottom-color", "border-left-color", "border-top-left-radius", "border-top-right-radius", "border-bottom-left-radius", "border-bottom-right-radius",
    "background-color", "background-image", "box-shadow", "color", "font-size", "font-weight", "font-family", "font-style", "line-height", "letter-spacing", "text-transform", "text-align", "text-decoration-line",
    "opacity", "visibility", "gap", "row-gap", "column-gap", "grid-template-columns", "flex-direction", "flex-wrap", "flex-grow", "flex-shrink", "flex-basis", "justify-content", "align-items", "align-self",
    "backdrop-filter", "filter", "outline-style", "outline-width", "outline-color", "outline-offset", "overflow-x", "overflow-y", "white-space", "text-overflow", "z-index", "cursor", "content-visibility",
    "min-width", "max-width", "min-height", "max-height", "aspect-ratio", "vertical-align", "list-style-type", "object-fit", "pointer-events", "user-select", "appearance", "accent-color", "caret-color",
    "inset", "transform", "writing-mode", "container-type", "isolation", "mix-blend-mode", "clip-path", "font-variant-numeric", "-webkit-line-clamp", "word-break", "overflow-wrap", "text-wrap", "touch-action", "scroll-snap-type"];
  const PSEUDO = ["content", "display", "position", "width", "height", "background-color", "background-image", "border-top-width", "border-top-color", "border-right-width", "border-bottom-width", "border-left-width", "border-left-color", "border-top-left-radius", "box-shadow", "color", "margin-right", "transform", "opacity", "font-size", "flex-shrink", "vertical-align", "inset"];
  let h = 0;
  const hash = s => { let x = 2166136261; for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); } return (x >>> 0).toString(36); };
  const sig = el => {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    let s = P.map(p => cs.getPropertyValue(p)).join("|") + "|" + Math.round(r.width) + "x" + Math.round(r.height);
    for (const ps of ["::before", "::after", "::placeholder"]) { const c = getComputedStyle(el, ps); if (c.content && c.content !== "none" || ps === "::placeholder") s += "|" + ps + ":" + PSEUDO.map(p => c.getPropertyValue(p)).join(","); }
    return s;
  };
  const path = (el, root) => { const a = []; for (let e = el; e && e !== root; e = e.parentElement) { const i = e.parentElement ? [...e.parentElement.children].indexOf(e) : 0; a.push(e.tagName.toLowerCase() + (typeof e.className === "string" && e.className.trim() ? "." + e.className.trim().split(/\s+/).slice(0, 3).join(".") : "") + ":" + i); } return a.reverse().join(">"); };
  window.__snapView = (root) => {
    const out = {};
    for (const el of root.querySelectorAll("*")) {
      if (el.closest("svg") && el.tagName !== "svg") continue;
      const cs = getComputedStyle(el);
      if (cs.display === "none") continue;
      out[path(el, document.body)] = hash(sig(el));
    }
    return out;
  };
  window.__snapDetail = (root) => { const out = {}; for (const el of root.querySelectorAll("*")) { if (getComputedStyle(el).display === "none") continue; out[path(el, document.body)] = sig(el); } return out; };
  const W8 = ms => new Promise(r => setTimeout(r, ms));
  // Các màn hình: [tên, mở, đóng, gốc chụp]
  window.__views = () => [
    ["ca-focus", () => { calSubView = "focus"; inboxPanel = true; switchTab("ca"); }],
    ["ca-focus-noinbox", () => { calSubView = "focus"; inboxPanel = false; switchTab("ca"); }],
    ["ca-timeline", () => { calSubView = "timeline"; inboxPanel = true; switchTab("ca"); }],
    ["ca-year", () => { calSubView = "year"; S.pm = "4"; switchTab("ca"); }],
    ["hv", () => { calSubView = "focus"; hvMore = ""; switchTab("hv"); }],
    ["hv-tray", () => { const t = S.tasks.find(x => !taskDone(x) && x.subs.length); openTasks.add(t.id); hvMore = "task:" + t.id; switchTab("hv"); }],
    ["pj-list", () => { hvMore = ""; openTasks.clear(); pjOpenId = null; switchTab("pj"); }],
    ["pj-ov", () => { switchTab("pj"); pjOpen(S.projects[0].id); pjSetView("ov"); }],
    ["pj-li", () => { pjSetView("li"); }],
    ["pj-bo", () => { pjSetView("bo"); }],
    ["pj-tl", () => { pjSetView("tl"); }],
    ["hl-sum", () => { pjOpenId = null; switchTab("hl"); hlGo("sum"); }],
    ["hl-browse", () => { hlGo("browse"); }],
    ["hl-log", () => { hlGo("log"); }],
    ["hl-sy", () => { hlGo("browse", "sy"); }],
    ["hl-bd", () => { hlGo("browse", "bd"); }],
    ["hl-ac", () => { hlGo("browse", "ac"); }],
    ["hl-md", () => { hlGo("browse", "md"); }],
    ["su", () => { hlGo("sum"); switchTab("su"); }],
    ["me", () => { switchTab("me"); }],
    ["me-edit", () => { capEdit = true; kwOpen = true; draw(); }],
    ["pop-set", () => { capEdit = false; kwOpen = false; switchTab("ca"); setOpen = new Set(["ui", "def", "sync", "data", "gc", "del"]); openSettingsModal(); }, () => { closeSettingsModal(); setOpen = null; }, "#settingsModalOverlay"],
    ["pop-rv", () => openWeeklyReviewModal(CW), closeReviewModal, "#reviewModalOverlay"],
    ["pop-ed-new", () => openEditor(tk), closeEditor, "#modalOverlay"],
    ["pop-ed-edit", () => openEditor(Object.keys(S.ev).sort().pop(), 0), closeEditor, "#modalOverlay"],
    ["pop-sch", () => openSched("task", S.tasks.find(t => t.subs.length && !taskDone(t)).id, tk), closeSched, ".modal-overlay.open"],
    ["pop-hb", () => hbOpen(S.habits[0].id), closeHb, ".modal-overlay.open"],
    ["pop-hl", () => hlOpen(tk), closeHl, "#hlOverlay"],
    ["pop-ci", () => hlCheckin(), closeHl, "#hlOverlay"],
    ["pop-med", () => hlMedOpen(), closeHl, "#hlOverlay"],
    ["pop-rep", () => hlReport(), closeHl, "#hlOverlay"],
    ["pop-pj", () => openProject(S.projects[0].id), closeProject, "#pjOverlay"],
    ["pop-pjit", () => { switchTab("pj"); pjOpen(S.projects[0].id); pjSetView("li"); pjOpenItem("task", S.tasks.find(x => x.pj === S.projects[0].id).id); }, () => { pjCloseItem(); pjOpenId = null; switchTab("ca"); }, "#pjItOverlay"],
    ["pop-ask", () => showShortcuts(), () => askDone(null), ".modal-overlay.open"],
    ["toast", () => { document.querySelectorAll(".toast").forEach(t => t.remove()); showToast("Đã lưu thử", "ok", { label: "Hoàn tác", fn: () => {} }); showToast("Không lưu được", "bad"); }, () => document.querySelectorAll(".toast").forEach(t => t.remove()), ".toast-container"]
  ];
  // Chụp mọi màn hình ở trạng thái hiện tại (khổ màn, chủ đề), gửi tệp <name>.json
  // Dữ liệu cố định cho mọi lần chụp: giữ bản S ngay sau loadDemo, trước mỗi lượt đặt lại S và các bản tự lưu
  window.__snapPrep = () => { loadDemo(); window.__S0 = JSON.stringify(S); };
  const reset = () => {
    S = cleanState(JSON.parse(__S0)); Object.values(S.ev).forEach(sortL);
    snapKeys().forEach(k => localStorage.removeItem(k)); save(); snapshotDaily();
    hvMore = ""; openTasks.clear(); pjOpenId = null; capEdit = false; kwOpen = false; hlAll = false; draw();
    document.querySelectorAll(".toast").forEach(t => t.remove());
  };
  window.__runStates = async (prefix, states) => {
    const out = {};
    for (const [th, lite] of states) {
      if (th === "sys") delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = th;
      document.documentElement.classList.toggle("lite", !!lite);
      const name = prefix + "-" + th + (lite ? "-lite" : "");
      const r = await __snapAll(name);
      out[name] = Object.values(r).filter(v => typeof v !== "number");
    }
    delete document.documentElement.dataset.theme; document.documentElement.classList.remove("lite");
    return out;
  };
  window.__snapAll = async (name, detail) => {
    reset();
    const st = document.createElement("style"); st.textContent = "*,*::before,*::after{transition:none!important;animation:none!important;caret-color:auto!important}"; document.head.appendChild(st);
    const res = {};
    for (const [k, open, close, rootSel] of __views()) {
      CH = new Set(); dirty = false; clearTimeout(chgT); // bỏ tô nền "số vừa đổi" (phụ thuộc thời điểm)
      try { open(); } catch (e) { res[k] = { err: String(e) }; continue; }
      CH = new Set(); document.querySelectorAll(".chg").forEach(e => e.classList.remove("chg"));
      await W8(30);
      const root = rootSel ? document.querySelector(rootSel) : document.body;
      res[k] = root ? (detail ? __snapDetail(root) : __snapView(root)) : { err: "no root " + rootSel };
      if (close) { try { close(); } catch (e) {} await W8(20); }
    }
    st.remove();
    await fetch("http://127.0.0.1:8799/save?name=" + name, { method: "POST", body: JSON.stringify(res) });
    return Object.fromEntries(Object.entries(res).map(([k, v]) => [k, v.err || Object.keys(v).length]));
  };
  // Dữ liệu cố định: xóa sạch, nạp mẫu
  window.__snapSetup = () => { localStorage.clear(); localStorage.setItem("lc_onb", "1"); };
})();
