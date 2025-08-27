const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "anigen",
    aliases: ["animegen"],
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: "𝑮𝒆𝒏𝒆𝒓𝒂𝒕𝒆 𝒂𝒏𝒊𝒎𝒆 𝒊𝒎𝒂𝒈𝒆𝒔"
    },
    longDescription: {
      en: "𝑮𝒆𝒏𝒆𝒓𝒂𝒕𝒆 𝒂𝒏 𝒂𝒏𝒊𝒎𝒆 𝒊𝒎𝒂𝒈𝒆 𝒃𝒂𝒔𝒆𝒅 𝒐𝒏 𝒂 𝒑𝒓𝒐𝒎𝒑𝒕"
    },
    category: "𝗠𝗘𝗗𝗜𝗔",
    guide: {
      en: "{p}anigen [prompt]"
    }
  },

  onStart: async function ({ message, event, args }) {
    try {
      if (!args[0]) {
        return message.reply("🎨 𝑷𝒍𝒆𝒂𝒔𝒆 𝒑𝒓𝒐𝒗𝒊𝒅𝒆 𝒂 𝒑𝒓𝒐𝒎𝒑𝒕 𝒇𝒐𝒓 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒊𝒏𝒈 𝒂𝒏 𝒂𝒏𝒊𝒎𝒆 𝒊𝒎𝒂𝒈𝒆.\n\n𝑬𝒙𝒂𝒎𝒑𝒍𝒆: {p}anigen 𝒄𝒖𝒕𝒆 𝒂𝒏𝒊𝒎𝒆 𝒈𝒊𝒓𝒍 𝒘𝒊𝒕𝒉 𝒑𝒊𝒏𝒌 𝒉𝒂𝒊𝒓");
      }

      const userPrompt = args.join(" ");
      
      await message.reply("⏳ 𝑮𝒆𝒏𝒆𝒓𝒂𝒕𝒊𝒏𝒈 𝒂𝒏𝒊𝒎𝒆 𝒊𝒎𝒂𝒈𝒆... 𝒑𝒍𝒆𝒂𝒔𝒆 𝒘𝒂𝒊𝒕, 𝒊𝒕 𝒎𝒂𝒚 𝒕𝒂𝒌𝒆 𝒂 𝒎𝒐𝒎𝒆𝒏𝒕. ✨");

      // Create cache directory if it doesn't exist
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const imagePath = path.join(cacheDir, `anime_${Date.now()}.png`);
      const encodedPrompt = encodeURIComponent(userPrompt);
      const apiUrl = `https://t2i.onrender.com/kshitiz?prompt=${encodedPrompt}`;

      // Fetch the image from the API
      const response = await axios.get(apiUrl, { timeout: 30000 });

      if (!response.data || !response.data.imageUrl) {
        return message.reply("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒆 𝒊𝒎𝒂𝒈𝒆. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒘𝒊𝒕𝒉 𝒂 𝒅𝒊𝒇𝒇𝒆𝒓𝒆𝒏𝒕 𝒑𝒓𝒐𝒎𝒑𝒕.");
      }

      const imageUrl = response.data.imageUrl;

      // Download the image
      const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 30000
      });

      // Save the image to cache
      fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));

      // Send the generated image
      await message.reply({
        body: `✅ 𝑨𝒏𝒊𝒎𝒆 𝒊𝒎𝒂𝒈𝒆 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚!\n📝 𝑷𝒓𝒐𝒎𝒑𝒕: ${userPrompt}`,
        attachment: fs.createReadStream(imagePath)
      });

      // Clean up the temporary file
      fs.unlinkSync(imagePath);

    } catch (error) {
      console.error("Anigen command error:", error);
      
      if (error.code === 'ECONNABORTED') {
        await message.reply("❌ 𝑹𝒆𝒒𝒖𝒆𝒔𝒕 𝒕𝒊𝒎𝒆𝒅 𝒐𝒖𝒕. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒘𝒊𝒕𝒉 𝒂 𝒔𝒊𝒎𝒑𝒍𝒆𝒓 𝒑𝒓𝒐𝒎𝒑𝒕.");
      } else if (error.response?.status === 404) {
        await message.reply("❌ 𝑨𝑷𝑰 𝒆𝒏𝒅𝒑𝒐𝒊𝒏𝒕 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.");
      } else {
        await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒊𝒏𝒈 𝒕𝒉𝒆 𝒊𝒎𝒂𝒈𝒆. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏.");
      }
    }
  }
};
