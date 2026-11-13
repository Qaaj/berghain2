---
name: level-editor-workflow
description: Build, change or import levels for Berghain2 with the Sprite Fusion tilemap editor and the repo's tile kits. Use when asked to design the street or the U-Bahn station, add buildings/shops/props to a level, add a marker type, import a Sprite Fusion export (map.zip), regenerate the starter levels, or debug why a map looks wrong in the game.
---

# Level editor workflow

The street (`Street` scene) and the U-Bahn (`Ubahn` scene) are **tile levels**. People build them in the Sprite
Fusion desktop editor from the repo's tilesets; the game loads the result. The full user guide is
[art/EDITOR.md](../../../art/EDITOR.md): read it first and point people to it.

## The contract

- Tilesets (import them as-is, **tile size 16**): `art/tilesets/neukoelln_street.png`, `art/tilesets/ubahn_station.png`.
  Labelled guides next to them show every block.
- Levels are **15 tiles tall** (one screen at 48px per tile). Ground: row 13 is walked on, row 14 is fill.
- Layer names drive behaviour (`src/systems/tilelevel.ts`):
  `far*` half-speed parallax · `markers` never drawn, spawns entities · `front*` over the player · any layer with
  `collider: true` is solid (`ground`) · everything else is drawn behind the player in file order.
- **Marker tiles** (letters on coloured squares in the tileset's `markers` section) place things; an entity stands on
  the **bottom** of its tile and adjacent same-kind markers merge. Street: P start, D door (→ Späti), U ubahn,
  S/W/C NPCs, X dealer, J Jule, F fire bin, K cat. U-Bahn: P start, E stairs, T train stop, V ticket, S/W passengers.
  The names come from the catalog (`marker_door` → `door`); `StreetScene`/`UbahnScene` decide what each does.

## Import an export

```bash
npm run import-map -- street ~/Downloads/map.zip      # or: ubahn
```

`art/scripts/import_map.py` reads the Phaser/Tiled JSON export or Sprite Fusion's own JSON, matches tiles to the
master tileset **by pixels** (so export ids may differ), keeps layer names and collider flags, scales to 48px tiles,
and writes `public/assets/tilemaps/<name>.json`, `<name>_sheet.png` and `<name>_catalog.json`. If it reports tiles that
aren't in the master tileset, the editor project used an edited copy of the tileset; re-import the original.

## Regenerate / edit the starter levels

`art/scripts/build_street_map.py` and `build_ubahn_map.py` build the shipped starter levels with `Level.put(layer,
block_name, x, y)`. Edit them for a scripted change, then `npm run maps`. Prefer the editor for hand-designed
levels; prefer the scripts for bulk or repeatable changes. Don't hand-edit `public/assets/tilemaps/*.json`.

## Adding to the kit

1. New block or marker: add the drawing in `street_*.py` / `ubahn_art.py` (see the `pixel-art-pipeline` skill),
   rerun the tileset script, then `npm run maps`.
2. New marker behaviour: add the marker in `street_props.MARKERS` (or `ubahn_art.MARKERS`), rerun, then handle the
   name in the scene: `level.markersNamed('thing')` returns `{x, y, w}` boxes (y is the bottom).
3. New level: create `build_<name>_map.py` with `Level('<kit>', w, h)`, call `level.write('<name>')`, extend
   `KIT_FOR` in `import_map.py`, preload with `TileLevel.preload(this, '<name>')` in `BootScene`, and make a scene
   like `StreetScene`.

## Checks before handing a level back

`npm run build`, then play it: spawn point correct, ground continuous (on the street a gap is a pit: falling below the screen resets health to zero), doors and
markers react, nothing floating, `far` layer wide enough for the camera (about half the level width plus one screen).
