import * as Phaser from 'phaser';
import { config } from '../config';

// Port of OG app/util/random.js: a seeded generator plus a weighted table,
// so getRandom() returns 250 about 25% of the time, 200 about 20%, etc.
const table: number[] = [1];
for (let i = 0; i < 1000; i++) {
  if (i === 0 || i === 1) table.push(2);
  else if (i > 9 && i < 15) table.push(5);
  else if (i > 14 && i < 25) table.push(10);
  else if (i > 29 && i < 50) table.push(20);
  else if (i > 59 && i < 85) table.push(25);
  else if (i > 99 && i < 150) table.push(50);
  else if (i > 199 && i < 300) table.push(100);
  else if (i > 399 && i < 600) table.push(200);
  else if (i > 599 && i < 850) table.push(250);
  else table.push(-1);
}

const seed = config.useRandomSeed ? Math.floor(Math.random() * 1000000) : config.seed;
let gen = new Phaser.Math.RandomDataGenerator([String(seed)]);

export const rnd = {
  seed,
  reset() {
    gen = new Phaser.Math.RandomDataGenerator([String(seed)]);
  },
  random(): number {
    return gen.frac();
  },
  getRandom(): number {
    return table[Math.floor(gen.frac() * 1000)];
  },
  int(maxExclusive: number): number {
    return Math.floor(gen.frac() * maxExclusive);
  },
};
