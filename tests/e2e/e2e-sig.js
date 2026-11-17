// Gói 7 (chu-ky-mt): chữ ký so sánh của stampEdits/sameJ không phụ thuộc thứ tự khóa.
// Chạy sau loadDemo() trên trang dữ liệu thử. Khôi phục S, localStorage, sessionStorage khi xong; chỉ dùng dữ liệu giả.
window.E2ESIG = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  if (!Object.values(S.ev || {}).some(L => (L || []).some(e => e && e.demo))) return { pass: 0, total: 1, fail: [{ id: "G0", pass: false, info: "Trang không phải dữ liệu thử: chạy loadDemo() trước" }] };
  const lsAll = st => { const o = {}; for (let i = 0; i < st.length; i++) { const k = st.key(i); o[k] = st.getItem(k); } return o; };
  const lsBefore = lsAll(localStorage), ssBefore = lsAll(sessionStorage), sBefore = JSON.stringify(S), userBefore = sbUser;
  const putAll = (st, snap) => { Object.keys(lsAll(st)).forEach(k => { if (!(k in snap)) st.removeItem(k); }); Object.keys(snap).forEach(k => { if (st.getItem(k) !== snap[k]) st.setItem(k, snap[k]); }); };
  const restoreAll = () => { sbUser = userBefore; putAll(localStorage, lsBefore); putAll(sessionStorage, ssBefore); S = JSON.parse(sBefore); lastRaw = localStorage.getItem("lc2"); saveFailed = false; draw(true); };
  const wait = ms => { const e = Date.now() + ms; while (Date.now() < e); };
  const C = o => cleanState(JSON.parse(JSON.stringify(o)));
  const caps = [{ k: "sk", n: "Sức khỏe", c: "#97A13B", tg: 5, kw: [] }];
  const st = extra => ({ sv: SV, av: 71, ev: {}, caps, tasks: [], cfg: { defDuration: 2 }, bl: {}, mem: {}, memV: 2, gdel: [], projects: [], habits: [], ...(extra || {}) });
  // Dựng đối tượng với thứ tự khóa KHÁC cleanTask/cleanProject/cleanHabit (như app tạo trong phiên)
  const mkTask = () => ({ id: "sg_t1", t: "Việc cũ", c: "sk", m: "u", subs: [{ id: "sg_s1", t: "Bước", h: 1 }], pj: "sg_p1" });
  const mkPj = () => ({ id: "sg_p1", n: "Dự án cũ", col: "#E0A3BB", st: "run", pr: "m", caps: [], sd: "2026-10-01" });
  const mkHb = () => ({ id: "sg_h1", n: "Thói quen cũ", c: "sk", kind: "tick", per: "week", tgt: 3, sd: "2026-10-01", ticks: { "2026-10-05": 1 } });
  const kinds = [
    { name: "task", arr: "tasks", mk: mkTask, late: o => { o.q = "2"; o.due = "2026-12-01"; }, edit: o => { o.t = "Đổi thật"; }, field: "t" },
    { name: "project", arr: "projects", mk: mkPj, late: o => { o.ed = "2026-12-31"; o.desc = "mô tả"; }, edit: o => { o.n = "Đổi thật"; }, field: "n" },
    { name: "habit", arr: "habits", mk: mkHb, late: o => { o.arch = 1; }, edit: o => { o.n = "Đổi thật"; }, field: "n" }
  ];

  // ---- G1..G3: lưu hai lần không đổi gì thì mt không đổi; sửa thật thì mt tăng
  for (const [i, k] of kinds.entries()) {
    try {
      sbUser = null;
      S[k.arr] = S[k.arr] || [];
      const o = k.mk(); S[k.arr].push(o);
      save(); wait(6); save();          // lần 1 cấp mt (mới); lần 2 chốt mốc từ lastRaw
      const m1 = o.mt; wait(6);
      save();
      ok(`G${i + 1}.1 ${k.name}: không sửa gì, lưu lại: mt không đổi`, m1 > 0 && o.mt === m1, [m1, o.mt]);
      k.late(o); wait(6); save(); const m2 = o.mt; wait(6); save();
      ok(`G${i + 1}.2 ${k.name}: thêm khóa muộn (sửa thật) mt tăng một lần, lưu tiếp không tăng nữa`, m2 > m1 && o.mt === m2, [m1, m2, o.mt]);
      wait(6); k.edit(o); save(); const m3 = o.mt;
      ok(`G${i + 1}.3 ${k.name}: sửa nội dung: mt tăng`, m3 > m2, [m2, m3]);
      wait(6); save(); wait(6); save();
      ok(`G${i + 1}.4 ${k.name}: lưu thêm: mt thật của bản sửa giữ nguyên`, o.mt === m3, [m3, o.mt]);
    } catch (e) { ok(`G${i + 1}.err`, false, String(e && e.stack || e)); }
    finally { restoreAll(); }
  }

  // ---- G5: hai máy. Base có bản cũ (mt 1000); A giữ tab mở, thứ tự khóa lệch, lưu hai lần; B đổi tên mt sau base.
  for (const k of kinds) {
    try {
      sbUser = null;
      const o = k.mk(); o.mt = 1000;
      const base = C(st({ [k.arr]: [JSON.parse(JSON.stringify(o))] }));
      const A0 = C(st({ [k.arr]: [JSON.parse(JSON.stringify(o))] }));
      // A: tab đang mở, bản trong bộ nhớ có thứ tự khóa lệch; lưu hai lần như người dùng làm việc khác
      S = JSON.parse(JSON.stringify(A0)); S[k.arr] = [o];
      localStorage.setItem("lc2", JSON.stringify(A0)); lastRaw = localStorage.getItem("lc2"); stampBase(C(A0));
      wait(6); save(); wait(6); save();
      const aMt = S[k.arr][0].mt;
      ok(`G5.1 ${k.name}: máy A không sửa gì, mt vẫn 1000`, aMt === 1000, aMt);
      // B: đổi tên, mt sau base nhưng trước các lần lưu của A
      const bObj = JSON.parse(JSON.stringify(o)); bObj[k.field] = "Máy B đổi"; bObj.mt = Date.now() - 1;
      const B = C(st({ [k.arr]: [bObj] }));
      const mine = C(S);
      const r1 = mergeStates(base, mine, B, true), r2 = mergeStates(base, B, mine, true);
      const rn = r => (r[k.arr][0] || {})[k.field];
      ok(`G5.2 ${k.name}: gộp hai chiều: bản đổi tên của B thắng`, rn(r1) === "Máy B đổi" && rn(r2) === "Máy B đổi", [rn(r1), rn(r2)]);
      const r3 = mergeStates(null, mine, B, false);
      ok(`G5.3 ${k.name}: gộp không gốc chung: bản B (mt sau) thắng`, rn(r3) === "Máy B đổi", rn(r3));
    } catch (e) { ok("G5.err", false, String(e && e.stack || e)); }
    finally { restoreAll(); }
  }

  // ---- G6: sameJ theo nội dung, không theo thứ tự khóa
  try {
    ok("G6.1 sameJ: cùng nội dung khác thứ tự khóa: bằng", sameJ({ a: 1, b: { c: 2, d: [1, { x: 1, y: 2 }] } }, { b: { d: [1, { y: 2, x: 1 }], c: 2 }, a: 1 }));
    ok("G6.2 sameJ: khác nội dung: khác", !sameJ({ a: 1, b: 2 }, { a: 1, b: 3 }) && !sameJ({ a: 1 }, { a: 1, b: 2 }));
    ok("G6.3 sameJ: thứ tự phần tử mảng vẫn có nghĩa", !sameJ({ a: [1, 2] }, { a: [2, 1] }));
    ok("G6.4 sameJ: undefined/null", sameJ(undefined, undefined) && !sameJ(undefined, {}) && sameJ(null, null));
  } catch (e) { ok("G6.err", false, String(e && e.stack || e)); }

  // ---- G7: hoạt động không đổi (không phụ thuộc thứ tự khóa), sửa thật thì mt đổi
  try {
    sbUser = null;
    const day = "2026-10-12";
    S.ev[day] = S.ev[day] || [];
    const e = { id: "sg_e1", t: "Chạy", c: "sk", m: "u", h: 1, s: "06:00" }; S.ev[day].push(e);
    save(); wait(6); save(); const m1 = e.mt; wait(6); save();
    ok("G7.1 hoạt động: lưu lại không sửa: mt không đổi", m1 > 0 && e.mt === m1, [m1, e.mt]);
    wait(6); e.t = "Chạy bộ"; save();
    ok("G7.2 hoạt động: sửa thật: mt tăng", e.mt > m1, [m1, e.mt]);
  } catch (e) { ok("G7.err", false, String(e && e.stack || e)); }
  finally { restoreAll(); }

  const lA = lsAll(localStorage), sA = lsAll(sessionStorage);
  ok("G9.1 sau khi chạy: localStorage và sessionStorage như trước", JSON.stringify(lA) === JSON.stringify(lsBefore) && JSON.stringify(sA) === JSON.stringify(ssBefore), [Object.keys(lA).length, Object.keys(lsBefore).length]);
  ok("G9.2 sau khi chạy: S như trước", JSON.stringify(S) === sBefore, "S khác");
  const pass = out.filter(x => x.pass).length;
  return { pass, total: out.length, fail: out.filter(x => !x.pass) };
};
