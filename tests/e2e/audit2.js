(async () => {
const W8 = ms => new Promise(r => setTimeout(r, ms));
const st = document.createElement('style'); st.textContent = '*{transition:none!important;animation:none!important}'; document.head.appendChild(st);
const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0; };
const name = el => (el.id ? '#' + el.id : el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '')) + ' "' + (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 18) + '"';
function scan(root, ctx) {
  const out = [];
  if (document.documentElement.scrollWidth > innerWidth + 1) out.push(ctx + ' TRÀN NGANG trang ' + document.documentElement.scrollWidth + '>' + innerWidth);
  const btns = [...root.querySelectorAll('button, .btn, .pill, select, kbd')].filter(vis);
  for (const b of btns) {
    const cs = getComputedStyle(b), lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.3;
    const r = b.getBoundingClientRect();
    if (b.tagName === 'BUTTON' && !b.closest('.yr-day, .cal-day-cell, .inbox-rail, .hv-name, .timeline-days-nav, nav.main-nav') && b.textContent.trim() && r.height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) > lh * 1.6) out.push(ctx + ' XUỐNG DÒNG ' + name(b) + ' h=' + Math.round(r.height));
    // bị cắt bởi tổ tiên có overflow hidden/clip (không phải vùng cuộn)
    for (let a = b.parentElement; a && a !== document.body; a = a.parentElement) {
      const ac = getComputedStyle(a);
      if (/(hidden|clip)/.test(ac.overflowX + ac.overflowY)) {
        const ar = a.getBoundingClientRect();
        if (r.right > ar.right + 1 || r.left < ar.left - 1 || r.bottom > ar.bottom + 1 || r.top < ar.top - 1) out.push(ctx + ' BỊ CẮT ' + name(b) + ' trong ' + name(a));
        break;
      }
      if (/(auto|scroll)/.test(ac.overflowX + ac.overflowY)) break;
    }
  }
  // nút chồng nhau trong cùng hàng
  const groups = new Map();
  btns.forEach(b => { const p = b.parentElement; if (!groups.has(p)) groups.set(p, []); groups.get(p).push(b); });
  for (const [p, list] of groups) for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
    const a = list[i].getBoundingClientRect(), c = list[j].getBoundingClientRect();
    const ox = Math.min(a.right, c.right) - Math.max(a.left, c.left), oy = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top);
    if (ox > 2 && oy > 2) out.push(ctx + ' CHỒNG ' + name(list[i]) + ' / ' + name(list[j]));
  }
  // phần tử con tràn khỏi thanh công cụ
  for (const bar of root.querySelectorAll('.app-header, .header-actions, .page-title-row, .sidebar, nav.main-nav, .card-header, .row, .segmented-control, .set-row, .modal-header, .hv-head, .hv-meta, .hv-acts, .quick-capture-row, .yr-tabs, .ask-acts, .onb-acts, .stat-row, .hb-strip, .hb-chip, .hb-main, .sch-row, .hb-row, .hb-stats')) {
    if (!vis(bar)) continue;
    const br = bar.getBoundingClientRect(), bc = getComputedStyle(bar);
    if (/(auto|scroll)/.test(bc.overflowX)) continue;
    for (const ch of bar.children) { if (!vis(ch) || getComputedStyle(ch).position === 'absolute') continue; const r = ch.getBoundingClientRect(); if (r.right > br.right + 2 || r.left < br.left - 2) out.push(ctx + ' TRÀN KHỎI ' + name(bar) + ': ' + name(ch) + ' ' + Math.round(r.left) + '–' + Math.round(r.right) + ' / ' + Math.round(br.left) + '–' + Math.round(br.right)); }
  }
  return out;
}
const res = [];
const views = [['ca', 'focus'], ['ca', 'timeline'], ['ca', 'year'], ['hv'], ['pj'], ['hl'], ['su'], ['me']];
for (const [tab, sv] of views) { if (sv) calSubView = sv; if (tab === 'pj' && S.projects && S.projects[0]) pjOpenId = S.projects[0].id; switchTab(tab); window.scrollTo(0, 0); await W8(120); res.push(...scan(document.body, tab + (sv ? '/' + sv : ''))); }
for (const v of [['browse'], ['log'], ['browse', 'sy'], ['browse', 'mh'], ['browse', 'sl'], ['browse', 'md'], ['browse', 'ac'], ['browse', 'bd'], ['browse', 'cy']]) { hlGo(v[0], v[1]); await W8(120); res.push(...scan(document.body, 'hl/' + v.join('/'))); }
hlGo('sum');
// khay ⋯ của Hộp việc (tab riêng và cột bên Lịch)
{ const t0 = S.tasks.find(t => !taskDone(t) && t.subs.length); switchTab('hv'); openTasks.add(t0.id); hvMoreT('task:' + t0.id); await W8(120); res.push(...scan(document.body, 'hv/tray'));
  hvMoreT('sub:' + t0.subs[0].id); await W8(120); res.push(...scan(document.body, 'hv/subtray'));
  calSubView = 'focus'; inboxPanel = true; switchTab('ca'); hvMoreT('task:' + t0.id); await W8(120); res.push(...scan(document.body, 'ca/panel-tray')); hvMore = ''; openTasks.delete(t0.id); }
