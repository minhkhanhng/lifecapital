// Gói 9 (subtask): việc con (subs) của hoạt động trên lịch. PO chốt: tên + tích xong; tích hết KHÔNG tự xong;
// chuỗi lặp theo từng buổi (ô "Áp dụng cho cả chuỗi" chép danh sách, không chép done); Hướng B: mục thu gọn + chip n/m.
// Hợp đồng giao diện (test định nghĩa, code phải theo):
//   #subsToggle (button, aria-expanded) chứa #subsCount (chữ "2/5", rỗng khi chưa có việc con); #subsPanel (danh sách, ẩn khi thu gọn)
//   #inpSub (ô thêm, Enter thêm); .ed-sub (từng dòng) có input[type=checkbox] và button.ed-sub-x (aria-label bắt đầu "Xóa");
//   thẻ hoạt động ở lịch có .ev-subs (chữ "2/5").
// Chạy sau loadDemo() trên trang dữ liệu thử. Khôi phục S, localStorage, sessionStorage khi xong; chỉ dùng dữ liệu giả.
window.E2ESUB = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  if (!Object.values(S.ev || {}).some(L => (L || []).some(e => e && e.demo))) return { pass: 0, total: 1, fail: [{ id: "G0", pass: false, info: "Trang không phải dữ liệu thử: chạy loadDemo() trước" }] };
  const lsAll = st => { const o = {}; for (let i = 0; i < st.length; i++) { const k = st.key(i); o[k] = st.getItem(k); } return o; };
  const lsBefore = lsAll(localStorage), ssBefore = lsAll(sessionStorage), sBefore = JSON.stringify(S), userBefore = sbUser;
  const putAll = (st, snap) => { Object.keys(lsAll(st)).forEach(k => { if (!(k in snap)) st.removeItem(k); }); Object.keys(snap).forEach(k => { if (st.getItem(k) !== snap[k]) st.setItem(k, snap[k]); }); };
  const restoreAll = () => { try { if ($("modalOverlay").classList.contains("open")) closeEditor(); } catch (e) {} sbUser = userBefore; putAll(localStorage, lsBefore); putAll(sessionStorage, ssBefore); S = JSON.parse(sBefore); lastRaw = localStorage.getItem("lc2"); saveFailed = false; draw(true); };
  const wait = ms => { const e = Date.now() + ms; while (Date.now() < e); };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const C = o => cleanState(JSON.parse(JSON.stringify(o)));
  const caps = [{ k: "sk", n: "Sức khỏe", c: "#97A13B", tg: 5, kw: [] }];
  const st = extra => ({ sv: SV, av: 71, ev: {}, caps, tasks: [], cfg: { defDuration: 2 }, bl: {}, mem: {}, memV: 2, gdel: [], projects: [], habits: [], ...(extra || {}) });
  const EV = (o) => ({ id: "su_e1", t: "Review", c: "sk", m: "u", h: 1, s: "09:00", ...o });
  const day = ky(new Date()), d1 = ky(ad(new Date(), 1)), d2 = ky(ad(new Date(), 2)), FS = new Set([11, 12, 13, 14, 16, 18, 22, 28]);
  const evOf = (s, d) => ((s.ev[d || day] || [])[0]) || {};
  const subsOf = e => (e && e.subs) || [];

  // ---- D: dữ liệu (cleanEv/cleanState)
  try {
    const raw = st({ ev: { [day]: [EV({ subs: [{ id: "su_s1", t: "Đọc đề", done: 1 }, { id: "su_s2", t: "Soạn dàn ý" }] })] } });
    const a = C(raw), s = subsOf(evOf(a));
    ok("D1 cleanState giữ việc con (tên, id, done)", s.length === 2 && s[0].t === "Đọc đề" && s[0].id === "su_s1" && s[0].done && !s[1].done, s);
    const b = C(a);
    ok("D2 cleanState hai lần: không mất, không đổi", sameJ(a, b), [subsOf(evOf(a)).length, subsOf(evOf(b)).length]);
    const bad = C(st({ ev: { [day]: [EV({ subs: [null, 5, { t: "" }, { id: "su_ok", t: "x".repeat(300), done: "yes" }, { id: "../x", t: "Id xấu" }] })] } }));
    const bs = subsOf(evOf(bad));
    ok("D3 mục hỏng bị bỏ; tên cắt 120; done thành 1; id luôn an toàn", bs.length === 2 && bs[0].t.length === 120 && bs[0].done === 1 && bs.every(x => /^[\w-]{1,64}$/.test(x.id || "")), bs);
    ok("D4 subs rỗng thì không có trường subs", !("subs" in evOf(C(st({ ev: { [day]: [EV({ subs: [] })] } })))), evOf(C(st({ ev: { [day]: [EV({ subs: [] })] } }))));
    ok("D5 hoạt động cũ không có subs vẫn hợp lệ, không thêm subs", !("subs" in evOf(C(st({ ev: { [day]: [EV()] } })))) && evOf(C(st({ ev: { [day]: [EV()] } }))).t === "Review");
    const many = Array.from({ length: 300 }, (_, i) => ({ id: "su_m" + i, t: "Bước " + i }));
    ok("D6 300 việc con không bị cắt", subsOf(evOf(C(st({ ev: { [day]: [EV({ subs: many })] } })))).length === 300);
    ok("D7 trường lạ khác trên hoạt động vẫn giữ", evOf(C(st({ ev: { [day]: [EV({ subs: [{ id: "su_s1", t: "a" }], zz: "lạ" })] } }))).zz === "lạ");
    const k1 = EV({ subs: [{ id: "su_s1", t: "a", done: 1 }] }), k2 = EV({ subs: [{ done: 1, t: "a", id: "su_s1" }] });
    ok("D8 chữ ký evCore không phụ thuộc thứ tự khóa trong việc con", evCore(k1) === evCore(k2), [evCore(k1), evCore(k2)]);
    ok("D9 đổi done thì chữ ký evCore đổi", evCore(EV({ subs: [{ id: "su_s1", t: "a" }] })) !== evCore(EV({ subs: [{ id: "su_s1", t: "a", done: 1 }] })));
  } catch (e) { ok("D.err", false, String(e && e.stack || e)); }

  // ---- E: stampEdits, Google Calendar, đồng bộ
  try {
    sbUser = null;
    S.ev[day] = (S.ev[day] || []).concat([EV({ id: "su_e2" })]);
    save(); wait(6); save();
    const e = S.ev[day].find(x => x.id === "su_e2"), m1 = e.mt; wait(6);
    e.subs = [{ id: "su_s1", t: "Bước 1" }]; save();
    ok("E1 thêm việc con: mt tăng", e.mt > m1, [m1, e.mt]);
    const m2 = e.mt; wait(6); save();
    ok("E2 lưu lại không sửa: mt không đổi", e.mt === m2, [m2, e.mt]);
    wait(6); e.subs[0].done = 1; save();
    ok("E3 tích xong: mt tăng", e.mt > m2, [m2, e.mt]);
    const withS = buildGCalEventPayload({ ...e }, day), noS = buildGCalEventPayload({ ...e, subs: undefined }, day);
    ok("E4 Google Calendar: nội dung gửi không đổi khi có việc con", JSON.stringify(withS) === JSON.stringify(noS));
    let cv = ""; try { cv = JSON.stringify(canonState(cloudView(S))); } catch (x) { cv = "ERR " + x; }
    ok("E5 canonState(cloudView(S)) giữ việc con", cv.includes("Bước 1") && !cv.startsWith("ERR"), cv.slice(0, 80));
  } catch (e) { ok("E.err", false, String(e && e.stack || e)); }
  finally { restoreAll(); }

  // ---- M: gộp hai máy (mergeStates)
  try {
    const sb = (id, t, d) => ({ id, t, ...(d ? { done: 1 } : {}) });
    const mk = (subs, t, mt) => C(st({ ev: { [day]: [EV({ t: t || "Review", mt: mt || 1000, ...(subs ? { subs } : {}) })] } }));
    const base = mk([sb("su_s1", "Đọc đề")]);
    const mine = mk([sb("su_s1", "Đọc đề"), sb("su_s2", "Mới ở A")], "Review", 2000);  // A thêm việc con
    const theirs = mk([sb("su_s1", "Đọc đề")], "Review đổi tên", 3000);                // B đổi tên, sau A
    for (const [nm, r] of [["A,B", mergeStates(base, mine, theirs, true)], ["B,A", mergeStates(base, theirs, mine, true)]]) {
      const e = evOf(r);
      ok(`M1 ${nm}: một bên thêm việc con, bên kia đổi tên: giữ cả hai`, e.t === "Review đổi tên" && subsOf(e).some(x => x.id === "su_s2"), [e.t, subsOf(e).map(x => x.t)]);
    }
    const mineT = mk([sb("su_s1", "Đọc đề", 1)], "Review", 2000), theirsA = mk([sb("su_s1", "Đọc đề"), sb("su_s3", "Mới ở B")], "Review", 3000);
    const e2 = evOf(mergeStates(base, mineT, theirsA, true));
    ok("M2 một bên tích, bên kia thêm: giữ việc con mới và dấu tích", subsOf(e2).length === 2 && subsOf(e2).find(x => x.id === "su_s1").done === 1, subsOf(e2));
    const mineD = mk([], "Review", 2000), theirsN = mk([sb("su_s1", "Đọc đề")], "Đổi tên 2", 3000);
    const e3 = evOf(mergeStates(base, mineD, theirsN, true));
    ok("M3 một bên xóa việc con, bên kia chỉ đổi tên: việc con vẫn bị xóa, tên mới giữ", e3.t === "Đổi tên 2" && subsOf(e3).length === 0, [e3.t, subsOf(e3)]);
    const noBase = evOf(mergeStates(null, mine, theirs, false));
    ok("M4 không gốc chung: không mất việc con", subsOf(noBase).some(x => x.id === "su_s2"), subsOf(noBase));
    const base0 = mk(null), mine0 = mk([sb("su_s2", "Mới ở A")], "Review", 2000), theirs0 = mk(null, "Review đổi tên", 3000);
    ok("M5 gốc chưa có việc con: A thêm, B đổi tên (không có subs): việc con của A không mất", subsOf(evOf(mergeStates(base0, mine0, theirs0, true))).some(x => x.id === "su_s2"));
    const oldTh = { ...mk([sb("su_s1", "Đọc đề")], "Review", 1000) }; delete oldTh.ev[day][0].subs; oldTh.av = 40; // máy rất cũ: bỏ trường lạ khi lưu
    const baseO = mk([sb("su_s1", "Đọc đề"), sb("su_s2", "Hai")]), mineO = mk([sb("su_s1", "Đọc đề"), sb("su_s2", "Hai")], "Review", 1500);
    oldTh.ev[day][0].t = "Máy cũ đổi tên"; oldTh.ev[day][0].mt = 3000;
    ok("M6 máy rất cũ (av<41) bỏ subs khi lưu: việc con của máy này không bị xóa theo", subsOf(evOf(mergeStates(baseO, mineO, oldTh, true))).length === 2, subsOf(evOf(mergeStates(baseO, mineO, oldTh, true))));
  } catch (e) { ok("M.err", false, String(e && e.stack || e)); }

  // ---- U: giao diện popup
  const openOn = (d, i) => { openEditor(d, i); return sleep(480); };
  const kd = (el, key) => el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
  try {
    sbUser = null;
    S.ev[day] = [EV({ id: "su_ui" })]; S.ev[d1] = [EV({ id: "su_r2", r: "su_r", t: "Chuỗi" })]; S.ev[day].push(EV({ id: "su_r1", r: "su_r", t: "Chuỗi", s: "11:00" })); S.ev[d2] = [EV({ id: "su_r3", r: "su_r", t: "Chuỗi" })];
    save(); draw(true);
    const idx = S.ev[day].findIndex(x => x.id === "su_ui");
    await openOn(day, idx);
    const tg = $("subsToggle"), pan = $("subsPanel"), inp = () => $("inpSub");
    ok("U1 popup có mục Việc con thu gọn (nút, aria-expanded=false)", !!tg && tg.getAttribute("aria-expanded") === "false" && (!pan || pan.hidden || getComputedStyle(pan).display === "none"), tg && tg.outerHTML.slice(0, 120));
    if (tg) { tg.click(); await sleep(60); }
    ok("U2 bấm mở: aria-expanded=true, có ô thêm", !!tg && tg.getAttribute("aria-expanded") === "true" && !!inp(), 0);
    if (inp()) {
      for (const t of ["Đọc đề", "Soạn dàn ý", "Rà lại"]) { inp().value = t; kd(inp(), "Enter"); await sleep(30); }
      ok("U3 Enter thêm từng việc con, ô thêm được xóa và giữ focus", document.querySelectorAll("#subsPanel .ed-sub").length === 3 && inp().value === "" && document.activeElement === inp(), document.querySelectorAll("#subsPanel .ed-sub").length);
      inp().value = "   "; kd(inp(), "Enter"); await sleep(20);
      ok("U4 Enter với ô rỗng không thêm", document.querySelectorAll("#subsPanel .ed-sub").length === 3);
      const row0 = document.querySelectorAll("#subsPanel .ed-sub")[0];
      row0.querySelector("input[type=checkbox]").click(); await sleep(20);
      ok("U5 tích xong: chip hiện 1/3", $("subsCount") && $("subsCount").textContent.trim() === "1/3", $("subsCount") && $("subsCount").textContent);
      const x2 = document.querySelectorAll("#subsPanel .ed-sub")[2].querySelector(".ed-sub-x");
      ok("U6 nút xóa có aria-label bắt đầu bằng 'Xóa'", !!x2 && /^Xóa/.test(x2.getAttribute("aria-label") || ""), x2 && x2.getAttribute("aria-label"));
      x2 && x2.click(); await sleep(20);
      ok("U7 xóa một việc con: còn 2, chip 1/2", document.querySelectorAll("#subsPanel .ed-sub").length === 2 && $("subsCount").textContent.trim() === "1/2", $("subsCount").textContent);
      // kích thước và chữ
      const els = [...document.querySelectorAll("#subsToggle, #subsPanel .ed-sub input, #subsPanel .ed-sub-x, #inpSub")];
      const small = els.filter(e => { const h = e.matches("input[type=checkbox]") ? (e.closest("label") || e).offsetHeight : e.offsetHeight; return h < 36; }).map(e => e.id || e.className);
      ok("U8 vùng bấm của nút, ô tích, nút xóa, ô thêm ≥ 36 px", els.length >= 4 && !small.length, small);
      const fsBad = [...document.querySelectorAll("#subsToggle, #subsToggle *, #subsPanel, #subsPanel *")].filter(e => e.children.length === 0 && e.textContent.trim()).map(e => parseFloat(getComputedStyle(e).fontSize)).filter(f => !FS.has(f));
      ok("U9 cỡ chữ thuộc thang 8 bậc (11,12,13,14,16,18,22,28)", !fsBad.length, fsBad);
      const sh = $("sheetBody");
      ok("U10 không tràn ngang trong popup", sh.scrollWidth <= sh.clientWidth + 1, [sh.scrollWidth, sh.clientWidth]);
      kd(document.activeElement, "Escape"); await sleep(60);
    } else ["U3", "U4", "U5", "U6", "U7", "U8", "U9", "U10"].forEach(id => ok(id + " (cần #inpSub)", false, "không có #inpSub"));
    // Lưu và mở lại
    await openOn(day, idx);
    if ($("subsToggle")) $("subsToggle").click();
    if ($("inpSub")) { $("inpSub").value = "A"; kd($("inpSub"), "Enter"); $("inpSub").value = "B"; kd($("inpSub"), "Enter"); }
    const c0 = document.querySelectorAll("#subsPanel .ed-sub input[type=checkbox]")[0]; c0 && c0.click();
    await saveEventFromForm(); await sleep(120);
    const saved = S.ev[day].find(x => x.id === "su_ui");
    ok("U11 lưu: S.ev có đúng việc con, đúng done, id riêng", subsOf(saved).length === 2 && subsOf(saved)[0].t === "A" && subsOf(saved)[0].done === 1 && !subsOf(saved)[1].done && new Set(subsOf(saved).map(x => x.id)).size === 2, subsOf(saved));
    ok("U12 tích hết/một phần KHÔNG tự đánh dấu hoạt động xong (không có trường done mới)", !("done" in saved), saved);
    ok("U13 thẻ hoạt động ở lịch hiện chip 1/2", [...document.querySelectorAll(".ev-subs")].some(e => e.textContent.trim() === "1/2"), document.querySelectorAll(".ev-subs").length);
    await openOn(day, S.ev[day].findIndex(x => x.id === "su_ui"));
    ok("U14 mở lại: chip 1/2, bấm mở thấy 2 việc con, 1 đã tích", $("subsCount") && $("subsCount").textContent.trim() === "1/2", $("subsCount") && $("subsCount").textContent);
    if ($("subsToggle")) $("subsToggle").click();
    ok("U15 mở lại: danh sách đúng", document.querySelectorAll("#subsPanel .ed-sub").length === 2 && document.querySelectorAll("#subsPanel .ed-sub input:checked").length === 1);
    closeEditor();
    // Hoạt động cũ (không có subs) mở được
    await openOn(d2, 0);
    ok("U16 hoạt động cũ không có subs mở được, chip rỗng", !!$("subsToggle") && ($("subsCount").textContent.trim() === ""), $("subsCount") && $("subsCount").textContent);
    closeEditor();

    // Chuỗi: không bật ô cả chuỗi thì buổi khác không đổi
    const ri = S.ev[day].findIndex(x => x.id === "su_r1");
    await openOn(day, ri);
    if ($("subsToggle")) $("subsToggle").click();
    if ($("inpSub")) { $("inpSub").value = "Chung"; kd($("inpSub"), "Enter"); }
    document.querySelectorAll("#subsPanel .ed-sub input[type=checkbox]")[0] && document.querySelectorAll("#subsPanel .ed-sub input[type=checkbox]")[0].click();
    await saveEventFromForm(); await sleep(120);
    ok("U17 chuỗi, không bật 'cả chuỗi': buổi khác không có việc con", !subsOf(S.ev[d1][0]).length && !subsOf(S.ev[d2][0]).length);
    // Bật ô cả chuỗi: chép danh sách, bỏ done, id mới
    await openOn(day, S.ev[day].findIndex(x => x.id === "su_r1"));
    if ($("subsToggle")) $("subsToggle").click();
    const ser = $("inpSeries"); if (ser) ser.checked = true;
    await saveEventFromForm(); await sleep(120);
    const r1 = S.ev[day].find(x => x.id === "su_r1"), r2 = S.ev[d1][0], r3 = S.ev[d2][0];
    ok("U18 'Áp dụng cho cả chuỗi': các buổi sau có cùng danh sách (tên), không chép done", subsOf(r2).map(x => x.t).join() === subsOf(r1).map(x => x.t).join() && subsOf(r2).length === 1 && !subsOf(r2).some(x => x.done) && !subsOf(r3).some(x => x.done), [subsOf(r1), subsOf(r2), subsOf(r3)]);
    ok("U19 buổi sau có id việc con riêng (không trùng buổi gốc, không trùng nhau)", new Set([...subsOf(r1), ...subsOf(r2), ...subsOf(r3)].map(x => x.id)).size === 3, [subsOf(r1), subsOf(r2), subsOf(r3)].map(l => l.map(x => x.id)));
    ok("U20 buổi gốc giữ nguyên dấu tích của mình", subsOf(r1).some(x => x.done));
    // IME: Enter khi bộ gõ đang chốt chữ không được thêm việc con
    await openOn(day, S.ev[day].findIndex(x => x.id === "su_ui"));
    if ($("subsToggle")) $("subsToggle").click();
    if ($("inpSub")) {
      const n0 = document.querySelectorAll("#subsPanel .ed-sub").length;
      $("inpSub").value = "sữa"; $("inpSub").dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", isComposing: true, bubbles: true, cancelable: true })); await sleep(30);
      ok("U21 Enter lúc bộ gõ đang chốt chữ (isComposing): chưa thêm", document.querySelectorAll("#subsPanel .ed-sub").length === n0 && $("inpSub").value === "sữa", [n0, document.querySelectorAll("#subsPanel .ed-sub").length]);
    } else ok("U21 (cần #inpSub)", false, 0);
    closeEditor();
    // Chuỗi: bật "cả chuỗi" chỉ để đổi giờ, không đụng việc con: việc con riêng của buổi khác phải còn
    S.ev[d1][0].subs = [{ id: "su_keep", t: "Mua giày", done: 1 }]; save();
    await openOn(day, S.ev[day].findIndex(x => x.id === "su_r1"));
    const sr = $("inpSeries"); if (sr) sr.checked = true;
    await saveEventFromForm(); await sleep(120);
    ok("U22 'cả chuỗi' không đổi việc con: việc con riêng của buổi khác giữ nguyên (cả dấu tích)", (S.ev[d1][0].subs || []).length === 1 && S.ev[d1][0].subs[0].id === "su_keep" && S.ev[d1][0].subs[0].done === 1, S.ev[d1][0].subs);
    // Tạo mới có lặp: buổi đầu giữ dấu tích; id việc con của mỗi buổi khác nhau
    const dN = ky(ad(new Date(), 5));
    openEditor(dN, null); await sleep(480);
    $("subsToggle").click();
    for (const t of ["P", "Q", "R"]) { $("inpSub").value = t; kd($("inpSub"), "Enter"); }
    document.querySelectorAll("#subsPanel .ed-sub input[type=checkbox]")[0].click();
    $("inpTitle").value = "Lặp mới"; $("inpStart").value = "15:00"; $("inpRepeat").value = "d"; $("inpRepeatEnd").value = ky(ad(new Date(), 20));
    await saveEventFromForm(); await sleep(150);
    const first = S.ev[dN].find(x => x.t === "Lặp mới"), second = S.ev[ky(ad(new Date(), 6))].find(x => x.t === "Lặp mới");
    ok("U23 tạo mới có lặp: buổi đầu giữ dấu tích đã đặt trong popup", first && subsOf(first).length === 3 && subsOf(first)[0].done === 1, subsOf(first));
    ok("U24 tạo chuỗi: buổi sau không có dấu tích", second && subsOf(second).length === 3 && !subsOf(second).some(x => x.done));
    const allIds = Object.values(S.ev).flat().filter(x => x.t === "Lặp mới").map(x => subsOf(x).map(y => y.id));
    ok("U25 id việc con không trùng trong cùng một buổi (mọi buổi)", allIds.every(l => new Set(l).size === l.length) && allIds.length > 10, allIds.length);
  } catch (e) { ok("U.err", false, String(e && e.stack || e)); }
  finally { restoreAll(); }

  const lA = lsAll(localStorage), sA = lsAll(sessionStorage);
  ok("G9.1 sau khi chạy: localStorage và sessionStorage như trước", JSON.stringify(lA) === JSON.stringify(lsBefore) && JSON.stringify(sA) === JSON.stringify(ssBefore), [Object.keys(lA).length, Object.keys(sA).length]);
  ok("G9.2 sau khi chạy: S như trước", JSON.stringify(S) === sBefore, "S khác");
  const pass = out.filter(x => x.pass).length;
  return { pass, total: out.length, fail: out.filter(x => !x.pass) };
};
