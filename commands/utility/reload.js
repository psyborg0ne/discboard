const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command.')
		.addStringOption(option =>
			option.setName('command')
				.setDescription('The command to reload.')
				.setRequired(true)),
	async execute(interaction) {
		const commandName = interaction.options.getString('command', true).toLowerCase();
		const command = interaction.client.commands.get(commandName);

		try {
			if (!command) {
				return interaction.reply(`There is no command with name \`${commandName}\`!`);
			}

			const commandPath = path.join(__dirname, '..', command.category, `${command.data.name}.js`);

			if (!commandPath) {
				return interaction.reply(`The command \`${commandName}\` does not have a valid file path!`);
			}

			delete require.cache[require.resolve(commandPath)];

	        const newCommand = require(commandPath);
	        interaction.client.commands.set(newCommand.data.name, newCommand);
	        await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
		}
		catch (error) {
	        console.error(error);
	        await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
		}
	},
};