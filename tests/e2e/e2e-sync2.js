// Gói 6 (dong-bo-nhe): C3 đếm hoạt động bản tự lưu không parse lại khi nội dung không đổi; C2 nhớ canonState/số chưa gửi
// theo đúng chuỗi đầu vào, vòng dự phòng 60 s chỉ đồng bộ khi cần. KẾT QUẢ ĐỒNG BỘ PHẢI NHƯ CŨ.
// Chạy sau loadDemo() trên trang dữ liệu thử. sb, sbUser giả (không gọi Supabase thật).
// Khôi phục S, localStorage, sessionStorage, sb, sbUser, cloud và mọi hàm đã thay (canonState, cloudSoon, JSON.parse).
window.E2ESYNC2 = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  if (!Object.values(S.ev || {}).some(L => (L || []).some(e => e && e.demo))) return { pass: 0, total: 1, fail: [{ id: "P0", pass: false, info: "Trang không phải dữ liệu thử: chạy loadDemo() trước" }] };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const lsAll = st => { const o = {}; for (let i = 0; i < st.length; i++) { const k = st.key(i); o[k] = st.getItem(k); } return o; };
  const putAll = (st, snap) => { Object.keys(lsAll(st)).forEach(k => { if (!(k in snap)) st.removeItem(k); }); Object.keys(snap).forEach(k => { if (st.getItem(k) !== snap[k]) st.setItem(k, snap[k]); }); };
  const lsBefore = lsAll(localStorage), ssBefore = lsAll(sessionStorage), sBefore = JSON.stringify(S);
  const sbBefore = sb, userBefore = sbUser, cloudBefore = { ...cloud };
  const canonOrig = canonState, soonOrig = cloudSoon, parseOrig = JSON.parse;
  let canonN = 0;
  const settle = async () => { await sleep(0); for (let i = 0; i < 200 && cloudBusy; i++) await sleep(5); clearTimeout(cloudT); };
  const restoreAll = async () => {
    JSON.parse = parseOrig; canonState = canonOrig; cloudSoon = soonOrig;
    await settle();
    sb = sbBefore; sbUser = userBefore; Object.assign(cloud, cloudBefore);
    putAll(localStorage, lsBefore); putAll(sessionStorage, ssBefore);
    S = JSON.parse(sBefore); lastRaw = localStorage.getItem("lc2"); stampRaw = undefined; saveFailed = false; renderCloud(); draw(true);
  };
  const C = o => { const c = cleanState(JSON.parse(JSON.stringify(o))); Object.values(c.ev).forEach(sortL); return c; };

  // ---- C3: số hoạt động của bản tự lưu
  try {
    const old = raw => { let n = "?"; try { n = Object.values(JSON.parse(raw).ev).flat().length; } catch (e) {} return n; };
    snapKeys().forEach(k => localStorage.removeItem(k));
    const raws = {};
    for (let i = 1; i <= 7; i++) { const k = SNAP + "2026-01-0" + i; raws[k] = JSON.stringify({ sv: SV, ev: { "2026-01-01": Array.from({ length: i + 2 }, (_, j) => ({ t: "x" + j, h: 1, c: "sk" })) }, caps: [], pad: "" }); localStorage.setItem(k, raws[k]); }
    const list = () => { const el = [...document.querySelectorAll("#settingsModalOverlay .set-list, .set-list")].find(x => x.innerHTML.includes("restoreSnapshot(")); return el ? el.innerHTML : ""; };
    const rows = () => { const el = [...document.querySelectorAll(".set-list")].find(x => x.innerHTML.includes("restoreSnapshot(")); return el ? [...el.querySelectorAll(".set-val")].map(x => x.textContent) : []; };
    const want = () => snapKeys().reverse().map(k => { const d = k.slice(SNAP.length); return `${d.slice(8, 10)}/${d.slice(5, 7)} · ${old(localStorage.getItem(k))} hoạt động`; });
    const parses = () => { let n = 0; const set = new Set(snapKeys().map(k => localStorage.getItem(k))); JSON.parse = function (s, r) { if (set.has(s)) n++; return parseOrig.call(JSON, s, r); }; return () => n; };
    renderSettingsModal();
    const h1 = list();
    const cnt = parses();
    try { renderSettingsModal(); } finally { JSON.parse = parseOrig; }
    ok("P3.1 vẽ Cài đặt lần hai: không JSON.parse bản tự lưu nào, HTML danh sách y hệt", cnt() === 0 && list() === h1 && h1.length > 0, { parse: cnt(), same: list() === h1 });
    ok("P3.5 số hoạt động từng bản bằng cách đếm cũ (.flat().length)", JSON.stringify(rows()) === JSON.stringify(want()), [rows(), want()]);
    // P3.2: ghi đè cùng độ dài, khác số hoạt động
    const k2 = SNAP + "2026-01-03", a = raws[k2];
    let b = JSON.stringify({ sv: SV, ev: { "2026-01-01": [{ t: "y", h: 1, c: "sk" }] }, caps: [], pad: "" });
    b = b.replace('"pad":""', '"pad":"' + "z".repeat(Math.max(0, a.length - b.length)) + '"');
    localStorage.setItem(k2, b);
    renderSettingsModal();
    ok("P3.2 ghi đè cùng độ dài: số hoạt động cập nhật (1)", a.length === b.length && rows().some(t => t.startsWith("03/01 · 1 hoạt động")) && JSON.stringify(rows()) === JSON.stringify(want()), [a.length, b.length, rows()]);
    // P3.3: xóa một bản
    let thrown = null;
    localStorage.removeItem(SNAP + "2026-01-05");
    try { renderSettingsModal(); } catch (e) { thrown = String(e); }
    ok("P3.3 xóa một bản: dòng biến mất, không ném lỗi", !thrown && rows().length === 6 && !rows().some(t => t.startsWith("05/01")) && !list().includes("2026-01-05"), [thrown, rows()]);
    // P3.4: JSON hỏng, JSON không có ev: hiển thị "?" như cũ
    localStorage.setItem(SNAP + "2026-01-06", "{hỏng");
    localStorage.setItem(SNAP + "2026-01-07", "null");
    thrown = null;
    try { renderSettingsModal(); renderSettingsModal(); } catch (e) { thrown = String(e); }
    ok("P3.4 bản hỏng: hiện '? hoạt động', không ném lỗi, các bản khác đúng", !thrown && rows().some(t => t.startsWith("06/01 · ? hoạt động")) && rows().some(t => t.startsWith("07/01 · ? hoạt động")) && JSON.stringify(rows()) === JSON.stringify(want()), [thrown, rows()]);
    // P3.6: bản hỏng được sửa lại thành hợp lệ: số cập nhật
    localStorage.setItem(SNAP + "2026-01-06", raws[SNAP + "2026-01-06"]);
    renderSettingsModal();
    ok("P3.6 bản hỏng được ghi lại hợp lệ: số cập nhật", JSON.stringify(rows()) === JSON.stringify(want()) && rows().some(t => t.startsWith("06/01 · 8 hoạt động")), rows());
  } catch (e) { ok("P3.err", false, String(e && e.stack || e)); }
  finally { await restoreAll(); }

  // ---- C2: canonState/số chưa gửi và vòng dự phòng
  const srv = { rev: 0, data: null }, calls = { head: 0, full: 0, push: 0, last: null };
  const fakeSb = {
    from() {
      return { select() { return { eq() { return {
        maybeSingle: async () => { calls.head++; return { data: srv.rev ? { rev: srv.rev } : null, error: null }; },
        single: async () => { calls.full++; return { data: { rev: srv.rev, data: JSON.parse(JSON.stringify(srv.data)) }, error: null }; }
      }; } }; } };
    },
    rpc: async (name, a) => { calls.push++; calls.last = a; if (a.p_base !== srv.rev) return { data: -1, error: null }; srv.rev++; srv.data = a.p_data; return { data: srv.rev, error: null }; }
  };
  // Công thức số chưa gửi của bản trước gói 6 (chép nguyên), để so
  const oldCount = () => {
    const raw = cloudBaseRaw(), meta = cloudMeta();
    if (!sbUser || !meta || meta.uid !== sbUser.id) return 0;
    let base = null;
    try { base = raw ? parseOrig(raw) : null; } catch (e) {}
    const cur = parseOrig(canonOrig(cloudView(S)));
    if (!base) return Object.values(cur.ev).flat().length + cur.tasks.length || 1;
    let n = 0;
    new Set([...Object.keys(cur.ev), ...Object.keys(base.ev)]).forEach(k => {
      const a = (cur.ev[k] || []).map(evKey), b = (base.ev[k] || []).map(evKey);
      const left = [...b]; let add = 0;
      a.forEach(x => { const i = left.indexOf(x); if (i >= 0) left.splice(i, 1); else add++; });
      n += Math.max(add, left.length);
    });
    const tb = new Map(base.tasks.map(t => [t.id, JSON.stringify(t)]));
    cur.tasks.forEach(t => { if (tb.get(t.id) !== JSON.stringify(t)) n++; tb.delete(t.id); });
    n += tb.size;
    const rest = o => JSON.stringify({ ...o, ev: 0, tasks: 0, gdel: 0, lb: 0 });
    if (rest(cur) !== rest(base)) n++;
    return n;
  };
  const UID = "e2e-sync2-user";
  const consistent = () => { const b = canonOrig(cloudView(S)); srv.rev = 1; srv.data = JSON.parse(b); cloudKeep({ uid: UID, rev: 1 }, b); calls.head = calls.full = calls.push = 0; calls.last = null; return b; };
  const day = Object.keys(S.ev).sort().slice(-1)[0];
  try {
    canonState = function (st) { canonN++; return canonOrig(st); };
    sb = fakeSb; sbUser = { id: UID }; clearTimeout(cloudT);
    consistent(); cloudSet("ok");
    // P2.1
    S.ev[day].push({ id: "p21x", mt: 5, t: "Thêm P2.1", c: S.caps[0].k, m: "u", h: 1, s: "05:00" });
    canonN = 0;
    const a1 = cloudPendingCount(), a2 = cloudPendingCount(), n21 = canonN, w1 = oldCount();
    ok("P2.1 gọi hai lần không đổi dữ liệu: canonState 1 lần, kết quả bằng nhau và bằng công thức cũ", n21 === 1 && a1 === a2 && a1 === w1 && w1 > 0, { canon: n21, a1, a2, w1 });
    // P2.2 sửa S trong bộ nhớ (chưa save)
    S.ev[day][0].t = S.ev[day][0].t + " sửa P2.2";
    const a3 = cloudPendingCount(), w3 = oldCount();
    ok("P2.2 sửa S chưa save(): số cập nhật, bằng công thức cũ", a3 === w3 && a3 !== a1, { a3, w3, a1 });
    // P2.2b đổi cài đặt trong bộ nhớ (phần "còn lại")
    S.cfg = { ...S.cfg, defDuration: ((S.cfg && S.cfg.defDuration) || 2) === 3 ? 4 : 3 };
    const a4 = cloudPendingCount(), w4 = oldCount();
    ok("P2.2b đổi cfg trong bộ nhớ: số cập nhật, bằng công thức cũ", a4 === w4 && a4 === a3 + 1, { a4, w4, a3 });
    // P2.3 cloudSync khi không đổi gì
    consistent(); await settle(); canonN = 0;
    await cloudSync(); clearTimeout(cloudT);
    ok("P2.3 cloudSync không đổi gì: canonState ≤ 1, không lc_push, st ok, n 0", canonN <= 1 && calls.push === 0 && calls.head === 1 && cloud.st === "ok" && cloud.n === 0, { canon: canonN, calls: { ...calls, last: undefined }, st: cloud.st, n: cloud.n });
    // P2.4 sửa một hoạt động rồi cloudSync
    S.ev[day][0].t = S.ev[day][0].t + " P2.4"; S.ev[day][0].mt = Date.now();
    await cloudSync(); await settle();
    const want4 = canonOrig(cloudView(S));
    ok("P2.4 sau một lần sửa: lc_push đúng 1 lần, p_data như cũ, base mới, st ok", calls.push === 1 && calls.last && JSON.stringify(calls.last.p_data) === JSON.stringify(JSON.parse(want4)) && calls.last.p_base === 1 && cloudBaseRaw() === want4 && cloudMeta().rev === 2 && cloud.st === "ok", { push: calls.push, base: calls.last && calls.last.p_base, st: cloud.st });
    // P2.4b ngay sau đó: số chưa gửi 0, gọi lại cloudSync không gửi thừa
    const n4 = cloudPendingCount();
    await cloudSync(); await settle();
    ok("P2.4b ngay sau gửi: chưa gửi 0, cloudSync lần nữa không gửi thừa", n4 === 0 && oldCount() === 0 && calls.push === 1, { n4, push: calls.push });
    // P2.5a máy chủ có rev mới, máy này không đổi: nhận nguyên bản máy chủ
    { const b0 = consistent();
      const theirs = JSON.parse(b0); theirs.ev[day] = [...(theirs.ev[day] || []), { id: "p25srv", mt: 9, t: "Từ máy khác", c: S.caps[0].k, m: "u", h: 1, s: "04:00" }];
      srv.rev = 2; srv.data = theirs;
      const want = canonOrig(C(theirs));
      await cloudSync(); await settle();
      ok("P2.5a rev mới, máy này không đổi: S = bản máy chủ, không gửi, base = bản máy chủ", canonOrig(cloudView(S)) === want && calls.full === 1 && calls.push === 0 && cloudBaseRaw() === want && cloudMeta().rev === 2 && cloud.st === "ok" && cloud.n === 0, { full: calls.full, push: calls.push, st: cloud.st, n: cloud.n }); }
    // P2.5b rev mới, cả hai bên sửa: gộp ba bên như cũ rồi gửi
    { const b0 = consistent();
      const theirs = JSON.parse(b0); theirs.ev[day] = [...(theirs.ev[day] || []), { id: "p25b", mt: 9, t: "Máy khác thêm", c: S.caps[0].k, m: "u", h: 1, s: "03:00" }];
      srv.rev = 2; srv.data = theirs;
      S.ev[day].push({ id: "p25m", mt: 8, t: "Máy này thêm", c: S.caps[0].k, m: "u", h: 1, s: "02:00" }); S.ev[day].sort(cmp);
      const base = C(JSON.parse(b0)), mine = JSON.parse(JSON.stringify(S)), th = C(theirs);
      const merged = mergeStates(base, mine, th, true);
      if (mine.health && !merged.health) merged.health = mine.health;
      const want = canonOrig(cloudView(merged));
      await cloudSync(); await settle();
      const cur = canonOrig(cloudView(S));
      ok("P2.5b rev mới, cả hai sửa: S = gộp ba bên như cũ, gửi 1 lần đúng p_data, base mới", cur === want && calls.push === 1 && JSON.stringify(calls.last.p_data) === JSON.stringify(JSON.parse(cur)) && calls.last.p_base === 2 && cloudBaseRaw() === cur && cloud.st === "ok" && cloud.n === 0 && cur.includes("p25b") && cur.includes("p25m"), { same: cur === want, push: calls.push, st: cloud.st }); }
    // P2.10 khóa ngày của canonView: cùng JSON nhưng đã sang ngày khác thì phải tính lại (cleanState điền ngày còn thiếu bằng hôm nay)
    { consistent(); canonView(); canonN = 0; canonView(); const same = canonN; canonMemo.day = "1999-01-01"; canonView(); const after = canonN;
      ok("P2.10 canonView: cùng dữ liệu cùng ngày không tính lại; khác ngày thì tính lại đúng 1 lần", same === 0 && after === 1, { same, after }); }
    // P2.6 vòng dự phòng
    { consistent(); await settle();
      let soon = 0; cloudSoon = () => { soon++; };
      const run = (st, at, force) => { soon = 0; cloud.st = st; cloud.at = at; cloudBusy = false; if (force === undefined) tick(false); else tick(force); return soon; };
      const now = Date.now();
      const r = {
        okFresh: run("ok", now), wait: run("wait", now), err: run("err", now), offline: run("offline", now), sync: run("sync", now),
        okOld: run("ok", now - 5 * 60000 - 1000), okNoAt: run("ok", 0), auth: run("auth", now), setup: run("setup", now), forceOk: run("ok", now, true)
      };
      soon = 0; cloud.st = "ok"; cloud.at = Date.now(); window.dispatchEvent(new Event("focus")); r.focus = soon;
      soon = 0; cloud.st = "ok"; cloud.at = Date.now(); document.dispatchEvent(new Event("visibilitychange")); r.vis = document.hidden ? 1 : soon;
      soon = 0; cloud.st = "ok"; cloud.at = Date.now(); sbUser = null; tick(true); r.noUser = soon; sbUser = { id: UID };
      r.back = run("ok", Date.now() + 10 * 60000); // đồng hồ máy bị chỉnh lùi sau lần đồng bộ
      cloudSoon = soonOrig;
      ok("P2.6 tick(false) ok và mới: không gọi cloudSoon", r.okFresh === 0, r);
      ok("P2.6b tick(false) wait/err/offline/sync, ok cũ > 5 phút, chưa có at: có gọi", r.wait === 1 && r.err === 1 && r.offline === 1 && r.sync === 1 && r.okOld === 1 && r.okNoAt === 1, r);
      ok("P2.6d đồng hồ chỉnh lùi (at ở tương lai > 5 phút): vòng dự phòng vẫn đồng bộ", r.back === 1, r);
      ok("P2.6c tick(true), focus, visibilitychange: luôn gọi; auth/setup/chưa đăng nhập: không", r.forceOk === 1 && r.focus === 1 && r.vis === 1 && r.auth === 0 && r.setup === 0 && r.noUser === 0, r);
      cloudSet("ok"); }
    // P2.7 lc_sync_base đổi qua cloudKeep
    { consistent(); const n0 = cloudPendingCount();
      const older = JSON.parse(JSON.stringify(cloudView(S))); older.ev[day] = (older.ev[day] || []).slice(1);
      cloudKeep({ uid: UID, rev: 1 }, canonOrig(older));
      const n1 = cloudPendingCount(), w = oldCount();
      cloudKeep({ uid: UID, rev: 1 }, null);
      const n2 = cloudPendingCount(), w2 = oldCount();
      ok("P2.7 đổi lc_sync_base (cloudKeep): số mới đúng, không dùng bộ nhớ cũ", n0 === 0 && n1 === w && n1 === 1 && n2 === w2 && n2 > 1, { n0, n1, w, n2, w2 }); }
    // P2.8 đăng xuất / đổi người
    { consistent(); S.ev[day].push({ id: "p28x", mt: 5, t: "P2.8", c: S.caps[0].k, m: "u", h: 1, s: "01:00" });
      const n0 = cloudPendingCount();
      sbUser = null; const n1 = cloudPendingCount();
      sbUser = { id: "nguoi-khac" }; const n2 = cloudPendingCount();
      sbUser = { id: UID }; const n3 = cloudPendingCount();
      ok("P2.8 đăng xuất/đổi người: 0; quay lại: số đúng như trước", n0 === 1 && n1 === 0 && n2 === 0 && n3 === n0 && n3 === oldCount(), { n0, n1, n2, n3 }); }
    // P2.9 tắt đồng bộ sức khỏe (cloudView đổi) trong bộ nhớ: số cập nhật như cũ
    { consistent(); const n0 = cloudPendingCount();
      S.profile = { ...(S.profile || {}), hSync: false };
      const n1 = cloudPendingCount(), w = oldCount();
      ok("P2.9 đổi hSync trong bộ nhớ: số theo công thức cũ", n0 === 0 && n1 === w, { n0, n1, w }); }
  } catch (e) { ok("P2.err", false, String(e && e.stack || e)); }
  finally { await restoreAll(); }

  const lA = lsAll(localStorage), sA = lsAll(sessionStorage);
  ok("P9.1 sau khi chạy: localStorage và sessionStorage như trước", JSON.stringify(lA) === JSON.stringify(lsBefore) && JSON.stringify(sA) === JSON.stringify(ssBefore), [Object.keys(lA).length, Object.keys(lsBefore).length]);
  ok("P9.2 sau khi chạy: S, sb, sbUser, hàm như trước", JSON.stringify(S) === sBefore && sb === sbBefore && sbUser === userBefore && canonState === canonOrig && cloudSoon === soonOrig && JSON.parse === parseOrig, "khác");
  const pass = out.filter(x => x.pass).length;
  return { pass, total: out.length, fail: out.filter(x => !x.pass) };
};
