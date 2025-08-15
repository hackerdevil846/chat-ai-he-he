module.exports.config = {
  name: "setname",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Change nicknames in group chats",
  commandCategory: "Box Chat",
  usages: "[new name] or [new name] @mention",
  cooldowns: 3
};

module.exports.languages = {
  "en": {},
  "vi": {}
};

module.exports.onLoad = function () {
  // Nothing special on load
};

module.exports.run = async function({ api, event, args, Threads, Users, Currencies, permssion }) {
  try {
    // Check if name argument is provided
    if (!args || args.length === 0) {
      return api.sendMessage("ℹ️ Please enter a new nickname!", event.threadID);
    }

    const name = args.join(" ");
    const mentionIDs = Object.keys(event.mentions || {});
    const mention = mentionIDs[0]; // Take first mentioned user

    // Change own nickname
    if (!mention) {
      await api.changeNickname(name, event.threadID, event.senderID);
      return api.sendMessage(`✅ Successfully changed your nickname to: ${name}`, event.threadID);
    }

    // Change mentioned user's nickname
    const newName = name.replace(event.mentions[mention], "").trim();
    if (!newName) {
      return api.sendMessage("ℹ️ Please enter a valid nickname after the mention", event.threadID);
    }

    await api.changeNickname(newName, event.threadID, mention);

    // Get user name for confirmation message
    const userInfo = await api.getUserInfo(mention);
    const userName = userInfo[mention]?.name || "the user";

    return api.sendMessage(`✅ Successfully changed ${userName}'s nickname to: ${newName}`, event.threadID);

  } catch (error) {
    console.error("❌ Error:", error);
    return api.sendMessage("❌ An error occurred while changing nickname. Please try again later.", event.threadID);
  }
};
