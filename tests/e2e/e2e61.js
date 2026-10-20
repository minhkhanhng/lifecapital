// E2E v0.6.1: bỏ Nạp/Tiêu/Pin, mọi giờ tính vào bánh xe. Chạy sau loadDemo() trên dữ liệu sạch.
window.E2E61 = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const BAN = /(▲|▼|(?<![\p{L}])nạp(?![\p{L}])|(?<!mục )(?<![\p{L}])tiêu(?! đề| chí)(?![\p{L}])|(?<![\p{L}])pin(?![\p{L}])|kiệt sức|cán cân|tác động|tiêu hao)/iu;
  const scan = (id, root) => { const t = (root || document.body).innerText; const m = t.match(BAN); ok(id, !m, m && t.slice(Math.max(0, m.index - 60), m.index + 40)); };
  const wi = sel;

  // 1. Không còn chữ Nạp/Tiêu/Pin ở mọi màn hình
  switchTab("ca"); calSubView = "focus"; draw(); await sleep(50); scan("1.1 Lịch tuần");
  ok("1.1b thẻ ngày hiện tổng giờ", [...document.querySelectorAll(".day-card .day-h")].some(x => /^\d+(,\d)?h$/.test(x.textContent.trim())));
  ok("1.1c không còn pin", !document.querySelector(".battery-badge, .day-battery-row"));
  calSubView = "timeline"; draw(); await sleep(50); scan("1.2 Chế độ ngày");
  calSubView = "year"; draw(); await sleep(50); scan("1.3 Năm (máy tính + điện thoại)");
  calSubView = "focus"; draw();
  const tiles = [...document.querySelectorAll("#v .cap-s .cap-s-n")].map(x => x.textContent);
  ok("1.4 tổng kết tuần: mỗi loại vốn một ô, đúng thứ tự", tiles.join("|") === S.caps.map(c => c.n).join("|"), tiles);
  for (const t of ["hv", "pj", "su", "set"]) { switchTab(t); await sleep(60); scan("1.5 tab " + t); }
  switchTab("ca"); openSettingsModal(); await sleep(50); scan("1.6 Cài đặt", $("settingsSheetBody"));
  ok("1.6b không còn ngưỡng kiệt sức", !$("setBurn"));
  closeSettingsModal && closeSettingsModal();
  openWeeklyReviewModal(wi); await sleep(50); scan("1.7 Tổng kết tuần", $("reviewSheetBody"));
  closeReviewModal();
  openEditor(ky(W[wi])); await sleep(50); scan("1.8 Popup thêm hoạt động", $("sheetBody") || document.querySelector(".modal-sheet"));
  ok("1.8b không còn ô Tác động", !$("inpMode"));
  closeEditor && closeEditor();
  const nl = $("nlpInput");
  nl.value = "Mai 9h họp nhóm 2 tiếng"; handleNLPInput(nl.value); scan("1.9 Xem trước ghi nhanh", $("nlpPreview"));
  nl.value = "+ viết báo cáo"; handleNLPInput(nl.value); scan("1.9b Xem trước + việc", $("nlpPreview"));
  nl.value = ""; handleNLPInput("");
  ok("1.10 hướng dẫn lần đầu", !ONB.some(o => BAN.test(o.d + o.t)), ONB.map(o => o.d));
  ok("1.11 phụ đề tab", !TABS.some(t => BAN.test(t.sub)), TABS.map(t => t.sub));

  // 2. Mọi giờ đều tính, kể cả hoạt động cũ ghi "Tiêu"
  const before = wk(wi, "tc");
  const k0 = ky(ad(W[wi], 2));
  (S.ev[k0] = S.ev[k0] || []).push({ id: "hTest_d", t: "Việc cũ kiểu Tiêu", c: "tc", m: "d", h: 3, s: "22:00" });
  ok("2.1 giờ ▼ cũ vẫn cộng vào vốn", wk(wi, "tc") === before + 3, [before, wk(wi, "tc")]);
  ok("2.2 tổng giờ ngày gồm cả giờ cũ", dayH(k0) === S.ev[k0].reduce((a, e) => a + e.h, 0));
  S.ev[k0] = S.ev[k0].filter(e => e.id !== "hTest_d");

  // 3. Giờ cố định: bản cũ có ▲ và ▼ thì cộng; sửa thì gộp về một số
  const bl0 = JSON.stringify(S.bl.kn || null);
  S.bl.kn = { u: 2, d: 3 };
  const w0 = wk(wi, "kn") - 5;
  ok("3.1 giờ cố định cũ ▲2 + ▼3 = 5", blH("kn") === 5);
  setBl("kn", "4"); ok("3.2 sửa giờ cố định thành 4", S.bl.kn.u === 4 && S.bl.kn.d === 0 && wk(wi, "kn") === w0 + 4, S.bl.kn);
  switchTab("set"); await sleep(50);
  ok("3.3 tab Vốn: một cột Cố định", [...document.querySelectorAll("#v th")].filter(th => /Cố định/.test(th.textContent)).length === 1);
  if (bl0 === "null") delete S.bl.kn; else S.bl.kn = JSON.parse(bl0);
  switchTab("ca");

  // 4. Điểm cân bằng
  const tg0 = S.caps.map(c => c.tg);
  S.caps.forEach(c => c.tg = 0);
  ok("4.1 chưa đặt mục tiêu: chưa có điểm", balanceOf(wi).score === null && balanceOf(wi).tg.length === 0);
  S.caps.forEach(c => c.tg = 4);
  const b = balanceOf(wi), rs = S.caps.map(c => Math.min(1, wk(wi, c.k) / 4));
  const exp = Math.round(((rs.reduce((a, x) => a + x, 0) / rs.length) * 0.6 + Math.min(...rs) * 0.4) * 100);
  ok("4.2 điểm = 60% trung bình + 40% thấp nhất", b.score === exp, [b.score, exp]);
  ok("4.3 yếu nhất đúng vốn thấp nhất", b.weakest && b.weakest.ratio === Math.min(...rs));
  draw(); await sleep(30);
  ok("4.4 dòng tổng kết hiện điểm cân bằng", document.querySelector("#v .cap-sum-h").textContent.includes("cân bằng " + exp + "%"));
  const empty = W.findIndex((_, i) => !evs(i).length && i !== wi);
  ok("4.5 tuần trống: chưa đủ dữ liệu", empty < 0 || balanceOf(empty).score === null);
  openWeeklyReviewModal(wi); await sleep(30);
  const rv = $("reviewSheetBody").innerText;
  ok("4.6 Tổng kết: giờ từng loại vốn, cân bằng, yếu nhất, bánh xe", $("reviewSheetBody").querySelectorAll(".cap-s").length === S.caps.length && /cân bằng/i.test(rv) && rv.includes(exp + "%") && /yếu nhất/i.test(rv) && /Bánh xe/i.test(rv), rv.slice(0, 300));
  let copied = null; const wc = navigator.clipboard && navigator.clipboard.writeText;
  try { navigator.clipboard.writeText = t => { copied = t; return Promise.resolve(); }; } catch (e) {}
  copyReviewToClipboard(wi); await sleep(20);
  if (wc) try { navigator.clipboard.writeText = wc; } catch (e) {}
  ok("4.7 sao chép tổng kết: giờ + cân bằng, không Nạp/Tiêu", copied && copied.includes("Cân bằng " + exp + "%") && !BAN.test(copied), copied);
  closeReviewModal();
  S.caps.forEach((c, i) => c.tg = tg0[i]);

  // 5. Tạo mới: ghi nhanh, + việc, popup → m luôn "u"
  const tomorrow = ky(ad(new Date(), 1));
  const n0 = (S.ev[tomorrow] || []).length;
  nl.value = "Mai 7h họp đối tác 1 tiếng"; handleNLPInput(nl.value); await executeNLP(); await sleep(60);
  const nev = (S.ev[tomorrow] || []).find(e => e.t.toLowerCase().includes("họp đối tác"));
  ok("5.1 ghi nhanh 'họp' không còn thành Tiêu", nev && nev.m === "u" && (S.ev[tomorrow] || []).length === n0 + 1, nev);
  nl.value = "+ làm báo cáo quý"; handleNLPInput(nl.value); await executeNLP(); await sleep(60);
  const nt = S.tasks.find(t => t.t === "làm báo cáo quý");
  ok("5.2 + việc 'báo cáo' không còn thành Tiêu", nt && nt.m === "u", nt);
  switchTab("hv"); await sleep(50);
  ok("5.3 Hộp việc không còn nút đổi tác động", ![...document.querySelectorAll(".hv-mini")].some(x => /Nạp|Tiêu/.test(x.textContent)));
  switchTab("ca");
  const ask61 = window.ask; window.ask = async () => true; // trùng giờ với dữ liệu mẫu của ngày mai (tùy thứ trong tuần): đồng ý lưu
  openEditor(tomorrow); await sleep(40);
  $("inpTitle").value = "Họp khách hàng"; $("inpStart").value = "15:00"; $("inpHours").value = "1";
  saveEventFromForm(); await sleep(60);
  const ne = (S.ev[tomorrow] || []).find(e => e.t === "Họp khách hàng");
  ok("5.4 popup lưu được, m = u", ne && ne.m === "u", ne);
  const oi = (S.ev[tomorrow] || []).findIndex(e => e.t === "Họp khách hàng");
  S.ev[tomorrow][oi].m = "d";
  openEditor(tomorrow, oi); await sleep(40); $("inpHours").value = "1.5"; saveEventFromForm(); await sleep(60);
  const ne2 = (S.ev[tomorrow] || []).find(e => e.t === "Họp khách hàng");
  ok("5.5 sửa hoạt động cũ kiểu Tiêu vẫn lưu được", ne2 && ne2.h === 1.5, ne2);
  window.ask = ask61;

  // 6. Google Calendar: tiêu đề không còn ▲/▼
  const pl = buildGCalEventPayload(ne2, tomorrow);
  ok("6.1 GCal summary = tên hoạt động", pl.summary === "Họp khách hàng", pl.summary);
  ok("6.2 GCal mô tả không còn Tác động", !BAN.test(pl.description), pl.description);

  // 7. CSV không còn cột Tác động
  let csv = null; const sf = window.saveFile;
  window.saveFile = async (f, c) => { csv = c; return false; };
  try { await exportData("csv"); } finally { window.saveFile = sf; }
  ok("7.1 CSV: 7 cột, không có Tác động", csv && csv.split("\n")[0].split(",").length === 7 && !/Tác động|Nạp|Tiêu/.test(csv.split("\n").slice(0, 5).join("\n")), csv && csv.split("\n")[0]);

  // 8. Lịch năm điện thoại tô theo tổng giờ
  calSubView = "year"; draw(); await sleep(40);
  const dd = [...document.querySelectorAll(".yr-day")].filter(x => x.getAttribute("style"));
  ok("8.1 ô có giờ tô màu nhấn, không xanh/đỏ", dd.length && dd.every(x => x.getAttribute("style").includes("var(--ac)")), dd.length);
  ok("8.2 cột cuối là tổng giờ", [...document.querySelectorAll(".yr-net")].some(x => /^\d+(,\d)?h$/.test(x.textContent.trim())));
  calSubView = "focus"; draw();

  // dọn
  S.ev[tomorrow] = (S.ev[tomorrow] || []).filter(e => !["Họp khách hàng"].includes(e.t) && !e.t.toLowerCase().includes("họp đối tác"));
  S.tasks = S.tasks.filter(t => t.t !== "làm báo cáo quý");
  save(); draw();
  const fail = out.filter(x => !x.pass);
  return { pass: out.length - fail.length, total: out.length, fail };
};
