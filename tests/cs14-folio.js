// The Pilgrim's Folio: twelve cards shuffled in by an option, lines (row and column runs), and its Actions and Bell.
// Run: node tests/cs14-folio.js
const D=require('../src/data.js'), E=require('../src/engine.js'), B=require('../src/bots.js');
const R=[]; const chk=(n,c,m)=>R.push([n,c?'PASS':'FAIL',m]);
const must=(st,a)=>{ const n=E.apply(st,a); if(n.error) throw new Error(a.t+': '+n.error); return n; };
const take=(st,id)=>{ const x=st.deck.find(u=>E.rawDef(st,u).id===id); st.deck.splice(st.deck.indexOf(x),1); return x; };
const plainOf=(st,suit,not)=>{ const x=st.deck.find(u=>{const d=E.rawDef(st,u);return d.type==='Structure'&&(!suit||d.suit===suit)&&!(not||[]).includes(u);}); st.deck.splice(st.deck.indexOf(x),1); return x; };
const DEFS=D.withFolio(D.STARTER);
function game(o){ let st=E.newGame(DEFS,Object.assign({players:[{name:'A',arch:'Cryptkeeper'},{name:'B',arch:'Hedonist'}],seed:7},o||{})); return must(st,{t:'startTurn'}); }
// the folio
chk('Twelve', D.FOLIO.length===12 && D.SUITS.every(s=>D.FOLIO.filter(c=>c.suit===s).length===2), 'twelve cards, two a suit');
chk('Burns', D.FOLIO.every(c=>c.burn&&c.burn.length&&D.BURNS[c.id]), 'every folio card has its own burn');
chk('Not in the starter', !D.STARTER.some(c=>c.folio), 'the starter library has no folio cards');
{ const plainDeck=E.newGame(D.STARTER,{players:[{name:'A',arch:'Gardener'},{name:'B',arch:'Hedonist'}],seed:1}).deck.length;
  const folioDeck=E.newGame(DEFS,{players:[{name:'A',arch:'Gardener'},{name:'B',arch:'Hedonist'}],seed:1}).deck.length;
  const n=D.FOLIO.reduce((a,c)=>a+c.copies,0); chk('Deck', folioDeck-plainDeck===n, 'the option adds the folio’s '+n+' copies to the deck ('+plainDeck+' → '+folioDeck+')'); }
chk('withFolio twice', D.withFolio(DEFS).length===DEFS.length, 'shuffling the folio into a deck that has it adds nothing');
// lines
{ let st=game(); const way=take(st,'pilgrims-way'); st.board['0,0']=[way]; st.cards[way].claimants=[0];
  chk('Line alone', E.cardValue(st,'0,0',0)===1, 'a lone Pilgrim’s Way is worth 1◇');
  ['1,0','2,0','-1,0'].forEach(k=>{ st.board[k]=[plainOf(st)]; }); st.board['0,1']=[plainOf(st)];
  chk('Row', E.cardValue(st,'0,0',0)===4 && E.longestLine(st,'0,0').length===4, 'a row of four makes it 4◇ (the column has two)');
  st.board['4,0']=[plainOf(st)]; chk('Unbroken', E.cardValue(st,'0,0',0)===4, 'a gap breaks the line');
  for(let x=3;x<=8;x++) if(!st.board[x+',0']) st.board[x+',0']=[plainOf(st)];
  chk('Cap', E.cardValue(st,'0,0',0)===7, 'it stops at 7◇');
  st.cards[E.top(st,'1,0')].ruined=true; chk('Broken road', E.cardValue(st,'0,0',0)===2 && E.longestLine(st,'0,0').length===2, 'a Ruin beside it cuts the row: only the column of two is left ('+E.cardValue(st,'0,0',0)+')');
  st.opts.brokenRoads=false; chk('Unbroken option', E.cardValue(st,'0,0',0)===7, 'with brokenRoads off, a Ruin still counts in the line'); }
{ let st=game(); const cart=take(st,'cartographer'); st.board['0,0']=[cart]; st.cards[cart].claimants=[0];
  const a=plainOf(st,'Leaf'), b=plainOf(st,'Bone'), c2=plainOf(st,'Leaf'); st.board['0,1']=[a]; st.board['0,2']=[b]; st.board['1,0']=[c2];
  chk('Cartographer rivals', E.cardValue(st,'0,0',0)===2, 'unowned cards in its line don’t count: only its own Tome ('+E.cardValue(st,'0,0',0)+')');
  st.cards[a].claimants=[0]; st.cards[b].claimants=[0]; st.cards[c2].claimants=[0];
  chk('Cartographer', E.cardValue(st,'0,0',0)===6, 'your Tome, Leaf and Bone in its column: 2◇ × 3 suits; the row’s Leaf adds nothing ('+E.cardValue(st,'0,0',0)+')'); }
{ let st=game(); const h=take(st,'hedgerow'); st.board['0,0']=[h]; st.cards[h].claimants=[0];
  st.board['1,0']=[plainOf(st,'Leaf')]; st.board['0,1']=[plainOf(st,'Leaf')]; st.board['0,2']=[plainOf(st,'Bone')]; st.board['1,1']=[plainOf(st,'Leaf')];
  chk('Hedgerow', E.cardValue(st,'0,0',0)===4, 'two other Leaf cards in its row and column lines, the diagonal one ignored ('+E.cardValue(st,'0,0',0)+')'); }
