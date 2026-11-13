import * as Phaser from 'phaser';
import { config, FONT, MessageType } from '../config';
import { localise } from '../systems/text';
import { createPlayerAnimations } from '../objects/Player';
import { TileLevel } from '../systems/tilelevel';

// Props drawn for the Späti in Aseprite (art/scripts/spati_art.py)
const SPATI_PROPS = [
  'counter', 'shopkeeper', 'gondola', 'magazine_rack', 'crates', 'freezer', 'cig_wall',
  'poster_party', 'poster_beer', 'poster_hours', 'neon_open', 'plant', 'trash_bin',
  'doormat', 'cat', 'pfand', 'clock',
];

// Props drawn for the record shop (art/scripts/dj_art.py)
const DJ_PROPS = [
  'dj_booth', 'dj', 'record_bin', 'record_wall', 'speaker', 'neon_records', 'poster_techno',
  'disco_ball', 'listening_station', 'sofa', 'doormat_dj',
];

// Port of OG preload_assets_command + app_boot state (title screen)
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.setPath('assets/');
    TileLevel.preload(this, 'street');
    TileLevel.preload(this, 'ubahn');
    TileLevel.preload(this, 'ubahn_fhain');
    TileLevel.preload(this, 'fhain');
    for (const part of ['cab', 'car', 'cab_open', 'car_open']) this.load.image(`ubahn_train_${part}`, `ubahn/train_${part}.png`);
    this.load.json('text', 'localisation/data.json');
    this.load.tilemapTiledJSON('building', 'tilemaps/building.json');
    this.load.image('spati_tiles', 'building/spati/spati_tiles.png');
    for (const name of SPATI_PROPS) this.load.image(`spati_${name}`, `building/spati/${name}.png`);
    this.load.tilemapTiledJSON('dj', 'tilemaps/dj.json');
    this.load.image('dj_tiles', 'building/dj/dj_tiles.png');
    for (const name of DJ_PROPS) this.load.image(`dj_${name}`, `building/dj/${name}.png`);
    this.load.image('pickup_bottle', 'pickups/pickup_bottle.png');
    this.load.image('pickup_cigarettes', 'pickups/pickup_cigarettes.png');
    this.load.image('spati_fridge', 'building/inside/spati_fridge.png');
    this.load.bitmapFont(FONT, 'fonts/carrier_command.png', 'fonts/carrier_command.xml');
    this.load.spritesheet('punker', 'punker.png', { frameWidth: 96, frameHeight: 96 });
    this.load.spritesheet('npc', 'npc.png', { frameWidth: 96, frameHeight: 96 });
    this.load.spritesheet('fire_bin', 'fire_bin.png', { frameWidth: 24, frameHeight: 48 });
    this.load.image('logo', 'logo.png');
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
