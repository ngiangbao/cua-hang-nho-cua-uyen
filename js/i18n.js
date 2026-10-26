// ===== Ngôn ngữ: tiếng Việt (gốc) hoặc tiếng Anh =====
// Mọi chữ hiển thị trong mã được bọc bằng L("...") hoặc L`...`. Tiếng Việt trả nguyên văn;
// tiếng Anh tra bảng EN (js/lang-en.js) theo mã băm của câu gốc. Đổi ngôn ngữ thì tải lại trang.
const LANG = (() => { try { return localStorage.getItem("chnu_lang") === "en" ? "en" : "vi"; } catch (e) { return "vi"; } })();
const LOCALE = LANG === "en" ? "en-GB" : "vi-VN";
let EN = {};
const i18nHash = s => { let x = 0x811c9dc5; for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 0x01000193) >>> 0; } return x.toString(36); };
const i18nHas = k => LANG === "en" && Object.prototype.hasOwnProperty.call(EN, i18nHash(k));
const i18nCache = new Map(), i18nTpl = new WeakMap();
function L(s, ...vals) {
  if (Array.isArray(s) && s.raw) {
    // Dùng như thẻ mẫu: khóa là câu gốc với {0}, {1}... thay cho các giá trị chèn vào
    let tr = i18nTpl.get(s);
    if (tr === undefined) {
      const key = s.map((q, i) => (i ? `{${i - 1}}` : "") + q).join("");
      tr = i18nHas(key) ? EN[i18nHash(key)] : null;
      i18nTpl.set(s, tr);
    }
    if (tr === null) { let out = s[0]; for (let i = 0; i < vals.length; i++) out += String(vals[i]) + s[i + 1]; return out; }
    return tr.replace(/\{(\d+)\}/g, (m, k) => k < vals.length ? String(vals[k]) : m);
  }
  if (typeof s !== "string" || LANG !== "en") return s;
  let r = i18nCache.get(s);
  if (r === undefined) { r = i18nHas(s) ? EN[i18nHash(s)] : s; i18nCache.set(s, r); }
  return r;
}
// Chữ cố định trong index.html (nút, nhãn, tiêu đề)
function translateStatic() {
  if (LANG !== "en") return;
  document.documentElement.lang = "en";
  document.title = L(document.title);
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walk.nextNode(); n; n = walk.nextNode()) {
    const t = n.nodeValue.trim();
    if (t && i18nHas(t)) n.nodeValue = n.nodeValue.replace(t, L(t));
  }
  document.querySelectorAll("[title], [placeholder], [aria-label]").forEach(e => ["title", "placeholder", "aria-label"].forEach(a => {
    const v = e.getAttribute(a); if (v && i18nHas(v)) e.setAttribute(a, L(v));
  }));
}
function setLang(l) { try { localStorage.setItem("chnu_lang", l); } catch (e) {} location.reload(); }
if (LANG === "en") document.write('<script src="js/lang-en.js"><\/script>');