// neighbours
{ let st=game(); const inn=take(st,'wayside-inn'); st.board['0,0']=[inn]; st.cards[inn].claimants=[0];
  const a=plainOf(st), b=plainOf(st); st.board['1,0']=[a]; st.cards[a].claimants=[0]; st.board['-1,0']=[b];
  chk('Inn mine', E.cardValue(st,'0,0',0)===3, 'only you beside it: 3◇');
  st.cards[b].claimants=[1]; chk('Inn shared', E.cardValue(st,'0,0',0)===6, 'you and a rival beside it: 6◇'); }
{ let st=game(); const wf=take(st,'watchfire'); st.board['0,0']=[wf]; st.cards[wf].claimants=[0];
  const a=plainOf(st), b=plainOf(st); st.board['1,1']=[a]; st.board['0,1']=[b]; st.cards[a].ruined=true;
  chk('Watchfire', E.cardValue(st,'0,0',0)===3, 'one Ruined card on a corner: 3◇'); }
{ let st=game(); const ch=take(st,'chapter-house'); st.board['0,0']=[ch]; st.cards[ch].claimants=[0];
  st.board['1,1']=[plainOf(st,'Sceptre')]; st.board['-1,0']=[plainOf(st,'Sceptre')]; st.board['0,1']=[plainOf(st,'Leaf')];
  chk('Chapter House', E.cardValue(st,'0,0',0)===4, 'two Sceptre cards around it, one on a corner: 4◇'); }
// Actions
{ let st=game(); const fd=st.players[0].foundationUid; st.board['0,0']=[fd]; st.cards[fd].claimants=[0]; st.cards[fd].fixed=true; st.players[0].foundationPlaced=true; st.players[0].hand=st.players[0].hand.filter(u=>u!==fd);
  const sw=[plainOf(st,'Sword'),plainOf(st,'Sword')]; st.board['1,0']=[sw[0]]; st.board['2,0']=[sw[1]]; sw.forEach(u=>st.cards[u].claimants=[0]);
  const lv=take(st,'levy'); st.players[0].hand.push(lv); st.players[0].ap=3; st=must(st,{t:'cast',uid:lv});
  while(st.pending) st=B.resolve(st,st.cur,'greedy',['greedy','greedy']);
  chk('Levy', st.players[0].ap===4, 'two Swords in your Kingdom: 3● − 3● + 4● = '+st.players[0].ap+'●');
  const vg=take(st,'vigil'); st.players[0].hand.push(vg); st.players[0].ap=3; const h0=st.players[0].hand.length, b0=st.board['0,0'].length;
  st=must(st,{t:'cast',uid:vg}); while(st.pending) st=B.resolve(st,st.cur,'greedy',['greedy','greedy']);
  chk('Vigil', st.players[0].hand.length===h0-1+1-1 && st.board['0,0'].length>=b0+1, 'draws 1 and buries one under the Foundation'); }
{ let st=game(); const bell=take(st,'ossuary-bell'); st.board['0,0']=[bell]; st.cards[bell].claimants=[1]; const host=plainOf(st); st.board['3,3']=[host];
  const t0=st.players[1].tokens; st=must(st,{t:'sbBury',id:'vigil',k:'3,3'}); chk('Bell value', E.cardValue(st,'0,0',1)===2, 'the Bell itself is worth 2◇');
  chk('Bell', st.players[1].tokens===t0+1, 'a burial anywhere banks 1◇ for the Bell’s owner'); }
{ let st=game(); const fe=take(st,'feast-day'); st.players[0].hand.push(fe); st.players[0].ap=6;
  for(let i=0;i<4;i++) st.board[i+',5']=[plainOf(st,'Goblet')];
  const a0=st.players[0].hand.length, b0=st.players[1].hand.length, t0=st.players[0].tokens; st=must(st,{t:'cast',uid:fe});
  chk('Feast Day', st.players[1].hand.length===b0+1 && st.players[0].hand.length===a0-1+2 && st.players[0].tokens===t0+2, 'the rival draws 1; you draw 2 and bank 2◇ for four Goblets'); }
// the bots play it
{ let wins=0, played=0; for(let g=0; g<4; g++){ const strats=['tactician','greedy','raider'];
    let st=E.newGame(DEFS,{players:['Gardener','Philosopher','Warmonger'].map((a,i)=>({name:'P'+i,arch:a})),seed:300+g,contest:true}), k=0;
    while(st.winner==null && k++<400){ st=st.pending?B.resolve(st,st.cur,strats[st.cur],strats):B.turn(st,B.newStats(),strats); if(!st) break; }
    if(st&&st.winner!=null) wins++; if(st) played+=E.keys(st).filter(x=>E.rawDef(st,E.top(st,x)).folio).length; }
  chk('Bots', wins===4 && played>0, 'four bot games with the folio finish ('+played+' folio cards on the final boards)'); }
const f=R.filter(r=>r[1]==='FAIL'); R.forEach(r=>{ if(r[1]==='FAIL') console.log(r.join(' · ')); }); console.log((R.length-f.length)+'/'+R.length+' pass'); process.exit(f.length?1:0);
