import * as Phaser from 'phaser';
import { config, Depth, MessageType } from '../config';
import { Hud } from '../objects/Hud';
import { Player } from '../objects/Player';
import { Controls } from '../systems/input';
import { MessageQueue, PlayerNotification, SpeechBubble } from '../systems/messages';
import { playerState, resetPlayer, type District } from '../systems/state';
import { localise } from '../systems/text';
import { TileLevel } from '../systems/tilelevel';
import { Weather } from '../systems/weather';

const NPC_ROLES = ['smoker', 'weirdo', 'cop'] as const;
let introShown = false;

// Each district is a street level; Friedrichshain is reached by U-Bahn and has the Berghain
const LEVEL_KEY: Record<District, string> = { neukoelln: 'street', fhain: 'fhain' };

interface Interactable {
  type: string; // 'object.door' | 'object.ubahn' | 'object.cat' | 'object.berghain' | 'npc.<role>'
  x: number;
  width: number;
  npc?: Phaser.GameObjects.Sprite;
  at?: Phaser.GameObjects.Sprite;
}

// A street: Neukölln (public/assets/tilemaps/street.json) or Friedrichshain (fhain.json), both built in the
// Sprite Fusion editor or by art/scripts/build_*_map.py; marker tiles in the "markers" layer place the player,
// doors, NPCs...
export class StreetScene extends Phaser.Scene {
  private player!: Player;
  private controls!: Controls;
  private hud!: Hud;
  private messages!: MessageQueue;
  private notification!: PlayerNotification;
  private bubble!: SpeechBubble;
  weather!: Weather;
  private interactables: Interactable[] = [];
  private inFrontOf: Interactable | null = null;
  private talking = false;
  private startX = 0;
  private district: District = 'neukoelln';

  constructor() {
    super('Street');
  }

  init(data: { district?: District }) {
    this.district = data?.district ?? 'neukoelln';
  }

  create() {
    const { width: W, height: H } = this.scale;
    const home = this.district === 'neukoelln';
    this.interactables = [];
    this.talking = false;

    // Sky: OG's gradient from black to a dark orange, fixed to the camera
    this.add
      .graphics()
      .fillGradientStyle(0x000000, 0x000000, 0x5e260a, 0x5e260a, 1)
      .fillRect(0, 0, W, H)
      .setScrollFactor(0)
      .setDepth(-1);

    const level = new TileLevel(this, LEVEL_KEY[this.district]);
    // Traffic lights run the German cycle: red, red+amber, green, amber (frames drawn by art/scripts/street_props.py)
    level.animate(this, [
      { block: 'ampel_red', ms: 6000 },
      { block: 'ampel_redamber', ms: 1200 },
      { block: 'ampel_green', ms: 6000 },
      { block: 'ampel_amber', ms: 2000 },
    ]);
    this.physics.world.setBounds(0, 0, level.widthPx, level.heightPx + 200);
    this.cameras.main.setBounds(0, 0, level.widthPx, level.heightPx).setBackgroundColor(0x000000);

    for (const name of ['door', 'djdoor', 'ubahn', 'berghain']) for (const m of level.markersNamed(name)) {
      this.interactables.push({ type: `object.${m.name}`, x: m.x, width: m.w });
    }
    for (const role of NPC_ROLES) {
      for (const m of level.markersNamed(role)) {
        const npc = this.add
          .sprite(m.x + m.w / 2 - 48, m.y - 96, 'npc', NPC_ROLES.indexOf(role))
          .setOrigin(0, 0)
          .setDepth(Depth.NPC)
          .setName(role);
        this.interactables.push({ type: `npc.${role}`, x: npc.x - 50, width: npc.width + 50, npc });
      }
    }
    for (const m of level.markersNamed('cat')) {
      const cat = this.add.sprite(m.x + m.w / 2, m.y, 'spati_cat').setOrigin(0.5, 1).setDepth(Depth.NPC);
      this.interactables.push({ type: 'object.cat', x: cat.x - 50, width: 100, at: cat });
    }

    const start = level.markersNamed('start')[0];
    this.startX = (start ? start.x + start.w / 2 : 150) - 48;
    const spawnY = (start ? start.y : level.heightPx - 96) - 96 - 4;
    // Friedrichshain is only reached by U-Bahn, and its start marker is at the top of the stairs
    this.player = new Player(this, home ? (playerState.streetX ?? this.startX) : this.startX, spawnY, 'jump');
    this.player.onAction = () => this.interact();
    this.physics.add.collider(this.player, level.solid);

    // Burning bins hurt when you stand on them
    for (const m of level.markersNamed('fire')) {
      const bin = this.physics.add.staticSprite(m.x + 12, m.y - 48, 'fire_bin').setOrigin(0, 0).setDepth(Depth.HAZARD);
      bin.refreshBody();
      (bin.body as Phaser.Physics.Arcade.StaticBody).setSize(22, 33, false).setOffset(1, 15);
      bin.play('burn');
      this.physics.add.collider(this.player, bin, () => {
        if (this.player.body.touching.down) playerState.health -= 2;
      });
    }

    this.cameras.main.startFollow(this.player, true, 0.12, 0, -48, 0).setDeadzone(W / 3, H);

    this.controls = new Controls(this, 'normal');
    this.hud = new Hud(this);
    this.messages = new MessageQueue(this);
    this.notification = new PlayerNotification(this);
    this.bubble = new SpeechBubble(this);
    this.weather = new Weather(this, level, this.messages);

    if (!home) {
      this.messages.show(localise(this, 'levels.fhain.name'), MessageType.MEDIUM);
    } else if (!introShown) {
      introShown = true;
      this.messages.show(localise(this, 'welcome'), MessageType.SMALL);
      this.messages.show(localise(this, 'levels.level1.name'), MessageType.MEDIUM);
      this.messages.show(localise(this, 'levels.level1.chapter1.text'), MessageType.LARGE);
    }

    if (config.debug) this.physics.world.createDebugGraphic();
    this.cameras.main.fadeIn(300);
  }

