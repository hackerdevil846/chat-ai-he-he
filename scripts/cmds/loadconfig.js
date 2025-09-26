const fs = require("fs-extra");

module.exports = {
  config: {
    name: "loadconfig",
    aliases: [], // UNIQUE ALIASES
    version: "1.4",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "owner",
    shortDescription: {
        en: "♻️ | 𝑅𝑒𝑙𝑜𝑎𝑑 𝑏𝑜𝑡 𝑐𝑜𝑛𝑓𝑖𝑔𝑢𝑟𝑎𝑡𝑖𝑜𝑛"
    },
    longDescription: {
        en: "𝑅𝑒𝑙𝑜𝑎𝑑 𝑏𝑜𝑡 𝑐𝑜𝑛𝑓𝑖𝑔𝑢𝑟𝑎𝑡𝑖𝑜𝑛 𝑓𝑖𝑙𝑒𝑠 (𝑐𝑜𝑛𝑓𝑖𝑔 & 𝑐𝑜𝑛𝑓𝑖𝑔𝐶𝑜𝑚𝑚𝑎𝑛𝑑𝑠)"
    },
    guide: {
        en: "{p}loadconfig"
    },
    dependencies: {
        "fs-extra": ""
    }
  },

  onStart: async function({ api, event, message }) {
    try {
      if (!global.client || !global.client.dirConfig || !global.client.dirConfigCommands) {
        return message.reply("❌ | 𝐶𝑜𝑛𝑓𝑖𝑔 𝑝𝑎𝑡ℎ𝑠 𝑛𝑜𝑡 𝑑𝑒𝑓𝑖𝑛𝑒𝑑 𝑖𝑛 𝑔𝑙𝑜𝑏𝑎𝑙.𝑐𝑙𝑖𝑒𝑛𝑡");
      }

      global.GoatBot = global.GoatBot || {};
      global.GoatBot.config = await fs.readJson(global.client.dirConfig);
      global.GoatBot.configCommands = await fs.readJson(global.client.dirConfigCommands);

      await message.reply("✅ | 𝐶𝑜𝑛𝑓𝑖𝑔 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑟𝑒𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦. ♻️");

    } catch (error) {
      console.error("❌ | 𝐿𝑜𝑎𝑑𝑐𝑜𝑛𝑓𝑖𝑔 𝐸𝑟𝑟𝑜𝑟:", error);
      await message.reply("🔴 | 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑: " + error.message);
    }
  }
};
