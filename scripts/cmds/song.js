const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "song",
    version: "1.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    shortDescription: "Youtube Song Downloader",
    longDescription: "Search korte YouTube e song ar tarpor download kore group e send kore.",
    category: "media",
    guide: "{pn} <song name>"
  },

  onStart: async function ({ event, api, args, message }) {
    try {
      const query = args.join(' ');
      if (!query) return message.reply('❌ Please provide a search query!');

      // Search request
      const searchResponse = await axios.get(`https://mostakim.onrender.com/mostakim/ytSearch?search=${encodeURIComponent(query)}`);
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      // Duration parser
      const parseDuration = (timestamp) => {
        const parts = timestamp.split(':').map(part => parseInt(part));
        let seconds = 0;
        if (parts.length === 3) {
          seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
          seconds = parts[0] * 60 + parts[1];
        }
        return seconds;
      };

      // Filter videos less than 10 min
      const filteredVideos = searchResponse.data.filter(video => {
        try {
          const totalSeconds = parseDuration(video.timestamp);
          return totalSeconds < 600;
        } catch {
          return false;
        }
      });

      if (filteredVideos.length === 0) {
        return message.reply('⚠ No short videos found (under 10 minutes)!');
      }

      // Select first valid result
      const selectedVideo = filteredVideos[0];
      const tempFilePath = path.join(__dirname, 'temp_audio.m4a');

      // Get download URL
      const apiResponse = await axios.get(`https://mostakim.onrender.com/m/sing?url=${selectedVideo.url}`);
      if (!apiResponse.data.url) throw new Error('No audio URL found in response');

      // Download file
      const writer = fs.createWriteStream(tempFilePath);
      const audioResponse = await axios({
        url: apiResponse.data.url,
        method: 'GET',
        responseType: 'stream'
      });

      audioResponse.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      // Send file to chat
      await message.reply({
        body: `🎧 Now playing: ${selectedVideo.title}\n⏱ Duration: ${selectedVideo.timestamp}`,
        attachment: fs.createReadStream(tempFilePath)
      });

      // Delete temp file
      fs.unlink(tempFilePath, (err) => {
        if (err) console.error(`Error deleting temp file: ${err.message}`);
      });

    } catch (error) {
      message.reply(`❌ Error: ${error.message}`);
    }
  }
};
