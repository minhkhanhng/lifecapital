// Gói 5 (sw-mo-nhanh): nhãn "Bản đã lưu" (#netChip) cạnh tiêu đề, hiện/ẩn theo tin {lc:"net", ok} từ service worker.
// Không cần SW thật: gửi MessageEvent giả vào navigator.serviceWorker. Chạy sau loadDemo(); khôi phục DOM, localStorage, sessionStorage.
window.E2ESW = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  // Chốt an toàn (rule.md §12): chỉ chạy khi trang đang là dữ liệu thử của loadDemo()
  if (!Object.values(S.ev || {}).some(L => (L || []).some(e => e && e.demo))) return { pass: 0, total: 1, fail: [{ id: "W0", pass: false, info: "Trang không phải dữ liệu thử: chạy loadDemo() trước" }] };
  // tick() của app ghi bản tự lưu trong ngày (lc2_bk_*) bất kỳ lúc nào: ghi trước khi chụp để W9.1 không lệch vì việc của app
  if (typeof snapshotDaily === "function") snapshotDaily();
  const lsAll = st => { const o = {}; for (let i = 0; i < st.length; i++) { const k = st.key(i); o[k] = st.getItem(k); } return o; };
  const lsBefore = lsAll(localStorage), ssBefore = lsAll(sessionStorage), sBefore = JSON.stringify(S);
  const chip0 = document.getElementById("netChip"), hidden0 = chip0 ? chip0.hidden : null;
  const errs = [], onErr = e => errs.push(String(e.message || e));
  addEventListener("error", onErr);
  const sw = navigator.serviceWorker;
  const send = data => { if (sw) sw.dispatchEvent(new MessageEvent("message", { data })); };
  const chip = () => document.getElementById("netChip");
  const shown = () => { const c = chip(); return !!c && !c.hidden && getComputedStyle(c).display !== "none" && c.getBoundingClientRect().width > 0; };
  try {
    ok("W1.1 #netChip có trong DOM, mặc định ẩn", !!chip0 && chip0.hidden === true && !shown(), chip0 ? chip0.outerHTML : "không có");
    ok("W1.0 có navigator.serviceWorker để giả lập", !!sw, typeof sw);

    send({ lc: "net", ok: false });
    const c = chip();
    ok("W1.2 {lc:net,ok:false} → chip hiện, chữ 'Bản đã lưu', role=status, có giải thích", shown() && /Bản đã lưu/.test(c.textContent) && c.getAttribute("role") === "status" && /máy chủ/.test(c.getAttribute("title") || "") && /máy chủ/.test(c.getAttribute("aria-label") || ""), c && c.outerHTML);

    // W1.6: cỡ chữ nằm trong thang 8 bậc (CHANGELOG v0.7.1: 11/12/13/14/16/18/22/28)
    const fs = c ? parseFloat(getComputedStyle(c).fontSize) : 0;
    ok("W1.6 cỡ chữ chip trong thang 8 bậc", [11, 12, 13, 14, 16, 18, 22, 28].includes(fs), fs);

    // W1.7: cùng hàng tiêu đề, không tràn ngang (ở độ rộng hiện tại; chạy cả 1440 và 390)
    const t = document.getElementById("pageTitle"), hdr = document.querySelector(".app-header");
    if (c && t && hdr) {
      const a = c.getBoundingClientRect(), b = t.getBoundingClientRect(), mid = a.top + a.height / 2;
      ok("W1.7 chip cùng hàng tiêu đề, không tràn (w=" + innerWidth + ")", mid > b.top && mid < b.bottom && a.left >= b.right && a.right <= hdr.getBoundingClientRect().right && hdr.scrollWidth <= hdr.clientWidth && document.documentElement.scrollWidth <= innerWidth, { chip: [a.left, a.top, a.right, a.bottom], title: [b.left, b.top, b.right, b.bottom], hdr: [hdr.scrollWidth, hdr.clientWidth], doc: [document.documentElement.scrollWidth, innerWidth] });
    } else ok("W1.7 chip cùng hàng tiêu đề, không tràn", false, "thiếu phần tử");

    // W1.4: tin nhắn lạ không đổi chip, không ném lỗi
    const before = c ? c.hidden : null, n0 = errs.length;
    ["skip-waiting", { lc: "x" }, null, "net", { lc: "net" }, { lc: "net", ok: "false" }, 42, undefined].forEach(send);
    await new Promise(r => setTimeout(r, 30));
    ok("W1.4 tin nhắn lạ không đổi chip và không ném lỗi", !!c && c.hidden === before && errs.length === n0, [c && c.hidden, errs.slice(n0)]);

    send({ lc: "net", ok: true });
    ok("W1.3 {lc:net,ok:true} → chip ẩn", !!c && c.hidden === true && !shown(), c && c.outerHTML);

    ok("W1.5 chip không phải vùng bấm", !!c && !/^(BUTTON|A|INPUT)$/.test(c.tagName) && !c.hasAttribute("onclick") && c.tabIndex < 0 && !c.closest("button, a"), c && c.outerHTML);

    // W1.8: trang không có SW (không controller): online/visibilitychange không lỗi, chip vẫn ẩn
    const n1 = errs.length;
    dispatchEvent(new Event("online")); document.dispatchEvent(new Event("visibilitychange"));
    await new Promise(r => setTimeout(r, 30));
    ok("W1.8 không có SW: không lỗi, chip ẩn", errs.length === n1 && !!c && c.hidden === true && (!sw || !sw.controller), [errs.slice(n1), sw && !!sw.controller]);
  } catch (e) { ok("W1.err", false, String(e && e.stack || e)); }
  finally {
    removeEventListener("error", onErr);
    if (chip() && hidden0 !== null) chip().hidden = hidden0;
  }
  const lA = lsAll(localStorage), sA = lsAll(sessionStorage);
  ok("W9.1 sau khi chạy: localStorage, sessionStorage, S như trước", JSON.stringify(lA) === JSON.stringify(lsBefore) && JSON.stringify(sA) === JSON.stringify(ssBefore) && JSON.stringify(S) === sBefore, [Object.keys(lA).length, Object.keys(lsBefore).length]);
  const pass = out.filter(x => x.pass).length;
  return { pass, total: out.length, fail: out.filter(x => !x.pass) };
};
