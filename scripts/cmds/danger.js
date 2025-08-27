const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "danger",
    version: "1.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Create a danger style image with custom text"
    },
    description: {
      en: "Generates a danger style meme image using your text"
    },
    category: "𝗙𝗨𝗡 & 𝗚𝗔𝗠𝗘",
    guide: {
      en: "{p}danger <text>\nExample: {p}danger Stay away!"
    }
  },

  langs: {
    en: {
      missing: "❌ | Please provide text for the danger image.",
      error: "❌ | Failed to generate danger image."
    }
  },

  onStart: async function ({ message, args, getLang }) {
    if (!args.length) return message.reply(getLang("missing"));

    const text = encodeURIComponent(args.join(" "));

    try {
      const res = await axios.get(`https://api.popcat.xyz/v2/caution?text=${text}`, {
        responseType: "arraybuffer"
      });

      const filePath = path.join(__dirname, "cache", `danger_${Date.now()}.png`);
      fs.writeFileSync(filePath, res.data);

      message.reply({
        body: "☣️ Here's your danger image!",
        attachment: fs.createReadStream(filePath)
      }, () => fs.unlinkSync(filePath));
    } catch (err) {
      console.error(err);
      message.reply(getLang("error"));
    }
  }
};
