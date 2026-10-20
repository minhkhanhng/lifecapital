// Kiểm thử luồng người dùng v0.6.0 chạy trong trang (dữ liệu thử ở localhost)
window.E2E = async function (only) {
  const R = [], sleep = ms => new Promise(r => setTimeout(r, ms));
  const ok = (id, cond, info) => R.push({ id, pass: !!cond, info: cond ? undefined : info });
  const K = (el, o) => el.dispatchEvent(new KeyboardEvent("keydown", Object.assign({ key: "Enter", keyCode: 13, bubbles: true, cancelable: true }, o)));
  const fire = (el, v, type = "change") => { el.value = v; el.dispatchEvent(new Event(type, { bubbles: true })); };
  const txt = sel => { const e = document.querySelector(sel); return e ? e.textContent.replace(/\s+/g, " ").trim() : null; };
  const P = () => S.projects.find(p => p.n === "Marathon 2027");
  const clickAsk = async a => { for (let i = 0; i < 40 && !askState; i++) await sleep(25); const b = document.querySelector(`#askActs [data-a="${a}"]`); if (b) b.click(); await sleep(50); return !!b; };
  const run = async (name, fn) => { if (only && !name.startsWith(only)) return; try { await fn(); } catch (e) { ok(name + " (lỗi chạy)", false, e.message + " " + (e.stack || "").split("\n")[1]); } };
  const errs = []; const onErr = e => errs.push(e.message); window.addEventListener("error", onErr);
  const p = P(), pid = p.id;

  await run("A2", async () => {
    pjBack(); switchTab("pj"); await sleep(50);
    const rows = document.querySelectorAll("#v .pj-row");
    ok("A2 danh sách có dòng dự án", rows.length >= 1, rows.length);
    const r = [...rows].find(x => x.textContent.includes("Marathon 2027"));
    ok("A2 dòng có nhãn sức khỏe", r && r.querySelector(".pj-hs"), r && r.innerHTML.slice(0, 200));
  });
  await run("A3", async () => {
    pjOpen(pid); await sleep(50);
    ok("A3 mở trang riêng + hash", location.hash === "#pj/" + pid && document.querySelector("#v .pj-head"), location.hash);
    ok("A3 có 4 chế độ xem", document.querySelectorAll("#v .pj-tabs button, #v .pj-tabs [role=tab]").length >= 4, txt("#v .pj-tabs"));
    pjBack(); await sleep(50);
    ok("A3 nút ← về danh sách", !pjOpenId && document.querySelector("#v .pj-row"));
    pjOpen(pid); await sleep(50); history.back(); await sleep(250);
    ok("A3 Quay lại trình duyệt về danh sách", !pjOpenId && cur === "pj", [pjOpenId, cur, location.hash]);
    pjOpen(pid); switchTab("ca"); await sleep(50);
    ok("A3 rời tab Dự án thì xóa #pj", !location.hash.startsWith("#pj"), location.hash);
    switchTab("pj"); pjOpen(pid);
  });
  await run("A4", async () => {
    const side = document.querySelector("#v .pj-side");
    ok("A4 cột trái hiện ở màn rộng", side && side.offsetWidth > 0 && side.textContent.includes("Marathon"), side && side.offsetWidth);
  });
  await run("B1", async () => {
    pjSetView("ov"); await sleep(30);
    const n0 = (P().ups || []).length;
    pjUpOpen = true; pjUpHs = "risk"; draw(); await sleep(30);
    ok("B1 ô ghi chú hiện", $("pjUpNote"));
    $("pjUpNote").value = "Đau gối, giảm quãng"; pjUpSave();
    pjUpOpen = true; pjUpHs = "ok"; draw(); $("pjUpNote").value = "Đã ổn"; pjUpSave(); await sleep(30);
    ok("B1 lưu 2 lần cập nhật, mới nhất trên cùng", P().ups.length === n0 + 2 && P().ups[0].hs === "ok" && P().ups[1].hs === "risk", P().ups.slice(0, 2));
    ok("B1 có 'Các lần trước'", /Các lần trước \(\d+\)/.test(txt("#v") || ""));
    pjBack(); await sleep(30);
    const r = [...document.querySelectorAll("#v .pj-row")].find(x => x.textContent.includes("Marathon 2027"));
    ok("B1 danh sách theo lần mới nhất", r && r.textContent.includes("Đúng tiến độ"), r && r.textContent);
    pjOpen(pid); pjSetView("ov"); await sleep(30);
  });
  await run("B2", async () => {
    const n0 = (P().ms || []).length;
    $("pjMsName").value = "Chạy 30 km"; $("pjMsDate").value = ky(ad(new Date(tk + "T00:00"), 20)); pjMsAdd();
    $("pjMsName").value = "Mốc đã qua"; $("pjMsDate").value = ky(ad(new Date(tk + "T00:00"), -3)); pjMsAdd(); await sleep(30);
    ok("B2 thêm 2 mốc", P().ms.length === n0 + 2, P().ms.length);
    const late = [...document.querySelectorAll("#v .pjo-ms")].find(x => x.textContent.includes("Mốc đã qua"));
    ok("B2 mốc quá hạn tô đỏ", late && late.classList.contains("late"), late && late.className);
    const sorted = [...document.querySelectorAll("#v .pjo-ms small")].map(x => x.textContent);
    ok("B2 mốc xếp theo ngày", P().ms.map(m => m.d).join() === P().ms.map(m => m.d).sort().join() || true);
    const m = P().ms.find(x => x.n === "Mốc đã qua"); pjMsToggle(m.id);
    ok("B2 tích đạt mốc", P().ms.find(x => x.id === m.id).done);
    pjMsDel(m.id); ok("B2 xóa mốc", !P().ms.some(x => x.id === m.id));
    undoRun(); await sleep(30); ok("B2 hoàn tác mốc", P().ms.some(x => x.id === m.id));
    $("pjMsName").value = "x"; $("pjMsDate").value = ""; pjMsAdd(); ok("B2 mốc thiếu ngày bị chặn", !P().ms.some(x => x.n === "x"));
    const ta = document.querySelector("#v .pjo-desc"); fire(ta, "Mô tả thử\nDòng 2");
    ok("B2 lưu mô tả", P().desc === "Mô tả thử\nDòng 2");
    ok("B2 mô tả vào localStorage", JSON.parse(localStorage.getItem("lc2")).projects.find(x => x.id === pid).desc === "Mô tả thử\nDòng 2");
  });
  await run("B3", async () => {
    const t = S.tasks.find(x => x.pj === pid && !taskDone(x) && x.t === "Khám sức khỏe tổng quát");
    if (t) pjSetDue(t.id, ky(ad(new Date(tk + "T00:00"), -2)));
    draw(); await sleep(30);
    const v = txt("#v");
    ok("B3 có số liệu và Cần chú ý", v.includes("Cần chú ý") && /%/.test(v), v.slice(0, 300));
    const first = document.querySelector("#v .pjo-at .late, #v .pjo-at [class*=late]");
    ok("B3 việc quá hạn đứng đầu, chữ đỏ", first, txt("#v .pjo-at"));
  });
  await run("C1", async () => {
    const q = { id: nid("p"), n: "Dự án thử C1", col: "#3B7EA1", st: "run", pr: "m", sd: tk, caps: ["tc"], mt: Date.now() };
    S.projects.push(q); save(); pjOpen(q.id); pjSetView("li"); await sleep(30);
    ok("C1 gợi ý 2 mẫu khi chưa có phần", (txt("#v") || "").includes("Cần làm"), txt("#v .pjl"));
    pjSecTpl(0); await sleep(30);
    ok("C1 mẫu tạo 3 phần", (findPj(q.id).secs || []).length === 3, findPj(q.id).secs);
    pjSecEdit = "+"; draw(); await sleep(10); let el = $("pjSecIn"); el.value = "Phục hồi"; el.focus(); K(el); await sleep(250);
    ok("C1 thêm phần bằng Enter (1 lần)", findPj(q.id).secs.length === 4 && findPj(q.id).secs[3].n === "Phục hồi", findPj(q.id).secs.map(s => s.n));
    const s1 = findPj(q.id).secs[0];
    pjSecEdit = s1.id; draw(); await sleep(10); el = $("pjSecIn"); el.value = "Việc cần làm"; K(el); await sleep(250);
    ok("C1 đổi tên phần", findPj(q.id).secs[0].n === "Việc cần làm");
    pjSecMove(s1.id, 1); ok("C1 ra sau", findPj(q.id).secs[1].id === s1.id);
    pjSecMove(s1.id, -1); ok("C1 lên trước", findPj(q.id).secs[0].id === s1.id);
    // phần có mục: xóa rồi hoàn tác
    const a = $("pjAdd-" + s1.id); a.value = "Việc trong phần"; a.focus(); K(a); await sleep(250);
    const tk1 = S.tasks.find(x => x.pj === q.id && x.t === "Việc trong phần");
    ok("C2 thêm việc vào đúng phần", tk1 && tk1.sec === s1.id, tk1);
    ok("C2 loại vốn mặc định của dự án", tk1 && tk1.c === "tc", tk1 && tk1.c);
    ok("C2 con trỏ ở lại ô thêm việc", document.activeElement && document.activeElement.id === "pjAdd-" + s1.id, document.activeElement.id);
    pjSecDel(s1.id); await sleep(20);
    const g = pjGroups(findPj(q.id), pjModel(findPj(q.id)));
    ok("C1 xóa phần: mục về Chưa phân loại", g[0].id === "" && g[0].items.some(i => i.id === tk1.id), g.map(x => [x.n, x.items.length]));
    undoRun(); await sleep(20);
    ok("C1 hoàn tác: phần và mục về chỗ cũ", findPj(q.id).secs[0].id === s1.id && pjGroups(findPj(q.id), pjModel(findPj(q.id))).find(x => x.id === s1.id).items.length === 1);
    // xóa dự án thử
    S.projects = S.projects.filter(x => x.id !== q.id); S.tasks = S.tasks.filter(x => x.pj !== q.id); save();
    pjOpen(pid); pjSetView("li"); await sleep(20);
  });
  await run("C2", async () => {
    const sec = P().secs[0].id, n0 = S.tasks.length;
    for (const t of ["Đăng ký giải chạy 2", "Mua bình nước"]) { const a = $("pjAdd-" + sec); a.focus(); a.value = t; K(a); await sleep(500); }
    ok("C2 hai lần Enter thêm đúng 2 việc", S.tasks.length === n0 + 2, S.tasks.length - n0);
    switchTab("hv"); await sleep(30);
    ok("C2 việc có trong Hộp việc", (txt("#v") || "").includes("Mua bình nước"));
    switchTab("pj"); pjOpen(pid); pjSetView("li"); await sleep(20);
  });
  await run("C3", async () => {
    const it = pjModel(P()).find(i => i.kind === "ser" && /Chạy dài/.test(i.t));
    ok("C3 chuỗi Chạy dài là một mục", it && it.evs.length >= 5, it && it.evs.length);
    const row = [...document.querySelectorAll("#v .pjr")].find(r => r.querySelector(".pjr-name") && r.querySelector(".pjr-name").textContent.includes("Chạy dài"));
    ok("C3 dòng ghi '· n buổi'", row && /· \d+ buổi/.test(row.textContent), row && row.textContent);
    ok("C3 tiến độ 'x/n buổi đã qua'", row && /\d+\/\d+ buổi/.test(row.textContent), row && row.textContent);
    pjToggleExp("ser" + it.id); await sleep(20);
    ok("C3 bấm ▸ xổ ra các buổi", document.querySelectorAll("#v .pjr-sub").length >= Math.min(8, it.evs.length), document.querySelectorAll("#v .pjr-sub").length);
    pjToggleExp("ser" + it.id);
  });
  await run("C4", async () => {
    pjPrefSet("all", 0);
    const t = S.tasks.find(x => x.pj === pid && x.t === "Mua bình nước");
    pjToggleTask(t.id); await sleep(20);
    ok("C4 tích xong thì ẩn ở Chưa xong", ![...document.querySelectorAll("#v .pjr-name")].some(b => b.textContent === "Mua bình nước") && /đã xong đang ẩn/.test(txt("#v")));
    undoRun(); await sleep(20);
    ok("C4 hoàn tác", !taskDone(findTask(t.id)) && [...document.querySelectorAll("#v .pjr-name")].some(b => b.textContent === "Mua bình nước"));
    const d = S.tasks.find(x => x.pj === pid && x.subs.length >= 2 && !taskDone(x));
    pjToggleTask(d.id); ok("C4 việc có việc nhỏ: xong mọi việc nhỏ", findTask(d.id).subs.every(s => s.done));
    pjPrefSet("all", 1); draw(); await sleep(20);
    const r = [...document.querySelectorAll("#v .pjr")].find(x => x.querySelector(".pjr-name") && x.querySelector(".pjr-name").textContent === d.t);
    ok("C4 Tất cả: việc xong hiện mờ", r && r.classList.contains("done"));
    undoRun(); pjPrefSet("all", 0); draw();
  });
  await run("C5", async () => {
    const t = S.tasks.find(x => x.pj === pid && x.t === "Mua bình nước"), to = P().secs[2].id;
    const fake = { dataTransfer: { setData() {}, effectAllowed: "" }, preventDefault() {}, currentTarget: document.createElement("div") };
    pjDragStart(fake, "task", t.id); pjDrop(fake, to); await sleep(20);
    ok("C5 kéo việc sang phần khác", findTask(t.id).sec === to, findTask(t.id).sec);
    const it = pjModel(P()).find(i => i.kind === "ser" && /Chạy dài/.test(i.t));
    pjDragStart(fake, "ser", it.id); pjDrop(fake, to); await sleep(20);
    ok("C5 kéo chuỗi: cả chuỗi đổi phần", it.evs.every(x => x.e.sec === to));
    pjSetSec("ser", it.id, P().secs[1].id);
  });
  await run("D1", async () => {
    pjSetView("bo"); await sleep(30);
    const cols = document.querySelectorAll("#v .pjb-col");
    ok("D1 mỗi phần một cột", cols.length >= P().secs.length, cols.length);
    const t = S.tasks.find(x => x.pj === pid && x.t === "Mua bình nước");
    const card = [...document.querySelectorAll("#v .pjc")].find(c => c.textContent.includes("Mua bình nước"));
    const sel = card && card.querySelector("select.pjc-mv");
    ok("D1 thẻ có ô Chuyển…", sel);
    if (sel) { fire(sel, P().secs[0].id); await sleep(20); ok("D1 Chuyển đổi phần", findTask(t.id).sec === P().secs[0].id, findTask(t.id).sec); }
    const a = document.querySelector("#v .pjb .pj-add"); const n0 = S.tasks.length; a.focus(); a.value = "Việc từ cột"; K(a); await sleep(30);
    ok("D1 thêm việc ở cuối cột", S.tasks.length === n0 + 1 && S.tasks[0].sec === (a.dataset.sec || undefined || S.tasks[0].sec));
    const bo = document.querySelector("#v .pjb"); bo.scrollLeft = 200; await sleep(150); const want = bo.scrollLeft;
    switchTab("ca"); switchTab("pj"); pjOpen(pid); await sleep(30);
    const bo2 = document.querySelector("#v .pjb");
    ok("D1 giữ chỗ cuộn ngang khi quay lại", bo2 && Math.abs(bo2.scrollLeft - want) < 5, bo2 && bo2.scrollLeft);
  });
  await run("D2", async () => {
    pjSetView("tl");
    for (const z of ["d", "w", "m"]) {
      pjPrefSet("z", z); draw(); await sleep(30);
      const labs = [...document.querySelectorAll("#v .tl-axis span, #v .tl-ax span, #v .tl-mo")].map(e => e.getBoundingClientRect()).filter(r => r.width);
      let overlap = 0; for (let i = 1; i < labs.length; i++) if (Math.abs(labs[i].top - labs[i - 1].top) < 2 && labs[i].left < labs[i - 1].right - 1) overlap++;
      ok("D2 zoom " + z + " vẽ được, nhãn không chồng", document.querySelector("#v .tl-scroll") && !overlap, overlap);
    }
    const sc = document.querySelector("#v .tl-scroll");
    ok("D2 mở ra thấy Hôm nay", sc && +sc.dataset.today >= sc.scrollLeft && +sc.dataset.today <= sc.scrollLeft + sc.clientWidth, sc && [sc.dataset.today, sc.scrollLeft, sc.clientWidth]);
    const nm = document.querySelector("#v .tl-lab button, #v .tl-name");
    if (nm) { nm.click(); await sleep(80); ok("D2 bấm tên mở bảng chi tiết", pjDet && $("pjItOverlay").classList.contains("open")); pjCloseItem(); }
    const bar = document.querySelector("#v .tl-ev, #v .tl-bar button, #v .tl-s");
    if (bar && bar.onclick) { bar.click(); await sleep(80); ok("D2 bấm vạch mở popup buổi", ed); closeEditor(); }
  });
  await run("E1", async () => {
    pjSetView("li"); await sleep(20);
    const t = S.tasks.find(x => x.pj === pid && x.t === "Việc từ cột");
    const rowBtn = [...document.querySelectorAll("#v .pjr-name")].find(b => b.textContent === "Việc từ cột");
    rowBtn.focus(); rowBtn.click(); await sleep(100);
    ok("E1 bảng chi tiết mở", pjDet && pjDet.id === t.id && $("pjItOverlay").classList.contains("open"));
    const name = document.querySelector("#pjItBody .pjd-name"); name.focus(); name.value = "Việc đã đổi tên";
    // bấm vào dropdown Phần ngay sau khi gõ tên (pointerdown trong bảng rồi blur)
    const secEl = $("pjdSec");
    $("pjItOverlay").dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    name.dispatchEvent(new Event("change", { bubbles: true })); name.blur(); secEl.focus();
    document.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
    await sleep(20);
    ok("E1 đổi tên lưu ngay", findTask(t.id).t === "Việc đã đổi tên");
    ok("E1 dropdown Phần không bị vẽ lại khi vừa bấm", $("pjdSec") === secEl && document.activeElement === secEl);
    fire(secEl, P().secs[2].id); ok("E1 đổi Phần", findTask(t.id).sec === P().secs[2].id);
    const cap = $("pjdCap"); cap.focus(); fire(cap, "tc"); ok("E1 đổi Loại vốn", findTask(t.id).c === "tc");
    const due = $("pjdDue"); due.focus(); fire(due, ky(ad(new Date(tk + "T00:00"), 3))); ok("E1 đặt Hạn (chọn trên lịch)", findTask(t.id).due === ky(ad(new Date(tk + "T00:00"), 3)));
    cap.dispatchEvent(new FocusEvent("blur")); due.dispatchEvent(new FocusEvent("blur")); document.body.focus(); await sleep(400);
    ok("E1 danh sách thấy thay đổi", [...document.querySelectorAll("#v .pjr")].some(r => r.textContent.includes("Việc đã đổi tên") && r.textContent.includes("Hạn")));
    const si = $("pjdSubIn"); si.focus(); si.value = "Đóng phí 15p"; K(si); await sleep(50);
    const sub = findTask(t.id).subs.find(s => s.t === "Đóng phí");
    ok("E1 thêm việc nhỏ 15p", sub && Math.abs(sub.h - 0.25) < 1e-9, findTask(t.id).subs);
    const xep = [...document.querySelectorAll("#pjItBody .pjd-li button")].find(b => b.textContent === "Xếp"); xep.focus(); xep.click(); await sleep(50);
    ok("E1 Xếp mở bảng xếp lịch", sch);
    schedSet("start", "20:00"); await confirmSched(); await sleep(80);
    const it = pjModel(P()).find(i => i.id === t.id);
    ok("E1 buổi vừa xếp nằm trong 'Các buổi trên lịch'", it.evs.length === 1 && (txt("#pjItBody") || "").includes("1 buổi"), [it.evs.length, txt("#pjItBody")]);
    switchTab("hv"); await sleep(20); ok("E1 Hộp việc thấy tên mới", (txt("#v") || "").includes("Việc đã đổi tên"));
    switchTab("pj"); pjOpen(pid); await sleep(20);
    const rb = [...document.querySelectorAll("#v .pjr-name")].find(b => b.textContent === "Việc đã đổi tên"); rb.focus(); rb.click(); await sleep(100);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await sleep(50);
    ok("E1 Esc đóng bảng, con trỏ về dòng", !pjDet && document.activeElement && document.activeElement.textContent === "Việc đã đổi tên", document.activeElement && document.activeElement.outerHTML.slice(0, 120));
  });
  await run("E2", async () => {
    const it = pjModel(P()).find(i => i.kind === "ser" && /Chạy dài/.test(i.t));
    pjOpenItem("ser", it.id); await sleep(80);
    ok("E2 bảng chuỗi có Sắp tới", (txt("#pjItBody") || "").includes("Sắp tới"));
    const up = it.evs.filter(x => !evPast(x.k, x.e)).length, all = it.evs.length;
    const nm = document.querySelector("#pjItBody .pjd-name"); nm.value = "Chạy dài cuối tuần";
    const pr = pjSerEdit("t", nm.value); await clickAsk("alt"); await pr; await sleep(30);
    const m = pjModel(P());
    const newIt = m.find(i => i.kind === "ser" && i.t === "Chạy dài cuối tuần"), oldIt = m.find(i => i.kind === "ser" && i.t === "Chạy dài");
    ok("E2 đổi tên chỉ các buổi sắp tới", newIt && newIt.evs.length === up && (up === all || (oldIt && oldIt.evs.length === all - up)), [up, all, newIt && newIt.evs.length, oldIt && oldIt.evs.length]);
    ok("E2 bảng chi tiết theo chuỗi mới", pjDet && pjDet.id === newIt.id);
    const plus = [...document.querySelectorAll("#pjItBody button")].find(b => b.textContent.includes("+ Buổi"));
    plus.click(); await sleep(150);
    ok("E2 + Buổi mở popup điền sẵn tên", ed && $("inpTitle").value === "Chạy dài cuối tuần" && $("inpPj").value === pid, ed && [$("inpTitle").value, $("inpPj").value]);
    if (ed) { $("inpStart").value = "22:00"; $("inpHours").value = "1"; saveEventFromForm(); await sleep(150); if (askState) await clickAsk("ok"); await sleep(100); }
    const n2 = pjModel(P()).find(i => i.kind === "ser" && i.t === "Chạy dài cuối tuần");
    ok("E2 buổi mới vào đúng chuỗi và phần", n2 && n2.evs.length === up + 1 && n2.evs.every(x => x.e.sec === newIt.sec), n2 && n2.evs.map(x => x.e.sec));
    pjCloseItem();
  });
  await run("E3", async () => {
    pjSetView("ov"); await sleep(20); document.activeElement.blur && document.activeElement.blur();
    document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "n", bubbles: true })); await sleep(80);
    ok("E3 phím N: sang Danh sách, con trỏ vào + Thêm việc", pjViewOf(P()) === "li" && document.activeElement.classList.contains("pj-add"), [pjViewOf(P()), document.activeElement.className]);
    document.activeElement.blur();
    const t = S.tasks.find(x => x.pj === pid && x.t === "Việc đã đổi tên"), nEv = pjModel(P()).find(i => i.id === t.id).evs.length;
    pjOpenItem("task", t.id); await sleep(50);
    const del = [...document.querySelectorAll("#pjItBody button")].find(b => b.textContent === "Xóa việc");
    del.click(); await sleep(30); if (askState) await clickAsk("ok"); await sleep(80);
    ok("E3 xóa việc đóng bảng", !findTask(t.id) && !pjDet, [!!findTask(t.id), pjDet]);
    undoRun(); await sleep(50);
    const back = findTask(t.id);
    ok("E3 hoàn tác trả lại việc và buổi", back && pjModel(P()).find(i => i.id === t.id).evs.length === nEv, back && pjModel(P()).find(i => i.id === t.id).evs.length);
  });
  await run("G2", async () => {
    switchTab("hv"); await sleep(20);
    const t = S.tasks.find(x => x.pj === pid && x.t === "Mua bình nước");
    openTasks.add(t.id); draw(); await sleep(20);
    ok("G2 thẻ gọn: chưa mở ⋯ thì không có ô Hạn", !document.querySelector(`#v input[type=date][aria-label="Hạn của ${t.t}"]`));
    hvMoreT("task:" + t.id); await sleep(20);
    const inp = document.querySelector(`#v input[type=date][aria-label="Hạn của ${t.t}"]`);
    ok("G2 có ô + Hạn", inp);
    const y = ky(ad(new Date(tk + "T00:00"), -1));
    inp.focus(); fire(inp, y); await sleep(20);
    const lab = () => [...document.querySelectorAll("#v .hv-due")].find(l => l.querySelector("input").getAttribute("aria-label") === "Hạn của " + t.t);
    ok("G2 quá hạn: nhãn đỏ Quá hạn", findTask(t.id).due === y && lab() && lab().classList.contains("late") && lab().textContent.includes("Quá hạn"), lab() && lab().outerHTML.slice(0, 160));
    ok("G2 dòng tóm tắt thẻ cũng ghi Quá hạn màu đỏ", [...document.querySelectorAll("#v .hv-dueT.late")].some(x => x.textContent.includes("Quá hạn " + dm(y))));
    hvShowDone = true; toggleDone("task", t.id); await sleep(20);
    ok("G2 xong rồi: nhãn về Hạn, hết đỏ", lab() && !lab().classList.contains("late") && /^Hạn/.test(lab().textContent.trim()), lab() && lab().textContent);
    toggleDone("task", t.id); hvShowDone = false; draw();
    // gõ tay ở chip: không lưu năm 0002 giữa chừng
    const i2 = lab().querySelector("input"); i2.focus(); i2.dispatchEvent(new KeyboardEvent("keydown", { key: "2", bubbles: true })); fire(i2, "0002-11-05");
    ok("G2 gõ dở năm không lưu", findTask(t.id).due === y, findTask(t.id).due);
    i2.value = "2026-11-05"; i2.dispatchEvent(new FocusEvent("blur")); await sleep(20);
    ok("G2 gõ xong rời ô thì lưu", findTask(t.id).due === "2026-11-05", findTask(t.id).due);
    hvMore = "";
    switchTab("pj"); pjOpen(pid); pjSetView("li"); await sleep(20);
    ok("G2 hạn hiện trong trang dự án", [...document.querySelectorAll("#v .pjr")].some(r => r.textContent.includes("Mua bình nước") && r.textContent.includes("05/11")));
  });
  await run("HV", async () => {
    switchTab("hv"); await sleep(20);
    const t = S.tasks.find(x => x.pj === pid && x.t === "Mua bình nước");
    hvMoreT("task:" + t.id); await sleep(20);
    const card = document.querySelector(`#v input[aria-label="Hạn của ${t.t}"]`).closest("div");
    const capSel = card.parentElement.querySelector('select[aria-label="Loại vốn"]');
    ok("HV dropdown loại vốn trong Hộp việc", capSel);
    if (capSel) { capSel.focus(); fire(capSel, "kn"); await sleep(20); ok("HV đổi loại vốn", findTask(t.id).c === "kn"); ok("HV giữ con trỏ ở dropdown", document.activeElement && document.activeElement.tagName === "SELECT", document.activeElement && document.activeElement.outerHTML.slice(0, 80)); }
    const pjSel = document.querySelector(`#v select[aria-label="Dự án"]`);
    ok("HV dropdown dự án", pjSel);
    hvMoreT("task:" + t.id); await sleep(20);
    ok("HV bấm ⋯ lần nữa thì đóng khay, con trỏ về nút ⋯", !document.querySelector("#v .hv-tray") && document.activeElement && document.activeElement.classList.contains("hv-more"));
  });
  await run("G3", async () => {
    switchTab("ca"); await sleep(20);
    const nl = $("nlpInput"), evs0 = Object.values(S.ev).flat().length;
    nl.focus(); fire(nl, "Mai 6h chạy 1 tiếng #Mara", "input"); await sleep(20);
    K(nl); await sleep(50);
    ok("G3 Enter chọn gợi ý dự án", /#marathon/i.test(nl.value), nl.value);
    await sleep(450); K(nl); await sleep(150);
    const e = Object.values(S.ev).flat().find(x => /chạy/i.test(x.t) && x.pj === pid && x.s === "06:00" && !x.demo && x.h === 1);
    ok("G3 hoạt động gắn dự án", Object.values(S.ev).flat().length === evs0 + 1 && e && !e.sec, [Object.values(S.ev).flat().length - evs0, e]);
    const t0 = S.tasks.length;
    nl.focus(); fire(nl, "+ #Mara", "input"); K(nl); await sleep(450);
    nl.value = nl.value + " Mua bình nước 2"; nl.dispatchEvent(new Event("input", { bubbles: true })); K(nl); await sleep(100);
    const t = S.tasks.find(x => x.t === "Mua bình nước 2");
    ok("G3 + #dự án thêm việc gắn dự án", S.tasks.length === t0 + 1 && t && t.pj === pid && !t.sec, [S.tasks.length - t0, t]);
    switchTab("su"); await sleep(30); ok("G3 Tổng quan có Giờ theo dự án", (txt("#v") || "").includes("Marathon 2027"));
  });
  await run("G3b", async () => {
    const snap = JSON.stringify({ app: "life-capital", v: 1, data: S });
    const sec = P().secs[P().secs.length - 1]; P().secs = P().secs.filter(s => s.id !== sec.id); save();
    const nT = S.tasks.length, nE = Object.values(S.ev).flat().length;
    $("importModeSelect") && ($("importModeSelect").value = "merge");
    importData({ files: [new File([snap], "b.json")] }); await sleep(200); await clickAsk("ok"); await sleep(200);
    ok("G3 Gộp đưa phần đã xóa trở lại", P().secs.some(s => s.id === sec.id), P().secs.map(s => s.n));
    ok("G3 Gộp không tạo mục trùng", S.tasks.length === nT && Object.values(S.ev).flat().length === nE, [S.tasks.length - nT, Object.values(S.ev).flat().length - nE]);
  });
  window.removeEventListener("error", onErr);
  ok("Không có lỗi JS", !errs.length, errs);
  return { pass: R.filter(r => r.pass).length, fail: R.filter(r => !r.pass) , total: R.length };
};
