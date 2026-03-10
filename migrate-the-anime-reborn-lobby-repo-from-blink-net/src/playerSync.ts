import { flamework } from 'flamework';
import { NetworkEvents } from './networkEvents';

@flamework.system()
export class PlayerSyncSystem {
  private playerStates = new Map<string, Record<string, any>>();

  constructor() {
    NetworkEvents.PlayerSync.subscribe(this.handlePlayerSync);
  }

  private handlePlayerSync = ({ playerId, state }: { playerId: string; state: Record<string, any> }) => {
    // Update internal state tracking
    this.playerStates.set(playerId, { ...state });
    
    // Broadcast updated state to all clients
    NetworkEvents.PlayerSync.sendToAllClients({ playerId, state });
  };

  // Public method for external systems to access player state
  public getPlayerState(playerId: string): Record<string, any> | undefined {
    return this.playerStates.get(playerId);
  }
}

export { PlayerSyncSystem };