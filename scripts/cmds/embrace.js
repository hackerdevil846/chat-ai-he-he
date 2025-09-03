const axios = require("axios");
const fs = require("fs");

module.exports = {
  config: {
    name: "embrace",
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "love",
    shortDescription: {
      en: "𝐸𝑚𝑏𝑟𝑎𝑐𝑒 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡"
    },
    longDescription: {
      en: "𝑆𝑒𝑛𝑑 𝑎𝑛 𝑒𝑚𝑏𝑟𝑎𝑐𝑒 𝑡𝑜 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑦𝑜𝑢 𝑚𝑒𝑛𝑡𝑖𝑜𝑛"
    },
    guide: {
      en: "{p}embrace @𝑡𝑎𝑔"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs": ""
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      const mention = Object.keys(event.mentions)[0];
      if (!mention) {
        return api.sendMessage("𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑒𝑚𝑏𝑟𝑎𝑐𝑒!", event.threadID, event.messageID);
      }

      const tag = event.mentions[mention].replace("@", "");
      const links = [
        "https://genk.mediacdn.vn/2016/04-1483112033497.gif",
      ];
      
      const url = links[Math.floor(Math.random() * links.length)];
      const path = __dirname + "/cache/embrace.gif";

      const response = await axios.get(url, { responseType: "stream" });
      response.data.pipe(fs.createWriteStream(path));
      
      response.data.on("end", () => {
        api.sendMessage({
          body: `${tag} 💖, 𝐼 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑒𝑚𝑏𝑟𝑎𝑐𝑒 𝑦𝑜𝑢!`,
          mentions: [{
            tag: tag,
            id: mention
          }],
          attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path), event.messageID);
      });
    } catch (error) {
      console.error(error);
      api.sendMessage("❌ 𝐸𝑟𝑟𝑜𝑟 𝑠𝑒𝑛𝑑𝑖𝑛𝑔 𝑒𝑚𝑏𝑟𝑎𝑐𝑒", event.threadID, event.messageID);
    }
  }
};
