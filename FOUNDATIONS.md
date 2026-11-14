# Foundations: what Claudenspiel should be

Versions 0.1 to 0.5 tuned the game Claudenspiel inherited: copies, payouts, handicaps, a target. Every change was measured, and the archetypes are now within about 0.2 of each other. But balance is not the same as a good game. This document stops tuning and asks of every base assumption: is it true, and does it serve the game? It is grounded in bot self-play (`tools/anatomy.js` records every turn); the numbers are from 0.5 unless marked.

## The diagnosis

**Claudenspiel is mostly parallel solitaire with steady accrual.**

| | 2 players | 3 players |
|---|---|---|
| ◇ gained per turn | 9.2, almost never 0 | 9.3 |
| Share of all ◇ from the best 20% of turns | 35% | 35% |
| Leader at the start of round 3 wins | 66% (chance 50%) | 52% (chance 33%) |
| Leader at the start of round 5 wins | 76% | 65% |
| Median winning margin | 15◇ | 9◇ |
| Games won by 3◇ or less | 9% | 20% |
| Turns ending with ● left over to bank | 69% | 65% |
| Claims per turn | exactly 1.00 | 0.99 |
| Turns with a Ruin or Overwhelm | 16% | 19% |
| Win index by bot style (greedy · tactician · raider) | 1.01 · 1.05 · 0.94 | about 1.0 each in the balance runs |

Read together: every turn adds about the same amount; no single turn matters much; the early leader usually stays ahead; most games are not close; ● is in surplus; the claim is automatic, not a choice; players rarely touch each other; and a bot that simply takes the best immediate gain does as well as one that schemes. There are about 31 card-and-space options a turn, but they are close to interchangeable. **The game gives players many choices and few decisions.**

## Assumptions, questioned

Each: what the game assumes, what the evidence says, and a verdict (keep, change, or test).

1. **Points are private and permanent.** A card in your Kingdom scores for you, continuously, until it is Ruined. *Evidence:* steady 9◇ a turn and the early lead holds. Points never move between players except through the rare Ruin. *Verdict: change.* Points should be at stake. The strongest version: cards score at **Reckonings** (every two rounds, and at the end), on the board as it then stands, so what you hold matters more than what you once had, and a late swing is possible. Audits (relational majorities) were tested as a first step: closer finishes at 3 players (26% won by 3◇ or less, up from 20%), but no change to the early-leader lock (70% at round 3). Majorities alone are not enough; the private, permanent score is the part that has to go.

2. **The game is a race to a target.** *Evidence:* races reward the early lead; 0.1–0.4 spent four releases patching its edges (the last round, the seat handicap, the target). *Verdict: change.* A **fixed length** (three seasons of two rounds, each ending in a Reckoning) gives every game the same arc, makes the end visible from the start, and removes the turn-order problems that the last round and the seat handicap patch.

3. **One claim a turn is the heartbeat.** *Evidence:* claims are exactly 1.00 a turn; winners end with 2–3 meeples unused; the bought second claim is a small relief valve. Claiming is automatic. *Verdict: change.* Claims should be the main decision. Options: **influence** instead of ownership (meeples are placed on cards; a card belongs to whoever has the most influence on it at a Reckoning, so claims can be contested and taken), or claims as bids.

4. **● is the economy.** *Evidence:* with everyone on a flat 15● a turn, the scoring pace did not change (9.3◇ a turn) but archetype balance collapsed (spread 0.37 → 0.74 at 2 players, Cryptkeeper down to 0.48). So ● is not where decisions live; it is a hidden balance lever between archetypes. *Verdict: change.* Replace ● with **cards as currency**: you pay for a card by discarding others. Cards in hand were already the strongest predictor of pace (0.8◇ a turn each), so this merges the two resources that matter and makes every card a choice (play it, or spend it). Income cards become card-draw cards; Reserves become a hand-size bonus.

5. **Each archetype is defined by a banned suit.** *Evidence:* 0.7 dead cards in every hand, every turn; bans only ever subtract. *Verdict: change.* An archetype should be a **promise** (what it is rewarded for, as now) and a **power** (a once-a-season ability unique to it), not a prohibition. Keep the suit cycle as an affinity (an archetype scores its rival suit at half value) rather than a ban.

