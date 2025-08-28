const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "winw",
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Generate Who Would Win meme comparing two users' profile pictures"
    },
    description: {
      en: "Mention or reply to two users to create a Who Would Win meme"
    },
    category: "𝗙𝗨𝗡 & 𝗚𝗔𝗠𝗘",
    guide: {
      en: "{p}winw @user1 vs @user2\n—or— reply to two users"
    }
  },

  onStart: async function ({ api, event, message }) {
    try {
      const { mentions, senderID, messageReply } = event;
      let mentionIDs = Object.keys(mentions);

      // 🧠 Support: If fewer than 2 mentions, allow reply chains
      if (mentionIDs.length < 2 && messageReply) {
        mentionIDs.push(messageReply.senderID);
      }

      // Still not enough IDs?
      if (mentionIDs.length < 2) {
        return message.reply("❌ | Please mention or reply to two users.\n👉 Example: +winw @user1 vs @user2");
      }

      // Take first 2 IDs only
      const uid1 = mentionIDs[0];
      const uid2 = mentionIDs[1];

      // FB profile picture URLs
      const avatar1 = `https://graph.facebook.com/${uid1}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;
      const avatar2 = `https://graph.facebook.com/${uid2}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

      // Ensure cache dir
      const cacheDir = path.join(__dirname, "cache");
      fs.ensureDirSync(cacheDir);

      // Call PopCat API
      const res = await axios.get(
        `https://api.popcat.xyz/v2/whowouldwin?image1=${encodeURIComponent(avatar1)}&image2=${encodeURIComponent(avatar2)}`,
        { responseType: "arraybuffer" }
      );

      // Save file
      const filePath = path.join(cacheDir, `winw_${uid1}_${uid2}_${Date.now()}.png`);
      fs.writeFileSync(filePath, res.data);

      await message.reply({
        body: "🤼 | 𝑊ℎ𝑜 𝑊𝑜𝑢𝑙𝑑 𝑊𝑖𝑛?",
        attachment: fs.createReadStream(filePath)
      });

      // Cleanup
      setTimeout(() => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, 5000);

    } catch (err) {
      console.error("WhoWouldWin error:", err);
      message.reply("⚠️ | Failed to generate meme. Please try again later.");
    }
  }
};
