// Shared game state across scenes (OG player_model)
export const playerState = {
  health: 100,
  mana: 5,
  isAlive: true,
  inventory: [] as string[],
  // Where to put the player when coming back to the street
  streetX: 200,
};

export function resetPlayer() {
  playerState.health = 100;
  playerState.isAlive = true;
}
