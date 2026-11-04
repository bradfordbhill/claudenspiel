// Burn (second-edition rule, on trial): once a turn, a card in hand can be burned for a one-time effect set by its suit.
// Run: node tests/cs7-burn.js
const D=require('../src/data.js'), E=require('../src/engine.js'), B=require('../src/bots.js');
const R=[]; const chk=(n,c,m)=>R.push([n,c?'PASS':'FAIL',m]);
const game=(o)=>E.newGame(D.STARTER,Object.assign({players:[{name:'A',arch:'Gardener'},{name:'B',arch:'Hedonist'}],seed:21,burn:true},o||{}));
const must=(st,a)=>{ const n=E.apply(st,a); if(n.error) throw new Error(a.t+': '+n.error); return n; };
// Put a card of the given suit (not a Foundation) in player 0's hand, taken from the deck.
function give(st,suit){ const u=st.deck.find(x=>{ const d=E.rawDef(st,x); return d.suit===suit&&d.type!=='Foundation'; }); if(!u) throw new Error('no '+suit+' in deck'); st.deck.splice(st.deck.indexOf(u),1); st.players[0].hand.push(u); return u; }
function started(o){ let st=must(game(o),{t:'startTurn'}); return st; }

chk('Switch', !!E.apply(must(game({burn:false}),{t:'startTurn'}),{t:'burn',uid:game({burn:false}).players[0].hand[0]}).error, 'no burning unless the game asks for it');
let st=started(), u=give(st,'Goblet'), ap0=st.players[0].ap; st=must(st,{t:'burn',uid:u});
chk('Goblet', st.players[0].ap===ap0+E.BURN.Goblet&&st.discard.includes(u)&&!st.players[0].hand.includes(u), 'a Goblet burns for '+E.BURN.Goblet+'● and goes to the discard');
chk('Once', !!E.apply(st,{t:'burn',uid:give(st,'Goblet')}).error, 'only one burn a turn');
st=started(); u=give(st,'Tome'); let h0=st.players[0].hand.length; st=must(st,{t:'burn',uid:u});
chk('Tome', st.players[0].hand.length===h0-1+E.BURN.Tome, 'a Tome burns to draw '+E.BURN.Tome);
st=started(); u=give(st,'Leaf'); let t0=st.players[0].tokens||0; st=must(st,{t:'burn',uid:u});
chk('Leaf', (st.players[0].tokens||0)===t0+E.BURN.Leaf, 'a Leaf burns for '+E.BURN.Leaf+'◇');
st=started(); u=give(st,'Sceptre');
chk('Sceptre', !!E.apply(st,{t:'burn',uid:u}).error, 'a Sceptre can’t be burned before the claim');
st.turn.claimed=true; st=must(st,{t:'burn',uid:u});
chk('Sceptre', st.turn.claimed===false, 'after the claim, a Sceptre burns to claim again');
st=started(); u=give(st,'Bone');
chk('Bone', !!E.apply(st,{t:'burn',uid:u}).error, 'a Bone needs a card of your Kingdom to go under');
const fu=st.players[0].hand.find(x=>E.rawDef(st,x).type==='Foundation'), fk=Object.keys(E.legalCells(st,fu))[0]; st=must(st,{t:'play',uid:fu,k:fk});
st=must(st,{t:'burn',uid:u,k:fk});
chk('Bone', st.board[fk].length===2&&st.board[fk][1]===u, 'a Bone burns by being buried under your own card');
st=started(); const f0=st.players[0].hand.find(x=>E.rawDef(st,x).type==='Foundation');
chk('Foundation', !!E.apply(st,{t:'burn',uid:f0}).error, 'the Foundation can’t be burned');
// Sword: rivals' cards need one fewer enemy this turn.
st=started(); u=give(st,'Sword');
st=must(st,{t:'sbPlace',id:'orchard',k:'0,0'}); const ou=E.top(st,'0,0'); st.cards[ou].claimants=[1];
st=must(st,{t:'sbPlace',id:'orchard',k:'2,0'}); const mu=E.top(st,'2,0'); st.cards[mu].claimants=[0];
const th0=E.overwhelmCount(st,'0,0').th, my0=E.overwhelmCount(st,'2,0').th; st=must(st,{t:'burn',uid:u});
chk('Sword', E.overwhelmCount(st,'0,0').th===th0-1&&E.overwhelmCount(st,'2,0').th===my0, 'a Sword burns to make rivals’ cards need one fewer enemy this turn (not your own)');
st=must(st,{t:'endTurn'});
chk('Sword', E.overwhelmCount(st,'0,0').th===th0, 'the Sword’s effect ends with the turn');
// Bots burn, and a full game finishes.
let s3=game(); const S=['tactician','greedy'], stats=B.newStats(); let k=0; while(s3.winner==null&&k++<300) s3=s3.pending?B.resolve(s3,s3.cur,S[s3.cur],S):B.turn(s3,stats,S);
const nb=s3.log.filter(l=>/ burns /.test(l)).length;
chk('Bots', s3.winner!=null&&nb>0, 'bots burn cards, and the game finishes ('+nb+' burned)');
R.forEach(r=>console.log(r[1],'|',r[0],'|',r[2]));
if(R.some(r=>r[1]==='FAIL')) process.exitCode=1;
