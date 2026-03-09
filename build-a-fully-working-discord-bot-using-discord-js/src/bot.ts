// FILE: src/bot.ts
import { Client, GatewayIntentBits } from 'discord.js';
import { createCommandCollection } from './commands';
import { handleInteraction } from './handlers/interaction';
import { registerCommands } from './rest';
import { loadConfig } from './config/loader';
import { errorMiddleware } from './middleware/error';

export async function createBot() {
  // Load configuration
  const config = loadConfig();
  if (!config.token) {
    throw new Error('Discord bot token is not defined in the configuration.');
  }

  // Initialize Discord client
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  // Create command collection
  const commandCollection = createCommandCollection();

  // Register slash commands
  await registerCommands(client, commandCollection);

  // Set up interactionCreate event listener
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

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
  });

  // Log in to Discord with the bot token
  await client.login(config.token);

  console.log('Bot is online and ready to serve!');
}