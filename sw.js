/* Life Capital: lưu sẵn app trên máy để mở được khi mất mạng.
   Hàm máy chủ /api/*: không lưu, luôn hỏi mạng.
   Trang chính: lấy bản mới từ mạng trước, mất mạng (hoặc quá 4 giây) thì dùng bản đã lưu.
   Tệp tĩnh và thư viện Supabase (đã ghim phiên bản): dùng bản đã lưu, chưa có thì tải.
   Mỗi lần phát hành phải đổi VERSION để máy người dùng nhận bản mới và hiện thanh "Có bản mới". */
const VERSION = "lc-0.6.4";
const CORE = ["./", "manifest.json", "icon.svg", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png"];
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

// Trang bấm "Tải lại" trên thanh "Có bản mới"
self.addEventListener("message", e => {
  if (e.data === "skip-waiting") self.skipWaiting();
});

function networkFirst(req) {
  return new Promise(resolve => {
    let done = false;
    const finish = res => { if (!done && res) { done = true; resolve(res); } };
    // Mạng chậm quá 4 giây: mở bản đã lưu; chưa có bản lưu thì tiếp tục chờ mạng
    const slow = setTimeout(() => caches.match("./").then(finish), 4000);
    fetch(req).then(res => {
      clearTimeout(slow);
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put("./", copy)); }
      finish(res);
    }).catch(() => {
      clearTimeout(slow);
      caches.match("./").then(hit => finish(hit || Response.error()));
    });
  });
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
  if (req.mode === "navigate" && url.origin === self.location.origin) { e.respondWith(networkFirst(req)); return; }
  if (url.origin === self.location.origin || url.href.startsWith(CDN)) {
    e.respondWith(cacheFirst(req));
  }
  // Còn lại (Google, Supabase API) đi thẳng ra mạng, không lưu
});
