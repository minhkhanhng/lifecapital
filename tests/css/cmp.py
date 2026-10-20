# So hai ảnh chụp. Bỏ qua: popup đang đóng khi so màn hình thường (ẩn, nội dung còn từ lần mở trước),
# danh sách bản tự lưu trong Cài đặt (phụ thuộc thời điểm).
import json, sys
IGN = ("div.set-row.set-top:3",)
a = json.load(open(sys.argv[1])); b = json.load(open(sys.argv[2]))
tot = 0
for v in sorted(set(a) | set(b)):
    x, y = a.get(v, {}), b.get(v, {})
    if "err" in x or "err" in y: print(v, "ERR", x.get("err"), y.get("err")); continue
    skip = lambda k: any(i in k for i in IGN) or (not v.startswith("pop-") and v != "toast" and k.startswith("div.modal-overlay") and ".open:" not in k.split(">")[0] + ":")
    diff = [k for k in set(x) | set(y) if x.get(k) != y.get(k) and not skip(k)]
    if diff:
        tot += len(diff); print(f"{v}: {len(diff)} khác / {len(x)}", *sorted(diff)[:6], sep="\n   ")
print("TỔNG KHÁC:", tot)
