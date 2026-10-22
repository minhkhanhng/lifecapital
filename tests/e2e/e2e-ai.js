// v0.6.4 Nhờ AI xếp: giả lập đăng nhập và máy chủ /api/ai_plan (không gọi AI thật). Chạy sau loadDemo().
window.E2EAI = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const ask0 = window.ask, fetch0 = window.fetch, sbU0 = sbUser, sb0 = sb;
  const crCode = await (await fetch0("/tests/e2e/contrast.js?" + Date.now())).text();
  const stCode = await (await fetch0("/tests/e2e/strokes.js?" + Date.now())).text();
  const noAnim = document.createElement("style"); noAnim.textContent = "*{transition:none!important;animation:none!important}"; document.head.appendChild(noAnim);
  let asked = null; window.ask = async o => { asked = o; return true; };
  let calls = [], reply = null, hold = null, probe = { status: 200, body: { ready: true } }, probes = 0;
  const resp = r => ({ ok: r.status === 200, status: r.status, headers: { get: k => /content-type/i.test(k) ? (r.ct || "application/json") : null }, json: async () => r.body });
  window.fetch = async (url, opt) => {
    if (!String(url).includes("/api/ai_plan")) return fetch0(url, opt);
    if (!opt || !opt.method || opt.method === "GET") { probes++; if (probe instanceof Error) throw probe; return resp(probe); } // hỏi AI có dùng được không
    const body = JSON.parse(opt.body); calls.push({ url, opt, body });
    if (hold) await hold;
    if (opt.signal && opt.signal.aborted) throw Object.assign(new Error("aborted"), { name: "AbortError" });
    const r = typeof reply === "function" ? reply(body) : reply;
    if (r instanceof Error) throw r;
    return resp(r);
  };
  const tday = tk, m0 = schedMap();
  const sel0 = S.tasks.filter(t => !taskDone(t)).flatMap(t => { const ms = new Set(missedOf(t, m0).map(u => u.tk)); return units(t).filter(u => !u.done && (!m0.has(u.tk) || ms.has(u.tk))); });
  const errs0 = []; const onErr = e => errs0.push(String(e.message || e.reason)); addEventListener("error", onErr); addEventListener("unhandledrejection", onErr);
  const btnAny = () => document.querySelectorAll(".ai-btn").length;
  const toasts = () => [...document.querySelectorAll(".toast")].map(t => t.textContent).join(" | ");
  const hvAll = async () => { switchTab("hv"); await sleep(10); const a = btnAny(); switchTab("ca"); calSubView = "focus"; inboxPanel = true; draw(); await sleep(10); return a + btnAny(); };
  const session = { auth: { getSession: async () => ({ data: { session: { access_token: "tok_" + "x".repeat(30) } } }) } };

  // ===== N: không có AI thì app như trước, không rào cản nào
  document.querySelectorAll(".toast").forEach(t => t.remove());
  sbUser = null; aiReady = false; probes = 0;
  ok("N1.1 chưa đăng nhập đồng bộ: không có nút AI ở đâu, không hỏi máy chủ", (await hvAll()) === 0 && (await aiProbe()) === false && probes === 0);
  switchTab("hv"); await sleep(10);
  ok("N1.2 Hộp việc vẫn như trước: đếm việc, ô thêm việc, nút Xếp / Xếp hết", /việc chưa xếp xong/.test($("v").textContent) && $("v").querySelector(".hv-add") && [...$("v").querySelectorAll(".hv-sched")].length > 0);
  const t0 = S.tasks.find(t => !taskDone(t) && t.subs.some(s => !s.done && !schedMap().has(s.id)));
  openSched("task", t0.id, tk); await sleep(20);
  ok("N1.3 Xếp hết (tay) vẫn mở và chạy khi không có AI", !!sch && $("schedOverlay").classList.contains("open"));
  closeSched();
  sbUser = { id: "u1", email: "a@b.c" }; sb = session;
  for (const [id, pv, label] of [["N2.1", { status: 200, body: { ready: false } }, "máy chủ chưa có khóa AI hoặc tài khoản chưa được phép"],
    ["N2.2", { status: 404, body: null, ct: "text/html" }, "không có máy chủ (hosting tĩnh, bản cũ)"],
    ["N2.3", new TypeError("Failed to fetch"), "mất mạng / mở từ tệp"],
    ["N2.4", { status: 500, body: { error: "x" } }, "máy chủ lỗi"],
    ["N2.5", { status: 200, body: "<html>", ct: "text/html" }, "trả về trang HTML thay vì JSON"]]) {
    probe = pv; aiReady = true;
    const r = await aiProbe(); await sleep(20);
    ok(id + " " + label + ": ẩn nút, không báo lỗi", r === false && (await hvAll()) === 0 && !/AI|lỗi/i.test(toasts()) && !$("aiOverlay").classList.contains("open"));
  }
  ok("N2.6 không có lỗi trang nào trong lúc dò", !errs0.length, errs0);
  // máy chủ sẵn sàng → có nút
  probe = { status: 200, body: { ready: true } };
  await aiProbe(); await sleep(20);
  switchTab("hv"); await sleep(10);
  ok("A1.1 đủ điều kiện: Hộp việc có nút Nhờ AI xếp (có biểu tượng)", !!document.querySelector("#v .hv-top .ai-btn .ico"));
  switchTab("ca"); calSubView = "focus"; inboxPanel = true; draw(); await sleep(10);
  ok("A1.2 cột Hộp việc cạnh lịch cũng có nút", innerWidth < 1024 || !!document.querySelector(".inbox-aside .ai-btn"));
  const on0 = navigator.onLine; Object.defineProperty(navigator, "onLine", { value: false, configurable: true }); draw(); await sleep(10);
  ok("N3.1 mất mạng: ẩn nút", btnAny() === 0);
  Object.defineProperty(navigator, "onLine", { value: on0, configurable: true }); delete navigator.onLine; draw(); await sleep(10);
  ok("N3.2 có mạng lại: nút trở lại", btnAny() > 0);
  cloudStop(); await sleep(20); draw();
  ok("N3.3 đăng xuất: ẩn nút ngay", !aiReady && btnAny() === 0);

  // ===== gọi thẳng khi chưa đăng nhập (không có nút, phòng hờ): nhắc, không gọi máy chủ
  sbUser = null; calls = [];
  await aiPlan(); await sleep(10);
  ok("A2.1 chưa đăng nhập: nhắc đăng nhập đồng bộ, không gọi máy chủ", asked && /đăng nhập đồng bộ/.test(asked.msg) && !calls.length && !$("aiOverlay").classList.contains("open"));
  aiReady = true;

  // ===== đăng nhập giả
  sbUser = { id: "u1", email: "a@b.c" }; sb = session;
  const free = d => { const L = (S.ev[d] || []).filter(e => e.s).map(e => [toMin(e.s), toMin(e.s) + e.h * 60]); for (let t = 600; t < 1260; t += 30) if (!L.some(([a, b]) => a < t + 120 && t < b)) return t; return null; };
  const d1 = ky(ad(new Date(tday + "T00:00"), 1)), d2 = ky(ad(new Date(tday + "T00:00"), 2));
  const busy1 = (S.ev[d1] || []).find(e => e.s);
  // dữ liệu để thử: một việc có 3 việc nhỏ, hạn ngày mai
  const T = { id: "taiT", t: "Viết báo cáo AI", c: "kn", m: "u", due: d1, subs: [{ id: "taiA", t: "Dàn ý", h: 1, done: false }, { id: "taiB", t: "Viết nháp", h: 1, done: false }, { id: "taiC", t: "Sửa bài", h: 1, done: false }] };
  S.tasks.push(T); save(); draw();
  const f1 = free(d1), f2 = free(d2);
  reply = body => ({ status: 200, body: { summary: "Ưu tiên Kỹ năng vì còn thiếu giờ.", items: [
    { id: "taiA", date: d1, start: hmOf(f1), reason: "Buổi sáng tập trung" },
    { id: "taiC", date: d1, start: hmOf(f1 + 60), reason: "Làm liền sau dàn ý" },
    { id: "taiB", date: d2, start: hmOf(f2), reason: "Sau hạn nhưng còn chỗ" },
    ...(busy1 ? [{ id: body.todo.find(x => !x.id.startsWith("tai")).id, date: d1, start: busy1.s, reason: "Trùng" }] : []),
    { id: "khongco", date: d1, start: "08:00", reason: "Mã lạ" },
    { id: body.todo.filter(x => !x.id.startsWith("tai"))[1].id, date: tday, start: "00:00", reason: "Giờ đã qua" }
  ], unplaced: [{ id: body.todo.filter(x => !x.id.startsWith("tai"))[2].id, reason: "Hết chỗ trong tuần" }] } });
  let resolve; hold = new Promise(r => { resolve = r; });
  const pr = aiPlan(); await sleep(30);
  ok("A3.1 đang chờ: popup mở, báo AI đang xếp, nút chính tắt", $("aiOverlay").classList.contains("open") && /AI đang xếp/.test($("aiBody").textContent) && $("aiBody").querySelector(".btn-primary").disabled);
  const c0 = calls[0], b = c0 && c0.body;
  ok("A3.2 gửi kèm mã đăng nhập, gọi đúng địa chỉ", c0 && c0.url === "/api/ai_plan" && /^Bearer tok_x+$/.test(c0.opt.headers.Authorization) && c0.opt.method === "POST");
  ok("A3.3 gửi 7 ngày từ hôm nay, khung giờ, mục tiêu vốn", b && b.days.length === 7 && b.days[0] === tday && b.today === tday && /^\d\d:\d\d$/.test(b.window.from) && b.capitals.length === S.caps.length);
  ok("A3.4 chỉ gửi việc chưa xếp (đúng số), có thứ tự và hạn", b && b.todo.filter(x => !x.id.startsWith("tai")).length === Math.min(sel0.length, AI_MAX - 3) && b.todo.filter(x => x.tid === "taiT").map(x => x.i).join() === "0,1,2" && b.todo.find(x => x.id === "taiA").due === d1, [b && b.todo.length, sel0.length]);
  ok("A3.5 giờ bận không kèm tên hoạt động", b && Object.values(b.busy).flat().every(x => Array.isArray(x) && x.length === 2 && x.every(v => /^\d\d:\d\d$/.test(v))));
  ok("A3.6 không gửi dữ liệu sức khỏe (chỉ điểm Sẵn sàng nếu có)", b && Object.keys(b).every(k => ["today", "now", "days", "busy", "todo", "window", "capitals", "ready"].includes(k)) && b.todo.every(x => Object.keys(x).every(k => ["id", "t", "h", "task", "tid", "i", "c", "due", "missed"].includes(k))) && (!("ready" in b) || typeof b.ready === "number"), b && Object.keys(b));
  resolve(); hold = null; await pr; await sleep(20);
  const R = id => ai && ai.rows.find(x => x.id === id);
  ok("A4.1 có tóm tắt của AI", /Ưu tiên Kỹ năng/.test($("aiBody").textContent));
  ok("A4.2 đề xuất hợp lệ thành hàng có ngày giờ, lý do", R("taiA") && R("taiA").s === hmOf(f1) && /Buổi sáng tập trung/.test($("air0").textContent));
  ok("A4.3 sai thứ tự (Sửa bài trước Viết nháp): báo và bỏ chọn sẵn", R("taiB") && R("taiB").warn && !R("taiB").on && R("taiC") && R("taiC").on, ai && ai.rows.map(x => [x.t, x.warn, x.on]));
  ok("A4.4 sau hạn: báo Sau hạn", R("taiB") && /Sai thứ tự|Sau hạn/.test(R("taiB").warn));
  ok("A4.5 trùng giờ, giờ đã qua, mã lạ: không thành hàng; trùng/đã qua vào mục chưa xếp được", ai && !ai.rows.some(x => x.id === "khongco") && (!busy1 || ai.left.some(x => /Trùng giờ/.test(x.why))) && ai.left.some(x => /Giờ đã qua|ngoài khung|Ngoài khung/i.test(x.why)), ai && ai.left);
  ok("A4.6 việc AI không xếp: hiện lý do; việc AI bỏ sót: AI chưa xếp", ai && ai.left.some(x => /Hết chỗ trong tuần/.test(x.why)) && ai.left.some(x => x.why === "AI chưa xếp") && /việc chưa xếp được/.test($("aiBody").textContent));
  const n0 = ai.rows.filter(x => x.on).length;
  ok("A4.7 đếm và nút Thêm theo số đã chọn", $("aiN").textContent === `${n0}/${ai.rows.length}` && $("aiOk").textContent === `Thêm ${n0} việc vào lịch` && $("aiAll").indeterminate);
  $("aiAll").click(); await sleep(5); $("aiAll").click(); await sleep(5);
  ok("A4.8 bỏ tất cả: nút chính tắt", $("aiOk").disabled);
  ai.rows.forEach((x, i) => { if (x.id === "taiA" || x.id === "taiC") $("ai" + i).click(); }); await sleep(5);
  const crA = eval(crCode), stA = eval(stCode);
  ok("A5.1 popup: chữ đạt tương phản, không nét viền đen", !crA.length && !stA.length, [crA.slice(0, 3), stA.slice(0, 3)]);
  ok("A5.2 popup cùng kiểu: nút ✕, chân cố định có nút chính", !!$("aiOverlay").querySelector(".sheet-x.ic-btn") && getComputedStyle($("aiBody").querySelector(".sheet-foot")).position === "sticky");
  // xác nhận
  const before = Object.values(S.ev).flat().length;
  $("aiOk").click(); await sleep(30);
  const eA = (S.ev[d1] || []).find(e => e.tk === "taiA"), eC = (S.ev[d1] || []).find(e => e.tk === "taiC");
  ok("A6.1 thêm đúng 2 việc đã chọn vào lịch, đúng giờ, loại vốn của việc", eA && eC && eA.s === hmOf(f1) && eC.s === hmOf(f1 + 60) && eA.c === "kn" && eA.h === 1 && Object.values(S.ev).flat().length === before + 2 && !$("aiOverlay").classList.contains("open"));
  ok("A6.2 có Hoàn tác", [...document.querySelectorAll(".toast")].some(t => /theo đề xuất của AI/.test(t.textContent) && /Hoàn tác/.test(t.textContent)));
  undoRun(); await sleep(20);
  ok("A6.3 Hoàn tác: gỡ cả hai", !Object.values(S.ev).flat().some(e => e.tk === "taiA" || e.tk === "taiC") && Object.values(S.ev).flat().length === before);
  // dữ liệu đổi trong lúc chờ
  hold = new Promise(r => { resolve = r; });
  const pr2 = aiPlan(); await sleep(20);
  (S.ev[d1] = S.ev[d1] || []).push({ t: "Việc mới chen vào", c: "qh", m: "u", h: 3, s: hmOf(f1 - 30 >= 0 ? f1 - 30 : f1) }); sortL(S.ev[d1]); save();
  resolve(); hold = null; await pr2; await sleep(20);
  const okA = !!R("taiA");
  if (okA) { ai.rows.forEach(x => { x.on = x.id === "taiA"; }); aiSync(); }
  const nEv = Object.values(S.ev).flat().length;
  aiConfirm(); await sleep(20);
  ok("A7.1 lịch đổi trong lúc chờ: không thêm vào chỗ vừa bị chiếm, báo bấm lại", !okA || (Object.values(S.ev).flat().length === nEv && [...document.querySelectorAll(".toast")].some(t => /Lịch đã thay đổi/.test(t.textContent))));
  closeAi();
  S.ev[d1] = (S.ev[d1] || []).filter(e => e.t !== "Việc mới chen vào"); if (!S.ev[d1].length) delete S.ev[d1]; save();
  // lỗi máy chủ, lỗi mạng, đóng khi đang chờ
  reply = { status: 403, body: { error: "Tài khoản này chưa được bật AI" } };
  await aiPlan(); await sleep(10);
  ok("A8.1 tài khoản không được phép: báo đúng lời, nhắc xếp tay, không mời Thử lại", /chưa được bật AI/.test($("aiBody").textContent) && /xếp tay/.test($("aiBody").textContent) && ![...$("aiBody").querySelectorAll("button")].some(x => x.textContent === "Thử lại"));
  closeAi(); await sleep(20); draw();
  ok("A8.1b sau đó ẩn nút AI, app dùng tay như cũ", !aiReady && btnAny() === 0);
  aiReady = true;
  reply = { status: 502, body: { error: "AI lỗi (529), thử lại sau" } };
  await aiPlan(); await sleep(10);
  ok("A8.2 lỗi tạm thời: có Thử lại, vẫn giữ nút", /AI lỗi/.test($("aiBody").textContent) && [...$("aiBody").querySelectorAll("button")].some(x => x.textContent === "Thử lại") && aiReady);
  reply = new TypeError("Failed to fetch");
  [...$("aiBody").querySelectorAll("button")].find(x => x.textContent === "Thử lại").click(); await sleep(30);
  ok("A8.2b mất mạng: báo kiểm tra mạng", /kiểm tra mạng/.test($("aiBody").textContent));
  closeAi();
  reply = { status: 200, body: { summary: "", items: [{ id: "taiA", date: d1, start: hmOf(f1), reason: "x" }], unplaced: [] } };
  hold = new Promise(r => { resolve = r; });
  const pr3 = aiPlan(); await sleep(20);
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); await sleep(10);
  resolve(); hold = null; await pr3; await sleep(10);
  ok("A8.3 Esc khi đang chờ: đóng, trả lời đến sau không mở lại popup", !$("aiOverlay").classList.contains("open") && ai === null);
  // việc lỡ được xếp lại
  const past = ky(ad(new Date(tday + "T00:00"), -1));
  (S.ev[past] = S.ev[past] || []).push({ t: "Dàn ý", c: "kn", m: "u", h: 1, s: "09:00", tk: "taiA" }); sortL(S.ev[past]); save();
  reply = body => ({ status: 200, body: { summary: "", items: [{ id: "taiA", date: d1, start: hmOf(f1), reason: "Xếp lại việc lỡ" }], unplaced: [] } });
  await aiPlan(); await sleep(20);
  const sentA = calls[calls.length - 1].body.todo.find(x => x.id === "taiA");
  ok("A9.1 việc lỡ được gửi lại để xếp, ghi xếp lại", sentA && sentA.missed === 1 && /xếp lại/.test($("aiBody").textContent));
  ai.rows.forEach(x => { x.on = x.id === "taiA"; }); aiSync(); aiConfirm(); await sleep(20);
  ok("A9.2 xác nhận: bỏ buổi lỡ cũ, tạo buổi mới", !(S.ev[past] || []).some(e => e.tk === "taiA") && (S.ev[d1] || []).some(e => e.tk === "taiA" && e.s === hmOf(f1)));
  undoRun(); await sleep(20);
  ok("A9.3 Hoàn tác: buổi cũ trở lại, buổi mới mất", (S.ev[past] || []).some(e => e.tk === "taiA") && !(S.ev[d1] || []).some(e => e.tk === "taiA"));
  const swSrc = await (await fetch0("/sw.js?" + Date.now())).text();
  ok("N4.1 bộ nhớ đệm (service worker) không lưu /api/: không giữ trạng thái AI cũ", /pathname\.startsWith\("\/api\/"\)\) return/.test(swSrc));
  // dọn
  Object.keys(S.ev).forEach(k => { S.ev[k] = S.ev[k].filter(e => !(e.tk || "").startsWith("tai")); if (!S.ev[k].length) delete S.ev[k]; });
  S.tasks = S.tasks.filter(t => t.id !== "taiT"); save();
  noAnim.remove();
  window.fetch = fetch0; window.ask = ask0; sbUser = sbU0; sb = sb0; aiReady = false;
  removeEventListener("error", onErr); removeEventListener("unhandledrejection", onErr);
  document.querySelectorAll(".toast").forEach(t => t.remove());
  switchTab("ca");
  const pass = out.filter(x => x.pass).length;
  return { pass, total: out.length, fail: out.filter(x => !x.pass) };
};
