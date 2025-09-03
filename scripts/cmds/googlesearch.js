module.exports = {
  config: {
    name: "googlesearch",
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "𝑆𝑒𝑎𝑟𝑐ℎ 𝑟𝑒𝑠𝑢𝑙𝑡𝑠 𝑜𝑛 𝐺𝑜𝑜𝑔𝑙𝑒"
    },
    longDescription: {
      en: "𝐹𝑖𝑛𝑑 𝑠𝑒𝑎𝑟𝑐ℎ 𝑟𝑒𝑠𝑢𝑙𝑡𝑠 𝑜𝑛 𝐺𝑜𝑜𝑔𝑙𝑒"
    },
    guide: {
      en: "{p}googlesearch [𝑡𝑒𝑥𝑡]"
    },
    countDown: 5,
    dependencies: {
      "request": "",
      "fs": ""
    }
  },

  onStart: async function({ api, event, args }) {
    const request = require('request');
    const fs = require('fs');
    
    let searchQuery = "";
    const regex = /(https?:\/\/.*?\.(?:png|jpe?g|gif)(?:\?(?:[\w_-]+=[\w_-]+)(?:&[\w_-]+=[\w_-]+)*)?(.*))($)/;
    
    if (event.type == "message_reply") {
      searchQuery = event.messageReply.attachments[0].url;
    } else {
      searchQuery = args.join(" ");
    }

    if (regex.test(searchQuery)) {
      api.sendMessage(`🔍 𝐻𝑒𝑟𝑒 𝑖𝑠 𝑦𝑜𝑢𝑟 𝑠𝑒𝑎𝑟𝑐ℎ 𝑟𝑒𝑠𝑢𝑙𝑡: https://www.google.com/searchbyimage?&image_url=${searchQuery}`, event.threadID, event.messageID);
    } else {
      api.sendMessage(`🔍 𝐻𝑒𝑟𝑒 𝑖𝑠 𝑦𝑜𝑢𝑟 𝑠𝑒𝑎𝑟𝑐ℎ 𝑟𝑒𝑠𝑢𝑙𝑡: https://www.google.com.vn/search?q=${encodeURIComponent(searchQuery)}`, event.threadID, event.messageID);
    }
  }
};
