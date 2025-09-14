# Discboard Bot

A Discord bot that provides soundboard functionality with MP3 uploads, playback, and command hot-reloading.
---

## 🎛 Functionality

- 🎨 **Application Emojis**
  Uses custom emojis uploaded via the [Discord Developer Portal](https://discord.com/developers/applications) for reactions and responses.

- 🎵 **Upload MP3 Files**
  Upload `.mp3` files via a slash command. Files are stored on the server and organized into:
  - `sound/board` → soundboard effects
  - `sound/music` → music tracks

- ▶️ **Play Sounds**
  Play previously uploaded soundboard or music files directly into a voice channel.

- 🔄 **Hot Reload Commands**
  Reload slash command code on the fly without restarting the bot using the `/reload` command.

---

## 💻 How to host on your own

### ✅ Requirements
- [Node.js 22.x](https://nodejs.org/en/) (recommended; tested with Node.js 22)
- A Discord bot created via the [Developer Portal](https://discord.com/developers/applications)
- Discord server where you can add the bot

---

### 📥 Setup

1. **Clone or Fork the Repo**
   ```bash
    git clone https://github.com/psyborg0ne/discboard.git
    cd discboard
    ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**

   * Copy `example.env` → `.env`
   * Populate with your bot token and configuration:

     ```ini
        DISCORD_TOKEN=
        DISCORD_CLIENT_ID=
        DISCORD_GUILD_ID=
        DISCORD_VOICE_CHANNEL_ID=
        PORT=8989
        DEBUG=true
     ```
---

### 🔬 Run Tests

Before starting the bot, make sure everything is working:

```bash
npm test
```
---

### 🚀 Start the Application

Run the bot:

```bash
npm start
```

---

## 📂 Project Structure

```
discboard/
├── __tests__/          # Jest unit tests
├── commands/           # Slash command definitions
│   └── utility/        # Upload, reload, etc.
├── events/             # Discord.js event handlers
├── sound/              # Sound storage
│   ├── board/          # Soundboard mp3 files
│   └── music/          # Music mp3 files
├── .env.example        # Example environment file
├── prettier.config.js  # Prettier formatting configuration file
├── eslint.config.js    # ESLint linting configuration file
└── bot.js              # Entry point
```
---

## ⚡ Notes

* MP3 uploads are validated to prevent unsupported file types.
* Sounds are converted for playback using FFmpeg (ensure `ffmpeg` is installed on your system).
* Reloading commands does not restart the bot, only refreshes the specific command’s logic.
---

## 🛠 Contributing
Feel free to fork and submit pull requests. Linting (`eslint`) and formatting (`prettier`) are enforced via CI.