---
name: pixel-art-pipeline
description: Draw or change pixel art for Berghain2 (props, tiles, tilesets, train sprites) with the Python toolkit in art/scripts that drives Aseprite through pixel-plugin's pixel-mcp. Use when asked to add, redraw, recolour or fix any sprite, prop, tile, tileset or shopfront, or to "make more art" for the street, the Späti or the U-Bahn.
---

# Pixel art pipeline

Art in this repo is **code that draws through Aseprite**. Each asset ends up as an editable `.aseprite` in `art/`
and a PNG the game loads. Never edit the generated PNG or tileset JSON by hand: change the script and rerun it.

## Where things live

| Kind | Script | Output |
|---|---|---|
| Neukölln street tileset (facades, windows, balconies, shopfronts, props, graffiti, skyline, markers) | `art/scripts/street_facades.py`, `street_shops.py`, `street_props.py`, assembled by `street_art.py` | `art/tilesets/neukoelln_street.png/.json`, `art/neukoelln_street.aseprite` |
| U-Bahn station tileset + train sprites | `art/scripts/ubahn_art.py` | `art/tilesets/ubahn_station.*`, `public/assets/ubahn/train_*.png` |
| Späti interior props and tiles | `art/scripts/spati_art.py` | `art/spati_*.aseprite`, `public/assets/building/spati/*.png` |
| Talking NPCs: the dealer (sprite, talk close-up, drug pickups) and Jule (sprite, close-up) | `art/scripts/npc_art.py` | `art/npc_*.aseprite`, `public/assets/npc/{dealer,jule}.png`, `public/assets/talk/{dealer,jule}.png`, `public/assets/pickups/pickup_*.png` |

Toolkit: `spriteart.py` (`Sprite`: `rect`, `hline`, `vline`, `line`, `ellipse`, `grid`, `text` with a 3x5 font, `erase`,
`blit`; `Studio.make` pushes a sprite to Aseprite and exports it), `sheet.py` (`TileSheet`: packs named blocks onto a
16-column sheet and writes the catalog), `pixelmcp.py` (JSON-RPC client for pixel-mcp), `tile_guide.py` (labelled
picture of a tileset).

## Recipe: add or change an asset

1. Find the drawing function (or add one) and keep to the **palette** in `spriteart.P` (OG colours first: browns
   `#4f4531 #362f20 #3f3c35 #5b5340`, dim warm lights `#e0a845`, neon pink `#ff71f0`, cyan `#71faff`, green `#12ff00`).
2. **Tile kits**: a block is `sheet.add('name', w_tiles, h_tiles)` returning a `Sprite` of `w*16 x h*16` pixels with
   no outline. Everything is aligned to the 16px grid so the Sprite Fusion editor can slice it. Add a new section
   with `sheet.group('title')`. Names become the catalog keys that the map scripts use (`L.put('props', 'lamp', x, y)`).
3. **Standalone props** (Späti, train): `Sprite(w, h)` has a 1px outline pad; `studio.make(name, sprite, dest)` scales 3x.
4. Run it: `python3 art/scripts/street_art.py` (or `ubahn_art.py`, `spati_art.py <name>` for one prop). Set
   `ART_TMP` to a scratch folder if you don't want `/tmp/berghain2-art`.
5. **Look at it.** `python3 art/scripts/tile_guide.py neukoelln_street 3 14` writes labelled slices to
   `art/tilesets/_slice_*.png` (delete them afterwards); read the PNG, don't assume. Check at 3x, on the game's dark
   background, next to neighbouring tiles.
6. If you added or renamed blocks, regenerate the starter maps (`npm run maps`) and play-test (`playtest-in-browser`).
   If a prop is a new standalone texture, add it to the preload list in `src/scenes/BootScene.ts`.

## Style notes

- Night-time Neukölln: dim plaster, a few warm lit windows, neon accents, orange sodium sky. Keep contrast low
  except for the things the player should notice.
- Pixel scale is fixed: 1 native pixel = 3 screen pixels. The player is 32 native pixels tall; windows are 2x3 tiles,
  a storey is 4 tiles, a shopfront is 6x4 tiles with the door on column 4.
- Draw dark-to-light shading with `shade(colour, factor)` and blends with `mix(a, b, t)`; avoid pure black except
  for outlines (`#121114`).
- Text on signs uses the built-in 3x5 font (`Ä Ö Ü` draw their dots above). Add missing glyphs to `FONT`.

## pixel-mcp quirks

- Use `draw_pixels` for everything. If a `draw_rectangle` creates the cel at an offset, later `draw_pixels` land
  shifted; `Studio.make` avoids it by always starting with the canvas corners as transparent pixels.
- `scale_sprite` with `nearest` for 3x. Don't scale the `.aseprite` sources in `art/`; scale a temp copy.
- Batches above about 2000 pixels are split by `Studio.make`.

## When Claude drives the pixel-plugin tools directly

You can also call the plugin's tools (`create_canvas`, `draw_pixels`, `export_sprite`, ...) for one-off sketches,
then port the result into a script so it is reproducible. Prefer scripts for anything that ships.
