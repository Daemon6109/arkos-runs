import { GlobalEvent } from "@flamework/networking";
import { Players } from "@rbxts/services";

interface QuestEventData {
  player: Players.Player;
  questName: string;
  progress: number;
}

export const QuestEvent = new GlobalEvent<QuestEventData>("QuestProgressUpdate", "Server", "Client");

export function trackQuestProgress(player: Players.Player, questName: string, progress: number): void {
  QuestEvent.Fire({
    player,
    questName,
    progress,
  });
}