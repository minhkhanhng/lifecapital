// Gói 7 (csp-staging): kiểm tĩnh B5 (tự host supabase-js) và B2 (CSP). Chạy: node tests/csp/test_csp.js
// In "OK n/n", thoát mã khác 0 nếu có ca đỏ. Không gọi mạng.
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const root = path.join(__dirname, "..", "..");
const rd = f => fs.readFileSync(path.join(root, f), "utf8");
const results = [];
const check = (id, pass, info) => { results.push(!!pass); console.log((pass ? "ok   " : "FAIL ") + id + (pass ? "" : " :: " + JSON.stringify(info))); };

const VENDOR = "vendor/supabase-2.117.0.umd.js";
const VENDOR_SHA = "7b9e9c64109e15c338fa58c2bc77c32fb1c459bd587e22fc6b72cca80a388645";
// Gốc chỉ dùng để điều hướng (không fetch/nạp), không cần trong CSP
const NAV_OK = ["https://claude.ai"];
// sw.js chỉ so khớp tiền tố URL của jsDelivr để lưu cache; app không còn nạp từ đó
const SW_ONLY = ["https://cdn.jsdelivr.net"];

const html = rd("index.html"), sw = rd("sw.js");
const code = s => s.split("\n").filter(l => !/^\s*(\/\/|\*|\/\*)/.test(l)).join("\n").replace(/(^|\s)\/\/.*$/gm, "$1").replace(/<!--[\s\S]*?-->/g, "");
const htmlCode = code(html), swCode = code(sw);

let vj = null, vjErr = null;
try { vj = JSON.parse(rd("vercel.json")); } catch (e) { vjErr = String(e); }
const hdrs = {};
if (vj) for (const r of vj.headers || []) for (const h of r.headers || []) hdrs[h.key.toLowerCase()] = h.value;
const cspStr = hdrs["content-security-policy"] || "";
const csp = {};
cspStr.split(";").map(s => s.trim()).filter(Boolean).forEach(d => { const [n, ...v] = d.split(/\s+/); csp[n] = v; });

// ---- B5
check("C5.1a index.html: không còn cdn.jsdelivr.net ở mã chạy", !/jsdelivr/.test(htmlCode), htmlCode.match(/.*jsdelivr.*/g));
check("C5.1b SB_LIB trỏ " + VENDOR, new RegExp('const SB_LIB = "' + VENDOR.replace(/[.]/g, "\\.") + '"').test(html), (html.match(/const SB_LIB.*/) || [])[0]);
const vendor = fs.existsSync(path.join(root, VENDOR)) ? fs.readFileSync(path.join(root, VENDOR)) : null;
check("C5.2a vendor tồn tại, 217 874 byte", vendor && vendor.length === 217874, vendor && vendor.length);
check("C5.2b SHA-256 đúng", vendor && crypto.createHash("sha256").update(vendor).digest("hex") === VENDOR_SHA, vendor && crypto.createHash("sha256").update(vendor).digest("hex"));
const vs = vendor ? vendor.toString("utf8") : "";
check("C5.2c chứa 2.117.0 và createClient", vs.includes("2.117.0") && vs.includes("createClient"), 0);
check("C5.2d không có eval( / new Function(", !/\beval\(|new Function\(/.test(vs), 0);
check("C5.2e UMD gán biến toàn cục supabase", /^var supabase=/.test(vs), vs.slice(0, 30));
check("C5.3 sw.js: tệp cùng nguồn đi cacheFirst, vendor không bị chặn bởi nhánh trang/api",
  /url\.origin === self\.location\.origin \|\| url\.href\.startsWith\(CDN\)\)\s*\{\s*e\.respondWith\(cacheFirst\(req\)\)/.test(sw) && !/vendor/.test(swCode), 0);
check("C5.4 index.html không còn import( động", !/\bimport\(/.test(htmlCode), htmlCode.match(/.*\bimport\(.*/g));

// ---- B2
check("C2.7 vercel.json là JSON hợp lệ", vj && !vjErr, vjErr);
check("C2.1 vercel.json có header Content-Security-Policy", cspStr.length > 0, Object.keys(hdrs));
const eq = (n, v) => (csp[n] || []).join(" ") === v;
check("C2.2 đủ chỉ thị khóa", eq("default-src", "'self'") && eq("object-src", "'none'") && eq("base-uri", "'self'") && eq("frame-ancestors", "'none'") && eq("form-action", "'self'"), csp);
const src = n => csp[n] || [];
const lax = v => v === "https:" || v === "http:" || v === "*" || v === "data:" || /^\*\./.test(v) || v === "'unsafe-eval'" || /jsdelivr/.test(v);
check("C2.3 script-src: không https: trần, *, 'unsafe-eval', jsdelivr; có 'self'", src("script-src").includes("'self'") && !src("script-src").some(lax), src("script-src"));
const cs = src("connect-src");
check("C2.4 connect-src: Supabase https+wss, googleapis; không * / https: trần", cs.includes("https://bvuvgjiufpjsidyyigkb.supabase.co") && cs.includes("wss://bvuvgjiufpjsidyyigkb.supabase.co") && cs.includes("https://www.googleapis.com") && !cs.some(lax), cs);
const origins = s => [...new Set((s.match(/(?:https?|wss?):\/\/[a-zA-Z0-9.-]+/g) || []))];
const inCsp = o => Object.values(csp).flat().some(v => v === o || v.startsWith(o + "/") || v === o.replace(/^https/, "wss"));
const bad = [];
for (const o of origins(htmlCode)) if (!inCsp(o) && !NAV_OK.includes(o)) bad.push("index.html " + o);
for (const o of origins(swCode)) if (!inCsp(o) && !SW_ONLY.includes(o)) bad.push("sw.js " + o);
check("C2.5 mọi gốc https?:// trong mã chạy có trong CSP hoặc danh sách điều hướng/SW", bad.length === 0, bad);
const old = { "x-content-type-options": "nosniff", "x-frame-options": "DENY", "referrer-policy": "strict-origin-when-cross-origin", "permissions-policy": "camera=(), microphone=(), geolocation=()", "x-robots-tag": "noindex, nofollow" };
check("C2.6 header cũ còn nguyên", Object.entries(old).every(([k, v]) => hdrs[k] === v), hdrs);
check("C2.8 index.html không dùng eval/new Function", !/\beval\(|new Function\(/.test(htmlCode), 0);
check("C2.9 không nới quyền: không 'unsafe-eval', không https:/* trần ở bất kỳ chỉ thị nào", !Object.values(csp).flat().some(v => v === "'unsafe-eval'" || v === "https:" || v === "*"), csp);
check("C2.10 vercel.json giữ functions api/ai_plan.py", vj && vj.functions && vj.functions["api/ai_plan.py"] && vj.functions["api/ai_plan.py"].maxDuration === 60, vj && vj.functions);

const n = results.filter(Boolean).length;
console.log((n === results.length ? "OK " : "FAIL ") + n + "/" + results.length);
process.exit(n === results.length ? 0 : 1);
