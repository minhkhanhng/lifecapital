// Gói 2 A8: sw.js networkFirst không trả trang lỗi khi cache có bản tốt. Chạy: node tests/sw/test_sw.js
const fs = require("fs"), vm = require("vm"), path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "..", "sw.js"), "utf8");
const results = [];
const check = (id, pass, info) => { results.push(pass); console.log((pass ? "ok   " : "FAIL ") + id + (pass ? "" : " :: " + JSON.stringify(info))); };

// Chạy một lần handler "fetch" với mạng và cache giả; trả phản hồi mà respondWith nhận.
async function run({ net, cached }) {
  const handlers = {};
  const sandbox = {
    self: { addEventListener: (t, h) => { handlers[t] = h; }, location: { origin: "https://app.test" }, clients: { claim() {} }, skipWaiting() {} },
    caches: { match: async () => cached, open: async () => ({ put: async () => {}, addAll: async () => {} }), keys: async () => [], delete: async () => true },
    fetch: async () => net,
    Response: { error: () => ({ error: true }) },
    URL, setTimeout, clearTimeout, console, Promise
  };
  vm.createContext(sandbox); vm.runInContext(src, sandbox);
  let p = null;
  handlers.fetch({ request: { method: "GET", mode: "navigate", url: "https://app.test/" }, respondWith: x => { p = x; } });
  if (!p) return "no-respondWith";
  return Promise.race([p, new Promise(r => setTimeout(() => r("timeout"), 1500))]);
}

(async () => {
  const bad = { ok: false, status: 500, clone() { return this; } };
  const good = { ok: true, status: 200, clone() { return this; } };
  const hit = { cached: true };
  let r = await run({ net: bad, cached: hit });
  check("SW8.1 mạng 500 + có cache: trả cache", r === hit, r);
  r = await run({ net: good, cached: hit });
  check("SW8.2 mạng ok: trả phản hồi mạng", r === good, r);
  r = await run({ net: bad, cached: undefined });
  check("SW8.3 mạng 500 + không cache: trả phản hồi 500 như cũ", r === bad, r);
  const n = results.filter(Boolean).length;
  console.log("OK " + n + "/" + results.length);
  process.exit(n === results.length ? 0 : 1);
})();
