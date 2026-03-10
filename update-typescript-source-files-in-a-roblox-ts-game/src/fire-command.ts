import { Command } from "flamework";
import { Players } from "@rbxts/services";

interface FireEventPayload {
  eventName: string;
  data: Record<string, any>;
}

@Command("fire", "Fires a test event with specified parameters")
export function executeFireCommand(player: Players.Player, ...args: string[]): void {
  if (args.length < 1) {
    warn("Usage: /fire <eventName> [key=value ...]");
    return;
  }

  const eventName = args[0];
  const data: Record<string, string> = {};

  for (let i = 1; i < args.length; i++) {
    const [key, value] = args[i].split("=");
    if (key && value) {
      data[key] = value;
    }
  }

  const payload: FireEventPayload = {
    eventName,
    data
  };

  print(`Fired test event: ${eventName} with data:`, data);
}

export { FireEventPayload };