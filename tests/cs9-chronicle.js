// The chronicle: one entry per turn with every player's total, so the end screen can draw the game's story.
const D = require('../src/data.js'), E = require('../src/engine.js'), B = require('../src/bots.js');
let pass = 0, fail = 0; const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL | ' + m); } };
for (const n of [2, 3]) {
  const strats = ['tactician', 'raider', 'greedy'].slice(0, n), ARCH = ['Archbishop', 'Warmonger', 'Cryptkeeper'];
  let st = E.newGame(D.STARTER, { players: strats.map((s, i) => ({ name: 'P' + i, arch: ARCH[i] })), seed: 77 + n, contest: true }), k = 0;
  ok(st.chron && st.chron.length === 1 && st.chron[0].r === 0, n + 'p: the chronicle starts with the seat handicap');
  while (st.winner == null && k++ < 400) st = st.pending ? B.resolve(st, st.cur, strats[st.cur], strats) : B.turn(st, B.newStats(), strats);
  const c = st.chron, last = c[c.length - 1], sc = E.scores(st).map(s => s.total);
  ok(st.winner != null, n + 'p: the game ends');
  ok(c.length > 2 * n, n + 'p: one entry per turn (' + c.length + ')');
  ok(c.every(e => e.t.length === n), n + 'p: every entry has every player');
  ok(last.t.every((t, i) => t === sc[i]), n + 'p: the last entry is the final score');
  ok(c.slice(1).every((e, i) => e.p === (c[i].p + 1) % n || c[i].p === -1), n + 'p: entries follow the seats in order');
  ok(c.every(e => e.ev.every(x => typeof x === 'string' && !/ at -?\d+,/.test(x))), n + 'p: events are plain sentences');
}
console.log(pass + '/' + (pass + fail) + ' pass'); if (fail) process.exit(1);
