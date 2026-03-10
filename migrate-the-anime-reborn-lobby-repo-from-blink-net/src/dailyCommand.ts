import { defineCommand } from 'flamework';
import { NetworkEvents } from './networkEvents';
import { DailyRewardTracker, ShopSystem } from './shopRewards';

export const DailyCommand = defineCommand({
  name: 'daily',
  description: 'Claim your daily reward',
  execute: async (context) => {
    const playerId = context.player.id;
    
    // Check if player can claim daily reward
    if (DailyRewardTracker.hasClaimedToday(playerId)) {
      context.reply("You've already claimed your daily reward today!");
      return;
    }

    // Grant predefined daily reward
    const reward = DailyRewardTracker.DAILY_REWARD;
    ShopSystem.addPlayerBalance(playerId, reward.type, reward.amount);
    
    // Update tracking and broadcast event
    DailyRewardTracker.markAsClaimed(playerId);
    NetworkEvents.DailyRewardClaimed.sendToAll({
      playerId,
      reward: { type: reward.type, amount: reward.amount }
    });
    
    context.reply(`You claimed your daily reward: ${reward.amount} ${reward.type.toUpperCase()}!`);
  }
});