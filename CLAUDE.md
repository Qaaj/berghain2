# Berghain2

A pixel-art side-scroller set in Neukölln (Berlin), rebuilt in **Phaser 4 + TypeScript + Vite**. The 2015 original
(Phaser 2 + Soma.js) lives untouched in `OG/` as a reference: read it, never edit it.

Chapter 1 goal: get cigarettes (Späti) → chapter 2: get money (return a bottle at the Pfand machine).

## Commands

```bash
npm install            # once
npm run dev            # http://localhost:5173 (Vite)
npm run build          # typecheck + production build; run before committing
npm run doctor         # checks Node, Pillow, Aseprite, pixel-plugin, Sprite Fusion
npm run art            # redraw every tileset/prop through pixel-mcp (needs Aseprite + pixel-plugin)
npm run maps           # regenerate the starter levels (streets, U-Bahn stations, Späti)
npm run import-map -- street ~/Downloads/map.zip   # bring in a map exported from Sprite Fusion (or: ubahn)
```

## How it fits together

- `src/scenes/` — `Boot` (preload, title) → `Street` ⇄ `Building` (Späti) and `Street` ⇄ `Ubahn`. `Inspect` is an
  overlay over any of them: the close-up of something you look into (the street container), with hotspots to read or
  take items from. Views, hotspots and which street blocks open them live in `src/systems/inspect.ts`.
  `Street` takes `{district: 'neukoelln' | 'fhain'}` and `Ubahn` takes `{station, arriving}`: boarding the train
  plays a ride inside the carriage and arrives at the other station (Neukölln U7 ⇄ Friedrichshain U5), whose
  stairs lead up to that district's street. Friedrichshain has the Berghain (door marker `berghain`, not enterable yet).
- `src/systems/tilelevel.ts` loads levels made in the **Sprite Fusion tilemap editor**: layer names decide
  behaviour (`far` half-speed parallax, `ground` etc. with the `collider` flag are solid, `markers` spawn entities,
  `front*` draws over the player). See `art/EDITOR.md`.
- `src/objects/Player.ts` — ground/jump/inside/zombie states. `Hud`, `systems/messages.ts` (title messages, prompts,
  speech bubbles), `systems/input.ts`, `systems/text.ts` (localisation from `public/assets/localisation/data.json`),
  `systems/state.ts` (shared player state).
- The Späti interior (`Building`) is generated from `art/scripts/build_spati_map.py` (props by foot position,
  collision rects, interaction zones). The train in `Ubahn` is an entity that cycles arrive → open → leave.
- Everything is drawn at a native 16px grid and scaled **3x** (the player sprite is 96px = 32 native). The game is a
  fixed 1280×720, 15 tiles (48px each) tall.

## The art pipeline (do not hand-edit generated files)

Art is code. `art/scripts/*.py` draw sprites with a tiny toolkit (`spriteart.py`: rects, character grids, 3x5 font)
and push them to Aseprite through pixel-plugin's `pixel-mcp` server (`pixelmcp.py`), so each asset also exists as
an editable `.aseprite` in `art/`.

| Generated | By | Don't edit by hand |
|---|---|---|
| `art/tilesets/neukoelln_street.*`, `friedrichshain_street.*`, `ubahn_station.*`, `ubahn_fhain.*`, `art/*.aseprite` | `street_art.py`, `fhain_art.py`, `ubahn_art.py` (both stations, themed), `spati_art.py`, `inspect_art.py` | the PNG/JSON; change the script (or the `.aseprite` and accept a regenerate will overwrite it) |
| `public/assets/building/spati/*`, `public/assets/ubahn/*`, `public/assets/inspect/*` | same | |
| `public/assets/tilemaps/*.json`, `*_sheet.png`, `*_catalog.json` | `build_*_map.py` or `import_map.py` | |

Rules of thumb: reuse the shared palette in `spriteart.P` (OG colours first), keep tile-kit blocks aligned to the 16px
grid, run `python3 art/scripts/tile_guide.py <kit>` to look at the result, and view PNGs before declaring them done.
pixel-mcp quirk: after `draw_rectangle` makes a cel at an offset, later `draw_pixels` calls land offset; the toolkit
only uses `draw_pixels` (first batch includes the canvas corners) so it never hits this.

## Testing

No unit tests; verify in the browser. In `npm run dev` the page exposes `game`, `playerState` and
`hold(code, keyCode, ms)` (presses a key). Teleport with `player.body.reset(spriteX, spriteY)` (sprite top-left, not
body). The preview pane throttles the game loop until something takes a screenshot, so interleave screenshots with
scripted waits. See the `playtest-in-browser` skill.

## Conventions

- TypeScript strict, no unused locals/params (the build fails on them). Match the surrounding style; comments
  explain why, not what.
- Text shown to players goes in `public/assets/localisation/data.json` (keys are lowercase dotted paths).
- Per-session player state lives in `systems/state.ts`; scenes must reset their own fields in `create()`.
- Commits: small and descriptive; end with the Co-Authored-By trailer the harness gives you. Don't push, force-push,
  or rewrite history unless asked.

## Skills and agents in this repo

Skills (`.claude/skills/`): `pixel-art-pipeline`, `level-editor-workflow`, `playtest-in-browser`, `setup-art-tools`,
`extend-the-game`. Agents (`.claude/agents/`): `pixel-artist`, `level-designer`, `playtester`. The pixel-plugin
marketplace entry is in `.claude/settings.json`, so Claude Code offers to install it when you open the repo.
