// The campaign, The Long Road to the City (src/campaign.js): every stop sets up a legal game whose rules switch on one
// at a time, its stars read the finished game correctly, stops open in order, and the engine counts lost cards.
// Run: node tests/cs13-campaign.js
const D=require('../src/data.js'), E=require('../src/engine.js'), B=require('../src/bots.js'), C=require('../src/campaign.js');
const R=[]; const chk=(n,c,m)=>R.push([n,c?'PASS':'FAIL',m]);
function play(o,strats,seed){ o=Object.assign({},o,{seed}); let st=E.newGame(D.STARTER,o); let g=0;
  while(st&&st.winner==null&&st.round<=30&&g++<400) st=st.pending?B.resolve(st,st.cur,strats[st.cur],strats):B.turn(st,B.newStats(),strats); return st; }

chk('Stops', C.STOPS.length===18&&C.ACT1.length===6&&C.ACT2.length===6&&C.ACT3.length===6&&new Set(C.STOPS.map(s=>s.id)).size===18, 'three acts of six stops, each with its own id');
const archs=D.STARTER.filter(c=>c.type==='Foundation').map(c=>c.archetype);
chk('Archetypes', C.STOPS.every(s=>[s.arch].concat(s.rivals.map(r=>r[1])).every(a=>archs.includes(a))&&new Set([s.arch].concat(s.rivals.map(r=>r[1]))).size===s.rivals.length+1), 'every seat has a real archetype, none twice at a table');
chk('Archetypes', [C.ACT1,C.ACT2,C.ACT3].every(a=>new Set(a.map(s=>s.arch)).size===6), 'the player tries all six archetypes in each act');
// Rules only ever switch on along the road, and the last stop is the full default game.
const keys=['banking','burySuitOW','defense','buyClaim','ascension','contest'];
let mono=true; for(let i=1;i<C.ACT1.length;i++) keys.forEach(k=>{ if(C.STOPS[i-1].rules[k]&&!C.STOPS[i].rules[k]) mono=false; });
chk('Rules', mono, 'a rule once taught stays on');
chk('Rules', keys.every(k=>C.STOPS[5].rules[k])&&C.STOPS[5].target===52&&!C.STOPS[5].rules.burn&&!C.STOPS[5].rules.market, 'the Toll Gate plays the full default game (no rules on trial)');
chk('Rules', keys.every(k=>!C.STOPS[0].rules[k]), 'the Inn plays the bare game');

