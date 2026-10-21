import * as Phaser from 'phaser';
import { Depth, GROUND_HEIGHT, LEVEL_WIDTH } from '../config';
import { rnd } from '../systems/random';

export interface Interactable {
  type: string; // 'object.door' | 'object.ubahn' | 'npc.<name>'
  x: number;
  width: number;
  npc?: Phaser.GameObjects.Sprite;
}

type Item = 'fence' | 'building' | 'shrubbery';

const BUILDING_COLORS = [0x4f4531, 0x362f20, 0x3f3c35, 0x5b5340, 0x493f27];

// Port of OG create_backdrop_command + building_view: a seeded strip of
// fences, buildings (some with enterable doors) and shrubbery, plus street lamps.
export function createBackdrop(
  scene: Phaser.Scene,
  environment: Phaser.Physics.Arcade.StaticGroup,
  interactables: Interactable[],
) {
  const groundY = scene.scale.height - GROUND_HEIGHT;
  let lastX = 0;
  let lastWidth = 0;
  let spacing = 0;
  let lastHeight = 0;
  let lastItem = 'fence' as Item;

  const g = scene.add.graphics().setDepth(Depth.BUILDING);

  const fence = () => {
    const s = scene.add.image(lastX + lastWidth, groundY - 126, 'fence').setOrigin(0, 0).setDepth(Depth.FENCE);
    lastX = s.x;
    lastWidth = s.width;
    spacing = 1;
    lastItem = 'fence';
  };

  const shrubbery = () => {
    const s = scene.add
      .image(lastX + lastWidth, groundY - 134, 'shrubbery', rnd.int(4))
      .setOrigin(0, 0)
      .setDepth(Depth.SHRUBBERY);
    lastX = s.x;
    lastWidth = s.width;
    spacing = 1;
    lastItem = 'shrubbery';
  };

  const building = () => {
    const w = Math.round(150 + rnd.random() * 300);
    const h = Math.round(150 + rnd.random() * 500);
    const x = spacing + lastX + lastWidth;
    const y = groundY - h;

    g.fillStyle(BUILDING_COLORS[rnd.int(BUILDING_COLORS.length)], 1).fillRect(x, y, w, h);
    g.fillStyle(0x000000, 0.1).fillRect(x, y, w, 10);
    // Side shading where this building sticks out above its neighbour
    if (spacing !== 0) g.fillStyle(0x000000, 0.2).fillRect(x, y + 10, 10, h - 10);
    else if (lastHeight < h) g.fillStyle(0x000000, 0.2).fillRect(x, y + 10, 10, h - 10 - lastHeight);

    const doorX = Math.round(x + 20 + rnd.random() * (w - 120));
    g.fillStyle(0x000000, 0.6).fillRect(doorX, groundY - 80, 60, 80);
    if (rnd.getRandom() === 250 && doorX + 60 < LEVEL_WIDTH) {
      // Open doorway you can enter
      g.fillStyle(0x000000, 0.5).fillRect(doorX + 4, groundY - 76, 52, 76);
      interactables.push({ type: 'object.door', x: doorX, width: 52 });
    } else {
      g.fillStyle(0x3a3232, 1).fillRect(doorX + 4, groundY - 76, 52, 76);
    }

    lastX = x;
    lastWidth = w;
    spacing = rnd.getRandom() === 250 ? 100 : 0;
    lastHeight = h;
    lastItem = 'building';
  };

  while (lastX < LEVEL_WIDTH - 120) {
    const r = rnd.getRandom();
    switch (lastItem) {
      case 'fence':
        r === 250 ? building() : fence();
        break;
      case 'building':
        if (r === 250) shrubbery();
        else if (r === 200) fence();
        else building();
        break;
      case 'shrubbery':
        r === 250 ? building() : shrubbery();
        break;
    }

    if (rnd.getRandom() === 50) {
      // Lamps are solid at the top, so you can jump onto them
      const lamp = environment
        .create(lastX - 100 - rnd.random() * 100, groundY - 191, 'street_lamp')
        .setOrigin(0, 0)
        .setDepth(Depth.ENVIRONMENT) as Phaser.Physics.Arcade.Sprite;
      lamp.refreshBody();
      (lamp.body as Phaser.Physics.Arcade.StaticBody).setSize(10, 10, false).setOffset(15, 20);
    }
  }
}
