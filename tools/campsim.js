// Campaign difficulty: plays each stop's game with a bot in the traveller's seat and reports how often it wins, the
// median winning round (for par) and how often each star comes.
// Usage: node tools/campsim.js [stop ids, comma-separated | all] [games per stop] [traveller's bot style]
//   OVR='{"ferry":{"rules":{"market":0}}}' overrides stop fields for a trial (rules are merged).
const D=require('../src/data.js'), E=require('../src/engine.js'), B=require('../src/bots.js'), C=require('../src/campaign.js');
const ids=(process.argv[2]||'all')==='all'?C.STOPS.map(s=>s.id):process.argv[2].split(','), N=+process.argv[3]||40, me=process.argv[4]||'tactician';
const ovr=JSON.parse(process.env.OVR||'{}');
ids.forEach(id=>{ const s=C.stop(id), o2=ovr[id]||{};
  Object.keys(o2).forEach(k=>{ if(k==='rules') Object.assign(s.rules,o2.rules); else s[k]=o2[k]; });
  let w=0, st3=0, par=0, rounds=[], t0=Date.now(), F={suits:[],region:[],lost:[],destroyed:[],goblet:[],meeples:[],buried:[],winMargin:[]};
  for(let g=0;g<N;g++){ const o=C.setup(id,'You'); o.seed=9000+g*7; const strats=C.bots(id).map(b=>b||me);
    let st=E.newGame(C.defs(id,D.STARTER),o), k=0;
    while(st&&st.winner==null&&st.round<=30&&k++<500) st=st.pending?B.resolve(st,st.cur,strats[st.cur],strats):B.turn(st,B.newStats(),strats);
    if(!st||st.winner==null) continue; st.campaign={act:s.act,stop:id}; const got=C.stars(st,0); const KD=require('../src/deeds.js'), f=KD.facts(st,0); F.suits.push(f.suits); F.region.push(f.region); F.lost.push(st.players[0].lost||0); F.destroyed.push(f.destroyed); F.goblet.push(f.suitCount.Goblet||0); F.meeples.push(st.players[0].meeples); F.buried.push(f.buried); if(f.won) F.winMargin.push(f.margin);
    if(got[0]){ w++; rounds.push(st.round); } if(got[1]) par++; if(got[2]) st3++; }
  rounds.sort((a,b)=>a-b);
  console.log(id.padEnd(8), 'win', (100*w/N).toFixed(0)+'%', 'par', (100*par/N).toFixed(0)+'%', 'star3', (100*st3/N).toFixed(0)+'%', 'median win round', rounds[rounds.length>>1]||'-', '('+N+' games, '+((Date.now()-t0)/1000).toFixed(0)+'s)');
  if(process.env.FACTS) Object.keys(F).forEach(k=>{ const a=F[k].slice().sort((x,y)=>x-y); console.log('   ',k,'p25',a[a.length>>2],'median',a[a.length>>1],'p75',a[(3*a.length)>>2]); });
});
