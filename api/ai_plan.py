# Nhờ AI xếp (v0.6.4): nhận danh sách việc chưa xếp + giờ bận + mục tiêu vốn, nhờ Claude đề xuất ngày giờ.
# App luôn hiện bản đề xuất để người dùng duyệt; hàm này không ghi gì vào dữ liệu.
#
# Biến môi trường trên Vercel:
#   ANTHROPIC_API_KEY  (bắt buộc) khóa API của Anthropic
#   AI_ALLOWED_EMAILS  (nên đặt) email được dùng, cách nhau dấu phẩy; để trống = mọi tài khoản đã đăng nhập
#   SUPABASE_URL, SUPABASE_KEY (tùy chọn) mặc định lấy giống app
import json
import os
import re
import urllib.request
from http.server import BaseHTTPRequestHandler

MODEL = "claude-opus-5-5"
SB_URL = os.environ.get("SUPABASE_URL", "https://bvuvgjiufpjsidyyigkb.supabase.co")
SB_KEY = os.environ.get("SUPABASE_KEY", "sb_publishable_L5otbMIzkhWqwOJeRFd2AQ_ml3vz10c")
MAX_BODY = 60_000
DATE = re.compile(r"^\d{4}-\d\d-\d\d$")
HM = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")
SAFE = re.compile(r"^[\w-]{1,40}$")

SYSTEM = """Bạn là trợ lý xếp lịch của app Life Capital. Người dùng chia thời gian theo các "loại vốn" (sức khỏe, quan hệ, kỹ năng, tài chính, trải nghiệm…) và có mục tiêu giờ mỗi tuần cho từng loại.

Nhiệm vụ: xếp các việc nhỏ chưa có lịch vào những ngày được cho, sao cho:
- Không trùng với giờ bận, không trùng nhau, nằm trong khung giờ xếp việc, không xếp vào giờ đã qua của hôm nay.
- Mỗi việc nhỏ giữ đúng thời lượng đã cho. Các việc nhỏ cùng một việc giữ đúng thứ tự (thứ tự 0 làm trước).
- Việc có hạn phải xong trước hạn, tốt nhất sớm hơn một ngày.
- Mỗi việc không quá số giờ tối đa mỗi ngày (nếu có), trừ khi cần để kịp hạn.
- Ưu tiên loại vốn còn thiếu giờ so với mục tiêu tuần; trải đều, không dồn một ngày quá tải.
- Nếu có điểm Sẵn sàng hôm nay dưới 50, hôm nay chỉ xếp việc nhẹ, ít giờ.
- Việc khó, cần tập trung nên vào buổi sáng hoặc đầu giờ chiều; việc nhẹ để cuối ngày.

- Ưu tiên theo ma trận Eisenhower ("priority"): Gấp · Quan trọng làm sớm nhất; Quan trọng xếp buổi sáng; Gấp (ít quan trọng) làm gọn, buổi chiều; Để sau xếp cuối.
- Cách mỗi khối ít nhất 15 phút; mỗi ngày chừa khoảng 20% giờ trống dự phòng.
- Việc có "currentlyAt" đang có lịch: chỉ dời khi có lý do rõ ràng; việc giữ nguyên thì không cần liệt kê trong "items".

Không xếp được thì đưa vào "unplaced" kèm lý do. Lý do và tóm tắt viết bằng tiếng Việt, ngắn gọn, xưng "bạn"."""

SCHEMA = {
    "type": "object",
    "properties": {
        "summary": {"type": "string"},
        "items": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "date": {"type": "string"},
                    "start": {"type": "string"},
                    "reason": {"type": "string"},
                },
                "required": ["id", "date", "start", "reason"],
                "additionalProperties": False,
            },
        },
        "unplaced": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {"id": {"type": "string"}, "reason": {"type": "string"}},
                "required": ["id", "reason"],
                "additionalProperties": False,
            },
        },
    },
    "required": ["summary", "items", "unplaced"],
    "additionalProperties": False,
}


class Bad(Exception):
    def __init__(self, status, msg):
        super().__init__(msg)
        self.status, self.msg = status, msg


