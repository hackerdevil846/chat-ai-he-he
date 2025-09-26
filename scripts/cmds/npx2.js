const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "emojiReact2",
    aliases: ["er2"],
    version: "1.0.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "𝑭𝒖𝒏 𝒓𝒆𝒂𝒄𝒕𝒊𝒐𝒏 𝒄𝒐𝒎𝒎𝒂𝒏𝒅"
    },
    longDescription: {
      en: "𝑹𝒆𝒔𝒑𝒐𝒏𝒅𝒔 𝒕𝒐 𝒆𝒎𝒐𝒋𝒊𝒔 𝒘𝒊𝒕𝒉 𝒇𝒖𝒏 𝒗𝒊𝒅𝒆𝒐𝒔"
    },
    guide: {
      en: "𝑼𝒔𝒆 𝒆𝒎𝒐𝒋𝒊𝒔: 🥰 🤩 😍"
    },
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event }) {
    // Dependency check
    try {
      if (!axios) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑎𝑥𝑖𝑜𝑠");
      if (!fs) throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑦: 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎");
      
      api.sendMessage(
        "🖤 𝐸𝑚𝑜𝑗𝑖𝑅𝑒𝑎𝑐𝑡2 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑖𝑠 𝑎𝑐𝑡𝑖𝑣𝑒! 💫\n𝑆𝑒𝑛𝑑 🥰, 🤩, 𝑜𝑟 😍 𝑡𝑜 𝑔𝑒𝑡 𝑎 𝑠𝑝𝑒𝑐𝑖𝑎𝑙 𝑣𝑖𝑑𝑒𝑜",
        event.threadID,
        event.messageID
      );
      
    } catch (error) {
      return api.sendMessage(`❌ ${error.message}`, event.threadID, event.messageID);
    }
  },

  onChat: async function({ api, event }) {
    try {
      const content = event.body ? event.body : '';
      
      // Emojis to trigger the response
      const triggerEmojis = ["🥰", "🤩", "😍"];
      
      // Check if the message starts with any of the trigger emojis
      const shouldRespond = triggerEmojis.some(emoji => content.startsWith(emoji));
      
      if (shouldRespond) {
        // Video URLs (same as original)
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
        
        const videoPath = path.join(cacheDir, `emojireact_${Date.now()}.mp4`);
        
        // Download the video using axios
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
        api.sendMessage({
          body: "🖤🥀 𝐻𝑒𝑟𝑒'𝑠 𝑎 𝑠𝑝𝑒𝑐𝑖𝑎𝑙 𝑐𝑙𝑖𝑝 𝑓𝑜𝑟 𝑦𝑜𝑢! 💫",
          attachment: fs.createReadStream(videoPath)
        }, event.threadID, event.messageID, () => {
          // Clean up after sending
          setTimeout(() => {
            try {
              fs.unlinkSync(videoPath);
            } catch (e) {}
          }, 5000);
        });
      }
      
    } catch (error) {
      console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝐸𝑚𝑜𝑗𝑖𝑅𝑒𝑎𝑐𝑡2:", error);
    }
  }
};
