const fs = require("fs-extra");
const path = require("path");
const https = require("https");
const axios = require("axios");

module.exports = {
  config: {
    name: "animeart",
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: { en: "𝑆𝑒𝑛𝑑 𝑠𝑎𝑓𝑒 𝑐𝑢𝑡𝑒 𝑎𝑛𝑖𝑚𝑒 𝑖𝑙𝑙𝑢𝑠𝑡𝑟𝑎𝑡𝑖𝑜𝑛" },
    longDescription: { en: "𝐹𝑒𝑡𝑐ℎ𝑒𝑠 𝑠𝑎𝑓𝑒 (𝑛𝑜𝑛-𝑅18) 𝑎𝑛𝑖𝑚𝑒 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑙𝑜𝑙𝑖𝑐𝑜𝑛 𝐴𝑃𝐼" },
    category: "𝑓𝑢𝑛",
    guide: { en: "+𝑎𝑛𝑖𝑚𝑒𝑎𝑟𝑡" }
  },

  onStart: async function({ message }) {
    try {
      const res = await axios.post("https://api.lolicon.app/setu/v2", {
        r18: 0,
        num: 1
      });

      if (!res.data || !res.data.data || res.data.data.length === 0) {
        return message.reply("❌ 𝐾𝑜𝑛𝑜 𝑐ℎ𝑜𝑏𝑖 𝑝𝑎𝑜𝑎 𝛾𝑎𝑦 𝑛𝑖.");
      }

      const imageUrl = res.data.data[0].urls.original || res.data.data[0].urls.regular;
      const filePath = path.join(__dirname, "cache/animeart.jpg");

      const file = fs.createWriteStream(filePath);
      https.get(imageUrl, resImg => {
        resImg.pipe(file);
        file.on("finish", () => {
          const caption = `
✨ 𝓐𝓷𝓲𝓶𝓮 𝓐𝓻𝓽 𝓖𝓪𝓵𝓵𝓮𝓻𝔂 ✨

🌸 𝐴𝑃𝐼 𝑐𝑟𝑒𝑑𝑖𝑡: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑
          `;
          message.reply({
            body: caption.trim(),
            attachment: fs.createReadStream(filePath)
          });
        });
      }).on("error", () => {
        message.reply("❌ 𝐶ℎ𝑜𝑏𝑖 𝑑𝑎𝑤𝑛𝑙𝑜𝑎𝑑 𝑝𝑟𝑜𝑏𝑙𝑒𝑚 ℎ𝑜𝑦𝑒𝑐ℎ𝑒.");
      });

    } catch {
      message.reply("❌ 𝐶ℎ𝑜𝑏𝑖 𝑎𝑛𝑎𝑡𝑒 𝑝𝑟𝑜𝑏𝑙𝑒𝑚 ℎ𝑜𝑦𝑒𝑐ℎ𝑒.");
    }
  }
};
