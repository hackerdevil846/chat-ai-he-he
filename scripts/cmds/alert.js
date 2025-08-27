const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "alert",
    version: "1.0.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "image",
    shortDescription: {
      en: "𝑮𝒆𝒏𝒆𝒓𝒂𝒕𝒆 𝒂𝒍𝒆𝒓𝒕 𝒊𝒎𝒂𝒈𝒆𝒔 𝒘𝒊𝒕𝒉 𝒄𝒖𝒔𝒕𝒐𝒎 𝒕𝒆𝒙𝒕"
    },
    longDescription: {
      en: "𝑪𝒓𝒆𝒂𝒕𝒆𝒔 𝒂𝒏 𝒂𝒍𝒆𝒓𝒕 𝒔𝒕𝒚𝒍𝒆 𝒊𝒎𝒂𝒈𝒆 𝒘𝒊𝒕𝒉 𝒚𝒐𝒖𝒓 𝒄𝒖𝒔𝒕𝒐𝒎 𝒕𝒆𝒙𝒕"
    },
    guide: {
      en: "{p}alert [text]"
    },
    cooldowns: 0
  },

  onStart: async function({ message, event, args }) {
    try {
      // Combine arguments and replace commas with double spaces
      let text = args.join(" ").replace(/,/g, "  ");
      
      if (!text) {
        return message.reply("𝑷𝒍𝒆𝒂𝒔𝒆 𝒂𝒅𝒅 𝒕𝒆𝒙𝒕 𝒇𝒐𝒓 𝒕𝒉𝒆 𝒂𝒍𝒆𝒓𝒕 (𝒆.𝒈., '𝒂𝒍𝒆𝒓𝒕 𝑯𝒆𝒍𝒍𝒐 𝑾𝒐𝒓𝒍𝒅')");
      }

      // Create cache directory if it doesn't exist
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const imagePath = path.join(cacheDir, `alert_${event.senderID}.png`);
      const encodedText = encodeURIComponent(text);
      const url = `https://api.popcat.xyz/alert?text=${encodedText}`;

      // Download the image
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(imagePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // Send the generated image
      await message.reply({
        body: "𝑯𝒆𝒓𝒆'𝒔 𝒚𝒐𝒖𝒓 𝒂𝒍𝒆𝒓𝒕 𝒊𝒎𝒂𝒈𝒆:",
        attachment: fs.createReadStream(imagePath)
      });

      // Clean up temporary file
      fs.unlinkSync(imagePath);

    } catch (error) {
      console.error("Error generating alert image:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒊𝒏𝒈 𝒕𝒉𝒆 𝒂𝒍𝒆𝒓𝒕 𝒊𝒎𝒂𝒈𝒆.");
    }
  }
};
