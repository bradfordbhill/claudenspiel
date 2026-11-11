(function () {
  'use strict';
  const E = CEngine, B = CBot, C = E.CARDS, $ = s => document.querySelector(s);
  let s = null, sel = null, raze = null, busy = false, me = 0;
  const esc = x => String(x).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  function cardHTML(id, o) {
    o = o || {}; const d = C[id];
    const st = [d.g ? `<span title="coin in hand">●${d.g}</span>` : '', d.vp ? `<span title="victory">◇${d.vp}</span>` : '', d.inc ? `<span title="income">⚒${d.inc}</span>` : ''].join('');
    return `<div class="card ${d.s}${o.o != null ? ' owned o' + o.o : ''}${o.cls ? ' ' + o.cls : ''}" data-id="${id}" title="${esc(d.n + ' — ' + d.t)}">
      <span class="cost">${d.c}</span><div class="nm">${esc(d.n)}</div><div class="art">${E.GLYPH[d.s]}</div><div class="tx">${esc(d.t)}</div><div class="st">${st}</div>${o.cnt != null ? `<span class="cnt">${o.cnt}</span>` : ''}</div>`;
  }
  function title() {
    $('#app').innerHTML = `<div class="title"><h1>Claudenspiel</h1>
    <p>A duel of tableaux on a shared Realm. Place cards to claim land, buy cards to grow your deck, and rule more rows and columns than your rival.</p>
    <h3>Choose your House</h3><div class="houses">${Object.keys(E.HOUSES).map(k => `<div class="house" data-h="${k}"><div class="gl" style="color:var(--${E.HOUSES[k].s})">${E.GLYPH[E.HOUSES[k].s]}</div><h3>${E.HOUSES[k].n}</h3><p>${esc(E.HOUSES[k].t)}</p></div>`).join('')}</div>
    <details open style="max-width:640px;margin:auto;text-align:left"><summary>How to play</summary>
    <p><b>Your turn:</b> (1) <b>Place</b> one card from your hand onto the Realm, next to any existing card (Ferry may go anywhere). It stays there, scoring and producing income. (2) <b>Buy</b> one card from the market with your coins: coins come from the ● on cards still in your hand, plus income from your buildings. (3) End turn: discard your hand, draw 5.</p>
    <p><b>Scoring (end):</b> ◇ on your buildings, their End bonuses, and +1◇ for every row and column where you have more cards than your rival. The second player gets a 2◇ dowry. The game ends after a round when the Realm is full, three market piles are empty, or round ${E.MAX_ROUND}.</p></details></div>`;
    document.querySelectorAll('.house').forEach(el => el.onclick = () => start(el.dataset.h));
  }
  function start(h) {
    const keys = Object.keys(E.HOUSES).filter(k => k !== h), bot = keys[Math.floor(Math.random() * keys.length)];
    me = Math.random() < .5 ? 0 : 1; const hs = me === 0 ? [h, bot] : [bot, h];
    s = E.newGame({ houses: hs }); sel = raze = null; render(); maybeBot();
  }
  function render() {
    const p = s.cur, mine = p === me && !s.over, sc = [E.score(s, 0), E.score(s, 1)];
    const legal = mine ? E.legalActions(s) : [], cells = {};
    if (mine && sel != null && !raze) legal.filter(a => a.t === 'place' && a.hand === sel && a.target == null).forEach(a => (cells[a.cell] = 1));
    const tg = raze ? raze.targets : [];
    const grid = s.grid.map((c, i) => `<div class="cell${cells[i] ? ' legal' : ''}${tg.includes(i) ? ' target' : ''}" data-i="${i}">${c ? cardHTML(c.id, { o: c.o }) : ''}</div>`).join('');
    const market = s.kingdom.concat(['silver', 'gold']).map(id => {
      const n = C[id].unlimited ? '∞' : s.market[id], can = mine && s.buys > 0 && s.coins >= E.buyCost(s, p, id) && (n === '∞' || n > 0);
      return `<div data-buy="${id}">${cardHTML(id, { cnt: n, cls: can ? '' : 'no' })}</div>`;
    }).join('');
    const pl = q => { const P = s.players[q], H = E.HOUSES[P.house]; return `<div class="pl p${q}${s.cur === q && !s.over ? ' turn' : ''}"><b>${q === me ? 'You' : 'Rival'}</b> · ${H.n} ${E.GLYPH[H.s]}<div class="sc">${sc[q].total}◇</div><small>buildings ${sc[q].flat}+${sc[q].end} · rows/cols ${sc[q].maj}${q === 1 ? ' · dowry ' + sc[q].dowry : ''}</small><small>deck ${P.deck.length} · discard ${P.discard.length} · hand ${P.hand.length} · income ${E.income(s, q)}</small></div>`; };
    const hand = s.players[me].hand.map((id, i) => `<div data-h="${i}">${cardHTML(id, { cls: sel === i ? 'sel' : '' })}</div>`).join('');
    $('#app').innerHTML = `<div class="layout">
      <div class="panel"><h3>Market</h3><div class="market">${market}</div></div>
      <div><div class="msg" id="msg">${msg()}</div><div class="grid">${grid}</div>
        <div class="bar"><span class="coin">● ${mine ? s.coins : '—'} coins</span><span>${mine ? (s.placed ? 'placed ✓' : 'place a card') : ''} · ${mine ? (s.buys ? 'buy: 1 left' : 'bought ✓') : ''}</span>
        ${raze ? '<button id="noraze" class="ghost">Don’t raze</button>' : ''}<button id="end" ${mine ? '' : 'disabled'}>End turn</button></div>
        <div class="hand">${hand}</div></div>
      <div><div class="panel">${pl(0)}${pl(1)}<small>Round ${s.round}/${E.MAX_ROUND}</small></div>
        <div class="panel" style="margin-top:10px"><h3>Chronicle</h3><div class="log">${s.log.slice(-40).reverse().map(l => `<div style="color:${l[0] === me ? 'var(--p0)' : '#c8a8ff'}">${l[0] === me ? 'You' : 'Rival'} ${esc(l[1])}</div>`).join('')}</div></div>
        <p><button class="ghost" id="new">New game</button></p></div></div>`;
    bind();
    if (s.over) over();
  }
  function msg() {
    if (s.over) return 'The Realm has been divided.';
    if (s.cur !== me) return 'The rival schemes…';
    if (raze) return 'Choose an enemy card to raze.';
    if (sel != null) return 'Choose a glowing cell for ' + C[s.players[me].hand[sel]].n + '.';
    return 'Select a card from your hand to place, or buy from the market.';
  }
  function bind() {
    document.querySelectorAll('[data-h]').forEach(el => el.onclick = () => { if (s.cur !== me || busy || raze) return; sel = sel === +el.dataset.h ? null : +el.dataset.h; render(); });
    document.querySelectorAll('.cell').forEach(el => el.onclick = () => cellClick(+el.dataset.i));
    document.querySelectorAll('[data-buy]').forEach(el => el.onclick = () => go({ t: 'buy', id: el.dataset.buy }));
    $('#end').onclick = () => { sel = raze = null; go({ t: 'end' }); };
    $('#new').onclick = title; const nr = $('#noraze'); if (nr) nr.onclick = () => { const r = raze; raze = null; go({ t: 'place', hand: r.hand, cell: r.cell }); };
  }
  function cellClick(i) {
    if (s.cur !== me || busy) return;
    if (raze) { if (raze.targets.includes(i)) { const r = raze; raze = null; go({ t: 'place', hand: r.hand, cell: r.cell, target: i }); } return; }
    if (sel == null) return;
    const id = s.players[me].hand[sel];
    if (!E.placeable(s, i, id)) return;
    const tg = E.razeTargets(s, me, i, id);
    if (tg.length) { raze = { hand: sel, cell: i, targets: tg }; sel = null; render(); return; }
    const h = sel; sel = null; go({ t: 'place', hand: h, cell: i });
  }
  function go(a) {
    if (busy) return;
    try { s = E.apply(s, a); } catch (e) { return; }
    sel = null; render(); maybeBot();
  }
  function maybeBot() {
    if (s.over || s.cur === me) return; busy = true;
    const plan = B.planTurn(s); let k = 0;
    const step = () => { s = E.apply(s, plan[k++]); render(); if (!s.over && s.cur !== me && k < plan.length) setTimeout(step, 750); else busy = false; };
    setTimeout(step, 700);
  }
  function over() {
    const w = s.winner, a = s.scores;
    const m = document.createElement('div'); m.className = 'modal';
    m.innerHTML = `<div><h1>${w === me ? 'Victory!' : 'Defeat'}</h1><p>${a[me].total}◇ to ${a[1 - me].total}◇</p><p>${w === me ? 'The Realm bows to your banner.' : 'The rival claims the crown. Another game?'}</p><button>Play again</button></div>`;
    m.querySelector('button').onclick = () => { m.remove(); title(); }; document.body.appendChild(m);
  }
  window.__claudenspiel = { get state() { return s; }, start };
  title();
})();
