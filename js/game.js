// ===== Cửa hàng nhỏ của Uyên — logic game =====
(() => {
"use strict";

// ---------- Tiện ích ----------
const $ = s => document.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const rand = Math.random;
const pick = a => a[Math.floor(rand() * a.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const money = n => (n < 0 ? "-" : "") + Math.abs(Math.round(n)).toLocaleString("vi-VN") + "đ";
const shortMoney = n => Math.abs(n) >= 1e6 ? (n / 1e6).toFixed(1).replace(".0", "") + "tr" : Math.round(n / 1000) + "k";
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const gauss = (x, mu, s) => Math.exp(-((x - mu) ** 2) / (2 * s * s));
const hearts = aff => { const h = Math.floor(aff / 20); return "❤".repeat(h) + "♡".repeat(5 - h); };
const stars = rep => { const n = Math.round(rep / 20 * 2) / 2; let s = ""; for (let i = 1; i <= 5; i++) s += `<i class="st ${n >= i ? "on" : n >= i - 0.5 ? "half" : "off"}">★</i>`; return s; };
const WEEKDAYS = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];
const weekday = d => WEEKDAYS[(d - 1) % 7];
const clock = t => String(Math.floor(t / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0");

const DAY_START = 7 * 60, DAY_END = 21 * 60, MS_PER_MIN = 300;
const POWER_ING = ["espresso", "foam", "matcha", "cam", "bo"];
const SAVE_KEY = slot => "chnu_save_" + slot;
const META_KEY = "chnu_meta";

// ---------- Trạng thái ----------
let S = null;     // dữ liệu được lưu
let slot = 1;     // ô lưu hiện tại
const R = {       // dữ liệu tạm trong ngày
  phase: "title", time: DAY_START, speed: 1, paused: false, acc: 0, uid: 0,
  customers: [], tickets: [], sel: null, cup: [], drip: false,
  today: null, weatherBy: {}, event: null, goals: [], clean: 100, cleanCd: false,
  regularsToday: [], sim: {}, cands: {}, bJob: null, lastSave: 0, dialog: null, criticDone: false, closingShown: false,
};

function newShop(loc, first) {
  return { loc, rep: first ? 10 : 25, decor: {}, staff: { waiter: null, cleaner: null, cashier: null, barista: null }, served: 0, perfect: 0, opened: S ? S.day : 1 };
}
function newState() {
  const st = {
    v: 1, money: 2000000, day: 1, shops: [], active: 0,
    inv: { phin: 40, sua_dac: 30, sua_tuoi: 20, duong: 40, tra: 20, chanh: 20, sa: 12, cacao: 12 },
    target: { phin: 40, sua_dac: 30, sua_tuoi: 20, duong: 30, tra: 20, chanh: 15, sa: 10, cacao: 10 },
    equip: {}, secrets: {}, chars: {}, history: [], achv: {},
    totals: { served: 0, perfect: 0, earned: 0, chats: 0 },
    flowBonus: 0, marketing: [], settings: { music: 0.5, sfx: 0.6, hints: true, musicOn: true },
    introDone: false, debtDays: 0, lastReport: null,
  };
  S = st; st.shops.push(newShop("hanoi", true));
  return st;
}
const shop = () => S.shops[S.active];
const loc = (sh = shop()) => LOCATIONS[sh.loc];

// ---------- Lưu / tải ----------
function snapshot() {
  if (R.phase !== "open" && R.phase !== "prepare") return null;
  return { phase: R.phase, time: R.time, today: R.today, weatherBy: R.weatherBy, event: R.event, goals: R.goals, clean: R.clean,
    regularsToday: R.regularsToday, sim: R.sim, cands: R.cands, criticDone: R.criticDone };
}
function save(silent) {
  if (!S) return;
  try {
    localStorage.setItem(SAVE_KEY(slot), JSON.stringify({ state: S, run: snapshot(), savedAt: Date.now() }));
    localStorage.setItem(META_KEY, JSON.stringify({ last: slot }));
    const d = $("#save-dot"); d.classList.add("on"); setTimeout(() => d.classList.remove("on"), 800);
    if (!silent) toast("💾 Đã lưu vào ô " + slot);
  } catch (e) { if (!silent) toast("Không lưu được (trình duyệt chặn bộ nhớ)", "bad"); }
}
function readSlot(n) { try { const raw = localStorage.getItem(SAVE_KEY(n)); return raw ? JSON.parse(raw) : null; } catch (e) { return null; } }
function lastSlot() { try { return (JSON.parse(localStorage.getItem(META_KEY)) || {}).last || null; } catch (e) { return null; } }
function migrate(st) {
  const base = newState();
  const merged = Object.assign(base, st);
  merged.settings = Object.assign(newState().settings, st.settings || {});
  merged.totals = Object.assign({ served: 0, perfect: 0, earned: 0, chats: 0 }, st.totals || {});
  return merged;
}
function loadData(data) {
  S = migrate(data.state);
  applySettings();
  const run = data.run;
  if (run && run.phase === "open") {
    Object.assign(R, { phase: "open", time: run.time, today: run.today, weatherBy: run.weatherBy, event: run.event, goals: run.goals,
      clean: run.clean, regularsToday: run.regularsToday || [], sim: run.sim || {}, cands: run.cands || {}, criticDone: run.criticDone,
      customers: [], tickets: [], sel: null, cup: [], bJob: null, paused: true, closingShown: false });
    closeModal(); buildScene(); renderAll();
    toast(`📂 Tiếp tục ngày ${S.day} lúc ${clock(R.time)}. Bấm ▶ để chơi tiếp.`, "gold");
    setPauseUI();
  } else if (run && run.phase === "prepare") {
    Object.assign(R, { phase: "prepare", today: run.today, weatherBy: run.weatherBy, event: run.event, goals: run.goals, cands: run.cands || {}, regularsToday: [], sim: {}, criticDone: false, clean: 100 });
    buildScene(); renderAll(); showPrepare();
  } else {
    prepareDay();
  }
}

// ---------- Co giãn khung ngang ----------
function fit() {
  const vp = $("#viewport"), cs = getComputedStyle(vp);
  const pl = parseFloat(cs.paddingLeft) || 0, pr = parseFloat(cs.paddingRight) || 0, pt = parseFloat(cs.paddingTop) || 0, pb = parseFloat(cs.paddingBottom) || 0;
  const w = innerWidth - pl - pr, h = innerHeight - pt - pb;
  const s = Math.min(w / 1600, h / 900);
  const st = $("#stage");
  st.style.transform = `scale(${s})`;
  st.style.left = pl + (w - 1600 * s) / 2 + "px";
  st.style.top = pt + (h - 900 * s) / 2 + "px";
}
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isStandalone = () => window.navigator.standalone === true || matchMedia("(display-mode: standalone), (display-mode: fullscreen)").matches;

// ---------- Thông báo ----------
function toast(msg, type) {
  const t = el("div", "toast" + (type ? " " + type : ""), msg);
  $("#toasts").appendChild(t);
  setTimeout(() => t.remove(), 3300);
  while ($("#toasts").children.length > 4) $("#toasts").firstChild.remove();
}
function floater(x, y, text, color) {
  const f = el("div", "floater", text);
  f.style.left = x + "px"; f.style.top = y + "px"; f.style.color = color || "#2a9d8f";
  $("#floaters").appendChild(f); setTimeout(() => f.remove(), 1900);
}
function speech(x, y, text) {
  const s = el("div", "speech", text);
  s.style.left = clamp(x, 6, 740) + "px"; s.style.top = y + "px";
  $("#floaters").appendChild(s); setTimeout(() => s.remove(), 3000);
}

// ---------- Kiểm tra mở khóa ----------
function ingAvail(k) {
  const I = INGREDIENTS[k];
  if (I.equip && !S.equip[I.equip]) return false;
  if (I.secret && !S.secrets[I.secret]) return false;
  return true;
}
function drinkAvail(id) {
  const d = DRINKS[id];
  if (d.equip && !S.equip[d.equip]) return false;
  if (d.secret && !S.secrets[id]) return false;
  return d.recipe.every(ingAvail);
}
const outageNow = () => R.event && R.event.outage && R.time >= R.event.outage[0] && R.time < R.event.outage[1];
const menuList = () => Object.keys(DRINKS).filter(drinkAvail).filter(id => !outageNow() || !DRINKS[id].recipe.some(k => POWER_ING.includes(k)));
function ingPrice(k) {
  let p = INGREDIENTS[k].cost || 0;
  if (R.event && R.event.priceUp && R.event.priceUp.includes(k)) p *= 1.3;
  if (R.event && R.event.discount) p *= 1 - R.event.discount;
  return Math.round(p / 100) * 100;
}
const traitOf = st => st && st.trait;
const hasTrait = (sh, t) => Object.values(sh.staff).some(s => s && s.trait === t);

// ---------- Thời tiết, sự kiện, mục tiêu ----------
function rollWeather(locId) {
  const table = {
    hanoi: ["nang", "nang", "mat", "mua", "nong", "lanh"], saigon: ["nong", "nong", "nang", "mua", "mua"],
    dalat: ["lanh", "lanh", "mat", "mat", "mua"], hoian: ["nang", "nong", "mua", "mat"],
    danang: ["nong", "nang", "nang", "mua"], hue: ["mua", "mua", "mat", "nang", "nong"],
  };
  return pick(table[locId]);
}
function makeGoals() {
  const menu = menuList();
  const n = clamp(8 + S.day, 10, 45);
  const pool = [
    { type: "served", n, text: `Phục vụ ${n} ly`, reward: 150000 + S.day * 5000 },
    { type: "perfect", n: Math.round(n * 0.6), text: `${Math.round(n * 0.6)} ly hoàn hảo`, reward: 200000 + S.day * 5000 },
    { type: "revenue", n: Math.round((500000 + S.day * 120000 * S.shops.length) / 50000) * 50000, reward: 200000 },
    { type: "chat", n: 3, text: "Trò chuyện với 3 khách", reward: 120000 },
    { type: "nolost", n: 0, text: "Không để khách nào bỏ đi", reward: 250000 },
  ];
  pool[2].text = `Doanh thu chuỗi ${money(pool[2].n)}`;
  const d = pick(menu), dn = 3 + Math.floor(S.day / 4);
  pool.push({ type: "drink", id: d, n: dn, text: `Bán ${dn} ly ${DRINKS[d].name}`, reward: 180000 });
  return shuffle(pool).slice(0, 3).map(g => Object.assign(g, { done: false }));
}
function goalProgress(g) {
  const T = R.today; if (!T) return 0;
  switch (g.type) {
    case "served": return T.served;
    case "perfect": return T.perfect;
    case "revenue": return chainRevenueToday();
    case "chat": return T.chats;
    case "drink": return T.drinks[g.id] || 0;
    case "nolost": return T.lostActive;
  }
  return 0;
}
function checkGoals() {
  for (const g of R.goals) {
    if (g.done || g.type === "nolost") continue;
    if (goalProgress(g) >= g.n) {
      g.done = true; S.money += g.reward; R.today.bonus += g.reward; shop().rep = clamp(shop().rep + 1, 0, 100);
      toast(`🎯 Hoàn thành: ${g.text} (+${money(g.reward)})`, "gold"); Sound.sfx("perfect");
    }
  }
  renderGoals();
}
function chainRevenueToday() { return Object.values(R.today.shops).reduce((a, s) => a + s.revenue + s.tips, 0); }

// ---------- Chuẩn bị ngày mới ----------
function newToday() {
  const shops = {};
  S.shops.forEach((sh, i) => shops[i] = { served: 0, perfect: 0, lost: 0, revenue: 0, tips: 0, open: i === S.active || !!sh.staff.barista });
  return { shops, served: 0, perfect: 0, chats: 0, drinks: {}, purchases: 0, marketing: 0, eventCost: 0, bonus: 0, lostActive: 0, shortage: {} };
}
function genCandidate(role) {
  const g = rand() < 0.5 ? "f" : "m";
  const skill = clamp(1 + Math.floor(rand() * rand() * 5.5), 1, 5);
  const [lo, hi] = ROLES[role].wage;
  const wage = Math.round((lo + (hi - lo) * ((skill - 1) / 4) * (0.85 + rand() * 0.3)) / 5000) * 5000;
  const look = randLook(g, "young"); look.shirt = "apron"; look.sc = pick(["#e07a5f", "#2a9d8f", "#f4a261", "#8338ec", "#3a86ff"]);
  return { name: pick(HO) + " " + pick(g === "f" ? TEN_F : TEN_M), look, skill, wage, trait: pick(TRAITS).id, days: 0, role };
}
function genCands() {
  R.cands = {};
  S.shops.forEach((sh, i) => { R.cands[i] = {}; ROLE_ORDER.forEach(r => R.cands[i][r] = [genCandidate(r), genCandidate(r), genCandidate(r)]); });
}
function prepareDay() {
  R.phase = "prepare";
  R.weatherBy = {}; S.shops.forEach(sh => R.weatherBy[sh.loc] = rollWeather(sh.loc));
  R.event = S.day > 1 && rand() < 0.38 ? Object.assign({}, pick(EVENTS)) : null;
  R.today = newToday();
  R.goals = makeGoals();
  R.regularsToday = []; R.sim = {}; R.criticDone = false; R.clean = 100;
  R.customers = []; R.tickets = []; R.sel = null; R.cup = []; R.bJob = null; R.closingShown = false;
  genCands();
  if (R.event && R.event.cost) { S.money -= R.event.cost; R.today.eventCost += R.event.cost; }
  autoRestock();
  buildScene(); renderAll();
  save(true);
  showPrepare();
}
function autoRestock() {
  if (!S.shops.some(sh => sh.staff.cashier)) return;
  let cost = 0, bought = 0;
  for (const k in S.target) {
    if (!ingAvail(k) || INGREDIENTS[k].free) continue;
    const need = Math.max(0, (S.target[k] || 0) - (S.inv[k] || 0));
    if (!need) continue;
    const c = need * ingPrice(k);
    if (S.money - c < 0) continue;
    S.money -= c; cost += c; bought += need; S.inv[k] = (S.inv[k] || 0) + need;
  }
  if (bought) { R.today.purchases += cost; toast(`💁 Thu ngân đã nhập ${bought} phần nguyên liệu (${money(cost)})`); }
}
function openDay() {
  R.phase = "open"; R.time = DAY_START; R.acc = 0; R.paused = false;
  // Quán không có pha chế và Uyên không đứng -> đóng cửa
  S.shops.forEach((sh, i) => R.today.shops[i].open = i === S.active || !!sh.staff.barista);
  closeModal(); buildScene(); renderAll(); setPauseUI();
  Sound.setStyle(shop().loc);
  Sound.sfx("day");
  toast(`☀️ ${loc().city} mở cửa! Chúc Uyên một ngày đắt khách.`, "gold");
  save(true);
}

// ---------- Vòng lặp ----------
let lastFrame = performance.now();
function frame(now) {
  const dt = Math.min(120, now - lastFrame); lastFrame = now;
  if (R.phase === "open" && !R.paused && $("#modal").classList.contains("hidden") && !R.dialog) {
    R.acc += dt * R.speed;
    while (R.acc >= MS_PER_MIN) { R.acc -= MS_PER_MIN; tickMinute(); if (R.phase !== "open") break; }
  }
  requestAnimationFrame(frame);
}

function lambda(i, t) {
  const sh = S.shops[i], L = LOCATIONS[sh.loc], W = WEATHER[R.weatherBy[sh.loc] || "nang"];
  const h = t / 60;
  let curve = 0.45 + 1.0 * gauss(h, 8, 1) + 0.7 * gauss(h, 12.5, 0.8) + 0.9 * gauss(h, 18, 1.2);
  if (R.event && R.event.evening && h >= 18) curve *= R.event.evening;
  const weekend = (S.day - 1) % 7 >= 5 ? 1.25 : 1;
  let mk = 1;
  for (const m of S.marketing) if (m.scope === "all" || i === S.active) mk += m.boost;
  const d = sh.decor;
  const ac = d.may_lanh ? (R.weatherBy[sh.loc] === "nong" ? 1.25 : 1.1) : 1;
  return 0.06 * curve * L.flow * (0.6 + sh.rep / 100 * 0.9) * W.flow * ((R.event && R.event.flow) || 1) * weekend * mk * (1 + S.flowBonus) * (d.bien_neon ? 1.15 : 1) * ac;
}
function maxSlots() { return Math.min(6, 3 + (shop().decor.ban_ghe || 0)); }

function tickMinute() {
  R.time++;
  const sh = shop();
  // Khách mới
  if (R.time < DAY_END) {
    if (rand() < lambda(S.active, R.time)) spawnCustomer();
    if (R.event && R.event.critic && !R.criticDone && R.time > 10 * 60 && rand() < 0.01) spawnCustomer(true);
  } else if (!R.closingShown) {
    R.closingShown = true; $("#closed-sign").textContent = "🔒 Đã đóng cửa"; $("#closed-sign").classList.remove("hidden");
    toast("🌙 21:00 — Quán ngừng nhận khách mới. Phục vụ nốt khách đang chờ nhé!");
    R.customers.filter(c => c.state === "order").forEach(c => leave(c, "quiet"));
  }
  // Kiên nhẫn
  for (const c of R.customers.slice()) {
    if (c.state === "order" || c.state === "drink") {
      c.pat -= 1; c.wait++;
      if (c.pat <= 0) { leave(c, "angry"); continue; }
      if (c.state === "order" && sh.staff.waiter && c.wait >= Math.max(1, 4 - sh.staff.waiter.skill * 0.6)) takeOrder(c);
    }
  }
  // Pha chế tự động tại quán Uyên đứng
  baristaTick();
  // Các quán khác tự vận hành
  S.shops.forEach((s, i) => { if (i !== S.active && R.today.shops[i].open) simTick(i); });
  // Hết giờ
  if (R.time >= DAY_END + 60) R.customers.slice().forEach(c => leave(c, "quiet"));
  if (R.time >= DAY_END && !R.customers.length && R.time > DAY_END + 2) { endDay(); return; }
  if (R.time % 30 === 0) save(true);
  renderHud(); updateBars();
}

// ---------- Khách hàng ----------
const SKINS = ["#fde0c5", "#f6d5b5", "#f1c27d", "#e0ac69", "#d9a066", "#c68642", "#f3cfa8", "#eab991", "#ffe0cc"];
const HAIRC = ["#1d1410", "#2b1b12", "#3b2314", "#5a3825", "#7b4b2a", "#1a1a1a", "#c0392b", "#e0b15a", "#6d4c41", "#8e44ad"];
const SHIRTC = ["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#8338ec", "#ff8c42", "#3a86ff", "#f15bb5", "#80ed99", "#ffafcc", "#90be6d", "#f9844a", "#4cc9f0"];
function randLook(g, age) {
  g = g || (rand() < 0.5 ? "f" : "m");
  age = age || pick(["young", "young", "young", "mid", "mid", "old"]);
  const hairs = g === "f" ? ["long", "bob", "pony", "bun", "long", "curly", "side"] : ["short", "side", "spiky", "curly", "cap", "short", "beanie"];
  const hair = age === "old" && g === "m" ? pick(["bald", "short", "side"]) : pick(hairs);
  const hc = age === "old" ? pick(["#bdbdbd", "#e0e0e0", "#9e9e9e"]) : pick(HAIRC);
  const acc = [];
  if (rand() < 0.2) acc.push("glasses");
  else if (rand() < 0.08) acc.push("sunglasses");
  if (g === "f" && rand() < 0.3) acc.push("earrings");
  if (g === "m" && age !== "young" && rand() < 0.25) acc.push("mustache");
  if (age === "young" && rand() < 0.08 && hair !== "cap") acc.push("headphones");
  if (rand() < 0.08) acc.push("scarf");
  return { g, age, skin: pick(SKINS), hair, hc, shirt: pick(["tee", "tee", "shirt", "hoodie", "blouse", "flannel", "tie", "hawaii"]), sc: pick(SHIRTC), acc };
}
function genName(look) {
  const t = pick(look.g === "f" ? TEN_F : TEN_M);
  const pre = { f: { young: "Bạn", mid: "Chị", old: "Bà" }, m: { young: "Bạn", mid: "Anh", old: "Ông" } }[look.g][look.age];
  return pre + " " + t;
}
function pickDrink(i, favs) {
  const menu = menuList(); if (!menu.length) return "den_da";
  if (favs) { const f = favs.filter(x => menu.includes(x)); if (f.length && rand() < 0.65) return pick(f); }
  const sh = S.shops[i], W = WEATHER[R.weatherBy[sh.loc] || "nang"], spec = LOCATIONS[sh.loc].specialty;
  const w = menu.map(id => { const d = DRINKS[id]; let x = d.hot ? W.hot : clamp(2 - W.hot * 0.6, 0.3, 2); if (id === spec) x *= 2.2; if (d.secret) x *= 0.6; return x; });
  let r = rand() * w.reduce((a, b) => a + b, 0);
  for (let k = 0; k < menu.length; k++) { r -= w[k]; if (r <= 0) return menu[k]; }
  return menu[0];
}
function availableRegulars() {
  const sh = shop();
  const here = new Set(R.customers.filter(c => c.reg).map(c => c.reg.id));
  const daysHere = S.day - (sh.opened || 1) + 1;
  return CHARACTERS.filter(ch => {
    if (R.regularsToday.includes(ch.id) || here.has(ch.id)) return false;
    if (ch.loc === "global") return S.day >= ch.day || (ch.id === "linh" && S.marketing.some(m => m.id === "kol"));
    return ch.loc === sh.loc && daysHere >= ch.day;
  });
}
function freeSlot() {
  const n = maxSlots(), used = new Set(R.customers.map(c => c.slot));
  const free = []; for (let i = 0; i < n; i++) if (!used.has(i)) free.push(i);
  return free.length ? pick(free) : -1;
}
const slotX = (i, n) => n <= 1 ? 420 : 24 + i * ((1010 - 190) / (n - 1));
function spawnCustomer(critic) {
  const s = freeSlot();
  if (s < 0) { R.today.shops[S.active].lost++; return; }
  const sh = shop();
  let c;
  const regs = critic ? [] : availableRegulars();
  if (critic) {
    R.criticDone = true;
    c = { reg: null, critic: true, name: "Nhà phê bình", look: { g: "m", age: "mid", skin: "#f1c27d", hair: "side", hc: "#2b1b12", shirt: "tie", sc: "#2b2d42", acc: ["glasses", "beret"] }, drink: pickDrink(S.active), patF: 0.8 };
  } else if (regs.length && rand() < 0.32) {
    const ch = pick(regs); R.regularsToday.push(ch.id);
    if (!S.chars[ch.id]) S.chars[ch.id] = { aff: 0, met: false, chatIdx: 0, story: 0, visits: 0 };
    S.chars[ch.id].visits++;
    c = { reg: ch, name: ch.name, look: ch.look, drink: pickDrink(S.active, ch.fav), patF: ch.patience };
  } else {
    const look = randLook();
    c = { reg: null, name: genName(look), look, drink: pickDrink(S.active), patF: 0.8 + rand() * 0.5 };
  }
  const pf = c.patF * (sh.staff.waiter ? 1.25 : 1) * (sh.decor.loa_jazz ? 1.15 : 1) * (hasTrait(sh, "vui") ? 1.1 : 1);
  Object.assign(c, { uid: ++R.uid, slot: s, state: "walking", wait: 0, chatted: false, tipBonus: 0, maxOrder: Math.round(55 * pf), maxDrink: Math.round(110 * pf) });
  c.pat = c.max = c.maxOrder;
  mountCustomer(c, c.critic ? "📝 " : c.reg ? "💖 " : "");
}
function mountCustomer(c, badge, onArrive) {
  R.customers.push(c);
  const e = el("div", "customer walking");
  e.style.left = "1100px";
  e.innerHTML = Art.person(c.look, "neutral") + `<div class="bubble"></div><div class="nametag ${c.reg || c.tut ? "reg" : ""}">${badge}${c.name}</div>`;
  e.addEventListener("click", () => clickCustomer(c));
  c.el = e; $("#customers").appendChild(e);
  requestAnimationFrame(() => requestAnimationFrame(() => { e.style.left = slotX(c.slot, maxSlots()) + "px"; }));
  setTimeout(() => { if (c.state !== "walking") return; c.state = "order"; e.classList.remove("walking"); renderBubble(c); Sound.sfx("bell"); if (onArrive) onArrive(); }, 1400);
  renderBubble(c);
}
function storyPending(c) {
  if (!c.reg) return null;
  const cs = S.chars[c.reg.id]; const st = c.reg.story[cs.story];
  return st && cs.aff >= st.h * 20 ? st : null;
}
function renderBubble(c) {
  if (!c.el) return;
  const b = c.el.querySelector(".bubble");
  const pct = clamp(c.pat / c.max * 100, 0, 100);
  const col = pct > 50 ? "#52b788" : pct > 25 ? "#f4a261" : "#e63946";
  const pbar = `<div class="pbar"><div style="width:${pct}%;background:${col}"></div></div>`;
  if (c.state === "walking") b.innerHTML = `<span class="big">👋</span>`;
  else if (c.state === "order") b.innerHTML = `<span class="big">${storyPending(c) ? "💖" : "💬"}</span>${pbar}`;
  else if (c.state === "drink") b.innerHTML = `<span class="mini-cup">${Art.drinkIcon(c.drink)}</span>${DRINKS[c.drink].name}${!c.chatted ? " 💬" : ""}${storyPending(c) ? " 💖" : ""}${pbar}`;
  else b.innerHTML = c.say || "";
}
function updateBars() {
  for (const c of R.customers) {
    if (!c.el) continue;
    const bar = c.el.querySelector(".pbar div");
    if (bar) { const pct = clamp(c.pat / c.max * 100, 0, 100); bar.style.width = pct + "%"; bar.style.background = pct > 50 ? "#52b788" : pct > 25 ? "#f4a261" : "#e63946"; }
  }
  document.querySelectorAll(".ticket").forEach(t => {
    const c = R.customers.find(x => x.uid == t.dataset.id); if (!c) return;
    const d = t.querySelector(".pbar div"); const pct = clamp(c.pat / c.max * 100, 0, 100);
    d.style.width = pct + "%"; d.style.background = pct > 50 ? "#52b788" : pct > 25 ? "#f4a261" : "#e63946";
  });
}
function custPos(c) { return { x: slotX(c.slot, maxSlots()), y: 250 }; }
function takeOrder(c) {
  if (c.state !== "order") return;
  c.state = "drink"; c.pat = c.max = c.maxDrink;
  R.tickets.push({ id: c.uid, drink: c.drink });
  if (R.sel == null) R.sel = c.uid;
  renderBubble(c); renderTickets(); renderBench(); Sound.sfx("pop");
}
function removeCustomer(c) {
  R.customers = R.customers.filter(x => x !== c);
  R.tickets = R.tickets.filter(t => t.id !== c.uid);
  if (R.bJob && R.bJob.id === c.uid) R.bJob = null;
  if (R.sel === c.uid) R.sel = R.tickets.find(t => !t.barista) ? R.tickets.find(t => !t.barista).id : null;
  if (R.dialog && R.dialog.c === c) closeDialog();
  if (c.el) { c.el.classList.add("leaving"); c.el.style.left = (c.slot < 3 ? -200 : 1150) + "px"; setTimeout(() => c.el.remove(), 1400); }
  renderTickets(); renderBench(); renderStaff();
}
function setMood(c, mood) {
  if (!c.el) return;
  const old = c.el.querySelector(".person"); const tmp = el("div", null, Art.person(c.look, mood));
  old.replaceWith(tmp.firstElementChild);
}
function leave(c, how) {
  if (how === "angry") {
    const sh = shop();
    sh.rep = clamp(sh.rep - 1.2, 0, 100);
    R.today.shops[S.active].lost++; R.today.lostActive++;
    if (c.reg) S.chars[c.reg.id].aff = clamp(S.chars[c.reg.id].aff - 3, 0, 100);
    setMood(c, "angry");
    const p = custPos(c); speech(p.x - 30, p.y - 10, (c.reg && c.reg.sad[0] && rand() < 0.3 ? c.reg.sad[0] : pick(GEN.leave)));
    Sound.sfx("error");
    const g = R.goals.find(g => g.type === "nolost"); if (g) renderGoals();
  }
  c.state = "gone";
  removeCustomer(c);
}

// ---------- Hội thoại ----------
function openDialog(look, name, text, choices, extra) {
  R.dialog = Object.assign({ look }, extra || {});
  $("#dlg-portrait").innerHTML = Art.person(look, (extra && extra.mood) || "happy");
  $("#dlg-name").innerHTML = name;
  $("#dlg-text").textContent = text;
  const box = $("#dlg-choices"); box.innerHTML = "";
  for (const ch of choices) {
    const b = el("button", ch.main ? "main" : "", ch.label);
    b.addEventListener("click", () => { Sound.sfx("click"); ch.fn(); });
    box.appendChild(b);
  }
  $("#dialog").classList.remove("hidden");
}
function closeDialog() { R.dialog = null; $("#dialog").classList.add("hidden"); }
function dlgName(c) {
  if (c.critic) return `📝 Nhà phê bình <small>Khách đặc biệt</small>`;
  if (!c.reg) return `${c.name} <small>Khách vãng lai</small>`;
  const cs = S.chars[c.reg.id];
  return `${c.reg.name} <small>${c.reg.title}</small><span class="hearts">${hearts(cs.aff)}</span>`;
}
function clickCustomer(c) {
  if (c.tut) return tutClickCustomer(c);
  if (c.state !== "order" && c.state !== "drink") return;
  Sound.sfx("click");
  if (c.reg && !S.chars[c.reg.id].met) {
    S.chars[c.reg.id].met = true;
    toast(`💞 Làm quen với ${c.reg.name} — ${c.reg.title}!`, "gold");
    renderDockDots();
  }
  showCustomerMenu(c);
}
function showCustomerMenu(c, overrideText) {
  const d = DRINKS[c.drink];
  let text;
  if (overrideText) text = overrideText;
  else if (c.state === "order") {
    const greet = c.critic ? "Chào cô chủ. Tôi muốn thưởng thức món ngon nhất của quán." : pick(c.reg ? c.reg.greet : GEN.greet);
    text = greet + " " + pick(GEN.order).replace("{d}", d.name);
  } else text = pick(["Mình đang đợi ", "Không vội đâu, ", "Ly "]) + d.name + (rand() < 0.5 ? " nha!" : " của mình sắp xong chưa?");
  const choices = [];
  if (c.state === "order") choices.push({ label: `📝 Nhận order: ${d.name}`, main: true, fn: () => { takeOrder(c); closeDialog(); } });
  const st = storyPending(c);
  if (st) choices.push({ label: "💖 Nghe chuyện", fn: () => playStory(c, st) });
  if (!c.chatted && !c.critic) choices.push({ label: "💬 Trò chuyện", fn: () => chat(c) });
  choices.push({ label: c.state === "order" ? "⏳ Đợi chút nhé" : "👌 Đóng", fn: closeDialog });
  openDialog(c.look, dlgName(c), text, choices, { c, mood: "neutral" });
}
function chat(c) {
  c.chatted = true; R.today.chats++; S.totals.chats++;
  let topic;
  if (c.reg) { const cs = S.chars[c.reg.id]; topic = c.reg.chats[cs.chatIdx % c.reg.chats.length]; cs.chatIdx++; if (cs.chatIdx > c.reg.chats.length) topic = pick(GEN.chats); }
  else topic = pick(GEN.chats);
  const choices = shuffle(topic.a).map(([label, delta, reply]) => ({ label, fn: () => {
    if (c.reg) {
      const cs = S.chars[c.reg.id], before = Math.floor(cs.aff / 20);
      cs.aff = clamp(cs.aff + delta, 0, 100);
      const after = Math.floor(cs.aff / 20);
      if (after > before) { toast(`💖 ${c.reg.name} đã lên ${after} tim!`, "gold"); Sound.sfx("heart"); }
    } else c.tipBonus += delta * 0.02;
    if (delta > 0) c.pat = Math.min(c.max, c.pat + 25);
    const p = custPos(c);
    floater(p.x + 40, p.y, delta >= 5 ? "💖💖" : delta > 0 ? "💖" : delta < 0 ? "💔" : "😐", delta < 0 ? "#e63946" : "#ff4d6d");
    renderBubble(c); checkGoals();
    openDialog(c.look, dlgName(c), reply, [{ label: "▶ Tiếp tục", main: true, fn: () => showCustomerMenu(c, c.state === "order" ? "À mà, " + pick(GEN.order).replace("{d}", DRINKS[c.drink].name).toLowerCase() : "Nói chuyện với Uyên vui ghê!") }], { c, mood: delta > 0 ? "happy" : delta < 0 ? "sad" : "neutral" });
  } }));
  openDialog(c.look, dlgName(c), topic.q, choices, { c, mood: "neutral" });
}
function playStory(c, st) {
  let i = 0;
  const step = () => {
    if (i < st.lines.length) {
      const line = st.lines[i++];
      openDialog(c.look, dlgName(c), line, [{ label: i < st.lines.length ? "▶ Tiếp" : "💖 Cảm ơn nhé!", main: true, fn: step }], { c, mood: "happy" });
    } else {
      const cs = S.chars[c.reg.id]; cs.story++;
      applyReward(st.reward, c.reg.name);
      Sound.sfx("heart");
      renderBubble(c);
      showCustomerMenu(c, "Cảm ơn Uyên đã lắng nghe nha!");
    }
  };
  step();
}
function applyReward(rw, who) {
  const parts = [];
  if (rw.money) { S.money += rw.money; R.today.bonus += rw.money; parts.push("+" + money(rw.money)); }
  if (rw.rep) { shop().rep = clamp(shop().rep + rw.rep, 0, 100); parts.push(`+${rw.rep} uy tín`); }
  if (rw.flow) { S.flowBonus += rw.flow; parts.push(`+${Math.round(rw.flow * 100)}% khách toàn chuỗi`); }
  if (rw.recipe) { S.secrets[rw.recipe] = true; parts.push(`Công thức bí mật: ${DRINKS[rw.recipe].name}!`); renderIngredients(); }
  toast(`🎁 Quà từ ${who}: ${parts.join(", ")}`, "gold");
  checkAchv(); renderHud();
}

// ---------- Pha chế ----------
function grade(cup, recipe) {
  if (cup.length === recipe.length && cup.every((x, i) => x === recipe[i])) return "perfect";
  const cnt = a => a.reduce((m, k) => (m[k] = (m[k] || 0) + 1, m), {});
  const a = cnt(cup), b = cnt(recipe);
  let diff = 0;
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diff += Math.abs((a[k] || 0) - (b[k] || 0));
  if (diff === 0) return "good";
  if (diff <= 1 && cup.length >= recipe.length - 1) return "ok";
  return "wrong";
}
function addIngredient(k) {
  if (R.phase === "tutorial") return tutIngredient(k);
  if (R.phase !== "open") { toast("Quán chưa mở cửa đâu Uyên ơi!", "bad"); return; }
  if (R.drip) return;
  if (!ingAvail(k)) { const I = INGREDIENTS[k]; toast(`🔒 Cần mua ${EQUIPMENT[I.equip] ? EQUIPMENT[I.equip].name : "công thức"} để dùng ${I.name}`, "bad"); return; }
  if (outageNow() && POWER_ING.includes(k)) { toast("🔌 Đang cúp điện, máy không chạy được!", "bad"); return; }
  const I = INGREDIENTS[k];
  if (!I.free && (S.inv[k] || 0) <= 0) { toast(`📦 Hết ${I.name}! Vào Kho để nhập thêm.`, "bad"); Sound.sfx("error"); return; }
  if (R.cup.length >= 7) { toast("Ly đầy rồi!", "bad"); return; }
  if (!I.free) S.inv[k]--;
  R.cup.push(k);
  Sound.sfx(k === "da" ? "ice" : ["phin", "espresso", "nuoc_nong", "sua_tuoi", "sua_dac", "tra"].includes(k) ? "pour" : "pop");
  if (k === "phin" || k === "espresso") {
    R.drip = true; renderBench(true); renderIngredients();
    setTimeout(() => { R.drip = false; renderBench(); renderIngredients(); }, (k === "phin" ? 1100 : 600) / Math.max(1, R.speed * 0.7));
  } else { renderBench(); renderIngredients(); }
}
function serve() {
  if (R.phase === "tutorial") return tutServe();
  const t = R.tickets.find(t => t.id === R.sel);
  if (!t) { toast("Chọn phiếu order cần phục vụ trước nhé!", "bad"); return; }
  if (!R.cup.length) { toast("Ly còn trống trơn!", "bad"); return; }
  const c = R.customers.find(x => x.uid === t.id);
  const q = grade(R.cup, DRINKS[t.drink].recipe);
  R.cup = [];
  resolveServe(c, q, false);
}
function resolveServe(c, q, byStaff) {
  const sh = shop(), d = DRINKS[c.drink], L = loc(sh), T = R.today.shops[S.active];
  const price = d.price * (L.specialty === c.drink ? 1.2 : 1);
  const payRate = { perfect: 1, good: 1, ok: 0.7, wrong: 0 }[q];
  let tipRate = { perfect: 0.15, good: 0.06, ok: 0, wrong: 0 }[q];
  if (q !== "wrong") {
    tipRate += (c.pat / c.max) * 0.08 + c.tipBonus + (sh.decor.cay_xanh ? 0.05 : 0) + (sh.staff.cashier ? 0.1 : 0) + (sh.decor.may_lanh ? 0.05 : 0) + ((R.event && R.event.tip) || 0) + (hasTrait(sh, "duyen") ? 0.05 : 0);
    tipRate *= c.reg ? c.reg.tip : 1;
    if (R.clean < 50) tipRate *= 0.5;
  }
  const pay = Math.round(price * payRate / 1000) * 1000;
  const tip = Math.max(0, Math.round(price * tipRate / 1000) * 1000);
  S.money += pay + tip; S.totals.earned += pay + tip;
  T.revenue += pay; T.tips += tip;
  if (q !== "wrong") {
    T.served++; R.today.served++; sh.served++; S.totals.served++;
    R.today.drinks[c.drink] = (R.today.drinks[c.drink] || 0) + 1;
  }
  if (q === "perfect") { T.perfect++; R.today.perfect++; sh.perfect++; S.totals.perfect++; }
  let dRep = { perfect: 0.6, good: 0.3, ok: -0.2, wrong: -1 }[q];
  if (dRep > 0 && sh.decor.tranh) dRep *= 1.2;
  if (R.clean < 25) dRep -= 0.2;
  if (c.critic) {
    if (q === "perfect") { dRep += 8; toast("📝 Nhà phê bình chấm quán 5 sao! +8 uy tín", "gold"); }
    else { dRep -= 4; toast("📝 Nhà phê bình có vẻ không hài lòng... -4 uy tín", "bad"); }
  }
  sh.rep = clamp(sh.rep + dRep, 0, 100);
  if (c.reg) {
    const cs = S.chars[c.reg.id], before = Math.floor(cs.aff / 20);
    cs.aff = clamp(cs.aff + ({ perfect: 4, good: 2, ok: -1, wrong: -4 }[q]) + (q === "perfect" && c.reg.fav.includes(c.drink) ? 2 : 0), 0, 100);
    const after = Math.floor(cs.aff / 20);
    if (after > before) { toast(`💖 ${c.reg.name} đã lên ${after} tim!`, "gold"); Sound.sfx("heart"); }
  }
  if (!sh.staff.cleaner) R.clean = clamp(R.clean - 4, 0, 100);
  // Phản ứng
  const p = custPos(c);
  const mood = q === "wrong" ? "angry" : q === "ok" ? "sad" : q === "perfect" ? "happy" : "neutral";
  setMood(c, mood);
  const lines = c.reg && q !== "wrong" ? (q === "ok" ? c.reg.sad : c.reg.happy) : GEN[q];
  speech(p.x - 20, p.y - 10, pick(lines).replace("{d}", d.name));
  const label = { perfect: "Hoàn hảo! ", good: "Ngon! ", ok: "Tạm được ", wrong: "Sai món! " }[q];
  floater(p.x + 20, p.y + 50, label + (pay + tip ? "+" + money(pay + tip) : ""), q === "wrong" ? "#e63946" : q === "perfect" ? "#e07a5f" : "#2a9d8f");
  Sound.sfx(q === "perfect" ? "perfect" : q === "wrong" ? "error" : "coin");
  if (q !== "wrong") setTimeout(() => Sound.sfx("coin"), 250);
  c.state = "served";
  c.el.querySelector(".bubble").innerHTML = `<span class="big">${{ perfect: "😍", good: "😊", ok: "😕", wrong: "😠" }[q]}</span>`;
  R.tickets = R.tickets.filter(t => t.id !== c.uid);
  if (R.sel === c.uid) R.sel = null;
  if (R.sel == null) { const nt = R.tickets.find(t => !t.barista); R.sel = nt ? nt.id : null; }
  renderTickets(); renderBench(); renderIngredients();
  setTimeout(() => removeCustomer(c), 1300);
  checkGoals(); checkAchv(); renderHud(); renderStats();
}

// ---------- Nhân viên ----------
function baristaTime(b) { return Math.max(6, 20 - b.skill * 2.5 - (b.trait === "cham" ? 3 : 0)); }
function baristaQuality(b) {
  const r = rand(), pp = 0.55 + b.skill * 0.08 + (b.trait === "can" ? 0.1 : 0);
  return r < pp ? "perfect" : r < pp + (1 - pp) * 0.75 ? "good" : "ok";
}
function hasStock(recipe) {
  const need = {};
  for (const k of recipe) if (!INGREDIENTS[k].free) need[k] = (need[k] || 0) + 1;
  return Object.keys(need).every(k => (S.inv[k] || 0) >= need[k]);
}
function consume(recipe) { for (const k of recipe) if (!INGREDIENTS[k].free) S.inv[k]--; }
function baristaTick() {
  const b = shop().staff.barista; if (!b) return;
  if (!R.bJob) {
    const t = R.tickets.find(t => t.id !== R.sel && !t.barista && !(outageNow() && DRINKS[t.drink].recipe.some(k => POWER_ING.includes(k))));
    if (t) {
      if (!hasStock(DRINKS[t.drink].recipe)) {
        if (!R.today.shortage.active) { R.today.shortage.active = true; toast(`☕ ${b.name}: "Chị ơi, hết nguyên liệu làm ${DRINKS[t.drink].name} rồi!"`, "bad"); }
        return;
      }
      consume(DRINKS[t.drink].recipe);
      t.barista = true; R.bJob = { id: t.id, left: baristaTime(b) };
      renderTickets(); renderStaff(); renderIngredients();
    }
  } else if (--R.bJob.left <= 0) {
    const c = R.customers.find(x => x.uid === R.bJob.id); R.bJob = null;
    if (c && c.state === "drink") resolveServe(c, baristaQuality(b), true);
    renderStaff();
  }
}
function simTick(i) {
  const sh = S.shops[i], b = sh.staff.barista, T = R.today.shops[i];
  if (!b) return;
  const sim = R.sim[i] || (R.sim[i] = { q: 0, acc: 0, bAcc: 0 });
  if (R.time < DAY_END) {
    sim.acc += lambda(i, R.time);
    while (sim.acc >= 1) { sim.acc--; if (sim.q < 3 + (sh.decor.ban_ghe || 0)) sim.q++; else T.lost++; }
  } else if (R.time > DAY_END + 30) { T.lost += sim.q; sim.q = 0; }
  sim.bAcc = Math.min(1.5, sim.bAcc + 1 / baristaTime(b) * (sh.staff.waiter ? 1.1 : 1));
  while (sim.bAcc >= 1 && sim.q > 0) {
    sim.bAcc--; sim.q--;
    const id = pickDrink(i), d = DRINKS[id];
    if (!hasStock(d.recipe)) { T.lost++; if (!R.today.shortage[i]) { R.today.shortage[i] = true; toast(`📦 Quán ${LOCATIONS[sh.loc].city} báo thiếu nguyên liệu cho ${d.name}!`, "bad"); } continue; }
    consume(d.recipe);
    const q = baristaQuality(b);
    const price = d.price * (LOCATIONS[sh.loc].specialty === id ? 1.2 : 1);
    let tipRate = { perfect: 0.15, good: 0.06, ok: 0 }[q] + (sh.decor.cay_xanh ? 0.05 : 0) + (sh.staff.cashier ? 0.1 : 0) + (hasTrait(sh, "duyen") ? 0.05 : 0) + ((R.event && R.event.tip) || 0);
    if (!sh.staff.cleaner) tipRate *= 0.6;
    const pay = Math.round(price * (q === "ok" ? 0.7 : 1) / 1000) * 1000, tip = Math.round(price * tipRate / 1000) * 1000;
    S.money += pay + tip; S.totals.earned += pay + tip;
    T.revenue += pay; T.tips += tip; T.served++; sh.served++; S.totals.served++;
    if (q === "perfect") { T.perfect++; sh.perfect++; S.totals.perfect++; }
    sh.rep = clamp(sh.rep + { perfect: 0.15, good: 0.05, ok: -0.1 }[q] * (sh.decor.tranh ? 1.2 : 1), 0, 100);
  }
}
function roleReq(i, role) {
  const sh = S.shops[i], k = ROLE_ORDER.indexOf(role);
  if (k > 0 && !sh.staff[ROLE_ORDER[k - 1]]) return `Cần thuê ${ROLES[ROLE_ORDER[k - 1]].name} trước`;
  const need = { waiter: 12, cleaner: 22, cashier: 32, barista: 45 }[role] - (i === 0 ? 0 : 10);
  if (sh.rep < need) return `Uy tín quán cần đạt ${need} (hiện ${Math.floor(sh.rep)})`;
  if (i === 0 && role === "waiter" && S.day < 2) return "Mở khóa từ ngày thứ 2";
  return null;
}
function hire(i, role, idx) {
  const cand = R.cands[i][role][idx];
  S.shops[i].staff[role] = cand;
  R.cands[i][role].splice(idx, 1);
  toast(`🎉 ${cand.name} bắt đầu làm ${ROLES[role].name} tại ${LOCATIONS[S.shops[i].loc].city}!`, "gold");
  if (role === "barista") toast("☕ Quán đã có pha chế! Giờ Uyên có thể mở quán mới trong mục Chuỗi quán.", "gold");
  Sound.sfx("bell");
  checkAchv(); renderStaff(); renderDockDots(); save(true);
}
function fire(i, role) {
  const st = S.shops[i].staff[role];
  if (!confirm(`Cho ${st.name} nghỉ việc? Các vị trí phía sau vẫn giữ nguyên.`)) return;
  S.shops[i].staff[role] = null;
  if (role === "barista" && i !== S.active) R.today.shops[i].open = false;
  renderStaff(); save(true);
}
function renderStaff() {
  const layer = $("#staff-layer"); layer.innerHTML = "";
  const sh = shop();
  const put = (look, x, tag, cls, busy) => {
    const s = el("div", "staff " + (cls || "") + (busy ? " busy" : ""));
    s.style.left = x + "px"; s.style.top = "128px";
    s.innerHTML = Art.person(look, "happy") + `<div class="tag">${tag}</div><div class="work">☕</div>`;
    layer.appendChild(s);
  };
  put(Art.UYEN, 700, "Bảo Uyên", "uyen", R.drip);
  if (sh.staff.barista) put(sh.staff.barista.look, 520, "☕ " + sh.staff.barista.name.split(" ").pop(), "", !!R.bJob);
  if (sh.staff.cashier) put(sh.staff.cashier.look, 860, "💁 " + sh.staff.cashier.name.split(" ").pop());
  if (sh.staff.waiter) put(sh.staff.waiter.look, 340, "🧑‍🍳 " + sh.staff.waiter.name.split(" ").pop());
  if (sh.staff.cleaner) put(sh.staff.cleaner.look, 150, "🧹 " + sh.staff.cleaner.name.split(" ").pop());
  $("#btn-clean").classList.toggle("hidden", !!sh.staff.cleaner);
}

// ---------- Kết thúc ngày ----------
function endDay() {
  R.phase = "report";
  closeDialog();
  const rows = [];
  let net = 0;
  S.shops.forEach((sh, i) => {
    const T = R.today.shops[i], L = LOCATIONS[sh.loc];
    const wages = ROLE_ORDER.reduce((a, r) => a + (sh.staff[r] ? sh.staff[r].wage : 0), 0);
    const util = T.open ? 40000 + T.served * 800 + (sh.decor.may_lanh ? 30000 : 0) : 15000;
    const other = 20000 + Object.values(sh.decor).reduce((a, v) => a + v, 0) * 5000;
    const cost = L.rent + wages + util + other;
    S.money -= cost;
    const r = { loc: sh.loc, open: T.open, served: T.served, perfect: T.perfect, lost: T.lost, revenue: T.revenue, tips: T.tips, rent: L.rent, wages, util, other, cost, net: T.revenue + T.tips - cost };
    rows.push(r); net += r.net;
    // Nhân viên lên tay nghề
    ROLE_ORDER.forEach(role => {
      const st = sh.staff[role]; if (!st) return;
      st.days++;
      if (st.days % 10 === 0 && st.skill < 5) { st.skill++; st.wage = Math.round(st.wage * 1.08 / 5000) * 5000; toast(`⭐ ${st.name} lên tay nghề ${st.skill} sao (lương ${money(st.wage)})`); }
    });
  });
  const T = R.today;
  // Mục tiêu "không để khách bỏ đi"
  const nl = R.goals.find(g => g.type === "nolost" && !g.done);
  if (nl && T.lostActive === 0 && T.served > 0) { nl.done = true; S.money += nl.reward; T.bonus += nl.reward; toast(`🎯 Hoàn thành: ${nl.text} (+${money(nl.reward)})`, "gold"); }
  net += T.bonus - T.purchases - T.marketing - T.eventCost;
  // Lãi nợ
  let interest = 0;
  if (S.money < 0) { interest = Math.round(-S.money * 0.02 / 1000) * 1000; S.money -= interest; S.debtDays++; net -= interest; } else S.debtDays = 0;
  S.marketing.forEach(m => m.days--); S.marketing = S.marketing.filter(m => m.days > 0);
  const report = { day: S.day, rows, purchases: T.purchases, marketing: T.marketing, eventCost: T.eventCost, bonus: T.bonus, interest, net, money: S.money };
  S.lastReport = report;
  S.history.push({ day: S.day, net, shops: rows.map(r => ({ loc: r.loc, gross: r.revenue + r.tips, net: r.net })) });
  if (S.history.length > 60) S.history.shift();
  S.day++;
  checkAchv();
  // Lưu ngay — tải lại sẽ vào ngày mới
  R.phase = "prepare"; R.today = newToday(); R.goals = []; R.customers = []; R.tickets = []; R.cup = [];
  $("#customers").innerHTML = "";
  try { localStorage.setItem(SAVE_KEY(slot), JSON.stringify({ state: S, run: null, savedAt: Date.now() })); } catch (e) {}
  R.phase = "report";
  showReport(report, true);
}

// ---------- Thành tựu ----------
function checkAchv() {
  for (const a of ACHIEVEMENTS) if (!S.achv[a.id] && a.test(S)) { S.achv[a.id] = S.day; toast(`🏆 Thành tựu mới: ${a.name}`, "gold"); Sound.sfx("perfect"); }
}

// ---------- Hiển thị ----------
function buildScene() {
  const sh = shop();
  document.documentElement.style.setProperty("--accent", loc(sh).accent);
  $("#scene-bg").innerHTML = Art.sceneBg(sh.loc, sh.decor);
  $("#counter").innerHTML = Art.counter(sh.loc);
  $("#customers").innerHTML = "";
  for (const c of R.customers) if (c.el) $("#customers").appendChild(c.el);
  const sign = $("#closed-sign");
  if (R.phase === "open" && R.time >= DAY_END) { sign.textContent = "🔒 Đã đóng cửa"; sign.classList.remove("hidden"); }
  else sign.classList.add("hidden");
  renderStaff();
}
function renderAll() { renderHud(); renderTickets(); renderBench(); renderIngredients(); renderGoals(); renderStats(); renderDockDots(); renderStaff(); }
function renderHud() {
  if (!S) return;
  const sh = shop(), W = WEATHER[R.weatherBy[sh.loc] || "nang"];
  $("#hud-day").textContent = `📅 Ngày ${S.day} · ${weekday(S.day)}`;
  $("#hud-clock").textContent = "🕐 " + (R.phase === "open" ? clock(Math.min(R.time, 24 * 60 - 1)) : "--:--");
  $("#hud-weather").textContent = W.icon + " " + W.name;
  $("#hud-shop").textContent = "📍 " + loc(sh).city;
  $("#hud-rep").innerHTML = `<span class="stars">${stars(sh.rep)}</span> ${Math.floor(sh.rep)}`;
  const m = $("#hud-money"); m.textContent = "💰 " + money(S.money); m.classList.toggle("neg", S.money < 0);
  $("#clean-bar").style.width = R.clean + "%";
}
function renderTickets() {
  const box = $("#tickets");
  if (!R.tickets.length) { box.innerHTML = `<div class="empty-tickets">${R.phase === "open" ? "Chưa có order nào. Bấm vào khách 💬 để nhận order!" : "Quán chưa mở cửa."}</div>`; return; }
  box.innerHTML = "";
  for (const t of R.tickets) {
    const c = R.customers.find(x => x.uid === t.id); if (!c) continue;
    const d = el("div", "ticket" + (t.id === R.sel ? " sel" : "") + (t.barista ? " barista" : ""));
    d.dataset.id = t.id;
    d.innerHTML = `${t.barista ? '<span class="t-badge">☕</span>' : c.reg ? '<span class="t-badge">💖</span>' : c.critic ? '<span class="t-badge">📝</span>' : ""}
      <div class="t-cup">${Art.drinkIcon(t.drink)}</div><div class="t-name">${DRINKS[t.drink].name}</div>
      <div class="t-who">${t.barista ? "Pha chế đang làm" : c.name}</div><div class="pbar"><div></div></div>`;
    d.addEventListener("click", () => { if (t.barista) return; R.sel = t.id; Sound.sfx("click"); renderTickets(); renderBench(); });
    box.appendChild(d);
  }
  updateBars();
}
function renderBench(dripping) {
  const t = R.tickets.find(t => t.id === R.sel);
  const d = t ? DRINKS[t.drink] : null;
  const hot = d ? d.hot : R.cup.includes("nuoc_nong");
  $("#cup-wrap").innerHTML = Art.cup(R.cup, { hot, phin: dripping || R.drip });
  $("#bench-drink").innerHTML = d ? `${d.name}<small>Giá ${money(d.price * (loc().specialty === t.drink ? 1.2 : 1))}${loc().specialty === t.drink ? " · Đặc sản vùng +20%" : ""}</small>` : `Chọn một phiếu order<small>Hoặc pha thử tự do</small>`;
  const rec = $("#bench-recipe");
  if (d && S.settings.hints) {
    rec.innerHTML = `<span class="lbl">Công thức:</span>` + d.recipe.map((k, i) => {
      const cls = R.cup[i] === k ? "ok" : R.cup[i] && R.cup[i] !== k ? "no" : i === R.cup.length ? "next" : "";
      return `<span class="chip ${cls}">${INGREDIENTS[k].icon} ${INGREDIENTS[k].name}</span>`;
    }).join("→");
  } else rec.innerHTML = d ? `<span class="lbl">Công thức: (đã tắt gợi ý — xem Thực đơn)</span>` : "";
  $("#bench-cup").innerHTML = `<span class="lbl">Trong ly:</span>` + (R.cup.length ? R.cup.map(k => `<span class="chip">${INGREDIENTS[k].icon} ${INGREDIENTS[k].name}</span>`).join("") : `<span class="chip">trống</span>`);
  $("#btn-serve").disabled = !t || !R.cup.length || R.drip;
  $("#btn-dump").disabled = !R.cup.length || R.drip;
  $("#btn-undo").disabled = !R.cup.length || R.drip;
}
function renderIngredients() {
  const box = $("#ingredients"); box.innerHTML = "";
  for (const k in INGREDIENTS) {
    const I = INGREDIENTS[k];
    if (I.secret && !S.secrets[I.secret]) continue;
    const avail = ingAvail(k);
    const b = el("button", "ing" + (avail ? "" : " locked"));
    const q = I.free ? "∞" : (S.inv[k] || 0);
    b.innerHTML = `<div class="ic" style="background:${I.color}">${avail ? I.icon : "🔒"}</div><div class="nm">${I.name}</div>${avail ? `<span class="qty ${!I.free && q < 5 ? "low" : ""}">${q}</span>` : ""}`;
    b.disabled = R.drip;
    b.title = avail ? `${I.name}${I.free ? "" : " — còn " + q}` : `Cần ${EQUIPMENT[I.equip] ? EQUIPMENT[I.equip].name : "mở khóa"}`;
    b.dataset.k = k;
    b.addEventListener("click", () => addIngredient(k));
    box.appendChild(b);
  }
  if (R.phase === "tutorial") applyTutGlow();
}
function renderGoals() {
  const box = $("#goals");
  if (!R.goals.length) { box.innerHTML = `<div class="goal">Mục tiêu sẽ xuất hiện khi bắt đầu ngày mới.</div>`; return; }
  box.innerHTML = R.goals.map(g => {
    let p, n = g.n, pct;
    if (g.type === "nolost") { p = R.today ? R.today.lostActive : 0; pct = g.done ? 100 : p === 0 ? 50 : 0; }
    else { p = goalProgress(g); pct = clamp(p / n * 100, 0, 100); }
    const txt = g.type === "nolost" ? (p ? `❌ ${p} khách đã bỏ đi` : "Đến cuối ngày") : g.type === "revenue" ? `${shortMoney(p)}/${shortMoney(n)}` : `${Math.min(p, n)}/${n}`;
    return `<div class="goal ${g.done ? "done" : ""}"><span>${g.done ? "✅" : "⬜"} ${g.text}</span><div class="gbar"><div style="width:${pct}%"></div></div><span style="font-size:13px;color:#8a7a72">${txt}</span><span class="rw">+${shortMoney(g.reward)}</span></div>`;
  }).join("");
}
function renderStats() {
  if (!R.today) return;
  const A = R.today.shops[S.active] || { served: 0, perfect: 0, lost: 0, revenue: 0, tips: 0 };
  const others = S.shops.length > 1 ? ` · Toàn chuỗi: <b>${money(chainRevenueToday())}</b>` : "";
  $("#today-stats").innerHTML = `<span>☕ Đã bán <b>${A.served}</b></span><span>🌟 Hoàn hảo <b>${A.perfect}</b></span><span>🚶 Bỏ đi <b>${A.lost}</b></span><span>💵 Hôm nay <b>${money(A.revenue + A.tips)}</b>${others}</span>`;
}
function renderDockDots() {
  if (!S) return;
  const dot = (panel, on) => { const b = document.querySelector(`[data-panel="${panel}"]`); const d = b.querySelector(".dot"); if (on && !d) b.appendChild(el("i", "dot")); if (!on && d) d.remove(); };
  dot("staff", S.shops.some((sh, i) => ROLE_ORDER.some(r => !sh.staff[r] && !roleReq(i, r))));
  dot("chain", canExpand() === null);
  dot("kho", Object.keys(INGREDIENTS).some(k => ingAvail(k) && !INGREDIENTS[k].free && (S.inv[k] || 0) < 5));
}
function setPauseUI() {
  $("#btn-pause").textContent = R.paused ? "▶" : "⏸";
  const sign = $("#closed-sign");
  if (R.paused && R.phase === "open") { sign.textContent = "⏸ Tạm dừng"; sign.classList.remove("hidden"); }
  else if (R.phase === "open" && R.time >= DAY_END) { sign.textContent = "🔒 Đã đóng cửa"; sign.classList.remove("hidden"); }
  else sign.classList.add("hidden");
}

// ---------- Modal ----------
function openModal(title, html, opts = {}) {
  $("#modal-title").innerHTML = title;
  $("#modal-body").innerHTML = html;
  $("#modal-close").classList.toggle("hidden", !!opts.noClose);
  $("#modal").classList.remove("hidden");
  $("#modal").dataset.panel = opts.panel || "";
  return $("#modal-body");
}
function closeModal() { $("#modal").classList.add("hidden"); $("#modal").dataset.panel = ""; }
function on(root, sel, ev, fn) { root.querySelectorAll(sel).forEach(e => e.addEventListener(ev, () => fn(e))); }
function refreshPanel() { const p = $("#modal").dataset.panel; if (p && PANELS[p]) PANELS[p](); }

// ---------- Màn hình chính ----------
function showTitle() {
  R.phase = "title";
  const ls = lastSlot(), data = ls ? readSlot(ls) : null;
  const slots = [1, 2, 3].map(n => {
    const d = readSlot(n);
    return `<div class="slot"><div class="info"><b>Ô lưu ${n}</b><br><span class="sub">${d ? `Ngày ${d.state.day} · ${d.state.shops.length} quán · ${money(d.state.money)} · ${new Date(d.savedAt).toLocaleString("vi-VN")}` : "Trống"}</span></div>
      ${d ? `<button class="btn teal" data-load="${n}">Tải</button>` : ""}<button class="btn ${d ? "gray" : ""}" data-new="${n}">${d ? "Chơi lại từ đầu" : "Bắt đầu mới"}</button></div>`;
  }).join("");
  const body = openModal("", `
    <div class="intro-wrap">
      <div class="portrait">${Art.person(Art.UYEN, "happy")}</div>
      <div style="flex:1">
        <div style="font-size:54px;font-weight:800;color:var(--coral-d);line-height:1">☕ Cửa hàng nhỏ của Uyên</div>
        <p style="font-size:20px;color:var(--muted)">Pha chế · Trò chuyện · Mở chuỗi quán từ phố cổ Hà Nội đến bờ sông Hương</p>
        ${data ? `<button class="btn big teal" id="t-continue">▶ Tiếp tục (ô ${ls} · ngày ${data.state.day})</button>` : `<button class="btn big" id="t-new">✨ Bắt đầu chơi</button>`}
        <h3>Ô lưu</h3>${slots}
        <div class="row"><button class="btn gray" id="t-import">📥 Nhập file save</button><span class="sub">Tiến trình được lưu tự động trên ${isStandalone() ? "ứng dụng" : "trình duyệt"} này.</span></div>
        ${isIOS && !isStandalone() ? `<div class="install-tip">📱 <b>Cài như ứng dụng:</b> bấm nút Chia sẻ <b>⬆︎</b> của Safari → <b>“Thêm vào MH chính”</b>. Lần sau mở icon ☕ trên màn hình là chơi toàn màn hình, offline vẫn được. <br><span class="sub">Lưu ý: iOS tách bộ nhớ của Safari và ứng dụng — nếu đã chơi trong Safari, hãy “Xuất file save” rồi “Nhập file save” trong ứng dụng.</span></div>` : ""}
      </div>
    </div>`, { noClose: true });
  const begin = n => { slot = n; newState(); S.introDone = false; applySettings(); startMusic(); showIntro(); };
  const cont = $("#t-continue"); if (cont) cont.onclick = () => { slot = ls; startMusic(); loadData(data); };
  const nw = $("#t-new"); if (nw) nw.onclick = () => begin(1);
  on(body, "[data-load]", "click", b => { slot = +b.dataset.load; startMusic(); loadData(readSlot(slot)); });
  on(body, "[data-new]", "click", b => { const n = +b.dataset.new; if (readSlot(n) && !confirm(`Xóa tiến trình ở ô ${n} và chơi lại từ đầu?`)) return; begin(n); });
  $("#t-import").onclick = () => importSave();
}
function showIntro() {
  let i = 0;
  const step = () => {
    if (i >= INTRO.length) { S.introDone = true; showTutorial(); return; }
    const L = INTRO[i++];
    const body = openModal(L.who === "ngoai" ? "📜 Lá thư của Ngoại" : "🌸 Bảo Uyên", `
      <div class="intro-wrap"><div class="portrait">${Art.person(L.who === "ngoai" ? Art.NGOAI : Art.UYEN, "happy")}</div>
      <div class="intro-text">${L.text}<div style="margin-top:20px"><button class="btn big" id="i-next">${i < INTRO.length ? "▶ Tiếp" : "☕ Mở cửa hàng!"}</button></div></div></div>`, { noClose: true });
    $("#i-next").onclick = () => { Sound.sfx("click"); step(); };
  };
  step();
}
function showTutorial() {
  openModal("📖 Cách chơi", `${TUTORIAL.map(t => `<p style="font-size:20px">${t}</p>`).join("")}
    <p style="font-size:20px">💾 Game tự lưu thường xuyên. Có thể lưu thủ công, đổi ô lưu hoặc xuất file trong <b>⚙️ Lưu & Cài đặt</b>.</p>
    <div class="row"><span class="spacer"></span><button class="btn big" id="tu-ok">🎓 Tập pha ly đầu tiên ▶</button></div>`, { noClose: true });
  $("#tu-ok").onclick = () => { tutRound = 0; startTutorial(); };
}

// ---------- Tập pha chế trước ngày 1 ----------
const TUT_DRINKS = ["sua_da", "bac_xiu", "tra_chanh"];
const NA_LOOK = { g: "f", age: "young", skin: "#fde0c5", hair: "pony", hc: "#5a3825", shirt: "tee", sc: "#ffafcc", acc: [] };
let tutRound = 0;
function coach(html) {
  const c = $("#coach");
  c.innerHTML = `<div class="coach-face">${Art.person(Art.UYEN, "happy")}</div><div class="coach-text">${html}</div>`;
  c.classList.remove("hidden");
}
function tutTarget() {
  const t = R.tut; if (!t) return null;
  const rec = DRINKS[t.drink].recipe;
  if (t.step === 0) return R.customers[0] && R.customers[0].state === "order" ? R.customers[0].el : null;
  if (t.step <= rec.length) return document.querySelector(`.ing[data-k="${rec[t.step - 1]}"]`);
  return $("#btn-serve");
}
function applyTutGlow() {
  document.querySelectorAll(".tut-glow").forEach(e => e.classList.remove("tut-glow"));
  const tg = tutTarget(); if (tg && !R.drip) tg.classList.add("tut-glow");
}
function tutStep() {
  const t = R.tut, d = DRINKS[t.drink], rec = d.recipe;
  const path = rec.map((k, i) => `<span class="chip ${i < t.step - 1 ? "ok" : i === t.step - 1 ? "next" : ""}">${INGREDIENTS[k].icon} ${INGREDIENTS[k].name}</span>`).join(" → ");
  if (t.step === 0) coach(`<b>Lần ${tutRound + 1}:</b> Bé Na muốn gọi món. 👆 Bấm vào <b>Bé Na</b> (bong bóng 💬) để nhận order.`);
  else if (t.step <= rec.length) {
    const k = rec[t.step - 1], I = INGREDIENTS[k];
    coach(`Bước ${t.step}/${rec.length}: bấm <b>${I.icon} ${I.name}</b> ở quầy bên phải.${k === "phin" ? " Phin cần vài giây để nhỏ giọt ☕" : ""}<div class="coach-path">${d.name}: ${path}</div>`);
  } else coach(`Đủ nguyên liệu, đúng thứ tự rồi! Bấm <b>✅ Phục vụ</b> để mang ly cho Bé Na.<div class="coach-path">${d.name}: ${path}</div>`);
  applyTutGlow();
}
function startTutorial() {
  R.phase = "tutorial"; R.today = newToday(); R.goals = []; R.customers = []; R.tickets = []; R.sel = null; R.cup = []; R.drip = false;
  const drink = TUT_DRINKS[tutRound % TUT_DRINKS.length];
  R.tut = { drink, step: 0 };
  closeModal(); buildScene(); renderAll();
  coach("Bé Na — em họ của Uyên — ghé quán làm khách tập cho chị đây!");
  const c = { tut: true, reg: null, name: "Bé Na", look: NA_LOOK, drink, uid: ++R.uid, slot: 1, state: "walking", wait: 0, chatted: true, tipBonus: 0, maxOrder: 100, maxDrink: 100, pat: 100, max: 100 };
  mountCustomer(c, "🎓 ", tutStep);
}
function tutClickCustomer(c) {
  if (c.state !== "order") return;
  Sound.sfx("click");
  const d = DRINKS[c.drink];
  openDialog(c.look, `Bé Na <small>Em họ của Uyên</small>`, `Chị Uyên ơi, cho em một ly ${d.name} nha! Em làm khách đầu tiên của chị đó.`,
    [{ label: `📝 Nhận order: ${d.name}`, main: true, fn: () => { closeDialog(); takeOrder(c); R.tut.step = 1; tutStep(); } }], { c, mood: "happy" });
}
function tutIngredient(k) {
  const t = R.tut; if (!t || R.drip) return;
  const rec = DRINKS[t.drink].recipe, I = INGREDIENTS[k];
  if (t.step === 0) { toast("Nhận order của Bé Na trước nhé!", "bad"); return; }
  if (t.step > rec.length) { toast("Đủ rồi! Bấm ✅ Phục vụ nhé.", "bad"); return; }
  const want = rec[t.step - 1];
  if (k !== want) { toast(`Chưa đúng — bước này cần ${INGREDIENTS[want].icon} ${INGREDIENTS[want].name}`, "bad"); Sound.sfx("error"); return; }
  R.cup.push(k); t.step++;
  Sound.sfx(k === "da" ? "ice" : ["phin", "sua_tuoi", "sua_dac", "tra"].includes(k) ? "pour" : "pop");
  if (k === "phin") {
    R.drip = true; renderBench(true); renderIngredients(); tutStep();
    setTimeout(() => { R.drip = false; renderBench(); renderIngredients(); tutStep(); }, 1100);
  } else { renderBench(); renderIngredients(); tutStep(); }
}
function tutServe() {
  const t = R.tut; if (!t) return;
  if (t.step <= DRINKS[t.drink].recipe.length) { toast("Ly chưa đủ nguyên liệu đâu!", "bad"); return; }
  const c = R.customers[0], p = custPos(c);
  document.querySelectorAll(".tut-glow").forEach(e => e.classList.remove("tut-glow"));
  setMood(c, "happy"); c.state = "served";
  c.el.querySelector(".bubble").innerHTML = `<span class="big">😍</span>`;
  speech(p.x - 20, p.y - 10, "Ngon quá chị ơi! Chuẩn vị luôn!");
  floater(p.x + 20, p.y + 50, "Hoàn hảo! 🌟", "#e07a5f");
  Sound.sfx("perfect");
  R.tickets = []; R.sel = null; R.cup = [];
  renderTickets(); renderBench();
  coach("🎉 Hoàn hảo! Đúng nguyên liệu <b>và</b> đúng thứ tự thì khách vui nhất, tip nhiều nhất.");
  setTimeout(() => { removeCustomer(c); showReady(); }, 1800);
}
function showReady() {
  openModal("🎓 Uyên đã sẵn sàng chưa?", `
    <div class="intro-wrap"><div class="portrait">${Art.person(Art.UYEN, "happy")}</div>
    <div class="intro-text">Tóm tắt nhanh:<br>
      1️⃣ Bấm vào khách 💬 để <b>nhận order</b>.<br>
      2️⃣ Chọn <b>phiếu order</b> ở quầy.<br>
      3️⃣ Bấm <b>nguyên liệu đúng thứ tự</b> theo công thức (lỡ tay thì “↩️ Bỏ bước”).<br>
      4️⃣ Bấm <b>✅ Phục vụ</b> trước khi thanh kiên nhẫn của khách cạn.
      <div class="row" style="margin-top:20px"><button class="btn big teal" id="rd-yes">✅ Sẵn sàng! Bắt đầu ngày 1</button><button class="btn big gray" id="rd-no">🔁 Chưa, hướng dẫn lại</button></div>
    </div></div>`, { noClose: true });
  $("#rd-yes").onclick = () => { R.tut = null; $("#coach").classList.add("hidden"); prepareDay(); };
  $("#rd-no").onclick = () => { tutRound++; startTutorial(); };
}

// ---------- Màn hình chuẩn bị ----------
function canExpand() {
  if (S.shops.length >= LOCATION_ORDER.length) return "Đã phủ khắp 6 thành phố!";
  const nb = S.shops.findIndex(sh => !sh.staff.barista);
  if (nb >= 0) return `Quán ${LOCATIONS[S.shops[nb].loc].city} cần có nhân viên Pha chế trước khi Uyên rời đi.`;
  return null;
}
function showPrepare() {
  R.phase = "prepare";
  const W = WEATHER[R.weatherBy[shop().loc]];
  const shopsHtml = S.shops.map((sh, i) => {
    const L = LOCATIONS[sh.loc], w = WEATHER[R.weatherBy[sh.loc]];
    const auto = !!sh.staff.barista;
    return `<div class="card ${i === S.active ? "owned" : ""}" style="cursor:pointer" data-stand="${i}">
      <h4>📍 ${L.city} <span class="sub">${L.name}</span></h4>
      <div class="sub">${w.icon} ${w.name} · <span class="stars">${stars(sh.rep)}</span> ${Math.floor(sh.rep)}</div>
      <div>${i === S.active ? '<span class="pill green">Uyên đứng quầy hôm nay</span>' : auto ? '<span class="pill">☕ Tự vận hành</span>' : '<span class="pill red">Đóng cửa (chưa có pha chế)</span>'}</div>
    </div>`;
  }).join("");
  const ev = R.event ? `<div class="card" style="background:#fffbea"><h4>${R.event.icon} ${R.event.name}</h4><div>${R.event.desc}</div></div>` : `<div class="card"><h4>🍃 Một ngày bình yên</h4><div class="sub">Không có sự kiện đặc biệt.</div></div>`;
  const weekend = (S.day - 1) % 7 >= 5 ? `<span class="pill green">Cuối tuần: khách +25%</span>` : "";
  const body = openModal(`☀️ Ngày ${S.day} — ${weekday(S.day)}`, `
    <div class="row"><span class="pill">${W.icon} ${loc().city}: ${W.name}</span>${weekend}<span class="pill">💰 ${money(S.money)}</span>
      ${S.marketing.map(m => `<span class="pill green">📣 ${MARKETING[m.id].name} (còn ${m.days} ngày)</span>`).join("")}</div>
    <h3>Sự kiện hôm nay</h3>${ev}
    <h3>Hôm nay Uyên đứng quầy ở đâu?</h3><div class="grid">${shopsHtml}</div>
    <h3>🎯 Mục tiêu</h3>${R.goals.map(g => `<div class="goal"><span>⬜ ${g.text}</span><span class="rw">+${money(g.reward)}</span></div>`).join("")}
    <div class="row" style="margin-top:16px">
      <button class="btn gray" data-go="kho">📦 Nhập kho</button><button class="btn gray" data-go="staff">👥 Nhân viên</button>
      <button class="btn gray" data-go="chain">🏪 Chuỗi quán</button><button class="btn gray" data-go="menu">📜 Thực đơn</button>
      <span class="spacer"></span><button class="btn big teal" id="p-open">🔓 Mở cửa!</button>
    </div>`, { noClose: true, panel: "prepare" });
  on(body, "[data-stand]", "click", c => { S.active = +c.dataset.stand; buildScene(); renderAll(); showPrepare(); });
  on(body, "[data-go]", "click", b => PANELS[b.dataset.go]());
  $("#p-open").onclick = openDay;
}

// ---------- Báo cáo ----------
function reportTable(r) {
  const rows = r.rows.map(x => `<tr><td>📍 ${LOCATIONS[x.loc].city}${x.open ? "" : ' <span class="pill red">đóng</span>'}</td><td>${x.served}</td><td>${x.lost}</td><td>${money(x.revenue)}</td><td>${money(x.tips)}</td>
    <td>${money(x.rent)}</td><td>${money(x.wages)}</td><td>${money(x.util)}</td><td>${money(x.other)}</td><td class="${x.net >= 0 ? "pos" : "neg"}">${money(x.net)}</td></tr>`).join("");
  return `<table class="tbl"><tr><th>Quán</th><th>Khách</th><th>Bỏ đi</th><th>Doanh thu</th><th>Tip</th><th>Thuê mặt bằng</th><th>Lương</th><th>Điện nước</th><th>Khác</th><th>Lãi</th></tr>${rows}
    <tr><td>📦 Nhập nguyên liệu</td><td colspan="8"></td><td class="neg">${money(-r.purchases)}</td></tr>
    ${r.marketing ? `<tr><td>📣 Quảng cáo</td><td colspan="8"></td><td class="neg">${money(-r.marketing)}</td></tr>` : ""}
    ${r.eventCost ? `<tr><td>🔧 Sửa chữa, sự cố</td><td colspan="8"></td><td class="neg">${money(-r.eventCost)}</td></tr>` : ""}
    ${r.bonus ? `<tr><td>🎁 Thưởng mục tiêu, quà khách</td><td colspan="8"></td><td class="pos">${money(r.bonus)}</td></tr>` : ""}
    ${r.interest ? `<tr><td>🏦 Lãi nợ ngân hàng (2%/ngày)</td><td colspan="8"></td><td class="neg">${money(-r.interest)}</td></tr>` : ""}
    <tr class="total"><td>Tổng kết ngày (đồng bộ toàn chuỗi)</td><td colspan="8"></td><td class="${r.net >= 0 ? "pos" : "neg"}">${money(r.net)}</td></tr></table>`;
}
function chartSvg() {
  const H = S.history.slice(-14);
  if (!H.length) return `<p class="sub">Chưa có dữ liệu — chơi hết một ngày để xem biểu đồ.</p>`;
  const colors = { hanoi: "#e07a5f", saigon: "#2a9d8f", dalat: "#7b6cc4", hoian: "#e9a23b", danang: "#1d8fd8", hue: "#9b5de5" };
  const max = Math.max(1, ...H.map(h => h.shops.reduce((a, s) => a + s.gross, 0)));
  const bw = 900 / 14;
  let bars = "";
  H.forEach((h, i) => {
    let y = 190;
    h.shops.forEach(s => { const hh = s.gross / max * 145; y -= hh; bars += `<rect x="${60 + i * bw + 6}" y="${y}" width="${bw - 12}" height="${hh}" fill="${colors[s.loc]}" rx="3"><title>${LOCATIONS[s.loc].city}: ${money(s.gross)}</title></rect>`; });
    bars += `<text x="${60 + i * bw + bw / 2}" y="208" text-anchor="middle" font-size="12" fill="#8a7a72">N${h.day}</text>`;
    bars += `<text x="${60 + i * bw + bw / 2}" y="${y - 4}" text-anchor="middle" font-size="11" fill="${h.net >= 0 ? "#1f776c" : "#e63946"}">${shortMoney(h.net)}</text>`;
  });
  const legend = [...new Set(H.flatMap(h => h.shops.map(s => s.loc)))].map((l, i) => `<rect x="${980 - (i + 1) * 90}" y="6" width="12" height="12" fill="${colors[l]}"/><text x="${996 - (i + 1) * 90}" y="16" font-size="12">${LOCATIONS[l].city}</text>`).join("");
  return `<svg class="chart" viewBox="0 0 1000 220"><text x="10" y="20" font-size="13" fill="#8a7a72">Doanh thu (cột) · Lãi ròng (số)</text>${legend}<line x1="60" y1="190" x2="960" y2="190" stroke="#f0dcc6"/>${bars}</svg>`;
}
function showReport(r, isEnd) {
  const body = openModal(isEnd ? `🌙 Tổng kết ngày ${r.day}` : `📊 Sổ sách`, `
    ${r ? reportTable(r) : '<p>Chưa có báo cáo nào.</p>'}
    <h3>📈 Doanh thu 14 ngày gần nhất</h3>${chartSvg()}
    <div class="row" style="margin-top:10px"><span class="pill">💰 Két: ${money(S.money)}</span><span class="pill">☕ Tổng ly: ${S.totals.served}</span><span class="pill">🌟 Hoàn hảo: ${S.totals.perfect}</span><span class="pill">💵 Tổng thu: ${money(S.totals.earned)}</span>
      ${S.money < 0 ? `<span class="pill red">⚠️ Két đang âm — ngân hàng tính lãi 2% mỗi ngày!</span>` : ""}
      <span class="spacer"></span>${isEnd ? `<button class="btn big teal" id="r-next">☀️ Sang ngày ${S.day}</button>` : ""}</div>`, { noClose: isEnd, panel: isEnd ? "" : "report" });
  if (isEnd) $("#r-next").onclick = () => prepareDay();
}

// ---------- Các bảng chức năng ----------
let staffTab = 0, decorTab = 0;
const PANELS = {
  kho() {
    const cashier = S.shops.some(sh => sh.staff.cashier);
    const items = Object.keys(INGREDIENTS).filter(k => !INGREDIENTS[k].free && ingAvail(k)).map(k => {
      const I = INGREDIENTS[k], p = ingPrice(k), q = S.inv[k] || 0;
      return `<div class="card"><div class="row"><div class="ing" style="box-shadow:none;padding:0"><div class="ic" style="background:${I.color}">${I.icon}</div></div>
        <div><h4>${I.name}</h4><div class="sub">Còn <b style="color:${q < 5 ? "#e63946" : "#1f776c"}">${q}</b> phần · ${money(p)}/phần</div></div></div>
        <div class="row" style="margin-top:6px"><button class="btn teal" data-buy="${k}" data-n="10">+10 (${shortMoney(p * 10)})</button><button class="btn" data-buy="${k}" data-n="30">+30 (${shortMoney(p * 30)})</button></div>
        ${cashier ? `<div class="row qtybtns" style="margin-top:6px"><span class="sub">Mức tự nhập: <b>${S.target[k] || 0}</b></span><button data-tg="${k}" data-d="-10">−</button><button data-tg="${k}" data-d="10">+</button></div>` : ""}</div>`;
    }).join("");
    const body = openModal("📦 Kho nguyên liệu (dùng chung toàn chuỗi)", `
      <p>Nguyên liệu được chia sẻ cho tất cả các quán. ${R.event && (R.event.discount || R.event.priceUp) ? `<span class="pill ${R.event.discount ? "green" : "red"}">${R.event.icon} ${R.event.name}</span>` : ""}
      ${cashier ? "<span class='pill green'>💁 Thu ngân sẽ tự nhập đến “mức tự nhập” mỗi sáng</span>" : "<span class='pill'>Thuê Thu ngân để tự động nhập kho mỗi sáng</span>"}</p>
      <div class="row"><button class="btn teal" id="k-fill">🛒 Nhập đủ tất cả lên 30 phần</button><span class="sub">Đá và nước nóng miễn phí.</span></div>
      <div class="grid" style="margin-top:10px">${items}</div>`, { panel: "kho" });
    on(body, "[data-buy]", "click", b => buy(b.dataset.buy, +b.dataset.n));
    on(body, "[data-tg]", "click", b => { const k = b.dataset.tg; S.target[k] = clamp((S.target[k] || 0) + +b.dataset.d, 0, 200); refreshPanel(); });
    $("#k-fill").onclick = () => { Object.keys(INGREDIENTS).filter(k => !INGREDIENTS[k].free && ingAvail(k)).forEach(k => { const need = 30 - (S.inv[k] || 0); if (need > 0) buy(k, need, true); }); refreshPanel(); };
  },
  menu() {
    const drinks = Object.keys(DRINKS).map(id => {
      const d = DRINKS[id], ok = drinkAvail(id);
      if (d.secret && !S.secrets[id]) return `<div class="card locked"><h4>❓ Công thức bí mật</h4><div class="sub">Một khách quen sẽ truyền dạy khi đủ thân thiết.</div></div>`;
      const spec = Object.values(LOCATIONS).filter(L => L.specialty === id).map(L => L.city);
      return `<div class="card ${ok ? "" : "locked"}"><div class="row"><div style="width:60px;height:60px">${Art.drinkIcon(id)}</div><div><h4>${d.name}</h4><div class="sub">${money(d.price)} · ${d.hot ? "♨️ nóng" : "🧊 lạnh"}${spec.length ? " · Đặc sản " + spec.join(", ") : ""}</div></div></div>
        <div style="margin-top:6px">${d.recipe.map(k => `<span class="pill">${INGREDIENTS[k].icon} ${INGREDIENTS[k].name}</span>`).join(" → ")}</div>
        ${ok ? "" : `<div class="sub" style="margin-top:4px">🔒 Cần: ${EQUIPMENT[d.equip].name}</div>`}</div>`;
    }).join("");
    const eq = Object.keys(EQUIPMENT).map(id => {
      const E = EQUIPMENT[id], own = S.equip[id];
      return `<div class="card ${own ? "owned" : ""}"><h4>${E.name}</h4><div class="sub">${E.desc}</div><div class="row" style="margin-top:6px">${own ? '<span class="pill green">✔ Đã có (dùng cho cả chuỗi)</span>' : `<button class="btn" data-eq="${id}" ${S.money < E.price ? "disabled" : ""}>Mua ${money(E.price)}</button>`}</div></div>`;
    }).join("");
    const body = openModal("📜 Thực đơn & Máy móc", `<h3>🛠️ Máy móc</h3><div class="grid">${eq}</div><h3>☕ Sổ công thức</h3><p class="sub">Bấm nguyên liệu đúng thứ tự để được “Hoàn hảo”. Đúng nguyên liệu nhưng sai thứ tự chỉ được “Ngon”.</p><div class="grid">${drinks}</div>`, { panel: "menu" });
    on(body, "[data-eq]", "click", b => {
      const id = b.dataset.eq, E = EQUIPMENT[id];
      if (S.money < E.price) return;
      S.money -= E.price; R.today.purchases += E.price; S.equip[id] = true;
      toast(`🛠️ Đã mua ${E.name}!`, "gold"); Sound.sfx("coin");
      renderIngredients(); renderHud(); save(true); refreshPanel();
    });
  },
  staff() {
    staffTab = clamp(staffTab, 0, S.shops.length - 1);
    const i = staffTab, sh = S.shops[i];
    const tabs = S.shops.map((s, k) => `<button class="${k === i ? "on" : ""}" data-tab="${k}">📍 ${LOCATIONS[s.loc].city}</button>`).join("");
    const trait = id => TRAITS.find(t => t.id === id);
    const slots = ROLE_ORDER.map(role => {
      const R0 = ROLES[role], st = sh.staff[role], req = roleReq(i, role);
      if (st) return `<div class="slot"><div class="avatar-sm">${Art.person(st.look, "happy")}</div><div class="info"><b>${R0.icon} ${R0.name}: ${st.name}</b> <span class="stars">${"★".repeat(st.skill)}${"☆".repeat(5 - st.skill)}</span><br>
        <span class="pill">${trait(st.trait).name}: ${trait(st.trait).desc}</span><span class="pill">Lương ${money(st.wage)}/ngày</span><span class="pill">Đã làm ${st.days} ngày</span><br><span class="sub">${R0.desc}</span></div>
        <button class="btn gray" data-fire="${role}">Cho nghỉ</button></div>`;
      if (req) return `<div class="slot" style="opacity:.6"><div class="avatar-sm" style="font-size:40px;align-items:center">🔒</div><div class="info"><b>${R0.icon} ${R0.name}</b><br><span class="sub">${R0.desc}</span><br><span class="pill red">${req}</span></div></div>`;
      const cands = (R.cands[i] && R.cands[i][role]) || [];
      return `<div class="slot" style="flex-direction:column;align-items:stretch"><div><b>${R0.icon} Tuyển ${R0.name}</b> <span class="sub">— ${R0.desc}</span></div>
        <div class="grid">${cands.map((c, k) => `<div class="card"><div class="row"><div class="avatar-sm">${Art.person(c.look, "happy")}</div><div><h4>${c.name}</h4><span class="stars">${"★".repeat(c.skill)}${"☆".repeat(5 - c.skill)}</span><br><span class="pill">${trait(c.trait).name}</span></div></div>
          <div class="row" style="margin-top:6px"><span class="sub">Lương ${money(c.wage)}/ngày</span><span class="spacer"></span><button class="btn teal" data-hire="${role}" data-k="${k}">Thuê</button></div></div>`).join("") || '<span class="sub">Hết ứng viên hôm nay, quay lại ngày mai.</span>'}</div></div>`;
    }).join("");
    const body = openModal("👥 Nhân viên", `<div class="tabbar">${tabs}</div>
      <p class="sub">Thứ tự tuyển: Phục vụ → Tạp vụ → Thu ngân → <b>Pha chế (cuối cùng)</b>. Khi quán có Pha chế, quán có thể tự vận hành và Uyên được mở quán mới. Lương trả cuối mỗi ngày; nhân viên lên tay nghề sau mỗi 10 ngày.</p>${slots}`, { panel: "staff" });
    on(body, "[data-tab]", "click", b => { staffTab = +b.dataset.tab; refreshPanel(); });
    on(body, "[data-hire]", "click", b => { hire(i, b.dataset.hire, +b.dataset.k); refreshPanel(); });
    on(body, "[data-fire]", "click", b => { fire(i, b.dataset.fire); refreshPanel(); });
  },
  decor() {
    decorTab = clamp(decorTab, 0, S.shops.length - 1);
    const i = decorTab, sh = S.shops[i];
    const tabs = S.shops.map((s, k) => `<button class="${k === i ? "on" : ""}" data-tab="${k}">📍 ${LOCATIONS[s.loc].city}</button>`).join("");
    const items = Object.keys(DECOR).map(id => {
      const D = DECOR[id], lv = sh.decor[id] || 0, price = D.price * (lv + 1);
      return `<div class="card ${lv >= D.max ? "owned" : ""}"><h4>${D.name} ${D.max > 1 ? `<span class="sub">cấp ${lv}/${D.max}</span>` : ""}</h4><div class="sub">${D.desc}</div>
        <div class="row" style="margin-top:6px">${lv >= D.max ? '<span class="pill green">✔ Đã lắp</span>' : `<button class="btn" data-dec="${id}" ${S.money < price ? "disabled" : ""}>Mua ${money(price)}</button>`}</div></div>`;
    }).join("");
    const body = openModal("🪴 Trang trí quán", `<div class="tabbar">${tabs}</div><p class="sub">Mỗi món trang trí tốn thêm 5.000đ/ngày bảo trì.</p><div class="grid">${items}</div>`, { panel: "decor" });
    on(body, "[data-tab]", "click", b => { decorTab = +b.dataset.tab; refreshPanel(); });
    on(body, "[data-dec]", "click", b => {
      const id = b.dataset.dec, lv = sh.decor[id] || 0, price = DECOR[id].price * (lv + 1);
      if (S.money < price) return;
      S.money -= price; R.today.purchases += price; sh.decor[id] = lv + 1;
      toast(`🪴 Đã lắp ${DECOR[id].name}!`, "gold"); Sound.sfx("coin");
      if (i === S.active) buildScene();
      renderHud(); save(true); refreshPanel();
    });
  },
  ads() {
    const items = Object.keys(MARKETING).map(id => {
      const M = MARKETING[id], act = S.marketing.find(m => m.id === id);
      return `<div class="card ${act ? "owned" : ""}"><h4>📣 ${M.name}</h4><div class="sub">${M.desc}</div><div class="row" style="margin-top:6px">${act ? `<span class="pill green">Đang chạy, còn ${act.days} ngày</span>` : `<button class="btn" data-ad="${id}" ${S.money < M.price ? "disabled" : ""}>Chạy ${money(M.price)}</button>`}</div></div>`;
    }).join("");
    const body = openModal("📣 Quảng cáo", `<p class="sub">Quảng cáo tăng lượng khách. Mời TikToker còn có thể khiến một vị khách đặc biệt ghé quán sớm hơn...</p><div class="grid">${items}</div>`, { panel: "ads" });
    on(body, "[data-ad]", "click", b => {
      const id = b.dataset.ad, M = MARKETING[id];
      if (S.money < M.price) return;
      S.money -= M.price; R.today.marketing += M.price;
      S.marketing.push({ id, days: M.days, boost: M.boost, scope: M.scope });
      toast(`📣 Bắt đầu chiến dịch: ${M.name}`, "gold"); Sound.sfx("coin");
      renderHud(); save(true); refreshPanel();
    });
  },
  chain() {
    const shops = S.shops.map((sh, i) => {
      const L = LOCATIONS[sh.loc], T = R.today && R.today.shops[i];
      const staff = ROLE_ORDER.map(r => sh.staff[r] ? ROLES[r].icon : "▫️").join(" ");
      return `<div class="card ${i === S.active ? "owned" : ""}"><h4>📍 ${L.city} — ${L.name}</h4><div class="sub">${L.desc}</div>
        <div><span class="stars">${stars(sh.rep)}</span> ${Math.floor(sh.rep)} uy tín · Thuê ${money(L.rent)}/ngày</div>
        <div>Nhân viên: ${staff}</div>
        <div class="sub">Hôm nay: ${T ? `${T.served} ly · ${money(T.revenue + T.tips)}` : "-"} · Tổng: ${sh.served} ly</div>
        <div>${i === S.active ? '<span class="pill green">Uyên đang ở đây</span>' : sh.staff.barista ? '<span class="pill">☕ Tự vận hành</span>' : '<span class="pill red">Đóng khi Uyên vắng</span>'}</div></div>`;
    }).join("");
    const reason = canExpand();
    const next = LOCATION_ORDER.filter(l => !S.shops.some(sh => sh.loc === l)).map((l, k) => {
      const L = LOCATIONS[l];
      const can = !reason && k === 0 && S.money >= L.cost && R.phase === "prepare";
      return `<div class="card ${k ? "locked" : ""}"><h4>🏗️ ${L.city} — ${L.name}</h4><div class="sub">${L.desc}</div>
        <div><span class="pill">Chi phí mở: ${money(L.cost)}</span><span class="pill">Thuê ${money(L.rent)}/ngày</span><span class="pill">Lượng khách ×${L.flow}</span><span class="pill">Đặc sản: ${DRINKS[L.specialty].name}</span></div>
        ${k === 0 ? `<div class="row" style="margin-top:6px"><button class="btn teal" data-open="${l}" ${can ? "" : "disabled"}>Mở quán</button><span class="sub">${reason || (S.money < L.cost ? "Chưa đủ tiền" : R.phase !== "prepare" ? "Chỉ mở được vào đầu ngày" : "Sẵn sàng!")}</span></div>` : '<div class="sub">Mở quán trước đó để mở khóa</div>'}</div>`;
    }).join("");
    const body = openModal("🏪 Chuỗi Cửa hàng nhỏ của Uyên", `<p class="sub">Doanh thu và chi phí của mọi quán được đồng bộ về một két chung. Kho nguyên liệu và máy móc dùng chung cả chuỗi.</p>
      <h3>Các quán</h3><div class="grid">${shops}</div><h3>📈 Doanh thu chuỗi</h3>${chartSvg()}${next ? `<h3>Mở rộng</h3><div class="grid">${next}</div>` : ""}`, { panel: "chain" });
    on(body, "[data-open]", "click", b => {
      const l = b.dataset.open, L = LOCATIONS[l];
      if (!confirm(`Mở quán tại ${L.city} với giá ${money(L.cost)}? Uyên sẽ chuyển sang đứng quầy ở quán mới.`)) return;
      S.money -= L.cost;
      S.shops.push(newShop(l, false));
      const idx = S.shops.length - 1;
      R.weatherBy[l] = rollWeather(l);
      R.today.shops[idx] = { served: 0, perfect: 0, lost: 0, revenue: 0, tips: 0, open: true };
      R.today.purchases += L.cost;
      R.cands[idx] = {}; ROLE_ORDER.forEach(r => R.cands[idx][r] = [genCandidate(r), genCandidate(r), genCandidate(r)]);
      S.active = idx;
      toast(`🎊 Khai trương ${L.city}! Khách quen mới đang chờ Uyên ở đây.`, "gold"); Sound.sfx("day");
      checkAchv(); buildScene(); renderAll(); save(true); showPrepare();
    });
  },
  album() {
    const cards = CHARACTERS.map(ch => {
      const cs = S.chars[ch.id];
      const where = ch.loc === "global" ? "Mọi quán" : LOCATIONS[ch.loc].city;
      if (!cs || !cs.met) return `<div class="card locked"><div class="row"><div class="avatar-sm" style="font-size:40px;align-items:center">❔</div><div><h4>???</h4><div class="sub">Gặp ở: ${where}</div></div></div></div>`;
      const h = Math.floor(cs.aff / 20);
      return `<div class="card"><div class="row"><div class="avatar-sm">${Art.person(ch.look, "happy")}</div><div style="flex:1"><h4>${ch.name}</h4><div class="sub">${ch.title} · ${where}</div><div class="hearts">${hearts(cs.aff)}</div></div></div>
        <div class="sub" style="margin-top:4px">${ch.bio}</div>
        <div style="margin-top:4px">${h >= 1 ? "Thích: " + ch.fav.map(f => `<span class="pill">${DRINKS[f].name}</span>`).join("") : '<span class="sub">Thân hơn để biết món yêu thích</span>'}</div>
        <div class="sub">Câu chuyện: ${ch.story.map((s, k) => k < cs.story ? "📖" : "🔒").join(" ")} · Ghé ${cs.visits} lần</div></div>`;
    }).join("");
    const met = Object.values(S.chars).filter(c => c.met).length;
    openModal(`💞 Sổ tay khách quen (${met}/${CHARACTERS.length})`, `<p class="sub">Trò chuyện và pha đúng món yêu thích để tăng tim. Đạt 1, 3, 5 tim sẽ mở khóa câu chuyện và quà (khách hiện 💖). Mở quán ở thành phố mới để gặp khách quen mới!</p><div class="grid">${cards}</div>`, { panel: "album" });
  },
  report() { showReport(S.lastReport, false); },
  achv() {
    const n = Object.keys(S.achv).length;
    openModal(`🏆 Thành tựu (${n}/${ACHIEVEMENTS.length})`, `<div class="grid">${ACHIEVEMENTS.map(a => `<div class="card ${S.achv[a.id] ? "owned" : "locked"}"><h4>${S.achv[a.id] ? "🏆" : "🔒"} ${a.name}</h4><div class="sub">${a.desc}${S.achv[a.id] ? ` · ngày ${S.achv[a.id]}` : ""}</div></div>`).join("")}</div>`, { panel: "achv" });
  },
  settings() {
    const slots = [1, 2, 3].map(n => {
      const d = readSlot(n);
      return `<div class="slot"><div class="info"><b>Ô ${n}${n === slot ? " (đang chơi)" : ""}</b><br><span class="sub">${d ? `Ngày ${d.state.day} · ${d.state.shops.length} quán · ${money(d.state.money)} · ${new Date(d.savedAt).toLocaleString("vi-VN")}` : "Trống"}</span></div>
        <button class="btn teal" data-saveto="${n}">💾 Lưu vào đây</button>${d && n !== slot ? `<button class="btn gray" data-loadfrom="${n}">📂 Tải</button>` : ""}</div>`;
    }).join("");
    const body = openModal("⚙️ Lưu game & Cài đặt", `
      <h3>💾 Lưu tiến trình</h3>
      <p class="sub">Game tự động lưu mỗi 30 phút trong game, đầu và cuối mỗi ngày, và khi đóng tab. Tải lại trang sẽ tiếp tục đúng ngày và giờ đang chơi (khách đang chờ sẽ không được giữ lại).</p>
      ${slots}
      <div class="row"><button class="btn" id="s-export">📤 Xuất file save</button><button class="btn gray" id="s-import">📥 Nhập file save</button><span class="sub">Dùng để sao lưu hoặc chuyển sang máy khác.</span></div>
      <h3>🎷 Âm thanh</h3>
      <div class="row">Nhạc jazz <input type="range" id="s-music" min="0" max="1" step="0.05" value="${S.settings.music}"> Hiệu ứng <input type="range" id="s-sfx" min="0" max="1" step="0.05" value="${S.settings.sfx}"></div>
      <h3>🎮 Trò chơi</h3>
      <div class="row"><label><input type="checkbox" id="s-hints" ${S.settings.hints ? "checked" : ""}> Hiện gợi ý công thức trên quầy</label></div>
      <div class="row" style="margin-top:14px"><button class="btn gray" id="s-title">🏠 Về màn hình chính</button><button class="btn gray" id="s-howto">📖 Cách chơi</button></div>`, { panel: "settings" });
    on(body, "[data-saveto]", "click", b => {
      const n = +b.dataset.saveto;
      if (n !== slot && readSlot(n) && !confirm(`Ghi đè ô ${n}?`)) return;
      slot = n; save(); refreshPanel();
    });
    on(body, "[data-loadfrom]", "click", b => {
      const n = +b.dataset.loadfrom;
      if (!confirm(`Tải ô ${n}? Tiến trình hiện tại ở ô ${slot} vẫn được giữ.`)) return;
      save(true); slot = n; closeModal(); loadData(readSlot(n));
    });
    $("#s-export").onclick = exportSave;
    $("#s-import").onclick = importSave;
    $("#s-music").oninput = e => { S.settings.music = +e.target.value; applySettings(); };
    $("#s-sfx").oninput = e => { S.settings.sfx = +e.target.value; applySettings(); Sound.sfx("coin"); };
    $("#s-hints").onchange = e => { S.settings.hints = e.target.checked; renderBench(); };
    $("#s-title").onclick = () => { save(true); closeDialog(); showTitle(); };
    $("#s-howto").onclick = () => openModal("📖 Cách chơi", TUTORIAL.map(t => `<p style="font-size:20px">${t}</p>`).join(""));
  },
};
function buy(k, n, silent) {
  const cost = ingPrice(k) * n;
  if (S.money < cost) { if (!silent) toast("Không đủ tiền nhập hàng!", "bad"); return; }
  S.money -= cost; S.inv[k] = (S.inv[k] || 0) + n; R.today.purchases += cost;
  if (!silent) { Sound.sfx("coin"); refreshPanel(); }
  renderIngredients(); renderHud(); renderDockDots();
}
function exportSave() {
  save(true);
  const data = readSlot(slot) || { state: S, run: snapshot(), savedAt: Date.now() };
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const a = el("a"); a.href = URL.createObjectURL(blob); a.download = `cua-hang-nho-cua-uyen-ngay-${S.day}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast("📤 Đã xuất file save");
}
function importSave() {
  const inp = el("input"); inp.type = "file"; inp.accept = ".json,application/json";
  inp.onchange = () => {
    const f = inp.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const data = JSON.parse(rd.result);
        if (!data.state || !Array.isArray(data.state.shops)) throw new Error("bad");
        const n = +(prompt("Nhập vào ô lưu số mấy? (1, 2 hoặc 3)", String(slot)) || 0);
        if (![1, 2, 3].includes(n)) return;
        localStorage.setItem(SAVE_KEY(n), JSON.stringify(data));
        slot = n; startMusic(); closeModal(); loadData(data);
        toast("📥 Đã nhập file save!", "gold");
      } catch (e) { toast("File save không hợp lệ", "bad"); }
    };
    rd.readAsText(f);
  };
  inp.click();
}
function applySettings() { if (!S) return; Sound.setMusicVol(S.settings.musicOn ? S.settings.music : 0); Sound.setSfxVol(S.settings.sfx); $("#btn-music").classList.toggle("off", !S.settings.musicOn); }
function startMusic() { Sound.init(); if (!S || S.settings.musicOn) { Sound.start(); applySettings(); } }

// ---------- Sự kiện giao diện ----------
function bindUI() {
  document.querySelectorAll("#dock-btns button").forEach(b => b.addEventListener("click", () => {
    if (!S || R.phase === "title" || R.phase === "tutorial") return;
    Sound.sfx("click"); closeDialog();
    const p = b.dataset.panel;
    if (R.phase === "report") return;
    PANELS[p]();
  }));
  $("#modal-close").onclick = () => { Sound.sfx("click"); closeModal(); if (R.phase === "prepare") showPrepare(); };
  $("#btn-serve").onclick = serve;
  $("#btn-dump").onclick = () => { if (!R.cup.length) return; R.cup = []; Sound.sfx("pour"); renderBench(); };
  $("#btn-undo").onclick = () => { if (!R.cup.length) return; R.cup.pop(); Sound.sfx("click"); renderBench(); };
  $("#btn-clean").onclick = () => {
    if (R.cleanCd) return;
    R.clean = clamp(R.clean + 40, 0, 100); R.cleanCd = true; $("#btn-clean").disabled = true; Sound.sfx("pop");
    setTimeout(() => { R.cleanCd = false; $("#btn-clean").disabled = false; }, 2000);
    renderHud();
  };
  $("#btn-pause").onclick = () => { if (R.phase !== "open") return; R.paused = !R.paused; setPauseUI(); };
  $("#btn-speed").onclick = () => { R.speed = R.speed === 1 ? 2 : R.speed === 2 ? 3 : 1; $("#btn-speed").textContent = R.speed + "×"; };
  $("#btn-music").onclick = () => {
    if (!S) return;
    S.settings.musicOn = !S.settings.musicOn;
    if (S.settings.musicOn) Sound.start();
    applySettings();
  };
  // Phím tắt: phím số 1-9 chọn nguyên liệu, Enter phục vụ, Backspace bỏ bước, Space tạm dừng
  addEventListener("keydown", e => {
    if (!S || R.phase !== "open" || !$("#modal").classList.contains("hidden")) return;
    if (e.key === "Enter") { e.preventDefault(); serve(); }
    else if (e.key === "Backspace") { e.preventDefault(); $("#btn-undo").click(); }
    else if (e.key === " ") { e.preventDefault(); $("#btn-pause").click(); }
  });
  addEventListener("resize", fit);
  document.addEventListener("visibilitychange", () => { if (document.hidden && S && R.phase !== "title") save(true); });
  addEventListener("beforeunload", () => { if (S && R.phase !== "title" && R.phase !== "report") save(true); });
  // Trình duyệt chỉ cho phát nhạc sau thao tác đầu tiên
  addEventListener("pointerdown", () => { if (S && S.settings.musicOn && !Sound.playing) startMusic(); }, { once: false });
}

// ---------- Khởi động ----------
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
fit(); bindUI();
setTimeout(fit, 300); // iOS cập nhật kích thước muộn sau khi xoay màn hình
addEventListener("orientationchange", () => setTimeout(fit, 300));
S = newState();
renderAll(); buildScene();
S = null;
showTitle();
requestAnimationFrame(frame);
})();
