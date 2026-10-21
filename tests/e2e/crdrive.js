// Đi qua mọi tab, chế độ xem và popup, gom các chỗ thiếu tương phản (dùng contrast.js)
window.__crAll = async function () {
  const code = await (await fetch("/tests/e2e/contrast.js?" + Date.now())).text();
  const cr = () => eval(code);
  const W8 = ms => new Promise(r => setTimeout(r, ms));
  const st = document.createElement("style"); st.textContent = "*{transition:none!important;animation:none!important}"; document.head.appendChild(st);
  const all = {};
  const add = (ctx, arr) => arr.forEach(x => { const key = x.k + "|" + x.cls + "|" + x.col + "|" + x.t.slice(0, 12); if (!all[key]) all[key] = { ctx, ...x }; });
  for (const [t, sv] of [["ca", "focus"], ["ca", "timeline"], ["ca", "year"], ["hv"], ["pj"], ["hl"], ["su"], ["me"]]) { if (sv) calSubView = sv; if (t === "pj") pjOpenId = S.projects[0] && S.projects[0].id; switchTab(t); window.scrollTo(0, 0); await W8(80); add(t + (sv ? "/" + sv : ""), cr()); }
  { const t0 = S.tasks.find(t => !taskDone(t) && t.subs.length); switchTab("hv"); openTasks.add(t0.id); hvMoreT("task:" + t0.id); await W8(60); add("hv/tray", cr()); hvMore = ""; openTasks.delete(t0.id); }
  for (const v of ["ov", "li", "bo", "tl"]) { switchTab("pj"); pjOpenId = S.projects[0].id; pjSetView(v); await W8(60); add("pj/" + v, cr()); }
  for (const v of [["browse"], ["log"], ["browse", "sy"], ["browse", "mh"], ["browse", "sl"], ["browse", "md"], ["browse", "ac"], ["browse", "bd"]]) { switchTab("hl"); hlGo(v[0], v[1]); await W8(60); add("hl/" + v.join("/"), cr()); }
  hlGo("sum"); switchTab("ca"); calSubView = "focus"; draw();
  showToast("Đã lưu thử", "ok", { label: "Hoàn tác", fn: () => {} }); await W8(60); add("toast", cr());
  for (const [o, c, l] of [[() => { setOpen = new Set(["ui", "mod", "def", "sync", "data", "gc", "del"]); openSettingsModal(); }, closeSettingsModal, "set"], [() => openWeeklyReviewModal(sel), () => switchTab("ca"), "rv"], [() => openEditor(tk), closeEditor, "ed+"], [() => openEditor(Object.keys(S.ev).sort().pop(), 0), closeEditor, "ed"], [() => openSched("task", S.tasks.find(t => t.subs.length).id, tk), closeSched, "sch"], [() => hbOpen(S.habits[0].id), closeHb, "hb"], [() => hlOpen(tk), closeHl, "hl"], [() => hlCheckin(), closeHl, "ci"], [() => hlMedOpen(), closeHl, "med"], [() => hlChkOpen(), closeHl, "chk"], [() => hlReport(), closeHl, "rep"], [() => openProject(S.projects[0].id), closeProject, "pj"], [() => { switchTab("pj"); pjOpenId = S.projects[0].id; pjSetView("li"); const t = S.tasks.find(x => x.pj === S.projects[0].id); pjOpenItem("task", t.id); }, () => { pjCloseItem(); switchTab("ca"); }, "pjItem"], [() => { const k = ky(ad(W[sel], 1)); gxWk = sel; gxRows = [{ id: "imp1", k, s: "19:00", h: 1.5, t: "Học tiếng Anh online", c: "kn", sure: true, dup: false, on: true }, { id: "imp2", k, s: "06:30", h: 1, t: "Chạy bộ", c: "sk", sure: true, dup: true, on: false }, { id: "imp3", k, s: "23:00", h: 1, t: "Tiệc khuya", c: "sk", sure: false, dup: false, on: true }]; $("gxBody").innerHTML = gxHTML(); gxSync(); $("gxOverlay").classList.add("open"); }, closeGx, "gx"], [showShortcuts, () => askDone(null), "ask"]]) {
    o(); await W8(120); add("popup " + l, cr()); c(); await W8(60);
  }
  setOpen = null; st.remove();
  return Object.values(all).map(x => `${x.ctx} | ${x.k} ${x.r}/${x.need} | ${x.cls} | ${x.t} | ${x.col}`);
};
