// The River Folio: twelve cards opened by Act II. Downstream (the unbroken run south), upstream, column lines, the
// Fire Ship, the Ferry and the two ● Actions. Run: node tests/cs17-river.js
const D=require('../src/data.js'), E=require('../src/engine.js'), B=require('../src/bots.js');
const R=[]; const chk=(n,c,m)=>R.push([n,c?'PASS':'FAIL',m]);
const must=(st,a)=>{ const n=E.apply(st,a); if(n.error) throw new Error(a.t+': '+n.error); return n; };
const take=(st,id)=>{ const x=st.deck.find(u=>E.rawDef(st,u).id===id); st.deck.splice(st.deck.indexOf(x),1); return x; };
const plainOf=(st,suit)=>{ const x=st.deck.find(u=>{const d=E.rawDef(st,u);return d.type==='Structure'&&!d.folio&&(!suit||d.suit===suit);}); st.deck.splice(st.deck.indexOf(x),1); return x; };
const DEFS=D.withRiver(D.STARTER);
function game(o){ let st=E.newGame(DEFS,Object.assign({players:[{name:'A',arch:'Cryptkeeper'},{name:'B',arch:'Hedonist'}],seed:7},o||{})); return must(st,{t:'startTurn'}); }
const put=(st,k,u,o)=>{ st.board[k]=[u]; if(o!=null) st.cards[u].claimants=[o]; return u; };
const found=(st,p,k)=>{ const fd=st.players[p].foundationUid; put(st,k,fd,p); st.cards[fd].fixed=true; st.players[p].foundationPlaced=true; st.players[p].hand=st.players[p].hand.filter(u=>u!==fd); };
// the folio
chk('Twelve', D.RIVER.length===12 && D.SUITS.every(s=>D.RIVER.filter(c=>c.suit===s).length===2), 'twelve cards, two a suit');
chk('Burns', D.RIVER.every(c=>c.burn&&c.burn.length&&D.BURNS[c.id]), 'every river card has its own burn');
chk('Ids', D.RIVER.every(c=>!D.STARTER.some(s=>s.id===c.id)&&!D.FOLIO.some(s=>s.id===c.id)), 'no id clashes with the base deck or the Pilgrim’s Folio');
{ const both=D.withFolios(D.STARTER,{folio:true,river:true}); chk('Both folios', both.length===D.STARTER.length+24, 'both folios together add 24 card kinds'); }
// downstream and upstream
{ let st=game(); const mr=put(st,'0,0',take(st,'mill-race'),0);
  chk('Mill alone', E.cardValue(st,'0,0',0)===0, 'nothing downstream: 0◇');
  put(st,'0,1',plainOf(st)); put(st,'0,2',plainOf(st)); put(st,'0,-1',plainOf(st)); put(st,'1,0',plainOf(st));
  chk('Mill Race', E.cardValue(st,'0,0',0)===4, 'two cards south of it: 4◇ (north and east don’t count) ('+E.cardValue(st,'0,0',0)+')');
  put(st,'0,4',plainOf(st)); chk('Gap', E.cardValue(st,'0,0',0)===4, 'a gap ends the river');
  put(st,'0,3',plainOf(st)); put(st,'0,5',plainOf(st)); chk('Cap', E.cardValue(st,'0,0',0)===8, 'it stops at 8◇');
  st.cards[E.top(st,'0,2')].ruined=true; chk('Ruin', E.cardValue(st,'0,0',0)===2, 'a Ruin two cards down leaves one card: 2◇'); }
{ let st=game(); put(st,'0,3',take(st,'water-meadow'),0);
  put(st,'0,2',plainOf(st,'Leaf')); put(st,'0,1',plainOf(st,'Bone')); put(st,'0,0',plainOf(st,'Leaf')); put(st,'0,4',plainOf(st,'Leaf'));
  chk('Water Meadow', E.cardValue(st,'0,3',0)===5, 'three cards upstream, two of them Leaf: 3 + 2 = 5◇ (the one south ignored) ('+E.cardValue(st,'0,3',0)+')'); }
