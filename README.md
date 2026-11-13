# Berghain2

A pixel-art side-scroller set in Neukölln, Berlin. You're a punk with one goal tonight: get some cigarettes. Walk
the street past the Kneipe and the Döner, duck into the Späti, return a bottle at the Pfand machine, take the U7.

This is a rebuild of the [2015 original](https://github.com/Qaaj/berghain2) (Phaser 2, kept untouched in [`OG/`](OG/))
in **Phaser 4 + TypeScript + Vite**. It is also a working example of an **AI-assisted pixel-art game workflow**:
Claude Code draws the art through Aseprite, you build levels in the Sprite Fusion tilemap editor, and one command
brings the level into the game.

## Play

```bash
npm install
npm run dev          # http://localhost:5173
```

| | Street / U-Bahn | Inside the Späti |
|---|---|---|
| Move | ← → or A D | arrow keys or W A S D |
| Jump | Space | — |
| Interact (doors, NPCs, machines, train) | E, ↑ or W | E or Space |
| Sprint | Shift | Shift |

WASD mirrors the arrow keys everywhere, so on the street W interacts, like ↑. E interacts everywhere. A gamepad works too (D-pad or left stick, A to interact). `npm run build` typechecks and writes a static site to `dist/`.

**What's in it:** a Neukölln street (shops, windows, graffiti, a plaza with the U-Bahn entrance, a crosswalk, NPCs, a
burning bin, a cat, trees and wheelie bins you walk behind, working traffic lights, and weather that turns between
clear, rain, snow and wind), the Späti (counter and shopkeeper, fridges, a Pfand machine, a cat), a DJ record shop
(a DJ at the booth, record bins to dig through, a listening station), and a U7 platform where a BVG train arrives,
opens its doors and leaves. Progress: cigarettes (chapter 1) → bottle for money (chapter 2).

## The workflow this repo is set up for

```
 Python scripts ──pixel-mcp──▶ Aseprite ──▶ .aseprite sources + 16px tilesets
 (art/scripts)    (pixel-plugin)                      │
                                                      ▼
                       Sprite Fusion editor: build levels from the tileset
                                                      │  export (Phaser / JSON)
                                                      ▼
                            npm run import-map  ──▶  game loads the level
```

- **Art is code.** Sprites are described in Python (rects, character grids, a 3x5 pixel font) and pushed to Aseprite
  through [pixel-plugin](https://github.com/willibrandon/pixel-plugin)'s `pixel-mcp` server, so every asset is
  reproducible *and* editable in Aseprite. Claude Code can also call the plugin's tools directly.
- **Levels are tiles you place by hand.** Two tilesets (`art/tilesets/`) are made for the editor: a Neukölln street kit
  (facades, windows, balconies, nine shopfronts, street furniture, graffiti, skyline, marker tiles) and a U-Bahn
  station kit. Labelled guides sit next to them. See [art/EDITOR.md](art/EDITOR.md).
- **One command imports an export.** `npm run import-map -- street map.zip` matches tiles by their pixels, keeps layer
  names and collision flags, and writes what the game loads.
- **Claude Code knows the repo.** `CLAUDE.md`, five skills and three agents (below) are committed.

## Set it up

```bash
npm install
npm run doctor       # tells you what's missing and how to fix it
```

| You need | For | How |
|---|---|---|
| Node 20+ | the game | nodejs.org |
| Python 3 + Pillow | tileset guides, map import | `pip3 install pillow` |
| [Aseprite](https://www.aseprite.org) 1.3+ | the art pipeline | buy it, **or** `bash scripts/install-aseprite-macos.sh` builds it from source (free for personal use; macOS) |
| [pixel-plugin](https://github.com/willibrandon/pixel-plugin) | Aseprite MCP server for Claude Code | `claude plugin marketplace add willibrandon/pixel-plugin && claude plugin install pixel-plugin@pixel-plugin` |
| [Sprite Fusion](https://www.spritefusion.com) Tilemap Editor | building levels (optional) | desktop app, one-time purchase |
| [Claude Code](https://claude.com/claude-code) | the AI-assisted parts (optional) | `.claude/settings.json` offers the plugin when you open the repo |

You can play and change code with only Node. The art pipeline needs Aseprite, pixel-plugin and Pillow. Details and
troubleshooting: the `setup-art-tools` skill ([.claude/skills/setup-art-tools/SKILL.md](.claude/skills/setup-art-tools/SKILL.md)).

## Everyday commands

```bash
npm run dev                                          # play
npm run build                                        # typecheck + production build
npm run art                                          # redraw every tileset and prop through Aseprite
npm run maps                                         # regenerate the starter levels (street, U-Bahn, Späti, DJ shop)
npm run import-map -- street ~/Downloads/map.zip     # import a level from Sprite Fusion (or: ubahn)
python3 art/scripts/tile_guide.py neukoelln_street   # labelled guide image of a tileset
```

## Working with Claude Code

Open the repo in Claude Code. It reads `CLAUDE.md` and has these project skills and agents:

| Skills | Use for |
|---|---|
| `pixel-art-pipeline` | drawing or changing sprites, props and tileset blocks |
| `level-editor-workflow` | the editor contract (layers, markers), importing exports, regenerating starters |
| `playtest-in-browser` | running the game, scripted key presses, screenshots, the gotchas |
| `setup-art-tools` | installing Aseprite, pixel-plugin, Pillow; troubleshooting |
| `extend-the-game` | new scenes, interactables, text, state |

| Agents | Use for |
|---|---|
| `pixel-artist` | "add a kebab shop sign", "redraw the lamp" |
| `level-designer` | "add a block of Altbau with a Spätkauf", "import this map" |
| `playtester` | verifying a change by actually playing it |

Example prompts: *"Draw a bike repair shop front for the street kit and put it between the Kiosk and the Friseur."*
*"Add a second U-Bahn line sign to the station kit."* *"Play-test the Späti after my change."*

## Repository layout

```
src/                 the game
  scenes/            Boot, Street, Building (the record shop and the Späti), Ubahn
  systems/           tilelevel (editor maps), input, messages, text, state, weather
  objects/           Player, Hud
art/
  scripts/           the drawing toolkit, tileset and prop scripts, map builders, import_map.py
  tilesets/          the two editor tilesets (+ guides); import these into Sprite Fusion
  *.aseprite         editable sources of everything drawn
  EDITOR.md          how to build levels in the editor
public/assets/       what the game loads (generated; see CLAUDE.md before editing)
scripts/             install-aseprite-macos.sh, check-setup.sh (npm run doctor)
OG/                  the 2015 original, untouched
.claude/             project settings, skills, agents
```

## Differences from the original

- Phaser 4 + TypeScript instead of Phaser 2 + RequireJS + Soma.js (scenes and small systems instead of commands,
  mediators and dependency injection).
- Fixed 1280×720, scaled to fit, instead of sizing to the window at load.
- The seeded random street is gone; the street is a tile level you can build (a starter level ships).
- The Späti is a compact interior with a shopkeeper, Pfand machine and more; you can leave it again.
- The U-Bahn is a real platform with a train, ticket machine and stairs, not a placeholder.
- Bugs and missing text in the original were fixed or filled in.

## Credits and licences

The original game was made in 2015 by the three people listed in [OG/README.md](OG/README.md). This repository keeps
its history. Art in this repo was drawn for the project (pixel-by-pixel through Aseprite). Aseprite is © Igara Studio;
building it for personal use is permitted by its EULA, redistributing it is not. Sprite Fusion and pixel-plugin have
their own licences. No licence has been chosen for the game's own code and art yet.
