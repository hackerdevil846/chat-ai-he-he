module.exports = {
  config: {
    name: "filter",
    version: "2.4.0",
    hasPermission: 1,
    credits: "Asif",
    description: "Identify and remove Facebook User accounts from groups",
    category: "admin",
    usages: "",
    cooldowns: 300,
    dependencies: {}
  },

  onStart: async function({ api, event }) {
    const { threadID, messageID } = event;
    
    try {
      // Send initial processing message
      const processingMsg = await api.sendMessage(
        "🔍 Scanning group members...\n━━━━━━━━━━━━━━\nLooking for Facebook User accounts",
        threadID,
        messageID
      );
      
      // Get detailed thread information
      const threadInfo = await api.getThreadInfo(threadID);
      const { userInfo, adminIDs } = threadInfo;
      
      // Check if bot is admin
      const isBotAdmin = adminIDs.some(admin => admin.id === api.getCurrentUserID());
      if (!isBotAdmin) {
        await api.unsendMessage(processingMsg.messageID);
        return api.sendMessage(
          "❌ Error: Bot must be a group admin to use this command",
          threadID,
          messageID
        );
      }
      
      // Find Facebook User accounts (without gender info)
      const facebookUsers = userInfo.filter(user => user.gender === undefined);
      
      if (facebookUsers.length === 0) {
        await api.unsendMessage(processingMsg.messageID);
        return api.sendMessage(
          "✅ Result: No Facebook User accounts found in this group",
          threadID,
          messageID
        );
      }
      
      // Update processing message
      await api.sendMessage(
        `⚠️ Found ${facebookUsers.length} Facebook User accounts\n━━━━━━━━━━━━━━\nStarting removal process...\n⏱️ This may take several minutes`,
        threadID,
        messageID
      );
      
      // Process each user
      let successCount = 0;
      let failCount = 0;
      const failedNames = [];
      
      for (const [index, user] of facebookUsers.entries()) {
        try {
          // Add delay to prevent rate limiting
          await new Promise(resolve => setTimeout(resolve, 2500));
          
          // Attempt to remove user
          await api.removeUserFromGroup(user.id, threadID);
          successCount++;
          
          // Update progress every 5 users
          if ((index + 1) % 5 === 0 || (index + 1) === facebookUsers.length) {
            await api.sendMessage(
              `⏳ Progress: Removed ${successCount}/${facebookUsers.length} accounts`,
              threadID,
              messageID
            );
          }
        } catch (error) {
          failCount++;
          failedNames.push(user.name || user.id);
        }
      }
      
      // Prepare results
      let resultMessage = `✅ Filtering Complete!\n━━━━━━━━━━━━━━\n` +
                         `• Total Accounts Found: ${facebookUsers.length}\n` +
                         `• Successfully Removed: ${successCount}\n` +
                         `• Failed to Remove: ${failCount}`;
      
      if (failCount > 0) {
        resultMessage += `\n\n📛 Failed Accounts:\n` +
                         `• ${failedNames.slice(0, 10).join("\n• ")}` +
                         `${failedNames.length > 10 ? `\n• ...and ${failedNames.length - 10} more` : ''}` +
                         `\n\nℹ️ Possible reasons for failure:\n` +
                         `- User is a group admin\n` +
                         `- User already left the group\n` +
                         `- Permission limitations`;
      }
      
      // Send final results
      api.sendMessage(resultMessage, threadID, messageID);
      
    } catch (error) {
      console.error("Filter command error:", error);
      api.sendMessage(
        "❌ An unexpected error occurred. Please try again later.",
        threadID,
        messageID
      );
    }
  }
};
