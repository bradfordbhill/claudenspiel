# Journal

Claude's decision log for Claudenspiel, newest first: what changed, why, and what the bots measured. "Win index" is wins divided by the wins a seat would get by chance; 1.0 is par.

## 20 November 2026 · 1.0-pre, the River Towns (campaign Act II)

**Why.** Act I ends at the Toll Gate with the full game against greedy bots, and then the road stopped. A player who has walked it knows every rule but has never met a bot that plans or one that fights. Act II is the bridge from "I know the rules" to "I can beat a tactician": the full game at every stop, tacticians and warlords as rivals, and at each town one **custom**, a rule twist that holds only there. Customs are also how the campaign shows off the variants still on trial (market, Burn) without asking anyone to read a New game form.

**The towns.**

| Stop | Custom | You | Rival(s) | Par | Challenge |
|---|---|---|---|---|---|
| 1 Saltmarsh Wharf | Short of hands: 5 meeples | Archbishop | tactician Cryptkeeper | 7 | win with a meeple unused |
| 2 Ferrybridge | Market day: a row of 3 | Hedonist | tactician Gardener | 6 | 5+ Goblets |
| 3 Weir at Gallows Bend | Ember night: Burn | Cryptkeeper | warlord Philosopher | 5 | win, losing at most 2 cards |
| 4 Lantern Abbey | Pax Dei: no Sword cards | Philosopher | tactician Archbishop, tactician Gardener | 4 | 5+ suits |
| 5 Tanners' Row | Spring flood: hand 5, draw 3 | Gardener | warlord Warmonger, tactician Philosopher | 5 | garden of 6+ |
| 6 Bridge of Kings | Market and Burn, 4 seats | Warmonger | warlord Cryptkeeper, tactician Archbishop, tactician Hedonist | 5 | Ruin or Overwhelm 4+ |

**Measured** with `tools/campsim.js` (new): a **tactician** stands in for the player now, since someone who finished Act I is past greedy play. 40–60 games a stop.

| | Wharf | Ferry | Weir | Abbey | Tanners | Kings |
|---|---|---|---|---|---|---|
| Win | 48% | 44% | 40% | 44% (par 33) | 25% (par 33) | 32% (par 25) |
| Challenge | 14% | 18% | 40% | 16% | not run (a garden of 6 is the top quarter of games) | 18% |

**What the numbers changed.**
- *Pax Dei was first the Warmonger's stop* ("a warlord at peace": win by building). It won 7% at 3 players and 16–24% even at 2. Taking a Warmonger's swords is a joke at its expense, not a lesson. The Philosopher, whose enemy suit is Sword, plays the Abbey now (44%), and the Warmonger gets the Bridge of Kings, where four Kingdoms are four places to raid.
- *The Gardener struggles wherever war is heavy*: 14% at the 4-seat Bridge and 25% at Tanners' Row whatever rivals I tried (10–30%). It stays at Tanners' as the act's hardest stop. The flood's extra cards help the warlords more than the garden.
- *Six suits at the Bridge came 0 times in 50*; the Abbey's Overwhelm-2 came 0 times too. Both replaced. The Wharf's "win without taking back a meeple" came free with nearly every win (44% of games against 48% wins), so it asks for a meeple to spare now (14%).
- Pars are the median winning round, as in Act I: the Wharf's games run long (7) with few meeples, the Abbey's short (4) with no Ruins to slow anyone.

Win rates don't climb as neatly as Act I's: the 3- and 4-seat stops sit above their par share while Tanners' sits under it. I'd rather keep the lessons in a sensible order (few hands, the market, burning, peace, flood, everything) than reorder towns to chase a ±7% curve.

**The look.** Act II has its own map: the river valley by moonlight, fields in dithered strips of meadow, wheat and orchard, scattered trees and fireflies, a broad river along the bottom with the moon's broken reflection, the towpath (worn pale where you've walked), and the city close on the right with a cathedral spire and a lit gate. A barge drifts downriver in steps. New pixel landmarks: a sailing boat at the wharf, a rope ferry, a mill wheel at the weir, the abbey with its lit belfry, tanners' racks of dyed hides, and the bridge with two towers. The ribbon over the board turns night blue, names the custom instead of the lesson, and numbers stops by act (II.3). The Campaign page has a tab per act with its own star count.

**Next:** Act III, the city, against the Genius as named rivals; a hand-off from the Toll Gate's Chronicle straight onto the river map; the 3-player Burn test (Weir and Bridge now put Burn in front of players, which makes that test more pressing).

## 19 November 2026 · 1.0-pre, the Long Road to the City

**Why a campaign now.** Everything so far has been for people who already know the game. The rules have grown (banking, burying, two claims, Ascension, contest), and a new player meets them all at once on the New game page. The progression wishlist's first unfinished item was Act I of a campaign that teaches one rule at each stop, so that is this release.

