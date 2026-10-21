# Berghain2

A rebuild of the 2015 Berghain2.com browser game in Phaser 4 + TypeScript + Vite.
The original game is kept untouched in `OG/` (with its own git history).

## Run

```bash
npm install
npm run dev
```

Then open http://localhost:5173. `npm run build` typechecks and writes a static build to `dist/`.

## Controls

| | Street | Indoors |
|---|---|---|
| Move | ← → | Arrow keys |
| Jump | Space | — |
| Interact (doors, U-Bahn, NPC) | ↑ | Space |
| Sprint | Shift | Shift |

A gamepad also works (D-pad/left stick, A to interact).

## Layout

- `src/scenes/` — `Boot` (preload + title), `Street` (the Neukölln level), `Building` (Späti interior from the Tiled map), `Ubahn`
- `src/objects/` — `Player` (ground/jump/inside/zombie states), `Backdrop` (seeded street generator), `Hud`
- `src/systems/` — input, seeded random (OG weighted table), message queue + player notifications, localisation, shared player state
- `src/config.ts` — debug flag, seed, intro toggle, resolution
- `public/assets/` — the original art, font, tilemap and localisation, copied from `OG/assets`

## Differences from OG

- Fixed 1280×720 resolution scaled to fit, instead of sizing to the browser window at load
- You can leave the shop again (Space where you came in); OG had no way out
- Picking up the bottle works and is remembered
- Missing localisation keys that OG referenced (welcome, game over, shop/U-Bahn texts) were added
- The street layout is still seeded (`config.seed`) but generated with Phaser's RNG, so it differs from OG's
