// Gói 2 A8 + Gói 5 (sw-mo-nhanh): giả lập service worker trong Node. Chạy: node tests/sw/test_sw.js
const fs = require("fs"), vm = require("vm"), path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "..", "sw.js"), "utf8");
const results = [];
const check = (id, pass, info) => { results.push(pass); console.log((pass ? "ok   " : "FAIL ") + id + (pass ? "" : " :: " + JSON.stringify(info))); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const race = (p, ms) => Promise.race([p, sleep(ms).then(() => "timeout")]);

// Môi trường SW giả: net = phản hồi | "hang" (không bao giờ xong) | "err" (lỗi mạng); cached = bản lưu của "./".
function env({ net, cached, matchThrows = false, clientThrows = false, fastTimers = false }) {
  const handlers = {}, store = new Map(), posted = [], fetches = [], waits = [];
  if (cached) store.set("./", cached);
  const clock = { t: 1000000 };
  const client = { postMessage: m => { if (clientThrows) throw new Error("client gone"); posted.push(m); } };
  const keyOf = k => typeof k === "string" ? k : k.url;
  const sandbox = {
    self: { addEventListener: (t, h) => { handlers[t] = h; }, location: { origin: "https://app.test" }, clients: { claim() {}, matchAll: async () => [client] }, skipWaiting() {} },
    caches: {
      match: async k => { if (matchThrows) throw new Error("cache hỏng"); return store.get(keyOf(k)); },
      open: async () => ({ put: async (k, v) => { store.set(keyOf(k), v); }, addAll: async () => {} }),
      keys: async () => [], delete: async () => true
    },
    fetch: (u, o) => { fetches.push([u, o]); const n = typeof net === "function" ? net() : net; return n === "hang" ? new Promise(() => {}) : n === "err" ? Promise.reject(new TypeError("Failed to fetch")) : Promise.resolve(n); },
    Response: { error: () => ({ error: true }) },
    Date: { now: () => clock.t },
    URL, setTimeout: fastTimers ? (f, ms) => setTimeout(f, ms >= 5000 ? 30 : ms) : setTimeout, clearTimeout, console, Promise
  };
  vm.createContext(sandbox); vm.runInContext(src, sandbox);
  const fire = (url, mode = "navigate") => {
    let p = null;
    handlers.fetch({ request: { method: "GET", mode, url }, respondWith: x => { p = x; }, waitUntil: x => { waits.push(x); } });
    return p;
  };
  const nav = () => { const p = fire("https://app.test/"); return p ? race(p, 1500) : Promise.resolve("no-respondWith"); };
  const msg = data => handlers.message({ data, source: client, waitUntil: x => { waits.push(x); } });
  const settle = async () => { for (let i = 0; i < 5; i++) { await race(Promise.all(waits.slice()), 500); await sleep(5); } };
  return { sandbox, store, posted, fetches, waits, clock, fire, nav, msg, settle };
}

(async () => {
  const bad = { ok: false, status: 500, clone() { return this; } };
  const good = { ok: true, status: 200, clone() { return this; } };
  const hit = { cached: true };
  const netMsgs = (posted, ok) => posted.filter(m => m && m.lc === "net" && m.ok === ok).length;

  // ---- SW8 (gói 2): giữ ý nghĩa
  let E = env({ net: bad, cached: hit }), r = await E.nav(); await E.settle();
  check("SW8.1 mạng 500 + có cache: trả cache, cache không bị ghi đè bằng trang lỗi", r === hit && E.store.get("./") === hit, [r, E.store.get("./")]);
  E = env({ net: good, cached: undefined }); r = await E.nav(); await E.settle();
  check("SW8.2 mạng ok: trả phản hồi mạng (chưa có bản lưu) và lưu nó", r === good && E.store.get("./") === good, r);
  E = env({ net: bad, cached: undefined }); r = await E.nav();
  check("SW8.3 mạng 500 + không cache: trả phản hồi 500 như cũ", r === bad, r);

  // ---- SW9 (gói 5): bản lưu trước, làm mới nền
  E = env({ net: "hang", cached: hit });
  const t0 = Date.now(); const p = E.fire("https://app.test/"); r = p ? await race(p, 100) : "no-respondWith";
  check("SW9.1 có bản lưu + mạng treo: trả bản lưu < 100 ms", r === hit, [r, Date.now() - t0]);

  const fresh = { ok: true, status: 200, fresh: true, clone() { return this; } };
  E = env({ net: fresh, cached: hit }); r = await E.nav(); await E.settle();
  check("SW9.2 có bản lưu + mạng 200: trả ngay bản cũ, sau waitUntil cache ./ là bản mới", r === hit && E.store.get("./") === fresh && E.waits.length > 0, [r, E.store.get("./"), E.waits.length]);

  E = env({ net: "err", cached: hit }); r = await E.nav(); await E.settle();
  check("SW9.3 có bản lưu + mạng lỗi: trả bản lưu, báo {lc:net,ok:false}", r === hit && netMsgs(E.posted, false) === 1 && E.store.get("./") === hit, [r, E.posted]);

  E = env({ net: good, cached: hit }); r = await E.nav(); await E.settle();
  check("SW9.4 mạng 200: báo {lc:net,ok:true}", netMsgs(E.posted, true) === 1 && netMsgs(E.posted, false) === 0, E.posted);

  E = env({ net: bad, cached: undefined }); r = await E.nav();
  const r2 = await env({ net: "err", cached: undefined }).nav();
  check("SW9.5 không bản lưu: 500 trả phản hồi 500; mạng lỗi trả Response.error()", r === bad && r2 && r2.error === true, [r, r2]);

  E = env({ net: good, cached: hit });
  E.msg("net?"); E.msg("net?"); await E.settle();
  const f1 = E.fetches.length, m1 = netMsgs(E.posted, true);
  E.msg("net?"); await E.settle();
  const f2 = E.fetches.length, m2 = netMsgs(E.posted, true);
  E.clock.t += 31000; E.msg("net?"); await E.settle();
  check("SW9.6 net?: revalidate một lần, tin trong 30 s trả ngay không fetch lại, quá 30 s fetch lại", f1 === 1 && m1 >= 1 && f2 === 1 && m2 === m1 + 1 && E.fetches.length === 2, [f1, m1, f2, m2, E.fetches.length]);

  let online = false;
  E = env({ net: () => online ? good : "err", cached: hit });
  r = await E.nav(); await E.settle();
  online = true; E.msg("net?"); await E.settle(); // sự kiện online trong 30 s sau lần lỗi
  check("SW9.6c mạng về trong 30 s sau lần lỗi: net? hỏi lại máy chủ và báo ok:true", E.fetches.length === 2 && netMsgs(E.posted, true) === 1, [E.fetches.length, E.posted]);

  E = env({ net: "hang", cached: hit });
  E.fire("https://app.test/"); E.msg("net?"); E.fire("https://app.test/"); await sleep(20);
  check("SW9.6b điều hướng + net? cùng lúc: không chạy chồng (1 fetch)", E.fetches.length === 1, E.fetches.length);

  const core = vm.runInContext("CORE", env({ net: good }).sandbox);
  check("SW9.7 CORE bỏ icon-512, icon-maskable-512; vẫn có ./, manifest.json, icon-192.png", !core.includes("icon-512.png") && !core.includes("icon-maskable-512.png") && ["./", "manifest.json", "icon-192.png"].every(x => core.includes(x)), core);

  E = env({ net: good, cached: hit });
  const pa = E.fire("https://app.test/api/ai_plan", "cors"), pn = E.fire("https://app.test/api/x");
  check("SW9.8 /api/* không bị chặn (không respondWith, không fetch)", pa === null && pn === null && E.fetches.length === 0, [pa, pn, E.fetches.length]);

  E = env({ net: good, cached: hit, matchThrows: true }); r = await E.nav();
  check("SW9.9 cache hỏng (match ném lỗi): rơi về chờ mạng, không trang trắng", r === good, r);

  E = env({ net: "err", cached: hit, clientThrows: true });
  let unhandled = 0; const onU = () => { unhandled++; }; process.on("unhandledRejection", onU);
  r = await E.nav(); await E.settle(); E.msg("net?"); await E.settle(); await sleep(20);
  process.off("unhandledRejection", onU);
  check("SW9.10 client đã đóng (postMessage ném lỗi): vẫn trả bản lưu, không lỗi treo", r === hit && unhandled === 0, [r, unhandled]);

  E = env({ net: good, cached: hit });
  let threw = null; try { E.msg(null); E.msg({ lc: "x" }); E.msg("abc"); E.msg(42); } catch (e) { threw = String(e); }
  await E.settle();
  check("SW9.11 tin nhắn lạ bị bỏ qua (không ném, không fetch)", threw === null && E.fetches.length === 0, [threw, E.fetches.length]);

  // ---- SW10 (review gói 5): chỉ trang chính dùng bản lưu; không lưu phản hồi redirect; hạn chót khi mạng treo
  E = env({ net: good, cached: hit });
  const pm = E.fire("https://app.test/tests/merge-tests.html"), pi = E.fire("https://app.test/index.html"), pr = E.fire("https://app.test/");
  const ri = pi ? await race(pi, 200) : "no-respondWith", rr = pr ? await race(pr, 200) : "no-respondWith";
  check("SW10.1 điều hướng tới HTML phụ không bị chặn (không respondWith); / và /index.html dùng bản lưu", pm === null && ri === hit && rr === hit, [pm, ri, rr]);

  const redir = { ok: true, status: 200, redirected: true, type: "basic", clone() { return this; } };
  E = env({ net: redir, cached: hit }); r = await E.nav(); await E.settle();
  check("SW10.2 làm mới nền nhận phản hồi redirect: không ghi đè bản lưu, báo ok:false", r === hit && E.store.get("./") === hit && netMsgs(E.posted, false) === 1, [E.store.get("./") === hit, E.posted]);

  const cors = { ok: true, status: 200, redirected: false, type: "cors", clone() { return this; } };
  E = env({ net: cors, cached: hit }); r = await E.nav(); await E.settle();
  check("SW10.3 phản hồi không phải 'basic' (cors/opaque) không được lưu làm trang", E.store.get("./") === hit, E.store.get("./"));

  const basic = { ok: true, status: 200, redirected: false, type: "basic", fresh: true, clone() { return this; } };
  E = env({ net: basic, cached: hit }); r = await E.nav(); await E.settle();
  check("SW10.4 phản hồi basic hợp lệ vẫn được lưu", E.store.get("./") === basic && netMsgs(E.posted, true) === 1, [E.store.get("./"), E.posted]);

  E = env({ net: "hang", cached: hit, fastTimers: true }); r = await E.nav(); await sleep(150); await E.settle();
  check("SW10.5 mạng treo: làm mới nền có hạn chót, báo ok:false và nhả khóa", r === hit && netMsgs(E.posted, false) === 1, [r, E.posted]);
  E.msg("net?"); await sleep(150); await E.settle();
  check("SW10.6 sau hạn chót, 'net?' hỏi lại được (không kẹt lời hứa cũ)", E.fetches.length === 2, E.fetches.length);

  E = env({ net: good, cached: hit }); E.msg("net?"); await E.settle();
  const fa = E.fetches.length; E.msg("net!"); await E.settle();
  check("SW10.7 'net!' (online/offline/quay lại tab) luôn hỏi lại máy chủ dù lần trước thông còn mới", fa === 1 && E.fetches.length === 2, [fa, E.fetches.length]);

  const n = results.filter(Boolean).length;
  console.log("OK " + n + "/" + results.length);
  process.exit(n === results.length ? 0 : 1);
})();
