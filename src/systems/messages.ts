import * as Phaser from 'phaser';
import { Depth, FONT, MessageType } from '../config';

// Port of OG show_message_command + message_que_model: title messages at the
// top of the screen, shown one at a time, each fading out after a second.
export class MessageQueue {
  private queue: { text: string; size: number }[] = [];
  private showing = false;

  constructor(private scene: Phaser.Scene) {}

  show(text: string, size: number = MessageType.MEDIUM) {
    this.queue.push({ text, size });
    if (!this.showing) this.next();
  }

  private next() {
    const msg = this.queue.shift();
    if (!msg) {
      this.showing = false;
      return;
    }
    this.showing = true;
    const t = this.scene.add
      .bitmapText(this.scene.scale.width / 2, 50, FONT, msg.text, msg.size)
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(Depth.HUD);
    this.scene.tweens.add({
      targets: t,
      alpha: 0,
      delay: 1000,
      duration: 500,
      onComplete: () => {
        t.destroy();
        this.next();
      },
    });
  }
}

// Port of OG show_player_notification_command + message_view: a small label
// that follows the player, replaced when a different message comes in.
export class PlayerNotification {
  private id: string | null = null;
  private label: Phaser.GameObjects.BitmapText | null = null;
  private timer: Phaser.Time.TimerEvent | null = null;

  constructor(private scene: Phaser.Scene) {}

  show(id: string, text: string, durationMs?: number) {
    if (this.id === id) return;
    this.hide();
    this.id = id;
    this.label = this.scene.add
      .bitmapText(0, 0, FONT, text, MessageType.LOCK_ON_PLAYER)
      .setDepth(Depth.NOTIFICATION);
    if (durationMs) this.timer = this.scene.time.delayedCall(durationMs, () => this.hide());
  }

  hide() {
    this.timer?.remove();
    this.timer = null;
    this.label?.destroy();
    this.label = null;
    this.id = null;
  }

  get current() {
    return this.id;
  }

  follow(body: Phaser.Physics.Arcade.Body) {
    this.label?.setPosition(Math.round(body.x), Math.round(body.y - 15));
  }
}
