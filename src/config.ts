// Ported from OG app/util/config.js
export const config = {
  debug: false,
  skipIntro: false,
  useRandomSeed: false,
  seed: 868492,
  locale: 'en',
};

// OG sized the game to the browser window. The rebuild uses a fixed
// logical resolution and scales it to fit.
export const WIDTH = 1280;
export const HEIGHT = 720;
export const GROUND_HEIGHT = 64;
export const LEVEL_WIDTH = 5120;
export const FONT = 'carrier_command';

export const MessageType = {
  SMALL: 10,
  MEDIUM: 15,
  LARGE: 20,
  LOCK_ON_PLAYER: 8,
} as const;

export const Depth = {
  SKY: 0,
  MOON: 1,
  BUILDING: 2,
  FENCE: 3,
  ENVIRONMENT: 4,
  SHRUBBERY: 5,
  PLACE: 6,
  NPC: 7,
  HAZARD: 8,
  PICKUP: 9,
  PLAYER: 10,
  NOTIFICATION: 900,
  HUD: 1000,
} as const;
