const fs = require("fs");
const path = require("path");

const LOCKS_PATH = path.join(__dirname, "../../../includes/database/nameLocks.json");
const OWNER_UID = "61571630409265"; // 🔒 Owner UID

module.exports.config = {
  name: "autosetname",
  version: "1.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "User er nickname group e lock/unlock kora",
  category: "utility",
  usages: "{pn} lock @mention NewName\n{pn} unlock @mention",
  cooldowns: 3
};

module.exports.onStart = async function ({ api, event, args }) {
  if (event.senderID !== OWNER_UID) {
    return api.sendMessage("❌ Sirf owner ei command chalate parbe!", event.threadID, event.messageID);
  }

  if (!args[0] || event.mentions == undefined || Object.keys(event.mentions).length === 0) {
    return api.sendMessage("❌ Use: lock/unlock @mention Name", event.threadID, event.messageID);
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
      return api.sendMessage("❌ Lock korar jonne ekta name dite hobe!", threadID, event.messageID);
    }

    locks[threadID][mentionedID] = nameArgs;
    fs.writeFileSync(LOCKS_PATH, JSON.stringify(locks, null, 2));
    api.changeNickname(nameArgs, threadID, mentionedID);

    return api.sendMessage(`🔒 Name lock kora holo: ${nameArgs}`, threadID, event.messageID);
  }

  // 🔓 Unlock action
  if (action === "unlock") {
    if (locks[threadID] && locks[threadID][mentionedID]) {
      delete locks[threadID][mentionedID];
      fs.writeFileSync(LOCKS_PATH, JSON.stringify(locks, null, 2));
      return api.sendMessage("🔓 Name unlock kora holo!", threadID, event.messageID);
    } else {
      return api.sendMessage("⚠️ Ei user er kono name lock kora nei!", threadID, event.messageID);
    }
  }

  return api.sendMessage("❌ Vul command! Use: lock/unlock @mention", threadID, event.messageID);
};
