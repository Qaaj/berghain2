export type WeatherKind = 'clear' | 'rain' | 'snow' | 'wind';
// A street with a U-Bahn station under it; the train runs between them
export type District = 'neukoelln' | 'fhain';

// Shared game state across scenes (OG player_model)
export const playerState = {
  health: 100,
  mana: 5,
  isAlive: true,
  inventory: [] as string[],
  // Pickups already taken, one entry per placement ("<place>:<spot>" from close-ups, "<shop>:<item>@x,y" indoors),
  // so each copy stays taken even after the item leaves the inventory (a returned bottle doesn't respawn)
  looted: [] as string[],
  chapter: 1,
  money: 0, // in cents
  // Where to put the player when coming back to the street (null = the level's start marker)
  streetX: null as number | null,
  // Street weather persists while you're indoors; null until the street picks the first one
  weather: null as WeatherKind | null,
  weatherLeft: 0, // ms of street time until the weather turns
};

export function resetPlayer() {
  playerState.health = 100;
  playerState.isAlive = true;
}
