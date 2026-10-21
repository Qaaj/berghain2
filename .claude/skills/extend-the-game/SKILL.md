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
