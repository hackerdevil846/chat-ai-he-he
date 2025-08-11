const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "hug",
    version: "1.0",
    author: "Asif",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Send a hug gif to one or two mentioned users.",
    },
    longDescription: {
      en: "This command sends a hug gif to one or two mentioned users.",
    },
    category: "fun",
    guide: {
      en: "Use /hug with one or two mentions to send a hug gif.",
    },
  },

  onStart: async function ({
    api,
    args,
    message,
    event,
    global,
  }) {
    const { threadID, senderID, mentions } = event;
    const { getPrefix } = global.utils;
    const prefix = getPrefix(threadID);

    // Permission check
    const approvedPath = path.join(__dirname, "assist_json", "approved_main.json");
    const bypassPath = path.join(__dirname, "assist_json", "bypass_id.json");
    const approvedList = JSON.parse(fs.readFileSync(approvedPath));
    const bypassList = JSON.parse(fs.readFileSync(bypassPath));

    if (!bypassList.includes(senderID) && !approvedList.includes(threadID)) {
      const msg = await message.reply(`cmd 'hug' is locked 🔒...\nReason: Bot's main cmd.\nYou need permission to use this.\n\nUse: ${prefix}requestMain to request access.`);
      setTimeout(() => message.unsend(msg.messageID), 40000);
      return;
    }

    // Mention handling
    let uid1 = null, uid2 = null;
    if (Object.keys(mentions).length === 2) {
      uid1 = Object.keys(mentions)[0];
      uid2 = Object.keys(mentions)[1];
    } else if (Object.keys(mentions).length === 1) {
      uid1 = senderID;
      uid2 = Object.keys(mentions)[0];
    } else {
      return message.reply("Please mention one or two users to send a hug gif.");
    }

    // Special case for Asif 💁
    if ((uid1 === '61571630409265' || uid2 === '61571630409265') && (uid1 !== uid2)) {
      uid1 = '61571630409265';
      uid2 = '61571630409265';
      message.reply("Sorry 🥱💁\n\nI only hug Asif 😌💗");
    }

    // Get usernames
    const userInfo = await api.getUserInfo([uid1, uid2]);
    const name1 = userInfo[uid1]?.name?.split(' ').pop() || "User1";
    const name2 = userInfo[uid2]?.name?.split(' ').pop() || "User2";

    try {
      const gifRes = await axios.get("https://nekos.best/api/v2/hug?amount=1");
      const gifUrl = gifRes.data.results[0].url;

      const gifData = await axios.get(gifUrl, { responseType: "arraybuffer" });
      const fileName = `hug_${uid1}_${uid2}.gif`;
      const filePath = path.join(__dirname, "cache", fileName);
      fs.ensureDirSync(path.join(__dirname, "cache"));
      fs.writeFileSync(filePath, gifData.data);

      await message.reply({
        body: `${name1} 🤗 ${name2}`,
        attachment: fs.createReadStream(filePath),
      });

      fs.unlink(filePath, () => {});
    } catch (err) {
      console.error("❌ Hug command error:", err.message || err);
      message.reply("There was an error processing the hug gif.");
    }
  },
};
