/* Claudenspiel's title screen: the walled city at dusk, drawn and animated in dithered pixels on a small canvas
   (whole pixels, stepped at 10 frames a second), with the menu as banners hanging from the wall.
   CSTitle.show({ items: [{ id, label, suit, hint }], motion: 'full'|'calm'|'off', onPick(id), onSkipToggle(bool), skip })
   draws it over the page; picking a banner (or Esc, which picks the first) closes it. */
var CSTitle = (function () {
  'use strict';
  // Bayer 4×4: the threshold that decides, pixel by pixel, which of two colours a blend shows.
  var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  function dith(x, y, f) { return f * 16 > BAYER[(y & 3) * 4 + (x & 3)] + 0.5; }
  function hex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  var SKY = ['#120c22', '#1c1430', '#2c2042', '#3d3350', '#5a3456', '#7c3a4c', '#a8502e', '#d9783a', '#f0a86a'].map(hex);
  var C = {
    star: hex('#f6efd8'), starDim: hex('#9a90b8'), sun: hex('#ffd98a'), sunRim: hex('#f0a86a'),
    hill1: hex('#3a2a48'), hill2: hex('#2a1f38'), city: hex('#1f1628'), cityHi: hex('#2a1e34'),
    wall: hex('#30253c'), wallLo: hex('#231a2e'), wallHi: hex('#463652'), win: hex('#f3d27a'), winDim: hex('#b4602a'),
    gate: hex('#f0a86a'), gateDeep: hex('#b4602a'), grass: hex('#16231e'), grassLo: hex('#0f1915'), grassHi: hex('#26382c'), grassTip: hex('#3c5236'),
    river: hex('#2a2c4e'), riverHi: hex('#5a4a78'), glint: hex('#f0a86a'), smoke: hex('#4a3e5a'), fly: hex('#e8f08a'), lantern: hex('#ffe9a8'), flag: hex('#5a1020')
  };
  // A seeded random generator, so the city is the same every time.
  function rng(seed) { return function () { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }

  var el = null, timer = null, keyFn = null, resizeFn = null;
  function close() {
    clearInterval(timer); timer = null;
    if (keyFn) document.removeEventListener('keydown', keyFn);
    if (resizeFn) window.removeEventListener('resize', resizeFn);
    if (el) { var e = el; el = null; e.classList.add('gone'); setTimeout(function () { e.remove(); }, 260); }
  }

  function show(o) {
    if (el) close();
    el = document.createElement('div'); el.className = 'cstitle'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Claudenspiel');
    var cv = document.createElement('canvas'); el.appendChild(cv);
    var logo = document.createElement('h1'); logo.className = 'logo cst-logo'; logo.setAttribute('aria-label', 'Claudenspiel'); el.appendChild(logo);
    var sub = document.createElement('div'); sub.className = 'cst-sub'; sub.textContent = 'A game of kingdoms on a shared board'; el.appendChild(sub);
    var row = document.createElement('div'); row.className = 'cst-banners'; el.appendChild(row);
    o.items.forEach(function (it, i) {
      var b = document.createElement('button'); b.className = 'cst-banner sb-' + it.suit; b.style.animationDelay = (-i * 0.37) + 's';
      b.innerHTML = '<span class="cst-ico">' + (window.KFace ? KFace.icon(it.suit) : '') + '</span><span class="cst-lab">' + it.label + '</span>' + (it.hint ? '<span class="cst-hint">' + it.hint + '</span>' : '');
      b.addEventListener('click', function () { pick(it.id); });
      row.appendChild(b);
    });
    var foot = document.createElement('label'); foot.className = 'cst-foot';
    foot.innerHTML = '<input type="checkbox"' + (o.skip ? ' checked' : '') + '> Skip this screen next time';
    foot.querySelector('input').addEventListener('change', function (e) { if (o.onSkipToggle) o.onSkipToggle(e.target.checked); });
    el.appendChild(foot);
    document.body.appendChild(el);
    function pick(id) { close(); o.onPick(id); }
    keyFn = function (e) { if (e.key === 'Escape') { e.preventDefault(); pick(o.items[0].id); } };
    document.addEventListener('keydown', keyFn);
    setTimeout(function () { var f = row.querySelector('button'); if (f) f.focus({ preventScroll: true }); }, 50);

    var still = o.motion === 'off' || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    var scene = null, ctx = cv.getContext('2d'), frame = 0;
    function layout() {
      var vw = window.innerWidth, vh = window.innerHeight, p = Math.max(2, Math.round(Math.min(vw, vh * 1.3) / 200));
      var W = Math.ceil(vw / p), H = Math.ceil(vh / p);
      cv.width = W; cv.height = H; cv.style.width = W * p + 'px'; cv.style.height = H * p + 'px';
      scene = build(W, H);
      // The banners hang from the top of the wall; the logo sits in the sky.
      row.style.top = (scene.wallTop * p - 2) + 'px';
      logo.style.top = Math.max(12, Math.round(scene.wallTop * p * 0.22)) + 'px';
      sub.style.top = Math.max(12, Math.round(scene.wallTop * p * 0.22)) + logo.offsetHeight + 4 + 'px';
      draw(scene, ctx, frame);
    }
    resizeFn = function () { clearTimeout(resizeFn.t); resizeFn.t = setTimeout(layout, 120); };
    window.addEventListener('resize', resizeFn);
    layout();
    if (!still) timer = setInterval(function () { frame++; draw(scene, ctx, frame); }, 100);
  }

  /* ----- the scene ----- */
  function build(W, H) {
    var R = rng(7), s = { W: W, H: H };
    var tall = H > W; s.horizon = Math.round(H * (tall ? 0.56 : 0.64)); s.wallTop = Math.round(H * (tall ? 0.44 : 0.5)); var M = Math.min(H, W * 0.62);
    s.sunX = Math.round(W * 0.62); s.sunR = Math.max(9, Math.round(M * 0.08)); s.sunY = s.wallTop - Math.round(M * 0.07);
    // Stars, thinning toward the glow.
    s.stars = []; for (var i = 0; i < W * s.wallTop / 70; i++) { var y = Math.floor(Math.pow(R(), 1.8) * s.wallTop * 0.8); s.stars.push({ x: Math.floor(R() * W), y: y, ph: Math.floor(R() * 40), big: R() < 0.06 }); }
    // Two lines of hills.
    s.hill1 = []; s.hill2 = [];
    for (var x = 0; x < W; x++) {
      s.hill1.push(Math.round(s.wallTop - 6 - 7 * Math.sin(x / 23 + 1) - 4 * Math.sin(x / 9.5) - 3 * Math.sin(x / 51)));
      s.hill2.push(Math.round(s.wallTop + 1 - 4 * Math.sin(x / 15 + 3) - 3 * Math.sin(x / 37)));
    }
    // The city's roofline: houses, towers with spires, and the cathedral.
    s.roof = new Array(W).fill(s.wallTop); s.windows = []; s.chimneys = [];
    var gate = Math.round(W * 0.5); s.gate = gate;
    x = 2;
    while (x < W) {
      var w = 5 + Math.floor(R() * 9), h = 6 + Math.floor(R() * 12), kind = R();
      if (Math.abs(x - gate) < 8) { x += 3; continue; }
      for (var k = 0; k < w && x + k < W; k++) {
        var top = s.wallTop - h;
        if (kind < 0.55) top -= Math.min(k, w - 1 - k);                              // a gabled roof
        s.roof[x + k] = Math.min(s.roof[x + k], top);
      }
      if (kind > 0.85) { var cx = x + (w >> 1); for (var t = 0; t < 10; t++) s.roof[cx] = Math.min(s.roof[cx], s.wallTop - h - 10); s.roof[cx - 1] = Math.min(s.roof[cx - 1], s.wallTop - h - 4); s.roof[cx + 1] = Math.min(s.roof[cx + 1], s.wallTop - h - 4); }
      for (var n = 0; n < 3; n++) if (R() < 0.7) s.windows.push({ x: x + 1 + Math.floor(R() * (w - 2)), y: s.wallTop - 2 - Math.floor(R() * (h - 3)), ph: Math.floor(R() * 200), lit: R() < 0.75 });
      if (R() < 0.3) s.chimneys.push({ x: x + 1, y: s.roof[x + 1] - 1, ph: Math.floor(R() * 30) });
      x += w + Math.floor(R() * 3);
    }
    // The cathedral: a nave and a tall spire left of the gate.
    var cat = Math.round(W * 0.3), ch = Math.round(M * 0.2);
    for (k = -9; k <= 9; k++) if (cat + k >= 0 && cat + k < W) s.roof[cat + k] = Math.min(s.roof[cat + k], s.wallTop - ch + Math.abs(k) * 0.6 | 0);
    for (k = -2; k <= 2; k++) s.roof[cat + k] = Math.min(s.roof[cat + k], s.wallTop - ch - 4);
    for (k = -1; k <= 1; k++) s.roof[cat + k] = Math.min(s.roof[cat + k], s.wallTop - ch - 4 - 2 * (2 - Math.abs(k)) - (k ? 0 : 12));
    s.rose = { x: cat, y: s.wallTop - ch + 6 };
    // A keep right of the gate, with a flag.
    var keep = Math.round(W * 0.8); for (k = -4; k <= 4; k++) if (keep + k < W) s.roof[keep + k] = Math.min(s.roof[keep + k], s.wallTop - ch + 2 + ((k + 4) % 2 ? 0 : -2) * (Math.abs(k) === 4 ? 1 : 1));
    s.flag = { x: keep, y: s.wallTop - ch - 8 };
    // Gate towers.
    s.towers = [gate - 9, gate + 9];
    // The river winds from the gate to the bottom edge.
    s.river = []; for (y = s.horizon; y < H; y++) { var f = (y - s.horizon) / (H - s.horizon); s.river.push({ c: Math.round(gate + Math.sin(f * 3.2) * W * 0.12 + f * W * 0.08), w: Math.round(2 + f * f * W * 0.12) }); }
    s.flies = []; for (i = 0; i < 9; i++) s.flies.push({ x: R() * W, y: s.horizon + 3 + R() * (H - s.horizon - 6), ph: R() * 6.28, sp: 0.3 + R() * 0.5 });
    // The sky, dithered once.
    s.sky = new Uint8ClampedArray(W * s.horizon * 4);
    for (y = 0; y < s.horizon; y++) {
      var g = Math.pow(y / s.horizon, 1.15) * (SKY.length - 1), a = Math.floor(g), fr = g - a;
      for (x = 0; x < W; x++) {
        // a little warmer around the sun
        var dx = (x - s.sunX) / W, warm = Math.max(0, 0.9 - Math.abs(dx) * 2.2) * 0.9 * (y / s.horizon);
        var gg = Math.min(SKY.length - 1.001, g + warm), aa = Math.floor(gg), ff = gg - aa;
        var col = SKY[dith(x, y, ff) ? aa + 1 : aa], o4 = (y * W + x) * 4;
        s.sky[o4] = col[0]; s.sky[o4 + 1] = col[1]; s.sky[o4 + 2] = col[2]; s.sky[o4 + 3] = 255;
      }
    }
    return s;
  }

  function draw(s, ctx, t) {
    var W = s.W, H = s.H, img = ctx.createImageData(W, H), d = img.data;
    function px(x, y, c) { x |= 0; y |= 0; if (x < 0 || y < 0 || x >= W || y >= H) return; var o = (y * W + x) * 4; d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = 255; }
    d.set(s.sky);
    var x, y, i;
    // Stars twinkle; the big ones have four points.
    s.stars.forEach(function (st) {
      var ph = (t + st.ph) % 40; if (ph === 0) return;
      px(st.x, st.y, ph < 3 || (ph > 20 && ph < 23) ? C.starDim : C.star);
      if (st.big && ph % 20 < 10) { px(st.x - 1, st.y, C.starDim); px(st.x + 1, st.y, C.starDim); px(st.x, st.y - 1, C.starDim); px(st.x, st.y + 1, C.starDim); }
    });
    // The sun, half sunk, with a dithered rim and bands of cloud across it.
    for (y = s.sunY - s.sunR - 2; y <= s.sunY + s.sunR + 2; y++) for (x = s.sunX - s.sunR - 2; x <= s.sunX + s.sunR + 2; x++) {
      var r = Math.hypot(x - s.sunX, y - s.sunY), band = y - s.sunY;
      if (r <= s.sunR - 1) { var cl = band > 0 && band % 4 === 0 && ((x + (t >> 2)) % 23) > 6; px(x, y, cl ? C.sunRim : C.sun); }
      else if (r <= s.sunR + 2 && dith(x, y, (s.sunR + 2 - r) / 3)) px(x, y, C.sunRim);
    }
    // Hills.
    for (x = 0; x < W; x++) { for (y = s.hill1[x]; y < s.horizon; y++) px(x, y, C.hill1); for (y = s.hill2[x]; y < s.horizon; y++) px(x, y, C.hill2); }
    // The city behind the wall.
    for (x = 0; x < W; x++) for (y = s.roof[x]; y < s.wallTop; y++) px(x, y, (x + y) % 7 === 0 && y === s.roof[x] ? C.cityHi : C.city);
    // The cathedral's rose window glows.
    for (y = -2; y <= 2; y++) for (x = -2; x <= 2; x++) if (x * x + y * y <= 5) px(s.rose.x + x, s.rose.y + y, (x + y + t) % 4 === 0 ? C.winDim : C.win);
    // Windows light and go out.
    s.windows.forEach(function (w) { var on = w.lit ? ((t + w.ph) % 200) > 8 : ((t + w.ph) % 300) < 60; if (on) { px(w.x, w.y, C.win); px(w.x, w.y + 1, C.winDim); } });
    // The flag on the keep: a pole and three frames of wind.
    for (y = 0; y < 9; y++) px(s.flag.x, s.flag.y + y, C.city);
    var wv = (t >> 1) % 3; for (x = 1; x <= 6; x++) for (y = 0; y < 3; y++) px(s.flag.x + x, s.flag.y + y + ((x + wv) % 3 === 0 ? 1 : 0), C.flag);
    // Chimney smoke rises in stepped puffs.
    s.chimneys.forEach(function (c) { for (i = 0; i < 4; i++) { var a = (t + c.ph + i * 8) % 32; px(c.x + Math.round(Math.sin((a + i) / 4) * 1.5) + (a >> 3), c.y - (a >> 1), C.smoke); } });
    // The wall: stone courses, crenellations, gate towers and a lit gate.
    for (x = 0; x < W; x++) for (y = s.wallTop; y < s.horizon; y++) {
      var course = (y - s.wallTop) % 4 === 3 || (((y - s.wallTop) >> 2) % 2 ? (x % 8 === 0) : (x % 8 === 4)) && (y - s.wallTop) % 4 !== 3;
      px(x, y, course ? C.wallLo : (y === s.wallTop ? C.wallHi : C.wall));
    }
    for (x = 0; x < W; x++) if (x % 6 < 3) { px(x, s.wallTop - 1, C.wall); px(x, s.wallTop - 2, x % 6 === 0 ? C.wallHi : C.wall); }
    s.towers.forEach(function (tx) {
      for (x = tx - 4; x <= tx + 4; x++) for (y = s.wallTop - 10; y < s.horizon; y++) px(x, y, x === tx - 4 ? C.wallHi : (y - s.wallTop) % 5 === 4 ? C.wallLo : C.wall);
      for (x = tx - 5; x <= tx + 5; x++) if ((x - tx + 5) % 3 !== 2) { px(x, s.wallTop - 11, C.wall); px(x, s.wallTop - 12, C.wall); }
      px(tx, s.wallTop - 6, C.win); px(tx, s.wallTop - 5, C.winDim);                    // an arrow slit with a lamp
    });
    for (y = s.wallTop + 3; y < s.horizon; y++) for (x = s.gate - 4; x <= s.gate + 4; x++) {
      var ar = Math.hypot(x - s.gate, Math.max(0, s.wallTop + 7 - y)); if (ar > 4.2) continue;
      px(x, y, dith(x, y, (y - s.wallTop - 3) / (s.horizon - s.wallTop - 3)) ? C.gate : C.gateDeep);
    }
    // A lantern walks the wall, back and forth.
    var span = W - 8, lp = (t * 0.35) % (2 * span), lx = 4 + (lp < span ? lp : 2 * span - lp);
    px(lx, s.wallTop - 3, C.lantern); if (t % 6 < 4) { px(lx - 1, s.wallTop - 3, C.winDim); px(lx + 1, s.wallTop - 3, C.winDim); }
    // The prairie: dark grass with slow waves of lighter tips moving across it.
    for (y = s.horizon; y < H; y++) {
      var depth = (y - s.horizon) / (H - s.horizon);
      for (x = 0; x < W; x++) {
        var wave = Math.sin((x * 0.18) + y * 0.5 - t * 0.35) + Math.sin(x * 0.05 - t * 0.12);
        var c = dith(x, y, 0.35 + depth * 0.5) ? C.grassLo : C.grass;
        if (wave > 1.25 && (x + y * 3) % 4 === 0) c = depth > 0.5 ? C.grassTip : C.grassHi;
        px(x, y, c);
      }
    }
    // The gate's light falls on the ground.
    for (y = s.horizon; y < s.horizon + 6; y++) for (x = s.gate - 6; x <= s.gate + 6; x++) if (dith(x, y, 0.5 - (y - s.horizon) / 12 - Math.abs(x - s.gate) / 16)) px(x, y, C.gateDeep);
    // The river, with glints of the sky that come and go.
    s.river.forEach(function (rv, j) {
      y = s.horizon + j;
      for (x = rv.c - rv.w; x <= rv.c + rv.w; x++) {
        var edge = x === rv.c - rv.w || x === rv.c + rv.w, g = ((x * 7 + y * 13 + (t >> 1) * 5) % 83);
        px(x, y, edge ? C.riverHi : g === 0 ? C.glint : g < 3 ? C.riverHi : C.river);
      }
    });
    // Fireflies drift and blink.
    s.flies.forEach(function (f, k) {
      var fx = f.x + Math.sin(t * 0.05 * f.sp + f.ph) * 6, fy = f.y + Math.cos(t * 0.07 * f.sp + f.ph) * 3;
      if ((t + k * 7) % 24 < 14) px(fx, fy, C.fly);
    });
    ctx.putImageData(img, 0, 0);
  }

  return { show: show, close: close, isOpen: function () { return !!el; } };
})();
