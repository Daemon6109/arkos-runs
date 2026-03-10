import { GlobalEvent } from "@flamework/networking";
import { Players } from "@rbxts/services";

interface MatchmakingRequestPayload {
  player: Players.Player;
  queueTime: number;
}

export const MatchmakingEvent = new GlobalEvent<MatchmakingRequestPayload>("MatchmakingRequest", "Server", "Client");

export function handleMatchmakingRequest(player: Players.Player, ...args: string[]): void {
  const queueTime = 30; // Default queue time in seconds
  MatchmakingEvent.Fire({
    player,
    queueTime,
  });
}