**The design.** Six stops on a road across the prairie, each against greedy bots, each turning one rule on and keeping the earlier ones, so the last stop is the full default game (contest on; Burn and the market stay off while they're on trial). You play a different archetype at every stop, so by the gate you've tried all six.

| Stop | Lesson | You | Rival(s) | Target | Par | Challenge |
|---|---|---|---|---|---|---|
| 1 Crossroads Inn | Build and claim | Gardener | Hedonist | 30◇ | round 4 | own 6+ cards |
| 2 Mill at Hollow Brook | Banking | Hedonist | Cryptkeeper | 36◇ | 5 | bank 2◇ twice |
| 3 Shepherd's Barrow | Burying, Defense | Cryptkeeper | Archbishop | 40◇ | 5 | 7+ buried |
| 4 Ford of Reeds | Second claim, Ascension | Philosopher | Warmonger | 44◇ | 5 | 5+ suits |
| 5 Burnt Watchtower | War | Warmonger | Archbishop | 48◇ | 6 | Ruin or Overwhelm 3 |
| 6 Toll Gate | Contest, three seats | Archbishop | Warmonger, Gardener | 52◇ | 6 | win, losing at most 1 card |

Three stars a stop: win, win by par, and the challenge. The engine now counts each player's lost cards (Ruined, Overwhelmed or contested away) for the last one.

**Measured, then tuned.** A greedy bot in the player's seat stands in for a newcomer (60 games a stop; a tactician scored the same). My first draft guessed pars of 7–8 rounds and was wrong: these games end in round 4–6. And two matchups were far too hard for early stops: Hedonist against a Gardener won 25–30%, and Warmonger against a Philosopher 20%. Every pairing was tried (50 games each) and the friendliest ones that still teach the lesson kept:

| | Inn | Mill | Barrow | Ford | Watchtower | Gate |
|---|---|---|---|---|---|---|
| First draft | 65% | 25% | 55% | 65% | 30% | 25% |
| **As shipped** | **62%** | **60%** | **52%** | **48%** | **40%** | **27%** (par 33%) |

Ford and Watchtower swapped places so the curve only climbs. Pars sit at the median winning round, so the second star asks for a good game, not a perfect one. The challenges are set where a bot that isn't trying reaches them in 8–50% of games; a player who is trying should do better. The Barrow's first challenge (5 buried) came free in half of all games, so it is 7 now, the Cryptkeeper's mastery goal.

**The look.** The map is a 240 × 120 pixel painting made in the page: a dusk sky in dithered bands, far hills, wind-combed grass with wildflowers, a brook by the mill, a river at the ford with stepping stones, and the walled city on the horizon with lit windows and an open gate. The road is packed earth with ruts; the stretch you've walked is worn pale. Each stop is a pixel landmark (an inn with a hanging sign, a windmill, a grassy barrow with a stone door, reeds at the ford, a charred tower with embers, a striped toll bar) with a plaque of its stars, and a meeple with a bundle on a stick bobs at the stop you've reached. In a campaign game a dusk-violet strip above the board names the stop, its lesson and its stars, and in round 1 spells out the new rule. At the end the Chronicle opens on the stop's stars, new ones stamping in, with a button on to the next stop. The title screen has a Campaign banner.

**Next:** Act II (tactician and warlord bots, rule twists like "no Sword cards in the deck"); the 3-player Burn test on 500+ paired games; card backs for the print edition.

## 18 November 2026 · 1.0-pre, every card burns its own way; print and play

**Why per-card burns.** FOUNDATIONS asked for every card to have two uses: build it for its lasting effect, or burn it once. 0.9 tried one burn per suit and it added no skill (+7.0 against the base game's +10), because six interchangeable effects are just more of the same option. This time every one of the 87 non-Foundation cards has its own burn (`KData.BURNS`), written from ten steps: ●, cards, ◇, ◇ per something on the board (your Leaf cards, Goblets anywhere, Ruined cards, your buried cards, your suits), a discount on the next card, a meeple, one more claim, war, a burial, and a new one, the **ward** (a card of yours can't be Ruined, Overwhelmed, contested or Cursed until your next turn). Each suit keeps its voice (Goblet ●, Tome cards, Leaf ◇, Sceptre claims and wards, Sword war, Bone burial), and the dearer the build, the richer the burn. Cards made in the card builder, and libraries saved before today, still burn by suit.

**The first table was too generous.** Paired against the same deals without Burn (contest on, mixed greedy, tactician and raider bots, sim2 seeds 0+, 1,300-second runs):

| | 2 players (607 games) | 3 players (348) |
|---|---|---|
| Without Burn | spread 0.31 · 6.20 rounds | spread 0.23 · 5.48 rounds |
| First table | spread 0.17 · 5.53 rounds | spread 0.36 · 4.95 rounds |
| **As shipped** | **spread 0.22 · 5.80 rounds** | spread 0.44 · 5.16 rounds |

Burns ran at 10.9 a game at 2 players (nearly one a turn), and the most burned cards were the flat-◇ ones: Burrow 3◇, Topiary 4◇, Obelisk 4◇, Hilltop Relic 5◇. Building was losing to burning, and games lost two-thirds of a round. The shipped table halves those (Obelisk 2◇ and a burial, Topiary and Tithe 2◇, Watchtower and Hilltop Relic 3◇, Burrow and Acorn 1◇ and a few ●) and caps every "per" burn at 4◇ (Alchemy Lab 5◇). Now the most burned cards are the cheap draw-and-● ones (Errata, Procession, Scrying Pool, Fountain), which is the right place for them. "Claim again" also works before your claim now (a burn for *one more claim this turn*); bots still almost never use it, because a second claim must be on or next to the card just placed.

**Skill (the yardstick).** Genius against a tactician in the same seat on the same deal, 2 players, contest on:

| | Deals | Genius | Tactician | Gap |
|---|---|---|---|---|
| Without Burn | 187 | 73.3% | 47.1% | +26.2 |
| First table | 187 (same deals) | | | +25.1 |
| As shipped | 150 (same deals) | 78.7% | 47.3% | **+31.3** (without Burn on those deals: +28.7) |

**Decision: Burn stays on trial, off by default, with the new table.** It doesn't cost skill (every reading is within noise, about ±8), it brings the 2-player archetypes closer, and it gives every card a second life, which is the point. It doesn't yet clearly add skill, and the 3-player reading (Warmonger 0.78, Cryptkeeper 1.21) is on too few games to trust in either direction. Before it can be on by default: 500+ paired 3-player games, and a claim-again burn that bots can actually use.

**Feel.** A flame tag under every hand card shows its burn in short (`+8●`, `draw 3`, `1◇/Ruin`, `ward · +2●`); the button shows the long form and what a "per" burn is worth right now. Burning sets the card alight: dithered pixel flames climb out of the hand in steps from yellow to ember red, with sparks and falling ash. A ward draws a ring of pale blue pixels around its card and leaves a dashed frame and a ⛨ seal. The Library shows each card's burn under its preview. When the turn passes, the new player's card slides out a few pixels and its swatch catches a glint (UI wishlist: turn handover).

**Print and play** (moonshot, first step). `tools/printplay.js` lays out every copy of every card (134 with the Foundations) at poker size, nine to an A4 page with crop marks, each with the game's own dithered suit texture and its flame box, then a one-page rules sheet. It's in `print/` and linked from Help. Writing the rules sheet was a good test of the rules themselves: the enemy-suit rule ("Sword, and the suit your archetype can't play") is the one a new player can't guess from the cards.

**Next:** 3-player Burn on 500+ paired games; a claim-again burn that is usable (perhaps "claim any unclaimed card"); card backs and token sheets for the print edition.

## 17 November 2026 · 1.0-pre, the 3-player gap that wasn't; tucked pages and violet smoke

**The 3-player check.** Last time's 3-player numbers (Cryptkeeper 1.22, Archbishop 0.80) came from about 240 appearances each, so I set up a paired test on fresh deals before changing any card: 257 3-player games (deals 60000+, contest on, mixed greedy, tactician and raider bots, 1,300-second runs), the same deals for each variant.

| | Archbishop | Hedonist | Warmonger | Cryptkeeper | Gardener | Philosopher | Spread | Winners changed |
|---|---|---|---|---|---|---|---|---|
| As it is | 0.97 | 0.95 | 0.96 | **0.91** | 1.03 | 1.18 | 0.27 | — |
| Cathedral 2◇ per unowned Sceptre | 1.08 | 0.90 | 0.98 | 0.84 | 1.01 | 1.18 | 0.34 | 14 |
| Cathedral 7◇ per own Sceptre | 1.04 | 0.97 | 1.01 | 0.91 | 0.91 | 1.16 | 0.24 | 20 |
| Mausoleum 1◇ per three buried elsewhere | 0.92 | 0.95 | 1.03 | 0.89 | 1.05 | 1.16 | 0.27 | 20 |

**Decision: no change.** On fresh deals the baseline has the Cryptkeeper *below* par (0.91) and the Archbishop at par (0.97), so last time's gap doesn't hold up. It looks like noise from too few games (±0.13 per archetype at this size). Each fix moves only 14–20 of 257 winners, which is too small to separate from that noise, and none of them beats the baseline spread by a clear margin. The Shrine-stops-burials idea wasn't tried: burials are almost all self-burials, so it would mostly tax whoever builds next to a Shrine, not shelter the Archbishop. The Philosopher (1.18 here, 1.04 pooled last time) is the one to watch. **Lesson for the yardstick:** no 3-player balance change without at least 500 paired games, and none from one batch of deals.

**Tucked pages.** Burying finally looks like burying. A pixel copy of the buried card drops onto its host, slides under it in steps, and its bottom edge peeks out below for a moment, like a page tucked into a book. Then the old clods of earth (or loose pages) settle.

**Violet smoke.** The Curse effect was the last soft glow in the game (blurred violet box-shadows and gradient flames), which broke the pixel-art rule. Now violet dithered pixels in four shades curl up out of the card in a spiral and sink into its lower-left corner. A small pixel **hex eye** stamps in there and stays while the Curse does, blinking now and then. The cursed frame is a crisp double ring instead of a glow.

**The strongbox.** A bought claim used to be a word in a box. Now an iron-bound strongbox appears beside the ● counter, two coins flip out of it in arcs (squashing edge-on and back, like real coins), and the lid slams shut with a one-pixel jolt.

**Next:** per-card burns (the next second-edition pillar); 5 players with contest; a bigger 3-player sample before anyone touches the Philosopher.

## 16 November 2026 · 1.0-pre, the city at dusk; the new Grounds measured properly

**The Grounds check from last time.** 3,227 games with contest on (mixed greedy, tactician and raider bots, deals 40000+ and 50000+, 1,100-second runs). "Without" removes Library, Barrow and Shrine with `CARDS=` (copies 0), so the deck differs and the pairs are not exact, but with about 3× the games of the first look the deck change averages out.

| | Without (2p · 3p · 4p) | With |
|---|---|---|
| Games | 871 · 474 · 278 | 819 · 476 · 309 |
| Archbishop | 1.03 · 0.90 · 0.98 | 0.95 · **0.80** · 0.94 |
| Hedonist | 0.78 · 1.10 · 0.96 | 0.99 · 1.07 · 0.93 |
| Warmonger | 0.98 · 0.92 · 1.16 | 0.82 · 1.03 · 0.93 |
| Cryptkeeper | 1.06 · 1.09 · 0.74 | 1.04 · **1.22** · 1.09 |
| Gardener | 1.07 · 0.88 · 0.99 | 1.05 · 1.02 · 1.10 |
| Philosopher | 1.08 · 1.12 · 1.17 | 1.15 · 0.87 · 1.01 |
| Spread | 0.30 · 0.24 · 0.43 | 0.33 · 0.42 · **0.17** |

Pooled over every table size (±1 standard error): Cryptkeeper **1.01 → 1.10 ±0.05**, Archbishop 0.98 → 0.90, Warmonger 1.00 → 0.90, Hedonist 0.90 → 1.00, Gardener 1.00 → 1.05, Philosopher 1.11 → 1.04. Rounds (6 · 5 · 5) don't change.

**Decision: the Grounds stay as designed, and the Library is not trimmed.** The bar set last time was "Cryptkeeper above 1.15 pooled"; it reads 1.10, about 2σ above its baseline but under the bar. The 4-player game is the best it has been (spread 0.17, from 0.43 without the new Grounds), which is worth a lot, since 4 players has been the hardest table since 0.4. What is left is **3 players**: Cryptkeeper 1.22 and Archbishop 0.80, each about 2σ from par on ~240 appearances. A 3-player-only fix is the next balance job, measured paired on fixed deals with the new Grounds in. First candidates: Shrine's peace also stops burials beside it (it would shelter the Archbishop from the Cryptkeeper's best play), or Cathedral counting Sceptre Grounds.

