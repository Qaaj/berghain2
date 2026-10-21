import * as Phaser from 'phaser';
import { config, FONT, MessageType } from '../config';
import { localise } from '../systems/text';
import { createPlayerAnimations } from '../objects/Player';

// Port of OG preload_assets_command + app_boot state (title screen)
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.setPath('assets/');
    this.load.json('text', 'localisation/data.json');
    this.load.tilemapTiledJSON('building', 'tilemaps/building.json');
    this.load.image('gameTiles', 'building/inside/tile_inside_black_tiles.png');
    this.load.image('pickup_bottle', 'pickups/pickup_bottle.png');
    this.load.image('pickup_cigarettes', 'pickups/pickup_cigarettes.png');
    this.load.image('spati_fridge', 'building/inside/spati_fridge.png');
    this.load.bitmapFont(FONT, 'fonts/carrier_command.png', 'fonts/carrier_command.xml');
    this.load.spritesheet('ground', 'ground.png', { frameWidth: 128, frameHeight: 64 });
    this.load.spritesheet('punker', 'punker.png', { frameWidth: 96, frameHeight: 96 });
    this.load.spritesheet('npc', 'npc.png', { frameWidth: 96, frameHeight: 96 });
    this.load.spritesheet('fire_bin', 'fire_bin.png', { frameWidth: 24, frameHeight: 48 });
    this.load.spritesheet('shrubbery', 'shrubbery.png', { frameWidth: 144, frameHeight: 144 });
    this.load.image('moon', 'moon.png');
    this.load.image('logo', 'logo.png');
    this.load.image('street_lamp', 'street_lamp.png');
    this.load.image('ubahn', 'ubahn.png');
    this.load.image('fence', 'fence.png');
  }

  create() {
    createPlayerAnimations(this);
    this.anims.create({
      key: 'burn',
      frames: this.anims.generateFrameNumbers('fire_bin', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });

    if (config.skipIntro) {
      this.scene.start('Street');
      return;
    }

    const { width, height } = this.scale;
    const logo = this.add.image(width / 2, height / 2 - 150, 'logo').setOrigin(0.5, 0);
    this.add
      .bitmapText(width / 2, logo.y + logo.height + 50, FONT, localise(this, 'menu.presskey'), MessageType.LARGE / 1.6)
      .setOrigin(0.5, 0);

    const start = () => this.scene.start('Street');
    this.input.keyboard!.once('keydown', start);
    this.input.once('pointerdown', start);
    this.input.gamepad?.once('down', start);
  }
}
