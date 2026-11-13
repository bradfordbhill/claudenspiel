// Mausoleum: 3◇ per card buried in your Kingdom, and 1◇ for every two buried anywhere else on the board.
const D = require('../src/data.js'), E = require('../src/engine.js'), B = require('../src/bots.js');
let pass = 0, fail = 0; const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL | ' + m); } };
const maus = D.STARTER.find(c => c.id === 'mausoleum');
ok(maus.score.n === 3 && maus.score.o === 0.5, 'Mausoleum scores 3 per own buried card and ½ per other');
ok(/every two buried cards elsewhere/.test(maus.text), 'its text says so');
let seen = 0, right = 0, sawOther = 0;
for (let seed = 1; seed <= 6; seed++) {
  const strats = ['tactician', 'greedy', 'raider', 'greedy'], ARCH = ['Cryptkeeper', 'Archbishop', 'Warmonger', 'Hedonist'];
  let st = E.newGame(D.STARTER, { players: ARCH.map((a, i) => ({ name: 'P' + i, arch: a })), seed: 900 + seed, contest: true }), k = 0;
  while (st.winner == null && k++ < 400) {
    st = st.pending ? B.resolve(st, st.cur, strats[st.cur], strats) : B.turn(st, B.newStats(), strats);
    const mk = E.keys(st).find(x => { const u = E.top(st, x); return u && st.cards[u].def === 'mausoleum' && !st.cards[u].ruined; });
    if (!mk) continue;
    const kd = E.kingdom(st, 0), buried = x => st.board[x].length - 1;
    const own = kd.reduce((a, x) => a + buried(x), 0), other = E.keys(st).filter(x => kd.indexOf(x) < 0).reduce((a, x) => a + buried(x), 0);
    seen++; if (other > 1) sawOther++;
    if (E.cardValue(st, mk, 0) === 3 * own + Math.floor(other / 2)) right++;
  }
}
ok(seen > 30 && sawOther > 5, 'the games bury cards on both sides (' + seen + ' checks, ' + sawOther + ' with others buried)');
ok(right === seen, 'Mausoleum is worth 3 × own + ⌊others ÷ 2⌋ at every step (' + right + '/' + seen + ')');
console.log(pass + '/' + (pass + fail) + ' pass'); if (fail) process.exit(1);
