/* Claudenspiel patch notes, newest first (Claudenspiel's own; Kartenspiel keeps its own in its repository).
   v must be new for each entry. Players who have played before see the newest one in a "What's new" window. */
var KPatch = [
  { v: 'cs-1.0-pre-roads', date: '23 November 2026', title: 'War cuts roads', notes: [
    'A <b>Ruined</b> card now breaks a line, just like an empty space. Ruin the middle of a rival’s road and their <b>Pilgrim’s Way</b>, <b>Cartographer</b> or <b>Hedgerow</b> is cut in two.',
    'Why: with the Pilgrim’s Folio, the long roads were scoring faster than war could take them apart, and the Warmonger fell well behind (a win index of 0.74 against 0.90 without the folio, on the same 300 three-player deals). With broken roads it is back to 0.88.',
    'The print-and-play PDF now has the folio too, on its own sheets after the base deck, each card marked with the little road.'
  ] },
  { v: 'cs-1.0-pre-folio', date: '22 November 2026', title: 'The Pilgrim’s Folio', notes: [
    'Win every stop of Act I of the campaign and <b>the Pilgrim’s Folio</b> opens: twelve new cards from the road, two a suit, shuffled into your games (switch them off under <b>Folios</b> on the New game page). Each carries a small pixel waymark after its name.',
    'The folio’s word is the <b>line</b>, the unbroken run of cards through a card in its row or column. <b>Pilgrim’s Way</b> scores its longest line, <b>Cartographer</b> the suits of your own cards along it, and <b>Hedgerow</b> the Leaf cards in its row and column. Select one on the board and its line lights up.',
    '<b>Wayside Inn</b> pays for every player with a card next to it, so it wants to be built on a border. <b>Watchfire</b> scores the Ruins around it, <b>Chapter House</b> the Sceptres, and the <b>Ossuary Bell</b> banks you 1◇ whenever anyone buries a card.',
    'Five Actions: <b>Feast Day</b> (everyone draws, you most), <b>Levy</b> (● for your Swords), <b>Vigil</b> (draw 1, bury 1), <b>Harvest Moon</b> (bank ◇ for your largest region) and <b>Pilgrim’s Tale</b> (draw for your Tomes). Every folio card burns its own way too.',
    'A new deed, <b>The Long Road</b>: finish owning a card whose line is ten cards long. Help has a new page on the folio and now describes Act III too.'
  ] },
  { v: 'cs-1.0-pre-city', date: '21 November 2026', title: 'The City at Dawn', notes: [
    '<b>Act III</b>, the last act of the campaign, opens once you win the Bridge of Kings. A new map: the city at dawn, the sun coming up over the roofs beside the cathedral, rows of red tile and slate, chimney smoke, doves crossing the sky, and the street climbing from the gate to the <b>Margrave’s Hall</b> on its hill.',
    'Every quarter is held by a named champion who plays as the <b>Genius</b>, the strongest bot: <b>Mistress Florin</b> the moneychanger, <b>Archivist Mechthild</b>, <b>Guildmaster Thorvald</b>, <b>the Abbess</b> and <b>Sir Ulrich the Red</b>, each with a pixel portrait. At the Hall three of them sit down against you at once.',
    'New customs: <b>guest-right</b> (you start with a gift of ◇), <b>hallowed ground</b> (a card with a card buried under it can’t be contested), <b>the audit</b> (suit majorities pay 4◇ every second round), <b>Lent</b> (no Goblet cards), and <b>the tourney</b> (twice the Swords).',
    'Walk the whole road and the Margrave gives you the seat by the fire.'
  ] },
  { v: 'cs-1.0-pre-river', date: '20 November 2026', title: 'The River Towns', notes: [
    '<b>Act II</b> of the campaign opens once you win the Toll Gate: a new map of the river valley by moonlight, with the towpath running from town to town, fireflies over the fields, a barge drifting downstream and the city close now on the right.',
    'Six towns, the full game at every one, against <b>tactician</b> and <b>warlord</b> bots instead of greedy ones. Each town keeps a <b>custom</b>: only 5 meeples at <b>Saltmarsh Wharf</b>, a market row at <b>Ferrybridge</b>, burning at <b>the Weir at Gallows Bend</b>, no Sword cards at all at <b>Lantern Abbey</b>, three cards a turn at <b>Tanners’ Row</b>, and everything at once, four to a table, on <b>the Bridge of Kings</b>.',
    'New challenges for the third star: win with a meeple to spare, five Goblets, five suits with no Swords in the deck, a garden of six, four Ruins at a full table.',
    'The Campaign page has a tab for each act, with its own star count.'
  ] },
  { v: 'cs-1.0-pre-road', date: '19 November 2026', title: 'The Long Road to the City', notes: [
    'A <b>campaign</b>: the Campaign tab (and a new banner on the title screen) opens a map of the prairie, painted in dithered pixels, with a road winding past six stops toward the walled city.',
    'Act I teaches the game one rule at a time against greedy bots: build and claim at the <b>Crossroads Inn</b>, banking at the <b>Mill at Hollow Brook</b>, burying at the <b>Shepherd’s Barrow</b>, two claims and Ascension at the <b>Ford of Reeds</b>, war at the <b>Burnt Watchtower</b>, and contest at the <b>Toll Gate</b>, the full game against two rivals. You play a different archetype at each.',
    'Every stop has <b>three stars</b>: win, win by its par round, and a challenge (bank 2◇ twice, bury seven, win having lost at most one card…). Win a stop to open the next; your little meeple walks the road as you go.',
    'Stars stamp in on the Chronicle at the end of a campaign game, with a button straight to the next stop.'
  ] },
  { v: 'cs-1.0-pre-burns', date: '18 November 2026', title: 'Every card burns its own way', notes: [
    '<b>Burn</b> (a New game option, still on trial) now gives <b>every card its own burn</b> instead of one effect per suit. A flame tag under each card in your hand shows what burning it would do: Spice Caravan burns for 8●, Reconstructed Map draws 3, an Obelisk is buried under your own card and banks 2◇, Trebuchet banks 1◇ per Ruined card on the board.',
    'Two new burn effects. A <b>ward</b> (dashed blue frame and ⛨) keeps a card of yours safe from Ruin, Overwhelm, contest and Curses until your next turn. A <b>discount</b> makes the next card you place this turn cheaper.',
    'Burning a card sets it alight: dithered pixel flames climb out of your hand in steps, sparks drift up and a little ash falls. A ward draws a ring of pale blue pixels around its card.',
    'The Library shows each card’s burn under its preview.',
    '<b>Print and play:</b> Help links a PDF with all 134 cards, nine to a page with crop marks, and a one-page rules sheet, for a game at a real table.',
    'When the turn passes, the new player’s card slides out a few pixels and its colour catches a glint.'
  ] },
  { v: 'cs-1.0-pre-tuck', date: '17 November 2026', title: 'Tucked pages and violet smoke', notes: [
    '<b>Burying</b> now shows the card going under: it drops onto its host, slides beneath it, and its edge peeks out below for a moment, like a page tucked into a book.',
    'A <b>Curse</b> no longer glows. Violet smoke curls up out of the card in dithered pixels and sinks into its lower-left corner, where a small <b>hex eye</b> stays for as long as the Curse does. Cursed cards keep a crisp violet frame.',
    'A <b>bought claim</b> has its moment too: an iron-bound strongbox appears beside your ●, two coins flip into it and the lid slams shut.'
  ] },
  { v: 'cs-1.0-pre-title', date: '16 November 2026', title: 'The city at dusk', notes: [
    'Claudenspiel now opens on a <b>title screen</b>: the walled city at dusk, drawn in dithered pixels. Stars twinkle, windows light and go out, smoke rises from the chimneys, a lantern walks the wall, and wind moves through the grass. The menu hangs from the wall as six banners, one per suit.',
    'Tick <b>Skip this screen next time</b> to go straight to the workshop. The crest in the title bar always brings it back.',
    '<b>Living Grounds:</b> every Grounds card on the board shows its terrain in a tiny moving picture. Reeds sway in the Marsh, embers rise over the Battlefield, a cart crosses the Crossroads, the Library’s candle gutters, a wisp drifts over the Barrow and light walks across the Shrine’s gold roof.',
    'Hovering an Action or Blessing in your hand now says what playing it would do: your ◇, ● a turn and cards drawn, and what it costs the rival it hurts most. Placed cards already had this.',
    'Earning a <b>deed</b> or a mastery level now drops a parchment scroll onto the screen. A wax seal stamps it, then it rolls itself up and flies off to the Deeds tab.',
    '<b>Rain</b> falls on the board in the last round. If you lose to a bot, the board dims and the wind picks up.',
    'An <b>Ascension</b> now has its own moment: the five suit colours spiral up out of the card, it flashes gold, and five rising notes play.'
  ] },
  { v: 'cs-1.0-pre-grounds', date: '15 November 2026', title: 'Holy ground, old dead and a reading room', notes: [
    'Three new <b>Grounds</b>, so every suit now has its own terrain. <b>Library</b> (Tome, 5●): placing a card next to it draws you a card, once a turn. <b>Barrow</b> (Bone, 5●): burying a card under a card next to it banks you 2◇. <b>Shrine</b> (Sceptre, 6●): cards next to it keep the Shrine’s peace and can’t be contested or Cursed. Two of each; the deck is now 128 cards.',
    'Cards in the Shrine’s peace wear a gilded frame and a small gold cross (✠). Each new Ground has its own sound: rustling pages and a bell, a low earthen thud, a soft chord.'
  ] },
  { v: 'cs-1.0-pre-mastery', date: '14 November 2026', title: 'Mastery', notes: [
    'Every archetype now has <b>ten levels of mastery</b>. A finished game earns marks: 1 for playing, 2 for winning, and 2 more for reaching the archetype’s goal (the Cryptkeeper: 7 or more buried cards; the Gardener: a region of 7; and so on). The New game page shows each human seat’s goal.',
    'Levels bring <b>titles</b> (from Novice to Prince of the Church, Gravedigger to Keeper of the Dead) and open three <b>strategy notes</b> per archetype, at levels 2, 5 and 8. Mastery never makes anyone stronger at the table.',
    'See it all at the bottom of the <b>Deeds</b> page; the Chronicle shows what each game earned. Deed titles are now readable in dark mode too.'
  ] },
  { v: 'cs-1.0-pre-mausoleum', date: '13 November 2026', title: 'The dead are everywhere', notes: [
    '<b>Mausoleum</b> is now also worth 1◇ for every two cards buried anywhere else on the board. The Cryptkeeper was the weakest archetype at 4 players. Bigger tables bury more cards, so the new bonus grows with the table. At 2 and 3 players it hardly changes anything.',
    'A <b>Ruin</b> now cracks the card along a jagged line. Its colours fade to grey in three steps, and chips fall off its edges.',
    'An <b>Overwhelm</b> sends red chevrons in from all four sides. They pulse twice, then the card is crushed flat and the chevrons scatter. A low drum roll plays underneath and cuts off at the crush. It is deeper when a Foundation falls.'
  ] },
  { v: 'cs-1.0-pre-chronicle', date: '12 November 2026', title: 'The Chronicle, and Contest by default', notes: [
    'When a game ends, <b>the Chronicle</b> tells its story: everyone’s ◇ after every turn as a stepped line, marks where the Ruins, Overwhelms, contests and the last round fell, and the turning points in words. Open it again with <b>Chronicle</b> above the board.',
    'Before it, the winner’s Kingdom lights up card by card, the most valuable last, and their banner unrolls (full Motion only).',
    '<b>Contest</b> is now on by default for 2–4 players. Measured over more than 1,400 bot games, it keeps the archetypes as even as before and makes the better player win more often. Untick it on the New game page to play without it.'
  ] },
  { v: 'cs-1.0-pre-contest', date: '11 November 2026', title: 'Contest (on trial), with a clash of blades', notes: [
    'Another piece of the second edition, to try: tick <b>Contest</b> on the New game page. Once a turn, pay 8● of this turn’s ● to take a rival’s card next to the one you just placed: their meeple goes home and yours takes its place. Foundations, Ascended cards and shared cards can’t be taken.',
    '<b>The dead follow their keeper:</b> when a Cryptkeeper’s card is contested, the cards buried under it don’t change hands. They move under the Cryptkeeper’s Mausoleum.',
    'New sounds and motion: a contest rings two blades together and knocks the old meeple tumbling off the card; burials thud into earth (Bone cards, and anything under a Foundation) or close like a heavy book; a hand bell rings when it’s your turn again after the bots have played.',
    '<b>Death Ray</b> costs 9● and is worth 3◇ (was 12● and 2◇).',
    'Hand cards lift a little when you hover them, and the spaces you can play into breathe gently (full Motion only).'
  ] },
  { v: 'cs-0.9', date: '4 November 2026', title: 'Claudenspiel 0.9: Burn (on trial)', notes: [
    'Another piece of the second edition, to try: tick <b>Burn</b> on the New game page. Once a turn, discard a card from your hand for a one-time effect set by its suit: Goblet +5●, Tome draw 2, Leaf +2◇, Sceptre claim again, Sword (this turn rivals’ cards need one fewer enemy to be Overwhelmed), Bone (bury it under one of your own cards). Select a card and click <b>Burn</b>.',
    'With the Market or Burn on, the <b>Genius</b> now plans its market picks and burns instead of following a rule of thumb.'
  ] },
  { v: 'cs-0.8', date: '4 November 2026', title: 'Claudenspiel 0.8: a sharper Genius', notes: [
    'The <b>Genius bot</b> is stronger: it now plays out each imagined turn the way the tactician plays, and judges where that leaves it the tactician’s way. Measured on the same deals, it wins 60% of 2-player games where a tactician in its seat wins 50%.',
    'It still plays fair: it sees only what you would see.'
  ] },
  { v: 'cs-0.7', date: '4 November 2026', title: 'Claudenspiel 0.7: no dead cards', notes: [
    '<b>You’ll Regret That</b> can now be played from your hand too: for 3●, choose any card next to one of yours and it produces no ●. As a reaction to a Ruin it is still free and still Curses the Structure that did it.'
  ] },
  { v: 'cs-0.6', date: '4 November 2026', title: 'Claudenspiel 0.6: the market (on trial)', notes: [
    'A first piece of the second edition, to try: tick <b>Market</b> on the New game page. Three cards lie face up; each of your turn’s draws can be one of them or the top of the deck, at any point in your turn. Draws you leave are drawn blind when you end it.',
    'Hover a market card to read it; the race bar and the market sit together above the board.'
  ] },
  { v: 'cs-0.5', date: '4 November 2026', title: 'Claudenspiel 0.5: a word in your ear', notes: [
    '<b>Why is this good?</b> On your turn, hover a card in your hand: the magnified card shows what it would gain you at its best space right now, claimed if you still can.',
    '<b>Palace</b> scores 2◇ per Goblet card you don’t own (was 3◇): the Hedonist was strongest, most of all at big tables.',
    'More motion: ◇ counters tick up, banked ● fly into your pile, chevrons beat like a heart around a card one enemy from Overwhelm, and the Genius thinks by candlelight.'
  ] },
  { v: 'cs-0.4', date: '3 November 2026', title: 'Claudenspiel 0.4: sound, motion and a fairer table', notes: [
    '<b>Sound</b> (tick <b>Sound</b> above the board, or press M): every card lands with its own suit’s knock, claims press a wax seal, Ruins crack, the city bell rings for the last round, and more. Off until you turn it on.',
    '<b>Animations</b>: cards drop into place, meeples land in a puff of dust, the last round unrolls a banner. Choose <b>Motion</b>: full, calm or off.',
    '<b>Cathedral</b> also scores 1◇ for each Sceptre card on the board you don’t own: the Archbishop was weakest at bigger tables.',
    '<b>Orchard</b> scores 1◇ more for each Leaf card in your largest region.',
    'With three players, the seat handicap is 6◇, 4◇ and 0◇ (with four, 9◇, 6◇, 3◇ and 0◇).',
    '<b>Mausoleum</b> is back to 3◇ per buried card: with smarter bots, the Cryptkeeper no longer needed the bonus.',
    'The bots now lay <b>Grounds</b> on purpose: Marsh to shelter their own cards, Battlefield against yours.'
  ] },
  { v: 'cs-0.3', date: '3 November 2026', title: 'Claudenspiel 0.3: the Book of Deeds', notes: [
    'The <b>Book of Deeds</b>: 19 deeds to earn in play, from <i>First Victory</i> to <i>Six Crowns</i> (win with every archetype). Find it under <b>Deeds</b>.',
    'The target is <b>52◇</b> (was 48◇): banking and second claims had made games a round shorter.',
    '<b>Mausoleum</b> still scores 3◇ per buried card in your Kingdom, and now 4◇ for each one buried under the Mausoleum itself: the Cryptkeeper was the weakest archetype.',
    'Claudenspiel has its own icon.'
  ] },
  { v: 'cs-0.2', date: '3 November 2026', title: 'Claudenspiel 0.2: ground, gold and the race', notes: [
    '<b>Grounds</b>, the first terrain cards: placed like a Structure, claimed by nobody, never an enemy. <b>Marsh</b> shelters its neighbours from Overwhelm, <b>Battlefield</b> exposes them, <b>Crossroads</b> makes building next to it 3● cheaper.',
    '<b>Banking</b>: every 6● you don’t spend becomes 1◇ at the end of your turn (at most 2◇).',
    '<b>Buy a second claim</b> for 10● once a turn, paid from this turn’s ● (not Reserves).',
    'With three or more players, earlier seats start with 3◇ for each seat after them: the last round let later seats see the score to beat.',
    'A <b>race bar</b> above the board shows everyone’s ◇ on one track to 48, and rings the bell for the last round.',
    '<b>Obelisk</b> is worth 6◇ (12◇ surrounded). <b>Fountain</b> pays 3◇ per Leaf neighbour and joins on any side.'
  ] },
  { v: 'cs-0.1', date: '3 November 2026', title: 'Claudenspiel 0.1: the fork', notes: [
    'Claudenspiel splits off from Kartenspiel as its own game, with its own saves, look and rules.',
    'A <b>116-card deck</b>: staples have two or three copies, the strongest and strangest cards stay single. No more reshuffles at big tables.',
    'The <b>last round</b>: reaching 48◇ no longer ends the game at once. Everyone gets the same number of turns, then the highest total wins.',
    '<b>Orchard</b> scores 3◇ per card in your largest region (was 4). <b>Observatory</b> scores 10◇ more when all six suits are in your Kingdom.',
    '<b>Seat start</b> is off by default: with the last round, everyone already gets the same number of turns.',
    '<b>Revenge</b> and <b>Repent</b> can also be played from hand to draw 2 and discard 1. <b>Brambles</b> can be placed like any Structure.'
  ] }
];
if (typeof module !== 'undefined') module.exports = KPatch;
