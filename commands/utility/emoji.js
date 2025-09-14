const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('emoji')
		.setDescription('Replies with a custom emoji by name')
		.addStringOption(option =>
	  option
				.setName('name')
				.setDescription('The name of the emoji')
				.setRequired(true),
		),
	async execute(interaction) {
		const emojiName = interaction.options.getString('name');

		if (emojiName == 'mona') {
	  await interaction.reply('<:mona:1416499411772641420>');
		}
		else {
	  await interaction.reply(`❌ Could not find an emoji named "${emojiName}" in this server.`);
		}
	},
};
