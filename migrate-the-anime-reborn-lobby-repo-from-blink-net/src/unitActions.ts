import { NetworkEvents } from './networkEvents';

interface CreateUnitAction {
  playerId: string;
  unitType: string;
}

export class UnitActionHandler {
  private validUnitTypes = ['swordsman', 'archer', 'mage', 'ninja'];
  private unitCosts: Record<string, number> = {
    swordsman: 100,
    archer: 150,
    mage: 200,
    ninja: 250,
  };

  handleCreateUnit(action: CreateUnitAction): void {
    const { playerId, unitType } = action;

    // Validation phase
    if (!this.isValidUnitType(unitType)) {
      throw new Error(`Invalid unit type: ${unitType}`);
    }

    const playerState = PlayerSyncSystem.getPlayerState(playerId);
    if (!playerState) {
      throw new Error(`Player ${playerId} not found`);
    }

    if (!playerState.units) {
      playerState.units = [];
    }

    const cost = this.unitCosts[unitType];
    if (playerState.coins < cost) {
      throw new Error(`Insufficient coins. Required: ${cost}, Available: ${playerState.coins}`);
    }

    // Execution phase
    playerState.coins -= cost;
    playerState.units.push({
      id: this.generateUnitId(),
      type: unitType,
      level: 1,
      health: 100,
    });

    PlayerSyncSystem.updatePlayerState(playerId, playerState);

    // Event emission
    NetworkEvents.UnitCreated.send({
      playerId,
      unitId: this.generateUnitId(),
      unitType,
    });
  }

  private isValidUnitType(unitType: string): boolean {
    return this.validUnitTypes.includes(unitType);
  }

  private generateUnitId(): string {
    return `unit-${crypto.randomUUID()}`;
  }
}

export { UnitActionHandler };