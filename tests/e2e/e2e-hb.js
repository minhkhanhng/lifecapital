// E2E Thói quen (habit streak). Chạy trên dữ liệu sạch, có hoặc không loadDemo.
window.E2EHB = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const T0 = new Date(tk + "T00:00"), D = n => ky(ad(T0, n)), wk0 = monKey(tk), W0 = n => ky(ad(new Date(wk0 + "T00:00"), n));
  const ev = (k, t, c = "sk", s = "06:00", h = 1) => { (S.ev[k] = S.ev[k] || []).push({ t, c, m: "u", h, s }); sortL(S.ev[k]); };
  const clean = () => { Object.keys(S.ev).forEach(k => { S.ev[k] = S.ev[k].filter(e => !/^(HB|hb) /.test(e.t)); if (!S.ev[k].length) delete S.ev[k]; }); S.habits = (S.habits || []).filter(h => !/^HB /.test(h.n)); };
  const dow = (new Date(tk + "T00:00").getDay() + 6) % 7; // 0 = T2
  clean();

  // 1. Theo tuần: 3 tuần trước mỗi tuần 3 buổi → chuỗi 3; tuần này chưa đủ không làm đứt
  let h = hbAdd({ n: "HB Chạy", c: "sk", kind: "auto", per: "week", tgt: 3, match: "HB Chạy" });
  [-3, -2, -1].forEach(w => [0, 2, 4].forEach(j => ev(W0(7 * w + j), "HB chạy")));
  let st = hbStats(h);
  ok("1.1 3 tuần đạt liên tiếp = chuỗi 3, khớp không phân biệt hoa thường", st.cur === 3 && st.best === 3, st);
  ok("1.2 tuần này chưa đủ không làm đứt chuỗi", st.cur === 3 && st.thisWeek === 0);
  S.ev[W0(-14 + 4)] = S.ev[W0(-14 + 4)].filter(e => e.t !== "HB chạy");
  st = hbStats(h);
  ok("1.3 một tuần thiếu (2/3) làm đứt: chuỗi 1, kỷ lục 1", st.cur === 1 && st.best === 1, st);
  ev(D(1), "HB chạy"); ev(D(2), "HB chạy"); ev(D(3), "HB chạy");
  st = hbStats(h);
  ok("1.4 buổi đã xếp cho ngày tới chưa tính là đã làm", st.thisWeek === (dow <= 6 ? 0 : 0) && st.cur === 1, st);
  clean();

  // 2. Mỗi ngày, nghỉ 1 ngày/tuần không đứt
  h = hbAdd({ n: "HB Nước", c: "sk", kind: "tick", per: "day", tgt: 7 });
  for (let j = 1; j <= 15; j++) h.ticks[D(-j)] = 1;
  st = hbStats(h);
  ok("2.1 15 ngày liên tiếp (hôm nay chưa tích) = chuỗi 15", st.cur === 15 && !st.doneToday, st);
  delete h.ticks[D(-3)];
  st = hbStats(h);
  ok("2.2 bỏ 1 ngày trong tuần: không đứt, chuỗi 14", st.cur === 14, st);
  const mk = monKey(D(-3));
  const other = [0, 1, 2, 3, 4, 5, 6].map(j => ky(ad(new Date(mk + "T00:00"), j))).find(k => k !== D(-3) && k < tk && h.ticks[k]);
  delete h.ticks[other];
  st = hbStats(h);
  ok("2.3 bỏ 2 ngày cùng tuần: đứt chuỗi, kỷ lục giữ", st.cur < 14 && st.best >= st.cur && st.best > 0, st);

  // 3. Dải Thói quen trên Lịch, tích hôm nay
  switchTab("ca"); calSubView = "focus"; draw(); await sleep(30);
  const chip = [...document.querySelectorAll(".hb-chip")].find(c => c.textContent.includes("HB Nước"));
  ok("3.1 dải Thói quen có chip, 7 chấm, nút tích", chip && chip.querySelectorAll(".hb-dot").length === 7 && chip.querySelector(".hb-tick"));
  chip.querySelector(".hb-tick").click(); await sleep(20);
  ok("3.2 bấm ✓ tích hôm nay", findHb(h.id).ticks[tk] === 1 && document.querySelector(`.hb-chip .hb-tick[aria-pressed="true"]`));
  hbTick(h.id); await sleep(10);
  ok("3.3 bấm lại bỏ tích", !findHb(h.id).ticks[tk]);
  hbTick(h.id, D(1));
  ok("3.4 không tích được ngày tới", !findHb(h.id).ticks[D(1)]);

  // 4. Mốc chuỗi báo nhẹ
  clean();
  h = hbAdd({ n: "HB Thiền", c: "sk", kind: "tick", per: "day", tgt: 7 });
  for (let j = 1; j <= 6; j++) h.ticks[D(-j)] = 1;
  draw(); await sleep(20);
  document.querySelectorAll(".toast").forEach(t => t.remove());
  hbTick(h.id); await sleep(40);
  ok("4.1 đạt 7 ngày: thông báo mốc", [...document.querySelectorAll(".toast")].some(t => /HB Thiền: 7 ngày liên tiếp/.test(t.textContent)));

  // 5. Gợi ý từ lịch
  clean();
  [-1, -4, -8].forEach(n => ev(D(n), "HB Đọc sách", "kn", "21:00"));
  try { localStorage.removeItem("lc_hb_dis"); } catch (e) {}
  const sg = hbSuggest();
  ok("5.1 3 ngày trong 2 tuần → gợi ý", sg && sg.t === "HB Đọc sách" && sg.n === 3, sg);
  draw(); await sleep(20);
  ok("5.2 dải hiện gợi ý", document.querySelector(".hb-sug") && /HB Đọc sách/.test(document.querySelector(".hb-sug").textContent));
  hbFromSuggest(); await sleep(20);
  const hs = (S.habits || []).find(x => x.n === "HB Đọc sách");
  ok("5.3 Theo dõi: tạo thói quen tự đếm 3 lần/tuần, vốn Kỹ năng", hs && hs.kind === "auto" && hs.tgt === 3 && hs.c === "kn" && hbStats(hs).total === 3, hs);
  ok("5.4 không gợi ý lại thói quen đã có", !hbSuggest() || hbSuggest().t !== "HB Đọc sách");
  clean();
  [-1, -2, -3].forEach(n => ev(D(n), "HB Đàn", "kn", "20:00"));
  hbDismiss(hbSuggest().key);
  ok("5.5 Bỏ qua: gợi ý biến mất", !hbSuggest() || hbSuggest().t !== "HB Đàn");

  // 6. Popup hoạt động: theo dõi thành thói quen; dấu trên thẻ hoạt động
  clean();
  openEditor(tk); await sleep(30);
  $("inpTitle").value = "HB Yoga"; $("inpStart").value = "05:00"; $("inpHours").value = "1";
  ok("6.1 popup có ô Theo dõi thành thói quen", !!$("inpHabit"));
  $("inpHabit").checked = true;
  await saveEventFromForm(); await sleep(40);
  const hy = (S.habits || []).find(x => x.n === "HB Yoga");
  ok("6.2 lưu: tạo thói quen tự đếm", hy && hy.kind === "auto" && hbStats(hy).doneToday);
  const i = (S.ev[tk] || []).findIndex(e => e.t === "HB Yoga");
  openEditor(tk, i); await sleep(30);
  ok("6.3 mở lại: ghi 'Thuộc thói quen'", !$("inpHabit") && /Thuộc thói quen/.test($("sheetBody").textContent));
  closeEditor();
  sel = CW; calSubView = "focus"; draw(); await sleep(20);
  ok("6.4 thẻ hoạt động có dấu thói quen", [...document.querySelectorAll(".event-item")].some(x => x.textContent.includes("HB Yoga") && x.querySelector(".ev-hb")));

  // 7. Bảng thói quen: sửa, trùng, lưu trữ, xóa + hoàn tác
  hbOpen(hy.id); await sleep(30);
  ok("7.1 bảng có chuỗi, kỷ lục, lưới 26 tuần", $("hbOverlay").classList.contains("open") && $("hbBody").querySelectorAll(".hb-hcol").length === 26 && /Kỷ lục/i.test($("hbBody").textContent));
  hbSet("tgt", 5); hbSave(); await sleep(20);
  ok("7.2 đổi 5 lần/tuần", findHb(hy.id).tgt === 5);
  hbOpen(); await sleep(20);
  $("hbName").value = "HB Yoga 2"; hbSet("n", "HB Yoga 2"); $("hbMatch").value = "hb yoga"; hbSet("match", "hb yoga");
  hbSave(); await sleep(20);
  ok("7.3 trùng hoạt động đã theo dõi: từ chối", !(S.habits || []).some(x => x.n === "HB Yoga 2") && $("hbOverlay").classList.contains("open"));
  closeHb();
  hbArchive(hy.id); await sleep(20);
  ok("7.4 lưu trữ: ẩn khỏi dải", findHb(hy.id).arch && ![...document.querySelectorAll(".hb-chip")].some(c => c.textContent.includes("HB Yoga")));
  switchTab("set"); await sleep(30);
  ok("7.5 tab Vốn có thẻ Thói quen + đã lưu trữ", /Thói quen/.test($("v").textContent) && /đã lưu trữ \(\d+\)/.test($("v").textContent));
  hbArchive(hy.id);
  hbDelete(hy.id); await sleep(20);
  ok("7.6 xóa", !findHb(hy.id));
  undoRun(); await sleep(20);
  ok("7.7 hoàn tác xóa", !!findHb(hy.id));
  switchTab("ca");

  // 8. Xếp 1 buổi khi thiếu
  hbOpen(hy.id); await sleep(20);
  hbPlanOne(hy.id); await sleep(150);
  ok("8.1 mở popup thêm hoạt động điền sẵn tên, vốn, giờ", $("modalOverlay").classList.contains("open") && $("inpTitle").value === "HB Yoga" && $("inpCap").value === hy.c && /^\d\d:\d\d$/.test($("inpStart").value), [$("inpTitle").value, $("inpStart").value]);
  closeEditor();

  // 9. Tổng kết tuần, Tổng quan
  openWeeklyReviewModal(CW); await sleep(20);
  ok("9.1 Tổng kết tuần có Thói quen", /Thói quen/.test($("v").textContent) && $("v").querySelector(".hb-row"));
  switchTab("ca");
  switchTab("su"); await sleep(30);
  ok("9.2 Tổng quan có Thói quen", [...document.querySelectorAll("#v .card-title")].some(x => x.textContent === "Thói quen"));
  switchTab("ca");

  // 10. Đồng bộ, làm sạch, khôi phục
  const base = { id: "hbx", n: "HB Sync", c: "sk", kind: "tick", per: "day", tgt: 7, ticks: { [D(-3)]: 1, [D(-2)]: 1 }, sd: D(-5), mt: 1 };
  const mine = { ...base, ticks: { ...base.ticks, [D(-1)]: 1 }, mt: 2 }, theirs = { ...base, ticks: { [D(-3)]: 1, [tk]: 1 }, mt: 3 };
  const mh = mergeHabits([base], [mine], [theirs], true)[0];
  ok("10.1 gộp: hai máy tích ngày khác nhau giữ cả hai, bỏ tích được tôn trọng", mh.ticks[D(-1)] && mh.ticks[tk] && mh.ticks[D(-3)] && !mh.ticks[D(-2)], mh.ticks);
  const old = mergeStates(null, { ...JSON.parse(JSON.stringify(S)) }, { ...JSON.parse(JSON.stringify(S)), habits: undefined, av: 50 }, false);
  ok("10.2 máy bản cũ không gửi thói quen: giữ của máy này", (old.habits || []).length === (S.habits || []).length);
  const cs = cleanState({ ...JSON.parse(JSON.stringify(S)), habits: [{ id: "a1", n: " X ", kind: "zzz", per: "week", tgt: 99, ticks: { "bad": 1, [tk]: 1 } }, { id: "__proto__", n: "y" }, null] });
  ok("10.3 làm sạch: kẹp tgt, bỏ ngày sai, bỏ mã lạ", cs.habits.length === 1 && cs.habits[0].tgt === 7 && cs.habits[0].kind === "auto" && cs.habits[0].n === "X" && Object.keys(cs.habits[0].ticks).join() === tk, cs.habits);
  const sv = (S.habits || []).find(x => x.n === "HB Yoga");

  clean(); save(); draw();
  const fail = out.filter(x => !x.pass);
  return { pass: out.length - fail.length, total: out.length, fail };
};
