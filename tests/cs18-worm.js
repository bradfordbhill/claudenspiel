// The Lindworm (opts.worm): a semi-cooperative dragon that hoards ◇, wakes after every round and can be struck.
// Run: node tests/cs18-worm.js
const D=require('../src/data.js'), E=require('../src/engine.js'), B=require('../src/bots.js');
const R=[]; const chk=(n,c,m)=>R.push([n,c?'PASS':'FAIL',m]);
const game=(o)=>E.newGame(D.STARTER,Object.assign({players:[{name:'A',arch:'Gardener'},{name:'B',arch:'Hedonist'}],seed:31,contest:true,worm:true},o||{}));
const must=(st,a)=>{ const n=E.apply(st,a); if(n.error) throw new Error(a.t+': '+n.error); return n; };
const plain=d=>(d.type==='Structure'||d.type==='Building')&&!(d.mods&&Object.keys(d.mods).length)&&!d.perTurn&&!d.reaction;
const pick=(st)=>{ const x=st.deck.find(u=>plain(E.rawDef(st,u))); st.deck.splice(st.deck.indexOf(x),1); return x; };
const endRound=(st)=>{ for(let i=0;i<st.players.length;i++){ if(!st.turn.started) st=must(st,{t:'startTurn'}); st.players[st.cur].foundationPlaced=true; st.players[st.cur].ap=0; st=must(st,{t:'endTurn'}); } return st; };

let st=game();
chk('Setup', st.worm && st.worm.hoard===0 && E.OMENS[st.worm.next] && st.worm.deck.length===E.OMEN_DECK.length-1, 'a hoard of 0◇ and one omen showing');
chk('Off', !E.newGame(D.STARTER,{players:[{name:'A',arch:'Gardener'},{name:'B',arch:'Hedonist'}],seed:31}).worm, 'no Lindworm unless the game asks for it');
// a full round wakes it
st.worm.next='greed'; const r1=st.round; st=endRound(st);
chk('Wake', st.round===r1+1 && st.worm.wakes===1 && st.worm.hoard===E.wormGrowth(st,r1)+5 && st.worm.last.id==='greed', 'after a round it wakes; Greed adds 5◇ to the growth ('+st.worm.hoard+'◇)');
chk('Next', !!E.OMENS[st.worm.next], 'a new omen shows');
chk('Chronicle', st.chron[st.chron.length-1].h===st.worm.hoard && /Lindworm wakes/.test(st.chron[st.chron.length-1].ev.join()), 'the Chronicle keeps the hoard and the wake');
// strike
st=must(st,{t:'startTurn'}); st.players[st.cur].ap=20; const h0=st.worm.hoard, me=st.cur;
st=must(st,{t:'strike'});
chk('Strike', st.worm.hoard===h0-E.STRIKE_WOUND && st.players[me].ap===20-E.STRIKE_PRICE && st.worm.struck[me]===1, 'a strike costs '+E.STRIKE_PRICE+'● and takes '+E.STRIKE_WOUND+'◇');
chk('Once', !!E.apply(st,{t:'strike'}).error, 'once a turn');
chk('Laurel', E.laurelOf(st)===me && E.scores(st)[me].laurel===E.LAUREL, 'the most strikes holds the Laurel, worth '+E.LAUREL+'◇');
{ let s2=JSON.parse(JSON.stringify(st)); s2.worm.struck[1-me]=1; chk('Tie', E.laurelOf(s2)===null, 'a tie holds no Laurel'); }
{ let s2=game(); s2=must(s2,{t:'startTurn'}); s2.players[0].ap=7; s2.worm.hoard=10; chk('Poor', !!E.apply(s2,{t:'strike'}).error, 'too few ● is refused'); s2.players[0].ap=9; s2.players[0].reserve=20; s2.players[0].ap=5; chk('Reserves', !!E.apply(s2,{t:'strike'}).error, 'Reserves can’t pay for a strike'); }
// scorch hits the leader's finest card, and a ward turns it aside
{ let s=game(); s=must(s,{t:'startTurn'}); const a=pick(s), b=pick(s), c=pick(s);
  s.board['0,0']=[a]; s.cards[a].claimants=[0]; s.board['1,0']=[b]; s.cards[b].claimants=[0]; s.board['5,5']=[c]; s.cards[c].claimants=[1]; s.players[0].tokens=30;
  const fk=E.finestCard(s,0); s.worm.next='scorch'; let t=endRound(s);
  chk('Scorch', t.cards[E.top(t,fk)].ruined && !t.cards[c].ruined, 'Scorch Ruins the leader’s finest card, not the trailer’s');
  s.wards={}; s.wards[E.top(s,fk)]=0; const other=fk==='0,0'?'1,0':'0,0'; t=endRound(s);
  chk('Ward', !t.cards[E.top(t,fk)].ruined && t.cards[E.top(t,other)].ruined, 'a warded card is passed over for the next finest'); }
