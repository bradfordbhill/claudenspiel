// Skill expression: how often the stronger player wins the same deal. Each deal is played twice, with seat X played by
// style A (default genius) and then by style B (default tactician); every other seat is a tactician. Reports A's and B's
// win rates in seat X and the paired difference.
// Usage: node tools/skill.js players firstDeal lastDeal out.json   (A, B pick the styles; OPTS='{"market":3}' sets rules;
// SECS caps the run; the Genius runs without a time limit, so results don't depend on how busy the machine is)
const D = require('../src/data.js'), E = require('../src/engine.js'), B = require('../src/bots.js'), fs = require('fs');
B.GENIUS.budget = 1e9; if (process.env.RACE) Object.assign(B.RACE, JSON.parse(process.env.RACE)); if (process.env.GWORLDS) B.GENIUS.worlds = +process.env.GWORLDS; if (process.env.GLINES) B.GENIUS.lines = +process.env.GLINES; if (process.env.GENIUS) Object.assign(B.GENIUS, JSON.parse(process.env.GENIUS));
const ARCH = ['Archbishop', 'Hedonist', 'Warmonger', 'Cryptkeeper', 'Gardener', 'Philosopher'];
const [n, from, to, out] = [+process.argv[2], +process.argv[3], +process.argv[4], process.argv[5]];
const SA = process.env.A || 'genius', SB = process.env.B || 'tactician', OPTS = JSON.parse(process.env.OPTS || '{}');
function play(g, style) {
  const archs = []; for (let i = 0; i < n; i++) archs.push(ARCH[(g + i * 2 + Math.floor(g / 6)) % 6]);
  const xs = g % n, strats = archs.map((a, i) => i === xs ? style : 'tactician');
  let st = E.newGame(D.STARTER, Object.assign({ players: archs.map((a, i) => ({ name: 'P' + i, arch: a })), seed: 30000 + g }, OPTS)), k = 0;
  while (st && st.winner == null && st.round <= 30 && k++ < 400) st = st.pending ? B.resolve(st, st.cur, strats[st.cur], strats) : B.turn(st, B.newStats(), strats);
  return { arch: archs[xs], win: st && st.winner === xs ? 1 : 0 };
}
const res = [], t0 = Date.now();
for (let g = from; g < to && Date.now() - t0 < (+process.env.SECS || 600) * 1000; g++) {
  const archs = []; for (let i = 0; i < n; i++) archs.push(ARCH[(g + i * 2 + Math.floor(g / 6)) % 6]); if (new Set(archs).size < n) continue;
  res.push({ g, a: play(g, SA), b: play(g, SB) }); fs.writeFileSync(out, JSON.stringify(res));
}
console.log('done', res.length);
