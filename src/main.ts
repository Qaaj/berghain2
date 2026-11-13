import * as Phaser from 'phaser';
import { HEIGHT, WIDTH } from './config';
import { BootScene } from './scenes/BootScene';
import { BuildingScene } from './scenes/BuildingScene';
import { InspectScene } from './scenes/InspectScene';
import { StreetScene } from './scenes/StreetScene';
import { UbahnScene } from './scenes/UbahnScene';
import { playerState, type WeatherKind } from './systems/state';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#000000',
  pixelArt: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  input: { gamepad: true },
  physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 2500 } } },
  scene: [BootScene, StreetScene, BuildingScene, UbahnScene, InspectScene],
});

if (import.meta.env.DEV) {
  // Dev helpers for scripted play-testing: hold('ArrowRight', 39, 800) presses a key for 800 ms
  const hold = async (code: string, keyCode: number, ms: number) => {
    const fire = (type: string) => window.dispatchEvent(new KeyboardEvent(type, { code, key: code, keyCode, bubbles: true }));
    fire('keydown');
    await new Promise((r) => setTimeout(r, ms));
    fire('keyup');
  };
  // weather('snow') switches the street weather now ('clear' | 'rain' | 'snow' | 'wind')
  const weather = (kind: WeatherKind) => (game.scene.getScene('Street') as StreetScene).weather.set(kind);
  Object.assign(window, { game, playerState, hold, weather });
}
