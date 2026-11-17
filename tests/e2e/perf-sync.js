// Gói 6 (dong-bo-nhe): bộ ĐO (không đạt/trượt) chi phí đồng bộ khi đã đăng nhập và vẽ Cài đặt, ở ~11k hoạt động (~1 MB).
// Chạy sau loadDemo() trên trang dữ liệu thử: `await PERFSYNC()` (gọi thẳng, có thể lâu hơn 40 s của __run).
// sb, sbUser giả; không gọi Supabase thật. Khôi phục S, localStorage, sessionStorage, sb, sbUser, cloud và mọi hàm đã bọc.
// Số là trung vị 5 lần (performance.now()); "canon" = số lần gọi canonState, "req" = số request tới sb giả.
//
// SỐ ĐO (Chromium pane Mac 1440×900, 10 972 hoạt động, lc2 1 028 194 ký tự; canonState ~50 ms, JSON.stringify ~4,6 ms):
//                         TRƯỚC gói 6                      SAU gói 6
//   tick() vòng 60 s      247 ms ngay + 607 ms cả vòng,    2,5 ms, 0 canon, 0 req (đang ok, < 5 phút)
//                         3 canon, 1 req
//   tick(true) focus      như dòng trên                    12 ms ngay + 44 ms cả vòng, 0 canon, 1 req
//   cloudPendingCount()   211 ms, 1 canon                  24 ms, 0 canon
//   cloudSync() không đổi 400 ms, 2 canon, 1 req           28 ms, 0 canon, 1 req
//   save() sau một sửa    165 ms, 1 canon                  139 ms, 1 canon
//   renderSettingsModal   39 ms, 7 JSON.parse (7 bản)      1,1 ms, 0 JSON.parse (lần đầu vẫn 40 ms, 8 parse)
window.PERFSYNC = async function (opt) {
  opt = opt || {};
  const RUNS = opt.runs || 5;
  if (!Object.values(S.ev || {}).some(L => (L || []).some(e => e && e.demo))) return { err: "Trang không phải dữ liệu thử: chạy loadDemo() trước" };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const med = a => { const b = [...a].sort((x, y) => x - y); return Math.round(b[b.length >> 1] * 10) / 10; };
  const lsAll = st => { const o = {}; for (let i = 0; i < st.length; i++) { const k = st.key(i); o[k] = st.getItem(k); } return o; };
  const putAll = (st, snap) => { Object.keys(lsAll(st)).forEach(k => { if (!(k in snap)) st.removeItem(k); }); Object.keys(snap).forEach(k => { if (st.getItem(k) !== snap[k]) st.setItem(k, snap[k]); }); };
  const lsBefore = lsAll(localStorage), ssBefore = lsAll(sessionStorage), sBefore = JSON.stringify(S);
  const sbBefore = sb, userBefore = sbUser, cloudBefore = { ...cloud }, canonOrig = canonState, parseOrig = JSON.parse;
  const res = {};
  let canonN = 0;
  canonState = function (st) { canonN++; return canonOrig(st); };
  const srv = { rev: 0, data: null };
  const calls = { head: 0, full: 0, push: 0 };
  const req = () => calls.head + calls.full + calls.push;
  const fakeSb = {
    from() {
      return { select() { return { eq() { return {
        maybeSingle: async () => { calls.head++; return { data: srv.rev ? { rev: srv.rev } : null, error: null }; },
        single: async () => { calls.full++; return { data: { rev: srv.rev, data: JSON.parse(JSON.stringify(srv.data)) }, error: null }; }
      }; } }; } };
    },
    rpc: async (name, a) => { calls.push++; if (a.p_base !== srv.rev) return { data: -1, error: null }; srv.rev++; srv.data = a.p_data; return { data: srv.rev, error: null }; }
  };
  const settle = async () => { await sleep(0); for (let i = 0; i < 200 && cloudBusy; i++) await sleep(5); clearTimeout(cloudT); };
  try {
    // ---- Dữ liệu lớn: 3 năm × 10 hoạt động/ngày, có id/mt hợp lệ
    sbUser = null;
    const caps = S.caps.map(c => c.k), d0 = new Date();
    for (let i = 0; i < 365 * 3; i++) {
      const d = new Date(d0.getFullYear(), d0.getMonth(), d0.getDate() - i - 1), k = ky(d);
      const L = S.ev[k] = S.ev[k] || [];
      for (let j = 0; j < 10; j++) L.push({ id: "pf" + i.toString(36) + "_" + j, mt: 1700000000000 + i * 10 + j, t: "Hoạt động đo " + ((i * 7 + j) % 41), c: caps[(i + j) % caps.length], m: j % 3 ? "u" : "d", h: 1, s: pad(6 + j) + ":00" });
      L.sort(cmp);
    }
    save();
    res.events = Object.values(S.ev).flat().length;
    res.lc2Chars = (localStorage.getItem("lc2") || "").length;
    // ---- Đăng nhập giả, lc_sync/lc_sync_base nhất quán với trạng thái hiện tại
    sb = fakeSb; sbUser = { id: "perf-user" };
    const base0 = canonOrig(cloudView(S));
    srv.rev = 1; srv.data = JSON.parse(base0);
    cloudKeep({ uid: "perf-user", rev: 1 }, base0);
    cloudSet("ok");
    // Riêng từng phép đo: canonState + JSON.stringify
    { const t = []; for (let i = 0; i < RUNS; i++) { const a = performance.now(); canonOrig(cloudView(S)); t.push(performance.now() - a); } res.canonState_ms = med(t); }
    { const t = []; for (let i = 0; i < RUNS; i++) { const a = performance.now(); JSON.stringify(cloudView(S)); t.push(performance.now() - a); } res.stringify_ms = med(t); }
    // ---- tick() của vòng 60 s (đang "ok", vừa đồng bộ): phần chạy ngay + cả vòng đồng bộ nó kích
    { const t = [], tt = [], c = [], r = [];
      for (let i = 0; i < RUNS; i++) {
        cloudSet("ok"); await settle(); canonN = 0; const r0 = req();
        const a = performance.now(); tick(false); t.push(performance.now() - a);
        await settle(); tt.push(performance.now() - a); c.push(canonN); r.push(req() - r0);
      }
      res.tick = { sync_ms: med(t), total_ms: med(tt), canon: med(c), req: med(r) };
    }
    // ---- tick(true) (focus, visibilitychange): luôn hỏi máy chủ (mã trước gói 6: giống tick() ở trên)
    { const t = [], tt = [], c = [], r = [];
      for (let i = 0; i < RUNS; i++) {
        cloudSet("ok"); await settle(); canonN = 0; const r0 = req();
        const a = performance.now(); tick(true); t.push(performance.now() - a);
        await settle(); tt.push(performance.now() - a); c.push(canonN); r.push(req() - r0);
      }
      res.tickForce = { sync_ms: med(t), total_ms: med(tt), canon: med(c), req: med(r) };
    }
    // ---- cloudPendingCount() không đổi dữ liệu
    { const t = [], c = []; let n;
      for (let i = 0; i < RUNS; i++) { canonN = 0; const a = performance.now(); n = cloudPendingCount(); t.push(performance.now() - a); c.push(canonN); }
      res.pending = { ms: med(t), canon: med(c), n };
    }
    // ---- cloudSync() khi không đổi gì
    { const t = [], c = [], r = [];
      for (let i = 0; i < RUNS; i++) { await settle(); canonN = 0; const r0 = req(); const a = performance.now(); await cloudSync(); t.push(performance.now() - a); c.push(canonN); r.push(req() - r0); clearTimeout(cloudT); }
      res.cloudSync = { ms: med(t), canon: med(c), req: med(r), push: calls.push, st: cloud.st };
    }
    // ---- save() sau một lần sửa một hoạt động (đã đăng nhập: gồm cloudSoon → cloudSet("wait") → đếm chưa gửi)
    { const t = [], c = [], k = Object.keys(S.ev).sort()[5];
      for (let i = 0; i < RUNS; i++) {
        S.ev[k][0].t = "Sửa đo " + i; canonN = 0;
        const a = performance.now(); save(); t.push(performance.now() - a); c.push(canonN); clearTimeout(cloudT);
      }
      res.save = { ms: med(t), canon: med(c), n: cloud.n };
    }
    // ---- renderSettingsModal() với 7 bản lc2_bk_* cỡ lc2 (bỏ lc2_mine, lc_sync_base để vừa hạn mức)
    { await settle(); sbUser = null; cloudSet("off");
      try { localStorage.removeItem("lc2_mine"); localStorage.removeItem("lc_sync_base"); } catch (e) {}
      snapKeys().forEach(k => localStorage.removeItem(k));
      const raw = localStorage.getItem("lc2"); let made = 0;
      for (let i = 1; i <= 7; i++) { try { localStorage.setItem(SNAP + "2026-01-0" + i, raw); made++; } catch (e) { break; } }
      const t = [], p = []; let first = null;
      for (let i = 0; i < RUNS; i++) {
        let n = 0; JSON.parse = function (s, rv) { n++; return parseOrig.call(JSON, s, rv); };
        const a = performance.now();
        try { renderSettingsModal(); } finally { JSON.parse = parseOrig; }
        const ms = performance.now() - a; t.push(ms); p.push(n);
        if (!first) first = { ms: Math.round(ms * 10) / 10, parse: n };
      }
      res.settings = { snaps: made, first, ms: med(t), parse: med(p) };
    }
  } catch (e) { res.err = String(e && e.stack || e); }
  finally {
    JSON.parse = parseOrig; canonState = canonOrig;
    clearTimeout(cloudT); await sleep(0); for (let i = 0; i < 200 && cloudBusy; i++) await sleep(5); clearTimeout(cloudT);
    sb = sbBefore; sbUser = userBefore; Object.assign(cloud, cloudBefore);
    // bỏ khóa lớn trước để không vượt hạn mức khi trả lại
    Object.keys(lsAll(localStorage)).forEach(k => { if (!(k in lsBefore) || k === "lc2" || k === "lc2_mine") localStorage.removeItem(k); });
    putAll(localStorage, lsBefore); putAll(sessionStorage, ssBefore);
    S = JSON.parse(sBefore); lastRaw = localStorage.getItem("lc2"); stampRaw = undefined; saveFailed = false; renderCloud(); draw(true);
    res.restored = JSON.stringify(lsAll(localStorage)) === JSON.stringify(lsBefore) && JSON.stringify(S) === sBefore;
  }
  return res;
};
