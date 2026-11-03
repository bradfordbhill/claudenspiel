// Claudenspiel 0.4: Orchard's Leaf bonus, Cathedral's share of the board's Sceptre cards, the seat handicap by table size,
// and bots that lay Grounds on purpose. Run: node tests/cs4-tables.js
const D=require('../src/data.js'), E=require('../src/engine.js'), B=require('../src/bots.js');
const R=[]; const chk=(n,c,m)=>R.push([n,c?'PASS':'FAIL',m]);
const game=(archs,opts)=>E.newGame(D.STARTER,Object.assign({players:archs.map((a,i)=>({name:'P'+i,arch:a})),seed:13,seatTokens:0},opts||{}));
const must=(st,a)=>{ const n=E.apply(st,a); if(n.error) throw new Error(a.t+': '+n.error); return n; };
const put=(st,id,k,owner)=>{ st=must(st,{t:'sbPlace',id,k}); if(owner!=null) st=must(st,{t:'sbClaim',k,owner}); return st; };

// Orchard: 3◇ per card in the largest region, +1◇ per Leaf card in it.
let st=game(['Gardener','Archbishop']); st=put(st,'orchard','0,0',0); st=put(st,'burrow','1,0',0); st=put(st,'sanctuary','2,0',0); st=put(st,'fairgrounds','5,5',0);
chk('Orchard', E.cardValue(st,'0,0',0)===3*3+2, 'a region of Orchard, Burrow and Sanctuary: 3×3 + 2 Leaf cards = 11 (the lone card elsewhere doesn’t count) ('+E.cardValue(st,'0,0',0)+')');

// Cathedral: 6◇ per Sceptre card owned, +1◇ per Sceptre card on the board owned by someone else (or nobody).
st=game(['Archbishop','Hedonist']); st=put(st,'cathedral','0,0',0); st=put(st,'sanctuary','1,0',0); st=put(st,'communion','0,1',1); st=put(st,'tithing-hall','4,4');
chk('Cathedral', E.cardValue(st,'0,0',0)===6*2+2, 'own Cathedral and Sanctuary (6◇ each) + 1◇ for each of 2 Sceptre cards it doesn’t own = 14 ('+E.cardValue(st,'0,0',0)+')');

// The seat handicap by table size.
const tok=n=>E.newGame(D.STARTER,{players:['Gardener','Hedonist','Philosopher','Warmonger','Archbishop'].slice(0,n).map(a=>({name:a,arch:a})),seed:1}).players.map(p=>p.tokens).join(',');
chk('Seats', tok(2)==='0,0'&&tok(3)==='6,4,0'&&tok(4)==='9,6,3,0', 'starting ◇: 2 players 0,0 · 3 players 6,4,0 · 4 players 9,6,3,0');
chk('Seats', E.newGame(D.STARTER,{players:[{name:'a',arch:'Gardener'},{name:'b',arch:'Hedonist'},{name:'c',arch:'Warmonger'}],seed:1,seatTokens:[1,2,3]}).players.map(p=>p.tokens).join(',')==='1,2,3', 'a table can set its own list');

// Bots lay a Marsh beside their own card that is one enemy from being Overwhelmed.
st=game(['Gardener','Warmonger']); st=put(st,'orchard','0,0',0); st=put(st,'sanctuary','1,0',0);
st=put(st,'encampment','2,0',1); st=put(st,'trebuchet','1,1',1);        // two Sword neighbours: one more and Sanctuary is Overwhelmed
st=must(st,{t:'startTurn'}); st.players[0].ap=12;
const marsh=Object.keys(st.cards).find(u=>st.cards[u].def==='marsh'&&st.deck.includes(u)); st.deck.splice(st.deck.indexOf(marsh),1); st.players[0].hand=[st.players[0].foundationUid,marsh].filter(Boolean);
const after=B.turn(st,B.newStats(),['tactician','tactician']);
const mk=Object.keys(after.board).find(k=>E.top(after,k)===marsh);
chk('Bots', mk&&E.n4(mk).includes('1,0'), 'a tactician lays its Marsh next to its endangered Sanctuary'+(mk?' (at '+mk+')':' (it kept it)'));

R.forEach(r=>console.log(r[1],'|',r[0],'|',r[2]));
if(R.some(r=>r[1]==='FAIL')) process.exitCode=1;
