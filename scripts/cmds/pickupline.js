const axios = require("axios");

module.exports = {
  config: {
    name: "pickuplines",
    aliases: ["pickupline"],
    version: "1.2",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "Get random flirty pickup lines",
      bn: "র‍্যান্ডম ফ্লার্টি পিক-আপ লাইন"
    },
    longDescription: {
      en: "Discover charming pickup lines to impress someone special!",
      bn: "কাউকে ইম্প্রেস করার জন্য সুন্দর পিক-আপ লাইন খুঁজে নিন!"
    },
    guide: {
      en: "{p}pickuplines",
      bn: "{p}pickuplines"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      const response = await axios.get("https://api.popcat.xyz/pickuplines");
      const pickupline = response.data.pickupline || "Couldn't fetch a line. Try again later 💔";

      const formattedLine = `💘 | 𝗣𝗜𝗖𝗞-𝗨𝗣 𝗟𝗜𝗡𝗘 𝗙𝗢𝗥 𝗬𝗢𝗨\n\n✨ ❝ ${pickupline} ❞ ✨`;
      
      return api.sendMessage({
        body: formattedLine,
        mentions: [{
          tag: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
          id: event.senderID
        }]
      }, event.threadID, event.messageID);
    } catch (error) {
      console.error("[PickupLine Error]", error.message);
      return api.sendMessage(
        "🌸 | 𝙰𝙿𝙸 𝙴𝚁𝚁𝙾𝚁! 𝚃𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛.",
        event.threadID,
        event.messageID
      );
    }
  }
};
