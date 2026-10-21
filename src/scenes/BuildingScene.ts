import * as Phaser from 'phaser';
import { config, MessageType } from '../config';
import { Hud } from '../objects/Hud';
import { Player } from '../objects/Player';
import { Controls } from '../systems/input';
import { MessageQueue, PlayerNotification } from '../systems/messages';
import { playerState } from '../systems/state';
import { localise } from '../systems/text';

type TiledObject = Phaser.Types.Tilemaps.TiledObject;

// Tiled properties come through as an object (old format) or an array (new format)
function prop<T = unknown>(obj: TiledObject, name: string): T | undefined {
  const p = obj.properties as unknown;
  if (Array.isArray(p)) return p.find((x: { name: string }) => x.name === name)?.value;
  return (p as Record<string, unknown> | undefined)?.[name] as T | undefined;
}

interface Zone {
  id: string;
  rect: Phaser.Geom.Rectangle;
}

// The Späti: a compact top-down shop built from art/scripts/spati_art.py and
// the generated map in public/assets/tilemaps/building.json. Props are depth
// sorted by their feet so you can walk behind tall ones.
export class BuildingScene extends Phaser.Scene {
  private player!: Player;
  private controls!: Controls;
  private hud!: Hud;
  private messages!: MessageQueue;
  private notification!: PlayerNotification;
  private zones: Zone[] = [];
  private current: Zone | null = null;
  private leaving = false;

  constructor() {
    super({ key: 'Building', physics: { arcade: { gravity: { x: 0, y: 0 } } } });
  }

  create() {
    this.leaving = false;
    this.zones = [];
    this.current = null;
    this.cameras.main.setBackgroundColor(0x000000);

    const map = this.make.tilemap({ key: 'building' });
    const tiles = map.addTilesetImage('spati_tiles', 'spati_tiles')!;
    map.createLayer('roomLayer', tiles)!.setDepth(0);

    // Centre the small room in the view instead of following the player
    const { width: W, height: H } = this.scale;
    this.cameras.main.setScroll(-(W - map.widthInPixels) / 2, -(H - map.heightInPixels) / 2);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    const walls = this.physics.add.staticGroup();
    for (const o of map.getObjectLayer('collisionsLayer')?.objects ?? []) {
      walls.add(this.add.zone(o.x!, o.y!, o.width!, o.height!).setOrigin(0, 0));
    }

    const objects = map.getObjectLayer('objectsLayer')?.objects ?? [];
    for (const o of objects) {
      const type = prop<string>(o, 'type');
      if (type === 'prop' || type === 'decor' || type === 'flat') this.placeProp(o, type);
      else if (type === 'interact') {
        this.zones.push({ id: prop<string>(o, 'id')!, rect: new Phaser.Geom.Rectangle(o.x!, o.y!, o.width!, o.height!) });
      }
    }

    const start = objects.find((o) => prop(o, 'type') === 'playerStart');
    this.player = new Player(this, start?.x ?? 0, start?.y ?? 0, 'inside');
    this.player.onAction = () => this.interact();
    this.physics.add.collider(this.player, walls);

    const pickups = this.physics.add.staticGroup();
    for (const o of objects.filter((o) => prop(o, 'type') === 'pickup')) {
      if (playerState.inventory.includes(o.name!)) continue;
      pickups
        .create(o.x!, o.y!, String(prop(o, 'spriteName')))
        .setOrigin(0, 0)
        .setDepth(o.y! + o.height!)
        .setName(o.name!)
        .refreshBody();
    }
    this.physics.add.overlap(this.player, pickups, (_p, item) => this.pickUp(item as Phaser.Physics.Arcade.Sprite));

    this.controls = new Controls(this, 'topdown');
    this.hud = new Hud(this);
    this.messages = new MessageQueue(this);
    this.notification = new PlayerNotification(this);
    this.messages.show(localise(this, 'building.welcome.spati'), MessageType.MEDIUM);

    if (config.debug) this.physics.world.createDebugGraphic();
    this.cameras.main.fadeIn(300);
  }

  private placeProp(o: TiledObject, type: string) {
    const img = this.add.image(o.x!, o.y!, String(prop(o, 'spriteName'))).setOrigin(0.5, 1);
    img.setDepth(type === 'decor' ? 1 : type === 'flat' ? 2 : o.y!);
    if (o.name === 'neon_open') {
      // The sign has a loose connection
      this.tweens.add({ targets: img, alpha: 0.7, duration: 90, yoyo: true, repeat: -1, repeatDelay: 1800, hold: 60 });
    }
  }

  update() {
    this.controls.update();
    this.player.setDepth(this.player.y + 96);
    this.updatePrompt();
    this.player.tick(this.controls);
    this.notification.follow(this.player.body);
    this.hud.update();
  }

  private updatePrompt() {
    const feet = this.player.body;
    this.current =
      this.zones.find((z) => Phaser.Geom.Intersects.RectangleToRectangle(z.rect, new Phaser.Geom.Rectangle(feet.x, feet.y, feet.width, feet.height))) ??
      null;
    if (this.current && !this.leaving) {
      const key = `interactable.object.${this.current.id}`;
      this.notification.show(key, localise(this, key));
    } else {
      this.notification.hide();
    }
  }

  private pickUp(sprite: Phaser.Physics.Arcade.Sprite) {
    playerState.inventory.push(sprite.name);
    this.messages.show(localise(this, `inventory.${sprite.name}`), MessageType.SMALL);
    sprite.destroy();
    if (sprite.name === 'cigarettes' && playerState.chapter === 1) {
      playerState.chapter = 2;
      this.messages.show(localise(this, 'levels.level1.chapter1.done'), MessageType.MEDIUM);
      this.messages.show(localise(this, 'levels.level1.chapter2.text'), MessageType.LARGE);
    }
  }

  private say(key: string) {
    this.notification.show('say', localise(this, key), 2500);
  }

  // Action button near something. Returns true when it did something.
  private interact(): boolean {
    const zone = this.current;
    if (this.leaving || !zone || !this.controls.actionJustPressed) return false;

    switch (zone.id) {
      case 'exit':
        this.leaving = true;
        this.notification.hide();
        this.player.freeze();
        this.player.body.setVelocity(0, 0);
        this.cameras.main.fadeOut(400);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Street'));
        return true;
      case 'shopkeeper': {
        const has = playerState.inventory.includes('cigarettes');
        const line = has ? 'greet_c' : Phaser.Utils.Array.GetRandom(['greet_a', 'greet_b']);
        this.say(`spati.shopkeeper.${line}`);
        return true;
      }
      case 'pfand': {
        const i = playerState.inventory.indexOf('bottle');
        if (i === -1) {
          this.say('spati.pfand.empty');
        } else {
          playerState.inventory.splice(i, 1);
          playerState.money += 25;
          this.say('spati.pfand.ok');
          if (playerState.chapter === 2) {
            playerState.chapter = 3;
            this.messages.show(localise(this, 'levels.level1.chapter2.done'), MessageType.MEDIUM);
          }
        }
        return true;
      }
      case 'cat':
        this.say('spati.cat.purr');
        return true;
      case 'fridge':
      case 'freezer':
        this.say(`spati.${zone.id}.look`);
        return true;
      case 'magazines':
        this.say('spati.magazines.look');
        return true;
    }
    return false;
  }
}
