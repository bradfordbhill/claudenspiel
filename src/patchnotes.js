/* Claudenspiel patch notes, newest first (Claudenspiel's own; Kartenspiel keeps its own in its repository).
   v must be new for each entry. Players who have played before see the newest one in a "What's new" window. */
var KPatch = [
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