  update(_time: number, delta: number) {
    this.controls.update();
    this.updateInteractionPrompt();
    this.player.tick(this.controls);
    this.weather.update(delta);
    this.notification.follow(this.player.body);

    if (this.player.body.y > this.scale.height + 100) playerState.health = 0;
    if (playerState.health <= 0 && playerState.isAlive) this.die();
    this.hud.update();
  }

  // OG player_ground.checkForInteractionWithBackdropObject
  private updateInteractionPrompt() {
    const x = this.player.body.center.x;
    this.inFrontOf = this.interactables.find((o) => x > o.x + 5 && x < o.x + o.width - 5) ?? null;
    if (this.talking || this.bubble.active) return;
    if (this.inFrontOf) {
      const key = this.inFrontOf.type.startsWith('npc')
        ? `interactable.${this.inFrontOf.type}.action`
        : `interactable.${this.inFrontOf.type}`;
      this.notification.show(key, localise(this, key));
    } else {
      this.notification.hide();
    }
  }

  private say(key: string, who: Phaser.GameObjects.Sprite, ms: number) {
    this.bubble.say(localise(this, key), who.x + who.displayWidth * (who.originX === 0.5 ? 0 : 0.5), who.y - (who.originY === 1 ? who.displayHeight : 0) - 6, ms);
  }

  // OG player_interact_with_backdrop command
  private interact(): boolean {
    const target = this.inFrontOf;
    if (!target || !this.controls.actionJustPressed || this.player.mode !== 'ground') return false;
    this.notification.hide();
    const p = this.player;

    if (target.type === 'object.door' || target.type === 'object.djdoor' || target.type === 'object.ubahn') {
      const ubahn = target.type === 'object.ubahn';
      p.freeze();
      p.play(ubahn ? 'walk_down' : 'go_inside');
      if (this.district === 'neukoelln') playerState.streetX = p.x;
      this.tweens.add({
        targets: p,
        alpha: 0,
        x: ubahn ? p.x + 20 : p.x,
        delay: 250,
        duration: 500,
        onComplete: () =>
          ubahn
            ? this.scene.start('Ubahn', { station: this.district })
            : this.scene.start('Building', { shop: target.type === 'object.djdoor' ? 'dj' : 'spati' }),
      });
      return true;
    }

    // Not tonight: the club can't be entered yet
    if (target.type === 'object.berghain') {
      this.bubble.say(localise(this, 'berghain.bouncer'), target.x + target.width / 2 + 60, p.y - 10, 2600);
      return true;
    }

    if (target.at) {
      this.say('spati.cat.purr', target.at, 2000);
      return true;
    }

    if (target.npc) {
      const npc = target.npc;
      const role = npc.name;
      p.freeze();
      p.setFrame(40);
      this.talking = true;
      this.say(`interactable.npc.${role}.greet1`, p, 1500);
      this.time.delayedCall(1600, () => {
        if (role === 'cop') npc.setFrame(3);
        this.say(`interactable.npc.${role}.reply1`, npc, 2000);
      });
      this.time.delayedCall(3800, () => {
        this.talking = false;
        p.mode = 'ground';
      });
      return true;
    }
    return false;
  }

  // OG player_death_command
  private die() {
    playerState.isAlive = false;
    this.messages.show(localise(this, 'game.over'), MessageType.MEDIUM);
    this.player.freeze();
    this.tweens.add({
      targets: this.player,
      alpha: 0,
      duration: 250,
      onComplete: () => {
        this.player.body.reset(this.startX, 0);
        this.player.mode = 'jump';
        resetPlayer();
        this.tweens.add({ targets: this.player, alpha: 1, delay: 250, duration: 500 });
      },
    });
  }
}
