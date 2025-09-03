const axios = require('axios');

module.exports = {
  config: {
    name: "currency",
    version: "2.2.0",
    role: 0,
    author: "Asif Mahmud",
    category: "economy",
    shortDescription: {
      en: "Check or modify currency balance"
    },
    longDescription: {
      en: "View your balance or perform currency operations (admin only)"
    },
    guide: {
      en: "currency [ + | - | * | / | +- | pay ] [amount]"
    },
    countDown: 0
  },

  onStart: async function ({ message, event, args, usersData }) {
    const { threadID, senderID, messageID, mentions, type, messageReply } = event;
    let targetID = senderID;
    
    if (type === 'message_reply') targetID = messageReply.senderID;
    else if (Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0];

    const userData = await usersData.get(targetID);
    const name = userData.name;
    let money = Math.round(userData.money || 0);

    const formatMoney = (num) => num.toLocaleString("en-US").replace(/,/g, ".");
    const emojis = ["💰", "💸", "💲", "🤑", "💎", "🏦"];

    if (!args[0]) {
      return message.reply(`━━━━━━━━━━━━━━\n🔹 Account: ${name}\n🔹 Balance: ${formatMoney(money)}$\n${emojis[Math.floor(Math.random() * emojis.length)]} Manage your money wisely!\n━━━━━━━━━━━━━━`);
    }

    const mon = Math.round(parseFloat(args[1]));
    if (isNaN(mon)) return message.reply("⚠️ Invalid amount!");

    // Admin check - replace with your admin IDs
    const adminIDs = ["1000000000000000"]; // Add your admin user IDs here
    const isAdmin = adminIDs.includes(senderID);

    switch (args[0]) {
      case "+":
        if (!isAdmin) return message.reply("🚫 Insufficient permissions!");
        await usersData.set(targetID, { money: money + mon });
        money += mon;
        break;
      case "-":
        if (!isAdmin) return message.reply("🚫 Insufficient permissions!");
        if (money < mon) return message.reply("⚠️ Not enough money to deduct!");
        await usersData.set(targetID, { money: money - mon });
        money -= mon;
        break;
      case "*":
        if (!isAdmin) return message.reply("🚫 Insufficient permissions!");
        money *= mon;
        await usersData.set(targetID, { money });
        break;
      case "/":
        if (!isAdmin) return message.reply("🚫 Insufficient permissions!");
        if (mon === 0) return message.reply("⚠️ Cannot divide by zero!");
        money = Math.round(money / mon);
        await usersData.set(targetID, { money });
        break;
      case "+-":
        if (!isAdmin) return message.reply("🚫 Insufficient permissions!");
        await usersData.set(targetID, { money: mon });
        money = mon;
        break;
      case "pay":
        const senderMoney = Math.round((await usersData.get(senderID)).money || 0);
        if (senderMoney < mon) return message.reply("⚠️ You don't have enough money to transfer!");
        await usersData.set(senderID, { money: senderMoney - mon });
        await usersData.set(targetID, { money: money + mon });
        return message.reply(`💳 Transferred **${formatMoney(mon)}$** to **${name}** 💸`);
      default:
        return message.reply("⚠️ Invalid command!");
    }

    return message.reply(`━━━━━━━━━━━━━━\n✅ Balance updated\n🔹 Account: ${name}\n🔹 Balance: ${formatMoney(money)}$\n${emojis[Math.floor(Math.random() * emojis.length)]} Use your money wisely!\n━━━━━━━━━━━━━━`);
  }
};
