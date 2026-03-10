import { NetworkEvents } from './networkEvents';
import { MatchQueueManager } from './matchQueue';

class MatchmakingCommand {
  execute(playerId: string, action: 'join' | 'leave') {
    if (action === 'join') {
      const isInQueue = MatchQueueManager.isInQueue(playerId);
      if (isInQueue) {
        console.warn(`Player ${playerId} already in match queue`);
        return;
      }
      MatchQueueManager.joinQueue(playerId);
      NetworkEvents.MatchQueueJoin.emit({ playerId });
    } else if (action === 'leave') {
      const wasInQueue = MatchQueueManager.leaveQueue(playerId);
      if (!wasInQueue) {
        console.warn(`Player ${playerId} not in match queue`);
        return;
      }
      NetworkEvents.MatchQueueLeave.emit({ playerId });
    } else {
      console.error(`Invalid matchmaking action: ${action}`);
    }
  }
}

export { MatchmakingCommand };