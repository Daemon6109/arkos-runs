import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { createBot } from '../src/bot';
import { Client, GatewayIntentBits } from 'discord.js';
import { loadConfig } from '../src/config/loader';

describe('Bot Initialization and Event Handling', () => {
  let client: Client;

  beforeAll(async () => {
    // Mock the loadConfig function to return a valid configuration
    const mockLoadConfig = jest.fn(() => ({
      token: 'mock-token',
    }));
    jest.mock('../src/config/loader', () => ({
      loadConfig: mockLoadConfig,
    }));

    // Initialize the bot
    client = await createBot();
  });

  afterAll(() => {
    // Clean up the client
    if (client) {
      client.destroy();
    }
  });

  it('should initialize the Discord client with the correct intents', () => {
    expect(client.options.intents).toEqual([
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ]);
  });

  it('should register slash commands', async () => {
    // Mock the registerCommands function
    const mockRegisterCommands = jest.fn();
    jest.mock('../src/rest', () => ({
      registerCommands: mockRegisterCommands,
    }));

    // Reinitialize the bot to apply the mock
    client = await createBot();

    // Check if registerCommands was called
    expect(mockRegisterCommands).toHaveBeenCalledWith(client, expect.anything());
  });

  it('should handle interactionCreate event', async () => {
    // Mock the handleInteraction function
    const mockHandleInteraction = jest.fn();
    jest.mock('../src/handlers/interaction', () => ({
      handleInteraction: mockHandleInteraction,
    }));

    // Reinitialize the bot to apply the mock
    client = await createBot();

    // Simulate an interactionCreate event
    const interaction = {
      isChatInputCommand: jest.fn().mockReturnValue(true),
      commandName: 'test-command',
    };
    client.emit('interactionCreate', interaction);

    // Check if handleInteraction was called
    expect(mockHandleInteraction).toHaveBeenCalledWith(interaction);
  });
});