// Contest (influence, on trial): pay 8● to take a rival's card next to the one you just placed.
// Run: node tests/cs8-contest.js
const D=require('../src/data.js'), E=require('../src/engine.js');
const R=[]; const chk=(n,c,m)=>R.push([n,c?'PASS':'FAIL',m]);
const game=(o)=>E.newGame(D.STARTER,Object.assign({players:[{name:'A',arch:'Gardener'},{name:'B',arch:'Hedonist'}],seed:21,contest:true},o||{}));
const must=(st,a)=>{ const n=E.apply(st,a); if(n.error) throw new Error(a.t+': '+n.error); return n; };
function setup(o){ let st=must(game(o),{t:'startTurn'}); const k='0,0';
  // a rival-owned card at 0,0 and a last-placed card of ours next to it
  const rival=st.deck.find(x=>{const d=E.rawDef(st,x);return d.type!=='Foundation'&&d.type!=='Curse'&&d.type!=='Grounds';}); st.deck.splice(st.deck.indexOf(rival),1);
  st.board[k]=[rival]; st.cards[rival].claimants=[1]; st.players[1].meeples--;
  const mine=st.deck.find(x=>{const d=E.rawDef(st,x);return d.type!=='Foundation'&&d.type!=='Curse'&&d.type!=='Grounds'&&x!==rival;}); st.deck.splice(st.deck.indexOf(mine),1);
  st.board['1,0']=[mine]; st.turn.lastKey='1,0'; st.players[0].ap=20; return {st,k,rival}; }
let {st,k,rival}=setup(); const m0=st.players[0].meeples, r0=st.players[1].meeples;
chk('Options', E.contestOptions(st,0).includes(k), 'a rival card next to the last card placed can be contested');
st=must(st,{t:'contest',k});
chk('Takeover', st.cards[rival].claimants.length===1&&st.cards[rival].claimants[0]===0&&st.players[0].meeples===m0-1&&st.players[1].meeples===r0+1, 'the rival’s meeple goes home, yours takes its place');
chk('Price', st.players[0].ap===20-E.CONTEST_PRICE, 'it costs '+E.CONTEST_PRICE+'●');
chk('Once', !!E.apply(st,{t:'contest',k}).error, 'only once a turn');
({st,k}=setup()); st.players[0].ap=3; chk('Poor', !!E.apply(st,{t:'contest',k}).error, 'too few ● is refused');
({st,k}=setup({contest:false})); chk('Switch', !!E.apply(st,{t:'contest',k}).error, 'off unless the game asks for it');
({st,k,rival}=setup()); st.cards[rival].fixed=true; chk('Fixed', !!E.apply(st,{t:'contest',k}).error, 'a Foundation’s fixed claim stays');
// The dead follow their keeper: a Cryptkeeper's buried cards move under its Foundation when a card is taken.
function keeper(o){ let st=E.newGame(D.STARTER,Object.assign({players:[{name:'A',arch:'Gardener'},{name:'B',arch:'Cryptkeeper'}],seed:21,contest:true},o||{}));
  st=must(st,{t:'startTurn'}); const pick=()=>{ const x=st.deck.find(u=>{const d=E.rawDef(st,u);return d.type!=='Foundation'&&d.type!=='Curse'&&d.type!=='Grounds';}); st.deck.splice(st.deck.indexOf(x),1); return x; };
  const fnd=st.players[1].hand.find(u=>E.rawDef(st,u).type==='Foundation')||st.deck.find(u=>E.rawDef(st,u).name==='Mausoleum');
  ['hand','deck'].forEach(z=>{ const a=z==='hand'?st.players[1].hand:st.deck; const i=a.indexOf(fnd); if(i>=0) a.splice(i,1); });
  st.board['-1,0']=[fnd]; st.cards[fnd].claimants=[1]; st.cards[fnd].fixed=true; st.players[1].foundationUid=fnd;
  const rival=pick(), b1=pick(), b2=pick(); st.board['0,0']=[rival,b1,b2]; st.cards[rival].claimants=[1];
  const mine=pick(); st.board['1,0']=[mine]; st.turn.lastKey='1,0'; st.players[0].ap=20; return {st,fnd,rival,b1,b2}; }
{ let {st,fnd,rival,b1,b2}=keeper(); const before=E.scores(st)[1].total; st=must(st,{t:'contest',k:'0,0'});
  chk('Keeper', st.board['0,0'].length===1&&st.board['-1,0'].includes(b1)&&st.board['-1,0'].includes(b2), 'a contested Cryptkeeper card’s buried cards move under the Mausoleum');
  chk('Keeper score', E.scores(st)[1].total>=before-E.cardValue({...st},'0,0',1)-1, 'the Cryptkeeper keeps its dead'); }
{ let {st}=keeper({graveFollows:false}); st=must(st,{t:'contest',k:'0,0'}); chk('Keeper off', st.board['0,0'].length===3, 'with the rule off the buried cards stay put'); }
const f=R.filter(r=>r[1]==='FAIL'); R.forEach(r=>{ if(r[1]==='FAIL') console.log(r.join(' · ')); }); console.log((R.length-f.length)+'/'+R.length+' pass'); process.exit(f.length?1:0);
