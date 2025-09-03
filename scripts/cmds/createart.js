const axios = require('axios');
const fs = require('fs-extra');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "createart",
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "utility",
    shortDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝐴𝐼 𝑎𝑟𝑡 𝑓𝑟𝑜𝑚 𝑡𝑒𝑥𝑡 𝑝𝑟𝑜𝑚𝑝𝑡"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝐴𝐼-𝑝𝑜𝑤𝑒𝑟𝑒𝑑 𝑎𝑟𝑡𝑤𝑜𝑟𝑘 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑡𝑒𝑥𝑡 𝑑𝑒𝑠𝑐𝑟𝑖𝑝𝑡𝑖𝑜𝑛"
    },
    guide: {
      en: "{p}createart [𝑝𝑟𝑜𝑚𝑝𝑡]"
    },
    countDown: 2,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "moment-timezone": ""
    }
  },

  onStart: async function({ api, event, args, usersData }) {
    try {
      let timeStart = Date.now();
      const name = await usersData.getName(event.senderID);
      const timeNow = moment.tz("Asia/Dhaka").format("HH:mm:ss - DD/MM/YYYY");
      
      let { threadID, messageID } = event;
      let query = args.join(" ");
      
      if (!query) return api.sendMessage("𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑡𝑒𝑥𝑡 𝑝𝑟𝑜𝑚𝑝𝑡 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑎𝑟𝑡", threadID, messageID);
      
      let path = __dirname + `/cache/createart.png`;
      
      const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(query)}`, {
        responseType: "arraybuffer",
      });
      
      fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));
      
      api.sendMessage({
        body: `🎨 𝐴𝐼 𝐴𝑟𝑡 𝐶𝑟𝑒𝑎𝑡𝑒𝑑\n━━━━━━━━━━━━━━━━\n👤 𝑈𝑠𝑒𝑟: ${name}\n📝 𝑃𝑟𝑜𝑚𝑝𝑡: ${query}\n⏰ 𝑇𝑖𝑚𝑒: ${timeNow} (𝐵𝑎𝑛𝑔𝑙𝑎𝑑𝑒𝑠ℎ 𝑇𝑖𝑚𝑒)\n⏳ 𝑃𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡𝑖𝑚𝑒: ${Math.floor((Date.now() - timeStart)/1000)} 𝑠𝑒𝑐𝑜𝑛𝑑𝑠\n📌 𝐼𝑚𝑎𝑔𝑒 𝑤𝑖𝑙𝑙 𝑏𝑒 𝑑𝑒𝑙𝑒𝑡𝑒𝑑 𝑎𝑓𝑡𝑒𝑟 1 ℎ𝑜𝑢𝑟!`,
        attachment: fs.createReadStream(path)
      }, threadID, () => fs.unlinkSync(path), messageID);
      
    } catch (error) {
      console.error(error);
      api.sendMessage("❌ 𝐸𝑟𝑟𝑜𝑟 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝐴𝐼 𝑎𝑟𝑡", event.threadID, event.messageID);
    }
  }
};
