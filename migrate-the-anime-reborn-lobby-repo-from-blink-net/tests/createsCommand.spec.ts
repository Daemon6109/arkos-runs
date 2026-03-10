import { describe, it, expect } from "bun:test";
import { CreatesCommand } from "../src/createsCommand";
import { NetworkEvents } from "../src/networkEvents";

describe("CreatesCommand", () => {
  beforeEach(() => {
    // Clear any mocks or reset state if needed
  });

  it("should create a valid unit and emit UnitCreated event", () => {
    // Mock the send method of the UnitCreated event
    const sendMock = jest.fn();
    const originalSend = NetworkEvents.UnitCreated.send;
    NetworkEvents.UnitCreated.send = sendMock;

    // Execute the command with valid parameters
    const result = CreatesCommand("player123", "knight", 1);

    // Expectations
    expect(result).toBe(true);
    expect(sendMock).toHaveBeenCalledWith({
      playerId: "player123",
      unitId: expect.any(String),
      unitType: "knight",
    });

    // Restore original method
    NetworkEvents.UnitCreated.send = originalSend;
  });

  it("should reject invalid unit type", () => {
    const sendMock = jest.fn();
    const originalSend = NetworkEvents.UnitCreated.send;
    NetworkEvents.UnitCreated.send = sendMock;

    const result = CreatesCommand("player123", "invalid-unit", 1);

    expect(result).toBe(false);
    expect(sendMock).not.toHaveBeenCalled();

    NetworkEvents.UnitCreated.send = originalSend;
  });

  it("should fail when creating zero quantity", () => {
    const sendMock = jest.fn();
    const originalSend = NetworkEvents.UnitCreated.send;
    NetworkEvents.UnitCreated.send = sendMock;

    const result = CreatesCommand("player123", "knight", 0);

    expect(result).toBe(false);
    expect(sendMock).not.toHaveBeenCalled();

    NetworkEvents.UnitCreated.send = originalSend;
  });

  it("should fail when exceeding max unit limit", () => {
    const sendMock = jest.fn();
    const originalSend = NetworkEvents.UnitCreated.send;
    NetworkEvents.UnitCreated.send = sendMock;

    const result = CreatesCommand("player123", "knight", 1000); // Assuming 1000 is over the limit

    expect(result).toBe(false);
    expect(sendMock).not.toHaveBeenCalled();

    NetworkEvents.UnitCreated.send = originalSend;
  });
});