6. **Hands are hidden and draws are random.** *Evidence:* bot style barely matters at 2 players; the Genius beats a tactician by only about 6 points there. Most of the outcome is the deal. *Verdict: change.* Add an **open market** of face-up cards that everyone draws from, so drawing becomes a choice and denying a rival their card becomes possible. Keep a small hidden hand for surprise.

7. **All action happens on your own turn.** *Evidence:* the only other-turn decisions are rare reactions (Revenge, Repent, Brambles; the bots never played the first two until they were reworked). *Verdict: test.* Seasons give a natural moment for simultaneous choices: at each Reckoning, everyone secretly picks one card from hand to reveal at once (a bluff layer). Measure whether it adds decisions without slowing the game.

8. **The board is an endless grid.** *Evidence:* Grounds, the first terrain, were picked up by the bots once they understood them (Marsh 25 → 51 plays per 100 games). Placement is the richest decision the game has. *Verdict: test.* A **bounded board with fixed terrain** (a river that blocks, a hill, the walled city worth double) would make space scarce and give every game a different map. Prototype as a map option before committing.

9. **Conflict is suit-enemy Overwhelm plus Ruin cards.** *Evidence:* a Ruin or Overwhelm on 16–19% of turns; the rules for who is whose enemy are the hardest thing in the game to read. *Verdict: keep the idea, change the shape.* Conflict is good and should be more common, but legible: with influence (assumption 3), conflict becomes contesting a card's control, which needs no enemy table at all. Overwhelm can stay as the dramatic way to destroy a card.

10. **A card does one thing.** *Evidence:* 49 of 87 cards score nothing themselves; their worth is indirect and hard to read (hence 0.5's "why is this good?" hint). *Verdict: change.* Every card should have **two uses**: build it for its lasting effect, or burn it for a one-time effect. Two-use cards multiply decisions per card without adding cards, and they pair naturally with cards as currency.

11. **One rule set fits 2 to 5 players.** *Evidence:* archetype strength depends on table size in every run (the Archbishop 0.66–1.05, the Hedonist up to 1.33 at 4 players); half of 0.4 and 0.5 was patching that. *Verdict: change.* Anything that scales with the number of cards on the board must be per player, not per board. The 2-player game should have its own small adjustments (a smaller market, a shorter season) rather than the same rules.

12. **Score is a single number.** *Verdict: keep.* One number is easy to read; the race bar works. With Reckonings, show each player's *projected* score (what they would get if the season ended now) beside their banked score.

13. **The game is made of the starter library.** *Verdict: keep for now.* The card pool is not the problem; the structure is. New cards wait until the structure settles, or they will be balanced twice.

## The decision: a second edition

The evidence points one way: Claudenspiel's problems are structural, not numerical, and more tuning will not fix them. So Claudenspiel will be rebuilt as a **second edition** (2.0), alongside 0.x until it is better by measurement:

1. **Seasons and Reckonings** (assumptions 1, 2): three seasons of two rounds; cards score only at a Reckoning, on the board as it stands.
2. **Influence** (3, 9): a card belongs to whoever has the most influence on it at a Reckoning; claims can be contested.
3. **Cards as currency, two uses per card** (4, 10): no ●; pay by discarding; build or burn.
4. **The market** (6): a face-up row everyone draws from.
5. **Promises and powers** (5): archetypes lose their bans and gain a seasonal power.

Built in that order, one at a time, each as a switchable rule, each measured against the 0.5 game on the anatomy metrics before the next starts.

**What "better" means, so it can be measured.**
- Decisions matter: the gap between bot styles (and between the Genius and a tactician) grows. Target: the Genius wins at least 65% of 2-player games against a tactician.
- Games stay open: the leader at the start of round 3 wins no more than 55% of 2-player games, and at least 25% of games are won by 3◇ or less.
- Turns differ: the best 20% of turns carry at least half of all points.
- Balance holds: archetype spread of 0.25 or less at every table size, measured per size.
- Interaction rises: a contested card or Ruin on at least a third of turns.

**What stays.** The shared board and the idea that one card can be fought over; the six suits and archetypes; Grounds; the Genius and its fairness; the look, the sound and the Book of Deeds.

## The first pillar, tried twice, and what it taught

Seasons and Reckonings were prototyped (`seasons: 3`, `seasonLength: 2`, three seasons of two rounds) and measured on the same anatomy metrics:

| 2 players | 0.5 | Reckonings | Reckonings + meeples go home |
|---|---|---|---|
| Leader at the start of round 3 wins | 66% | 76% | 75% |
| Median winning margin | 15◇ | 25◇ | 16◇ |
| Games won by 3◇ or less | 9% | 7% | 12% |
| Share of ◇ from the best 20% of turns | 35% | **52%** | 41% |
| Archetype spread | 0.37 | 1.07 | 1.03 |

1. **Reckonings on a lasting board compound.** A card placed early scores at every Reckoning, so the early lead grows: the leader wins more often, by more. Turns did start to matter more (the best fifth of turns carried half the points), but archetypes that build lasting boards (Gardener 1.49) pulled away from the one paid once per Ruin (Warmonger 0.42).
2. **Sending every meeple home at each Reckoning** (the board as a commons, contested again every season) did not loosen the lead either (75%), and balance stayed broken.

**What this taught.** Three different structural changes (relational audits, Reckonings, Reckonings with release) all left "the early leader wins" at 66–76%. With every seat played by an equally skilled bot, an early lead can only come from the deal, the seat or the matchup, so this number mostly measures **how long luck lasts**. Driving it down with equal bots could just mean more late luck. It is a useful secondary check, but it is not the measure of a good game.

**The primary measure is skill expression:** how often the stronger player wins on the same deal. That is the Genius against a tactician in paired games (the same deal played twice, once with each in the seat). Every second-edition pillar is now judged first on that gap, then on balance, then on closeness. The criteria above are revised accordingly:
- *Primary:* the Genius's paired win rate over a tactician rises (0.5's baseline to be measured first).
- *Then:* archetype spread of 0.25 or less at every table size; at least 20% of games won by 3◇ or less.
- *Watched, not targeted:* the early-leader rate.

