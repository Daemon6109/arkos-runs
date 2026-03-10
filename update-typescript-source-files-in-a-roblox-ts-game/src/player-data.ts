import { GlobalEvent } from "@flamework/networking";
import { Players } from "@rbxts/services";

interface PlayerState {
  health: number;
  score: number;
  level: number;
  experience: number;
  inventory: string[];
}

export const PlayerDataSync = new GlobalEvent<{ player: Players.Player; data: PlayerState }>("PlayerDataSync", "Server", "Client");
export const PlayerDataUpdated = new GlobalEvent<{ player: Players.Player; data: PlayerState }>("PlayerDataUpdated", "Server", "Client");

export function syncPlayerData(player: Players.Player) {
  let currentState: PlayerState = {
    health: 100,
    score: 0,
    level: 1,
    experience: 0,
    inventory: [],
  };

  // Initial synchronization
  PlayerDataSync.FireClient(player, { player, data: currentState });

  // Example update method (extend as needed)
  const updateHealth = (newHealth: number) => {
    currentState.health = math.clamp(newHealth, 0, 100);
    PlayerDataUpdated.FireClient(player, { player, data: currentState });
  };

  // Expose API for state modification
  return {
    updateHealth,
  };
}

export { PlayerDataSync, PlayerDataUpdated };
export type { PlayerState };