const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "allah",
    version: "1.0.3",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "islamic",
    shortDescription: {
      en: "𝑺𝒆𝒏𝒅 𝑰𝒔𝒍𝒂𝒎𝒊𝒄 𝒕𝒆𝒙𝒕 𝑮𝑰𝑭𝒔 𝒘𝒊𝒕𝒉 𝒊𝒏𝒔𝒑𝒊𝒓𝒂𝒕𝒊𝒐𝒏𝒂𝒍 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔"
    },
    longDescription: {
      en: "𝑺𝒉𝒂𝒓𝒆𝒔 𝑰𝒔𝒍𝒂𝒎𝒊𝒄 𝑮𝑰𝑭𝒔 𝒘𝒊𝒕𝒉 𝒊𝒏𝒔𝒑𝒊𝒓𝒂𝒕𝒊𝒐𝒏𝒂𝒍 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔 𝒂𝒏𝒅 𝒓𝒆𝒎𝒊𝒏𝒅𝒆𝒓𝒔"
    },
    guide: {
      en: "{p}allah"
    },
    cooldowns: 5
  },

  onStart: async function({ message, event }) {
    try {
      // Create cache directory if needed
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
      const cachePath = path.join(cacheDir, `allah_${Date.now()}.gif`);
      
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
      await message.reply({
        body: "🕌 الله أكبر - Allahu Akbar 🕌\n" +
              "𝑮𝒐𝒅 𝒊𝒔 𝒕𝒉𝒆 𝑮𝒓𝒆𝒂𝒕𝒆𝒔𝒕\n\n" +
              "𝑴𝒂𝒚 𝒕𝒉𝒊𝒔 𝒓𝒆𝒎𝒊𝒏𝒅𝒆𝒓 𝒔𝒕𝒓𝒆𝒏𝒈𝒕𝒉𝒆𝒏 𝒚𝒐𝒖𝒓 𝒇𝒂𝒊𝒕𝒉 𝒂𝒏𝒅 𝒃𝒓𝒊𝒏𝒈 𝒚𝒐𝒖 𝒑𝒆𝒂𝒄𝒆. ✨",
        attachment: fs.createReadStream(cachePath)
      });

      // Clean up after sending
      if (fs.existsSync(cachePath)) {
        fs.unlinkSync(cachePath);
      }
      
    } catch (error) {
      console.error("Allah Command Error:", error);
      
      // Fallback message if GIF fails
      await message.reply({
        body: "🕌 الله أكبر - Allahu Akbar 🕌\n" +
              "𝑮𝒐𝒅 𝒊𝒔 𝒕𝒉𝒆 𝑮𝒓𝒆𝒂𝒕𝒆𝒔𝒕\n\n" +
              "𝑴𝒂𝒚 𝒕𝒉𝒊𝒔 𝒓𝒆𝒎𝒊𝒏𝒅𝒆𝒓 𝒔𝒕𝒓𝒆𝒏𝒈𝒕𝒉𝒆𝒏 𝒚𝒐𝒖𝒓 𝒇𝒂𝒊𝒕𝒉.\n\n" +
              "❌ 𝑪𝒐𝒖𝒍𝒅 𝒏𝒐𝒕 𝒍𝒐𝒂𝒅 𝑮𝑰𝑭, 𝒃𝒖𝒕 𝒕𝒉𝒆 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒓𝒆𝒎𝒂𝒊𝒏𝒔. 📿"
      });
    }
  }
};
