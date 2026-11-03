// Claudenspiel's Book of Deeds (src/deeds.js): deeds are checked at the end of a game, earned once, only by human
// seats, and read the game log correctly. Run: node tests/cs3-deeds.js
const D=require('../src/data.js'), E=require('../src/engine.js'), B=require('../src/bots.js'), K=require('../src/deeds.js');
const R=[]; const chk=(n,c,m)=>R.push([n,c?'PASS':'FAIL',m]);
function play(archs,strats,seed){ let st=E.newGame(D.STARTER,{players:archs.map((a,i)=>({name:'P'+i,arch:a})),seed}); let g=0;
  while(st&&st.winner==null&&st.round<=30&&g++<300) st=st.pending?B.resolve(st,st.cur,strats[st.cur],strats):B.turn(st,B.newStats(),strats); return st; }

chk('List', new Set(K.LIST.map(d=>d.id)).size===K.LIST.length&&K.LIST.length>=18, K.LIST.length+' deeds, each with its own id');

// A finished bot game; seat 0 then counts as the human at the table (bots carry a bot style).
let st=play(['Archbishop','Gardener','Hedonist'],['tactician','tactician','tactician'],3);
chk('Game', st&&st.winner!=null, 'a 3-player bot game finishes (winner P'+(st&&st.winner)+')');
st.players.forEach((q,i)=>{ q.bot=i===0?undefined:'tactician'; });
const g=K.facts(st,0), book={};
const fresh=K.award(st,book);
chk('Award', fresh.every(f=>f.by==='P0'), 'only the human seat earns deeds ('+fresh.map(f=>f.deed.name).join(', ')+')');
chk('Award', (g.won===true)===fresh.some(f=>f.deed.id==='first'), 'First Victory goes to the human exactly when they won');
chk('Award', book.games===1&&Object.keys(book.deeds).length===fresh.length, 'the book records the game and every deed earned');
chk('Award', K.award(st,book).length===0, 'a deed is earned only once');
const banks=st.log.filter(l=>/^P0 banks 2◇/.test(l)).length, plays=st.log.filter(l=>/^P0 plays (Marsh|Battlefield|Crossroads) /.test(l)).length;
chk('Facts', g.banked2===banks&&g.grounds===plays, 'banking and Grounds are counted from the log ('+banks+' full banks, '+plays+' Grounds)');
chk('Facts', g.kingdom===E.kingdom(st,0).length&&g.total===E.scores(st)[0].total, 'Kingdom size and total match the game');
chk('Facts', g.lastRound===!!st.lastRound, 'the last round is noticed');

// Six Crowns needs a win with every archetype.
const b2={wins:{Archbishop:1,Hedonist:1,Warmonger:1,Cryptkeeper:1,Gardener:1}};
const six=K.LIST.find(d=>d.id==='six');
chk('Six Crowns', !six.check({},b2)&&six.check({},{wins:Object.assign({Philosopher:1},b2.wins)}), 'needs a win with all six archetypes');

// No deeds for a game where every seat is a bot.
let sb=play(['Warmonger','Philosopher'],['greedy','greedy'],8); sb.players.forEach(q=>q.bot='greedy');
chk('Award', K.award(sb,{}).length===0, 'an all-bot game earns nothing');

R.forEach(r=>console.log(r[1],'|',r[0],'|',r[2]));
if(R.some(r=>r[1]==='FAIL')) process.exitCode=1;
