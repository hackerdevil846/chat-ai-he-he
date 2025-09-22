const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "danger",
    aliases: ["caution", "warningsign"], // Changed "warning" to "warningsign"
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑑𝑎𝑛𝑔𝑒𝑟 𝑠𝑡𝑦𝑙𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑠 𝑎 𝑑𝑎𝑛𝑔𝑒𝑟 𝑠𝑡𝑦𝑙𝑒 𝑚𝑒𝑚𝑒 𝑖𝑚𝑎𝑔𝑒 𝑢𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡"
    },
    guide: {
      en: "{p}danger <𝑡𝑒𝑥𝑡>"
    },
    dependencies: {
      "axios": "",
      "fs": "",
      "path": ""
    }
  },

  langs: {
    "en": {
      "missing": "❌ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑡𝑒𝑥𝑡 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑑𝑎𝑛𝑔𝑒𝑟 𝑖𝑚𝑎𝑔𝑒.",
      "error": "❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑑𝑎𝑛𝑔𝑒𝑟 𝑖𝑚𝑎𝑔𝑒."
    }
  },

  onStart: async function({ message, args, getLang }) {
    try {
      if (!args.length) return message.reply(getLang("missing"));

      const text = encodeURIComponent(args.join(" "));
      const res = await axios.get(`https://api.popcat.xyz/v2/caution?text=${text}`, {
        responseType: "arraybuffer"
      });

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const filePath = path.join(cacheDir, `danger_${Date.now()}.png`);
      fs.writeFileSync(filePath, res.data);

      await message.reply({
        body: "☣️ 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑑𝑎𝑛𝑔𝑒𝑟 𝑖𝑚𝑎𝑔𝑒!",
        attachment: fs.createReadStream(filePath)
      });

      fs.unlinkSync(filePath);

    } catch (err) {
      console.error("𝐷𝑎𝑛𝑔𝑒𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", err);
      message.reply(getLang("error"));
    }
  }
};
