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
    var foc = fk ? E.overwhelmCount(st, fk) : null, suits = {}; kd.forEach(function (k) { suits[E.suitOf(st, E.top(st, k))] = 1; });
    var others = st.players.map(function (q, i) { return i; }).filter(function (i) { return i !== p; });
    var second = others.length ? Math.max.apply(null, others.map(function (i) { return sc[i].total; })) : 0;
    return {
      won: st.winner === p, arch: pl.arch, total: sc[p].total, margin: sc[p].total - second, round: st.round,
      bots: others.filter(function (i) { return st.players[i].bot; }).map(function (i) { return st.players[i].bot; }),
      players: st.players.length, kingdom: kd.length, suits: Object.keys(suits).length,
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
  // Record the finished game st in book ({ deeds: {id: {at, by, arch}}, wins: {arch: n}, games: n }) for every
  // human seat; returns the deeds earned for the first time, as [{ deed, by }].
  function award(st, book) {
    var fresh = [];
    if (st.winner == null) return fresh;
    book.deeds = book.deeds || {}; book.wins = book.wins || {}; book.games = (book.games || 0) + 1;
    st.players.forEach(function (pl, p) {
      if (pl.bot) return;
      var g = facts(st, p);
      if (g.won) book.wins[g.arch] = (book.wins[g.arch] || 0) + 1;
      L.forEach(function (d) { if (!book.deeds[d.id] && d.check(g, book)) { book.deeds[d.id] = { at: Date.now(), by: pl.name, arch: pl.arch }; fresh.push({ deed: d, by: pl.name }); } });
    });
    return fresh;
  }
  return { LIST: L, award: award, facts: facts };
})();
if (typeof module !== 'undefined') module.exports = KDeeds;
