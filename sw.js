/* Life Capital: lưu sẵn app trên máy để mở được khi mất mạng.
   Hàm máy chủ /api/*: không lưu, luôn hỏi mạng.
   Trang chính: có bản đã lưu thì mở ngay bản đó, tải bản mới ở nền cho lần mở sau (chưa có bản lưu thì chờ mạng).
   SW báo trang {lc:"net", ok} sau mỗi lần hỏi máy chủ để trang hiện/ẩn nhãn "Bản đã lưu".
   Tệp tĩnh và thư viện Supabase (đã ghim phiên bản): dùng bản đã lưu, chưa có thì tải.
   Mỗi lần phát hành phải đổi VERSION để máy người dùng nhận bản mới và hiện thanh "Có bản mới". */
const VERSION = "lc-0.9.3";
const CORE = ["./", "manifest.json", "favicon.ico", "favicon-32x32.png", "logo-96.png", "logo-192.png", "icon-192.png", "apple-touch-icon.png"]; // icon 512 vào cache qua cacheFirst khi trình duyệt cần
const CDN = "https://cdn.jsdelivr.net/npm/"; // thư viện ghim phiên bản, không đổi nội dung

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Trạng thái mạng lần hỏi máy chủ gần nhất; gửi cho trang dạng {lc:"net", ok}
let lastNet = null, revalidating = null;
function tell(client) { try { client.postMessage({ lc: "net", ok: lastNet.ok }); } catch (_) {} } // client đã đóng: bỏ qua
function noteNet(ok) {
  lastNet = { ok, t: Date.now() };
  return self.clients.matchAll({ type: "window" }).then(list => list.forEach(tell), () => {});
}

// Chỉ trang chính dùng bản lưu; HTML phụ (vd /tests/merge-tests.html) đi thẳng ra mạng
const isPage = url => url.pathname === "/" || url.pathname === "/index.html";
const NET_TIMEOUT = 8000; // mạng treo quá lâu: coi như không với tới máy chủ, nhả khóa để hỏi lại được
// Phản hồi dùng được làm trang: ok, không redirect, cùng nguồn ("basic")
const usable = res => !!res && res.ok && !res.redirected && (!res.type || res.type === "basic");

// Tải bản mới của trang vào cache ở nền; đang chạy thì dùng lại lời hứa đó (không chạy chồng)
function revalidate() {
  if (revalidating) return revalidating;
  revalidating = new Promise(resolve => {
    const timer = setTimeout(() => resolve(null), NET_TIMEOUT);
    fetch("./", { cache: "no-cache" }).then(res => { clearTimeout(timer); resolve(res); }, () => { clearTimeout(timer); resolve(null); });
  })
    .then(res => usable(res) ? caches.open(VERSION).then(c => c.put("./", res)).then(() => true, () => true) : false) // 404/5xx/redirect/lỗi: giữ bản lưu cũ
    .then(noteNet)
    .catch(() => {})
    .then(() => { revalidating = null; });
  return revalidating;
}

self.addEventListener("message", e => {
  if (e.data === "skip-waiting") { self.skipWaiting(); return; } // trang bấm "Tải lại" trên thanh "Có bản mới"
  if (e.data === "net!") { const q = revalidate(); if (e.waitUntil) e.waitUntil(q); return; } // mạng vừa đổi (online/offline/quay lại tab): luôn hỏi lại
  if (e.data !== "net?") return;
  // Lần trước thông và còn mới (< 30 s): trả ngay. Lần trước lỗi thì luôn hỏi lại, để nhãn tự ẩn khi mạng về.
  if (lastNet && lastNet.ok && Date.now() - lastNet.t < 30000) { if (e.source) tell(e.source); return; }
  const p = revalidate();
  if (e.waitUntil) e.waitUntil(p);
});

// Chưa có bản lưu: chờ mạng như cũ (404/5xx trả phản hồi của máy chủ, mất mạng trả lỗi)
function networkOnly(req) {
  return fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put("./", copy)).catch(() => {}); }
    noteNet(res.ok);
    return res;
  }, () => { noteNet(false); return Response.error(); });
}

function cacheFirst(req) {
  return caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return res;
  }));
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin && url.pathname.startsWith("/api/")) return; // hàm máy chủ: luôn đi thẳng ra mạng, không lưu
  if (req.mode === "navigate" && url.origin === self.location.origin) {
    if (!isPage(url)) return; // trang phụ: không chặn, đi thẳng ra mạng
    const hit = caches.match("./").catch(() => undefined); // cache hỏng: coi như chưa có bản lưu
    e.respondWith(hit.then(h => h || networkOnly(req)));
    e.waitUntil(hit.then(h => h && revalidate()));
    return;
  }
  if (url.origin === self.location.origin || url.href.startsWith(CDN)) {
    e.respondWith(cacheFirst(req));
  }
  // Còn lại (Google, Supabase API) đi thẳng ra mạng, không lưu
});
