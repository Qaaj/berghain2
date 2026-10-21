import * as Phaser from 'phaser';

export type InputMode = 'normal' | 'topdown';

// Port of OG interfaces/input.js + states/input/*. In 'normal' (street) mode
// Space jumps and Up is the action button; in 'topdown' (indoors) the arrows
// move in four directions and Space is the action button.
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
  private space: Phaser.Input.Keyboard.Key;
  private shift: Phaser.Input.Keyboard.Key;

  constructor(private scene: Phaser.Scene, public mode: InputMode) {
    const kb = scene.input.keyboard!;
    this.cursors = kb.createCursorKeys();
    this.space = kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.shift = kb.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
  }

  update() {
    const pad = this.scene.input.gamepad?.pad1;
    const stickX = pad?.leftStick.x ?? 0;
    const stickY = pad?.leftStick.y ?? 0;
    const padUp = !!pad && (pad.up || stickY < -0.1);
    const padDown = !!pad && (pad.down || stickY > 0.1);

    this.goLeft = this.cursors.left.isDown || (!!pad && (pad.left || stickX < -0.1));
    this.goRight = this.cursors.right.isDown || (!!pad && (pad.right || stickX > 0.1));
    this.goDown = this.cursors.down.isDown || padDown;
    this.sprint = this.shift.isDown;

    const wasAction = this.action;
    if (this.mode === 'normal') {
      this.action = this.cursors.up.isDown || (!!pad && pad.A);
      this.goUp = this.space.isDown || padUp;
    } else {
      this.action = this.space.isDown || (!!pad && pad.A);
      this.goUp = this.cursors.up.isDown || padUp;
    }

    this.actionJustPressed = this.action && !wasAction;
    this.anyPressed =
      this.goLeft || this.goRight || this.goUp || this.goDown || this.action || this.sprint;
  }
}
