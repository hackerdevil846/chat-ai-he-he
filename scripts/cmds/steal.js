module.exports = {
  config: {
    name: "steal",
    version: "1.3.0",
    hasPermssion: 0,
    credits: "Asif",
    description: "💸 Steal money from other users with risk/reward mechanics",
    category: "economy",
    usages: "",
    cooldowns: 60,
    dependencies: {}
  },

  onStart: async function ({ api, event, Users, Currencies }) {
    try {
      // Get all user IDs
      const allUsers = global.data.allUserID || [];
      
      // Check for minimum users
      if (allUsers.length < 3) {
        return api.sendMessage(
          "❌ Need at least 3 users in the database to steal!",
          event.threadID,
          event.messageID
        );
      }

      // Filter out bot, current user, and users with no money
      const validTargets = [];
      
      for (const userID of allUsers) {
        if (userID === api.getCurrentUserID() || userID === event.senderID) continue;
        
        const userMoney = (await Currencies.getData(userID)).money || 0;
        if (userMoney > 0) {
          validTargets.push({
            id: userID,
            balance: userMoney
          });
        }
      }
      
      if (validTargets.length === 0) {
        return api.sendMessage(
          "❌ All potential targets are broke! Try again later.",
          event.threadID,
          event.messageID
        );
      }

      // Select a random victim
      const victim = validTargets[Math.floor(Math.random() * validTargets.length)];
      const victimData = await Users.getData(victim.id);
      const victimName = victimData.name || "Unknown User";

      // Get thief's balance
      const thiefData = await Currencies.getData(event.senderID);
      const thiefBalance = thiefData.money || 0;

      // 50% chance of success
      const isSuccessful = Math.random() < 0.5;
      const isCritical = Math.random() < 0.1; // 10% critical chance
      const isEpicFail = Math.random() < 0.05; // 5% epic fail chance

      // Successful steal
      if (isSuccessful) {
        // Calculate stolen amount
        let stealAmount;
        if (isCritical) {
          stealAmount = victim.balance; // Steal everything
        } else {
          stealAmount = Math.min(
            Math.floor(Math.random() * 1000) + 100, // Minimum 100
            victim.balance
          );
        }

        // Update currencies
        await Promise.all([
          Currencies.decreaseMoney(victim.id, stealAmount),
          Currencies.increaseMoney(event.senderID, stealAmount)
        ]);

        const criticalText = isCritical ? "✨ CRITICAL SUCCESS! " : "";
        return api.sendMessage(
          `${criticalText}💰 You successfully stole $${stealAmount} from ${victimName}!`,
          event.threadID,
          event.messageID
        );
      } 
      // Failed steal
      else {
        let penalty;
        let message;
        
        // Epic fail case
        if (isEpicFail && thiefBalance > 0) {
          penalty = thiefBalance; // Lose everything
          message = `💥 EPIC FAIL! You were caught by ${victimName} and lost ALL your money ($${penalty})!`;
        } 
        // Normal fail
        else if (thiefBalance > 0) {
          penalty = Math.floor(thiefBalance * 0.3); // 30% penalty
          message = `🚨 You were caught stealing by ${victimName} and fined $${penalty}!`;
        } 
        // Thief is broke
        else {
          return api.sendMessage(
            `🚔 You were caught stealing from ${victimName}, but you have no money to lose!`,
            event.threadID,
            event.messageID
          );
        }

        // Update currencies
        await Promise.all([
          Currencies.decreaseMoney(event.senderID, penalty),
          Currencies.increaseMoney(victim.id, penalty)
        ]);

        return api.sendMessage(
          message,
          event.threadID,
          event.messageID
        );
      }
    } catch (error) {
      console.error("Steal command error:", error);
      return api.sendMessage(
        "❌ An error occurred during your steal attempt. Please try again later.",
        event.threadID,
        event.messageID
      );
    }
  }
};