**Next steps, in order.**
1. Measure 0.5's skill expression (Genius vs tactician, paired, 2 and 3 players). This is the number to beat. *Done in 0.6, with a surprise: the Genius no longer beats a tactician under Claudenspiel's rules (−5 points over 140 deals). Fixed in 0.8 by rebuilding its planning on the tactician's move choice and measure: **+10 points** (60.2% against 50.2% over 201 paired deals). That is the number to beat.*
2. Prototype the pillars that add decisions rather than restructure scoring, since scoring changes alone did not help: **the market** (draws become choices) and **two-use cards** (each card becomes a choice). Measure each on skill expression.
   *Done in 0.9.* With the Genius planning its picks, **the market: +10.9** (level with the base game's +10; planning the picks is worth 8 points, so the choice is real but no larger than the luck it removes). **Burn, by suit: +7.0** (no gain; one suit-wide effect per suit is just more interchangeable options; a per-card burn waits for the card pass). Neither reached 65%; next is influence.
   *Done in 1.0-pre:* **contest, the first form of influence: +24.4** (Genius 73.2%, 164 paired deals), the first change to beat the 65% bar. Balance with it on is still to measure.
3. Return to Reckonings only once claims are contestable (influence), since a Reckoning that reads an uncontested board just compounds.
   *Done in 1.0-pre (14 November):* with contest on, Reckonings give a gap of **+18.2** (165 paired deals), against +24.4 for contest alone. They add no skill, so the race stays. Next pillar: two uses per card, designed card by card.

## Experiments run for this document

- `tools/anatomy.js`: per-turn records for 2 and 3 players (319 and 170 games).
- `flatIncome: 15`: everyone the same ● a turn (162 and 88 games). Pace unchanged; balance collapses; ● is a balance lever, not a decision.
- `audits: 2`: majorities per suit pay 4◇ every two rounds (237 and 117 games). Closer 3-player finishes; the early lead holds.

- `seasons: 3` (with `seasonLength: 2`): three seasons ending in Reckonings, no race (328 and 143 games).
- `seasons: 3, seasonRelease: true`: the same, with every meeple sent home after each Reckoning (459 and 210 games).

All are switches in the engine (off by default), kept for the second edition's experiments.
