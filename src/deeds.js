/* Claudenspiel's Book of Deeds: achievements earned in play, checked when a game ends.
   Each deed's check(g) gets a summary of the finished game from one human seat's side (see facts()).
   Only human seats earn deeds; they are kept in this browser (cs.deeds) by ui.js. */
var KDeeds = (function () {
  var E = typeof KEngine !== 'undefined' ? KEngine : require('./engine.js');
  var GROUNDS = /^(.+) plays (Marsh|Battlefield|Crossroads) /;
  // What the deeds look at, for seat p of a finished game st.
  function facts(st, p) {
    var pl = st.players[p], me = pl.name, sc = E.scores(st), log = st.log || [], kd = E.kingdom(st, p);
    var mine = function (re) { return log.filter(function (l) { return re.test(l) && l.indexOf(me) === 0; }).length; };
    var by = function (re) { return log.filter(function (l) { return re.test(l) && l.slice(-(me.length + 1)) === me + '.'; }).length; };
    var fk = kd.filter(function (k) { return E.top(st, k) === pl.foundationUid; })[0];
    var foc = fk ? E.overwhelmCount(st, fk) : null, suits = {}; kd.forEach(function (k) { var s = E.suitOf(st, E.top(st, k)); suits[s] = (suits[s] || 0) + 1; });
    var others = st.players.map(function (q, i) { return i; }).filter(function (i) { return i !== p; });
    var second = others.length ? Math.max.apply(null, others.map(function (i) { return sc[i].total; })) : 0;
    return {
      won: st.winner === p, arch: pl.arch, total: sc[p].total, margin: sc[p].total - second, round: st.round,
      bots: others.filter(function (i) { return st.players[i].bot; }).map(function (i) { return st.players[i].bot; }),
      players: st.players.length, kingdom: kd.length, suits: Object.keys(suits).length, suitCount: suits, region: E.largestRegion ? E.largestRegion(st, p) : 0,
      buried: kd.reduce(function (a, k) { return a + st.board[k].length - 1; }, 0),
      ascended: kd.some(function (k) { return st.cards[E.top(st, k)].ascended; }),
      foundationOneAway: !!(foc && foc.th && foc.n >= foc.th - 1),
      destroyed: by(/ is (Ruined|Overwhelmed) by /), reclaimed: mine(/ takes back a meeple /),
      banked2: mine(/ banks 2◇ /), bought: mine(/ pays \d+● for a second claim/), grounds: log.filter(function (l) { var m = GROUNDS.exec(l); return m && m[1] === me; }).length,
      startedLastRound: !!(st.lastRound && st.lastRound.by === p), lastRound: !!st.lastRound
    };
  }
  var L = [
    { id: 'first', name: 'First Victory', text: 'Win a game.', check: function (g) { return g.won; } },
    { id: 'machine', name: 'Against the Machine', text: 'Beat a Genius bot.', check: function (g) { return g.won && g.bots.indexOf('genius') >= 0; } },
    { id: 'table', name: 'Master of the Table', text: 'Win against three or more bots.', check: function (g) { return g.won && g.bots.length >= 3; } },
    { id: 'pyrrhic', name: 'Pyrrhic', text: 'Win with your Foundation one enemy away from being Overwhelmed.', check: function (g) { return g.won && g.foundationOneAway; } },
    { id: 'ascend', name: 'Five Suits', text: 'Finish a game owning a stack that has Ascended.', check: function (g) { return g.ascended; } },
    { id: 'patience', name: 'Patience', text: 'Win after taking back a meeple.', check: function (g) { return g.won && g.reclaimed > 0; } },
    { id: 'grave', name: 'Grave Robber', text: 'Finish with 10 or more cards buried in your Kingdom.', check: function (g) { return g.buried >= 10; } },
    { id: 'spectrum', name: 'Full Spectrum', text: 'Finish with all six suits in your Kingdom.', check: function (g) { return g.suits >= 6; } },
    { id: 'landlord', name: 'Landlord', text: 'Finish owning 12 or more cards.', check: function (g) { return g.kingdom >= 12; } },
    { id: 'conqueror', name: 'Conqueror', text: 'Ruin or Overwhelm 5 cards in one game.', check: function (g) { return g.destroyed >= 5; } },
    { id: 'peace', name: 'Peacemaker', text: 'Win without Ruining or Overwhelming a single card.', check: function (g) { return g.won && g.destroyed === 0; } },
    { id: 'usurer', name: 'Usurer', text: 'Bank the full 2◇ on four turns of one game.', check: function (g) { return g.banked2 >= 4; } },
    { id: 'greedy', name: 'Two Hands', text: 'Buy a second claim three times in one game.', check: function (g) { return g.bought >= 3; } },
    { id: 'land', name: 'Terraformer', text: 'Play three Grounds cards in one game.', check: function (g) { return g.grounds >= 3; } },
    { id: 'photo', name: 'Photo Finish', text: 'Win the last round by 2◇ or less.', check: function (g) { return g.won && g.lastRound && g.margin <= 2; } },
    { id: 'comeback', name: 'Comeback', text: 'Win a last round that someone else started.', check: function (g) { return g.won && g.lastRound && !g.startedLastRound; } },
    { id: 'swift', name: 'Swift', text: 'Win by the end of round 5.', check: function (g) { return g.won && g.round <= 5; } },
    { id: 'seventy', name: 'Overflowing', text: 'Finish with 70◇ or more.', check: function (g) { return g.total >= 70; } },
    { id: 'six', name: 'Six Crowns', text: 'Win with every archetype.', progress: true, check: function (g, book) { return Object.keys(book.wins || {}).length >= 6; } }
  ];
  // Archetype mastery: ten levels per archetype, earned by playing it. Each finished game as an archetype is worth
  // 1 mark, a win 2 more, and reaching the archetype's goal (its fantasy, not its score) 2 more. Levels unlock a
  // title and the archetype's strategy notes; they never make anyone stronger at the table.
  var LEVELS = [2, 5, 9, 14, 20, 27, 35, 44, 54, 65];
  var M = {
    Archbishop: { goal: 'Finish with 4 or more Sceptre cards in your Kingdom.', met: function (g) { return (g.suitCount.Sceptre || 0) >= 4; },
      titles: ['Novice', 'Deacon', 'Bishop', 'Prince of the Church'],
      notes: ['Cathedral pays for every Sceptre card on the board you don\u2019t own, too: a rival\u2019s Sceptre card next door is half a gift.', 'Turned-in Curses come to your hand. Hold them for the turn a rival lays a big card beside yours.', 'Tome and Sword cards count against your Sceptre cards. Build in a tight block so few sides face open ground.'] },
    Hedonist: { goal: 'Finish with 5 or more Goblet cards in your Kingdom.', met: function (g) { return (g.suitCount.Goblet || 0) >= 5; },
      titles: ['Taster', 'Reveller', 'Host', 'Lord of Misrule'],
      notes: ['Palace counts Goblet cards it doesn\u2019t own as well. Feed rivals cheap Goblets and the Palace still drinks.', 'Bank the surplus: each 6\u25cf left unspent becomes 1\u25c7, up to 2\u25c7 a turn. A rich turn with nothing to buy still scores.', 'At big tables the Palace grows with the board. Play the long game at 4 players and the short one at 2.'] },
    Warmonger: { goal: 'Ruin or Overwhelm 4 or more cards.', met: function (g) { return g.destroyed >= 4; },
      titles: ['Recruit', 'Sergeant', 'Captain', 'Warlord'],
      notes: ['Every Ruin and Overwhelm pays the Warcamp, and its Reserves buy the next war.', 'A Battlefield beside a rival\u2019s card makes it one enemy easier to Overwhelm. Plant it, then wait.', 'Contest the card you can\u2019t break: 8\u25cf takes it whole.'] },
    Cryptkeeper: { goal: 'Finish with 7 or more cards buried in your Kingdom.', met: function (g) { return g.buried >= 7; },
      titles: ['Gravedigger', 'Sexton', 'Undertaker', 'Keeper of the Dead'],
      notes: ['Actions and Blessings are buried once played. Every one you play is a point waiting underground.', 'Mausoleum also counts the dead under other people\u2019s cards, one \u25c7 for every two. The busier the table, the better.', 'With contest on, your dead follow you home: a contested card leaves its crypt under your Foundation.'] },
    Gardener: { goal: 'Finish with a region of 7 or more connected cards.', met: function (g) { return g.region >= 7; },
      titles: ['Weeder', 'Grower', 'Orchardist', 'Green Sovereign'],
      notes: ['Orchard counts only your largest region. One great garden beats three small ones.', 'Each Leaf card in that region adds a \u25c7 more. A Fountain among Leaves is worth 3\u25c7 a neighbour.', 'A Marsh beside your garden makes it one enemy harder to Overwhelm. Gardens grow best by water.'] },
    Philosopher: { goal: 'Finish with five or more suits in your Kingdom.', met: function (g) { return g.suits >= 5; },
      titles: ['Student', 'Scholar', 'Magister', 'Sage of the Six'],
      notes: ['Observatory adds 10\u25c7 the moment all six suits are in your Kingdom. The sixth suit is worth two of the others.', 'Keep a card of each suit you lack, and recolour toward the gaps rather than away from them.', 'Sword is your weakness, and six suits leave many sides open. Keep the Foundation at the heart of the Kingdom.'] }
  };
  function level(xp) { var l = 0; while (l < LEVELS.length && xp >= LEVELS[l]) l++; return l; }
  // What a level means: its title (levels 1, 4, 7 and 10 each bring one) and how many strategy notes are open (at 2, 5, 8).
  function rank(arch, xp) { var m = M[arch], l = level(xp || 0); if (!m) return null;
    return { level: l, xp: xp || 0, next: l < LEVELS.length ? LEVELS[l] : null, prev: l ? LEVELS[l - 1] : 0, title: l >= 10 ? m.titles[3] : l >= 7 ? m.titles[2] : l >= 4 ? m.titles[1] : l >= 1 ? m.titles[0] : null, notes: m.notes.slice(0, l >= 8 ? 3 : l >= 5 ? 2 : l >= 2 ? 1 : 0), goal: m.goal }; }
  // Marks seat p earns from finished game st: [{ why, n }].
  function marks(st, p) { var g = facts(st, p), m = M[g.arch], out = [{ why: 'played', n: 1 }]; if (!m) return out;
    if (g.won) out.push({ why: 'won', n: 2 }); if (m.met(g)) out.push({ why: 'goal', n: 2 }); return out; }
  // Record the finished game st in book ({ deeds: {id: {at, by, arch}}, wins: {arch: n}, games: n }) for every
  // human seat; returns the deeds earned for the first time, as [{ deed, by }].
  function award(st, book) {
    var fresh = [];
    if (st.winner == null) return fresh;
    book.deeds = book.deeds || {}; book.wins = book.wins || {}; book.games = (book.games || 0) + 1; book.lastMastery = [];
    st.players.forEach(function (pl, p) {
      if (pl.bot) return;
      var g = facts(st, p);
      if (g.won) book.wins[g.arch] = (book.wins[g.arch] || 0) + 1;
      L.forEach(function (d) { if (!book.deeds[d.id] && d.check(g, book)) { book.deeds[d.id] = { at: Date.now(), by: pl.name, arch: pl.arch }; fresh.push({ deed: d, by: pl.name }); } });
      if (M[g.arch]) { book.mastery = book.mastery || {}; var before = level(book.mastery[g.arch] || 0), got = marks(st, p).reduce(function (a, x) { return a + x.n; }, 0);
        book.mastery[g.arch] = (book.mastery[g.arch] || 0) + got; var after = level(book.mastery[g.arch]);
        book.lastMastery = book.lastMastery || []; book.lastMastery.push({ by: pl.name, arch: g.arch, got: got, from: before, to: after, goal: M[g.arch].met(g) }); }
    });
    return fresh;
  }
  return { LIST: L, award: award, facts: facts, MASTERY: M, LEVELS: LEVELS, level: level, rank: rank, marks: marks };
})();
if (typeof module !== 'undefined') module.exports = KDeeds;
