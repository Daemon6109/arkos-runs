import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const roll = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll a dice with a specified number of sides')
    .addIntegerOption(option =>
      option
        .setName('sides')
        .setDescription('The number of sides on the dice')
        .setRequired(true)
        .setMinValue(1)
    ),
  async execute(interaction: CommandInteraction) {
    const sides = interaction.options.getInteger('sides', true);
    const result = Math.floor(Math.random() * sides) + 1;
    await interaction.reply(`You rolled a ${result} on a ${sides}-sided dice!`);
  },
};