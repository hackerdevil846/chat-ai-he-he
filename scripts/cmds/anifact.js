const axios = require('axios');
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "anifact",
    aliases: [],
    version: "1.0.2",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "𝑹𝒂𝒏𝒅𝒐𝒎 𝒂𝒏𝒊𝒎𝒆 𝒇𝒂𝒄𝒕𝒔 𝒘𝒊𝒕𝒉 𝒊𝒎𝒂𝒈𝒆𝒔"
    },
    longDescription: {
      en: "𝑮𝒆𝒕 𝒓𝒂𝒏𝒅𝒐𝒎 𝒂𝒏𝒊𝒎𝒆 𝒇𝒂𝒄𝒕𝒔 𝒂𝒄𝒄𝒐𝒎𝒑𝒂𝒏𝒊𝒆𝒅 𝒃𝒚 𝒊𝒎𝒂𝒈𝒆𝒔"
    },
    category: "𝒂𝒏𝒊𝒎𝒆",
    guide: {
      en: "{p}anifact"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      // Create cache directory if it doesn't exist
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
      const response = await axios.get('https://nekos.best/api/v2/neko');
      const imageUrl = response.data.results[0].url;
      const artistName = response.data.results[0].artist_name;
      const artistHref = response.data.results[0].artist_href;

      const imagePath = path.join(cacheDir, `anime_fact_${event.senderID}.png`);
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      
      fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, 'binary'));
      
      api.sendMessage({
        body: `🦄 𝑨𝒏𝒊𝒎𝒆 𝑭𝒂𝒄𝒕 𝒘𝒊𝒕𝒉 𝒊𝒎𝒂𝒈𝒆:\n🎨 Artist: ${artistName}\n🔗 Source: ${artistHref}`,
        attachment: fs.createReadStream(imagePath)
      }, event.threadID, (err) => {
        if (err) console.error(err);
        // Clean up the image file after sending
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }, event.messageID);
      
    } catch (error) {
      console.error(error);
      api.sendMessage("🔴 𝑬𝒓𝒓𝒐𝒓: 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒇𝒆𝒕𝒄𝒉 𝒂𝒏𝒊𝒎𝒆 𝒅𝒂𝒕𝒂 𝒐𝒓 𝒊𝒎𝒂𝒈𝒆", event.threadID, event.messageID);
    }
  }
};
