const path = require('node:path');
const reloadCommand = require('../../../commands/utility/reload');

describe('reload command', () => {
	let interaction;
	let mockCommands;

	beforeEach(() => {
		mockCommands = new Map();
		interaction = {
			options: {
				getString: jest.fn(),
			},
			client: {
				commands: mockCommands,
			},
			reply: jest.fn().mockResolvedValue(),
		};
		jest.resetModules();
	});

	it('should reply with error if command does not exist', async () => {
		interaction.options.getString.mockReturnValue('nonexistent');

		await reloadCommand.execute(interaction);

		expect(interaction.reply).toHaveBeenCalledWith(
			'There is no command with name `nonexistent`!',
		);
	});

	it('should reload an existing command successfully', async () => {
		// Mock an existing command
		const fakeCommand = {
			category: 'utility',
			data: { name: 'ping' },
		};
		mockCommands.set('ping', fakeCommand);
		interaction.options.getString.mockReturnValue('ping');

		// Place a dummy module on disk
		const modulePath = path.resolve(__dirname, '../../../commands/utility/ping.js');
		jest.doMock(modulePath, () => ({
			category: 'utility',
			data: { name: 'ping' },
		}), { virtual: true });

		await reloadCommand.execute(interaction);

		expect(interaction.reply).toHaveBeenCalledWith('Command `ping` was reloaded!');
		expect(interaction.client.commands.get('ping')).toBeDefined();
	});

	it('should handle errors when reloading a command', async () => {
		const fakeCommand = {
			category: 'utility',
			data: { name: 'broken' },
		};
		mockCommands.set('broken', fakeCommand);
		interaction.options.getString.mockReturnValue('broken');

		const modulePath = path.resolve(__dirname, '../../../commands/utility/broken.js');
		jest.doMock(modulePath, () => {
			throw new Error('Syntax error in file');
		}, { virtual: true });

		// Silence error output
		jest.spyOn(console, 'error').mockImplementation(() => {
			/* empty */
		});

		await reloadCommand.execute(interaction);

		expect(interaction.reply).toHaveBeenCalledWith(
			expect.stringContaining('There was an error while reloading a command `broken`'),
		);
	});
});