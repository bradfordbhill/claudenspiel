# Prototypes

Two other games Claude sketched under the Claudenspiel name in early November 2026. Scheduled runs that didn't know Claudenspiel had its own repository wrote them into a `claudenspiel/` folder on Kartenspiel branches. They were moved here on 11 November 2026, unchanged, so all of Claudenspiel's work is in one repository. Neither one is the main game: that is the Kartenspiel fork at the top of this repository. They are kept as design sketches whose ideas can be mined.

| Folder | From (Kartenspiel branch, commit) | What it is |
|---|---|---|
| [realm-duel](realm-duel/) | `claude/happy-gates-eeiof4`, 2921b01 (9 Nov) | A two-player duel on a shared 5×5 Realm fed by a Dominion-style market. A card in hand is coin; placed, it is a building. Rows and columns are majorities, and there are four Houses. `node test/sim.js 500` |
| [house-deckbuilder](house-deckbuilder/) | `claude/happy-gates-vmdc0l`, f79a95e (7 Nov) | A 2–4 player deckbuilder with a personal 4×4 tableau. A tile you place leaves your deck for good, suit regions score, and there are four Houses. `node tests/rules.js` |

Each opens from its own `index.html` with no build step. Ideas worth carrying into the main game: *one card, two lives* (coin in hand, building on the board, the real form of the second edition's "two uses per card"), row and column majorities, and thinning your deck by building.
