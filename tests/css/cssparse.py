# Bộ phân tích CSS tối giản cho khối <style> chính của index.html: giữ nguyên chữ gốc của phần không đổi.
import re

class Decl:
    def __init__(self, prop, value, important, raw):
        self.prop, self.value, self.important, self.raw = prop, value, important, raw
        self.dead = False

class Rule:
    def __init__(self, selector_raw, body_raw, lead, prelude_raw=None):
        self.selector_raw, self.body_raw, self.lead = selector_raw, body_raw, lead
        self.prelude_raw = prelude_raw if prelude_raw is not None else selector_raw + " "  # lead: chú thích, khoảng trắng phía trước
        self.selectors = split_top(selector_raw, ",")
        self.norm = [norm_sel(s) for s in self.selectors]
        self.decls = parse_decls(body_raw)
        self.changed = False
        self.removed_sel = set()
        self.ctx = ""

class AtRule:
    def __init__(self, prelude, children, lead, raw_body=None, prelude_raw=None):
        self.prelude, self.children, self.lead, self.raw_body = prelude, children, lead, raw_body
        self.prelude_raw = prelude_raw if prelude_raw is not None else prelude + " "  # raw_body: @keyframes, @font-face giữ nguyên
        self.ctx = ""

def strip_comments(s):
    return re.sub(r"/\*.*?\*/", "", s, flags=re.S)

def split_top(s, sep):
    out, depth, cur, q = [], 0, "", None
    for ch in s:
        if q:
            cur += ch
            if ch == q: q = None
            continue
        if ch in "\"'": q = ch; cur += ch; continue
        if ch in "([": depth += 1
        elif ch in ")]": depth -= 1
        if ch == sep and depth == 0:
            out.append(cur); cur = ""
        else:
            cur += ch
    if cur.strip(): out.append(cur)
    return [x.strip() for x in out if x.strip()]

def norm_sel(s):
    s = strip_comments(s)
    s = re.sub(r"\s+", " ", s.strip())
    s = re.sub(r"\s*([>+~])\s*", r" \1 ", s)
    s = re.sub(r"\s+", " ", s)
    s = s.replace("'", '"')
    return s

def segments(body):
    out, cur, depth, q, i = [], "", 0, None, 0
    while i < len(body):
        ch = body[i]
        if q:
            cur += ch
            if ch == q: q = None
            i += 1; continue
        if body.startswith("/*", i):
            j = body.index("*/", i) + 2; cur += body[i:j]; i = j; continue
        if ch in "\"'": q = ch
        elif ch in "([": depth += 1
        elif ch in ")]": depth -= 1
        cur += ch
        if ch == ";" and depth == 0:
            # chú thích nằm cùng dòng ngay sau ";" thuộc về khai báo này
            m = re.match(r"[ \t]*/\*.*?\*/", body[i + 1:], flags=re.S)
            if m and "\n" not in m.group(0): cur += m.group(0); i += len(m.group(0))
            out.append(cur); cur = ""
        i += 1
    return out, cur  # cur: phần đuôi sau dấu ; cuối (khoảng trắng, chú thích, hoặc khai báo không có ;)

def parse_decls(body):
    out = []
    for part in split_top(strip_comments(body), ";"):
        if ":" not in part: continue
        prop, val = part.split(":", 1)
        prop = prop.strip().lower() if not prop.strip().startswith("--") else prop.strip()
        val = val.strip()
        imp = False
        m = re.search(r"!\s*important\s*$", val, flags=re.I)
        if m: imp = True; val = val[:m.start()].strip()
        out.append(Decl(prop, val, imp, part.strip()))
    return out

def find_block_end(s, i):
    # s[i] == "{" ; trả về chỉ số của "}" tương ứng
    depth, q, j = 0, None, i
    while j < len(s):
        ch = s[j]
        if q:
            if ch == q and s[j - 1] != "\\": q = None
        elif s.startswith("/*", j):
            j = s.index("*/", j) + 2; continue
        elif ch in "\"'": q = ch
        elif ch == "{": depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0: return j
        j += 1
    raise ValueError("unbalanced")

