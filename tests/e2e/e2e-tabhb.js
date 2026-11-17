// Gói tab-thoi-quen: tab "Thói quen" riêng; tab Lịch không còn thanh thói quen. Chạy sau loadDemo() trên trang dữ liệu thử,
// ở 1440 và ở 390 (ca phụ thuộc bề rộng tự nhận innerWidth). Khôi phục S, localStorage, sessionStorage khi xong; chỉ dùng dữ liệu giả.
window.E2ETABHB = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  if (!Object.values(S.ev || {}).some(L => (L || []).some(e => e && e.demo))) return { pass: 0, total: 1, fail: [{ id: "H0", pass: false, info: "Trang không phải dữ liệu thử: chạy loadDemo() trước" }] };
  const lsAll = st => { const o = {}; for (let i = 0; i < st.length; i++) { const k = st.key(i); o[k] = st.getItem(k); } return o; };
  const lsBefore = lsAll(localStorage), ssBefore = lsAll(sessionStorage), sBefore = JSON.stringify(S), curBefore = cur;
  const putAll = (st, snap) => { Object.keys(lsAll(st)).forEach(k => { if (!(k in snap)) st.removeItem(k); }); Object.keys(snap).forEach(k => { if (st.getItem(k) !== snap[k]) st.setItem(k, snap[k]); }); };
  const restoreAll = () => { closeHb && closeHb(); putAll(localStorage, lsBefore); putAll(sessionStorage, ssBefore); S = JSON.parse(sBefore); lastRaw = localStorage.getItem("lc2"); saveFailed = false; cur = curBefore; draw(true); };
  const wide = innerWidth >= 900, vis = el => !!el && getComputedStyle(el).display !== "none" && el.getBoundingClientRect().width > 0;
  const navBtn = id => document.querySelector(`#nav button[onclick*="'${id}'"]`);
  try {
    S.habits = (S.habits || []).filter(h => !/^TH /.test(h.n));
    const hA = hbAdd({ n: "TH Nước", c: "sk", kind: "tick", per: "day", tgt: 7 });
    const hB = hbAdd({ n: "TH Chạy", c: "sk", kind: "auto", per: "week", tgt: 2, match: "TH Chạy" });
    save();

    // --- Điều hướng
    switchTab("ca"); await sleep(30);
    const ids = TABS.map(t => t.id);
    ok("H1.1 TABS có hb ngay sau hl", ids.indexOf("hb") === ids.indexOf("hl") + 1 && ids.indexOf("hb") > 0, ids);
    ok("H1.2 nút tab Thói quen hiện trong thanh điều hướng", vis(navBtn("hb")), !!navBtn("hb"));
    if (wide) ok("H1.3 desktop: đủ 7 tab hiện", [...document.querySelectorAll("#nav button")].filter(vis).length === 7 && vis(navBtn("su")), [...document.querySelectorAll("#nav button")].filter(vis).length);
    else {
      ok("H1.3 mobile: 6 tab hiện, Tổng quan ẩn khỏi thanh dưới", [...document.querySelectorAll("#nav button")].filter(vis).length === 6 && !vis(navBtn("su")), [...document.querySelectorAll("#nav button")].filter(vis).length);
      const nr = document.querySelector("#nav").getBoundingClientRect();
      ok("H1.4 mobile: thanh tab không tràn ngang", nr.right <= innerWidth + 0.5 && nr.left >= -0.5, nr);
      switchTab("me"); await sleep(30);
      ok("H1.5 mobile: vẫn vào được Tổng quan từ tab Tôi", !!document.querySelector('#v [onclick*="switchTab(\'su\')"]'));
    }

    // --- Tab Lịch gọn
    for (const sv of ["focus", "timeline"]) {
      calSubView = sv; switchTab("ca"); await sleep(30);
      ok(`H2.${sv} tab Lịch (${sv}) không còn thanh thói quen`, !document.querySelector("#v .hb-strip, #v .hb-chip, #v .hb-tick") && !/THÓI QUEN/i.test(document.querySelector("#v").textContent.slice(0, 4000).replace(/Thói quen:/g, "")) , document.querySelector("#v .hb-strip") && "còn .hb-strip");
    }
    calSubView = "focus";
    switchTab("ca"); await sleep(30);
    ok("H2.3 tab Lịch vẫn có Giờ theo loại vốn", !!document.querySelector("#v .cap-sum"));

    // --- Tab Thói quen
    switchTab("hb"); await sleep(40);
    ok("H3.1 mở tab hb: cur=hb, body[data-tab]=hb, tiêu đề Thói quen", cur === "hb" && document.body.dataset.tab === "hb" && $("pageTitle").textContent === "Thói quen", [cur, document.body.dataset.tab]);
    const cardOf = n => [...document.querySelectorAll("#v .hbt-card")].find(c => c.textContent.includes(n));
    const cA = cardOf("TH Nước"), cB = cardOf("TH Chạy");
    ok("H3.2 mỗi thói quen một thẻ", !!cA && !!cB, document.querySelectorAll("#v .hbt-card").length);
    ok("H3.3 thẻ tích tay có nút tích; thẻ tự đếm thì không", !!cA && !!cA.querySelector(".hb-tick") && !!cB && !cB.querySelector(".hb-tick"));
    ok("H3.4 thẻ có chuỗi và 7 chấm tuần", !!cA && /ngày/.test(cA.textContent) && cA.querySelectorAll(".hb-dot").length === 7);
    const before = JSON.stringify(S.habits.filter(h => h.id !== hA.id));
    cA.querySelector(".hb-tick").click(); await sleep(30);
    ok("H3.5 bấm tích: ticks[hôm nay]=1, mt cập nhật, giao diện cập nhật", findHb(hA.id).ticks[tk] === 1 && findHb(hA.id).mt > 0 && cardOf("TH Nước").querySelector('.hb-tick[aria-pressed="true"]'), findHb(hA.id));
    ok("H3.6 thói quen khác không đổi", JSON.stringify(S.habits.filter(h => h.id !== hA.id)) === before);
    ok("H3.7 vẫn ở tab hb sau khi tích", cur === "hb" && !!cardOf("TH Nước"));
    cardOf("TH Nước").querySelector(".hb-tick").click(); await sleep(30);
    ok("H3.8 bấm lại bỏ tích", !findHb(hA.id).ticks[tk]);
    const t0 = JSON.stringify(Object.keys(findHb(hA.id)).sort());
    ok("H3.9 cấu trúc thói quen không thêm trường", t0 === JSON.stringify(["c", "id", "kind", "mt", "n", "per", "sd", "ticks", "tgt"].sort()) || t0 === JSON.stringify(["c", "id", "kind", "n", "per", "sd", "ticks", "tgt"].sort()), t0);

    // --- Thêm, sửa, xóa ngay ở tab mới
    ok("H4.1 nút Thêm thói quen trong tab", !!document.querySelector("#v [onclick*='hbOpen()']"));
    headerAdd(); await sleep(100);
    ok("H4.2 nút Thêm trên header ở tab hb mở bảng thói quen mới", !!hbEd && !hbEd.id && $("hbOverlay").classList.contains("open"), hbEd);
    $("hbName").value = "TH Thiền"; hbSet("n", "TH Thiền"); hbSet("kind", "tick"); hbSave(); await sleep(40);
    const hC = S.habits.find(h => h.n === "TH Thiền");
    ok("H4.3 lưu thói quen mới: có dữ liệu và thẻ", !!hC && !!cardOf("TH Thiền"), hC);
    hbOpen(hC.id); await sleep(60); hbSet("n", "TH Thiền 2"); hbSave(); await sleep(40);
    ok("H4.4 sửa tên", findHb(hC.id).n === "TH Thiền 2" && !!cardOf("TH Thiền 2"));
    hbOpen(hC.id); hbArchive(hC.id); await sleep(40);
    ok("H4.5 lưu trữ: thẻ ẩn, vào mục Đã lưu trữ", !cardOf("TH Thiền 2") && findHb(hC.id).arch === 1 && /lưu trữ/i.test($("v").textContent));
    hbDelete(hC.id); await sleep(30);
    ok("H4.6 xóa thói quen", !findHb(hC.id));
    document.querySelectorAll(".toast").forEach(t => t.remove());

    // --- Gợi ý và liên kết cũ
    ok("H5.1 Tổng quan: nút Quản lý thói quen mở tab hb", (switchTab("su"), document.querySelector('#v [onclick*="switchTab(\'hb\')"]') !== null || !hbList().length), "không có liên kết");
    ok("H5.2 tab Tôi không còn danh sách thói quen trùng", (switchTab("me"), !document.querySelector("#v .hb-rows")));

    // --- Tắt mô-đun
    S.cfg = S.cfg || {}; setMod("hb", false); await sleep(30);
    ok("H6.1 tắt Thói quen: tab biến mất", !navBtn("hb") && !tabsOn().some(t => t.id === "hb"));
    switchTab("hb"); await sleep(20);
    ok("H6.2 tắt mô-đun, mở hb: quay về Lịch", cur === "ca", cur);
    setMod("hb", true); await sleep(30);
    ok("H6.3 bật lại: tab trở lại, dữ liệu còn", !!navBtn("hb") && !!findHb(hA.id));

    // --- Bố cục
    switchTab("hb"); await sleep(40);
    const de = document.documentElement;
    ok(`H7.1 không tràn ngang ở ${innerWidth}px`, de.scrollWidth <= innerWidth + 1, [de.scrollWidth, innerWidth]);
    const tk1 = document.querySelector("#v .hbt-card .hb-tick");
    const r = tk1 && tk1.getBoundingClientRect();
    ok("H7.2 vùng bấm nút tích đạt ≥ 36px", !!r && r.width >= 36 && r.height >= 36, r);
    const SC = [11, 12, 13, 14, 16, 18, 22, 28], bad = new Set();
    document.querySelectorAll("#v .hbt-card, #v .hbt-card *, #v .hbt-head, #v .hbt-head *").forEach(e => { const f = parseFloat(getComputedStyle(e).fontSize); if (!SC.includes(f)) bad.add(f); });
    ok("H7.3 cỡ chữ trong thang 8 bậc", bad.size === 0, [...bad]);
    const small = [...document.querySelectorAll("#v button, #v .btn")].filter(vis).filter(b => { const q = b.getBoundingClientRect(); return q.height < 28 || q.width < 24; }).map(b => b.textContent.trim() + ":" + Math.round(b.getBoundingClientRect().width) + "x" + Math.round(b.getBoundingClientRect().height));
    ok("H7.4 mọi nút trong tab ≥ 28px cao, 24px rộng", small.length === 0, small);
    ok("H7.5 chấm tuần không chặn: mỗi thẻ ≤ chiều rộng trang", [...document.querySelectorAll("#v .hbt-card")].every(c => c.getBoundingClientRect().right <= innerWidth + 1));

    // --- Dữ liệu cũ nguyên vẹn
    S.habits = S.habits.filter(h => !/^TH /.test(h.n));
  } catch (e) { ok("H.err", false, String(e && e.stack || e)); }
  finally { restoreAll(); }
  ok("H9.1 sau khi chạy: S và storage như trước", JSON.stringify(S) === sBefore && JSON.stringify(lsAll(localStorage)) === JSON.stringify(lsBefore) && JSON.stringify(lsAll(sessionStorage)) === JSON.stringify(ssBefore), "khác");
  const pass = out.filter(x => x.pass).length;
  return { pass, total: out.length, fail: out.filter(x => !x.pass) };
};
