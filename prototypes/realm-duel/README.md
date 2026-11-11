# Claudenspiel

A two-player duel of shared-board tableaux, fed by a Dominion-style market. Open `index.html` in any browser (no build, no install) and play against the bot.

**Design pillars**
- *One card, two lives:* a card in hand is coin (●); placed on the shared 5×5 Realm it is a building (income ⚒, ◇ points, End bonuses, on-place effects). Placing costs you the coin, so every turn is a trade-off.
- *Carcassonne-style shared land:* cards must touch existing cards, rows and columns are contested for +1◇ majorities, and Ember can raze rivals.
- *Dominion-style variety:* 8 of 16 kingdom piles are drawn each game; four asymmetric Houses (Thorn, Cinder, Tidewright, Gilded) bend the rules.
- *Fairness:* the second player gets a 2◇ dowry and wins ties on equal buildings; bot self-play is ~49/51 by seat and 42–59% per House.

**Files:** `engine.js` (pure rules), `bot.js` (one-ply lookahead bot), `ui.js` + `style.css` (interface), `test/sim.js` (legal-move, card-conservation, termination and balance simulation: `node test/sim.js 500`).

**Next ideas:** Bone suit (burying/ruin), 3–4 players, online play, painted card art via Dithry, a smarter bot using the Kartenspiel simulator harness.
