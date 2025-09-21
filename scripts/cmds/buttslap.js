const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "buttslap",
    aliases: ["spank", "bumslap"],
    version: "1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "fun",
    shortDescription: {
      en: "🖐️ 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎 𝑓𝑢𝑛𝑛𝑦 𝑏𝑢𝑡𝑡𝑠𝑙𝑎𝑝 𝑖𝑚𝑎𝑔𝑒"
    },
    longDescription: {
      en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑓𝑢𝑛𝑛𝑦 𝑠𝑙𝑎𝑝 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑡𝑎𝑔𝑔𝑒𝑑 𝑢𝑠𝑒𝑟'𝑠 𝑎𝑣𝑎𝑡𝑎𝑟"
    },
    guide: {
      en: "{p}buttslap @𝑡𝑎𝑔 [𝑜𝑝𝑡𝑖𝑜𝑛𝑎𝑙 𝑡𝑒𝑥𝑡]"
    },
    countDown: 5,
    dependencies: {
      "discord-image-generation": "",
      "fs-extra": ""
    }
  },

  langs: {
    en: {
      noTag: "⚠️ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑠𝑙𝑎𝑝!",
      error: "❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.",
      successFallback: "💢 *𝑠𝑙𝑎𝑝𝑠* 💥"
    }
  },

  onStart: async function({ api, event, args, message, getText }) {
    try {
      const { threadID, senderID } = event;
      
      let uid2 = null;
      if (event.mentions && typeof event.mentions === "object") {
        const mentionKeys = Object.keys(event.mentions);
        if (mentionKeys.length > 0) uid2 = mentionKeys[0];
      }

      if (!uid2 && args.length > 0) {
        const possible = args[0].replace(/[^0-9]/g, "");
        if (possible && possible.length >= 5) uid2 = possible;
      }

      if (!uid2) {
        return message.reply(getText("noTag"));
      }

      const uid1 = senderID;

      async function resolveAvatarUrl(uid) {
        try {
          const userInfo = await api.getUserInfo(uid);
          if (userInfo && userInfo[uid]) {
            return userInfo[uid].profileUrl || `https://graph.facebook.com/${uid}/picture?type=large`;
          }
          return `https://graph.facebook.com/${uid}/picture?type=large`;
        } catch (e) {
          return `https://graph.facebook.com/${uid}/picture?type=large`;
        }
      }

      const avatarURL1 = await resolveAvatarUrl(uid1);
      const avatarURL2 = await resolveAvatarUrl(uid2);

      const imgBuffer = await new DIG.Spank().getImage(avatarURL1, avatarURL2);

      const tmpDir = path.join(__dirname, "tmp");
      fs.ensureDirSync(tmpDir);

      const pathSave = path.join(tmpDir, `${uid1}_${uid2}_spank.png`);
      fs.writeFileSync(pathSave, Buffer.from(imgBuffer));

      let content = "";
      try {
        if (event.mentions && typeof event.mentions === "object") {
          const mentionKeys = Object.keys(event.mentions);
          const mentionRegexes = mentionKeys.map(k => new RegExp(k, "g"));
          content = args.join(" ");
          mentionRegexes.forEach(r => content = content.replace(r, ""));
          content = content.replace(/@/g, "").trim();
        } else {
          content = args.join(" ").trim();
        }
      } catch (e) {
        content = args.join(" ").trim();
      }

      if (!content) content = getText("successFallback");

      await message.reply({
        body: content,
        attachment: fs.createReadStream(pathSave)
      });

      try {
        fs.unlinkSync(pathSave);
      } catch (e) {
        console.error("Failed to remove temp file:", e);
      }

    } catch (error) {
      console.error("Buttslap error:", error);
      return message.reply(getText("error"));
    }
  }
};
