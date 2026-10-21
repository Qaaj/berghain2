import * as Phaser from 'phaser';
import { Depth } from '../config';
import type { Controls } from '../systems/input';

export type PlayerMode = 'ground' | 'jump' | 'zombie' | 'inside';

// Frames in punker.png (10 columns of 96x96)
const FRAME_IDLE = 2;
const FRAME_BACK = 40;
const FRAME_JUMP = 23;
const FRAME_JUMP_RIGHT = 22;
const FRAME_JUMP_LEFT = 27;

export function createPlayerAnimations(scene: Phaser.Scene) {
  if (scene.anims.exists('left')) return;
  const frames = (from: number, to: number) => scene.anims.generateFrameNumbers('punker', { start: from, end: to });
  scene.anims.create({ key: 'left', frames: frames(30, 37), frameRate: 10, repeat: -1 });
  scene.anims.create({ key: 'right', frames: frames(10, 17), frameRate: 10, repeat: -1 });
  scene.anims.create({ key: 'walk_down', frames: frames(40, 47), frameRate: 10 });
  scene.anims.create({ key: 'go_inside', frames: frames(40, 41), frameRate: 10 });
}

// Port of OG create_player_command, player_mediator and states/player/*
export class Player extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  mode: PlayerMode;
  // Called when the action button is pressed while standing still.
  // Returns true when something was interacted with.
  onAction: () => boolean = () => false;

  constructor(scene: Phaser.Scene, x: number, y: number, mode: PlayerMode) {
    super(scene, x, y, 'punker', FRAME_IDLE);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0, 0).setDepth(Depth.PLAYER);
    this.body.setSize(36, 95).setOffset(30, 1);
    this.body.setCollideWorldBounds(true);
    this.mode = mode;
    if (mode === 'inside') this.body.setAllowGravity(false);
    this.name = 'Punker';
  }

  get onGround() {
    return this.body.blocked.down || this.body.touching.down;
  }

  freeze() {
    this.mode = 'zombie';
    this.body.setVelocityX(0);
    this.anims.stop();
  }

  tick(input: Controls) {
    switch (this.mode) {
      case 'ground':
        return this.updateGround(input);
      case 'jump':
        return this.updateJump(input);
      case 'inside':
        return this.updateInside(input);
      case 'zombie':
        return;
    }
  }

  private updateGround(input: Controls) {
    if (!this.onGround) {
      this.mode = 'jump';
      return;
    }
    const speed = input.sprint ? 1000 : 200;

    if (input.goLeft) {
      this.anims.play('left', true);
      this.body.setVelocityX(-speed);
    }
    if (input.goUp) {
      this.body.setVelocityY(-600 - speed / 2);
    }
    if (input.goRight) {
      this.anims.play('right', true);
      this.body.setVelocityX(speed);
    }
    if (input.action && !(input.goLeft || input.goRight)) {
      this.body.setVelocityX(0);
      if (!this.onAction()) {
        this.anims.stop();
        this.setFrame(FRAME_BACK);
      }
    }
    if (!input.goLeft && !input.goRight && !input.action) {
      this.body.setVelocityX(0);
      this.anims.stop();
      this.setFrame(FRAME_IDLE);
    }
  }

  private updateJump(input: Controls) {
    if (this.onGround && this.body.velocity.y >= 0) {
      this.mode = 'ground';
      return;
    }
    const speed = input.sprint ? 1000 : 180;
    this.anims.stop();
    if (input.goLeft) {
      this.setFrame(FRAME_JUMP_LEFT);
      this.body.setVelocityX(-speed);
    } else if (input.goRight) {
      this.setFrame(FRAME_JUMP_RIGHT);
      this.body.setVelocityX(speed);
    } else {
      this.body.setVelocityX(0);
      this.setFrame(FRAME_JUMP);
    }
  }

  private updateInside(input: Controls) {
    const speed = input.sprint ? 500 : 200;
    let vx = 0;
    let vy = 0;
    if (input.goLeft) {
      vx = -speed;
      this.anims.play('left', true);
    } else if (input.goRight) {
      vx = speed;
      this.anims.play('right', true);
    } else if (input.goUp) {
      vy = -speed;
      this.anims.stop();
      this.setFrame(FRAME_BACK);
    } else if (input.goDown) {
      vy = speed;
      this.anims.stop();
      this.setFrame(FRAME_IDLE);
    }
    this.body.setVelocity(vx, vy);

    if (input.action && !(input.goLeft || input.goRight)) {
      this.body.setVelocity(0, 0);
      if (!this.onAction()) this.setFrame(FRAME_BACK);
    }
    if (!input.anyPressed) {
      this.anims.stop();
      this.setFrame(FRAME_IDLE);
    }
  }
}
