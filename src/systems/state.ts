// Shared game state across scenes (OG player_model)
export const playerState = {
  health: 100,
  mana: 5,
  isAlive: true,
  inventory: [] as string[],
  chapter: 1,
  money: 0, // in cents
  // Where to put the player when coming back to the street (null = the level's start marker)
  streetX: null as number | null,
};

export function resetPlayer() {
  playerState.health = 100;
  playerState.isAlive = true;
}
