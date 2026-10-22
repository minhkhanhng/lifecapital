// v0.6.5: ưu tiên Eisenhower, Xếp tất cả (quy tắc), Nhờ AI rà soát bằng sao chép – dán (không gọi AI thật). Chạy sau loadDemo().
window.E2EPLAN = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const crCode = await (await fetch("/tests/e2e/contrast.js?" + Date.now())).text();
  const stCode = await (await fetch("/tests/e2e/strokes.js?" + Date.now())).text();
  const noAnim = document.createElement("style"); noAnim.textContent = "*{transition:none!important;animation:none!important}"; document.head.appendChild(noAnim);
  const sbU0 = sbUser, aiR0 = aiReady, nowMin0 = window.nowMin, clip0 = navigator.clipboard;
  sbUser = null; aiReady = false;
  const day = j => ky(ad(new Date(tk + "T00:00"), j));
  const evAll = () => Object.keys(S.ev).flatMap(k => S.ev[k].map(e => [k, e]));

  // ===== E: mức ưu tiên Eisenhower
  const T0 = S.tasks.find(t => !taskDone(t));
  switchTab("hv"); hvMoreT("task:" + T0.id); await sleep(10);
  const qs = document.querySelector('#v select[aria-label^="Mức ưu tiên"]');
  ok("E1.1 khay ⋯ có ô chọn ưu tiên đủ 4 ô Eisenhower + chưa chọn", qs && qs.options.length === 5 && [...qs.options].map(o => o.textContent).join("|") === "Ưu tiên: chưa chọn|Gấp · Quan trọng|Quan trọng|Gấp|Để sau");
  qs.value = "1"; qs.dispatchEvent(new Event("change")); await sleep(10);
  ok("E1.2 chọn Gấp · Quan trọng: lưu q=1, thẻ hiện nhãn", findTask(T0.id).q === "1" && JSON.parse(localStorage.getItem("lc2")).tasks.find(t => t.id === T0.id).q === "1" && /Gấp · Quan trọng/.test(document.querySelector("#v .hv-q.q1").textContent));
  const qs2 = document.querySelector('#v select[aria-label^="Mức ưu tiên"]'); qs2.value = ""; qs2.dispatchEvent(new Event("change")); await sleep(10);
  ok("E1.3 bỏ chọn: xóa q, không còn nhãn", !("q" in findTask(T0.id)) && !document.querySelector("#v .hv-q"));
  hvMore = "";
  ok("E1.4 làm sạch: giữ 1–4, bỏ giá trị lạ", cleanTask({ id: "x1", t: "a", q: 3 }).q === "3" && !("q" in cleanTask({ id: "x2", t: "a", q: "9" })) && !("q" in cleanTask({ id: "x3", t: "a", q: { a: 1 } })));
  const B = cleanState(JSON.parse(localStorage.getItem("lc2"))), Th = cleanState(JSON.parse(localStorage.getItem("lc2")));
  Th.tasks[0].q = "4"; Th.tasks[0].mt = Date.now() + 1e6;
  ok("E1.5 gộp dữ liệu hai máy: nhận mức ưu tiên vừa đổi", mergeStates(B, cleanState(JSON.parse(localStorage.getItem("lc2"))), Th, true).tasks.find(t => t.id === Th.tasks[0].id).q === "4");
  ok("E1.6 thanh Hộp việc có Xếp tất cả và Nhờ AI rà soát khi chưa đăng nhập, chưa có AI", [...document.querySelectorAll("#v .hv-top button")].map(b => b.textContent.trim()).join("|") === "Xếp tất cả|Nhờ AI rà soát");

  // ===== X: Xếp tất cả — dữ liệu dựng sẵn
  window.nowMin = () => 480; // cố định "bây giờ" = 08:00 để kết quả không phụ thuộc giờ chạy
  const keepT = S.tasks, keepE = JSON.stringify(S.ev), keepCfg = JSON.stringify(S.cfg);
  S.tasks = []; S.cfg.schedFrom = 480; S.cfg.schedTo = 1320; S.cfg.schedCap = 2;
  for (let j = 0; j < SCH_DAYS; j++) delete S.ev[day(j)];
  S.ev[day(0)] = [{ id: "fx0", t: "Cố định sáng", c: "tc", m: "u", h: 2, s: "09:00" }];
  S.ev[day(1)] = [{ id: "fx1", t: "Cố định chiều", c: "tc", m: "u", h: 3, s: "13:00" }];
  const mk = (id, t, q, due, subs, c) => ({ id, t, c: c || "kn", m: "u", ...(q ? { q } : {}), ...(due ? { due } : {}), subs: subs.map((h, i) => ({ id: id + "s" + i, t: t + " " + (i + 1), h, done: false })) });
  S.tasks = [
    mk("pQ4", "Dọn email", "4", null, [0.5]),
    mk("pQ3", "Gọi điện", "3", null, [0.5]),
    mk("pQ2", "Viết đề án", "2", day(9), [2, 2, 2]),
    mk("pQ1", "Báo cáo gấp", "1", day(5), [1]),
    mk("pUr", "Nộp hồ sơ", null, day(2), [1, 1]),
    mk("pOv", "Việc quá hạn", null, day(-2), [1]),
    mk("pNo", "Không ưu tiên", null, null, [1])
  ];
  save();
  let r = planAll();
  const R = id => r.rows.find(x => x.id === id), at = x => toMin(x.s) + (x.date > tk ? 1440 * Math.round((new Date(x.date) - new Date(tk)) / 864e5) : 0);
  ok("X1.1 xếp đủ mọi việc nhỏ, không còn việc thiếu chỗ", r.rows.length === 10 && !r.left.length, [r.rows.length, r.left]);
  ok("X1.2 việc sắp tới hạn (≤ 3 ngày) và quá hạn được xếp trước tiên", at(R("pUrs0")) <= Math.min(...r.rows.filter(x => !/^p(Ur|Ov)/.test(x.id)).map(at)) && at(R("pOvs0")) <= Math.min(...r.rows.filter(x => !/^p(Ur|Ov)/.test(x.id)).map(at)), r.rows.map(x => [x.id, x.date, x.s]));
  ok("X1.3 thứ tự Eisenhower: Gấp·Quan trọng trước Quan trọng, trước Gấp, trước Để sau", at(R("pQ1s0")) < at(R("pQ2s0")) && at(R("pQ2s0")) < at(R("pQ3s0")) && at(R("pQ3s0")) < at(R("pQ4s0")));
  ok("X1.4 việc Gấp / Để sau vào buổi chiều (từ 13:00) khi còn chỗ", toMin(R("pQ3s0").s) >= 780 && toMin(R("pQ4s0").s) >= 780 && /chiều/.test(R("pQ3s0").why));
  ok("X1.5 việc quan trọng lấy chỗ sớm nhất còn trống (buổi sáng nếu còn), có ghi lý do", /Gấp · Quan trọng/.test(R("pQ1s0").why) && /hạn/.test(R("pQ1s0").why) && r.rows.filter(x => /^pQ2/.test(x.id) && toMin(x.s) < 720).every(x => /buổi sáng/.test(x.why)) && r.rows.some(x => /buổi sáng/.test(x.why)));
  const blocks = d => [...(S.ev[d] || []).filter(e => e.s).map(e => [toMin(e.s), toMin(e.s) + e.h * 60]), ...r.rows.filter(x => x.date === d).map(x => [toMin(x.s), toMin(x.s) + x.h * 60])].sort((a, b) => a[0] - b[0]);
  const gapsOk = [...Array(SCH_DAYS)].every((_, j) => { const b = blocks(day(j)); return b.every((x, i) => !i || x[0] >= b[i - 1][1] + SCH_BUF); });
  ok("X1.6 không trùng hoạt động có sẵn, mỗi khối cách nhau ≥ 15 phút", gapsOk);
  ok("X1.7 trong khung giờ xếp việc, không trước giờ hiện tại hôm nay", r.rows.every(x => toMin(x.s) >= 480 && toMin(x.s) + x.h * 60 <= 1320));
  const pq2 = r.rows.filter(x => x.tid === "pQ2").sort((a, b) => at(a) - at(b));
  ok("X1.8 việc nhỏ giữ đúng thứ tự", pq2.map(x => x.id).join() === "pQ2s0,pQ2s1,pQ2s2");
  ok("X1.9 giới hạn mỗi ngày cho một việc (2 giờ): việc 6 giờ trải ra 3 ngày", new Set(pq2.map(x => x.date)).size === 3);
  ok("X1.10 có hạn: xong trước hạn ít nhất 1 ngày", r.rows.filter(x => x.tid === "pUr").every(x => x.date < day(2)) && R("pQ1s0").date < day(5) && pq2.every(x => x.date < day(9)));
  ok("X1.11 việc quá hạn: ghi quá hạn, làm sớm nhất, vẫn chọn sẵn, không báo Sau hạn", /quá hạn/.test(R("pOvs0").why) && R("pOvs0").on && !R("pOvs0").warn && R("pOvs0").date === tk);
  ok("X1.12 chưa chọn ưu tiên: coi như Quan trọng, ghi (mặc định)", /Quan trọng \(mặc định\)/.test(R("pNos0").why));
  // mức lấp 80%: ngày 0 có 14h khung, bận 2h → tối đa 9,6h việc (trừ việc gấp)
  const fill = d => r.rows.filter(x => x.date === d).reduce((a, x) => a + x.h, 0);
  ok("X1.13 mỗi ngày không lấp quá 80% giờ trống (chừa dự phòng)", [...Array(SCH_DAYS)].every((_, j) => { const d = day(j), busyH = (S.ev[d] || []).reduce((a, e) => a + e.h, 0); return fill(d) <= (14 - busyH) * 0.8 + 1e-9 || r.rows.some(x => x.date === d && /vượt mức/.test(x.why)); }));
  // chật: hôm nay chỉ còn 1 giờ, việc hạn mai cần 2 giờ → vượt mức dự phòng để kịp, có ghi lý do
  S.tasks = [mk("pTight", "Gấp lắm", "1", day(1), [1, 1])];
  S.ev[day(0)] = [{ id: "fz", t: "Bận cả ngày", c: "tc", m: "u", h: 11.25, s: "08:00" }];
  r = planAll();
  ok("X2.1 hạn mai, hôm nay kín: xếp sát hạn (ngày mai) thay vì bỏ", r.rows.length === 2 && r.rows.every(x => x.date <= day(1)) && !r.left.length, r.rows.map(x => [x.date, x.s, x.why]));
  // không kịp hạn → báo, không giấu
  S.tasks = [mk("pNo2", "Không kịp", "1", day(0), [6, 6])];
  S.ev[day(0)] = [{ id: "fz2", t: "Bận", c: "tc", m: "u", h: 10, s: "08:00" }];
  r = planAll();
  ok("X2.2 không kịp hạn: phần xếp được ghi Sau hạn và bỏ chọn sẵn, hoặc báo chưa xếp được", r.rows.every(x => x.date <= tk || (x.warn && !x.on)) && (r.rows.length + r.left.length) === 2);
  // việc lỡ: xếp lại, gỡ buổi cũ
  S.tasks = [mk("pMiss", "Việc lỡ", "2", null, [1])];
  S.ev[day(0)] = [];
  (S.ev[day(-1)] = S.ev[day(-1)] || []).push({ t: "Việc lỡ 1", c: "kn", m: "u", h: 1, s: "09:00", tk: "pMisss0" });
  save();
  r = planAll();
  ok("X3.1 việc lỡ hôm qua được xếp lại", r.rows.length === 1 && r.rows[0].missed && r.rows[0].move);
  ai = { st: "ok", src: "rule", ...r }; aiDraw(); $("aiOverlay").classList.add("open"); await sleep(10);
  ok("X3.2 popup Xếp tất cả: tiêu đề, tóm tắt, lý do từng mục, nút Thêm", $("aiTitle").textContent === "Xếp tất cả" && /Xếp 1 việc/.test($("aiBody").textContent) && /xếp lại việc lỡ/.test($("aiBody").textContent) && /Thêm 1 việc/.test($("aiOk").textContent));
  $("aiOk").click(); await sleep(20);
  ok("X3.3 áp dụng: gỡ buổi lỡ, tạo buổi mới gắn việc", !(S.ev[day(-1)] || []).some(e => e.tk === "pMisss0") && evAll().filter(([, e]) => e.tk === "pMisss0").length === 1);
  undoRun(); await sleep(20);
  ok("X3.4 Hoàn tác: buổi lỡ trở lại", (S.ev[day(-1)] || []).some(e => e.tk === "pMisss0") && evAll().filter(([, e]) => e.tk === "pMisss0").length === 1);
  S.ev[day(-1)] = (S.ev[day(-1)] || []).filter(e => e.tk !== "pMisss0"); if (!S.ev[day(-1)].length) delete S.ev[day(-1)];
  // nút thật trên Hộp việc
  S.tasks = [mk("pBtn", "Thử nút", "2", null, [1, 1])]; save();
  switchTab("hv"); await sleep(10);
  [...document.querySelectorAll("#v .hv-top button")].find(b => b.textContent.trim() === "Xếp tất cả").click(); await sleep(20);
  ok("X4.1 bấm Xếp tất cả: mở popup xem trước, chưa ghi gì vào lịch", $("aiOverlay").classList.contains("open") && !evAll().some(([, e]) => (e.tk || "").startsWith("pBtn")));
  const crX = eval(crCode), stX = eval(stCode);
  ok("X4.2 popup: chữ đạt tương phản, không nét viền đen", !crX.length && !stX.length, [crX.slice(0, 3), stX.slice(0, 3)]);
  $("aiOk").click(); await sleep(20);
  ok("X4.3 xác nhận: 2 việc lên lịch, gắn đúng việc", evAll().filter(([, e]) => (e.tk || "").startsWith("pBtn")).length === 2);
  undoRun(); await sleep(10);
  S.tasks = []; save(); switchTab("hv"); await sleep(10);
  ok("X4.4 Hộp việc trống: không có nút Xếp tất cả / rà soát", !document.querySelector("#v .hv-top"));

  // ===== C: Nhờ AI rà soát bằng sao chép – dán (miễn phí)
  S.tasks = [mk("cA", "Đọc tài liệu", "2", day(4), [1, 1]), mk("cB", "Họp nhóm", "3", null, [1])];
  S.ev[day(1)] = [{ id: "fc1", t: "Gym", c: "sk", m: "u", h: 1, s: "18:00" }, { t: "Đọc tài liệu 1", c: "kn", m: "u", h: 1, s: "10:00", tk: "cAs0" }];
  S.ev[day(2)] = [{ t: "Họp nhóm 1", c: "kn", m: "u", h: 1, s: "15:00", tk: "cBs0" }];
  save(); switchTab("hv"); await sleep(10);
  aiOpen(); await sleep(20);
  ok("C1.1 popup 3 bước: Chép yêu cầu, Mở Claude, Dán câu trả lời", $("aiOverlay").classList.contains("open") && $("aiTitle").textContent === "Nhờ AI rà soát" && $("aiBody").querySelectorAll(".ai-steps > li").length === 3 && $("aiBody").querySelector('a[href="https://claude.ai/new"][target="_blank"]'));
  ok("C1.2 chưa đăng nhập / không có AI: không có Gửi tự động (không phí)", !$("aiBody").querySelector(".ai-auto"));
  const pr = ai.prompt, pj = JSON.parse(pr.slice(pr.lastIndexOf("```json") + 7, pr.lastIndexOf("```")));
  ok("C1.3 yêu cầu có nguyên tắc (Eisenhower, 15 phút, 20%, mẫu json) và dữ liệu", /Eisenhower/.test(pr) && /15 phút/.test(pr) && /20%/.test(pr) && /"items"/.test(pr) && pj.todo.length === 3);
  ok("C1.4 gồm việc đã xếp (at) và chưa xếp; lịch cố định có tên; không có dữ liệu sức khỏe khác", pj.todo.find(x => x.id === "cAs0").at.start === "10:00" && !pj.todo.find(x => x.id === "cAs1").at && pj.busy[day(1)].some(b => b[2] === "Gym") && Object.keys(pj).every(k => ["today", "now", "days", "busy", "todo", "window", "capitals", "ready"].includes(k)));
  ok("C1.5 việc đã xếp không bị tính là bận của chính nó", !pj.busy[day(1)].some(b => b[0] === "10:00") && !pj.busy[day(2)]);
  let wrote = null;
  Object.defineProperty(navigator, "clipboard", { value: { writeText: async t => { wrote = t; } }, configurable: true });
  await aiCopy(); await sleep(10);
  ok("C2.1 Chép yêu cầu: chép đúng nội dung, nút đổi thành Đã chép", wrote === pr && /Đã chép/.test($("aiCopy").textContent));
  Object.defineProperty(navigator, "clipboard", { value: { writeText: async () => { throw new Error("denied"); } }, configurable: true });
  await aiCopy(); await sleep(40);
  ok("C2.2 trình duyệt chặn chép: hiện ô chữ để tự chọn", $("aiPromptBox") && $("aiPromptBox").value === pr);
  // dán sai
  $("aiPaste").value = "Xin lỗi, tôi không hiểu."; aiUsePaste(); await sleep(10);
  ok("C3.1 dán câu không có đề xuất: báo, giữ nguyên bước dán", ai.st === "copy" && /Chưa đọc được/.test($("aiBody").textContent) && $("aiPaste").value === "Xin lỗi, tôi không hiểu.");
  ok("C3.2 đọc được: khối ```json, JSON trơn, nhiều khối thì lấy khối cuối có items", aiParse('a ```json\n{"items":[1]}\n``` b').items.length === 1 && aiParse('{"items":[],"summary":"x"}').summary === "x" && aiParse('```json\n{"x":1}\n```\n```json\n{"items":[2,3]}\n```').items.length === 2 && aiParse("không có") === null);
  // đề xuất: dời cAs0 sang day(2) 08:00; xếp cAs1 day(2) 10:00; giữ cBs0 nguyên; cB khác: dời vào chỗ cAs0 cũ (đã được dời đi)
  const reply = "Nhận xét ngắn.\n```json\n" + JSON.stringify({ summary: "Đưa việc đọc lên sáng.", items: [
    { id: "cAs0", date: day(2), start: "08:00", reason: "Sáng tập trung" },
    { id: "cAs1", date: day(2), start: "10:00", reason: "Ngay sau phần 1" },
    { id: "cBs0", date: day(2), start: "15:00", reason: "Giữ nguyên" }
  ], unplaced: [] }) + "\n```";
  $("aiPaste").value = reply; aiUsePaste(); await sleep(20);
  const row = id => ai.rows.find(x => x.id === id);
  ok("C4.1 đọc đề xuất: dời có ghi 'dời từ', việc giữ nguyên không thành thay đổi", ai.st === "ok" && row("cAs0") && row("cAs0").from && /dời từ/.test($("aiBody").textContent) && !row("cBs0") && row("cAs1") && !row("cAs1").from, ai.rows);
  ok("C4.2 nút ghi Áp dụng n thay đổi", /Áp dụng 2 thay đổi/.test($("aiOk").textContent));
  const crC = eval(crCode), stC = eval(stCode);
  ok("C4.3 popup: chữ đạt tương phản, không nét viền đen", !crC.length && !stC.length, [crC.slice(0, 3), stC.slice(0, 3)]);
  $("aiOk").click(); await sleep(20);
  const eA0 = evAll().filter(([, e]) => e.tk === "cAs0");
  ok("C4.4 áp dụng: buổi cũ gỡ, buổi mới đúng chỗ; việc kia lên lịch", eA0.length === 1 && eA0[0][0] === day(2) && eA0[0][1].s === "08:00" && evAll().some(([k, e]) => e.tk === "cAs1" && k === day(2) && e.s === "10:00"));
  undoRun(); await sleep(20);
  ok("C4.5 Hoàn tác: về như trước khi áp dụng", evAll().filter(([, e]) => e.tk === "cAs0").map(([k, e]) => k + e.s).join() === day(1) + "10:00" && !evAll().some(([, e]) => e.tk === "cAs1"));
  // đề xuất chen vào chỗ của việc đang có lịch mà AI không dời → bị loại, việc đó giữ chỗ cũ
  aiOpen(); await sleep(10);
  $("aiPaste").value = JSON.stringify({ summary: "", items: [{ id: "cAs1", date: day(2), start: "15:00", reason: "x" }, { id: "cAs0", date: day(2), start: "15:30", reason: "trùng" }], unplaced: [] });
  aiUsePaste(); await sleep(10);
  ok("C5.1 chen vào chỗ việc khác đang giữ: loại; việc đã xếp đề xuất hỏng thì giữ chỗ cũ (không vào chưa xếp được)", !row("cAs1") && !row("cAs0") && ai.left.some(x => x.t === "Đọc tài liệu 2" && /Trùng/.test(x.why)) && !ai.left.some(x => x.t === "Đọc tài liệu 1"), [ai.rows, ai.left]);
  closeAi();
  // có AI tự động
  aiReady = true; sbUser = { id: "u" };
  aiOpen(); await sleep(10);
  ok("C6.1 khi có AI tự động: thêm lựa chọn Gửi tự động (tốn phí API)", /Gửi tự động/.test($("aiBody").querySelector(".ai-auto").textContent) && /phí API/.test($("aiBody").textContent));
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); await sleep(10);
  ok("C6.2 Esc đóng popup", !$("aiOverlay").classList.contains("open") && ai === null);

  // dọn
  S.tasks = keepT; S.ev = JSON.parse(keepE); S.cfg = JSON.parse(keepCfg); save();
  window.nowMin = nowMin0; sbUser = sbU0; aiReady = aiR0;
  Object.defineProperty(navigator, "clipboard", { value: clip0, configurable: true });
  noAnim.remove(); document.querySelectorAll(".toast").forEach(t => t.remove());
  switchTab("ca");
  const pass = out.filter(x => x.pass).length;
  return { pass, total: out.length, fail: out.filter(x => !x.pass) };
};
