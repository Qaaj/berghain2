import * as Phaser from 'phaser';
import { config } from '../config';

// Port of OG text_model.localise: dotted keys into assets/localisation/data.json
export function localise(scene: Phaser.Scene, key: string): string {
  let node: unknown = scene.cache.json.get('text')?.[config.locale];
  for (const part of key.toLowerCase().split('.')) {
    if (node === undefined || node === null || typeof node !== 'object') return key;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === 'string' ? node : key;
}
