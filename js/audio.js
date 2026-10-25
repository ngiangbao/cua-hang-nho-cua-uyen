// ===== Nhạc jazz nhẹ & hiệu ứng âm thanh (tạo bằng Web Audio, không cần file nhạc) =====
const Sound = (() => {
  let ctx = null, master, musicBus, sfxBus, reverb;
  let playing = false, timer = null;
  let tempo = 92, key = 5; // key: số nửa cung so với C
  let nextTime = 0, beat = 0;
  let musicVol = 0.5, sfxVol = 0.6;

  // Vòng hòa âm ii-V-I kiểu jazz (bậc so với chủ âm, các nốt trong hợp âm)
  const PROG = [
    [0, [0, 4, 7, 11]], [9, [0, 3, 7, 10]], [2, [0, 3, 7, 10]], [7, [0, 4, 7, 10]],
    [4, [0, 3, 7, 10]], [9, [0, 4, 7, 10]], [2, [0, 3, 7, 10]], [7, [0, 4, 7, 10]],
    [5, [0, 4, 7, 11]], [5, [0, 3, 7, 9]], [4, [0, 3, 7, 10]], [9, [0, 4, 7, 10]],
    [2, [0, 3, 7, 10]], [7, [0, 4, 7, 10]], [0, [0, 4, 7, 11]], [7, [0, 4, 7, 10]],
  ];
  const SCALE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 15]; // ngũ cung + nốt blue
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.gain.value = musicVol * 0.5;
    sfxBus = ctx.createGain(); sfxBus.gain.value = sfxVol;
    // Reverb nhẹ cho cảm giác phòng nhỏ
    reverb = ctx.createConvolver();
    const len = ctx.sampleRate * 1.8, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = buf.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    reverb.buffer = buf;
    const wet = ctx.createGain(); wet.gain.value = 0.22;
    musicBus.connect(master); musicBus.connect(reverb); reverb.connect(wet); wet.connect(master);
    sfxBus.connect(master);
  }

  let noiseBuf = null;
  function noise() {
    if (!noiseBuf) { noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    const s = ctx.createBufferSource(); s.buffer = noiseBuf; return s;
  }

  // ---- Nhạc cụ ----
  function epiano(midi, t, dur, vel = 0.12) {
    const f = mtof(midi);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vel, t + 0.01); g.gain.exponentialRampToValueAtTime(vel * 0.3, t + 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2200;
    const o1 = ctx.createOscillator(); o1.type = "sine"; o1.frequency.value = f;
    const o2 = ctx.createOscillator(); o2.type = "triangle"; o2.frequency.value = f * 2.001;
    const g2 = ctx.createGain(); g2.gain.value = 0.18;
    o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(lp); lp.connect(musicBus);
    o1.start(t); o2.start(t); o1.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
  }
  function bass(midi, t, dur) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.32, t + 0.012); g.gain.exponentialRampToValueAtTime(0.06, t + dur * 0.9); g.gain.linearRampToValueAtTime(0, t + dur);
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 700;
    const o = ctx.createOscillator(); o.type = "triangle"; o.frequency.value = mtof(midi);
    o.connect(lp); lp.connect(g); g.connect(musicBus); o.start(t); o.stop(t + dur + 0.02);
  }
  function vibes(midi, t, vel = 0.08) {
    const f = mtof(midi), dur = 1.4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vel, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const trem = ctx.createGain(); trem.gain.value = 1;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 5.5; const lg = ctx.createGain(); lg.gain.value = 0.25; lfo.connect(lg); lg.connect(trem.gain);
    const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = f;
    const o2 = ctx.createOscillator(); o2.type = "sine"; o2.frequency.value = f * 4; const g2 = ctx.createGain(); g2.gain.value = 0.08;
    o.connect(trem); o2.connect(g2); g2.connect(trem); trem.connect(g); g.connect(musicBus);
    [o, o2, lfo].forEach(x => { x.start(t); x.stop(t + dur); });
  }
  function ride(t, vel = 0.05) {
    const n = noise(), hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 7000;
    const g = ctx.createGain(); g.gain.setValueAtTime(vel, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    n.connect(hp); hp.connect(g); g.connect(musicBus); n.start(t); n.stop(t + 0.3);
  }
  function brush(t, vel = 0.06) {
    const n = noise(), bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 2500; bp.Q.value = 0.6;
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vel, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    n.connect(bp); bp.connect(g); g.connect(musicBus); n.start(t); n.stop(t + 0.3);
  }
  function kick(t) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    o.connect(g); g.connect(musicBus); o.start(t); o.stop(t + 0.22);
  }

  // ---- Bộ xếp lịch phát nhạc ----
  let melodyOn = false, lastMel = 72, style = "swing", preset = "auto", locTempo = 92, locKey = 5;
  function rim(t, vel = 0.05) {
    const n = noise(), bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1800; bp.Q.value = 4;
    const g = ctx.createGain(); g.gain.setValueAtTime(vel, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    n.connect(bp); bp.connect(g); g.connect(musicBus); n.start(t); n.stop(t + 0.08);
  }
  function crackle(t, dur) {
    for (let i = 0; i < 6; i++) if (Math.random() < 0.6) {
      const n = noise(), hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 3000;
      const g = ctx.createGain(), tt = t + Math.random() * dur; g.gain.setValueAtTime(0.02 * Math.random(), tt); g.gain.exponentialRampToValueAtTime(0.0001, tt + 0.01);
      n.connect(hp); hp.connect(g); g.connect(musicBus); n.start(tt); n.stop(tt + 0.02);
    }
  }
  function melody(t, offs, prob, vel) {
    offs.forEach(off => {
      if (Math.random() < prob) {
        const base = 67 + key;
        const cands = SCALE.map(s => base + s).filter(m => Math.abs(m - lastMel) <= 5);
        const m = cands.length ? cands[Math.floor(Math.random() * cands.length)] : base;
        lastMel = m; vibes(m, t + off, vel);
      }
    });
  }
  function scheduleBeat(t) {
    const spb = 60 / tempo;
    const bar = Math.floor(beat / 4), b = beat % 4;
    const [deg, chord] = PROG[bar % PROG.length];
    const [nDeg] = PROG[(bar + 1) % PROG.length];
    const root = 36 + key + deg;
    const voicing = [chord[1], chord[3], chord[2] + 12, 14].map(x => 52 + key + deg + x).map(m => m > 76 ? m - 12 : m);
    if (b === 0 && bar % 2 === 0) melodyOn = Math.random() < 0.7;

    if (style === "bossa") {
      // Bass bossa: gốc - quãng năm, nhịp thẳng
      const half = spb / 2;
      if (b === 0 || b === 2) bass(root, t, spb * 1.2);
      if (b === 1 || b === 3) bass(root + 7, t + half, spb * 0.9);
      [0, half].forEach(o => ride(t + o, 0.018));
      if ([0, 3].includes(b)) rim(t + (b === 3 ? half : 0), 0.06);
      if (b === 1 || b === 2) rim(t + (b === 1 ? half : 0), 0.05);
      if (b === 0) [0, spb * 1.5, spb * 2.5].forEach(o => voicing.forEach(m => epiano(m, t + o, spb * 0.9, 0.04)));
      if (melodyOn) melody(t, [0, half], 0.4, 0.06);
    } else if (style === "lofi") {
      const swing = spb * 0.6;
      if (b === 0) { kick(t); voicing.forEach(m => epiano(m - 12 + 12, t, spb * 3.8, 0.05)); bass(root, t, spb * 1.8); }
      if (b === 2) { kick(t + swing); bass(root + chord[2], t, spb * 1.6); }
      if (b === 1 || b === 3) brush(t, 0.09);
      [0, swing].forEach(o => ride(t + o, 0.012));
      crackle(t, spb);
      if (melodyOn) melody(t, [0, swing], 0.3, 0.05);
    } else if (style === "ballad") {
      const half = spb / 2;
      if (b === 0) bass(root, t, spb * 3.8);
      [0, half].forEach((o, i) => { const v = voicing[(b * 2 + i) % voicing.length]; epiano(v, t + o, spb * 1.6, 0.05); });
      if (b === 0) ride(t, 0.02);
      if (melodyOn && b % 2 === 0) melody(t, [0], 0.6, 0.06);
    } else {
      // Swing: walking bass, ride "ding ding-a ding", chổi ở phách 2 và 4
      const swing = spb * 0.66;
      let bn;
      if (b === 0) bn = root;
      else if (b === 3) { const nr = 36 + key + nDeg; bn = nr + (Math.random() < 0.5 ? 1 : -1); }
      else bn = root + chord[Math.random() < 0.5 ? 1 : 2] + (b === 2 && Math.random() < 0.3 ? 12 : 0);
      bass(bn, t, spb * 0.92);
      ride(t, b % 2 ? 0.05 : 0.035);
      if (b === 1 || b === 3) { ride(t + swing, 0.025); brush(t, 0.05); }
      if (b === 0 && Math.random() < 0.4) kick(t);
      const hits = [[0, 0.25], [swing, 0.55], [spb + swing, 0.5], [spb * 2 + swing, 0.25]];
      if (b === 0) hits.forEach(([off, p]) => { if (Math.random() < p) voicing.forEach(m => epiano(m, t + off, spb * 1.2, 0.045)); });
      if (melodyOn) melody(t, [0, swing], 0.55, 0.07);
    }
    beat++;
  }
  function scheduler() {
    while (nextTime < ctx.currentTime + 0.15) { scheduleBeat(nextTime); nextTime += 60 / tempo; }
  }

  function start() {
    init(); if (ctx.state === "suspended") ctx.resume();
    if (playing) return;
    playing = true; nextTime = ctx.currentTime + 0.1; beat = 0;
    timer = setInterval(scheduler, 30);
  }
  function stop() { playing = false; clearInterval(timer); }
  function applyPreset() {
    const P = MUSIC_PRESETS[preset];
    if (!P || preset === "auto") { tempo = locTempo; key = locKey; style = "swing"; }
    else { tempo = P.tempo; key = P.key; style = P.style; }
  }
  function setStyle(locId) {
    const L = LOCATIONS[locId]; if (!L) return;
    locTempo = L.tempo; locKey = L.key; applyPreset();
  }
  function setPreset(p) { preset = p; applyPreset(); beat = 0; }
  function setMusicVol(v) { musicVol = v; if (musicBus) musicBus.gain.value = v * 0.5; }
  function setSfxVol(v) { sfxVol = v; if (sfxBus) sfxBus.gain.value = v; }

  // ---- Hiệu ứng ----
  function tone(freq, t, dur, type = "sine", vol = 0.2, slide) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(sfxBus); o.start(t); o.stop(t + dur + 0.02);
  }
  function sfx(name) {
    if (!ctx) return;
    const t = ctx.currentTime;
    switch (name) {
      case "coin": tone(1320, t, 0.12, "square", 0.06); tone(1760, t + 0.08, 0.25, "square", 0.06); break;
      case "bell": tone(1568, t, 0.6, "triangle", 0.12); tone(2093, t + 0.12, 0.7, "triangle", 0.08); break;
      case "click": tone(800, t, 0.05, "triangle", 0.08); break;
      case "pop": tone(500, t, 0.08, "sine", 0.15, 900); break;
      case "pour": { const n = noise(), f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.setValueAtTime(600, t); f.frequency.linearRampToValueAtTime(1500, t + 0.5); const g = ctx.createGain(); g.gain.setValueAtTime(0.15, t); g.gain.linearRampToValueAtTime(0, t + 0.5); n.connect(f); f.connect(g); g.connect(sfxBus); n.start(t); n.stop(t + 0.55); break; }
      case "ice": [0, 0.07, 0.13].forEach((d, i) => tone(2400 + i * 300, t + d, 0.06, "sine", 0.08)); break;
      case "error": tone(220, t, 0.25, "sawtooth", 0.06, 160); break;
      case "perfect": [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.07, 0.3, "triangle", 0.08)); break;
      case "heart": [660, 880, 1320].forEach((f, i) => tone(f, t + i * 0.1, 0.4, "sine", 0.1)); break;
      case "alarm": [0, 0.2, 0.4].forEach(d => tone(880, t + d, 0.15, "square", 0.05, 660)); break;
      case "meow": tone(700, t, 0.35, "sine", 0.12, 1100); tone(1100, t + 0.2, 0.3, "sine", 0.08, 600); break;
      case "powerdown": tone(400, t, 0.8, "sawtooth", 0.06, 60); break;
      case "day": [392, 523, 659, 784].forEach((f, i) => tone(f, t + i * 0.12, 0.5, "triangle", 0.07)); break;
    }
  }

  return { init, start, stop, setStyle, setPreset, setMusicVol, setSfxVol, sfx, get playing() { return playing; } };
})();
