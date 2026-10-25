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
const seasonIdx = (d = S.day) => Math.floor((d - 1) / 14) % 4;
const season = () => SEASONS[seasonIdx()];
const clock = t => String(Math.floor(t / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0");

const DAY_START = 7 * 60, DAY_END = 21 * 60, MS_PER_MIN = 300;
const POWER_EQUIP = ["may_espresso", "may_xay", "may_danh_trung"];
const powerIng = k => POWER_EQUIP.includes(INGREDIENTS[k].equip);
const powerDrink = id => DRINKS[id].recipe.some(powerIng);
const SAVE_KEY = slot => "chnu_save_" + slot;
const META_KEY = "chnu_meta";

// ---------- Trạng thái ----------
let S = null;     // dữ liệu được lưu
let slot = 1;     // ô lưu hiện tại
const R = {       // dữ liệu tạm trong ngày
  phase: "title", E: 0, time: DAY_START, speed: 1, paused: false, acc: 0, uid: 0,
  customers: [], tickets: [], sel: null, cup: [], drip: false,
  today: null, weatherBy: {}, event: null, goals: [], clean: 100, cleanCd: false,
  regularsToday: [], sim: {}, cands: {}, bJob: null, lastSave: 0, dialog: null, criticDone: false, closingShown: false,
};

// Kho khởi đầu của quán: nguyên liệu cơ bản + 10 phần mỗi đặc sản địa phương
function starterInv(locId) {
  const inv = Object.assign({}, STARTER_INV);
  for (const k in INGREDIENTS) if (INGREDIENTS[k].only && INGREDIENTS[k].only.includes(locId)) inv[k] = 10;
  return inv;
}
function newShop(loc, first) {
  const inv = starterInv(loc);
  if (first) Object.assign(inv, { phin: 40, sua_dac: 30, duong: 40, chanh: 20, sa: 12, cacao: 12 });
  return { loc, inv, target: Object.assign({}, inv), equip: {}, rep: first ? 30 : 35, decor: {}, staff: { waiter: null, cleaner: null, cashier: null, barista: null }, served: 0, perfect: 0, opened: S ? S.day : 1 };
}
function newStory() {
  return { chapter: 1, chapterShown: 0, fragments: 0, pages: { 0: 1, 1: 1, 2: 1 }, moodMatches: 0, moodTip: 0, notebook: false,
    rival: null, stormDone: false, lastPage: null, seasonShown: 0 };
}
function newState() {
  const st = {
    v: 2, money: 2000000, day: 1, shops: [], active: 0, lastOpenDay: 1,
    secrets: {}, chars: {}, history: [], achv: {},
    totals: { served: 0, perfect: 0, earned: 0, chats: 0 },
    flowBonus: 0, marketing: [], settings: { music: 0.5, sfx: 0.6, hints: true, musicOn: true, musicPreset: "auto" },
    items: { phin_ngoai: 1 }, setsDone: {}, tipLoc: {}, signatures: [], story: newStory(), cityStory: {}, shopPerk: {},
    introDone: false, debtDays: 0, lastReport: null, repV2: true,
  };
  S = st; st.shops.push(newShop("hanoi", true));
  return st;
}
const shop = () => S.shops[S.active];
// Két tiền về 0 hoặc âm là phá sản, nên mọi khoản chi phải chừa lại tiền
const canAfford = cost => S.money - cost > 0;
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
  if (st.inv) {
    (merged.shops || []).forEach((sh, k) => {
      sh.equip = Object.assign({}, st.equip || {});
      sh.inv = k === (st.active || 0) ? Object.assign(starterInv(sh.loc), st.inv) : starterInv(sh.loc);
      sh.target = Object.assign({}, starterInv(sh.loc), st.target || {});
    });
    delete merged.inv; delete merged.target; delete merged.equip;
  }
  (merged.shops || []).forEach(sh => { sh.inv = sh.inv || starterInv(sh.loc); sh.target = sh.target || starterInv(sh.loc); sh.equip = sh.equip || {}; });
  merged.story = Object.assign(newStory(), st.story || {});
  merged.signatures = st.signatures || [];
  merged.cityStory = st.cityStory || {}; merged.shopPerk = st.shopPerk || {};
  if (!merged.repV2) { (merged.shops || []).forEach(sh => sh.rep = Math.min(100, sh.rep + 20)); merged.repV2 = true; }
  const oldTrait = { cham: "nhanh", duyen: "duyen", can: "taynghe", vui: "thanthien" };
  (merged.shops || []).forEach(sh => Object.values(sh.staff).forEach(x => { if (x && !x.perks) { x.perks = [oldTrait[x.trait] || "nhanh"]; x.flaws = []; delete x.trait; } }));
  return merged;
}
function loadData(data) {
  S = migrate(data.state);
  registerSignatures();
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
  // Khung rộng 1600, cao từ 900 (16:9) tới 1200 (4:3) tùy màn hình — iPad dùng thêm chiều cao
  const H = Math.round(clamp(1600 * h / w, 900, 1200));
  const E = H - 900;
  const s = Math.min(w / 1600, h / H);
  const st = $("#stage");
  st.style.height = H + "px";
  st.style.setProperty("--E", E + "px");
  if (E !== R.E) { R.E = E; if (S) { $("#scene-bg").innerHTML = Art.sceneBg(shop().loc, shop().decor, E, shelfItems()); renderStaff(); R.customers.forEach(c => { if (c.el) c.el.style.left = slotX(c.slot, maxSlots()) + "px"; }); } }
  st.style.transform = `scale(${s})`;
  st.style.left = pl + (w - 1600 * s) / 2 + "px";
  st.style.top = pt + (h - H * s) / 2 + "px";
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
function ingAvail(k, sh = shop()) {
  const I = INGREDIENTS[k];
  if (I.only && !I.only.includes(sh.loc)) return false;
  if (I.equip && !sh.equip[I.equip]) return false;
  if (I.secret && !S.secrets[I.secret]) return false;
  return true;
}
function drinkAvail(id, sh = shop()) {
  const d = DRINKS[id];
  if (d.only && d.only !== sh.loc) return false;
  if (d.equip && !sh.equip[d.equip]) return false;
  if (d.secret && !S.secrets[id]) return false;
  if (d.story && !(S.story && S.story.lastPage)) return false;
  return d.recipe.every(k => ingAvail(k, sh));
}
const outageNow = () => R.phase === "open" && (!!(R.powerCut && R.time < R.powerCut.until) || !!(R.event && R.event.outage && R.time >= R.event.outage[0] && R.time < R.event.outage[1]));
// Món đang bán của một quán (cúp điện chỉ ảnh hưởng quán Uyên đang đứng)
const menuList = (sh = shop()) => Object.keys(DRINKS).filter(id => drinkAvail(id, sh)).filter(id => sh !== shop() || !outageNow() || !powerDrink(id));
function ingPrice(k) {
  let p = INGREDIENTS[k].cost || 0;
  if (R.event && R.event.priceUp && R.event.priceUp.includes(k)) p *= 1.3;
  if (R.event && R.event.discount) p *= 1 - R.event.discount;
  return Math.round(p / 100) * 100;
}
// Ưu/nhược điểm của nhân viên
const staffTraits = st => [...(st.perks || []).map(k => PERKS[k]), ...(st.flaws || []).map(k => FLAWS[k])].filter(Boolean);
const effOf = (st, key) => st ? staffTraits(st).reduce((a, t) => a + ((t.eff && t.eff[key]) || 0), 0) : 0;
// Nhân viên có mặt hôm nay (không xin nghỉ)
const present = (sh, role) => { const st = sh.staff[role]; return st && !st.absent ? st : null; };
const shopEff = (sh, key) => ROLE_ORDER.reduce((a, r) => a + effOf(present(sh, r), key), 0);

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
  const menu = menuList(shop());
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
  S.shops.forEach((sh, i) => shops[i] = { served: 0, perfect: 0, lost: 0, revenue: 0, tips: 0, open: i === S.active || !!present(sh, "barista") });
  return { shops, served: 0, perfect: 0, chats: 0, drinks: {}, purchases: 0, marketing: 0, eventCost: 0, bonus: 0, lostActive: 0, shortage: {} };
}
function genCandidate(role) {
  const g = rand() < 0.5 ? "f" : "m";
  const skill = clamp(1 + Math.floor(rand() * rand() * 5.5), 1, 5);
  const perks = shuffle(Object.keys(PERKS)).slice(0, rand() < 0.35 ? 2 : 1);
  const flaws = rand() < 0.75 ? [pick(Object.keys(FLAWS))] : [];
  const [lo, hi] = ROLES[role].wage;
  let wage = (lo + (hi - lo) * ((skill - 1) / 4)) * (0.9 + rand() * 0.2) * (1 + 0.08 * perks.length - 0.06 * flaws.length);
  flaws.forEach(f => { if (FLAWS[f].wage) wage *= 1 + FLAWS[f].wage; });
  const look = randLook(g, "young"); look.shirt = "apron"; look.sc = pick(["#e07a5f", "#2a9d8f", "#f4a261", "#8338ec", "#3a86ff"]);
  return { name: pick(HO) + " " + pick(g === "f" ? TEN_F : TEN_M), look, skill, wage: Math.round(wage / 5000) * 5000, perks, flaws, days: 0, role };
}
function genCands() {
  R.cands = {};
  S.shops.forEach((sh, i) => { R.cands[i] = {}; ROLE_ORDER.forEach(r => R.cands[i][r] = [genCandidate(r), genCandidate(r), genCandidate(r)]); });
}
function prepareDay() {
  R.phase = "prepare";
  checkChapter();
  R.seasonBoost = S.day > 1 && (S.day - 1) % 14 === 0 ? 1.15 : 1;
  R.weatherBy = {}; S.shops.forEach(sh => R.weatherBy[sh.loc] = rollWeather(sh.loc));
  R.event = S.day > 1 && rand() < 0.38 ? Object.assign({}, pick(EVENTS)) : null;
  R.today = newToday();
  R.goals = makeGoals();
  R.regularsToday = []; R.sim = {}; R.criticDone = false; R.clean = 100; R.expandAsked = false;
  R.customers = []; R.tickets = []; R.sel = null; R.cup = []; R.bJob = null; R.closingShown = false;
  clearSurprises();
  genCands();
  // Nhân viên "hay xin nghỉ" có thể vắng mặt hôm nay
  R.away = [];
  S.shops.forEach(sh => ROLE_ORDER.forEach(r => {
    const st = sh.staff[r]; if (!st) return;
    st.absent = rand() < effOf(st, "absent");
    if (st.absent) R.away.push(`${st.name} (${ROLES[r].name} · ${LOCATIONS[sh.loc].city})`);
  }));
  R.today = newToday();
  if (R.event && R.event.cost) { S.money -= R.event.cost; R.today.eventCost += R.event.cost; }
  autoRestock();
  buildScene(); renderAll();
  save(true);
  showPrepare();
}
function autoRestock() {
  S.shops.forEach(sh => {
    if (!present(sh, "cashier")) return;
    let cost = 0, bought = 0;
    for (const k in sh.target) {
      if (!ingAvail(k, sh) || INGREDIENTS[k].free) continue;
      const need = Math.max(0, (sh.target[k] || 0) - (sh.inv[k] || 0));
      if (!need) continue;
      const c = need * ingPrice(k);
      if (!canAfford(c)) continue;
      S.money -= c; cost += c; bought += need; sh.inv[k] = (sh.inv[k] || 0) + need;
    }
    if (bought) { R.today.purchases += cost; toast(`💁 Thu ngân quán ${LOCATIONS[sh.loc].city} đã nhập ${bought} phần nguyên liệu (${money(cost)})`); }
  });
}
function openDay() {
  R.phase = "open"; R.time = DAY_START; R.acc = 0; R.paused = false;
  // Quán không có pha chế và Uyên không đứng -> đóng cửa
  S.shops.forEach((sh, i) => R.today.shops[i].open = i === S.active || !!present(sh, "barista"));
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
    if (R.qte) qteTick(dt);
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
  const rival = S.story.rival && !S.story.stormDone && i === 0 ? (S.story.rival.choice === "theo" ? 0.9 : 0.7) : 1;
  return 0.06 * rival * (1 + perkOf(sh.loc, "flow")) * (R.seasonBoost || 1) * (sh.decor.san_vuon ? 1.08 : 1) * (1 + shopEff(sh, "flow")) * curve * L.flow * (0.6 + sh.rep / 100 * 0.9) * W.flow * ((R.event && R.event.flow) || 1) * weekend * mk * (1 + S.flowBonus) * (d.bien_neon ? 1.15 : 1) * ac;
}
function maxSlots() { return Math.min(6, 3 + (shop().decor.ban_ghe || 0)); }

function tickMinute() {
  R.time++;
  const sh = shop();
  // Khách mới
  if (R.time < DAY_END) {
    if (rand() < lambda(S.active, R.time)) spawnCustomer();
    if (R.event && R.event.critic && !R.criticDone && R.time > 10 * 60 && rand() < 0.01) spawnCustomer(true);
    if (R.time > DAY_START + 30 && R.time < DAY_END - 30 && !R.qte) maybeSurprise();
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
      const wt = present(sh, "waiter");
      if (c.state === "order" && wt && !c.mood && c.wait >= Math.max(1, (4 - wt.skill * 0.6) * (1 - effOf(wt, "speed")))) takeOrder(c);
    }
  }
  syncPower();
  // Pha chế tự động tại quán Uyên đứng
  baristaTick();
  staffTick();
  // Các quán khác tự vận hành
  S.shops.forEach((s, i) => { if (i !== S.active && R.today.shops[i].open) simTick(i); });
  // Hết giờ
  if (R.time >= DAY_END + 60) R.customers.slice().forEach(c => leave(c, "quiet"));
  if (R.time >= DAY_END && !R.customers.length && R.time > DAY_END + 2) { endDay(); return; }
  if (checkBankrupt()) return;
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
  const menu = menuList(S.shops[i]); if (!menu.length) return "den_da";
  if (favs) { const f = favs.filter(x => menu.includes(x)); if (f.length && rand() < 0.65) return pick(f); }
  const sh = S.shops[i], W = WEATHER[R.weatherBy[sh.loc] || "nang"], spec = LOCATIONS[sh.loc].specialty;
  const w = menu.map(id => { const d = DRINKS[id]; let x = d.hot ? W.hot : clamp(2 - W.hot * 0.6, 0.3, 2); if (id === spec) x *= 2.2; if (DRINK_FEEL[id] === season().feel) x *= 1.5; if (d.sig) x *= 1.4; if (d.secret) x *= 0.6; return x; });
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
    if (S.story.chapter >= 2 && rand() < 0.3) c.mood = pick(Object.keys(MOODS));
  } else {
    const look = randLook();
    const n = S.day >= 2 && rand() < 0.15 ? (rand() < 0.6 ? 2 : 3) : 1;
    const items = Array.from({ length: n }, () => pickDrink(S.active));
    c = { reg: null, name: genName(look), look, drink: items[0], items, patF: 0.8 + rand() * 0.5 };
  }
  c.items = c.items || [c.drink]; c.idx = 0;
  if (!c.reg && !c.critic && c.items.length === 1 && S.story.chapter >= 2 && rand() < 0.22) c.mood = pick(Object.keys(MOODS));
  const pf = c.patF * (sh.decor.san_vuon ? 1.12 : 1) * (present(sh, "waiter") ? 1.25 : 1) * (sh.decor.loa_jazz ? 1.15 : 1) * Math.max(0.5, 1 + shopEff(sh, "patience"));
  Object.assign(c, { uid: ++R.uid, slot: s, state: "walking", wait: 0, chatted: false, tipBonus: 0, maxOrder: Math.round(55 * pf), maxDrink: Math.round(110 * pf * (1 + 0.5 * (c.items.length - 1))) });
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
  else if (c.state === "order") b.innerHTML = `<span class="big">${storyPending(c) ? "💖" : c.mood ? MOODS[c.mood].icon : "💬"}${c.items && c.items.length > 1 ? `<small class="multi">×${c.items.length}</small>` : ""}</span>${pbar}`;
  else if (c.state === "drink") b.innerHTML = `<span class="mini-cup">${Art.drinkIcon(c.drink)}</span>${DRINKS[c.drink].name}${c.items && c.items.length > 1 ? ` <b>(${c.idx + 1}/${c.items.length})</b>` : ""}${!c.chatted ? " 💬" : ""}${storyPending(c) ? " 💖" : ""}${pbar}`;
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
function custPos(c) { return { x: slotX(c.slot, maxSlots()), y: 250 + R.E }; }
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
  if (how === "angry") checkBankrupt();
}