def clean_payload(p):
    """Chỉ giữ các trường cần cho việc xếp lịch, đúng kiểu, giới hạn độ dài."""
    if not isinstance(p, dict):
        raise Bad(400, "Dữ liệu không hợp lệ")
    s = lambda v, n=80: str(v)[:n] if isinstance(v, (str, int, float)) else ""
    num = lambda v, lo, hi: max(lo, min(hi, float(v))) if isinstance(v, (int, float)) else None
    days = [d for d in (p.get("days") or []) if isinstance(d, str) and DATE.match(d)][:14]
    today = p.get("today") if isinstance(p.get("today"), str) and DATE.match(p.get("today")) else None
    if not days or not today:
        raise Bad(400, "Thiếu ngày cần xếp")
    win = p.get("window") or {}
    out = {
        "today": today,
        "now": p.get("now") if isinstance(p.get("now"), str) and HM.match(p.get("now")) else "00:00",
        "days": days,
        "window": {
            "from": win.get("from") if isinstance(win.get("from"), str) and HM.match(win.get("from")) else "08:00",
            "to": win.get("to") if isinstance(win.get("to"), str) and (HM.match(win.get("to")) or win.get("to") == "24:00") else "22:00",
        },
        "busy": {},
        "note": "busy: giờ đã có hoạt động [bắt đầu, kết thúc]; window: khung giờ được xếp việc",
        "capitals": [],
        "todo": [],
    }
    for d, blocks in (p.get("busy") or {}).items():
        if d in days and isinstance(blocks, list):
            out["busy"][d] = [[b[0], b[1]] for b in blocks[:40]
                              if isinstance(b, list) and len(b) >= 2 and all(isinstance(x, str) and (HM.match(x) or x == "24:00") for x in b[:2])]
    for c in (p.get("capitals") or [])[:12]:
        if isinstance(c, dict) and SAFE.match(str(c.get("k", ""))):
            out["capitals"].append({"key": c["k"], "name": s(c.get("n"), 40),
                                    "targetHoursPerWeek": num(c.get("tg"), 0, 168) or 0,
                                    "hoursThisWeek": num(c.get("h"), 0, 168) or 0})
    for t in (p.get("todo") or [])[:60]:
        if not isinstance(t, dict) or not SAFE.match(str(t.get("id", ""))):
            continue
        h = num(t.get("h"), 0.25, 12)
        if not h:
            continue
        out["todo"].append({
            "id": t["id"], "title": s(t.get("t"), 120), "hours": h,
            "task": s(t.get("task"), 120), "taskId": s(t.get("tid"), 40), "order": int(num(t.get("i"), 0, 99) or 0),
            "capital": s(t.get("c"), 40),
            **({"due": t["due"]} if isinstance(t.get("due"), str) and DATE.match(t["due"]) else {}),
            **({"missedBefore": True} if t.get("missed") else {}),
            **({"priority": s(t.get("q"), 40)} if t.get("q") else {}),
            **({"currentlyAt": {"date": t["at"]["date"], "start": t["at"]["start"]}}
               if isinstance(t.get("at"), dict) and DATE.match(str(t["at"].get("date", ""))) and HM.match(str(t["at"].get("start", ""))) else {}),
        })
    cap = num(win.get("cap"), 0, 24)
    if cap:
        out["window"]["maxHoursPerTaskPerDay"] = cap
    if not out["todo"]:
        raise Bad(400, "Không còn việc nào cần xếp")
    rd = num(p.get("ready"), 0, 100)
    if rd is not None:
        out["readinessToday"] = int(rd)  # chỉ một con số; không gửi triệu chứng, thuốc, chu kỳ
    return out


def check_user(auth):
    """Chỉ người đã đăng nhập đồng bộ (Supabase) mới gọi được, để không ai lạ dùng khóa API."""
    m = re.match(r"^Bearer\s+([\w\-.]{20,4096})$", auth or "")
    if not m:
        raise Bad(401, "Cần đăng nhập đồng bộ để dùng AI")
    req = urllib.request.Request(SB_URL + "/auth/v1/user", headers={"Authorization": "Bearer " + m.group(1), "apikey": SB_KEY})
    try:
        with urllib.request.urlopen(req, timeout=8) as r:
            user = json.loads(r.read().decode())
    except Exception:
        raise Bad(401, "Phiên đăng nhập hết hạn, đăng nhập lại rồi thử")
    email = (user.get("email") or "").lower()
    allow = [e.strip().lower() for e in os.environ.get("AI_ALLOWED_EMAILS", "").split(",") if e.strip()]
    if allow and email not in allow:
        raise Bad(403, "Tài khoản này chưa được bật AI")
    return email


