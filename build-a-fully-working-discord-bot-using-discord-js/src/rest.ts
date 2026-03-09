// FILE: src/rest.ts
import { REST, Routes } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import dotenv from 'dotenv';

dotenv.config();

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong!'),
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays a list of commands'),
  new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Rolls a dice'),
  new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Displays your avatar'),
].map(command => command.toJSON());

export const registerCommands = async (client: Client, commandCollection: any) => {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID!),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
};