import * as Phaser from 'phaser';
import { Depth, FONT } from '../config';
import { playerState } from '../systems/state';

// Drawn on the same 3x native pixel grid as the sprites, so the HUD reads as pixel art too.
// Colours come from the shared art palette (art/scripts/spriteart.py P).
const S = 3;
const C = {
  K0: 0x121114, K2: 0x3c3a3a, K3: 0x5b5a5a, K4: 0x807e7e,
  W2: 0xf0ece0,
  R2: 0x8f1c26, R3: 0xd93532,
  O1: 0xc46927, O3: 0xe08a3c,
  Y2: 0xaaaa38, Y3: 0xd2d631,
  G1: 0x127a2a, G2: 0x2fa84a, G4: 0x8fd18a,
};

const HEART = ['.rr.rr.', 'rwrrrrr', 'rrrrrrd', '.rrrrd.', '..rrd..', '...d...'];
const COIN = ['..ooo..', '.oyyyo.', 'oylyyyo', 'oylyyyo', 'oyyyyyo', '.oyyyo.', '..ooo..'];
// 3x5 letters from the art toolkit's font, so the label sits on the 3x grid
const EUR = ['ggg.g.g.gg.', 'g...g.g.g.g', 'gg..g.g.gg.', 'g...g.g.g.g', 'ggg.ggg.g.g'];
// 3x5 digits from the same font, for the stack count on an item slot
const DIGITS = [
  ['www', 'w.w', 'w.w', 'w.w', 'www'], ['.w.', 'ww.', '.w.', '.w.', 'www'],
  ['www', '..w', 'www', 'w..', 'www'], ['www', '..w', '.ww', '..w', 'www'],
  ['w.w', 'w.w', 'www', '..w', '..w'], ['www', 'w..', 'www', '..w', 'www'],
  ['.ww', 'w..', 'www', 'w.w', 'www'], ['www', '..w', '.w.', '.w.', '.w.'],
  ['www', 'w.w', 'www', 'w.w', 'www'], ['www', 'w.w', 'www', '..w', 'ww.'],
];
const ICON_COLOURS: Record<string, number> = {
  r: C.R3, d: C.R2, w: C.W2, o: C.O1, y: C.Y3, l: C.W2, g: C.K4,
};

// Layout in native pixels. No backing panel, so icons and text carry a 1px dark drop shadow
// to stay readable on both the night sky and the light Späti walls.
const MARGIN = 4;
const HEART_W = 7;
const BAR = { x: HEART_W + 2, w: 60, h: 8 };
const COIN_W = 7;
const EUR_W = EUR[0].length;
// Square item slots, big enough for the tallest pickup (the bottle, 17 native) without scaling
const SLOT = { size: 21, gap: 2, count: 3 };
// Stack-count badge: a 9px round pill (outline included) hanging off the slot's top-right corner
const BADGE = { h: 9, overhang: 2 };
// The bitmap font is 32px with 4px font pixels; at 16px they are a whole 2px and the glyphs
// are about as tall as the 3x5 "EUR". Its advance (38) is wider than a glyph cell (32), so trim it.
const TEXT_SIZE = 16;
const TEXT_SPACING = -2;
// Glyphs are ~15.5px tall; this offset puts their middle on the coin's middle
const TEXT_TOP = 2;
const TEXT_SHADOW = 2;

export class Hud {
  private scene: Phaser.Scene;
  private right: number;
  private bar: Phaser.GameObjects.Graphics;
  private wallet: Phaser.GameObjects.Graphics;
  private money: Phaser.GameObjects.BitmapText;
  private moneyShadow: Phaser.GameObjects.BitmapText;
  private items: Phaser.GameObjects.GameObject[] = [];
  private shownHealth = -1;
  private shownMoney = -1;
  private shownItems = '';

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.right = scene.scale.width - MARGIN * S;

