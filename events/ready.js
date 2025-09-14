const { Events } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, NoSubscriberBehavior } = require('@discordjs/voice');
const { Readable } = require('stream');
require('dotenv').config();

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		// Replace with your guild and voice channel IDs
		const GUILD_ID = process.env.DISCORD_GUILD_ID;
		const VOICE_CHANNEL_ID = process.env.DISCORD_VOICE_CHANNEL_ID;

		const guild = client.guilds.cache.get(GUILD_ID);
		if (!guild) return console.error('Guild not found');

		const channel = guild.channels.cache.get(VOICE_CHANNEL_ID);
		if (!channel || !channel.isVoiceBased()) return console.error('Voice channel not found');

		// Join the voice channel
		const connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: guild.id,
			adapterCreator: guild.voiceAdapterCreator,
			selfDeaf: false,
			selfMute: false,
		});

		// Create a silent audio player to stay connected
		const player = createAudioPlayer({
			behaviors: { noSubscriber: NoSubscriberBehavior.Play },
		});

		connection.subscribe(player);

		// Play a silent buffer to prevent auto-disconnect
		const silent = new Readable({
			read() {
				this.push(Buffer.alloc(48000 * 2 * 2));
				this.push(null);
			},
		});

		const resource = createAudioResource(silent, { inputType: StreamType.Raw });
		player.play(resource);

		client.persistentConnection = connection;
		client.persistentPlayer = player;

		console.log('Bot is now active in the voice channel.');
	},
};