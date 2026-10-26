// v0.6.6: danh sách dự án nhóm theo ưu tiên (mặc định) / loại vốn chính, lọc theo chiều còn lại. Chạy sau loadDemo().
window.E2EPJL = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const noAnim = document.createElement("style"); noAnim.textContent = "*{transition:none!important;animation:none!important}"; document.head.appendChild(noAnim);
  const keepP = JSON.stringify(S.projects || []), keepPref = JSON.stringify(pjPref);
  const v = () => document.querySelector("#v");
  const heads = () => [...v().querySelectorAll(".pj-grp-h")].map(h => h.querySelector("span:not(.pj-dot):not(.pj-grp-n)").textContent + ":" + h.querySelector(".pj-grp-n").textContent);
  const names = sel => [...v().querySelectorAll((sel || "") + " .pj-row .pj-name")].map(b => b.textContent);
  const chips = () => [...v().querySelectorAll(".pj-lf .pj-capchip")];
  const chip = t => chips().find(b => b.textContent === t);
  const segB = t => [...v().querySelectorAll('.pj-list-tools .set-seg button')].find(b => b.textContent === t);
  const mk = (n, pr, caps, st) => ({ id: nid("p"), n, col: PJ_COLORS[0], st: st || "run", pr, sd: tk, caps, mt: Date.now() });
  const CN = k => CM(k).n;

  delete pjPref.lg; delete pjPref.lf; pjPrefSet("x", 0); delete pjPref.x;
  pjOpenId = null; pjShowClosed = false;
  S.projects = [
    mk("Bê", "h", ["tc"]), mk("An", "h", ["kn", "tc"]), mk("Cờ", "m", ["kn"]), mk("Dê", "l", ["tn"]),
    mk("Én", "l", []), mk("Đóng", "h", ["tc"], "done"),
  ];
  save(); switchTab("pj"); await sleep(10);

  // ===== G: mặc định nhóm theo ưu tiên
  ok("G1.1 mặc định: nút Ưu tiên đang bật", segB("Ưu tiên").getAttribute("aria-pressed") === "true" && segB("Loại vốn").getAttribute("aria-pressed") === "false");
  ok("G1.2 3 nhóm Cao → Trung bình → Thấp kèm số dự án", heads().join("|") === "Ưu tiên cao:2|Ưu tiên trung bình:1|Ưu tiên thấp:2", heads());
  ok("G1.3 trong nhóm xếp như cũ (tên A→Z khi cùng hạn)", names(".pj-grp:first-of-type").join("|") === "An|Bê", names());
  ok("G1.4 dòng phụ ghi loại vốn thay mức ưu tiên", /^Kỹ năng, Tài chính/.test(v().querySelector(".pj-row .pj-sub").textContent) && !/Ưu tiên/.test([...v().querySelectorAll(".pj-grp .pj-sub")].map(x => x.textContent).join()), v().querySelector(".pj-row .pj-sub").textContent);
  ok("G1.5 dự án chưa gắn vốn ghi rõ", /Chưa gắn loại vốn/.test([...v().querySelectorAll(".pj-row")].find(r => r.querySelector(".pj-name").textContent === "Én").textContent));
  ok("G1.6 dự án đã đóng không nằm trong nhóm, vẫn có mục Đã đóng (1)", !names(".pj-grp").includes("Đóng") && /Đã đóng \(1\)/.test(v().querySelector(".pj-closed-toggle").textContent));
  ok("G1.7 tiêu đề: 5 dự án đang mở", /^5 dự án đang mở$/.test(v().querySelector(".pj-list-head").textContent.trim()));

  // ===== L: lọc theo loại vốn khi nhóm theo ưu tiên
  ok("L1.1 chip: Tất cả + chỉ các vốn có dự án gắn", chips().map(b => b.textContent).join("|") === ["Tất cả", ...S.caps.filter(c => ["tc", "kn", "tn"].includes(c.k)).map(c => c.n)].join("|"), chips().map(b => b.textContent));
  chip(CN("tc")).click(); await sleep(10);
  ok("L1.2 lọc Tài chính: gồm cả dự án có Tài chính là vốn phụ", names(".pj-grp").join("|") === "An|Bê" && heads().join("|") === "Ưu tiên cao:2", names());
  ok("L1.3 tiêu đề 2/5 và tên bộ lọc", v().querySelector(".pj-list-head").textContent.includes("2/5 dự án đang mở · vốn " + CN("tc")));
  ok("L1.4 chip đang chọn có aria-pressed và màu vốn", chip(CN("tc")).getAttribute("aria-pressed") === "true" && /--cap/.test(chip(CN("tc")).getAttribute("style")));
  ok("L1.5 bộ lọc áp cả mục Đã đóng", /Đã đóng \(1\)/.test(v().querySelector(".pj-closed-toggle").textContent));
  chip(CN("tn")).click(); await sleep(10);
  ok("L1.6 lọc Trải nghiệm: không có Đã đóng", names(".pj-grp").join() === "Dê" && !v().querySelector(".pj-closed-toggle"));
  ok("L1.7 nhớ cách nhóm và bộ lọc sau khi tải lại (localStorage)", JSON.parse(localStorage.getItem("lc_pjv")).lf === "tn" && JSON.parse(localStorage.getItem("lc_pjv")).lg === "pr");
  chip("Tất cả").click(); await sleep(10);
  ok("L1.8 Tất cả: bỏ lọc", names(".pj-grp").length === 5 && chip("Tất cả").getAttribute("aria-pressed") === "true");

  // ===== C: nhóm theo loại vốn chính
  chip(CN("tc")).click(); await sleep(10);
  segB("Loại vốn").click(); await sleep(10);
  ok("C1.1 đổi cách nhóm thì bỏ bộ lọc cũ", !pjPref.lf && names(".pj-grp").length === 5);
  const capOrder = S.caps.filter(c => ["tc", "kn", "tn"].includes(c.k)).map(c => c.n);
  const expH = capOrder.map(n => n + ":" + ({ [CN("tc")]: 1, [CN("kn")]: 2, [CN("tn")]: 1 })[n]).concat("Chưa gắn loại vốn:1");
  ok("C1.2 nhóm theo thứ tự loại vốn, dự án nhiều vốn chỉ nằm ở vốn chính, cuối là Chưa gắn", heads().join("|") === expH.join("|"), heads());
  ok("C1.3 An (Kỹ năng ★, Tài chính) nằm ở nhóm Kỹ năng, không lặp", names().filter(n => n === "An").length === 1 && [...v().querySelectorAll(".pj-grp")].find(g => g.textContent.includes("An")).querySelector(".pj-grp-h").textContent.startsWith(CN("kn")));
  ok("C1.4 nhóm vốn có chấm màu, dòng phụ ghi mức ưu tiên", v().querySelector(".pj-grp-h .pj-dot") && /^Ưu tiên /.test(v().querySelector(".pj-grp .pj-sub").textContent));
  ok("C1.5 chip lọc là các mức ưu tiên có dự án", chips().map(b => b.textContent).join("|") === "Tất cả|Ưu tiên cao|Ưu tiên trung bình|Ưu tiên thấp", chips().map(b => b.textContent));
  chip("Ưu tiên thấp").click(); await sleep(10);
  ok("C1.6 lọc ưu tiên thấp", names(".pj-grp").join("|") === "Dê|Én" && v().querySelector(".pj-list-head").textContent.includes("2/5 dự án đang mở · ưu tiên thấp"));

  // ===== E: trường hợp biên
  S.projects.forEach(p => { if (p.pr === "l") p.st = "pause"; }); draw(); await sleep(10);
  ok("E1.1 dự án tạm dừng vẫn tính là đang mở", names(".pj-grp").join("|") === "Dê|Én");
  S.projects.forEach(p => { if (p.pr === "l") p.st = "cancel"; }); draw(); await sleep(10);
  ok("E1.2 bộ lọc không còn dự án nào: chip biến mất, tự về Tất cả", !chip("Ưu tiên thấp") && names(".pj-grp").length === 3);
  pjPref.lf = "h"; S.projects.forEach(p => { if (p.pr === "h") p.st = "done"; }); draw(); await sleep(10);
  ok("E1.3 lọc mà mọi dự án khớp đều đã đóng: tự về Tất cả, không ra danh sách rỗng", names(".pj-grp").join() === "Cờ" && !v().querySelector(".pj-list-head").textContent.includes("/"));
  ok("E1.4 chip chỉ tính dự án đang mở: còn một mức thì ẩn hàng chip", !v().querySelector(".pj-lf"), chips().map(b => b.textContent));
  pjPref.lf = "zz"; draw(); await sleep(10);
  ok("E1.5 bộ lọc lạ (vốn đã xóa) bị bỏ qua", names(".pj-grp").join() === "Cờ" && !v().querySelector(".pj-list-head").textContent.includes("/"));
  S.projects = [mk("Một", "h", ["kn"])]; draw(); await sleep(10);
  ok("E1.6 chỉ một lựa chọn lọc: ẩn hàng chip", !v().querySelector(".pj-lf") && heads().join() === CN("kn") + ":1");
  pjPref.lg = "bad"; draw(); await sleep(10);
  ok("E1.7 giá trị nhóm lạ: về nhóm theo ưu tiên", heads().join() === "Ưu tiên cao:1");
  S.projects = []; draw(); await sleep(10);
  ok("E1.8 chưa có dự án: giữ màn hình giới thiệu, không có thanh nhóm", /Chưa có dự án/.test(v().textContent) && !v().querySelector(".pj-list-tools"));
  S.projects = [mk("Xong", "h", ["kn"], "done")]; draw(); await sleep(10);
  ok("E1.9 chỉ có dự án đã đóng: báo không có dự án đang mở", /Không có dự án nào đang mở/.test(v().textContent) && /Đã đóng \(1\)/.test(v().textContent));
  S.projects = [mk("<b>x</b>", "h", ["kn"])]; draw(); await sleep(10);
  ok("E1.10 tên dự án được thoát HTML", !v().querySelector(".pj-name b") && names().join() === "<b>x</b>");

  // ===== R: giờ tuần này của nhóm, mở dự án từ nhóm
  const P1 = mk("Giờ", "h", ["kn"]), P2 = mk("Giờ 2", "h", ["kn"]); S.projects = [P1, P2];
  const day0 = monKey(tk); S.ev[day0] = (S.ev[day0] || []).concat([{ id: "pjl1", t: "a", c: "kn", m: "u", h: 1.5, s: "07:00", pj: P1.id }, { id: "pjl2", t: "b", c: "kn", m: "u", h: 2, s: "08:00", pj: P2.id }]);
  delete pjPref.lg; delete pjPref.lf; draw(); await sleep(10);
  ok("R1.1 tiêu đề nhóm cộng giờ tuần này", v().querySelector(".pj-grp-h small").textContent === "3,5h tuần này", v().querySelector(".pj-grp-h small").textContent);
  v().querySelector(".pj-grp .pj-row").click(); await sleep(10);
  ok("R1.2 bấm thẻ trong nhóm mở trang dự án", pjOpenId === P1.id && v().querySelector(".pj-head"));
  pjBack(); await sleep(10);
  ok("R1.3 quay lại vẫn giữ cách nhóm", segB("Ưu tiên").getAttribute("aria-pressed") === "true" && v().querySelector(".pj-grp"));
  S.ev[day0] = S.ev[day0].filter(e => !/^pjl/.test(e.id));

  // ===== M: điện thoại 390px không tràn ngang
  S.projects = JSON.parse(keepP).length ? JSON.parse(keepP) : [mk("A", "h", ["tc"]), mk("B", "m", ["kn"]), mk("C", "l", ["tn"]), mk("D", "l", ["sk"]), mk("E", "h", ["qh"])];
  draw(); await sleep(10);
  const lf = v().querySelector(".pj-lf");
  ok("M1.1 hàng chip không đẩy trang rộng ra", document.documentElement.scrollWidth <= innerWidth + 1, [document.documentElement.scrollWidth, innerWidth]);
  ok("M1.2 hàng chip nằm gọn trong danh sách", !lf || lf.getBoundingClientRect().right <= v().querySelector(".pj-list").getBoundingClientRect().right + 1);

  // dọn
  S.projects = JSON.parse(keepP); save();
  Object.keys(pjPref).forEach(k => delete pjPref[k]); Object.assign(pjPref, JSON.parse(keepPref)); pjPrefSet("lg", pjPref.lg);
  if (!("lg" in JSON.parse(keepPref))) { delete pjPref.lg; pjPrefSet("x", 0); delete pjPref.x; localStorage.setItem("lc_pjv", JSON.stringify(pjPref)); }
  pjOpenId = null; noAnim.remove(); document.querySelectorAll(".toast").forEach(t => t.remove());
  switchTab("ca");
  const pass = out.filter(x => x.pass).length;
  return { pass, total: out.length, fail: out.filter(x => !x.pass) };
};