    // Top-left: heart and health bar
    const heart = this.fixed(scene.add.graphics()).setPosition(MARGIN * S, MARGIN * S);
    this.icon(heart, HEART, 0, 1);
    this.bar = this.fixed(scene.add.graphics()).setPosition((MARGIN + BAR.x) * S, MARGIN * S);

    // Top-right: coin, amount, "EUR"; laid out right-aligned whenever the amount changes
    this.wallet = this.fixed(scene.add.graphics());
    this.moneyShadow = this.fixed(scene.add.bitmapText(0, 0, FONT, '', TEXT_SIZE))
      .setLetterSpacing(TEXT_SPACING)
      .setTint(C.K0);
    this.money = this.fixed(scene.add.bitmapText(0, 0, FONT, '', TEXT_SIZE))
      .setLetterSpacing(TEXT_SPACING)
      .setTint(C.W2);

    // Bottom centre: item slots
    const slots = this.fixed(scene.add.graphics()).setPosition(this.slotsX(), this.slotsY());
    for (let i = 0; i < SLOT.count; i++) {
      const x = i * (SLOT.size + SLOT.gap);
      this.rect(slots, x, 0, SLOT.size, SLOT.size, C.K0, 0.85);
      this.rect(slots, x + 1, 1, SLOT.size - 2, SLOT.size - 2, C.K2, 0.6);
      this.rect(slots, x + 1, SLOT.size - 2, SLOT.size - 2, 1, C.K3, 0.6);
    }

