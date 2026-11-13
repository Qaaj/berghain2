import * as Phaser from 'phaser';
import { Depth, MessageType } from '../config';
import type { Player } from '../objects/Player';
import type { MessageQueue } from './messages';
import { playerState, type WeatherKind } from './state';
import { localise } from './text';
import type { TileLevel } from './tilelevel';

const PX = 3; // one native pixel at the game's 3x scale
const KINDS: WeatherKind[] = ['clear', 'rain', 'snow', 'wind'];
const SPELL_MS = { min: 60_000, max: 120_000 };
// Steady wind (px/s, before gusts) for each kind; the direction is rolled per spell
const BASE_WIND: Record<WeatherKind, number> = { clear: 10, rain: 50, snow: 30, wind: 170 };
const TINT: Record<WeatherKind, { color: number; alpha: number }> = {
  clear: { color: 0x000000, alpha: 0 },
  rain: { color: 0x1a2b33, alpha: 0.35 }, // P.B3
  snow: { color: 0xb0bac8, alpha: 0.12 }, // P.B4
  wind: { color: 0x000000, alpha: 0.08 },
};
// How much of the wind reaches the player while walking or in the air
const PUSH = 0.5;

// A handful of 1-3 native pixel shapes, drawn here rather than through the art pipeline because they are too
// small to be worth an .aseprite each. Colours come from spriteart.P.
function makeTextures(scene: Phaser.Scene) {
  if (scene.textures.exists('wx_rain')) return;
  const g = scene.make.graphics({}, false);
  const tex = (key: string, w: number, h: number, draw: () => void) => {
    g.clear();
    draw();
    g.generateTexture(key, w * PX, h * PX);
  };
  const px = (color: number, x: number, y: number, w = 1, h = 1, alpha = 1) =>
    g.fillStyle(color, alpha).fillRect(x * PX, y * PX, w * PX, h * PX);

  tex('wx_rain', 1, 5, () => {
    px(0xb0bac8, 0, 0, 1, 2, 0.35);
    px(0xb0bac8, 0, 2, 1, 3, 0.8);
  });
  tex('wx_splash', 1, 1, () => px(0xb0bac8, 0, 0));
  // frames: big flake | small flake
  tex('wx_snow', 3, 2, () => {
    px(0xf0ece0, 0, 0, 2, 2);
    px(0xdcd6c6, 2, 0);
  });
  // frames: leaf | flyer (a bit of torn paper)
  tex('wx_debris', 6, 2, () => {
    px(0x8a6240, 0, 0, 2, 1);
    px(0xc46927, 1, 1, 2, 1);
    px(0xdcd6c6, 3, 0, 3, 2);
    px(0x807e7e, 4, 1);
  });
  tex('wx_gust', 10, 1, () => {
    px(0xdcd6c6, 0, 0, 3, 1, 0.3);
    px(0xdcd6c6, 3, 0, 7, 1, 0.55);
  });
  g.destroy();

  const add = (key: string, frames: [string, number, number, number][]) => {
    const t = scene.textures.get(key);
    for (const [name, x, w, h] of frames) t.add(name, 0, x * PX, 0, w * PX, h * PX);
  };
  add('wx_snow', [['big', 0, 2, 2], ['small', 2, 1, 1]]);
  add('wx_debris', [['leaf', 0, 3, 2], ['flyer', 3, 3, 2]]);
}

