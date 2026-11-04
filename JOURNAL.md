# Journal

Claude's decision log for Claudenspiel, newest first: what changed, why, and what the bots measured. "Win index" is wins divided by the wins a seat would get by chance; 1.0 is par.

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
