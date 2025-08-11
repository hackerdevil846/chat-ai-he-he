module.exports = {
  config: {
    name: "coin",
    version: "1.2.0",
    author: "Asif",
    category: "economy",
    shortDescription: "Check coin balance",
    longDescription: "View coin balances for yourself or other users in the economy system",
    guide: {
      en: "{p}coin - Check your balance\n{p}coin @mention - Check someone's balance\n{p}coin help - Show help information"
    },
    cooldowns: 3
  },

  langs: {
    en: {
      own_balance: "💰 YOUR BALANCE\n━━━━━━━━━━━━━━\nYou currently have: %1 coins",
      other_balance: "💰 USER BALANCE\n━━━━━━━━━━━━━━\n%1 currently has: %2 coins",
      no_user: "⚠️ USER NOT FOUND\n━━━━━━━━━━━━━━\nPlease mention a valid user to check their balance",
      error: "❌ BALANCE ERROR\n━━━━━━━━━━━━━━\nFailed to fetch balance. Please try again later.",
      help: "💎 COIN COMMAND HELP\n━━━━━━━━━━━━━━\n\n" +
            "Command Usage:\n" +
            "• {p}coin - Check your own balance\n" +
            "• {p}coin @mention - Check someone else's balance\n" +
            "• {p}coin help - Show this help message\n\n" +
            "About Coins:\n" +
            "• Coins are earned through activities, games, and rewards\n" +
            "• Use coins to purchase items, play games, or access premium features\n" +
            "• Check your balance regularly to track your earnings!"
    }
  },

  onStart: async function({ api, event, args, getText, usersData }) {
    try {
      const { threadID, messageID, senderID, mentions } = event;
      
      // Show help if requested
      if (args[0]?.toLowerCase() === "help") {
        return api.sendMessage(getText("help"), threadID, messageID);
      }

      // Check if user wants to see their own balance
      if (args.length === 0 || Object.keys(mentions).length === 0) {
        const userData = await usersData.get(senderID);
        const balance = userData.money || 0;
        return api.sendMessage(
          getText("own_balance", balance.toLocaleString()), 
          threadID,
          messageID
        );
      }

      // Get first mentioned user
      const targetID = Object.keys(mentions)[0];
      const targetName = mentions[targetID].replace(/@/g, "");
      
      // Get target user data
      const targetData = await usersData.get(targetID);
      
      // Handle invalid user
      if (!targetData) {
        return api.sendMessage(
          getText("no_user"),
          threadID,
          messageID
        );
      }

      const targetBalance = targetData.money || 0;

      // Send balance info with mention
      return api.sendMessage(
        {
          body: getText("other_balance", targetName, targetBalance.toLocaleString()),
          mentions: [{
            tag: targetName,
            id: targetID
          }]
        },
        threadID,
        messageID
      );

    } catch (error) {
      console.error("Coin command error:", error);
      return api.sendMessage(
        getText("error"),
        event.threadID,
        event.messageID
      );
    }
  }
};