// Street weather: clear, rain, snow or wind. Particles live in world space (emitters at 0,0) but spawn across
// whatever the camera shows, so they stay put when the camera scrolls. The weather turns by itself every minute
// or two of street time and is remembered in playerState while you're indoors.
export class Weather {
  kind: WeatherKind = 'clear';
  /** Current wind in px/s, positive blows to the right. */
  wind = 0;
  private dir = 1;
  private t = 0;
  private nextFlash = 0;
  private ground: number[] = [];
  private tileW = 48;
  private tint: Phaser.GameObjects.Rectangle;
  private rain: Phaser.GameObjects.Particles.ParticleEmitter;
  private splash: Phaser.GameObjects.Particles.ParticleEmitter;
  private snow: Phaser.GameObjects.Particles.ParticleEmitter;
  private gusts: Phaser.GameObjects.Particles.ParticleEmitter;
  private debris: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(
    private scene: Phaser.Scene,
    level: TileLevel,
    private messages: MessageQueue,
  ) {
    makeTextures(scene);
    this.measureGround(level);
    const cam = scene.cameras.main;
    const { width: W } = scene.scale;

    // Spawn along a line above the view, wide enough that slanted rain still covers the upwind edge
    const sky = (y: number) => ({
      getRandomPoint: (p: Phaser.Types.Math.Vector2Like) => {
        p.x = cam.scrollX - 200 + Math.random() * (W + 400);
        p.y = y;
      },
    });
    // Spawn just off the upwind edge of the view, between the rooftops and the pavement
    const upwind = (minHeight: number) => ({
      getRandomPoint: (p: Phaser.Types.Math.Vector2Like) => {
        p.x = this.wind >= 0 ? cam.scrollX - 40 : cam.scrollX + W + 40;
        const g = this.groundAt(p.x < 0 ? 0 : p.x);
        p.y = g - 6 - Math.random() * (g - minHeight);
      },
    });
    const landed = { type: 'onEnter' as const, source: { contains: (x: number, y: number) => y >= this.groundAt(x) } };

    this.splash = scene.add.particles(0, 0, 'wx_splash', {
      emitting: false,
      speedX: { min: -50, max: 50 },
      speedY: { min: -170, max: -70 },
      gravityY: 900,
      lifespan: 220,
    });
    this.rain = scene.add.particles(0, 0, 'wx_rain', {
      emitting: false,
      emitZone: { type: 'random', source: sky(-20) },
      deathZone: landed,
      speedY: { min: 820, max: 980 },
      speedX: { onEmit: () => this.wind * 1.6 },
      rotate: { onEmit: () => -Phaser.Math.RadToDeg(Math.atan2(this.wind * 1.6, 900)) },
      alpha: { min: 0.45, max: 1 },
      lifespan: 2000,
      frequency: 10,
      quantity: 4,
      deathCallback: (p: Phaser.GameObjects.Particles.Particle) => {
        if (Math.random() < 0.5) this.splash.emitParticleAt(p.x, this.groundAt(p.x) - 1, 2);
      },
    });
    this.snow = scene.add.particles(0, 0, 'wx_snow', {
      emitting: false,
      frame: ['big', 'small', 'small'],
      emitZone: { type: 'random', source: sky(-10) },
      deathZone: landed,
      speedY: { min: 45, max: 110 },
      speedX: { onEmit: () => this.wind * 0.9 + Phaser.Math.Between(-20, 20) },
      lifespan: 20_000,
      frequency: 40,
      quantity: 2,
    });
    this.gusts = scene.add.particles(0, 0, 'wx_gust', {
      emitting: false,
      emitZone: { type: 'random', source: upwind(200) },
      speedX: { onEmit: () => this.wind * Phaser.Math.FloatBetween(4, 6) },
      speedY: { min: -8, max: 8 },
      alpha: { start: 1, end: 0 },
      lifespan: 1800,
      frequency: 60,
    });
    this.debris = scene.add.particles(0, 0, 'wx_debris', {
      emitting: false,
      frame: ['leaf', 'leaf', 'flyer'],
      emitZone: { type: 'random', source: upwind(380) },
      deathZone: landed,
      speedX: { onEmit: () => this.wind * Phaser.Math.FloatBetween(1.8, 3) },
      speedY: { min: -90, max: 30 },
      gravityY: 70,
      rotate: { start: 0, end: 540 },
      lifespan: 6000,
      frequency: 90,
    });
    for (const e of [this.splash, this.rain, this.snow, this.gusts, this.debris]) e.setDepth(Depth.WEATHER);

    this.tint = scene.add
      .rectangle(0, 0, W, scene.scale.height, 0x000000, 1)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setAlpha(0)
      .setDepth(Depth.WEATHER - 1);

    if (!playerState.weather) {
      playerState.weather = Phaser.Utils.Array.GetRandom(KINDS);
      playerState.weatherLeft = Phaser.Math.Between(SPELL_MS.min, SPELL_MS.max);
    }
    this.set(playerState.weather, false);
  }

  /** Switch the weather now; `announce` shows the change as a title message and fades it in. */
  set(kind: WeatherKind, announce = true) {
    this.kind = kind;
    playerState.weather = kind;
    this.dir = Math.random() < 0.5 ? -1 : 1;
    this.nextFlash = this.t + Phaser.Math.Between(4000, 12000);

    const on = (e: Phaser.GameObjects.Particles.ParticleEmitter, active: boolean) => {
      if (active && !e.emitting) e.start();
      if (!active && e.emitting) e.stop(); // particles already in the air finish their fall
    };
    on(this.rain, kind === 'rain');
    on(this.snow, kind === 'snow');
    on(this.gusts, kind === 'wind');
    on(this.debris, kind === 'wind');

    const tint = TINT[kind];
    this.scene.tweens.killTweensOf(this.tint);
    if (tint.alpha > 0) this.tint.setFillStyle(tint.color, 1);
    this.scene.tweens.add({ targets: this.tint, alpha: tint.alpha, duration: announce ? 3000 : 0 });
    if (announce) this.messages.show(localise(this.scene, `weather.${kind}`), MessageType.SMALL);
  }

  update(delta: number) {
    this.t += delta;
    // Two slow sines make irregular gusts between roughly 20% and 120% of the base wind
    const gust = 0.7 + 0.3 * Math.sin(this.t / 1700) + 0.2 * Math.sin(this.t / 530);
    this.wind = this.dir * BASE_WIND[this.kind] * gust;

    if (this.kind === 'rain' && this.t >= this.nextFlash) {
      this.nextFlash = this.t + Phaser.Math.Between(8000, 20000);
      const cam = this.scene.cameras.main;
      cam.flash(90, 190, 200, 225);
      this.scene.time.delayedCall(160, () => cam.flash(140, 150, 160, 190));
    }

    playerState.weatherLeft -= delta;
    if (playerState.weatherLeft <= 0) {
      playerState.weatherLeft = Phaser.Math.Between(SPELL_MS.min, SPELL_MS.max);
      this.set(Phaser.Utils.Array.GetRandom(KINDS.filter((k) => k !== this.kind)));
    }
  }

  /** Lean on the player: walking into the wind is slower, jumps drift downwind. Call after Player.tick(). */
  push(player: Player) {
    const moving = player.mode === 'jump' || (player.mode === 'ground' && player.body.velocity.x !== 0);
    if (moving) player.body.velocity.x += this.wind * PUSH;
  }

  // Top of the solid tiles per column, so rain splashes and snow settles on the pavement (and on platforms)
  private measureGround(level: TileLevel) {
    const { map } = level;
    this.tileW = map.tileWidth;
    for (let col = 0; col < map.width; col++) {
      let top = level.heightPx;
      for (const layer of level.solid) {
        for (let row = 0; row < map.height; row++) {
          if (layer.getTileAt(col, row)) {
            top = Math.min(top, row * map.tileHeight);
            break;
          }
        }
      }
      this.ground.push(top);
    }
  }

  private groundAt(x: number) {
    const col = Phaser.Math.Clamp(Math.floor(x / this.tileW), 0, this.ground.length - 1);
    return this.ground[col];
  }
}
