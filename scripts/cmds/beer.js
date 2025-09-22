const fs = require("fs-extra");

module.exports = {
  config: {
    name: "beer",
    aliases: ["cheers", "alcohol", "daru"],
    version: "1.1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🍺 𝐵𝑒𝑒𝑟 𝑝𝑖𝑡𝑒 𝑒𝑟 𝑗𝑜𝑛𝑛𝑜 𝑏ℎ𝑎𝑙𝑜𝑏𝑎𝑠ℎ𝑎"
    },
    longDescription: {
      en: "𝐴𝑢𝑡𝑜-𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑠 𝑡𝑜 𝑑𝑟𝑖𝑛𝑘-𝑟𝑒𝑙𝑎𝑡𝑒𝑑 𝑘𝑒𝑦𝑤𝑜𝑟𝑑𝑠"
    },
    guide: {
      en: "𝐽𝑢𝑠𝑡 𝑡𝑦𝑝𝑒 𝑑𝑟𝑖𝑛𝑘-𝑟𝑒𝑙𝑎𝑡𝑒𝑑 𝑤𝑜𝑟𝑑𝑠"
    },
    countDown: 3
  },

  onStart: async function ({ message }) {
    try {
      const msg = {
        body: `🍻 𝐵𝑒𝑒𝑟 𝑘ℎ𝑖𝑡𝑒 𝑐𝑎𝑜? 𝐸𝑖 𝑛𝑒𝑜! 🥂\n` +
              `▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂\n` +
              `𝑇𝑦𝑝𝑒 𝑎𝑛𝑦 𝑑𝑟𝑖𝑛𝑘-𝑟𝑒𝑙𝑎𝑡𝑒𝑑 𝑤𝑜𝑟𝑑 𝑡𝑜 𝑠𝑒𝑒 𝑚𝑎𝑔𝑖𝑐!\n` +
              `▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂\n` +
              `💖 𝑃𝑜𝑤𝑒𝑟𝑒𝑑 𝑏𝑦 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`
      };
      
      const videoPath = __dirname + '/noprefix/daru.mp4';
      if (fs.existsSync(videoPath)) {
        msg.attachment = fs.createReadStream(videoPath);
      }
      
      await message.reply(msg);
    } catch (error) {
      console.error("𝐵𝑒𝑒𝑟 𝑆𝑡𝑎𝑟𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
    }
  },

  onChat: async function ({ api, event, message }) {
    try {
      const { threadID, messageID, body } = event;
      const triggers = ["beer", "daru", "drink", "sharab", "party", "alcohol", "whisky", "vodka", "rum", "🍻", "🍺", "🍷"];
      
      if (body && triggers.some(trigger => body.toLowerCase().includes(trigger))) {
        const msg = {
          body: `🍻 𝐶ℎ𝑜𝑙𝑜 𝑚𝑖𝑙𝑎 𝑏𝑒𝑒𝑟 𝑘ℎ𝑎𝑖! 🥂\n` + 
                `▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂\n` +
                `🍷 𝐴𝑝𝑛𝑖 𝑎𝑔𝑎 𝑠𝑢𝑟𝑢 𝑘𝑜𝑟𝑒𝑛\n` +
                `🍾 𝐴𝑚𝑖 𝑎𝑠𝑐ℎ𝑖 𝑡ℎ𝑖𝑘 𝑒𝑘ℎ𝑜𝑛𝑒\n` +
                `▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂\n` +
                `💖 𝑃𝑜𝑤𝑒𝑟𝑒𝑑 𝑏𝑦 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`
        };
        
        const videoPath = __dirname + '/noprefix/daru.mp4';
        if (fs.existsSync(videoPath)) {
          msg.attachment = fs.createReadStream(videoPath);
        }
        
        await message.reply(msg);
        await api.setMessageReaction("🍻", messageID, () => {}, true);
      }
    } catch (error) {
      console.error("𝐵𝑒𝑒𝑟 𝐶ℎ𝑎𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
    }
  }
};
