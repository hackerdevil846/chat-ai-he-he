const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "animefy",
    aliases: [],
    version: "1.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 2,
    role: 0,
    shortDescription: {
      en: "𝑪𝒐𝒏𝒗𝒆𝒓𝒕 𝒊𝒎𝒂𝒈𝒆 𝒊𝒏𝒕𝒐 𝒂𝒏𝒊𝒎𝒆 𝒔𝒕𝒚𝒍𝒆"
    },
    longDescription: {
      en: "𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎 𝒚𝒐𝒖𝒓 𝒊𝒎𝒂𝒈𝒆𝒔 𝒊𝒏𝒕𝒐 𝒂𝒏𝒊𝒎𝒆-𝒔𝒕𝒚𝒍𝒆 𝒂𝒓𝒕"
    },
    category: "anime",
    guide: {
      en: "{p}animefy [𝒓𝒆𝒑𝒍𝒚 𝒕𝒐 𝒊𝒎𝒂𝒈𝒆]"
    }
  },

  onStart: async function ({ message, event }) {
    try {
      // Check if user replied to an image
      if (!event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0].url) {
        return message.reply("🖼️ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒓𝒆𝒑𝒍𝒚 𝒕𝒐 𝒂𝒏 𝒊𝒎𝒂𝒈𝒆 𝒕𝒐 𝒄𝒐𝒏𝒗𝒆𝒓𝒕 𝒊𝒕 𝒕𝒐 𝒂𝒏𝒊𝒎𝒆 𝒔𝒕𝒚𝒍𝒆");
      }

      const imageUrl = event.messageReply.attachments[0].url;
      
      // Create cache directory if it doesn't exist
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const outputPath = path.join(cacheDir, `animefy_${Date.now()}.jpg`);

      // Show processing message
      await message.reply("🔄 𝑷𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒊𝒎𝒂𝒈𝒆...");

      try {
        // First API call to convert image
        const response = await axios.get(`https://animeify.shinoyama.repl.co/convert-to-anime?imageUrl=${encodeURIComponent(imageUrl)}`);
        
        if (!response.data || !response.data.urls || !response.data.urls[1]) {
          throw new Error("𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒓𝒆𝒔𝒑𝒐𝒏𝒔𝒆 𝒇𝒓𝒐𝒎 𝒂𝒏𝒊𝒎𝒆𝒊𝒇𝒚 𝑨𝑷𝑰");
        }

        const animeImageUrl = `https://www.drawever.com${response.data.urls[1]}`;

        // Download the converted image
        const imageResponse = await axios.get(animeImageUrl, {
          responseType: 'arraybuffer',
          timeout: 30000
        });

        // Save the image
        fs.writeFileSync(outputPath, Buffer.from(imageResponse.data));

        // Send the result
        await message.reply({
          body: "🎨 𝑯𝒆𝒓𝒆'𝒔 𝒚𝒐𝒖𝒓 𝒂𝒏𝒊𝒎𝒆-𝒔𝒕𝒚𝒍𝒆 𝒊𝒎𝒂𝒈𝒆:",
          attachment: fs.createReadStream(outputPath)
        });

        // Clean up
        fs.unlinkSync(outputPath);

      } catch (apiError) {
        console.error("Animefy API error:", apiError);
        
        // Fallback to alternative API if first one fails
        try {
          const fallbackResponse = await axios.get(`https://api.rival.rocks/ai/animefy?url=${encodeURIComponent(imageUrl)}`, {
            responseType: 'arraybuffer'
          });
          
          fs.writeFileSync(outputPath, Buffer.from(fallbackResponse.data));
          
          await message.reply({
            body: "🎨 𝑯𝒆𝒓𝒆'𝒔 𝒚𝒐𝒖𝒓 𝒂𝒏𝒊𝒎𝒆-𝒔𝒕𝒚𝒍𝒆 𝒊𝒎𝒂𝒈𝒆 (𝒖𝒔𝒊𝒏𝒈 𝒇𝒂𝒍𝒍𝒃𝒂𝒄𝒌 𝑨𝑷𝑰):",
            attachment: fs.createReadStream(outputPath)
          });
          
          fs.unlinkSync(outputPath);
          
        } catch (fallbackError) {
          throw new Error("𝑩𝒐𝒕𝒉 𝑨𝑷𝑰𝒔 𝒇𝒂𝒊𝒍𝒆𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.");
        }
      }

    } catch (error) {
      console.error("Animefy command error:", error);
      await message.reply(`❌ 𝑬𝒓𝒓𝒐𝒓: ${error.message || "𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒑𝒓𝒐𝒄𝒆𝒔𝒔 𝒊𝒎𝒂𝒈𝒆"}`);
    }
  }
};
