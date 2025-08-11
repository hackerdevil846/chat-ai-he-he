const OWNER_UID = "61571630409265"; // Updated to your specified UID
let lockedGroupNames = {};

module.exports.config = {
  name: "lockname",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑮𝒓𝒐𝒖𝒑 𝒆𝒓 𝒏𝒂𝒎 𝒍𝒐𝒄𝒌 𝒌𝒐𝒓𝒖𝒏. 𝑵𝒂𝒎 𝒄𝒉𝒂𝒏𝒈𝒆 𝒌𝒐𝒓𝒍𝒆 𝒃𝒐𝒕 𝒑𝒖𝒏𝒂𝒓 𝒔𝒆𝒕 𝒌𝒐𝒓𝒆. 𝑶𝒘𝒏𝒆𝒓 𝒆𝒓 𝒋𝒐𝒏𝒏𝒐.",
  commandCategory: "𝑮𝒓𝒐𝒖𝒑",
  usages: "𝒍𝒐𝒄𝒌𝒏𝒂𝒎𝒆 𝒍𝒐𝒄𝒌/𝒖𝒏𝒍𝒐𝒄𝒌/𝒓𝒆𝒔𝒆𝒕",
  cooldowns: 3
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, senderID } = event;
  
  // Check if user is the owner
  if (senderID !== OWNER_UID) {
    return api.sendMessage("⛔ 𝑺𝒊𝒓𝒇 𝒎𝒂𝒍𝒊𝒌 𝒆𝒊 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒄𝒉𝒂𝒍𝒂𝒕𝒆 𝒑𝒂𝒓𝒃𝒆!", threadID);
  }

  const subcmd = args[0]?.toLowerCase();
  if (!subcmd) {
    return api.sendMessage("⚠️ 𝑼𝒔𝒂𝒈𝒆: 𝒍𝒐𝒄𝒌𝒏𝒂𝒎𝒆 𝒍𝒐𝒄𝒌/𝒖𝒏𝒍𝒐𝒄𝒌/𝒓𝒆𝒔𝒆𝒕 <𝒏𝒂𝒎𝒆>", threadID);
  }

  switch (subcmd) {
    case "lock": {
      const name = args.slice(1).join(" ");
      if (!name) return api.sendMessage("❗ 𝑵𝒂𝒎 𝒅𝒊𝒚𝒆𝒏 𝒏𝒂?\n𝑼𝒔𝒂𝒈𝒆: 𝒍𝒐𝒄𝒌𝒏𝒂𝒎𝒆 𝒍𝒐𝒄𝒌 𝑮𝒓𝒐𝒖𝒑 𝑵𝒂𝒎", threadID);
      
      lockedGroupNames[threadID] = name;
      await api.setTitle(name, threadID);
      return api.sendMessage(`🔒 𝑮𝒓𝒐𝒖𝒑 𝒏𝒂𝒎 𝒍𝒐𝒄𝒌 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐: ${name}`, threadID);
    }

    case "unlock": {
      delete lockedGroupNames[threadID];
      return api.sendMessage("🔓 𝑮𝒓𝒐𝒖𝒑 𝒏𝒂𝒎 𝒖𝒏𝒍𝒐𝒄𝒌 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐", threadID);
    }

    case "reset": {
      if (!lockedGroupNames[threadID]) {
        return api.sendMessage("⚠️ 𝑲𝒐𝒏𝒐 𝒏𝒂𝒎 𝒍𝒐𝒄𝒌 𝒏𝒂𝒊 𝒌𝒐𝒓𝒂", threadID);
      }
      
      await api.setTitle(lockedGroupNames[threadID], threadID);
      return api.sendMessage(`♻️ 𝑮𝒓𝒐𝒖𝒑 𝒏𝒂𝒎 𝒑𝒖𝒏𝒂𝒓 𝒔𝒆𝒕 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐: ${lockedGroupNames[threadID]}`, threadID);
    }

    default:
      return api.sendMessage("⚠️ 𝑼𝒔𝒂𝒈𝒆: 𝒍𝒐𝒄𝒌𝒏𝒂𝒎𝒆 𝒍𝒐𝒄𝒌/𝒖𝒏𝒍𝒐𝒄𝒌/𝒓𝒆𝒔𝒆𝒕 <𝒏𝒂𝒎𝒆>", threadID);
  }
};

module.exports.lockedNames = lockedGroupNames;