// ---------- Phá sản ----------
// Uy tín một quán về 0: khách mất niềm tin, chuỗi đóng cửa, phải chơi lại từ đầu
function checkBankrupt() {
  if (R.phase !== "open" || !S) return false;
  R.repWarn = R.repWarn || {};
  S.shops.forEach((sh, i) => {
    if (sh.rep < 10 && !R.repWarn[i]) { R.repWarn[i] = true; toast(`⚠️ Uy tín quán ${LOCATIONS[sh.loc].city} chỉ còn ${Math.ceil(sh.rep)}! Về 0 là phá sản.`, "bad"); Sound.sfx("alarm"); }
    if (sh.rep >= 15) R.repWarn[i] = false;
  });
  if (S.money <= 0) { gameOver("money"); return true; }
  const i = S.shops.findIndex(sh => sh.rep <= 0.01);
  if (i < 0) return false;
  gameOver("rep", i);
  return true;
}
function gameOver(reason, i) {
  const L = reason === "rep" ? LOCATIONS[S.shops[i].loc] : null;
  R.phase = "gameover"; R.paused = false;
  closeDialog(); clearSurprises(); setPauseUI();
  R.customers.slice().forEach(c => { if (c.el) c.el.remove(); });
  R.customers = []; R.tickets = []; R.sel = null; R.cup = []; R.bJob = null;
  renderTickets(); renderBench();
  try { localStorage.removeItem(SAVE_KEY(slot)); if (lastSlot() === slot) localStorage.removeItem(META_KEY); } catch (e) {}
  Sound.sfx("powerdown");
  const friends = Object.values(S.chars).filter(c => c.aff >= 40).length;
  const body = openModal("💸 Phá sản — cửa hàng đóng cửa", `
    <div class="intro-wrap"><div class="portrait">${Art.person(Art.UYEN, "sad")}</div>
    <div class="intro-text" style="font-size:20px">${reason === "rep" ? `Uy tín quán <b>${L.city}</b> đã về 0. Khách không còn tin tưởng, chủ nhà đòi lại mặt bằng` : `Két tiền còn <b>${money(S.money)}</b>, không đủ trả tiền thuê và lương nhân viên`}, và chuỗi Cửa hàng nhỏ của Uyên phải đóng cửa.
      <p style="margin:12px 0">📞 Ngoại gọi điện: “Không sao đâu con. Ngã ở đâu thì đứng dậy ở đó. Làm lại từ đầu, lần này con sẽ giỏi hơn.”</p>
      <div class="row"><span class="pill">📅 Trụ được ${S.day} ngày</span><span class="pill">🏪 ${S.shops.length} quán</span><span class="pill">☕ ${S.totals.served} ly</span><span class="pill">💵 Tổng thu ${money(S.totals.earned)}</span><span class="pill">💞 ${friends} khách ruột thân thiết</span><span class="pill">📚 ${Object.keys(S.items).length} kỷ vật</span></div>
      <p class="sub">Tiến trình ở ô lưu ${slot} đã bị xóa.</p>
      <div class="row" style="margin-top:12px"><button class="btn big teal" id="go-restart">🔁 Chơi lại từ đầu</button></div></div></div>`, { noClose: true });
  $("#go-restart").onclick = () => { newState(); S.introDone = false; applySettings(); STF.sig = ""; buildScene(); renderAll(); showIntro(); };
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
  const reg = extra && extra.c && extra.c.reg;
  $("#scene").classList.toggle("tamsu", !!reg);
  if (reg) $("#tamsu-banner").textContent = `☕ Đang trò chuyện với ${reg.name} — quán tạm ngưng đón khách`;
}
function closeDialog() { R.dialog = null; $("#dialog").classList.add("hidden"); $("#scene").classList.remove("tamsu"); }
function dlgName(c) {
  if (c.critic) return `📝 Nhà phê bình <small>Khách đặc biệt</small>`;
  if (!c.reg) return `${c.name} <small>Khách vãng lai</small>`;
  const cs = S.chars[c.reg.id];
  return `${c.reg.name} <small>${c.reg.title}</small><span class="hearts">${hearts(cs.aff)}</span>`;
}
function clickCustomer(c) {
  if (c.tut) return tutClickCustomer(c);
  if (isPaused()) return;
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
    if (c.mood) return moodMenu(c, greet);
    const n = c.items ? c.items.length : 1;
    text = greet + " " + (n > 1 ? `Cho mình ${n} ly luôn nhé: ${c.items.map(x => DRINKS[x].name).join(", ")}!` : pick(GEN.order).replace("{d}", d.name));
  } else text = pick(["Mình đang đợi ", "Không vội đâu, ", "Ly "]) + d.name + (rand() < 0.5 ? " nha!" : " của mình sắp xong chưa?");
  const choices = [];
  if (c.state === "order") choices.push({ label: `📝 Nhận order: ${c.items && c.items.length > 1 ? c.items.length + " ly" : d.name}`, main: true, fn: () => { takeOrder(c); closeDialog(); } });
  const st = storyPending(c);
  if (st) choices.push({ label: "💖 Ngồi tâm sự", fn: () => playStory(c, st) });
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
      cs.aff = clamp(cs.aff + affMul(delta), 0, 100);
      const after = Math.floor(cs.aff / 20);
      if (after > before) { toast(`💖 ${c.reg.name} đã lên ${after} tim!`, "gold"); Sound.sfx("heart"); }
    } else c.tipBonus += delta * 0.02 * (shop().decor.goc_sach ? 1.3 : 1);
    if (delta > 0) c.pat = Math.min(c.max, c.pat + 25);
    const p = custPos(c);
    floater(p.x + 40, p.y, delta >= 5 ? "💖💖" : delta > 0 ? "💖" : delta < 0 ? "💔" : "😐", delta < 0 ? "#e63946" : "#ff4d6d");
    renderBubble(c); checkGoals();
    openDialog(c.look, dlgName(c), reply, [{ label: "▶ Tiếp tục", main: true, fn: () => showCustomerMenu(c, c.state === "order" ? "À mà, " + pick(GEN.order).replace("{d}", DRINKS[c.drink].name).toLowerCase() : "Nói chuyện với Uyên vui ghê!") }], { c, mood: delta > 0 ? "happy" : delta < 0 ? "sad" : "neutral" });
  } }));
  openDialog(c.look, dlgName(c), topic.q, choices, { c, mood: "neutral" });
}
function playStory(c, st) {
  const ch = c.reg, cs = S.chars[ch.id], reps = (STORY_REPLIES[ch.id] || [])[cs.story];
  let i = 0;
  const talk = { c, mood: "happy" };
  const finish = () => {
    cs.story++;
    addFragments(1, "nghe " + ch.name + " tâm sự");
    applyReward(st.reward, ch.name);
    Sound.sfx("heart"); renderBubble(c);
    const gift = cs.story >= ch.story.length && Object.keys(ITEMS).find(k => ITEMS[k].from === ch.id);
    if (gift && !S.items[gift]) return giftScene(c, gift);
    showCustomerMenu(c, "Cảm ơn Uyên đã lắng nghe nha!");
  };
  const replyStep = () => {
    if (!reps) return finish();
    openDialog(Art.UYEN, `Bảo Uyên <small>trả lời ${ch.name}</small>`, "Uyên nên nói gì đây?", shuffle(reps).map(([say, delta, resp]) => ({ label: "💬 " + say, fn: () => {
      const before = Math.floor(cs.aff / 20);
      cs.aff = clamp(cs.aff + affMul(delta), 0, 100);
      if (Math.floor(cs.aff / 20) > before) { toast(`💖 ${ch.name} đã lên ${Math.floor(cs.aff / 20)} tim!`, "gold"); Sound.sfx("heart"); }
      const p = custPos(c); floater(p.x + 40, p.y, delta >= 5 ? "💖💖" : delta > 0 ? "💖" : "💔", delta < 0 ? "#e63946" : "#ff4d6d");
      openDialog(c.look, dlgName(c), resp, [{ label: "💖 Cảm ơn đã kể Uyên nghe", main: true, fn: finish }], { c, mood: delta > 0 ? "happy" : "sad" });
    } })), talk);
  };
  const step = () => {
    if (i < st.lines.length) {
      const line = st.lines[i++];
      openDialog(c.look, dlgName(c), line, [{ label: "▶ Nghe tiếp", main: true, fn: step }], talk);
    } else replyStep();
  };
  openDialog(Art.UYEN, "Bảo Uyên", `Uyên rót thêm ly nước, kéo ghế ngồi cạnh ${ch.name}: "Hôm nay kể Uyên nghe chuyện của mình đi."`, [{ label: "☕ Ngồi xuống lắng nghe", main: true, fn: step }], talk);
}
function giftScene(c, id) {
  const I = ITEMS[id], ch = c.reg;
  giveItem(id, ch.name);
  openDialog(c.look, dlgName(c), `${ch.name} đặt vào tay Uyên một món đồ: ${I.icon} ${I.name}. “${I.desc}” Uyên giữ giúp nhé, coi như một phần đời của ${ch.name} ở lại quán.`,
    [{ label: "📚 Cất vào Sổ sưu tập", main: true, fn: () => showCustomerMenu(c, "Cảm ơn Uyên vì đã luôn lắng nghe.") }], { c, mood: "happy" });
}
function offerSwap(c, t) {
  const alts = shuffle(menuList()).slice(0, 3);
  if (!alts.length) { toast("Không còn món nào pha được khi cúp điện!", "bad"); return; }
  openDialog(c.look, dlgName(c), `Cúp điện hả chị? Vậy ${DRINKS[t.drink].name} chắc không làm được rồi... đổi giúp mình món khác nhé.`,
    alts.map(id => ({ label: `🔁 ${DRINKS[id].name}`, fn: () => {
      c.drink = id; if (c.items) c.items[c.idx] = id; t.drink = id;
      c.pat = Math.min(c.max, c.pat + 20); R.sel = t.id;
      closeDialog(); renderBubble(c); renderTickets(); renderBench(); Sound.sfx("pop");
    } })).concat([{ label: "⏳ Mình chờ có điện", fn: closeDialog }]), { c, mood: "neutral" });
}

