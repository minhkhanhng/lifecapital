// Gói 3 (xss-va-token): B1 tên triệu chứng tự thêm không chạy được HTML trong lời khuyên/tóm tắt; B6 token Google chỉ ở sessionStorage.
// Chạy sau loadDemo() trên trang dữ liệu thử. Khôi phục S, localStorage, sessionStorage khi xong; chỉ dùng dữ liệu giả.
window.E2EXSS = async function () {
  const out = [], ok = (id, pass, info) => out.push({ id, pass: !!pass, info: pass ? undefined : info });
  // Chốt an toàn (rule.md §12): test gọi wipeLocal, chỉ chạy khi trang đang là dữ liệu thử của loadDemo()
  if (!Object.values(S.ev || {}).some(L => (L || []).some(e => e && e.demo))) return { pass: 0, total: 1, fail: [{ id: "X0", pass: false, info: "Trang không phải dữ liệu thử: chạy loadDemo() trước" }] };
  const lsAll = st => { const o = {}; for (let i = 0; i < st.length; i++) { const k = st.key(i); o[k] = st.getItem(k); } return o; };
  const lsBefore = lsAll(localStorage), ssBefore = lsAll(sessionStorage), sBefore = JSON.stringify(S);
  const putAll = (st, snap) => { Object.keys(lsAll(st)).forEach(k => { if (!(k in snap)) st.removeItem(k); }); Object.keys(snap).forEach(k => { if (st.getItem(k) !== snap[k]) st.setItem(k, snap[k]); }); };
  const restoreAll = () => { putAll(localStorage, lsBefore); putAll(sessionStorage, ssBefore); S = JSON.parse(sBefore); lastRaw = localStorage.getItem("lc2"); saveFailed = false; draw(true); };
  const ls = k => localStorage.getItem(k), ss = k => sessionStorage.getItem(k);
  const gk = ["gcal_token", "gcal_token_exp", "gcal_linked", "gcal_client_id"];
  const gclear = () => gk.forEach(k => { localStorage.removeItem(k); sessionStorage.removeItem(k); });

  // ---- B1: tên triệu chứng tự thêm không được thành HTML
  try {
    S.health = S.health || {};
    const run = (name, label) => {
      S.health.syc = [{ id: "yxss", n: name, mt: 1 }];
      S.health.days = S.health.days || {};
      for (let i = 0; i < 7; i++) { const k = hlKAdd(tk, -i); S.health.days[k] = Object.assign({}, S.health.days[k], { sy: { yxss: 3 } }); }
      const box = document.createElement("div"); document.body.appendChild(box);
      try { box.innerHTML = hlAdviceHTML(hlAdvice(), 0) + "<p>" + hlSummary(tk) + "</p>"; return { box, adv: box.querySelector(".hl-adv") ? box.querySelector(".hl-adv").innerHTML : "", html: box.innerHTML }; }
      catch (e) { box.remove(); throw e; }
    };
    window.__xss = undefined;
    const r = run('<img src=x onerror="window.__xss=1">');
    const advBox = document.createElement("div"); advBox.innerHTML = hlAdviceHTML(hlAdvice(), 0);
    const sumBox = document.createElement("div"); sumBox.innerHTML = hlSummary(tk);
    await new Promise(res => setTimeout(res, 150));
    ok("X1.1 lời khuyên không tạo phần tử img", !advBox.querySelector("img"), advBox.innerHTML.slice(0, 200));
    ok("X1.2 hlSummary không tạo img", !sumBox.querySelector("img"), sumBox.innerHTML.slice(0, 200));
    ok("X1.3 window.__xss vẫn undefined", window.__xss === undefined, window.__xss);
    ok("X1.4 văn bản hiển thị vẫn chứa <img src=x", advBox.textContent.includes("<img src=x") && sumBox.textContent.includes("<img src=x"), [advBox.textContent.slice(0, 120), sumBox.textContent.slice(0, 120)]);
    r.box.remove();
    const r2 = run("Đau & mỏi");
    const a2 = document.createElement("div"); a2.innerHTML = hlAdviceHTML(hlAdvice(), 0);
    const s2 = document.createElement("div"); s2.innerHTML = hlSummary(tk);
    ok("X1.5 tên có & hiện đúng một lần escape", a2.textContent.includes("Đau & mỏi") && !a2.textContent.includes("&amp;") && s2.textContent.toLowerCase().includes("đau & mỏi") && !s2.textContent.includes("&amp;"), [a2.textContent.slice(0, 120), s2.textContent.slice(0, 120)]);
    r2.box.remove();
  } catch (e) { ok("X1.err", false, String(e && e.stack || e)); }
  finally { restoreAll(); }

  // ---- B6: token Google chỉ ở sessionStorage
  const orig = { google: window.google, flush: gcalFlush, render: renderSettingsModal, toast: showToast };
  try {
    gclear();
    // T6.1: callback thành công lưu vào sessionStorage
    let cfg = null;
    window.google = { accounts: { oauth2: { initTokenClient: c => { cfg = c; return { requestAccessToken() {} }; } } } };
    gcalFlush = () => {}; renderSettingsModal = () => {}; showToast = () => {};
    localStorage.setItem("gcal_client_id", "fake-client.apps.googleusercontent.com");
    S.cfg = S.cfg || {}; S.cfg.gcalClientId = "fake-client.apps.googleusercontent.com";
    initGCalTokenClient();
    cfg.callback({ access_token: "TOK1", expires_in: 3600 });
    ok("T6.1 callback: token ở sessionStorage, không ở localStorage", ss("gcal_token") === "TOK1" && !!ss("gcal_token_exp") && ls("gcal_token") === null && ls("gcal_token_exp") === null && ls("gcal_linked") === "1", [ss("gcal_token"), ls("gcal_token"), ls("gcal_token_exp")]);
    ok("T6.2 getGCalToken đọc từ sessionStorage", getGCalToken() === "TOK1" && isGCalConnected(), getGCalToken());
    gcalFlush = orig.flush; renderSettingsModal = orig.render; showToast = orig.toast; window.google = orig.google;
    // T6.3: di trú token cũ còn hạn
    gclear();
    localStorage.setItem("gcal_token", "OLD"); localStorage.setItem("gcal_token_exp", String(Date.now() + 3600e3)); localStorage.setItem("gcal_linked", "1");
    try { gcalMigrateToken(); } catch (e) { ok("T6.3err", false, String(e)); }
    ok("T6.3 di trú: token sang sessionStorage, localStorage hết token, gcal_linked còn", ss("gcal_token") === "OLD" && !!ss("gcal_token_exp") && ls("gcal_token") === null && ls("gcal_token_exp") === null && ls("gcal_linked") === "1", [ss("gcal_token"), ls("gcal_token"), ls("gcal_linked")]);
    // T6.4: token cũ đã hết hạn thì xóa, không chép
    gclear();
    localStorage.setItem("gcal_token", "EXP"); localStorage.setItem("gcal_token_exp", String(Date.now() - 1000)); localStorage.setItem("gcal_linked", "1");
    try { gcalMigrateToken(); } catch (e) { ok("T6.4err", false, String(e)); }
    ok("T6.4 token cũ hết hạn: bị xóa, không chép, gcal_linked còn", ss("gcal_token") === null && ls("gcal_token") === null && ls("gcal_token_exp") === null && ls("gcal_linked") === "1", [ss("gcal_token"), ls("gcal_token"), ls("gcal_linked")]);
    // T6.5: clearGCalToken và wipeLocal xóa cả hai nơi
    gclear();
    sessionStorage.setItem("gcal_token", "A"); sessionStorage.setItem("gcal_token_exp", "9999999999999");
    localStorage.setItem("gcal_token", "B"); localStorage.setItem("gcal_token_exp", "9999999999999");
    clearGCalToken();
    ok("T6.5a clearGCalToken xóa cả hai nơi", [ss("gcal_token"), ss("gcal_token_exp"), ls("gcal_token"), ls("gcal_token_exp")].every(v => v === null), [ss("gcal_token"), ls("gcal_token")]);
    sessionStorage.setItem("gcal_token", "A"); sessionStorage.setItem("gcal_token_exp", "9999999999999");
    localStorage.setItem("gcal_token", "B"); localStorage.setItem("gcal_token_exp", "9999999999999"); localStorage.setItem("gcal_linked", "1");
    wipeLocal();
    ok("T6.5b wipeLocal xóa cả hai nơi và cờ liên kết", [ss("gcal_token"), ss("gcal_token_exp"), ls("gcal_token"), ls("gcal_token_exp"), ls("gcal_linked")].every(v => v === null), [ss("gcal_token"), ls("gcal_token"), ls("gcal_linked")]);
    // T6.6: disconnectGoogleCalendar xóa token ở sessionStorage
    gclear();
    sessionStorage.setItem("gcal_token", "C"); sessionStorage.setItem("gcal_token_exp", "9999999999999"); localStorage.setItem("gcal_linked", "1");
    showToast = () => {}; renderSettingsModal = () => {};
    try { disconnectGoogleCalendar(); } finally { showToast = orig.toast; renderSettingsModal = orig.render; }
    ok("T6.6 disconnect: xóa token ở sessionStorage và cờ liên kết", ss("gcal_token") === null && ss("gcal_token_exp") === null && ls("gcal_linked") === null, [ss("gcal_token"), ls("gcal_linked")]);
  } catch (e) { ok("T6.err", false, String(e && e.stack || e)); }
  finally { window.google = orig.google; gcalFlush = orig.flush; renderSettingsModal = orig.render; showToast = orig.toast; restoreAll(); }

  const lA = lsAll(localStorage), sA = lsAll(sessionStorage);
  ok("X9.1 sau khi chạy: localStorage và sessionStorage như trước", JSON.stringify(lA) === JSON.stringify(lsBefore) && JSON.stringify(sA) === JSON.stringify(ssBefore), [Object.keys(lA).length, Object.keys(lsBefore).length]);
  ok("X9.2 sau khi chạy: S như trước", JSON.stringify(S) === sBefore, "S khác");
  const pass = out.filter(x => x.pass).length;
  return { pass, total: out.length, fail: out.filter(x => !x.pass) };
};
