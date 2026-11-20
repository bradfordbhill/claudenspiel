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
  // Act II, the river towns: the full game against tacticians and warlords, and every town keeps a custom of its own
  // (a rule twist). `bot` is the rival's style; `noSuits` takes those suits' cards out of the deck.
  var FULL = { banking: true, burySuitOW: true, defense: true, buyClaim: true, ascension: true, contest: true };
  function full(o) { var r = rules(FULL); for (var k in o) r[k] = o[k]; return r; }
  var ACT2 = [
    { id: 'wharf', act: 2, name: 'Saltmarsh Wharf', x: 22, y: 92, sprite: 'wharf', arch: 'Archbishop', rivals: [['Harbourmaster Quill', 'Cryptkeeper', 'tactician']], target: 52, par: 7,
      lesson: 'Few hands', custom: 'Short of hands', teach: 'Custom of the town: short of hands. Every player has only 5 meeples, not 8. A claim is precious, and when you run out you must take one back, which costs your whole turn.',
      tip: 'Claim the cards that score the most for the longest. A dear Sceptre card beats two cheap ones.',
      star3: { text: 'Win with a meeple still unused', met: function (g) { return g.won && g.meeples >= 1; } },
      rules: full({ meeples: 5 }) },
    { id: 'ferry', act: 2, name: 'Ferrybridge', x: 58, y: 78, sprite: 'ferry', arch: 'Hedonist', rivals: [['Ferrywoman Brigid', 'Gardener', 'tactician']], target: 52, par: 6,
      lesson: 'Tactician rivals', custom: 'Market day', teach: 'Custom of the town: market day. Three cards lie face up beside the deck, and every card you draw may be one of them instead. The ferrywoman is a tactician: she plans her claims and won’t leave you an easy one.',
      tip: 'Watch the row for Goblets, and for the cards she needs. Taking one she wants is as good as a card of your own.',
      star3: { text: 'Finish with 5 or more Goblet cards in your Kingdom', met: function (g) { return (g.suitCount.Goblet || 0) >= 5; } },
      rules: full({ market: 3 }) },
    { id: 'weir', act: 2, name: 'The Weir at Gallows Bend', x: 94, y: 94, sprite: 'weir', arch: 'Cryptkeeper', rivals: [['Miller Gotthold', 'Philosopher', 'warlord']], target: 52, par: 5,
      lesson: 'Burning, and a warlord', custom: 'Ember night', teach: 'Custom of the town: ember night. Once a turn you may burn a card from your hand for its one-time effect (the flame under each card says what). The miller is a warlord: he Ruins whatever he can reach.',
      tip: 'A burn that wards a card keeps it safe from Ruin until your next turn. Bury under your best cards: two buried of a suit give a Defense token.',
      star3: { text: 'Win having lost at most two cards', met: function (g) { return g.won && g.lost <= 2; } },
      rules: full({ burn: true }) },
    { id: 'abbey', act: 2, name: 'Lantern Abbey', x: 128, y: 66, sprite: 'abbey', arch: 'Philosopher', rivals: [['Prior Benedikt', 'Archbishop', 'tactician'], ['Sister Yolanthe', 'Gardener', 'tactician']], target: 52, par: 4,
      lesson: 'A peaceful race, three seats', custom: 'Pax Dei', teach: 'Custom of the town: the peace of God. There are no Sword cards in the deck, so nothing can be Ruined: only Overwhelming can harm a card. Two tactician rivals race you to the target; the seat handicap gives earlier seats a few ◇ to start.',
      tip: 'Sword is your enemy suit, and there is none here: build freely. The Observatory adds 10◇ when all six suits are in your Kingdom, and in this deck there are only five, so count on the suits you can get.',
      star3: { text: 'Finish with five or more suits in your Kingdom', met: function (g) { return g.suits >= 5; } },
      rules: full({}), noSuits: ['Sword'] },
    { id: 'tanners', act: 2, name: 'Tanners’ Row', x: 164, y: 86, sprite: 'tanners', arch: 'Gardener', rivals: [['Master Tanner Rook', 'Warmonger', 'warlord'], ['Dyer Ottilie', 'Philosopher', 'tactician']], target: 52, par: 5,
      lesson: 'A fast river', custom: 'Spring flood', teach: 'Custom of the town: the spring flood. Everyone draws 3 cards a turn instead of 2, and starts with 5. More cards, more choices, a faster race, and a warlord with more swords.',
      tip: 'More cards means more Leaf cards: keep one garden and grow it. Sword cards threaten you less than Goblets, which are your enemy suit.',
      star3: { text: 'Finish with a garden (largest region) of 6 or more cards', met: function (g) { return g.region >= 6; } },
      rules: full({ handSize: 5, drawPerTurn: 3 }) },
    { id: 'kings', act: 2, name: 'The Bridge of Kings', x: 198, y: 72, sprite: 'kings', arch: 'Warmonger', rivals: [['Bridgewarden Hrodna', 'Cryptkeeper', 'warlord'], ['Canon Ambrose', 'Archbishop', 'tactician'], ['Alderwoman Fenna', 'Hedonist', 'tactician']], target: 52, par: 5,
      lesson: 'A full table', custom: 'Market day and ember night', teach: 'Custom of the bridge: everything at once. Four players, the market row and burning, a warlord and two tacticians. The seat handicap gives earlier seats a few ◇ to start.',
      tip: 'Bone is your enemy suit, and the warden is a Cryptkeeper who fights. Every Ruin pays your Warcamp; four players means four Kingdoms to raid.',
      star3: { text: 'Ruin or Overwhelm 4 or more cards', met: function (g) { return g.destroyed >= 4; } },
      rules: full({ market: 3, burn: true }) }
  ];
  STOPS.forEach(function (s) { s.act = 1; s.rivals.forEach(function (r) { r[2] = r[2] || 'greedy'; }); });
  var ACT1 = STOPS.slice(); STOPS = STOPS.concat(ACT2);
  // The deck for a stop: the library with any suits the stop's custom bans taken out.
  function defs(id, lib) {
    var s = stop(id); if (!s || !s.noSuits) return lib;
    return lib.map(function (d) { if (d.type !== 'Foundation' && s.noSuits.indexOf(d.suit) >= 0) { var c = {}; for (var k in d) c[k] = d[k]; c.copies = 0; return c; } return d; });
  }
  var ACTS = [
    { n: 'I', name: 'The Prairie', stops: ACT1.map(function (s) { return s.id; }), open: true },
    { n: 'II', name: 'The River Towns', stops: ACT2.map(function (s) { return s.id; }), open: true },
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
  // The bot style in each seat of a stop's game (null for the traveller's own seat).
  function bots(id) { return [null].concat(stop(id).rivals.map(function (r) { return r[2] || 'greedy'; })); }
  // The stars a finished campaign game earned for seat p (the human): [win, par, challenge].
  function stars(st, p) {
    var s = st.campaign && stop(st.campaign.stop); if (!s || st.winner == null) return null;
    var g = KD.facts(st, p); g.lost = st.players[p].lost || 0; g.meeples = st.players[p].meeples;
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
  // The act a stop belongs to, the stops of an act, and a stop's place in its act (0-based).
  function actOf(id) { var s = stop(id); return s ? s.act : 1; }
  function actStops(n) { return n === 2 ? ACT2 : ACT1; }
  function inAct(id) { var s = stop(id); return s ? actStops(s.act).indexOf(s) : -1; }
  function actStars(book, n) { return actStops(n).reduce(function (a, s) { return a + starCount(book, s.id); }, 0); }
  function actDone(book, n) { return actStops(n).every(function (s) { var r = book && book.stops && book.stops[s.id]; return r && r.stars[0]; }); }
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
  function roadPts(act) { var p = [[0, act === 2 ? 96 : 104]]; (act === 2 ? ACT2 : ACT1).forEach(function (s) { p.push([s.x, s.y + 4]); }); p.push(act === 2 ? [224, 52] : [226, 40]); return p; }
  // Each point along the road, every half pixel, with how far along it is (0..1 per segment index).
  function roadTrace(act) {
    var pts = roadPts(act), out = [];
    for (var i = 0; i < pts.length - 1; i++) { var a = pts[i], b = pts[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], n = Math.ceil(Math.hypot(dx, dy) * 2);
      for (var j = 0; j < n; j++) { var t = j / n, sw = Math.sin(t * Math.PI) * (i % 2 ? 5 : -5);   // each leg bows a little
        var nx = -dy / Math.hypot(dx, dy), ny = dx / Math.hypot(dx, dy);
        out.push({ x: a[0] + dx * t + nx * sw, y: a[1] + dy * t + ny * sw, seg: i + t }); } }
    return out;
  }
  var mapCache = {};
  // The map as a data URL. reached: how far along the road the traveller has walked (in stops, 0–6). act: 1 or 2.
  function mapURL(reached, act) {
    if (typeof document === 'undefined') return '';
    if (act === 2) return riverURL(reached);
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
    var tr = roadTrace(1);
    tr.forEach(function (p) { for (var oy = -1; oy <= 1; oy++) for (var ox = -1; ox <= 1; ox++) put(p.x + ox, p.y + oy, Math.abs(ox) + Math.abs(oy) === 2 ? P.roadD : P.road); });
    tr.forEach(function (p) { if (p.seg <= reached) put(p.x, p.y, P.walk); else if (Math.floor(p.seg * 40) % 3 === 0) put(p.x, p.y, P.roadL); });
    // stepping stones where the road crosses water
    tr.forEach(function (p, i) { var k = (Math.round(p.y) * W + Math.round(p.x)) * 4; if (i % 5 === 0 && d[k] === P.water[0] && d[k + 1] === P.water[1]) put(p.x, p.y, P.roadL); });
    // wildflowers in the grass
    for (var f = 0; f < 90; f++) { var fx = R() * W | 0, fy = HZ + 8 + (R() * (H - HZ - 8) | 0), k = (fy * W + fx) * 4; if (d[k] === P.grass[0] && d[k + 1] === P.grass[1]) put(fx, fy, f % 3 ? P.flower : P.flower2); }
    g.putImageData(img, 0, 0);
    return (mapCache[reached] = cv.toDataURL());
  }
  // Act II's map: the river valley by moonlight. A broad river winds along the bottom, the towpath follows its bank
  // from town to town, fields and orchards sit in dithered strips, and the city, much nearer now, fills the right.
  var N2 = { sky: ['#0e1428', '#152038', '#1c2c4a', '#26385a', '#34486a', '#4a5a78'].map(hex), moon: hex('#f4ecd0'), moonD: hex('#c8c0a4'),
    hill: hex('#1a2436'), hillD: hex('#141c2c'), field: hex('#2a3a30'), fieldD: hex('#22302a'), fieldL: hex('#3a4c3a'), wheat: hex('#4a4a30'), wheatL: hex('#5e5a38'),
    tree: hex('#16241c'), treeL: hex('#24382a'), water: hex('#1c2c50'), waterD: hex('#142040'), waterL: hex('#3a5888'), shine: hex('#c8d4e8'),
    path: hex('#6a5a48'), pathD: hex('#4a3e34'), pathL: hex('#8a7a62'), walk: hex('#c8b896'), city: hex('#0c0c18'), cityL: hex('#1a1a2c'), win: hex('#f3d27a'), winD: hex('#c89a4a') };
  var riverCache = {};
  function riverY(x) { return 106 + 4 * Math.sin(x * 0.035 + 0.6) + 2 * Math.sin(x * 0.11); }
  function riverURL(reached) {
    if (riverCache[reached]) return riverCache[reached];
    var cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    var g = cv.getContext('2d'), img = g.createImageData(W, H), d = img.data, R = rng(11), HZ2 = 40;
    function put(x, y, c) { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= W || y >= H) return; var i = (y * W + x) * 4; d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255; }
    function rect(x0, y0, x1, y1, c) { for (var y = y0; y < y1; y++) for (var x = x0; x < x1; x++) put(x, y, c); }
    // night sky, lighter toward the horizon, with a moon and a scatter of stars
    for (var y = 0; y < HZ2; y++) for (var x = 0; x < W; x++) { var f = y / HZ2 * (N2.sky.length - 1), lo = Math.floor(f); put(x, y, N2.sky[Math.min(N2.sky.length - 1, lo + (f - lo > th(x, y) ? 1 : 0))]); }
    for (var s = 0; s < 70; s++) { var sx = R() * W | 0, sy = R() * HZ2 * .7 | 0; put(sx, sy, s % 7 ? hex('#a8b4d0') : N2.moon); }
    var mx = 150, my = 11; for (var y = -6; y <= 6; y++) for (var x = -6; x <= 6; x++) { var r2 = x * x + y * y; if (r2 <= 36) put(mx + x, my + y, (x - 2) * (x - 2) + (y + 1) * (y + 1) < 9 && r2 > 4 ? N2.moonD : N2.moon); else if (r2 <= 56 && th(mx + x, my + y) < .3) put(mx + x, my + y, N2.sky[3]); }
    // far wooded hills
    for (var x = 0; x < W; x++) { var hh = HZ2 - 6 - Math.round(4 * Math.sin(x * .04 + 2) + 2 * Math.sin(x * .17)); for (var y = hh; y < HZ2 + 4; y++) put(x, y, (y - hh) / 8 > th(x, y) ? N2.hillD : N2.hill); }
    // fields in strips, dithered: dark meadow, wheat, orchard rows
    for (var y = HZ2 + 4; y < H; y++) for (var x = 0; x < W; x++) {
      var band = Math.floor((x + y * 1.8 + 12 * Math.sin(y * .1)) / 34) % 3, t = (y - HZ2) / (H - HZ2);
      var c = band === 0 ? (t * .7 > th(x, y) + .1 ? N2.fieldD : N2.field) : band === 1 ? ((x + y) % 3 === 0 ? N2.wheatL : N2.wheat) : (((x >> 1) + (y >> 1)) % 4 === 0 ? N2.fieldL : N2.field);
      put(x, y, c); }
    for (var tcount = 0; tcount < 26; tcount++) { var tx = R() * W | 0, ty = HZ2 + 6 + (R() * 50 | 0); if (tx > 196 && ty < 62) continue; rect(tx - 1, ty - 1, tx + 2, ty + 1, N2.tree); put(tx, ty - 2, N2.treeL); put(tx, ty + 1, N2.pathD); }
    // the city, close now: a long wall, towers, a cathedral and a keep, windows lit
    var cl = 192, cy = HZ2 + 14;
    rect(cl, cy - 12, W, cy, N2.city); for (var x = cl; x < W; x += 3) rect(x, cy - 14, x + 2, cy - 12, N2.city);
    [[cl + 2, 20], [cl + 14, 30], [cl + 26, 24], [cl + 38, 18]].forEach(function (tw, i) { rect(tw[0], cy - tw[1], tw[0] + 6, cy, i === 1 ? N2.cityL : N2.city); for (var r = 0; r < 4; r++) rect(tw[0] + r, cy - tw[1] - r - 1, tw[0] + 6 - r, cy - tw[1] - r, N2.city); });
    rect(cl + 20, cy - 40, cl + 23, cy - 26, N2.city); put(cl + 21, cy - 42, N2.city); put(cl + 21, cy - 41, N2.city);
    for (var wn = 0; wn < 24; wn++) { var wx = cl + 1 + (R() * (W - cl - 2) | 0), wy = cy - 2 - (R() * 22 | 0), k = (wy * W + wx) * 4; if (d[k] === N2.city[0] || d[k] === N2.cityL[0]) put(wx, wy, wn % 3 ? N2.win : N2.winD); }
    rect(cl + 30, cy - 6, cl + 34, cy, hex('#f0a86a'));
    // the river: broad, dark, with ripple lines and the moon's broken reflection
    for (var x = 0; x < W; x++) { var ry = riverY(x); for (var y = Math.floor(ry - 6); y < H; y++) {
      var dpt = y - (ry - 6), c = dpt < 1 ? N2.pathD : Math.sin(y * 1.7 + x * .25) > .82 ? N2.waterL : dpt > 8 && th(x, y) < .4 ? N2.waterD : N2.water;
      if (Math.abs(x - mx - 4) < 5 - (y % 3) && (y + x) % 2 === 0 && dpt > 1) c = N2.shine; put(x, y, c); } }
    // the towpath: packed earth along the bank; the stretch already walked is worn pale
    var tr = roadTrace(2);
    tr.forEach(function (p) { for (var oy = -1; oy <= 1; oy++) for (var ox = -1; ox <= 1; ox++) put(p.x + ox, p.y + oy, Math.abs(ox) + Math.abs(oy) === 2 ? N2.pathD : N2.path); });
    tr.forEach(function (p) { if (p.seg <= reached) put(p.x, p.y, N2.walk); else if (Math.floor(p.seg * 40) % 3 === 0) put(p.x, p.y, N2.pathL); });
    // fireflies over the meadows
    for (var f = 0; f < 30; f++) { var fx = R() * 190 | 0, fy = HZ2 + 8 + (R() * 50 | 0); put(fx, fy, f % 2 ? hex('#d8e870') : hex('#f3d27a')); }
    g.putImageData(img, 0, 0);
    return (riverCache[reached] = cv.toDataURL());
  }
  // Pixel landmarks, one character per pixel ('.' is clear).
  var SP = {
    k: '#1a1020', w: '#d8c8a0', W: '#a89068', r: '#8a3a2a', R: '#b8543a', y: '#f3d27a', b: '#6a4a2a', B: '#8a6438', s: '#8a8a94', S: '#b4b4bc', g: '#4a6a38', G: '#6a8a48',
    x: '#4a4048', X: '#6a5e66', o: '#e8783a', O: '#f3c060', l: '#d8c8a0', e: '#5a8a4a', c: '#c8c0b0', v: '#d8d0e0', m: '#3a3042',
    u: '#2a4070', U: '#6a8ac0', p: '#8a5aa8', t: '#3a8a8a'
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
      'kBBk.........kwbk...', 'gkkgg........kkkkg..'],
    wharf: ['.......k........', '.......kWk......', '.......kWWk.....', '.......kWWWk....', '.......kWWWWk...', '.......kWWWWWk..', '.......k........', 'kkkkkkkkkkkkkkk.', '.kBBBBBBBByBBk..', '..kBBBBBBBBBk.b.',
      '...kkkkkkkkk..b.', 'uUuuuuuuuUuuubuu'],
    ferry: ['b...............b', 'bkkkkkkkkkkkkkkkb', 'b.......k.......b', 'b......kWk......b', 'b.....kRRRk.....b', 'b...kBBBBBBBk...b', 'b...kkkkkkkkk...b', 'uuUuuuuuuuuuuuUuu'],
    weir: ['..kkk.........', '.kXbXk..kk....', 'kXbXbXk.kRRk..', 'kbXkXbkkRRRRk.', 'kXbXbXkkwwwwk.', '.kXbXk.kwywwk.', '..kkk..kwbwwk.', 'uUuUuuUkkkkkk.', 'uuUuuuuuuUuuuu'],
    abbey: ['.....k..........', '....kyk.........', '....kSk.........', '...kSSSk........', '...kSySk..kk....', '...kSSSkkkRRkk..', '...kSSSkRRRRRRk.', '...kSSSkSSSSSSk.', '...kSySkSySSySk.', '...kSSSkSSSSSSk.',
      '...kSbSkSSbbSSk.', 'gggkkkkkkkkkkkkg'],
    tanners: ['k.....k.....k.', 'kkkkkkkkkkkkkk', 'k.rr..k.pp..k.', 'k.rr..k.pp..k.', 'k.RR..k.tt..k.', 'k.....k.tt..k.', 'k.....k.....k.', 'gggggggggggggg'],
    barge: ['....k.....', '....kWk...', '....kWWk..', 'kkkkkkkkkk', '.kBBByBBk.', '..kkkkkk..'],
    kings: ['.r...........r..', '.kk.........kk..', 'kSSk.......kSSk.', 'kSyk.......kSyk.', 'kSSkkkkkkkkkSSk.', 'kSSSSSSSSSSSSSk.', 'kSSkSSSkSSSkSSk.', 'kSk.kSk.kSk.kSk.', 'kSk.kSk.kSk.kSk.', 'uUuuuUuuuuUuuuUu']
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

  return { STOPS: STOPS, ACT1: ACT1, ACT2: ACT2, ACTS: ACTS, BASE: BASE, defs: defs, bots: bots, W: W, H: H, stop: stop, index: index, setup: setup, stars: stars, record: record, starCount: starCount, total: total,
    unlocked: unlocked, current: current, next: next, actOf: actOf, actStops: actStops, inAct: inAct, actStars: actStars, actDone: actDone, mapURL: mapURL, sprite: sprite, spriteW: function (n) { return SPRITES[n][0].length; }, walker: walker, star: star };
})();
if (typeof module !== 'undefined') module.exports = CSCampaign;
