const fs = require("fs");
const path = require("path");

const LOCKS_PATH = path.join(__dirname, "../../../includes/database/nameLocks.json");
const OWNER_UID = "61571630409265"; // 🔒 𝑶𝒘𝒏𝒆𝒓 𝑼𝑰𝑫

module.exports.config = {
  name: "autosetname",
  version: "1.0",
  author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  countDown: 0,
  role: 0,
  shortDescription: "𝑼𝒔𝒆𝒓 𝒆𝒓 𝒏𝒂𝒎𝒆 𝒍𝒐𝒄𝒌/𝒖𝒏𝒍𝒐𝒄𝒌 𝒌𝒐𝒓𝒂",
  longDescription: "𝑮𝒓𝒐𝒖𝒑 𝒆 𝒖𝒔𝒆𝒓 𝒆𝒓 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒍𝒐𝒄𝒌 𝒃𝒂 𝒖𝒏𝒍𝒐𝒄𝒌 𝒌𝒐𝒓𝒂",
  category: "𝒖𝒕𝒊𝒍𝒊𝒕𝒚",
  guide: {
    en: "{pn} lock @mention NewName\n{pn} unlock @mention"
  }
};

module.exports.run = async function ({ api, event, args }) {
  if (event.senderID !== OWNER_UID) return api.sendMessage("❌ 𝑺𝒊𝒓𝒇 𝒐𝒘𝒏𝒆𝒓 𝒆𝒊 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒄𝒉𝒂𝒍𝒂𝒕𝒆 𝒑𝒂𝒓𝒃𝒆", event.threadID);

  if (!args[0] || event.mentions == undefined || Object.keys(event.mentions).length === 0)
    return api.sendMessage("❌ 𝑼𝒔𝒆: lock/unlock @mention 𝑵𝒂𝒎𝒆", event.threadID);

  const action = args[0].toLowerCase();
  const mentionedID = Object.keys(event.mentions)[0];
  const nameArgs = args.slice(1).join(" ").replace(/@.+?\s/, '').trim();

  let locks = {};
  if (fs.existsSync(LOCKS_PATH)) {
    locks = JSON.parse(fs.readFileSync(LOCKS_PATH, "utf-8"));
  }

  const threadID = event.threadID;

  if (!locks[threadID]) locks[threadID] = {};

  if (action === "lock") {
    if (!nameArgs) return api.sendMessage("❌ 𝑳𝒐𝒄𝒌 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒏𝒂𝒎𝒆 𝒅𝒆𝒘𝒂𝒓 𝒅𝒐𝒓𝒌𝒂𝒓", threadID);

    locks[threadID][mentionedID] = nameArgs;
    fs.writeFileSync(LOCKS_PATH, JSON.stringify(locks, null, 2));
    api.changeNickname(nameArgs, threadID, mentionedID);
    return api.sendMessage(`🔒 𝑵𝒂𝒎𝒆 𝒍𝒐𝒄𝒌 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐: ${nameArgs}`, threadID);
  }

  if (action === "unlock") {
    if (locks[threadID] && locks[threadID][mentionedID]) {
      delete locks[threadID][mentionedID];
      fs.writeFileSync(LOCKS_PATH, JSON.stringify(locks, null, 2));
      return api.sendMessage("🔓 𝑵𝒂𝒎𝒆 𝒖𝒏𝒍𝒐𝒄𝒌 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐", threadID);
    } else {
      return api.sendMessage("⚠️ 𝑵𝒂𝒎𝒆 𝒍𝒐𝒄𝒌 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒏𝒊", threadID);
    }
  }

  return api.sendMessage("❌ 𝑽𝒖𝒍𝒕𝒐 𝒄𝒐𝒎𝒎𝒂𝒏𝒅! 𝑼𝒔𝒆 lock/unlock @mention", threadID);
};
