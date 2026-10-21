import * as Phaser from 'phaser';
import { config, Depth, FONT, MessageType } from '../config';
import { Hud } from '../objects/Hud';
import { Player } from '../objects/Player';
import { Controls } from '../systems/input';
import { MessageQueue, PlayerNotification, SpeechBubble } from '../systems/messages';
import { playerState } from '../systems/state';
import { localise } from '../systems/text';
import { TileLevel } from '../systems/tilelevel';

// A train is a cab, two cars and a cab facing the other way, each drawn 3x (see art/scripts/ubahn_art.py)
const CAR_W = 384;
const SCALE = 3;
const PAD = 3; // outline padding around the art
const CONSIST = [
  { kind: 'cab', flip: false },
  { kind: 'car', flip: false },
  { kind: 'car', flip: false },
  { kind: 'cab', flip: true },
] as const;
// door positions in native pixels inside a car (a cab has its first door further back)
const DOORS: Record<string, number[]> = { car: [10, 98], cab: [38, 98] };
const DOOR_W = 20;

type TrainState = 'away' | 'arriving' | 'open' | 'leaving';

interface Zone {
  type: 'exit' | 'ticket' | 'door' | 'npc';
  x: number;
  width: number;
  npc?: Phaser.GameObjects.Sprite;
}

// The Neukölln U-Bahn platform. The station comes from public/assets/tilemaps/ubahn.json (built in the Sprite
// Fusion editor); the train is an entity that drives in, opens its doors, leaves, and repeats.
export class UbahnScene extends Phaser.Scene {
  private player!: Player;
  private controls!: Controls;
  private hud!: Hud;
  private messages!: MessageQueue;
  private notification!: PlayerNotification;
  private bubble!: SpeechBubble;
  private zones: Zone[] = [];
  private fixedZones: Zone[] = [];
  private inFront: Zone | null = null;
  private cars: Phaser.GameObjects.Image[] = [];
  private train!: { x: number; stopX: number; awayX: number; leaveX: number };
  private trainState: TrainState = 'open';
  private leaving = false;
  private talking = false;

  constructor() {
    super('Ubahn');
  }

  create() {
    const { width: W, height: H } = this.scale;
    this.zones = [];
    this.fixedZones = [];
    this.leaving = false;
    this.talking = false;
    this.cars = [];

    this.add.rectangle(0, 0, W, H, 0x0d0c12).setOrigin(0, 0).setScrollFactor(0).setDepth(-1);
    const level = new TileLevel(this, 'ubahn');
    this.physics.world.setBounds(0, 0, level.widthPx, level.heightPx + 200);
    this.cameras.main.setBounds(0, 0, level.widthPx, level.heightPx).setBackgroundColor(0x0d0c12);

    for (const m of level.markersNamed('exit')) this.fixedZones.push({ type: 'exit', x: m.x, width: m.w });
    for (const m of level.markersNamed('ticket')) this.fixedZones.push({ type: 'ticket', x: m.x, width: m.w });
    for (const role of ['smoker', 'weirdo'] as const) {
      for (const m of level.markersNamed(role)) {
        const npc = this.add
          .sprite(m.x + m.w / 2 - 48, m.y - 96, 'npc', role === 'smoker' ? 0 : 1)
          .setOrigin(0, 0)
          .setDepth(Depth.NPC)
          .setName(role);
        this.fixedZones.push({ type: 'npc', x: npc.x - 50, width: npc.width + 50, npc });
      }
    }

    const stop = level.markersNamed('train')[0];
    if (stop) this.buildTrain(stop.x, stop.y + 30, level.widthPx);

    const start = level.markersNamed('start')[0];
    const startX = (start ? start.x + start.w / 2 : 150) - 48;
    this.player = new Player(this, startX, (start ? start.y : level.heightPx - 96) - 100, 'jump');
    this.player.onAction = () => this.interact();
    this.physics.add.collider(this.player, level.solid);
    this.cameras.main.startFollow(this.player, true, 0.12, 0, -48, 0).setDeadzone(W / 3, H);

    this.controls = new Controls(this, 'normal');
    this.hud = new Hud(this);
    this.messages = new MessageQueue(this);
    this.notification = new PlayerNotification(this);
    this.bubble = new SpeechBubble(this);
    this.messages.show(localise(this, 'building.ubahn.welcome'), MessageType.SMALL);

    if (config.debug) this.physics.world.createDebugGraphic();
    this.cameras.main.fadeIn(300);
  }

  // ------------------------------------------------------------------ train
  private buildTrain(stopX: number, bottomY: number, levelW: number) {
    this.train = { x: stopX, stopX, awayX: levelW + 400, leaveX: stopX - CAR_W * CONSIST.length - 400 };
    CONSIST.forEach((c, i) => {
      const img = this.add
        .image(stopX + i * CAR_W, bottomY, `ubahn_train_${c.kind}_open`)
        .setOrigin(0, 1)
        .setFlipX(c.flip)
        .setDepth(2.5);
      this.cars.push(img);
    });
    this.trainState = 'open';
    this.setDoors(true);
    this.time.delayedCall(9000, () => this.leaveStation());
  }

