const fs = require('fs-extra');
const axios = require('axios');

module.exports = {
  config: {
    name: "wife",
    aliases: ["wifey", "mywife"],
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "💞 𝐴𝑢𝑡𝑜 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑤𝑖𝑓𝑒𝑦 𝑚𝑒𝑠𝑠𝑎𝑔𝑒"
    },
    longDescription: {
      en: "𝑅𝑒𝑠𝑝𝑜𝑛𝑑𝑠 𝑤ℎ𝑒𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑠𝑎𝑦𝑠 '𝑤𝑖𝑓𝑒𝑦' 𝑤𝑖𝑡ℎ 𝑎 𝑐𝑢𝑠𝑡𝑜𝑚𝑖𝑧𝑒𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒"
    },
    guide: {
      en: "𝐽𝑢𝑠𝑡 𝑡𝑦𝑝𝑒 '𝑤𝑖𝑓𝑒𝑦' 𝑖𝑛 𝑡ℎ𝑒 𝑐ℎ𝑎𝑡"
    },
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onChat: async function ({ event, message }) {
    if (event.body && event.body.toLowerCase() === "wifey") {
      try {
        const filePath = `${__dirname}/tmp/wife.mp4`;
        
        // Ensure tmp directory exists
        await fs.ensureDir(`${__dirname}/tmp`);
        
        // Download the video
        const response = await axios.get("https://i.imgur.com/tPzzqVl.mp4", {
          responseType: 'stream'
        });
        
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        
        writer.on('finish', async () => {
          await message.reply({
            body:
              "╭───────────────⊹⊱❖⊰⊹───────────────╮\n" +
              "         💞 𝑊𝑖𝑓𝑒𝑦 💞\n" +
              "╰───────────────⊹⊱❖⊰⊹───────────────╯\n\n" +
              "💫 𝐻𝑒𝑦 ℎ𝑒𝑦! 𝐷𝑒𝑘ℎ𝑜 𝑘𝑒 𝑎𝑖𝑠𝑒 𝑐𝑢𝑡𝑒 𝑐𝑢𝑡𝑒 𝑎𝑠ℎ𝑒 —\n" +
              "🦋 𝑠𝑢𝑛𝑑𝑜𝑟 𝑙𝑖𝑡𝑡𝑙𝑒 𝑝𝑟𝑖𝑛𝑐𝑒𝑠𝑠 ✨\n\n" +
              "───────────────✧───────────────\n" +
              "🤖 𝐵𝑜𝑡: 𝐴𝑠𝑖𝑓 𝐵𝑂𝑇 🔥",
            attachment: fs.createReadStream(filePath)
          });
          
          // Clean up
          await fs.unlink(filePath);
        });
        
        writer.on('error', (error) => {
          console.error('Error writing file:', error);
          message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑣𝑖𝑑𝑒𝑜. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        });
        
      } catch (error) {
        console.error('Error in wife command:', error);
        message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑒𝑠𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
      }
    }
  }
};
