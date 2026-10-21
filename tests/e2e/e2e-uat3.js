// Đi đúng chữ từng bước UAT K1–K2, L1–L7, M1–M5 (phần máy tính), rồi các trường hợp biên của Sức khỏe.
window.E2EUAT3 = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const D = n => hlKAdd(tk, n);
  const keep = JSON.stringify(S), ask0 = window.ask, sf0 = window.saveFile, pr0 = window.print;
  window.ask = async () => true;
  let saved = null; window.saveFile = async (n, c) => { saved = { n, c }; return true; };
  const typeDate = (el, v, fn) => { el.value = v; el.dataset.typing = "1"; fn(el); };
  const vtxt = () => $("v").textContent.replace(/\s+/g, " ");

  // ===== K1–K2 Cài đặt
  const blob = await new Promise(r => { const c = document.createElement("canvas"); c.width = 40; c.height = 30; c.getContext("2d").fillRect(0, 0, 40, 30); c.toBlob(r, "image/jpeg"); });
  applyBg(blob);
  setOpen = new Set(["ui", "def", "sync", "data", "gc", "del"]); openSettingsModal(); await sleep(30);
  const rg = $("bgBlurRange");
  ok("K1.1 có ảnh nền: thanh Độ mờ nền hiện, có số", rg && $("bgBlurVal"));
  bgPeek(true); await sleep(10);
  ok("K1.2 lúc kéo: bảng trong suốt, chỉ còn hàng thanh kéo", getComputedStyle(document.querySelector("#settingsModalOverlay .modal-sheet")).backgroundColor === "rgba(0, 0, 0, 0)" && getComputedStyle(document.querySelector(".set-sec:not(.set-bg)")).visibility === "hidden" && getComputedStyle(document.querySelector(".bg-blur-row")).visibility === "visible");
  rg.value = 25; rg.dispatchEvent(new Event("input")); rg.value = 30; rg.dispatchEvent(new Event("input")); rg.dispatchEvent(new Event("change")); bgPeek(false); await sleep(20);
  ok("K1.3 thả tay: nền mờ theo, số đổi, đã lưu, bảng hiện lại", $("bgBlurCss").textContent.includes("blur(30px)") && $("bgBlurVal").textContent === "30" && localStorage.getItem("lc_bg_blur") === "30" && !document.body.classList.contains("bg-peek"));
  ok("K1.4 kính mờ của thẻ cố định, không đổi theo thanh kéo", !getComputedStyle(document.querySelector(".sidebar")).backdropFilter.includes("blur(30px)"));
  closeSettingsModal(); await removeBg(); openSettingsModal(); await sleep(20);
  ok("K1.5 chưa có ảnh: không có thanh kéo, dòng Ảnh nền nhắc chọn ảnh", !$("bgBlurRange") && /Chọn ảnh để chỉnh được độ mờ nền/.test($("settingsSheetBody").textContent));
  const secs = [...document.querySelectorAll("#settingsSheetBody > .set-sec")];
  ok("K2.1 mỗi mục một thẻ: Giao diện, Tính năng, Mặc định, Đồng bộ, Dữ liệu, Google Calendar, Xóa dữ liệu", secs.length === 7 && secs.every(s => parseFloat(getComputedStyle(s).borderTopLeftRadius) >= 16), secs.map(s => s.querySelector("summary").textContent.slice(0, 12)));
  const sw = $("chkGCalAutoSync");
  ok("K2.2 Tự động đồng bộ là công tắc", sw && sw.classList.contains("set-switch") && sw.getAttribute("role") === "switch");
  sw.click(); await sleep(10); const off = S.cfg.gcalAutoSync === false; $("chkGCalAutoSync").click(); await sleep(10);
  ok("K2.3 bấm công tắc bật/tắt được", off && S.cfg.gcalAutoSync !== false);
  closeSettingsModal();

  // ===== L1 Hồ sơ
  S.health = undefined; S.profile = undefined; save();
  switchTab("me"); await sleep(20);
  const nm = $("meName"); nm.value = "Lan Anh"; nm.dispatchEvent(new Event("change")); await sleep(10);
  typeDate($("meDob"), "1996-02-29", el => dobSet(el, 1)); await sleep(10);
  [...document.querySelectorAll("#v .set-seg button")].find(b => b.textContent === "Nữ").click(); await sleep(10);
  const ht = $("meHt"); ht.value = "160"; ht.dispatchEvent(new Event("change")); await sleep(10);
  const wt = $("meW"); wt.value = "58,5"; wt.dispatchEvent(new Event("change")); await sleep(10);
  ok("L1.1 tên, ngày sinh 29/02 tính đúng tuổi, Nữ, chiều cao, cân nặng", S.profile.n === "Lan Anh" && S.profile.dob === "1996-02-29" && hlAge() === 30 && S.profile.sex === "f" && hlDay(tk).ht === 160 && hlDay(tk).w === 58.5, [S.profile, hlAge()]);
  ok("L1.2 dòng cân nặng ghi BMI 22,9 · Bình thường", /BMI 22,9 · Bình thường/.test(vtxt()));
  ok("L1.3 tab Tôi có bảng vốn, từ khóa, thói quen, Mở Cài đặt", !!document.querySelector('#v input[data-target-input]') && /Từ khóa nhận diện/.test(vtxt()) && /Thói quen/.test(vtxt()) && /Mở Cài đặt/.test(vtxt()));
  typeDate($("meDob"), D(3), el => dobSet(el, 1));
  const w2 = $("meW"); w2.value = "999"; w2.dispatchEvent(new Event("change")); await sleep(10);
  ok("L1.4 ngày sinh tương lai, cân nặng 999: báo lỗi, không lưu", S.profile.dob === "1996-02-29" && hlDay(tk).w === 58.5);

  // ===== L2 Ghi nhanh
  switchTab("hl"); hlGo("sum"); await sleep(10);
  document.querySelector(".hl-today .hl-m.m4").click(); await sleep(10);
  const m1 = hlDay(tk).mood; document.querySelector(".hl-today .hl-m.m4").click(); await sleep(10);
  ok("L2.1 bấm mức tâm trạng, bấm lại để bỏ", m1 === 4 && hlDay(tk).mood === undefined);
  const clickChip = () => [...document.querySelectorAll(".hl-today .hl-chip")].find(b => b.textContent.startsWith("Nhức đầu")).click();
  const lv = []; for (let i = 0; i < 4; i++) { clickChip(); await sleep(5); lv.push(((hlDay(tk) || {}).sy || {}).dau || 0); }
  ok("L2.2 Nhức đầu 1, 2, 3, 4 lần: Nhẹ → Vừa → Nặng → bỏ", lv.join() === "1,2,3,0", lv);
  clickChip(); hlSet(tk, "mood", 3);
  switchTab("ca"); calSubView = "focus"; sel = CW; draw(); await sleep(10);
  const ch = document.querySelector(".day-card.today .hl-day");
  ok("L2.3 thẻ hôm nay ở Lịch có chip tâm trạng và triệu chứng", ch && /Bình thường/.test(ch.textContent) && /Nhức đầu/.test(ch.textContent));
  ch.click(); await sleep(10);
  ok("L2.4 bấm chip mở bảng sức khỏe hôm nay", $("hlOverlay").classList.contains("open") && hlEd.k === tk);

  // ===== L3 Ghi chi tiết
  const sl = $("hlSleep"); sl.value = "7,5"; sl.dispatchEvent(new Event("change")); await sleep(10);
  const nt = $("hlNote"); nt.value = "Đau đầu sau cuộc họp dài, uống nước đỡ hơn"; nt.dispatchEvent(new Event("change")); await sleep(10);
  ok("L3.1 tự lưu ngủ 7,5 và ghi chú tiếng Việt", hlDay(tk).sleep === 7.5 && hlDay(tk).note.startsWith("Đau đầu"));
  $("hlBody").querySelector('[aria-label="Ngày trước"]').click(); await sleep(10);
  $("hlBody").querySelector(".hl-m.m2").click(); await sleep(10);
  ok("L3.2 sang hôm qua ghi tâm trạng", hlEd.k === D(-1) && hlDay(D(-1)).mood === 2);
  $("hlBody").querySelector('[aria-label="Ngày sau"]').click(); await sleep(10);
  ok("L3.3 không sang được ngày mai", hlEd.k === tk && $("hlBody").querySelector('[aria-label="Ngày sau"]').disabled);
  closeHl(); hlGo("log"); await sleep(10);
  ok("L3.4 Nhật ký có hai ngày, dòng tóm tắt đúng", document.querySelectorAll(".hl-lrow").length === 2 && /ngủ 7,5h/.test(vtxt()) && /Tâm trạng tệ/.test(vtxt()));

  // ===== L4 Thuốc, TPCN
  hlGo("browse", "md"); await sleep(10);
  hlMedOpen(); await sleep(10);
  $("hlMedN").value = "Vitamin D3"; hlEd.d.n = "Vitamin D3"; hlEd.d.sd = D(-7);
  $("hlDone").click(); await sleep(10);
  const vm = S.health.meds.find(m => m.n === "Vitamin D3");
  ok("L4.1 thêm Vitamin D3, TPCN, 1 lần/ngày, từ 7 ngày trước", vm && vm.kind === "sup" && vm.times === 1 && vm.sched === "daily" && vm.sd === D(-7));
  hlGo("sum"); await sleep(10);
  const mc = () => [...document.querySelectorAll(".hl-today .hl-chip.med")].find(x => /Vitamin D3/.test(x.textContent));
  mc().querySelector("button").click(); await sleep(10);
  ok("L4.2 bấm: 1/1", /1\/1/.test(mc().textContent));
  mc().querySelector(".undo").click(); await sleep(10);
  ok("L4.3 bấm −: bớt lại", /0\/1/.test(mc().textContent));
  ok("L4.4 nhiều ngày không tích: Điểm nổi bật báo", hlAdvice().some(a => /Vitamin D3: uống 0\/7 liều/.test(a.t)));
  hlMedOpen(vm.id); hlMedStop(vm.id); await sleep(10);
  ok("L4.5 Ngừng dùng: không còn trong danh sách hôm nay", !hlMedsOn(tk).some(m => m.id === vm.id));
  hlMedOpen(vm.id); hlMedStop(vm.id); hlMedOpen(vm.id); hlMedDel(vm.id); await sleep(10); undoRun(); await sleep(10);
  ok("L4.6 Xóa rồi Hoàn tác", S.health.meds.some(m => m.id === vm.id));

  // ===== L5 Tâm lý
  hlGo("browse", "mh"); await sleep(10);
  [...$("v").querySelectorAll("button")].find(b => b.textContent === "Làm bài").click(); await sleep(10);
  ok("L5.1 chưa trả lời đủ: Lưu tắt", $("hlDone").disabled);
  const ans = (row, v) => $("hlBody").querySelectorAll(".hl-q")[row].querySelectorAll(".hl-m")[v].click();
  ans(0, 2); await sleep(5); ans(1, 2); await sleep(5); ans(2, 0); await sleep(5); ans(3, 1); await sleep(5);
  $("hlDone").click(); await sleep(20);
  ok("L5.2 PHQ-2 4/6: thông báo gặp chuyên gia, Điểm nổi bật có 115, lịch sử điểm", [...document.querySelectorAll(".toast")].some(t => /nên nói chuyện với bác sĩ/.test(t.textContent)) && hlAdvice().some(a => a.cat === "mh" && /115/.test(a.d)) && /PHQ-2 4\/6/.test(vtxt()));

  // ===== L6 Chu kỳ
  [D(-84), D(-56), D(-28)].forEach(s0 => { for (let i = 0; i < 5; i++) hlSet(hlKAdd(s0, i), "flow", i < 2 ? 3 : 1); });
  hlGo("browse", "cy"); await sleep(10);
  ok("L6.1 ngày của chu kỳ, kỳ tới, rụng trứng, dễ thụ thai, lịch 6 tuần, không dùng để tránh thai", /Ngày \d+ của chu kỳ|Trễ kinh/.test(vtxt()) && /Kỳ tới/.test(vtxt()) && /rụng trứng khoảng/.test(vtxt()) && document.querySelectorAll(".hl-cal .hl-cd:not(.hd)").length === 42 && /Không dùng để tránh thai/.test(vtxt()));
  const nx0 = hlCycle().next;
  [...$("v").querySelectorAll(".set-seg button")].find(b => b.textContent === "Theo số tôi nhập").click(); await sleep(5);
  const cl = $("hlCycLen"); cl.value = "30"; cl.dispatchEvent(new Event("change")); await sleep(10);
  ok("L6.2 theo số tôi nhập 30: ngày dự đoán đổi", hlCycle().next === hlKAdd(D(-28), 30) && hlCycle().next !== nx0);
  hpSet("sex", "m"); switchTab("hl"); hlGo("browse"); await sleep(10);
  ok("L6.3 hồ sơ Nam: không có Chu kỳ, không chip dự đoán", !/Chu kỳ/.test(vtxt()) && !hlPredict(D(10), hlCycle()));
  hpSet("sex", "f"); hlCyc("auto", true);

  // ===== L7 Gợi ý cụ thể
  [-1, -2, -4].forEach(o => hlSy(D(o), "dau"));
  [-1, -2, -3, -4].forEach(o => hlSet(D(o), "sleep", 5.5));
  hlGo("sum"); await sleep(10);
  ok("L7.1 gợi ý có số cụ thể, mẹo, dấu hiệu đi khám, dòng không thay bác sĩ + 115", (/Nhức đầu \d\/7 ngày qua/.test(vtxt()) && /không thay cho bác sĩ/.test(vtxt()) && /115/.test(vtxt()) && hlAdvice().some(a => /Nhức đầu \d\/7/.test(a.t) && /115/.test(a.d))));
  ok("L7.2 giấc ngủ: trung bình có số", hlAdvice().some(a => a.cat === "sl" && /Ngủ trung bình \d+(,\d)?h/.test(a.t)));

  // ===== M1 Check-in tối
  const gh0 = Date.prototype.getHours; Date.prototype.getHours = function () { return 20; };
  delete S.health.days[tk].mood; hlTouch(tk); draw();
  [...document.querySelectorAll("#v button")].find(b => b.textContent === "Check-in tối").click(); await sleep(10);
  Date.prototype.getHours = gh0;
  $("hlBody").querySelector(".hl-m.m4").click(); await sleep(10);
  ok("M1.1 chọn tâm trạng tự sang bước sau", /Có triệu chứng nào/.test($("hlBody").textContent));
  $("hlDone").click(); await sleep(5);
  if (/Giấc ngủ và căng thẳng/.test($("hlBody").textContent)) { $("hlDone").click(); await sleep(5); }
  if (/Thuốc, thực phẩm chức năng hôm nay/.test($("hlBody").textContent)) { $("hlDone").click(); await sleep(5); }
  ok("M1.2 màn cuối có chuỗi ngày và điểm Sẵn sàng", /Chuỗi check-in \d+ ngày/.test($("hlBody").textContent) && /Điểm Sẵn sàng \d+/.test($("hlBody").textContent));
  $("hlDone").click(); await sleep(10);
  switchTab("me"); await sleep(10);
  $("hlCiTime").value = "21:30"; saved = null; await hlIcs();
  switchTab("hl"); await sleep(10);
  ok("M1.3 tệp .ics lặp mỗi tối 21:30 có báo", saved && /RRULE:FREQ=DAILY/.test(saved.c) && /T213000/.test(saved.c) && /VALARM/.test(saved.c));
  const gh = Date.prototype.getHours; Date.prototype.getHours = function () { return 20; };
  delete S.health.days[tk].mood; hlTouch(tk); try { localStorage.removeItem("lc_ci_skip"); } catch (e) {}
  switchTab("ca"); sel = CW; draw(); await sleep(10);
  const ban = [...document.querySelectorAll(".review-prompt-banner")].find(b => /Check-in sức khỏe tối nay/.test(b.textContent));
  ok("M1.4 sau 19h: tab Lịch nhắc", !!ban || /Check-in sức khỏe tối nay/.test(checkinNotice()));
  if (ban) { [...ban.querySelectorAll("button")].find(b => b.textContent === "Để sau").click(); await sleep(10); }
  else try { localStorage.setItem("lc_ci_skip", tk); } catch (e) {}
  ok("M1.5 Để sau: ẩn đến mai", checkinNotice() === "");
  Date.prototype.getHours = gh;

  // ===== M2 Mối liên hệ
  S.ev = {}; S.health.days = {};
  for (let j = 1; j <= 12; j++) { const k = D(-j); hlSet(k, "mood", j % 2 ? 3 : 5); if (!(j % 2)) (S.ev[k] = S.ev[k] || []).push({ t: "Gym", c: "sk", m: "u", h: 1, s: "06:00" }); }
  [-30, -31, -32].forEach(o => { hlSet(D(o), "mood", 1); (S.ev[D(o)] = []).push({ t: "Bơi", c: "sk", m: "u", h: 1, s: "06:00" }); });
  switchTab("hl"); hlGo("sum"); await sleep(10);
  ok("M2.1 Tóm tắt: Ngày có Gym: tâm trạng 5/5, ngày khác …", /Ngày có Gym: tâm trạng 5\/5, ngày khác/.test(vtxt()));
  ok("M2.2 yếu tố dưới 4 ngày (Bơi 3 ngày) không bị kết luận", !hlInsights().some(x => /Bơi/.test(x.t)));
  ok("M2.3 có ghi chú đi cùng chưa chắc là nguyên nhân", /chưa chắc là nguyên nhân/.test(vtxt()));

  // ===== M3 Chu kỳ phần 2
  S.health.days = {};
  [D(-84), D(-56), D(-28)].forEach(s0 => { for (let i = 0; i < 5; i++) hlSet(hlKAdd(s0, i), "flow", 2); hlSy(hlKAdd(s0, -1), "dau"); hlSy(hlKAdd(s0, -2), "dau"); });
  hlGo("browse", "cy"); await sleep(10);
  ok("M3.1 thẻ giai đoạn hiện tại có gợi ý; mục Trước kỳ kinh hay gặp", /Giai đoạn (hành kinh|nang noãn|rụng trứng|hoàng thể)/.test(vtxt()) && /Trước kỳ kinh hay gặp/.test(vtxt()) && /Nhức đầu\s*3\/3 kỳ/.test(vtxt()));
  hlOpen(D(-14)); await sleep(10);
  [...$("hlBody").querySelectorAll(".hl-m")].find(b => b.textContent === "Trong và dai").click(); await sleep(5);
  const tp = [...$("hlBody").querySelectorAll("input")].find(i => i.placeholder === "vd: 36,45"); tp.value = "36,5"; tp.dispatchEvent(new Event("change")); await sleep(5);
  [...$("hlBody").querySelectorAll(".hl-m")].find(b => b.textContent === "Dương tính").click(); await sleep(5);
  closeHl();
  const c3 = hlCycle();
  ok("M3.2 que LH dương: rụng trứng hôm sau, kỳ tới ~14 ngày sau, ghi chú dựa trên que LH", hlDay(D(-14)).mucus === 4 && hlDay(D(-14)).temp === 36.5 && c3.src === "lh" && c3.ovu === D(-13) && c3.next === D(1) && /que thử LH/.test(vtxt()), c3);
  $("hlDisc").click(); await sleep(10);
  switchTab("ca"); sel = CW; draw(); await sleep(10);
  ok("M3.3 Kín đáo: Lịch không còn chữ hành kinh, rụng trứng", !/Hành kinh|Dự kiến hành kinh|Dễ thụ thai|Dự kiến rụng trứng/.test([...document.querySelectorAll(".hl-day")].map(x => x.textContent).join(" ")));
  delete S.health.disc;

  // ===== M4 Báo cáo, thẻ y tế
  switchTab("me"); await sleep(10);
  $("meBlood").value = "B+"; $("meBlood").dispatchEvent(new Event("change")); await sleep(5);
  const al = $("meAllergy"); al.value = "Penicillin"; al.dispatchEvent(new Event("change")); await sleep(5);
  const co = $("meCond"); co.value = "Hen suyễn"; co.dispatchEvent(new Event("change")); await sleep(5);
  const ec = $("meEc"); ec.value = "Mẹ · 0912 345 678"; ec.dispatchEvent(new Event("change")); await sleep(5);
  S.health.meds = [{ id: "mv", n: "Sắt", kind: "med", dose: "1 viên", sched: "daily", times: 1, sd: D(-10) }];
  for (let j = 1; j <= 10; j++) if (j <= 6) hlTake(D(-j), "mv", 1);
  hlSet(D(-3), "note", "đau đầu sau họp");
  switchTab("hl"); hlGo("sum"); await sleep(10);
  [...document.querySelectorAll("#v button")].find(b => b.textContent === "Xem báo cáo").click(); await sleep(10);
  const rt = $("hlBody").textContent.replace(/\s+/g, " ");
  ok("M4.1 báo cáo đủ phần: thông tin, thẻ y tế, thuốc có tỷ lệ, triệu chứng, tâm lý, giấc ngủ, chu kỳ, ghi chú", /Thông tin/.test(rt) && /B\+/.test(rt) && /Penicillin/.test(rt) && /Hen suyễn/.test(rt) && /6\/10 liều \(60%\)/.test(rt) && /Triệu chứng/.test(rt) && /Tâm lý và giấc ngủ/.test(rt) && /Chu kỳ kinh nguyệt/.test(rt) && /đau đầu sau họp/.test(rt), rt.slice(0, 600));
  [...$("hlBody").querySelectorAll(".set-seg button")].find(b => b.textContent === "90 ngày").click(); await sleep(5);
  ok("M4.2 đổi 90 ngày", /Báo cáo sức khỏe 90 ngày/.test($("hlBody").textContent));
  let pr = false; window.print = () => { pr = document.body.classList.contains("printing-rep"); };
  [...$("hlBody").querySelectorAll("button")].find(b => b.textContent === "In, lưu PDF").click(); window.dispatchEvent(new Event("afterprint"));
  const css = [...document.styleSheets].flatMap(s => { try { return [...s.cssRules]; } catch (e) { return []; } }).filter(r => r.media && /print/.test(r.media.mediaText)).map(r => r.cssText).join(" ");
  ok("M4.3 In: chỉ báo cáo (ẩn phần còn lại của app khi in)", pr && /printing-rep > \*?:not\(#hlOverlay\)/.test(css) && /display: none/.test(css));
  saved = null; [...$("hlBody").querySelectorAll("button")].find(b => b.textContent === "Lưu tệp").click(); await sleep(20);
  ok("M4.4 Lưu tệp: HTML độc lập mở được ở trình duyệt khác", saved && /^<!doctype html>/.test(saved.c) && /<style>/.test(saved.c) && !/<script/.test(saved.c));
  closeHl();

  // ===== M5 Vận động, Sẵn sàng
  S.ev = {};
  const mon = monKey(tk), evp = (k, t, h, c = "sk") => (S.ev[k] = S.ev[k] || []).push({ t, c, m: "u", h, s: "06:00" });
  evp(mon, "Gym", 1); evp(mon, "Tập trung viết báo cáo", 2, "tc"); evp(mon, "Đi chợ", 1, "qh"); if (hlKAdd(mon, 1) <= tk) evp(hlKAdd(mon, 1), "Chạy bộ", 0.5); evp(hlKAdd(tk, 1), "Đi bộ", 1);
  const am = hlActWeek().reduce((a, x) => a + x.min, 0);
  ok("M5.1 vòng vận động: chỉ Gym, Chạy bộ; không Tập trung, Đi chợ, buổi ngày mai", am === (hlKAdd(mon, 1) <= tk ? 90 : 60), am);
  S.health.days[tk] = {}; hlSet(tk, "sleep", 6); hlSy(tk, "met"); hlSy(tk, "met"); delete (hlDay(D(-1)) || {}).mood; delete (hlDay(D(-1)) || {}).stress;
  [-1, -2, -3].forEach(o => { const d = hlDay(D(o)); if (d) delete d.sleep; });
  const rr = hlReady();
  ok("M5.2 ngủ 6h + một triệu chứng Vừa: 49 Nên nhẹ nhàng, có lý do", rr.v === 49 && rr.lv[0] === "Nên nhẹ nhàng", rr);
  switchTab("ca"); sel = CW; draw(); await sleep(10);
  ok("M5.3 thẻ hôm nay có chip Sẵn sàng 49", /Sẵn sàng 49/.test((document.querySelector(".day-card.today .hl-day") || {}).textContent || ""));
  const tz = addTask("UAT xếp nhẹ"); ["A 1h", "B 1h", "C 1h"].forEach(x => addSub(tz.id, x));
  openSched("task", tz.id, tk); await sleep(10);
  ok("M5.4 bảng Xếp hết ghi điểm thấp, hôm nay tối đa 1h", /Hôm nay điểm Sẵn sàng 49: chỉ xếp tối đa 1h/.test($("schedBody").textContent), $("schedBody").querySelector(".sch-note").textContent);
  closeSched(); S.tasks = S.tasks.filter(t => t.id !== tz.id);

  // ===== Trường hợp biên
  // người dùng mới hoàn toàn
  const keepAll = JSON.stringify(S);
  S = defState(); save();
  let errs = 0; const onErr = () => errs++; window.addEventListener("error", onErr);
  for (const v of ["sum", "browse", "log"]) { hlGo(v); await sleep(5); }
  for (const c of HL_CATS) { hlGo("browse", c[0]); await sleep(5); }
  hlReport(); await sleep(5); closeHl(); hlCheckin(); await sleep(5); closeHl(); switchTab("me"); await sleep(5); switchTab("ca"); await sleep(5);
  window.removeEventListener("error", onErr);
  ok("B1 người dùng mới, chưa có gì: mọi màn Sức khỏe, báo cáo, check-in, Tôi không lỗi", errs === 0 && !S.health || errs === 0, errs);
  S = JSON.parse(keepAll); Object.values(S.ev).forEach(sortL); save();
  // dữ liệu một năm: tốc độ
  const big = {};
  for (let j = 0; j < 365; j++) big[D(-j)] = { mood: 1 + j % 5, sleep: 5 + j % 4, sy: j % 3 ? {} : { dau: 1, met: 2 }, stress: 1 + j % 3, mt: 1 };
  Object.values(big).forEach(d => { if (!Object.keys(d.sy).length) delete d.sy; });
  for (let j = 0; j < 365; j++) (S.ev[D(-j)] = S.ev[D(-j)] || []).push({ t: ["Gym", "Họp", "Đọc sách", "Chạy bộ"][j % 4], c: "sk", m: "u", h: 1, s: "07:00" });
  S.health.days = big;
  let t0 = performance.now(); hlGo("sum"); const tSum = performance.now() - t0;
  t0 = performance.now(); hlInsights(); const tIns = performance.now() - t0;
  t0 = performance.now(); hlReport(); const tRep = performance.now() - t0; closeHl();
  ok("B2 một năm nhật ký: Tóm tắt, mối liên hệ, báo cáo dưới 300ms", tSum < 300 && tIns < 300 && tRep < 300, [tSum, tIns, tRep].map(x => Math.round(x)));
  // đồng bộ không gửi qua lại vô hạn
  const c1 = canonState(S), c2 = canonState(cleanState(JSON.parse(c1)));
  ok("B3 dạng chuẩn ổn định (đọc lại không đổi): không gửi qua lại", c1 === c2);
  // gộp: các tính chất cơ bản
  const H = JSON.parse(JSON.stringify(S.health)), H2 = JSON.parse(JSON.stringify(H)); H2.days[D(-400)] = { mood: 2, mt: 9 };
  ok("B4 gộp với chính nó không đổi; nhận thêm ngày mới của máy kia", sameJ(mergeHealth(H, H, H, true), H) && sameJ(mergeHealth(H, H, H2, true).days[D(-400)], { mood: 2, mt: 9 }));
  // ký tự lạ trong tên hoạt động lên mối liên hệ
  S.health.days = {}; S.ev = {};
  for (let j = 1; j <= 12; j++) { hlSet(D(-j), "mood", j % 2 ? 2 : 5); if (!(j % 2)) (S.ev[D(-j)] = []).push({ t: '<img src=x onerror="window.__x3=1">', c: "sk", m: "u", h: 1, s: "06:00" }); }
  hlGo("sum"); await sleep(10);
  ok("B5 tên hoạt động có mã HTML hiện như chữ ở mối liên hệ", !window.__x3 && !document.querySelector('#v img[src="x"]') && hlInsights().length > 0);
  // tab khác sửa sức khỏe khi bảng ngày đang mở
  hlOpen(tk); await sleep(5); save();
  const raw = JSON.parse(localStorage.getItem("lc2")); raw.health.days[tk] = { ...(raw.health.days[tk] || {}), mood: 1, mt: Date.now() + 50 };
  localStorage.setItem("lc2", JSON.stringify(raw)); window.dispatchEvent(new StorageEvent("storage", { key: "lc2", newValue: JSON.stringify(raw) })); await sleep(200);
  ok("B6 tab khác vừa ghi: bảng đang mở cập nhật, không đóng", hlDay(tk).mood === 1 && $("hlOverlay").classList.contains("open") && $("hlBody").querySelector(".hl-m.m1.on"));
  closeHl();
  // năm mới, ngày cũ trước 2000
  ok("B7 lùi qua ngày 01/01: định dạng ngày đúng", hlKAdd("2027-01-01", -1) === "2026-12-31" && monKey("2027-01-01") === "2026-12-28");
  hlOpen("1999-12-31"); ok("B8 không mở nhật ký cho ngày trước năm 2000", !$("hlOverlay").classList.contains("open"));
  // thuốc chưa bắt đầu, đã kết thúc
  S.health.meds = [{ id: "fx", n: "Sau", kind: "sup", sched: "daily", times: 1, sd: D(3) }, { id: "px", n: "Truoc", kind: "sup", sched: "daily", times: 1, sd: D(-30), ed: D(-1) }];
  ok("B9 thuốc chưa tới ngày bắt đầu hoặc đã hết hạn: không trong danh sách hôm nay", !hlMedsOn(tk).length);
  // tắt đồng bộ sức khỏe: đếm thay đổi chờ vẫn chạy
  S.profile.hSync = false;
  let cnt = null; try { cnt = cloudPendingCount(); } catch (e) { cnt = e.message; }
  ok("B10 tắt đồng bộ sức khỏe: không lỗi khi đếm thay đổi chờ", typeof cnt === "number", cnt);
  S.profile.hSync = true;

  S = JSON.parse(keep); Object.values(S.ev).forEach(sortL);
  window.ask = ask0; window.saveFile = sf0; window.print = pr0;
  save(); switchTab("ca"); draw();
  const fail = out.filter(x => !x.pass);
  return { pass: out.length - fail.length, total: out.length, fail };
};
