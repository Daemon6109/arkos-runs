import { DataStoreService, Players } from "@rbxts/services";

export interface RewardDistribution {
  lastClaimed: number;
}

export async function checkDailyRewards(player: Players.Player): Promise<boolean | undefined> {
  const store = DataStoreService.GetDataStore<RewardDistribution>("DailyRewards");
  let lastClaimedData: RewardDistribution | undefined;

  try {
    lastClaimedData = await store.GetAsync(player.UserId);
  } catch (e) {
    print(`Error retrieving daily reward data for ${player.Name}: ${e}`);
    return undefined;
  }

  const currentTime = DateTime.now().UnixTimestampSeconds();
  const secondsInDay = 24 * 60 * 60;

  if (!lastClaimedData) {
    const newData: RewardDistribution = { lastClaimed: currentTime };
    try {
      await store.SetAsync(player.UserId, newData);
    } catch (e) {
      print(`Error setting initial claim data for ${player.Name}: ${e}`);
      return undefined;
    }
    return true;
  }

  const timeSinceLastClaim = currentTime - lastClaimedData.lastClaimed;

  if (timeSinceLastClaim >= secondsInDay) {
    const updatedData: RewardDistribution = { ...lastClaimedData, lastClaimed: currentTime };
    try {
      await store.SetAsync(player.UserId, updatedData);
    } catch (e) {
      print(`Error updating claim data for ${player.Name}: ${e}`);
      return undefined;
    }
    return true;
  } else {
    return false;
  }
}