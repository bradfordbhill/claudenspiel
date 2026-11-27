// Print and play: every card in the deck (each copy, plus the six Foundations), laid out nine to an A4 page at poker
// size (63 × 88 mm) with crop marks, then a rules sheet. Each card shows its cost, suit, name, type, rules, value,
// income and placement, and a flame box with its burn. The faint dithered suit texture is the one the game draws.
// Usage: node tools/printplay.js [out.pdf]   (default print/claudenspiel-print-and-play.pdf; needs Playwright)
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..'), OUT = process.argv[2] || path.join(ROOT, 'print', 'claudenspiel-print-and-play.pdf');
const D = require('../src/data.js'), E = require('../src/engine.js');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

const cards = [];
D.STARTER.filter(c => c.type === 'Foundation').forEach(c => cards.push(c));
D.STARTER.filter(c => c.type !== 'Foundation').forEach(c => { for (let i = 0; i < (c.copies || 1); i++) cards.push(c); });
// The Pilgrim's Folio follows the base deck on its own sheets, each card marked with the waymark (a road to a gold horizon).
const BASE = cards.length; D.FOLIO.forEach(c => { for (let i = 0; i < (c.copies || 1); i++) cards.push(c); });
// The River Folio after it, marked with a little river under a dusk sky.
const PILGRIM_END = cards.length; D.RIVER.forEach(c => { for (let i = 0; i < (c.copies || 1); i++) cards.push(c); });
const burnText = (c) => c.type === 'Foundation' ? '' : E.defBurnText(c);

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Jacquard+24&family=DotGothic16&display=swap" rel="stylesheet">
<style>
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; font-family: 'DotGothic16', monospace; color: #1b1712; }
.sheet { width: 210mm; height: 297mm; position: relative; page-break-after: always; overflow: hidden; }
.grid { position: absolute; left: 10.5mm; top: 16.5mm; display: grid; grid-template-columns: repeat(3, 63mm); grid-template-rows: repeat(3, 88mm); }
.pc { width: 63mm; height: 88mm; position: relative; border: .2mm solid #8a8070; border-radius: 3mm; overflow: hidden; padding: 3mm 3.2mm 2.6mm; display: flex; flex-direction: column; background-size: 100% 100%; image-rendering: pixelated; }
.pc.s-Sceptre { background-color: #fff6c2; } .pc.s-Goblet { background-color: #f6dcf2; } .pc.s-Sword { background-color: #ffdad5; }
.pc.s-Bone { background-color: #ececec; } .pc.s-Leaf { background-color: #dcf2d4; } .pc.s-Tome { background-color: #d9e4ff; }
.pc.found.s-Sceptre { background-color: #f0d45c; } .pc.found.s-Goblet { background-color: #dea0d4; } .pc.found.s-Sword { background-color: #f19a8e; }
.pc.found.s-Bone { background-color: #c4c4c4; } .pc.found.s-Leaf { background-color: #a9db97; } .pc.found.s-Tome { background-color: #a1bbf0; }
.hd { display: flex; justify-content: space-between; align-items: center; font-size: 13pt; }
.hd svg { width: 7mm; height: 7mm; }
.si-Sceptre { color: #a07a00; } .si-Goblet { color: #9c2f8c; } .si-Sword { color: #b0241a; } .si-Bone { color: #555; } .si-Leaf { color: #2d7a26; } .si-Tome { color: #2747a8; }
.nm { font-family: 'Jacquard 24', serif; font-size: 19pt; line-height: 1; margin-top: 1.5mm; }
.ty { font-size: 7.5pt; color: #5b5144; margin-top: .6mm; }
.tx { font-size: 7.6pt; line-height: 1.32; margin-top: 2mm; flex: 1; }
.meta { font-size: 6.6pt; color: #4a4236; line-height: 1.35; }
.burn { margin-top: 1.6mm; background: #2a1410; color: #ffd27a; border: .5mm solid #e8541c; padding: 1mm 1.6mm; font-size: 7pt; line-height: 1.3; }
.burn b { color: #ff9a1f; }
.ft { display: flex; justify-content: space-between; font-size: 9pt; margin-top: 1.4mm; }
.way { display: inline-block; width: 5.4mm; height: 4.8mm; margin-left: 1.4mm; vertical-align: .6mm; }
.way svg { width: 100%; height: 100%; shape-rendering: crispEdges; }
.foliohead { position: absolute; left: 10.5mm; top: 6mm; font-family: 'Jacquard 24', serif; font-size: 16pt; color: #6b4a1f; }
.crop { position: absolute; background: #000; }
.rules { padding: 16mm 18mm; font-size: 9.6pt; line-height: 1.45; columns: 2; column-gap: 9mm; }
.rules h1 { font-family: 'Jacquard 24', serif; font-size: 34pt; margin: 0 0 2mm; column-span: all; color: #2f6b5a; }
.rules h2 { font-family: 'Jacquard 24', serif; font-size: 17pt; margin: 4mm 0 1mm; color: #6b2a1f; }
.rules p, .rules li { margin: 0 0 1.6mm; } .rules ul { padding-left: 4mm; margin: 0; }
.rules .sub { column-span: all; color: #5b5144; margin-bottom: 4mm; }
</style></head><body><template id="rules-src">@@RULES@@</template><div id="out"></div>
<script>${read('src/cardface.js')}</script>
<script>
const CARDS = ${JSON.stringify(cards.map(c => ({ id: c.id, name: c.name, suit: c.suit, type: c.type, cost: c.cost, income: c.income, text: c.text, place: c.place, score: c.score, archetype: c.archetype, weakTo: c.weakTo, overwhelm: c.overwhelm })))};
const BASE = ${BASE}, PILGRIM_END = ${PILGRIM_END};
const BURNS = ${JSON.stringify(cards.map(burnText))};
const KF = KFace, esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
function tex(suit, seed) { const gw = 126, gh = 176, cv = document.createElement('canvas'); cv.width = gw; cv.height = gh;
  const g = cv.getContext('2d'), img = g.createImageData(gw, gh); img.data.set(KF.texPixels(suit, seed, gw, gh)); g.putImageData(img, 0, 0); return cv.toDataURL(); }
function face(c, i) {
  const meta = [];
  if (c.type === 'Foundation') meta.push('The ' + c.archetype + '. Starts in hand; cannot play ' + c.weakTo + ' cards.');
  if (c.type === 'Grounds') meta.push('Nobody claims Grounds; they never count as an enemy.');
  if (c.overwhelm != null && c.overwhelm !== '') meta.push('Overwhelmed by ' + c.overwhelm + ' enemies.');
  return '<div class="pc s-' + c.suit + (c.type === 'Foundation' ? ' found' : '') + '" style="background-image:url(' + tex(c.suit, c.id + i) + ')">' +
    '<div class="hd"><span>' + c.cost + '●</span>' + KF.icon(c.suit) + '</div>' +
    '<div class="nm">' + esc(c.name) + (i >= PILGRIM_END ? '<i class="way"><svg viewBox="0 0 9 8"><rect width="9" height="3" fill="#3d3a6b"/><rect x="8" y="1" width="1" height="1" fill="#f2e6b0"/><rect y="2" width="2" height="1" fill="#4f8a3c"/><rect x="7" y="2" width="2" height="1" fill="#4f8a3c"/><rect y="3" width="9" height="5" fill="#2f6f9e"/><rect x="1" y="4" width="2" height="1" fill="#bfe3f2"/><rect x="6" y="4" width="2" height="1" fill="#bfe3f2"/><rect x="3" y="5" width="1" height="1" fill="#bfe3f2"/><rect x="0" y="5" width="1" height="1" fill="#bfe3f2"/><rect x="8" y="5" width="1" height="1" fill="#bfe3f2"/><rect x="2" y="7" width="2" height="1" fill="#bfe3f2"/><rect x="7" y="7" width="2" height="1" fill="#bfe3f2"/></svg></i>' : (i >= BASE ? '<i class="way"><svg viewBox="0 0 9 8"><rect width="9" height="3" fill="#f2c14e"/><rect y="3" width="9" height="5" fill="#5f8f45"/><rect x="4" y="3" width="1" height="1" fill="#9a7650"/><rect x="3" y="4" width="3" height="2" fill="#9a7650"/><rect x="2" y="6" width="5" height="2" fill="#9a7650"/><rect x="4" y="6" width="1" height="1" fill="#e8d9a8"/></svg></i>' : '')) + '</div><div class="ty">' + esc(c.type) + ' · ' + esc(c.suit) + '</div>' +
    '<div class="tx">' + esc(c.text) + '</div>' + (meta.length ? '<div class="meta">' + meta.map(esc).join('<br>') + '</div>' : '') +
    (BURNS[i] ? '<div class="burn"><b>🔥 Burn:</b> ' + esc(BURNS[i]) + '</div>' : '') +
    '<div class="ft"><span>' + KF.placeIcon(c.place) + '</span><span>' + (+c.income ? c.income + '● a turn' : '') + '</span></div></div>';
}
function crops() { let h = ''; const L = 10.5, T = 16.5, W = 63, H = 88;
  for (let i = 0; i <= 3; i++) { const x = L + i * W, y = T + i * H;
    h += '<div class="crop" style="left:' + x + 'mm;top:' + (T - 6) + 'mm;width:.2mm;height:4mm"></div><div class="crop" style="left:' + x + 'mm;top:' + (T + 3 * H + 2) + 'mm;width:.2mm;height:4mm"></div>';
    h += '<div class="crop" style="top:' + y + 'mm;left:' + (L - 6) + 'mm;height:.2mm;width:4mm"></div><div class="crop" style="top:' + y + 'mm;left:' + (L + 3 * W + 2) + 'mm;height:.2mm;width:4mm"></div>'; }
  return h; }
let h = '';
const sheets = (from, to, head) => { for (let p = from; p < to; p += 9) h += '<div class="sheet">' + (head ? '<div class="foliohead">' + head + '</div>' : '') + crops() + '<div class="grid">' + CARDS.slice(p, Math.min(p + 9, to)).map((c, j) => face(c, p + j)).join('') + '</div></div>'; };
sheets(0, BASE); sheets(BASE, PILGRIM_END, 'The Pilgrim’s Folio · optional, shuffle in once you know the game'); sheets(PILGRIM_END, CARDS.length, 'The River Folio · optional, with or without the Pilgrim’s Folio');
h += '<div class="sheet"><div class="rules">' + document.getElementById('rules-src').innerHTML + '</div></div>';
document.getElementById('out').innerHTML = h;
</script>
</body></html>`;

const RULES = `<h1>Claudenspiel</h1><p class="sub">A shared-board card game for 2–4 players, about 45 minutes. Print the card pages on card stock (or sleeve them over old cards) and cut along the marks. You also need about 8 meeples per player in their colour, some coins for ● (Aktion points) and tokens for ◇ (victory points). Play online at bradfordbhill.github.io/claudenspiel.</p>
<h2>Setup</h2><ul><li>Each player picks an archetype and takes its Foundation into hand: Archbishop (Cathedral), Hedonist (Palace), Warmonger (Warcamp), Cryptkeeper (Mausoleum), Gardener (Orchard), Philosopher (Observatory).</li><li>Shuffle the other ${BASE - 6} cards into the deck. Deal 4 to each player. Each player takes 8 meeples.</li><li>With 3 players, seats 1 and 2 start with 6◇ and 4◇; with 4 players, seats 1–3 start with 9◇, 6◇ and 3◇.</li></ul>
<h2>A turn</h2><ul><li><b>Start:</b> gain ● equal to the income of the cards you own (your Foundation gives 8●), and draw 2.</li><li><b>Play cards</b> from your hand by paying their cost in ●. Structures and Grounds go on the board touching at least one card, on the sides their placement arrows allow. It costs 3● less next to a card you own. Actions and Blessings take effect, then are buried under a card they touched; Curses cover or slip under their target.</li><li><b>Claim</b> once a turn: put a meeple on an unclaimed card. Claimed cards (and your Foundation) are your Kingdom; their value counts for you. You may buy one more claim a turn for 10● of this turn’s ●.</li><li><b>Burn</b> once a turn (optional rule): discard a card from your hand for the effect in its flame box instead of building it. A <i>ward</i> keeps a card of yours from being Ruined, Overwhelmed, contested or Cursed until your next turn.</li><li><b>Contest</b> once a turn (2–4 players): right after placing a card, pay 8● to take a rival’s card next to it; their meeple goes home and yours takes its place.</li><li><b>End:</b> every full 6● left over banks 1◇ (at most 2◇ a turn). Unspent ● is lost.</li></ul>
<h2>The board</h2><ul><li>A card’s enemies are Sword (except for Sword cards) and the suit its archetype can’t play (Sword’s enemy is Bone). A card with 3 enemy-suit neighbours (Foundations: 8, counting corners) is <b>Overwhelmed</b>: flipped over, worth nothing, its meeples sent home.</li><li>A <b>Ruined</b> card is flipped the same way. The Warmonger banks ◇ for each one it causes.</li><li><b>Grounds</b> are terrain: nobody claims them and they never count as an enemy, but they change the cards next to them.</li><li>Cards <b>buried</b> under another card stay there, and some cards count them.</li></ul>
<h2>Winning</h2><p>Your score is the value of your Kingdom plus your banked ◇. When someone reaches 52◇, finish the round so everyone has had the same number of turns. The highest score wins; a tie goes to whoever reached 52◇ first.</p>
<h2>The Pilgrim’s Folio</h2><p>The cards marked with a little road are an expansion: shuffle them in once you know the game. Their word is the <b>line</b>: the unbroken run of cards through a card in its row or its column, itself included. A Ruined card breaks a line.</p><h2>The River Folio</h2><p>The cards marked with a little river are a second expansion. Their word is <b>downstream</b>: the river runs from the top of the table to the bottom, and a card’s downstream is the unbroken run of cards straight below it (its upstream, the run above). An empty space or a Ruined card ends the river.</p><h2>Archetypes</h2><p>Each Foundation scores in its own way and bans one suit from its owner. The Archbishop builds Sceptre, the Hedonist Goblet, the Warmonger wars, the Cryptkeeper buries, the Gardener grows one great region, and the Philosopher collects all six suits.</p>`;

(async () => {
  const b = await chromium.launch(), p = await b.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.setContent(html.replace('@@RULES@@', () => RULES), { waitUntil: 'load' });
  if (errs.length) throw new Error(errs.join('; '));
  await p.waitForTimeout(800);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await p.pdf({ path: OUT, format: 'A4', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  if (process.env.PNG) await p.screenshot({ path: process.env.PNG, clip: { x: 0, y: 0, width: 794, height: 1123 } });
  await b.close();
  console.log('wrote', OUT, BASE, 'base cards and', cards.length - BASE, 'folio cards,', 'cards on', Math.ceil(BASE / 9) + Math.ceil((PILGRIM_END - BASE) / 9) + Math.ceil((cards.length - PILGRIM_END) / 9), 'pages, plus rules');
})();