// Each stop's game, played by bots (seat 0 stands in for the player), finishes and gets three stars' worth of answers.
let wins=0;
C.STOPS.forEach((s,i)=>{
  const o=C.setup(s.id,'You'); o.seed=100+i; const bots=C.bots(s.id); let st=E.newGame(C.defs(s.id,D.STARTER),o); let g=0; const strats=bots.map(b=>b==='genius'?'tactician':b||'tactician');   // the Genius is measured in tools/campsim.js; here a tactician stands in, for speed
  while(st&&st.winner==null&&st.round<=30&&g++<500) st=st.pending?B.resolve(st,st.cur,strats[st.cur],strats):B.turn(st,B.newStats(),strats);
  chk('Play '+s.id, st.winner!=null&&st.opts.target===s.target&&st.players.length===s.rivals.length+1, s.name+': finishes in round '+st.round+' (winner '+st.players[st.winner].name+')');
  const keysOK=keys.every(k=>!!st.opts[k]===!!s.rules[k]); chk('Play '+s.id, keysOK, 'the game runs with the stop’s rules');
  st.campaign={act:s.act,stop:s.id}; const got=C.stars(st,0);
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
chk('Next', C.next('inn')==='mill'&&C.next('gate')==='wharf'&&C.next('kings')==='hawkers'&&C.next('throne')===null, 'the road goes stop to stop, down the river, into the city, and ends at the Margrave’s Hall');

// Act II: the full game everywhere, each town's custom on top, tacticians and warlords as rivals.
const full=['banking','burySuitOW','defense','buyClaim','ascension','contest'];
chk('Act II', C.ACT2.every(s=>full.every(k=>s.rules[k])&&s.custom&&s.act===2), 'every river town plays the full game plus a custom');
chk('Act II', C.ACT2.every(s=>s.rivals.every(r=>r[2]==='tactician'||r[2]==='warlord'))&&C.ACT2.some(s=>s.rivals.some(r=>r[2]==='warlord')), 'rivals are tacticians and warlords');
chk('Act II', C.ACT1.every(s=>s.rivals.every(r=>r[2]==='greedy')), 'Act I keeps its greedy rivals');
chk('Act II', !C.unlocked({stops:{}},'wharf')&&C.unlocked({stops:{gate:{stars:[true,false,false]}}},'wharf'), 'the river towns open once the Toll Gate is won');
const pax=C.defs('abbey',D.STARTER), lib=C.defs('ferry',D.STARTER);
chk('Customs', pax.filter(d=>d.suit==='Sword'&&d.type!=='Foundation').every(d=>!+d.copies)&&pax.filter(d=>d.type==='Foundation').length===6&&lib===D.STARTER, 'Pax Dei takes the Sword cards out of the deck (and only there)');
const ab=E.newGame(pax,Object.assign(C.setup('abbey','You'),{seed:3}));
chk('Customs', ab.deck.every(u=>ab.defs[ab.cards[u].def].suit!=='Sword')&&ab.players.length===3, 'the Abbey deals no Sword card');
const wf=E.newGame(D.STARTER,Object.assign(C.setup('wharf','You'),{seed:3})), tn=E.newGame(D.STARTER,Object.assign(C.setup('tanners','You'),{seed:3}));
chk('Customs', wf.players.every(p=>p.meeples===5)&&tn.opts.drawPerTurn===3&&tn.players[2].hand.length===6, 'Short of hands deals 5 meeples; the spring flood deals 5 cards (and the Foundation) and draws 3');
chk('Customs', C.setup('ferry').market===3&&C.setup('weir').burn===true&&C.setup('kings').players.length===4, 'market day, ember night, and four seats at the Bridge of Kings');
chk('Acts', C.actOf('kings')===2&&C.inAct('kings')===5&&C.inAct('inn')===0&&C.actStars({stops:{wharf:{stars:[true,true,false]}}},2)===2, 'stops know their act and place in it');

// Act III: the city, every quarter held by a named Genius, each with a custom.
chk('Act III', C.ACT3.every(s=>s.act===3&&s.custom&&full.every(k=>s.rules[k])&&s.rivals.some(r=>r[2]==='genius')), 'every quarter plays the full game, a custom, and at least one Genius');
chk('Act III', C.stop('throne').rivals.length===3&&C.stop('throne').rivals.every(r=>r[2]==='genius'&&C.ACT3.slice(0,4).some(s=>s.rivals.some(q=>q[0]===r[0]))), 'the finale brings back three champions already met, all Geniuses');
chk('Act III', !C.unlocked({stops:{}},'hawkers')&&C.unlocked({stops:{kings:{stars:[true,false,false]}}},'hawkers'), 'the city opens once the Bridge of Kings is won');
const hk=E.newGame(D.STARTER,Object.assign(C.setup('hawkers','You'),{seed:4})), gh=E.newGame(D.STARTER,Object.assign(C.setup('guildhall','You'),{seed:4}));
chk('Customs', hk.players[0].tokens===C.stop('hawkers').welcome&&hk.players[1].tokens===0&&gh.players.map(p=>p.tokens).join()==='12,4,0'&&E.newGame(D.STARTER,Object.assign(C.setup('throne','You'),{seed:4})).players.map(p=>p.tokens).join()==='9,6,3,0', 'guest-right: the traveller starts with the gift, later seats keep their handicap; without it the usual seat handicap holds');
chk('Customs', C.setup('scriptorium').hallowed===true&&gh.opts.audits===2, 'hallowed ground at the Scriptorium, the audit at the Guildhall');
const lent=E.newGame(C.defs('close',D.STARTER),Object.assign(C.setup('close','You'),{seed:4})), tny=C.defs('tourney',D.STARTER);
const swords=l=>l.filter(d=>d.suit==='Sword'&&d.type!=='Foundation').reduce((a,d)=>a+(+d.copies||0),0);
chk('Customs', lent.deck.every(u=>lent.defs[lent.cards[u].def].suit!=='Goblet')&&swords(tny)===2*swords(D.STARTER)&&swords(D.STARTER)>0, 'Lent deals no Goblet; the tourney shuffles in twice the Swords');
let gs=E.newGame(D.STARTER,Object.assign(C.setup('guildhall','You'),{seed:11})), k2=0; const gst=['tactician','tactician','tactician'];
while(gs.winner==null&&gs.round<=8&&k2++<300) gs=gs.pending?B.resolve(gs,gs.cur,'tactician',gst):B.turn(gs,B.newStats(),gst);
chk('Customs', gs.log.some(l=>/^Audit after round 2/.test(l)), 'the Guildhall’s audit pays after round 2');
chk('Acts', C.actOf('throne')===3&&C.inAct('throne')===5&&C.actStars({stops:{close:{stars:[true,true,true]}}},3)===3&&typeof C.EPILOGUE==='string', 'Act III knows its stops and has an ending');

R.forEach(r=>console.log(r[1]+'  '+r[0]+': '+r[2]));
const bad=R.filter(r=>r[1]==='FAIL').length; console.log(bad?bad+' FAILED':'All '+R.length+' passed'); if(bad) process.exit(1);
