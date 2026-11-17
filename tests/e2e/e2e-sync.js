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
  const mainKeys = snapKeys(["lc2", "lc2_mine"]);
  const origS = S, origEv = JSON.stringify(S.ev);

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
  finally { S.ev = JSON.parse(origEv); }

  restoreKeys(mainKeys);
  const pass = out.filter(x => x.pass).length;
  return { pass, total: out.length, fail: out.filter(x => !x.pass) };
};
