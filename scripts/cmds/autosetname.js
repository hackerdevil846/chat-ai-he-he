const fs = require("fs");
const path = require("path");

const LOCKS_PATH = path.join(__dirname, "../../../includes/database/nameLocks.json");
const OWNER_UID = "61571630409265"; // 🔒 Owner UID

module.exports = {
  config: {
    name: "autosetname",
    aliases: ["namelock"],
    version: "1.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 3,
    role: 2,
    category: "𝒖𝒕𝒊𝒍𝒊𝒕𝒚",
    shortDescription: {
      en: "𝑼𝒔𝒆𝒓 𝒆𝒓 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒈𝒓𝒐𝒖𝒑 𝒆 𝒍𝒐𝒄𝒌/𝒖𝒏𝒍𝒐𝒄𝒌 𝒌𝒐𝒓𝒂"
    },
    longDescription: {
      en: "𝑮𝒓𝒐𝒖𝒑 𝒆 𝒖𝒔𝒆𝒓 𝒅𝒆𝒓 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒍𝒐𝒄𝒌 𝒂𝒃𝒐𝒏𝒈 𝒖𝒏𝒍𝒐𝒄𝒌 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒄𝒐𝒎𝒎𝒂𝒏𝒅"
    },
    guide: {
      en: "{p}autosetname [lock/unlock] @mention [𝒏𝒂𝒎𝒆]"
    }
  },

  onStart: async function({ message, event, args }) {
    try {
      if (event.senderID !== OWNER_UID) {
        return await message.reply("❌ 𝑺𝒊𝒓𝒇 𝒐𝒘𝒏𝒆𝒓 𝒆𝒊 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒄𝒉𝒂𝒍𝒂𝒕𝒆 𝒑𝒂𝒓𝒃𝒆!");
      }

      if (!args[0] || event.mentions == undefined || Object.keys(event.mentions).length === 0) {
        return await message.reply("❌ 𝑼𝒔𝒆: 𝒍𝒐𝒄𝒌/𝒖𝒏𝒍𝒐𝒄𝒌 @𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝑵𝒂𝒎𝒆");
      }

      const action = args[0].toLowerCase();
      const mentionedID = Object.keys(event.mentions)[0];
      const nameArgs = args.slice(1).join(" ").replace(/@.+?\s/, '').trim();

      let locks = {};
      if (fs.existsSync(LOCKS_PATH)) {
        locks = JSON.parse(fs.readFileSync(LOCKS_PATH, "utf-8"));
      }

      const threadID = event.threadID;
      if (!locks[threadID]) locks[threadID] = {};

      // 🔒 Lock action
      if (action === "lock") {
        if (!nameArgs) {
          return await message.reply("❌ 𝑳𝒐𝒄𝒌 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒆𝒌𝒕𝒂 𝒏𝒂𝒎𝒆 𝒅𝒊𝒕𝒆 𝒉𝒐𝒃𝒆!");
        }

        locks[threadID][mentionedID] = nameArgs;
        fs.writeFileSync(LOCKS_PATH, JSON.stringify(locks, null, 2));
        
        // Change nickname using API
        const { api } = global;
        await api.changeNickname(nameArgs, threadID, mentionedID);

        return await message.reply(`🔒 𝑵𝒂𝒎𝒆 𝒍𝒐𝒄𝒌 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐: ${nameArgs}`);
      }

      // 🔓 Unlock action
      if (action === "unlock") {
        if (locks[threadID] && locks[threadID][mentionedID]) {
          delete locks[threadID][mentionedID];
          fs.writeFileSync(LOCKS_PATH, JSON.stringify(locks, null, 2));
          return await message.reply("🔓 𝑵𝒂𝒎𝒆 𝒖𝒏𝒍𝒐𝒄𝒌 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐!");
        } else {
          return await message.reply("⚠️ 𝑬𝒊 𝒖𝒔𝒆𝒓 𝒆𝒓 𝒌𝒐𝒏𝒐 𝒏𝒂𝒎𝒆 𝒍𝒐𝒄𝒌 𝒌𝒐𝒓𝒂 𝒏𝒆𝒊!");
        }
      }

      return await message.reply("❌ 𝑽𝒖𝒍 𝒄𝒐𝒎𝒎𝒂𝒏𝒅! 𝑼𝒔𝒆: 𝒍𝒐𝒄𝒌/𝒖𝒏𝒍𝒐𝒄𝒌 @𝒎𝒆𝒏𝒕𝒊𝒐𝒏");
      
    } catch (error) {
      console.error("🔴 𝑬𝒓𝒓𝒐𝒓:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒓𝒆𝒒𝒖𝒆𝒔𝒕");
    }
  }
};
