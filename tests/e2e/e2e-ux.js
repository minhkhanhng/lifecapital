// Kiểm các thay đổi rà soát UX (nhóm A, B, C) và trường hợp biên. Chạy sau loadDemo().
window.E2EUX = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const vt = () => $("v").textContent.replace(/\s+/g, " ");
  const btns = (root, re) => [...(root || document).querySelectorAll("button")].filter(b => re.test(b.textContent.trim()));
  const ask0 = window.ask; window.ask = async () => true;
  const Y0 = activeYear;

  // ===== B1 Lịch: một hàng chọn tuần, không còn chọn năm trên tiêu đề
  switchTab("ca"); calSubView = "focus"; sel = CW; draw(); await sleep(10);
  ok("B1.1 tiêu đề không còn chọn năm", !$("brandYearBadge") && !document.querySelector(".year-row"));
  ok("B1.2 hàng tuần: Tuần n · ngày/tháng/năm", /Tuần \d+ \d+\/\d+ – \d+\/\d+\/\d{4}/.test(document.querySelector(".wk-bar .wk-lb").textContent.replace(/\s+/g, " ")), document.querySelector(".wk-bar .wk-lb").textContent);
  ok("B1.3 đang ở tuần này: không có nút Tuần này, không có nhãn Tuần hiện tại", !btns($("v"), /^Tuần này$/).length && !/Tuần hiện tại/.test(vt()));
  sel = 0; draw(); wkStep(-1); await sleep(10);
  ok("B1.4 lùi qua tuần 1: sang tuần cuối năm trước", activeYear === Y0 - 1 && sel === W.length - 1, [activeYear, sel, W.length]);
  ok("B1.5 tuần khác: có nút Tuần này", btns($("v"), /^Tuần này$/).length === 1);
  wkStep(1); await sleep(10);
  ok("B1.6 tiến qua tuần cuối: sang tuần 1 năm sau", activeYear === Y0 && sel === 0, [activeYear, sel]);
  const d0 = +W[0];
  setYear(Y0 - 1, "last"); const dl = +ad(W[W.length - 1], 7);
  ok("B1.7 tuần cuối năm trước và tuần 1 năm sau liền nhau, không trùng", dl === d0, [new Date(dl), new Date(d0)]);
  btns($("v"), /^Tuần này$/)[0].click(); await sleep(10);
  ok("B1.8 bấm Tuần này: về đúng năm và tuần hiện tại", activeYear === Y0 && sel === CW);
  calSubView = "year"; draw(true); await sleep(10);
  ok("B1.9 chế độ Năm: hàng chọn năm", /Năm \d{4}/.test(document.querySelector(".wk-bar .wk-lb").textContent));
  changeYear(1); await sleep(10);
  ok("B1.10 năm sau: có nút Năm nay", activeYear === Y0 + 1 && btns($("v"), /^Năm nay$/).length === 1);
  btns($("v"), /^Năm nay$/)[0].click(); await sleep(10);
  ok("B1.11 Năm nay: về năm hiện tại", activeYear === Y0 && sel === CW);
  calSubView = "focus"; draw(); await sleep(10);

  // ===== B4 ô ghi nhanh chỉ ở Lịch, Hộp việc, Dự án
  const qVis = () => getComputedStyle(document.querySelector(".quick-capture-box")).display !== "none";
  const vis = {};
  for (const t of ["ca", "hv", "pj", "hl", "su", "me"]) { switchTab(t); await sleep(5); vis[t] = qVis(); }
  ok("B4.1 ghi nhanh hiện ở Lịch/Hộp việc/Dự án, ẩn ở Sức khỏe/Tổng quan/Tôi", vis.ca && vis.hv && vis.pj && !vis.hl && !vis.su && !vis.me, vis);
  switchTab("hl"); await sleep(5);
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "/", bubbles: true })); await sleep(10);
  ok("B4.2 phím / ở Sức khỏe: sang Lịch và đặt con trỏ vào ô ghi nhanh", cur === "ca" && document.activeElement === $("nlpInput"), [cur, document.activeElement && document.activeElement.id]);
  $("nlpInput").blur();

  // ===== A1 tên tab
  const nb = [...document.querySelectorAll("#nav button")];
  ok("A1.1 tên tab trên điện thoại giống máy tính", nb.every(b => b.querySelector(".lb-short").textContent === b.querySelector(".lb-full").textContent), nb.map(b => b.querySelector(".lb-short").textContent));

  // ===== A2 + C1 Hộp việc
  switchTab("hv"); hvMore = ""; draw(); await sleep(10);
  const nT = inboxCount(), nP = inboxCount(1), cards = document.querySelectorAll("#v .hv-box > .hv-task").length;
  ok("A2.1 số trên tab = số thẻ việc chưa xếp xong", nT === cards && $("nav").textContent.includes(String(nT)), [nT, cards]);
  ok("A2.2 dòng đếm: n việc · m phần chưa có lịch", new RegExp(`${nT} việc chưa xếp xong · ${nP} phần chưa có lịch`).test(vt()), vt().slice(0, 120));
  ok("A2.3 bỏ dòng Mẹo", !/Mẹo:/.test(vt()));
  ok("C1.1 thẻ gọn: không còn dropdown, ↑ ↓ ✕ khi chưa mở ⋯", !document.querySelector("#v .hv-box > .hv-task select, #v .hv-box > .hv-task .ic-btn"));
  ok("C1.2 mỗi thẻ có nút Xếp và ⋯", [...document.querySelectorAll("#v .hv-box > .hv-task")].every(c => c.querySelector(".hv-sched") && c.querySelector(".hv-more")));
  const tk1 = S.tasks.find(t => !taskDone(t) && t.subs.length >= 2);
  const card1 = () => [...document.querySelectorAll("#v .hv-task")].find(c => c.querySelector(".hv-more").getAttribute("onclick").includes(tk1.id));
  ok("C1.3 dòng tóm tắt: loại vốn, đã xếp, giờ", new RegExp(CM(tk1.c).n.replace(/[/]/g, "\\/") + " · đã xếp \\d+/\\d+ · ").test(card1().querySelector(".hv-meta").textContent), card1().querySelector(".hv-meta").textContent);
  card1().querySelector(".hv-more").click(); await sleep(10);
  ok("C1.4 bấm ⋯: khay có Loại vốn, Hạn, Lên, Xuống, Xóa; con trỏ vào ô đầu", card1().querySelector(".hv-tray select[aria-label='Loại vốn']") && card1().querySelector(".hv-tray input[type=date]") && btns(card1(), /^↑$/).length && btns(card1(), /^↓$/).length && btns(card1(), /^✕$/).length && document.activeElement.getAttribute("aria-label") === "Loại vốn");
  ok("C1.5 ⋯ có aria-expanded=true", card1().querySelector(".hv-more").getAttribute("aria-expanded") === "true");
  const idx0 = S.tasks.indexOf(tk1);
  btns(card1(), /^↓$/)[0].click(); await sleep(10);
  ok("C1.6 Xuống: đổi thứ tự, khay vẫn mở", S.tasks.indexOf(tk1) === idx0 + 1 && card1().querySelector(".hv-tray"), [idx0, S.tasks.indexOf(tk1)]);
  btns(card1(), /^↑$/)[0].click(); await sleep(10);
  ok("C1.7 Lên: về chỗ cũ", S.tasks.indexOf(tk1) === idx0);
  const other = S.tasks.find(t => t !== tk1 && !taskDone(t));
  [...document.querySelectorAll("#v .hv-more")].find(b => b.getAttribute("onclick").includes(other.id)).click(); await sleep(10);
  ok("C1.8 mở ⋯ việc khác: khay cũ đóng, chỉ một khay", document.querySelectorAll("#v .hv-tray").length === 1 && !card1().querySelector(".hv-tray"));
  hvMoreT("task:" + tk1.id); await sleep(10);
  btns(card1(), /^✕$/)[0].click(); await sleep(30);
  ok("C1.9 Xóa trong khay: xóa việc", !findTask(tk1.id));
  undoRun(); await sleep(20);
  ok("C1.10 Hoàn tác: việc trở lại", !!findTask(tk1.id));
  // việc nhỏ
  openTasks.add(tk1.id); hvMore = ""; draw(); await sleep(10);
  const s0 = tk1.subs[0], s1 = tk1.subs[1];
  ok("C1.11 việc nhỏ: chỉ Xếp/Dời và ⋯", ![...document.querySelectorAll("#v .hv-sub .ic-btn")].length && document.querySelectorAll("#v .hv-sub .hv-more").length >= 2);
  hvMoreT("sub:" + s0.id); await sleep(10);
  const subTray = document.querySelector("#v .hv-sub .hv-tray");
  ok("C1.12 ⋯ việc nhỏ: Lên tắt ở dòng đầu, có Xuống, Xóa", subTray && btns(subTray, /^↑$/)[0].disabled && !btns(subTray, /^↓$/)[0].disabled && btns(subTray, /^✕$/).length);
  btns(subTray, /^↓$/)[0].click(); await sleep(10);
  ok("C1.13 Xuống ở việc nhỏ: đổi thứ tự", tk1.subs[0] === s1 && tk1.subs[1] === s0);
  moveItem("sub", s0.id, -1); hvMore = ""; openTasks.delete(tk1.id); draw();
  // thanh bên ở Lịch
  switchTab("ca"); calSubView = "focus"; inboxPanel = true; draw(); await sleep(10);
  hvMoreT("task:" + tk1.id); await sleep(10);
  const pr = document.querySelector(".inbox-aside .hv-tray");
  ok("C1.14 cột Hộp việc ở Lịch cũng có khay ⋯, không tràn ngang", pr && pr.scrollWidth <= pr.clientWidth + 1 && document.querySelector(".inbox-aside").scrollWidth <= document.querySelector(".inbox-aside").clientWidth + 1);
  hvMore = ""; draw();

  // ===== A3 popup hoạt động: Đến ngày chỉ khi lặp
  openEditor(tk); await sleep(20);
  ok("A3.1 Không lặp: ẩn Đến ngày", $("repEndGrp").hidden);
  $("inpRepeat").value = "d"; $("inpRepeat").dispatchEvent(new Event("change")); await sleep(5);
  ok("A3.2 chọn Hằng ngày: hiện Đến ngày", !$("repEndGrp").hidden);
  $("inpRepeat").value = ""; $("inpRepeat").dispatchEvent(new Event("change")); await sleep(5);
  ok("A3.3 về Không lặp: ẩn lại", $("repEndGrp").hidden);
  const n0 = Object.values(S.ev).flat().length;
  $("inpTitle").value = "UX lặp thử"; $("inpRepeat").value = "d"; $("inpRepeat").dispatchEvent(new Event("change"));
  $("inpRepeatEnd").value = ky(ad(new Date(tk + "T00:00"), 2)); $("inpStart").value = "05:00";
  await saveEventFromForm(); await sleep(50);
  const made = Object.values(S.ev).flat().filter(e => e.t === "UX lặp thử");
  ok("A3.4 lặp hằng ngày đến ngày chọn vẫn tạo đủ 3 buổi", made.length === 3, made.length);
  Object.keys(S.ev).forEach(k => { S.ev[k] = S.ev[k].filter(e => e.t !== "UX lặp thử"); if (!S.ev[k].length) delete S.ev[k]; }); save(); draw();
  ok("A3.5 dọn buổi thử", Object.values(S.ev).flat().length === n0);

  // ===== C2 một nút Thêm
  switchTab("ca"); calSubView = "timeline"; timelineDayIdx = (dow(new Date()) + 2) % 7; draw(); await sleep(10);
  ok("C2.1 chế độ Ngày: không còn nút Thêm riêng", !btns(document.querySelector(".timeline-container"), /^Thêm$/).length);
  headerAdd(); await sleep(20);
  const want = ky(ad(W[sel], timelineDayIdx));
  ok("C2.2 nút Thêm đầu trang ở chế độ Ngày: thêm vào đúng ngày đang xem", $("modalOverlay").classList.contains("open") && ed === want, [ed, want]);
  closeEditor(); calSubView = "focus"; draw(); await sleep(10);
  const addBtns = [...document.querySelectorAll(".day-card-add-btn")];
  ok("C2.3 tuần: nút + mỗi ngày có tên đọc được", addBtns.length === 7 && addBtns.every(b => b.textContent.trim() === "+" && /^Thêm hoạt động /.test(b.getAttribute("aria-label"))));
  switchTab("pj"); pjOpenId = null; draw(); await sleep(10);
  ok("C2.4 danh sách dự án: không còn nút + Dự án", !btns($("v"), /\+ Dự án/).length);
  headerAdd(); await sleep(20);
  ok("C2.5 nút Thêm mở popup dự án mới", $("pjOverlay") ? $("pjOverlay").classList.contains("open") : !!document.querySelector(".modal-overlay.open"));
  closeProject(); await sleep(10);
  const pj = S.projects.find(p => pjIsOpen(p)); pjOpen(pj.id); await sleep(20);
  ok("C2.6 trang dự án: + Hoạt động nằm trong menu ⋯", !document.querySelector(".pj-add-ev") && btns(document.querySelector(".pj-menu-pop"), /^Thêm hoạt động$/).length === 1);
  switchTab("hl"); hlGo("log"); await sleep(10);
  ok("C2.7 Nhật ký sức khỏe: không còn nút Ghi hôm nay, còn ô chọn ngày", !btns($("v"), /Ghi hôm nay/).length && $("hlPick"));
  hlGo("sum"); await sleep(10);

  // ===== B3 + C3 Sức khỏe
  const p0 = JSON.stringify(S.profile || {});
  S.profile = Object.assign({}, S.profile, { dob: "", sex: "" }); draw(); await sleep(10);
  ok("B3.1 không còn banner Thêm hồ sơ", !/Thêm hồ sơ/.test(vt()));
  const adv = [...document.querySelectorAll("#v .hl-a")].find(a => /Hoàn thiện hồ sơ/.test(a.textContent));
  ok("B3.2 gợi ý Hoàn thiện hồ sơ có nút Mở hồ sơ", adv && btns(adv, /^Mở hồ sơ$/).length === 1);
  btns(adv, /^Mở hồ sơ$/)[0].click(); await sleep(10);
  ok("B3.3 Mở hồ sơ: sang tab Tôi", cur === "me");
  S.profile = JSON.parse(p0); switchTab("hl"); await sleep(10);
  const first = document.querySelector("#v .hl > .card");
  ok("B3.4 thẻ đầu tiên là Hôm nay", first && first.classList.contains("hl-today"));
  const sl = (hlDay(tk) || {}).sleep;
  delete hlGet(tk).sleep; hlTouch(tk); draw(); await sleep(10);
  ok("B3.5 chưa tính được Sẵn sàng: không hiện thẻ", !hlReady() ? !document.querySelector(".hl-ready") : true);
  hlGet(tk).sleep = 7.5; hlTouch(tk); draw(); await sleep(10);
  ok("B3.6 có giờ ngủ: thẻ Sẵn sàng hiện, chỉ có Sẵn sàng (vận động đã ở thẻ ghim)", !hlReady() || (document.querySelector(".hl-ready") && !/Vận động tuần này/.test(document.querySelector(".hl-ready").textContent)));
  if (sl == null) delete hlGet(tk).sleep; else hlGet(tk).sleep = sl; hlTouch(tk); draw();
  ok("B3.7 Vận động vẫn ở thẻ ghim", [...document.querySelectorAll("#v .hl-pin")].some(p => /Vận động/.test(p.textContent)));
  switchTab("hl"); headerAdd(); await sleep(20);
  ok("C3.1 nút Thêm ở Sức khỏe mở bản ghi hôm nay", $("hlOverlay").classList.contains("open") && hlEd && hlEd.k === tk);
  closeHl(); await sleep(10);

  // ===== A4–A6, A9 Tổng quan
  switchTab("su"); await sleep(10);
  ok("A5.1 mặc định nhận định theo tuần đang xem", N === 1 && /trong tuần \d+/.test(vt()));
  ok("A5.2 không còn Còn trống / 168h", !/Còn trống/.test(vt()));
  const segs = [...document.querySelectorAll("#v .progress-168-seg")].reduce((a, x) => a + parseFloat(x.style.width), 0);
  ok("A5.3 thanh giờ chia theo vốn đầy 100%", Math.abs(segs - 100) < 0.5, segs);
  const th1 = [...document.querySelectorAll("#v .sum-table th")].map(x => x.textContent.trim());
  ok("A5.4 tính theo tuần này: bảng không có cột Trung bình", !th1.some(x => /Trung bình/.test(x)), th1);
  N = 4; draw(); await sleep(10);
  const th4 = [...document.querySelectorAll("#v .sum-table th")].map(x => x.textContent.trim());
  ok("A5.5 TB 4 tuần: có cột Trung bình và chữ trung bình", th4.some(x => /Trung bình \d+ tuần/.test(x)) && /trung bình \d+ tuần gần nhất/.test(vt()), th4);
  N = 1; draw();
  const caps0 = JSON.stringify(S.caps);
  S.caps.forEach(c => { c.tg = 0; }); draw(); await sleep(10);
  ok("A6.1 chưa đặt mục tiêu: không có thẻ Nhận định, chỉ một nút Đặt mục tiêu", !/Nhận định/.test(vt()) && btns($("v"), /^Đặt mục tiêu$/).length === 1, btns($("v"), /^Đặt mục tiêu$/).length);
  switchTab("ca"); await sleep(10);
  ok("A9.1 Lịch: chưa có mục tiêu vẫn đủ giờ từng loại vốn, không thanh mục tiêu", document.querySelectorAll("#v .cap-s").length === S.caps.length && !document.querySelector("#v .cap-s-bar"));
  S.caps = JSON.parse(caps0); draw();
  ok("A9.2 có mục tiêu: mỗi ô có giờ / mục tiêu và thanh", [...document.querySelectorAll("#v .cap-s")].every(c => c.querySelector(".cap-s-bar") && /\/ \d/.test(c.textContent)));
  // số vừa đổi tự tắt tô nền
  switchTab("su"); await sleep(10);
  dirty = true; PV = Object.fromEntries(Object.keys(vals()).map(k => [k, -1])); draw(); await sleep(10);
  ok("A4.1 số vừa đổi có tô nền, không có dòng giải thích", document.querySelectorAll("#v .chg").length > 0 && !/tô nền|Bỏ đánh dấu/.test(vt()));
  await sleep(4300);
  ok("A4.2 sau 4 giây tự tắt", document.querySelectorAll("#v .chg").length === 0 && CH.size === 0);

  // ===== A8 mục tiêu mẫu
  const sk = S.caps.find(c => c.k === "sk"), qh = S.caps.find(c => c.k === "qh");
  ok("A8.1 dữ liệu mẫu có mục tiêu giờ", sk.tg === DEMO_TG.sk);
  qh.tg = 7; save();
  const snap = JSON.stringify(S);
  clearDemo(); await sleep(10);
  ok("A8.2 Xóa mẫu: mục tiêu mẫu chưa sửa thì về 0, mục tiêu đã sửa giữ nguyên", sk.tg === 0 && qh.tg === 7, [sk.tg, qh.tg]);
  S = cleanState(JSON.parse(snap)); save(); draw();
  const tg1 = S.caps.find(c => c.k === "kn"); tg1.tg = 9;
  const nE = Object.values(S.ev).flat().length; loadDemo(); await sleep(10);
  ok("A8.3 Dùng thử lần nữa không ghi đè mục tiêu người dùng đã đặt", S.caps.find(c => c.k === "kn").tg === 9);
  S = cleanState(JSON.parse(snap)); save(); draw();

  // ===== A7 + Cài đặt ở tab Tôi
  switchTab("me"); capEdit = false; draw(); await sleep(10);
  const capCard = [...document.querySelectorAll("#v .card")].find(c => /Loại vốn/.test(c.querySelector(".card-title") && c.querySelector(".card-title").textContent || ""));
  ok("A7.1 Loại vốn: không có nút xóa từng dòng", !capCard.querySelector(".x-del") && /Cố định: giờ tự cộng/.test(capCard.textContent));
  btns(capCard, /^Xóa bớt$/)[0].click(); await sleep(10);
  const capCard2 = [...document.querySelectorAll("#v .card")].find(c => /Loại vốn/.test(c.querySelector(".card-title") && c.querySelector(".card-title").textContent || ""));
  ok("A7.2 bấm Xóa bớt: hiện Xóa từng dòng, nút đổi thành Xong", capCard2.querySelectorAll(".x-del").length === S.caps.length && btns(capCard2, /^Xong$/).length === 1);
  btns(capCard2, /^Xong$/)[0].click(); await sleep(10);
  ok("A7.3 bấm Xong: ẩn lại", capEdit === false);
  const kw = document.querySelector("#v details.kw-card");
  ok("A7.4 Từ khóa nhận diện thu gọn mặc định", kw && !kw.open);
  kw.open = true; await sleep(20); draw(); await sleep(10);
  ok("A7.5 mở Từ khóa: vẽ lại vẫn mở", document.querySelector("#v details.kw-card").open);
  kwOpen = false; draw();
  ok("A7.6 không còn nút Cài đặt ở thanh bên và đầu trang; tab Tôi mở được Cài đặt", !document.querySelector(".sidebar-settings") && !$("settingsBtn") && btns($("v"), /Cài đặt|Mở cài đặt/).length >= 1);

  // ===== Demo một dòng
  switchTab("ca"); await sleep(10);
  ok("B2.1 dữ liệu mẫu: một dòng, có Xóa mẫu", document.querySelector(".demo-line") && btns(document.querySelector(".demo-line"), /^Xóa mẫu$/).length === 1 && !/Đang dùng dữ liệu mẫu/.test(vt()));

  // ===== Vòng 2 (20/10): nút cùng loại cùng kiểu, lịch tuần có chính phụ, tổng kết theo loại vốn
  const rowDelText = () => [...document.querySelectorAll("#v button")].filter(b => b.textContent.trim() === "Xóa");
  const xOk = root => [...root.querySelectorAll(".x-del")].every(b => b.textContent.trim() === "✕" && /^Xóa /.test(b.getAttribute("aria-label")) && b.title === b.getAttribute("aria-label"));
  // Hộp việc
  switchTab("hv"); const tX = S.tasks.find(t => !taskDone(t) && t.subs.length >= 2); openTasks.add(tX.id); hvMoreT("task:" + tX.id); await sleep(10);
  ok("V2.1 Hộp việc: khay việc dùng ✕ và ↑ ↓, không chữ Xóa/Lên/Xuống", !rowDelText().length && xOk($("v")) && document.querySelectorAll("#v .hv-tray .ic-btn").length === 3 && ![...document.querySelectorAll("#v .hv-tray button")].some(b => /Lên|Xuống/.test(b.textContent)));
  hvMoreT("sub:" + tX.subs[0].id); await sleep(10);
  ok("V2.2 Hộp việc: khay việc nhỏ cũng ✕ ↑ ↓", document.querySelectorAll("#v .hv-sub .hv-tray .ic-btn").length === 3 && xOk($("v")));
  const sz = [...document.querySelectorAll("#v .ic-btn")].map(b => Math.round(b.getBoundingClientRect().width) + "x" + Math.round(b.getBoundingClientRect().height));
  ok("V2.3 mọi nút biểu tượng cùng cỡ", new Set(sz).size === 1, sz);
  hvMore = ""; openTasks.delete(tX.id);
  // Dự án: cập nhật trạng thái, mốc, việc nhỏ trong bảng chi tiết
  const pjX = S.projects.find(p => pjIsOpen(p)); switchTab("pj"); pjOpen(pjX.id); pjSetView("ov"); await sleep(20);
  ok("V2.4 Tổng quan dự án: xóa cập nhật và xóa mốc đều là ✕", !rowDelText().length && document.querySelector("#v .pj-up .x-del") && document.querySelector("#v .pjo-ms .x-del") && xOk($("v")));
  const nUp = (pjX.ups || []).length; document.querySelector("#v .pj-up .x-del").click(); await sleep(20);
  ok("V2.5 bấm ✕ cập nhật: xóa, có Hoàn tác", (pjX.ups || []).length === nUp - 1);
  undoRun(); await sleep(20);
  ok("V2.6 Hoàn tác trả lại cập nhật", (pjX.ups || []).length === nUp);
  const tP = S.tasks.find(t => t.pj === pjX.id && t.subs.length); if (tP) { pjOpenItem("task", tP.id); await sleep(30); ok("V2.7 bảng chi tiết: xóa việc nhỏ là ✕", xOk($("pjItBody")) && $("pjItBody").querySelectorAll(".pjd-li .x-del").length === tP.subs.length); pjCloseItem(); await sleep(10); }
  // Tôi: loại vốn, triệu chứng tự thêm
  switchTab("me"); capEdit = true; draw(); await sleep(10);
  ok("V2.8 Loại vốn (Xóa bớt): ✕ từng dòng, không chữ Xóa", !rowDelText().length && document.querySelectorAll("#v .x-del").length === S.caps.length && xOk($("v")));
  capEdit = false; draw();
  const sy0 = JSON.stringify((S.health || {}).syc || []); hlH().syc = [...(hlH().syc || []), { id: "uxsy", n: "Đau răng" }];
  switchTab("hl"); hlGo("browse", "sy"); await sleep(20);
  const syX = [...document.querySelectorAll("#v .x-del")].find(b => /Đau răng/.test(b.getAttribute("aria-label")));
  ok("V2.9 Triệu chứng tự thêm: xóa là ✕", !!syX && !rowDelText().length, [...document.querySelectorAll("#v button")].filter(b => /Xóa/.test(b.textContent)).map(b => b.textContent));
  hlH().syc = JSON.parse(sy0); hlGo("sum");
  // Lịch tuần
  switchTab("ca"); calSubView = "focus"; sel = CW; inboxPanel = false; draw(); await sleep(20);
  const td = document.querySelector(".day-card.today");
  ok("V2.10 hôm nay: phát sáng màu nhấn (không viền), ngày tô nền", td && /224, 163, 187|0\.878/.test(getComputedStyle(td).boxShadow) && getComputedStyle(td.querySelector(".day-date")).backgroundColor !== "rgba(0, 0, 0, 0)");
  const dIdx = dow(new Date());
  ok("V2.11 ngày đã qua có lớp past, ngày tới không", document.querySelectorAll(".day-card.past").length === dIdx && !document.querySelector(".day-card.today.past"));
  ok("V2.12 đầu cột: thứ, ngày, tổng giờ tách riêng", [...document.querySelectorAll(".day-card")].every(c => c.querySelector(".day-name") && /^\d+\/\d+$/.test(c.querySelector(".day-date").textContent.trim())) && [...document.querySelectorAll(".day-card .day-h")].every(x => /^\d+(,\d)?h$/.test(x.textContent)));
  const cols = getComputedStyle(document.querySelector(".week-cards-grid")).gridTemplateColumns.split(" ").length, ww = document.querySelector(".wk-wrap").clientWidth;
  ok("V2.13 đủ rộng (≥960px) thì 7 cột như lịch tuần thường thấy", ww >= 960 ? cols === 7 : cols <= 4, [ww, cols]);
  const bgOf = el => getComputedStyle(el).backgroundColor;
  ok("V2.14 thứ bậc: tiêu đề và hàng chọn tuần không hộp; thẻ ngày là khối nổi (nền trắng trong, bóng nhiều lớp, không viền)", bgOf(document.querySelector(".app-header")) === "rgba(0, 0, 0, 0)" && bgOf(document.querySelector(".wk-bar")) === "rgba(0, 0, 0, 0)" && (a => a >= 0.3 && a <= 0.98)(parseFloat(bgOf(document.querySelector(".day-card")).split(",")[3] || "1")) && getComputedStyle(document.querySelector(".day-card")).boxShadow.split(/,(?![^(]*\))/).length >= 3 && /rgba\(0, 0, 0, 0\)|transparent/.test(getComputedStyle(document.querySelector(".day-card")).borderTopColor));
  const evI = document.querySelector(".event-item");
  ok("V2.15 hoạt động có chấm màu loại vốn (không vạch viền) và nền nhuộm màu vốn", (el => el && getComputedStyle(el, "::before").backgroundColor !== "rgba(0, 0, 0, 0)" && getComputedStyle(el, "::before").borderTopLeftRadius === "50%")(evI.querySelector(".event-item-top")) && !/3px 0px 0px 0px inset/.test(getComputedStyle(evI).boxShadow));
  // Tổng kết theo loại vốn
  const cells = [...document.querySelectorAll("#v .cap-s")];
  ok("V2.16 Lịch: mỗi loại vốn một ô, số giờ đúng wk()", cells.length === S.caps.length && S.caps.every((c, i) => cells[i].querySelector("b").textContent.startsWith(r1(wk(CW, c.k)) + "h")), cells.map(c => c.textContent.replace(/\s+/g, " ")));
  ok("V2.17 dòng tổng: tổng giờ = al(), số hoạt động", document.querySelector("#v .cap-sum-h").textContent.includes(r1(al(CW)) + "h · " + evs(CW).length + " hoạt động"));
  const bw = balanceOf(CW).weakest;
  ok("V2.18 vốn yếu nhất được đánh dấu", !bw || (document.querySelectorAll("#v .cap-s.weak").length === 1 && document.querySelector("#v .cap-s.weak .cap-s-n").textContent === bw.c.n));
  openWeeklyReviewModal(CW); await sleep(20);
  const rb = $("reviewSheetBody"), rvKids = [...rb.firstElementChild.children].filter(x => x.offsetParent);
  ok("V2.19 Tổng kết: ngay sau chọn tuần là giờ theo loại vốn, rồi bánh xe", rvKids[1] && rvKids[1].classList.contains("cap-sum") && /Bánh xe/.test(rvKids[2].textContent), rvKids.slice(0, 3).map(x => x.className));
  ok("V2.20 Tổng kết: không còn 168h / Còn trống / Giờ trong tuần", !/168|Còn .*trống|Giờ trong tuần/.test(rb.textContent));
  ok("V2.21 Tổng kết: dự án, sức khỏe, thói quen nằm sau phần chính", [...rb.querySelectorAll(".rv-sec-h")].map(x => x.textContent.trim())[0] === "Bánh xe cuộc đời");
  closeReviewModal();
  openWeeklyReviewModal(W.findIndex((_, i) => !evs(i).length)); await sleep(10);
  ok("V2.22 Tổng kết tuần trống: vẫn có ô từng vốn (0h hoặc giờ cố định), không lỗi", $("reviewSheetBody").querySelectorAll(".cap-s").length === S.caps.length);
  closeReviewModal();

  // ===== Vòng 3: Ngày, Năm cùng kiểu Tuần; nút và thanh một màu
  const noGrad = el => el && !/gradient/.test(getComputedStyle(el).backgroundImage);
  switchTab("ca"); calSubView = "timeline"; sel = CW; timelineDayIdx = dow(new Date()); draw(); await sleep(20);
  const chips = [...document.querySelectorAll(".timeline-days-nav .tl-dchip")];
  ok("V3.1 Ngày: 7 ô chọn ngày kiểu đầu cột (thứ nhỏ, ngày lớn), ô đang xem có aria-pressed", chips.length === 7 && chips.every(c => c.querySelector("span") && /^\d+\/\d+$/.test(c.querySelector("b").textContent)) && chips.filter(c => c.getAttribute("aria-pressed") === "true").length === 1);
  ok("V3.2 Ngày: hôm nay viền màu nhấn, ngày đã qua có lớp past", chips[dow(new Date())].classList.contains("today") && chips.slice(0, dow(new Date())).every(c => c.classList.contains("past")));
  const th = document.querySelector(".tl-head");
  ok("V3.3 Ngày: đầu ngày cùng kiểu Tuần, hôm nay ngày tô nền, tổng giờ ở ô riêng", th && th.classList.contains("today") && th.querySelector(".day-name") && getComputedStyle(th.querySelector(".day-date")).backgroundColor !== "rgba(0, 0, 0, 0)" && (!dayH(tk) || th.querySelector(".day-h")));
  const tb = document.querySelector(".timeline-event-block");
  ok("V3.4 Ngày: khối hoạt động nền màu vốn nhạt, chữ tối, không vạch, không chuyển màu", !tb || (noGrad(tb) && !/3px 0px 0px 0px inset/.test(getComputedStyle(tb).boxShadow) && getComputedStyle(tb).color !== "rgb(255, 255, 255)"));
  const keepDay = timelineDayIdx; shiftDay(1); await sleep(10);
  ok("V3.5 Ngày: vuốt/phím sang ngày sau vẫn đúng ô đang xem", document.querySelector(".tl-dchip.on") && [...document.querySelectorAll(".tl-dchip")].indexOf(document.querySelector(".tl-dchip.on")) === timelineDayIdx);
  sel = CW; timelineDayIdx = keepDay;
  calSubView = "year"; S.pm = "4"; draw(true); await sleep(20);
  const hs = [...document.querySelectorAll("table.calendar-table th")].map(x => x.textContent.trim());
  ok("V3.6 Năm: bỏ cột Năm; cột Tuần, 7 ngày, Giờ; Thứ 7 và CN tô đầu cột", hs[0] === "Tuần" && hs.length === 9 && !hs.includes("Năm") && document.querySelectorAll("table.calendar-table th.wkend").length === 2, hs);
  const cwRow = $("cw");
  ok("V3.7 Năm: tuần này có vạch màu nhấn, ghi 'Tuần n' và ngày đầu tuần", cwRow && cwRow.classList.contains("current-week") && new RegExp("^Tuần " + (CW + 1)).test(cwRow.querySelector(".yr-wkc").textContent.trim()));
  const tdc = document.querySelector("td.cal-day-cell.is-today");
  ok("V3.8 Năm: hôm nay viền màu nhấn, ngày tô nền; không còn nhãn 'Nay'", tdc && getComputedStyle(tdc.querySelector(".cd-date")).backgroundColor !== "rgba(0, 0, 0, 0)" && !/\bNay\b/.test(tdc.textContent));
  const ce = document.querySelector(".cd-ev");
  ok("V3.9 Năm: hoạt động trong ô cùng kiểu (nền nhạt, chấm màu)", ce && noGrad(ce) && (el => el && getComputedStyle(el, "::before").backgroundColor !== "rgba(0, 0, 0, 0)" && getComputedStyle(el, "::before").borderTopLeftRadius === "50%")(ce));
  ok("V3.10 Năm: tổng giờ là ô tròn như đầu cột ngày", !!document.querySelector("td.yr-tot .day-h"));
  calSubView = "focus"; draw(); await sleep(10);
  // Nút và thanh một màu
  const samples = [document.querySelector("#addBtn"), document.querySelector("#reviewBtn"), document.querySelector(".wk-bar .btn"), document.querySelector(".segmented-control button.active"), document.querySelector(".nav-count"), document.querySelector("nav.main-nav button.active"), document.querySelector(".cap-s"), document.querySelector(".event-item"), document.querySelector(".sidebar"), document.querySelector(".hb-chip")].filter(Boolean);
  ok("V3.11 nút, thanh, nhãn không còn chuyển màu (gradient)", samples.length >= 8 && samples.every(noGrad), samples.filter(x => !noGrad(x)).map(x => x.className + " " + getComputedStyle(x).backgroundImage.slice(0, 60)));
  ok("V3.12 nút chính một màu hồng (kính nhuộm hồng), nút Tổng kết một màu oliu, không chuyển màu", /^(rgba?\(224, 163, 187|color\(srgb 0\.8784\d* 0\.6392\d* 0\.7333)/.test(getComputedStyle($("addBtn")).backgroundColor) && noGrad($("addBtn")) && /^(rgba?\(151, 161, 59|color\(srgb 0\.5921\d* 0\.6313\d* 0\.2313)/.test(getComputedStyle($("reviewBtn")).backgroundColor) && noGrad($("reviewBtn")), [getComputedStyle($("addBtn")).backgroundColor, getComputedStyle($("reviewBtn")).backgroundColor]);
  switchTab("hv"); hvMoreT("task:" + S.tasks.find(t => !taskDone(t)).id); await sleep(10);
  ok("V3.13 ô chọn loại vốn trong khay: một màu", noGrad(document.querySelector("#v .hv-tray select")));
  hvMore = ""; openSettingsModal(); await sleep(20);
  ok("V3.14 Cài đặt: nút chọn đang bật một màu", [...document.querySelectorAll("#settingsSheetBody .set-seg button.on")].every(noGrad));
  closeSettingsModal(); openWeeklyReviewModal(CW); await sleep(20);
  ok("V3.15 Tổng kết: không khối nào chuyển màu", [...$("reviewSheetBody").querySelectorAll("*")].every(noGrad));
  closeReviewModal();

  // ===== Vòng 4: popup, thông báo cùng thứ bậc; kính mờ mềm; tương phản chuẩn
  const crCode = await (await fetch("/tests/e2e/contrast.js?" + Date.now())).text();
  const noAnim = document.createElement("style"); noAnim.textContent = "*{transition:none!important;animation:none!important}"; document.head.appendChild(noAnim); // đo lúc đã hiện hẳn, không đo giữa hiệu ứng mờ dần
  document.querySelectorAll(".toast").forEach(t => t.remove());
  const pops = [[() => openEditor(tk), closeEditor, "Thêm hoạt động"], [() => openEditor(Object.keys(S.ev).sort().pop(), 0), closeEditor, "Sửa hoạt động"], [() => openWeeklyReviewModal(CW), closeReviewModal, "Tổng kết"], [() => openSched("task", S.tasks.find(t => t.subs.length && !taskDone(t)).id, tk), closeSched, "Xếp lịch"], [() => hbOpen(S.habits[0].id), closeHb, "Thói quen"], [() => hlOpen(tk), closeHl, "Sức khỏe"], [() => hlMedOpen(), closeHl, "Thuốc"], [() => openProject(S.projects[0].id), closeProject, "Dự án"]];
  const bad = [];
  for (const [o, c, l] of pops) {
    o(); await sleep(60);
    const ov = document.querySelector(".modal-overlay.open"), sh = ov && ov.querySelector(".modal-sheet"), hd = sh && sh.querySelector(".modal-header"), bd = sh && sh.querySelector(".modal-body");
    const ft = sh && sh.querySelector(".sheet-foot, .pj-form-acts, .hl-acts, .pjd-acts");
    const okHead = hd && hd.querySelector(".sheet-x.ic-btn");
    const okFoot = ft && getComputedStyle(ft).position === "sticky" && Math.abs(ft.getBoundingClientRect().left - bd.getBoundingClientRect().left) < 2 && /rgba/.test(getComputedStyle(ft).boxShadow) && ft.querySelector(".btn-primary");
    const okGlass = sh && /blur/.test(getComputedStyle(sh).backdropFilter) && (a => a > 0.6 && a < 1)(parseFloat((getComputedStyle(sh).backgroundColor.split(",")[3]) || "1")) && parseFloat(getComputedStyle(sh).borderTopWidth) === 0;
    const cr = eval(crCode);
    if (!okHead || !okFoot || !okGlass || cr.length) bad.push({ l, okHead: !!okHead, okFoot: !!okFoot, okGlass: !!okGlass, cr: cr.slice(0, 3) });
    c(); await sleep(40);
  }
  ok("V4.1 mọi popup: đầu có vạch dưới và nút ✕ cùng kiểu, chân cố định ở đáy tràn hết bề ngang có nút chính, nền kính hơi trong, chữ và viền ô nhập đạt tương phản", !bad.length, bad);
  const del = [...document.querySelectorAll("body button")].filter(b => /^Xóa/.test(b.textContent.trim()) && !b.classList.contains("x-del"));
  openEditor(Object.keys(S.ev).sort().pop(), 0); await sleep(30);
  const dB = [...$("sheetBody").querySelectorAll("button")].find(b => b.textContent.trim() === "Xóa");
  ok("V4.2 nút Xóa ở chân popup bên trái, chữ đỏ đậm đủ tương phản", dB && dB.classList.contains("btn-del") && dB.getBoundingClientRect().left < $("sheetBody").getBoundingClientRect().left + 40);
  closeEditor(); await sleep(20);
  const tt = showToast("Thử thông báo", "ok", { label: "Hoàn tác", fn: () => {} }); await sleep(20);
  const te = [...document.querySelectorAll(".toast")].pop();
  ok("V4.3 thông báo nhỏ: khối kính nổi không viền, chấm màu theo loại", te && parseFloat(getComputedStyle(te).borderLeftWidth) === 0 && /blur/.test(getComputedStyle(te).backdropFilter) && getComputedStyle(te, "::before").backgroundColor !== "rgba(0, 0, 0, 0)");
  if (tt && tt.hide) tt.hide(); document.querySelectorAll(".toast").forEach(t => t.remove());
  switchTab("ca"); calSubView = "focus"; draw(); await sleep(20);
  const crPage = eval(crCode);
  ok("V4.4 tab Lịch: mọi chữ ≥ 4.5:1 (chữ lớn ≥ 3:1), viền ô nhập ≥ 3:1", !crPage.length, crPage.slice(0, 5));
  noAnim.remove();
  ok("V4.5 hiệu năng: khối trong vùng cuộn không làm mờ nền (nền trắng gần đặc), popup đóng thì ẩn hẳn", (a => a >= 0.75 && a < 0.95)(parseFloat(getComputedStyle(document.querySelector(".day-card")).backgroundColor.split(",")[3])) && getComputedStyle(document.querySelector(".day-card")).backdropFilter === "none" && [...document.querySelectorAll(".modal-overlay:not(.open)")].every(o => getComputedStyle(o).visibility === "hidden"));

  // ===== Vòng 5: liquid glass, không nét viền đen
  const stCode = await (await fetch("/tests/e2e/strokes.js?" + Date.now())).text();
  const na = document.createElement("style"); na.textContent = "*{transition:none!important;animation:none!important}"; document.head.appendChild(na);
  const stBad = [];
  for (const [t, sv] of [["ca", "focus"], ["ca", "timeline"], ["ca", "year"], ["hv"], ["pj"], ["hl"], ["su"], ["me"]]) { if (sv) calSubView = sv; switchTab(t); await sleep(20); stBad.push(...eval(stCode).map(x => t + " " + x)); }
  for (const [o, c] of pops) { o(); await sleep(40); stBad.push(...eval(stCode).map(x => "popup " + x)); c(); await sleep(20); }
  ok("V5.1 không có nét viền đen/xám đậm ở mọi tab và popup", !stBad.length, stBad.slice(0, 6));
  switchTab("ca"); calSubView = "focus"; draw(); await sleep(20);
  const dc = getComputedStyle(document.querySelector(".day-card")), sb = getComputedStyle(document.querySelector(".sidebar"));
  ok("V5.2 khối: mặt trắng gần đặc, sáng mép trên, bóng nhẹ; chỉ thứ nổi cố định mới làm mờ nền", (a => a < 0.95)(parseFloat(dc.backgroundColor.split(",")[3])) && dc.backdropFilter === "none" && /inset/.test(dc.boxShadow) && /rgb\(255, 255, 255\)|rgba\(255, 255, 255/.test(dc.boxShadow));
  const edge = parseFloat((dc.borderTopColor.match(/[\d.]+\)$/) || ["1)"])[0]);
  ok("V5.3 khung không viền, nổi bằng bóng ngả hồng", parseFloat(dc.borderTopWidth) === 0 || /rgba\(0, 0, 0, 0\)/.test(dc.borderTopColor), dc.borderTopColor);
  const cb = document.querySelector('#v input[type="checkbox"]') || (() => { switchTab("hv"); draw(); return document.querySelector('#v input[type="checkbox"]'); })();
  ok("V5.4 ô tích tự vẽ, viền hồng", cb && getComputedStyle(cb).appearance === "none" && /rgb\(184, 100, 138\)/.test(getComputedStyle(cb).borderTopColor), cb && getComputedStyle(cb).borderTopColor);
  openEditor(tk); await sleep(30);
  const ms = getComputedStyle(document.querySelector("#modalOverlay .modal-sheet"));
  ok("V5.5 popup đang mở là kính mờ (chỉ khi mở)", (a => a > 0.5 && a < 0.95)(parseFloat(ms.backgroundColor.split(",")[3])) && /blur/.test(ms.backdropFilter));
  closeEditor();
  // Vòng 6: hạn chế viền — ngoài ô nhập, ô tích, bảng: không khối nào còn viền thấy được
  const visBorders = () => { const pa = c => { let m = c.match(/rgba?\(([^)]+)\)/); if (m) { const q = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return q[3] == null ? 1 : q[3]; } m = c.match(/color\(srgb ([^)]+)\)/); if (m) { const q = m[1].split(/[ \/]+/).filter(Boolean).map(Number); return q[3] == null ? 1 : q[3]; } return 1; }; const o = []; const ov = document.querySelector(".modal-overlay.open"); for (const el of (ov || document.body).querySelectorAll("*")) { if (!ov && el.closest(".modal-overlay")) continue; const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue; if (/^(INPUT|SELECT|TEXTAREA|TD|TH|TABLE|TR)$/.test(el.tagName) || el.closest(".pj-wk-bars, .tl-scroll, .tl, .pjl-sec, .hl-bars, .rv-nav, .tl-dia")) continue; const cs = getComputedStyle(el); if (cs.display === "none" || cs.visibility === "hidden") continue; for (const sd of ["Top", "Right", "Bottom", "Left"]) { if (parseFloat(cs["border" + sd + "Width"]) > 0 && cs["border" + sd + "Style"] !== "none" && pa(cs["border" + sd + "Color"]) > 0.12) { o.push((typeof el.className === "string" ? el.className.split(" ")[0] : el.tagName) + " " + sd); break; } } } return [...new Set(o)]; };
  const vb = [];
  for (const [t, sv] of [["ca", "focus"], ["ca", "timeline"], ["hv"], ["hl"], ["su"]]) { if (sv) calSubView = sv; switchTab(t); await sleep(20); vb.push(...visBorders().map(x => t + " " + x)); }
  openEditor(tk); await sleep(30); vb.push(...visBorders().map(x => "popup " + x)); closeEditor();
  calSubView = "focus"; switchTab("ca");
  ok("V6.1 hạn chế viền: các khối, nút, chip, thông báo không còn viền (chỉ ô nhập, ô tích, bảng giữ viền mảnh)", vb.length <= 3, vb);
  const hm = (switchTab("hl"), document.querySelector("#v .hl-m"));
  ok("V6.2 chip lựa chọn là viên nổi (bóng, không viền)", hm && parseFloat(getComputedStyle(hm).borderTopWidth) >= 0 && /rgba\(0, 0, 0, 0\)/.test(getComputedStyle(hm).borderTopColor) && getComputedStyle(hm).boxShadow !== "none");
  // Vòng 7: mục đang chọn rõ; danh sách dự án khít và nổi
  switchTab("pj"); pjOpenId = null; draw(); await sleep(20);
  const navA = document.querySelector("nav.main-nav button.active");
  const isAc = c => /^(rgba?\(224, 163, 187|color\(srgb 0\.8784)/.test(c);
  ok("V7.1 thanh tab: mục đang chọn là viên hồng đặc, chữ đậm", navA && isAc(getComputedStyle(navA).backgroundColor) && +getComputedStyle(navA).fontWeight >= 700, navA && getComputedStyle(navA).backgroundColor);
  const rows = [...document.querySelectorAll("#v .pj-row")];
  const gaps = rows.slice(1).map((r, i) => Math.round(r.getBoundingClientRect().top - rows[i].getBoundingClientRect().bottom));
  ok("V7.2 danh sách dự án: các thanh cách nhau ≤ 10px, mỗi thanh có ô chữ cái đầu và nền nhuộm màu dự án", rows.length && gaps.every(g => g <= 10) && rows.every(r => r.querySelector(".pj-ava")), gaps);
  pjOpen(S.projects[0].id); pjSetView("li"); await sleep(20);
  const tabOn = document.querySelector(".pj-tabs button.on"), chk = document.querySelector("#v .pjr-chk input");
  ok("V7.3 tab dự án đang chọn là viên hồng; ô tích vuông 18px", tabOn && isAc(getComputedStyle(tabOn).backgroundColor) && chk && Math.round(chk.getBoundingClientRect().width) === Math.round(chk.getBoundingClientRect().height));
  pjOpenId = null;
  // v0.6.1 hiệu năng: đếm lớp làm mờ đang hiện trên mỗi tab
  const visB = () => [...document.querySelectorAll("*")].filter(e => { const b = getComputedStyle(e).backdropFilter; if (!b || b === "none") return false; for (let p = e; p; p = p.parentElement) { const c = getComputedStyle(p); if (c.display === "none" || c.visibility === "hidden") return false; } return true; }).length;
  const blurN = {};
  for (const [t, sv] of [["ca", "focus"], ["ca", "year"], ["hv"], ["pj"], ["hl"], ["su"], ["me"]]) { if (sv) calSubView = sv; switchTab(t); await sleep(20); blurN[t + (sv || "")] = visB(); }
  ok("V8.1 hiệu năng: mỗi tab tối đa 2 lớp làm mờ nền (thanh tab, ô ghi nhanh), nền trang không lọc mờ khi không có ảnh", Object.values(blurN).every(n => n <= 2) && (document.body.classList.contains("has-bg") || getComputedStyle(document.body, "::before").filter === "none"), blurN);
  calSubView = "focus";
  switchTab("ca"); na.remove();

  window.ask = ask0;
  switchTab("ca");
  const pass = out.filter(x => x.pass).length;
  return { pass, total: out.length, fail: out.filter(x => !x.pass) };
};