// ---------- Cốt truyện: các mốc truyện, sổ tay, tâm trạng ----------
const affMul = d => d > 0 ? Math.round(d * (shop().decor.goc_sach ? 1.3 : 1) * (S.story.rival && !S.story.stormDone ? (S.story.rival.choice === "theo" ? 0.7 : 1.3) : 1)) : d;
const priceMod = i => S.story.rival && !S.story.stormDone && i === 0 && S.story.rival.choice === "theo" ? 0.9 : 1;
function addFragments(n, why) {
  if (!S.story.notebook) return;
  S.story.fragments += n;
  toast(`🧩 +${n} mảnh ghép câu chuyện (${why})`, "gold");
  renderDockDots(); renderChapterBar();
}
function chapterProgress(n = S.story.chapter) {
  const C = CHAPTERS[n - 1];
  return { C, done: C.goals.filter(g => g.test(S)).length, total: C.goals.length };
}
function checkChapter() {
  const st = S.story;
  if (st.chapter >= 4) return;
  const { done, total } = chapterProgress();
  if (done < total) return;
  if (st.chapter === 2 && S.day < 10) return;
  st.chapter++;
  toast(`📖 Câu chuyện mới: ${CHAPTERS[st.chapter - 1].title}`, "gold");
}
function renderChapterBar() {
  const bar = $("#chapter-bar"); if (!bar || !S) return;
  const { C, done, total } = chapterProgress();
  bar.innerHTML = S.story.lastPage ? `🌸 Cốt truyện đã trọn vẹn · <b>Sổ tay đã đầy</b>`
    : `${C.icon} <b>${C.title}</b><span class="cb-prog">${done}/${total}</span>${S.story.notebook ? `<span class="cb-frag">🧩 ${S.story.fragments}</span>` : ""}`;
}
function showChapterCard(n, starting) {
  const { C } = chapterProgress(n);
  const goals = C.goals.map(g => `<div class="goal ${g.test(S) ? "done" : ""}"><span>${g.test(S) ? "✅" : "⬜"} ${g.text}</span></div>`).join("");
  openModal(`${C.icon} ${C.title}`, `<div class="intro-wrap"><div class="portrait">${Art.person(Art.UYEN, "happy")}</div><div class="intro-text" style="font-size:20px">
    <div class="sub" style="font-size:16px">${C.sub}</div>${C.intro.map(t => `<p style="margin:8px 0">${t}</p>`).join("")}
    <h3>Mục tiêu</h3>${goals}${C.n === 2 ? `<p class="sub">Từ giờ, khách có biểu tượng tâm trạng (😮‍💨 🥺 🤔 🫥 🥵 🥳) sẽ nhờ Uyên chọn món. Hãy lắng nghe và gợi ý ly hợp lòng họ.</p>` : ""}
    <div class="row" style="margin-top:12px"><button class="btn big teal" id="ch-ok">${starting ? "🌱 Bắt đầu" : "Đóng"}</button></div></div></div>`, { noClose: true });
  $("#ch-ok").onclick = () => { if (starting) S.story.chapterShown = n; save(true); R.phase === "prepare" ? showPrepare() : closeModal(); };
}
// Các cảnh truyện chen vào đầu ngày (theo thứ tự ưu tiên)
function storyGate() {
  const st = S.story;
  if (st.chapterShown < st.chapter) { showChapterCard(st.chapter, true); return true; }
  if (!st.notebook && S.day >= 2) { showNotebookFound(); return true; }
  if (st.chapter >= 3 && !st.rival && !st.stormDone) { showRival(); return true; }
  if (st.rival && !st.stormDone && S.day >= st.rival.since + 3) { showStorm(); return true; }
  if (st.chapter >= 4 && !st.lastPage && !R.lastPageAsked) { R.lastPageAsked = true; PANELS.notebook(); return true; }
  if (cityActReady()) { showCityAct(); return true; }
  if (S.day > 1 && st.seasonShown !== S.day && (S.day - 1) % 14 === 0) { st.seasonShown = S.day; showSeason(); return true; }
  return false;
}
function storyModal(title, look, lines, btn, done) {
  let i = 0;
  const step = () => {
    if (i >= lines.length) return done();
    const t = lines[i++];
    openModal(title, `<div class="intro-wrap"><div class="portrait">${Art.person(look, "happy")}</div><div class="intro-text">${t}
      <div style="margin-top:18px"><button class="btn big" id="sm-next">${i < lines.length ? "▶ Tiếp" : btn}</button></div></div></div>`, { noClose: true });
    $("#sm-next").onclick = () => { Sound.sfx("click"); step(); };
  };
  step();
}
function showNotebookFound() {
  storyModal("📖 Cuốn sổ dưới ngăn kéo", Art.UYEN, [
    "Sáng nay lau quầy, Uyên kéo ngăn kéo cũ ra thì nghe “cộp” một tiếng. Có gì đó bị gài ở mặt dưới...",
    "Một cuốn sổ bìa vải đã sờn. Nét chữ nghiêng nghiêng của ngoại: “Sổ tay công thức”.",
    "Nhiều trang bị mờ vì ẩm, chỉ còn đọc được vài dòng. Ở một trang có ghi chú dở dang: “Ly nước dành cho người đang tìm lại ký ức...”",
    "Uyên ôm cuốn sổ vào lòng: “Mình sẽ khôi phục từng trang. Mỗi câu chuyện của khách là một mảnh ghép.”",
  ], "📖 Mở sổ tay", () => { S.story.notebook = true; S.story.fragments += 1; save(true); toast("📖 Tìm thấy Sổ tay công thức cũ! (+1 🧩)", "gold"); renderDockDots(); showPrepare(); });
}
function showRival() {
  openModal("🍁 Chuỗi cà phê lớn mở gần quán", `<div class="intro-wrap"><div class="portrait">${Art.person(Art.UYEN, "sad")}</div><div class="intro-text" style="font-size:19px">
    Đầu phố, chuỗi <b>MegaBrew</b> khai trương rầm rộ: đèn neon, nhạc to, mua một tặng một. Khách quen của quán ${LOCATIONS[S.shops[0].loc].city} thưa hẳn.
    <p>Uyên phải chọn hướng đi cho quán nhỏ của ngoại:</p>
    <div class="grid" style="grid-template-columns:1fr 1fr">
      <div class="card"><h4>📉 Chạy theo xu hướng</h4><div class="sub">Giảm giá 10% ở quán ${LOCATIONS[S.shops[0].loc].city}, mất ít khách hơn (-10%), nhưng khách ruột thấy quán khác đi (thân thiết tăng chậm hơn 30%).</div><button class="btn" id="rv-theo" style="margin-top:8px">Chọn hướng này</button></div>
      <div class="card"><h4>🌿 Giữ bản chất bình dị</h4><div class="sub">Giữ nguyên giá và không khí, chấp nhận vắng khách hơn (-30%), nhưng khách ruột càng gắn bó (thân thiết tăng nhanh hơn 30%).</div><button class="btn teal" id="rv-giu" style="margin-top:8px">Chọn hướng này</button></div>
    </div><p class="sub">Ảnh hưởng kéo dài tới khi có biến cố mới...</p></div></div>`, { noClose: true });
  const pickRival = choice => { S.story.rival = { choice, since: S.day }; save(true); toast(choice === "giu" ? "🌿 Uyên quyết giữ quán bình dị như ngày ngoại còn đứng quầy." : "📉 Uyên giảm giá để cạnh tranh với MegaBrew.", "gold"); showPrepare(); };
  $("#rv-theo").onclick = () => pickRival("theo");
  $("#rv-giu").onclick = () => pickRival("giu");
}
function showStorm() {
  const friends = CHARACTERS.filter(c => S.chars[c.id] && S.chars[c.id].met && S.chars[c.id].aff >= 40);
  const cost = Math.max(0, 1500000 - friends.length * 250000);
  const pay = canAfford(cost) ? cost : 0;
  const helpers = friends.slice(0, 8).map(c => `<div class="helper"><div class="avatar-sm">${Art.person(c.look, "happy")}</div><div class="sub">${c.name}</div></div>`).join("");
  storyModal("⛈️ Đêm bão", Art.UYEN, [
    "Đêm qua mưa bão trút xuống phố nhỏ. Gió giật tung tấm bạt, nước tràn vào sân, giàn hoa giấy đổ rạp, mái hiên thủng một mảng lớn.",
    "Sáng sớm, Uyên đứng giữa quán ngổn ngang, tay run run cầm cuốn sổ của ngoại may mà còn khô.",
    `Rồi tiếng gõ cửa vang lên. ${friends.length ? `Từng người một: <b>${friends.map(c => c.name).join(", ")}</b>... mang theo búa, đinh, xô chậu, cả bánh mì và cà phê nóng.<div class="helpers">${helpers}</div>` : "Chỉ có vài người hàng xóm tới phụ một tay. Uyên tự nhủ phải gắn bó với khách hơn nữa."}`,
    `${friends.length ? `“Quán này từng giữ ấm cho tụi mình. Giờ tới lượt tụi mình giữ quán.”` : ""} Chi phí sửa chữa: <b>${money(cost)}</b>${pay < cost ? " — khách ruột góp tiền giúp phần còn thiếu" : ""}. Cả phố biết đến “Cửa hàng nhỏ của Uyên” như một phần của cộng đồng.`,
  ], "🤝 Cảm ơn mọi người", () => {
    S.money -= pay; if (R.today) R.today.eventCost += pay;
    const sh0 = S.shops[0]; sh0.rep = clamp(sh0.rep + 10, 0, 100);
    S.flowBonus += 0.03; S.story.stormDone = true; S.story.fragments += 3;
    toast("🤝 Quán đã được sửa lại! +10 uy tín, +3% khách toàn chuỗi, +3 🧩. MegaBrew không còn làm khó quán nữa.", "gold");
    checkAchv(); save(true); showPrepare();
  });
}
function showSeason() {
  const Z = season();
  openModal(`${Z.icon} Mùa ${Z.name} đến rồi!`, `<div class="intro-text" style="font-size:20px">${Z.event}<p class="sub">${Z.desc}. Hôm nay khách đông hơn 15%.</p>
    <button class="btn big teal" id="se-ok">Tuyệt!</button></div>`, { noClose: true });
  $("#se-ok").onclick = () => showPrepare();
}
// ---------- Câu chuyện riêng của từng chi nhánh ----------
const perkOf = (locId, key) => ((S.shopPerk || {})[locId] || {})[key] || 0;
function cityState(locId) { return S.cityStory[locId] || (S.cityStory[locId] = { act: 0, local: 0 }); }
function cityAct(sh = shop()) {
  const CS = CITY_STORIES[sh.loc], cs = cityState(sh.loc);
  return CS && !cs.done ? CS.acts[cs.act] : null;
}
function cityActReady(sh = shop()) {
  const a = cityAct(sh); if (!a) return false;
  const cs = cityState(sh.loc), days = S.day - (sh.opened || 1);
  return (!a.days || days >= a.days) && (!a.local || cs.local >= a.local) && (!a.rep || sh.rep >= a.rep);
}
// Mô tả điều kiện cảnh tiếp theo
function cityNextText(sh) {
  const CS = CITY_STORIES[sh.loc], cs = cityState(sh.loc);
  if (!CS) return "";
  if (cs.done) return `${CS.icon} “${CS.title}” đã trọn vẹn · ${CS.perk}`;
  const a = CS.acts[cs.act], days = S.day - (sh.opened || 1), need = [];
  if (a.days && days < a.days) need.push(`mở quán thêm ${a.days - days} ngày`);
  if (a.local && cs.local < a.local) {
    const names = Object.keys(DRINKS).filter(id => DRINKS[id].only === sh.loc).map(id => DRINKS[id].name).join(", ");
    need.push(`Uyên bán ${a.local - cs.local} ly món địa phương (${names})`);
  }
  if (a.rep && sh.rep < a.rep) need.push(`uy tín quán đạt ${a.rep}`);
  return `${CS.icon} “${CS.title}” · cảnh ${cs.act + 1}/${CS.acts.length}: ${a.title}${need.length ? " — cần " + need.join(", ") : " — sẵn sàng!"}`;
}
function applyCityEff(locId, eff, who) {
  const parts = [];
  if (eff.money > 0) { S.money += eff.money; if (R.today) R.today.bonus += eff.money; parts.push("+" + money(eff.money)); }
  if (eff.money < 0 && canAfford(-eff.money)) { S.money += eff.money; if (R.today) R.today.purchases -= eff.money; parts.push(money(eff.money)); }
  if (eff.rep) { const sh = S.shops.find(x => x.loc === locId); sh.rep = clamp(sh.rep + eff.rep, 0, 100); parts.push(`+${eff.rep} uy tín`); }
  const P = S.shopPerk[locId] || (S.shopPerk[locId] = {});
  if (eff.flow) { P.flow = (P.flow || 0) + eff.flow; parts.push(`+${Math.round(eff.flow * 100)}% khách quán ${LOCATIONS[locId].city}`); }
  if (eff.tip) { P.tip = (P.tip || 0) + eff.tip; parts.push(`+${Math.round(eff.tip * 100)}% tip quán ${LOCATIONS[locId].city}`); }
  if (parts.length) toast(`🎁 ${who}: ${parts.join(", ")}`, "gold");
}
function showCityAct() {
  const sh = shop(), CS = CITY_STORIES[sh.loc], cs = cityState(sh.loc), a = CS.acts[cs.act];
  const last = cs.act === CS.acts.length - 1;
  const head = `${CS.icon} ${CS.title} · ${a.title}`;
  const finish = () => {
    cs.act++;
    if (cs.act >= CS.acts.length) {
      cs.done = true;
      applyCityEff(sh.loc, CS.reward, `Câu chuyện “${CS.title}”`);
      Sound.sfx("perfect");
    }
    addFragments(2, "câu chuyện của quán " + LOCATIONS[sh.loc].city);
    save(true); showPrepare();
  };
  storyModal(head, CS.npc.look, a.lines, a.choice ? "▶ Tiếp" : "🎉 Thật ấm lòng", () => {
    if (!a.choice) return finish();
    openModal(head, `<div class="intro-wrap"><div class="portrait">${Art.person(Art.UYEN, "neutral")}</div><div class="intro-text">${a.choice.q}
      <div class="dlg-choices" style="margin-top:14px;flex-direction:column;align-items:stretch">${a.choice.a.map((o, k) => `<button data-ca="${k}">💬 ${o.label}</button>`).join("")}</div></div></div>`, { noClose: true });
    on($("#modal-body"), "[data-ca]", "click", b => {
      const o = a.choice.a[+b.dataset.ca];
      Sound.sfx("click");
      storyModal(head, CS.npc.look, [o.reply], "▶ Tiếp tục", () => { applyCityEff(sh.loc, o.eff || {}, CS.npc.name); finish(); });
    });
  });
}

// Khách có tâm trạng: Uyên lắng nghe và gợi ý món
function moodMenu(c, greet) {
  const M = MOODS[c.mood];
  openDialog(c.look, dlgName(c) + ` <span class="pill">${M.icon} ${M.name}</span>`, `${greet} ${pick(M.ask)} Chị chọn giúp mình một ly hợp tâm trạng nhé?`, [
    { label: "🎧 Lắng nghe & gợi ý món", main: true, fn: () => moodPick(c) },
    ...(storyPending(c) ? [{ label: "💖 Ngồi tâm sự", fn: () => playStory(c, storyPending(c)) }] : []),
    { label: "🙂 Bạn cứ tự chọn nhé", fn: () => { c.mood = null; takeOrder(c); closeDialog(); renderBubble(c); } },
    { label: "⏳ Đợi chút nhé", fn: closeDialog },
  ], { c, mood: "sad" });
}
function moodPick(c) {
  const M = MOODS[c.mood], menu = menuList();
  const good = shuffle(menu.filter(id => DRINK_FEEL[id] === M.feel)).slice(0, 1);
  const opts = shuffle(good.concat(shuffle(menu.filter(id => !good.includes(id))).slice(0, 4 - good.length)));
  const hint = !!S.story.pages[4];
  openDialog(Art.UYEN, `Bảo Uyên <small>gợi ý cho khách đang ${M.name.toLowerCase()}</small>`, hint ? `Theo sổ tay của ngoại: người ${M.name.toLowerCase()} cần vị ${FEELS[M.feel]}.` : "Ly nào hợp với tâm trạng này nhỉ?",
    opts.map(id => ({ label: `☕ ${DRINKS[id].name}${hint ? ` · ${FEELS[DRINK_FEEL[id] || "dam"]}` : ""}`, fn: () => {
      c.drink = id; c.items = [id]; c.moodMatch = DRINK_FEEL[id] === M.feel;
      const p = custPos(c);
      floater(p.x + 30, p.y, c.moodMatch ? "💡 Hợp tâm trạng!" : "🤔", c.moodMatch ? "#e07a5f" : "#8a7a72");
      openDialog(c.look, dlgName(c), c.moodMatch ? "Đúng là thứ mình đang cần! Chị hiểu mình ghê." : "Ừm... cũng được, để mình thử xem.",
        [{ label: `📝 Nhận order: ${DRINKS[id].name}`, main: true, fn: () => { takeOrder(c); closeDialog(); } }], { c, mood: c.moodMatch ? "happy" : "neutral" });
      c.mood = null;
    } })), { c, mood: "neutral" });
}

// Kỷ vật bày trên kệ tường: kỷ vật của thành phố này và kỷ vật chung
function shelfItems() {
  if (!S) return [];
  const loc0 = shop().loc;
  return Object.keys(ITEMS).filter(k => S.items[k] && (ITEMS[k].set === loc0 || ITEMS[k].set === "global")).map(k => ({ icon: ITEMS[k].icon, name: ITEMS[k].name })).slice(0, 12);
}
function writeLastPage() {
  const body = openModal("✍️ Trang cuối của sổ tay", `<div class="intro-wrap"><div class="portrait">${Art.person(Art.UYEN, "happy")}</div><div class="intro-text" style="font-size:19px">
    Uyên đặt cuốn sổ lên quầy, trang cuối còn trắng. Viết gì để người sau đọc cũng thấy ấm lòng nhỉ?
    <textarea id="lp-text" class="txt" rows="4" style="width:100%;margin-top:10px">Gửi những vị khách đã ghé qua: cảm ơn vì đã mang câu chuyện của mình tới đây. Quán nhỏ này sẽ luôn có một ly ấm chờ bạn.</textarea>
    <p class="sub">Uyên sẽ ghi thêm công thức “Ly nước dành cho người đang tìm lại ký ức” mà ngoại còn dang dở.</p>
    <div class="row"><button class="btn big teal" id="lp-ok">✍️ Viết vào sổ</button><button class="btn big gray" id="lp-later">Để sau</button></div></div></div>`, { noClose: true });
  $("#lp-later").onclick = () => R.phase === "prepare" ? showPrepare() : closeModal();
  $("#lp-ok").onclick = () => {
    const text = ($("#lp-text").value || "").trim().slice(0, 400) || "Cảm ơn vì đã ghé quán.";
    S.story.lastPage = { text, day: S.day };
    S.story.pages[NOTEBOOK.length - 1] = S.day;
    checkAchv(); save(true); renderIngredients(); renderChapterBar();
    storyModal("🌸 Hương Cà Phê Đơm Hoa", Art.UYEN, [
      "Uyên viết dòng cuối cùng rồi khẽ gấp sổ lại. Cuốn sổ của ngoại giờ đã trọn vẹn, với trang cuối của chính Uyên.",
      "Công thức ngoại để dang dở cuối cùng cũng có tên: <b>Ly Ký Ức</b> — cà phê phin, sữa đặc, sữa tươi, rắc ca cao. Từ hôm nay nó có trên thực đơn của mọi chi nhánh.",
      "Quán không cần quá đông đúc hay phô trương. Nhưng mỗi sáng mở cửa, vẫn có người bước vào, gọi một ly quen và mỉm cười.",
      "Mỗi ngày ở Cửa hàng nhỏ của Uyên là một hành trình chữa lành nhẹ nhàng, nơi tình yêu và niềm vui nhỏ bé được gửi gắm qua từng ly nước. 🌸",
    ], "☕ Tiếp tục mở quán", () => { toast("🌸 Hoàn thành cốt truyện! Ly Ký Ức đã có trên thực đơn.", "gold"); R.phase === "prepare" ? showPrepare() : closeModal(); });
  };
}

// ---------- Món signature ----------
function registerSignatures() {
  Object.keys(DRINKS).forEach(id => { if (DRINKS[id].sig) delete DRINKS[id]; });
  (S.signatures || []).forEach(g => { DRINKS[g.id] = { name: g.name, price: g.price, recipe: g.recipe, hot: g.hot, sig: true }; DRINK_FEEL[g.id] = g.feel; });
}
function sigScore(rec) {
  let sc = 0; const notes = [];
  if (rec.some(k => SIG_BASE.includes(k))) { sc += 2; notes.push("có nền vị chính"); } else notes.push("thiếu nền vị chính (cà phê, trà, ca cao, trái cây...)");
  if (rec.some(k => SIG_SWEET.includes(k))) { sc += 1; notes.push("có vị ngọt"); }
  if (rec.some(k => SIG_TOP.includes(k)) && rec.length >= 3) { sc += 1; notes.push("có lớp phủ"); }
  if (rec.some(k => INGREDIENTS[k].only)) { sc += 1; notes.push("mang dấu ấn địa phương"); }
  if (["da", "nuoc_nong"].includes(rec[rec.length - 1])) { sc += 1; notes.push("đúng nhiệt độ"); }
  if (new Set(rec).size < rec.length) { sc -= 1; notes.push("lặp nguyên liệu"); }
  if (rec.length < 3) { sc -= 1; notes.push("hơi đơn giản"); }
  return { sc: clamp(sc, 0, 6), notes };
}
function sigFeel(rec) {
  if (rec.some(k => ["phin", "espresso"].includes(k)) && !rec.includes("sua_tuoi")) return "dam";
  if (rec.some(k => ["tra", "matcha", "sen", "atiso"].includes(k)) && !rec.includes("sua_dac")) return "diu";
  if (rec.some(k => ["cam", "dua_tuoi", "rau_ma", "dau", "chanh", "tac"].includes(k))) return "mat";
  if (rec.includes("nuoc_nong") || rec.includes("cacao")) return "am";
  return "ngot";
}

// ---------- Kỷ vật & sổ sưu tập ----------
const setItems = set => Object.keys(ITEMS).filter(k => ITEMS[k].set === set);
function giveItem(id, from) {
  if (S.items[id]) return;
  S.items[id] = S.day;
  const I = ITEMS[id];
  toast(`📚 Kỷ vật mới: ${I.icon} ${I.name}${from ? " — từ " + from : ""}`, "gold");
  Sound.sfx("heart");
  checkSets(); renderDockDots();
  if (["open", "prepare"].includes(R.phase)) $("#scene-bg").innerHTML = Art.sceneBg(shop().loc, shop().decor, R.E, shelfItems());
  addFragments(2, "nhận kỷ vật");
}
function checkSouvenirs() {
  S.shops.forEach(sh => {
    const id = Object.keys(ITEMS).find(k => ITEMS[k].souvenir === sh.loc);
    if (id && !S.items[id] && sh.rep >= 60) giveItem(id, "quà lưu niệm " + LOCATIONS[sh.loc].city);
  });
}
function checkSets() {
  for (const set of SET_ORDER) {
    if (S.setsDone[set] || !setItems(set).every(k => S.items[k])) continue;
    S.setsDone[set] = S.day;
    const Z = ITEM_SETS[set], rw = Z.reward;
    if (rw.money) { S.money += rw.money; if (R.today) R.today.bonus += rw.money; }
    if (rw.flow) S.flowBonus += rw.flow;
    if (rw.tipLoc) S.tipLoc[rw.tipLoc] = (S.tipLoc[rw.tipLoc] || 0) + 0.1;
    toast(`🏅 Hoàn thành bộ sưu tập “${Z.name}”! ${Z.desc}`, "gold");
    Sound.sfx("perfect");
    if (SET_ORDER.every(k => S.setsDone[k])) setTimeout(showEnding, 2000);
  }
  renderHud();
}
function showEnding() {
  let i = 0;
  const step = () => {
    if (i >= ENDING.length) { closeModal(); toast("👵 Ngoại về thăm quán. Cảm ơn bạn đã chơi Cửa hàng nhỏ của Uyên!", "gold"); if (R.phase === "prepare") showPrepare(); return; }
    const line = ENDING[i++];
    openModal("👵 Ngoại ghé thăm", `<div class="intro-wrap"><div class="portrait">${Art.person(Art.NGOAI, "happy")}</div>
      <div class="intro-text">${line}<div style="margin-top:20px"><button class="btn big" id="e-next">${i < ENDING.length ? "▶ Tiếp" : "🤗 Ôm ngoại thật chặt"}</button></div></div></div>`, { noClose: true });
    $("#e-next").onclick = step;
  };
  Sound.sfx("day"); step();
}

