import { Interaction } from 'discord.js';

export const interactionCreate = async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    // Handle ping command
    await interaction.reply('Pong!');
  } else if (commandName === 'help') {
    // Handle help command
    await interaction.reply('Available commands: /ping, /help, /roll, /avatar');
  } else if (commandName === 'roll') {
    // Handle roll command
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    await interaction.reply(`You rolled a ${diceRoll}!`);
  } else if (commandName === 'avatar') {
    // Handle avatar command
    if (interaction.options.getUser('user')) {
      const user = interaction.options.getUser('user');
      await interaction.reply(user.displayAvatarURL());
    } else {
      await interaction.reply(interaction.user.displayAvatarURL());
    }
  }
};