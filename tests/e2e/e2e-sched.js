// E2E Xếp thông minh (Xếp hết). Chạy trên dữ liệu sạch (có hoặc không loadDemo).
window.E2ESCHED = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const D = ky(W[CW + 1]), Dn = n => ky(ad(new Date(D + "T00:00"), n));
  const cfg0 = JSON.stringify(S.cfg);
  const clear = () => { Object.keys(S.ev).forEach(k => { S.ev[k] = S.ev[k].filter(e => !/^TT /.test(e.t)); if (!S.ev[k].length) delete S.ev[k]; }); S.tasks = S.tasks.filter(t => !/^TT /.test(t.t)); };
  const ev = (date, s, h, c = "tc", t = "TT bận") => { (S.ev[date] = S.ev[date] || []).push({ t, c, m: "u", h, s }); sortL(S.ev[date]); };
  const task = (n, hs, extra = {}) => { const t = { id: nid("t"), t: "TT " + n, c: "kn", m: "u", subs: hs.map((h, i) => ({ id: nid("s"), t: "TT " + n + " " + (i + 1), h })), ...extra }; S.tasks.unshift(t); return t; };
  const L = t => units(t).filter(u => !u.done).map(u => ({ tk: u.tk, t: u.t, h: u.h }));
  const P = (t, d0 = D, m0 = 480) => planSmart(t, L(t), d0, m0);
  const at = r => r.out.map(p => p.date.slice(5) + " " + p.s).join(", ");
  const setCfg = (from, to, cap) => { S.cfg.schedFrom = from; S.cfg.schedTo = to; S.cfg.schedCap = cap; };
  const kn = S.caps.find(c => c.k === "kn"), tg0 = kn.tg;
  kn.tg = 0;

  // 1. Lách qua lịch bận, giữ thứ tự
  clear(); setCfg(480, 1320, 0);
  ev(D, "09:00", 1);
  let t = task("a", [1, 1, 1]), r = P(t);
  ok("1.1 lách qua 09:00–10:00", at(r) === `${D.slice(5)} 08:00, ${D.slice(5)} 10:00, ${D.slice(5)} 11:00`, at(r));
  clear(); ev(D, "08:00", 0.5); ev(D, "10:30", 11.5);
  t = task("b", [2, 0.5]); r = P(t);
  ok("1.2 giữ thứ tự: việc 2 không chen lên trước, sang ngày sau", at(r) === `${D.slice(5)} 08:30, ${Dn(1).slice(5)} 08:00`, at(r));

  // 2–3. Khung giờ, giới hạn mỗi ngày, rải nhiều ngày
  clear(); ev(D, "08:00", 13.5);
  t = task("c", [1]); r = P(t);
  ok("3.1 không xếp sau 22:00, sang ngày sau", at(r) === `${Dn(1).slice(5)} 08:00`, at(r));
  clear(); setCfg(480, 1320, 2);
  t = task("d", [1, 1, 1, 1]); r = P(t);
  ok("3.2 tối đa 2h/ngày: rải 2 ngày", r.mode === "ok" && at(r) === `${D.slice(5)} 08:00, ${D.slice(5)} 09:00, ${Dn(1).slice(5)} 08:00, ${Dn(1).slice(5)} 09:00`, at(r));
  clear(); t = task("e", [3]); r = P(t);
  ok("3.3 một việc dài hơn giới hạn vẫn xếp được trong ngày trống", r.out.length === 1 && r.left.length === 0, at(r));

  // 2. Hạn: chừa 1 ngày dự phòng; gấp thì dồn hết, hạn thắng cân bằng
  clear(); t = task("f", [1, 1, 1, 1], { due: Dn(3) }); r = P(t);
  ok("2.1 có hạn còn rộng: rải, xong trước hạn ≥1 ngày", r.mode === "ok" && r.out.every(p => p.date <= Dn(2)), [r.mode, at(r)]);
  clear(); t = task("g", [1, 1, 1, 1, 1, 1], { due: Dn(1) }); r = P(t);
  ok("2.2 hạn gấp: dồn hết vào 1 ngày, bỏ giới hạn 2h", r.mode === "rush" && r.out.every(p => p.date === D) && r.out.length === 6, [r.mode, at(r)]);
  clear(); t = task("h", Array(16).fill(1), { due: D }); r = P(t);
  ok("2.3 rất gấp: mở rộng khung 06:00–24:00", r.mode === "wide" && r.left.length === 0 && r.out[0].s === "06:00", [r.mode, r.left.length, at(r)]);
  clear(); t = task("i", Array(20).fill(1), { due: D }); r = P(t);
  ok("2.4 không kịp: báo thiếu, phần còn lại ở hộp", r.mode === "short" && r.left.length === 2 && r.out.length === 18, [r.mode, r.left.length]);
  clear(); t = task("j", [1, 1], { due: Dn(-2) }); r = P(t);
  ok("2.5 đã quá hạn: xếp sớm nhất", r.overdue && r.mode === "rush" && r.out[0].date === D, [r.mode, at(r)]);

  // 5. Cân bằng: để sau tuần vốn đã đạt mục tiêu; hạn đứng trên
  clear(); kn.tg = 3; ev(Dn(-1) < D ? D : D, "20:00", 1, "kn", "TT kn1"); ev(Dn(1), "20:00", 1, "kn", "TT kn2"); ev(Dn(2), "20:00", 1, "kn", "TT kn3");
  const nextW = ky(W[CW + 2]);
  t = task("k", [1, 1]); r = P(t);
  ok("5.1 tuần Kỹ năng đã đạt 3/3h: dời sang tuần sau", r.mode === "ok" && r.deferred > 0 && r.out.every(p => p.date >= nextW), [r.mode, r.deferred, at(r)]);
  t.due = Dn(3); r = P(t);
  ok("5.2 có hạn trong tuần đó: hạn thắng cân bằng", r.out.every(p => p.date < nextW && p.date <= Dn(3)) && r.left.length === 0, [r.mode, at(r)]);
  kn.tg = 0;

  // 7 + 6. Bảng Xếp lịch: đổi thứ tự, bỏ bớt, xếp, hoàn tác, xếp lại việc lỡ
  clear(); setCfg(480, 1320, 0);
  t = task("m", [1, 1, 1]);
  const [s1, s2, s3] = t.subs;
  openSched("task", t.id, D, "08:00"); await sleep(30);
  ok("7.1 mở bảng, 3 dòng xem trước", document.querySelectorAll("#schedBody .sch-row").length === 3);
  schedMove(s2.id, -1); await sleep(10);
  ok("7.2 đổi thứ tự: việc 2 lên đầu", schedTarget().all.map(u => u.tk).join() === [s2.id, s1.id, s3.id].join());
  schedSkip(s3.id, true); await sleep(10);
  ok("7.3 bỏ bớt việc 3", schedTarget().list.length === 2 && document.querySelector(`#schedBody [data-skip="${s3.id}"]`).checked === false);
  await confirmSched(); await sleep(30);
  const mp = schedMap();
  ok("7.4 xếp đúng thứ tự mới, việc 3 còn trong hộp", mp.get(s2.id) && mp.get(s1.id) && mp.get(s2.id).s === "08:00" && mp.get(s1.id).s === "09:00" && !mp.has(s3.id), [mp.get(s2.id), mp.get(s1.id)]);
  undoRun(); await sleep(20);
  ok("6.1 hoàn tác cả lần Xếp hết", !schedMap().has(s1.id) && !schedMap().has(s2.id));

  clear();
  const y = ky(ad(new Date(), -1));
  t = task("n", [1, 1]);
  ev(y, "08:00", 1, "kn", t.subs[0].t); S.ev[y].find(e => e.t === t.subs[0].t).tk = t.subs[0].id;
  ev(Dn(0), "08:00", 1, "kn", t.subs[1].t); S.ev[D].find(e => e.t === t.subs[1].t).tk = t.subs[1].id;
  ok("6.2 nhận ra việc lỡ hôm qua", missedOf(t, schedMap()).map(u => u.tk).join() === t.subs[0].id);
  switchTab("hv"); await sleep(40);
  const btn = [...document.querySelectorAll(".hv-sched")].find(b => b.getAttribute("onclick").includes(t.id));
  ok("6.3 Hộp việc hiện nút Xếp lại và nhãn lỡ", btn && btn.textContent === "Xếp lại" && btn.closest(".hv-task").textContent.includes("1 lỡ"), btn && btn.textContent);
  openSched("task", t.id); await sleep(30);
  ok("6.4 bảng chỉ có việc lỡ, có nhãn 'lỡ, xếp lại'", schedTarget().all.length === 1 && $("schedBody").textContent.includes("lỡ, xếp lại"));
  await confirmSched(); await sleep(30);
  const p0 = schedMap().get(t.subs[0].id);
  ok("6.5 buổi cũ bị gỡ, buổi mới từ bây giờ trở đi", p0 && (p0.date > ky(new Date()) || (p0.date === ky(new Date()) && toMin(p0.s) >= nowMin() - 15)) && !(S.ev[y] || []).some(e => e.tk === t.subs[0].id), p0);
  undoRun(); await sleep(20);
  ok("6.6 hoàn tác trả buổi cũ về hôm qua", schedMap().get(t.subs[0].id) && schedMap().get(t.subs[0].id).date === y);

  // Việc chưa chia nhỏ đã có giờ: Dời không còn báo "Không còn việc nhỏ để xếp"
  clear();
  t = { id: nid("t"), t: "TT single", c: "kn", m: "u", subs: [] }; S.tasks.unshift(t);
  ev(Dn(1), "10:00", 1, "kn", "TT single"); S.ev[Dn(1)].find(e => e.t === "TT single").tk = t.id;
  openSched("task", t.id); await sleep(20);
  ok("8.1 Dời việc chưa chia nhỏ mở bảng một việc", sch && sch.kind === "sub" && $("schedOverlay").classList.contains("open"));
  closeSched();

  // Cài đặt + làm sạch dữ liệu
  setCfg(420, 1260, 3);
  const cs = cleanState(JSON.parse(JSON.stringify(S)));
  ok("9.1 cài đặt xếp việc giữ qua làm sạch", cs.cfg.schedFrom === 420 && cs.cfg.schedTo === 1260 && cs.cfg.schedCap === 3, cs.cfg);
  const bad = cleanState({ ...JSON.parse(JSON.stringify(S)), cfg: { schedFrom: "x", schedTo: 99999, schedCap: -5 } });
  ok("9.2 giá trị lạ bị kẹp lại", bad.cfg.schedFrom === 480 && bad.cfg.schedTo === 1440 && bad.cfg.schedCap === 0, bad.cfg);
  openSettingsModal(); await sleep(30);
  ok("9.3 Cài đặt có khung giờ và tối đa mỗi ngày", $("setSchFrom") && $("setSchFrom").value === "420" && $("setSchCap").value === "3");
  closeSettingsModal();

  // 10. Bảng hiển thị gấp / không kịp
  clear(); setCfg(480, 1320, 2);
  t = task("p", [1, 1, 1, 1, 1, 1], { due: Dn(1) });
  openSched("task", t.id, D, "08:00"); await sleep(20);
  ok("10.1 bảng báo hạn gấp", $("schedBody").querySelector(".sch-note.warn") && /gấp/.test($("schedBody").textContent));
  closeSched();
  t = task("q", Array(20).fill(1), { due: D });
  openSched("task", t.id, D, "08:00"); await sleep(20);
  ok("10.2 bảng báo không kịp hạn", $("schedBody").querySelector(".sch-note.bad") && /Không kịp hạn/.test($("schedBody").textContent));
  closeSched();

  clear(); S.cfg = JSON.parse(cfg0); kn.tg = tg0; save(); draw();
  const fail = out.filter(x => !x.pass);
  return { pass: out.length - fail.length, total: out.length, fail };
};
