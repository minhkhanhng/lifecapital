// E2E Sức khỏe phần 2: mối liên hệ, check-in tối, chu kỳ theo giai đoạn, báo cáo, vận động, điểm Sẵn sàng.
window.E2EHL2 = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const D = n => hlKAdd(tk, n);
  const keep = JSON.stringify(S), ask0 = window.ask, sf0 = window.saveFile, pr0 = window.print;
  window.ask = async () => true;
  let saved = null; window.saveFile = async (n, c, m) => { saved = { n, c, m }; return true; };
  const ev = (k, t, h = 1, c = "sk", s = "06:00") => { (S.ev[k] = S.ev[k] || []).push({ t, c, m: "u", h, s }); sortL(S.ev[k]); };
  const fresh = () => { S.health = undefined; S.ev = {}; S.profile = { n: "Test", sex: "f", dob: "1992-01-01" }; };

  // 1. Mối liên hệ
  fresh();
  for (let j = 1; j <= 14; j++) {
    const k = D(-j), gym = j % 2 === 0, hop = j <= 5;
    hlSet(k, "mood", gym ? 5 : 3);
    if (gym) ev(k, "Gym");
    if (hop) { ev(k, "Họp dài", 3, "tc", "14:00"); if (j <= 4) hlSy(k, "dau"); }
    if (j === 9) hlSy(k, "dau");
  }
  let ins = hlInsights();
  const g = ins.find(x => x.kind === "mood" && /Gym/.test(x.t));
  ok("1.1 ngày có Gym tâm trạng cao hơn: 5/5 so với 3/5", g && g.good && /tâm trạng 5\/5, ngày khác 3\/5/.test(g.t), ins.map(x => x.t));
  const hd = ins.find(x => x.kind === "sy" && x.s === "dau" && /Họp dài/.test(x.t));
  ok("1.2 nhức đầu vào 4/5 ngày có Họp dài (80%), ngày khác 1/9", hd && !hd.good && /4\/5 ngày/.test(hd.t) && /80%/.test(hd.t) && /1\/9/.test(hd.t), hd);
  ev(D(-20), "Bơi"); ev(D(-21), "Bơi"); ev(D(-22), "Bơi"); [-20, -21, -22].forEach(o => hlSet(D(o), "mood", 1));
  ok("1.3 yếu tố dưới 4 ngày: không kết luận", !hlInsights().some(x => /Bơi/.test(x.t)));
  for (let j = 1; j <= 14; j++) hlSet(D(-j), "sleep", j <= 6 ? 5.5 : 8);
  ok("1.4 ngủ ít chỉ so với tâm trạng, không lặp với Điểm nổi bật", !hlInsights().some(x => x.key === "sl" && x.kind === "sy"));
  switchTab("hl"); hlGo("sum"); await sleep(20);
  ok("1.5 Tóm tắt có thẻ Điều ảnh hưởng tới bạn", /Điều ảnh hưởng tới bạn/.test($("v").textContent) && /Gym/.test($("v").textContent));
  hlGo("browse", "mh"); await sleep(10);
  ok("1.6 Tâm lý: mối liên hệ với tâm trạng", /Điều ảnh hưởng tới tâm trạng/.test($("v").textContent) && /Gym/.test($("v").textContent));

  // 2. Check-in tối
  fresh();
  hlCheckin(); await sleep(10);
  ok("2.1 check-in 4 bước khi không có thuốc", hlCiSteps().length === 4 && /Bước 1\/4/.test($("hlBody").textContent));
  $("hlBody").querySelector(".hl-m.m4").click(); await sleep(10);
  ok("2.2 chọn tâm trạng: lưu và sang bước 2", hlDay(tk).mood === 4 && /Có triệu chứng nào/.test($("hlBody").textContent));
  ok("2.3 chưa chọn triệu chứng: nút ghi Không có", $("hlDone").textContent === "Không có");
  $("hlDone").click(); await sleep(10);
  ok("2.4 sang bước giấc ngủ, căng thẳng", /Giấc ngủ và căng thẳng/.test($("hlBody").textContent));
  hlSet(tk, "sleep", 7.5); $("hlDone").click(); await sleep(10);
  ok("2.5 xong: chuỗi ngày, điểm Sẵn sàng", /Đã ghi xong/.test($("hlBody").textContent) && /Chuỗi check-in 1 ngày/.test($("hlBody").textContent) && /Sẵn sàng 100/.test($("hlBody").textContent), $("hlBody").textContent.slice(0, 200));
  closeHl();
  S.health.meds.push({ id: "mz", n: "Kẽm", kind: "sup", sched: "daily", times: 1, sd: D(-3) });
  hlCheckin(); ok("2.6 có thuốc: 5 bước", hlCiSteps().length === 5); closeHl();
  const gh = Date.prototype.getHours;
  Date.prototype.getHours = function () { return 20; };
  delete S.health.days[tk]; hlSet(D(-1), "mood", 3);
  try { localStorage.removeItem("lc_ci_skip"); } catch (e) {}
  sel = CW;
  ok("2.7 sau 19h chưa check-in: Lịch nhắc", /Check-in sức khỏe tối nay/.test(checkinNotice()));
  try { localStorage.setItem("lc_ci_skip", tk); } catch (e) {}
  ok("2.8 Để sau: hết nhắc hôm nay", checkinNotice() === "");
  Date.prototype.getHours = function () { return 10; };
  try { localStorage.removeItem("lc_ci_skip"); } catch (e) {}
  ok("2.9 trước 19h: không nhắc", checkinNotice() === "");
  Date.prototype.getHours = gh;
  switchTab("me"); await sleep(10);
  ok("2.10a giờ nhắc check-in nằm ở tab Tôi, dưới công tắc đồng bộ sức khỏe", !!$("hlCiTime") && $("hlCiTime").closest(".me-card") && /Nhắc check-in tối/.test($("hlCiTime").closest(".set-row").textContent));
  switchTab("hl"); hlGo("sum"); await sleep(10);
  ok("2.10b Tóm tắt không còn ô giờ nhắc", !$("hlCiTime"));
  switchTab("me"); await sleep(10);
  $("hlCiTime").value = "21:30";
  saved = null; await hlIcs();
  ok("2.10 tệp nhắc .ics: lặp mỗi ngày 21:30, có báo", saved && /\.ics$/.test(saved.n) && /RRULE:FREQ=DAILY/.test(saved.c) && new RegExp("DTSTART:" + tk.replace(/-/g, "") + "T213000").test(saved.c) && /BEGIN:VALARM/.test(saved.c), saved && saved.c.slice(0, 300));

  // 3. Chu kỳ: giai đoạn, tín hiệu rụng trứng, tiền kinh nguyệt, kín đáo
  fresh();
  const st = [D(-84), D(-56), D(-28)];
  st.forEach(s0 => { for (let i = 0; i < 5; i++) hlSet(hlKAdd(s0, i), "flow", 2); [-2, -1].forEach(o => hlSy(hlKAdd(s0, o), "dau")); });
  hlSet(D(-30), "mood", 3);
  let c = hlCycle();
  ok("3.1 3 kỳ cách 28 ngày: kỳ tới hôm nay", c.len === 28 && c.next === tk, c);
  ok("3.2 giai đoạn: hành kinh, nang noãn, rụng trứng, hoàng thể", hlPhase(D(-28), c) === "kinh" && hlPhase(D(-20), c) === "nang" && hlPhase(hlKAdd(D(-28), 14), c) === "rung" && hlPhase(D(-3), c) === "hoang", [D(-20), hlPhase(D(-20), c), hlPhase(hlKAdd(D(-28), 14), c), hlPhase(D(-3), c)]);
  const pms = hlPms();
  ok("3.3 nhức đầu trước kỳ kinh 3/3 kỳ", pms.some(x => x.s === "dau" && x.hit === 3 && x.of === 3) && hlAdvice().some(a => /Nhức đầu thường đến trước kỳ kinh/.test(a.t) && /3\/3 kỳ/.test(a.d)), pms);
  hlSet(D(-17), "lh", 2);
  c = hlCycle();
  ok("3.4 que LH dương ngày −17: rụng trứng −16, kỳ tới −2 (14 ngày sau)", c.src === "lh" && c.ovu === D(-16) && c.next === D(-2), c);
  hlSet(D(-17), "lh", null);
  [36.3, 36.3, 36.2, 36.3, 36.25, 36.3, 36.6, 36.65, 36.7, 36.6].forEach((t, i) => hlSet(D(-24 + i), "temp", t));
  c = hlCycle();
  ok("3.5 nhiệt độ tăng ≥0,2°C 3 ngày: rụng trứng trước đó 1 ngày", c.src === "bbt" && c.ovu === D(-19), [c.src, c.ovu, D(-19)]);
  hlOpen(D(-1)); await sleep(10);
  ok("3.6 bảng ngày có dịch, nhiệt độ, que LH", /Dịch âm đạo/.test($("hlBody").textContent) && /Nhiệt độ buổi sáng/.test($("hlBody").textContent) && /Que thử rụng trứng/.test($("hlBody").textContent));
  hlSetTemp(D(-1), "50"); ok("3.7 nhiệt độ vô lý bị từ chối", (hlDay(D(-1)) || {}).temp === undefined);
  hlSetTemp(D(-1), "36,55"); ok("3.8 nhiệt độ dấu phẩy được", hlDay(D(-1)).temp === 36.55);
  closeHl();
  // dự đoán + kín đáo trên Lịch
  Object.keys(S.health.days).forEach(k => { delete S.health.days[k].temp; });
  [D(-70), D(-42), D(-14)].forEach(s0 => { for (let i = 0; i < 4; i++) hlSet(hlKAdd(s0, i), "flow", 2); });
  hlSet(tk, "flow", 2);
  ok("3.9 chip ngày có chữ khi chưa kín đáo", /Hành kinh/.test(hlChips(tk, hlCycle())));
  hlH().disc = true;
  const chp = hlChips(tk, hlCycle());
  ok("3.10 kín đáo: chỉ chấm, không chữ", /hl-mini dot fl/.test(chp) && !/Hành kinh/.test(chp), chp);
  delete hlH().disc;

  // 4. Báo cáo cho bác sĩ, thẻ y tế
  fresh();
  hlMidSet("blood", "O+"); hlMidSet("allergy", "<i>Penicillin</i>"); hlMidSet("ec", "Mẹ 0912");
  S.health.meds.push({ id: "m1", n: "Sắt", kind: "med", dose: "1 viên", sched: "daily", times: 1, sd: D(-10) });
  for (let j = 1; j <= 10; j++) { if (j % 2) hlTake(D(-j), "m1", 1); hlSet(D(-j), "sleep", 7); }
  hlSy(D(-3), "dau"); hlSy(D(-3), "dau"); hlSy(D(-3), "dau"); hlSy(D(-5), "dau");
  hlSet(D(-3), "note", "đau sau họp <b>dài</b>");
  hlRepN = 30; hlReport(); await sleep(10);
  const rp = $("hlBody");
  ok("4.1 báo cáo 30 ngày: thông tin, thẻ y tế, thuốc có tỷ lệ, triệu chứng, ghi chú", /Báo cáo sức khỏe 30 ngày/.test(rp.textContent) && /O\+/.test(rp.textContent) && /Sắt/.test(rp.textContent) && /5\/10 liều \(50%\)/.test(rp.textContent) && /Nhức đầu\s*2\s*1/.test(rp.textContent.replace(/\s+/g, " ")) && /đau sau họp <b>dài<\/b>/.test(rp.textContent), rp.textContent.replace(/\s+/g, " ").slice(0, 900));
  ok("4.2 chữ người dùng không thành mã HTML", !rp.querySelector(".hl-rep i") && !rp.querySelector(".hl-rep li b + b"));
  hlRepN = 90; hlRender(); ok("4.3 đổi 90 ngày", /Báo cáo sức khỏe 90 ngày/.test($("hlBody").textContent)); hlRepN = 30;
  saved = null; await hlRepSave();
  ok("4.4 lưu tệp HTML độc lập", saved && /\.html$/.test(saved.n) && /^<!doctype html>/.test(saved.c) && /Báo cáo sức khỏe/.test(saved.c));
  let printed = false; window.print = () => { printed = document.body.classList.contains("printing-rep"); };
  hlRepPrint(); window.dispatchEvent(new Event("afterprint"));
  ok("4.5 In, lưu PDF: chỉ in báo cáo, xong thì trả lại", printed && !document.body.classList.contains("printing-rep"));
  closeHl();
  switchTab("me"); await sleep(10);
  ok("4.6 tab Tôi có Thẻ y tế khẩn cấp, giá trị đã lưu", /Thẻ y tế khẩn cấp/.test($("v").textContent) && $("meBlood").value === "O+" && $("meAllergy").value === "<i>Penicillin</i>");
  hlMidSet("blood", ""); hlMidSet("allergy", ""); hlMidSet("ec", "");
  ok("4.7 xóa hết thẻ y tế: không còn mục rỗng", !S.health.mid);
  hlMidSet("cond", "Hen");
  const off = JSON.parse(JSON.stringify(S)); off.profile.hSync = false;
  ok("4.8 thẻ y tế theo công tắc đồng bộ sức khỏe", !JSON.parse(canonState(cloudView(off))).health && JSON.parse(canonState(cloudView(S))).health.mid.cond === "Hen");

  // 5. Vận động, điểm Sẵn sàng
  ok("5.1 nhận đúng hoạt động vận động", ["Gym", "Chạy bộ 5km", "đá bóng", "Đi bộ", "Bơi", "Yoga sáng", "Đạp xe"].every(hlIsAct) && !["Tập trung", "Đi chợ", "Họp", "Bóng đèn hỏng"].some(hlIsAct), ["Tập trung", "Đi chợ", "Họp", "Bóng đèn hỏng"].filter(hlIsAct));
  fresh();
  const mon = monKey(tk);
  ev(mon, "Gym", 1); ev(mon, "Họp", 2, "tc"); if (hlKAdd(mon, 1) <= tk) ev(hlKAdd(mon, 1), "Chạy bộ", 0.5);
  ev(hlKAdd(tk, 1), "Bơi", 1);
  const am = hlActWeek().reduce((a, x) => a + x.min, 0);
  ok("5.2 phút vận động tuần này, không tính ngày tới", am === (hlKAdd(mon, 1) <= tk ? 90 : 60), am);
  hlSet(tk, "sleep", 7.5);
  let r = hlReady();
  ok("5.3 ngủ 7,5h, không triệu chứng: 100 Sẵn sàng", r.v === 100 && r.lv[0] === "Sẵn sàng", r);
  hlSet(tk, "sleep", 6); hlSy(tk, "met"); hlSy(tk, "met");
  r = hlReady();
  ok("5.4 ngủ 6h + mệt mỏi vừa: 49 Nên nhẹ nhàng, nêu lý do", r.v === 49 && r.lv[0] === "Nên nhẹ nhàng" && r.why.includes("1 triệu chứng hôm nay"), r);
  ok("5.5 cảnh báo nên nhẹ nhàng ở Điểm nổi bật", hlAdvice().some(a => /Điểm Sẵn sàng hôm nay 49/.test(a.t)));
  [-1, -2].forEach(o => hlSet(D(o), "sleep", 5));
  ok("5.6 thiếu ngủ mấy đêm liền: trừ thêm", hlReady().v === 39 && hlReady().why.includes("thiếu ngủ mấy đêm liền"), hlReady());
  delete S.health.days[tk].sleep; hlTouch(tk);
  ok("5.7 chưa ghi giờ ngủ: chưa tính", hlReady() === null);
  hlSet(tk, "sleep", 6);
  // Xếp thông minh: hôm nay điểm thấp → tối đa một nửa
  const cfg0 = JSON.stringify(S.cfg);
  S.cfg.schedFrom = 0; S.cfg.schedTo = 1440; S.cfg.schedCap = 2;
  const tt = { id: "tz", c: "kn", subs: [] };
  const rr = planSmart(tt, [1, 2, 3].map(i => ({ tk: "z" + i, t: "z" + i, h: 0.5 })), tk, Math.min(1380, nowMin()));
  const todayH = rr.out.filter(p => p.date === tk).reduce((a, p) => a + p.h, 0);
  ok("5.8 điểm thấp: hôm nay xếp tối đa 1h (một nửa 2h)", todayH <= 1 && rr.ready && rr.ready.v < 50, [todayH, rr.out.map(p => p.date + " " + p.s)]);
  ok("5.9 ghi chú bảng Xếp hết nói rõ", /điểm Sẵn sàng \d+: chỉ xếp tối đa 1h/.test(schedNote(rr, { c: "kn" })), schedNote(rr, { c: "kn" }));
  S.cfg = JSON.parse(cfg0);
  switchTab("ca"); calSubView = "focus"; sel = CW; draw(); await sleep(10);
  ok("5.10 thẻ hôm nay có chip Sẵn sàng", /Sẵn sàng \d+/.test((document.querySelector(".day-card.today .hl-day") || {}).textContent || ""));
  openWeeklyReviewModal(CW); await sleep(10);
  ok("5.11 Tổng kết tuần có vận động", /Vận động \d+\/150 phút/.test($("reviewSheetBody").textContent));
  closeReviewModal();
  switchTab("hl"); hlGo("browse", "ac"); await sleep(10);
  ok("5.12 Duyệt › Vận động: vòng tuần, 8 tuần, danh sách buổi", /Tuần này: \d+\/150 phút/.test($("v").textContent) && /8 tuần gần nhất/.test($("v").textContent) && /Gym/.test($("v").textContent));
  hlGo("sum"); await sleep(10);
  const cards = [...document.querySelectorAll("#v .hl > .card")];
  ok("5.13 Tóm tắt: Hôm nay đứng đầu, rồi thẻ Sẵn sàng (khi tính được), có Báo cáo", cards[0] && cards[0].classList.contains("hl-today") && (!hlReady() ? !document.querySelector(".hl-ready") : cards[1].classList.contains("hl-ready")) && /Báo cáo cho bác sĩ/.test($("v").textContent), cards.map(c => c.className));
  const gh2 = Date.prototype.getHours;
  const m0 = (hlDay(tk) || {}).mood;
  Date.prototype.getHours = function () { return 20; }; delete hlGet(tk).mood; draw();
  ok("5.14 sau 19h chưa ghi tâm trạng: thẻ Hôm nay có nút Check-in tối", [...document.querySelectorAll("#v .hl-today button")].some(b => b.textContent === "Check-in tối"));
  Date.prototype.getHours = function () { return 10; }; draw();
  ok("5.15 ban ngày: không có nút Check-in, không có Ghi chi tiết (dùng nút Thêm)", ![...document.querySelectorAll("#v button")].some(b => /^(Check-in tối|Ghi chi tiết)$/.test(b.textContent)));
  Date.prototype.getHours = gh2; if (m0) hlGet(tk).mood = m0; draw();

  // 6. Làm sạch, gộp
  const dirty = cleanHealth({ days: { [tk]: { temp: 99, mucus: 7, lh: 3, mood: 3 } }, mid: { blood: "Z", allergy: " x ", ec: 5 }, disc: 1 });
  ok("6.1 làm sạch tín hiệu và thẻ y tế", dirty.days[tk].temp === undefined && dirty.days[tk].mucus === undefined && dirty.days[tk].lh === undefined && !dirty.mid.blood && dirty.mid.allergy === "x" && !dirty.mid.ec && dirty.disc === true, dirty);
  const B = { days: {}, meds: [], syc: [], chk: {}, cyc: {} }, M = { ...B, mid: { blood: "A+", mt: 5 } }, T = { ...B, disc: true };
  const mm = mergeHealth(B, M, T, true);
  ok("6.2 gộp: thẻ y tế một bên, kín đáo bên kia đều giữ", mm.mid && mm.mid.blood === "A+" && mm.disc === true, mm);

  S = JSON.parse(keep); Object.values(S.ev).forEach(sortL);
  window.ask = ask0; window.saveFile = sf0; window.print = pr0;
  save(); switchTab("ca"); draw();
  const fail = out.filter(x => !x.pass);
  return { pass: out.length - fail.length, total: out.length, fail };
};