// column lines
{ let st=game(); put(st,'0,0',take(st,'showboat'),1); put(st,'0,1',plainOf(st,'Goblet')); put(st,'0,-1',plainOf(st,'Goblet')); put(st,'1,0',plainOf(st,'Goblet'));
  chk('Showboat', E.cardValue(st,'0,0',1)===6, 'two other Goblets in its column line, the row one ignored: 6◇'); }
{ let st=game(); put(st,'0,0',take(st,'water-clock'),0); put(st,'0,1',plainOf(st,'Leaf'),1); put(st,'0,2',plainOf(st,'Bone')); put(st,'0,-1',plainOf(st,'Tome'));
  chk('Water Clock', E.cardValue(st,'0,0',0)===6, 'Tome, Leaf and Bone in its column, whoever owns them: 6◇ ('+E.cardValue(st,'0,0',0)+')'); }
{ let st=game(); put(st,'0,0',take(st,'ford-garrison'),0); put(st,'0,1',plainOf(st)); const far=put(st,'0,3',plainOf(st)); const near=put(st,'0,-1',plainOf(st)); put(st,'1,0',plainOf(st));
  st.cards[far].ruined=true; st.cards[near].ruined=true; st.cards[E.top(st,'1,0')].ruined=true;
  chk('Ford Garrison', E.cardValue(st,'0,0',0)===6, 'two Ruins in its column, one past a gap; the row Ruin ignored: 6◇'); }
{ let st=game(); put(st,'0,0',take(st,'silt-barrow'),0); put(st,'0,1',plainOf(st)); put(st,'0,4',plainOf(st)); put(st,'2,0',plainOf(st));
  st=must(st,{t:'sbBury',id:'flowers',k:'0,4'}); st=must(st,{t:'sbBury',id:'flowers',k:'0,4'}); st=must(st,{t:'sbBury',id:'flowers',k:'2,0'});
  chk('Silt Barrow', E.cardValue(st,'0,0',0)===2, 'two cards buried down the column past a gap; the one off the column ignored: 2◇'); }
{ let st=game(); put(st,'0,0',take(st,'tollhouse'),0); put(st,'1,0',plainOf(st),1); put(st,'2,0',plainOf(st),1); put(st,'0,1',plainOf(st),0); put(st,'0,2',plainOf(st));
  chk('Tollhouse', E.cardValue(st,'0,0',0)===4, 'two rival cards in its lines; your own and the unclaimed one ignored: 4◇');
  st.cards[E.top(st,'1,0')].ruined=true; chk('Tollhouse ruin', E.cardValue(st,'0,0',0)===0, 'a Ruin next to it cuts the row'); }
