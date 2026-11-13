import * as Phaser from 'phaser';

// Close-up views: what you see when you look into a container, open a drawer or read a pole full of flyers.
// A view is a background drawn by art/scripts/inspect_art.py plus hotspots in its native pixels. A hotspot either
// gets looked at (text under inspect.<view>.<spot>) or, with `item`, taken into the inventory; a taken item is
// remembered per placement in playerState.looted, so every container on the street keeps its own contents.
export interface InspectSpot {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  item?: string; // inventory name it becomes; its sprite (inspect_<art>_<item>) is drawn at x, y
}

export interface InspectView {
  art: string; // texture inspect_<art>, also the prefix of the item sprites
  spots: InspectSpot[];
}

const CONTAINER_JUNK: InspectSpot[] = [
  { id: 'cup', x: 14, y: 22, w: 22, h: 12 },
  { id: 'banana', x: 42, y: 58, w: 22, h: 16 },
  { id: 'pizza', x: 70, y: 22, w: 46, h: 30 },
  { id: 'paper', x: 126, y: 64, w: 36, h: 26 },
  { id: 'bag_white', x: 132, y: 28, w: 52, h: 34 },
  { id: 'bag_yellow', x: 76, y: 90, w: 56, h: 26 },
];

export const INSPECT_VIEWS: Record<string, InspectView> = {
  container: {
    art: 'container',
    spots: [...CONTAINER_JUNK, { id: 'bottle', x: 78, y: 60, w: 48, h: 19, item: 'bottle' }],
  },
  // The closed container on the far side of the street: same rubbish, someone beat you to the bottle
  container_closed: { art: 'container', spots: CONTAINER_JUNK },
};

// Street tile blocks that open a view when you stand in front of one and press the action button. Any copy of the
// block placed in the level (by build_street_map.py or in Sprite Fusion) is inspectable, no marker needed.
export const INSPECT_BLOCKS: Record<string, string> = {
  bin_black_full: 'container',
  bin_black: 'container_closed',
};

export const INSPECT_ART = ['container', 'container_bottle'];

export function preloadInspectArt(scene: Phaser.Scene) {
  for (const name of INSPECT_ART) scene.load.image(`inspect_${name}`, `inspect/${name}.png`);
}

// Opens `view` over the calling scene, which pauses until the close-up is closed. `place` identifies this copy of
// the object (e.g. "street:bin_black_full@30,11") so what you take from it stays taken.
export function openInspect(scene: Phaser.Scene, view: string, place: string) {
  scene.scene.pause();
  scene.scene.launch('Inspect', { view, place, from: scene.scene.key });
  // Keys released while paused never reach this scene; without a reset the player would keep walking
  scene.events.once(Phaser.Scenes.Events.RESUME, () => scene.input.keyboard?.resetKeys());
}
