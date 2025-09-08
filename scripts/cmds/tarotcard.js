module.exports = {
  config: {
    name: "tarotcard",
    version: "0.0.1",
    role: 0,
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    category: "utility",
    shortDescription: {
      en: "𝑇𝑎𝑟𝑜𝑡 𝑐𝑎𝑟𝑑 𝑟𝑒𝑎𝑑𝑖𝑛𝑔",
      bn: "তাসের ভবিষ্যৎ বলা"
    },
    longDescription: {
      en: "𝐺𝑒𝑡 𝑎 𝑡𝑎𝑟𝑜𝑡 𝑐𝑎𝑟𝑑 𝑟𝑒𝑎𝑑𝑖𝑛𝑔 𝑤𝑖𝑡ℎ 𝑖𝑛𝑡𝑒𝑟𝑝𝑟𝑒𝑡𝑎𝑡𝑖𝑜𝑛",
      bn: "ব্যাখ্যা সহ একটি তারত কার্ড পড়া পান"
    },
    guide: {
      en: "{p}tarotcard [𝑐𝑎𝑟𝑑 𝑛𝑢𝑚𝑏𝑒𝑟]",
      bn: "{p}tarotcard [কার্ড নম্বর]"
    },
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function ({ api, event, args }) {
    const axios = require("axios");
    
    try {
      const tarotData = (await axios.get('https://raw.githubusercontent.com/ThanhAli-Official/tarot/main/data.json')).data;
      
      if (args[0] && args[0] > tarotData.length) {
        return api.sendMessage(
          `❌ 𝐶𝑎𝑛𝑛𝑜𝑡 𝑒𝑥𝑐𝑒𝑒𝑑 𝑡ℎ𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 𝑜𝑓 𝑐𝑎𝑟𝑑𝑠 𝑖𝑛 𝑡ℎ𝑒 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒 (𝑀𝑎𝑥: ${tarotData.length})`,
          event.threadID,
          event.messageID
        );
      }

      let cardIndex;
      if (!args[0]) {
        cardIndex = Math.floor(Math.random() * tarotData.length);
      } else {
        cardIndex = parseInt(args[0]) - 1;
        if (isNaN(cardIndex) || cardIndex < 0 || cardIndex >= tarotData.length) {
          return api.sendMessage(
            `❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐𝑎𝑟𝑑 𝑛𝑢𝑚𝑏𝑒𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒 𝑎 𝑛𝑢𝑚𝑏𝑒𝑟 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 1 𝑎𝑛𝑑 ${tarotData.length}`,
            event.threadID,
            event.messageID
          );
        }
      }

      const card = tarotData[cardIndex];
      const imageStream = (await axios.get(card.image, { responseType: "stream" })).data;

      const message = {
        body: `🔮 𝗧𝗔𝗥𝗢𝗧 𝗖𝗔𝗥𝗗 𝗥𝗘𝗔𝗗𝗜𝗡𝗚 🔮\n\n` +
              `🃏 𝐶𝑎𝑟𝑑 𝑁𝑎𝑚𝑒: ${card.name}\n` +
              `🎴 𝑆𝑢𝑖𝑡: ${card.suite}\n\n` +
              `📖 𝐷𝑒𝑠𝑐𝑟𝑖𝑝𝑡𝑖𝑜𝑛: ${card.vi.description}\n\n` +
              `💫 𝐼𝑛𝑡𝑒𝑟𝑝𝑟𝑒𝑡𝑎𝑡𝑖𝑜𝑛: ${card.vi.interpretation}\n\n` +
              `🔄 𝑅𝑒𝑣𝑒𝑟𝑠𝑒𝑑: ${card.vi.reversed}`,
        attachment: imageStream
      };

      return api.sendMessage(message, event.threadID, event.messageID);
      
    } catch (error) {
      console.error("𝑇𝑎𝑟𝑜𝑡 𝑒𝑟𝑟𝑜𝑟:", error);
      return api.sendMessage(
        "❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑡𝑎𝑟𝑜𝑡 𝑐𝑎𝑟𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.",
        event.threadID,
        event.messageID
      );
    }
  }
};
