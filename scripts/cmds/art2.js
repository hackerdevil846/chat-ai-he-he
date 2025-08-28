const axios = require('axios');

module.exports = {
  config: {
    name: "art2",
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: '𝑃𝑟𝑜𝑚𝑝𝑡 𝑡𝑜 𝐼𝑚𝑎𝑔𝑒'
    },
    longDescription: {
      en: '𝐶𝑜𝑛𝑣𝑒𝑟𝑡 𝑎 𝑝𝑟𝑜𝑚𝑝𝑡 𝑎𝑛𝑑 𝑖𝑚𝑎𝑔𝑒 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒'
    },
    category: "image",
    guide: {
      en: '{𝑝𝑛} 𝑝𝑟𝑜𝑚𝑝𝑡 | 𝑚𝑜𝑑𝑒𝑙'
    }
  },

  onStart: async function({ api, event, args, message }) {
    try {
      const imageLink = event.messageReply?.attachments[0]?.url;
      const [prompt, model] = args.join(" ").split("|").map(str => str.trim());
      const defaultModel = '3';

      if (!imageLink || !prompt) {
        return message.reply('𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑎𝑛𝑑 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑝𝑟𝑜𝑚𝑝𝑡 𝑖𝑛 𝑡ℎ𝑒 𝑓𝑜𝑟𝑚𝑎𝑡: 𝑝𝑟𝑜𝑚𝑝𝑡 | 𝑚𝑜𝑑𝑒𝑙');
      }

      const BModel = model || defaultModel;

      const API = `https://sandipapi.onrender.com/art?imgurl=${encodeURIComponent(imageLink)}&prompt=${encodeURIComponent(prompt)}&model=${BModel}`;

      await message.reply("✅ 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑖𝑚𝑎𝑔𝑒...");

      const imageStream = await global.utils.getStreamFromURL(API);

      return message.reply({
        attachment: imageStream
      });
      
    } catch (error) {
      console.error("𝐴𝑟𝑡2 𝐸𝑟𝑟𝑜𝑟:", error);
      return message.reply('❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.');
    }
  }
};
