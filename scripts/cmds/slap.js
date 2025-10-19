const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "slap",
    aliases: [],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "👊 𝑆𝑙𝑎𝑝 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑤𝑖𝑡ℎ 𝑎 𝑓𝑢𝑛𝑛𝑦 𝑔𝑖𝑓"
    },
    longDescription: {
      en: "𝑆𝑒𝑛𝑑 𝑎 𝑠𝑙𝑎𝑝 𝑔𝑖𝑓 𝑡𝑜 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑦𝑜𝑢 𝑚𝑒𝑛𝑡𝑖𝑜𝑛"
    },
    guide: {
      en: "{p}slap [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onLoad: function () {
    const fs = require('fs-extra');
    const path = __dirname + "/cache";
    try {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
        console.log("✅ Cache directory created:", path);
      }
    } catch (e) {
      console.warn("⚠️ Cache directory creation warning:", e.message);
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const { threadID, messageID, senderID } = event;

      // Check if there are any mentions
      const mentionIds = Object.keys(event.mentions || {});
      if (!mentionIds.length) {
        return message.reply("❌ 𝑁𝑜 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑓𝑜𝑢𝑛𝑑! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑠𝑙𝑎𝑝.\n\nExample: slap @username");
      }

      const mentionId = mentionIds[0];
      let tagName = event.mentions[mentionId] || "user";

      // Don't allow slapping yourself
      if (mentionId === senderID) {
        return message.reply("😳 𝐻𝑒𝑦, 𝑑𝑜𝑛'𝑡 𝑠𝑙𝑎𝑝 𝑦𝑜𝑢𝑟𝑠𝑒𝑙𝑓! 𝑀𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑒𝑙𝑠𝑒.");
      }

      // Don't allow slapping the bot
      if (mentionId === api.getCurrentUserID()) {
        return message.reply("😅 𝐼 𝑐𝑎𝑛'𝑡 𝑠𝑙𝑎𝑝 𝑚𝑦𝑠𝑒𝑙𝑓! 𝑀𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑒𝑙𝑠𝑒.");
      }

      const uploadMsg = await message.reply("⏳ 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑠𝑙𝑎𝑝 𝑔𝑖𝑓, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡...");

      try {
        // fetch slap gif/url from waifu.pics (kept link unchanged)
        const res = await axios.get("https://api.waifu.pics/sfw/slap", {
          timeout: 15000 // 15 second timeout
        });
        
        const getURL = res.data && res.data.url ? res.data.url : null;
        if (!getURL) {
          throw new Error("No URL returned from API.");
        }

        // Validate URL
        if (!getURL.startsWith('http')) {
          throw new Error("Invalid URL received from API.");
        }

        const ext = getURL.split('.').pop().split(/\?|\#/)[0] || "gif";
        const cachePath = __dirname + `/cache/slap_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;

        // Download the image with timeout
        const imageResponse = await axios.get(getURL, {
          responseType: 'arraybuffer',
          timeout: 30000, // 30 second timeout for image download
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        if (!imageResponse.data || imageResponse.data.length < 1000) {
          throw new Error("Downloaded image is too small or invalid.");
        }

        await fs.writeFile(cachePath, Buffer.from(imageResponse.data));

        // Verify file was written
        if (!fs.existsSync(cachePath)) {
          throw new Error("Failed to save image to cache.");
        }

        const fileStats = fs.statSync(cachePath);
        if (fileStats.size < 1000) {
          throw new Error("Cached file is too small, likely corrupted.");
        }

        // Remove the "uploading" message
        try {
          await api.unsendMessage(uploadMsg.messageID);
        } catch (e) {
          // Ignore if can't unsend
        }

        // Add reaction
        try {
          await api.setMessageReaction("✅", messageID, () => {}, true);
        } catch (e) {
          // ignore reaction failure
        }

        const bodyText = `👊 𝑆𝑙𝑎𝑝𝑝𝑒𝑑! ${tagName}\n\n"𝑚𝑎𝑓 𝑐ℎ𝑎"`;

        await message.reply({
          body: bodyText,
          mentions: [
            {
              tag: tagName,
              id: mentionId
            }
          ],
          attachment: fs.createReadStream(cachePath)
        });

        // cleanup file after send
        try {
          if (fs.existsSync(cachePath)) {
            fs.unlinkSync(cachePath);
          }
        } catch (e) {
          console.warn("⚠️ Cleanup warning:", e.message);
        }

      } catch (apiError) {
        try {
          await api.unsendMessage(uploadMsg.messageID);
        } catch (e) {}
        
        console.error("📤 API Error:", apiError);
        throw new Error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠 𝑔𝑖𝑓: ${apiError.message}`);
      }

    } catch (error) {
      console.error("💥 Slap command error:", error);
      
      let errorMessage = "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑠𝑙𝑎𝑝 𝑔𝑖𝑓! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
      
      if (error.message.includes('timeout')) {
        errorMessage = "⏰ 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
      } else if (error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
        errorMessage = "🌐 𝑁𝑒𝑡𝑤𝑜𝑟𝑘 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑐𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛.";
      } else if (error.message.includes('No URL') || error.message.includes('Invalid URL')) {
        errorMessage = "❌ 𝐴𝑃𝐼 𝑒𝑟𝑟𝑜𝑟: 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑔𝑒𝑡 𝑔𝑖𝑓 𝑓𝑟𝑜𝑚 𝑠𝑒𝑟𝑣𝑖𝑐𝑒.";
      }
      
      try {
        await message.reply(errorMessage);
        await api.setMessageReaction("☹️", event.messageID, () => {}, true);
      } catch (e) {
        // ignore final error
      }
    }
  }
};
