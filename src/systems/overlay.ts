import * as Phaser from 'phaser';

// Shared plumbing for the full-screen overlays (Inspect, Talk) that run on top of a paused scene.

// Standard gamepad buttons: A uses, B closes, the d-pad moves
export const PAD_KEYS: Record<number, string> = { 0: 'Space', 1: 'Escape', 12: 'ArrowUp', 13: 'ArrowDown', 14: 'ArrowLeft', 15: 'ArrowRight' };
// The stick steps once per push: past STICK_PUSH it moves, and it has to come back under STICK_REST to move again
const STICK_PUSH = 0.6;
const STICK_REST = 0.3;

// Pauses `scene` and opens the overlay `key` over it; the overlay resumes it when it closes
export function openOverlay(scene: Phaser.Scene, key: string, data: object) {
  scene.scene.pause();
  scene.scene.launch(key, { ...data, from: scene.scene.key });
  // Keys released while paused never reach this scene; without a reset the player would keep walking
  scene.events.once(Phaser.Scenes.Events.RESUME, () => scene.input.keyboard?.resetKeys());
}

// Turns the left stick into single steps, like d-pad presses. Starts "held" because the stick may still be pushed
// from walking up to whatever opened the overlay; it has to centre before it moves anything.
export class StickSteps {
  private held = true;

  // Returns the step to take this frame ([dx, dy], one of them 0), or null
  poll(pad: Phaser.Input.Gamepad.Gamepad | undefined): [number, number] | null {
    if (!pad) return null;
    const { x, y } = pad.leftStick;
    const tilt = Math.max(Math.abs(x), Math.abs(y));
    if (this.held) {
      this.held = tilt > STICK_REST;
      return null;
    }
    if (tilt < STICK_PUSH) return null;
    this.held = true;
    return Math.abs(x) > Math.abs(y) ? [Math.sign(x), 0] : [0, Math.sign(y)];
  }
}
