const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const fetch = require('node-fetch');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('upload')
		.setDescription('Uploads an MP3 file to the sound/board folder')
		.addAttachmentOption(option =>
			option
				.setName('file')
				.setDescription('The MP3 file to upload')
				.setRequired(true),
		)
		.addStringOption(option =>
			option.setName('filename')
				.setDescription('The name of the file to upload')
				.setRequired(true),
		)
		.addStringOption(option =>
			option.setName('category')
				.setDescription('The sound category')
				.setRequired(true)
				.addChoices(
					{ name: 'Soundboard', value: 'sound/board' },
					{ name: 'Music', value: 'sound/music' },
				)),
	async execute(interaction) {
		const attachment = interaction.options.getAttachment('file');

		// Validate file type
		if (!attachment.name.endsWith('.mp3')) {
			return interaction.reply({ content: '❌ Only .mp3 files are allowed.', ephemeral: true });
		}

		try {
			// Download the attachment
			const response = await fetch(attachment.url);
			const buffer = await response.arrayBuffer();

			// Ensure the folder exists
			const folderPath = path.join(__dirname, '..', '..', interaction.options.getString('category'));
			if (!fs.existsSync(folderPath)) {
				fs.mkdirSync(folderPath, { recursive: true });
			}

			// Save the file
			const filePath = path.join(folderPath, `${interaction.options.getString('filename')}.mp3`);
			fs.writeFileSync(filePath, Buffer.from(buffer));

			await interaction.reply({ content: `✅ Uploaded "${attachment.name}" successfully!`, ephemeral: true });
		}
		catch (err) {
			console.error(err);
			await interaction.reply({ content: '❌ Failed to upload the file.', ephemeral: true });
		}
	},
};
