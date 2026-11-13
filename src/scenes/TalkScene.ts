import * as Phaser from 'phaser';
import { FONT, MessageType } from '../config';
import { CONVERSATIONS, type Choice, type Conversation } from '../systems/dialogue';
import { MessageQueue } from '../systems/messages';
import { PAD_KEYS, StickSteps } from '../systems/overlay';
import { playerState } from '../systems/state';
import { localise } from '../systems/text';

const S = 3; // close-up art is exported at 3x
const LINE_W = 880;
const LINE_SIZE = 12;
const CHOICE_SIZE = 10;
const CHOICE_GAP = 26;
const TYPE_MS = 22; // per character
const TALK_BOB_MS = 140; // the close-up bobs a pixel while the line is being "said"
// HUD palette (objects/Hud.ts)
const C = { W2: 0xf0ece0, K3: 0x5b5a5a, K4: 0x807e7e, Y3: 0xd2d631, O3: 0xe08a3c };

const LEAVE: Choice = { id: 'leave' };

// A conversation with an NPC (systems/dialogue.ts), over the paused scene. Their close-up fills the top, their line
// types out under it, then your answers appear: arrows (WASD, d-pad, stick) or the mouse pick one, the action button
// says it. Escape, Q or Backspace walks away at any point.
export class TalkScene extends Phaser.Scene {
  private npc = '';
  private from = '';
  private talk!: Conversation;
  private portrait!: Phaser.GameObjects.Image;
  private portraitY = 0;
  private line!: Phaser.GameObjects.BitmapText;
  private wallet!: Phaser.GameObjects.BitmapText;
  private hint!: Phaser.GameObjects.BitmapText;
  private messages!: MessageQueue;
  private node = '';
  private choices: Choice[] = [];
  private labels: Phaser.GameObjects.BitmapText[] = [];
  private arrow!: Phaser.GameObjects.BitmapText;
  private selected = 0;
  private typing: Phaser.Time.TimerEvent | null = null;
  private fullLine = '';
  private closing = false;
  private stick = new StickSteps();

  constructor() {
    super('Talk');
  }

  init(data: { npc: string; from: string }) {
    this.npc = data.npc;
    this.from = data.from;
  }

  create() {
    const { width: W, height: H } = this.scale;
    this.talk = CONVERSATIONS[this.npc];
    this.closing = false;
    this.typing = null;
    this.labels = [];
    this.stick = new StickSteps();

    this.add.rectangle(0, 0, W, H, 0x000000, 0.85).setOrigin(0, 0).setInteractive();
    this.portrait = this.add.image(W / 2, 66, `talk_${this.npc}`).setOrigin(0.5, 0);
    this.portraitY = this.portrait.y;
    const bottom = this.portrait.y + this.portrait.height;

    this.add.bitmapText(W / 2, 22, FONT, localise(this, `talk.${this.npc}.name`), MessageType.MEDIUM).setOrigin(0.5, 0);
    // Over the close-up's top-right corner: the street's own HUD wallet is still there, dimmed, in the screen corner
    this.wallet = this.add
      .bitmapText(this.portrait.x + this.portrait.width / 2, this.portrait.y - 6, FONT, '', CHOICE_SIZE)
      .setOrigin(1, 1)
      .setTint(C.Y3);
    this.line = this.add.bitmapText(W / 2 - LINE_W / 2, bottom + 18, FONT, '', LINE_SIZE).setTint(C.W2);
    this.arrow = this.add.bitmapText(0, 0, FONT, '>', CHOICE_SIZE).setTint(C.Y3).setVisible(false);
    this.hint = this.add.bitmapText(W / 2, H - 26, FONT, '', MessageType.LOCK_ON_PLAYER).setOrigin(0.5, 0).setTint(C.K4);
    this.showHint(!!this.input.gamepad?.total);
    this.messages = new MessageQueue(this);
    this.showWallet();

    this.input.keyboard!.on('keydown', (e: KeyboardEvent) => {
      this.showHint(false);
      this.onKey(e.code);
    });
    this.input.gamepad?.on('down', (_pad: Phaser.Input.Gamepad.Gamepad, button: Phaser.Input.Gamepad.Button) => {
      this.showHint(true);
      this.onKey(PAD_KEYS[button.index] ?? '');
    });

    this.goTo(this.talk.start(playerState));
    this.cameras.main.setAlpha(0);
    this.tweens.add({ targets: this.cameras.main, alpha: 1, duration: 150 });
  }

  update() {
    if (this.closing) return;
    const step = this.stick.poll(this.input.gamepad?.pad1);
    if (step && step[1]) {
      this.showHint(true);
      this.move(step[1]);
    }
  }

