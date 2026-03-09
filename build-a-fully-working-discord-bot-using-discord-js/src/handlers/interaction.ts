import { CommandInteraction } from 'discord.js';
import { Command } from '../commands/types';
import { errorMiddleware } from '../middleware/error';

/**
 * Handles interactionCreate event for slash commands.
 * @param interaction - The interaction object from the interactionCreate event.
 */
export async function handleInteraction(interaction: CommandInteraction) {
  if (!interaction.isChatInputCommand()) return;

  const commandCollection = interaction.client.commands as Collection<string, Command>;
  const command = commandCollection.get(interaction.commandName);

  if (!command) {
    console.error(`Command ${interaction.commandName} not found.`);
    return;
  }

  try {
    await errorMiddleware(command.execute, interaction);
  } catch (error) {
    console.error(`Error executing command ${interaction.commandName}:`, error);
    await interaction.reply({
      content: 'There was an error executing this command.',
      ephemeral: true,
    });
  }
}