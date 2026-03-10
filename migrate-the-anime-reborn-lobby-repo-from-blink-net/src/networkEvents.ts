import { defineNetworkEvent } from 'flamework';

export const NetworkEvents = {
  PlayerSync: defineNetworkEvent<{ playerId: string; state: Record<string, any> }>('player-sync'),
  MatchQueueJoin: defineNetworkEvent<{ playerId: string }>('match-queue-join'),
  MatchQueueLeave: defineNetworkEvent<{ playerId: string }>('match-queue-leave'),
  MatchStarted: defineNetworkEvent<{ matchId: string; players: string[] }>('match-started'),
  DailyRewardClaimed: defineNetworkEvent<{ playerId: string; reward: { type: string; amount: number } }>('daily-reward-claimed'),
  UnitCreated: defineNetworkEvent<{ playerId: string; unitId: string; unitType: string }>('unit-created'),
  ShopPurchase: defineNetworkEvent<{ playerId: string; itemId: string; quantity: number }>('shop-purchase'),
  Error: defineNetworkEvent<{ message: string; code: number }>('error'),
};