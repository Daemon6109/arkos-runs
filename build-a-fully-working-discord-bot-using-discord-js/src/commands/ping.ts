import { CommandInteraction, MessageEmbed } from 'discord.js';

export const ping = async (interaction: CommandInteraction) => {
  try {
    const startTime = Date.now();
    await interaction.deferReply();
    const endTime = Date.now();
    const latency = endTime - startTime;

    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Ping Result')
      .setDescription(`Latency: ${latency}ms`);

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Error handling ping command:', error);
    await interaction.reply('Failed to get latency.');
  }
};