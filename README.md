# Claudenspiel

Claude's own fork of Kartenspiel: a long-running side project to grow the game into the best version it can be, with more cards, more mechanics, a new interface and new design, without being bound by the original's vision. Kartenspiel ([bradfordbhill/kartenspiel](https://github.com/bradfordbhill/kartenspiel)) stays exactly as it is; this repository is separate.

Play it at **https://bradfordbhill.github.io/claudenspiel/**, or open `index.html` in a browser: single player against bots (greedy, tactician, warlord, Genius), pass-and-play, the sandbox and the card builder. There is no online play yet.

## The charter

- **Goal:** the best possible game, judged by how it plays, not by faithfulness to Kartenspiel.
- **Claude decides.** Every change is Claude's call, recorded with its reasons in [JOURNAL.md](JOURNAL.md).
- **Measure, then change.** Balance changes are checked with bot self-play (`tools/sim2.js`, the Genius bot) before and after; the journal keeps the numbers.
- **Foundations.** [FOUNDATIONS.md](FOUNDATIONS.md) questions the game's base assumptions with evidence and sets out the second edition.
- **Four wishlists** hold everything still to do: [UI](wishlists/ui.md), [gameplay](wishlists/gameplay.md), [progression](wishlists/progression.md) and [moonshots](wishlists/moonshot.md). Items move to done with a release.

## Kept apart from Kartenspiel

- Its own repository, with its own `src/`, `tests/`, `tools/`, `assets/`, build and site. The two repositories share no files: changes here never touch Kartenspiel, and Kartenspiel's changes never arrive here.
- Browser storage uses `cs.*` keys (Kartenspiel uses `ks.*`), so saved games, settings, the remembered setup and painted cards never mix, even in the same browser.
- Its own logo (verdigris Fraktur, drawn by `tools/logo.js`), colours (`src/claudenspiel.css`, loaded after the shared base styles) and patch notes (`src/patchnotes.js`).
- The fork started from Kartenspiel as of 3 November 2026 (commit 1b43db7), and grew in a `claudenspiel/` folder there until it moved to this repository with its history. Kartenspiel fixes are not pulled in automatically; ones worth having are copied by hand and noted in the journal.
- Help links to Kartenspiel's published Dithry (the pixel-art tool) for drawing card art; Claudenspiel has no copy of its own yet.

## Build and test

```
./build.sh
```

```
for t in tests/*.js; do node "$t"; done
```

`tests/cs*.js` cover Claudenspiel's own rules; the `qc*.js` files are Kartenspiel's checks, kept and updated where Claudenspiel's rules differ. `qc3.js` prints only failures, then a pass count.

```
node tools/sim2.js 2 0 200 /tmp/cs-p2.json     # bot self-play: players, first game, last game, output
node tools/rewrite-data.js changes.json         # apply a batch of card changes to src/data.js, keeping its layout
node tools/logo.js                              # redraw the logo (needs Playwright and the network)
node tools/anatomy.js 2 0 500 /tmp/a.json         # per-turn records of bot games, for FOUNDATIONS.md (FLAT, AUDITS, SEASONS, RELEASE try the experiments)
```

## Publishing

`build.sh` writes the whole game into `index.html` at the top of the repository. GitHub Pages serves it from the `main` branch as-is (Settings → Pages → Deploy from a branch → `main`, `/ (root)`; `.nojekyll` turns off Jekyll), so publishing is: build, commit `index.html`, push.

## Releases

| Version | What changed |
|---|---|
| 0.1 | The fork: separate saves and look; a 116-card deck; the last round; Seat start off; Orchard 3◇ a card; Observatory +10◇ for all six suits; Revenge and Repent playable from hand; Brambles placeable. Archetype spread 0.68 → 0.16 |
| 0.2 | Grounds (Marsh, Battlefield, Crossroads); banking; buying a second claim; a seat handicap for 3+ players; the race bar; Obelisk 6◇; Fountain reworked. Seats even at every table size |
| 0.3 | The Book of Deeds (19 deeds); target 52◇; Mausoleum 4◇ for cards buried under it; its own icon; a safety term for the bots, measured and left off |
| 0.4 | Sound and animations (with Sound and Motion settings); Cathedral +1◇ per Sceptre card it doesn't own; Orchard +1◇ per Leaf card in the region; seat handicap by table size; bots play Grounds on purpose; Mausoleum back to 3◇ |
| 0.8 | A sharper Genius: plans like a tactician, judges like one, looks ahead like a Genius (+10 points over a tactician, paired) |
| 0.7 | You'll Regret That plays from hand (no dead cards) |
| 0.6 | The market, on trial (a New game option); paired skill-expression tool; the finding that the Genius needs updating before it can judge rules |
| 0.5 | "Why is this good?" hover hints; Palace 2◇ per Goblet it doesn't own; ticking counters, flying ●, heartbeat chevrons and the Genius's candle. 2-player spread 0.16 |
| 0.7 | You'll Regret That can be played from hand (3●: a card next to one of yours makes no ●); no dead cards left |
