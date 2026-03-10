import { NetworkEvents } from './networkEvents';
import { singleton } from 'flamework';

@singleton
export class MatchQueueManager {
  private queue: { playerId: string; priority: number }[] = [];

  constructor() {
    NetworkEvents.MatchQueueJoin.on(this.handleJoinQueue);
    NetworkEvents.MatchQueueLeave.on(this.handleLeaveQueue);
  }

  private handleJoinQueue = (data: { playerId: string }): void => {
    const priority = this.calculatePriority(data.playerId);
    this.queue.push({ playerId: data.playerId, priority });
    this.queue.sort((a, b) => b.priority - a.priority);
    this.checkForMatches();
  };

  private handleLeaveQueue = (data: { playerId: string }): void => {
    this.queue = this.queue.filter(item => item.playerId !== data.playerId);
    this.checkForMatches();
  };

  private calculatePriority(playerId: string): number {
    // Priority calculation logic
    return 1; // Placeholder
  }

  private checkForMatches(): void {
    // Matching logic
  }
}