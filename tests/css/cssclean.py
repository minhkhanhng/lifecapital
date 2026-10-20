# Dọn CSS trong index.html, không đổi giao diện:
# 1) Xóa khai báo chắc chắn bị đè: có khai báo sau với CÙNG bộ chọn (trong cùng điều kiện @media hoặc không điều kiện)
#    đặt lại mọi thuộc tính con của nó (xét cả !important). Khai báo lặp trong cùng một khối giữ nguyên (có thể là dự phòng cho trình duyệt cũ).
# 2) Xóa bộ chọn trỏ tới class/id không còn xuất hiện ở đâu ngoài CSS.
# 3) Xóa biến CSS không còn được dùng (không có var(--x) ở đâu).
# 4) (tùy chọn) Gom biến :root không điều kiện về khối :root đầu tiên.
import json, re, sys
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import cssparse as cp

SRC, DST, LONG = sys.argv[1], sys.argv[2], sys.argv[3]
MERGE_ROOT = "--merge-root" in sys.argv
html = open(SRC).read()
a = html.index("<style>") + len("<style>"); b = html.index("</style>", a)
css, rest = html[a:b], html[:a] + html[b:]
LH = json.load(open(LONG))
lh = lambda p: set(LH.get(p, [p])) if not p.startswith("--") else {p}

nodes, tail = cp.parse(css)
rules = list(cp.walk(nodes))
for i, r in enumerate(rules): r.idx = i
stat = {"decl_dead": 0, "sel_dead": 0, "var_dead": 0, "rules_before": len(rules), "decls_before": sum(len(r.decls) for r in rules)}

# --- 1. khai báo bị đè bởi cùng bộ chọn ---
by_sel = {}
for r in rules:
    for ns in r.norm: by_sel.setdefault(ns, []).append(r)
def covered(r, d):
    for ns in r.norm:
        need = set(lh(d.prop))
        for r2 in by_sel[ns]:
            if r2 is r or r2.ctx not in ("", r.ctx): continue
            for d2 in r2.decls:
                if d2.dead and r2.idx < r.idx: continue
                wins = (d2.important and not d.important) or (d2.important == d.important and r2.idx > r.idx)
                if wins: need -= lh(d2.prop)
            if not need: break
        if need: return False
    return True
changed = True
while changed:
    changed = False
    for r in rules:
        for d in r.decls:
            if not d.dead and covered(r, d):
                d.dead = True; r.changed = True; changed = True; stat["decl_dead"] += 1

# --- 2. bộ chọn trỏ tới class/id không còn dùng ---
def tokens(sel):
    s = re.sub(r"\[[^\]]*\]", "", sel)            # bỏ [thuộc tính]
    s = re.sub(r":not\(|:is\(|:where\(|:has\(", " ", s)
    return re.findall(r"\.([A-Za-z_][\w-]*)", s), re.findall(r"#([A-Za-z_][\w-]*)", s)
def present(name):
    if name in rest: return True
    if re.search(r"\d$", name): return True       # class ghép động kiểu `${cls}${v}`: luôn giữ
    base = re.sub(r"\d+$", "", name)              # class ghép động: "m" + v, `hs-${x}`
    if base != name and (base + "${" in rest or base + '" +' in rest or base + "' +" in rest): return True
    if name.endswith("-") is False and "-" in name:
        pre = name.rsplit("-", 1)[0] + "-"
        if pre + "${" in rest: return True
    return False
dead_sel = []
for r in rules:
    for raw, ns in zip(r.selectors, r.norm):
        cls, ids = tokens(ns)
        miss = [c for c in cls if not present(c)] + ["#" + i for i in ids if not present(i)]
        if miss:
            r.removed_sel.add(ns); r.changed = True; stat["sel_dead"] += 1; dead_sel.append((ns, miss))

# --- 3. biến không dùng ---
def live_css():
    return cp.render(nodes, tail)
while True:
    text = live_css() + rest
    used = set(re.findall(r"var\(\s*(--[\w-]+)", text)) | set(re.findall(r"[\"'](--[\w-]+)[\"']", rest))
    n = 0
    for r in rules:
        for d in r.decls:
            if not d.dead and d.prop.startswith("--") and d.prop not in used:
                d.dead = True; r.changed = True; n += 1
    stat["var_dead"] += n
    if not n: break

# --- 4. gom biến: mỗi nhóm khối có cùng bộ chọn bắt đầu bằng :root và cùng điều kiện về một khối
#        (:root thường về khối đầu tiên để biến nằm đầu tệp; các nhóm khác về khối cuối cùng để giữ thứ tự ưu tiên)
if MERGE_ROOT:
    groups = {}
    for r in rules:
        if len(r.norm) == 1 and r.norm[0].startswith(":root") and not r.removed_sel and any(not d.dead for d in r.decls):
            if all(d.prop.startswith("--") or d.dead for d in r.decls):
                groups.setdefault((r.ctx, r.norm[0]), []).append(r)
    n = 0
    for (ctx, sel), rs in groups.items():
        if len(rs) < 2: continue
        target = rs[0] if (ctx == "" and sel == ":root") else rs[-1]
        moved = []
        for r in rs:
            if r is target: continue
            for d in r.decls:
                if not d.dead:
                    nd = cp.Decl(d.prop, d.value, d.important, d.raw); nd.added = True
                    moved.append((r.idx, nd)); d.dead = True; r.changed = True
        if target is rs[0]:
            target.decls += [d for _, d in moved]
        else:
            target.decls = [d for _, d in moved] + target.decls
        target.changed = True; n += len(rs) - 1
    stat["root_blocks_merged"] = n

out_css = cp.render(nodes, tail)
# dọn dòng trống thừa do khối bị xóa để lại
out_css = re.sub(r"\n[ \t]*\n(?:[ \t]*\n)+", "\n\n", out_css)
open(DST, "w").write(html[:a] + out_css + html[b:])
rules2 = list(cp.walk(cp.parse(out_css)[0]))
stat.update(rules_after=len(rules2), decls_after=sum(len(r.decls) for r in rules2), css_before=len(css), css_after=len(out_css))
print(json.dumps(stat, ensure_ascii=False))
print("bộ chọn bỏ:", len(dead_sel)); [print("  ", s, m) for s, m in dead_sel[:60]]
