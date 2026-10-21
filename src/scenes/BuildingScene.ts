import * as Phaser from 'phaser';
import { config, Depth, MessageType } from '../config';
import { Hud } from '../objects/Hud';
import { Player } from '../objects/Player';
import { Controls } from '../systems/input';
import { MessageQueue, PlayerNotification } from '../systems/messages';
import { playerState } from '../systems/state';
import { localise } from '../systems/text';

type TiledObject = Phaser.Types.Tilemaps.TiledObject;

// Tiled properties come through as an object (old format) or an array (new format)
function prop(obj: TiledObject, name: string): unknown {
  const p = obj.properties as unknown;
  if (Array.isArray(p)) return p.find((x: { name: string }) => x.name === name)?.value;
  return (p as Record<string, unknown> | undefined)?.[name];
}

const EXIT_RADIUS = 64;

// Port of OG app_in_building state + create_building_command: the top-down
// shop interior from the Tiled map, with walls and a bottle pickup.
export class BuildingScene extends Phaser.Scene {
  private player!: Player;
  private controls!: Controls;
  private hud!: Hud;
  private messages!: MessageQueue;
  private notification!: PlayerNotification;
  private exit = new Phaser.Math.Vector2();
  private leaving = false;

  constructor() {
    super({ key: 'Building', physics: { arcade: { gravity: { x: 0, y: 0 } } } });
  }

  create() {
    this.leaving = false;
    this.cameras.main.setBackgroundColor(0x333333);

    const map = this.make.tilemap({ key: 'building' });
    const tiles = map.addTilesetImage('building_inside_black', 'gameTiles')!;
    map.createLayer('backgroundLayer', tiles)!.setDepth(Depth.BUILDING);

    const walls = this.physics.add.staticGroup();
    for (const o of map.getObjectLayer('collisionsLayer')?.objects ?? []) {
      if (prop(o, 'type') !== 'collision') continue;
      const wall = this.add.zone(o.x!, o.y!, o.width!, o.height!).setOrigin(0, 0);
      walls.add(wall);
    }

    const objects = map.getObjectLayer('objectsLayer')?.objects ?? [];
    const start = objects.find((o) => prop(o, 'type') === 'playerStart');
    this.exit.set(start?.x ?? 0, start?.y ?? 0);

    this.player = new Player(this, this.exit.x, this.exit.y, 'inside');
    this.player.onAction = () => this.leave();
    this.physics.add.collider(this.player, walls);

    const pickups = this.physics.add.staticGroup();
    for (const o of objects.filter((o) => prop(o, 'type') === 'pickup')) {
      const key = String(prop(o, 'spriteName'));
      if (playerState.inventory.includes(o.name!)) continue;
      pickups.create(o.x!, o.y!, key).setOrigin(0, 0).setDepth(Depth.PICKUP).setName(o.name!).refreshBody();
    }
    this.physics.add.overlap(this.player, pickups, (_p, item) => {
      const sprite = item as Phaser.Physics.Arcade.Sprite;
      playerState.inventory.push(sprite.name);
      this.messages.show(localise(this, `inventory.${sprite.name}`), MessageType.SMALL);
      sprite.destroy();
    });

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels).startFollow(this.player, true, 0.15, 0.15);

    this.controls = new Controls(this, 'topdown');
    this.hud = new Hud(this);
    this.messages = new MessageQueue(this);
    this.notification = new PlayerNotification(this);
    this.messages.show(localise(this, 'building.welcome.spati'), MessageType.MEDIUM);

    if (config.debug) this.physics.world.createDebugGraphic();
    this.cameras.main.fadeIn(300);
  }

  update() {
    this.controls.update();
    const nearExit = this.isNearExit();
    if (nearExit) this.notification.show('exit', localise(this, 'interactable.object.exit'));
    else this.notification.hide();
    this.player.tick(this.controls);
    this.notification.follow(this.player.body);
    this.hud.update();
  }

  private isNearExit() {
    return Phaser.Math.Distance.Between(this.player.x, this.player.y, this.exit.x, this.exit.y) < EXIT_RADIUS;
  }

  // Not in OG (there was no way out yet): Space near where you came in
  private leave(): boolean {
    if (this.leaving || !this.controls.actionJustPressed || !this.isNearExit()) return false;
    this.leaving = true;
    this.player.freeze();
    this.player.body.setVelocity(0, 0);
    this.cameras.main.fadeOut(400);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Street'));
    return true;
  }
}
