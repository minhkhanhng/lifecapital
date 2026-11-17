// Gói 4 (gop-hai-may): A5 markPending cấp sẵn mã gi (hai máy không tạo hai sự kiện Google); A6 gộp bl, cfg theo từng khóa.
// Chạy sau loadDemo() trên trang dữ liệu thử. Khôi phục S, localStorage, sessionStorage khi xong; chỉ dùng dữ liệu giả.
window.E2EMRG = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  // Chốt an toàn (rule.md §12): chỉ chạy khi trang đang là dữ liệu thử của loadDemo()
  if (!Object.values(S.ev || {}).some(L => (L || []).some(e => e && e.demo))) return { pass: 0, total: 1, fail: [{ id: "M0", pass: false, info: "Trang không phải dữ liệu thử: chạy loadDemo() trước" }] };
  const lsAll = st => { const o = {}; for (let i = 0; i < st.length; i++) { const k = st.key(i); o[k] = st.getItem(k); } return o; };
  const lsBefore = lsAll(localStorage), ssBefore = lsAll(sessionStorage), sBefore = JSON.stringify(S), userBefore = sbUser;
  const putAll = (st, snap) => { Object.keys(lsAll(st)).forEach(k => { if (!(k in snap)) st.removeItem(k); }); Object.keys(snap).forEach(k => { if (st.getItem(k) !== snap[k]) st.setItem(k, snap[k]); }); };
  const restoreAll = () => { sbUser = userBefore; putAll(localStorage, lsBefore); putAll(sessionStorage, ssBefore); S = JSON.parse(sBefore); lastRaw = localStorage.getItem("lc2"); saveFailed = false; draw(true); };
  const GI = /^[0-9a-v]{20,64}$/;
  const day = "2026-10-12";
  const caps = [{ k: "sk", n: "Sức khỏe", c: "#97A13B", tg: 5, kw: [] }, { k: "tc", n: "Tài chính", c: "#4a859c", tg: 10, kw: [] }];
  const st = (extra) => ({ sv: SV, av: 60, ev: {}, caps, tasks: [], cfg: { defDuration: 2 }, bl: {}, mem: {}, memV: 2, gdel: [], projects: [], ...(extra || {}) });
  const C = o => cleanState(JSON.parse(JSON.stringify(o)));

  // ---- A5: markPending cấp sẵn gi
  try {
    sbUser = null;
    localStorage.setItem("gcal_linked", "1");
    S.cfg = S.cfg || {}; S.cfg.gcalAutoSync = true;
    const e1 = { id: "mrg1", t: "Chạy", c: "sk", m: "u", h: 1, s: "06:00" };
    markPending(e1);
    ok("M5.1 hoạt động mới: có gi đúng dạng, ds 1", GI.test(e1.gi || "") && e1.ds === 1, e1);
    const g1 = e1.gi;
    markPending(e1);
    ok("M5.2 gọi lại: gi giữ nguyên, ds 2", e1.gi === g1 && !!g1 && e1.ds === 2, e1);
    const d = { id: "mrg2", t: "Demo", c: "sk", m: "u", h: 1, s: "07:00", demo: 1 }, x = { id: "mrg3", t: "Từ GCal", c: "sk", m: "u", h: 1, s: "08:00", gx: "imp00001" };
    markPending(d); markPending(x);
    ok("M5.3 demo, gx: không gi, không ds", !d.gi && !d.ds && !x.gi && !x.ds, [d, x]);
    const g = { id: "mrg4", t: "Đã có", c: "sk", m: "u", h: 1, s: "09:00", gid: "abcde12345" };
    markPending(g);
    ok("M5.4 sự kiện có gid: không gán gi, vẫn ds", !("gi" in g) && g.ds === 1, g);
    const g2 = { id: "mrg5", t: "Đã có 2", c: "sk", m: "u", h: 1, s: "09:30", gid: "abcde12346", gi: "0123456789abcdefghij" };
    markPending(g2);
    ok("M5.4b sự kiện có gid và gi: gi không đổi", g2.gi === "0123456789abcdefghij", g2);
    localStorage.removeItem("gcal_linked"); sbUser = null;
    const n = { id: "mrg6", t: "Chưa liên kết", c: "sk", m: "u", h: 1, s: "10:00" };
    markPending(n);
    ok("M5.5 chưa liên kết: không gi, không ds", !n.gi && !n.ds, n);
    // M5.6: hai máy cùng thấy hoạt động chờ gửi, gộp hai chiều vẫn một gi
    localStorage.setItem("gcal_linked", "1");
    const e6 = { id: "mrg7", t: "Họp", c: "tc", m: "u", h: 1, s: "11:00", mt: 5 };
    markPending(e6);
    const A = C(st({ ev: { [day]: [e6] } })), B = C(st({ ev: { [day]: [e6] } }));
    const gOf = r => (r.ev[day] || []).filter(e => e.id === "mrg7").map(e => e.gi);
    const r1 = C(mergeStates(C(st({ ev: {} })), A, B, true)), r2 = C(mergeStates(C(st({ ev: {} })), B, A, true));
    const n1 = C(mergeStates(null, A, B, false)), n2 = C(mergeStates(null, B, A, false));
    ok("M5.6 gộp hai chiều: một gi duy nhất, bằng nhau", [r1, r2, n1, n2].every(r => gOf(r).length === 1 && GI.test(gOf(r)[0] || "") && gOf(r)[0] === e6.gi), [gOf(r1), gOf(r2), gOf(n1), gOf(n2), e6.gi]);
    // M5.7: hai máy tự cấp gi KHÁC nhau cho cùng một hoạt động (bản trước gói này): gộp vẫn một sự kiện, một gi hợp lệ
    const mk = gi => ({ id: "mrg8", t: "Họp 2", c: "tc", m: "u", h: 1, s: "12:00", mt: 5, ds: 1, gi });
    const A7 = C(st({ ev: { [day]: [mk("aaaaaaaaaaaaaaaaaaaaaaaaaa")] } })), B7 = C(st({ ev: { [day]: [mk("bbbbbbbbbbbbbbbbbbbbbbbbbb")] } }));
    const q = [C(mergeStates(C(st({ ev: {} })), A7, B7, true)), C(mergeStates(C(st({ ev: {} })), B7, A7, true)), C(mergeStates(null, A7, B7, false)), C(mergeStates(null, B7, A7, false))];
    const g7 = r => (r.ev[day] || []).filter(e => e.id === "mrg8").map(e => e.gi);
    ok("M5.7 hai gi khác nhau cùng id: gộp còn một sự kiện, một gi hợp lệ", q.every(r => g7(r).length === 1 && GI.test(g7(r)[0] || "")), q.map(g7));
  } catch (e) { ok("M5.err", false, String(e && e.stack || e)); }
  finally { restoreAll(); }

  // ---- A6: gộp bl, cfg theo từng khóa (qua cleanState như merge-tests.html)
  try {
    const both = (b, m, t, trust, f) => [f(C(mergeStates(b ? C(b) : null, C(m), C(t), trust))), f(C(mergeStates(b ? C(b) : null, C(t), C(m), trust)))];
    const bl = o => st({ bl: o }), cf = o => st({ cfg: o });
    const blOf = r => JSON.stringify(r.bl);
    // M6.1
    const s1 = both(bl({ sk: { u: 1, d: 0 } }), bl({ sk: { u: 2, d: 0 } }), bl({ sk: { u: 1, d: 0 }, tc: { u: 3, d: 0 } }), true, blOf);
    const w1 = JSON.stringify({ sk: { u: 2, d: 0 }, tc: { u: 3, d: 0 } });
    ok("M6.1 bl khác khóa: giữ sửa của cả hai, cả hai chiều", s1.every(v => JSON.stringify(Object.fromEntries(Object.entries(JSON.parse(v)).sort())) === w1), s1);
    // M6.2
    const s2 = both(cf({ x: 1, defDuration: 1 }), cf({ x: 2, defDuration: 1 }), cf({ x: 1, defDuration: 2 }), true, r => [r.cfg.x, r.cfg.defDuration]);
    ok("M6.2 cfg khác khóa: x 2, defDuration 2, cả hai chiều", s2.every(v => v[0] === 2 && v[1] === 2), s2);
    // M6.3
    const s3 = both(cf({ gcalAutoSync: true }), cf({ gcalAutoSync: false }), cf({ gcalAutoSync: true }), true, r => r.cfg.gcalAutoSync);
    ok("M6.3 gcalAutoSync false một bên tắt: giữ false, cả hai chiều", s3.every(v => v === false), s3);
    // M6.4: số 0 trong bl và cfg giữ
    const s4 = both(bl({ sk: { u: 2, d: 0 } }), bl({ sk: { u: 0, d: 0 } }), bl({ sk: { u: 2, d: 0 } }), true, blOf);
    const s4b = both(cf({ schedCap: 2 }), cf({ schedCap: 0 }), cf({ schedCap: 2 }), true, r => r.cfg.schedCap);
    ok("M6.4 giá trị 0 giữ (bl u:0, cfg.schedCap 0), cả hai chiều", s4.every(v => v === JSON.stringify({ sk: { u: 0, d: 0 } })) && s4b.every(v => v === 0), [s4, s4b]);
    // M6.5: xóa thật
    const s5 = both(bl({ sk: { u: 1, d: 0 }, tc: { u: 3, d: 0 } }), bl({ sk: { u: 1, d: 0 }, tc: { u: 3, d: 0 } }), bl({ sk: { u: 1, d: 0 } }), true, blOf);
    ok("M6.5 một bên xóa khóa, bên kia như gốc: xóa, cả hai chiều", s5.every(v => v === JSON.stringify({ sk: { u: 1, d: 0 } })), s5);
    // M6.6: không trust: hợp hai bên, mine thắng khi cùng khóa khác giá trị
    const r6 = C(mergeStates(null, C(bl({ sk: { u: 1, d: 0 }, tc: { u: 5, d: 0 } })), C(bl({ sk: { u: 9, d: 0 }, hl: { u: 2, d: 0 } })), false));
    ok("M6.6 không trust: hợp hai bên, mine thắng xung đột", (r6.bl.sk || {}).u === 1 && (r6.bl.tc || {}).u === 5 && (r6.bl.hl || {}).u === 2, r6.bl);
    const r6c = C(mergeStates(C(bl({ sk: { u: 1, d: 0 } })), C(bl({ sk: { u: 4, d: 0 } })), C(bl({ sk: { u: 7, d: 0 } })), true));
    ok("M6.6b trust, cả hai sửa cùng khóa: mine thắng", (r6c.bl.sk || {}).u === 4, r6c.bl);
    // M6.7: khóa lạ trong cfg một bên có thì giữ
    const s7 = both(cf({}), cf({ zzz: { a: 1 } }), cf({}), true, r => r.cfg.zzz && r.cfg.zzz.a);
    const s7b = both(null, cf({ zzz: 5 }), cf({}), false, r => r.cfg.zzz);
    ok("M6.7 khóa lạ cfg.zzz một bên có: giữ (trust và không trust)", s7.every(v => v === 1) && s7b.every(v => v === 5), [s7, s7b]);
    // M6.8: cả hai không có bl/cfg thì không tạo mới (gọi thẳng mergeStates, không qua cleanState vì nó luôn thêm)
    const raw = () => ({ sv: SV, av: 60, ev: {}, caps, tasks: [] });
    const r8 = mergeStates(null, raw(), raw(), false), r8b = mergeStates(raw(), raw(), raw(), true);
    ok("M6.8 không có bl/cfg ở cả hai: không tạo mới", [r8, r8b].every(r => r.bl === undefined && r.cfg === undefined), [r8.bl, r8.cfg, r8b.bl, r8b.cfg]);
    // M6.9: mods (đối tượng lồng) so nguyên khối, không mất khóa khác
    const s9 = both(cf({ defDuration: 2 }), cf({ defDuration: 2, mods: { pj: false } }), cf({ defDuration: 3 }), true, r => [r.cfg.mods && r.cfg.mods.pj, r.cfg.defDuration]);
    ok("M6.9 mods một bên tắt, bên kia đổi defDuration: giữ cả hai", s9.every(v => v[0] === false && v[1] === 3), s9);
    const s9b = both(cf({ mods: { pj: false } }), cf({ mods: { pj: false, hb: false } }), cf({ mods: { pj: false } }), true, r => r.cfg.mods);
    ok("M6.9b mods đổi một bên: lấy nguyên khối bên đã đổi", s9b.every(v => sameJ(v, { pj: false, hb: false })), s9b);
  } catch (e) { ok("M6.err", false, String(e && e.stack || e)); }
  finally { restoreAll(); }

  const lA = lsAll(localStorage), sA = lsAll(sessionStorage);
  ok("M9.1 sau khi chạy: localStorage và sessionStorage như trước", JSON.stringify(lA) === JSON.stringify(lsBefore) && JSON.stringify(sA) === JSON.stringify(ssBefore), [Object.keys(lA).length, Object.keys(lsBefore).length]);
  ok("M9.2 sau khi chạy: S như trước", JSON.stringify(S) === sBefore, "S khác");
  const pass = out.filter(x => x.pass).length;
  return { pass, total: out.length, fail: out.filter(x => !x.pass) };
};
