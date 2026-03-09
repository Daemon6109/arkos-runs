import { CommandInteraction, User } from 'discord.js';

export const avatar = async (interaction: CommandInteraction) => {
  const user: User = interaction.options.getUser('user') || interaction.user;
  const avatarURL = user.displayAvatarURL({ size: 256 });

  await interaction.reply({
    content: `Avatar of ${user.username}: ${avatarURL}`,
  });
};