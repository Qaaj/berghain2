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

- `src/scenes/` — `Boot` (preload + title), `Street` and `Ubahn` (tile levels with a moving train), `Building` (Späti interior)
- `src/objects/` — `Player` (ground/jump/inside/zombie states), `Hud`
- `src/systems/` — `tilelevel` (loads editor maps: layers, collision, markers), input, message queue, speech bubbles, localisation, shared player state
- `src/config.ts` — debug flag, intro toggle, resolution
- `public/assets/` — the original art, font, tilemap and localisation, copied from `OG/assets`

## Levels and art

The street and the U-Bahn station are **tile levels you build in the Sprite Fusion tilemap editor**, from two
16px tilesets drawn for this game. See [art/EDITOR.md](art/EDITOR.md) for the workflow (layers, marker tiles,
export, `npm run import-map -- street map.zip`). Labelled guides of every tile are in `art/tilesets/`.

Everything is drawn in code and pushed to Aseprite through pixel-plugin's `pixel-mcp` server, so each asset also
exists as an editable `.aseprite` file in `art/`:

```bash
python3 art/scripts/street_art.py      # Neukölln tileset (facades, windows, shops, props, graffiti, skyline, markers)
python3 art/scripts/ubahn_art.py       # station tileset + the train sprites
python3 art/scripts/spati_art.py       # the Späti interior props
python3 art/scripts/build_street_map.py && python3 art/scripts/build_ubahn_map.py   # regenerate the starter levels
python3 art/scripts/build_spati_map.py # the Späti interior layout
python3 art/scripts/tile_guide.py neukoelln_street   # labelled guide image of a tileset
```

Needs Aseprite, pixel-plugin and `pip3 install pillow`.

## Differences from OG

- Fixed 1280×720 resolution scaled to fit, instead of sizing to the browser window at load
- The shop is a compact 768×480 Späti (OG's was 1600×960 with a single bottle in it), drawn from scratch: fridges, freezer,
  snack shelf, counter with a shopkeeper, Pfand machine, a cat, posters, a flickering neon sign
- You can leave the shop again (Space on the doormat); OG had no way out
- Pickups are remembered. Bottles can be returned at the Pfand machine for money, which completes chapter 2
- Missing localisation keys that OG referenced (welcome, game over, shop/U-Bahn texts) were added
- The seeded random street generator is gone: the street is a hand-built tile level (starter included), and the U-Bahn is a real station
