# Nhận ảnh chụp kiểu hiển thị (JSON) từ trang thử và ghi vào scratchpad/snaps/<name>.json
import http.server, os, urllib.parse, sys
OUT = sys.argv[1]
class H(http.server.BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.end_headers()
    def do_POST(self):
        q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        name = "".join(c for c in q.get("name", ["x"])[0] if c.isalnum() or c in "-_.")
        n = int(self.headers.get("Content-Length", 0))
        with open(os.path.join(OUT, name + ".json"), "wb") as f: f.write(self.rfile.read(n))
        self.send_response(200); self._cors(); self.end_headers(); self.wfile.write(b"ok")
    def log_message(self, *a): pass
http.server.HTTPServer(("127.0.0.1", 8799), H).serve_forever()
