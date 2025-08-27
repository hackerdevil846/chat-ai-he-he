const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "affection",
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑙𝑜𝑣𝑒 𝑠ℎ𝑖𝑝 𝑖𝑚𝑎𝑔𝑒 𝑜𝑓 𝑡𝑤𝑜 𝑢𝑠𝑒𝑟𝑠"
    },
    longDescription: {
      en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑠 𝑎 𝑐𝑢𝑡𝑒 𝑠ℎ𝑖𝑝 𝑖𝑚𝑎𝑔𝑒 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 𝑡𝑤𝑜 𝑢𝑠𝑒𝑟 𝑎𝑣𝑎𝑡𝑎𝑟𝑠"
    },
    category: "𝗙𝗨𝗡 & 𝗚𝗔𝗠𝗘",
    guide: {
      en: "{p}𝑎𝑓𝑓𝑒𝑐𝑡𝑖𝑜𝑛 @𝑢𝑠𝑒𝑟1 @𝑢𝑠𝑒𝑟2\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}𝑎𝑓𝑓𝑒𝑐𝑡𝑖𝑜𝑛 @𝑎𝑙𝑖𝑐𝑒 @𝑏𝑜𝑏"
    }
  },

  onStart: async function ({ api, event, message }) {
    const { mentions, senderID, type, messageReply } = event;

    // Require exactly two mentions
    const mentionIDs = Object.keys(mentions);
    if (mentionIDs.length < 2) {
      return message.reply("❌ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑡𝑤𝑜 𝑢𝑠𝑒𝑟𝑠 𝑡𝑜 𝑠ℎ𝑖𝑝. 𝐸𝑥𝑎𝑚𝑝𝑙𝑒:\n+𝑎𝑓𝑓𝑒𝑐𝑡𝑖𝑜𝑛 @𝑢𝑠𝑒𝑟1 @𝑢𝑠𝑒𝑟2");
    }

    const uid1 = mentionIDs[0];
    const uid2 = mentionIDs[1];

    // Get profile picture URLs
    const avatar1 = `https://graph.facebook.com/${uid1}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;
    const avatar2 = `https://graph.facebook.com/${uid2}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

    try {
      const res = await axios.get(`https://api.popcat.xyz/v2/ship?user1=${encodeURIComponent(avatar1)}&user2=${encodeURIComponent(avatar2)}`, {
        responseType: "arraybuffer"
      });

      const filePath = path.join(__dirname, "cache", `affection_${uid1}_${uid2}_${Date.now()}.png`);
      fs.writeFileSync(filePath, res.data);

      message.reply({
        body: "❤️ 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑎𝑓𝑓𝑒𝑐𝑡𝑖𝑜𝑛 𝑖𝑚𝑎𝑔𝑒! ❤️",
        attachment: fs.createReadStream(filePath)
      }, () => fs.unlinkSync(filePath));
    } catch (err) {
      console.error(err);
      message.reply("❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎𝑓𝑓𝑒𝑐𝑡𝑖𝑜𝑛 𝑖𝑚𝑎𝑔𝑒. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
