// Rules + balance check: node claudenspiel/test/sim.js [games]
const E = require('../engine.js'), B = require('../bot.js');
const games = +process.argv[2] || 200;
let fail = 0; const ok = (c, m) => { if (!c) { fail++; console.log('FAIL', m); } };
const wins = {}, seat = [0, 0], lens = [], pts = [];
const houses = Object.keys(E.HOUSES);
for (let g = 0; g < games; g++) {
  let s = E.newGame({ seed: g + 1 }), guard = 0;
  const m = (g * 7919) % 1e9; let r = m;
  const rnd = () => ((r = (r * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  while (!s.over && guard++ < 3000) {
    for (const a of B.planTurn(s, rnd)) {
      const legal = E.legalActions(s);
      ok(legal.some(l => JSON.stringify(l) === JSON.stringify(a)), 'bot plays a legal action ' + JSON.stringify(a));
      s = E.apply(s, a);
      if (s.over) break;
    }
    for (let p = 0; p < 2; p++) {
      const P = s.players[p], n = P.deck.length + P.hand.length + P.discard.length + s.grid.filter(c => c && c.o === p).length;
      ok(n === 10 + s.bought[p], `card conservation p${p} game ${g}`);
    }
  }
  ok(s.over, 'game ' + g + ' terminates');
  const w = s.winner; seat[w]++; lens.push(s.round); pts.push(s.scores[0].total + s.scores[1].total);
  const k = s.players[w].house; wins[k] = (wins[k] || 0) + 1;
  s.players.forEach(P => { wins['_p_' + P.house] = (wins['_p_' + P.house] || 0) + 1; });
}
console.log('games', games, '| seat wins (1st/2nd)', seat.join('/'));
houses.forEach(h => console.log(h.padEnd(8), 'win rate', ((wins[h] || 0) / (wins['_p_' + h] || 1) * 100).toFixed(0) + '%', `(${wins[h] || 0}/${wins['_p_' + h] || 0})`));
console.log('avg rounds', (lens.reduce((a, b) => a + b) / games).toFixed(1), '| avg total VP', (pts.reduce((a, b) => a + b) / games).toFixed(1));
console.log(fail ? fail + ' FAILURES' : 'PASS');
process.exit(fail ? 1 : 0);
