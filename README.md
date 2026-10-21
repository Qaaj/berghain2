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

## Art pipeline

The Späti art is drawn in code and pushed to Aseprite through pixel-plugin's `pixel-mcp` server, so every
asset also exists as an editable `.aseprite` file in `art/`.

```bash
python3 art/scripts/spati_art.py            # redraw all props + tileset -> art/*.aseprite and public/assets/building/spati/*.png (3x)
python3 art/scripts/spati_art.py counter    # redraw one prop
python3 art/scripts/build_spati_map.py      # regenerate public/assets/tilemaps/building.json (layout, collisions, interaction zones)
```

Requires Aseprite and pixel-plugin (see `art/scripts/pixelmcp.py`). The layout lives in `build_spati_map.py`
(props are placed by their feet; solids and interaction zones are listed there too).

## Differences from OG

- Fixed 1280×720 resolution scaled to fit, instead of sizing to the browser window at load
- The shop is a compact 768×480 Späti (OG's was 1600×960 with a single bottle in it), drawn from scratch: fridges, freezer,
  snack shelf, counter with a shopkeeper, Pfand machine, a cat, posters, a flickering neon sign
- You can leave the shop again (Space on the doormat); OG had no way out
- Pickups are remembered. Bottles can be returned at the Pfand machine for money, which completes chapter 2
- Missing localisation keys that OG referenced (welcome, game over, shop/U-Bahn texts) were added
- The street layout is still seeded (`config.seed`) but generated with Phaser's RNG, so it differs from OG's
