import { defineCommand } from 'flamework';
import { NetworkEvents } from './networkEvents';
import { UnitActionHandler } from './unitActions';

export const CreatesCommand = defineCommand({
  name: 'creates',
  description: 'Initialize a new unit for the player',
  parameters: {
    unitType: {
      type: 'string',
      required: true,
      description: 'Type of unit to create',
    },
  },
  execute: async (context) => {
    const { playerId, parameters } = context;
    const { unitType } = parameters;

    try {
      const unitActionHandler = new UnitActionHandler();
      unitActionHandler.handleCreateUnit({ playerId, unitType });
      
      return {
        message: `Created ${unitType} unit successfully`,
      };
    } catch (error) {
      return {
        error: error.message || 'Failed to create unit',
      };
    }
  }
});