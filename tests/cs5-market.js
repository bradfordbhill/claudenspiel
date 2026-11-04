// The market (second-edition rule, on trial): face-up cards anyone can take as one of their draws.
// Run: node tests/cs5-market.js
const D=require('../src/data.js'), E=require('../src/engine.js'), B=require('../src/bots.js');
const R=[]; const chk=(n,c,m)=>R.push([n,c?'PASS':'FAIL',m]);
const game=(o)=>E.newGame(D.STARTER,Object.assign({players:[{name:'A',arch:'Gardener'},{name:'B',arch:'Hedonist'}],seed:21,market:3},o||{}));
const must=(st,a)=>{ const n=E.apply(st,a); if(n.error) throw new Error(a.t+': '+n.error); return n; };

let st=game();
chk('Setup', st.market.length===3&&st.market.every(u=>st.cards[u]&&!st.deck.includes(u)), 'three face-up cards are dealt from the deck');
chk('Setup', game({market:0}).market.length===0, 'no market unless the game asks for one');
const h0=st.players[0].hand.length; st=must(st,{t:'startTurn'});
chk('Draws', st.players[0].hand.length===h0&&st.turn.toDraw===2, 'starting a turn draws nothing yet: two draws are waiting');
const pick=st.market[1], deck0=st.deck.length; st=must(st,{t:'draw',from:pick});
chk('Draws', st.players[0].hand.includes(pick)&&!st.market.includes(pick)&&st.market.length===3&&st.deck.length===deck0-1, 'taking a market card puts it in hand and refills the market from the deck');
st=must(st,{t:'draw',from:'deck'});
chk('Draws', st.turn.toDraw===0&&st.players[0].hand.length===h0+2, 'the second draw comes blind from the deck');
chk('Draws', !!E.apply(st,{t:'draw',from:'deck'}).error, 'no more than the turn’s draws');
chk('Draws', !!E.apply(game(),{t:'draw',from:'deck'}).error, 'no drawing before the turn starts');
let s2=must(game(),{t:'startTurn'}); const h2=s2.players[0].hand.length; s2.players[0].foundationPlaced=true; s2=must(s2,{t:'endTurn'});
chk('Draws', s2.players[0].hand.length===h2+2, 'draws left untaken are drawn blind at the end of the turn');
chk('Fair', E.redact(st,1).market.every(u=>E.redact(st,1).cards[u]), 'the market is visible to everyone (it survives redaction)');
// A bot takes a market card it can use, and a full bot game finishes.
let s3=game(); const S=['tactician','greedy']; let k=0; while(s3.winner==null&&k++<300) s3=s3.pending?B.resolve(s3,s3.cur,S[s3.cur],S):B.turn(s3,B.newStats(),S);
chk('Bots', s3.winner!=null&&s3.log.some(l=>/from the market/.test(l)), 'bots take market cards, and the game finishes ('+s3.log.filter(l=>/from the market/.test(l)).length+' taken)');
R.forEach(r=>console.log(r[1],'|',r[0],'|',r[2]));
if(R.some(r=>r[1]==='FAIL')) process.exitCode=1;
