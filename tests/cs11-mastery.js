// Archetype mastery (src/deeds.js): marks per finished game (1 played, 2 won, 2 goal), ten levels, titles at 1/4/7/10,
// strategy notes at 2/5/8, only for human seats. Run: node tests/cs11-mastery.js
const D=require('../src/data.js'), E=require('../src/engine.js'), B=require('../src/bots.js'), K=require('../src/deeds.js');
const R=[]; const chk=(n,c,m)=>R.push([n,c?'PASS':'FAIL',m]);
function play(archs,strats,seed){ let st=E.newGame(D.STARTER,{players:archs.map((a,i)=>({name:'P'+i,arch:a})),seed}); let g=0;
  while(st&&st.winner==null&&st.round<=30&&g++<300) st=st.pending?B.resolve(st,st.cur,strats[st.cur],strats):B.turn(st,B.newStats(),strats); return st; }

chk('Table', Object.keys(K.MASTERY).length===6 && Object.values(K.MASTERY).every(m=>m.titles.length===4&&m.notes.length===3&&m.goal), 'six archetypes, each with a goal, four titles and three notes');
chk('Levels', K.level(0)===0&&K.level(1)===0&&K.level(2)===1&&K.level(64)===9&&K.level(65)===10&&K.level(999)===10, 'level thresholds 2 … 65, capped at 10');
const r0=K.rank('Cryptkeeper',0), r5=K.rank('Cryptkeeper',20), r10=K.rank('Cryptkeeper',70);
chk('Rank', r0.title===null&&r0.notes.length===0, 'level 0: no title, no notes');
chk('Rank', r5.level===5&&r5.title==='Sexton'&&r5.notes.length===2, 'level 5: the second title and two notes');
chk('Rank', r10.level===10&&r10.title==='Keeper of the Dead'&&r10.notes.length===3&&r10.next===null, 'level 10: the last title, every note, no next level');

let wins=0, goals=0;
for(let seed=1; seed<=12; seed++){
  const archs=[['Archbishop','Hedonist'],['Warmonger','Cryptkeeper'],['Gardener','Philosopher']][seed%3];
  const st=play(archs,['tactician','tactician'],seed); if(!st||st.winner==null) { chk('Game',false,'seed '+seed+' did not finish'); continue; }
  st.players.forEach((q,i)=>{ q.bot=i===0?undefined:'tactician'; });
  const book={mastery:{}}, m=K.marks(st,0), got=m.reduce((a,x)=>a+x.n,0), g=K.facts(st,0);
  K.award(st,book);
  if(st.winner===0) wins++; if(m.some(x=>x.why==='goal')) goals++;
  chk('Award', book.mastery[archs[0]]===got && Object.keys(book.mastery).length===1, 'seed '+seed+': only the human seat ('+archs[0]+') gains '+got+' marks');
  chk('Award', got === 1 + (g.won?2:0) + (K.MASTERY[archs[0]].met(g)?2:0), 'seed '+seed+': marks = 1 played + 2 won + 2 goal');
  chk('Award', book.lastMastery.length===1 && book.lastMastery[0].to===K.level(got), 'seed '+seed+': the game’s marks are recorded for the Chronicle');
}
chk('Spread', wins>0 && goals>0, wins+' wins and '+goals+' goals in 12 games: both kinds of mark occur');
const sb=play(['Warmonger','Philosopher'],['greedy','greedy'],8); sb.players.forEach(q=>q.bot='greedy'); const bb={}; K.award(sb,bb);
chk('Bots', !bb.mastery||!Object.keys(bb.mastery).length, 'an all-bot game earns no mastery');

R.forEach(r=>console.log(r[1],'|',r[0],'|',r[2]));
if(R.some(r=>r[1]==='FAIL')) process.exitCode=1;
