// Gói 7 (csp-staging): B5 tự host supabase-js (E5.*) và B2 Content-Security-Policy (E2.*).
// Chạy sau loadDemo() trên trang tải từ `python3 tests/csp/serve.py <cổng>` (gắn header CSP lấy từ vercel.json).
// Không gọi Supabase/Google thật: chỉ nạp thư viện và createClient với URL/khóa giả (persistSession tắt).
// window.E2ECSP(prefix?) : prefix "E5" hoặc "E2" chỉ chạy nhóm đó (để ghi số đỏ từng task).
// Khôi phục S, localStorage, sessionStorage, tab, ảnh nền (IndexedDB), window.supabase/sbLibP, thẻ script/base/iframe đã thêm.
window.E2ECSP = async function (only) {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  const want = p => !only || only === p;
  if (!Object.values(S.ev || {}).some(L => (L || []).some(e => e && e.demo))) return { pass: 0, total: 1, fail: [{ id: "X0", pass: false, info: "Trang không phải dữ liệu thử: chạy loadDemo() trước" }] };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const lsAll = st => { const o = {}; for (let i = 0; i < st.length; i++) { const k = st.key(i); o[k] = st.getItem(k); } return o; };
  const putAll = (st, snap) => { Object.keys(lsAll(st)).forEach(k => { if (!(k in snap)) st.removeItem(k); }); Object.keys(snap).forEach(k => { if (st.getItem(k) !== snap[k]) st.setItem(k, snap[k]); }); };
  if (typeof snapshotDaily === "function") snapshotDaily();
  const lsBefore = lsAll(localStorage), ssBefore = lsAll(sessionStorage), sBefore = JSON.stringify(S), curBefore = cur;
  const supBefore = window.supabase, libPBefore = typeof sbLibP !== "undefined" ? sbLibP : undefined;
  const sbBefore = sb, sbLoadingBefore = sbLoading, loaderBefore = typeof sbLibLoad === "function" ? sbLibLoad : undefined;
  const claudeBefore = window.claude, printBefore = window.print;
  const bgBefore = await bgGet().catch(() => null);
  const scriptsBefore = new Set(document.querySelectorAll("script, base, iframe"));
  const viol = [], onViol = e => viol.push({ d: e.violatedDirective, u: e.blockedURI }); document.addEventListener("securitypolicyviolation", onViol);
  const vendorTags = () => [...document.querySelectorAll('script[src*="supabase-2.117.0"]')];
  const cleanTags = () => { document.querySelectorAll("script, base, iframe").forEach(n => { if (!scriptsBefore.has(n)) n.remove(); }); };
  const fakeOpts = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: "csp_fake" } };
  const fetchOrig = window.fetch, fetched = [];
  try {
    // ===================== B5 =====================
    if (want("E5")) {
      ok("E5.4a SB_LIB trỏ tệp vendor cùng nguồn", typeof SB_LIB === "string" && /^(\.\/|\/)?vendor\/supabase-2\.117\.0\.umd\.js$/.test(SB_LIB), typeof SB_LIB !== "undefined" ? SB_LIB : "không có");
      const txt = await (await fetchOrig.call(window, "/index.html?" + Date.now())).text();
      ok("E5.4b mã tải về không còn jsdelivr / import(", !/jsdelivr/.test(txt.replace(/^\s*\/\/.*$/gm, "")) && !/\bimport\(/.test(txt), 0);
      ok("E5.0 có hàm sbLibLoad", typeof sbLibLoad === "function", typeof sbLibLoad);
      // E5.3 (chạy trước khi nạp thật): đường dẫn hỏng -> từ chối, không để lại thẻ, thử lại được
      if (typeof sbLibLoad === "function") {
        window.supabase = undefined; sbLibP = null; cleanTags();
        let err = null; try { await sbLibLoad("vendor/khong-co-tep.js"); } catch (e) { err = e; }
        ok("E5.3a tệp không tải được: lời hứa bị từ chối, không để lại thẻ <script>", !!err && !document.querySelector('script[src*="khong-co-tep"]'), String(err));
        ok("E5.3b sau lỗi vẫn thử lại được (không giữ lời hứa hỏng)", sbLibP === null || sbLibP === undefined, sbLibP);
        // cloudLoad: nạp lỗi -> sbLoading về null, sb vẫn null (như bản ESM cũ)
        sb = null; sbLoading = null; const L = sbLibLoad; sbLibLoad = () => Promise.reject(new Error("mất mạng"));
        let e2 = null; try { await cloudLoad(); } catch (e) { e2 = e; }
        sbLibLoad = L;
        ok("E5.3c cloudLoad khi thư viện lỗi: ném lỗi, sbLoading đặt lại null để thử lại, sb vẫn null", !!e2 && sbLoading === null && sb === null, [String(e2), sbLoading, sb]);
        // E5.2: hai lần gọi đồng thời -> một thẻ script
        window.supabase = undefined; sbLibP = null; cleanTags();
        fetched.length = 0; window.fetch = function (u) { fetched.push(String(u && u.url || u)); return fetchOrig.apply(this, arguments); };
        const [a, b] = await Promise.all([sbLibLoad(), sbLibLoad()]);
        const c3 = await sbLibLoad();
        ok("E5.2 nạp ba lần (hai đồng thời): đúng một thẻ <script> vendor, cùng một hàm", vendorTags().length === 1 && a === b && b === c3, [vendorTags().length, a === b]);
        // E5.1
        ok("E5.1a sau nạp: window.supabase.createClient là hàm và sbLibLoad trả đúng hàm đó", typeof window.supabase === "object" && typeof window.supabase.createClient === "function" && a === window.supabase.createClient, typeof window.supabase);
        let cli = null, cerr = null; try { cli = a("https://csp-fake.invalid", "fake-key", fakeOpts); } catch (e) { cerr = e; }
        ok("E5.1b createClient (URL/khóa giả, cùng loại tuỳ chọn auth) tạo được client có auth, from, rpc, channel", !!cli && !!cli.auth && typeof cli.from === "function" && typeof cli.rpc === "function" && typeof cli.channel === "function", String(cerr));
        let pk = null; try { const c4 = a("https://csp-fake.invalid", "fake-key", { auth: { flowType: "pkce", storageKey: "csp_fake2", persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }); pk = typeof c4.auth.onAuthStateChange === "function" && typeof c4.auth.signInWithOAuth === "function" && typeof c4.auth.exchangeCodeForSession === "function"; } catch (e) { pk = String(e); }
        ok("E5.1c tuỳ chọn flowType pkce chấp nhận; có onAuthStateChange/signInWithOAuth/exchangeCodeForSession", pk === true, pk);
        await sleep(50);
        ok("E5.1d nạp thư viện và tạo client giả không gọi mạng Supabase", !fetched.some(u => /supabase\.co/.test(u)) && fetched.every(u => !/^https?:/.test(u) || u.startsWith(location.origin)), fetched);
      }
    }
    // ===================== B2 =====================
    if (want("E2")) {
      const head = await fetchOrig.call(window, location.href, { cache: "no-store" });
      const h = head.headers.get("content-security-policy") || "";
      ok("E2.0 trang có header Content-Security-Policy (chạy dưới serve.py)", h.length > 0 && /default-src 'self'/.test(h), h);
      viol.length = 0;
      const steps = [];
      const step = async (name, fn) => { const n0 = viol.length; try { await fn(); } catch (e) { viol.push({ d: "lỗi " + name, u: String(e) }); } await sleep(40); steps.push(name + ":" + (viol.length - n0)); };
      // tab bằng bấm thật vào nút có onclick inline
      await step("tab-click-inline", async () => { const b = document.querySelector('[onclick^="switchTab("]'); if (b) b.click(); });
      for (const t of ["ca", "hv", "pj", "hl", "su", "me", "set"]) await step("tab-" + t, async () => { switchTab(t); });
      await step("settings", async () => { openSettingsModal(); await sleep(30); renderSettingsModal(); closeSettingsModal(); });
      await step("popup-hoat-dong", async () => { switchTab("ca"); openEditor(tk); await sleep(30); closeEditor(); });
      await step("popup-thuoc", async () => { switchTab("hl"); hlMedOpen(); await sleep(60); closeHl(); });
      await step("popup-suckhoe-ghi", async () => { hlOpen(tk); await sleep(30); closeHl(); });
      await step("nhap-nhanh", async () => { switchTab("ca"); const i = $("nlpInput"); i.value = "+ csp thu viec"; await executeNLP(); });
      await step("nhap-nhanh-hoat-dong", async () => { const i = $("nlpInput"); i.value = "Chạy bộ 1h"; await executeNLP(); });
      await step("nen-anh-blob", async () => {
        const c = document.createElement("canvas"); c.width = 40; c.height = 30; const g = c.getContext("2d"); g.fillStyle = "#3a7"; g.fillRect(0, 0, 40, 30);
        const blob = await new Promise(r => c.toBlob(r, "image/png")); const f = new File([blob], "fake.png", { type: "image/png" });
        await chooseBg({ files: [f], value: "" }); await sleep(100);
        const root = getComputedStyle(document.documentElement).getPropertyValue("--bg-img");
        steps.push("bg-var:" + /blob:/.test(root));
        const bgi = new Image(); await new Promise(r => { bgi.onload = r; bgi.onerror = r; bgi.src = bgURL; }); steps.push("bg-img-load:" + (bgi.naturalWidth > 0));
      });
      await step("xuat-json", async () => { const got = []; window.claude = { use: async () => ({ save: async o => { got.push(o.filename); } }) }; await exportData("json"); await exportData("csv"); steps.push("export:" + got.length); });
      await step("blob-download-link", async () => { const u = URL.createObjectURL(new Blob(["x"], { type: "text/plain" })); const a = document.createElement("a"); a.href = u; a.download = "x.txt"; a.remove(); URL.revokeObjectURL(u); });
      await step("in-bao-cao", async () => { switchTab("hl"); let called = 0; window.print = () => { called++; }; hlRepPrint(); document.body.classList.remove("printing-rep"); steps.push("print-called:" + called); });
      ok("E2.1 chạy các luồng chính dưới CSP: 0 vi phạm securitypolicyviolation", viol.length === 0 && steps.filter(s => /^(bg-var|bg-img-load|export|print-called)/.test(s)).join() === "bg-var:true,bg-img-load:true,export:2,print-called:1", { viol, steps });
      const styled = document.querySelector("[style]"); const inl = styled ? styled.getAttribute("style") : "";
      ok("E2.1b style inline vẫn áp dụng (style-src 'unsafe-inline')", !!styled && viol.length === 0, [inl, viol]);
      // E2.2: nạp supabase-js dưới CSP
      viol.length = 0; window.supabase = undefined; sbLibP = null; cleanTags();
      let lib = null, lerr = null; try { lib = await sbLibLoad(); } catch (e) { lerr = e; }
      await sleep(50);
      ok("E2.2 nạp supabase-js vendor dưới CSP: nạp được, 0 vi phạm", typeof lib === "function" && viol.length === 0, [String(lerr), viol]);
      // E2.3: CSP thực sự chặn
      viol.length = 0; const sc = document.createElement("script"); sc.src = "https://csp-probe.invalid/x.js"; /* .invalid: không bao giờ ra mạng thật, kể cả khi chạy nhầm trên máy chủ không có CSP */ let loaded = false; sc.onload = () => { loaded = true; }; document.head.appendChild(sc);
      await sleep(300); sc.remove();
      ok("E2.3 script từ gốc lạ (csp-probe.invalid) bị CHẶN (có vi phạm script-src, không chạy)", viol.some(v => /^script-src/.test(v.d) && /csp-probe/.test(v.u)) && !loaded, { viol, loaded });
      viol.length = 0; let fres = "chưa"; try { await fetchOrig.call(window, "https://csp-probe.invalid/x"); fres = "ok"; } catch (e) { fres = "chặn"; }
      await sleep(50);
      ok("E2.4 fetch tới gốc lạ bị chặn bởi connect-src", viol.some(v => v.d === "connect-src" && /csp-probe/.test(v.u)) && fres === "chặn", { viol, fres });
      viol.length = 0; const bs = document.createElement("base"); bs.href = "https://csp-probe.invalid/"; document.head.appendChild(bs); const baseNow = document.baseURI; bs.remove(); await sleep(50);
      ok("E2.5 <base> trỏ gốc lạ bị chặn (base-uri), baseURI giữ nguyên", viol.some(v => v.d === "base-uri") && baseNow.startsWith(location.origin), { viol, baseNow });
      viol.length = 0; const fr = document.createElement("iframe"); fr.src = "https://csp-probe.invalid/"; document.body.appendChild(fr); await sleep(150); fr.remove();
      ok("E2.6 khung nhúng gốc lạ bị chặn (frame-src)", viol.some(v => /^frame-src|^child-src/.test(v.d)), viol);
      viol.length = 0; const ob = document.createElement("object"); ob.data = location.origin + "/icon-96.png"; ob.type = "image/png"; ob.style.cssText = "width:50px;height:50px;position:fixed;top:0;left:0"; document.body.appendChild(ob); ob.getBoundingClientRect(); for (let i = 0; i < 40 && !viol.some(v => v.d === "object-src"); i++) await sleep(100); ob.remove();
      ok("E2.7 <object> bị chặn (object-src 'none')", viol.some(v => v.d === "object-src"), viol);
    }
  } finally {
    document.removeEventListener("securitypolicyviolation", onViol);
    window.fetch = fetchOrig; window.print = printBefore; if (claudeBefore === undefined) delete window.claude; else window.claude = claudeBefore;
    cleanTags();
    window.supabase = supBefore; if (typeof sbLibP !== "undefined") sbLibP = libPBefore === undefined ? null : libPBefore;
    sb = sbBefore; sbLoading = sbLoadingBefore; if (loaderBefore) sbLibLoad = loaderBefore;
    try { document.body.classList.remove("printing-rep"); if (typeof closeHl === "function") closeHl(); } catch (e) {}
    try { await bgPut(bgBefore); applyBg(bgBefore); } catch (e) {}
    putAll(localStorage, lsBefore); putAll(sessionStorage, ssBefore);
    S = JSON.parse(sBefore); lastRaw = localStorage.getItem("lc2"); stampRaw = undefined; saveFailed = false; switchTab(curBefore); draw(true);
  }
  const same = (a, b) => JSON.stringify(Object.entries(a).sort()) === JSON.stringify(Object.entries(b).sort());
  const lA = lsAll(localStorage), sA = lsAll(sessionStorage);
  ok("X9.1 sau khi chạy: localStorage, sessionStorage, S, tab, window.supabase như trước", same(lA, lsBefore) && JSON.stringify(sA) === JSON.stringify(ssBefore) && JSON.stringify(S) === sBefore && cur === curBefore && window.supabase === supBefore && !document.querySelector("base") , { ls: same(lA, lsBefore), ss: JSON.stringify(sA) === JSON.stringify(ssBefore), S: JSON.stringify(S) === sBefore, cur: cur === curBefore, sup: window.supabase === supBefore, base: !!document.querySelector("base"), lsDiff: Object.keys(lA).filter(k => lA[k] !== lsBefore[k]).concat(Object.keys(lsBefore).filter(k => !(k in lA))) });
  const pass = out.filter(x => x.pass).length;
  return { pass, total: out.length, fail: out.filter(x => !x.pass) };
};
