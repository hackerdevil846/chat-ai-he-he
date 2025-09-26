const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "googlesrch",
    aliases: [],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "🔍 𝑆𝑒𝑎𝑟𝑐ℎ 𝑟𝑒𝑠𝑢𝑙𝑡𝑠 𝑜𝑛 𝐺𝑜𝑜𝑔𝑙𝑒"
    },
    longDescription: {
      en: "𝐹𝑖𝑛𝑑 𝑠𝑒𝑎𝑟𝑐ℎ 𝑟𝑒𝑠𝑢𝑙𝑡𝑠 𝑜𝑛 𝐺𝑜𝑜𝑔𝑙𝑒 𝑤𝑖𝑡ℎ 𝑡𝑒𝑥𝑡 𝑜𝑟 𝑖𝑚𝑎𝑔𝑒 𝑠𝑒𝑎𝑟𝑐ℎ"
    },
    guide: {
      en: "{p}googlesrch [𝑞𝑢𝑒𝑟𝑦] 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ message, event, args }) {
    try {
      let searchQuery = "";
      const regex = /(https?:\/\/.*?\.(?:png|jpe?g|gif)(?:\?(?:[\w_-]+=[\w_-]+)(?:&[\w_-]+=[\w_-]+)*)?(.*))($)/;
      
      if (event.type == "message_reply" && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
        searchQuery = event.messageReply.attachments[0].url;
      } else {
        searchQuery = args.join(" ");
      }

      if (!searchQuery) {
        return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑠𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑦 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒.");
      }

      if (regex.test(searchQuery)) {
        await message.reply(`🔍 𝐻𝑒𝑟𝑒 𝑖𝑠 𝑦𝑜𝑢𝑟 𝑖𝑚𝑎𝑔𝑒 𝑠𝑒𝑎𝑟𝑐ℎ 𝑟𝑒𝑠𝑢𝑙𝑡: https://www.google.com/searchbyimage?&image_url=${encodeURIComponent(searchQuery)}`);
      } else {
        await message.reply(`🔍 𝐻𝑒𝑟𝑒 𝑖𝑠 𝑦𝑜𝑢𝑟 𝑠𝑒𝑎𝑟𝑐ℎ 𝑟𝑒𝑠𝑢𝑙𝑡: https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`);
      }

    } catch (error) {
      console.error("𝐺𝑜𝑜𝑔𝑙𝑒 𝑆𝑒𝑎𝑟𝑐ℎ 𝐸𝑟𝑟𝑜𝑟:", error);
      await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑝𝑟𝑜𝑐𝑒𝑠𝑠 𝑠𝑒𝑎𝑟𝑐ℎ 𝑟𝑒𝑞𝑢𝑒𝑠𝑡.");
    }
  }
};
