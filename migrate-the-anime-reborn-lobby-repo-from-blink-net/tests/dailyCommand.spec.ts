import { describe, it, expect } from "bun:test";
import { DailyCommand } from "../src/dailyCommand";
import { DailyRewardTracker, ShopSystem } from "../src/shopRewards";
import { NetworkEvents } from "../src/networkEvents";

vi.mock("../src/shopRewards", () => ({
  ShopSystem: {
    instance: {
      addReward: vi.fn(),
    },
  },
  DailyRewardTracker: {
    instance: {
      canClaim: vi.fn(),
      markClaimed: vi.fn(),
    },
  },
}));

describe("DailyCommand", () => {
  const mockPlayerId = "player-123";
  let emitMock: ReturnType<typeof vi["spyOn"]>;

  beforeEach(() => {
    vi.resetAllMocks();
    emitMock = vi.spyOn(NetworkEvents.DailyRewardClaimed, "emit");
  });

  it("should allow claiming daily reward if not claimed yet", async () => {
    (DailyRewardTracker.instance.canClaim as jest.Mock).mockResolvedValue(true);
    (DailyRewardTracker.instance.markClaimed as jest.Mock).mockResolvedValue();
    (ShopSystem.instance.addReward as jest.Mock).mockResolvedValue();

    await DailyCommand(mockPlayerId);

    expect(DailyRewardTracker.instance.canClaim).toHaveBeenCalledWith(mockPlayerId);
    expect(DailyRewardTracker.instance.markClaimed).toHaveBeenCalledWith(mockPlayerId);
    expect(ShopSystem.instance.addReward).toHaveBeenCalledWith(mockPlayerId, expect.objectContaining({ type: "daily" }));
    expect(emitMock).toHaveBeenCalledWith({ playerId: mockPlayerId, reward: expect.objectContaining({ type: "daily" }) });
  });

  it("should not allow claiming daily reward if already claimed", async () => {
    (DailyRewardTracker.instance.canClaim as jest.Mock).mockReturnValue(false);

    await DailyCommand(mockPlayerId);

    expect(DailyRewardTracker.instance.canClaim).toHaveBeenCalledWith(mockPlayerId);
    expect(DailyRewardTracker.instance.markClaimed).not.toHaveBeenCalled();
    expect(ShopSystem.instance.addReward).not.toHaveBeenCalled();
    expect(emitMock).not.toHaveBeenCalled();
  });
});