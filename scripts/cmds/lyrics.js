const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "lyrics",
    version: "2.2.1",
    hasPermssion: 0, // Corrected spelling (two 's')
    credits: "Asif",
    description: "Fetch song lyrics with album artwork and detailed information",
    category: "music", // Fixed category
    usages: "lyrics [song name]",
    cooldowns: 20,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    },
    envConfig: {
      apiUrl: "https://lyrics-finder.august-api.repl.co/search?q="
    }
  },

  onStart: async function({ api, event, args, config }) {
    try {
      const { threadID, messageID } = event;
      const songName = args.join(" ");
      
      // Check if user provided a song name
      if (!songName) {
        return api.sendMessage("🎵 Please enter a song name\nExample: !lyrics Shape of You", threadID, messageID);
      }

      // Send searching message
      api.sendMessage(`🔍 Searching lyrics for "${songName}"...`, threadID, messageID);

      // Fetch lyrics data from API
      const apiUrl = config.envConfig.apiUrl + encodeURIComponent(songName);
      const { data } = await axios.get(apiUrl, { timeout: 10000 });
      
      // Check if valid data was returned
      if (!data || !data.title || !data.lyrics) {
        return api.sendMessage("❌ No lyrics found for this song. Please try another title.", threadID, messageID);
      }

      // Create cache directory if not exists
      const cacheDir = path.join(__dirname, 'cache', 'lyrics');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Download album artwork
      const imagePath = path.join(cacheDir, `lyrics_${Date.now()}.jpg`);
      try {
        const imageResponse = await axios.get(data.image, { 
          responseType: 'arraybuffer',
          timeout: 10000
        });
        fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));
      } catch (imageError) {
        console.error("Album art download error:", imageError);
        return api.sendMessage("❌ Failed to download album artwork. Showing lyrics without image.", threadID, messageID);
      }

      // Format message
      const messageBody = 
        `🎤 Title: ${data.title}\n` +
        `👤 Artist: ${data.artist || 'Unknown'}\n` +
        `💽 Album: ${data.album || 'Unknown'}\n` +
        `📅 Release Date: ${data.release_date || 'Unknown'}\n\n` +
        `📝 Lyrics:\n${data.lyrics.slice(0, 1800)}` + // Truncate long lyrics
        (data.lyrics.length > 1800 ? '...' : '') + // Add ellipsis if truncated
        `\n\nℹ️ Powered by: Asif Mahmud`;

      // Send results
      await api.sendMessage({
        body: messageBody,
        attachment: fs.createReadStream(imagePath)
      }, threadID, () => {
        // Clean up image file after sending
        try {
          fs.unlinkSync(imagePath);
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError);
        }
      }, messageID);

    } catch (error) {
      console.error("Lyrics command error:", error);
      api.sendMessage("❌ An error occurred while fetching lyrics. Please try again later.", threadID, messageID);
    }
  }
};
