const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "allah",
    version: "1.0.3",
    hasPermission: 0,
    credits: "Asif Developer",
    description: "Send Islamic text GIFs with inspirational messages",
    category: "image",
    usages: "allah",
    cooldowns: 5,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  // Added the required onStart function
  onStart: async function({ api, event }) {
    const { threadID, messageID } = event;
    const cacheDir = path.join(__dirname, "cache");
    let cachePath;
    
    try {
      // Create cache directory if needed
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
      cachePath = path.join(cacheDir, `allah_${Date.now()}.gif`);
      
      // GIF URLs collection
      const gifUrls = [
        "https://i.imgur.com/oV4VMvm.gif",
        "https://i.imgur.com/LvUF38x.gif",
        "https://i.imgur.com/r0ZE7lx.gif",
        "https://i.imgur.com/98PjVxg.gif",
        "https://i.imgur.com/7zLmJch.gif",
        "https://i.imgur.com/C2a3Cj3.gif",
        "https://i.imgur.com/DHoZ9A1.gif",
        "https://i.imgur.com/2eewmJm.gif",
        "https://i.imgur.com/ScGCmKE.gif",
        "https://i.imgur.com/U07Yd3U.gif"
      ];

      // Select random GIF
      const randomUrl = gifUrls[Math.floor(Math.random() * gifUrls.length)];
      
      // Download GIF
      const response = await axios.get(randomUrl, {
        responseType: "arraybuffer",
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      // Save to cache
      fs.writeFileSync(cachePath, Buffer.from(response.data, "binary"));
      
      // Send message with GIF
      await api.sendMessage({
        body: "الله أكبر - Allahu Akbar\n" +
              "God is the Greatest\n\n" +
              "May this reminder strengthen your faith.",
        attachment: fs.createReadStream(cachePath)
      }, threadID, messageID);
      
      // Clean up after sending
      if (fs.existsSync(cachePath)) {
        fs.unlinkSync(cachePath);
      }
      
    } catch (error) {
      console.error("Allah Command Error:", error);
      
      // Clean up if file exists
      if (cachePath && fs.existsSync(cachePath)) {
        fs.unlinkSync(cachePath);
      }
      
      api.sendMessage("❌ Failed to send Islamic GIF. Please try again later.", threadID, messageID);
    }
  }
};