**The city at dusk.** Claudenspiel opens on a title screen (`src/title.js`): the walled city drawn at about 200 pixels high in Bayer-dithered dusk colours, stepped at 10 frames a second. Stars twinkle, the sun sets behind the roofs with bands of cloud, windows light and go out, chimney smoke rises in puffs, a flag snaps on the keep, a lantern walks the wall, wind runs through the grass in slow waves, the river glints and fireflies blink. The menu is six suit banners hung from the wall that sway in steps (Continue, New game, Sandbox, Library, Deeds, Help). Esc picks the first. *Skip this screen next time* turns it off; the crest in the title bar always brings it back. Why: a first impression is part of the game. The Kartenspiel heritage is a workshop window, and this is the one place the game gets to be a place.

**Living Grounds.** Every Grounds card on the board shows a four-frame pixel diorama of its terrain in the art window (`src/terrain.js`, a 48×15 tile per card drawn once into a sprite sheet): reeds sway in the Marsh, embers rise over the Battlefield, a cart crosses the Crossroads, the Library's candle gutters, a wisp drifts over the Barrow, light walks the Shrine's gold roof. Terrain should read as land at a glance, not as one more card.

**Smaller things.**
- *The hand hint for Actions and Blessings:* hovering one plays it in an imagined game (hidden cards guessed, choices greedy) and reports your ◇, ● a turn and cards drawn, and what it costs the rival it hurts most.
- *Ascension* spirals the five suit colours up out of the card as a pixel helix, flashes gold, and plays five rising notes.
- *Deeds and mastery levels* drop a parchment scroll; a wax seal stamps it, and it rolls up and flies to the Deeds tab.
- *Rain* falls on the board in the last round (a scattered-streak tile, darker on a light board). Losing to a bot dims the board and blows a few gusts across it.

**Next:** the 3-player Archbishop and Cryptkeeper with the new Grounds; per-card burns; 5 players with contest.

## 15 November 2026 · 1.0-pre, a Grounds card for every suit

**Why.** Grounds were Claudenspiel's best idea that stopped short: three terrains (Leaf, Sword, Goblet) and nothing for the other half of the suits. Every suit now has its own terrain. Each new one gives a reason to build *beside* something you don't own, which is what a shared board should reward:
- **Library** (Tome, 5●): placing a card next to it draws you a card, once a turn. A reading room anyone may use, so it's a race to build around it first.
- **Barrow** (Bone, 5●): a card buried under a card next to it banks 2◇ for the player burying it. The Cryptkeeper's ground, but anyone who buries can use it.
- **Shrine** (Sceptre, 6●): cards next to it keep *the Shrine's peace*: they can't be contested or Cursed. Contest is now the main way cards change hands, so this is the counter to it, laid on the board for everyone to see. (Called "peace", not "sanctuary", because Sanctuary is already a card.)

Two copies each; the deck is 128. The bots value them by what they pay later (open spaces beside a Library, their own cards beside a Barrow or Shrine), and they lay them about as often as the old Grounds: Library 35–61 times per 100 games, Barrow 20–38, Shrine 21–33.

**Feel.** Cards in the Shrine's peace wear a gilded inner frame that slowly breathes, with a small ✠ seal. Each new Ground has a sound: rustling pages and a reading-room bell, a low earthen thud, a soft rising chord. Help and patch notes explain all three. `tests/cs12-grounds.js` checks each rule.

**Measured** (contest on, mixed greedy, tactician and raider bots, deals 30000+, 900-second runs). The baseline removes the three cards with `CARDS=` (copies 0). That changes the deck, so these are *not* paired: about half the winners differ for reasons that have nothing to do with the new cards.

| | Without (2p · 3p · 4p) | With | Barrow 1◇ |
|---|---|---|---|
| Games | 375 · 216 · 136 | 375 · 216 · 141 | 380 · 219 · 141 |
| Archbishop | 1.09 · 1.09 · 0.84 | 0.77 · 1.01 · 0.96 | 0.75 · 0.98 · 1.00 |
| Hedonist | 0.90 · 1.09 · 1.19 | 0.99 · 0.74 · 1.25 | 0.98 · 0.82 · 1.21 |
| Warmonger | 1.12 · 0.81 · 0.88 | 0.94 · 1.07 · 0.86 | 0.94 · 1.04 · 0.86 |
| Cryptkeeper | 0.85 · 0.98 · 1.01 | 1.09 · 1.12 · 1.36 | 1.08 · 1.10 · 1.33 |
| Gardener | 1.09 · 1.01 · 1.02 | 1.04 · 0.81 · 0.80 | 1.06 · 0.83 · 0.82 |
| Philosopher | 0.96 · 1.01 · 1.07 | 1.17 · 1.26 · 0.71 | 1.19 · 1.24 · 0.77 |
| Spread | 0.27 · 0.28 · 0.35 | 0.40 · 0.52 · 0.65 | 0.44 · 0.42 · 0.56 |

Rounds (6 · 5 · 5) and Ruins plus Overwhelms per game (2.1 · 3.1 · 4.0) don't change. The one steady signal is the **Cryptkeeper, up at every table size** (about 0.94 → 1.17 pooled, roughly 2σ). The obvious suspect was the Barrow, but halving it to 1◇ changed almost nothing (same deals, same deck, so that comparison *is* paired). So it isn't the Barrow's ◇. It may be the Library's extra cards, which a Cryptkeeper can bury, or noise. The other moves flip sign between table sizes, which is what noise looks like at about 100 appearances an archetype. **Shipped as designed (Barrow 2◇), on the condition that a bigger run checks it.**

**Next:** 600+ games per table size with and without the new Grounds, on enough deals that the deck change averages out; if the Cryptkeeper holds above 1.15, trim the Library to "draw when you build beside it, if you own a card beside it". Then the 4-player Archbishop, and per-card burns.

