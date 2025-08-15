module.exports.config = {
  name: "setall",
  version: "1.1.0",
  hasPermssion: 2,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Set nickname for all members in the group",
  commandCategory: "group",
  usages: "[nickname]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args, Users, Threads, permssion }) {
  const { threadID, messageID } = event;

  // Check if nickname is provided
  if (!args[0]) {
    return api.sendMessage("❌ Please enter a nickname to set for all members!", threadID, messageID);
  }

  const nickname = args.join(" ");
  const maxNicknameLength = 20; // Facebook limit

  // Validate nickname length
  if (nickname.length > maxNicknameLength) {
    return api.sendMessage(`❌ Nickname too long! Maximum ${maxNicknameLength} characters.`, threadID, messageID);
  }

  try {
    api.sendMessage(`🔄 Starting to set "${nickname}" as nickname for all members...`, threadID, messageID);

    // Get thread info
    const threadInfo = await api.getThreadInfo(threadID);
    const botID = api.getCurrentUserID();

    // Check if bot is admin
    const isBotAdmin = threadInfo.adminIDs.some(admin => admin.id === botID);
    if (!isBotAdmin) {
      return api.sendMessage("❌ Bot must be an admin to set nicknames!", threadID, messageID);
    }

    const participantIDs = threadInfo.participantIDs.filter(id => id !== botID);

    let successCount = 0;
    let failedCount = 0;
    const failedUsers = [];

    // Loop through participants and set nicknames
    for (const userID of participantIDs) {
      try {
        await new Promise(resolve => setTimeout(resolve, 2500)); // Delay to prevent rate limit
        await api.changeNickname(nickname, threadID, userID);
        successCount++;
      } catch (err) {
        failedCount++;
        failedUsers.push(userID);
        console.error(`❌ Failed to set nickname for ${userID}:`, err);
      }
    }

    // Construct result message
    let resultMessage = `✅ Successfully set "${nickname}" for ${successCount} members.`;
    if (failedCount > 0) {
      resultMessage += `\n❌ Failed for ${failedCount} members: ${failedUsers.join(", ")}`;
    }

    api.sendMessage(resultMessage, threadID, messageID);

  } catch (error) {
    console.error("❌ ERROR:", error);
    api.sendMessage("❌ An error occurred while processing your request.", threadID, messageID);
  }
};
