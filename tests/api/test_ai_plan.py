# Test hàm Nhờ AI xếp (api/ai_plan.py) với AI giả: không gọi mạng, không tốn tiền.
# Chạy: python3 tests/api/test_ai_plan.py
import json
import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "api"))
import ai_plan as A  # noqa: E402

DAYS = ["2026-10-23", "2026-10-24", "2026-10-25"]


def payload(**kw):
    p = {
        "today": DAYS[0], "now": "09:15", "days": DAYS,
        "window": {"from": "08:00", "to": "22:00", "cap": 2},
        "busy": {DAYS[0]: [["09:00", "10:00"]], "2099-01-01": [["01:00", "02:00"]]},
        "capitals": [{"k": "kn", "n": "Kỹ năng", "tg": 4, "h": 1}],
        "todo": [
            {"id": "s1", "t": "Đọc chương 1", "h": 1, "task": "Học SQL", "tid": "t1", "i": 0, "c": "Kỹ năng", "due": "2026-10-25"},
            {"id": "s2", "t": "Làm bài tập", "h": 1.5, "task": "Học SQL", "tid": "t1", "i": 1, "c": "Kỹ năng"},
        ],
        "ready": 72,
    }
    p.update(kw)
    return p


def ok_user(auth):
    return "a@b.c"


class Clean(unittest.TestCase):
    def test_keeps_only_needed_fields(self):
        d = A.clean_payload(payload(health={"sy": {"x": 3}}, ev={"x": 1}))
        self.assertNotIn("health", d)
        self.assertNotIn("ev", d)
        self.assertEqual(d["readinessToday"], 72)
        self.assertEqual(list(d["busy"].keys()), [DAYS[0]])  # ngày ngoài danh sách bị bỏ
        self.assertEqual(d["window"]["maxHoursPerTaskPerDay"], 2)
        self.assertEqual(d["todo"][0]["due"], "2026-10-25")
        self.assertNotIn("due", d["todo"][1])

    def test_review_fields(self):
        d = A.clean_payload(payload(todo=[{"id": "s1", "h": 1, "q": "Gấp · Quan trọng", "at": {"date": DAYS[1], "start": "09:00"}},
                                          {"id": "s2", "h": 1, "at": {"date": "bad", "start": "9h"}}]))
        self.assertEqual(d["todo"][0]["currentlyAt"], {"date": DAYS[1], "start": "09:00"})
        self.assertEqual(d["todo"][0]["priority"], "Gấp · Quan trọng")
        self.assertNotIn("currentlyAt", d["todo"][1])

    def test_rejects_bad_input(self):
        with self.assertRaises(A.Bad):
            A.clean_payload({"days": [], "today": DAYS[0], "todo": []})
        with self.assertRaises(A.Bad):
            A.clean_payload(payload(todo=[{"id": "bad id!", "h": 1}]))
        d = A.clean_payload(payload(todo=[{"id": "x1", "h": 99, "t": "y" * 500}]))
        self.assertEqual(d["todo"][0]["hours"], 12)
        self.assertEqual(len(d["todo"][0]["title"]), 120)

    def test_no_ready_when_missing(self):
        p = payload()
        del p["ready"]
        self.assertNotIn("readinessToday", A.clean_payload(p))

    def test_clean_result(self):
        d = A.clean_payload(payload())
        r = A.clean_result({"summary": "Ổn", "items": [
            {"id": "s1", "date": DAYS[1], "start": "08:00", "reason": "sáng"},
            {"id": "s1", "date": DAYS[2], "start": "08:00", "reason": "trùng id"},
            {"id": "zz", "date": DAYS[1], "start": "08:00", "reason": "lạ"},
            {"id": "s2", "date": "2030-01-01", "start": "08:00", "reason": "ngoài ngày"},
        ], "unplaced": [{"id": "s2", "reason": "hết chỗ"}, {"id": "s1", "reason": "đã xếp"}]}, d)
        self.assertEqual([x["id"] for x in r["items"]], ["s1"])
        self.assertEqual(r["unplaced"], [{"id": "s2", "reason": "hết chỗ"}])


class Flow(unittest.TestCase):
    def test_happy_path(self):
        seen = {}

        def model(data):
            seen.update(data)
            return {"summary": "x", "items": [{"id": "s1", "date": DAYS[1], "start": "08:00", "reason": "r"}], "unplaced": []}
        r = A.plan(json.dumps(payload()).encode(), "Bearer x", model=model, who=ok_user)
        self.assertEqual(r["items"][0]["id"], "s1")
        self.assertEqual(seen["todo"][1]["order"], 1)

    def test_auth_required(self):
        with self.assertRaises(A.Bad) as c:
            A.plan(json.dumps(payload()).encode(), None, model=lambda d: {})
        self.assertEqual(c.exception.status, 401)

    def test_allowlist(self):
        os.environ["AI_ALLOWED_EMAILS"] = "boss@x.vn"
        try:
            orig = A.urllib.request.urlopen

            class R:
                def __init__(self, b): self.b = b
                def read(self): return self.b
                def __enter__(self): return self
                def __exit__(self, *a): pass
            A.urllib.request.urlopen = lambda req, timeout=0: R(b'{"email":"Other@x.vn"}')
            with self.assertRaises(A.Bad) as c:
                A.check_user("Bearer " + "a" * 30)
            self.assertEqual(c.exception.status, 403)
            A.urllib.request.urlopen = lambda req, timeout=0: R(b'{"email":"BOSS@x.vn"}')
            self.assertEqual(A.check_user("Bearer " + "a" * 30), "boss@x.vn")
        finally:
            A.urllib.request.urlopen = orig
            del os.environ["AI_ALLOWED_EMAILS"]

    def test_too_big(self):
        with self.assertRaises(A.Bad) as c:
            A.plan(b"x" * (A.MAX_BODY + 1), "Bearer x", model=lambda d: {}, who=ok_user)
        self.assertEqual(c.exception.status, 413)

    def test_no_key(self):
        os.environ.pop("ANTHROPIC_API_KEY", None)
        with self.assertRaises(A.Bad) as c:
            A.plan(json.dumps(payload()).encode(), "Bearer x", who=ok_user)
        self.assertEqual(c.exception.status, 503)

    def test_ready(self):
        os.environ.pop("ANTHROPIC_API_KEY", None)
        self.assertFalse(A.ready("Bearer x", who=ok_user))  # chưa có khóa: ẩn nút
        os.environ["ANTHROPIC_API_KEY"] = "test"
        try:
            self.assertTrue(A.ready("Bearer x", who=ok_user))

            def deny(auth):
                raise A.Bad(403, "no")
            self.assertFalse(A.ready("Bearer x", who=deny))  # không được phép / chưa đăng nhập: ẩn nút
            self.assertFalse(A.ready(None))
        finally:
            del os.environ["ANTHROPIC_API_KEY"]

    def test_bad_model_output(self):
        def model(data):
            raise ValueError("not json")
        with self.assertRaises(A.Bad) as c:
            A.plan(json.dumps(payload()).encode(), "Bearer x", model=model, who=ok_user)
        self.assertEqual(c.exception.status, 502)


if __name__ == "__main__":
    unittest.main(verbosity=1)
