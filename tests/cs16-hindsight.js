// The Genius's hindsight (KBots.hindsight): looking back at a turn from the seat's fair view. Playing the Genius's own
// plan is never called worse, ending a turn at once with good cards to play is, the answer doesn't change with cards
// the seat couldn't see, and it only looks at turns under way. Run: node tests/cs16-hindsight.js
const D=require('../src/data.js'), E=require('../src/engine.js'), B=require('../src/bots.js'), K=require('../src/deeds.js');
const R=[]; const chk=(n,c,m)=>R.push([n,c?'PASS':'FAIL',m]);
B.GENIUS.budget=1e9;
const game=(archs,seed)=>E.newGame(D.STARTER,{players:archs.map((a,i)=>({name:'P'+i,arch:a})),seed,contest:true});
const strats=['tactician','tactician'];
function reach(st,r){ let n=0; while(st.winner==null&&!(st.cur===0&&st.round>=r&&!(st.turn&&st.turn.started)&&!st.pending)&&n++<200) st=st.pending?B.resolve(st,st.pending.player,'tactician',strats):B.turn(st,B.newStats(),strats); return st; }
function scramble(st,p,salt){ const s=JSON.parse(JSON.stringify(st)), slots=[];
  s.players.forEach((q,i)=>{ if(i!==p) q.hand.forEach((u,j)=>{ if(u!==q.foundationUid) slots.push([q.hand,j]); }); });
  s.deck.forEach((u,j)=>slots.push([s.deck,j]));
  const uids=slots.map(([a,j])=>a[j]); let r=salt; for(let i=uids.length-1;i>0;i--){ r=(r*1103515245+12345)%2147483648; const j=r%(i+1); [uids[i],uids[j]]=[uids[j],uids[i]]; }
  slots.forEach(([a,j],i)=>{ a[j]=uids[i]; }); return s; }
let tried=0, own=0, idle=0, fair=0, shaped=0;
[['Gardener','Warmonger',3],['Hedonist','Philosopher',3],['Archbishop','Cryptkeeper',4],['Philosopher','Gardener',4]].forEach(([a,b,r],i)=>{
  let st=reach(game([a,b],800+i),r); if(st.winner!=null) return; st=E.apply(st,{t:'startTurn'}); if(st.pending) return;
  const playable=st.players[0].hand.some(u=>!E.playBlock(st,0,u)&&(+E.rawDef(st,u).cost||0)<=E.funds(st.players[0]));
  tried++;
  // The Genius's own whole turn, as its hindsight would have planned it: not worse than itself.
  const g=B.hindsight(st,0,[{t:'endTurn'}],8);
  const mine=B.hindsight(st,0,g.line,8); if(mine.same||mine.gap<4) own++;
  if(!playable||(!g.same&&g.gap>=4)) idle++; else console.log('  idle turn judged close: gap',g.gap.toFixed(1),'mine',g.mine.toFixed(1),'best',g.best.toFixed(1));
  if(typeof g.mine==='number'&&g.worlds===8&&g.won.length===2&&Array.isArray(g.gnow)&&g.gainMine&&typeof g.gainMine.vp==='number') shaped++;
  const sc=B.hindsight(scramble(st,0,17*i+3),0,[{t:'endTurn'}],8); if(sc.gap.toFixed(6)===g.gap.toFixed(6)&&sc.same===g.same) fair++;
});
chk('Own plan', tried>=3&&own===tried, 'playing the Genius’s own plan is never called clearly worse ('+own+'/'+tried+')');
// (Not every time: far behind, banking the unspent ● can be nearly as good as anything else.)
chk('Idle turn', idle>=tried-1, 'ending the turn at once with cards to play is called clearly worse in all but one position ('+idle+'/'+tried+')');
chk('Fair', fair===tried, 'the same answer whatever the hidden cards are ('+fair+'/'+tried+')');
chk('Shape', shaped===tried, 'it reports both values, the imagined wins, the Genius’s steps and both turns’ gains');
let st=game(['Gardener','Warmonger'],5);
chk('When', B.hindsight(st,0,[{t:'endTurn'}])===null, 'nothing before the turn has started');
st=E.apply(st,{t:'startTurn'}); chk('When', B.hindsight(st,1,[{t:'endTurn'}])===null, 'nothing for a seat whose turn it isn’t');
chk('Deed', K.LIST.some(d=>d.id==='sight'&&!d.check({won:true})), 'Clear Sight is in the book, earned only from the Chronicle');
R.forEach(r=>console.log(r[1]+' | '+r[0]+' | '+r[2])); console.log(R.filter(r=>r[1]==='PASS').length+'/'+R.length+' pass');
if(R.some(r=>r[1]!=='PASS')) process.exit(1);
