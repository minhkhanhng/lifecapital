// Tìm nét viền màu đen/xám đậm: viền, outline, vòng box-shadow không nhòe. Nét đậm (độ sáng HSL < 45%) và ít màu (độ bão hòa < 35%) bị tính là "đen".
(() => {
  const parse = c => {
    let m = c.match(/rgba?\(([^)]+)\)/);
    if (m) { const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p[3] == null ? 1 : p[3]]; }
    m = c.match(/color\(srgb ([^)]+)\)/);
    if (m) { const p = m[1].split(/[ \/]+/).filter(Boolean).map(Number); return [p[0] * 255, p[1] * 255, p[2] * 255, p[3] == null ? 1 : p[3]]; }
    return null;
  };
  const hsl = c => { const r = c[0] / 255, g = c[1] / 255, b = c[2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; return { l, s: d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1)) }; };
  // Nền sáng: nét xám đậm/đen (sáng < 45%, ít màu) là "đen". Nền tối: chỉ nét gần đen (sáng < 15%) mới là "đen", nét sáng hơn nền là bình thường.
  const isDarkTheme = (() => { const c = parse(getComputedStyle(document.body).backgroundColor) || [255, 255, 255]; return hsl(c).l < 0.3; })() || matchMedia("(prefers-color-scheme: dark)").matches && !document.documentElement.matches('[data-theme="light"]') || document.documentElement.matches('[data-theme="dark"]');
  const dark = c => c && c[3] >= 0.2 && (() => { const h = hsl(c); return isDarkTheme ? h.l < 0.15 : h.l < 0.45 && h.s < 0.35; })();
  const vis = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none"; };
  const ovl = document.querySelector(".modal-overlay.open");
  const out = [];
  for (const el of (ovl || document.body).querySelectorAll("*")) {
    if (!vis(el) || el.closest("svg")) continue;
    if (!ovl && el.closest(".modal-overlay")) continue;
    if (el === document.activeElement) continue; // viền khi đặt con trỏ đo riêng
    const s = getComputedStyle(el), name = (el.className && typeof el.className === "string" ? el.className.split(" ").slice(0, 2).join(".") : el.tagName) + " " + (el.textContent || "").trim().slice(0, 14);
    for (const side of ["Top", "Right", "Bottom", "Left"]) {
      if (parseFloat(s["border" + side + "Width"]) > 0 && s["border" + side + "Style"] !== "none" && dark(parse(s["border" + side + "Color"]))) { out.push("viền " + side + " | " + name + " | " + s["border" + side + "Color"]); break; }
    }
    if (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0 && dark(parse(s.outlineColor))) out.push("outline | " + name + " | " + s.outlineColor);
    const sh = s.boxShadow;
    if (sh && sh !== "none") sh.split(/,(?![^(]*\))/).forEach(part => {
      const col = parse(part), nums = part.replace(/(rgba?|color)\([^)]*\)/, "").trim().replace("inset", "").trim().split(/\s+/).map(parseFloat);
      if (col && nums.length >= 4 && nums[2] === 0 && nums[3] > 0 && dark(col)) out.push("vòng bóng | " + name + " | " + part.trim());
    });
  }
  return [...new Set(out)];
})();
