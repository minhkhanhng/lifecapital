// Gói 1b: importData chế độ Gộp không cắt secs/ms/ups của dự án đã có. Chạy sau loadDemo() trên trang dữ liệu thử.
// importData gọi save(): test chụp lại lc2/lc2_mine trong localStorage và khôi phục cả S.projects lẫn hai khóa này khi xong.
window.E2EIMP = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const len = a => (a || []).length;
  const pad = (i, n) => String(i).padStart(n, "0");
  const dd = i => "2024-01-" + pad(1 + (i % 28), 2);
  const mkSecs = (p, n) => Array.from({ length: n }, (_, i) => ({ id: p + i, n: "Phần " + p + i }));
  const mkMs = (p, n) => Array.from({ length: n }, (_, i) => ({ id: p + i, n: "Mốc " + p + i, d: dd(i) }));
  const mkUps = (p, n, off) => Array.from({ length: n }, (_, i) => ({ id: p + i, d: "2025-" + pad(1 + Math.floor((i + off) / 28), 2) + "-" + pad(1 + ((i + off) % 28), 2), hs: "ok", note: "" }));
  const proj = (id, f) => ({ id, n: "Dự án " + id, col: PJ_COLORS[0], st: "run", pr: "m", sd: tk, caps: [], ...f });
  const orig = S.projects, keep = ["lc2", "lc2_mine"].map(k => [k, localStorage.getItem(k)]);
  const clickAsk = async a => { const b = document.querySelector('#askActs [data-a="' + a + '"]'); if (b) b.click(); await sleep(200); };
  const doImport = async data => {
    const snap = JSON.stringify({ app: "life-capital", v: 1, data });
    const modeEl = document.getElementById("importModeSelect"); if (modeEl) modeEl.value = "merge";
    importData({ files: [new File([snap], "b.json")], value: "" });
    await sleep(300); await clickAsk("ok"); await sleep(400); // hộp "Gộp dữ liệu?" hỏi xác nhận
  };
  try {
    S.projects = [proj("pimp", { secs: mkSecs("a", 20), ms: mkMs("a", 50), ups: mkUps("a", 30, 0) })];
    const full = JSON.parse(JSON.stringify(S));
    const theirs = cleanState({ ...full, projects: [
      proj("pimp", { secs: [...mkSecs("a", 1), ...mkSecs("b", 5)], ms: mkMs("b", 5), ups: mkUps("b", 5, 40) }),
      proj("pnew", { secs: mkSecs("n", 3), ms: mkMs("n", 2), ups: mkUps("n", 2, 0) })
    ] });
    await doImport(theirs);
    const x = S.projects.find(p => p.id === "pimp") || {};
    ok("I1.1 secs 20 + 5 mới = 25", len(x.secs) === 25, len(x.secs));
    ok("I1.2 ms 50 + 5 mới = 55", len(x.ms) === 55, len(x.ms));
    ok("I1.3 ups 30 + 5 mới = 35, mới nhất trước", len(x.ups) === 35 && x.ups.every((u, i) => !i || x.ups[i - 1].d >= u.d), [len(x.ups), (x.ups || []).map(u => u.d).join()]);
    ok("I1.4 id trùng không nhân đôi", len((x.secs || []).filter(s => s.id === "a0")) === 1 && x.secs.slice(0, 20).every((s, i) => s.id === "a" + i), len(x.secs));
    const y = S.projects.find(p => p.id === "pnew") || {};
    ok("I1.5 dự án chỉ có trong tệp được thêm đủ", len(y.secs) === 3 && len(y.ms) === 2 && len(y.ups) === 2, [len(y.secs), len(y.ms), len(y.ups)]);
  } catch (e) { ok("I1.err", false, String(e)); }
  finally { S.projects = orig; keep.forEach(([k, v]) => { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); }); }
  const pass = out.filter(x => x.pass).length;
  return { pass, total: out.length, fail: out.filter(x => !x.pass) };
};
