import { describe, it, expect, vi } from "bun:test";
import { handleMatchmakingRequest, MatchmakingEvent } from "../src/matchmaking";
import { Player } from "@rbxts/services";

describe("handleMatchmakingRequest", () => {
  it("fires MatchmakingEvent with correct payload", () => {
    const mockPlayer = { Name: "TestPlayer" } as Player;
    const fireSpy = vi.spyOn(MatchmakingEvent, "Fire");

    handleMatchmakingRequest(mockPlayer, "queue", "30");

    expect(fireSpy).toHaveBeenCalledOnce();
    expect(fireSpy).toHaveBeenCalledWith({
      player: mockPlayer,
      queueTime: 30,
    });
  });

  it("uses fixed queueTime regardless of arguments", () => {
    const mockPlayer = { Name: "AnotherPlayer" } as Player;
    const fireSpy = vi.spyOn(MatchmakingEvent, "Fire");

    handleMatchmakingRequest(mockPlayer, "queue", "60");

    expect(fireSpy).toHaveBeenCalledWith({
      player: mockPlayer,
      queueTime: 30,
    });
  });
});