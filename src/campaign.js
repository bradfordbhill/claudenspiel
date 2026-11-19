/* The Long Road to the City: Claudenspiel's campaign against bots.
   Act I, the prairie: six stops along a road toward the walled city, each against greedy bots and each teaching one
   rule (the rules switch on one at a time, so the last stop plays the full game). Every stop has three stars: win,
   win by a par round, and a challenge in the spirit of its lesson. Progress is kept in this browser (cs.campaign) by
   ui.js. The map is drawn here in dithered pixels, with a pixel landmark for every stop. */
var CSCampaign = (function () {
  'use strict';
  var KD = typeof KDeeds !== 'undefined' ? KDeeds : require('./deeds.js');

  // Rules every stop starts from: the basic game, with every optional rule off. Each stop turns its lesson on, and
  // keeps the earlier ones on.
  var BASE = { handSize: 4, drawPerTurn: 2, meeples: 8, enforceWeak: true, foundationBy: 3, autoEnd: true, seatStart: false, adjDiscount: true, noWander: true, lastRound: true,
    burySuitOW: false, defense: false, ascension: false, banking: false, buyClaim: false, contest: false, market: 0, burn: false };
  function rules(o) { var r = {}; for (var k in BASE) r[k] = BASE[k]; for (var j in o) r[j] = o[j]; return r; }

  // x, y: where the stop stands on the map (in map pixels, 240 × 120). rivals: [name, archetype] for each greedy bot.
  // par: the round to win by for the second star. star3: the challenge, checked on KDeeds.facts plus `lost` (cards of
  // yours Ruined, Overwhelmed or contested away).
  var STOPS = [
    { id: 'inn', name: 'The Crossroads Inn', x: 24, y: 96, sprite: 'inn', arch: 'Gardener', rivals: [['Innkeeper Marthe', 'Hedonist']], target: 30, par: 4,
      lesson: 'Build and claim', teach: 'Play cards next to cards already on the board, paying their cost in ●. Once a turn, put a meeple on a card to claim it: only claimed cards score for you. First to 30◇ starts the last round.',
      tip: 'Your Orchard scores your largest group of connected cards. Keep your garden in one piece.',
      star3: { text: 'Finish owning 6 or more cards', met: function (g) { return g.kingdom >= 6; } },
      rules: rules({}) },
    { id: 'mill', name: 'The Mill at Hollow Brook', x: 64, y: 74, sprite: 'mill', arch: 'Hedonist', rivals: [['Widow Agathe, the miller', 'Cryptkeeper']], target: 36, par: 5,
      lesson: 'Banking', teach: 'New rule: at the end of your turn, every 6● you didn’t spend becomes 1◇, at most 2◇ a turn. A rich turn with nothing worth buying still scores.',
      tip: 'Goblet cards bring ●. The Palace also scores Goblets you don’t own, so a Goblet on the widow’s side still pours for you.',
      star3: { text: 'Bank the full 2◇ on two turns', met: function (g) { return g.banked2 >= 2; } },
      rules: rules({ banking: true }) },
    { id: 'barrow', name: 'The Shepherd’s Barrow', x: 98, y: 98, sprite: 'barrow', arch: 'Cryptkeeper', rivals: [['Old Shepherd Ivo', 'Archbishop']], target: 40, par: 5,
      lesson: 'Burying', teach: 'New rules: a card played on top of another buries it. Each buried card of the same suit makes the stack one enemy harder to Overwhelm, and every two give it a Defense token that stops a Ruin or a Curse.',
      tip: 'The Mausoleum scores the dead under it. Play Actions and Blessings: they are buried once played.',
      star3: { text: 'Finish with 7 or more cards buried in your Kingdom', met: function (g) { return g.buried >= 7; } },
      rules: rules({ banking: true, burySuitOW: true, defense: true }) },
    { id: 'ford', name: 'The Ford of Reeds', x: 132, y: 62, sprite: 'ford', arch: 'Philosopher', rivals: [['The Ferryman', 'Warmonger']], target: 44, par: 5,
      lesson: 'Two claims and Ascension', teach: 'New rules: once a turn, after you claim, you may pay 10● to claim once more. And a stack holding five different suits Ascends: it can’t be harmed, counts as every suit, and gives +8◇ and +12●.',
      tip: 'The Observatory adds 10◇ when all six suits are in your Kingdom. A second claim is the quickest way to the sixth.',
      star3: { text: 'Finish with five or more suits in your Kingdom', met: function (g) { return g.suits >= 5; } },
      rules: rules({ banking: true, burySuitOW: true, defense: true, buyClaim: true, ascension: true }) },
    { id: 'tower', name: 'The Burnt Watchtower', x: 166, y: 88, sprite: 'tower', arch: 'Warmonger', rivals: [['Abbot Kasimir', 'Archbishop']], target: 48, par: 6,
      lesson: 'War', teach: 'Sword cards Ruin rival cards: a Ruined card scores for no one. A card surrounded by enough enemy-suit neighbours is Overwhelmed, and a player whose Foundation is Overwhelmed is out. Every Ruin pays your Warcamp.',
      tip: 'Sword is everyone’s enemy suit, and the Abbot’s cards also fear Tome. An ordinary card falls to three enemy neighbours; a Foundation takes eight, diagonals included.',
      star3: { text: 'Ruin or Overwhelm 3 or more cards', met: function (g) { return g.destroyed >= 3; } },
      rules: rules({ banking: true, burySuitOW: true, defense: true, buyClaim: true, ascension: true }) },
    { id: 'gate', name: 'The Toll Gate', x: 198, y: 60, sprite: 'gate', arch: 'Archbishop', rivals: [['Toll-keeper Anselm', 'Warmonger'], ['Sister Odile', 'Gardener']], target: 52, par: 6,
      lesson: 'Contest, and a crowded table', teach: 'The full game. New rule: once a turn, pay 8● to take a rival’s card next to the one you just placed. Two rivals now, so the seat handicap gives earlier seats a few ◇ to start.',
      tip: 'The Cathedral counts Sceptre cards you don’t own as well. Build in a tight block: Tome and Sword are your enemies.',
      star3: { text: 'Win having lost at most one card', met: function (g) { return g.won && g.lost <= 1; } },
      rules: rules({ banking: true, burySuitOW: true, defense: true, buyClaim: true, ascension: true, contest: true }) }
  ];
  var ACTS = [
    { n: 'I', name: 'The Prairie', stops: STOPS.map(function (s) { return s.id; }), open: true },
    { n: 'II', name: 'The River Towns', note: 'Tactician and warlord bots, and rule twists. Coming later on the road.', open: false },
    { n: 'III', name: 'The City', note: 'The Genius, as named rivals. Coming later on the road.', open: false }
  ];
  var COLORS = ['#c0392b', '#2471a3', '#1e8449', '#b9770e', '#7d3c98'];
  function stop(id) { for (var i = 0; i < STOPS.length; i++) if (STOPS[i].id === id) return STOPS[i]; return null; }
  function index(id) { for (var i = 0; i < STOPS.length; i++) if (STOPS[i].id === id) return i; return -1; }

  // The New game options for a stop, for engine.newGame (the caller adds defs, seed and anything else).
  function setup(id, name) {
    var s = stop(id), o = {}; for (var k in s.rules) o[k] = s.rules[k];
    o.target = s.target;
    o.players = [{ name: name || 'You', arch: s.arch, color: COLORS[0] }].concat(s.rivals.map(function (r, i) { return { name: r[0], arch: r[1], color: COLORS[i + 1] }; }));
    return o;
  }
  // The stars a finished campaign game earned for seat p (the human): [win, par, challenge].
  function stars(st, p) {
    var s = st.campaign && stop(st.campaign.stop); if (!s || st.winner == null) return null;
    var g = KD.facts(st, p); g.lost = st.players[p].lost || 0;
    return [g.won, g.won && g.round <= s.par, !!s.star3.met(g)];
  }
  // Record them in book ({ stops: { id: { stars: [b, b, b], tries, wins, best } } }); returns which stars are new.
  function record(book, id, got) {
    book.stops = book.stops || {}; var r = book.stops[id] = book.stops[id] || { stars: [false, false, false], tries: 0, wins: 0 };
    r.tries++; if (got[0]) r.wins++;
    var fresh = got.map(function (x, i) { return x && !r.stars[i]; });
    r.stars = r.stars.map(function (x, i) { return x || got[i]; });
    return fresh;
  }
  function starCount(book, id) { var r = book && book.stops && book.stops[id]; return r ? r.stars.filter(Boolean).length : 0; }
  function total(book) { return STOPS.reduce(function (a, s) { return a + starCount(book, s.id); }, 0); }
  // A stop opens when the one before it has been won.
  function unlocked(book, id) { var i = index(id); if (i <= 0) return i === 0; var r = book && book.stops && book.stops[STOPS[i - 1].id]; return !!(r && r.stars[0]); }
  // The first open stop not yet won (where the traveller stands), or the last stop once all are won.
  function current(book) { for (var i = 0; i < STOPS.length; i++) { var r = book && book.stops && book.stops[STOPS[i].id]; if (!r || !r.stars[0]) return STOPS[i].id; } return STOPS[STOPS.length - 1].id; }
  function next(id) { var i = index(id); return i >= 0 && i < STOPS.length - 1 ? STOPS[i + 1].id : null; }

  /* ---------------- the map ---------------- */
  var W = 240, H = 120, HZ = 34;   // map size in pixels, and the horizon
  function hex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  function th(x, y) { return (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16; }
  var SKY = ['#2c2042', '#3d3350', '#5a3456', '#7c3a4c', '#a8502e', '#d9783a', '#f0a86a'].map(hex);
  var P = { grass: hex('#3d5a34'), grassD: hex('#2c4428'), grassL: hex('#58743c'), grassT: hex('#7c9446'), far: hex('#4a4058'), farD: hex('#3a3048'),
    road: hex('#b8925a'), roadD: hex('#8a6a3e'), roadL: hex('#d8b47a'), walk: hex('#f0d8a0'), water: hex('#2a3c64'), waterL: hex('#5a78a8'), glint: hex('#f0c890'),
    city: hex('#241a30'), cityL: hex('#352842'), win: hex('#f3d27a'), flower: hex('#e8d070'), flower2: hex('#d07090') };
  function rng(seed) { return function () { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }
  // The road as a list of points through every stop, from the left edge to the city gate.
  function roadPts() { var p = [[0, 104]]; STOPS.forEach(function (s) { p.push([s.x, s.y + 4]); }); p.push([226, 40]); return p; }
  // Each point along the road, every half pixel, with how far along it is (0..1 per segment index).
  function roadTrace() {
    var pts = roadPts(), out = [];
    for (var i = 0; i < pts.length - 1; i++) { var a = pts[i], b = pts[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], n = Math.ceil(Math.hypot(dx, dy) * 2);
      for (var j = 0; j < n; j++) { var t = j / n, sw = Math.sin(t * Math.PI) * (i % 2 ? 5 : -5);   // each leg bows a little
        var nx = -dy / Math.hypot(dx, dy), ny = dx / Math.hypot(dx, dy);
        out.push({ x: a[0] + dx * t + nx * sw, y: a[1] + dy * t + ny * sw, seg: i + t }); } }
    return out;
  }
  var mapCache = {};
  // The map as a data URL. reached: how far along the road the traveller has walked (in stops, 0–6).
  function mapURL(reached) {
    if (typeof document === 'undefined') return '';
    if (mapCache[reached]) return mapCache[reached];
    var cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    var g = cv.getContext('2d'), img = g.createImageData(W, H), d = img.data, R = rng(7);
    function put(x, y, c) { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= W || y >= H) return; var i = (y * W + x) * 4; d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255; }
    // the dusk sky, banded and dithered toward the horizon
    for (var y = 0; y < HZ; y++) for (var x = 0; x < W; x++) { var f = y / HZ * (SKY.length - 1), lo = Math.floor(f), fr = f - lo; put(x, y, SKY[Math.min(SKY.length - 1, lo + (fr > th(x, y) ? 1 : 0))]); }
    for (var s = 0; s < 40; s++) { var sx = R() * W | 0, sy = R() * HZ * .45 | 0; put(sx, sy, hex('#f6efd8')); }
    // far hills, then the grass, darker toward the viewer, combed by the wind
    for (var x = 0; x < W; x++) { var hh = HZ - 4 - Math.round(3 * Math.sin(x * .05) + 2 * Math.sin(x * .13 + 1));
      for (var y = hh; y < H; y++) {
        if (y < HZ + 3) { put(x, y, (y - hh) / 6 > th(x, y) ? P.farD : P.far); continue; }
        var t = (y - HZ) / (H - HZ), wave = (((y - x * .3 + 2 * Math.sin(x * .07)) / 3) % 1 + 1) % 1;
        put(x, y, t * .8 + .1 * Math.sin(x * .09 + y * .2) > th(x, y) + .15 ? (wave < .25 ? P.grassD : P.grass) : (wave < .2 ? P.grassL : P.grass)); } }
    // the walled city on the right, on the horizon: wall, towers, keep and spire, with lit windows
    function rect(x0, y0, x1, y1, c) { for (var y = y0; y < y1; y++) for (var x = x0; x < x1; x++) put(x, y, c); }
    var cl = 204, cr = 240, cy = HZ + 6;
    rect(cl, cy - 8, cr, cy, P.city); for (var x = cl; x < cr; x += 3) rect(x, cy - 10, x + 2, cy - 8, P.city);
    [[cl + 2, 14], [cl + 13, 22], [cl + 22, 17], [cl + 31, 12]].forEach(function (tw, i) { rect(tw[0], cy - tw[1], tw[0] + 5, cy, i === 1 ? P.cityL : P.city); for (var r = 0; r < 4; r++) rect(tw[0] + r - 1 + 1, cy - tw[1] - r - 1, tw[0] + 5 - r, cy - tw[1] - r, P.city); });
    rect(cl + 17, cy - 32, cl + 19, cy - 22, P.city); put(cl + 18, cy - 33, P.city);
    [[cl + 4, cy - 10], [cl + 15, cy - 16], [cl + 15, cy - 12], [cl + 24, cy - 12], [cl + 9, cy - 5], [cl + 28, cy - 4], [cl + 33, cy - 8]].forEach(function (w) { put(w[0], w[1], P.win); });
    rect(cl + 7, cy - 5, cl + 11, cy, hex('#f0a86a'));   // the gate, lit
    // the brook by the mill and the river at the ford: water winding down from the hills
    function river(x0, wdt, seed) { for (var y = HZ + 2; y < H; y++) { var t = (y - HZ) / (H - HZ), cx = x0 + Math.sin(y * .09 + seed) * 6 + t * 8, w = 1 + wdt * t;
      for (var x = Math.floor(cx - w); x <= cx + w; x++) put(x, y, Math.sin(y * 1.3 + x * .4) > .75 ? P.waterL : (y * 7 + x * 3) % 41 === 0 ? P.glint : P.water); } }
    river(54, 2.5, 1); river(126, 5, 3);
    // the road: packed earth with darker ruts; the stretch already walked is worn pale
    var tr = roadTrace();
    tr.forEach(function (p) { for (var oy = -1; oy <= 1; oy++) for (var ox = -1; ox <= 1; ox++) put(p.x + ox, p.y + oy, Math.abs(ox) + Math.abs(oy) === 2 ? P.roadD : P.road); });
    tr.forEach(function (p) { if (p.seg <= reached) put(p.x, p.y, P.walk); else if (Math.floor(p.seg * 40) % 3 === 0) put(p.x, p.y, P.roadL); });
    // stepping stones where the road crosses water
    tr.forEach(function (p, i) { var k = (Math.round(p.y) * W + Math.round(p.x)) * 4; if (i % 5 === 0 && d[k] === P.water[0] && d[k + 1] === P.water[1]) put(p.x, p.y, P.roadL); });
    // wildflowers in the grass
    for (var f = 0; f < 90; f++) { var fx = R() * W | 0, fy = HZ + 8 + (R() * (H - HZ - 8) | 0), k = (fy * W + fx) * 4; if (d[k] === P.grass[0] && d[k + 1] === P.grass[1]) put(fx, fy, f % 3 ? P.flower : P.flower2); }
    g.putImageData(img, 0, 0);
    return (mapCache[reached] = cv.toDataURL());
  }
  // Pixel landmarks, one character per pixel ('.' is clear).
  var SP = {
    k: '#1a1020', w: '#d8c8a0', W: '#a89068', r: '#8a3a2a', R: '#b8543a', y: '#f3d27a', b: '#6a4a2a', B: '#8a6438', s: '#8a8a94', S: '#b4b4bc', g: '#4a6a38', G: '#6a8a48',
    x: '#4a4048', X: '#6a5e66', o: '#e8783a', O: '#f3c060', l: '#d8c8a0', e: '#5a8a4a', c: '#c8c0b0', v: '#d8d0e0', m: '#3a3042'
  };
  var SPRITES = {
    inn: ['......kk..........', '.....kRRk.........', '....kRRRRk..kk....', '...kRRrRRRkkWWk...', '..kRRrRRRRRkWWk...', '.kRRRRRRrRRRk.....', 'kkkkkkkkkkkkkk....', '.kwwwwwwwwwwk..k..',
      '.kwyywwwwyywk.kBk.', '.kwyywbbwyywk.kyk.', '.kwwwwbbwwwwk..k..', '.kwwwwbbwwwwk..k..', 'gkkkkkkkkkkkkggkgg'],
    mill: ['.c.........c.', '..c.......c..', '...c.....c...', '....c...c....', '.....ckc.....', '.....kkk.....', '....c.k.c....', '...ckwwwkc...', '..c.kwwwk.c..', '.c.kwwywwk.c.',
      '...kwwwwwk...', '..kwwwbwwwk..', '..kwwwbwwwk..', 'gGkkkkkkkkkGg'],
    barrow: ['......GGGGG.......', '....GGGgGGGGG.....', '...GGgGGGGgGGG....', '..GGGGGGGGGGGGG...', '.GgGGGGsSSsGGgGG..', 'GGGGGGsSkkSsGGGGG.', 'GgGGGsSkkkkSsGGgGG', 'gggggsSkkkkSsggggg'],
    tower: ['...k.k..kk...', '...kXk.kXk.o.', '..kXXXkXXk.O.', '..kXxXXXXk..o', '..kXXXXXXk...', '..kxXXoXxk...', '..kXXXXXXk...', '..kXxXXXXk...', '..kXXXXxXk...', '..kXXbbXXk...',
      '..kXXbbXXk...', '.gkkkkkkkkg..', 'ggggggggggggg'],
    ford: ['..e.......e...e', '..e..e....e.e.e', '.ee..e...ee.e.e', '.e..ee...e..ee.', '.e..e....e..e..', 'sS...sS.....sS.', 'ss...ss.....ss.'],
    gate: ['.kk.................', 'kBBk..........kk....', 'kBBk.........kRRk...', 'kBBkkkkkkkkkkkkkk...', 'kBBkwrwrwrwrwkwwk...', 'kBBkkkkkkkkkkkwyk...', 'kBBk.........kwwk...', 'kBBk.........kwbk...',
      'kBBk.........kwbk...', 'gkkgg........kkkkg..']
  };
  function sprite(name, px) {
    var rows = SPRITES[name], w = rows[0].length, h = rows.length, r = '';
    rows.forEach(function (row, y) { for (var x = 0; x < w; x++) { var c = SP[row[x]]; if (c) r += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + c + '"/>'; } });
    return '<svg class="pix" width="' + w * px + '" height="' + h * px + '" viewBox="0 0 ' + w + ' ' + h + '" shape-rendering="crispEdges" aria-hidden="true">' + r + '</svg>';
  }
  // The traveller: a meeple in the player's colour, with a bundle on a stick.
  var WALKER = ['.....b..', '..kk.b..', '.kccbb..', '.kcck...', 'kccccck.', '.kcck...', '.kcck...', 'kc..ck..', 'k....k..'];
  function walker(px, color) {
    var r = ''; WALKER.forEach(function (row, y) { for (var x = 0; x < row.length; x++) { var c = row[x] === 'c' ? color : row[x] === 'k' ? '#1a1020' : row[x] === 'b' ? '#8a6438' : null; if (c) r += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + c + '"/>'; } });
    return '<svg class="pix" width="' + 8 * px + '" height="' + 9 * px + '" viewBox="0 0 8 9" shape-rendering="crispEdges" aria-hidden="true">' + r + '</svg>';
  }
  // A star, won or not, in pixels.
  var STAR = ['...k...', '..kyk..', 'kkkyykk', 'kyyyyyk', '.kyyyk.', '.kykyk.', 'kk...kk'];
  function star(on, px) {
    var r = ''; STAR.forEach(function (row, y) { for (var x = 0; x < 7; x++) { var c = row[x] === 'k' ? (on ? '#5a3a10' : '#6a6070') : row[x] === 'y' ? (on ? '#f3c030' : 'rgba(120,110,130,.35)') : null; if (c) r += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + c + '"/>'; } });
    return '<svg class="pix cstar' + (on ? ' on' : '') + '" width="' + 7 * px + '" height="' + 7 * px + '" viewBox="0 0 7 7" shape-rendering="crispEdges" aria-label="' + (on ? 'star' : 'no star') + '">' + r + '</svg>';
  }

  return { STOPS: STOPS, ACTS: ACTS, BASE: BASE, W: W, H: H, stop: stop, index: index, setup: setup, stars: stars, record: record, starCount: starCount, total: total,
    unlocked: unlocked, current: current, next: next, mapURL: mapURL, sprite: sprite, spriteW: function (n) { return SPRITES[n][0].length; }, walker: walker, star: star };
})();
if (typeof module !== 'undefined') module.exports = CSCampaign;
