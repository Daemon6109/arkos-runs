import { defineSystem, defineEvent } from 'flamework';
import { NetworkEvents } from './networkEvents';

// Define shop item types
export type ShopItemType = 'currency' | 'unit' | 'boost';

interface ShopItem {
  id: string;
  name: string;
  type: ShopItemType;
  cost: number;
  amount: number;
}

// Shop system implementation
const ShopSystem = defineSystem({
  name: 'ShopSystem',
  onInit() {
    // Initialize shop inventory
    this.items = [
      { id: 'currency_100', name: '100 Gold', type: 'currency', cost: 10, amount: 100 },
      { id: 'unit_sword', name: 'Sword Unit', type: 'unit', cost: 25, amount: 1 },
      { id: 'boost_x2', name: 'Double XP Boost', type: 'boost', cost: 50, amount: 1 }
    ];
  },
  onEvent(event, context) {
    if (event === NetworkEvents.ShopPurchase) {
      this.handlePurchase(context);
    }
  },
  items: [] as ShopItem[],
  handlePurchase: (context: { playerId: string; itemId: string; quantity: number }) => {
    const playerState = PlayerSyncSystem.getPlayerState(context.playerId);
    if (!playerState) {
      throw new Error(`Player ${context.playerId} not found`);
    }

    const item = ShopSystem.items.find(i => i.id === context.itemId);
    
    if (!item) {
      throw new Error(`Item ${context.itemId} not found in shop`);
    }

    const totalCost = item.cost * context.quantity;
    
    if (playerState.currency < totalCost) {
      throw new Error(`Insufficient funds. Need ${totalCost} gold`);
    }

    playerState.currency -= totalCost;
    
    switch (item.type) {
      case 'currency':
        playerState.currency += item.amount * context.quantity;
        break;
      case 'unit':
        if (!playerState.units) {
          playerState.units = [];
        }
        playerState.units.push({ id: item.id, count: context.quantity });
        break;
      case 'boost':
        if (!playerState.boosts) {
          playerState.boosts = [];
        }
        playerState.boosts.push({ id: item.id, expires: Date.now() + 86400000 }); // 24 hours
        break;
    }

    NetworkEvents.ShopPurchase.sendToPlayer(context.playerId, {
      success: true,
      item: item.id,
      quantity: context.quantity
    });
  }
});

// Daily reward tracking system
class DailyRewardTracker {
  private lastClaimTimes = new Map<string, number>(); // playerId -> timestamp
  public DAILY_REWARD = { type: 'currency', amount: 500 };
  private COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    // Initialize from persistent storage if available
  }

  hasClaimedToday(playerId: string): boolean {
    const lastClaim = this.lastClaimTimes.get(playerId) || 0;
    return Date.now() - lastClaim < this.COOLDOWN_MS;
  }

  markAsClaimed(playerId: string): void {
    this.lastClaimTimes.set(playerId, Date.now());
  }

  getLastClaimTime(playerId: string): number | null {
    const time = this.lastClaimTimes.get(playerId);
    return time ? time : null;
  }
}

export { ShopSystem, DailyRewardTracker };