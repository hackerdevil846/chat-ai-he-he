const fs = require("fs");

module.exports = {
  config: {
    name: "wednesday",
    aliases: ["wed", "wedvid"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🧛🏻‍♀️ 𝑊𝑒𝑑𝑛𝑒𝑠𝑑𝑎𝑦 𝑣𝑖𝑑𝑒𝑜 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒"
    },
    longDescription: {
      en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑠 𝑤𝑖𝑡ℎ 𝑊𝑒𝑑𝑛𝑒𝑠𝑑𝑎𝑦 𝑣𝑖𝑑𝑒𝑜 𝑤ℎ𝑒𝑛 𝑡𝑟𝑖𝑔𝑔𝑒𝑟𝑒𝑑"
    },
    guide: {
      en: "𝐽𝑢𝑠𝑡 𝑡𝑦𝑝𝑒 '𝑤𝑒𝑑𝑛𝑒𝑠𝑑𝑎𝑦' 𝑖𝑛 𝑐ℎ𝑎𝑡"
    },
    countDown: 5,
    dependencies: {
      "fs": ""
    }
  },

  onChat: async function({ api, event, message }) {
    try {
      if (event.body.toLowerCase().startsWith("wednesday")) {
        const msg = {
          body: "𝑊𝑒𝑑𝑛𝑒𝑠𝑑𝑎𝑦 🧛🏻‍♀️",
          attachment: fs.createReadStream(__dirname + "/noprefix/wednesday.mp4")
        };
        await message.reply(msg);
        api.setMessageReaction("🧛🏻‍♀️", event.messageID, (err) => {}, true);
      }
    } catch (error) {
      console.error("Wednesday command error:", error);
    }
  },

  onStart: async function({ api, event, message }) {
    // Optional: You can add a response when the command is used directly
    await message.reply("🧛🏻‍♀️ 𝑇𝑦𝑝𝑒 '𝑤𝑒𝑑𝑛𝑒𝑠𝑑𝑎𝑦' 𝑖𝑛 𝑐ℎ𝑎𝑡 𝑡𝑜 𝑠𝑒𝑒 𝑡ℎ𝑒 𝑣𝑖𝑑𝑒𝑜!");
  }
};