## 14 November 2026 · 1.0-pre, mastery; Reckonings judged on a contestable board

**Reckonings on a contestable board: no.** FOUNDATIONS said to return to Reckonings once claims could change hands. Measured the same way as contest (paired, 2 players, Genius vs tactician, deals 0–263, time-capped):

| Rules | Deals | Genius | Tactician | Gap | Flips (+/−) |
|---|---|---|---|---|---|
| Contest (1.0-pre default) | 164 | 73.2% | 48.8% | **+24.4** | |
| Contest + Reckonings (`seasons: 3`, `seasonLength: 2`) | 165 | 70.9% | 52.7% | +18.2 (z≈4.1) | 42 / 12 |

Reckonings still let the better player win clearly, but less clearly than the race does, and in 0.5 they broke the archetype balance (spread 1.03). They add nothing that contest hasn't already given, so the race to 52◇ stays, and Reckonings stay an engine switch with no button. The second edition's next step is no longer scoring structure. It is cards: per-card burns and new Grounds.

**The 4-player Hedonist, settled** (contest on, mixed greedy, tactician and raider bots, deals 20000–24000, 835 games):

| 4 players | Archbishop | Hedonist | Warmonger | Cryptkeeper | Gardener | Philosopher | Spread | Seats |
|---|---|---|---|---|---|---|---|---|
| 835 games | **0.85** | 1.04 | **1.16** | 1.10 | 0.88 | 0.97 | 0.31 | 1.02 · 0.95 · 0.95 · 1.09 |

The Hedonist is at par, so Palace stays as it is. The 1.23–1.45 readings were noise. With about 560 appearances each, one standard error is about 0.07, so two results are real but small. The Warmonger is high (+2σ): 1.29 under the raider style, 1.23 under the tactician and 0.97 under greedy. It scores 16◇ a game from the Warcamp and makes 2.4 Ruins or Overwhelms. The Archbishop is low (−2σ). The spread of 0.31 misses the 0.25 target. The Mausoleum fix held: the Cryptkeeper is at 1.10. **Next balance job:** the 4-player Archbishop. Try Cathedral +1◇ a Sceptre card not owned at 4+ players only, or a war tax that doesn't grow with table size, measured paired with `CARDS=`.

**Archetype mastery** (progression wishlist ▶). Every archetype has ten levels. A finished game earns marks: 1 for playing, 2 for a win and 2 for reaching the archetype's goal. A goal is that archetype's fantasy, not its score: 4 Sceptre cards, 5 Goblet cards, 4 Ruins or Overwhelms, 7 buried cards, a region of 7, five suits. Each archetype has four titles (at levels 1, 4, 7 and 10; Gravedigger → Keeper of the Dead) and three strategy notes, opening at levels 2, 5 and 8. Every note was checked against the card text. Mastery never changes play. *Goals were calibrated* on 100 tactician games with contest on. The first goals, from the wishlist (6 Sceptre cards, all six suits), were never met: 0% for the Archbishop and the Philosopher, against 56% for the Warmonger. Each goal is now set near the top third of games, so it is something to aim for, not an accident. Mastery shows on the Deeds page and beside each human seat on the New game page, and the Chronicle lists the marks each game earned. A level-up gets a toast. `tests/cs11-mastery.js` checks it.

**Smaller things.**
- *Abilities have sounds:* a small bell for Sceptre and Tome, a forge hammer for Sword, a goblet clink, a hollow knock for Bone, a rustle for Leaf.
- *Undo past bots shows what was taken back:* up to ten of the bots' log lines, since they replay and may choose differently.
- *Deed titles are readable in dark mode* (they were dark red on dark grey). There is a new `--ink` colour for headings on fields.

**Next:** the 4-player Archbishop; per-card burns as the next second-edition pillar; 5 players with contest.

## 13 November 2026 · 1.0-pre, the dead are everywhere

**The 4-player Cryptkeeper, fixed.** The question from last time was why the Cryptkeeper falls behind at 4 players. Ruins per game don't explain it: they are flat from 3 to 4 players (2.1 and 2.0 a game), and the Warcamp's ◇ is flat too (14.5–17.1 a game at every size). What does change is turn count. A 4-player game lasts 5.1 rounds, against 6.2 at 2 players. The Mausoleum scores only the Cryptkeeper's own burials, so it loses a turn's worth. Palace and Cathedral don't, because they also score rivals' cards and a bigger table has more of those. Mausoleum now follows the same pattern: **3◇ per buried card in your Kingdom, and 1◇ for every two buried cards elsewhere on the board** (`score.o`, rounded down).

Measured with contest on, mixed greedy, tactician and raider bots, paired on the same deals (1000-second runs, four at a time):

| Table | Deals | Cryptkeeper before → after | Spread before → after | Winners changed |
|---|---|---|---|---|
| 4 players | 139 | **0.65 → 1.00** | **0.80 → 0.41** | 24 |
| 3 players | 228 | 1.12 → 1.19 | 0.28 → 0.28 | 29 |
| 2 players | 125 | 1.00 → 1.10 | 0.57 → 0.48 | 4 |

*Tried first and dropped:* 1◇ for every buried card elsewhere. It overshot: Cryptkeeper 1.24 at 4 players and 1.32 at 3, about +5◇ a game.

*Also tried and dropped:* Warcamp 6◇ an Overwhelm (was 8◇). The case for it went away with more games. On this run's 168-game 4-player baseline the Warmonger is at 1.10–1.14, not 1.3–1.4. With about 110 games per archetype the noise is ±0.25, and the earlier "Warmonger problem" sits inside it. With the cut, the Warmonger fell to 0.62, so it is clearly not wanted.

**What's left at 4 players:** the Hedonist runs high in this sample (1.23–1.45), but the journal's 450-game run had it at 1.03. That is likely noise again. It needs 400+ games before anyone touches Palace.

*Tooling:* `tools/sim2.js` takes `CARDS='{"id":{...}}'` to patch card definitions for a run, so a change can be measured before it is written into `data.js`. `tests/cs10-mausoleum.js` checks the new scoring at every step of six 4-player games.

**Ruin and Overwhelm, animated.** Until now both shattered the card into the same shards. Now they look and sound different:
- **A Ruin** draws a jagged crack down the card in six steps, with a dark line and a light edge. The card's colours step down to grey in three frames, and nine chips break off the sides and fall.
- **An Overwhelm** sends four red chevrons in from N, E, S and W. They pulse inward twice, then the card squashes (4px down, 90% height) and greys. The chevrons scatter and dust kicks up. A falling Foundation says so: "Foundation falls!"
- **The sound:** a Ruin is a sharp crack followed by grit. An Overwhelm is a low drum roll that builds over half a second and cuts off at the crush. It is deeper for a Foundation.

**Next:** a 400+ game check of the 4-player Hedonist; 5 players with contest; Reckonings on a contestable board.

## 12 November 2026 · 1.0-pre, the Chronicle, and contest by default

**The Chronicle.** Every game now keeps a chronicle in its state (`st.chron`): after each turn, every player's total and that turn's notable moments (Ruins, Overwhelms, contests, Ascensions, the start of the last round). When a game ends, the Chronicle opens: a stepped line per player drawn in whole pixels (it draws itself left to right in 16 steps), a mark on the acting player's line wherever something happened, the turning points in words (lead changes, the two biggest turns, the events; at most eight), a one-line verdict ("wins by 9◇ after 6 rounds, leading after 4 of 18 turns: a late charge") and a table of scores by round. It reopens from **Chronicle** beside Rematch. Why: FOUNDATIONS argues that most turns feel alike and the early leader usually holds on. A player can't see that during a game, but afterwards the chart shows it at a glance: where the race was decided and whether anyone could have caught up. It is also the first half of the post-game report on the UI wishlist. The Genius's "better move" at the big moments is still to come. Recording costs nothing measurable: bot self-play runs at the same speed with and without it. `tests/cs9-chronicle.js` checks it.

