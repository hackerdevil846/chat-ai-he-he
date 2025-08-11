const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "moneys",
  version: "1.0.2",
  hasPermssion: 0, // 0 = user, 1 = admin/bot
  credits: "Asif", // Creator's name
  description: "Check your balance or someone else's balance",
  category: "economy", // Correct category for Goat bot
  usages: "[tag]",
  cooldowns: 5 // 5 seconds cooldown
};

// Required onStart function for Goat bot
module.exports.onStart = async function({}) {
  // Initialization can be done here if needed
};

module.exports.run = async function({ api, event, args, Currencies }) {
  const { threadID, messageID, senderID, mentions } = event;

  try {
    // If no arguments, show the sender's money
    if (!args[0]) {
      const moneyData = await Currencies.getData(senderID);
      const balance = moneyData.money !== undefined ? moneyData.money : 0;
      return api.sendMessage(`💰 Your current balance: $${balance}`, threadID, messageID);
    }

    // If someone is mentioned, show their money
    else if (Object.keys(mentions).length === 1) {
      const mention = Object.keys(mentions)[0];
      const moneyData = await Currencies.getData(mention);
      const balance = moneyData.money !== undefined ? moneyData.money : 0;
      const name = mentions[mention].replace(/@/g, "");

      return api.sendMessage({
        body: `💰 ${name}'s current balance: $${balance}`,
        mentions: [{
          tag: name,
          id: mention
        }]
      }, threadID, messageID);
    }

    // If multiple mentions or invalid arguments
    else {
      return api.sendMessage("⚠️ Invalid usage! Please tag only one person or use without arguments.", threadID, messageID);
    }
  } catch (error) {
    console.error('Moneys command error:', error);
    return api.sendMessage("❌ An error occurred while processing your request", threadID, messageID);
  }
};
