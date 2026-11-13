import * as Phaser from 'phaser';
import { Depth } from '../config';
import type { TileLevel } from './tilelevel';

const SCALE = 3; // art is drawn on a 16px grid and shown 3x
const WARM = [240, 208, 112]; // the lamp's #f0d070
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

// A glow drawn at native resolution: alpha falls off with distance, then gets snapped to a few steps with an
// ordered dither so it scales up like the rest of the pixel art instead of a smooth airbrushed blob.
function glowTexture(scene: Phaser.Scene, key: string, w: number, h: number, maxAlpha: number, steps: number) {
  if (scene.textures.exists(key)) return;
  const tex = scene.textures.createCanvas(key, w, h)!;
  const ctx = tex.getContext();
  const img = ctx.createImageData(w, h);
  const cx = (w - 1) / 2;
  const cy = (h - 1) / 2;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const d = Math.hypot((x - cx) / (w / 2), (y - cy) / (h / 2));
      const falloff = Math.max(0, 1 - d) ** 1.6;
      const level = Math.floor(falloff * steps + BAYER[(y % 4) * 4 + (x % 4)]) / steps;
      const i = (y * w + x) * 4;
      img.data.set([...WARM, Math.round(Math.min(1, level) * maxAlpha * 255)], i);
    }
  }
  ctx.putImageData(img, 0, 0);
  tex.refresh();
}

// Street lamps (the "lamp" block) get a warm halo round the head and a pool of light on the pavement. Each lamp
// breathes slowly on its own phase, so the row of them never pulses in lockstep.
export function lightLamps(scene: Phaser.Scene, level: TileLevel) {
  glowTexture(scene, 'lamp_halo', 36, 30, 0.75, 4);
  glowTexture(scene, 'lamp_pool', 48, 10, 0.5, 3);

  for (const { x, y } of level.blocksNamed('lamp')) {
    // head centre and pavement in native pixels within the 32x64 block (see lamp() in art/scripts/street_props.py)
    const halo = scene.add.image(x + 15 * SCALE, y + 6 * SCALE, 'lamp_halo');
    const pool = scene.add.image(x + 15 * SCALE, y + 64 * SCALE, 'lamp_pool');
    for (const glow of [halo, pool]) {
      glow.setScale(SCALE).setBlendMode(Phaser.BlendModes.ADD).setDepth(Depth.ENVIRONMENT + 0.5);
    }
    scene.tweens.add({
      targets: [halo, pool],
      alpha: { from: 1, to: 0.55 },
      duration: Phaser.Math.Between(1400, 2200),
      delay: Phaser.Math.Between(0, 1500),
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });
  }
}
