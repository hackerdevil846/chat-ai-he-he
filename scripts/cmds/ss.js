const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "ss",
    aliases: ["screenshot"],
    version: "2.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    shortDescription: "Get screenshot of website",
    longDescription: "Tumi ekta website er screenshot pete parba ei command diye.",
    category: "media",
    guide: "{pn} <website link>"
  },

  onStart: async function ({ message, args }) {
    try {
      const url = args.join(" ").trim();
      if (!url) return message.reply("⚠️ | Doya kore ekta valid URL dao.");

      if (!/^https?:\/\//i.test(url)) {
        return message.reply("❌ | URL https:// diye shuru hote hobe.");
      }

      const API_URL = `https://image.thum.io/get/fullpage/${encodeURIComponent(url)}`;

      // Fetch screenshot image as buffer
      const response = await axios.get(API_URL, { responseType: 'arraybuffer' });
      if (!response.data) throw new Error("Screenshot fetch failed");

      // Save temporarily
      const tempPath = path.join(__dirname, 'temp_screenshot.png');
      await fs.writeFile(tempPath, response.data);

      // Send message with attachment
      await message.reply({
        body: `✅ Screenshot of: ${url}`,
        attachment: fs.createReadStream(tempPath)
      });

      // Clean up temp file
      await fs.remove(tempPath);

    } catch (error) {
      console.error("Screenshot Error:", error);
      return message.reply("🚫 Screenshot toiri kora gelo na. Please try a valid link or try again later.");
    }
  }
};
