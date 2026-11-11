/* Claudenspiel engine — pure rules, no DOM. apply(state, action) -> new state. */
(function (root) {
  'use strict';
  const DOWRY = 2, N = 5, CELLS = N * N, HAND = 5, MAX_ROUND = 22;
  const SUITS = ['Leaf', 'Ember', 'Tide', 'Gild'];
  const GLYPH = { Leaf: '❧', Ember: '✺', Tide: '≋', Gild: '♛', Plain: '◈' };

  // c=cost, g=coin when held in hand, vp=flat end VP, inc=income each turn while on the Realm,
  // on={draw,coins,raze(max cost)}, end={k:kind,n}, flow=Tide "Ferry" ignores adjacency.
  const CARDS = {
    farthing: { n: 'Farthing', s: 'Plain', c: 0, g: 1, t: 'A humble coin. Placed, it is only a hovel.', basic: 1 },
    settler: { n: 'Settler', s: 'Plain', c: 2, g: 1, vp: 1, t: 'Worth 1◇ if you settle it.', basic: 1 },
    silver: { n: 'Silver Mark', s: 'Plain', c: 3, g: 2, t: 'Pure coin.', basic: 1, unlimited: 1 },
    gold: { n: 'Gold Mark', s: 'Plain', c: 6, g: 3, t: 'Heavy coin.', basic: 1, unlimited: 1 },
    sapling: { n: 'Sapling', s: 'Leaf', c: 2, g: 1, end: { k: 'adjSame', n: 1 }, t: 'End: +1◇ per adjacent Leaf.' },
    wildling: { n: 'Wildling', s: 'Leaf', c: 3, g: 1, on: { draw: 2 }, t: 'Placed: draw 2 cards.' },
    orchard: { n: 'Orchard', s: 'Leaf', c: 4, g: 1, inc: 1, vp: 1, t: '+1 coin each turn. 1◇.' },
    greatwood: { n: 'Greatwood', s: 'Leaf', c: 6, g: 0, vp: 2, end: { k: 'adjSame', n: 2 }, t: '2◇. End: +2◇ per adjacent Leaf.' },
    torch: { n: 'Torch', s: 'Ember', c: 3, g: 1, on: { raze: 3 }, t: 'Placed: raze an adjacent enemy card costing ≤3 (it returns to their discard).' },
    pyre: { n: 'Pyre', s: 'Ember', c: 2, g: 2, on: { coins: 2 }, t: 'Placed: +2 coins now.' },
    forge: { n: 'Forge', s: 'Ember', c: 4, g: 1, inc: 2, t: '+2 coins each turn.' },
    warband: { n: 'Warband', s: 'Ember', c: 5, g: 2, vp: 1, end: { k: 'adjEnemy', n: 1 }, t: '1◇. End: +1◇ per adjacent enemy card.' },
    ferry: { n: 'Ferry', s: 'Tide', c: 3, g: 1, vp: 1, flow: 1, t: 'Flows: may be placed anywhere. 1◇.' },
    fisher: { n: 'Fisher', s: 'Tide', c: 3, g: 1, inc: 1, on: { draw: 1 }, t: 'Placed: draw 1. +1 coin each turn.' },
    lighthouse: { n: 'Lighthouse', s: 'Tide', c: 5, g: 1, vp: 1, end: { k: 'lines', n: 1 }, t: '1◇. End: +1◇ per other card in its row and column (max 4).' },
    tidepool: { n: 'Tidepool', s: 'Tide', c: 4, g: 1, end: { k: 'adjAny', n: 1 }, on: { coins: 1 }, t: 'Placed: +1 coin. End: +1◇ per adjacent card.' },
    tithe: { n: 'Tithe', s: 'Gild', c: 3, g: 2, on: { coins: 1 }, vp: 1, t: 'Placed: +1 coin. 1◇.' },
    mint: { n: 'Mint', s: 'Gild', c: 5, g: 1, incAdj: 1, t: '+1 coin each turn per adjacent card.' },
    guildhall: { n: 'Guildhall', s: 'Gild', c: 5, g: 1, end: { k: 'suits', n: 1 }, t: 'End: +1◇ per distinct suit among it and its neighbours.' },
    vault: { n: 'Vault', s: 'Gild', c: 6, g: 3, vp: 3, t: '3◇.' },
  };
  Object.keys(CARDS).forEach(k => (CARDS[k].id = k));
  const KINGDOM_POOL = Object.keys(CARDS).filter(k => !CARDS[k].basic);

  const HOUSES = {
    thorn: { n: 'House Thorn', s: 'Leaf', t: 'Your Leaf buildings yield +1 coin each turn.' },
    cinder: { n: 'House Cinder', s: 'Ember', t: 'Your Ember razes ignore the cost limit, Ember cards hold +1 coin.' },
    tide: { n: 'House Tidewright', s: 'Tide', t: 'The first Tide card costing 3 or less that you place each turn is free, but your Tide cards hold 1 less coin and you pay 1 more for Tide cards.' },
    gilded: { n: 'House Gilded', s: 'Gild', t: 'You collect +2 coins at the start of every turn, your first purchase each turn costs 1 less.' },
  };

  function mulberry(s) { s.rng = (s.rng + 0x6D2B79F5) | 0; let t = Math.imul(s.rng ^ (s.rng >>> 15), 1 | s.rng); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
  function shuffle(s, a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(mulberry(s) * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function buyCost(s, p, id) { const d = CARDS[id], h = s.players[p].house; return Math.max(0, d.c - (h === 'gilded' && !s.discUsed ? 1 : 0) + (h === 'tide' && d.s === 'Tide' ? 1 : 0)); }
  const clone = s => JSON.parse(JSON.stringify(s));
  const adj = i => { const r = (i / N) | 0, c = i % N, o = []; if (r > 0) o.push(i - N); if (r < N - 1) o.push(i + N); if (c > 0) o.push(i - 1); if (c < N - 1) o.push(i + 1); return o; };
  const gOf = (s, p, id) => Math.max(0, CARDS[id].g + (s.players[p].house === 'cinder' && CARDS[id].s === 'Ember' ? 1 : 0) - (s.players[p].house === 'tide' && CARDS[id].s === 'Tide' ? 1 : 0));

  function newGame(opts) {
    opts = opts || {};
    const s = { rng: (opts.seed == null ? Date.now() : opts.seed) | 0, grid: new Array(CELLS).fill(null), players: [], market: {}, cur: 0, round: 1, over: false, log: [], bought: [0, 0], winner: null };
    const houses = opts.houses || shuffle(s, Object.keys(HOUSES).slice()).slice(0, 2);
    const kingdom = opts.kingdom || shuffle(s, KINGDOM_POOL.slice()).slice(0, 8);
    kingdom.sort((a, b) => CARDS[a].c - CARDS[b].c || (a < b ? -1 : 1));
    kingdom.forEach(k => (s.market[k] = 8));
    s.kingdom = kingdom;
    for (let p = 0; p < 2; p++) {
      const deck = shuffle(s, [].concat(Array(7).fill('farthing'), Array(3).fill('settler')));
      s.players.push({ house: houses[p], deck, hand: [], discard: [] });
    }
    for (let p = 0; p < 2; p++) draw(s, p, HAND);
    startTurn(s);
    return s;
  }
  function draw(s, p, n) {
    const P = s.players[p], got = [];
    while (n-- > 0) {
      if (!P.deck.length) { P.deck = shuffle(s, P.discard); P.discard = []; }
      if (!P.deck.length) break;
      const c = P.deck.pop(); P.hand.push(c); got.push(c);
    }
    return got;
  }
  function income(s, p) {
    let t = 0;
    s.grid.forEach((cell, i) => {
      if (!cell || cell.o !== p) return;
      const d = CARDS[cell.id];
      t += d.inc || 0;
      if (d.incAdj) t += adj(i).filter(j => s.grid[j]).length;
      if (s.players[p].house === 'thorn' && d.s === 'Leaf') t += 1;
    });
    return t;
  }
  function startTurn(s) {
    const p = s.cur;
    s.coins = income(s, p) + (s.players[p].house === 'gilded' ? 2 : 0) +  s.players[p].hand.reduce((a, c) => a + gOf(s, p, c), 0);
    s.placed = false; s.freeUsed = false; s.buys = 1; s.discUsed = false;
  }
  const placeable = (s, cell, id) => !s.grid[cell] && (!s.grid.some(Boolean) || CARDS[id].flow || adj(cell).some(j => s.grid[j]));
  function razeTargets(s, p, cell, id) {
    const r = CARDS[id].on && CARDS[id].on.raze; if (!r) return [];
    const lim = s.players[p].house === 'cinder' ? 99 : r;
    return adj(cell).filter(j => s.grid[j] && s.grid[j].o !== p && CARDS[s.grid[j].id].c <= lim);
  }
  function usesPlacement(s, p, id) { return !(s.players[p].house === 'tide' && CARDS[id].s === 'Tide' && CARDS[id].c <= 3 && !s.freeUsed); }

  /** Every legal action for the current player. */
  function legalActions(s) {
    if (s.over) return [];
    const p = s.cur, out = [{ t: 'end' }], seen = {};
    s.players[p].hand.forEach((id, h) => {
      if (seen[id]) return; seen[id] = 1;
      if (s.placed && usesPlacement(s, p, id)) return;
      for (let cell = 0; cell < CELLS; cell++) {
        if (!placeable(s, cell, id)) continue;
        out.push({ t: 'place', hand: h, cell });
        razeTargets(s, p, cell, id).forEach(target => out.push({ t: 'place', hand: h, cell, target }));
      }
    });
    if (s.buys > 0) {
      Object.keys(CARDS).forEach(id => {
        const d = CARDS[id]; if (id === 'farthing' || id === 'settler') return;
        if (!d.unlimited && !(s.market[id] > 0)) return;
        if (!d.unlimited && !s.kingdom.includes(id)) return;
        if (s.coins >= buyCost(s, p, id)) out.push({ t: 'buy', id });
      });
    }
    return out;
  }

  function apply(s0, a) {
    const s = clone(s0); if (s.over) throw new Error('game over');
    const p = s.cur, P = s.players[p];
    if (a.t === 'place') {
      const id = P.hand[a.hand]; if (!id) throw new Error('no such card');
      if (!placeable(s, a.cell, id)) throw new Error('illegal cell');
      const uses = usesPlacement(s, p, id);
      if (s.placed && uses) throw new Error('already placed');
      if (a.target != null && !razeTargets(s, p, a.cell, id).includes(a.target)) throw new Error('bad raze target');
      P.hand.splice(a.hand, 1); s.coins -= gOf(s, p, id);
      if (uses) s.placed = true; else s.freeUsed = true;
      s.grid[a.cell] = { id, o: p };
      const d = CARDS[id]; s.log.push([p, 'places ' + d.n]);
      if (a.target != null) { const v = s.grid[a.target]; s.players[v.o].discard.push(v.id); s.grid[a.target] = null; s.log.push([p, 'razes ' + CARDS[v.id].n]); }
      if (d.on && d.on.coins) s.coins += d.on.coins;
      if (d.on && d.on.draw) draw(s, p, d.on.draw).forEach(c => (s.coins += gOf(s, p, c)));
    } else if (a.t === 'buy') {
      const d = CARDS[a.id], cost = buyCost(s, p, a.id), disc = P.house === 'gilded' && !s.discUsed ? 1 : 0;
      if (s.buys < 1 || s.coins < cost || d.id === 'farthing' || d.id === 'settler') throw new Error('cannot buy');
      if (!d.unlimited) { if (!(s.market[a.id] > 0)) throw new Error('sold out'); s.market[a.id]--; }
      s.coins -= cost; s.buys--; if (disc) s.discUsed = true; P.discard.push(a.id); s.bought[p]++;
      s.log.push([p, 'buys ' + d.n]);
    } else if (a.t === 'end') {
      P.discard.push(...P.hand); P.hand = []; draw(s, p, HAND);
      if (p === 1) {
        const empty = s.kingdom.filter(k => s.market[k] <= 0).length;
        if (!s.grid.includes(null) || empty >= 3 || s.round >= MAX_ROUND) { s.over = true; s.scores = [score(s, 0), score(s, 1)]; s.winner = decide(s); return s; }
        s.round++;
      }
      s.cur = 1 - p; startTurn(s);
    } else throw new Error('unknown action');
    return s;
  }

  function score(s, p) {
    let flat = 0, end = 0, maj = 0; const house = s.players[p].house;
    s.grid.forEach((cell, i) => {
      if (!cell || cell.o !== p) return;
      const d = CARDS[cell.id]; flat += (d.vp || 0);
      if (!d.end) return;
      const nb = adj(i).map(j => s.grid[j]).filter(Boolean), k = d.end.k;
      if (k === 'adjSame') end += d.end.n * nb.filter(x => CARDS[x.id].s === d.s).length;
      else if (k === 'adjEnemy') end += d.end.n * nb.filter(x => x.o !== p).length;
      else if (k === 'adjAny') end += d.end.n * nb.length;
      else if (k === 'lines') { const r = (i / N) | 0, c = i % N; let m = 0; for (let j = 0; j < CELLS; j++) if (j !== i && s.grid[j] && ((j / N | 0) === r || j % N === c)) m++; end += d.end.n * Math.min(4, m); }
      else if (k === 'suits') end += d.end.n * new Set([d.s].concat(nb.map(x => CARDS[x.id].s))).size;
    });
    const q = 1 - p;
    for (let l = 0; l < N; l++) {
      let rm = 0, rq = 0, cm = 0, cq = 0;
      for (let m = 0; m < N; m++) {
        const a = s.grid[l * N + m], b = s.grid[m * N + l];
        if (a) a.o === p ? rm++ : rq++;
        if (b) b.o === p ? cm++ : cq++;
      }
      if (rm > rq) maj++; if (cm > cq) maj++;
    }
    const dowry = p === 1 ? DOWRY : 0; // the second player's dowry balances the first move
    return { flat, end, maj, dowry, total: flat + end + maj + dowry };
  }
  function decide(s) {
    const a = s.scores[0].total, b = s.scores[1].total;
    if (a !== b) return a > b ? 0 : 1;
    const n0 = s.grid.filter(c => c && c.o === 0).length, n1 = s.grid.filter(c => c && c.o === 1).length;
    return n0 > n1 ? 0 : 1; // tie: more buildings, else the second player
  }

  root.CEngine = { N, CELLS, CARDS, SUITS, GLYPH, HOUSES, KINGDOM_POOL, newGame, buyCost, apply, legalActions, score, income, adj, razeTargets, placeable, clone, gOf, MAX_ROUND };
  if (typeof module !== 'undefined') module.exports = root.CEngine;
})(typeof window !== 'undefined' ? window : globalThis);