def call_claude(data):
    import anthropic  # nạp khi cần: test chạy không cần thư viện

    client = anthropic.Anthropic(max_retries=0, timeout=52)  # Vercel cắt hàm ở 60 giây
    try:
        resp = client.beta.messages.create(
            model=MODEL,
            max_tokens=16000,
            betas=["server-side-fallback-2026-07-01"],
            system=SYSTEM,
            output_config={"effort": "medium", "format": {"type": "json_schema", "schema": SCHEMA}},
            messages=[{"role": "user", "content": "Dữ liệu (JSON):\n" + json.dumps(data, ensure_ascii=False)}],
            extra_body={"fallbacks": "default"},  # bị từ chối thì máy chủ tự chạy lại bằng mô hình dự phòng
        )
    except anthropic.RateLimitError:
        raise Bad(429, "AI đang bận, thử lại sau ít phút")
    except anthropic.AuthenticationError:
        raise Bad(500, "Khóa API của AI chưa đúng, báo người quản trị")
    except anthropic.APIStatusError as e:
        raise Bad(502, "AI lỗi (%s), thử lại sau" % e.status_code)
    except anthropic.APITimeoutError:
        raise Bad(504, "AI trả lời quá lâu, bớt việc hoặc thử lại")
    except anthropic.APIConnectionError:
        raise Bad(504, "Không kết nối được AI, thử lại sau")
    if resp.stop_reason == "refusal":
        raise Bad(422, "AI không xếp được lần này, thử lại hoặc xếp tay")
    if resp.stop_reason == "max_tokens":
        raise Bad(502, "Quá nhiều việc cho một lần, bớt việc rồi thử lại")
    text = next((b.text for b in resp.content if b.type == "text"), "")
    return json.loads(text)


def clean_result(r, data):
    ids = {t["id"] for t in data["todo"]}
    days = set(data["days"])
    items, seen = [], set()
    for x in (r.get("items") or []):
        if (isinstance(x, dict) and x.get("id") in ids and x["id"] not in seen
                and x.get("date") in days and isinstance(x.get("start"), str) and HM.match(x["start"])):
            seen.add(x["id"])
            items.append({"id": x["id"], "date": x["date"], "start": x["start"], "reason": str(x.get("reason", ""))[:200]})
    unplaced = [{"id": x["id"], "reason": str(x.get("reason", ""))[:200]} for x in (r.get("unplaced") or [])
                if isinstance(x, dict) and x.get("id") in ids and x["id"] not in seen]
    return {"summary": str(r.get("summary", ""))[:600], "items": items, "unplaced": unplaced}


def ready(auth, who=check_user):
    """AI dùng được cho người này: máy chủ có khóa và tài khoản đã đăng nhập, được phép."""
    if not os.environ.get("ANTHROPIC_API_KEY"):
        return False
    try:
        who(auth)
        return True
    except Exception:
        return False


def plan(body, auth, model=call_claude, who=check_user):
    if len(body) > MAX_BODY:
        raise Bad(413, "Quá nhiều dữ liệu cho một lần xếp")
    try:
        p = json.loads(body or b"{}")
    except ValueError:
        raise Bad(400, "Dữ liệu không hợp lệ")
    who(auth)
    data = clean_payload(p)
    if not os.environ.get("ANTHROPIC_API_KEY") and model is call_claude:
        raise Bad(503, "AI chưa được cài đặt trên máy chủ")
    try:
        return clean_result(model(data), data)
    except (ValueError, KeyError, TypeError):
        raise Bad(502, "AI trả về dữ liệu lỗi, thử lại")


class handler(BaseHTTPRequestHandler):
    def _send(self, status, obj):
        b = json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def do_POST(self):
        try:
            n = int(self.headers.get("Content-Length") or 0)
            if n > MAX_BODY:
                raise Bad(413, "Quá nhiều dữ liệu cho một lần xếp")
            self._send(200, plan(self.rfile.read(n), self.headers.get("Authorization")))
        except Bad as e:
            self._send(e.status, {"error": e.msg})
        except Exception:
            self._send(500, {"error": "Lỗi máy chủ, thử lại sau"})

    def do_GET(self):
        # App hỏi "AI có dùng được không" để quyết định hiện nút; luôn trả 200, không gọi AI, không tốn tiền
        self._send(200, {"ready": ready(self.headers.get("Authorization"))})
