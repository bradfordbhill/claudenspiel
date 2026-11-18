// Burn (second edition): once a turn, a card in hand can be burned for its own one-time effect (KData.BURNS).
// Run: node tests/cs7-burn.js
const D=require('../src/data.js'), E=require('../src/engine.js'), B=require('../src/bots.js');
const R=[]; const chk=(n,c,m)=>R.push([n,c?'PASS':'FAIL',m]);
const game=(o)=>E.newGame(D.STARTER,Object.assign({players:[{name:'A',arch:'Gardener'},{name:'B',arch:'Hedonist'}],seed:21,burn:true},o||{}));
const must=(st,a)=>{ const n=E.apply(st,a); if(n.error) throw new Error(a.t+': '+n.error); return n; };
// Put the card with this id in player 0's hand, taken from the deck.
function give(st,id){ const u=st.deck.find(x=>E.rawDef(st,x).id===id); if(!u) throw new Error('no '+id+' in deck'); st.deck.splice(st.deck.indexOf(u),1); st.players[0].hand.push(u); return u; }
function started(o){ return must(game(o),{t:'startTurn'}); }
function withFoundation(){ let st=started(); const fu=st.players[0].hand.find(x=>E.rawDef(st,x).type==='Foundation'), fk=Object.keys(E.legalCells(st,fu))[0]; st=must(st,{t:'play',uid:fu,k:fk}); return [st,fk]; }

// Every card but the Foundations has its own burn, and its text reads.
const missing=D.STARTER.filter(c=>c.type!=='Foundation'&&!(c.burn&&c.burn.length)).map(c=>c.id);
chk('Table', !missing.length, 'every non-Foundation card has its own burn'+(missing.length?' (missing: '+missing.join(', ')+')':''));
let st0=game(); const bad=st0.deck.filter(u=>!/^[A-Z+0-9].*\.$/.test(E.burnText(st0,u)));
chk('Text', !bad.length, 'every burn has readable text');
chk('Switch', !!E.apply(must(game({burn:false}),{t:'startTurn'}),{t:'burn',uid:game({burn:false}).players[0].hand[0]}).error, 'no burning unless the game asks for it');

