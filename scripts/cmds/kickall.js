module.exports.config = {
  name: "kickall", // Command name
  version: "1.0.0", // Module version
  hasPermssion: 2, // Only bot admins/owners can use
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // Module creator
  description: "Kick out all non-admin members inside the group 🚫👥", 
  category: "group",
  usages: "[]",
  cooldowns: 3,
  dependencies: {},
  envConfig: {}
};

module.exports.languages = {
  "en": {
    groupOnly: "❌ This command can only be used in group chats!",
    noMembersToKick: "⚠️ All members are either admins or the bot itself, nothing to kick!",
    preparingKick: (count, groupName) => `⏳ Preparing to kick ${count} members from "${groupName}". Please wait...`,
    kickCompleted: (count) => `✅ Kickall process completed. ${count} members were processed successfully!`,
    kickFailed: (userId) => `❌ Failed to kick user ${userId}. Continuing with the next user...`
  },
  "bn": {
    groupOnly: "❌ এই কমান্ডটি শুধুমাত্র গ্রুপ চ্যাটে ব্যবহার করা যাবে!",
    noMembersToKick: "⚠️ সকল সদস্য হয় অ্যাডমিন, নয়তো বট নিজেই। কোন সদস্য নেই কিক করার জন্য!",
    preparingKick: (count, groupName) => `⏳ ${groupName} গ্রুপ থেকে ${count} জন সদস্য কিক করার প্রস্তুতি চলছে। দয়া করে অপেক্ষা করুন...`,
    kickCompleted: (count) => `✅ কিকঅল সম্পন্ন। ${count} জন সদস্য প্রসেস করা হয়েছে!`,
    kickFailed: (userId) => `❌ ${userId} ব্যবহারকারীকে কিক করতে ব্যর্থ। পরবর্তী ব্যবহারকারীর দিকে যাচ্ছি...`
  }
};

module.exports.onLoad = async function() {
  // Initialization code when command is loaded
  console.log("✅ Kickall command loaded successfully.");
  return true;
};

module.exports.onStart = async function({ api, event, args }) {
  try {
    // Check if command is used in a group
    if (!event.isGroup) {
      return api.sendMessage(module.exports.languages.en.groupOnly, event.threadID);
    }

    // Fetch thread info
    const threadInfo = await api.getThreadInfo(event.threadID);
    const participantIDs = threadInfo.participantIDs;
    const adminIDs = threadInfo.adminIDs.map(admin => admin.id);

    // Get bot ID
    const botID = api.getCurrentUserID();

    // Filter users to kick (exclude bot, command sender, and admins)
    const usersToKick = participantIDs.filter(userId => {
      return userId !== botID &&
             userId !== event.senderID &&
             !adminIDs.includes(userId);
    });

    if (usersToKick.length === 0) {
      return api.sendMessage(module.exports.languages.en.noMembersToKick, event.threadID);
    }

    // Send preparation message
    const confirmationMsg = await api.sendMessage(
      module.exports.languages.en.preparingKick(usersToKick.length, threadInfo.threadName),
      event.threadID
    );

    // Helper delay function
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // Kick users one by one
    for (let i = 0; i < usersToKick.length; i++) {
      const userId = usersToKick[i];

      try {
        await delay(5000); // 5-second delay for safety
        await api.removeUserFromGroup(userId, event.threadID);
        console.log(`✅ Successfully kicked: ${userId}`);
      } catch (error) {
        console.error(`❌ Failed to kick ${userId}:`, error.message);
        await api.sendMessage(module.exports.languages.en.kickFailed(userId), event.threadID);
        await delay(2000); // Short delay if an error occurs
      }
    }

    // Completion message with auto-delete after 30 seconds
    await api.sendMessage(
      module.exports.languages.en.kickCompleted(usersToKick.length),
      event.threadID,
      (error, info) => {
        if (!error) {
          setTimeout(() => {
            api.unsendMessage(event.threadID, info.messageID).catch(() => {});
          }, 30000);
        }
      }
    );

  } catch (error) {
    console.error("❌ Error in kickall command execution:", error);
    return api.sendMessage(`❌ Failed to execute kickall command: ${error.message}`, event.threadID);
  }
};