// toll and slumber
{ let s=game(); s.players[0].tokens=10; s.worm.next='toll'; const g=E.wormGrowth(s,s.round); s=endRound(s);
  chk('Toll', s.players[0].tokens===7 && s.worm.hoard===g+3, 'Toll moves up to 3◇ from the leader into the hoard'); }
{ let s=game(); s.worm.next='slumber'; const g=E.wormGrowth(s,s.round); s=endRound(s); chk('Slumber', s.worm.hoard===Math.ceil(g/2), 'Slumber halves the growth'); }
// losing to it
{ let s=game(); s.worm.hoard=60; s.worm.next='slumber'; s=endRound(s); chk('Hoard', s.winner===-1 && s.wormWon, 'a hoard at the target wins for the Lindworm'); }
{ let s=game(); s=must(s,{t:'startTurn'}); s.players[0].tokens=55; s.players[0].foundationPlaced=true; s=must(s,{t:'endTurn'}); s.worm.hoard=70;
  s=must(s,{t:'startTurn'}); s.players[1].foundationPlaced=true; s=must(s,{t:'endTurn'});
  chk('Last round', s.winner===-1 && /outweighs every Kingdom/.test(s.log.join('\n')), 'when the last round ends, a bigger hoard wins'); }
{ let s=game(); s=must(s,{t:'startTurn'}); s.players[0].tokens=55; s.players[0].foundationPlaced=true; s=must(s,{t:'endTurn'}); s.worm.hoard=20;
  s=must(s,{t:'startTurn'}); s.players[1].foundationPlaced=true; s=must(s,{t:'endTurn'}); chk('Players win', s.winner===0, 'a smaller hoard: the highest player wins'); }
// fairness: the omen order is hidden
{ let s=game(); const r=E.redact(s,0); chk('Hidden', JSON.stringify(r.worm.deck)===JSON.stringify(s.worm.deck.slice().sort()) && r.worm.next===s.worm.next, 'redaction hides the order of the omens to come, not the one showing'); }
// bots strike and the game finishes
{ let strikes=0, done=0; for(let g=0; g<3; g++){ let s=E.newGame(D.STARTER,{players:[{name:'A',arch:'Gardener'},{name:'B',arch:'Warmonger'},{name:'C',arch:'Philosopher'}],seed:700+g,contest:true,worm:true}), strats=['tactician','greedy','raider'], stats=B.newStats(), n=0;
    while(s.winner==null&&n++<400){ if(s.pending){ s=B.resolve(s,s.cur,strats[s.cur],strats); continue; } const t=B.turn(s,stats,strats); if(!t) break; s=t; }
    if(s.winner!=null) done++; strikes+=Object.values(s.worm.struck).reduce((a,c)=>a+c,0); }
  chk('Bots', done===3 && strikes>0, 'three 3-player bot games finish, and the bots strike ('+strikes+' strikes)'); }
{ let s=game(), g=0; s.players[1].bot='genius'; const strats=['tactician','genius']; B.GENIUS.budget=200; const stats=B.newStats();
  while(s.winner==null&&g++<60){ if(s.pending){ s=B.resolve(s,s.cur,strats[s.cur],strats); continue; } const t=B.turn(s,stats,strats); if(!t) break; s=t; }
  chk('Genius', !!s && s.round>=3, 'a Genius plays a Lindworm game without error (round '+(s&&s.round)+')'); }
R.forEach(r=>console.log(r[1],r[0],'-',r[2])); const f=R.filter(r=>r[1]==='FAIL').length; console.log(f?f+' FAILED':'all '+R.length+' passed'); process.exit(f?1:0);
