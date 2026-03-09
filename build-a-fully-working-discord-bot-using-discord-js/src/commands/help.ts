import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export const help = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays a list of available commands'),
  async execute(interaction: ChatInputCommandInteraction) {
    const commands = [
      '/ping - Check the bot\'s latency',
      '/help - Display a list of available commands',
      '/roll - Roll a dice',
      '/avatar - Display your avatar',
    ];

    await interaction.reply({
      content: `Available commands:\n${commands.join('\n')}`,
      ephemeral: true,
    });
  },
};