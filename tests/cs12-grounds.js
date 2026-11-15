// The 1.0 Grounds: Library (draw when you build beside it), Barrow (burials beside it bank 2◇), Shrine (peace from contest and Curses).
// Run: node tests/cs12-grounds.js
const D=require('../src/data.js'), E=require('../src/engine.js');
const R=[]; const chk=(n,c,m)=>R.push([n,c?'PASS':'FAIL',m]);
const must=(st,a)=>{ const n=E.apply(st,a); if(n.error) throw new Error(a.t+': '+n.error); return n; };
const plain=(st,not)=>{ const x=st.deck.find(u=>{const d=E.rawDef(st,u);return d.type==='Structure'&&!d.onPlay.length&&(+d.cost||0)<=6&&!(not||[]).includes(u)&&d.place.length===4;}); st.deck.splice(st.deck.indexOf(x),1); return x; };
const ground=(st,id)=>{ const x=st.deck.find(u=>E.rawDef(st,u).id===id); st.deck.splice(st.deck.indexOf(x),1); return x; };
function game(o){ let st=E.newGame(D.STARTER,Object.assign({players:[{name:'A',arch:'Cryptkeeper'},{name:'B',arch:'Hedonist'}],seed:5,contest:true},o||{})); return must(st,{t:'startTurn'}); }
// Library
{ let st=game(); const lib=ground(st,'library'); st.board['0,0']=[lib]; const u=plain(st); st.players[0].hand.push(u); st.players[0].ap=30;
  const h0=st.players[0].hand.length; st=must(st,{t:'play',uid:u,k:'1,0'}); if(st.pending) st=must(st,{t:'answer',v:null});
  chk('Library', st.players[0].hand.length===h0, 'building beside a Library draws a card (hand size unchanged after playing one)');
  const u2=plain(st); st.players[0].hand.push(u2); const h1=st.players[0].hand.length; st=E.apply(st,{t:'play',uid:u2,k:'-1,0'});
  chk('Library once', !st.error&&st.players[0].hand.length===h1-1, 'only once a turn'); }
// Barrow
{ let st=game(); const bar=ground(st,'barrow'); const host=plain(st); st.board['0,0']=[bar]; st.board['1,0']=[host]; st.cards[host].claimants=[0];
  const t0=st.players[0].tokens; const ded=plain(st,[host]); st.players[0].hand.push(ded); st.players[0].ap=30;
  st=must(st,{t:'sbBury',id:E.rawDef(st,ded).id,k:'1,0'});
  chk('Barrow', st.players[0].tokens===t0+2, 'a burial beside a Barrow banks 2◇ for the player burying ('+(st.players[0].tokens-t0)+')');
  const far=plain(st,[host]); st.board['5,5']=[far]; const t1=st.players[0].tokens; st=must(st,{t:'sbBury',id:E.rawDef(st,ded).id,k:'5,5'});
  chk('Barrow far', st.players[0].tokens===t1, 'burials elsewhere bank nothing'); }
// Shrine
{ let st=game(); const sh=ground(st,'shrine'); const rival=plain(st); const mine=plain(st,[rival]);
  st.board['0,0']=[rival]; st.cards[rival].claimants=[1]; st.players[1].meeples--; st.board['1,0']=[mine]; st.turn.lastKey='1,0'; st.players[0].ap=20;
  chk('Shrine off', E.contestOptions(st,0).includes('0,0'), 'without a Shrine the card can be contested');
  st.board['0,1']=[sh];
  chk('Shrine', !E.contestOptions(st,0).includes('0,0') && !!E.apply(st,{t:'contest',k:'0,0'}).error, 'a card beside a Shrine can’t be contested');
  chk('Peace', E.shrinePeace(st,'0,0') && !E.shrinePeace(st,'5,5'), 'the peace reaches only the cells next to the Shrine'); }
const f=R.filter(r=>r[1]==='FAIL'); R.forEach(r=>{ if(r[1]==='FAIL') console.log(r.join(' · ')); }); console.log((R.length-f.length)+'/'+R.length+' pass'); process.exit(f.length?1:0);
