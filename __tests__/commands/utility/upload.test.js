const fs = require('fs');
const fetch = require('node-fetch');
const uploadCommand = require('../../../commands/utility/upload');

jest.mock('fs');
jest.mock('node-fetch', () => jest.fn());

// Mock interaction factory
function createMockInteraction({ fileName = 'sound.mp3', fileUrl = 'http://example.com/sound.mp3', category = 'sound/board', newName = 'uploaded' } = {}) {
	return {
		options: {
			getAttachment: jest.fn().mockReturnValue({ name: fileName, url: fileUrl }),
			getString: jest.fn((key) => {
				if (key === 'category') return category;
				if (key === 'filename') return newName;
				return null;
			}),
		},
		reply: jest.fn(),
	};
}

describe('upload command', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should reject non-mp3 files', async () => {
		const interaction = createMockInteraction({ fileName: 'notaudio.txt' });

		await uploadCommand.execute(interaction);

		expect(interaction.reply).toHaveBeenCalledWith({
			content: '❌ Only .mp3 files are allowed.',
			ephemeral: true,
		});
	});

	it('should save a valid mp3 file', async () => {
		const interaction = createMockInteraction();

		// Mock fetch returning a buffer
		const fakeBuffer = Buffer.from('fake-mp3-data');
		fetch.mockResolvedValue({
			arrayBuffer: jest.fn().mockResolvedValue(fakeBuffer),
		});

		// Mock fs.existsSync
		fs.existsSync.mockReturnValue(true);
		fs.writeFileSync.mockImplementation(() => {
			/* empty */
		});

		await uploadCommand.execute(interaction);

		expect(fetch).toHaveBeenCalledWith('http://example.com/sound.mp3');
		expect(fs.writeFileSync).toHaveBeenCalledWith(
			expect.stringMatching(/uploaded\.mp3$/),
			expect.any(Buffer),
		);
		expect(interaction.reply).toHaveBeenCalledWith({
			content: expect.stringContaining('✅ Uploaded'),
			ephemeral: true,
		});
	});

	it('should create directory if missing', async () => {
		const interaction = createMockInteraction();

		fetch.mockResolvedValue({
			arrayBuffer: jest.fn().mockResolvedValue(Buffer.from('fake-mp3')),
		});

		fs.existsSync.mockReturnValue(false);
		fs.mkdirSync.mockImplementation(() => {
			/* empty */
		});
		fs.writeFileSync.mockImplementation(() => {
			/* empty */
		});

		await uploadCommand.execute(interaction);

		expect(fs.mkdirSync).toHaveBeenCalledWith(
			expect.stringContaining('sound/board'),
			{ recursive: true },
		);
	});

	it('should handle fetch/write errors gracefully', async () => {
		const interaction = createMockInteraction();

		fetch.mockRejectedValue(new Error('Network fail'));

		await uploadCommand.execute(interaction);

		expect(interaction.reply).toHaveBeenCalledWith({
			content: '❌ Failed to upload the file.',
			ephemeral: true,
		});
	});
});