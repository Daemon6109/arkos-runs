import { describe, it, expect, spyOn } from "bun:test";
import { executeFireCommand } from "../src/fire-command";
import { MatchmakingEvent } from "../src/matchmaking";

describe("/fire command execution", () => {
  beforeEach(() => {
    // Reset spies if needed
  });

  it("fires MatchmakingEvent with parsed data", () => {
    const mockPlayer = { Name: "TestPlayer" };
    const args = ["MatchmakingEvent", "player=John", "queueTime=30"];
    const fireSpy = spyOn(MatchmakingEvent, "Fire");

    executeFireCommand(mockPlayer, args);

    expect(fireSpy).toHaveBeenCalledOnce();
    expect(fireSpy).toHaveBeenCalledWith({
      player: "John",
      queueTime: 30,
    });
  });

  it("does not fire event for invalid event name", () => {
    const mockPlayer = { Name: "TestPlayer" };
    const args = ["InvalidEvent", "key=value"];
    const fireSpy = spyOn(MatchmakingEvent, "Fire");

    executeFireCommand(mockPlayer, args);

    expect(fireSpy).not.toHaveBeenCalled();
  });

  it("parses boolean and number values correctly", () => {
    const mockPlayer = { Name: "TestPlayer" };
    const args = ["MatchmakingEvent", "active=true", "score=100"];
    const fireSpy = spyOn(MatchmakingEvent, "Fire");

    executeFireCommand(mockPlayer, args);

    expect(fireSpy).toHaveBeenCalledOnce();
    expect(fireSpy).toHaveBeenCalledWith({
      player: "TestPlayer",
      queueTime: 30, // Default from handleMatchmakingRequest
      active: true,
      score: 100,
    });
  });
});