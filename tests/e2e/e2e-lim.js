// Gói 1 (mất dữ liệu) A1: không cắt cứng dữ liệu khi làm sạch / gộp. Chạy sau loadDemo(). Không đổi S thật, không gọi save().
window.E2ELIM = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  const base = () => JSON.parse(JSON.stringify(S));
  const mk = f => cleanState({ ...base(), ...f });
  const pad = (i, n) => String(i).padStart(n, "0");
  const mkTasks = n => Array.from({ length: n }, (_, i) => ({ id: "t" + i, t: "Việc " + i, c: "sk", m: "u", subs: [], ...(i < 100 ? { done: 1 } : {}) }));
  const mkHabits = n => Array.from({ length: n }, (_, i) => ({ id: "h" + i, n: "Thói quen " + i, kind: "tick", per: "day", ticks: {} }));
  const days = n => { const o = {}, d0 = Date.UTC(2023, 0, 1); for (let i = 0; i < n; i++) o[new Date(d0 + i * 864e5).toISOString().slice(0, 10)] = 1; return o; };
  const len = (a) => (a || []).length;

  // L1.1: 600 việc
  let r = mk({ tasks: mkTasks(600) });
  ok("L1.1 600 việc hợp lệ giữ đủ, đầu/cuối đúng id", len(r.tasks) === 600 && r.tasks[0].id === "t0" && r.tasks[599].id === "t599", len(r.tasks));
  // L1.2: đúng 500
  r = mk({ tasks: mkTasks(500) });
  ok("L1.2 đúng 500 việc giữ 500", len(r.tasks) === 500, len(r.tasks));
  // L1.3: 250 dự án
  const pjs = Array.from({ length: 250 }, (_, i) => ({ id: "p" + i, n: "Dự án " + i, col: PJ_COLORS[0], st: "run", pr: "m", sd: tk, caps: [] }));
  r = mk({ projects: pjs });
  ok("L1.3 250 dự án giữ đủ", len(r.projects) === 250, len(r.projects));
  // L1.4: 150 thói quen, trùng id khử
  const hb150 = mkHabits(150);
  r = mk({ habits: hb150 });
  const n1 = len(r.habits);
  r = mk({ habits: [...hb150, ...hb150.slice(0, 3).map(h => ({ ...h }))] });
  ok("L1.4 150 thói quen khác id giữ 150; thêm 3 trùng id vẫn 150", n1 === 150 && len(r.habits) === 150, [n1, len(r.habits)]);
  // L1.5: 150 subs
  const t5 = { id: "ts", t: "Nhiều việc con", c: "sk", m: "u", subs: Array.from({ length: 150 }, (_, i) => ({ id: "s" + i, t: "Con " + i, h: 1 })) };
  r = mk({ tasks: [t5] });
  ok("L1.5 150 việc con giữ đủ", r.tasks[0] && len(r.tasks[0].subs) === 150, r.tasks[0] && len(r.tasks[0].subs));
  // L1.6: 1100 ngày tick
  r = mk({ habits: [{ id: "hd", n: "Hằng ngày", kind: "tick", per: "day", ticks: days(1100) }] });
  const tk6 = (r.habits[0] || {}).ticks || {};
  ok("L1.6 1100 ngày tick giữ đủ và còn 2023-01-01", Object.keys(tk6).length === 1100 && tk6["2023-01-01"] === 1, Object.keys(tk6).length);
  // L1.7: 120 thuốc, 60 triệu chứng
  r = mk({ health: { meds: Array.from({ length: 120 }, (_, i) => ({ id: "m" + i, n: "Thuốc " + i, kind: "med" })), syc: Array.from({ length: 60 }, (_, i) => ({ id: "y" + i, n: "Triệu chứng " + i })) } });
  ok("L1.7 120 thuốc và 60 triệu chứng giữ đủ", len(r.health && r.health.meds) === 120 && len(r.health && r.health.syc) === 60, [len(r.health && r.health.meds), len(r.health && r.health.syc)]);
  // L1.8: dự án 25 secs / 60 ms / 40 ups
  r = mk({ projects: [{
    id: "pbig", n: "Dự án lớn", col: PJ_COLORS[0], st: "run", pr: "m", sd: tk, caps: [],
    secs: Array.from({ length: 25 }, (_, i) => ({ id: "sc" + i, n: "Phần " + i })),
    ms: Array.from({ length: 60 }, (_, i) => ({ id: "ms" + i, n: "Mốc " + i, d: tk })),
    ups: Array.from({ length: 40 }, (_, i) => ({ id: "up" + i, d: tk, hs: "ok", note: "" }))
  }] });
  const pb = r.projects[0] || {};
  ok("L1.8 dự án 25 phần / 60 mốc / 40 cập nhật giữ đủ", len(pb.secs) === 25 && len(pb.ms) === 60 && len(pb.ups) === 40, [len(pb.secs), len(pb.ms), len(pb.ups)]);
  // L1.9: gdel 600
  const gids = (from, n) => Array.from({ length: n }, (_, i) => "g" + pad(from + i, 6));
  r = mk({ gdel: gids(0, 600) });
  ok("L1.9 gdel 600 id hợp lệ giữ đủ", len(r.gdel) === 600, len(r.gdel));
  // L1.10: gộp hai gdel 300 + 300
  const A = mk({ gdel: gids(0, 300) }), B = mk({ gdel: gids(1000, 300) });
  let m = null, err = null;
  try { m = mergeStates(null, A, B, true); } catch (e) { err = String(e); }
  ok("L1.10 mergeStates: gdel 300 + 300 khác nhau ra 600", m && len(m.gdel) === 600, err || (m && len(m.gdel)));
  // L1.11: idempotent
  const x = mk({ tasks: mkTasks(600), habits: [...mkHabits(150), { id: "hd", n: "Hằng ngày", kind: "tick", per: "day", ticks: days(1100) }] });
  const js = JSON.stringify(x);
  ok("L1.11 cleanState hai lần không đổi kết quả", js === JSON.stringify(cleanState(JSON.parse(js))), "khác nhau");
  // L1.12: dữ liệu cũ thiếu trường
  let e12 = null, r12 = null;
  try { r12 = cleanState({ ev: {}, caps: base().caps }); } catch (e) { e12 = String(e); }
  ok("L1.12 dữ liệu cũ thiếu tasks/projects/habits/gdel vẫn chạy", !e12 && r12 && len(r12.tasks) === 0 && len(r12.projects) === 0 && len(r12.habits) === 0 && len(r12.gdel) === 0, e12 || r12);

  const pass = out.filter(x => x.pass).length;
  return { pass, total: out.length, fail: out.filter(x => !x.pass) };
};
