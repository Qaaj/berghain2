import * as Phaser from 'phaser';
import { FONT, MessageType } from '../config';
import { localise } from '../systems/text';

// Port of OG app_in_ubahn state: a placeholder screen, any key goes back up
export class UbahnScene extends Phaser.Scene {
  constructor() {
    super('Ubahn');
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(0x000000).fadeIn(300);
    this.add
      .bitmapText(width / 2, height / 2, FONT, localise(this, 'building.ubahn.welcome'), MessageType.MEDIUM)
      .setOrigin(0.5);

    // Wait a moment so the key that brought you here doesn't send you straight back
    this.time.delayedCall(400, () => {
      const back = () => this.scene.start('Street');
      this.input.keyboard!.once('keydown', back);
      this.input.gamepad?.once('down', back);
    });
  }
}