// Actions
{ let st=game(); found(st,0,'0,0'); put(st,'1,0',plainOf(st),1); put(st,'0,1',plainOf(st),1); put(st,'2,0',plainOf(st),1);
  const bt=take(st,'bridge-toll'); st.players[0].hand.push(bt); st.players[0].ap=4; st=must(st,{t:'cast',uid:bt});
  chk('Bridge Toll', st.players[0].ap===4, 'two rival cards on your border (the third is further off): 4● − 4● + 4● = '+st.players[0].ap+'●'); }
{ let st=game(); found(st,1,'0,0'); put(st,'1,0',plainOf(st,'Goblet'),1); put(st,'2,0',plainOf(st,'Goblet'),1); st.cur=0;
  const rg=take(st,'regatta'); st.players[0].hand.push(rg); st.players[0].ap=5; const h0=st.players[0].hand.length; st=must(st,{t:'cast',uid:rg});
  chk('Regatta', st.players[0].ap===3 && st.players[0].hand.length===h0-1, 'no Goblets of yours: +3●, no cards'); }
{ let st=game(); found(st,0,'0,0'); const h0=st.players[0].hand.length; const bc=take(st,'boatmans-coin'); st.players[0].hand.push(bc); st.players[0].ap=2;
  st=must(st,{t:'cast',uid:bc}); while(st.pending) st=B.resolve(st,st.cur,'greedy',['greedy','greedy']);
  chk('Boatman’s Coin', st.players[0].ap===3 && st.board['0,0'].length>=2 && st.players[0].hand.length===h0-1, 'buries a card from hand under the Foundation and gains 3●'); }
{ let st=game(); found(st,0,'0,0'); const t1=put(st,'0,1',plainOf(st),1), t2=put(st,'0,2',plainOf(st),1), mine=put(st,'0,3',plainOf(st),0);
  st.board['-1,1']=[plainOf(st)];
  const fs=take(st,'fire-ship'); st.players[0].hand.push(fs); st.players[0].ap=6;
  const L=E.legalCells(st,fs); chk('Fire Ship placed', E.needsPlacement(E.rawDef(st,fs)) && L['0,-1']!=null, 'it is played on an empty space');
  st=must(st,{t:'play',uid:fs,k:'0,-1'}); const pd=st.pending;
  chk('Fire Ship targets', pd && pd.options.length===2 && pd.options.includes('0,1') && pd.options.includes('0,2'), 'it can reach the rival cards downstream, not your own or the Foundation');
  st=must(st,{t:'answer',v:'0,2'}); chk('Fire Ship', st.cards[t2].ruined && !st.cards[t1].ruined, 'the chosen card is Ruined'); }
{ let st=game(); found(st,0,'0,0'); const mr=put(st,'1,0',take(st,'mill-race'),0); put(st,'2,1',plainOf(st),1); put(st,'2,2',plainOf(st),1); put(st,'2,3',plainOf(st));
  const fy=take(st,'the-ferry'); st.players[0].hand.push(fy); st.players[0].ap=4; st=must(st,{t:'cast',uid:fy});
  chk('Ferry asks', st.pending && st.pending.verb==='ferry' && st.pending.options.length===1 && st.pending.options[0]==='1,0', 'only the Mill Race can be carried (not the Foundation)');
  st=must(st,{t:'answer',v:'1,0'}); chk('Ferry where', st.pending && st.pending.options.includes('2,0') && !st.pending.options.includes('5,5'), 'it lands in its row or column, next to a card');
  st=must(st,{t:'answer',v:'2,0'}); chk('Ferry', E.top(st,'2,0')===mr && !E.top(st,'1,0') && E.cardValue(st,'2,0',0)===6, 'carried to the head of a river: 6◇ downstream ('+E.cardValue(st,'2,0',0)+')'); }
{ let st=game(); found(st,0,'0,0'); const mr=put(st,'1,0',take(st,'mill-race'),0); put(st,'2,1',plainOf(st),1); put(st,'2,2',plainOf(st),1); put(st,'2,3',plainOf(st));
  const fy=take(st,'the-ferry'); st.players[0].hand.push(fy); st.players[0].ap=4; st=must(st,{t:'cast',uid:fy}); while(st.pending) st=B.resolve(st,st.cur,'tactician',['tactician','tactician']);
  chk('Ferry bot', E.top(st,'2,0')===mr, 'a tactician carries the Mill Race to the head of the river'); }
// the bots play it
{ let wins=0, played=0; for(let g=0; g<4; g++){ const strats=['tactician','greedy','raider'];
    let st=E.newGame(D.withFolios(D.STARTER,{folio:true,river:true}),{players:['Gardener','Philosopher','Warmonger'].map((a,i)=>({name:'P'+i,arch:a})),seed:400+g,contest:true}), k=0;
    while(st.winner==null && k++<400){ st=st.pending?B.resolve(st,st.cur,strats[st.cur],strats):B.turn(st,B.newStats(),strats); if(!st) break; }
    if(st&&st.winner!=null) wins++; if(st) played+=E.keys(st).filter(x=>E.rawDef(st,E.top(st,x)).folio==='river').length; }
  chk('Bots', wins===4 && played>0, 'four bot games with both folios finish ('+played+' river cards on the final boards)'); }
let f=0; R.forEach(r=>{ if(r[1]==='FAIL') f++; console.log(r[1], r[0], '-', r[2]); }); console.log(f?f+' FAILED':'all '+R.length+' passed'); if(f) process.exit(1);
