import * as Phaser from 'phaser';
import { HEIGHT, WIDTH } from './config';
import { BootScene } from './scenes/BootScene';
import { BuildingScene } from './scenes/BuildingScene';
import { StreetScene } from './scenes/StreetScene';
import { UbahnScene } from './scenes/UbahnScene';
import { playerState } from './systems/state';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#000000',
  pixelArt: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  input: { gamepad: true },
  physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 2500 } } },
  scene: [BootScene, StreetScene, BuildingScene, UbahnScene],
});

if (import.meta.env.DEV) {
  Object.assign(window, { game, playerState });
}
