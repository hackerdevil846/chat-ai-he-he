const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "alime",
    version: "1.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "anime",
    shortDescription: {
      en: "𝑨𝒏𝒊𝒎𝒆 𝒊𝒎𝒂𝒈𝒆𝒔 - 𝒃𝒐𝒕𝒉 𝑺𝑭𝑾 𝒂𝒏𝒅 𝑵𝑺𝑭𝑾"
    },
    longDescription: {
      en: "𝑮𝒆𝒕 𝒂𝒏𝒊𝒎𝒆 𝒊𝒎𝒂𝒈𝒆𝒔 𝒇𝒓𝒐𝒎 𝒗𝒂𝒓𝒊𝒐𝒖𝒔 𝒄𝒂𝒕𝒆𝒈𝒐𝒓𝒊𝒆𝒔"
    },
    guide: {
      en: "{p}alime [tag]\n{p}alime list - 𝑺𝒉𝒐𝒘 𝒂𝒗𝒂𝒊𝒍𝒂𝒃𝒍𝒆 𝒕𝒂𝒈𝒔"
    },
    cooldowns: 5
  },

  onStart: async function({ message, event, args }) {
    try {
      const { threadID, senderID } = event;
      
      // Create cache directory if it doesn't exist
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const dataPath = path.join(cacheDir, 'alime.json');
      
      // Download or update the data file
      if (!fs.existsSync(dataPath)) {
        try {
          const response = await axios.get("https://raw.githubusercontent.com/ProCoderMew/Module-Miraiv2/main/data/alime.json");
          fs.writeFileSync(dataPath, JSON.stringify(response.data, null, 2));
        } catch (error) {
          console.error("Failed to download alime data:", error);
          return message.reply("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒍𝒐𝒂𝒅 𝒊𝒎𝒂𝒈𝒆 𝒅𝒂𝒕𝒂. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.");
        }
      }

      // Load the data
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const { sfw, nsfw } = data;

      if (!args[0] || args[0].toLowerCase() === 'list') {
        // Show available tags
        const sfwTags = Object.keys(sfw).join(", ");
        const nsfwTags = Object.keys(nsfw).join(", ");
        
        const tagList = `🎨 𝑨𝒗𝒂𝒊𝒍𝒂𝒃𝒍𝒆 𝑨𝒏𝒊𝒎𝒆 𝑻𝒂𝒈𝒔:\n\n` +
                       `🌈 𝑺𝑭𝑾 𝑻𝒂𝒈𝒔:\n${sfwTags}\n\n` +
                       `🔞 𝑵𝑺𝑭𝑾 𝑻𝒂𝒈𝒔:\n${nsfwTags}\n\n` +
                       `💡 𝑼𝒔𝒆: ${global.config.PREFIX}alime [tag]`;
        
        return message.reply(tagList);
      }

      const tag = args[0].toLowerCase();
      let apiUrl;

      if (sfw.hasOwnProperty(tag)) {
        apiUrl = sfw[tag];
      } else if (nsfw.hasOwnProperty(tag)) {
        apiUrl = nsfw[tag];
      } else {
        return message.reply("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒕𝒂𝒈. 𝑼𝒔𝒆 '" + global.config.PREFIX + "alime list' 𝒕𝒐 𝒔𝒆𝒆 𝒂𝒗𝒂𝒊𝒍𝒂𝒃𝒍𝒆 𝒕𝒂𝒈𝒔.");
      }

      // Show processing message
      await message.reply("🔄 𝑳𝒐𝒂𝒅𝒊𝒏𝒈 𝒊𝒎𝒂𝒈𝒆...");

      try {
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.response?.url || response.data?.url;
        
        if (!imageUrl) {
          throw new Error("𝑵𝒐 𝒊𝒎𝒂𝒈𝒆 𝒖𝒓𝒍 𝒇𝒐𝒖𝒏𝒅");
        }

        const imageResponse = await axios.get(imageUrl, {
          responseType: 'arraybuffer'
        });

        const imagePath = path.join(cacheDir, `alime_${tag}_${Date.now()}.jpg`);
        fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));

        await message.reply({
          body: `🎨 𝑨𝒏𝒊𝒎𝒆 𝑰𝒎𝒂𝒈𝒆 - 𝑻𝒂𝒈: ${tag}`,
          attachment: fs.createReadStream(imagePath)
        });

        // Clean up
        fs.unlinkSync(imagePath);

      } catch (error) {
        console.error("Image download error:", error);
        await message.reply("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒍𝒐𝒂𝒅 𝒊𝒎𝒂𝒈𝒆. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒏𝒐𝒕𝒉𝒆𝒓 𝒕𝒂𝒈.");
      }

    } catch (error) {
      console.error("Alime command error:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.");
    }
  }
};
