// v0.6.3: nhập từ Google Calendar (giả lập API, không đăng nhập thật), bật/tắt phần, biểu tượng tab, Tổng kết gộp vào Tổng quan.
// Chạy sau loadDemo().
window.E2E63 = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const vt = () => $("v").textContent.replace(/\s+/g, " ");
  const ask0 = window.ask; window.ask = async () => true;
  const fetch0 = gcalFetch, init0 = initGCalTokenClient;
  const crCode = await (await fetch("/tests/e2e/contrast.js?" + Date.now())).text();
  const stCode = await (await fetch("/tests/e2e/strokes.js?" + Date.now())).text();
  const noAnim = document.createElement("style"); noAnim.textContent = "*{transition:none!important;animation:none!important}"; document.head.appendChild(noAnim);
  const LS = k => localStorage.getItem(k);

  // ===== G: Nhập từ Google Calendar
  ["gcal_token", "gcal_token_exp", "gcal_linked", "lc_gx_seen"].forEach(k => localStorage.removeItem(k));
  switchTab("ca"); calSubView = "focus"; sel = CW; draw(); await sleep(10);
  ok("G1.1 chưa liên kết Google: không có nút Nhập GCal", !document.querySelector(".gx-btn"));
  localStorage.setItem("gcal_token", "TEST"); localStorage.setItem("gcal_token_exp", String(Date.now() + 3600e3)); localStorage.setItem("gcal_linked", "1");
  S.cfg.gcalAutoSync = true; draw(); await sleep(10);
  ok("G1.2 đã liên kết: có nút Nhập GCal ở hàng chọn tuần, có biểu tượng", !!document.querySelector(".wk-bar .gx-btn .ico"));
  calSubView = "year"; draw(); await sleep(10);
  ok("G1.3 chế độ Năm: không có nút Nhập", !document.querySelector(".gx-btn"));
  calSubView = "focus"; draw();

  const ws = W[CW], dt = (d, h, m) => { const x = ad(ws, d); x.setHours(h, m, 0, 0); return x.toISOString(); };
  const ownE = Object.values(S.ev).flat().find(e => !e.gx); ownE.gid = "ownGid12345"; ownE.gi = "0123456789abcdefghij";
  const items = [
    { id: "imp00001", summary: "Học tiếng Anh online", start: { dateTime: dt(1, 19, 0) }, end: { dateTime: dt(1, 20, 30) } },
    { id: "imp00002", summary: "Họp khách hàng ABC", start: { dateTime: dt(2, 10, 0) }, end: { dateTime: dt(2, 10, 50) } },
    { id: "imp00003", summary: "Chạy bộ", start: { dateTime: dt(0, 6, 30) }, end: { dateTime: dt(0, 7, 30) } },
    { id: "imp00004", summary: "Sinh nhật", start: { date: ky(ad(ws, 3)) }, end: { date: ky(ad(ws, 4)) } },
    { id: "imp00005", status: "cancelled", summary: "Hủy", start: { dateTime: dt(3, 9, 0) }, end: { dateTime: dt(3, 10, 0) } },
    { id: "imp00006", summary: "Từ chối", attendees: [{ email: "a@b.c" }, { self: true, responseStatus: "declined" }], start: { dateTime: dt(3, 9, 0) }, end: { dateTime: dt(3, 10, 0) } },
    { id: "imp00007", summary: "Của app", description: "Life Capital · Loại vốn: [Sức khỏe] (1h)", start: { dateTime: dt(4, 9, 0) }, end: { dateTime: dt(4, 10, 0) } },
    { id: "imp00008", summary: "Tiệc khuya", start: { dateTime: dt(4, 23, 0) }, end: { dateTime: dt(5, 1, 0) } },
    { id: "imp00009", summary: "   ", start: { dateTime: dt(5, 14, 0) }, end: { dateTime: dt(5, 14, 20) } },
    { id: "imp00010", eventType: "workingLocation", summary: "Văn phòng", start: { dateTime: dt(5, 8, 0) }, end: { dateTime: dt(5, 17, 0) } },
    { id: "ownGid12345", summary: "Bản app đã gửi", start: { dateTime: dt(6, 8, 0) }, end: { dateTime: dt(6, 9, 0) } },
    { id: "0123456789abcdefghij", summary: "Bản app theo mã định sẵn", start: { dateTime: dt(6, 10, 0) }, end: { dateTime: dt(6, 11, 0) } },
    { id: "a b", summary: "Mã lạ", start: { dateTime: dt(6, 12, 0) }, end: { dateTime: dt(6, 13, 0) } },
    { id: "imp00014", summary: "Ngược giờ", start: { dateTime: dt(6, 15, 0) }, end: { dateTime: dt(6, 14, 0) } }
  ];
  const calls = [];
  let resp = () => ({ ok: true, status: 200, data: { items } });
  window.gcalFetch = gcalFetch = async (m, p, tok, body) => { calls.push([m, p, body]); if (m === "GET") return resp(); return { ok: true, status: 200, data: { id: "new" + Math.random().toString(36).slice(2, 9) } }; };

  document.querySelector(".gx-btn").click(); await sleep(60);
  const get = calls.find(c => c[0] === "GET"), qs = get && new URLSearchParams(get[1].slice(1));
  ok("G2.1 đọc đúng tuần đang xem, sự kiện lặp tách từng buổi, theo giờ", qs && qs.get("timeMin") === W[CW].toISOString() && qs.get("timeMax") === ad(W[CW], 7).toISOString() && qs.get("singleEvents") === "true" && qs.get("orderBy") === "startTime", get && get[1]);
  ok("G2.2 popup mở, tiêu đề có số tuần", $("gxOverlay").classList.contains("open") && $("gxTitle").textContent.includes("Tuần " + (CW + 1)));
  const ids = (gxRows || []).map(x => x.id);
  ok("G3.1 bỏ qua: cả ngày, đã hủy, đã từ chối, do app gửi (mô tả, gid, gi), loại đặc biệt, mã lạ, giờ ngược", JSON.stringify(ids) === JSON.stringify(["imp00001", "imp00002", "imp00003", "imp00008", "imp00009"]), ids);
  const R = id => gxRows.find(x => x.id === id);
  ok("G4.1 thời lượng làm tròn nửa giờ: 1h30 → 1,5h; 50 phút → 1h; 20 phút → 0,5h", R("imp00001").h === 1.5 && R("imp00002").h === 1 && R("imp00009").h === 0.5, gxRows.map(x => x.h));
  ok("G4.2 qua nửa đêm: cắt tới 24:00 (23:00 → 1h)", R("imp00008").s === "23:00" && R("imp00008").h === 1 && R("imp00008").k === ky(ad(ws, 4)));
  ok("G4.3 không tên: đặt Sự kiện không tên; ngày giờ theo giờ máy", R("imp00009").t === "Sự kiện không tên" && R("imp00001").k === ky(ad(ws, 1)) && R("imp00001").s === "19:00");
  ok("G5.1 gợi ý loại vốn theo từ khóa: tiếng anh → Kỹ năng, họp → Tài chính", R("imp00001").c === "kn" && R("imp00001").sure && R("imp00002").c === "tc" && R("imp00002").sure, gxRows.map(x => [x.t, x.c, x.sure]));
  ok("G5.2 không khớp từ khóa: ghi Kiểm tra", !R("imp00008").sure && /Kiểm tra/.test($("gxr3").textContent));
  ok("G6.1 trùng tên và giờ với hoạt động đã có: báo Có vẻ đã có, bỏ chọn sẵn", R("imp00003").dup && !R("imp00003").on && /Có vẻ đã có/.test($("gxr2").textContent) && $("gxr2").classList.contains("off"));
  ok("G7.1 đếm đã chọn 4/5, ô chọn tất cả ở trạng thái lưng chừng, nút Thêm 4 hoạt động", $("gxN").textContent === "4/5" && $("gxAll").indeterminate && $("gxOk").textContent === "Thêm 4 hoạt động" && !$("gxOk").disabled);
  $("gxAll").click(); await sleep(10);
  ok("G7.2 chọn tất cả: 5/5", $("gxN").textContent === "5/5" && gxRows.every(x => x.on) && $("gxAll").checked && !$("gxAll").indeterminate);
  $("gxAll").click(); await sleep(10);
  ok("G7.3 bỏ tất cả: nút chính tắt, ghi Chưa chọn sự kiện nào", $("gxOk").disabled && /Chưa chọn/.test($("gxOk").textContent));
  ["gx0", "gx1", "gx3", "gx4"].forEach(i => $(i).click()); await sleep(10);
  ok("G7.4 bấm từng ô: 4/5", $("gxN").textContent === "4/5" && !R("imp00003").on);
  const sel3 = $("gxr3").querySelector("select"); sel3.value = "qh"; sel3.dispatchEvent(new Event("change")); await sleep(5);
  ok("G5.3 đổi loại vốn trong popup", R("imp00008").c === "qh" && R("imp00008").sure);
  // giao diện popup
  const ov = $("gxOverlay"), sh = ov.querySelector(".modal-sheet"), ft = sh.querySelector(".sheet-foot");
  ok("G15.1 popup cùng kiểu: nút ✕, chân cố định có nút chính", !!sh.querySelector(".modal-header .sheet-x.ic-btn") && ft && getComputedStyle(ft).position === "sticky" && ft.querySelector(".btn-primary"));
  const crG = eval(crCode);
  ok("G15.2 popup nhập: chữ đạt tương phản", !crG.length, crG.slice(0, 4));
  const stG = eval(stCode);
  ok("G15.3 popup nhập: không nét viền đen", !stG.length, stG.slice(0, 4));
  const tab = new KeyboardEvent("keydown", { key: "Tab", bubbles: true }); $("gxOk").focus(); document.dispatchEvent(tab); await sleep(5);
  ok("G15.4 phím Tab không thoát khỏi popup", sh.contains(document.activeElement));
  // xác nhận
  const before = Object.values(S.ev).flat().length, gdel0 = S.gdel.length;
  calls.length = 0;
  $("gxOk").click(); await sleep(60);
  const imp = Object.values(S.ev).flat().filter(e => e.gx);
  ok("G8.1 thêm 4 hoạt động mang mã gx, popup đóng", imp.length === 4 && Object.values(S.ev).flat().length === before + 4 && !$("gxOverlay").classList.contains("open"), imp.map(e => e.t));
  ok("G8.2 đúng ngày, giờ, thời lượng, loại vốn đã chọn", (S.ev[ky(ad(ws, 4))] || []).some(e => e.gx === "imp00008" && e.c === "qh" && e.s === "23:00" && e.h === 1) && (S.ev[ky(ad(ws, 1))] || []).some(e => e.gx === "imp00001" && e.c === "kn"));
  ok("G8.3 không đánh dấu gửi lên Google, không gọi POST", imp.every(e => !e.ds) && !calls.some(c => c[0] === "POST"), calls.map(c => c[0]));
  ok("G8.4 nhớ loại vốn đã chọn cho lần sau (trừ Sự kiện không tên)", S.mem["tiệc khuya"] && S.mem["tiệc khuya"].c === "qh" && !S.mem["sự kiện không tên"] && guess("Tiệc khuya") === "qh");
  ok("G8.5 dữ liệu đã lưu giữ gx; làm sạch giữ gx hợp lệ", JSON.parse(LS("lc2")).ev[ky(ad(ws, 1))].some(e => e.gx === "imp00001") && cleanEv({ t: "a", c: "sk", h: 1, gx: "imp00001" }).gx === "imp00001");
  ok("G8.6 làm sạch bỏ gx không hợp lệ, bỏ ds của hoạt động nhập về", !("gx" in cleanEv({ t: "a", c: "sk", h: 1, gx: "a b" })) && !("ds" in cleanEv({ t: "a", c: "sk", h: 1, gx: "imp00001", ds: 3 })));
  ok("G8.7 có thông báo kèm Hoàn tác", [...document.querySelectorAll(".toast")].some(t => /từ Google Calendar/.test(t.textContent) && /Hoàn tác/.test(t.textContent)));
  ok("G8.8 các mã vừa nhập được ghi nhớ trên máy", ["imp00001", "imp00002", "imp00008", "imp00009"].every(i => JSON.parse(LS("lc_gx_seen")).includes(i)));
  undoRun(); await sleep(20);
  ok("G9.1 Hoàn tác: gỡ hết 4 hoạt động, quên các mã", !Object.values(S.ev).flat().some(e => e.gx) && Object.values(S.ev).flat().length === before && !JSON.parse(LS("lc_gx_seen") || "[]").includes("imp00001"));
  await gcalImportWeek(CW); await sleep(30);
  ok("G9.2 nhập lại sau hoàn tác: vẫn hiện đủ 5", gxRows.length === 5);
  gxConfirm(); await sleep(30); undoCommit();
  await gcalImportWeek(CW); await sleep(30);
  ok("G10.1 nhập lần nữa: chỉ còn mục chưa nhập (bản trùng đã bỏ chọn)", gxRows.length === 1 && gxRows[0].id === "imp00003", gxRows.map(x => x.id));
  closeGx();
  resp = () => ({ ok: true, status: 200, data: { items: items.filter(x => x.id !== "imp00003") } });
  await gcalImportWeek(CW); await sleep(30);
  ok("G10.2 không còn gì mới: báo không có sự kiện mới, có nút Đóng", gxRows.length === 0 && /không có sự kiện mới/.test($("gxBody").textContent) && $("gxBody").querySelector(".sheet-foot .btn-primary"));
  closeGx();
  resp = () => ({ ok: true, status: 200, data: { items } });
  // sửa hoạt động nhập về
  const k1 = ky(ad(ws, 1)), i1 = S.ev[k1].findIndex(e => e.gx === "imp00001");
  openEditor(k1, i1); await sleep(20);
  ok("G11.1 popup sửa: ghi chú nhập từ Google, sửa không đổi trên Google", /Nhập từ Google Calendar/.test($("sheetBody").textContent));
  $("inpTitle").value = "Học tiếng Anh nâng cao"; calls.length = 0;
  await saveEventFromForm(); await sleep(40);
  const e1 = S.ev[k1].find(e => e.gx === "imp00001");
  ok("G11.2 lưu: vẫn là hoạt động nhập về, không gửi lên Google", e1 && e1.t === "Học tiếng Anh nâng cao" && !e1.ds && !calls.some(c => c[0] === "POST" || c[0] === "PATCH"));
  // đồng bộ tuần bỏ qua hoạt động nhập về
  calls.length = 0;
  await gcalSyncWeek(CW); await sleep(40);
  ok("G14.1 Đồng bộ tuần: không gửi hoạt động nhập về", !calls.some(c => (c[0] === "POST" || c[0] === "PATCH") && c[2] && /Học tiếng Anh nâng cao/.test(c[2].summary || "")) && Object.values(S.ev).flat().filter(e => e.gx).every(e => !e.ds));
  // xóa hoạt động nhập về
  const g0 = S.gdel.length;
  openEditor(k1, S.ev[k1].findIndex(e => e.gx === "imp00001")); await sleep(10);
  deleteCurrentEvent(); await sleep(20); undoCommit();
  ok("G12.1 xóa hoạt động nhập về: không lệnh xóa nào trên Google", !Object.values(S.ev).flat().some(e => e.gx === "imp00001") && S.gdel.length === g0);
  await gcalImportWeek(CW); await sleep(30);
  ok("G12.2 đã xóa thì không hiện lại khi nhập (máy này)", gxRows && !gxRows.some(x => x.id === "imp00001"));
  closeGx();
  // phiên hết hạn
  let inited = 0;
  window.initGCalTokenClient = initGCalTokenClient = () => { inited++; return false; };
  localStorage.setItem("gcal_token_exp", String(Date.now() - 1000));
  await gcalImportWeek(CW); await sleep(10);
  ok("G13.1 token hết hạn: xin lại quyền ngay trong lần bấm, không gọi API", inited === 1 && !$("gxOverlay").classList.contains("open"));
  localStorage.setItem("gcal_token_exp", String(Date.now() + 3600e3));
  resp = () => ({ ok: false, status: 401, data: null });
  await gcalImportWeek(CW); await sleep(10);
  ok("G13.2 Google báo 401: xóa token, báo kết nối lại, không mở popup", !LS("gcal_token") && !$("gxOverlay").classList.contains("open") && [...document.querySelectorAll(".toast")].some(t => /hết hạn/.test(t.textContent)));
  localStorage.setItem("gcal_token", "TEST");
  resp = () => ({ ok: false, status: 0, data: null });
  await gcalImportWeek(CW); await sleep(10);
  ok("G13.3 lỗi mạng: báo thử lại, không mở popup", !$("gxOverlay").classList.contains("open") && [...document.querySelectorAll(".toast")].some(t => /Chưa đọc được/.test(t.textContent)));
  resp = () => ({ ok: true, status: 200, data: { items } });
  localStorage.removeItem("gcal_linked"); localStorage.removeItem("gcal_token");
  await gcalImportWeek(CW); await sleep(10);
  ok("G13.4 chưa liên kết: nhắc kết nối trong Cài đặt", [...document.querySelectorAll(".toast")].some(t => /Kết nối Google Calendar trong Cài đặt/.test(t.textContent)));
  localStorage.setItem("gcal_token", "TEST"); localStorage.setItem("gcal_linked", "1");
  openSettingsModal(); setSecToggle("gc", true); renderSettingsModal(); await sleep(10);
  ok("G16.1 Cài đặt > Google Calendar: có nút Nhập tuần đang xem", [...$("settingsSheetBody").querySelectorAll("button")].some(b => b.textContent.trim() === "Nhập tuần " + (sel + 1)));
  closeSettingsModal();
  document.querySelectorAll(".toast").forEach(t => t.remove());

  // ===== S: Tổng kết gộp vào Tổng quan
  switchTab("ca"); sel = CW; draw(); await sleep(10);
  ok("S1.1 không còn popup Tổng kết trong trang", !$("reviewModalOverlay"));
  $("reviewBtn").click(); await sleep(20);
  ok("S1.2 nút Tổng kết ở Lịch mở tab Tổng quan đúng tuần", cur === "su" && sel === CW && new RegExp("Tổng kết tuần " + (CW + 1)).test(vt()));
  ok("S1.3 ở Tổng quan ẩn nút Tổng kết", getComputedStyle($("reviewBtn")).display === "none");
  const kids = [...$("v").children].filter(x => x.offsetParent);
  ok("S2.1 thứ tự: chọn tuần → giờ theo loại vốn → tổng kết → bánh xe", kids[0].classList.contains("wk-bar") && kids[1].classList.contains("cap-sum") && kids[2].classList.contains("su-ins") && /Bánh xe/.test(kids[3].textContent), kids.slice(0, 4).map(x => x.className));
  ok("S2.2 có Điểm sáng, Gợi ý tuần tới, nút Sao chép", /Điểm sáng/.test(vt()) && /Gợi ý tuần tới/.test(vt()) && [...$("v").querySelectorAll(".su-ins button")].some(b => /Sao chép/.test(b.textContent)));
  ok("S2.3 không còn thanh 168h trùng ý", !document.querySelector("#v .progress-168-bar"));
  const emptyW = W.findIndex((_, i) => !evs(i).length);
  openWeeklyReviewModal(emptyW); await sleep(10);
  ok("S3.1 tuần trống: báo chưa có hoạt động, có nút Ghi hoạt động, không gợi ý từ dữ liệu rỗng", /chưa có hoạt động/.test(vt()) && !document.querySelector("#v .su-ins-i, #v .su-next") && [...$("v").querySelectorAll(".su-empty button")].some(b => /Ghi hoạt động/.test(b.textContent)));
  [...$("v").querySelectorAll(".su-empty button")][0].click(); await sleep(20);
  ok("S3.2 Ghi hoạt động: về Lịch, con trỏ ở ô ghi nhanh", cur === "ca" && document.activeElement === $("nlpInput"));
  $("nlpInput").blur();
  const big = ky(ad(W[CW], 2)), keep = S.ev[big] ? [...S.ev[big]] : null;
  S.ev[big] = [...(S.ev[big] || []), ...[...Array(8)].map(() => ({ t: "Dồn", c: "tc", m: "u", h: 24, s: "" }))];
  sel = CW; switchTab("su"); await sleep(10);
  ok("S4.1 tổng giờ vượt 168h: cảnh báo kiểm tra trùng", /vượt 168h/.test(vt()));
  if (keep) S.ev[big] = keep; else delete S.ev[big];
  draw(); await sleep(10);
  const crS = eval(crCode), stS = eval(stCode);
  ok("S5.1 Tổng quan: chữ đạt tương phản", !crS.length, crS.slice(0, 4));
  ok("S5.2 Tổng quan: không nét viền đen", !stS.length, stS.slice(0, 4));

  // ===== T: biểu tượng tab
  const icos = [...document.querySelectorAll("#nav button .ico")];
  ok("T1.1 mỗi tab một biểu tượng, ẩn với trình đọc màn hình", icos.length === tabsOn().length && icos.every(i => i.getAttribute("aria-hidden") === "true"));
  const dk = c => { const m = c.match(/[\d.]+/g).map(Number); const mx = Math.max(...m.slice(0, 3)) / 255, mn = Math.min(...m.slice(0, 3)) / 255; return (mx + mn) / 2 < 0.45 && (mx - mn) < 0.12; };
  ok("T1.2 nét biểu tượng không đen, xám (màu hồng theo chữ)", icos.filter(i => !i.closest(".active")).every(i => !dk(getComputedStyle(i).stroke)), icos.map(i => getComputedStyle(i).stroke));

  // ===== M: bật/tắt phần
  const J = x => JSON.stringify(x, (k, v) => k === "mt" ? undefined : v); // bỏ mốc sửa (save() đóng dấu lại)
  const pj0 = J(S.projects), hb0 = J(S.habits), hl0 = J(S.health);
  openSettingsModal(); setSecToggle("mod", true); renderSettingsModal(); await sleep(10);
  const sw = k => $("mod-" + k);
  ok("M1.1 Cài đặt có mục Tính năng, 3 công tắc đang bật", sw("pj") && sw("hb") && sw("hl") && sw("pj").checked && sw("hb").checked && sw("hl").checked);
  switchTab("pj"); await sleep(10);
  sw("pj").click(); await sleep(20);
  ok("M2.1 tắt Dự án: mất tab Dự án, đang ở Dự án thì về Lịch", !TABS.filter(t => t.id === "pj").some(t => [...document.querySelectorAll("#nav button")].some(b => /Dự án/.test(b.textContent))) && cur === "ca");
  ok("M2.2 lưu cfg.mods.pj = false, dữ liệu dự án giữ nguyên", S.cfg.mods && S.cfg.mods.pj === false && J(S.projects) === pj0 && JSON.parse(LS("lc2")).cfg.mods.pj === false);
  closeSettingsModal();
  switchTab("pj"); await sleep(5);
  ok("M2.3 gọi chuyển sang Dự án khi đã tắt: ở lại Lịch", cur === "ca");
  const kp = Object.keys(S.ev).find(k => S.ev[k].some(e => e.pj)), ip = kp ? S.ev[kp].findIndex(e => e.pj) : -1;
  if (kp) {
    const pjOld = S.ev[kp][ip].pj;
    openEditor(kp, ip); await sleep(10);
    ok("M2.4 popup hoạt động: không có ô Dự án", !$("inpPj"));
    const id0 = S.ev[kp][ip].id; await saveEventFromForm(); await sleep(30);
    const ee = Object.values(S.ev).flat().find(e => e.id === id0);
    ok("M2.5 sửa rồi lưu khi Dự án tắt: vẫn giữ dự án đang gắn", ee && ee.pj === pjOld, ee);
  } else ok("M2.4 có hoạt động gắn dự án trong dữ liệu mẫu", false);
  calSubView = "focus"; sel = CW; draw(); await sleep(10);
  ok("M2.6 lịch không còn chấm dự án", !document.querySelector("#v .ev-pj"));
  switchTab("hv"); const tk0 = S.tasks.find(t => !taskDone(t)); hvMoreT("task:" + tk0.id); await sleep(10);
  ok("M2.7 Hộp việc: không có ô chọn dự án, không nhãn dự án", !document.querySelector('#v select[aria-label="Dự án"]') && !document.querySelector("#v .hv-pjT"));
  hvMore = "";
  switchTab("su"); await sleep(10);
  ok("M2.8 Tổng quan: không có thẻ Giờ theo dự án", !/Giờ theo dự án/.test(vt()));
  setMod("hb", false); await sleep(10);
  switchTab("ca"); calSubView = "focus"; draw(); await sleep(10);
  ok("M3.1 tắt Thói quen: Lịch không còn dải thói quen", !document.querySelector("#v .hb-strip, #v .hb-chip") && !/THÓI QUEN/i.test($("v").querySelector(".cap-sum") ? $("v").querySelector(".cap-sum").nextElementSibling ? $("v").querySelector(".cap-sum").nextElementSibling.textContent : "" : ""));
  openEditor(tk); await sleep(10);
  ok("M3.2 popup thêm: không có Theo dõi thành thói quen", !$("inpHabit"));
  closeEditor();
  switchTab("su"); await sleep(10);
  ok("M3.3 Tổng quan: không có thẻ Thói quen", ![...document.querySelectorAll("#v .card-title")].some(t => t.textContent.trim() === "Thói quen"));
  switchTab("me"); await sleep(10);
  ok("M3.4 tab Tôi: không có quản lý thói quen; dữ liệu thói quen giữ", !document.querySelector("#v .hb-row") && J(S.habits) === hb0);
  setMod("hl", false); await sleep(10);
  ok("M4.1 tắt Sức khỏe: mất tab Sức khỏe, còn 4 tab", [...document.querySelectorAll("#nav button")].length === 4 && ![...document.querySelectorAll("#nav button")].some(b => /Sức khỏe/.test(b.textContent)));
  switchTab("ca"); await sleep(10);
  ok("M4.2 lịch không còn nút sức khỏe trong ngày; check-in không nhắc", !document.querySelector("#v .hl-day") && !/Check-in sức khỏe/.test(vt()) && hlChips(tk, null) === "" && checkinNotice() === "");
  switchTab("su"); await sleep(10);
  ok("M4.3 Tổng quan: không có thẻ Sức khỏe; dữ liệu sức khỏe giữ", ![...document.querySelectorAll("#v .card-title")].some(t => t.textContent.trim() === "Sức khỏe") && J(S.health) === hl0);
  ok("M5.1 phím 1–4 theo tab đang hiện: 3 → Tổng quan, 4 → Tôi, 5 không làm gì", (() => { shortcut({ key: "3", target: document.body }); const a = cur; shortcut({ key: "4", target: document.body }); const b = cur; shortcut({ key: "5", target: document.body }); return a === "su" && b === "me" && cur === "me"; })());
  ok("M6.1 làm sạch: chỉ giữ phần tắt hợp lệ", (() => { const c = cleanState({ ...JSON.parse(LS("lc2")), cfg: { mods: { pj: false, hb: true, zz: false, hl: "x" } } }).cfg; return JSON.stringify(c.mods) === '{"pj":false}'; })() && !("mods" in cleanState({ ...JSON.parse(LS("lc2")), cfg: { mods: "xx" } }).cfg));
  ok("M6.2 tải lại dữ liệu (làm sạch): vẫn giữ các phần đã tắt", JSON.stringify(cleanState(JSON.parse(LS("lc2"))).cfg.mods) === '{"pj":false,"hb":false,"hl":false}');
  setMod("pj", true); setMod("hb", true); setMod("hl", true); await sleep(10);
  ok("M7.1 bật lại cả ba: đủ 6 tab, không còn cfg.mods, dữ liệu như cũ", [...document.querySelectorAll("#nav button")].length === 6 && !("mods" in S.cfg) && J(S.projects) === pj0 && J(S.health) === hl0);
  switchTab("ca"); calSubView = "focus"; draw(); await sleep(10);
  ok("M7.2 bật lại: Lịch có lại dải thói quen và chấm dự án", !!document.querySelector("#v .ev-pj") && /Chạy bộ/.test(document.querySelector("#v").textContent));

  // dọn
  noAnim.remove();
  window.gcalFetch = gcalFetch = fetch0; window.initGCalTokenClient = initGCalTokenClient = init0;
  ["gcal_token", "gcal_token_exp", "gcal_linked", "lc_gx_seen"].forEach(k => localStorage.removeItem(k));
  window.ask = ask0;
  document.querySelectorAll(".toast").forEach(t => t.remove());
  switchTab("ca");
  const pass = out.filter(x => x.pass).length;
  return { pass, total: out.length, fail: out.filter(x => !x.pass) };
};
