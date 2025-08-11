const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "hot2",
    version: "1.0.0",
    role: 0,
    author: "Asif",
    description: "Random Islamic video",
    category: "islamic",
    usage: "hot2",
    example: "hot2",
    cooldown: 2
  },

  onStart: async function({ api, event }) {
    const { threadID, messageID } = event;
    const cacheDir = path.join(__dirname, 'cache');
    
    try {
      // Create cache directory if needed
      if (!fs.existsSync(cacheDir)) {
        await fs.mkdirp(cacheDir);
      }

      const islamicVideos = [
        "https://i.imgur.com/bFd7QRW.mp4",
        "https://i.imgur.com/4uhuwAA.mp4",
        "https://i.imgur.com/vfYOmHS.mp4",
        "https://i.imgur.com/wzR3OP7.mp4",
        "https://i.imgur.com/ka0pxxO.mp4",
        "https://i.imgur.com/zeqzgYJ.mp4",
        "https://i.imgur.com/uVBK5gc.mp4",
        "https://i.imgur.com/zSse6lu.mp4",
        "https://i.imgur.com/oBcryzJ.mp4",
        "https://i.imgur.com/yIViust.mp4",
        "https://i.imgur.com/vLcyKJ2.mp4",
        "https://i.imgur.com/6vGHjRM.mp4",
        "https://i.imgur.com/Nu5DcgN.mp4",
        "https://i.imgur.com/MwiTEUL.mp4",
        "https://i.imgur.com/tfePTdM.mp4",
        "https://i.imgur.com/HOSrfId.mp4",
        "https://i.imgur.com/GTxZZfN.mp4",
        "https://i.imgur.com/AaPoSEo.mp4",
        "https://i.imgur.com/08yfKpb.mp4",
        "https://i.imgur.com/xIi5ZjB.mp4",
        "https://i.imgur.com/FVtCcS4.mp4"
      ];

      // Send inspirational message first
      const islamicMessage = 
        "🌿 Islamic Video 🌿\n\n" +
        "💫 When darkness falls on the human heart,\n" +
        "Only Allah's light shows the way.\n\n" +
        "✨ We seek tawfiq to stay away from haram,\n" +
        "May Allah grant us all a halal life.\n\n" +
        "🌙 Whoever forgets Allah,\n" +
        "Forgets themselves.\n\n" +
        "🕋 Those who forget Allah in the name of love,\n" +
        "Never find true peace.\n\n" +
        "📖 Let's decorate life with the light of Quran,\n" +
        "Find peace with Allah's mercy.\n\n" +
        "🤲 Let us all return to the path of Allah,\n" +
        "And attain His mercy and forgiveness.";

      await api.sendMessage(islamicMessage, threadID, messageID);

      // Download the video
      await api.sendMessage("📥 Downloading Islamic video...", threadID, messageID);
      
      let videoSent = false;
      let attempts = 0;
      
      while (attempts < 3 && !videoSent) {
        try {
          attempts++;
          const randomIndex = Math.floor(Math.random() * islamicVideos.length);
          const randomVideo = islamicVideos[randomIndex];
          const videoPath = path.join(cacheDir, `islamic_video_${Date.now()}_${attempts}.mp4`);
          
          // Download video
          const response = await axios({
            method: 'GET',
            url: randomVideo,
            responseType: 'arraybuffer',
            timeout: 30000
          });
          
          // Save video to file
          await fs.writeFile(videoPath, Buffer.from(response.data, 'binary'));
          
          // Check if file exists and has content
          const stats = await fs.stat(videoPath);
          if (stats.size > 0) {
            // Send the video
            await api.sendMessage({
              body: "▬▬▬▬▬▬▬▬▬▬▬▬\n   Random Islamic Video\n▬▬▬▬▬▬▬▬▬▬▬▬",
              attachment: fs.createReadStream(videoPath)
            }, threadID);
            
            videoSent = true;
          } else {
            throw new Error("Downloaded empty file");
          }
          
          // Clean up
          await fs.unlink(videoPath);
          
        } catch (error) {
          console.error(`Attempt ${attempts} failed:`, error.message);
          if (attempts === 3) {
            throw new Error("Failed after 3 attempts");
          }
        }
      }

    } catch (error) {
      console.error("Hot2 command error:", error);
      return api.sendMessage("❌ Failed to process Islamic video. Please try again later.", threadID, messageID);
    }
  }
};
