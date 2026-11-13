import * as Phaser from 'phaser';
import { config, MessageType } from '../config';
import { Hud } from '../objects/Hud';
import { Player } from '../objects/Player';
import { Controls } from '../systems/input';
import { MessageQueue, PlayerNotification, SpeechBubble } from '../systems/messages';
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

export type ShopId = 'spati' | 'dj';

// Each interior: its generated map (art/scripts/build_<shop>_map.py), the tileset name inside that map,
// and where the person behind the counter talks from
const INTERIORS: Record<ShopId, { map: string; tiles: string; keeper: { x: number; y: number } }> = {
  spati: { map: 'building', tiles: 'spati_tiles', keeper: { x: 603, y: 92 } },
  dj: { map: 'dj', tiles: 'dj_tiles', keeper: { x: 384, y: 68 } },
};

// What a record costs in the DJ shop, in cents
const RECORD_PRICE = 1500;

// The shop interiors (the Späti and the record shop): compact top-down rooms built from
// art/scripts/<shop>_art.py and the generated maps in public/assets/tilemaps/. Props are depth
// sorted by their feet so you can walk behind tall ones.
export class BuildingScene extends Phaser.Scene {
  private player!: Player;
  private controls!: Controls;
  private hud!: Hud;
  private messages!: MessageQueue;
  private notification!: PlayerNotification;
  private bubble!: SpeechBubble;
  private zones: Zone[] = [];
  private current: Zone | null = null;
  private leaving = false;
  private shop: ShopId = 'spati';

  constructor() {
    super({ key: 'Building', physics: { arcade: { gravity: { x: 0, y: 0 } } } });
  }

  init(data: { shop?: ShopId }) {
    this.shop = data.shop ?? 'spati';
  }

  create() {
    this.leaving = false;
    this.zones = [];
    this.current = null;
    this.cameras.main.setBackgroundColor(0x000000);

    const interior = INTERIORS[this.shop];
    const map = this.make.tilemap({ key: interior.map });
    const tiles = map.addTilesetImage(interior.tiles, interior.tiles)!;
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
      // Remembered per placement, not by name: you can carry a bottle from the street and still find this one
      const place = `${this.shop}:${o.name}@${o.x},${o.y}`;
      if (playerState.looted.includes(place)) continue;
      pickups
        .create(o.x!, o.y!, String(prop(o, 'spriteName')))
        .setOrigin(0, 0)
        .setDepth(o.y! + o.height!)
        .setName(o.name!)
        .setData('place', place)
        .refreshBody();
    }
    this.physics.add.overlap(this.player, pickups, (_p, item) => this.pickUp(item as Phaser.Physics.Arcade.Sprite));

    this.controls = new Controls(this, 'topdown');
    this.hud = new Hud(this);
    this.messages = new MessageQueue(this);
    this.notification = new PlayerNotification(this);
    this.bubble = new SpeechBubble(this);
    this.messages.show(localise(this, `building.welcome.${this.shop}`), MessageType.MEDIUM);

    if (config.debug) this.physics.world.createDebugGraphic();
    this.cameras.main.fadeIn(300);
  }

  private placeProp(o: TiledObject, type: string) {
    const img = this.add.image(o.x!, o.y!, String(prop(o, 'spriteName'))).setOrigin(0.5, 1);
    img.setDepth(type === 'decor' ? 1 : type === 'flat' ? 2 : o.y!);
    if (o.name === 'neon_open' || o.name === 'neon_records') {
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
    if (this.current && !this.leaving && !this.bubble.active) {
      const key = `interactable.object.${this.current.id}`;
      this.notification.show(key, localise(this, key));
    } else {
      this.notification.hide();
    }
  }

  private pickUp(sprite: Phaser.Physics.Arcade.Sprite) {
    playerState.inventory.push(sprite.name);
    playerState.looted.push(sprite.getData('place'));
    this.messages.show(localise(this, `inventory.${sprite.name}`), MessageType.SMALL);
    sprite.destroy();
    if (sprite.name === 'cigarettes' && playerState.chapter === 1) {
      playerState.chapter = 2;
      this.messages.show(localise(this, 'levels.level1.chapter1.done'), MessageType.MEDIUM);
      this.messages.show(localise(this, 'levels.level1.chapter2.text'), MessageType.LARGE);
    }
  }

  // Reply from the shopkeeper (above the counter) or from the thing the player is facing
  private say(key: string, fromKeeper = false) {
    this.sayText(localise(this, key), fromKeeper);
  }

  private sayText(text: string, fromKeeper = false) {
    const { keeper } = INTERIORS[this.shop];
    const x = fromKeeper ? keeper.x : this.player.x + 48;
    const y = fromKeeper ? keeper.y : this.player.y - 6;
    this.bubble.say(text, x, y, 2800, 56, 712);
  }

  // Action button near something. Returns true when it did something.
  private interact(): boolean {
    const zone = this.current;
    if (this.leaving || !zone || !this.controls.actionJustPressed) return false;

    if (zone.id === 'exit') {
      this.leaving = true;
      this.notification.hide();
      this.player.freeze();
      this.player.body.setVelocity(0, 0);
      this.cameras.main.fadeOut(400);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Street'));
      return true;
    }
    return this.shop === 'dj' ? this.interactDj(zone.id) : this.interactSpati(zone.id);
  }

  private interactSpati(id: string): boolean {
    switch (id) {
      case 'shopkeeper': {
        const has = playerState.inventory.includes('cigarettes');
        const line = has ? 'greet_c' : Phaser.Utils.Array.GetRandom(['greet_a', 'greet_b']);
        this.say(`spati.shopkeeper.${line}`, true);
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
        this.say(`spati.${id}.look`);
        return true;
      case 'magazines':
        this.say('spati.magazines.look');
        return true;
    }
    return false;
  }

  private interactDj(id: string): boolean {
    switch (id) {
      case 'dj': {
        const line = Phaser.Utils.Array.GetRandom(['greet_a', 'greet_b', 'greet_c']);
        this.say(`dj.dj.${line}`, true);
        return true;
      }
      case 'record_bin': {
        // Digging is free; the price tag is there to show how far Pfand money goes
        const find = localise(this, `dj.record_bin.find_${Phaser.Math.Between(1, 4)}`);
        const price = (RECORD_PRICE / 100).toFixed(2);
        this.sayText(`${find} ${localise(this, 'dj.record_bin.price')} ${price} EUR`);
        return true;
      }
      case 'listening':
      case 'speaker':
      case 'sofa':
        this.say(`dj.${id}.look`);
        return true;
    }
    return false;
  }
}