// ---------- Tình huống bất ngờ ----------
function clearSurprises() {
  if (R.qte && R.qte.el) R.qte.el.remove();
  R.qte = null; R.powerCut = null; R.powerCutDone = false; R.wasOut = false;
  $("#scene").classList.remove("dark");
}
function syncPower() {
  const out = outageNow();
  if (out === !!R.wasOut) return;
  R.wasOut = out;
  $("#scene").classList.toggle("dark", out);
  if (out) { toast("⚡ Mất điện! Món cần máy espresso, máy xay, máy đánh trứng tạm ngưng.", "bad"); Sound.sfx("powerdown"); }
  else toast("💡 Có điện lại rồi!", "gold");
  musicSuspend(out);
  renderIngredients(); renderTickets();
}
function maybeSurprise() {
  if (S.day < 2) return;
  if (!R.powerCutDone && rand() < 0.0015) {
    R.powerCutDone = true; R.powerCut = { until: R.time + 75 };
    syncPower(); startQte("generator");
    return;
  }
  if (rand() < 0.0045) {
    const pool = ["cat", "rush"];
    if (R.customers.length) pool.push("spill", "wallet");
    if (R.weatherBy[shop().loc] === "mua") pool.push("leak", "leak");
    startQte(pick(pool));
  }
}
function placeQte(box) {
  box.style.left = (80 + rand() * 640) + "px";
  box.style.top = (110 + R.E * 0.5 + rand() * 170) + "px";
}
function startQte(type) {
  const Q = QTES[type]; if (!Q || R.qte) return;
  const box = el("div", "qte");
  box.innerHTML = `<div class="qte-title">${Q.title}</div><button class="qte-btn">${Q.icon}</button><div class="qte-hint">${Q.hint}${Q.taps > 1 ? ` <b class="qte-count">0/${Q.taps}</b>` : ""}</div><div class="qte-bar"><div></div></div>`;
  placeQte(box);
  $("#qte-layer").appendChild(box);
  R.qte = { type, Q, el: box, left: Q.time * 1000, taps: 0 };
  box.querySelector(".qte-btn").addEventListener("pointerdown", e => {
    e.preventDefault();
    if (!R.qte || R.qte.el !== box || isPaused()) return;
    R.qte.taps++; Sound.sfx("pop");
    const cnt = box.querySelector(".qte-count"); if (cnt) cnt.textContent = `${R.qte.taps}/${Q.taps}`;
    box.querySelector(".qte-btn").classList.remove("hit"); void box.offsetWidth; box.querySelector(".qte-btn").classList.add("hit");
    if (R.qte.taps >= Q.taps) qteEnd(true);
    else if (Q.move) placeQte(box);
  });
  Sound.sfx(type === "cat" ? "meow" : "alarm");
}
function qteTick(dt) {
  const q = R.qte; q.left -= dt;
  q.el.querySelector(".qte-bar div").style.width = clamp(q.left / (q.Q.time * 1000) * 100, 0, 100) + "%";
  if (q.left <= 0) qteEnd(false);
}
function qteEnd(win) {
  const { type, el: box } = R.qte; R.qte = null;
  box.classList.add(win ? "win" : "lose"); setTimeout(() => box.remove(), 500);
  const sh = shop();
  const T = (msg, bad) => toast(msg, bad ? "bad" : "gold");
  switch (type) {
    case "generator":
      if (win) { R.powerCut = null; sh.rep = clamp(sh.rep + 1, 0, 100); syncPower(); T("⚙️ Máy phát nổ máy! Quán có điện trở lại."); }
      else T("⚙️ Máy phát không nổ... chờ điện lưới khoảng hơn một tiếng nữa.", true);
      break;
    case "spill":
      if (win) { sh.rep = clamp(sh.rep + 1, 0, 100); T("🙌 Đỡ kịp! Khách cảm ơn rối rít. +1 uy tín"); }
      else { R.clean = clamp(R.clean - 30, 0, 100); T("💦 Ly đổ tung tóe... sàn bẩn rồi!", true); }
      break;
    case "cat":
      if (win) T("🐈 Mèo được mời ra ngoài, còn ngoái lại kêu meo meo.");
      else { shop().inv.sua_tuoi = Math.max(0, (shop().inv.sua_tuoi || 0) - 3); T("🐈 Mèo uống trộm mất 3 phần sữa tươi!", true); }
      break;
    case "leak":
      if (win) T("🪣 Hứng kịp, sàn vẫn khô ráo!");
      else { R.clean = clamp(R.clean - 25, 0, 100); T("💧 Nước dột ướt sàn rồi!", true); }
      break;
    case "wallet":
      if (win) { sh.rep = clamp(sh.rep + 2, 0, 100); T("👛 Uyên giữ ví trả khách. Khách khen quán tử tế! +2 uy tín"); }
      else T("👛 Khách tự quay lại tìm thấy ví, may quá.");
      break;
    case "rush": {
      const n = win ? 3 : 1;
      for (let k = 0; k < n; k++) setTimeout(() => { if (R.phase === "open") spawnCustomer(); }, k * 500);
      T(win ? "📣 Kê bàn kịp! Cả đoàn vào quán." : "📣 Thiếu chỗ, chỉ một người ở lại.", !win);
      break;
    }
  }
  renderHud(); renderIngredients();
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
  if (isPaused() || R.drip) return;
  if (!ingAvail(k)) { const I = INGREDIENTS[k]; toast(`🔒 Cần mua ${EQUIPMENT[I.equip] ? EQUIPMENT[I.equip].name : "công thức"} để dùng ${I.name}`, "bad"); return; }
  if (outageNow() && powerIng(k)) { toast("🔌 Đang cúp điện, máy không chạy được!", "bad"); return; }
  const I = INGREDIENTS[k];
  const inv = shop().inv;
  if (!I.free && (inv[k] || 0) <= 0) { toast(`📦 Hết ${I.name}! Vào Kho để nhập thêm.`, "bad"); Sound.sfx("error"); return; }
  if (R.cup.length >= 7) { toast("Ly đầy rồi!", "bad"); return; }
  if (!I.free) inv[k]--;
  R.cup.push(k);
  Sound.sfx(k === "da" ? "ice" : ["phin", "espresso", "nuoc_nong", "sua_tuoi", "sua_dac", "tra"].includes(k) ? "pour" : "pop");
  if (k === "phin" || k === "espresso") {
    R.drip = true; renderBench(true); renderIngredients();
    setTimeout(() => { R.drip = false; renderBench(); renderIngredients(); }, (k === "phin" ? 1100 : 600) / Math.max(1, R.speed * 0.7));
  } else { renderBench(); renderIngredients(); }
}
function serve() {
  if (R.phase === "tutorial") return tutServe();
  if (isPaused()) return;
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
  const price = d.price * (L.specialty === c.drink ? 1.2 : 1) * priceMod(S.active);
  const payRate = { perfect: 1, good: 1, ok: 0.7, wrong: 0 }[q];
  let tipRate = { perfect: 0.15, good: 0.06, ok: 0, wrong: 0 }[q];
  if (q !== "wrong") {
    tipRate += (c.pat / c.max) * 0.08 + c.tipBonus + (sh.decor.cay_xanh ? 0.05 : 0) + (present(sh, "cashier") ? 0.1 : 0) + (sh.decor.may_lanh ? 0.05 : 0) + ((R.event && R.event.tip) || 0) + shopEff(sh, "tip") + (S.tipLoc[sh.loc] || 0);
    if (c.moodMatch) tipRate += 0.1 + S.story.moodTip;
    tipRate += perkOf(sh.loc, "tip");
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
    if (d.only === sh.loc) cityState(sh.loc).local++;
  }
  if (q === "perfect") { T.perfect++; R.today.perfect++; sh.perfect++; S.totals.perfect++; }
  let dRep = { perfect: 0.6, good: 0.3, ok: -0.2, wrong: -1 }[q];
  if (dRep > 0 && sh.decor.tranh) dRep *= 1.2;
  if (dRep > 0) dRep *= Math.max(0.3, 1 + shopEff(sh, "rep"));
  if (R.clean < 25) dRep -= 0.2;
  if (c.critic) {
    if (q === "perfect") { dRep += 8; toast("📝 Nhà phê bình chấm quán 5 sao! +8 uy tín", "gold"); }
    else { dRep -= 4; toast("📝 Nhà phê bình có vẻ không hài lòng... -4 uy tín", "bad"); }
  }
  sh.rep = clamp(sh.rep + dRep, 0, 100);
  if (c.moodMatch && (q === "perfect" || q === "good")) {
    S.story.moodMatches++; addFragments(1, "pha đúng ly hợp tâm trạng");
    if (c.reg) S.chars[c.reg.id].aff = clamp(S.chars[c.reg.id].aff + 3, 0, 100);
    c.moodMatch = false;
  }
  if (c.reg) {
    const cs = S.chars[c.reg.id], before = Math.floor(cs.aff / 20);
    cs.aff = clamp(cs.aff + ({ perfect: 4, good: 2, ok: -1, wrong: -4 }[q]) + (q === "perfect" && c.reg.fav.includes(c.drink) ? 2 : 0), 0, 100);
    const after = Math.floor(cs.aff / 20);
    if (after > before) { toast(`💖 ${c.reg.name} đã lên ${after} tim!`, "gold"); Sound.sfx("heart"); }
  }
  if (!present(sh, "cleaner")) R.clean = clamp(R.clean - 4, 0, 100);
  staffEvent("pay");
  // Còn ly khác trong cùng order
  if (q !== "wrong" && c.items && c.idx < c.items.length - 1) {
    c.idx++; c.drink = c.items[c.idx];
    c.pat = Math.min(c.max, c.pat + 40);
    const tk = R.tickets.find(t => t.id === c.uid); if (tk) { tk.drink = c.drink; tk.barista = false; }
    const p = custPos(c);
    floater(p.x + 20, p.y + 50, `${q === "perfect" ? "Hoàn hảo! " : "Ngon! "}+${money(pay + tip)} (${c.idx}/${c.items.length})`, q === "perfect" ? "#e07a5f" : "#2a9d8f");
    speech(p.x - 20, p.y - 10, `Ngon! Còn ${c.items.length - c.idx} ly nữa nha!`);
    Sound.sfx(q === "perfect" ? "perfect" : "coin");
    renderBubble(c); renderTickets(); renderBench(); renderIngredients();
    checkGoals(); checkAchv(); renderHud(); renderStats();
    return;
  }
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
  checkBankrupt();
}

