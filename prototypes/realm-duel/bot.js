/* Claudenspiel bot: one-ply lookahead over placements, then a value-based buy. */
(function (root) {
  'use strict';
  const E = typeof require !== 'undefined' ? require('./engine.js') : root.CEngine;
  const { CARDS } = E;

  function evalBoard(s, p) {
    const w = Math.max(0.4, 4.2 - s.round * 0.22);
    const a = E.score(s, p).total, b = E.score(s, 1 - p).total;
    return a - b + w * (E.income(s, p) - 0.6 * E.income(s, 1 - p));
  }
  function buyValue(s, p, id) {
    const d = CARDS[id], late = s.round >= 12, w = Math.max(0.4, 4.2 - s.round * 0.22);
    let v = d.c * 0.9 + (d.inc || 0) * w + (d.incAdj ? 1.5 * w : 0) + (d.vp || 0) * (late ? 2.2 : 1) + (d.end ? (late ? 3 : 1.5) : 0) + (d.on ? 0.8 : 0);
    if (id === 'silver' && s.round > 10) v -= 3;
    if (id === 'gold' && s.round > 14) v -= 3;
    if (s.players[p].house === 'thorn' && d.s === 'Leaf') v += 1.2;
    if (s.players[p].house === 'cinder' && d.s === 'Ember') v += 1.2;
    if (s.players[p].house === 'tide' && d.s === 'Tide') v += 1.2;
    if (s.players[p].house === 'gilded' && d.s === 'Gild') v += 1.2;
    return v;
  }
  function bestBuy(s, p) {
    let best = null, bv = 0;
    E.legalActions(s).filter(a => a.t === 'buy').forEach(a => { const v = buyValue(s, p, a.id); if (v > bv) { bv = v; best = a; } });
    return { a: best, v: bv };
  }
  function planTurn(s0, rnd) {
    rnd = rnd || Math.random;
    let s = s0; const p = s.cur, plan = [];
    const places = E.legalActions(s).filter(a => a.t === 'place');
    let bestA = null, bestV = evalBoard(s, p) + 0.5 * bestBuy(s, p).v;
    places.forEach(a => {
      const n = E.apply(s, a);
      const v = evalBoard(n, p) + 0.5 * bestBuy(n, p).v + rnd() * 0.3;
      if (v > bestV) { bestV = v; bestA = a; }
    });
    if (bestA) { plan.push(bestA); s = E.apply(s, bestA);
      // a free Tide placement may leave the normal placement unused: try once more
      const again = E.legalActions(s).filter(a => a.t === 'place');
      let b2 = null, v2 = evalBoard(s, p);
      again.forEach(a => { const v = evalBoard(E.apply(s, a), p); if (v > v2) { v2 = v; b2 = a; } });
      if (b2) { plan.push(b2); s = E.apply(s, b2); }
    }
    const buy = bestBuy(s, p);
    if (buy.a && buy.v > 2) plan.push(buy.a);
    plan.push({ t: 'end' });
    return plan;
  }
  root.CBot = { planTurn, evalBoard };
  if (typeof module !== 'undefined') module.exports = root.CBot;
})(typeof window !== 'undefined' ? window : globalThis);
