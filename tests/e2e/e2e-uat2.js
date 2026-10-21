// Đi đúng từng bước UAT H1–H8, I1–I7, J1–J5 như người test, rồi các trường hợp biên.
window.E2EUAT2 = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const T0 = new Date(tk + "T00:00"), D = n => ky(ad(T0, n)), wk0 = monKey(tk), W0 = n => ky(ad(new Date(wk0 + "T00:00"), n));
  const dow = (T0.getDay() + 6) % 7;
  const nl = $("nlpInput");
  const quick = async txt => { nl.value = txt; handleNLPInput(txt); await executeNLP(); await sleep(60); };
  const rows = () => [...document.querySelectorAll("#schedBody .sch-row")].map(r => r.innerText.replace(/\s+/g, " ").trim());
  const note = () => ($("schedBody").querySelector(".sch-note") || {}).className + " | " + ($("schedBody").querySelector(".sch-note") || {}).textContent;
  const chipOf = n => [...document.querySelectorAll(".hb-chip")].find(c => c.querySelector(".hb-n") && c.querySelector(".hb-n").textContent === n);
  const evAt = (k, s, h, t, c = "tc") => { (S.ev[k] = S.ev[k] || []).push({ t, c, m: "u", h, s }); sortL(S.ev[k]); };
  const cfg0 = JSON.stringify(S.cfg), caps0 = JSON.stringify(S.caps);
  const asked = [], ask0 = window.ask;
  window.ask = async o => { asked.push(o && o.title); return true; }; // người test bấm đồng ý mọi hộp hỏi
  switchTab("ca"); calSubView = "focus"; sel = CW; draw();

  // ===== H1
  if (!(S.ev[D(1)] || []).some(e => e.s === "09:00")) evAt(D(1), "09:00", 1, "UAT họp sáng");
  await quick("+ Thử xếp");
  const tx = S.tasks.find(t => t.t === "Thử xếp");
  ok("H1.0 + Thử xếp tạo việc trong Hộp việc", !!tx);
  ["Bước 1 1h", "Bước 2 1h", "Bước 3 1h"].forEach(x => addSub(tx.id, x));
  ok("H1.1 3 việc nhỏ 1h, tên đúng", tx.subs.map(s => s.t + ":" + s.h).join() === "Bước 1:1,Bước 2:1,Bước 3:1", tx.subs);
  const [b1, b2, b3] = tx.subs;
  openSched("task", tx.id); await sleep(20);
  schedSet("date", D(1)); schedSet("start", "08:00"); await sleep(10);
  let r = planSmart(tx, schedTarget().list, D(1), 480), at = Object.fromEntries(r.out.map(p => [p.tk, p.date + " " + p.s]));
  const busyT = (S.ev[D(1)] || []).filter(e => e.s && !e.tk);
  const freeAt8 = !busyT.some(e => toMin(e.s) < 540 && toMin(e.s) + e.h * 60 > 480);
  ok("H1.2 không bước nào đè lịch bận", r.out.every(p => !(S.ev[p.date] || []).some(e => e.s && !e.tk && toMin(e.s) < toMin(p.s) + p.h * 60 && toMin(p.s) < toMin(e.s) + e.h * 60)), r.out);
  // Bước 2 bắt đầu ngay khi buổi 9h kết thúc (buổi 9h có thể là họp 1h test tự thêm, hoặc buổi dài của dữ liệu mẫu, vd thứ 5: 09:00–17:00)
  const e9 = (S.ev[D(1)] || []).filter(e => e.s === "09:00" && !e.tk).sort((x, y) => y.h - x.h)[0];
  const after9 = e9 ? hmOf(540 + e9.h * 60) : "10:00";
  ok("H1.3 Bước 1 08:00, Bước 2 ngay sau buổi 9h (lách lịch bận), Bước 3 sang ngày kia", !freeAt8 || (at[b1.id] === D(1) + " 08:00" && at[b2.id] === D(1) + " " + after9 && at[b3.id].startsWith(D(2))), [at, after9]);
  ok("H1.4 ghi chú 'Rải trong 08:00–22:00, tối đa 2h/ngày'", /Rải trong 08:00–22:00, tối đa 2h\/ngày/.test(note()), note());
  ok("H1.5 không còn nhãn trùng", !/trùng/.test($("schedBody").textContent));
  closeSched();

  // ===== H2
  pjSetDue(tx.id, D(1));
  openSched("task", tx.id); schedSet("date", D(1)); schedSet("start", "08:00"); await sleep(10);
  r = planSmart(tx, schedTarget().list, D(1), 480);
  ok("H2.1 ghi chú cam 'Hạn … gấp: dồn làm sớm nhất cho kịp hạn, bỏ giới hạn mỗi ngày'", /warn/.test(note()) && /Hạn \d\d\/\d\d gấp: dồn làm sớm nhất cho kịp hạn, bỏ giới hạn mỗi ngày/.test(note()), note());
  ok("H2.2 cả 3 bước trong ngày mai, không sau hạn", r.out.length === 3 && r.out.every(p => p.date === D(1)), r.out.map(p => p.date + " " + p.s));
  closeSched();

  // ===== H3
  addSub(tx.id, "Việc lớn 8h"); addSub(tx.id, "Việc lớn 8h");
  ok("H3.0 việc nhỏ 8h", tx.subs.filter(s => s.h === 8).length === 2);
  openSched("task", tx.id); schedSet("date", D(1)); await sleep(10);
  ok("H3.1 ghi chú đỏ 'Không kịp hạn … chưa có chỗ trước hạn, giữ lại trong hộp'", /bad/.test(note()) && /Không kịp hạn \d\d\/\d\d: .*chưa có chỗ trước hạn, giữ lại trong hộp/.test(note()), note());
  ok("H3.2 dòng không có chỗ ghi 'Chưa có chỗ'", rows().some(x => x.startsWith("Chưa có chỗ")), rows());
  closeSched();

  // ===== H4
  const kn = S.caps.find(c => c.k === "kn"), tg0 = kn.tg;
  kn.tg = 1;
  if (wk(CW, "kn") < 1) await quick("Hôm nay 21h đọc sách 1 tiếng");
  ok("H4.0 tuần này đã có ≥1h Kỹ năng", wk(CW, "kn") >= 1, wk(CW, "kn"));
  await quick("+ Học từ vựng");
  const tv = S.tasks.find(t => t.t === "Học từ vựng");
  setTaskField(tv.id, "c", "kn"); addSub(tv.id, "Ôn 1h");
  openSched("task", tv.id); schedSet("date", tk); await sleep(10);
  r = planSmart(tv, schedTarget().list, tk, toMin(sch.start));
  const nextW = ky(ad(new Date(wk0 + "T00:00"), 7));
  ok("H4.1 Ôn xếp vào tuần sau", r.out.length === 1 && r.out[0].date >= nextW, r.out);
  ok("H4.2 ghi chú 'Để sau … tuần Kỹ năng đã đạt mục tiêu'", /Để sau \d+ ngày thuộc tuần Kỹ năng đã đạt mục tiêu/.test(note()), note());
  closeSched();
  if (dow < 6) {
    pjSetDue(tv.id, D(1));
    openSched("task", tv.id); schedSet("date", tk); await sleep(10);
    r = planSmart(tv, schedTarget().list, tk, toMin(sch.start));
    ok("H4.3 đặt hạn trong tuần: xếp trong tuần này (hạn thắng cân bằng)", r.out.length === 1 && r.out[0].date < nextW && r.out[0].date <= D(1), r.out);
    closeSched();
  }
  kn.tg = tg0;

  // ===== H5
  for (const s of tx.subs.filter(s => s.h === 8)) await deleteSub(s.id);
  pjSetDue(tx.id, "");
  ok("H5.0 còn 3 bước, không hạn", tx.subs.length === 3 && !tx.due);
  openSched("task", tx.id); await sleep(10);
  schedMove(b1.id, 1); schedSkip(b3.id, true); await sleep(10);
  ok("H5.1 xem trước: Bước 2 trước Bước 1, Bước 3 'Bỏ qua'", /Bước 2/.test(rows()[0]) && /Bước 1/.test(rows()[1]) && rows()[2].startsWith("Bỏ qua"), rows());
  await confirmSched(); await sleep(30);
  let mp = schedMap();
  ok("H5.2 chỉ Bước 2, 1 lên lịch; Bước 3 còn trong hộp", mp.has(b2.id) && mp.has(b1.id) && !mp.has(b3.id) && (mp.get(b2.id).date + mp.get(b2.id).s) < (mp.get(b1.id).date + mp.get(b1.id).s));
  ok("H5.3 thông báo có Hoàn tác", [...document.querySelectorAll(".toast")].some(t => /Đã xếp 2 việc/.test(t.textContent) && /Hoàn tác/.test(t.textContent)));
  undoRun(); await sleep(20);
  mp = schedMap();
  ok("H5.4 Hoàn tác gỡ cả hai", !mp.has(b1.id) && !mp.has(b2.id));

  // ===== H6
  await scheduleSub(b1.id, D(-1), "08:00"); await sleep(20);
  switchTab("hv"); await sleep(30);
  const card = [...document.querySelectorAll(".hv-task")].find(c => c.textContent.includes("Thử xếp"));
  ok("H6.1 dòng việc có '1 lỡ'", card && /1 lỡ/.test(card.textContent));
  ok("H6.2 còn bước chưa xếp nên nút vẫn là 'Xếp hết'", card && card.querySelector(".hv-sched").textContent === "Xếp hết");
  openSched("task", tx.id); await sleep(10);
  ok("H6.3 xem trước có nhãn 'lỡ, xếp lại'", /lỡ, xếp lại/.test($("schedBody").textContent));
  await confirmSched(); await sleep(30);
  const p1 = schedMap().get(b1.id);
  ok("H6.4 buổi hôm qua biến mất, Bước 1 có giờ từ bây giờ", p1 && p1.date >= tk && !(S.ev[D(-1)] || []).some(e => e.tk === b1.id), p1);
  undoRun(); await sleep(10);
  // chỉ còn việc lỡ → nút Xếp lại
  unschedule([b1.id, b2.id, b3.id], false);
  await scheduleSub(b1.id, D(-1), "08:00"); await scheduleSub(b2.id, D(2), "08:00"); await scheduleSub(b3.id, D(3), "08:00");
  draw(); await sleep(20);
  const card2 = [...document.querySelectorAll(".hv-task")].find(c => c.textContent.includes("Thử xếp"));
  ok("H6.5 không còn bước chưa xếp: nút 'Xếp lại'", card2 && card2.querySelector(".hv-sched").textContent === "Xếp lại", card2 && card2.querySelector(".hv-sched").textContent);
  switchTab("ca");

  // ===== H7
  setSchedCfg("schedFrom", 540); setSchedCfg("schedTo", 1260); setSchedCfg("schedCap", 3);
  const t4 = addTask("UAT bốn việc"); ["A 1h", "B 1h", "C 1h", "D 1h"].forEach(x => addSub(t4.id, x));
  r = planSmart(t4, units(t4).map(u => ({ tk: u.tk, t: u.t, h: u.h })), D(1), 540);
  ok("H7.1 không trước 09:00, không sau 21:00, ngày đầu ≤3 việc", r.out.every(p => toMin(p.s) >= 540 && toMin(p.s) + p.h * 60 <= 1260) && r.out.filter(p => p.date === D(1)).length <= 3, r.out.map(p => p.date + " " + p.s));
  openSettingsModal(); await sleep(20);
  ok("H7.2 tóm tắt Mặc định ghi 'xếp 09:00–21:00'", /xếp 09:00–21:00/.test($("settingsSheetBody").textContent));
  closeSettingsModal();
  S.cfg = JSON.parse(cfg0);

  // ===== I1
  openEditor(tk); await sleep(30);
  $("inpTitle").value = "Đi bộ"; handleTitleInput && handleTitleInput("Đi bộ");
  const freeS = gapAt(tk, 360, 1440, 0.5, new Set());
  $("inpStart").value = hmOf(freeS); $("inpHours").value = "0.5";
  $("inpHabit").checked = true;
  await saveEventFromForm(); await sleep(40);
  const hd = (S.habits || []).find(h => h.n === "Đi bộ");
  draw(); await sleep(20);
  let ch = chipOf("Đi bộ");
  ok("I1.1 chip 'Đi bộ': chấm hôm nay tô, '0 tuần', '1/3'", hd && ch && /0\s*tuần/.test(ch.textContent) && /1\/3/.test(ch.textContent) && ch.querySelectorAll(".hb-dot.on.today").length === 1, ch && ch.textContent);
  ok("I1.2 thẻ hoạt động có dấu ✓", [...document.querySelectorAll(".event-item")].some(x => x.textContent.includes("Đi bộ") && x.querySelector(".ev-hb")));
  openEditor(tk, S.ev[tk].findIndex(e => e.t === "Đi bộ")); await sleep(20);
  ok("I1.3 popup ghi 'Thuộc thói quen Đi bộ'", /Thuộc thói quen Đi bộ/.test($("sheetBody").textContent));
  closeEditor();

  // ===== I2
  [0, 2, 4].forEach(j => evAt(W0(-7 + j), "07:00", 0.5, "đi bo", "sk"));
  draw(); await sleep(20); ch = chipOf("Đi bộ");
  ok("I2.1 buổi không dấu được đếm; chip '1 tuần' dù tuần này 1/3", ch && /1\s*tuần/.test(ch.textContent) && /1\/3/.test(ch.textContent), ch && ch.textContent);
  hbOpen(hd.id); await sleep(20);
  const hbT = $("hbBody").textContent;
  ok("I2.2 bảng: Chuỗi 1 tuần, Kỷ lục 1 tuần, Tuần này 1/3 lần", /Chuỗi\s*1 tuần/.test(hbT) && /Kỷ lục\s*1 tuần/.test(hbT) && /Tuần này\s*1\/3 lần/.test(hbT), hbT.slice(0, 120));
  ok("I2.3 lưới 26 tuần tô đủ 4 ngày", $("hbBody").querySelectorAll(".hb-hcol i.on").length === 4);
  closeHb();

  // ===== I3
  hbOpen(); await sleep(20);
  $("hbName").value = "UAT Uống nước"; hbSet("n", "UAT Uống nước"); hbSet("kind", "tick"); hbSet("per", "day");
  hbSave(); await sleep(20);
  const hw = (S.habits || []).find(h => h.n === "UAT Uống nước");
  ch = chipOf("UAT Uống nước");
  ok("I3.1 chip tích tay có nút ✓", hw && hw.kind === "tick" && hw.per === "day" && ch && ch.querySelector(".hb-tick"));
  ch.querySelector(".hb-tick").click(); await sleep(10);
  ok("I3.2 ✓ tô màu khi đã tích", chipOf("UAT Uống nước").querySelector(".hb-tick").getAttribute("aria-pressed") === "true");
  chipOf("UAT Uống nước").querySelector(".hb-tick").click(); await sleep(10);
  ok("I3.3 bấm lại thì bỏ", chipOf("UAT Uống nước").querySelector(".hb-tick").getAttribute("aria-pressed") === "false");
  hbOpen(hw.id); await sleep(20);
  const dayBtns = [...$("hbBody").querySelectorAll("button.hb-dot")];
  ok("I3.4 'Tuần này': chỉ ngày đã qua và hôm nay bấm được", dayBtns.length === dow + 1 && $("hbBody").querySelectorAll("i.hb-dot").length === 6 - dow, [dayBtns.length, dow]);
  if (dow >= 2) {
    hbTick(hw.id, D(-2)); hbTick(hw.id, tk);
    let st = hbStats(findHb(hw.id));
    ok("I3.5 bỏ trống 1 ngày giữa tuần không đứt chuỗi", st.cur === 2, st);
  }
  closeHb();

  // ===== I4
  try { localStorage.removeItem("lc_hb_dis"); } catch (e) {}
  const dsDays = new Set(Object.keys(S.ev).filter(k => k >= D(-13) && k <= tk && S.ev[k].some(e => hbFold(e.t) === "docsach")));
  for (let j = 1; dsDays.size < 3 && j < 14; j++) if (!dsDays.has(D(-j))) { evAt(D(-j), "22:00", 0.5, "Đọc sách", "kn"); dsDays.add(D(-j)); }
  draw(); await sleep(20);
  const sugEl = document.querySelector(".hb-sug");
  ok("I4.1 dải hiện 'Gợi ý: Đọc sách · n ngày trong 2 tuần'", sugEl && /Gợi ý: Đọc sách · \d+ ngày trong 2 tuần/.test(sugEl.textContent) || (S.habits || []).some(h => hbKey(h) === "docsach"), sugEl && sugEl.textContent);
  if (sugEl && /Đọc sách/.test(sugEl.textContent)) {
    sugEl.querySelector(".btn-primary").click(); await sleep(20);
    const hds = (S.habits || []).find(h => hbKey(h) === "docsach");
    ok("I4.2 Theo dõi: 3 lần/tuần, vốn Kỹ năng", hds && hds.tgt === 3 && hds.c === "kn", hds);
  }
  [1, 2, 3].forEach(j => evAt(D(-j), "23:00", 0.5, "Vẽ tranh", "kn"));
  draw(); await sleep(20);
  const sug2 = document.querySelector(".hb-sug");
  if (sug2 && /Vẽ tranh/.test(sug2.textContent)) {
    sug2.querySelector(".btn-ghost").click(); await sleep(20);
    ok("I4.3 Bỏ qua: gợi ý biến mất, không hiện lại", !document.querySelector(".hb-sug") || !/Vẽ tranh/.test(document.querySelector(".hb-sug").textContent));
  } else ok("I4.3 gợi ý Vẽ tranh hiện (sau khi gợi ý trước đã xử lý)", false, sug2 && sug2.textContent);

  // ===== I5
  hbOpen(hd.id); hbSet("tgt", 4); hbSave(); await sleep(20);
  ok("I5.1 chip ghi '/4'", /\/4/.test(chipOf("Đi bộ").textContent));
  hbOpen(hd.id); await sleep(20);
  const planBtn = [...$("hbBody").querySelectorAll("button")].find(b => b.textContent === "Xếp 1 buổi");
  ok("I5.2 có nút 'Xếp 1 buổi'", !!planBtn);
  planBtn && planBtn.click(); await sleep(150);
  ok("I5.3 popup thêm hoạt động điền sẵn tên, loại vốn, giờ trống", $("modalOverlay").classList.contains("open") && hbFold($("inpTitle").value) === "dibo" && $("inpCap").value === hd.c && /^\d\d:\d\d$/.test($("inpStart").value) && !chkEvent(ed, $("inpStart").value, +$("inpHours").value, -1).hit, [$("inpTitle").value, $("inpStart").value]);
  closeEditor();
  hbOpen(hd.id); hbArchive(hd.id); await sleep(20);
  ok("I5.4 Lưu trữ ẩn chip", !chipOf("Đi bộ"));
  switchTab("set"); await sleep(30);
  ok("I5.5 tab Vốn: 'Xem đã lưu trữ (1)'", /Xem đã lưu trữ \(1\)/.test($("v").textContent), ($("v").textContent.match(/đã lưu trữ \(\d+\)/) || [])[0]);
  hbArchive(hd.id); hbDelete(hd.id); await sleep(10);
  ok("I5.6 xóa", !findHb(hd.id));
  undoRun(); await sleep(10);
  ok("I5.7 Hoàn tác: trở lại đủ lịch sử", findHb(hd.id) && hbStats(findHb(hd.id)).total >= 4);
  switchTab("ca");

  // ===== I6
  openWeeklyReviewModal(CW); await sleep(20);
  ok("I6.1 Tổng kết: thẻ Thói quen, mỗi dòng tên, số lần, chuỗi, kỷ lục", [...$("v").querySelectorAll(".hb-row")].some(r => /Đi bộ/.test(r.textContent) && /\d+\/4 lần/.test(r.textContent) && /chuỗi \d+ tuần · kỷ lục \d+/.test(r.textContent)));
  switchTab("ca");
  openWeeklyReviewModal(CW - 2); await sleep(20);
  const miss = [...$("v").querySelectorAll(".hb-row")].find(r => /Đi bộ/.test(r.textContent));
  ok("I6.2 tuần đã qua chưa đạt: số lần màu cam", miss && miss.querySelector(".hb-miss"));
  switchTab("ca");
  switchTab("su"); await sleep(20);
  ok("I6.3 Tổng quan có thẻ Thói quen", [...document.querySelectorAll("#v .card-title")].some(x => x.textContent === "Thói quen"));
  switchTab("ca");

  // ===== J2–J4
  const caps1 = JSON.stringify(S.caps);
  S.caps.forEach((c, i) => { c.tg = [5, 5, 4, 5, 20][i] || 5; });
  const tc0 = wk(CW, "tc");
  await quick("Hôm nay 20h họp 2 tiếng");
  const added = (S.ev[tk] || []).some(e => e.t === "họp" && e.s === "20:00");
  ok("J2.1 'họp' cộng 2 giờ vào Tài chính / công việc", !added || wk(CW, "tc") === tc0 + 2, [added, tc0, wk(CW, "tc")]);
  switchTab("su"); await sleep(20);
  const th = [...document.querySelectorAll("#v .sum-table th")].map(x => x.textContent.trim());
  ok("J2.2 bảng giờ theo loại vốn: một cột giờ, không 'Ròng'", !/Ròng/.test($("v").textContent) && th.includes("Mục tiêu"), th);
  switchTab("ca"); await sleep(20);
  const b = balanceOf(CW), weakEl = document.querySelector("#v .cap-s.weak");
  ok("J3.1 tổng kết theo loại vốn: điểm cân bằng và vốn yếu nhất khớp bánh xe", document.querySelector("#v .cap-sum-h").textContent.includes("cân bằng " + b.score + "%") && weakEl && weakEl.querySelector(".cap-s-n").textContent === b.weakest.c.n, [document.querySelector("#v .cap-sum-h").textContent, weakEl && weakEl.textContent]);
  switchTab("su"); await sleep(20);
  ok("J3.2 dưới bánh xe cùng điểm", new RegExp("Điểm cân bằng:\\s*" + b.score + "%").test($("v").textContent));
  switchTab("ca");
  S.caps.forEach(c => { c.tg = 0; }); draw();
  ok("J3.3 chưa đặt mục tiêu: vẫn đủ giờ từng vốn, không thanh mục tiêu, không ghi cân bằng", document.querySelectorAll("#v .cap-s").length === S.caps.length && !document.querySelector("#v .cap-s-bar") && !/cân bằng/.test(document.querySelector("#v .cap-sum-h").textContent));
  S.caps = JSON.parse(caps1); draw();

  // ===== Trường hợp biên
  // XSS trong tên
  const bad = '<img src=x onerror="window.__xss=1">';
  hbAdd({ n: bad, c: "sk", kind: "tick", per: "week", tgt: 2 });
  const tb = addTask(bad); addSub(tb.id, bad + " 1h");
  draw(); openSched("task", tb.id); await sleep(20); closeSched();
  openWeeklyReviewModal(CW); await sleep(10); switchTab("ca");
  switchTab("set"); await sleep(10); switchTab("ca"); await sleep(10);
  ok("B1 tên có mã HTML được hiển thị như chữ ở mọi nơi", !window.__xss && !document.querySelector('img[src="x"]'));
  S.habits = S.habits.filter(h => h.n !== bad); S.tasks = S.tasks.filter(t => t.t !== bad);
  // Gõ có dấu + Enter trong ô tên thói quen: thêm đúng một lần
  hbOpen(); await sleep(20);
  const inp = $("hbName"); inp.focus(); inp.value = "Thiền sáng"; hbSet("n", "Thiền sáng");
  const n0 = S.habits.length;
  inp.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", keyCode: 229, isComposing: true, bubbles: true }));
  await sleep(20);
  ok("B2.1 Enter khi còn đang gõ dấu: chưa lưu", S.habits.length === n0 && $("hbOverlay").classList.contains("open"));
  document.dispatchEvent(new CompositionEvent("compositionend", { data: "" }));
  inp.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", keyCode: 13, bubbles: true }));
  await sleep(400);
  ok("B2.2 sau khi chốt chữ: lưu đúng 1 thói quen", S.habits.length === n0 + 1 && S.habits.filter(h => h.n === "Thiền sáng").length === 1, S.habits.length - n0);
  // Xếp qua năm mới
  const ty = { id: "tyx", t: "UAT cuối năm", c: "kn", subs: [], due: "2027-01-02" };
  const rY = planSmart(ty, [1, 2, 3, 4].map(i => ({ tk: "y" + i, t: "y" + i, h: 2 })), "2026-12-30", 480);
  ok("B3 xếp qua năm mới, trước hạn", rY.left.length === 0 && rY.out.every(p => p.date <= "2027-01-02") && rY.out.some(p => p.date.startsWith("2027")) || rY.out.every(p => p.date <= "2027-01-01"), rY.out.map(p => p.date + " " + p.s));
  // Bắt đầu 23:30 hôm nay
  const rL = planSmart({ id: "x", c: "kn", subs: [] }, [{ tk: "l1", t: "l1", h: 1 }], tk, 1410);
  ok("B4 bắt đầu 23:30: sang ngày sau", rL.out.length === 1 && rL.out[0].date > tk, rL.out);
  // Bỏ tích hết: nút Xếp tắt
  const t5 = addTask("UAT bỏ hết"); addSub(t5.id, "x 1h"); addSub(t5.id, "y 1h");
  openSched("task", t5.id); await sleep(10);
  t5.subs.forEach(s => schedSkip(s.id, true)); await sleep(10);
  ok("B5 bỏ tích hết: nút Xếp tắt, có nhắc chọn", $("schedOk").disabled && /Chọn ít nhất một việc/.test($("schedBody").textContent));
  closeSched();
  // Thả cả việc vào một ngày ở Tuần chi tiết → bảng Xếp hết đúng ngày
  dragItem = { kind: "task", id: t5.id };
  dayDrop({ preventDefault() {}, currentTarget: document.body }, D(2)); await sleep(20);
  ok("B6 thả việc vào ngày: mở Xếp hết từ ngày đó", sch && sch.kind === "task" && sch.date === D(2));
  closeSched();
  // Xóa loại vốn đang có thói quen dùng
  const capT = { k: "uatx", n: "UAT vốn", c: "#123456", tg: 0, kw: [] };
  S.caps.push(capT); const hx = hbAdd({ n: "UAT vốn hb", c: "uatx", kind: "tick", per: "week", tgt: 1 });
  deleteCap("uatx"); await sleep(10);
  ok("B7 không xóa được loại vốn đang có thói quen dùng", S.caps.some(c => c.k === "uatx"));
  S.habits = S.habits.filter(h => h.id !== hx.id); deleteCap("uatx"); await sleep(10);
  ok("B7.2 hết thói quen dùng thì xóa được", !S.caps.some(c => c.k === "uatx"));
  if (undoCur) undoCommit();
  // Đổi cách đếm: tích tay ↔ tự đếm
  const hk = hbAdd({ n: "UAT đổi", c: "sk", kind: "tick", per: "week", tgt: 1 }); hk.ticks[D(-1)] = 1;
  hbOpen(hk.id); hbSet("kind", "auto"); $("hbMatch").value = "UAT đổi"; hbSet("match", "UAT đổi"); hbSave(); await sleep(10);
  ok("B8.1 tích tay → tự đếm: đếm theo lịch", findHb(hk.id).kind === "auto" && findHb(hk.id).key === "uatdoi" && hbStats(findHb(hk.id)).total === 0);
  hbOpen(hk.id); hbSet("kind", "tick"); hbSave(); await sleep(10);
  ok("B8.2 tự đếm → tích tay: ngày đã tích trước đó còn", findHb(hk.id).kind === "tick" && findHb(hk.id).ticks[D(-1)] === 1 && !findHb(hk.id).key);
  // Tab khác tích: nhận qua sự kiện storage
  save();
  const raw = JSON.parse(localStorage.getItem("lc2"));
  const hr = raw.habits.find(h => h.id === hk.id); hr.ticks[tk] = 1; hr.mt = Date.now() + 5;
  localStorage.setItem("lc2", JSON.stringify(raw));
  window.dispatchEvent(new StorageEvent("storage", { key: "lc2", newValue: JSON.stringify(raw) }));
  await sleep(300);
  ok("B9 tab khác vừa tích: tab này nhận", findHb(hk.id) && findHb(hk.id).ticks[tk] === 1);
  // ESC đóng bảng thói quen; phím số không đổi tab khi bảng mở
  hbOpen(hk.id); await sleep(20);
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "2", bubbles: true }));
  await sleep(10);
  ok("B10.1 phím tắt tắt khi bảng mở", cur === "ca");
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  await sleep(20);
  ok("B10.2 ESC đóng bảng thói quen", !$("hbOverlay").classList.contains("open") && !hbEd);
  // Bản sao lưu kiểu v0.5.1: có ▼ Tiêu, giờ cố định ▲/▼, không có thói quen
  const old = { app: "life-capital", v: 1, data: { sv: 3, av: 50, caps: JSON.parse(JSON.stringify(S.caps)), ev: { [D(-1)]: [{ id: "hold1", t: "UAT cũ tiêu", c: "tc", m: "d", h: 3, s: "05:00" }] }, bl: { qh: { u: 1, d: 2 } }, tasks: [], projects: [], mem: {}, cfg: { defDuration: 2, burnoutHours: 6 }, gdel: [] } };
  const qh0 = wk(weekOfDate(D(-1)), "qh"), tc1 = wk(weekOfDate(D(-1)), "tc"), bl0 = JSON.stringify(S.bl);
  const file = new File([JSON.stringify(old)], "old.json", { type: "application/json" });
  const fi = document.createElement("input"); fi.type = "file";
  const dt = new DataTransfer(); dt.items.add(file); fi.files = dt.files;
  const askOrig = window.ask;
  const sel0 = $("importModeSelect"); if (sel0) sel0.value = "merge";
  importData(fi); await sleep(400);
  const wi = weekOfDate(D(-1));
  ok("B11 khôi phục bản v0.5.1: giờ Tiêu cũ và giờ cố định ▲/▼ đều cộng", (S.ev[D(-1)] || []).some(e => e.t === "UAT cũ tiêu") && wk(wi, "tc") === tc1 + 3 && (S.bl.qh ? wk(wi, "qh") >= qh0 : true), [wk(wi, "tc"), tc1]);
  ok("B11.2 thói quen giữ nguyên sau khôi phục", !!findHb(hk.id));

  // dọn
  S.cfg = JSON.parse(cfg0);
  S.bl = JSON.parse(bl0);
  Object.keys(S.ev).forEach(k => { if (k < tk) S.ev[k] = S.ev[k].filter(e => !(e.t === "Đọc sách" && e.s === "22:00")); });
  Object.keys(S.ev).forEach(k => { S.ev[k] = S.ev[k].filter(e => !(e.mine61)); });
  (S.ev[tk] || []).forEach(e => { if ((e.t === "họp" && e.s === "20:00") || (e.t === "đọc sách" && e.s === "21:00")) e.__del = 1; });
  if (S.ev[tk]) S.ev[tk] = S.ev[tk].filter(e => !e.__del);
  S.habits = (S.habits || []).filter(h => !["UAT Uống nước", "Thiền sáng", "UAT đổi", "Đi bộ"].includes(h.n) && hbKey(h) !== "docsach");
  S.tasks = S.tasks.filter(t => !["Thử xếp", "Học từ vựng", "UAT bốn việc", "UAT bỏ hết"].includes(t.t));
  Object.keys(S.ev).forEach(k => { S.ev[k] = S.ev[k].filter(e => !["UAT họp sáng", "Đi bộ", "đi bo", "Vẽ tranh", "UAT cũ tiêu"].includes(e.t) && !e.tk); if (!S.ev[k].length) delete S.ev[k]; });
  window.ask = ask0;
  save(); draw();
  const fail = out.filter(x => !x.pass);
  return { pass: out.length - fail.length, total: out.length, fail, asked };
};
