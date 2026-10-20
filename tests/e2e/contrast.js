// Đo tương phản chữ (WCAG AA: 4.5:1, chữ lớn 3:1) và viền ô nhập (3:1) trên nền thực tế.
// Nền = các lớp nền của tổ tiên ghép chồng lên nền trang. Nền trang lấy trường hợp xấu nhất: màu nền và các mảng màu mờ.
(() => {
  const parse = c => {
    let m = c.match(/rgba?\(([^)]+)\)/);
    if (m) { const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p[3] == null ? 1 : p[3]]; }
    m = c.match(/color\(srgb ([^)]+)\)/);
    if (m) { const p = m[1].split(/[ \/]+/).filter(Boolean).map(Number); return [p[0] * 255, p[1] * 255, p[2] * 255, p[3] == null ? 1 : p[3]]; }
    return null;
  };
  const over = (f, b) => { const a = f[3]; return [f[0] * a + b[0] * (1 - a), f[1] * a + b[1] * (1 - a), f[2] * a + b[2] * (1 - a), 1]; };
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const cr = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const cs = getComputedStyle(document.documentElement);
  const tok = n => { const d = document.createElement("i"); d.style.color = `var(${n})`; document.body.appendChild(d); const c = parse(getComputedStyle(d).color); d.remove(); return c; };
  const bg = tok("--bg");
  const bases = [bg, ...["--blob-1", "--blob-2", "--blob-3", "--blob-4"].map(n => over(tok(n), bg))];
  // nền dưới popup: lớp phủ tối trên nền trang
  const ovl = document.querySelector(".modal-overlay.open");
  const ovC = ovl ? parse(getComputedStyle(ovl).backgroundColor) : null;
  const layers = el => { const L = []; let op = 1; for (let e = el; e && e !== document.documentElement; e = e.parentElement) { const s = getComputedStyle(e); op *= +s.opacity; const c = parse(s.backgroundColor); if (c && c[3] > 0) L.push(c); if (c && c[3] >= 0.999) break; if (e.classList && e.classList.contains("modal-overlay")) break; } return { L, op }; };
  const effBg = el => { const { L, op } = layers(el); return { list: bases.map(b0 => { let b = ovl && el.closest(".modal-overlay.open") && ovC ? over(ovC, b0) : b0; for (let i = L.length - 1; i >= 0; i--) b = over(L[i], b); return b; }), op }; };
  const vis = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none"; };
  const out = [];
  const root = ovl || document.body;
  for (const el of root.querySelectorAll("*")) {
    if (!vis(el) || el.closest("svg") || el.closest("[aria-hidden=true]") || el.closest(".sidebar .brand-logo")) continue;
    if (!ovl && el.closest(".modal-overlay")) continue;
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    const s = getComputedStyle(el);
    if (own && !el.disabled && !el.closest("[disabled]") && !el.closest(".yr-day.out")) {
      let fg = parse(s.color); if (!fg) { out.push({ k: "không đọc được màu", r: 0, need: 4.5, t: el.textContent.trim().slice(0, 20), cls: String(el.className).slice(0, 30), col: s.color }); continue; }
      const { list, op } = effBg(el);
      const size = parseFloat(s.fontSize), bold = +s.fontWeight >= 600;
      const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
      const min = Math.min(...list.map(b => cr(over([fg[0], fg[1], fg[2], fg[3] * op], b), b)));
      if (min < need) out.push({ k: "chữ", r: +min.toFixed(2), need, t: el.textContent.trim().slice(0, 24), cls: (el.className && typeof el.className === "string" ? el.className : el.tagName).slice(0, 40), col: s.color });
    }
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName) && !/checkbox|radio|color|range|hidden/.test(el.type) && parseFloat(s.borderTopWidth) > 0 && !el.classList.contains("quick-capture-input")) {
      const bc = parse(s.borderTopColor); if (!bc) { out.push({ k: "không đọc được màu", r: 0, need: 3, t: el.id || "", cls: el.tagName, col: s.borderTopColor }); continue; } const { list } = effBg(el.parentElement);
      const min = Math.min(...list.map(b => cr(over(bc, b), b)));
      if (min < 3) out.push({ k: "viền ô nhập", r: +min.toFixed(2), need: 3, t: el.id || el.getAttribute("aria-label") || el.placeholder || "", col: s.borderTopColor });
    }
  }
  return out;
})();