def parse(s):
    nodes, i, lead_start = [], 0, 0
    while True:
        # bỏ qua khoảng trắng và chú thích (gom vào lead của nút tiếp theo)
        j = i
        while j < len(s):
            if s[j].isspace(): j += 1
            elif s.startswith("/*", j): j = s.index("*/", j) + 2
            else: break
        if j >= len(s):
            return nodes, s[lead_start:]
        lead = s[lead_start:j]
        k = s.index("{", j)
        prelude = s[j:k]
        end = find_block_end(s, k)
        inner = s[k + 1:end]
        if prelude.strip().startswith("@"):
            name = prelude.strip().split()[0].lower()
            if name in ("@media", "@supports", "@container"):
                ch, tail = parse(inner)
                at = AtRule(prelude.strip(), ch, lead, prelude_raw=prelude)
                at.tail = tail
                nodes.append(at)
            else:
                nodes.append(AtRule(prelude.strip(), None, lead, raw_body=inner, prelude_raw=prelude))
        else:
            nodes.append(Rule(prelude.strip(), inner, lead, prelude_raw=prelude))
        i = lead_start = end + 1

def walk(nodes, ctx=""):
    for n in nodes:
        n.ctx = ctx
        if isinstance(n, Rule): yield n
        elif n.children is not None:
            c = (ctx + " && " if ctx else "") + re.sub(r"\s+", " ", n.prelude)
            yield from walk(n.children, c)

def rebuild_body(n, live, indent):
    # giữ nguyên chữ gốc (kể cả chú thích) của khai báo còn sống, bỏ đoạn của khai báo đã chết, thêm khai báo mới chuyển tới
    segs, tailtxt = segments(n.body_raw)
    orig = [d for d in n.decls if not getattr(d, "added", False)]
    kept, k = [], 0
    for sg in segs + ([tailtxt] if ":" in strip_comments(tailtxt) else []):
        if ":" not in strip_comments(sg):
            kept.append(sg); continue
        d = orig[k] if k < len(orig) else None; k += 1
        if d is not None and not d.dead: kept.append(sg)
        else:
            m = re.match(r"\s*(/\*.*?\*/\s*)+", sg, flags=re.S)   # giữ chú thích đứng trước khai báo bị bỏ? không: chú thích đó thường nói về khai báo trước nó
    if ":" in strip_comments(tailtxt): tailtxt = ""
    added = [d for d in n.decls if getattr(d, "added", False) and not d.dead]
    multi = "\n" in n.body_raw
    if added:
        if multi:
            ind = re.search(r"\n([ \t]*)\S", n.body_raw); ind = ind.group(1) if ind else indent + "  "
            add_txt = "".join("\n" + ind + d.raw + ";" for d in added)
        else:
            add_txt = "".join(" " + d.raw + ";" for d in added)
        body = "".join(kept).rstrip() + add_txt + (tailtxt if tailtxt.strip() else ("\n" + indent if multi else " "))
    else:
        body = "".join(kept) + tailtxt
    if not strip_comments(body).strip(): return " "
    return body

def render(nodes, tail, indent="", keep_empty=False):
    out = []
    for n in nodes:
        if isinstance(n, Rule):
            live = [d for d in n.decls if not d.dead]
            sels = [s for s, ns in zip(n.selectors, n.norm) if ns not in n.removed_sel]
            if not live or not sels:
                # bỏ cả chú thích đứng ngay trước nếu nó chỉ dành cho khối này
                continue
            if not n.changed and len(sels) == len(n.selectors):
                out.append(n.lead + n.prelude_raw + "{" + n.body_raw + "}")
            else:
                pre = n.prelude_raw if len(sels) == len(n.selectors) else ", ".join(sels) + " "
                out.append(n.lead + pre + "{" + rebuild_body(n, live, indent) + "}")
        elif n.children is not None:
            inner = render(n.children, n.tail, indent + "  ", keep_empty)
            if not keep_empty and not strip_comments(inner).strip(): continue
            out.append(n.lead + n.prelude_raw + "{" + inner + "}")
        else:
            out.append(n.lead + n.prelude_raw + "{" + n.raw_body + "}")
    return "".join(out) + tail
