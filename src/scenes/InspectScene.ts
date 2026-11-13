import * as Phaser from 'phaser';
import { FONT, MessageType } from '../config';
import { MessageQueue } from '../systems/messages';
import { PAD_KEYS, StickSteps } from '../systems/overlay';
import { INSPECT_VIEWS, type InspectSpot } from '../systems/inspect';
import { playerState } from '../systems/state';
import { localise } from '../systems/text';

const S = 3; // close-up art is exported at 3x, like everything else
const CAPTION_W = 560;
const BRACKET = 4; // corner bracket length, native pixels

// The close-up overlay (see systems/inspect.ts). It runs on top of a paused scene: the arrows (WASD, d-pad, stick) move a
// cursor between the hotspots, which describes whatever it lands on; the action button takes items out; Escape,
// Q or Backspace closes it. Clicking a hotspot uses it, clicking outside the picture closes it.
export class InspectScene extends Phaser.Scene {
  private view = '';
  private place = '';
  private from = '';
  private spots: { spot: InspectSpot; sprite?: Phaser.GameObjects.Image }[] = [];
  private selected = 0;
  private left = 0;
  private top = 0;
  private cursor!: Phaser.GameObjects.Graphics;
  private caption!: Phaser.GameObjects.BitmapText;
  private hint!: Phaser.GameObjects.BitmapText;
  private messages!: MessageQueue;
  private closing = false;
  private stick = new StickSteps();

  constructor() {
    super('Inspect');
  }

  init(data: { view: string; place: string; from: string }) {
    this.view = data.view;
    this.place = data.place;
    this.from = data.from;
  }

  create() {
    const { width: W, height: H } = this.scale;
    const def = INSPECT_VIEWS[this.view];
    this.closing = false;
    this.selected = 0;
    this.stick = new StickSteps();

    this.add.rectangle(0, 0, W, H, 0x000000, 0.78).setOrigin(0, 0).setInteractive().on('pointerdown', () => this.close());
    const bg = this.add.image(W / 2, H / 2 - 30, `inspect_${def.art}`).setInteractive();
    this.left = Math.round(bg.x - bg.width / 2);
    this.top = Math.round(bg.y - bg.height / 2);
    bg.setPosition(this.left, this.top).setOrigin(0, 0);

    this.add
      .bitmapText(W / 2, this.top - 40, FONT, localise(this, `inspect.${this.view}.title`), MessageType.MEDIUM)
      .setOrigin(0.5, 0);
    this.caption = this.add
      .bitmapText(W / 2, this.top + bg.height + 28, FONT, '', MessageType.SMALL)
      .setOrigin(0.5, 0)
      .setMaxWidth(CAPTION_W)
      .setCenterAlign();
    this.hint = this.add
      .bitmapText(W / 2, H - 40, FONT, '', MessageType.LOCK_ON_PLAYER)
      .setOrigin(0.5, 0)
      .setTint(0x807e7e);
    this.showHint(!!this.input.gamepad?.total);

    this.spots = def.spots
      .filter((spot) => !spot.item || !playerState.looted.includes(this.lootKey(spot)))
      .map((spot) => ({
        spot,
        sprite: spot.item
          ? this.add.image(this.left + spot.x * S, this.top + spot.y * S, `inspect_${def.art}_${spot.item}`).setOrigin(0, 0)
          : undefined,
      }));
    // Reading order, so the first press of an arrow goes where you'd expect
    this.spots.sort((a, b) => a.spot.y + a.spot.h / 2 - (b.spot.y + b.spot.h / 2) || a.spot.x - b.spot.x);
    this.spots.forEach((s, i) => {
      this.add
        .zone(this.left + s.spot.x * S, this.top + s.spot.y * S, s.spot.w * S, s.spot.h * S)
        .setOrigin(0, 0)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.select(i))
        .on('pointerdown', () => {
          this.select(i);
          this.use();
        });
    });

    this.cursor = this.add.graphics();
    this.tweens.add({ targets: this.cursor, alpha: 0.45, duration: 450, yoyo: true, repeat: -1 });
    this.messages = new MessageQueue(this);
    this.caption.setText(localise(this, `inspect.${this.view}.intro`));
    this.drawCursor();

