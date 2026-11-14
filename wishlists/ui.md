# UI wishlist

What Claudenspiel should look and feel like. ✅ done, ▶ next up, ○ later.

## Identity
- ✅ 0.1 Its own logo (verdigris and copper Fraktur), oxblood-to-copper title bars on a dusk-violet desk, its own window title.
- ✅ 0.3 Its own app icon and favicon (a verdigris C on a parchment card).
- ○ A title screen: the walled city at dusk, animated in dithered pixels, with the menu as banners hanging from the walls.
- ○ Fork Dithry into Claudenspiel, so painted cards save under `cs.faces` and show up here.

## Reading the game
- ✅ 0.2 A score race bar above the board: every player's ◇ on one track to the target, and the last round announced.
- ○ Add each player's likely pace (from the Genius's race model) to the race bar as a ghost marker.
- ✅ 0.5 "Why is this good?" on hover in the hand: what the card would gain if played (and claimed) now, at its best space, worked out without peeking.
- ○ The same hint for cards played from hand (Actions, Blessings).
- ○ Turn replay: step through the last round's moves on the board, like a chess move list.
- ✅ 1.0-pre (the chart and the story) ○ (the Genius's view) **The Chronicle**, a post-game report: each player's ◇ after every turn as a stepped pixel line, marks where Ruins, Overwhelms, contests and the last round happened, and the turning points in words (lead changes, the biggest turns). Still to come: the Genius's suggested better move at the two biggest moments.
- ○ Colour-blind mode: suit patterns (the dithered suit textures, stronger) and suit glyphs on every board card.

## Feel: ground rules
- Everything stays pixel art: motion moves in whole pixels, in steps rather than smooth tweens (8–12 frames a second), and effects are made of dithered pixels, never soft glows or blur.
- Every animation is short (under half a second for routine moves, at most 1.5 s for big moments) and never blocks input: a click mid-animation finishes it at once.
- `prefers-reduced-motion` and a "Motion: full / calm / off" setting are respected everywhere; calm keeps only the motion that carries information (a card arriving, a score changing).
- ✅ 0.4: Motion (full, calm, off) and Sound settings above the board, and the M key. Sound is off by default, has one volume slider and a mute key (M), and is synthesized in the page with Web Audio, so the game stays a single file. A quiet, period-flavoured palette: wood, parchment, wax, bells, low strings. Never a jingle on every click.

## Animations
- ✅ 0.4 (the drop) ○ (the flip) **Card play:** the card flips from the hand in two pixel steps (edge-on, then face-up) and drops into its space with a one-pixel bounce; the dithered suit texture "settles" from coarse to fine as it lands.
- ✅ 0.4 (the dust) **Claim:** the meeple falls from above the card, lands with a puff of four dithered dust pixels in the player's colour, and the card's border fills in clockwise.
- ○ **Bought claim:** two coins flip from the ● counter into a small strongbox icon before the meeple appears.
- ✅ 0.5 **Banking:** leftover ● coins slide into the ◇ pile at the end of the turn, each becoming a small gem with a single-frame glint.
- ✅ 1.0-pre **Ruin:** the card cracks along a jagged pixel line, its colours step down to the grey Ruined palette in three frames, and a few chips fall off the edge.
- ✅ 1.0-pre **Overwhelm:** the enemy chevrons around the card pulse inward together, then the card is crushed (squashed two pixels shorter) and greys out; the chevrons scatter.
- ✅ 0.5 **One away from Overwhelm:** the chevrons beat slowly, like a heart, until the danger passes.
- ○ **Burying:** the card slides under its host, leaving a sliver of its edge visible for a moment, like a page tucked into a book.
- ○ **Curse:** a wisp of violet dithered smoke curls out of the cursed card and settles as a small mark in its corner.
- ○ **Grounds:** Marsh grows reeds that sway two pixels in the wind; Battlefield leaves a faint scorched ring on the board; Crossroads draws its paths out to its neighbours as it lands.
- ○ **Ascension:** the five suit colours of the stack spiral upward as a pixel helix, then the card's border turns to gold leaf for good.
- ✅ 0.5 (the tick) **Score changes:** the ◇ number ticks up digit by digit; big gains float a small "+6◇" above the card that earned it.
- ✅ 0.4 (the banner) **Race bar:** the leader's marker leans forward; when someone reaches the target, a bell icon swings on the bar and the last-round banner unrolls from the top like a scroll.
- ○ **Turn handover:** the active player's card in the player list slides out a few pixels and their crest catches a glint; bot turns show a small hourglass that turns over once per move.
- ✅ 0.5 **The Genius thinking:** a candle beside its name, with the flame flickering faster the longer it thinks.
- ○ **Deeds:** a wax seal stamps onto the toast when a deed is earned, then the scroll rolls itself up into the Deeds tab.
- ✅ 1.0-pre (the light) ○ (the dimming) **Victory:** the winner's Kingdom cards light up one by one in order of value, then a pixel banner with their crest unfurls over the board. Defeat is quieter: the board dims and the wind picks up.
- ○ **Ambient board:** the night prairie's grass ripples in slow dithered waves, the river glints, and a lantern now and then moves along the city wall. Rain on the board in the last round.
- ✅ 1.0-pre **Hover:** hand cards lift two pixels when hovered; legal spaces breathe gently (one shade lighter and back) instead of a static highlight.

## Sound effects
- ○ **Shuffle and deal:** a soft parchment riffle when the deck is shuffled; one short card slide per card dealt.
- ✅ 0.4 **Card play:** a dry wooden "tock" as a card lands, pitched a little differently per suit (Bone lower and hollow, Goblet bright and glassy, Sword with a faint metallic ring).
- ✅ 0.4 **Claim:** a wax seal pressed into paper, a soft thud with a small squelch.
- ✅ 0.4 **Bought claim:** two coins dropped into a wooden box.
- ✅ 0.4 **Banking:** coins poured into a leather purse, one clink per ◇ banked.
- ✅ 0.4 **Ruin:** a short crack of splitting stone, then a scatter of grit.
- ✅ 1.0-pre **Overwhelm:** a low drum roll that cuts off as the card is crushed; a deeper version when a Foundation falls.
- ○ **One away from Overwhelm:** a faint heartbeat under the music while the danger lasts, only for your own cards.
- ✅ 0.4 **Curse:** a whispered breath and a minor-key pluck on a lute.
- ✅ 1.0-pre **Burying:** a spade into earth for Bone and Foundation burials; a book closing for everything else.
- ✅ 0.4 **Grounds:** Marsh: frogs and water; Battlefield: a distant horn; Crossroads: cart wheels on gravel.
- ✅ 1.0-pre **Ability used:** a short bell for Sceptre and Tome abilities, a forge hammer for Sword, a goblet clink for Goblet, a hollow knock for Bone, a rustle for Leaf.
- ✅ 1.0-pre **Your turn:** a small hand bell, only when a human is up after bots have played.
- ✅ 1.0-pre **Contest:** two blades meet off-key; the ousted meeple tumbles off the card in its owner's colour and the taker's meeple lands in a puff.
- ✅ 0.4 **Last round:** the city's great bell tolls once, far away.
- ✅ 0.4 **Deed earned:** a quill scratch and a wax seal.
- ✅ 0.4 **Victory:** a short brass fanfare in a mode that fits the winner's archetype (bright for the Hedonist, solemn for the Archbishop, martial for the Warmonger). Defeat: a single low string note and the wind.
- ○ **Ambience (optional, separate slider):** night wind over the prairie, crickets, the river; a distant tavern when a Hedonist leads; rain in the last round.
- ○ **Menus:** a muted wooden click for buttons and a page turn between tabs, so the interface sounds like a desk, not a computer.

## Play
- ✅ 1.0-pre Undo past a bot's turn in single player shows what the bots did (up to ten log lines) as it takes it back.
- ○ Keyboard-only play from start to finish, with spoken prompts for screen readers.
- ○ A tablet layout: the board large, the hand as a fan along the bottom edge.
