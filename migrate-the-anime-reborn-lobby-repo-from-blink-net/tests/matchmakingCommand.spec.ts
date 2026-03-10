import { describe, it, expect, beforeEach } from "bun:test";
import { MatchmakingCommand } from "../src/matchmakingCommand";
import { NetworkEvents } from "../src/networkEvents";
import { MatchQueueManager } from "../src/matchQueue";

// Mock dependencies
jest.mock("../src/matchQueue", () => {
  return {
    MatchQueueManager: {
      addPlayer: jest.fn(),
      removePlayer: jest.fn(),
    },
  };
});

jest.mock("../src/networkEvents", () => {
  return {
    NetworkEvents: {
      MatchQueueJoin: {
        emit: jest.fn(),
      },
      MatchQueueLeave: {
        emit: jest.fn(),
      },
    },
  };
});

describe("MatchmakingCommand", () => {
  const testPlayerId = "player-123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should join match queue successfully", () => {
    const result = MatchmakingCommand({ action: "join", playerId: testPlayerId });
    
    expect(MatchQueueManager.addPlayer).toHaveBeenCalledWith(testPlayerId);
    expect(NetworkEvents.MatchQueueJoin.emit).toHaveBeenCalledWith({
      playerId: testPlayerId,
    });
    expect(result).toBeUndefined(); // Assuming command returns void on success
  });

  it("should leave match queue successfully", () => {
    const result = MatchmakingCommand({ action: "leave", playerId: testPlayerId });
    
    expect(MatchQueueManager.removePlayer).toHaveBeenCalledWith(testPlayerId);
    expect(NetworkEvents.MatchQueueLeave.emit).toHaveBeenCalledWith({
      playerId: testPlayerId,
    });
    expect(result).toBeUndefined();
  });

  it("should throw error for invalid action", () => {
    const invalidAction = "invalid";
    expect(() => 
      MatchmakingCommand({ action: invalidAction as any, playerId: testPlayerId })
    ).toThrow(`Unknown action: ${invalidAction}`);
    
    expect(MatchQueueManager.addPlayer).not.toHaveBeenCalled();
    expect(MatchQueueManager.removePlayer).not.toHaveBeenCalled();
    expect(NetworkEvents.MatchQueueJoin.emit).not.toHaveBeenCalled();
    expect(NetworkEvents.MatchQueueLeave.emit).not.toHaveBeenCalled();
  });
});