const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "slap",
    aliases: ["slapuser", "pita"],
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
      if (!fs.existsSync(path)) fs.mkdirSync(path);
    } catch (e) {
      // ignore - best effort to ensure cache exists
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const { threadID, messageID } = event;

      // validation: need args (but we prefer mention check)
      if (!args.join("").length) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑠𝑙𝑎𝑝!");
      }

      const mentionIds = Object.keys(event.mentions || {});
      if (!mentionIds.length) {
        return message.reply("❌ 𝑁𝑜 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑓𝑜𝑢𝑛𝑑! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑠𝑙𝑎𝑝.");
      }

      const mentionId = mentionIds[0];
      let tagName = event.mentions[mentionId] || "user";

      // fetch slap gif/url from waifu.pics (kept link unchanged)
      const res = await axios.get("https://api.waifu.pics/sfw/slap");
      const getURL = res.data && res.data.url ? res.data.url : null;
      if (!getURL) throw new Error("No URL returned from API.");

      const ext = getURL.substring(getURL.lastIndexOf(".") + 1).split(/\?|\#/)[0] || "gif";
      const cachePath = __dirname + `/cache/slap_${Date.now()}.${ext}`;

      // Download the image
      const imageResponse = await axios.get(getURL, {
        responseType: 'arraybuffer'
      });
      
      await fs.writeFile(cachePath, Buffer.from(imageResponse.data));

      // reaction + send
      try {
        api.setMessageReaction("✅", messageID, () => {}, true);
      } catch (e) {
        // ignore reaction failure
      }

      const bodyText = `👊 𝑆𝑙𝑎𝑝𝑝𝑒𝑑! ${tagName}\n\n"𝑚𝑎𝑓 𝑘𝑜𝑟𝑏𝑜, 𝑎𝑚𝑖 𝑏ℎ𝑎𝑏𝑖 𝑚𝑎𝑠𝑘𝑎𝑟𝑎 𝑐ℎ𝑖𝑙"`;

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
        if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
      } catch (e) {
        // ignore cleanup errors
      }

    } catch (error) {
      console.error("Slap error:", error);
      
      try {
        message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑠𝑙𝑎𝑝 𝑔𝑖𝑓! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        api.setMessageReaction("☹️", event.messageID, () => {}, true);
      } catch (e) {
        // ignore
      }
    }
  }
};
