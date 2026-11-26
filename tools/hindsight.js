// Measures the Genius's hindsight (KBots.hindsight): plays games with a tactician in seat 0 standing in for a person,
// reviews every one of its turns, and reports the time taken and how far its turns fall short of the Genius's.
// node tools/hindsight.js [games] [players] [style of seat 0]
const D=require('../src/data.js'), E=require('../src/engine.js'), B=require('../src/bots.js');
const G=+process.argv[2]||6, N=+process.argv[3]||2, style=process.argv[4]||'tactician';
const ARCH=['Archbishop','Cryptkeeper','Gardener','Hedonist','Philosopher','Warmonger'];
const gaps=[], times=[], perGame=[];
for(let g=0;g<G;g++){
  const strats=[style].concat(Array(N-1).fill('tactician'));
  let st=E.newGame(D.STARTER,{players:strats.map((_,i)=>({name:'P'+i,arch:ARCH[(g+i*2)%6]})),seed:4100+g,contest:N<=4}); const turns=[]; let n=0;
  while(st&&st.winner==null&&n++<400){
    if(st.pending){ st=B.resolve(st,st.pending.player,strats[st.pending.player],strats); continue; }
    if(st.reveal){ st=E.apply(st,{t:'closeReveal'}); continue; }
    if(st.cur===0&&!st.turn.started){ const s=E.apply(st,{t:'startTurn'}); if(s.error||s.pending){ st=B.turn(st,B.newStats(),strats); continue; }
      const end=B.turn(Object.assign({},s,{_botLog:[]}),B.newStats(),strats); turns.push({s,acts:end._botLog||[]}); st=end; delete st._botLog; continue; }
    st=B.turn(st,B.newStats(),strats); }
  const gg=[];
  turns.forEach(t=>{ const t0=Date.now(), h=B.hindsight(t.s,0,t.acts,+process.env.WORLDS||0); times.push(Date.now()-t0); if(h){ gaps.push(h.same?0:h.gap); gg.push(h.same?0:+h.gap.toFixed(1)); } });
  perGame.push(gg); console.log('game',g,'turns',turns.length,'gaps',gg.join(' '));
}
const q=(a,f)=>{ const b=a.slice().sort((x,y)=>x-y); return b[Math.min(b.length-1,Math.floor(f*b.length))]; };
console.log('turns',gaps.length,'time median',q(times,.5),'p90',q(times,.9),'max',Math.max(...times));
console.log('same plan',gaps.filter(x=>x===0).length,'gap>=3',gaps.filter(x=>x>=3).length,'gap>=6',gaps.filter(x=>x>=6).length,'median gap',q(gaps,.5),'p90',q(gaps,.9));
console.log('games with a turn >=3 short',perGame.filter(a=>a.some(x=>x>=3)).length,'of',perGame.length);