let st=started(), u=give(st,'spice-caravan'), ap0=st.players[0].ap; st=must(st,{t:'burn',uid:u});
chk('Coin', st.players[0].ap===ap0+8&&st.discard.includes(u)&&!st.players[0].hand.includes(u), 'Spice Caravan burns for 8● and goes to the discard');
chk('Once', !!E.apply(st,{t:'burn',uid:give(st,'gundy-and-dundy')}).error, 'only one burn a turn');
st=started(); u=give(st,'reconstructed-map'); let h0=st.players[0].hand.length; st=must(st,{t:'burn',uid:u});
chk('Draw', st.players[0].hand.length===h0-1+3, 'Reconstructed Map burns to draw 3');
st=started(); u=give(st,'watchtower'); let t0=st.players[0].tokens||0; st=must(st,{t:'burn',uid:u});
chk('Bank', (st.players[0].tokens||0)===t0+5, 'Watchtower burns for 5◇');
st=started(); u=give(st,'convert');
chk('Reclaim', !!E.apply(st,{t:'burn',uid:u}).error, 'a claim-again burn waits for the claim');
st.turn.claimed=true; st=must(st,{t:'burn',uid:u});
chk('Reclaim', st.turn.claimed===false, 'after the claim, Convert burns to claim again');
st=started(); u=give(st,'errata'); let m0=st.players[0].meeples; st=must(st,{t:'burn',uid:u});
chk('Meeple', st.players[0].meeples===m0+1, 'Errata burns for a meeple');
// Bury: under your own card, as a burial.
let fk; [st,fk]=withFoundation(); u=give(st,'obelisk');
chk('Bury', !!E.apply(st,{t:'burn',uid:u}).error, 'a burial burn needs a card of your Kingdom');
t0=st.players[0].tokens||0; st=must(st,{t:'burn',uid:u,k:fk});
chk('Bury', st.board[fk][1]===u&&!st.discard.includes(u)&&(st.players[0].tokens||0)===t0+4, 'Obelisk is buried under your card and banks 4◇');
// Per: Alchemy Lab banks 1◇ per suit in the Kingdom.
[st,fk]=withFoundation(); u=give(st,'alchemy-lab'); t0=st.players[0].tokens||0; const g=E.burnGain(st,0,u); st=must(st,{t:'burn',uid:u});
chk('Per', g===1&&(st.players[0].tokens||0)===t0+1, 'Alchemy Lab banks 1◇ for the one suit in a new Kingdom');
// Cheap: the next card placed costs less.
[st,fk]=withFoundation(); u=give(st,'crossroads'); const nx=give(st,'watchtower'); const c0=Math.min(...Object.values(E.legalCells(st,nx)));
st=must(st,{t:'burn',uid:u}); const c1=Math.min(...Object.values(E.legalCells(st,nx)));
chk('Cheap', c1===Math.max(0,c0-6), 'Crossroads burns to make the next card 6● cheaper ('+c0+'● → '+c1+'●)');
st.players[0].ap=99; st=must(st,{t:'play',uid:nx,k:Object.keys(E.legalCells(st,nx))[0]});
chk('Cheap', !st.turn.cheap, 'the discount is spent by the next card');
// Ward: a warded card can't be Ruined until its owner's next turn.
st=must(game(),{t:'startTurn'});
st=must(st,{t:'sbPlace',id:'orchard',k:'0,0'}); const wu=E.top(st,'0,0'); st.cards[wu].claimants=[0];
u=give(st,'rear-guard'); st=must(st,{t:'burn',uid:u,k:'0,0'});
chk('Ward', E.warded(st,'0,0')&&E.protectedStack(st,'0,0'), 'Rear Guard burns to ward a card of yours');
st=must(st,{t:'endTurn'});
chk('Ward', E.warded(st,'0,0'), 'the ward holds through the rivals’ turns');
let gg=0; while(st.cur!==0&&gg++<20) st=st.pending?B.resolve(st,st.cur,'greedy',['greedy','greedy']):B.turn(st,B.newStats(),['greedy','greedy']);
st=must(st,{t:'startTurn'});
chk('Ward', !E.warded(st,'0,0'), 'and ends when its giver’s next turn starts');
// Sword: rivals' cards need one fewer enemy this turn.
st=started(); u=give(st,'phalanx');
st=must(st,{t:'sbPlace',id:'orchard',k:'0,0'}); const ou=E.top(st,'0,0'); st.cards[ou].claimants=[1];
st=must(st,{t:'sbPlace',id:'orchard',k:'2,0'}); const mu=E.top(st,'2,0'); st.cards[mu].claimants=[0];
const th0=E.overwhelmCount(st,'0,0').th, my0=E.overwhelmCount(st,'2,0').th; st=must(st,{t:'burn',uid:u});
chk('Sword', E.overwhelmCount(st,'0,0').th===th0-1&&E.overwhelmCount(st,'2,0').th===my0, 'Phalanx burns to make rivals’ cards need one fewer enemy this turn (not your own)');
st=must(st,{t:'endTurn'});
chk('Sword', E.overwhelmCount(st,'0,0').th===th0, 'the effect ends with the turn');
st=started(); const f0=st.players[0].hand.find(x=>E.rawDef(st,x).type==='Foundation');
chk('Foundation', !!E.apply(st,{t:'burn',uid:f0}).error, 'the Foundation can’t be burned');
// A card with no burn of its own (from the card builder) burns by its suit.
st=started(); u=give(st,'gundy-and-dundy'); const did=st.cards[u].def; st.defs[did]=Object.assign({},st.defs[did],{burn:null});
chk('Fallback', E.burnText(st,u)==='+5●.', 'a card without its own burn burns by its suit');
// Bots burn, and a full game finishes.
let s3=game(); const S=['tactician','greedy'], stats=B.newStats(); let k=0; while(s3.winner==null&&k++<300) s3=s3.pending?B.resolve(s3,s3.cur,S[s3.cur],S):B.turn(s3,stats,S);
const nb=s3.log.filter(l=>/ burns /.test(l)).length;
chk('Bots', s3.winner!=null&&nb>0, 'bots burn cards, and the game finishes ('+nb+' burned)');
R.forEach(r=>console.log(r[1],'|',r[0],'|',r[2]));
if(R.some(r=>r[1]==='FAIL')) process.exitCode=1;
