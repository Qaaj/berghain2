import * as Phaser from 'phaser';

export type InputMode = 'normal' | 'topdown';

// Port of OG interfaces/input.js + states/input/*. In 'normal' (street) mode
// Space jumps and Up is the action button; in 'topdown' (indoors) the arrows
// move in four directions and Space is the action button. WASD mirrors the arrows everywhere,
// and E is an action button in both modes.
export class Controls {
  goLeft = false;
  goRight = false;
  goUp = false;
  goDown = false;
  sprint = false;
  action = false;
  actionJustPressed = false;
  anyPressed = false;

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd: Record<'up' | 'left' | 'down' | 'right', Phaser.Input.Keyboard.Key>;
  private space: Phaser.Input.Keyboard.Key;
  private interact: Phaser.Input.Keyboard.Key;
  private shift: Phaser.Input.Keyboard.Key;

  constructor(private scene: Phaser.Scene, public mode: InputMode) {
    const kb = scene.input.keyboard!;
    this.cursors = kb.createCursorKeys();
    const K = Phaser.Input.Keyboard.KeyCodes;
    this.wasd = kb.addKeys({ up: K.W, left: K.A, down: K.S, right: K.D }) as typeof this.wasd;
    this.space = kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.interact = kb.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.shift = kb.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
  }

  update() {
    const pad = this.scene.input.gamepad?.pad1;
    const stickX = pad?.leftStick.x ?? 0;
    const stickY = pad?.leftStick.y ?? 0;
    const padUp = !!pad && (pad.up || stickY < -0.1);
    const padDown = !!pad && (pad.down || stickY > 0.1);

    this.goLeft = this.cursors.left.isDown || this.wasd.left.isDown || (!!pad && (pad.left || stickX < -0.1));
    this.goRight = this.cursors.right.isDown || this.wasd.right.isDown || (!!pad && (pad.right || stickX > 0.1));
    this.goDown = this.cursors.down.isDown || this.wasd.down.isDown || padDown;
    this.sprint = this.shift.isDown;

    const up = this.cursors.up.isDown || this.wasd.up.isDown;
    const wasAction = this.action;
    if (this.mode === 'normal') {
      this.action = up || this.interact.isDown || (!!pad && pad.A);
      this.goUp = this.space.isDown || padUp;
    } else {
      this.action = this.space.isDown || this.interact.isDown || (!!pad && pad.A);
      this.goUp = up || padUp;
    }

    this.actionJustPressed = this.action && !wasAction;
    this.anyPressed =
      this.goLeft || this.goRight || this.goUp || this.goDown || this.action || this.sprint;
  }
}
