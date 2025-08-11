module.exports = {
  config: {
    name: "kick",
    version: "2.0.0",
    hasPermssion: 1,  // Corrected spelling (two 's')
    credits: "Asif",
    description: "Remove tagged users from the group",
    category: "group",  // Correct category name
    usages: "[@mention1 @mention2 ...]",
    cooldowns: 5,
    dependencies: {}
  },

  languages: {
    en: {
      error: "❌ An error occurred while processing the kick command",
      needPermssion: "🔒 Bot needs admin privileges to perform this action",
      missingTag: "📍 Please tag user(s) to kick",
      success: "✅ Successfully kicked %1 user(s)",
      noPermission: "⚠️ You don't have permission to use this command",
      botNotAdmin: "🤖 I need to be admin to kick users",
      cantKickAdmin: "⛔ Skipped %1 admin(s): %2",
      processing: "⏳ Processing kick request...",
      selfKick: "🤔 You can't kick yourself!",
      botKick: "🚫 I can't kick myself!",
      notInGroup: "👤 User not found in this group: %1",
      failed: "❌ Failed to kick: %1"
    }
  },

  onStart: async function({ api, event, getText }) {
    const { threadID, messageID, mentions, senderID } = event;
    
    try {
      // Get thread information
      const threadInfo = await api.getThreadInfo(threadID);
      const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
      const participantIDs = threadInfo.participantIDs;
      
      // Check bot admin status
      const botID = api.getCurrentUserID();
      if (!adminIDs.includes(botID)) {
        return api.sendMessage(getText("botNotAdmin"), threadID, messageID);
      }

      // Check user admin status
      if (!adminIDs.includes(senderID)) {
        return api.sendMessage(getText("noPermission"), threadID, messageID);
      }

      // Validate mentions
      const mentionKeys = Object.keys(mentions);
      if (mentionKeys.length === 0) {
        return api.sendMessage(getText("missingTag"), threadID, messageID);
      }

      api.sendMessage(getText("processing"), threadID, messageID);

      // Process kicking
      let successCount = 0;
      const skippedAdmins = [];
      const failedUsers = [];
      const notInGroup = [];

      for (const userID of mentionKeys) {
        // Skip special cases
        if (userID === senderID) {
          api.sendMessage(getText("selfKick"), threadID);
          continue;
        }
        
        if (userID === botID) {
          api.sendMessage(getText("botKick"), threadID);
          continue;
        }
        
        // Check if user is in group
        if (!participantIDs.includes(userID)) {
          notInGroup.push(mentions[userID]);
          continue;
        }
        
        // Skip admins
        if (adminIDs.includes(userID)) {
          skippedAdmins.push(mentions[userID]);
          continue;
        }

        try {
          // Kick user
          await api.removeUserFromGroup(userID, threadID);
          successCount++;
          // Add delay between kicks to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          failedUsers.push(mentions[userID]);
        }
      }

      // Prepare result message
      let resultMessage = getText("success").replace("%1", successCount);
      
      if (skippedAdmins.length > 0) {
        resultMessage += "\n" + getText("cantKickAdmin")
          .replace("%1", skippedAdmins.length)
          .replace("%2", skippedAdmins.join(", "));
      }
      
      if (failedUsers.length > 0) {
        resultMessage += "\n" + getText("failed").replace("%1", failedUsers.join(", "));
      }
      
      if (notInGroup.length > 0) {
        resultMessage += "\n" + getText("notInGroup").replace("%1", notInGroup.join(", "));
      }

      api.sendMessage(resultMessage, threadID, messageID);

    } catch (error) {
      console.error("Kick command error:", error);
      api.sendMessage(getText("error"), threadID, messageID);
    }
  }
};
