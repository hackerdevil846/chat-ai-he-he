const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "npx2",
    version: "1.0.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "𝑭𝒖𝒏 𝒓𝒆𝒂𝒄𝒕𝒊𝒐𝒏 𝒄𝒐𝒎𝒎𝒂𝒏𝒅"
    },
    longDescription: {
      en: "𝑹𝒆𝒔𝒑𝒐𝒏𝒅𝒔 𝒕𝒐 𝒆𝒎𝒐𝒋𝒊𝒔 𝒘𝒊𝒕𝒉 𝒇𝒖𝒏 𝒗𝒊𝒅𝒆𝒐𝒔"
    },
    guide: {
      emoji: "🥰🤩😍"
    },
    cooldowns: 5
  },

  onChat: async function({ message, event }) {
    try {
      const content = event.body ? event.body.toLowerCase() : '';
      
      // Emojis to trigger the response
      const triggerEmojis = ["🥰", "🤩", "😍"];
      
      // Check if the message contains any of the trigger emojis
      const shouldRespond = triggerEmojis.some(emoji => content.includes(emoji.toLowerCase()));
      
      if (shouldRespond) {
        // Video URLs
        const videoUrls = [
          "https://i.imgur.com/LLucP15.mp4", 
          "https://i.imgur.com/DEBRSER.mp4"
        ];
        
        // Select random video
        const randomVideoUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];
        
        // Create cache directory if it doesn't exist
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir, { recursive: true });
        }
        
        const videoPath = path.join(cacheDir, `npx3_${Date.now()}.mp4`);
        
        // Download the video
        const response = await axios({
          method: 'GET',
          url: randomVideoUrl,
          responseType: 'stream'
        });
        
        const writer = fs.createWriteStream(videoPath);
        response.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });
        
        // Send the video response
        await message.reply({
          body: "🖤🥀",
          attachment: fs.createReadStream(videoPath)
        });
        
        // Clean up
        fs.unlinkSync(videoPath);
      }
      
    } catch (error) {
      console.error("Npx3 command error:", error);
    }
  }
};
