// Gói 2 (dong-bo-an-toan): A2 cloudKeep, A3 nhập Gộp theo id, A4 wipeLocal, A7 save(). Chạy sau loadDemo() trên trang dữ liệu thử.
// Test chụp lại lc2/lc2_mine và các khóa nó đụng tới, khôi phục khi xong; không để dữ liệu lại.
window.E2ESYNC = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const len = a => (a || []).length;
  const lsGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const snapKeys = ks => ks.map(k => [k, lsGet(k)]);
  const restoreKeys = sn => sn.forEach(([k, v]) => { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); });
  const origSet = Storage.prototype.setItem;
  // Chụp TOÀN BỘ localStorage và S (bản sao sâu) để trả nguyên trạng khi xong
  const lsAll = () => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; };
  const lsBefore = lsAll(), sBefore = JSON.stringify(S);
  const ssBefore = { t: sessionStorage.getItem("gcal_token"), e: sessionStorage.getItem("gcal_token_exp") };
  const restoreAll = () => {
    Storage.prototype.setItem = origSet;
    ["gcal_token", "gcal_token_exp"].forEach((k, i) => { const v = i ? ssBefore.e : ssBefore.t; if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); });
    Object.keys(lsAll()).forEach(k => { if (!(k in lsBefore)) localStorage.removeItem(k); });
    Object.keys(lsBefore).forEach(k => { if (localStorage.getItem(k) !== lsBefore[k]) localStorage.setItem(k, lsBefore[k]); });
    S = JSON.parse(sBefore); lastRaw = lsGet("lc2"); saveFailed = false; draw(true);
  };

  // ---- A2: cloudKeep không để lc_sync mồ côi khi ghi base lỗi
  const syncKeys = snapKeys(["lc_sync", "lc_sync_base"]);
  try {
    localStorage.removeItem("lc_sync"); localStorage.removeItem("lc_sync_base");
    Storage.prototype.setItem = function (k, v) { if (k === "lc_sync_base") throw new DOMException("q", "QuotaExceededError"); return origSet.call(this, k, v); };
    const w = console.warn; let warned = 0; console.warn = (...a) => { warned++; };
    try { cloudKeep({ uid: "u", rev: 7 }, "x"); } finally { console.warn = w; Storage.prototype.setItem = origSet; }
    ok("S2.1 ghi base lỗi: không còn lc_sync mồ côi", cloudMeta() === null && cloudBaseRaw() === null, [lsGet("lc_sync"), lsGet("lc_sync_base")]);
    ok("S2.1b ghi base lỗi: có console.warn", warned === 1, warned);
    localStorage.removeItem("lc_sync"); localStorage.removeItem("lc_sync_base");
    cloudKeep({ uid: "u", rev: 7 }, "x");
    // S2.3: ghi meta lỗi thì giữ nguyên meta cũ và base cũ (đang nhất quán)
    localStorage.setItem("lc_sync", JSON.stringify({ uid: "u", rev: 3 })); localStorage.setItem("lc_sync_base", "old");
    Storage.prototype.setItem = function (k, v) { if (k === "lc_sync") throw new DOMException("q", "QuotaExceededError"); return origSet.call(this, k, v); };
    const w2 = console.warn; console.warn = () => {};
    try { cloudKeep({ uid: "u", rev: 7 }, "new"); } finally { console.warn = w2; Storage.prototype.setItem = origSet; }
    ok("S2.3 ghi meta lỗi: giữ meta rev 3 và base old", cloudMeta() && cloudMeta().rev === 3 && cloudBaseRaw() === "old", [lsGet("lc_sync"), lsGet("lc_sync_base")]);
    localStorage.removeItem("lc_sync"); localStorage.removeItem("lc_sync_base");
    cloudKeep({ uid: "u", rev: 7 }, "x");
    ok("S2.2 ghi thành công: rev 7 và base x", cloudMeta() && cloudMeta().rev === 7 && cloudBaseRaw() === "x", [lsGet("lc_sync"), lsGet("lc_sync_base")]);
  } catch (e) { ok("S2.err", false, String(e)); }
  finally { Storage.prototype.setItem = origSet; restoreKeys(syncKeys); }

  // ---- A3: nhập JSON Gộp khử trùng theo id, rồi theo nội dung (sg) như cũ
  const clickAsk = async a => { const b = document.querySelector('#askActs [data-a="' + a + '"]'); if (b) b.click(); await sleep(200); };
  const doImport = async data => {
    const snap = JSON.stringify({ app: "life-capital", v: 1, data });
    const modeEl = document.getElementById("importModeSelect"); if (modeEl) modeEl.value = "merge";
    importData({ files: [new File([snap], "b.json")], value: "" });
    await sleep(300); await clickAsk("ok"); await sleep(400); // hộp "Gộp dữ liệu?" hỏi xác nhận
  };
  try {
    const c = S.caps[0].k, D1 = "2031-01-05", D2 = "2031-01-06", D3 = "2031-01-07";
    const evt = (id, t) => ({ id, t, c, m: "u", h: 1, s: "09:00" });
    S.ev[D1] = [evt("e1", "Họp nhóm (đã sửa)")];
    S.ev[D2] = [evt("a1", "Việc giống nhau")];
    S.ev[D3] = [evt("b1", "Việc Y")];
    const theirs = cleanState({ ...JSON.parse(JSON.stringify(S)), ev: { [D1]: [evt("e1", "Họp nhóm")], [D2]: [evt("a2", "Việc giống nhau")], [D3]: [evt("b2", "Việc Z")] } });
    await doImport(theirs);
    ok("S3.1 cùng id, nội dung đã sửa: không thêm lại", len(S.ev[D1]) === 1 && S.ev[D1][0].t === "Họp nhóm (đã sửa)", (S.ev[D1] || []).map(e => e.id + ":" + e.t));
    ok("S3.2a khác id, cùng nội dung: vẫn 1", len(S.ev[D2]) === 1, (S.ev[D2] || []).map(e => e.id));
    ok("S3.2b khác id, khác nội dung: 2", len(S.ev[D3]) === 2, (S.ev[D3] || []).map(e => e.id));
  } catch (e) { ok("S3.err", false, String(e)); }
  finally { restoreAll(); }

  // ---- A4: wipeLocal xóa cả token Google và cờ liên quan
  const gKeys = snapKeys(["gcal_token", "gcal_token_exp", "gcal_linked", "lc_gx_seen"]);
  try {
    sessionStorage.setItem("gcal_token", "tok"); sessionStorage.setItem("gcal_token_exp", "9999999999999");
    localStorage.setItem("gcal_linked", "1"); localStorage.setItem("lc_gx_seen", "{}");
    wipeLocal();
    ok("S4.1 wipeLocal xóa token, hạn, cờ liên kết, lc_gx_seen", ["gcal_token", "gcal_token_exp", "gcal_linked", "lc_gx_seen"].every(k => lsGet(k) === null) && sessionStorage.getItem("gcal_token") === null && sessionStorage.getItem("gcal_token_exp") === null, snapKeys(["gcal_token", "gcal_token_exp", "gcal_linked", "lc_gx_seen"]));
    ok("S4.2 wipeLocal vẫn đặt lại dữ liệu", len(S.tasks) === 0 && Object.keys(S.ev).length === 0, [len(S.tasks), Object.keys(S.ev).length]);
  } catch (e) { ok("S4.err", false, String(e)); }
  finally { restoreAll(); }

  // ---- A7: save() báo đúng nguyên nhân (lỗi lập trình khác lỗi hết dung lượng)
  const alertTxt = () => { const el = document.getElementById("saveAlert"); return el && !el.hidden ? el.textContent : ""; };
  const origStamp = stampEdits, origErr = console.error;
  try {
    let errCalls = 0; console.error = () => { errCalls++; };
    stampEdits = () => { throw new TypeError("x"); };
    try { save(); } finally { stampEdits = origStamp; console.error = origErr; }
    const t1 = alertTxt();
    ok("S7.1a lỗi lập trình: console.error được gọi", errCalls === 1, errCalls);
    ok("S7.1b lỗi lập trình: cảnh báo bật, không nói 'bộ nhớ'", t1 !== "" && !/bộ nhớ/i.test(t1), t1);
    saveFailed = false; renderSaveAlert();
    console.error = () => {};
    Storage.prototype.setItem = function () { throw new DOMException("q", "QuotaExceededError"); };
    try { save(); } finally { Storage.prototype.setItem = origSet; console.error = origErr; }
    const t2 = alertTxt();
    ok("S7.2 hết dung lượng: cảnh báo bật và nói 'bộ nhớ'", t2 !== "" && /bộ nhớ/i.test(t2), t2);
  } catch (e) { ok("S7.err", false, String(e)); }
  finally { stampEdits = origStamp; console.error = origErr; Storage.prototype.setItem = origSet; saveFailed = false; renderSaveAlert(); }

  restoreAll();
  const lsAfter = lsAll();
  ok("S9.1 sau khi chạy: tập khóa localStorage và lc2 như trước", JSON.stringify(Object.keys(lsAfter).sort()) === JSON.stringify(Object.keys(lsBefore).sort()) && lsAfter.lc2 === lsBefore.lc2, [Object.keys(lsAfter).length, Object.keys(lsBefore).length]);
  ok("S9.2 sau khi chạy: mọi giá trị khóa như trước", Object.keys(lsBefore).every(k => lsAfter[k] === lsBefore[k]), Object.keys(lsBefore).filter(k => lsAfter[k] !== lsBefore[k]));
  const pass = out.filter(x => x.pass).length;
  return { pass, total: out.length, fail: out.filter(x => !x.pass) };
};