  private moveTrain(x: number) {
    this.train.x = x;
    this.cars.forEach((img, i) => img.setX(x + i * CAR_W));
  }

  private setDoors(open: boolean) {
    CONSIST.forEach((c, i) => this.cars[i].setTexture(`ubahn_train_${c.kind}${open ? '_open' : ''}`));
  }

  private leaveStation() {
    if (this.trainState !== 'open') return;
    this.setDoors(false);
    this.trainState = 'leaving';
    this.messages.show(localise(this, 'ubahn.closing'), MessageType.SMALL);
    this.time.delayedCall(1500, () => {
      this.cameras.main.shake(900, 0.002);
      this.tweenTrain(this.train.leaveX, 4500, 'Cubic.easeIn', () => {
        this.trainState = 'away';
        this.time.delayedCall(7000, () => this.arrive());
      });
    });
  }

  private arrive() {
    this.moveTrain(this.train.awayX);
    this.trainState = 'arriving';
    this.messages.show(localise(this, 'ubahn.announce'), MessageType.MEDIUM);
    this.cameras.main.shake(900, 0.002);
    this.tweenTrain(this.train.stopX, 5000, 'Cubic.easeOut', () => {
      this.setDoors(true);
      this.trainState = 'open';
      this.time.delayedCall(10000, () => this.leaveStation());
    });
  }

  private tweenTrain(to: number, ms: number, ease: string, done: () => void) {
    const state = { x: this.train.x };
    this.tweens.add({ targets: state, x: to, duration: ms, ease, onUpdate: () => this.moveTrain(state.x), onComplete: done });
  }

  private doorZones(): Zone[] {
    if (this.trainState !== 'open') return [];
    const zones: Zone[] = [];
    CONSIST.forEach((c, i) => {
      for (const dx of DOORS[c.kind]) {
        const native = c.flip ? 128 - dx - DOOR_W : dx; // a flipped car mirrors its doors
        zones.push({ type: 'door', x: this.train.x + i * CAR_W + (native + PAD) * SCALE, width: DOOR_W * SCALE });
      }
    });
    return zones;
  }

  // ------------------------------------------------------------ interaction
  update() {
    this.controls.update();
    this.zones = [...this.fixedZones, ...this.doorZones()];
    const x = this.player.body.center.x;
    this.inFront = this.zones.find((z) => x > z.x + 5 && x < z.x + z.width - 5) ?? null;
    if (this.inFront && !this.leaving && !this.talking && !this.bubble.active) {
      const key = this.inFront.type === 'npc' ? `interactable.npc.${this.inFront.npc!.name}.action` : `interactable.ubahn.${this.inFront.type}`;
      this.notification.show(key, localise(this, key));
    } else {
      this.notification.hide();
    }
    this.player.tick(this.controls);
    this.notification.follow(this.player.body);
    this.hud.update();
  }

  private say(text: string, x: number, y: number, ms = 2600) {
    this.bubble.say(text, x, y, ms);
  }

  private interact(): boolean {
    const zone = this.inFront;
    const p = this.player;
    if (this.leaving || !zone || !this.controls.actionJustPressed || p.mode !== 'ground') return false;
    this.notification.hide();

    switch (zone.type) {
      case 'exit':
        this.leaving = true;
        p.freeze();
        this.cameras.main.fadeOut(400);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Street'));
        return true;
      case 'ticket': {
        const euros = (playerState.money / 100).toFixed(2);
        this.say(`${localise(this, 'ubahn.ticket')} ${euros} EUR`, p.x + 48, p.y - 6, 3200);
        return true;
      }
      case 'door':
        this.board();
        return true;
      case 'npc': {
        const npc = zone.npc!;
        this.say(localise(this, `interactable.npc.${npc.name}.greet2`), npc.x + 48, npc.y - 6);
        return true;
      }
    }
    return false;
  }

  // Stepping on is as far as it goes for now: the next stop does not exist yet
  private board() {
    this.leaving = true;
    this.player.freeze();
    this.cameras.main.fadeOut(900);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      const { width: W, height: H } = this.scale;
      this.add
        .bitmapText(W / 2, H / 2 - 12, FONT, localise(this, 'ubahn.next'), MessageType.MEDIUM)
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(Depth.HUD);
      this.add
        .bitmapText(W / 2, H / 2 + 22, FONT, localise(this, 'ubahn.soon'), MessageType.SMALL)
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(Depth.HUD);
      this.cameras.main.fadeIn(300);
      this.time.delayedCall(2800, () => {
        this.cameras.main.fadeOut(400);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Street'));
      });
    });
  }
}
