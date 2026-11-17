#!/usr/bin/env python3
"""Máy chủ tĩnh cho test CSP: phục vụ thư mục gốc repo, gắn header Content-Security-Policy
LẤY TỪ vercel.json cho mọi phản hồi (giống Vercel). Dùng: python3 tests/csp/serve.py 8806
Cờ --test-eval (chỉ để chạy các bộ e2e CŨ như E2EUX, nạp tiện ích đo bằng eval() của chính bộ test): thêm 'unsafe-eval' vào script-src.
KHÔNG dùng cờ này cho E2ECSP (E2.* kiểm header đúng như vercel.json). index.html không dùng eval (test_csp.js C2.8)."""
import json, os, sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

def load_csp():
    with open(os.path.join(ROOT, "vercel.json"), encoding="utf-8") as f:
        cfg = json.load(f)
    for rule in cfg.get("headers", []):
        for h in rule.get("headers", []):
            if h.get("key", "").lower() == "content-security-policy":
                return h["value"]
    return None

CSP = load_csp()
TEST_EVAL = "--test-eval" in sys.argv
if CSP and TEST_EVAL:
    CSP = CSP.replace("script-src 'self'", "script-src 'self' 'unsafe-eval'", 1)

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)
    def end_headers(self):
        if CSP:
            self.send_header("Content-Security-Policy", CSP)
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    port = int(args[0]) if args else 8806
    srv = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"serve.py: cổng {port}, thư mục {ROOT}", flush=True)
    if TEST_EVAL: print("CHÚ Ý: --test-eval: CSP đã thêm 'unsafe-eval' (chỉ cho bộ test cũ)", flush=True)
    print("CSP: " + (CSP if CSP else "(vercel.json CHƯA có Content-Security-Policy)"), flush=True)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
