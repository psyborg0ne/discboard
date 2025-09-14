const { SlashCommandBuilder } = require('discord.js');
const { createAudioResource, StreamType, AudioPlayerStatus } = require('@discordjs/voice');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('sound')
		.setDescription('Plays a sound from the sound/board folder in your voice channel')
		.addStringOption(option =>
			option
				.setName('name')
				.setDescription('The name of the sound file (without extension)')
				.setRequired(true),
		),
	async execute(interaction) {
		const soundName = interaction.options.getString('name');

		// Resolve sound file path
		const soundPath = path.join(__dirname, '..', '..', 'sound', 'board', `${soundName}.mp3`);
		if (!fs.existsSync(soundPath)) {
			return interaction.reply({
				content: `❌ Sound "${soundName}" not found in the board folder.`,
				ephemeral: true,
			});
		}

		// Make sure persistent player exists
		const player = interaction.client.persistentPlayer;
		const connection = interaction.client.persistentConnection;

		if (!player || !connection) {
			return interaction.reply({
				content: '❌ Bot is not connected to a voice channel yet!',
				ephemeral: true,
			});
		}

		// Create an audio resource from the file
		const resource = createAudioResource(soundPath, { inputType: StreamType.Arbitrary });
		player.play(resource);

		// Reply to user
		await interaction.reply({
			content: `▶️ Playing sound "${soundName}"!`,
			ephemeral: true,
		});

		// Optional logging
		player.once(AudioPlayerStatus.Idle, () => {
			console.log(`Finished playing "${soundName}".`);
		});

		// Handle errors
		player.once('error', error => {
			console.error(`Audio player error: ${error.message}`);
		});
	},
};
