# Building levels in the Sprite Fusion tilemap editor

The street and the U-Bahn station are tile levels. You draw them in the Sprite Fusion desktop editor with a
16px tileset made for this game, export, and run one command to bring the result into the game.

## 1. Set up the project

| Level | Tileset to import | Guide (labelled picture of every tile) |
|---|---|---|
| Street | `art/tilesets/neukoelln_street.png` | `art/tilesets/neukoelln_street_guide.png` |
| U-Bahn | `art/tilesets/ubahn_station.png` | `art/tilesets/ubahn_station_guide.png` |

1. New project, **tile size 16**.
2. Import the tileset PNG. Don't edit it in the editor: import it as it is. (To change art, edit the `.aseprite`
   source in `art/` or the drawing scripts, then regenerate; see the README.)
3. The street is **15 tiles tall**, which is exactly one screen (15 x 48px). Make it as wide as you like.

## 2. Layers (names matter, case doesn't)

Create these, bottom to top. Anything with the **collision** flag turned on becomes solid.

| Street layer | What goes in it |
|---|---|
| `far` | Skyline, Fernsehturm, moon, stars. Scrolls at **half speed**, so it only needs to be about half as wide as the street. |
| `buildings` | Plaster, windows, cornices, roofs, **shopfronts** and doors. |
| `details` | Balconies, graffiti, posters, signs, dishes. |
| `yard` | Optional. Things standing inside a vacant lot behind a fence: `weeds_a/b`, `rubble`, `bush`, `mattress`, `shopping_cart`. |
| `ground` | Pavement, curb, road. **Collision on.** The player walks on the top edge of the first row. |
| `props` | Lamps, bins, bikes, benches, the U-Bahn entrance, traffic lights, the chain-link fence. |
| `markers` | Marker tiles (see below). Never drawn in the game. |
| `front` | Drawn **over** the player: trees (the `tree` block is crown and trunk in one, so you walk behind all of it), the black `bin_black` / `bin_black_full` containers and `trash_bags` / `trash_bag`. |

| U-Bahn layer | What goes in it |
|---|---|
| `wall` | Ceiling, tiled wall, U7 stripe, dado. |
| `details` | Posters and signs on the wall. |
| `tracks` | Track bed behind the platform. |
| `ground` | Platform. **Collision on.** |
| `props` | Pillars, benches, ticket machine, stairs, boards, lamps. |
| `markers` | Marker tiles. |
| `front` | Drawn over the player. |

Both levels are 15 tiles tall. Put the ground on rows 13 (top, walked on) and 14. Big things are laid out as
blocks in the tileset (a window is 2x3 tiles, a shopfront 6x4): select the whole block in the tileset panel
and paint it, or build it once and copy/paste it in the map.

**Chain-link fence** (section `chain-link fence`): every piece is 1x3 tiles (the sign is 2x3) and goes in `props`
on rows 10-12, so it stands on the pavement. Paint `fence_end_l`, then any mix of `fence_mesh_a` (plain),
`fence_mesh_b` (bag caught at the bottom), `fence_mesh_torn`, `fence_sign` and a `fence_post` every few tiles,
then `fence_end_r`. The mesh tiles seamlessly. From a script: `fence(L, x, width, {offset: 'fence_sign'})` in
`build_street_map.py`. The `vacant lot` section has the firewall (`firewall_top`, `firewall_a/b/brick`), the
`firewall_ghost` imprint of a demolished house (6x6, `details`) and the lot's earth (`lot_dirt_top_a/b`, `lot_dirt`).

## 3. Marker tiles

Put a marker tile on the `markers` layer; whatever it spawns **stands on the bottom of that tile**. Neighbouring
markers of the same kind merge into one wider zone.

| Marker | Street | U-Bahn |
|---|---|---|
| **P** start | where the player begins | same |
| **D** door | enter the Späti | |
| **R** djdoor | enter the record shop | |
| **U** ubahn | go down into the station | |
| **E** exit | | stairs up to the street |
| **T** train | | where the train's nose stops |
| **V** ticket | | ticket machine |
| **S / W / C** | smoker / weirdo / cop NPCs | S / W |
| **F** fire | a burning bin (hurts) | |
| **K** cat | a cat you can pet | |

## 4. Export and import into the game

1. Export with **Phaser** (a zip with `map.json` and `spritesheet.png`). **Sprite Fusion JSON** works too.
2. Run (needs `pip3 install pillow` once):

   ```bash
   npm run import-map -- street ~/Downloads/map.zip      # or: ubahn
   ```

   Tiles are matched to the master tileset by their pixels, so the ids in the export don't have to line up.
   Layer names and collision flags are kept. If you changed the tileset image the command will tell you.
3. `npm run dev` and play. The starter levels it replaces come from `art/scripts/build_street_map.py` and
   `build_ubahn_map.py`; run those to get them back.

## Tips

- Hidden layers aren't exported by the editor.
- Every **D** door leads into the Späti and every **R** door into the record shop.
- The train is not a tile: it drives in by itself (`marker T` says where it stops) and can be boarded at its doors.
- Traffic lights animate by themselves: place any `ampel_*` frame (red, redamber, green, amber) and the street cycles
  every traffic light through red → red+amber → green → amber, all in step.