    this.update();
  }

  update() {
    const health = Math.max(0, Math.min(100, playerState.health));
    if (health !== this.shownHealth) {
      this.shownHealth = health;
      this.drawBar(health);
    }

    if (playerState.money !== this.shownMoney) {
      const gained = this.shownMoney >= 0 && playerState.money > this.shownMoney;
      this.shownMoney = playerState.money;
      this.drawWallet();
      if (gained) this.celebrate();
    }

    const items = this.stacks().map(([name, n]) => `${name}x${n}`).join(',');
    if (items !== this.shownItems) {
      this.shownItems = items;
      this.drawItems();
    }
  }

  private fixed<T extends Phaser.GameObjects.Components.ScrollFactor & Phaser.GameObjects.Components.Depth>(o: T): T {
    return o.setScrollFactor(0).setDepth(Depth.HUD);
  }

  private slotsX() {
    const width = (SLOT.count * SLOT.size + (SLOT.count - 1) * SLOT.gap) * S;
    return Math.round((this.scene.scale.width - width) / 2);
  }

  private slotsY() {
    return this.scene.scale.height - (MARGIN + SLOT.size) * S;
  }

  private moneyY() {
    return MARGIN * S + TEXT_TOP;
  }

  // Fill a rect given in native pixels relative to the Graphics' position
  private rect(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, colour: number, alpha = 1) {
    g.fillStyle(colour, alpha).fillRect(x * S, y * S, w * S, h * S);
  }

  private icon(g: Phaser.GameObjects.Graphics, rows: string[], x: number, y: number, shadow = true) {
    const passes = shadow ? ([[C.K0, 1], [undefined, 0]] as const) : ([[undefined, 0]] as const);
    for (const [colour, dy] of passes) {
      rows.forEach((row, j) =>
        [...row].forEach((ch, i) => {
          if (ICON_COLOURS[ch] !== undefined) this.rect(g, x + i, y + j + dy, 1, 1, colour ?? ICON_COLOURS[ch]);
        }),
      );
    }
  }

  private drawBar(health: number) {
    const g = this.bar.clear();
    const inner = BAR.w - 2;
    const fill = Math.round((inner * health) / 100);
    const [base, light, dark] =
      health > 50 ? [C.G2, C.G4, C.G1] : health > 25 ? [C.Y3, C.W2, C.Y2] : [C.R3, C.O3, C.R2];

    this.rect(g, 0, 0, BAR.w, BAR.h, C.K0);
    this.rect(g, 1, 1, inner, BAR.h - 2, C.K2);
    if (fill > 0) {
      this.rect(g, 1, 1, fill, BAR.h - 2, base);
      this.rect(g, 1, 1, fill, 1, light);
      this.rect(g, 1, BAR.h - 2, fill, 1, dark);
    }
    // Notches every quarter so damage is easy to read at a glance
    for (let q = 1; q < 4; q++) {
      this.rect(g, 1 + Math.round((inner * q) / 4), 2, 1, BAR.h - 4, C.K0, 0.35);
    }
  }

  // The font has no euro sign, so the coin icon and a small "EUR" carry the currency
  private drawWallet() {
    const text = (playerState.money / 100).toFixed(2);
    this.money.setText(text);
    this.moneyShadow.setText(text);
    const textW = Math.ceil(this.money.width / S);
    const left = this.right - (COIN_W + 3 + textW + 2 + EUR_W) * S;

    const g = this.wallet.clear().setPosition(left, MARGIN * S);
    this.icon(g, COIN, 0, 0);
    this.icon(g, EUR, COIN_W + 3 + textW + 2, 1);
    this.money.setPosition(left + (COIN_W + 3) * S, this.moneyY());
    this.moneyShadow.setPosition(this.money.x, this.money.y + TEXT_SHADOW);
  }

  // Identical items share a slot, in the order they were first picked up
  private stacks(): [string, number][] {
    const counts = new Map<string, number>();
    for (const name of playerState.inventory) counts.set(name, (counts.get(name) ?? 0) + 1);
    return [...counts].slice(0, SLOT.count);
  }

  private drawItems() {
    this.items.forEach((i) => i.destroy());
    const x0 = this.slotsX();
    const y0 = this.slotsY();
    this.items = this.stacks().flatMap(([name, count], i) => {
      const key = `pickup_${name}`;
      if (!this.scene.textures.exists(key)) return [];
      const sx = x0 + i * (SLOT.size + SLOT.gap) * S;
      const icon = this.fixed(this.scene.add.image(sx + (SLOT.size / 2) * S, y0 + (SLOT.size / 2) * S, key));
      return count > 1 ? [icon, this.badge(sx, y0, count)] : [icon];
    });
  }

  // A pill that is a circle for one digit and stretches for two; 99+ is beyond anything you can carry
  private badge(slotX: number, slotY: number, count: number) {
    const digits = [...String(Math.min(count, 99))].map(Number);
    const w = digits.length * 4 + 5;
    const g = this.fixed(this.scene.add.graphics()).setPosition(
      slotX + (SLOT.size + BADGE.overhang - w) * S,
      slotY - BADGE.overhang * S,
    );
    // Rounded ends: rows 0/8 inset 2px, rows 1/7 inset 1px
    const inset = (y: number) => Math.max(0, 2 - Math.min(y, BADGE.h - 1 - y));
    for (let y = 0; y < BADGE.h; y++) {
      this.rect(g, inset(y), y, w - 2 * inset(y), 1, C.K0);
      // The fill is the outline shrunk by a pixel, with a lighter top row
      if (y > 0 && y < BADGE.h - 1) this.rect(g, inset(y) + 1, y, w - 2 * inset(y) - 2, 1, y === 1 ? C.O3 : C.R3);
    }
    digits.forEach((d, i) => this.icon(g, DIGITS[d], 3 + i * 4, 2, false));
    return g;
  }

  // A one-pixel hop and a gold flash; scaling would smear the pixels and push into "EUR"
  private celebrate() {
    const y = this.moneyY();
    this.money.setTint(C.Y3).setY(y - S);
    this.moneyShadow.setY(y - S + TEXT_SHADOW);
    this.scene.time.delayedCall(140, () => {
      this.money.setY(y);
      this.moneyShadow.setY(y + TEXT_SHADOW);
    });
    this.scene.time.delayedCall(500, () => this.money.setTint(C.W2));
  }
}
