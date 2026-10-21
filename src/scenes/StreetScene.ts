import * as Phaser from 'phaser';
import { config, Depth, GROUND_HEIGHT, LEVEL_WIDTH, MessageType } from '../config';
import { createBackdrop, type Interactable } from '../objects/Backdrop';
import { Hud } from '../objects/Hud';
import { Player } from '../objects/Player';
import { Controls } from '../systems/input';
import { MessageQueue, PlayerNotification } from '../systems/messages';
import { rnd } from '../systems/random';
import { playerState, resetPlayer } from '../systems/state';
import { localise } from '../systems/text';

const NPC_TYPES = ['smoker', 'weirdo', 'cop'] as const;
let introShown = false;

// Port of OG app_playing state + create_world_command: the Neukölln street
export class StreetScene extends Phaser.Scene {
  private player!: Player;
  private controls!: Controls;
  private hud!: Hud;
  private messages!: MessageQueue;
  private notification!: PlayerNotification;
  private interactables: Interactable[] = [];
  private inFrontOf: Interactable | null = null;
  private talking = false;

  constructor() {
    super('Street');
  }

  create() {
    const { width: W, height: H } = this.scale;
    const groundY = H - GROUND_HEIGHT;
    this.interactables = [];
    this.talking = false;
    rnd.reset(); // same seed every time, so the street looks the same when you come back

    this.physics.world.setBounds(0, 0, LEVEL_WIDTH, H + 200);
    this.cameras.main.setBounds(0, 0, LEVEL_WIDTH, H).setBackgroundColor(0x333333);

    // Sky: OG's gradient reaches the orange only halfway, so the bottom is dark red
    this.add
      .graphics()
      .fillGradientStyle(0x000000, 0x000000, 0x5e260a, 0x5e260a, 1)
      .fillRect(0, 0, W, H)
      .setScrollFactor(0)
      .setDepth(Depth.SKY);
    this.add.image(W - 200, 50, 'moon').setOrigin(0, 0).setDepth(Depth.MOON);

    const environment = this.physics.add.staticGroup();
    for (let i = 0; i < LEVEL_WIDTH / 128; i++) {
      environment
        .create(i * 128, groundY, 'ground', Math.floor(Math.random() * 3))
        .setOrigin(0, 0)
        .setDepth(Depth.ENVIRONMENT)
        .refreshBody();
    }
    createBackdrop(this, environment, this.interactables);

    // U-Bahn entrance
    const ubahn = this.add.image(W - 200, groundY - 192, 'ubahn').setOrigin(0, 0).setDepth(Depth.PLACE);
    this.interactables.push({ type: 'object.ubahn', x: ubahn.x + 20, width: ubahn.width - 100 });

    // NPC with a random role
    const role = NPC_TYPES[Math.floor(Math.random() * NPC_TYPES.length)];
    const npc = this.add
      .sprite(W - 370, groundY - 96, 'npc', NPC_TYPES.indexOf(role))
      .setOrigin(0, 0)
      .setDepth(Depth.NPC)
      .setName(role);
    this.interactables.push({ type: `npc.${role}`, x: npc.x - 50, width: npc.width + 50, npc });

    this.player = new Player(this, playerState.streetX, groundY - 100, 'jump');
    this.player.onAction = () => this.interact();
    this.physics.add.collider(this.player, environment);

    // Burning bin: hurts when you stand on it
    const bin = this.physics.add.staticSprite(W - 500, groundY - 48, 'fire_bin').setOrigin(0, 0).setDepth(Depth.HAZARD);
    bin.refreshBody();
    (bin.body as Phaser.Physics.Arcade.StaticBody).setSize(22, 33, false).setOffset(1, 15);
    bin.play('burn');
    this.physics.add.collider(this.player, bin, () => {
      if (this.player.body.touching.down) playerState.health -= 2;
    });

    this.cameras.main.startFollow(this.player, true, 0.12, 0, -48, 0).setDeadzone(W / 3, H);

    this.controls = new Controls(this, 'normal');
    this.hud = new Hud(this);
    this.messages = new MessageQueue(this);
    this.notification = new PlayerNotification(this);

    if (!introShown) {
      introShown = true;
      this.messages.show(localise(this, 'welcome'), MessageType.SMALL);
      this.messages.show(localise(this, 'levels.level1.name'), MessageType.MEDIUM);
      this.messages.show(localise(this, 'levels.level1.chapter1.text'), MessageType.LARGE);
    }

    if (config.debug) this.physics.world.createDebugGraphic();
    this.cameras.main.fadeIn(300);
  }

  update() {
    this.controls.update();
    this.updateInteractionPrompt();
    this.player.tick(this.controls);
    this.notification.follow(this.player.body);

    if (this.player.body.y > this.scale.height) playerState.health = 0;
    if (playerState.health <= 0 && playerState.isAlive) this.die();
    this.hud.update();
  }

  // OG player_ground.checkForInteractionWithBackdropObject
  private updateInteractionPrompt() {
    const x = this.player.body.center.x;
    this.inFrontOf = this.interactables.find((o) => x > o.x + 5 && x < o.x + o.width - 5) ?? null;
    if (this.talking) return;
    if (this.inFrontOf) {
      const key = this.inFrontOf.type.startsWith('npc')
        ? `interactable.${this.inFrontOf.type}.action`
        : `interactable.${this.inFrontOf.type}`;
      this.notification.show(key, localise(this, key));
    } else {
      this.notification.hide();
    }
  }

  // OG player_interact_with_backdrop command
  private interact(): boolean {
    const target = this.inFrontOf;
    if (!target || !this.controls.actionJustPressed || this.player.mode !== 'ground') return false;
    this.notification.hide();
    const p = this.player;

    if (target.type === 'object.door' || target.type === 'object.ubahn') {
      const ubahn = target.type === 'object.ubahn';
      p.freeze();
      p.play(ubahn ? 'walk_down' : 'go_inside');
      playerState.streetX = p.x;
      this.tweens.add({
        targets: p,
        alpha: 0,
        x: ubahn ? p.x + 20 : p.x,
        delay: 250,
        duration: 500,
        onComplete: () => this.scene.start(ubahn ? 'Ubahn' : 'Building'),
      });
      return true;
    }

    if (target.npc) {
      const role = target.npc.name;
      p.freeze();
      p.setFrame(40);
      this.talking = true;
      this.time.delayedCall(1000, () => {
        const reply = localise(this, `interactable.npc.${role}.reply1`);
        if (role === 'cop') target.npc!.setFrame(3);
        this.messages.show(reply, MessageType.MEDIUM);
        this.notification.show('greet', localise(this, `interactable.npc.${role}.greet1`), 2000);
        this.time.delayedCall(2000, () => (this.talking = false));
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
        this.player.setPosition(100, 0);
        this.player.body.reset(100, 0);
        this.player.mode = 'jump';
        resetPlayer();
        this.tweens.add({ targets: this.player, alpha: 1, delay: 250, duration: 500 });
      },
    });
  }
}
