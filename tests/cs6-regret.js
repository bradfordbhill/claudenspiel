// You’ll Regret That has a normal play: Curse (no ●) any card next to one of yours.
const D=require('../src/data.js'), E=require('../src/engine.js');
let st; function A(a){const r=E.apply(st,a); if(r.error) throw new Error(a.t+': '+r.error); st=r;}
st=E.newGame(D.STARTER,{players:[{name:'A',arch:'Archbishop'},{name:'B',arch:'Warmonger'}],seed:7});
A({t:'startTurn'}); st.players[0].ap=99; A({t:'play',uid:st.players[0].foundationUid,k:'0,0'});
A({t:'sbPlace',id:'sanctuary',k:'1,0'});
A({t:'sbGive',i:0,id:'youll-regret-that'}); const h=st.players[0].hand, y=h[h.length-1];
let ok=!E.playBlock(st,0,y); A({t:'cast',uid:y}); A({t:'answer',v:'1,0'});
ok=ok&&E.noIncome(st,'1,0');
console.log((ok?'PASS':'FAIL')+' | Regret | playable from hand, Curses the chosen card'); process.exit(ok?0:1);
