// The Genius's counsel (KBots.advise): advice for a human seat, from that seat's fair view. Its steps are legal, it
// never changes with cards the seat can't see, it explains itself, and the deed Own Counsel notices asking.
// Run: node tests/cs15-counsel.js
const D=require('../src/data.js'), E=require('../src/engine.js'), B=require('../src/bots.js'), K=require('../src/deeds.js');
const R=[]; const chk=(n,c,m)=>R.push([n,c?'PASS':'FAIL',m]);
B.GENIUS.budget=1e9;   // the same imagined deals every time (see qc12-genius.js)
const game=(archs,seed)=>E.newGame(D.STARTER,{players:archs.map((a,i)=>({name:'P'+i,arch:a})),seed});
function scramble(st,p,salt){ const s=JSON.parse(JSON.stringify(st)), slots=[];
  s.players.forEach((q,i)=>{ if(i!==p) q.hand.forEach((u,j)=>{ if(u!==q.foundationUid) slots.push([q.hand,j]); }); });
  s.deck.forEach((u,j)=>slots.push([s.deck,j]));
  const uids=slots.map(([a,j])=>a[j]); let r=salt; for(let i=uids.length-1;i>0;i--){ r=(r*1103515245+12345)%2147483648; const j=r%(i+1); [uids[i],uids[j]]=[uids[j],uids[i]]; }
  slots.forEach(([a,j],i)=>{ a[j]=uids[i]; }); return s; }
const strats=['tactician','tactician'];
function reach(st,r){ let n=0; while(st.winner==null&&!(st.cur===0&&st.round>=r&&!(st.turn&&st.turn.started)&&!st.pending)&&n++<200) st=st.pending?B.resolve(st,st.pending.player,'tactician',strats):B.turn(st,B.newStats(),strats); return st; }

let legal=0, tried=0, fair=0, explained=0, ended=0;
[['Gardener','Warmonger',2],['Hedonist','Philosopher',3],['Cryptkeeper','Archbishop',4],['Philosopher','Gardener',3],['Warmonger','Hedonist',5]].forEach(([a,b,r],i)=>{
  let st=reach(game([a,b],700+i),r); if(st.winner!=null) return; st=E.apply(st,{t:'startTurn'}); if(st.pending) return;
  const adv=B.advise(st,0); tried++;
  let s=st, ok=adv.now.length>0; for(const x of adv.now){ const n=E.apply(s,x); if(n.error){ ok=false; break; } s=n; } if(ok) legal++;
  if(adv.gain&&typeof adv.gain.vp==='number'&&typeof adv.value==='number'&&adv.line.length>=adv.now.length) explained++;
  if(adv.line.some(x=>x.t==='endTurn')||adv.rest) ended++;
  const sc=scramble(st,0,31*i+5); if(JSON.stringify(B.advise(sc,0).now)===JSON.stringify(adv.now)) fair++;
});
chk('Legal', tried>=4&&legal===tried, 'every step of the counsel can be played on the real game ('+legal+'/'+tried+')');
chk('Fair', fair===tried, 'the counsel is the same whatever the hidden cards are ('+fair+'/'+tried+')');
chk('Why', explained===tried, 'the counsel says what the turn gains and how the race stands ('+explained+'/'+tried+')');
chk('Whole turn', ended===tried, 'the plan runs to the end of the turn, or says it will look again after a draw');
// Not on someone else's turn, before the turn starts, or with a prompt open.
let st=game(['Gardener','Warmonger'],9);
chk('When', B.advise(st,0)===null, 'no counsel before the turn has started');
st=E.apply(st,{t:'startTurn'}); chk('When', B.advise(st,1)===null, 'no counsel for a seat whose turn it isn’t');
// The deed.
const own=K.LIST.find(d=>d.id==='own');
const g={won:true,bots:['genius'],counsel:0};
chk('Deed', !!own&&own.check(g)&&!own.check(Object.assign({},g,{counsel:2}))&&!own.check(Object.assign({},g,{bots:['tactician']})), 'Own Counsel: beat a Genius without asking it');
let done=game(['Gardener','Warmonger'],3); done.counsel={0:2}; chk('Deed', K.facts(done,0).counsel===2&&K.facts(done,1).counsel===0, 'the deeds see how often each seat asked');
R.forEach(r=>console.log(r[1]+' | '+r[0]+' | '+r[2])); console.log(R.filter(r=>r[1]==='PASS').length+'/'+R.length+' pass');
if(R.some(r=>r[1]!=='PASS')) process.exit(1);