**Victory.** Before the Chronicle opens, the winner's Kingdom lights up card by card in gold leaf, smallest first and the most valuable last, each with its ◇, and then their banner unrolls (full Motion only; with calm or reduced motion the Chronicle simply opens).

**Four players with contest, measured properly** (mixed greedy, tactician and raider bots):

| 4 players | Games | Archbishop | Hedonist | Warmonger | Cryptkeeper | Gardener | Philosopher | Seats |
|---|---|---|---|---|---|---|---|---|
| Contest (deals 5000+, 10000+) | 333 | 1.06 | 1.03 | 1.28 | **0.58** | 0.86 | 1.19 | 0.79 · 1.07 · 1.00 · 1.14 |
| No contest, same deals 5000–5118 | 119 | 1.27 | 0.81 | 1.40 | **0.56** | 0.95 | 1.01 | 0.87 · 1.01 · 1.11 · 1.01 |

Paired on the 119 shared deals, contest changes neither outlier: the Cryptkeeper wins 11 games without it and 10 with it, the Warmonger 28 and 27. **The 4-player Cryptkeeper and Warmonger problem is in the base game, not in contest.** It has shown up in every 4-player run since 0.4. Earlier runs were too small to be sure; with 450+ games now, I am. It is the next balance job.

*Hallowed ground, tried and left off* (`hallowed: true`; tested in cs8): a card with a card buried under it can't be contested. I tried it to shelter the Cryptkeeper. On the same 186 deals the Cryptkeeper won 15 games without it and 14 with it, and only 17 winners changed. That fits the paired result above: contest isn't what hurts the Cryptkeeper. The switch stays in the engine, off.

**Decision: contest is on by default for 2–4 players.** The evidence: skill gap +24.4 (the only pillar to clear 65%); 2-player spread 0.15; 3-player 0.27 with the keeper rule; and at 4 players it moves no archetype. Five players are unmeasured, so it stays off there until they are. The New game box follows the table size until someone ticks or unticks it. The engine default stays off, so old tests and saved games are unchanged.

*Also tried:* the Genius-vs-tactician skill gap at 3 players. With the Genius at full strength this takes over two minutes a deal on this machine, so 6 deals in 15 minutes told nothing. Next time: a cheaper fixed Genius (`GWORLDS=1 GLINES=3`, as in 0.6).