    // The hint follows whatever the player last touched, so it names the buttons they're actually holding
    this.input.keyboard!.on('keydown', (e: KeyboardEvent) => {
      this.showHint(false);
      this.onKey(e.code);
    });
    this.input.gamepad?.on('down', (_pad: Phaser.Input.Gamepad.Gamepad, button: Phaser.Input.Gamepad.Button) => {
      this.showHint(true);
      this.onKey(PAD_KEYS[button.index] ?? '');
    });
    // Fade the overlay itself; a camera fade would go through black and hide the scene underneath
    this.cameras.main.setAlpha(0);
    this.tweens.add({ targets: this.cameras.main, alpha: 1, duration: 150 });
  }

  update() {
    if (this.closing) return;
    const step = this.stick.poll(this.input.gamepad?.pad1);
    if (!step) return;
    this.showHint(true);
    this.move(...step);
  }

  private showHint(pad: boolean) {
    this.hint.setText(localise(this, pad ? 'inspect.hint_pad' : 'inspect.hint'));
  }

  private onKey(code: string) {
    if (this.closing) return;
    switch (code) {
      case 'Escape':
      case 'KeyQ':
      case 'Backspace':
        return this.close();
      case 'KeyE':
      case 'Space':
      case 'Enter':
        return this.use();
      case 'ArrowLeft':
      case 'KeyA':
        return this.move(-1, 0);
      case 'ArrowRight':
      case 'KeyD':
        return this.move(1, 0);
      case 'ArrowUp':
      case 'KeyW':
        return this.move(0, -1);
      case 'ArrowDown':
      case 'KeyS':
        return this.move(0, 1);
    }
  }

  private lootKey(spot: InspectSpot) {
    return `${this.place}:${spot.id}`;
  }

  // Jump to the nearest hotspot in that direction, preferring ones straight ahead over ones off to the side
  private move(dx: number, dy: number) {
    const here = this.spots[this.selected];
    if (!here) return;
    const centre = (s: InspectSpot) => ({ x: s.x + s.w / 2, y: s.y + s.h / 2 });
    const from = centre(here.spot);
    let best = -1;
    let bestScore = Infinity;
    this.spots.forEach(({ spot }, i) => {
      const c = centre(spot);
      const ahead = (c.x - from.x) * dx + (c.y - from.y) * dy;
      if (i === this.selected || ahead <= 0) return;
      const aside = Math.abs((c.x - from.x) * dy) + Math.abs((c.y - from.y) * dx);
      const score = ahead + aside * 2;
      if (score < bestScore) [best, bestScore] = [i, score];
    });
    if (best >= 0) this.select(best);
  }

  private select(i: number) {
    if (this.closing || !this.spots[i]) return;
    this.selected = i;
    this.caption.setText(localise(this, `inspect.${this.view}.${this.spots[i].spot.id}.look`));
    this.drawCursor();
  }

  private use() {
    const entry = this.spots[this.selected];
    if (!entry) return;
    const { spot, sprite } = entry;
    if (!spot.item) {
      const key = `inspect.${this.view}.${spot.id}.use`;
      const text = localise(this, key);
      this.caption.setText(text === key ? localise(this, 'inspect.nothing') : text);
      return;
    }

    playerState.inventory.push(spot.item);
    playerState.looted.push(this.lootKey(spot));
    this.messages.show(localise(this, `inventory.${spot.item}`), MessageType.SMALL);
    this.caption.setText(localise(this, `inspect.${this.view}.${spot.id}.take`));
    if (sprite) this.tweens.add({ targets: sprite, y: sprite.y - 30, alpha: 0, duration: 350, onComplete: () => sprite.destroy() });
    this.spots.splice(this.selected, 1);
    this.selected = Math.min(this.selected, this.spots.length - 1);
    this.drawCursor();
  }

  // Pixel corner brackets around the selected hotspot, with a dark shadow so they show on light rubbish too
  private drawCursor() {
    const g = this.cursor.clear();
    const entry = this.spots[this.selected];
    if (!entry) return;
    const { x, y, w, h } = entry.spot;
    const x0 = this.left + (x - 1) * S;
    const y0 = this.top + (y - 1) * S;
    const x1 = this.left + (x + w + 1) * S;
    const y1 = this.top + (y + h + 1) * S;
    const arm = BRACKET * S;
    for (const [colour, o] of [[0x121114, S], [0xf0ece0, 0]] as const) {
      g.fillStyle(colour);
      for (const [cx, cy, right, down] of [[x0, y0, true, true], [x1, y0, false, true], [x0, y1, true, false], [x1, y1, false, false]] as const) {
        const hx = right ? cx : cx - arm;
        const vy = down ? cy : cy - arm;
        g.fillRect(hx + o, (down ? cy : cy - S) + o, arm, S);
        g.fillRect((right ? cx : cx - S) + o, vy + o, S, arm);
      }
    }
  }

  private close() {
    if (this.closing) return;
    this.closing = true;
    this.tweens.add({
      targets: this.cameras.main,
      alpha: 0,
      duration: 120,
      onComplete: () => {
        this.scene.resume(this.from);
        this.scene.stop();
      },
    });
  }
}