// thanh tab dưới & ô ghi nhanh
const q = document.querySelector('.quick-capture-box').getBoundingClientRect(), sb = document.querySelector('.sidebar').getBoundingClientRect();
if (getComputedStyle(document.querySelector('.quick-capture-box')).position === 'fixed' && q.bottom > sb.top + 1) res.push('Ô ghi nhanh đè thanh tab');
switchTab('ca'); calSubView = 'focus'; draw();
for (const [open, close, label] of [[openSettingsModal, closeSettingsModal, 'cài đặt'], [() => openWeeklyReviewModal(sel), () => switchTab("ca"), 'tổng kết'], [() => { const k = ky(ad(W[sel], 1)); gxWk = sel; gxRows = [{ id: "imp1", k, s: "19:00", h: 1.5, t: "Học tiếng Anh online", c: "kn", sure: true, dup: false, on: true }, { id: "imp2", k, s: "06:30", h: 1, t: "Chạy bộ", c: "sk", sure: true, dup: true, on: false }, { id: "imp3", k, s: "23:00", h: 1, t: "Tiệc khuya", c: "sk", sure: false, dup: false, on: true }]; $("gxBody").innerHTML = gxHTML(); gxSync(); $("gxOverlay").classList.add("open"); }, closeGx, 'nhập gcal'], [() => openEditor(tk), closeEditor, 'thêm hđ'], [() => openEditor(Object.keys(S.ev).sort()[0], 0), closeEditor, 'sửa hđ'], [showShortcuts, () => askDone(null), 'phím tắt'], [() => { openSched('task', S.tasks.find(t => t.subs.length).id, tk); }, closeSched, 'xếp lịch'], [() => hbOpen(S.habits[0].id), closeHb, 'thói quen tự đếm'], [() => hbOpen(S.habits[1].id), closeHb, 'thói quen tích tay'], [() => hbOpen(), closeHb, 'thêm thói quen'], [() => hlOpen(tk), closeHl, 'sức khỏe ngày'], [() => hlMedOpen(), closeHl, 'thêm thuốc'], [() => hlChkOpen(), closeHl, 'kiểm tra tâm lý'], [() => hlCheckin(), closeHl, 'check-in'], [() => hlReport(), closeHl, 'báo cáo']]) {
  if (label === 'cài đặt') { setOpen = new Set(['ui', 'mod', 'def', 'data', 'gc', 'del']); }
  open(); await W8(150);
  const ov = document.querySelector('.modal-overlay.open .modal-sheet');
  if (ov) { const body = ov.querySelector('.modal-body'); res.push(...scan(ov, 'popup ' + label)); }
  close(); await W8(80);
}
setOpen = null;
st.remove();
window.__audit = res; window.__auditDone = 1;
})();
