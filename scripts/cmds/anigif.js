const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "anigif",
    aliases: ["aigif"],
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: "𝑮𝒆𝒏𝒆𝒓𝒂𝒕𝒆 𝒂𝒏 𝒂𝒏𝒊𝒎𝒆 𝑮𝑰𝑭 𝒃𝒂𝒔𝒆𝒅 𝒐𝒏 𝒂 𝒑𝒓𝒐𝒎𝒑𝒕"
    },
    longDescription: {
      en: "𝑮𝒆𝒏𝒆𝒓𝒂𝒕𝒆 𝒂𝒏 𝒂𝒏𝒊𝒎𝒆 𝑮𝑰𝑭 𝒃𝒂𝒔𝒆𝒅 𝒐𝒏 𝒂 𝒕𝒆𝒙𝒕 𝒑𝒓𝒐𝒎𝒑𝒕"
    },
    category: "media",
    guide: {
      en: "{p}anigif [prompt]"
    }
  },

  onStart: async function({ message, event, args }) {
    try {
      if (!args[0]) {
        return message.reply("🎨 𝑷𝒍𝒆𝒂𝒔𝒆 𝒑𝒓𝒐𝒗𝒊𝒅𝒆 𝒂 𝒑𝒓𝒐𝒎𝒑𝒕 𝒇𝒐𝒓 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒊𝒏𝒈 𝒂𝒏 𝒂𝒏𝒊𝒎𝒆 𝑮𝑰𝑭.\n\n𝑬𝒙𝒂𝒎𝒑𝒍𝒆: {p}anigif 𝒄𝒖𝒕𝒆 𝒂𝒏𝒊𝒎𝒆 𝒈𝒊𝒓𝒍 𝒅𝒂𝒏𝒄𝒊𝒏𝒈");
      }

      const userPrompt = args.join(" ");
      
      await message.reply("⏳ 𝑮𝒆𝒏𝒆𝒓𝒂𝒕𝒊𝒏𝒈 𝒂𝒏𝒊𝒎𝒆 𝑮𝑰𝑭... 𝒑𝒍𝒆𝒂𝒔𝒆 𝒘𝒂𝒊𝒕, 𝒊𝒕 𝒎𝒂𝒚 𝒕𝒂𝒌𝒆 𝒂 𝒎𝒐𝒎𝒆𝒏𝒕. ✨");

      // Create cache directory if it doesn't exist
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const gifPath = path.join(cacheDir, `anime_${Date.now()}.gif`);
      const encodedPrompt = encodeURIComponent(userPrompt);
      const apiUrl = `https://t2i.onrender.com/kshitiz?prompt=${encodedPrompt}`;

      try {
        const response = await axios.get(apiUrl, { timeout: 30000 });
        
        if (!response.data || !response.data.imageUrl) {
          return message.reply("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒆 𝑮𝑰𝑭. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂 𝒅𝒊𝒇𝒇𝒆𝒓𝒆𝒏𝒕 𝒑𝒓𝒐𝒎𝒑𝒕.");
        }

        const imageUrl = response.data.imageUrl;
        const imageResponse = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
          timeout: 30000
        });

        fs.writeFileSync(gifPath, Buffer.from(imageResponse.data));

        await message.reply({
          body: `✅ 𝑨𝒏𝒊𝒎𝒆 𝑮𝑰𝑭 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚!\n📝 𝑷𝒓𝒐𝒎𝒑𝒕: "${userPrompt}"`,
          attachment: fs.createReadStream(gifPath)
        });

        // Clean up
        fs.unlinkSync(gifPath);

      } catch (apiError) {
        console.error("API Error:", apiError);
        return message.reply("❌ 𝑨𝑷𝑰 𝒆𝒓𝒓𝒐𝒓. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓 𝒐𝒓 𝒖𝒔𝒆 𝒂 𝒅𝒊𝒇𝒇𝒆𝒓𝒆𝒏𝒕 𝒑𝒓𝒐𝒎𝒑𝒕.");
      }

    } catch (error) {
      console.error("Anigif command error:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.");
    }
  }
};
