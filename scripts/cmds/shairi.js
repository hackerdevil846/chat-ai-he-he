const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');

module.exports = {
  config: {
    name: "shairi",
    version: "2.1.0",
    permission: 0,
    credits: "Asif",
    description: "Send a shairi video stream",
    prefix: true,
    category: "entertainment",
    usages: "",
    cooldowns: 10,
    dependencies: {
      "ytdl-core": ""
    }
  },

  onStart: async function ({ api, event }) {
    try {
      const videoURL = "https://youtu.be/v7v3TTWaaWU";
      const tempPath = path.join(__dirname, 'shairi_temp.mp4');
      
      // Notify user
      await api.sendMessage("📥 Downloading shairi video... Please wait 10-20 seconds!", event.threadID, event.messageID);

      // Get video info
      const info = await ytdl.getInfo(videoURL);
      const format = ytdl.chooseFormat(info.formats, { 
        quality: 'highest',
        filter: format => format.container === 'mp4' && format.hasVideo
      });

      if (!format) {
        throw new Error('❌ No suitable video format found');
      }

      // Create write stream
      const fileStream = fs.createWriteStream(tempPath);
      
      // Download with progress
      const videoStream = ytdl.downloadFromInfo(info, { format: format });
      let downloaded = 0;
      const totalBytes = format.contentLength;
      
      videoStream.on('data', (chunk) => {
        downloaded += chunk.length;
        const percent = Math.floor((downloaded / totalBytes) * 100);
        if (percent % 20 === 0) {
          api.sendMessage(`⬇️ Downloading... ${percent}% complete`, event.threadID);
        }
      });

      videoStream.pipe(fileStream);

      await new Promise((resolve, reject) => {
        fileStream.on('finish', resolve);
        fileStream.on('error', reject);
        videoStream.on('error', reject);
      });

      // Verify download - FIXED: Removed extra parenthesis
      if (!fs.existsSync(tempPath)) {
        throw new Error('❌ Video download failed');
      }

      // Send video
      await api.sendMessage({
        body: "🎬《 SHAIRI VIDEO 》\nEnjoy the video!",
        attachment: fs.createReadStream(tempPath)
      }, event.threadID, event.messageID);

      // Cleanup
      fs.unlink(tempPath, (err) => {
        if (err) console.error("Cleanup error:", err);
      });

    } catch (error) {
      console.error("Shairi Command Error:", error);
      api.sendMessage(`❌ Error: ${error.message || "Failed to process shairi video"}\n\nPlease try again later!`, event.threadID, event.messageID);
    }
  }
};
