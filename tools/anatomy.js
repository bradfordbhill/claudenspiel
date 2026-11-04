// The anatomy of a game: bot self-play that records every turn, for questioning the game's foundations.
// Per turn: ◇ and ● before and after, ● left unspent, legal plays on offer, cards in hand (and dead ones), meeples,
// claims made, Ruins; per game: the winner and the scores at every round.
// Usage: node tools/anatomy.js players firstGame lastGame out.json   (SECS=seconds caps the run)
const D = require('../src/data.js'), E = require('../src/engine.js'), B = require('../src/bots.js'), fs = require('fs');
const ARCH = ['Archbishop', 'Hedonist', 'Warmonger', 'Cryptkeeper', 'Gardener', 'Philosopher'], ST = ['greedy', 'tactician', 'raider'];
const [n, from, to, out] = [+process.argv[2], +process.argv[3], +process.argv[4], process.argv[5]];
const games = [], t0 = Date.now();
for (let g = from; g < to && Date.now() - t0 < (+process.env.SECS || 300) * 1000; g++) {
  const archs = []; for (let i = 0; i < n; i++) archs.push(ARCH[(g + i * 2) % 6]);
  if (new Set(archs).size < n) continue;
  const strats = archs.map((a, i) => ST[(g + i) % 3]);
  let st = E.newGame(D.STARTER, { players: archs.map((a, i) => ({ name: 'P' + i, arch: a })), seed: 9000 + g, flatIncome: +process.env.FLAT || 0, audits: +process.env.AUDITS || 0, seasons: +process.env.SEASONS || 0, seasonLength: +process.env.SEASONLEN || 2, seasonRelease: !!process.env.RELEASE });
  const turns = [], rounds = []; let guard = 0, lastRound = 0;
  while (st && st.winner == null && st.round <= 30 && guard++ < 400) {
    if (st.pending) { st = B.resolve(st, st.cur, strats[st.cur], strats); continue; }
    if (st.round !== lastRound) { rounds.push(E.scores(st).map(s => s.total)); lastRound = st.round; }
    const p = st.cur, before = E.scores(st)[p].total, log0 = st.log.length;
    let s1 = E.apply(st, { t: 'startTurn' }); if (s1.error) { st = B.turn(st, B.newStats(), strats); continue; }
    const pl = s1.players[p], hand = pl.hand.filter(u => u !== pl.foundationUid);
    const playable = hand.filter(u => !E.playBlock(s1, p, u)), cash = E.funds(pl);
    const affordable = playable.filter(u => { const d = E.rawDef(s1, u); if (!E.needsPlacement(d)) return (+d.cost || 0) <= cash; const L = E.legalCells(s1, u); return Object.values(L).some(c => c <= cash); });
    const options = playable.reduce((a, u) => { const d = E.rawDef(s1, u); if (!E.needsPlacement(d)) return a + 1; const L = E.legalCells(s1, u); return a + Object.values(L).filter(c => c <= cash).length; }, 0);
    const ap0 = pl.ap;
    const s2 = B.turn(st, B.newStats(), strats); if (!s2) break;
    const L = s2.log.slice(log0), mine = l => l.indexOf('P' + p + ' ') === 0;
    turns.push({ p, round: st.round, before, after: E.scores(s2)[p].total, ap: ap0, left: (L.filter(l => /banks/.test(l)).length ? null : null),
      unspent: null, hand: hand.length, dead: hand.length - playable.length, affordable: affordable.length, options,
      plays: L.filter(l => mine(l) && / plays /.test(l)).length, claims: L.filter(l => mine(l) && / claims /.test(l)).length,
      ruins: L.filter(l => / is (Ruined|Overwhelmed) by P/.test(l)).length, meeples: s2.players[p].meeples, banked: L.some(l => mine(l) && / banks /.test(l)) });
    st = s2;
  }
  if (!st || st.winner == null) continue;
  games.push({ g, n, archs, strats, winner: st.winner, final: st.opts.seasons ? st.players.map(q => q.tokens) : E.scores(st).map(s => s.total), rounds, turns });
}
fs.writeFileSync(out, JSON.stringify(games)); console.log('done', games.length);
