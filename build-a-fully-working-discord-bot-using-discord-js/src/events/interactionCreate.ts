import { Client, Events, GatewayIntentBits, Interaction } from 'discord.js';
import { ping } from '../commands/ping';
import { help } from '../commands/help';
import { roll } from '../commands/roll';
import { avatar } from '../commands/avatar';

export const interactionCreate = (client: Client) => {
  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
      await ping(interaction);
    } else if (commandName === 'help') {
      await help(interaction);
    } else if (commandName === 'roll') {
      await roll(interaction);
    } else if (commandName === 'avatar') {
      await avatar(interaction);
    }
  });
};