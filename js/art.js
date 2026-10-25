// ===== Đồ họa 2D vẽ bằng SVG =====
const Art = (() => {
  let uid = 0;
  const darken = (hex, amt = 0.2) => {
    const n = parseInt(hex.slice(1), 16);
    const f = c => Math.max(0, Math.min(255, Math.round(c * (1 - amt))));
    const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  };

  // ---- Tóc (lớp sau đầu) ----
  function hairBack(look) {
    const c = look.hc;
    switch (look.hair) {
      case "long": return `<path d="M24,66 Q22,28 60,28 Q98,28 96,66 L102,128 Q60,140 18,128Z" fill="${c}"/>`;
      case "bob":  return `<path d="M24,66 Q22,28 60,28 Q98,28 96,66 L98,100 Q60,108 22,100Z" fill="${c}"/>`;
      case "pony": return `<ellipse cx="98" cy="70" rx="12" ry="26" fill="${c}" transform="rotate(18 98 70)"/>`;
      case "bun":  return `<circle cx="60" cy="28" r="15" fill="${c}"/>`;
      default: return "";
    }
  }
  // ---- Tóc / mũ (lớp trước) ----
  function hairFront(look) {
    const c = look.hc, d = darken(c, 0.15);
    switch (look.hair) {
      case "short": return `<path d="M27,70 Q24,32 60,32 Q96,32 93,70 Q90,50 74,46 Q62,56 42,48 Q31,54 27,70Z" fill="${c}"/>`;
      case "side":  return `<path d="M27,72 Q24,30 62,32 Q96,34 93,70 Q88,48 70,44 Q48,58 27,72Z" fill="${c}"/><path d="M60,34 Q72,40 70,46" stroke="${d}" stroke-width="2" fill="none"/>`;
      case "long":
      case "bob":   return `<path d="M27,70 Q26,34 60,34 Q94,34 93,70 Q86,52 66,50 Q60,44 52,50 Q36,52 27,70Z" fill="${c}"/>`;
      case "pony":  return `<path d="M27,70 Q26,32 60,32 Q94,32 93,70 Q84,48 60,48 Q38,48 27,70Z" fill="${c}"/><circle cx="90" cy="52" r="5" fill="#ff4d8d"/>`;
      case "bun":   return `<path d="M28,70 Q26,36 60,36 Q94,36 92,70 Q86,52 60,50 Q34,52 28,70Z" fill="${c}"/>`;
      case "curly": return [[34,52],[44,40],[58,35],[72,38],[84,46],[90,58],[30,64]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="12" fill="${c}"/>`).join("");
      case "spiky": return `<path d="M26,70 L30,40 L38,48 L44,28 L52,44 L60,24 L68,42 L78,28 L82,46 L92,38 L94,70 Q80,52 60,52 Q40,52 26,70Z" fill="${c}"/>`;
      case "bald":  return look.age === "old" ? `<path d="M28,74 Q26,62 32,58" stroke="${c}" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M92,74 Q94,62 88,58" stroke="${c}" stroke-width="7" stroke-linecap="round" fill="none"/>` : "";
      case "cap":   return `<path d="M27,64 Q28,30 60,30 Q92,30 93,64Z" fill="${look.sc === "#ffffff" ? "#e63946" : look.hc}"/><path d="M60,62 Q90,56 112,64 Q92,70 60,66Z" fill="${darken(look.hc, 0.25)}"/>`;
      case "hardhat": return `<path d="M24,64 Q26,26 60,26 Q94,26 96,64Z" fill="#ffd60a"/><rect x="18" y="60" width="84" height="8" rx="4" fill="#f4b400"/><rect x="56" y="28" width="8" height="34" fill="#f4b400"/>`;
      case "beanie": return `<path d="M26,64 Q26,26 60,26 Q94,26 94,64Z" fill="#e76f51"/><rect x="24" y="56" width="72" height="12" rx="6" fill="#c4553d"/><circle cx="60" cy="22" r="7" fill="#f4a261"/>`;
      case "nonla": return `<path d="M60,70 Q28,64 26,74 Q22,62 32,60 Q46,58 60,60Z" fill="${c}"/><path d="M4,58 L60,12 L116,58 Q60,68 4,58Z" fill="#f1dca7"/><path d="M60,12 L36,58 M60,12 L84,58 M60,12 L60,62" stroke="#d4b97a" stroke-width="1.5"/><path d="M4,58 Q60,68 116,58" stroke="#c9a85e" stroke-width="2" fill="none"/>`;
      default: return "";
    }
  }

  function face(look, mood) {
    const old = look.age === "old";
    let eyes, mouth, brows = "";
    if (mood === "happy") {
      eyes = `<path d="M42,74 Q48,66 54,74" stroke="#2b1b12" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M66,74 Q72,66 78,74" stroke="#2b1b12" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
      mouth = `<path d="M50,88 Q60,100 70,88 Q60,92 50,88Z" fill="#c1121f"/>`;
    } else if (mood === "angry") {
      eyes = `<circle cx="48" cy="75" r="4" fill="#2b1b12"/><circle cx="72" cy="75" r="4" fill="#2b1b12"/>`;
      brows = `<path d="M40,64 L54,69" stroke="#2b1b12" stroke-width="3" stroke-linecap="round"/><path d="M80,64 L66,69" stroke="#2b1b12" stroke-width="3" stroke-linecap="round"/>`;
      mouth = `<path d="M50,94 Q60,86 70,94" stroke="#2b1b12" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    } else if (mood === "sad") {
      eyes = `<circle cx="48" cy="76" r="4" fill="#2b1b12"/><circle cx="72" cy="76" r="4" fill="#2b1b12"/>`;
      brows = `<path d="M41,68 L54,64" stroke="#2b1b12" stroke-width="2.5" stroke-linecap="round"/><path d="M79,68 L66,64" stroke="#2b1b12" stroke-width="2.5" stroke-linecap="round"/>`;
      mouth = `<path d="M52,92 Q60,88 68,92" stroke="#2b1b12" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    } else if (mood === "wow") {
      eyes = `<circle cx="48" cy="74" r="5" fill="#2b1b12"/><circle cx="72" cy="74" r="5" fill="#2b1b12"/><circle cx="50" cy="72" r="1.8" fill="#fff"/><circle cx="74" cy="72" r="1.8" fill="#fff"/>`;
      mouth = `<ellipse cx="60" cy="91" rx="5" ry="6" fill="#c1121f"/>`;
    } else {
      eyes = `<circle cx="48" cy="75" r="4.5" fill="#2b1b12"/><circle cx="72" cy="75" r="4.5" fill="#2b1b12"/><circle cx="49.5" cy="73.5" r="1.6" fill="#fff"/><circle cx="73.5" cy="73.5" r="1.6" fill="#fff"/>`;
      mouth = `<path d="M53,89 Q60,94 67,89" stroke="#2b1b12" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    }
    const wrinkle = old ? `<path d="M38,82 Q40,85 38,88 M82,82 Q80,85 82,88" stroke="${darken(look.skin, 0.25)}" stroke-width="1.5" fill="none"/>` : "";
    return brows + eyes + `<ellipse cx="40" cy="85" rx="6" ry="3.5" fill="#ff8fa3" opacity=".55"/><ellipse cx="80" cy="85" rx="6" ry="3.5" fill="#ff8fa3" opacity=".55"/>` + mouth + wrinkle;
  }

  function body(look) {
    const c = look.sc, d = darken(c, 0.18);
    const neck = `<rect x="52" y="98" width="16" height="16" fill="${darken(look.skin, 0.1)}"/>`;
    const base = `<path d="M22,180 Q20,126 40,114 Q60,108 80,114 Q100,126 98,180Z" fill="${c}"/>`;
    const arms = `<path d="M26,132 Q14,150 18,176" stroke="${d}" stroke-width="13" stroke-linecap="round" fill="none"/><path d="M94,132 Q106,150 102,176" stroke="${d}" stroke-width="13" stroke-linecap="round" fill="none"/>`;
    let extra = "";
    switch (look.shirt) {
      case "hoodie": extra = `<path d="M40,114 Q60,132 80,114" stroke="${d}" stroke-width="6" fill="none"/><line x1="54" y1="124" x2="52" y2="146" stroke="#fff" stroke-width="2"/><line x1="66" y1="124" x2="68" y2="146" stroke="#fff" stroke-width="2"/><rect x="44" y="150" width="32" height="14" rx="5" fill="${d}"/>`; break;
      case "tie":    extra = `<path d="M48,112 L60,124 L72,112" fill="#ffffff" stroke="#ddd"/><path d="M57,122 L63,122 L66,160 L60,168 L54,160Z" fill="#d62828"/>`; break;
      case "shirt":  extra = `<path d="M46,112 L60,128 L74,112" fill="none" stroke="${d}" stroke-width="3"/><circle cx="60" cy="140" r="2" fill="${d}"/><circle cx="60" cy="154" r="2" fill="${d}"/><rect x="70" y="134" width="12" height="10" rx="2" fill="${d}"/>`; break;
      case "blouse": extra = `<path d="M44,114 Q60,126 76,114" fill="none" stroke="#fff" stroke-width="4"/><circle cx="60" cy="136" r="2.5" fill="#fff"/>`; break;
      case "flannel":extra = [126,140,154,168].map(y => `<line x1="24" y1="${y}" x2="96" y2="${y}" stroke="#2b1b12" stroke-width="2" opacity=".35"/>`).join("") + [40,60,80].map(x => `<line x1="${x}" y1="114" x2="${x}" y2="180" stroke="#2b1b12" stroke-width="2" opacity=".35"/>`).join(""); break;
      case "hawaii": extra = [[38,132],[70,128],[52,152],[84,156],[34,166]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#ffd166"/><circle cx="${x}" cy="${y}" r="2" fill="#ef476f"/>`).join(""); break;
      case "tank":   extra = `<path d="M42,114 Q60,140 78,114" fill="${look.skin}"/>`; break;
      case "aodai":  extra = `<rect x="50" y="104" width="20" height="12" rx="3" fill="${c}"/><path d="M60,116 Q74,124 78,140" stroke="#ffd166" stroke-width="2.5" fill="none"/><circle cx="70" cy="122" r="1.6" fill="#ffd166"/><circle cx="76" cy="132" r="1.6" fill="#ffd166"/>`; break;
      case "apron":  extra = `<path d="M38,124 L82,124 L86,180 L34,180Z" fill="#fff8e7"/><path d="M42,124 Q60,104 78,124" stroke="#fff8e7" stroke-width="3" fill="none"/><rect x="50" y="146" width="20" height="12" rx="3" fill="#f4a261"/><text x="60" y="140" font-size="10" text-anchor="middle" fill="#e07a5f">♥</text>`; break;
      default:       extra = `<path d="M46,114 Q60,124 74,114" fill="none" stroke="${d}" stroke-width="4"/>`;
    }
    return neck + base + arms + extra;
  }

  function accessories(look, layer) {
    const out = [];
    for (const a of look.acc || []) {
      if (layer === "front") {
        if (a === "glasses") out.push(`<g fill="none" stroke="#2b1b12" stroke-width="2.5"><circle cx="48" cy="75" r="9"/><circle cx="72" cy="75" r="9"/><line x1="57" y1="75" x2="63" y2="75"/></g>`);
        if (a === "sunglasses") out.push(`<g fill="#1a1a2e"><rect x="37" y="68" width="21" height="13" rx="5"/><rect x="62" y="68" width="21" height="13" rx="5"/></g><line x1="58" y1="73" x2="62" y2="73" stroke="#1a1a2e" stroke-width="3"/><rect x="40" y="70" width="6" height="3" rx="1.5" fill="#fff" opacity=".5"/>`);
        if (a === "mustache") out.push(`<path d="M48,86 Q54,80 60,85 Q66,80 72,86 Q66,90 60,87 Q54,90 48,86Z" fill="${look.hc}"/>`);
        if (a === "beard") out.push(`<path d="M34,82 Q36,112 60,114 Q84,112 86,82 Q80,98 60,99 Q40,98 34,82Z" fill="${look.hc}" opacity=".95"/>`);
        if (a === "earrings") out.push(`<circle cx="28" cy="86" r="3.5" fill="#ffd60a"/><circle cx="92" cy="86" r="3.5" fill="#ffd60a"/>`);
        if (a === "beret") out.push(`<ellipse cx="56" cy="36" rx="32" ry="12" fill="#3a0ca3" transform="rotate(-10 56 36)"/><circle cx="56" cy="24" r="3" fill="#3a0ca3"/>`);
        if (a === "headphones") out.push(`<path d="M26,70 Q26,24 60,24 Q94,24 94,70" stroke="#222" stroke-width="5" fill="none"/><rect x="18" y="62" width="12" height="20" rx="5" fill="#ef476f"/><rect x="90" y="62" width="12" height="20" rx="5" fill="#ef476f"/>`);
        if (a === "scarf") out.push(`<path d="M36,108 Q60,122 84,108 L86,118 Q60,132 34,118Z" fill="#ffb703"/><rect x="66" y="116" width="10" height="26" rx="3" fill="#fb8500"/>`);
        if (a === "camera") out.push(`<line x1="40" y1="114" x2="74" y2="150" stroke="#333" stroke-width="2"/><rect x="62" y="142" width="26" height="18" rx="3" fill="#333"/><circle cx="75" cy="151" r="6" fill="#8ecae6" stroke="#111" stroke-width="2"/>`);
      }
    }
    return out.join("");
  }

  function person(look, mood = "neutral", cls = "") {
    const skin = look.skin;
    return `<svg class="person ${cls}" viewBox="0 0 120 180" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="178" rx="38" ry="5" fill="#000" opacity=".12"/>
      ${body(look)}
      ${hairBack(look)}
      <circle cx="28" cy="78" r="7" fill="${skin}"/><circle cx="92" cy="78" r="7" fill="${skin}"/>
      <ellipse cx="60" cy="72" rx="33" ry="32" fill="${skin}"/>
      ${face(look, mood)}
      ${hairFront(look)}
      ${accessories(look, "front")}
    </svg>`;
  }

  // Bảo Uyên — nhân vật chính
  const UYEN = { g: "f", age: "young", skin: "#fde0c5", hair: "long", hc: "#3b2314", shirt: "apron", sc: "#e07a5f", acc: ["earrings"] };
  const NGOAI = { g: "f", age: "old", skin: "#f1c9a5", hair: "bun", hc: "#e6e6e6", shirt: "aodai", sc: "#8e7dbe", acc: [] };

  // ---- Ly nước ----
  function cup(items, opts = {}) {
    const id = "cg" + (++uid);
    const hot = opts.hot;
    const layers = items.filter(k => !["da", "foam", "tran_chau", "trung", "muoi", "cacao", "nuoc_nong", "duong"].includes(k));
    const has = k => items.includes(k);
    const H = 130, top = 40, bottom = 170;
    let y = bottom, rects = "";
    const total = Math.max(layers.length, 1);
    const fillTop = top + 30 - Math.min(items.length, 5) * 4;
    const per = (bottom - fillTop) / total;
    if (layers.length) {
      layers.forEach((k, i) => {
        const h = per;
        y -= h;
        const col = INGREDIENTS[k].color;
        rects += `<rect x="0" y="${y}" width="200" height="${h + 1}" fill="${col}"/>`;
        if (i > 0) rects += `<rect x="0" y="${y + h - 4}" width="200" height="8" fill="${col}" opacity=".5"/>`;
      });
    } else if (has("nuoc_nong")) {
      rects += `<rect x="0" y="120" width="200" height="60" fill="#d8e9f0" opacity=".7"/>`; y = 120;
    }
    if (has("nuoc_nong") && layers.length) rects += `<rect x="0" y="${y}" width="200" height="${bottom - y}" fill="#fff" opacity=".12"/>`;
    let extras = "";
    if (has("tran_chau")) for (let i = 0; i < 9; i++) extras += `<circle cx="${62 + (i * 13) % 76}" cy="${160 - (i % 3) * 7}" r="5" fill="#2d1b10"/>`;
    if (has("da")) [[70, y + 12], [100, y + 22], [118, y + 8], [84, y + 34]].forEach(([x, yy]) => {
      if (yy < bottom - 10) extras += `<rect x="${x}" y="${yy}" width="20" height="18" rx="4" fill="#fff" opacity=".6" transform="rotate(${(x % 30) - 15} ${x + 10} ${yy + 9})"/>`;
    });
    if (has("trung")) { extras += `<rect x="0" y="${y - 18}" width="200" height="22" fill="#f7d774"/>`; y -= 18; }
    if (has("muoi")) { extras += `<rect x="0" y="${y - 14}" width="200" height="16" fill="#fff6e6"/>`; y -= 14; }
    if (has("foam")) { extras += `<rect x="0" y="${y - 16}" width="200" height="18" fill="#fffdf8"/><path d="M80,${y - 8} q20,-10 40,0" stroke="#e8d5c0" stroke-width="3" fill="none"/>`; y -= 16; }
    if (has("cacao") && (has("foam") || has("trung"))) for (let i = 0; i < 14; i++) extras += `<circle cx="${60 + (i * 37) % 80}" cy="${y + 3 + (i % 3) * 3}" r="1.6" fill="#6b3a1e"/>`;
    if (has("duong")) extras += `<g opacity=".8">${[0,1,2,3,4].map(i => `<circle cx="${70 + i * 14}" cy="${bottom - 6 - (i % 2) * 4}" r="2" fill="#fff"/>`).join("")}</g>`;
    if (has("chanh")) extras += `<circle cx="132" cy="${Math.max(y, 50)}" r="14" fill="#f5e663" stroke="#d4c33a" stroke-width="3"/><path d="M132,${Math.max(y, 50) - 12} v24 M120,${Math.max(y, 50)} h24" stroke="#d4c33a" stroke-width="1.5"/>`;
    if (has("sa")) extras += `<path d="M110,${y - 24} L120,${y + 30}" stroke="#7fb347" stroke-width="5" stroke-linecap="round"/>`;
    if (has("dau")) extras += `<path d="M64,${Math.max(y, 54) - 6} q10,-4 16,6 q-6,14 -16,10 q-8,-8 0,-16z" fill="#ff4d6d"/>`;
    const steam = hot && items.length ? `<g class="steam" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"><path d="M80,30 q-8,-10 0,-20 q8,-10 0,-20"/><path d="M100,32 q-8,-10 0,-20 q8,-10 0,-20"/><path d="M120,30 q-8,-10 0,-20 q8,-10 0,-20"/></g>` : "";
    const straw = !hot && items.length ? `<rect x="112" y="6" width="9" height="100" rx="4" fill="${opts.straw || "#ef476f"}" transform="rotate(12 116 56)"/>` : "";
    return `<svg class="cup-svg" viewBox="0 -30 200 210" xmlns="http://www.w3.org/2000/svg">
      <defs><clipPath id="${id}"><path d="M52,40 L148,40 L138,170 Q100,178 62,170Z"/></clipPath></defs>
      ${steam}${straw}
      <ellipse cx="100" cy="176" rx="56" ry="6" fill="#000" opacity=".12"/>
      <path d="M52,40 L148,40 L138,170 Q100,178 62,170Z" fill="#ffffff" opacity=".55"/>
      <g clip-path="url(#${id})">${rects}${extras}</g>
      <path d="M52,40 L148,40 L138,170 Q100,178 62,170Z" fill="none" stroke="#5c4b51" stroke-width="4" stroke-linejoin="round"/>
      <path d="M62,52 L58,150" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>
      ${hot ? `<path d="M146,70 q30,0 26,34 q-4,26 -32,26" stroke="#5c4b51" stroke-width="7" fill="none"/>` : ""}
      ${opts.phin ? `<g class="phin-drip"><rect x="62" y="-4" width="76" height="34" rx="6" fill="#b0b7bf" stroke="#6c757d" stroke-width="3"/><rect x="54" y="26" width="92" height="7" rx="3" fill="#8d959e"/><rect x="90" y="-18" width="20" height="14" rx="3" fill="#8d959e"/><circle class="drop" cx="100" cy="38" r="4" fill="#3b2314"/></g>` : ""}
    </svg>`;
  }

  // ---- Bối cảnh từng thành phố (nhìn qua cửa sổ) ----
  function windowView(loc) {
    switch (loc) {
      case "hanoi": return `
        <rect width="300" height="200" fill="#a8dadc"/>
        <circle cx="240" cy="40" r="22" fill="#ffd166"/>
        <rect x="0" y="80" width="80" height="120" fill="#f4d58d"/><path d="M-6,84 L40,52 L86,84Z" fill="#9c6644"/>
        <rect x="90" y="96" width="70" height="104" fill="#e9c46a"/><path d="M84,100 L125,70 L166,100Z" fill="#7f4f24"/>
        <rect x="170" y="72" width="80" height="128" fill="#f6bd60"/><path d="M164,76 L210,46 L256,76Z" fill="#9c6644"/>
        <rect x="256" y="104" width="60" height="96" fill="#f7ede2"/>
        ${[[14,110],[44,110],[104,120],[184,100],[216,100],[184,140],[216,140]].map(([x,y]) => `<rect x="${x}" y="${y}" width="20" height="24" fill="#386641"/>`).join("")}
        <path d="M0,60 Q75,74 150,58 T300,62" stroke="#333" stroke-width="1.5" fill="none"/><path d="M0,66 Q90,86 180,64 T300,70" stroke="#333" stroke-width="1.5" fill="none"/>
        <circle cx="60" cy="168" r="18" fill="#6a994e"/><rect x="58" y="168" width="5" height="32" fill="#7f4f24"/>`;
      case "saigon": return `
        <rect width="300" height="200" fill="#bde0fe"/>
        <circle cx="60" cy="40" r="20" fill="#ffd166"/>
        <rect x="20" y="70" width="40" height="130" fill="#8ecae6"/><rect x="70" y="30" width="50" height="170" fill="#219ebc"/>
        <path d="M150,200 L150,40 L170,12 L190,40 L190,200Z" fill="#023047"/>
        <rect x="200" y="60" width="44" height="140" fill="#457b9d"/><rect x="250" y="90" width="50" height="110" fill="#a8dadc"/>
        ${Array.from({length: 24}, (_, i) => `<rect x="${76 + (i % 4) * 11}" y="${40 + Math.floor(i / 4) * 24}" width="6" height="12" fill="#fff" opacity=".6"/>`).join("")}
        <rect x="0" y="176" width="300" height="24" fill="#6c757d"/>
        <g><circle cx="80" cy="186" r="6" fill="#222"/><circle cx="104" cy="186" r="6" fill="#222"/><rect x="78" y="172" width="30" height="10" rx="4" fill="#e63946"/></g>`;
      case "dalat": return `
        <rect width="300" height="200" fill="#dbe7f1"/>
        <path d="M0,120 Q60,70 130,110 T300,90 L300,200 L0,200Z" fill="#a3b18a"/>
        <path d="M0,150 Q80,110 160,150 T300,140 L300,200 L0,200Z" fill="#588157"/>
        ${[[30,130],[70,120],[200,110],[240,124],[270,116],[140,140]].map(([x,y]) => `<path d="M${x},${y} l14,40 h-28z M${x},${y + 14} l18,44 h-36z" fill="#344e41"/>`).join("")}
        <rect x="0" y="40" width="300" height="30" fill="#fff" opacity=".45"/><rect x="40" y="86" width="260" height="20" fill="#fff" opacity=".35"/>
        <rect x="180" y="150" width="50" height="34" fill="#f4acb7"/><path d="M174,152 L205,130 L236,152Z" fill="#9d8189"/>`;
      case "hoian": return `
        <rect width="300" height="200" fill="#2b2d42"/>
        <circle cx="250" cy="34" r="16" fill="#fefae0"/>
        <rect x="0" y="80" width="300" height="120" fill="#ffd166"/>
        <path d="M-10,84 L150,60 L310,84Z" fill="#9c6644"/>
        ${[[30,100],[110,100],[190,100],[260,100]].map(([x,y]) => `<rect x="${x}" y="${y}" width="30" height="40" fill="#5c3d2e"/>`).join("")}
        <path d="M0,40 Q150,70 300,40" stroke="#333" stroke-width="1.5" fill="none"/>
        ${[[40,"#e63946"],[90,"#f77f00"],[140,"#fcbf49"],[190,"#e63946"],[240,"#06d6a0"]].map(([x,c], i) => `<g class="lantern" style="animation-delay:${i * 0.3}s"><line x1="${x}" y1="${44 + i % 2 * 4}" x2="${x}" y2="${56 + i % 2 * 4}" stroke="#333"/><ellipse cx="${x}" cy="${68 + i % 2 * 4}" rx="11" ry="14" fill="${c}"/><ellipse cx="${x}" cy="${68 + i % 2 * 4}" rx="16" ry="18" fill="${c}" opacity=".25"/></g>`).join("")}
        <rect x="0" y="170" width="300" height="30" fill="#264653"/><path d="M60,176 h50 l-8,10 h-34z" fill="#9c6644"/>`;
      case "danang": return `
        <rect width="300" height="200" fill="#90e0ef"/>
        <circle cx="70" cy="44" r="22" fill="#ffd166"/>
        <rect x="0" y="100" width="300" height="60" fill="#0096c7"/>
        <path d="M0,112 q25,-8 50,0 t50,0 t50,0 t50,0 t50,0 t50,0" stroke="#fff" stroke-width="3" fill="none" class="wave"/>
        <path d="M120,96 q20,-30 40,0 q20,-30 40,0 q20,-30 40,0" stroke="#ffd60a" stroke-width="6" fill="none"/>
        <rect x="0" y="150" width="300" height="50" fill="#f4e1a1"/>
        <g><rect x="40" y="130" width="4" height="40" fill="#7f4f24"/><path d="M42,128 q-30,0 -30,10 q30,-6 30,-10 q30,0 30,10 q-30,-6 -30,-10" fill="#2a9d8f"/></g>
        <path d="M200,160 l20,-24 l20,24z" fill="#ef476f"/><rect x="218" y="160" width="4" height="20" fill="#555"/>`;
      case "hue": return `
        <rect width="300" height="200" fill="#e0c3fc"/>
        <circle cx="230" cy="44" r="18" fill="#fff1e6"/>
        <rect x="0" y="130" width="300" height="70" fill="#8ecae6"/>
        <path d="M0,140 q40,-6 80,0 t80,0 t80,0 t80,0" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/>
        <rect x="70" y="70" width="130" height="60" fill="#c9a227"/><path d="M60,74 L135,42 L210,74Z" fill="#9b2226"/><path d="M80,56 L135,30 L190,56Z" fill="#ae2012"/>
        <rect x="118" y="92" width="34" height="38" rx="16" fill="#5c3d2e"/>
        <path d="M30,166 h70 l-10,12 h-50z" fill="#9b2226"/><path d="M40,166 q25,-22 50,0" fill="#ffd166"/>`;
    }
    return "";
  }

  function sceneBg(locId, decor, extra = 0, shelf = []) {
    const L = LOCATIONS[locId];
    const wall = L.wall, acc = L.accent;
    const plant = decor.cay_xanh ? `
      <g><rect x="40" y="250" width="44" height="40" rx="6" fill="#e07a5f"/><circle cx="62" cy="230" r="28" fill="#52b788"/><circle cx="44" cy="222" r="16" fill="#40916c"/><circle cx="80" cy="218" r="16" fill="#74c69d"/></g>
      <g><rect x="920" y="250" width="44" height="40" rx="6" fill="#f4a261"/><circle cx="942" cy="234" r="22" fill="#52b788"/><circle cx="930" cy="214" r="6" fill="#ff8fa3"/><circle cx="952" cy="208" r="6" fill="#ffd166"/></g>` : "";
    const neon = decor.bien_neon ? `<text x="500" y="44" text-anchor="middle" class="neon" font-size="30" font-family="Baloo 2, cursive" font-weight="800" fill="#fff" stroke="${acc}" stroke-width="1.5">☕ Cửa hàng nhỏ của Uyên</text>` :
      `<rect x="370" y="14" width="260" height="40" rx="10" fill="#fff8e7" stroke="${acc}" stroke-width="3"/><text x="500" y="42" text-anchor="middle" font-size="22" font-family="Baloo 2, cursive" font-weight="800" fill="${acc}">Cửa hàng nhỏ của Uyên</text>`;
    // Tranh tường (trang trí) treo bên trái cửa sổ; góc phải dành cho TV
    const art = decor.tranh ? `<g><rect x="196" y="140" width="92" height="74" rx="6" fill="#fff" stroke="#9c6644" stroke-width="5"/><circle cx="224" cy="166" r="12" fill="#ffd166"/><path d="M204,206 l24,-24 l16,16 l16,-20 l20,28z" fill="${acc}"/></g>` : "";
    const ac = decor.may_lanh ? `<g><rect x="80" y="70" width="110" height="34" rx="8" fill="#f8f9fa" stroke="#adb5bd" stroke-width="2"/><rect x="92" y="94" width="86" height="4" fill="#ced4da"/><circle cx="178" cy="80" r="3" fill="#06d6a0"/></g>` : "";
    const speaker = decor.loa_jazz ? `<g><rect x="230" y="150" width="40" height="60" rx="6" fill="#343a40"/><circle cx="250" cy="170" r="10" fill="#6c757d"/><circle cx="250" cy="196" r="6" fill="#6c757d"/><text x="282" y="160" font-size="20" class="note">♪</text></g>` : "";
    const menu = `<g><rect x="600" y="76" width="150" height="120" rx="8" fill="#2d3a3a" stroke="#9c6644" stroke-width="6"/><text x="675" y="100" text-anchor="middle" fill="#ffd166" font-size="16" font-family="Baloo 2" font-weight="700">THỰC ĐƠN</text>${[0,1,2,3,4].map(i => `<rect x="616" y="${112 + i * 15}" width="${60 + (i * 23) % 50}" height="5" rx="2" fill="#fff" opacity=".7"/><rect x="718" y="${112 + i * 15}" width="18" height="5" rx="2" fill="#ffd166" opacity=".8"/>`).join("")}</g>`;
    return `<svg class="scene-bg" viewBox="0 0 1000 ${570 + extra}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs><clipPath id="win-clip"><rect x="300" y="70" width="280" height="180" rx="10"/></clipPath>
        <pattern id="tiles" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#f2e2c4"/><rect width="20" height="20" fill="#e8d3ad"/><rect x="20" y="20" width="20" height="20" fill="#e8d3ad"/></pattern>
        <pattern id="stripes" width="30" height="30" patternUnits="userSpaceOnUse"><rect width="30" height="30" fill="${wall}"/><rect width="15" height="30" fill="#fff" opacity=".18"/></pattern></defs>
      <rect width="1000" height="${570 + extra}" fill="url(#stripes)"/>
      <rect y="${300 + extra}" width="1000" height="270" fill="url(#tiles)"/>
      <rect y="${294 + extra}" width="1000" height="10" fill="${acc}" opacity=".6"/>
      ${extra > 40 ? bunting(extra, acc) : ""}
      <g transform="translate(0 ${20 + extra})">
      ${neon}
      <g clip-path="url(#win-clip)"><g transform="translate(300 70) scale(0.934 0.9)">${windowView(locId)}</g></g>
      <rect x="300" y="70" width="280" height="180" rx="10" fill="none" stroke="#9c6644" stroke-width="10"/>
      <line x1="440" y1="70" x2="440" y2="250" stroke="#9c6644" stroke-width="6"/>
      <path d="M290,70 Q310,110 300,150 L290,150Z" fill="${acc}" opacity=".85"/><path d="M590,70 Q570,110 580,150 L590,150Z" fill="${acc}" opacity=".85"/>
      ${menu}${art}${ac}${speaker}
      ${shelfSvg(shelf)}
      <g class="lamp"><line x1="250" y1="-400" x2="250" y2="50" stroke="#333" stroke-width="2"/><path d="M230,50 h40 l10,22 h-60z" fill="#ffd166"/><ellipse cx="250" cy="74" rx="40" ry="8" fill="#fff3b0" opacity=".5"/></g>
      <g class="lamp"><line x1="960" y1="-400" x2="960" y2="40" stroke="#333" stroke-width="2"/><path d="M940,40 h40 l10,22 h-60z" fill="#ffd166"/></g>
      ${plant}
      </g>
    </svg>`;
  }

  // Kệ tường: sách trang trí, hoặc kỷ vật khách ruột tặng (tối đa 2 tầng × 6 món)
  function shelfSvg(items) {
    const plank = y => `<rect x="40" y="${y}" width="170" height="10" rx="3" fill="#9c6644"/><rect x="48" y="${y + 10}" width="6" height="10" fill="#7f5539"/><rect x="196" y="${y + 10}" width="6" height="10" fill="#7f5539"/>`;
    if (!items.length) return `<g>${plank(120)}${[0,1,2,3].map(i => `<rect x="${52 + i * 36}" y="${92 + (i % 2) * 6}" width="22" height="${28 - (i % 2) * 6}" rx="4" fill="${["#e07a5f","#81b29a","#f2cc8f","#3d405b"][i]}"/>`).join("")}</g>`;
    const row = (arr, y) => arr.map((it, k) => `<text x="${58 + k * 28}" y="${y - 4}" font-size="24" text-anchor="middle" class="shelf-item"><title>${it.name}</title>${it.icon}</text>`).join("");
    return `<g>${plank(120)}${row(items.slice(0, 6), 120)}${items.length > 6 ? plank(66) + row(items.slice(6, 12), 66) : ""}</g>`;
  }

  // Dây đèn và cờ trang trí cho phần tường cao hơn (màn hình iPad)
  function bunting(extra, acc) {
    const y = Math.min(extra * 0.45, 70);
    const cols = ["#ef476f", "#ffd166", "#06d6a0", "#118ab2", acc];
    let g = `<path d="M0,${y} Q250,${y + 40} 500,${y} T1000,${y}" stroke="#7f5539" stroke-width="2" fill="none"/>`;
    for (let i = 0; i < 20; i++) {
      const x = 25 + i * 50, yy = y + Math.sin((x / 1000) * Math.PI * 2) * 18 + 6;
      g += i % 2 ? `<circle cx="${x}" cy="${yy + 4}" r="7" fill="#fff3b0" class="bulb" style="animation-delay:${i * 0.15}s"/>` : `<path d="M${x - 12},${yy} h24 l-12,22z" fill="${cols[i / 2 % cols.length]}"/>`;
    }
    return g;
  }

  function counter(locId) {
    const acc = LOCATIONS[locId].accent;
    return `<svg class="counter-svg" viewBox="0 0 1000 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="1000" height="18" rx="6" fill="#7f5539"/>
      <rect x="0" y="16" width="1000" height="104" fill="#b08968"/>
      ${Array.from({length: 13}, (_, i) => `<rect x="${i * 80 + 6}" y="26" width="68" height="84" rx="6" fill="#9c6644" opacity=".45"/>`).join("")}
      <rect x="0" y="16" width="1000" height="10" fill="${acc}" opacity=".7"/>
      <g transform="translate(860 -46)"><rect width="80" height="48" rx="8" fill="#495057"/><rect x="8" y="8" width="64" height="20" rx="4" fill="#80ed99"/><rect x="10" y="34" width="60" height="8" rx="3" fill="#adb5bd"/></g>
      <g transform="translate(60 -40)"><rect width="22" height="40" rx="6" fill="#adb5bd"/><rect x="28" y="10" width="22" height="30" rx="6" fill="#ced4da"/><rect x="56" y="4" width="30" height="36" rx="8" fill="#ffe8d6"/></g>
    </svg>`;
  }

  function drinkIcon(id) {
    const d = DRINKS[id];
    return cup(d.recipe, { hot: d.hot });
  }

  return { person, cup, sceneBg, counter, drinkIcon, UYEN, NGOAI, darken };
})();