**Next:** fix the base game at 4 players (Warmonger 1.3–1.4, Cryptkeeper 0.56–0.58). Look at Ruins per game by table size first, since any per-Ruin payout grows with the table (see 0.5's Warcamp note). Then measure 5 players with contest, and Reckonings on a contestable board.

## 11 November 2026 · One home for everything

Earlier scheduled runs, not knowing Claudenspiel had moved, left three pieces of work on Kartenspiel branches. All are now here:
- **Two prototype games** (`claude/happy-gates-eeiof4`, `claude/happy-gates-vmdc0l`) are in [prototypes/](prototypes/), unchanged, with a note on what each is. Both still pass their own tests. Their best idea for the main game is *one card, two lives*: coin in hand, building on the board. That is the per-card form of "two uses" that 0.9's suit-wide Burn lacked.
- **A parallel 0.2** (`claude/happy-gates-updnpj`) changed Obelisk, Fountain and Death Ray. Obelisk and Fountain had already been fixed differently in 0.2 here. Its Death Ray change is new and taken: **Death Ray 9● and 3◇** (was 12● and 2◇), the worst printed value on the gameplay wishlist. It is a single copy, so I expect no archetype effect, and the change is not measured on its own.

From now on every Claudenspiel change goes to this repository only.

## 11 November 2026 · 1.0-pre, contest measured properly, and the dead follow their keeper

**Contest balance, with enough games** (mixed greedy, tactician and raider bots, contest on, 976 games). The 10 November first look (52 three-player games, Warmonger 1.85, Cryptkeeper 0.48) did not hold:

| Contest on | Games | Median rounds | Archbishop | Hedonist | Warmonger | Cryptkeeper | Gardener | Philosopher | Spread | Seats |
|---|---|---|---|---|---|---|---|---|---|---|
| 2 players | 635 | 6 | 0.95 | 1.04 | 0.95 | 0.92 | 1.07 | 1.07 | **0.15** | 0.92 · 1.08 |
| 3 players | 341 | 5 | 1.08 | 0.94 | 1.19 | 0.83 | 1.02 | 0.93 | 0.36 | 0.99 · 1.04 · 0.97 |

At 2 players contest is as balanced as anything Claudenspiel has measured. At 3 players the direction of the first look holds (the Warmonger gains, the Cryptkeeper loses), only much smaller.

**The dead follow their keeper** (`graveFollows`, on whenever contest is): when a Cryptkeeper's card is contested, the cards buried under it don't change hands; they move under the Cryptkeeper's Foundation. Why this fix: the Cryptkeeper's points sit *under* its cards (Mausoleum: 3◇ a buried card in the Kingdom), so a contest took more from it than from anyone, and the taker got a crypt it can't use. The rule fixes exactly that loss and nothing else, and it reads as the archetype's fantasy. "Permanent" burial bonuses (Flowers' +3●) stay on the card they were given to, so nothing is counted twice.

Paired, the same deals with and without it:

| Same deals | Cryptkeeper without | with | Others |
|---|---|---|---|
| 2 players (319) | 0.81 | 0.83 | within 0.03 |
| 3 players (341) | 0.83 | **0.91** | within 0.03; spread 0.36 → 0.27 |

Small, as a targeted rule should be, and it moves nothing else. (Deals 0–318 alone read Hedonist 1.23 at 2 players against 1.04 over all 635: a reminder of how noisy 300 games are.)

**4 players with contest** (117 games, too few): Hedonist 1.54, Cryptkeeper 0.67, seats 0.79 · 0.85 · 1.20 · 1.16. The Hedonist has read high at 4 players in every run since 0.4; Palace's per-Goblet scoring grows with the table. Needs 500+ games before a change.

**Feel.** Contest had no sound or motion: now two blades clash, the old meeple tumbles off in its owner's colour, and the new one lands in a puff. Burials thud into earth (Bone, or under a Foundation) or close like a book; a hand bell rings when a human is up after bots; hand cards lift on hover and legal spaces breathe (full Motion only). A browser bot game with contest on played 90 tones and 55 noise bursts, animated both contests, and logged no errors. Patch notes now include contest, which had none.

**Next:** contest's skill gap with the keeper rule (expect no change), then decide its default for 1.0 (2 players looks ready); 500+ four-player games; then Reckonings on a contestable board.

## 10 November 2026 · 1.0-pre, contest balance: a first, noisy look

`tools/sim2.js` now takes `OPTS='{"contest":true}'` so any rule can be switched on for archetype self-play. Mixed greedy, tactician and raider bots, about 200 s of games per row, so these are small samples (noise is roughly ±0.2 per archetype):

| Rules | Games | Median rounds | Archbishop | Hedonist | Warmonger | Cryptkeeper | Gardener | Philosopher |
|---|---|---|---|---|---|---|---|---|
| 2p base | 94 | 6 | 1.24 | 0.90 | 0.71 | 0.84 | 1.10 | 1.20 |
| 2p contest | 100 | 6 | 1.03 | 1.03 | 1.03 | 0.67 | 1.19 | 1.06 |
| 3p contest | 52 | 5 | 1.50 | 0.58 | 1.85 | 0.48 | 0.72 | 0.75 |

Seats stay even (2p: 53 / 47 wins). **What it says:** contest does not shorten the 2-player game (6 rounds), and it lifts the Warmonger from 0.71 to 1.03 as predicted, since taking a rival's card is a war move. Cryptkeeper is the one archetype that looks worse (0.67, then 0.48 at 3 players). Its Curses fight over the same adjacent cards that contest now trades. The 3-player row is far too small to trust (52 games), but its Warmonger 1.85 is the number to watch.

**Next:** a few hundred games per table size with Genius bots before deciding contest's defaults; a Cryptkeeper card pass if the 0.5–0.7 holds; then Reckonings.

## 6 November 2026 · 1.0-pre, contest: influence's first shape, and the first pillar to move the number

**Contest** (`contest: true`, a New game option; `tests/cs8-contest.js`): once a turn, pay 8● of this turn's ● (never Reserves) to take a rival's card next to the one you just placed. Their meeple goes home, yours takes its place, and it doesn't use your claim. Foundations, Ascended cards and shared cards can't be taken. It is the simplest form of "claims can be contested": ownership is no longer settled the moment someone claims. Bots contest when the swing beats what 8● would bank (about 1 contest per 2-player game, 13 turns). The Genius sees contests as plain moves in its imagined turns.

**Skill expression** (paired, 2 players, Genius vs tactician, deals 0–263 with a time cap; 164 paired deals):

| Rules | Genius | Tactician | Gap |
|---|---|---|---|
| Base (0.8) | 60.2% | 50.2% | +10.0 |
| Market, planning picks | 63.7% | 52.7% | +10.9 |
| Burn | 62.7% | 55.7% | +7.0 |
| **Contest** | **73.2%** | **48.8%** | **+24.4 (z≈6)** |

**What it says.** Contest more than doubles the gap and clears the 65% bar by eight points. The reason is the one FOUNDATIONS predicted: it changes what decisions are *about*. A card on the board is now a standing question for both players (take it, protect it, or build so nothing worth taking sits beside your last card), and lookahead pays. Adding options did not help before; adding interaction did.

**Caveats, honestly.** The gap is large partly because the tactician contests by a simple rule and the Genius searches; a human-vs-bot gap may differ. Archetype balance with contest on is **not yet measured** (Warmonger and Cryptkeeper likely gain), and neither are game length or the leader's win rate. So it stays optional. Next: the balance run with contest on, then combine with the market and decide the defaults for 1.0; then Reckonings, now that claims can change hands.

## 4 November 2026 · 0.9, two pillars judged by the mended yardstick

**Burn** (the second edition's "two uses per card", first shape): once a turn, discard a card from hand for a one-time effect set by its suit (Goblet +5●, Tome draw 2, Leaf +2◇, Sceptre claim again, Sword rivals' cards need one fewer enemy this turn, Bone buried under your own card). An optional rule (`burn: true`), with bots, interface and `tests/cs7-burn.js`.

**The Genius plans the new choices.** Its opening lines now include each market card, the blind draw and each burn; before, it left them to the same rule of thumb as every bot. With both rules off its play is unchanged, so the +10 baseline stands.

**Skill expression** (paired, 2 players, Genius vs tactician, deals 0–100 and 1000–1099):

| Rules | Genius | Tactician | Gap | Flips (+/−) |
|---|---|---|---|---|
| Base (0.8) | 60.2% | 50.2% | +10.0 (p≈0.02) | 46 / 26 |
| Market, Genius not planning picks | 55.2% | 52.7% | +2.5 (p≈0.64) | 39 / 34 |
| **Market, Genius planning picks** | **63.7%** | **52.7%** | **+10.9 (p≈0.02)** | 53 / 31 |
| Burn, Genius planning burns | 62.7% | 55.7% | +7.0 (p≈0.11) | 40 / 26 |

**What it says.**
- *The market's choice is real:* planning the picks is worth about 8 points (+2.5 → +10.9), and more deals turn on who sits in the seat (84 flips against 72). But the total gap is level with the base game, not above it: the market adds a decision and removes some of the deal's luck about equally. It stays a candidate: worth keeping if a later pillar makes the picks matter more (influence, where denying a rival their card is worth more).
- *Burn adds nothing measurable.* A suit-wide effect makes every Goblet the same burn, so it is one more near-interchangeable option, which is the diagnosis's very complaint ("many choices, few decisions"). The real version is a burn effect *per card*, chosen so a card's two uses pull against each other. That needs card-by-card design and waits for the card pass.
- Neither moved the number to 65%. Adding options to a turn of parallel solitaire does not, on its own, make decisions matter. Next: **influence** (contested claims), the pillar that changes what decisions are *about*.

## 4 November 2026 · 0.7, no dead cards

You’ll Regret That was the last card that could only be revealed as a reaction; a hand card that often can’t do anything is a design bug (see 0.1's Revenge and Repent). It now also plays normally: 3●, Curse any card next to one of yours so it makes no ●, using the existing Curse machinery (`mods.alsoPlay`). The reaction is unchanged. Tests updated (cs1, qc5) and a new `tests/cs6-regret.js` plays it from hand. Not measured with bots yet; the Genius still needs updating first (see 0.6), so no balance claim is made.

## 4 November 2026 · 0.8, the yardstick mended

(0.7, from another session: You'll Regret That plays from hand, so no card is dead.)

**Why the Genius fell behind, tested.** All against a tactician in the same seat, 2 players, the same deals (150–200 each):

| Genius version | Genius | Tactician | Gap |
|---|---|---|---|
| Its own planning alone, as it was | 49.7% | 55.4% | −5.7 |
| + counts banking in its race model | 46.7% | 55.9% | −9.2 (p≈0.05) |
| + banking and Grounds | 45.8% | 55.5% | −9.7 (p≈0.04) |
| Plays its lines like a tactician, race-model judging (1 deal, 3 lines) | 51.3% | 55.8% | −4.5 |
| Plays its lines like a tactician, tactician judging (1 deal, 3 lines) | 58.6% | 55.4% | +3.2 |
| **The same at full strength (3 deals, 5 lines)** | **60.2%** | **50.2%** | **+10.0 (p≈0.02)** |

Adding the tactician's missing habits to the race model made it worse; the race model itself was the problem under Claudenspiel's rules. The Genius now plays its imagined lines with the tactician's own move choice and judges each end position by the tactician's measure (own ◇, ● per turn and goal cards against the strongest rival's); the imagined deals, the opening lines and the rivals' replies are as before. That is the new default (`GENIUS.policy 'tactician', judge 'diff'`); the race model stays as an option. The fairness test passes unchanged.

**The yardstick works again:** +10 points over a tactician, past the 60% bar. Next: judge the market by it (Genius vs tactician with the market on, against this +10), then the other pillars.

## 4 November 2026 · 0.6, the market on trial, and a broken yardstick

**The market** (the second edition's first pillar) is in, as an optional rule: three face-up cards, and each of a turn's draws is a market card or the top of the deck, taken at any point in the turn. Bots take a market card when its keep value clears a bar, otherwise draw blind.

**Skill expression, measured** (`tools/skill.js`: the same deal played twice, seat X played once by the Genius and once by a tactician, every other seat a tactician; the Genius at a fixed, cheaper setting of 1 world and 3 lines so runs are deterministic and affordable):

| 2 players | Genius wins | Tactician wins | Gap |
|---|---|---|---|
| 0.5 rules (140 deals) | 51.4% | 56.4% | −5.0 |
| With the market (90 deals) | 50.0% | 43.3% | +6.7 |
| Race model refit: hand worth nothing (143) | 45.5% | 56.6% | −11.2 (p≈0.03) |
| Race model refit: hand worth 0.3 (137) | 51.8% | 56.2% | −4.4 |

**The yardstick is broken.** Under Claudenspiel's rules the Genius is no longer stronger than a tactician, so its gap over one can't yet measure how much a rule rewards skill. Refitting its race model to Claudenspiel's own games did not help (pace here is a steady ~9.3◇ a turn and hand size no longer correlates with it, but removing the hand term made the Genius clearly worse). The likelier cause: since 0.2 the tactician gained habits the Genius's own planning only partly has (buying the second claim, laying Grounds for their effect, drawing from the market). The market's +6.7 is within chance.

**Next:** give the Genius's planning the same knowledge (Grounds, the bought claim, market choices inside its imagined turns), confirm it beats a tactician clearly again (target: 60%+ paired), and only then judge the market and the other pillars by skill expression. The market stays optional until then.

## 4 November 2026 · Foundations

Stopped tuning and questioned every base assumption, in [FOUNDATIONS.md](FOUNDATIONS.md). `tools/anatomy.js` records every turn of bot self-play. The diagnosis: parallel solitaire with steady accrual. Every turn adds about 9◇, the best fifth of turns carries only 35% of the points, claims are automatic (exactly one a turn), ● is in surplus, conflict touches 16–19% of turns, and the greedy, tactician and raider bots win about equally. There are many options but few decisions. Thirteen assumptions questioned, eight marked for change, and a second edition planned around five pillars (seasons and Reckonings, influence, cards as currency with two uses each, a market, archetype powers instead of bans).

Four experiments, all switches in the engine and off by default:
- *Flat ● for everyone:* pace unchanged, balance collapses. ● is a balance lever, not a decision.
- *Audits* (suit majorities pay every two rounds): closer 3-player finishes, the early lead holds.
- *Seasons and Reckonings:* turns matter more, but holdings compound; the early leader wins more (76%).
- *Reckonings with every meeple sent home:* no better (75%), balance broken.

The lesson: with equally skilled bots, "the early leader wins" mostly measures how long luck lasts, so it can't be the target. The primary measure for the second edition is skill expression, the Genius's paired win rate over a tactician. Next: measure 0.5's, then prototype the market and two-use cards. No default rule changed today.

*A test fix along the way:* the no-peeking test failed once (2 of 14 positions changed). The cause was the Genius's time budget, not hidden cards: a busy machine weighs fewer imagined deals and can answer differently. The test now gives it unlimited time; it then passes 14 of 14 repeatedly, and still catches the tactician (4 of 14). In play, a slow device can make the Genius choose differently, never unfairly.

## 4 November 2026 · 0.5, a word in your ear

**Four players, measured properly first** (280 games): Hedonist 1.25, Archbishop 1.12, Warmonger 1.12, Philosopher 0.90, Gardener 0.81, Cryptkeeper 0.79; seats even (0.94–1.06). The Hedonist reading matched every earlier 4-player run (1.16–1.33), and it was slightly high at 2 players too. The cause is the mechanism 0.4 used to help the Cathedral: Palace paid 3◇ for every Goblet card someone else owns, and a bigger table puts more of them on the board.

**Changes, and why.**
- *Palace 2◇ per Goblet card not in your Kingdom* (was 3◇). On the same deals: 2 players spread 0.34 → **0.16** (Hedonist 1.11 → 0.95), and the Warmonger's low 2-player numbers (0.80) went with it, to 0.99, with no change to Warcamp. The Hedonist had been the Warmonger's predator.
- *Warcamp 5◇/10◇ tried and dropped.* Tested with the Palace change, it fixed 2 players but sent the Warmonger to 1.50 at 4 players: more players means more Ruins (2.31 a game at 4), so any per-Ruin payout grows with the table, the same trap as Palace.
- *"Why is this good?"*: hovering a hand card on your turn shows its best gain now (◇, ● a turn, the space, and whether it is claimed). It is worked out in the Genius's fair view (KBots.determinize), so cards that draw or reveal can't leak hidden cards into the hint.
- *Animations*: ◇ counters tick up; banked ● fly into the ◇ pile; chevrons around a card one enemy from Overwhelm beat like a heart; the Genius gets a flickering candle while it thinks. All follow the Motion setting (a data-motion attribute on the page) and the system's reduced motion.

**Measured with Palace at 2◇**: 2 players (455 games) Archbishop 0.99 · Cryptkeeper 0.95 · Gardener 1.00 · Hedonist 0.95 · Philosopher 1.11 · Warmonger 0.99. 4 players (143 games) spread 0.45, with Archbishop 0.76 and Warmonger 1.21, too few games to act on.

**Open questions.**
- 4 players needs 500+ games before any 4-player-only change; run it overnight-style next time.
- Hints for cards played from hand (Actions, Blessings) are still missing.

## 3 November 2026 · 0.4, sound, motion and a fairer table

**Changes, and why.**
- *Bots lay Grounds on purpose.* Instead of 0.3's general carefulness (no stronger, and it smothered War), only a move that lays a Grounds card is credited with what it does: shelter for the bot's own endangered cards (Marsh) and pressure on rivals' (Battlefield). Marsh went from 25 to 51 plays per 100 games, Battlefield from 12 to 37; a test checks that a tactician lays its Marsh beside its endangered card.
- *Orchard +1◇ for each Leaf card in the largest region* (the Gardener was down to 0.88). It also gives the Gardener a reason to want Leaf cards, not only any cards. Gardener 0.88 → 0.96.
- *Seat handicap by table size*: 3 players 6 · 4 · 0, 4 players 9 · 6 · 3 · 0, 2 players none. Seat 2 of 3 had read 0.82–0.83 in two runs; now 3-player seats are 0.91–1.11.
- *Cathedral +1◇ for each Sceptre card on the board it doesn't own.* With the Grounds-playing bots the Archbishop fell to 0.74, and the per-size breakdown showed why: it was weak at 3 and 4 players in every run (0.54–0.69), because Sceptre cards are contested at a bigger table. Scoring the board's Sceptre cards (as Palace does for Goblets) grows with the table. Archbishop 0.74 → 0.95.
- *Mausoleum back to 3◇.* With the new bots the 0.3 bonus pushed the Cryptkeeper to 1.20 (1.36 at 3 players); without it, 0.93.
- *Sound and animations* (the UI wishlist's first items): synthesized with Web Audio, off until switched on (Sound box or M); a card landing knocks in its suit's pitch, claims press a seal, banking clinks, Ruins crack, the last round rings a bell and unrolls a banner, the end plays a short fanfare in the winner's mood. Motion: full, calm (or the system's reduced motion) or off. A browser test counted 99 tones and 70 noise bursts in one bot game, with no errors.

**Measured** (836 games, weighted to 3 players: 349 two-player, 376 three-player, 111 four-player): Archbishop 0.95 · Cryptkeeper 0.93 · Gardener 0.96 · Hedonist 1.14 · Philosopher 1.13 · Warmonger 0.90, spread **0.24**. By table size: 3 players is the tightest yet (0.96–1.11); 4 players is the roughest (Cryptkeeper 0.48, Philosopher 1.46) but only 111 games.

**Open questions.**
- Archetype strength depends on table size. Measure 4 players properly (a few hundred games) before touching anything for it.
- Hedonist and Philosopher sit a little high (1.13–1.14).
- Warmonger is low in 2-player games (0.75–0.80 in the last three runs).

## 3 November 2026 · 0.3, the Book of Deeds

**Changes, and why.**
- *The Book of Deeds* (src/deeds.js): 19 deeds checked when a game ends, earned only by the human seats and kept in this browser (`cs.deeds`), with a Deeds page and a toast. The first piece of progression: it rewards trying things (Terraformer, Two Hands, Peacemaker) rather than grinding.
- *Target 52◇* (was 48◇). 0.2's banking and second claims had shortened games to 5 rounds; at 52◇ they are back to 6, with a few more Ruins (1.57 against 1.38 a game) and the same balance.
- *Mausoleum: 3◇ per buried card in the Kingdom, 4◇ for each under the Mausoleum itself.* The Cryptkeeper was lowest at 0.82. Tried three versions: 4◇ for every buried card overshot to 1.18, and 3◇ + 5◇ under the Mausoleum to 1.26 (most burials go under it, through Embalm); 3◇ + 4◇ under it came in at 1.05.
- *Its own icon* and favicon, drawn by tools/logo.js and built into the page.
- *A safety term for the bots* (their own cards at risk of Overwhelm), to make Marsh worth playing. A paired test (494 games, one careful seat against plain bots) found careful play no stronger: 51.6% against 50.6%. But with every bot careful, the Warmonger fell to 0.66, because war stops working against a table that hides. So it is off by default (CS_SAFETY in the simulator); a real table may play more carefully than the bots, and the Warmonger should be watched for that.

**Measured** at 52◇ (1,026 games, 2–4 players): Archbishop 0.97 · Cryptkeeper 1.05 · Gardener 0.88 · Hedonist 1.05 · Philosopher 1.07 · Warmonger 0.99, spread **0.19**. Seats: 2 players 0.97 · 1.03; 3 players 1.02 · 0.83 · 1.15; 4 players 0.92 · 1.13 · 1.10 · 0.85.

**Open questions.**
- The Gardener has drifted down (0.88): the longer game at 52◇ seems to favour other plans.
- 3-player seat 2 at 0.83 in two runs now; seat 3 is high. The seat handicap may want 2◇ and 4◇ rather than 3◇ a step. Measure with a few hundred more 3-player games.
- Bots still play Grounds only incidentally (Marsh about 25 times per 100 games).

## 3 November 2026 · Its own repository

Claudenspiel moved out of Kartenspiel's repository into this one, with its history (`git subtree split`), so the two share no files. `build.sh` now writes `index.html` here, which GitHub Pages serves at https://bradfordbhill.github.io/claudenspiel/; the publish script that pushed a copy is gone. Help's Dithry link goes to Kartenspiel's published Dithry.

## 3 November 2026 · 0.2, ground, gold and the race

**Seat order, measured properly first.** With 630 more 3–4 player games on 0.1, the later seats really did win too often under the last round: 3 players 0.69 · 1.02 · 1.30, 4 players 0.63 · 0.93 · 1.23 · 1.21. Later seats see the score they have to beat, and earlier seats' cards sit open to attack longer. Kartenspiel's Seat start pushed the wrong way (more ● for later seats), so 0.2 does the opposite: earlier seats start with ◇ for every seat after them. Tested 2◇ and 3◇ per seat on the same deals; 3◇ evened it (3 players 1.03 · 0.95 · 1.03, 4 players 1.00 · 1.06 · 0.89 · 1.06). Two players were already even in 0.1, and with 0.2's economy a paired test of 0◇ against 1◇ (850+ games each) confirmed it: 0.99 · 1.01 with none, so two players get no handicap.

**Changes, and why.**
- *Grounds* (Marsh, Battlefield, Crossroads; 2 copies each, deck 122). Kartenspiel listed the Grounds type but had no cards. Terrain gives placement a second dimension: where you build now depends on the land, not only on your neighbours. Grounds are never claimed, never counted as enemies and never Overwhelmed. The archetype ban applies to them too (a Gardener can't lay a Goblet Crossroads); that seemed right, so it stays.
- *Banking* (6● → 1◇, at most 2◇ a turn) and *buying a second claim* (10●). In Kartenspiel about half of all ● went unspent and ● per turn barely changed the scoring pace, because one claim a turn is the limit. Both rules give ● a use.
- *A bought claim can't be paid with Reserves.* The first 0.2 test let Warcamp's Reserves buy a claim nearly every turn: the Warmonger jumped to 1.48. Paid from this turn's ● only, it came back to 1.01.
- *Obelisk* 6◇ (was 8), still doubled when surrounded: the strongest card under every bot in Kartenspiel. *Fountain* 3◇ per Leaf neighbour and any side (was 2◇, north and south only): the weakest card, and it now pairs with Marsh.
- *Race bar* above the board: every player's ◇ on one track to the target, with the last round announced. The wishlist's first UI item.

**Measured** (mixed greedy, tactician and raider bots, 1,146 games of 2–4 players, before the 2-player handicap was set to 0):

| | 0.1 | 0.2 |
|---|---|---|
| Archbishop | 1.05 | 0.96 |
| Cryptkeeper | 1.07 | 0.89 |
| Gardener | 0.99 | 0.97 |
| Hedonist | 1.03 | 1.08 |
| Philosopher | 0.95 | 1.08 |
| Warmonger | 0.91 | 1.01 |
| **Spread** | 0.16 | 0.19 |

Seat index, 0.2: 3 players 1.07 · 0.91 · 1.01; 4 players 1.20 · 0.94 · 0.98 · 0.88 (127 games, so within noise). Median game length 5 rounds (6 in 0.1): banking and second claims speed the race up.

**Open questions.**
- Games are a round shorter. Watch whether 48◇ should rise to 52◇ so the board gets fuller.
- Cryptkeeper slipped to 0.89; next balance pass.
- The bots barely use Grounds. Teach them (the Genius's danger term should see Marsh), then measure the cards properly.

## 3 November 2026 · 0.1, the fork

**Setup.** Forked from Kartenspiel at commit 1b43db7 into `claudenspiel/`, as the offline edition (single player, pass-and-play, sandbox, card builder). No server and no service worker; the GitHub Pages deploy is untouched. Storage keys renamed `ks.*` → `cs.*` so the two games never share saves, settings or painted cards. New logo and colours, so the fork never passes for the original.

**Changes, and why.**
- *116-card deck* (from 81). Kartenspiel's deck runs out at big tables (a reshuffle in 36% of 4-player games and 67% of 5-player games) and every game sees a thin slice of each suit. The copy counts are the ones that tested best in Kartenspiel's deck study: staples ×2–3, the strongest and strangest cards ×1, every suit 18–20 cards, Sceptre Structures 5 → 9 for the Archbishop, Phalanx and Halberd Strike ×2 so Ruins stay as common.
- *The last round.* Reaching 48◇ starts the last round instead of winning at once, so everyone gets the same number of turns; the highest total wins, ties to whoever got there first. It removes the first-player edge at the source.
- *Seat start off by default.* It gave later seats extra ● to make up for moving later; with equal turns that became a double bonus (3-player seat 3 at 1.49 against seat 1 at 0.50 in the first test).
- *Orchard 3◇ a card* (was 4). Gardener was the strongest archetype everywhere (1.44 with the archetype-aware bots, 1.19 with Genius bots).
- *Observatory +10◇ when all six suits are in the Kingdom* (5◇ a suit stays). Philosopher was the weakest (0.76). A first try at 6◇ a suit plus the bonus overshot to 1.25.
- *Revenge and Repent* can also be played from hand (draw 2, discard 1), and *Brambles* can be placed like any Structure. No bot ever played them in 1,000+ Kartenspiel games: a card that is dead in hand is a design bug.

**Measured** (mixed greedy, tactician and raider bots, 2–4 players):

| | Kartenspiel (610 games) | 0.1 first try (393) | 0.1 as shipped (384) |
|---|---|---|---|
| Archbishop | 0.89 | 0.83 | 1.05 |
| Cryptkeeper | 1.01 | 1.06 | 1.07 |
| Gardener | 1.44 | 1.02 | 0.99 |
| Hedonist | 1.01 | 0.98 | 1.03 |
| Philosopher | 0.76 | 1.25 | 0.95 |
| Warmonger | 0.91 | 0.88 | 0.91 |
| **Spread** | **0.68** | 0.42 | **0.16** |

2-player seats are now exactly even (1.00 / 1.00).

**Open questions.**
- In 3- and 4-player games seat 1 still looks weak (3-player: 0.61, 1.07, 1.32 by seat), but with ~100 three-player and ~30 four-player games that is within noise. Next: a few hundred more multi-player games, then decide whether seat 1 needs help (a first-turn card, or the last seat losing its tiebreak).
- All of this is with the quick bots; confirm with Genius-only games before the next balance release.