  private showHint(pad: boolean) {
    this.hint.setText(localise(this, pad ? 'talk.hint_pad' : 'talk.hint'));
  }

  private showWallet() {
    this.wallet.setText(`${euros(playerState.money)} EUR`);
  }

  private text(key: string) {
    return localise(this, `talk.${this.npc}.${key}`);
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
        return this.typing ? this.finishLine() : this.pick();
      case 'ArrowUp':
      case 'KeyW':
        return this.move(-1);
      case 'ArrowDown':
      case 'KeyS':
        return this.move(1);
    }
  }

  // The NPC says the node's line; the answers show once they've finished saying it
  private goTo(node: string) {
    this.node = node;
    const def = this.talk.nodes[node];
    const offered = (def.choices ?? []).filter((c) => !c.when || c.when(playerState));
    this.choices = offered.length ? offered : [LEAVE];
    this.selected = 0;
    this.clearChoices();

    const variants = this.text(`${node}.line`).split('|');
    const said = Phaser.Utils.Array.GetRandom(variants).trim().replace('{money}', euros(playerState.money));
    // Wrap the whole line first, so words don't jump to the next line halfway through being typed
    this.line.setMaxWidth(LINE_W).setText(said);
    this.fullLine = this.line.getTextBounds().wrappedText || said;
    this.line.setMaxWidth(0).setText('');

    let shown = 0;
    this.typing?.remove();
    this.typing = this.time.addEvent({
      delay: TYPE_MS,
      repeat: this.fullLine.length - 1,
      callback: () => {
        shown++;
        this.line.setText(this.fullLine.slice(0, shown));
        this.portrait.y = this.portraitY - (Math.floor(this.time.now / TALK_BOB_MS) % 2) * S;
        if (shown >= this.fullLine.length) this.finishLine();
      },
    });
  }

  private finishLine() {
    this.typing?.remove();
    this.typing = null;
    this.portrait.y = this.portraitY;
    this.line.setText(this.fullLine);
    this.showChoices();
  }

  private clearChoices() {
    this.labels.forEach((l) => l.destroy());
    this.labels = [];
    this.arrow.setVisible(false);
  }

  private showChoices() {
    this.clearChoices();
    const top = this.line.y + Math.max(this.line.height, LINE_SIZE) + 22;
    this.labels = this.choices.map((choice, i) => {
      const label = choice === LEAVE ? localise(this, 'talk.leave') : this.text(`${this.node}.${choice.id}`);
      const price = choice.price ? `  ${euros(choice.price)} EUR` : '';
      return this.add
        .bitmapText(this.line.x, top + i * CHOICE_GAP, FONT, `${label}${price}`, CHOICE_SIZE)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.select(i))
        .on('pointerdown', () => {
          this.select(i);
          this.pick();
        });
    });
    this.select(this.selected);
  }

  private move(d: number) {
    if (this.typing || !this.labels.length) return;
    this.select((this.selected + d + this.labels.length) % this.labels.length);
  }

  // The picked answer gets the arrow and full brightness; ones you can't afford stay dim
  private select(i: number) {
    if (this.typing || this.closing || !this.labels[i]) return;
    this.selected = i;
    this.labels.forEach((l, j) => {
      const price = this.choices[j].price;
      const broke = !!price && price > playerState.money;
      l.setTint(j === i ? (broke ? C.O3 : C.W2) : broke ? C.K3 : C.K4);
    });
    this.arrow.setPosition(this.line.x - 28, this.labels[i].y).setVisible(true);
  }

  private pick() {
    const choice = this.choices[this.selected];
    if (!choice || this.typing || this.closing) return;
    if (choice === LEAVE) return this.close();

    if (choice.price) {
      if (choice.price > playerState.money) return this.goTo(this.talk.broke);
      playerState.money -= choice.price;
      this.showWallet();
    }
    if (choice.takes) {
      const i = playerState.inventory.lastIndexOf(choice.takes);
      if (i >= 0) playerState.inventory.splice(i, 1);
    }
    if (choice.gives) {
      playerState.inventory.push(choice.gives);
      this.messages.show(localise(this, `inventory.${choice.gives}`), MessageType.SMALL);
    }
    if (choice.sets && !playerState.flags.includes(choice.sets)) playerState.flags.push(choice.sets);
    if (choice.next) this.goTo(choice.next);
    else this.close();
  }

  private close() {
    if (this.closing) return;
    this.closing = true;
    this.typing?.remove();
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

function euros(cents: number) {
  return (cents / 100).toFixed(2);
}
