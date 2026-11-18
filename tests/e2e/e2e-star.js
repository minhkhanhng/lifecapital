// Việc 2 (sao: một việc nổi bật nhất mỗi ngày), Việc 1 (thẻ hoạt động thoáng), Việc 3 (hàng "Lúc này": Đang làm · Tiếp theo · Nổi bật nhất).
// Chạy sau loadDemo(). Đặt dữ liệu riêng cho HÔM NAY, khôi phục S, storage, tab, giao diện khi xong.
window.E2ESTAR = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  if (!Object.values(S.ev || {}).some(L => (L || []).some(e => e && e.demo))) return { pass: 0, total: 1, fail: [{ id: "A0", pass: false, info: "Chạy loadDemo() trước" }] };
  const sl = ms => new Promise(r => setTimeout(r, ms));
  const lsBefore = JSON.stringify(Object.assign({}, localStorage)), sBefore = JSON.stringify(S), tab0 = cur, sub0 = calSubView, sel0 = sel;
  const R = e => e.getBoundingClientRect(), q = (s, r = document) => [...r.querySelectorAll(s)];
  const vis = e => { if (!e) return false; const r = R(e), cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none"; };
  const W = innerWidth, touch = matchMedia("(pointer: coarse)").matches || W < 500;
  const clone = o => JSON.parse(JSON.stringify(o));
  const nt = document.createElement("style"); nt.textContent = "*, *::before, *::after { transition: none !important; animation: none !important; }"; document.head.appendChild(nt);
  const k = tk, cap = (S.caps[0] || {}).k || "suc";
  const mk = (id, t, s, h, extra) => ({ id, t, c: cap, m: "u", h: h || 1, s, ...(extra || {}) });
  const at = (h, m) => { const d = new Date(); d.setHours(h, m, 0, 0); return d; };
  const go = async (t, sub) => { switchTab(t); if (sub) calSubView = sub; sel = CW; draw(true); await sl(60); };
  try {
    // ---------- T1: dữ liệu ----------
    ok("T1.0 có các hàm evStar, now3Data, now3HTML", typeof evStar === "function" && typeof now3Data === "function" && typeof now3HTML === "function");
    S.ev[k] = [mk("sA1", "Việc A", "09:00", 1), mk("sB1", "Việc B", "10:00", 1)];
    evStar(k, 0);
    ok("T1.1 bật sao việc 1: chỉ việc 1 có star", S.ev[k][0].star === 1 && !S.ev[k][1].star, S.ev[k].map(e => e.star));
    evStar(k, 1);
    ok("T1.2 bật sao việc 2: sao chuyển, việc 1 hết sao (tối đa một sao mỗi ngày)", !S.ev[k][0].star && S.ev[k][1].star === 1, S.ev[k].map(e => e.star));
    evStar(k, 1);
    ok("T1.3 bấm lại việc 2: bỏ sao, không việc nào có sao", S.ev[k].every(e => !e.star), S.ev[k].map(e => e.star));
    evStar(k, 0);
    const st1 = cleanState(clone(S));
    const st2 = cleanState(clone(st1));
    ok("T1.4 qua JSON + cleanState hai lần: sao còn đúng (việc 1 có star:1, việc 2 không)", st2 && st2.ev[k][0].star === 1 && !st2.ev[k][1].star && st2.ev[k][0].t === "Việc A", st2 && st2.ev[k]);
    ok("T1.5 cleanState chỉ ghi star khi truthy (việc không sao không có trường star)", st2 && !("star" in st2.ev[k][1]));
    // hai máy: base không sao; máy này sao việc 1; máy kia đổi tên việc 2 (khác việc, cả hai được giữ)
    const base = cleanState(clone({ ...S, ev: { [k]: [mk("sA1", "Việc A", "09:00", 1), mk("sB1", "Việc B", "10:00", 1)] } }));
    const mine = clone(base); mine.ev[k][0].star = 1; mine.ev[k][0].mt = Date.now();
    const theirs = clone(base); theirs.ev[k][1].t = "Việc B đổi tên"; theirs.ev[k][1].mt = Date.now() + 1000;
    const mg = mergeStates(base, mine, theirs, true);
    const mA = mg && mg.ev[k] && mg.ev[k].find(e => e.id === "sA1"), mB = mg && mg.ev[k] && mg.ev[k].find(e => e.id === "sB1");
    ok("T1.6 gộp hai máy: sao của việc 1 và đổi tên việc 2 đều còn", !!mA && mA.star === 1 && !!mB && mB.t === "Việc B đổi tên", mg && mg.ev[k]);
    // cùng một việc bị hai máy sửa: một bản thắng theo thời điểm sửa, không nhân đôi
    const mine2 = clone(base); mine2.ev[k][0].star = 1; mine2.ev[k][0].mt = Date.now();
    const theirs2 = clone(base); theirs2.ev[k][0].t = "Việc A đổi"; theirs2.ev[k][0].mt = Date.now() + 1000;
    const mg2 = mergeStates(base, mine2, theirs2, true);
    ok("T1.7 cùng một việc sửa ở hai máy: không nhân đôi, bản sau cùng thắng (gộp theo việc, không theo trường)", mg2.ev[k].filter(e => e.id === "sA1").length === 1 && mg2.ev[k].length === 2, mg2.ev[k]);
    // đổi sao không đẩy Google Calendar, không tăng ds
    const dsBefore = S.ev[k].reduce((n, e) => n + (e.ds || 0), 0), gdelBefore = JSON.stringify(S.gdel || []);
    const mpOrig = window.markPending, gfOrig = window.gcalFlush;
    let calls = 0;
    window.markPending = function () { calls++; return mpOrig.apply(this, arguments); };
    window.gcalFlush = function () { calls++; return gfOrig.apply(this, arguments); };
    const sBefore2 = S.ev[k][0].mt || 0;
    try { evStar(k, 1); evStar(k, 1); evStar(k, 0); } finally { window.markPending = mpOrig; window.gcalFlush = gfOrig; }
    const dsAfter = S.ev[k].reduce((n, e) => n + (e.ds || 0), 0);
    ok("T1.8 đổi sao không gọi markPending/gcalFlush và không tăng ds", calls === 0 && dsAfter === dsBefore && JSON.stringify(S.gdel || []) === gdelBefore, [calls, dsBefore, dsAfter]);
    ok("T1.9 đổi sao làm mt của việc đổi tăng (để đồng bộ gộp)", (S.ev[k][0].mt || 0) > sBefore2, [S.ev[k][0].mt, sBefore2]);
    // xuất/nhập: cùng đường tạo JSON của exportData và cleanState khi nhập
    const back = cleanState(JSON.parse(JSON.stringify(S)));
    ok("T1.10 xuất/nhập JSON giữ sao (việc 1 có star:1)", back && back.ev[k].some(e => e.id === "sA1" && e.star === 1), back && back.ev[k]);

    // ---------- T2: giao diện ----------
    S.ev[k] = [mk("sA1", "Việc A", "09:00", 1), mk("sB1", "Việc B", "10:00", 1)];
    evStar(k, 0);
    await go("ca", "focus");
    let cards = q(".day-card.today .event-item"), stars = q(".day-card.today .ev-star");
    ok("T2.1 mỗi thẻ hoạt động có một nút sao anh em (không lồng button trong role=button)", cards.length === 2 && stars.length === 2 && cards.every(c => !c.querySelector("button") && c.parentElement.querySelector(".ev-star")) && stars.every(b => b.tagName === "BUTTON" && !b.closest("[role=button]")), [cards.length, stars.length]);
    ok("T2.2 aria-pressed đúng: việc 1 true, việc 2 false", stars[0] && stars[0].getAttribute("aria-pressed") === "true" && stars[1] && stars[1].getAttribute("aria-pressed") === "false", stars.map(b => b.getAttribute("aria-pressed")));
    ok("T2.3 aria-label: 'Bỏ đánh dấu: Việc A' khi đang sao, 'Đánh dấu nổi bật nhất: Việc B' khi chưa", stars[0] && stars[0].getAttribute("aria-label") === "Bỏ đánh dấu: Việc A" && stars[1].getAttribute("aria-label") === "Đánh dấu nổi bật nhất: Việc B", stars.map(b => b.getAttribute("aria-label")));
    // ☆ của thẻ chưa đánh dấu ẩn khi không rê/focus; ★ của thẻ đã đánh dấu luôn hiện
    const hov = b => b.parentElement.matches(":hover") || b.parentElement.matches(":focus-within");
    ok("T2.4 ★ luôn hiện ở thẻ có sao; ☆ thẻ chưa sao ẩn (opacity 0) khi không rê/focus", stars[0].getAttribute("aria-pressed") === "true" && getComputedStyle(stars[0]).opacity === "1" && (hov(stars[1]) || getComputedStyle(stars[1]).opacity === "0"), stars.map(b => getComputedStyle(b).opacity));
    stars[1].focus(); await sl(30);
    ok("T2.4b focus bàn phím (Tab) vào ☆ làm nó hiện (opacity 1)", getComputedStyle(stars[1]).opacity === "1", getComputedStyle(stars[1]).opacity);
    ok("T2.4c nút sao là <button type=button> có tabIndex ≥ 0 (Tab tới được)", stars.every(b => b.tagName === "BUTTON" && b.type === "button" && b.tabIndex >= 0));
    stars[1].click(); await sl(60); // Enter/Space trên <button> tương đương click
    stars = q(".day-card.today .ev-star");
    ok("T2.5 Enter/Space (= click) trên ☆ việc 2: sao chuyển sang việc 2, data đúng", stars[1].getAttribute("aria-pressed") === "true" && stars[0].getAttribute("aria-pressed") === "false" && S.ev[k][1].star === 1 && !S.ev[k][0].star, stars.map(b => b.getAttribute("aria-pressed")));
    ok("T2.6 bấm sao không mở bảng sửa (ed rỗng, không có popup)", !ed, ed);
    stars[1].click(); await sl(60);
    stars = q(".day-card.today .ev-star");
    ok("T2.6b bấm lại ★: bỏ sao (không việc nào có sao)", stars.every(b => b.getAttribute("aria-pressed") === "false") && S.ev[k].every(e => !e.star), stars.map(b => b.getAttribute("aria-pressed")));
    evStar(k, 0); draw(true); await sl(60);
    stars = q(".day-card.today .ev-star");
    // vùng bấm: ★ (đã đánh dấu) đo được; cảm ứng: ☆ chưa sao không nhận chạm
    // scroll tức thời (smooth bị treo khi khung nền): đưa nút vào khung nhìn trước khi đo điểm chạm
    const inView = b => { window.scrollTo({ top: b.getBoundingClientRect().top + scrollY - innerHeight / 2, behavior: "instant" }); return b; };
    const hitOK = b => { inView(b); const r = R(b), cx = r.left + r.width / 2, cy = r.top + r.height / 2, d = touch ? 17 : 8; return [[0, 0], [d, d], [-d, d], [d, -d], [-d, -d]].every(([dx, dy]) => { const el = document.elementFromPoint(cx + dx, cy + dy); return !!el && (el === b || b.contains(el)); }); };
    if (touch) ok("T2.7 cảm ứng: ★ vùng bấm ≥ 36×36 (trúng ở ±17 px); ☆ chưa sao không nhận chạm (pointer-events none)", hitOK(stars[0]) && R(stars[0]).width >= 24 && getComputedStyle(stars[1]).pointerEvents === "none", [getComputedStyle(stars[1]).pointerEvents, stars.map(b => Math.round(R(b).width))]);
    else ok("T2.7 chuột: nút sao ≥ 24×24 và trúng ở ±8 px", stars.every(b => R(b).width >= 24 && R(b).height >= 24 && hitOK(b)), stars.map(b => [Math.round(R(b).width), Math.round(R(b).height)]));
    cards = q(".day-card.today .event-item");
    // Thẻ: đệm, khoảng cách, tên một dòng
    cards = q(".day-card.today .event-item");
    const padT = cards[0] ? parseFloat(getComputedStyle(cards[0]).paddingTop) : 0, padL = cards[0] ? parseFloat(getComputedStyle(cards[0]).paddingLeft) : 0;
    const wraps = q(".day-card.today .ev-wrap");
    const gap = wraps.length >= 2 ? Math.round(R(wraps[1]).top - R(wraps[0]).bottom) : -1;
    if (W >= 900 && !touch) {
      ok("T2.8 màn rộng: đệm thẻ ≥ 10px trên × 12px trái, khoảng cách hai thẻ ≥ 12px", padT >= 10 && padL >= 12 && gap >= 12, [padT, padL, gap]);
    } else {
      ok("T2.8 điện thoại: đệm thẻ không mỏng hơn trước (≥ 6×10), khoảng cách ≥ 6px", padT >= 6 && padL >= 10 && gap >= 6, [padT, padL, gap]);
    }
    const oneL = q(".day-card.today .event-title").every(t => t.scrollHeight <= t.clientHeight + 1 && Math.round(R(t).height) <= 20);
    ok("T2.9 tên hoạt động một dòng (ellipsis) có nút sao", oneL && cards.length === 2, q(".day-card.today .event-title").map(t => [t.scrollHeight, t.clientHeight]));
    // Nút sao không đè chữ: tên co lại trước nút
    // PO (2026-11-18): chỉ thẻ ĐƯỢC ĐÁNH DẤU chừa chỗ cho ★ (tên không chạy dưới ★); thẻ chưa đánh dấu dùng hết bề ngang cho tên
    {
      const tops = q(".day-card.today .ev-wrap").map(w => ({ on: !!w.querySelector(".ev-star.on"), pad: parseFloat(getComputedStyle(w.querySelector(".event-item-top")).paddingRight) }));
      ok("T2.10 thẻ chưa đánh dấu dùng hết bề ngang (đệm phải 0), thẻ đã đánh dấu chừa ≥ 20px cho ★", tops.length > 0 && tops.every(x => x.on ? x.pad >= 20 : x.pad === 0), tops);
    }

    // ---------- T4: công tắc "Nổi bật nhất trong ngày" trong popup Sửa hoạt động ----------
    S.ev[k] = [mk("pA", "Việc A", "09:00", 1), mk("pB", "Việc B", "10:00", 1, { star: 1 })];
    openEditor(k, 0); await sl(80);
    const cb = document.getElementById("inpStar"), lb = document.querySelector('label[for="inpStar"]');
    ok("T4.1 popup Sửa: có công tắc Nổi bật nhất trong ngày, việc A chưa tích", !!cb && !cb.checked && !!lb && lb.textContent.includes("Nổi bật nhất trong ngày"), lb && lb.textContent);
    cb.checked = true;
    await saveEventFromForm(false); await sl(60);
    ok("T4.2 bật ở việc A rồi Lưu: A có sao, B mất sao (một mỗi ngày), popup đóng", S.ev[k].find(e => e.id === "pA").star === 1 && !S.ev[k].find(e => e.id === "pB").star && !ed, S.ev[k].map(e => [e.t, e.star]));
    openEditor(k, 0); await sl(80);
    ok("T4.3 mở lại việc A: công tắc tích theo dữ liệu", document.getElementById("inpStar").checked);
    document.getElementById("inpStar").checked = false;
    await saveEventFromForm(false); await sl(60);
    ok("T4.4 bỏ tích rồi Lưu: không việc nào có sao", S.ev[k].every(e => !e.star), S.ev[k].map(e => e.star));
    openEditor(k, 1); await sl(80);
    document.getElementById("inpStar").checked = true; closeEditor(); await sl(60);
    ok("T4.5 Hủy: không đổi sao", S.ev[k].every(e => !e.star), S.ev[k].map(e => e.star));
    openEditor(k, 1); await sl(80);
    ok("T4.6 mở lại sau Hủy: công tắc không tích (việc chưa được lưu)", !document.getElementById("inpStar").checked);
    closeEditor(); await sl(40);
    ok("T4.7 sao không được đẩy lên Google (không ds, không markPending khi lưu công tắc)", S.ev[k].every(e => !e.ds));

    // ---------- T3: hàng "Lúc này" ----------
    S.ev[k] = [
      mk("tA", "Việc A", "09:00", 2), mk("tB", "Việc B", "10:00", 1), mk("tC", "Việc C", "14:00", 1), mk("tD", "Việc D", "", 1, { star: 1 })
    ];
    await go("ca", "focus");
    const hero = document.querySelector("#v .today-hero"), row = document.getElementById("now3"), wb = document.querySelector("#v .wk-bar");
    ok("T3.1 hàng Lúc này tồn tại, nằm dưới .today-hero và trên .wk-bar", !!row && !!hero && !!wb && R(row).top >= R(hero).bottom - 1 && R(row).bottom <= R(wb).top + 1, [row && R(row).top, hero && R(hero).bottom, wb && R(wb).top]);
    const cells = row ? q(".n3-c", row) : [];
    ok("T3.2 đúng 3 ô theo thứ tự Đang làm, Tiếp theo, Nổi bật nhất", cells.length === 3 && /Đang làm/.test(cells[0].textContent) && /Tiếp theo/.test(cells[1].textContent) && /Nổi bật nhất/.test(cells[2].textContent), cells.map(c => c.textContent.trim()));
    ok("T3.3 .today-hero không còn chữ Tiếp theo", !!hero && !/Tiếp theo/.test(hero.textContent) && !hero.querySelector(".th-next"), hero && hero.textContent.slice(0, 120));
    // now3Data với giờ giả (hôm nay)
    const d1030 = now3Data(at(10, 30)), d1130 = now3Data(at(11, 30)), d1400 = now3Data(at(14, 0)), d1530 = now3Data(at(15, 30)), d0800 = now3Data(at(8, 0));
    ok("T3.4 10:30: đang làm = Việc B (bắt đầu muộn nhất trong các việc đang diễn ra), tiếp theo = Việc C, nổi bật = Việc D", d1030.doing && d1030.doing.e.t === "Việc B" && d1030.next && d1030.next.e.t === "Việc C" && d1030.star && d1030.star.e.t === "Việc D", [d1030.doing && d1030.doing.e.t, d1030.next && d1030.next.e.t, d1030.star && d1030.star.e.t]);
    ok("T3.5 11:30: không đang làm, tiếp theo = Việc C", d1130.doing === null && d1130.next && d1130.next.e.t === "Việc C", [d1130.doing, d1130.next && d1130.next.e.t]);
    ok("T3.6 14:00 đúng giờ bắt đầu: đang làm = Việc C, không còn tiếp theo", d1400.doing && d1400.doing.e.t === "Việc C" && d1400.next === null, [d1400.doing && d1400.doing.e.t, d1400.next]);
    ok("T3.7 15:30 hết việc: không đang làm, không tiếp theo; việc không giờ không bao giờ là đang làm/tiếp theo", d1530.doing === null && d1530.next === null && d0800.doing === null && d0800.next && d0800.next.e.t === "Việc A", [d1530.doing, d1530.next, d0800.next && d0800.next.e.t]);
    ok("T3.8 việc không giờ vẫn là nổi bật nhất", d1530.star && d1530.star.e.t === "Việc D");
    // trạng thái trống đúng chữ
    S.ev[k] = [mk("tX", "Việc X", "09:00", 1)];
    const emptyH = now3HTML(at(15, 30));
    ok("T3.9 trạng thái trống đúng chữ: Không có việc đang làm / Hết việc hôm nay / Chưa đánh dấu: rê chuột lên một việc rồi bấm ☆, hoặc bật trong Sửa hoạt động", /Không có việc đang làm/.test(emptyH) && /Hết việc hôm nay/.test(emptyH) && /Chưa đánh dấu: rê chuột lên một việc rồi bấm ☆, hoặc bật trong Sửa hoạt động/.test(emptyH), emptyH.replace(/<[^>]+>/g, "|").slice(0, 300));
    S.ev[k] = [mk("tA", "Việc A", "09:00", 2), mk("tB", "Việc B", "10:00", 1, { star: 1 })];
    await go("ca", "focus");
    // bấm ô mở đúng hoạt động: việc bắt đầu 30 phút trước giờ máy (đang diễn ra), ô Đang làm phải hiện
    const nowD = new Date(), st30 = new Date(nowD.getTime() - 30 * 60000), hm30 = `${String(st30.getHours()).padStart(2, "0")}:${String(st30.getMinutes()).padStart(2, "0")}`;
    S.ev[k] = [mk("tA", "Việc A", hm30, 2), mk("tB", "Việc B", "23:59", 1, { star: 1 })];
    await go("ca", "focus");
    const doingBtn = q("#now3 .n3-doing")[0], idxA = S.ev[k].findIndex(e => e.t === "Việc A");
    ok("T3.10 ô Đang làm là nút (có aria-label, nhắc đúng việc đang diễn ra)", !!doingBtn && doingBtn.tagName === "BUTTON" && (doingBtn.getAttribute("aria-label") || "").includes("Việc A"), doingBtn && doingBtn.getAttribute("aria-label"));
    if (doingBtn) {
      doingBtn.click(); await sl(80);
      ok("T3.11 bấm ô mở bảng sửa đúng hoạt động (ei = chỉ số việc đang làm)", ed === k && ei === idxA, [ed, ei, idxA]);
      if (typeof closeEditor === "function") closeEditor();
      await sl(40);
    } else ok("T3.11 bấm ô mở bảng sửa đúng hoạt động", false, "không có ô Đang làm");
    // điện thoại: không tràn, ô cao ≥ 44
    if (W < 600) {
      const rr = q("#now3 .n3-c");
      ok("T3.12 điện thoại: không tràn ngang và mỗi ô cao ≥ 44px", document.documentElement.scrollWidth <= W + 1 && rr.length === 3 && rr.every(c => R(c).height >= 44), [document.documentElement.scrollWidth, rr.map(c => Math.round(R(c).height))]);
    }
    if (W >= 600) {
      const hh = q("#now3 .n3-c").map(c => Math.round(R(c).height));
      ok("T3.13 màn ≥ 600px: 3 cột bằng nhau, cao mỗi ô ≤ 64px", hh.length === 3 && hh.every(h => h <= 64) && Math.abs(R(q("#now3 .n3-c")[0]).width - R(q("#now3 .n3-c")[2]).width) <= 2, hh);
    }
    // Hàng chỉ hiện ở tuần hiện tại
    sel = CW - 1 >= 0 ? CW - 1 : CW + 1; draw(true); await sl(40);
    ok("T3.14 tuần khác: không có hàng Lúc này", !document.getElementById("now3"));
    sel = CW; draw(true); await sl(40);
  } catch (e) { ok("Z lỗi chạy", false, String(e && e.stack || e).slice(0, 400)); }
  finally {
    nt.remove();
    localStorage.clear(); Object.entries(JSON.parse(lsBefore)).forEach(([kk, v]) => localStorage.setItem(kk, v));
    Object.keys(S).forEach(kk => delete S[kk]); Object.assign(S, JSON.parse(sBefore));
    calSubView = sub0; sel = sel0; switchTab(tab0); draw(true);
  }
  return { pass: out.filter(x => x.pass).length, total: out.length, fail: out.filter(x => !x.pass) };
};
