module.exports.config = {
  name: "kickall",
  version: "1.0.0",
  permission: 2,
  credits: "Asif",
  description: "Kick out all members inside the group",
  category: "group",
  usages: "[]",
  cooldowns: 3,
  prefix: true
};

// Required initialization function for the framework
module.exports.onStart = async function() {
  // This function can be used for command initialization
  return true;
};

// Main command execution
module.exports.run = async function({ api, event, args }) {
  try {
    // Check if command is used in a group
    if (!event.isGroup) {
      return api.sendMessage("This command can only be used in group chats.", event.threadID);
    }

    // Get thread information
    const threadInfo = await api.getThreadInfo(event.threadID);
    const participantIDs = threadInfo.participantIDs;
    const adminIDs = threadInfo.adminIDs.map(admin => admin.id);

    // Get the current bot ID
    const botID = api.getCurrentUserID();

    // Filter out the bot and admins (except the one executing the command)
    const usersToKick = participantIDs.filter(userId => {
      return userId !== botID &&
             userId !== event.senderID &&
             (!adminIDs.includes(userId));
    });

    // Exit if no users to kick
    if (usersToKick.length === 0) {
      return api.sendMessage("All members are either admins or the bot itself.", event.threadID);
    }

    // Send confirmation message
    const confirmationMsg = await api.sendMessage(
      `Preparing to kick ${usersToKick.length} members from ${threadInfo.threadName}. This may take some time.`,
      event.threadID
    );

    // Delay function with configuration
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Process users with delays
    for (let i = 0; i < usersToKick.length; i++) {
      const userId = usersToKick[i];

      try {
        await delay(5000); // 5 second delay between kicks

        // Try to remove user from group
        await api.removeUserFromGroup(userId, event.threadID);

        // Optional: Log to console or database
        console.log(`Successfully kicked: ${userId}`);

      } catch (error) {
        console.error(`Failed to kick ${userId}:`, error.message);

        // Continue with next user even if current one fails
        await delay(2000); // Shorter delay if there's an error
      }
    }

    // Send completion message
    await api.sendMessage(
      `Kickall process completed. ${usersToKick.length} members were processed.`,
      event.threadID,
      (error, info) => {
        // Optional: Auto-delete the final message after some time
        setTimeout(() => {
          api.unsendMessage(event.threadID, info.messageID).catch(() => {});
        }, 30000); // Delete after 30 seconds
      }
    );

  } catch (error) {
    console.error("Error in kickall command execution:", error);
    // Send error message to user
    return api.sendMessage(
      `Failed to execute kickall command: ${error.message}`,
      event.threadID
    );
  }
};
