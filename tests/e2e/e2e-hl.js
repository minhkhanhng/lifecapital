// E2E Sức khỏe + Hồ sơ (tab Tôi). Chạy trên dữ liệu sạch, có hoặc không loadDemo.
window.E2EHL = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const D = n => hlKAdd(tk, n);
  const ask0 = window.ask; window.ask = async () => true;
  const keep = JSON.stringify(S);
  const reset = () => { S.health = undefined; S.profile = undefined; };
  reset();

  // 1. Hồ sơ
  switchTab("me"); await sleep(20);
  ok("1.1 tab Tôi: Hồ sơ + Danh mục vốn + nút Cài đặt", /Hồ sơ/.test($("v").textContent) && /Danh mục vốn|Loại vốn/.test($("v").textContent) && [...$("v").querySelectorAll("button")].some(b => b.textContent === "Mở Cài đặt"));
  hpSet("n", "<b>Lan</b>"); hpSet("sex", "f");
  const dob = $("meDob"); dob.value = "1990-02-03"; dob.dataset.typing = "1"; dobSet(dob, 1); await sleep(10);
  ok("1.2 ngày sinh, tuổi", S.profile.dob === "1990-02-03" && hlAge() === new Date(tk).getFullYear() - 1990 - (tk.slice(5) < "02-03" ? 1 : 0), [S.profile.dob, hlAge()]);
  const dob2 = $("meDob"); dob2.value = D(5); dob2.dataset.typing = "1"; dobSet(dob2, 1);
  ok("1.3 ngày sinh trong tương lai bị từ chối", S.profile.dob === "1990-02-03");
  ok("1.4 tên có mã HTML hiển thị như chữ", !$("v").querySelector("b") || ![...$("v").querySelectorAll("b")].some(b => b.textContent === "Lan"));
  hlSetNum(tk, "ht", "162", 30, 260); hlSetNum(tk, "w", "58,5", 2, 500);
  ok("1.5 chiều cao, cân nặng ghi vào hôm nay; dấu phẩy được", hlDay(tk).ht === 162 && hlDay(tk).w === 58.5);
  hlSetNum(tk, "w", "999", 2, 500);
  ok("1.6 cân nặng vô lý bị từ chối", hlDay(tk).w === 58.5);
  const b = hlBmi();
  ok("1.7 BMI 22,3 bình thường (châu Á)", b && Math.abs(b.v - 22.29) < 0.05 && b.cat[0] === "Bình thường", b);

  // 2. Ghi nhanh hôm nay
  switchTab("hl"); hlGo("sum"); await sleep(20);
  ok("2.1 Tóm tắt có Hôm nay, Điểm nổi bật, Đã ghim", /Hôm nay/.test($("v").textContent) && /Điểm nổi bật/.test($("v").textContent) && document.querySelectorAll(".hl-pin").length >= 5);
  [...document.querySelectorAll(".hl-today .hl-m.m4")][0].click(); await sleep(10);
  ok("2.2 bấm Tốt: tâm trạng 4", hlDay(tk).mood === 4);
  [...document.querySelectorAll(".hl-today .hl-m.m4")][0].click(); await sleep(10);
  ok("2.3 bấm lại: bỏ tâm trạng", hlDay(tk).mood === undefined);
  hlSy(tk, "dau"); ok("2.4 triệu chứng: nhẹ", hlDay(tk).sy.dau === 1);
  hlSy(tk, "dau"); hlSy(tk, "dau"); ok("2.5 → vừa → nặng", hlDay(tk).sy.dau === 3);
  hlSy(tk, "dau"); ok("2.6 → bỏ", !hlDay(tk).sy);
  ok("2.7 nữ: có hàng Hành kinh và triệu chứng riêng", /Hành kinh/.test($("v").textContent) && hlSyList().some(s => s.k === "kinh"));
  hpSet("sex", "m"); switchTab("hl"); await sleep(10);
  ok("2.8 nam: không có Hành kinh, chu kỳ, triệu chứng riêng", !/Hành kinh/.test(document.querySelector(".hl-today").textContent) && !hlSyList().some(s => s.k === "kinh") && !hlCats().some(c => c[0] === "cy"));
  hpSet("sex", "f");

  // 3. Bảng ghi một ngày
  hlOpen(tk); await sleep(20);
  ok("3.1 mở bảng hôm nay", $("hlOverlay").classList.contains("open") && /Tâm trạng/.test($("hlBody").textContent));
  ok("3.2 không sang được ngày mai", $("hlBody").querySelector('[aria-label="Ngày sau"]').disabled);
  hlShift(-1); ok("3.3 lùi một ngày", hlEd.k === D(-1));
  hlShift(1);
  const si = $("hlSleep"); si.value = "7,5"; si.dispatchEvent(new Event("change")); await sleep(10);
  ok("3.4 ngủ 7,5h", hlDay(tk).sleep === 7.5);
  const si2 = $("hlSleep"); si2.value = "30"; si2.dispatchEvent(new Event("change")); await sleep(10);
  ok("3.5 ngủ 30h bị từ chối", hlDay(tk).sleep === 7.5);
  const n = $("hlNote"); n.value = '<img src=x onerror="window.__x=1"> đau đầu sau họp'; n.dispatchEvent(new Event("change")); await sleep(10);
  ok("3.6 ghi chú lưu, hiển thị như chữ", hlDay(tk).note.includes("đau đầu") && !window.__x);
  hlOpen(tk); await sleep(10);
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); await sleep(20);
  ok("3.7 ESC đóng bảng", !$("hlOverlay").classList.contains("open"));
  hlOpen(D(1)); await sleep(10);
  ok("3.8 không mở được ngày tới", !$("hlOverlay").classList.contains("open"));
  // ngày trống bị bỏ
  hlSet(D(-2), "mood", 3); hlSet(D(-2), "mood", null);
  ok("3.9 xóa hết dữ liệu một ngày: ngày đó không còn", !hlDay(D(-2)));

  // 4. Thuốc, TPCN
  hlMedOpen(); await sleep(10);
  hlMedSave(); ok("4.1 tên trống: không lưu", !(S.health.meds || []).length && hlEd && hlEd.mode === "med");
  hlEd.d.n = "Sắt <script>"; hlEd.d.kind = "med"; hlEd.d.times = 2; hlEd.d.sd = D(-10); hlEd.d.ed = D(-12);
  hlMedSave(); ok("4.2 ngày kết thúc trước ngày bắt đầu: không lưu", !(S.health.meds || []).length);
  hlEd.d.ed = ""; hlMedSave(); await sleep(10);
  const fe = S.health.meds[0];
  ok("4.3 lưu thuốc 2 lần/ngày", fe && fe.times === 2 && fe.kind === "med" && fe.sd === D(-10));
  for (let j = 1; j <= 7; j++) { if (j !== 2) { hlTake(D(-j), fe.id, 1); if (j > 3) hlTake(D(-j), fe.id, 1); } }
  const a = hlAdh(fe);
  ok("4.4 tỷ lệ dùng đủ liều 7 ngày qua: 10/14", a && a.exp === 14 && a.got === 10, a);
  ok("4.5 gợi ý khi dưới 80%", hlAdvice().some(x => x.cat === "md" && x.lv === "warn" && /10\/14/.test(x.t)));
  hlTake(tk, fe.id, 1); hlTake(tk, fe.id, -1);
  ok("4.6 bấm − bớt lần dùng", !((hlDay(tk) || {}).meds || {})[fe.id]);
  switchTab("hl"); hlGo("browse", "md"); await sleep(10);
  ok("4.7 tên thuốc hiển thị như chữ", /Sắt <script>/.test($("v").textContent) && !$("v").querySelector("script"));
  hlMedOpen(fe.id); hlMedStop(fe.id); await sleep(10);
  ok("4.8 ngừng dùng: không còn trong danh sách hôm nay", !hlMedsOn(tk).some(m => m.id === fe.id));
  hlMedOpen(fe.id); hlMedStop(fe.id);
  hlMedOpen(fe.id); hlMedDel(fe.id); await sleep(10);
  ok("4.9 xóa thuốc", !S.health.meds.some(m => m.id === fe.id));
  undoRun(); await sleep(10);
  ok("4.10 hoàn tác xóa", S.health.meds.some(m => m.id === fe.id));

  // 5. Triệu chứng tự thêm
  hlGo("browse", "sy"); await sleep(10);
  $("hlNewSy").value = "Đau răng"; hlAddSy(); await sleep(10);
  $("hlNewSy").value = "đau RĂNG"; hlAddSy();
  ok("5.1 thêm triệu chứng, không trùng", S.health.syc.length === 1 && hlSyList().some(s => s.n === "Đau răng"));
  const cs = S.health.syc[0]; hlSy(tk, cs.id);
  ok("5.2 ghi được triệu chứng tự thêm", hlDay(tk).sy[cs.id] === 1 && hlSyName(cs.id) === "Đau răng");
  hlDelSy(cs.id); ok("5.3 xóa: ngày đã ghi hiện '(đã xóa)'", hlSyName(cs.id) === "(đã xóa)"); undoRun(); await sleep(10);
  hlSy(tk, cs.id); hlSy(tk, cs.id); hlSy(tk, cs.id);

  // 6. Kiểm tra tâm lý
  hlChkOpen(); await sleep(10);
  ok("6.1 nút Lưu tắt khi chưa trả lời đủ", $("hlDone").disabled);
  hlEd.d = { p: [2, 2], g: [1, 0] }; hlChkSave(); await sleep(10);
  ok("6.2 lưu PHQ-2 4/6", S.health.chk[tk] && S.health.chk[tk].p.join() === "2,2");
  ok("6.3 gợi ý gặp chuyên gia, có 115", hlAdvice().some(x => x.cat === "mh" && x.lv === "warn" && /115/.test(x.d)));
  delete S.health.chk[tk];

  // 7. Chu kỳ
  const starts = [D(-90), D(-62), D(-32)];
  starts.forEach(s0 => { for (let i = 0; i < 5; i++) hlSet(hlKAdd(s0, i), "flow", i < 2 ? 3 : 1); });
  hlSet(hlKAdd(starts[1], 6), "flow", null); // không có
  let c = hlCycle();
  ok("7.1 nhận 3 kỳ, độ dài trung bình 29 ngày", c.starts.length === 3 && c.len === 29 && c.per === 5 && c.auto, c);
  ok("7.2 kỳ tới, rụng trứng, dễ thụ thai", c.next === hlKAdd(starts[2], 29) && c.ovu === hlKAdd(c.next, -14) && c.fert[0] === hlKAdd(c.ovu, -5));
  ok("7.3 không trễ (kỳ tới chưa đến)", c.late === 0 && c.next > tk || c.late > 0);
  // ghi quên một ngày giữa kỳ vẫn là một kỳ
  hlSet(hlKAdd(starts[2], 2), "flow", null);
  ok("7.4 quên ghi 1 ngày giữa kỳ: vẫn một kỳ", hlCycle().starts.length === 3);
  hlSet(hlKAdd(starts[2], 2), "flow", 1);
  // trễ kinh
  const late0 = JSON.stringify(S.health.days);
  [-90, -62, -32].forEach(o => { for (let i = 0; i < 5; i++) delete S.health.days[D(o + i)]; });
  [D(-75), D(-47)].forEach(s0 => { for (let i = 0; i < 4; i++) hlSet(hlKAdd(s0, i), "flow", 2); });
  c = hlCycle();
  ok("7.5 trễ kinh tính đúng", c.late === hlDiff(hlKAdd(D(-47), 28), tk) && c.late >= 7 && hlAdvice().some(x => x.cat === "cy" && /Trễ kinh/.test(x.t)), c);
  S.health.days = JSON.parse(late0);
  // không đều
  [D(-150), D(-130)].forEach(s0 => { for (let i = 0; i < 5; i++) hlSet(hlKAdd(s0, i), "flow", 2); });
  c = hlCycle();
  ok("7.6 chu kỳ lệch hơn 7 ngày: báo không đều", c.irregular && hlAdvice().some(x => /Chu kỳ không đều/.test(x.t)), c.lens);
  [D(-150), D(-130)].forEach(s0 => { for (let i = 0; i < 5; i++) delete S.health.days[hlKAdd(s0, i)]; });
  // theo số tự nhập
  hlCyc("auto", false); hlCyc("len", "31");
  c = hlCycle();
  ok("7.7 theo số tôi nhập: 31 ngày", !c.auto && c.len === 31 && c.next === hlKAdd(starts[2], 31));
  hlCyc("len", "99"); ok("7.8 độ dài vô lý bị từ chối", hlH().cyc.len === 31);
  hlCyc("auto", true);
  // dự đoán trên lịch (chu kỳ đều, kỳ tới còn ở phía trước)
  const cy0 = JSON.stringify(S.health.days);
  Object.keys(S.health.days).forEach(k => { if (S.health.days[k].flow) delete S.health.days[k]; });
  [D(-70), D(-42), D(-14)].forEach(s0 => { for (let i = 0; i < 4; i++) hlSet(hlKAdd(s0, i), "flow", 2); });
  c = hlCycle();
  const pk = [...Array(60)].map((_, i) => D(i)).find(k => hlPredict(k, c) === "per");
  ok("7.9 lịch có ngày dự kiến hành kinh, rụng trứng", pk && [...Array(60)].map((_, i) => D(i)).some(k => hlPredict(k, c) === "ovu"));
  hpSet("sex", "m");
  ok("7.10 nam: không dự đoán", !hlPredict(pk, hlCycle()));
  hpSet("sex", "f");
  S.health.days = JSON.parse(cy0);

  // 8. Quy tắc gợi ý
  S.health.days = {}; S.health.meds = []; S.health.chk = {};
  [-1, -2, -4].forEach(o => hlSy(D(o), "dau"));
  let adv = hlAdvice();
  ok("8.1 nhức đầu 3/7 ngày: cảnh báo kèm mẹo và dấu hiệu nguy hiểm", adv.some(x => x.lv === "warn" && /Nhức đầu 3\/7/.test(x.t) && /115/.test(x.d)));
  [0, -1].forEach(o => { hlGet(D(o)).sy = { ...(hlGet(D(o)).sy || {}), met: 3 }; hlTouch(D(o)); });
  adv = hlAdvice();
  ok("8.2 nặng 2 ngày liền: mức khẩn, đứng đầu", adv[0].lv === "urgent" && /Mệt mỏi mức nặng/.test(adv[0].t), adv[0]);
  S.health.days = {};
  [0, -1, -3].forEach(o => hlSy(D(o), "sot"));
  ok("8.3 sốt 3/5 ngày: đi khám", hlAdvice().some(x => x.lv === "urgent" && /Sốt 3 trong 5/.test(x.t)));
  // liên hệ với giờ làm việc trên lịch
  S.health.days = {};
  const evs0 = JSON.stringify(S.ev);
  for (let j = 1; j <= 8; j++) { const k = D(-j); hlSet(k, "mood", 3); if (j <= 4) { hlSy(k, "dau"); (S.ev[k] = S.ev[k] || []).push({ t: "HL làm", c: "tc", m: "u", h: 10, s: "08:00" }); } else (S.ev[k] = S.ev[k] || []).push({ t: "HL làm", c: "tc", m: "u", h: 4, s: "08:00" }); }
  const a84 = hlAdvice().find(x => /Nhức đầu hay vào ngày làm việc nhiều/.test(x.t)), n84 = a84 && (a84.d.match(/trung bình ([\d,]+)h .* ngày khác ([\d,]+)h/) || []).slice(1).map(v => +v.replace(",", "."));
  ok("8.4 nhức đầu hay vào ngày làm việc nhiều, nêu số giờ hai nhóm", a84 && n84.length === 2 && n84[0] - n84[1] >= 2, a84);
  S.ev = JSON.parse(evs0);
  // giấc ngủ
  S.health.days = {};
  [5, 5.5, 6, 6, 5.5].forEach((v, i) => hlSet(D(-i - 1), "sleep", v));
  ok("8.5 ngủ trung bình dưới 6,5h", hlAdvice().some(x => x.cat === "sl" && x.lv === "warn" && /5,6h/.test(x.t)));
  S.health.days = {};
  [7.5, 8, 7, 8, 7.5].forEach((v, i) => hlSet(D(-i - 1), "sleep", v));
  ok("8.6 ngủ đủ: lời khen", hlAdvice().some(x => x.cat === "sl" && x.lv === "good"));
  // tâm trạng thấp
  S.health.days = {};
  [1, 2, 2, 1, 2].forEach((v, i) => hlSet(D(-i), "mood", v));
  ok("8.7 tâm trạng thấp 5/14 ngày", hlAdvice().some(x => x.cat === "mh" && /Tâm trạng thấp 5\/14/.test(x.t)));
  // cân nặng thay đổi nhanh, BMI
  S.health.days = {};
  hlSet(D(-10), "w", 60); hlSet(D(-10), "ht", 160); hlSet(D(0), "w", 62.5);
  adv = hlAdvice();
  ok("8.8 tăng 2,5 kg trong 10 ngày: cảnh báo", adv.some(x => x.cat === "bd" && /tăng 2,5 kg trong 10 ngày/.test(x.t)));
  ok("8.9 BMI 24,4 thừa cân: nói rõ cần giảm bao nhiêu kg", adv.some(x => /BMI 24,4 · Thừa cân/.test(x.t) && /58,6 kg/.test(x.d) && /giảm khoảng 3,9 kg/.test(x.d)), adv.filter(x => x.cat === "bd").map(x => x.t + " | " + x.d));
  S.health.days = {}; hlSet(tk, "w", 44); hlSet(tk, "ht", 160);
  ok("8.10 BMI thiếu cân: nói rõ thiếu bao nhiêu kg", hlAdvice().some(x => /Thiếu cân/.test(x.t) && /thiếu 3,4 kg/.test(x.d)));
  const dob0 = S.profile.dob; S.profile.dob = D(-365 * 15);
  ok("8.11 dưới 18 tuổi: không xếp loại BMI", !hlBmi().cat && !hlAdvice().some(x => /BMI/.test(x.t)));
  S.profile.dob = dob0;
  // chu kỳ: sắp tới kỳ, đang dễ thụ thai
  S.health.days = {};
  [D(-56), D(-28)].forEach(s0 => { for (let i = 0; i < 4; i++) hlSet(hlKAdd(s0, i), "flow", 2); });
  ok("8.12 kỳ kinh dự kiến hôm nay: nhắc", hlAdvice().some(x => /Kỳ kinh dự kiến/.test(x.t)));
  S.health.days = {};
  [D(-42), D(-14)].forEach(s0 => { for (let i = 0; i < 4; i++) hlSet(hlKAdd(s0, i), "flow", 2); });
  ok("8.13 đang trong giai đoạn dễ thụ thai: nhắc, ghi rõ không dùng để tránh thai", hlAdvice().some(x => /dễ thụ thai/.test(x.t) && /Không dùng/.test(x.d)));
  // hồ sơ thiếu, lâu không ghi
  const pr0 = JSON.stringify(S.profile); S.profile = { n: "x" };
  ok("8.14 hồ sơ thiếu: nhắc", hlAdvice().some(x => /Hoàn thiện hồ sơ/.test(x.t)));
  S.profile = JSON.parse(pr0);
  S.health.days = {}; hlSet(D(-5), "mood", 3);
  ok("8.15 3 ngày chưa ghi: nhắc", hlAdvice().some(x => /3 ngày chưa ghi/.test(x.t)));

  // 9. Lịch tuần, Tổng kết tuần
  S.health.days = {}; hlSet(tk, "mood", 5); hlSy(tk, "met");
  switchTab("ca"); calSubView = "focus"; sel = CW; draw(); await sleep(20);
  const chip = document.querySelector(".day-card.today .hl-day");
  ok("9.1 thẻ hôm nay có chip tâm trạng, triệu chứng", chip && /Rất tốt/.test(chip.textContent) && /Mệt mỏi/.test(chip.textContent), chip && chip.textContent);
  chip.click(); await sleep(20);
  ok("9.2 bấm chip mở bảng sức khỏe hôm nay, không mở popup hoạt động", $("hlOverlay").classList.contains("open") && hlEd.k === tk && !$("modalOverlay").classList.contains("open"));
  closeHl();
  calSubView = "timeline"; timelineDayIdx = dow(new Date()); draw(); await sleep(10);
  ok("9.3 chế độ Ngày có chip", !!document.querySelector(".timeline-container .hl-day"));
  calSubView = "focus"; draw();
  openWeeklyReviewModal(CW); await sleep(10);
  ok("9.4 Tổng kết tuần có mục Sức khỏe", /Sức khỏe/.test($("reviewSheetBody").textContent) && /Tâm trạng 5\/5/.test($("reviewSheetBody").textContent));
  closeReviewModal();

  // 10. Tab, phím tắt, nút Thêm
  ok("10.1 6 tab: Lịch, Hộp việc, Dự án, Sức khỏe, Tổng quan, Tôi", TABS.map(t => t.id).join() === "ca,hv,pj,hl,su,me");
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "4", bubbles: true })); await sleep(10);
  ok("10.2 phím 4 mở Sức khỏe", cur === "hl");
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "6", bubbles: true })); await sleep(10);
  ok("10.3 phím 6 mở Tôi", cur === "me");
  switchTab("set"); ok("10.4 switchTab('set') mở tab Tôi (có bảng vốn)", cur === "me" && !!document.querySelector('#v input[data-target-input]'));
  switchTab("hl"); headerAdd(); await sleep(10);
  ok("10.5 nút Thêm ở Sức khỏe mở Ghi hôm nay", $("hlOverlay").classList.contains("open") && hlEd.k === tk);
  closeHl();

  // 11. Đồng bộ, làm sạch, khôi phục
  const st = JSON.parse(JSON.stringify(S));
  st.profile.hSync = false;
  ok("11.1 tắt đồng bộ: dữ liệu gửi đi không có sức khỏe", !JSON.parse(canonState(cloudView(st))).health && !!JSON.parse(canonState(cloudView(S))).health);
  const base = { days: { [D(-1)]: { mood: 3, mt: 1 }, [D(-2)]: { mood: 2, mt: 1 } }, meds: [], syc: [], chk: {}, cyc: { len: 28, per: 5, auto: true } };
  const mine = JSON.parse(JSON.stringify(base)); mine.days[D(-1)] = { mood: 4, mt: 5 }; mine.days[D(-3)] = { sleep: 7, mt: 5 };
  const theirs = JSON.parse(JSON.stringify(base)); delete theirs.days[D(-2)]; theirs.days[D(0)] = { mood: 5, mt: 6 };
  const mh = mergeHealth(base, mine, theirs, true);
  ok("11.2 gộp: sửa một bên giữ, ngày mới hai bên đều giữ, xóa một bên được tôn trọng", mh.days[D(-1)].mood === 4 && mh.days[D(-3)] && mh.days[D(0)] && !mh.days[D(-2)], mh.days);
  ok("11.3 bên kia không gửi sức khỏe: giữ của máy này", mergeHealth(base, mine, undefined, true) === mine);
  const ms = mergeStates(null, JSON.parse(JSON.stringify(S)), { ...JSON.parse(JSON.stringify(S)), health: undefined, profile: undefined, av: 50 }, false);
  ok("11.4 máy bản cũ không có hồ sơ, sức khỏe: giữ nguyên", !!ms.health && !!ms.profile && Object.keys(ms.health.days).length === Object.keys(S.health.days).length);
  const S0 = S; S = JSON.parse(JSON.stringify(S0)); const keepH = S.health;
  const nx = JSON.parse(JSON.stringify(S0)); delete nx.health;
  cloudApply(nx);
  ok("11.5 nhận bản tài khoản không có sức khỏe: giữ nhật ký trên máy", S.health && Object.keys(S.health.days).length === Object.keys(keepH.days).length);
  S = S0; save();
  const dirty = cleanState({ ...JSON.parse(JSON.stringify(S)), profile: { n: "  " + "x".repeat(60), sex: "zz", dob: "bad", hSync: false }, health: { days: { "bad": { mood: 3 }, [tk]: { mood: 9, stress: 2, sleep: 99, sy: { dau: 7, met: 2, "__proto__": 1 }, w: -1, flow: 2, meds: { a: 99 } } }, meds: [{ id: "a", n: "" }, { id: "b", n: "B", times: 9, sched: "x" }], chk: { [tk]: { p: [1, 5], g: [0, 0] } }, cyc: { len: 3 } } });
  const dd = dirty.health.days[tk];
  ok("11.6 làm sạch: giá trị lạ bị bỏ hoặc kẹp", dirty.profile.n.length === 40 && !dirty.profile.sex && !dirty.profile.dob && dirty.profile.hSync === false && !dirty.health.days.bad && !dd.mood && dd.stress === 2 && !dd.sleep && dd.sy.met === 2 && !dd.sy.dau && !dd.w && !dd.meds && dirty.health.meds.length === 1 && dirty.health.meds[0].times === 1 && dirty.health.meds[0].sched === "daily" && !dirty.health.chk[tk] && dirty.health.cyc.len === 28, { dd, p: dirty.profile, meds: dirty.health.meds });
  ok("11.7 dữ liệu không có sức khỏe: không tự thêm", !("health" in cleanState({ ev: {}, caps: S.caps })) && !("profile" in cleanState({ ev: {}, caps: S.caps })));
  // khôi phục Gộp
  const bk = { app: "life-capital", v: 1, data: { ...JSON.parse(JSON.stringify(S)), health: { days: { [D(-20)]: { mood: 2, mt: 1 }, [tk]: { mood: 1, mt: 1 } }, meds: [{ id: "zz", n: "Omega 3", sd: D(-30), mt: 1 }], syc: [], chk: {}, cyc: {} } } };
  const fi = document.createElement("input"); fi.type = "file"; const dt = new DataTransfer(); dt.items.add(new File([JSON.stringify(bk)], "b.json")); fi.files = dt.files;
  if ($("importModeSelect")) $("importModeSelect").value = "merge";
  importData(fi); await sleep(400);
  ok("11.8 khôi phục Gộp: thêm ngày, thuốc còn thiếu; ngày đã có giữ bản trên máy", hlDay(D(-20)) && hlDay(D(-20)).mood === 2 && hlDay(tk).mood === 5 && S.health.meds.some(m => m.id === "zz"));
  // xóa toàn bộ
  window.ask = async () => "ok";
  const snap = JSON.stringify(S);
  await resetToDefaultData(); await sleep(20);
  ok("11.9 Xóa hết: xóa cả hồ sơ, sức khỏe", !S.health && !S.profile);
  S = JSON.parse(snap); save();
  window.ask = async () => true;

  // 12. Dữ liệu mẫu
  S.health = undefined; loadDemo(); await sleep(10);
  ok("12.1 dữ liệu mẫu có nhật ký, TPCN", Object.values(S.health.days).some(d => d.demo) && S.health.meds.some(m => m.demo));
  const dk = Object.keys(S.health.days).find(k => S.health.days[k].demo);
  hlSet(dk, "note", "thật");
  clearDemo(); await sleep(10);
  ok("12.2 Xóa mẫu: bỏ mẫu, giữ ngày người dùng đã sửa", !Object.values(S.health.days).some(d => d.demo) && !S.health.meds.some(m => m.demo) && hlDay(dk) && hlDay(dk).note === "thật");

  // dọn
  S = JSON.parse(keep); Object.values(S.ev).forEach(sortL);
  window.ask = ask0;
  save(); switchTab("ca"); draw();
  const fail = out.filter(x => !x.pass);
  return { pass: out.length - fail.length, total: out.length, fail };
};
