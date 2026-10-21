import * as Phaser from 'phaser';
import { Depth } from '../config';
import { playerState } from '../systems/state';

const BAR_WIDTH = 250;

// Port of OG health_bar_view + health/mana bar mediators
export class Hud {
  private health: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    const x = scene.scale.width / 2 - BAR_WIDTH / 2;
    const h = scene.scale.height;
    this.health = scene.add
      .rectangle(x, h - 50, BAR_WIDTH, 15, 0x88d367)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0x332c3d)
      .setScrollFactor(0)
      .setDepth(Depth.HUD);
    scene.add
      .rectangle(x, h - 30, BAR_WIDTH, 8, 0xa8dfda)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0x332c3d)
      .setScrollFactor(0)
      .setDepth(Depth.HUD);
  }

  update() {
    const w = BAR_WIDTH * Math.max(0, playerState.health) / 100;
    this.health.setVisible(w > 0);
    if (w > 0) this.health.setSize(w, 15);
  }
}