// ---------- Nhân viên ----------
function baristaTime(b) { return Math.max(5, (20 - b.skill * 2.5) * (1 - effOf(b, "speed"))); }
function baristaQuality(b) {
  const r = rand(), pp = clamp(0.55 + b.skill * 0.08 + effOf(b, "quality"), 0.2, 0.98);
  return r < pp ? "perfect" : r < pp + (1 - pp) * 0.75 ? "good" : "ok";
}
function hasStock(recipe, sh = shop()) {
  const need = {};
  for (const k of recipe) if (!INGREDIENTS[k].free) need[k] = (need[k] || 0) + 1;
  return Object.keys(need).every(k => (sh.inv[k] || 0) >= need[k]);
}
function consume(recipe, sh = shop()) { for (const k of recipe) if (!INGREDIENTS[k].free) sh.inv[k]--; }
// Pha chế dùng nguyên liệu: "Tiết kiệm" có thể không tốn, "Vô ý" có thể làm đổ tốn gấp đôi
function consumeBy(b, recipe, silent, sh = shop()) {
  if (rand() < effOf(b, "save")) return;
  consume(recipe, sh);
  if (rand() < effOf(b, "waste") && hasStock(recipe, sh)) { consume(recipe, sh); if (!silent) toast(`🫗 ${b.name} lỡ tay làm đổ một ly, phải pha lại!`, "bad"); }
}
function baristaTick() {
  const b = present(shop(), "barista"); if (!b) return;
  if (!R.bJob) {
    const t = R.tickets.find(t => t.id !== R.sel && !t.barista && !(outageNow() && powerDrink(t.drink)));
    if (t) {
      if (!hasStock(DRINKS[t.drink].recipe)) {
        if (!R.today.shortage.active) { R.today.shortage.active = true; toast(`☕ ${b.name}: "Chị ơi, hết nguyên liệu làm ${DRINKS[t.drink].name} rồi!"`, "bad"); }
        return;
      }
      consumeBy(b, DRINKS[t.drink].recipe);
      t.barista = true; R.bJob = { id: t.id, left: baristaTime(b), total: baristaTime(b) };
      renderTickets(); renderStaff(); renderIngredients();
    }
  } else if (--R.bJob.left <= 0) {
    const c = R.customers.find(x => x.uid === R.bJob.id); R.bJob = null;
    if (c && c.state === "drink") resolveServe(c, baristaQuality(b), true);
    renderStaff();
  }
}
function simTick(i) {
  const sh = S.shops[i], b = present(sh, "barista"), T = R.today.shops[i];
  if (!b) return;
  const sim = R.sim[i] || (R.sim[i] = { q: 0, acc: 0, bAcc: 0 });
  if (R.time < DAY_END) {
    sim.acc += lambda(i, R.time);
    while (sim.acc >= 1) { sim.acc--; if (sim.q < 3 + (sh.decor.ban_ghe || 0)) sim.q++; else T.lost++; }
  } else if (R.time > DAY_END + 30) { T.lost += sim.q; sim.q = 0; }
  sim.bAcc = Math.min(1.5, sim.bAcc + 1 / baristaTime(b) * (present(sh, "waiter") ? 1.1 : 1));
  while (sim.bAcc >= 1 && sim.q > 0) {
    sim.bAcc--; sim.q--;
    const id = pickDrink(i), d = DRINKS[id];
    if (!hasStock(d.recipe, sh)) { T.lost++; if (!R.today.shortage[i]) { R.today.shortage[i] = true; toast(`📦 Quán ${LOCATIONS[sh.loc].city} báo thiếu nguyên liệu cho ${d.name}!`, "bad"); } continue; }
    consumeBy(b, d.recipe, true, sh);
    const q = baristaQuality(b);
    const price = d.price * (LOCATIONS[sh.loc].specialty === id ? 1.2 : 1) * priceMod(i);
    let tipRate = { perfect: 0.15, good: 0.06, ok: 0 }[q] + (S.tipLoc[sh.loc] || 0) + perkOf(sh.loc, "tip") + (sh.decor.cay_xanh ? 0.05 : 0) + (present(sh, "cashier") ? 0.1 : 0) + shopEff(sh, "tip") + ((R.event && R.event.tip) || 0);
    if (!present(sh, "cleaner")) tipRate *= 0.6;
    const pay = Math.round(price * (q === "ok" ? 0.7 : 1) / 1000) * 1000, tip = Math.round(price * tipRate / 1000) * 1000;
    S.money += pay + tip; S.totals.earned += pay + tip;
    T.revenue += pay; T.tips += tip; T.served++; sh.served++; S.totals.served++;
    if (q === "perfect") { T.perfect++; sh.perfect++; S.totals.perfect++; }
    sh.rep = clamp(sh.rep + { perfect: 0.15, good: 0.05, ok: -0.1 }[q] * (sh.decor.tranh ? 1.2 : 1) * Math.max(0.3, 1 + shopEff(sh, "rep")), 0, 100);
  }
}
function roleReq(i, role) {
  const sh = S.shops[i], k = ROLE_ORDER.indexOf(role);
  if (k > 0 && !sh.staff[ROLE_ORDER[k - 1]]) return `Cần thuê ${ROLES[ROLE_ORDER[k - 1]].name} trước`;
  const need = { waiter: 32, cleaner: 42, cashier: 52, barista: 65 }[role] - (i === 0 ? 0 : 10);
  if (sh.rep < need) return `Uy tín quán cần đạt ${need} (hiện ${Math.floor(sh.rep)})`;
  if (i === 0 && role === "waiter" && S.day < 2) return "Mở khóa từ ngày thứ 2";
  return null;
}
function hire(i, role, idx) {
  const cand = R.cands[i][role][idx];
  S.shops[i].staff[role] = cand;
  R.cands[i][role].splice(idx, 1);
  toast(`🎉 ${cand.name} bắt đầu làm ${ROLES[role].name} tại ${LOCATIONS[S.shops[i].loc].city}!`, "gold");
  if (role === "barista") toast("☕ Quán đã có pha chế! Giờ Uyên có thể mở chi nhánh mới trong mục Chi nhánh.", "gold");
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
// ---------- Hoạt cảnh nhân viên ----------
// Uyên, pha chế, thu ngân đứng sau quầy; phục vụ và tạp vụ đi lại ở sảnh chờ của khách
const STF = { sig: "", list: {} };
const BROOM = `<svg class="broom" viewBox="0 0 40 100"><rect x="18" y="0" width="5" height="70" rx="2" fill="#9c6644"/><path d="M8,66 h25 l6,30 h-37z" fill="#e9c46a" stroke="#c9a227" stroke-width="2"/><path d="M12,72 l-3,22 M18,72 l-1,22 M24,72 l1,22 M30,72 l3,22" stroke="#c9a227" stroke-width="1.5"/></svg><div class="dust"><i></i><i></i><i></i></div>`;
function renderStaff() {
  const sh = shop();
  const sig = [S.active, R.E, ...ROLE_ORDER.map(r => { const st = present(sh, r); return st ? st.name : ""; })].join("|");
  if (sig !== STF.sig) {
    STF.sig = sig; STF.list = {};
    $("#staff-layer").innerHTML = ""; $("#lobby-layer").innerHTML = "";
    const make = (key, look, tag, x, lobby, extra) => {
      const e = el("div", "staff " + key + (lobby ? " lobby" : ""));
      e.style.left = x + "px";
      if (!lobby) e.style.top = 128 + R.E + "px";
      e.innerHTML = `<div class="pw">${Art.person(look, "happy")}</div>${extra || ""}<div class="tag">${tag}</div><div class="work"></div>`;
      (lobby ? $("#lobby-layer") : $("#staff-layer")).appendChild(e);
      STF.list[key] = { el: e, x, arrive: 0, idle: 0, flash: 0 };
    };
    const short = st => st.name.split(" ").pop();
    make("uyen", Art.UYEN, "Bảo Uyên", 30, false);
    const b = present(sh, "barista"), c = present(sh, "cashier"), w = present(sh, "waiter"), k = present(sh, "cleaner");
    if (b) make("barista", b.look, "☕ " + short(b), 520, false);
    if (c) make("cashier", c.look, "💁 " + short(c), 895, false);
    if (w) make("waiter", w.look, "🧑‍🍳 " + short(w), 760, true);
    if (k) make("cleaner", k.look, "🧹 " + short(k), 200, true, BROOM);
  }
  const u = STF.list.uyen; if (u) setIcon(u, R.drip ? "☕" : "");
  $("#btn-clean").classList.toggle("hidden", !!present(sh, "cleaner"));
}
function setIcon(o, icon) {
  const w = o.el.querySelector(".work");
  if (w.textContent !== icon) w.textContent = icon;
  o.el.classList.toggle("busy", !!icon);
}
function moveStaff(o, x, speed) {
  x = clamp(Math.round(x), 0, 880);
  const dist = Math.abs(x - o.x);
  if (dist < 6) return false;
  const dur = dist / (speed * Math.max(1, R.speed));
  o.el.style.transition = `left ${dur.toFixed(2)}s linear`;
  o.el.classList.toggle("left", x < o.x);
  o.el.classList.add("walking");
  o.el.style.left = x + "px";
  o.x = x; o.arrive = performance.now() + dur * 1000;
  clearTimeout(o.wt); o.wt = setTimeout(() => o.el.classList.remove("walking"), dur * 1000);
  return true;
}
const arrived = o => performance.now() >= o.arrive;
function staffEvent(type) {
  const ca = STF.list.cashier;
  if (type === "pay" && ca) { setIcon(ca, "💵"); ca.flash = performance.now() + 1500; if (Math.abs(ca.x - 895) > 6) moveStaff(ca, 895, 160); }
}
function staffTick() {
  if (R.phase !== "open") return;
  const now = performance.now(), L = STF.list;
  // Pha chế: tới chỗ khách nhận phiếu → về máy pha → mang ly ra
  const b = L.barista;
  if (b) {
    const c = R.bJob && R.customers.find(x => x.uid === R.bJob.id);
    if (c) {
      const frac = R.bJob.left / (R.bJob.total || 1), cx = custPos(c).x + 10;
      if (frac > 0.72) { moveStaff(b, cx, 170); setIcon(b, "📝"); }
      else if (frac > 0.22) { moveStaff(b, 560, 170); setIcon(b, "☕"); b.el.classList.toggle("brewing", arrived(b)); }
      else { b.el.classList.remove("brewing"); moveStaff(b, cx, 170); setIcon(b, "🥤"); }
      b.idle = 0;
    } else {
      b.el.classList.remove("brewing");
      if (arrived(b) && now > b.arrive + b.idle) { moveStaff(b, 360 + rand() * 360, 80); setIcon(b, pick(["", "", "🧽", "🎵"])); b.idle = 1500 + rand() * 3000; }
    }
  }
  // Phục vụ: tới cạnh khách đang chờ để ghi order, rảnh thì đi quanh sảnh
  const w = L.waiter;
  if (w) {
    const c = R.customers.find(x => x.state === "order" && !x.tut);
    if (c) { moveStaff(w, custPos(c).x + 95, 210); setIcon(w, "📝"); w.idle = 0; }
    else if (arrived(w) && now > w.arrive + w.idle) { moveStaff(w, 60 + rand() * 800, 110); setIcon(w, pick(["", "🍽️", "💬", ""])); w.idle = 2000 + rand() * 3000; }
  }
  // Tạp vụ: đi tới lui quét sảnh, dừng lại quét kỹ từng chỗ
  const k = L.cleaner;
  if (k && arrived(k) && now > k.arrive + k.idle) {
    moveStaff(k, 20 + rand() * 840, 55);
    setIcon(k, pick(["", "", "✨"]));
    k.idle = 1200 + rand() * 2500;
  }
  // Thu ngân: đứng máy tính tiền, thỉnh thoảng đi xếp hàng lên kệ
  const ca = L.cashier;
  if (ca && now > ca.flash && arrived(ca) && now > ca.arrive + ca.idle) {
    if (Math.abs(ca.x - 895) > 6) { moveStaff(ca, 895, 120); setIcon(ca, ""); }
    else if (rand() < 0.3) { moveStaff(ca, 700 + rand() * 120, 120); setIcon(ca, "📦"); }
    else setIcon(ca, pick(["", "🧾", ""]));
    ca.idle = 2500 + rand() * 3500;
  }
}

// ---------- Kết thúc ngày ----------
function endDay() {
  R.phase = "report";
  clearSurprises(); musicSuspend(false);
  closeDialog();
  const rows = [];
  let net = 0;
  S.shops.forEach((sh, i) => {
    const T = R.today.shops[i], L = LOCATIONS[sh.loc];
    const wages = ROLE_ORDER.reduce((a, r) => a + (present(sh, r) ? sh.staff[r].wage : 0), 0);
    const util = T.open ? 40000 + T.served * 800 + (sh.decor.may_lanh ? 30000 : 0) : 15000;
    const other = 20000 + Object.values(sh.decor).reduce((a, v) => a + v, 0) * 5000;
    const cost = L.rent + wages + util + other;
    S.money -= cost;
    const r = { loc: sh.loc, open: T.open, served: T.served, perfect: T.perfect, lost: T.lost, revenue: T.revenue, tips: T.tips, rent: L.rent, wages, util, other, cost, net: T.revenue + T.tips - cost };
    rows.push(r); net += r.net;
    // Nhân viên lên tay nghề
    ROLE_ORDER.forEach(role => {
      const st = present(sh, role); if (!st) return;
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
  const interest = 0;
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
  if (S.money <= 0) { R.phase = "open"; gameOver("money"); return; }
  showReport(report, true);
}

// ---------- Thành tựu ----------
function checkAchv() {
  checkSouvenirs();
  for (const a of ACHIEVEMENTS) if (!S.achv[a.id] && a.test(S)) { S.achv[a.id] = S.day; toast(`🏆 Thành tựu mới: ${a.name}`, "gold"); Sound.sfx("perfect"); }
}

// ---------- Hiển thị ----------
function buildScene() {
  const sh = shop();
  document.documentElement.style.setProperty("--accent", loc(sh).accent);
  $("#scene-bg").innerHTML = Art.sceneBg(sh.loc, sh.decor, R.E, shelfItems());
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
  $("#hud-day").textContent = `📅 Ngày ${S.day} · ${weekday(S.day)} · ${season().icon} ${season().name}`;
  renderChapterBar();
  $("#hud-clock").textContent = "🕐 " + (R.phase === "open" ? clock(Math.min(R.time, 24 * 60 - 1)) : "--:--");
  $("#hud-weather").textContent = W.icon + " " + W.name;
  $("#hud-shop").textContent = "📍 " + loc(sh).city;
  $("#hud-rep").innerHTML = `<span class="stars">${stars(sh.rep)}</span> ${Math.ceil(sh.rep)}`;
  $("#hud-rep").classList.toggle("danger", sh.rep < 10);
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
    const noPower = outageNow() && powerDrink(t.drink);
    const multi = c.items && c.items.length > 1 ? `<span class="t-multi">Ly ${c.idx + 1}/${c.items.length}</span>` : "";
    d.innerHTML = `${noPower ? '<span class="t-badge">⚡</span>' : t.barista ? '<span class="t-badge">☕</span>' : c.reg ? '<span class="t-badge">💖</span>' : c.critic ? '<span class="t-badge">📝</span>' : ""}${multi}
      <div class="t-cup">${Art.drinkIcon(t.drink)}</div><div class="t-name">${DRINKS[t.drink].name}</div>
      <div class="t-who">${t.barista ? "Pha chế đang làm" : noPower ? "Cúp điện — bấm để đổi món" : c.name}</div><div class="pbar"><div></div></div>`;
    if (noPower) d.classList.add("nopower");
    d.addEventListener("click", () => { if (t.barista || isPaused()) return; if (noPower) return offerSwap(c, t); R.sel = t.id; Sound.sfx("click"); renderTickets(); renderBench(); });
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
    if (I.only && !I.only.includes(shop().loc)) continue;
    const avail = ingAvail(k);
    const b = el("button", "ing" + (avail ? "" : " locked"));
    const q = I.free ? "∞" : (shop().inv[k] || 0);
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
  dot("notebook", S.story.notebook && NOTEBOOK.some((pg, i) => !S.story.pages[i] && pg.need > 0 && S.story.fragments >= pg.need));
  dot("kho", Object.keys(INGREDIENTS).some(k => ingAvail(k) && !INGREDIENTS[k].free && (shop().inv[k] || 0) < 5));
}
// Đang tạm dừng: khóa mọi thao tác pha chế, phục vụ, nhận order
const isPaused = () => R.phase === "open" && R.paused;
function setPauseUI() {
  $("#stage").classList.toggle("is-paused", isPaused());
  $("#btn-pause").textContent = R.paused ? "▶" : "⏸";
  $("#pause-cover").classList.toggle("hidden", !isPaused());
  if (isPaused()) closeDialog();
  const sign = $("#closed-sign");
  if (isPaused()) sign.classList.add("hidden");
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
  R.phase = "title"; R.paused = false; setPauseUI();
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
  const begin = n => { slot = n; newState(); registerSignatures(); S.introDone = false; applySettings(); startMusic(); showIntro(); };
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
    const body = openModal(L.who === "ngoai" ? "👵 Ngoại dặn dò" : "🌸 Bảo Uyên", `
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
function expectedCosts() {
  return S.shops.reduce((a, sh) => a + LOCATIONS[sh.loc].rent + 60000 + ROLE_ORDER.reduce((w, r) => w + (sh.staff[r] ? sh.staff[r].wage : 0), 0), 0);
}
function canExpand() {
  if (S.shops.length >= Object.keys(LOCATIONS).length) return "Đã phủ khắp 6 thành phố!";
  const nb = S.shops.findIndex(sh => !sh.staff.barista);
  if (nb >= 0) return `Quán ${LOCATIONS[S.shops[nb].loc].city} cần có nhân viên Pha chế trước khi Uyên rời đi.`;
  const wait = (S.lastOpenDay || 1) + MIN_DAYS_BETWEEN_SHOPS - S.day;
  if (wait > 0) return `Cần thêm ${wait} ngày nữa (mỗi quán mới cách quán trước ít nhất ${MIN_DAYS_BETWEEN_SHOPS} ngày).`;
  return null;
}
function confirmOpen(l) {
  const L = LOCATIONS[l];
  const local = Object.keys(DRINKS).filter(id => DRINKS[id].only === l).map(id => DRINKS[id].name).join(", ");
  openModal(`🏗️ Mở chi nhánh ${L.city}?`, `<div class="intro-wrap"><div class="portrait">${Art.person(Art.UYEN, "wow")}</div><div class="intro-text" style="font-size:19px">
    Uyên có muốn mở <b>${L.name}</b> ở <b>${L.city}</b> không?
    <ul style="margin:10px 0">
      <li>💰 Trừ <b>${money(L.cost)}</b> vào két chung (còn lại ${money(S.money - L.cost)})</li>
      <li>🏠 Tiền thuê ${money(L.rent)}/ngày</li>
      <li>📦 Kho riêng với nguyên liệu khởi đầu; 🛠️ máy móc riêng, phải mua lại cho quán mới</li>
      <li>🏙️ Món địa phương: ${local}</li>
      <li>☕ Hôm nay Uyên sẽ chuyển sang đứng quầy ở quán mới</li>
    </ul>
    <div class="row"><button class="btn big teal" id="co-yes">✅ Mở quán</button><button class="btn big gray" id="co-no">Để sau</button></div></div></div>`, { noClose: true });
  $("#co-no").onclick = () => PANELS.chain(l);
  $("#co-yes").onclick = () => {
    if (!canAfford(L.cost) || canExpand()) return;
    S.money -= L.cost; S.lastOpenDay = S.day;
    S.shops.push(newShop(l, false));
    const idx = S.shops.length - 1;
    R.weatherBy[l] = rollWeather(l);
    R.today.shops[idx] = { served: 0, perfect: 0, lost: 0, revenue: 0, tips: 0, open: true };
    R.today.purchases += L.cost;
    R.cands[idx] = {}; ROLE_ORDER.forEach(r => R.cands[idx][r] = [genCandidate(r), genCandidate(r), genCandidate(r)]);
    S.active = idx;
    toast(`🎊 Khai trương chi nhánh ${L.city}! Khách ruột mới đang chờ Uyên ở đây.`, "gold"); Sound.sfx("day");
    checkAchv(); buildScene(); renderAll(); save(true); showPrepare();
  };
}
function showPrepare() {
  R.phase = "prepare";
  if (storyGate()) return;
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
    ${S.money < expectedCosts() * 1.2 ? `<div class="card" style="background:#ffe5e5"><h4>⚠️ Két tiền sắp cạn</h4><div>Chi phí cố định cuối ngày khoảng <b>${money(expectedCosts())}</b> (thuê mặt bằng, lương, điện nước) — két hiện có ${money(S.money)}. Két về 0 hoặc âm là phá sản!</div></div>` : ""}
    <h3>Sự kiện hôm nay</h3>${ev}
    <div class="card" style="margin-top:8px;background:#fff8ec"><div class="sub" style="font-size:16px">📜 ${cityNextText(shop())}</div></div>
    ${R.away && R.away.length ? `<div class="card" style="margin-top:8px"><h4>🛌 Nhân viên xin nghỉ hôm nay</h4><div class="sub">${R.away.join(", ")}</div></div>` : ""}
    <h3>Hôm nay Uyên đứng quầy ở đâu?</h3><div class="grid">${shopsHtml}</div>
    <h3>🎯 Mục tiêu</h3>${R.goals.map(g => `<div class="goal"><span>⬜ ${g.text}</span><span class="rw">+${money(g.reward)}</span></div>`).join("")}
    <div class="row" style="margin-top:16px">
      <button class="btn gray" data-go="kho">📦 Nhập kho</button><button class="btn gray" data-go="staff">👥 Nhân viên</button>
      <button class="btn gray" data-go="chain">🗺️ Chi nhánh</button><button class="btn gray" data-go="menu">📜 Thực đơn</button>
      <span class="spacer"></span><button class="btn big teal" id="p-open">🔓 Mở cửa!</button>
    </div>`, { noClose: true, panel: "prepare" });
  on(body, "[data-stand]", "click", c => { S.active = +c.dataset.stand; buildScene(); renderAll(); showPrepare(); });
  on(body, "[data-go]", "click", b => { khoTab = menuTab = staffTab = decorTab = S.active; PANELS[b.dataset.go](); });
  $("#p-open").onclick = openDay;
  const affordable = Object.keys(LOCATIONS).filter(l => !S.shops.some(sh => sh.loc === l) && canAfford(LOCATIONS[l].cost));
  if (!R.expandAsked && canExpand() === null && affordable.length) {
    R.expandAsked = true;
    openModal("🎉 Đủ điều kiện mở chi nhánh mới!", `<div class="intro-wrap"><div class="portrait">${Art.person(Art.UYEN, "happy")}</div><div class="intro-text">
      Két đã đủ tiền và các quán đều có Pha chế. Uyên có muốn mở thêm một chi nhánh không?<p class="sub">Có thể mở: ${affordable.map(l => `${LOCATIONS[l].city} (${money(LOCATIONS[l].cost)})`).join(", ")}</p>
      <div class="row"><button class="btn big teal" id="ex-yes">🗺️ Xem bản đồ chọn quán</button><button class="btn big gray" id="ex-no">Để sau</button></div></div></div>`, { noClose: true });
    $("#ex-yes").onclick = () => PANELS.chain();
    $("#ex-no").onclick = () => showPrepare();
  }
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
      ${S.money < expectedCosts() ? `<span class="pill red">⚠️ Két sắp cạn — về 0 là phá sản!</span>` : ""}
      <span class="spacer"></span>${isEnd ? `<button class="btn big teal" id="r-next">☀️ Sang ngày ${S.day}</button>` : ""}</div>`, { noClose: isEnd, panel: isEnd ? "" : "report" });
  if (isEnd) $("#r-next").onclick = () => prepareDay();
}

// ---------- Các bảng chức năng ----------
let staffTab = 0, decorTab = 0, khoTab = 0, menuTab = 0;
const shopTabs = cur => S.shops.length > 1 ? `<div class="tabbar">${S.shops.map((s, k) => `<button class="${k === cur ? "on" : ""}" data-tab="${k}">📍 ${LOCATIONS[s.loc].city}${k === S.active ? " ⭐" : ""}</button>`).join("")}</div>` : "";
const PANELS = {
  kho() {
    khoTab = clamp(khoTab, 0, S.shops.length - 1);
    const sh = S.shops[khoTab], city = LOCATIONS[sh.loc].city;
    const cashier = !!sh.staff.cashier;
    const items = Object.keys(INGREDIENTS).filter(k => !INGREDIENTS[k].free && ingAvail(k, sh)).map(k => {
      const I = INGREDIENTS[k], p = ingPrice(k), q = sh.inv[k] || 0;
      return `<div class="card"><div class="row"><div class="ing" style="box-shadow:none;padding:0"><div class="ic" style="background:${I.color}">${I.icon}</div></div>
        <div><h4>${I.name}${I.only ? ' <span class="pill green">Đặc sản</span>' : ""}</h4><div class="sub">Còn <b style="color:${q < 5 ? "#e63946" : "#1f776c"}">${q}</b> phần · ${money(p)}/phần</div></div></div>
        <div class="row" style="margin-top:6px"><button class="btn teal" data-buy="${k}" data-n="10">+10 (${shortMoney(p * 10)})</button><button class="btn" data-buy="${k}" data-n="30">+30 (${shortMoney(p * 30)})</button></div>
        ${cashier ? `<div class="row qtybtns" style="margin-top:6px"><span class="sub">Mức tự nhập: <b>${sh.target[k] || 0}</b></span><button data-tg="${k}" data-d="-10">−</button><button data-tg="${k}" data-d="10">+</button></div>` : ""}</div>`;
    }).join("");
    const body = openModal(`📦 Kho nguyên liệu — quán ${city}`, `${shopTabs(khoTab)}
      <p>Mỗi quán có kho riêng; tiền nhập hàng trừ vào két chung. ${R.event && (R.event.discount || R.event.priceUp) ? `<span class="pill ${R.event.discount ? "green" : "red"}">${R.event.icon} ${R.event.name}</span>` : ""}
      ${cashier ? "<span class='pill green'>💁 Thu ngân quán này tự nhập đến “mức tự nhập” mỗi sáng</span>" : "<span class='pill'>Thuê Thu ngân ở quán này để tự động nhập kho mỗi sáng</span>"}</p>
      <div class="row"><button class="btn teal" id="k-fill">🛒 Nhập đủ tất cả lên 30 phần</button><span class="sub">Đá và nước nóng miễn phí.</span></div>
      <div class="grid" style="margin-top:10px">${items}</div>`, { panel: "kho" });
    on(body, "[data-tab]", "click", b => { khoTab = +b.dataset.tab; refreshPanel(); });
    on(body, "[data-buy]", "click", b => buy(b.dataset.buy, +b.dataset.n, false, sh));
    on(body, "[data-tg]", "click", b => { const k = b.dataset.tg; sh.target[k] = clamp((sh.target[k] || 0) + +b.dataset.d, 0, 200); refreshPanel(); });
    $("#k-fill").onclick = () => { Object.keys(INGREDIENTS).filter(k => !INGREDIENTS[k].free && ingAvail(k, sh)).forEach(k => { const need = 30 - (sh.inv[k] || 0); if (need > 0) buy(k, need, true, sh); }); refreshPanel(); };
  },
  board() {
    const n = menuList().length;
    openModal(`📜 Thực đơn đang bán — quán ${loc().city} (${n} món)`, `<p class="sub">Bấm nguyên liệu đúng thứ tự để được “Hoàn hảo”. Món đặc sản của thành phố bán giá cao hơn 20%. Món 🏙️ địa phương chỉ có ở quán này.</p>${sellingHtml()}
      <div class="row" style="margin-top:12px"><span class="spacer"></span><button class="btn gray" id="b-more">🛠️ Mua máy để mở thêm món</button></div>`, { panel: "board" });
    $("#b-more").onclick = () => { menuTab = S.active; PANELS.menu(); };
  },
  menu() {
    menuTab = clamp(menuTab, 0, S.shops.length - 1);
    const sh = S.shops[menuTab], city = LOCATIONS[sh.loc].city;
    const locked = Object.keys(DRINKS).filter(id => !drinkAvail(id, sh) && (!DRINKS[id].only || DRINKS[id].only === sh.loc)).map(id => {
      const d = DRINKS[id];
      if (d.secret && !S.secrets[id]) return `<div class="card locked"><h4>❓ Công thức bí mật</h4><div class="sub">Một khách ruột sẽ truyền dạy khi đủ thân thiết.</div></div>`;
      return `<div class="card locked"><div class="row"><div style="width:60px;height:60px">${Art.drinkIcon(id)}</div><div><h4>${d.name}</h4><div class="sub">${money(d.price)} · 🔒 Cần: ${d.equip ? EQUIPMENT[d.equip].name : "công thức"}</div></div></div></div>`;
    }).join("");
    const elsewhere = Object.keys(DRINKS).filter(id => DRINKS[id].only && DRINKS[id].only !== sh.loc).map(id => `<span class="pill">${DRINKS[id].name} · ${LOCATIONS[DRINKS[id].only].city}</span>`).join(" ");
    const eq = Object.keys(EQUIPMENT).map(id => {
      const E = EQUIPMENT[id], own = sh.equip[id];
      return `<div class="card ${own ? "owned" : ""}"><h4>${E.name}</h4><div class="sub">${E.desc}</div><div class="row" style="margin-top:6px">${own ? `<span class="pill green">✔ Quán ${city} đã có</span>` : `<button class="btn" data-eq="${id}" ${!canAfford(E.price) ? "disabled" : ""}>Mua cho quán ${city} · ${money(E.price)}</button>`}</div></div>`;
    }).join("");
    const body = openModal(`📜 Thực đơn & Máy móc — quán ${city}`, `${shopTabs(menuTab)}
      <h3>☕ Đang bán (${menuList(sh).length} món)</h3><p class="sub">Bấm nguyên liệu đúng thứ tự để được “Hoàn hảo”. Đúng nguyên liệu nhưng sai thứ tự chỉ được “Ngon”.</p>${sellingHtml(sh)}
      <h3>🛠️ Máy móc của quán ${city}</h3><p class="sub">Mỗi quán mua máy riêng.</p><div class="grid">${eq}</div>
      ${locked ? `<h3>🔒 Chưa mở khóa ở quán này</h3><div class="grid">${locked}</div>` : ""}
      <div class="row" style="margin-top:12px"><button class="btn ${S.story.chapter >= 3 ? "teal" : "gray"}" id="m-lab">🧪 Phòng thử công thức signature${S.story.chapter >= 3 ? "" : ` (mở ở “${CHAPTERS[2].title}”)`}</button></div>
      <h3>🏙️ Món địa phương ở thành phố khác</h3><p class="sub">Mở quán ở các thành phố này để bán thêm món: ${elsewhere}</p>`, { panel: "menu" });
    on(body, "[data-tab]", "click", b => { menuTab = +b.dataset.tab; refreshPanel(); });
    $("#m-lab").onclick = () => PANELS.lab();
    on(body, "[data-eq]", "click", b => {
      const id = b.dataset.eq, E = EQUIPMENT[id];
      if (!canAfford(E.price)) return;
      S.money -= E.price; R.today.purchases += E.price; sh.equip[id] = true;
      toast(`🛠️ Quán ${city} đã có ${E.name}!`, "gold"); Sound.sfx("coin");
      renderIngredients(); renderHud(); save(true); refreshPanel();
    });
  },
  staff() {
    staffTab = clamp(staffTab, 0, S.shops.length - 1);
    const i = staffTab, sh = S.shops[i];
    const tabs = S.shops.map((s, k) => `<button class="${k === i ? "on" : ""}" data-tab="${k}">📍 ${LOCATIONS[s.loc].city}</button>`).join("");
    const pills = x => (x.perks || []).map(k => PERKS[k] && `<span class="pill green" title="${PERKS[k].desc}">${PERKS[k].icon} ${PERKS[k].name}</span>`).join("")
      + (x.flaws || []).map(k => FLAWS[k] && `<span class="pill red" title="${FLAWS[k].desc}">${FLAWS[k].icon} ${FLAWS[k].name}</span>`).join("");
    const details = x => staffTraits(x).map(t => `<div class="trait-line">${t.icon} ${t.desc}</div>`).join("");
    const stars5 = n => `<span class="stars">${"★".repeat(n)}${"☆".repeat(5 - n)}</span>`;
    const slots = ROLE_ORDER.map(role => {
      const R0 = ROLES[role], st = sh.staff[role], req = roleReq(i, role);
      if (st) return `<div class="slot"><div class="avatar-sm">${Art.person(st.look, "happy")}</div><div class="info"><b>${R0.icon} ${R0.name}: ${st.name}</b> ${stars5(st.skill)} ${st.absent ? '<span class="pill red">🛌 Hôm nay xin nghỉ</span>' : ""}<br>
        ${pills(st)}<span class="pill">Lương ${money(st.wage)}/ngày</span><span class="pill">Đã làm ${st.days} ngày</span>
        <div class="sub">${R0.desc}</div>${details(st)}</div>
        <button class="btn gray" data-fire="${role}">Cho nghỉ</button></div>`;
      if (req) return `<div class="slot" style="opacity:.6"><div class="avatar-sm" style="font-size:40px;align-items:center">🔒</div><div class="info"><b>${R0.icon} ${R0.name}</b><br><span class="sub">${R0.desc}</span><br><span class="pill red">${req}</span></div></div>`;
      const cands = (R.cands[i] && R.cands[i][role]) || [];
      return `<div class="slot" style="flex-direction:column;align-items:stretch"><div class="row"><b>${R0.icon} Tuyển ${R0.name}</b> <span class="sub">— ${R0.desc}</span><span class="spacer"></span>
          <button class="btn gray" data-reroll="${role}" ${!canAfford(REROLL_COST) ? "disabled" : ""}>🔄 Tìm ứng viên khác (${money(REROLL_COST)})</button></div>
        <div class="grid cand-grid">${cands.map((c, k) => `<div class="card cand"><div class="row"><div class="avatar-sm">${Art.person(c.look, "happy")}</div><div><h4>${c.name}</h4>${stars5(c.skill)}<div>${pills(c)}</div></div></div>
          <div style="margin-top:6px">${details(c)}</div>
          <div class="row" style="margin-top:6px"><b>Lương ${money(c.wage)}/ngày</b><span class="spacer"></span><button class="btn teal" data-hire="${role}" data-k="${k}">Thuê</button></div></div>`).join("") || '<span class="sub">Hết ứng viên hôm nay, quay lại ngày mai hoặc tìm thêm.</span>'}</div></div>`;
    }).join("");
    const body = openModal("👥 Nhân viên", `<div class="tabbar">${tabs}</div>
      <p class="sub">Thứ tự tuyển: Phục vụ → Tạp vụ → Thu ngân → <b>Pha chế (cuối cùng)</b>. Mỗi vị trí có tối đa 3 ứng viên, mỗi người có ưu điểm (xanh) và có thể kèm nhược điểm (đỏ). Lương trả cuối mỗi ngày; nhân viên lên tay nghề sau mỗi 10 ngày.</p>${slots}`, { panel: "staff" });
    on(body, "[data-tab]", "click", b => { staffTab = +b.dataset.tab; refreshPanel(); });
    on(body, "[data-hire]", "click", b => { hire(i, b.dataset.hire, +b.dataset.k); refreshPanel(); });
    on(body, "[data-fire]", "click", b => { fire(i, b.dataset.fire); refreshPanel(); });
    on(body, "[data-reroll]", "click", b => {
      if (!canAfford(REROLL_COST)) return;
      S.money -= REROLL_COST; R.today.purchases += REROLL_COST;
      R.cands[i][b.dataset.reroll] = [genCandidate(b.dataset.reroll), genCandidate(b.dataset.reroll), genCandidate(b.dataset.reroll)];
      Sound.sfx("coin"); renderHud(); refreshPanel();
    });
  },
  decor() {
    decorTab = clamp(decorTab, 0, S.shops.length - 1);
    const i = decorTab, sh = S.shops[i];
    const tabs = S.shops.map((s, k) => `<button class="${k === i ? "on" : ""}" data-tab="${k}">📍 ${LOCATIONS[s.loc].city}</button>`).join("");
    const items = Object.keys(DECOR).map(id => {
      const D = DECOR[id], lv = sh.decor[id] || 0, price = D.price * (lv + 1);
      if (D.chapter && S.story.chapter < D.chapter) return `<div class="card locked"><h4>🔒 ${D.name}</h4><div class="sub">${D.desc}</div><div class="pill" style="margin-top:6px">Mở ở “${CHAPTERS[D.chapter - 1].title}”</div></div>`;
      return `<div class="card ${lv >= D.max ? "owned" : ""}"><h4>${D.name} ${D.max > 1 ? `<span class="sub">cấp ${lv}/${D.max}</span>` : ""}</h4><div class="sub">${D.desc}</div>
        <div class="row" style="margin-top:6px">${lv >= D.max ? '<span class="pill green">✔ Đã lắp</span>' : `<button class="btn" data-dec="${id}" ${!canAfford(price) ? "disabled" : ""}>Mua ${money(price)}</button>`}</div></div>`;
    }).join("");
    const body = openModal("🪴 Trang trí quán", `<div class="tabbar">${tabs}</div><p class="sub">Mỗi món trang trí tốn thêm 5.000đ/ngày bảo trì.</p><div class="grid">${items}</div>`, { panel: "decor" });
    on(body, "[data-tab]", "click", b => { decorTab = +b.dataset.tab; refreshPanel(); });
    on(body, "[data-dec]", "click", b => {
      const id = b.dataset.dec, lv = sh.decor[id] || 0, price = DECOR[id].price * (lv + 1);
      if (!canAfford(price)) return;
      S.money -= price; R.today.purchases += price; sh.decor[id] = lv + 1;
      toast(`🪴 Đã lắp ${DECOR[id].name}!`, "gold"); Sound.sfx("coin");
      if (i === S.active) buildScene();
      renderHud(); save(true); refreshPanel();
    });
  },
  ads() {
    const items = Object.keys(MARKETING).map(id => {
      const M = MARKETING[id], act = S.marketing.find(m => m.id === id);
      return `<div class="card ${act ? "owned" : ""}"><h4>📣 ${M.name}</h4><div class="sub">${M.desc}</div><div class="row" style="margin-top:6px">${act ? `<span class="pill green">Đang chạy, còn ${act.days} ngày</span>` : `<button class="btn" data-ad="${id}" ${!canAfford(M.price) ? "disabled" : ""}>Chạy ${money(M.price)}</button>`}</div></div>`;
    }).join("");
    const body = openModal("📣 Quảng cáo", `<p class="sub">Quảng cáo tăng lượng khách. Mời TikToker còn có thể khiến một vị khách đặc biệt ghé quán sớm hơn...</p><div class="grid">${items}</div>`, { panel: "ads" });
    on(body, "[data-ad]", "click", b => {
      const id = b.dataset.ad, M = MARKETING[id];
      if (!canAfford(M.price)) return;
      S.money -= M.price; R.today.marketing += M.price;
      S.marketing.push({ id, days: M.days, boost: M.boost, scope: M.scope });
      toast(`📣 Bắt đầu chiến dịch: ${M.name}`, "gold"); Sound.sfx("coin");
      renderHud(); save(true); refreshPanel();
    });
  },
  chain(sel) {
    const reason = canExpand();
    const owned = l => S.shops.findIndex(sh => sh.loc === l);
    const P = ([lon, lat]) => [(lon - 101.6) * 40, (23.7 - lat) * 40];
    const land = VN_OUTLINE.map(P).map(([x, y]) => x.toFixed(1) + "," + y.toFixed(1)).join(" ");
    const pins = Object.keys(GEO).map(l => {
      const [x, y] = P(GEO[l]), L = LOCATIONS[l], k = owned(l);
      const state = k >= 0 ? "owned" : !reason && canAfford(L.cost) && R.phase === "prepare" ? "ready" : "locked";
      const right = !["hanoi", "hue", "danang"].includes(l);
      const lx = right ? x + 16 : x - 16, anchor = right ? "start" : "end";
      const dy = l === "hue" ? -14 : l === "danang" ? 18 : l === "hoian" ? 26 : 0;
      return `<g class="pin ${state} ${sel === l ? "sel" : ""}" data-city="${l}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
        <circle r="15" class="pin-halo"/><circle r="11" class="pin-dot"/><text y="5" text-anchor="middle" font-size="13">${k >= 0 ? "☕" : state === "ready" ? "✨" : "📍"}</text>
        <g transform="translate(${lx - x} ${dy})"><rect x="${right ? -4 : -150}" y="-15" width="154" height="${k >= 0 ? 24 : 40}" rx="8" class="pin-label"/>
          <text x="${right ? 4 : -4}" y="2" text-anchor="${anchor}" class="pin-name">${L.city}${k === S.active ? " ⭐" : ""}</text>
          ${k >= 0 ? "" : `<text x="${right ? 4 : -4}" y="18" text-anchor="${anchor}" class="pin-cost">${money(L.cost)}</text>`}</g></g>`;
    }).join("");
    const islands = (lon, lat, name) => { const [x, y] = P([lon, lat]); return `<g transform="translate(${x} ${y})">${[[0,0],[9,5],[-7,7],[4,-8],[13,-3]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="2.6" fill="#f4d58d" stroke="#c9a227"/>`).join("")}<text y="22" text-anchor="middle" class="island">${name}</text></g>`; };
    const pq = P([103.97, 10.22]);
    const map = `<svg class="vn-map" viewBox="0 0 540 620" xmlns="http://www.w3.org/2000/svg">
      <defs><pattern id="sea" width="40" height="24" patternUnits="userSpaceOnUse"><rect width="40" height="24" fill="#bfe9ff"/><path d="M2,14 q8,-6 16,0 t16,0" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/></pattern>
        <linearGradient id="landg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a7d878"/><stop offset=".55" stop-color="#cde98f"/><stop offset="1" stop-color="#ffe29a"/></linearGradient></defs>
      <rect width="540" height="620" rx="20" fill="url(#sea)"/>
      <polygon points="${land}" fill="#9cc66b" opacity=".45" transform="translate(4 6)"/>
      <polygon points="${land}" fill="url(#landg)" stroke="#6a994e" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="${pq[0]}" cy="${pq[1]}" r="6" fill="#cde98f" stroke="#6a994e" stroke-width="2"/>
      ${islands(111.6, 16.5, "Q.Đ. Hoàng Sa")}${islands(113.7, 10.0, "Q.Đ. Trường Sa")}
      <g opacity=".7">${[[104.1, 22.0], [105.0, 21.9], [104.5, 21.3]].map(p => { const [x, y] = P(p); return `<path d="M${x - 12},${y + 8} l12,-18 l12,18z" fill="#6a994e"/><path d="M${x - 4},${y - 4} l4,-6 l4,6z" fill="#fff"/>`; }).join("")}</g>
      <text x="410" y="410" class="sea-name">Biển Đông</text>
      <g transform="translate(450 470)"><path d="M-22,0 h44 l-8,10 h-28z" fill="#e07a5f"/><path d="M0,0 v-26 l14,20z" fill="#fff"/></g>
      <g transform="translate(470 60)"><circle r="20" fill="#ffd166"/><circle r="28" fill="#ffd166" opacity=".3"/></g>
      ${pins}
    </svg>`;
    const s0 = sel && LOCATIONS[sel];
    let side;
    if (s0) {
      const k = owned(sel), local = Object.keys(DRINKS).filter(id => DRINKS[id].only === sel).map(id => DRINKS[id].name).join(", ");
      const regs = CHARACTERS.filter(c => c.loc === sel).map(c => c.name).join(", ");
      if (k >= 0) {
        const sh = S.shops[k], T = R.today && R.today.shops[k];
        side = `<div class="card owned"><h3 style="margin:0">☕ ${s0.city} — ${s0.name}</h3><div class="sub">${s0.desc}</div>
          <div><span class="stars">${stars(sh.rep)}</span> ${Math.ceil(sh.rep)} uy tín · Thuê ${money(s0.rent)}/ngày</div>
          <div>Nhân viên: ${ROLE_ORDER.map(r => sh.staff[r] ? ROLES[r].icon : "▫️").join(" ")}</div>
          <div class="sub">Hôm nay: ${T ? `${T.served} ly · ${money(T.revenue + T.tips)}` : "-"} · Tổng: ${sh.served} ly · Máy: ${Object.keys(sh.equip).length}/${Object.keys(EQUIPMENT).length}</div>
          <div class="sub">🏙️ Món địa phương: ${local}</div>
          <div class="sub">📜 ${cityNextText(sh)}</div>
          <div style="margin-top:6px">${k === S.active ? '<span class="pill green">Uyên đang ở đây</span>' : sh.staff.barista ? '<span class="pill">☕ Tự vận hành</span>' : '<span class="pill red">Đóng khi Uyên vắng</span>'}</div></div>`;
      } else {
        const why = reason || (!canAfford(s0.cost) ? `Cần ${money(s0.cost)} (két còn ${money(S.money)}).` : R.phase !== "prepare" ? "Chỉ mở chi nhánh vào đầu ngày." : "");
        side = `<div class="card"><h3 style="margin:0">📍 ${s0.city} — ${s0.name}</h3><div class="sub">${s0.desc}</div>
          <div class="row" style="margin-top:6px"><span class="pill">💰 Giá mở: ${money(s0.cost)}</span><span class="pill">🏠 Thuê ${money(s0.rent)}/ngày</span><span class="pill">👥 Khách ×${s0.flow}</span></div>
          <div class="sub" style="margin-top:4px">⭐ Đặc sản bán giá cao: ${DRINKS[s0.specialty].name}<br>🏙️ Món chỉ có ở đây: ${local}<br>💞 Khách ruột mới: ${regs}<br>📜 Câu chuyện riêng: ${CITY_STORIES[sel].icon} “${CITY_STORIES[sel].title}”</div>
          <div class="row" style="margin-top:10px"><button class="btn big teal" id="c-open" ${why ? "disabled" : ""}>🏗️ Mở chi nhánh</button></div>
          ${why ? `<div class="pill red" style="margin-top:6px">${why}</div>` : ""}</div>`;
      }
    } else side = `<div class="card"><h4>👆 Chọn một thành phố trên bản đồ</h4><div class="sub">Điểm ☕ là quán đã mở, ✨ là nơi đủ điều kiện mở ngay, 📍 là nơi chưa đủ điều kiện.</div>
      ${reason ? `<div class="pill red" style="margin-top:6px">${reason}</div>` : `<div class="pill green" style="margin-top:6px">Đủ điều kiện mở chi nhánh mới!</div>`}</div>`;
    const body = openModal("🗺️ Chi nhánh Cửa hàng nhỏ của Uyên", `<div class="branch-wrap"><div>${map}</div><div class="branch-side">
      <p class="sub" style="margin-top:0">Doanh thu và chi phí mọi chi nhánh về chung một két. Mỗi chi nhánh có kho nguyên liệu, máy móc và món địa phương riêng. Mỗi chi nhánh mới cách nhau ít nhất ${MIN_DAYS_BETWEEN_SHOPS} ngày, và các quán cũ phải có Pha chế.</p>
      ${side}<h3>📈 Doanh thu các chi nhánh</h3>${chartSvg()}</div></div>`, { panel: "chain" });
    on(body, ".pin", "click", g => { Sound.sfx("click"); PANELS.chain(g.dataset.city); });
    const ob = $("#c-open"); if (ob) ob.onclick = () => confirmOpen(sel);
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
    openModal(`💞 Sổ tay khách ruột (${met}/${CHARACTERS.length})`, `<p class="sub">Trò chuyện và pha đúng món yêu thích để tăng tim. Đạt 1, 3, 5 tim sẽ mở khóa câu chuyện và quà (khách hiện 💖). Mở quán ở thành phố mới để gặp khách ruột mới!</p><div class="grid">${cards}</div>`, { panel: "album" });
  },
  report() { showReport(S.lastReport, false); },
  notebook() {
    const st = S.story;
    if (!st.notebook) { openModal("📖 Sổ tay công thức", `<p style="font-size:20px">Uyên chưa tìm thấy cuốn sổ nào cả... Có lẽ nó nằm đâu đó trong quán. Hãy chơi tiếp sang ngày mới.</p>`, { panel: "notebook" }); return; }
    const pages = NOTEBOOK.map((pg, i) => {
      const open = !!st.pages[i];
      if (pg.need === -1) {
        if (st.lastPage) return `<div class="nb-page open last"><h4>✍️ Trang cuối — Bảo Uyên</h4><p class="nb-text">${st.lastPage.text.replace(/</g, "&lt;")}</p><p class="nb-text">☕ <b>Ly Ký Ức</b>: cà phê phin → sữa đặc → sữa tươi → ca cao.</p></div>`;
        return `<div class="nb-page"><h4>✍️ Trang cuối</h4><p class="sub">Trang giấy còn trắng. ${st.chapter >= 4 ? "" : `Sẽ được viết ở “${CHAPTERS[3].title}”.`}</p>${st.chapter >= 4 ? `<button class="btn teal" id="nb-write">✍️ Viết trang cuối</button>` : ""}</div>`;
      }
      if (open) return `<div class="nb-page open"><h4>${pg.title}</h4><p class="nb-text">${pg.text}</p></div>`;
      return `<div class="nb-page blur"><h4>${pg.title}</h4><p class="nb-text blurred">${pg.text}</p>
        <button class="btn ${st.fragments >= pg.need ? "teal" : "gray"}" data-restore="${i}" ${st.fragments >= pg.need ? "" : "disabled"}>🧩 Khôi phục (${pg.need} mảnh ghép)</button></div>`;
    }).join("");
    const body = openModal("📖 Sổ tay công thức của ngoại", `<div class="row"><span class="pill green">🧩 ${st.fragments} mảnh ghép câu chuyện</span><span class="pill">📄 ${Object.keys(st.pages).length}/${NOTEBOOK.length} trang</span>
      <span class="sub">Nhận mảnh ghép khi pha đúng ly hợp tâm trạng khách, nghe khách ruột tâm sự, nhận kỷ vật.</span></div>
      <div class="notebook">${pages}</div>`, { panel: "notebook" });
    on(body, "[data-restore]", "click", b => {
      const i = +b.dataset.restore, pg = NOTEBOOK[i];
      if (st.fragments < pg.need) return;
      st.fragments -= pg.need; st.pages[i] = S.day;
      const rw = pg.reward || {};
      if (rw.moodTip) { st.moodTip += rw.moodTip; toast("📖 Từ giờ ly hợp tâm trạng được tip thêm 5%, và Uyên biết khách cần vị gì!", "gold"); }
      if (rw.money || rw.rep || rw.flow) applyReward(rw, "sổ tay của ngoại");
      Sound.sfx("heart"); save(true); renderChapterBar(); refreshPanel();
    });
    const w = $("#nb-write"); if (w) w.onclick = writeLastPage;
  },
  lab() {
    const sh = shop();
    if (S.story.chapter < 3) { openModal("🧪 Phòng thử công thức", `<p style="font-size:20px">Phòng thử công thức mở ở “${CHAPTERS[2].title}”.</p>`, { panel: "lab" }); return; }
    R.lab = R.lab || [];
    const ings = Object.keys(INGREDIENTS).filter(k => ingAvail(k, sh)).map(k => `<button class="ing lab-ing" data-li="${k}"><div class="ic" style="background:${INGREDIENTS[k].color}">${INGREDIENTS[k].icon}</div><div class="nm">${INGREDIENTS[k].name}</div></button>`).join("");
    const rec = R.lab, { sc, notes } = sigScore(rec), price = 35000 + sc * 6000;
    const mine = (S.signatures || []).map(g => `<div class="card"><div class="row"><div style="width:52px;height:52px">${Art.cup(g.recipe, { hot: g.hot })}</div><div><h4>⭐ ${g.name}</h4><div class="sub">${money(g.price)} · ${g.recipe.map(k => INGREDIENTS[k].name).join(" → ")}</div></div></div></div>`).join("");
    const body = openModal("🧪 Phòng thử công thức của Uyên", `<p class="sub">Chọn 3–5 nguyên liệu theo thứ tự để tạo món signature. Món ngon (có nền vị chính, vị ngọt, lớp phủ, dấu ấn địa phương, đúng nhiệt độ) sẽ bán được giá cao. Tối đa ${SIG_MAX} món, mỗi lần thử tốn 300.000đ. Món signature bán ở mọi chi nhánh có đủ nguyên liệu, khách rất thích gọi.</p>
      ${mine ? `<h3>Món của Uyên</h3><div class="grid">${mine}</div>` : ""}
      <div class="lab-row"><div class="lab-cup">${Art.cup(rec, { hot: rec.includes("nuoc_nong") })}</div><div style="flex:1">
        <div>${rec.map(k => `<span class="chip">${INGREDIENTS[k].icon} ${INGREDIENTS[k].name}</span>`).join(" → ") || '<span class="sub">Chưa có nguyên liệu</span>'}</div>
        <div style="margin-top:6px">${"⭐".repeat(sc)}${"☆".repeat(6 - sc)} · Giá bán dự kiến <b>${money(price)}</b></div><div class="sub">${notes.join(" · ")}</div>
        <div class="row" style="margin-top:8px"><input id="lab-name" class="txt" maxlength="28" placeholder="Đặt tên món, ví dụ: Chiều Hà Nội"><button class="btn gray" id="lab-undo">↩️</button><button class="btn gray" id="lab-clear">🗑️</button>
          <button class="btn teal" id="lab-save" ${rec.length >= 3 && rec.length <= 5 && (S.signatures || []).length < SIG_MAX && canAfford(300000) ? "" : "disabled"}>💾 Lưu món (300.000đ)</button></div></div></div>
      <div class="lab-ings">${ings}</div>`, { panel: "lab" });
    on(body, "[data-li]", "click", b => { if (R.lab.length < 5) { R.lab.push(b.dataset.li); Sound.sfx("pop"); } refreshPanel(); });
    $("#lab-undo").onclick = () => { R.lab.pop(); refreshPanel(); };
    $("#lab-clear").onclick = () => { R.lab = []; refreshPanel(); };
    $("#lab-save").onclick = () => {
      const name = ($("#lab-name").value || "").trim() || `Signature của Uyên ${(S.signatures || []).length + 1}`;
      S.money -= 300000; if (R.today) R.today.purchases += 300000;
      S.signatures.push({ id: "sig_" + Date.now().toString(36), name, recipe: R.lab.slice(), price, hot: R.lab.includes("nuoc_nong"), feel: sigFeel(R.lab) });
      registerSignatures(); R.lab = [];
      toast(`⭐ Món signature mới: ${name}!`, "gold"); Sound.sfx("perfect");
      renderHud(); save(true); refreshPanel();
    };
  },
  music(lastQuery) {
    const cur = S.settings.musicPreset || "auto";
    const presets = Object.keys(MUSIC_PRESETS).map(id => {
      const P = MUSIC_PRESETS[id], on = !Music.ytId && S.settings.musicOn && cur === id;
      return `<div class="card ${on ? "owned" : ""}" style="cursor:pointer" data-preset="${id}"><h4>${P.icon} ${P.name}</h4><div class="sub">${P.desc}</div></div>`;
    }).join("");
    const key = ytKey();
    const results = Music.results.map((v, k) => `<div class="card yt-card" data-yt="${k}"><img src="${v.thumb}" alt="" loading="lazy"><div><b>${v.title}</b><div class="sub">${v.ch}</div></div></div>`).join("");
    const now = Music.ytId ? `▶ YouTube: <b>${Music.ytTitle}</b>` : S.settings.musicOn ? `${MUSIC_PRESETS[cur].icon} <b>${MUSIC_PRESETS[cur].name}</b>` : "🔇 Đang tắt nhạc";
    const body = openModal("📺 TV của quán — chọn nhạc", `
      <p class="sub">Trong lúc chọn nhạc, quán tạm ngưng đón khách. Đóng bảng này để quán hoạt động tiếp.</p>
      <div class="row"><span class="pill green">Đang phát: ${now}</span>
        ${Music.ytId ? '<button class="btn gray" id="m-stopyt">⏹ Dừng YouTube</button>' : ""}
        <button class="btn gray" id="m-mute">${S.settings.musicOn || Music.ytId ? "🔇 Tắt nhạc" : "🔊 Bật nhạc"}</button>
        <span class="spacer"></span>🔉 <input type="range" id="m-vol" min="0" max="1" step="0.05" value="${S.settings.music}"></div>
      <h3>🎷 Nhạc của quán</h3><div class="grid">${presets}</div>
      <h3>▶ Tìm nhạc YouTube</h3>
      <div class="row"><input id="m-q" class="txt" placeholder="Ví dụ: nhạc Trịnh jazz, lofi cà phê..." value="${(lastQuery || "").replace(/"/g, "&quot;")}"><button class="btn teal" id="m-search">🔎 Tìm</button></div>
      <div class="row" style="margin-top:6px">${YT_SUGGEST.map(q => `<button class="pill qchip" data-q="${q}">${q}</button>`).join("")}</div>
      ${key ? "" : `<p class="sub">Để tìm kiếm ngay trong game, cần một YouTube API key miễn phí (xem mục bên dưới). Chưa có key thì bấm “🔎 Tìm” để mở YouTube, chép link video rồi dán vào ô bên dưới.</p>`}
      <div class="grid" style="margin-top:8px">${results}</div>
      <div class="row" style="margin-top:10px"><input id="m-link" class="txt" placeholder="Dán link video YouTube vào đây"><button class="btn" id="m-play">▶ Phát trên TV</button></div>
      <details style="margin-top:12px"><summary class="sub">⚙️ Thiết lập tìm kiếm trong game (YouTube API key)</summary>
        <p class="sub">Tạo key miễn phí tại Google Cloud Console → bật “YouTube Data API v3” → Credentials → API key. Key chỉ lưu trên thiết bị này, không nằm trong file save.</p>
        <div class="row"><input id="m-key" class="txt" type="password" placeholder="Dán API key" value="${key ? "••••••••" : ""}"><button class="btn gray" id="m-savekey">Lưu key</button>${key ? '<button class="btn gray" id="m-delkey">Xóa key</button>' : ""}</div>
      </details>`, { panel: "music" });
    on(body, "[data-preset]", "click", c => {
      S.settings.musicPreset = c.dataset.preset; S.settings.musicOn = true;
      if (Music.ytId) stopYT();
      Sound.setPreset(S.settings.musicPreset); startMusic(); applySettings();
      PANELS.music(lastQuery);
    });
    const doSearch = async q => {
      q = (q || "").trim(); if (!q) return;
      if (!ytKey()) { window.open("https://www.youtube.com/results?search_query=" + encodeURIComponent(q), "_blank"); return; }
      $("#m-search").disabled = true; $("#m-search").textContent = "⏳";
      try { Music.results = await searchYT(q); if (!Music.results.length) toast("Không tìm thấy video nào", "bad"); }
      catch (e) { toast("Tìm kiếm thất bại — kiểm tra API key hoặc mạng.", "bad"); }
      if ($("#modal").dataset.panel === "music") PANELS.music(q);
    };
    $("#m-search").onclick = () => doSearch($("#m-q").value);
    $("#m-q").onkeydown = e => { if (e.key === "Enter") doSearch($("#m-q").value); };
    on(body, ".qchip", "click", b => { $("#m-q").value = b.dataset.q; doSearch(b.dataset.q); });
    on(body, "[data-yt]", "click", c => { const v = Music.results[+c.dataset.yt]; playYT(v.id, v.title); PANELS.music(lastQuery); });
    $("#m-play").onclick = () => { const id = ytIdFrom($("#m-link").value); if (!id) { toast("Link YouTube không hợp lệ", "bad"); return; } playYT(id, "Video YouTube"); PANELS.music(lastQuery); };
    $("#m-mute").onclick = () => {
      if (S.settings.musicOn || Music.ytId) { if (Music.ytId) stopYT(); S.settings.musicOn = false; Sound.stop(); }
      else { S.settings.musicOn = true; startMusic(); }
      applySettings(); PANELS.music(lastQuery);
    };
    const sy = $("#m-stopyt"); if (sy) sy.onclick = () => { stopYT(); PANELS.music(lastQuery); };
    $("#m-vol").oninput = e => { S.settings.music = +e.target.value; applySettings(); };
    $("#m-savekey").onclick = () => { const v = $("#m-key").value.trim(); if (!v || v.startsWith("•")) return; try { localStorage.setItem(YT_KEY, v); } catch (e) {} toast("🔑 Đã lưu key trên thiết bị này"); PANELS.music(lastQuery); };
    const dk = $("#m-delkey"); if (dk) dk.onclick = () => { try { localStorage.removeItem(YT_KEY); } catch (e) {} Music.results = []; PANELS.music(lastQuery); };
  },
  collect() {
    const got = Object.keys(ITEMS).filter(k => S.items[k]).length;
    const sections = SET_ORDER.map(set => {
      const Z = ITEM_SETS[set], ids = setItems(set), have = ids.filter(k => S.items[k]).length;
      const where = set === "global" ? "Khắp nơi" : LOCATIONS[set].city;
      const cards = ids.map(k => {
        const I = ITEMS[k];
        if (S.items[k]) {
          const who = I.from ? CHARACTERS.find(c => c.id === I.from).name : I.souvenir ? "Quà lưu niệm" : "Ngoại";
          return `<div class="card item owned"><div class="item-ic">${I.icon}</div><div><h4>${I.name}</h4><div class="sub">${I.desc}</div><div class="sub">Từ: <b>${who}</b> · ngày ${S.items[k]}</div></div></div>`;
        }
        const hint = I.from ? "Nghe hết câu chuyện của một khách ruột ở " + where : "Uy tín quán " + where + " đạt 60";
        return `<div class="card item locked"><div class="item-ic">❔</div><div><h4>???</h4><div class="sub">${hint}</div></div></div>`;
      }).join("");
      return `<h3>${S.setsDone[set] ? "🏅" : "📦"} ${Z.name} <span class="sub">(${where} · ${have}/${ids.length})</span></h3>
        <div class="sub">Phần thưởng khi đủ bộ: ${Z.desc} ${S.setsDone[set] ? '<span class="pill green">Đã nhận</span>' : ""}</div>
        <div class="grid" style="margin-top:6px">${cards}</div>`;
    }).join("");
    openModal(`📚 Sổ sưu tập kỷ vật (${got}/${Object.keys(ITEMS).length})`, `<p class="sub">Khi một khách ruột kể hết câu chuyện đời mình (đủ 5 tim), họ sẽ trao cho Uyên một kỷ vật. Gom đủ kỷ vật của một vùng để nhận thưởng. Đủ tất cả các bộ... sẽ có người đặc biệt ghé thăm.</p>${sections}`, { panel: "collect" });
  },
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
// Danh sách món quán đang bán, kèm công thức từng bước
function sellingHtml(sh = shop()) {
  const L = LOCATIONS[sh.loc];
  return `<div class="grid menu-grid">${Object.keys(DRINKS).filter(id => drinkAvail(id, sh)).map(id => {
    const d = DRINKS[id], spec = L.specialty === id, power = sh === shop() && outageNow() && powerDrink(id);
    return `<div class="card menu-card ${power ? "locked" : ""}"><div class="row"><div class="menu-cup">${Art.drinkIcon(id)}</div><div style="flex:1"><h4>${d.name}${d.secret ? " 🌟" : ""}${d.only ? " 🏙️" : ""}</h4>
      <div class="sub"><b class="pos">${money(d.price * (spec ? 1.2 : 1))}</b> · ${d.hot ? "♨️ nóng" : "🧊 lạnh"}${spec ? ' · <span class="pill green">Đặc sản ' + L.city + "</span>" : ""}${power ? ' · <span class="pill red">⚡ Cúp điện</span>' : ""}</div></div></div>
      <ol class="steps">${d.recipe.map(k => `<li>${INGREDIENTS[k].icon} ${INGREDIENTS[k].name}</li>`).join("")}</ol></div>`;
  }).join("")}</div>`;
}
function buy(k, n, silent, sh = shop()) {
  const cost = ingPrice(k) * n;
  if (!canAfford(cost)) { if (!silent) toast("Không đủ tiền nhập hàng!", "bad"); return; }
  S.money -= cost; sh.inv[k] = (sh.inv[k] || 0) + n; R.today.purchases += cost;
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
function applySettings() {
  if (!S) return;
  Sound.setMusicVol(S.settings.musicOn ? S.settings.music : 0); Sound.setSfxVol(S.settings.sfx);
  Sound.setPreset(S.settings.musicPreset || "auto");
  if (Music.yt && Music.yt.setVolume) Music.yt.setVolume(Math.round(S.settings.music * 100));
  $("#btn-music").classList.toggle("off", !S.settings.musicOn);
  updateTv();
}
function startMusic() {
  Sound.init();
  if (Music.ytId || Music.suspended) return;
  if (!S || S.settings.musicOn) { Sound.start(); applySettings(); }
}

// ---------- TV: đổi nhạc & YouTube ----------
const Music = { yt: null, ytId: null, ytTitle: "", suspended: false, results: [] };
const YT_KEY = "chnu_ytkey";
const ytKey = () => { try { return localStorage.getItem(YT_KEY) || ""; } catch (e) { return ""; } };
function updateTv() {
  const tv = $("#tv"); if (!tv) return;
  const off = Music.suspended || (!Music.ytId && (!S || !S.settings.musicOn));
  tv.classList.toggle("off", off);
  tv.classList.toggle("yt", !!Music.ytId && !Music.suspended);
  const P = MUSIC_PRESETS[(S && S.settings.musicPreset) || "auto"];
  $("#tv-label").textContent = Music.suspended ? "" : Music.ytId ? "▶ " + Music.ytTitle : off ? "📺" : P.icon + " " + P.name;
}
function musicSuspend(on) {
  Music.suspended = on;
  if (on) { Sound.stop(); if (Music.yt && Music.yt.pauseVideo) Music.yt.pauseVideo(); }
  else if (Music.ytId && Music.yt && Music.yt.playVideo) Music.yt.playVideo();
  else if (S && S.settings.musicOn) startMusic();
  updateTv();
}
function loadYT(cb) {
  if (window.YT && window.YT.Player) return cb();
  const prev = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => { if (prev) prev(); cb(); };
  if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
    const sc = el("script"); sc.src = "https://www.youtube.com/iframe_api";
    sc.onerror = () => toast("Không tải được YouTube — kiểm tra kết nối mạng.", "bad");
    document.head.appendChild(sc);
  }
}
function ytIdFrom(text) {
  text = (text || "").trim();
  const m = text.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/);
  if (m) return m[1];
  return /^[\w-]{11}$/.test(text) ? text : null;
}
function playYT(id, title) {
  Music.ytId = id; Music.ytTitle = title || "YouTube";
  Sound.stop(); updateTv();
  loadYT(() => {
    if (!Music.yt) {
      Music.yt = new YT.Player("yt-player", {
        width: 160, height: 90, videoId: id,
        playerVars: { autoplay: 1, playsinline: 1, controls: 0, rel: 0, modestbranding: 1 },
        events: {
          onReady: e => { e.target.setVolume(Math.round(S.settings.music * 100)); if (!Music.suspended) e.target.playVideo(); },
          onStateChange: e => { if (e.data === 1 && Music.ytTitle === "Video YouTube") { const d = e.target.getVideoData(); if (d && d.title) { Music.ytTitle = d.title; updateTv(); } } },
          onError: e => { Music.lastErr = e.data; toast(`Video này không phát được trong game (mã ${e.data}), chọn video khác nhé.`, "bad"); stopYT(); },
        },
      });
    } else Music.yt.loadVideoById(id);
  });
  toast("📺 Đang phát: " + Music.ytTitle);
}
function stopYT() {
  if (Music.yt && Music.yt.stopVideo) Music.yt.stopVideo();
  Music.ytId = null; updateTv();
  if (S && S.settings.musicOn) startMusic();
}
async function searchYT(q) {
  const key = ytKey();
  if (!key) return null;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=9&q=${encodeURIComponent(q)}&key=${encodeURIComponent(key)}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("HTTP " + r.status);
  const j = await r.json();
  return (j.items || []).map(it => ({ id: it.id.videoId, title: it.snippet.title.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&"), ch: it.snippet.channelTitle, thumb: it.snippet.thumbnails.medium.url }));
}
function openTv() {
  if (!S || !["open", "prepare"].includes(R.phase)) return;
  if (R.qte || isPaused()) return;
  Sound.sfx("click"); closeDialog(); PANELS.music();
}

// ---------- Sự kiện giao diện ----------
function bindUI() {
  document.querySelectorAll("#dock-btns button").forEach(b => b.addEventListener("click", () => {
    if (!S || R.phase === "title" || R.phase === "tutorial") return;
    Sound.sfx("click"); closeDialog();
    const p = b.dataset.panel;
    if (R.phase === "report") return;
    khoTab = menuTab = staffTab = decorTab = S.active;
    PANELS[p]();
  }));
  $("#modal-close").onclick = () => { Sound.sfx("click"); closeModal(); if (R.phase === "prepare") showPrepare(); };
  $("#btn-serve").onclick = serve;
  $("#tv").addEventListener("click", openTv);
  $("#chapter-bar").addEventListener("click", () => { if (S && ["open", "prepare"].includes(R.phase) && !isPaused()) showChapterCard(S.story.chapter, false); });
  $("#menu-board").addEventListener("click", () => {
    if (!S || !["open", "prepare"].includes(R.phase) || isPaused()) return;
    Sound.sfx("click"); closeDialog(); PANELS.board();
  });
  $("#btn-dump").onclick = () => { if (!R.cup.length || isPaused()) return; R.cup = []; Sound.sfx("pour"); renderBench(); };
  $("#btn-undo").onclick = () => { if (!R.cup.length || isPaused()) return; R.cup.pop(); Sound.sfx("click"); renderBench(); };
  $("#btn-clean").onclick = () => {
    if (R.cleanCd || isPaused()) return;
    R.clean = clamp(R.clean + 40, 0, 100); R.cleanCd = true; $("#btn-clean").disabled = true; Sound.sfx("pop");
    setTimeout(() => { R.cleanCd = false; $("#btn-clean").disabled = false; }, 2000);
    renderHud();
  };
  $("#btn-pause").onclick = () => { if (R.phase !== "open") return; R.paused = !R.paused; setPauseUI(); };
  $("#pause-cover .btn").onclick = () => { R.paused = false; Sound.sfx("click"); setPauseUI(); };
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

// Hook kiểm thử: chỉ bật khi URL có ?debug
if (location.search.includes("debug")) window.__dbg = { get S() { return S; }, R, Music, prepareDay, showPrepare, checkChapter, startQte, spawnCustomer, PANELS, giveItem,
  clear() { R.customers.slice().forEach(c => removeCustomer(c)); closeDialog(); },
  spawnMulti(n) { for (let k = 0; k < 30; k++) { spawnCustomer(); const c = R.customers[R.customers.length - 1]; if (c && c.items.length >= n) return; if (c) removeCustomer(c); } },
  spawnReg(id) { const ch = CHARACTERS.find(c => c.id === id); const s0 = freeSlot(); if (s0 < 0) return; if (!S.chars[id]) S.chars[id] = { aff: 0, met: true, chatIdx: 0, story: 0, visits: 0 };
    const c = { reg: ch, name: ch.name, look: ch.look, drink: pickDrink(S.active, ch.fav), patF: 2, items: null, idx: 0, uid: ++R.uid, slot: s0, state: "walking", wait: 0, chatted: false, tipBonus: 0, maxOrder: 200, maxDrink: 300 };
    c.items = [c.drink]; c.pat = c.max = 200; mountCustomer(c, "💖 "); } };

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
