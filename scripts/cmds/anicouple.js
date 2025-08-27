const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "anicouple",
    aliases: [],
    version: "1.0.6",
    author: "Asif",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Send random anime couple photos"
    },
    longDescription: {
      en: "Sends random anime couple images from waifu.im API"
    },
    category: "media",
    guide: {
      en: "{p}anicouple"
    }
  },

  onStart: async function({ api, event }) {
    try {
      // Send initial processing message
      const processingMsg = await api.sendMessage(
        "⏳ Fetching anime couple for you...", 
        event.threadID,
        event.messageID
      );

      // Get random anime couple image from API
      const response = await axios.get("https://api.waifu.im/random/?selected_tags=couple");
      const imgUrl = response.data.images[0].url;
      
      // Set up cache path
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
      const imgPath = path.join(cacheDir, 'anicouple.jpg');
      const writer = fs.createWriteStream(imgPath);
      
      // Download the image
      const imgResponse = await axios({
        method: 'GET',
        url: imgUrl,
        responseType: 'stream',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      imgResponse.data.pipe(writer);
      
      // Wait for download to complete
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // Send the image
      await api.sendMessage({
        body: "💑 Here's your anime couple!",
        attachment: fs.createReadStream(imgPath)
      }, event.threadID, event.messageID);
      
      // Clean up processing message and image file
      api.unsendMessage(processingMsg.messageID);
      fs.unlinkSync(imgPath);
      
    } catch (error) {
      console.error("Anicouple Error:", error);
      api.sendMessage(
        "❌ Failed to fetch anime couple. Please try again later.", 
        event.threadID, 
        event.messageID
      );
    }
  }
};
