---
name: playtest-in-browser
description: Run Berghain2 locally and verify a change by actually playing it in a browser with scripted key presses and screenshots. Use after any gameplay, scene, level, collision, UI or art change, or when asked to test, check, verify, or "see" the game.
---

# Play-test in the browser

Types passing is not proof. Run the game and look at it.

## Start

```bash
npm run dev        # http://localhost:5173 (use --strictPort if you need exactly 5173)
```

Open it in whichever browser tools you have (the Claude desktop app's built-in browser pane works well). A title screen
waits for a key; skip it in scripts by starting a scene directly.

## Dev helpers (only in `npm run dev`)

The page exposes `game` (Phaser), `playerState` and `hold(code, keyCode, ms)` (presses a key for `ms`).

```js
const wait = (ms) => new Promise(r => setTimeout(r, ms));
game.scene.stop('Boot'); game.scene.start('Street'); await wait(1500);   // or 'Building', 'Ubahn'
const s = game.scene.getScene('Street'), p = s.player;
await hold('ArrowRight', 39, 1200);            // walk
await hold('Space', 32, 120);                  // jump (street) / action (indoors)
await hold('ArrowUp', 38, 150);                // action on the street, up indoors
p.body.reset(2380, 480);                       // teleport: SPRITE top-left, not the body
```

Keys: street = ←/→ walk, Space jump, ↑ interact, Shift sprint. Indoors (Späti) = arrows move, Space interacts.
Useful state: `s.inFront` (street/U-Bahn interaction target), `s.zones`, `playerState.inventory/chapter/money`,
`s.bubble.active`, `game.scene.getScenes(true).map(x => x.scene.key)`.

## Gotchas

- **The game loop is throttled while nothing is looking.** In the browser pane, `setTimeout` waits in a script can pass
  with zero frames rendered. Take a screenshot first (and between long waits) to wake it; check with
  `game.loop.frame` before and after a wait.
- Vite hot reload gives dynamic `import()`s a second module copy; read state through the exposed `playerState`.
- `hold` fires keyboard events on `window`; Phaser listens there, so it works without focus.
- Teleported players need a moment to land: `await wait(300)` before asserting on `onGround` or zones.
- Scene start leaves a 300 ms fade: wait about 1.5 s after `scene.start` before screenshots.

## Checklist

1. `npm run build` passes.
2. Start the scene you changed, take a screenshot, read it.
3. Exercise what changed with keys, not just state pokes: walk to it, press the action key, watch the result.
4. Check the console for errors (`read_console_messages` or equivalent) and the screenshot for visual glitches
   (floating tiles, wrong depth, clipped text).
5. Test the edges: dying and respawning, leaving and re-entering scenes, the first and last screens of a level.
6. Report what you saw, including anything you could not verify.
