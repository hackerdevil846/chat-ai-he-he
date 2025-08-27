const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "gray",
    version: "1.0",
    author: "𝘾𝙝𝙞𝙩𝙧𝙤𝙣 𝘽𝙝𝙖𝙩𝙩𝙖𝙘𝙝𝙖𝙧𝙟𝙚𝙚",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "𝘊𝘰𝘯𝘷𝘦𝘳𝘵 𝘱𝘳𝘰𝘧𝘪𝘭𝘦 𝘱𝘪𝘤𝘵𝘶𝘳𝘦 𝘵𝘰 𝘨𝘳𝘢𝘺𝘴𝘤𝘢𝘭𝘦"
    },
    description: {
      en: "𝘛𝘶𝘳𝘯𝘴 𝘺𝘰𝘶𝘳 𝘰𝘳 𝘮𝘦𝘯𝘵𝘪𝘰𝘯𝘦𝘥 𝘶𝘴𝘦𝘳'𝘴 𝘱𝘳𝘰𝘧𝘪𝘭𝘦 𝘱𝘪𝘤𝘵𝘶𝘳𝘦 𝘪𝘯𝘵𝘰 𝘢 𝘨𝘳𝘢𝘺𝘴𝘤𝘢𝘭𝘦 𝘪𝘮𝘢𝘨𝘦"
    },
    category: "𝗙𝗨𝗡 & 𝗚𝗔𝗠𝗘",
    guide: {
      en: "{𝘱}𝘨𝘳𝘢𝘺𝘴𝘤𝘢𝘭𝘦 [@𝘮𝘦𝘯𝘵𝘪𝘰𝘯 𝘰𝘳 𝘳𝘦𝘱𝘭𝘺]\n𝘐𝘧 𝘯𝘰 𝘮𝘦𝘯𝘵𝘪𝘰𝘯 𝘰𝘳 𝘳𝘦𝘱𝘭𝘺, 𝘶𝘴𝘦𝘴 𝘺𝘰𝘶𝘳 𝘱𝘳𝘰𝘧𝘪𝘭𝘦 𝘱𝘪𝘤𝘵𝘶𝘳𝘦."
    }
  },

  onStart: async function ({ api, event, message }) {
    const { senderID, mentions, type, messageReply } = event;

    // Determine user ID for avatar
    let uid;
    if (Object.keys(mentions).length > 0) {
      uid = Object.keys(mentions)[0];
    } else if (type === "message_reply") {
      uid = messageReply.senderID;
    } else {
      uid = senderID;
    }

    const avatarURL = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

    try {
      const res = await axios.get(`https://api.popcat.xyz/v2/greyscale?image=${encodeURIComponent(avatarURL)}`, {
        responseType: "arraybuffer"
      });

      const filePath = path.join(__dirname, "cache", `greyscale_${uid}_${Date.now()}.png`);
      fs.writeFileSync(filePath, res.data);

      message.reply({
        body: "⚫ 𝘏𝘦𝘳𝘦'𝘴 𝘺𝘰𝘶𝘳 𝘨𝘳𝘢𝘺𝘴𝘤𝘢𝘭𝘦 𝘪𝘮𝘢𝘨𝘦!",
        attachment: fs.createReadStream(filePath)
      }, () => fs.unlinkSync(filePath));

    } catch (err) {
      console.error(err);
      message.reply("❌ | 𝘍𝘢𝘪𝘭𝘦𝘥 𝘵𝘰 𝘨𝘦𝘯𝘦𝘳𝘢𝘵𝘦 𝘨𝘳𝘢𝘺𝘴𝘤𝘢𝘭𝘦 𝘪𝘮𝘢𝘨𝘦.");
    }
  }
};
