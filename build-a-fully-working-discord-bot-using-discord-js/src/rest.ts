import { REST, Routes, APIApplicationCommand } from 'discord.js';
import { loadConfig } from './config/loader';
import { CommandRegistry } from './commands/index';

/**
 * Registers slash commands to the Discord API.
 * @param commands - The command registry containing all commands to register.
 * @returns A promise that resolves when all commands are registered.
 */
export async function registerCommands(commands: CommandRegistry): Promise<void> {
  const config = loadConfig();
  const rest = new REST({ version: '10' }).setToken(config.DISCORD_BOT_TOKEN);

  const commandData: APIApplicationCommand[] = Array.from(commands.values()).map(command => command.data.toJSON());

  try {
    console.log('Started refreshing application (/) commands.');

    // The put method is used to fully refresh all commands in the guild with the current set
    await rest.put(
      Routes.applicationCommands(config.DISCORD_CLIENT_ID),
      { body: commandData },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}