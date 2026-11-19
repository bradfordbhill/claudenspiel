// The campaign, The Long Road to the City (src/campaign.js): every stop sets up a legal game whose rules switch on one
// at a time, its stars read the finished game correctly, stops open in order, and the engine counts lost cards.
// Run: node tests/cs13-campaign.js
const D=require('../src/data.js'), E=require('../src/engine.js'), B=require('../src/bots.js'), C=require('../src/campaign.js');
const R=[]; const chk=(n,c,m)=>R.push([n,c?'PASS':'FAIL',m]);
function play(o,strats,seed){ o=Object.assign({},o,{seed}); let st=E.newGame(D.STARTER,o); let g=0;
  while(st&&st.winner==null&&st.round<=30&&g++<400) st=st.pending?B.resolve(st,st.cur,strats[st.cur],strats):B.turn(st,B.newStats(),strats); return st; }

chk('Stops', C.STOPS.length===6&&new Set(C.STOPS.map(s=>s.id)).size===6, 'six stops, each with its own id');
const archs=D.STARTER.filter(c=>c.type==='Foundation').map(c=>c.archetype);
chk('Archetypes', C.STOPS.every(s=>[s.arch].concat(s.rivals.map(r=>r[1])).every(a=>archs.includes(a))&&new Set([s.arch].concat(s.rivals.map(r=>r[1]))).size===s.rivals.length+1), 'every seat has a real archetype, none twice at a table');
chk('Archetypes', new Set(C.STOPS.map(s=>s.arch)).size===6, 'the player tries all six archetypes along the road');
// Rules only ever switch on along the road, and the last stop is the full default game.
const keys=['banking','burySuitOW','defense','buyClaim','ascension','contest'];
let mono=true; for(let i=1;i<C.STOPS.length;i++) keys.forEach(k=>{ if(C.STOPS[i-1].rules[k]&&!C.STOPS[i].rules[k]) mono=false; });
chk('Rules', mono, 'a rule once taught stays on');
chk('Rules', keys.every(k=>C.STOPS[5].rules[k])&&C.STOPS[5].target===52&&!C.STOPS[5].rules.burn&&!C.STOPS[5].rules.market, 'the Toll Gate plays the full default game (no rules on trial)');
chk('Rules', keys.every(k=>!C.STOPS[0].rules[k]), 'the Inn plays the bare game');

// Each stop's game, played by bots (seat 0 stands in for the player), finishes and gets three stars' worth of answers.
let wins=0;
C.STOPS.forEach((s,i)=>{
  const o=C.setup(s.id,'You'); const st=play(o,o.players.map((_,j)=>j?'greedy':'tactician'),100+i);
  chk('Play '+s.id, st.winner!=null&&st.opts.target===s.target&&st.players.length===s.rivals.length+1, s.name+': finishes in round '+st.round+' (winner '+st.players[st.winner].name+')');
  const keysOK=keys.every(k=>!!st.opts[k]===!!s.rules[k]); chk('Play '+s.id, keysOK, 'the game runs with the stop’s rules');
  st.campaign={act:1,stop:s.id}; const got=C.stars(st,0);
  chk('Stars '+s.id, got&&got.length===3&&got[0]===(st.winner===0)&&(!got[1]||got[0]), 'stars: '+got.map(x=>x?'★':'☆').join(''));
  if(st.winner===0) wins++;
});

// Lost cards: every Ruin or Overwhelm of a claimed card counts against its owner.
const war=C.setup('tower','You'); let ws; for(let sd=1;sd<40;sd++){ ws=play(war,['warlord','warlord'],sd); if(ws.log.some(l=>/ is (Ruined|Overwhelmed) by /.test(l))&&ws.players.some(p=>p.lost)) break; }
const ruins=ws.log.filter(l=>/ is (Ruined|Overwhelmed) by /.test(l)).length, lost=ws.players.reduce((a,p)=>a+(p.lost||0),0);
chk('Lost', ruins>0&&lost>0&&lost<=ruins+ws.log.filter(l=>/ contests /.test(l)).length, ruins+' Ruins and Overwhelms, '+lost+' owned cards lost');

// Recording and unlocking.
const book={};
chk('Unlock', C.unlocked(book,'inn')&&!C.unlocked(book,'mill')&&C.current(book)==='inn', 'only the Inn is open at the start');
let f=C.record(book,'inn',[false,false,false]);
chk('Unlock', !C.unlocked(book,'mill')&&book.stops.inn.tries===1, 'a lost game opens nothing');
f=C.record(book,'inn',[true,false,true]);
chk('Record', f.join()==='true,false,true'&&C.unlocked(book,'mill')&&C.current(book)==='mill', 'a win opens the next stop and its stars are new');
f=C.record(book,'inn',[true,true,false]);
chk('Record', f.join()==='false,true,false'&&C.starCount(book,'inn')===3&&C.total(book)===3, 'stars add up across attempts and are never lost');
chk('Record', book.stops.inn.tries===3&&book.stops.inn.wins===2, 'attempts and wins are counted');
chk('Next', C.next('inn')==='mill'&&C.next('gate')===null, 'the road goes stop to stop and ends at the gate');

R.forEach(r=>console.log(r[1]+'  '+r[0]+': '+r[2]));
const bad=R.filter(r=>r[1]==='FAIL').length; console.log(bad?bad+' FAILED':'All '+R.length+' passed'); if(bad) process.exit(1);
