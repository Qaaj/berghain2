---
name: extend-the-game
description: Add gameplay to Berghain2: a new scene or interior, NPC or interactable, marker behaviour, pickup, dialogue text, prompt, chapter step, or player state. Use for any code change under src/ that adds content or mechanics, as opposed to pure art or level layout.
---

# Extend the game

Read `CLAUDE.md` for the map of the code. These are the recurring recipes; follow the existing scenes as the model
(`StreetScene` for side-scrolling, `BuildingScene` for the top-down Späti, `UbahnScene` for entities with timers).

## Text and prompts

All player-facing strings live in `public/assets/localisation/data.json` under `en` (and `de`), looked up with
`localise(scene, 'dotted.key')` (keys are lowercased). Interaction prompts use
`interactable.object.<id>` (Späti), `interactable.ubahn.<type>` (station), `interactable.npc.<role>.action` (NPCs).
A missing key renders as the key itself, which is the sign you forgot one.

## An interactable in a tile level

1. Art: add a marker tile (see `level-editor-workflow`) or reuse one.
2. Scene: `for (const m of level.markersNamed('thing'))` push `{type: 'object.thing', x: m.x, width: m.w}` onto the
   scene's interactable list; the scene's prompt loop shows `interactable.object.thing`.
3. Handle `type` in the scene's `interact()` (called when the action key is pressed while standing in the zone).
4. Replies use `SpeechBubble` (`this.bubble.say(text, x, y, ms)`); the prompt loop must skip while
   `bubble.active`, otherwise the prompt overwrites the reply on the next frame.

## A new interior scene

Model it on `BuildingScene`: a generated map (`art/scripts/build_<name>_map.py` listing props by foot position,
collision rects and interaction zones), props depth-sorted by their feet (`depth = y`), the player's hitbox reduced
to the feet (`Player` mode `'inside'`), camera centred on a small room. Register the scene in `src/main.ts`,
preload its assets in `BootScene`, and add the door marker behaviour in `StreetScene.interact()`.

## A close-up you can inspect (look into a bin, open a drawer, read a pole)

The `Inspect` scene shows a close-up over the paused scene; `src/systems/inspect.ts` holds the data.

1. Art: add a function to `art/scripts/inspect_art.py` for the background (outline off, about 192x120 native) and
   one sprite per takeable item (`<view>_<item>`), register them in `VIEWS`, run
   `python3 art/scripts/inspect_art.py <view>`, and add the names to `INSPECT_ART`.
2. Data: add an `INSPECT_VIEWS` entry with hotspot rects in the background's native pixels. A spot with `item` is
   drawn from its sprite at x, y and goes into the inventory when used; the others are only looked at.
3. Opening it: on the street, map a tile block to the view in `INSPECT_BLOCKS` (every placed copy works, no marker
   needed). Anywhere else, call `openInspect(this, view, place)` from the scene's `interact()`, e.g. for a Späti
   interaction zone. `place` must be unique per copy (`'<scene>:<what>@<where>'`): taken items are remembered in
   `playerState.looted` as `<place>:<spot>`.
4. Text, under `inspect.<view>`: `prompt`, `title`, `intro`, and per spot `look`, plus `use` (junk; it falls back
   to `inspect.nothing`) or `take` (items). The item's pickup message is `inventory.<item>` as usual.

## State and progress

`systems/state.ts` is the single shared object (`health`, `inventory`, `chapter`, `money`, `streetX`). Scenes are
recreated on every visit, so initialise scene fields in `create()`, not in field initialisers. Chapter text lives
under `levels.level1.chapterN` in the localisation file. Pickups already taken are skipped by checking
`playerState.inventory` when the scene is built.

## Physics notes

Arcade physics. Street gravity is 2500 (set in `main.ts`), indoor scenes override it to 0 per scene. Player body is
36x95 on the street and 30x18 at the feet indoors; static bodies from `staticGroup().create(...).refreshBody()`.
Tile collision: `physics.add.collider(player, level.solid)` where `level.solid` holds the layers flagged `collider`.

## Before you finish

`npm run build`, then play-test (`playtest-in-browser`): walk to the new thing and use it.
