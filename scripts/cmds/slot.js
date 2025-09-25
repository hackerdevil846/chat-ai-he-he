module.exports = {
  config: {
    name: "slot",
    aliases: ["spin"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "game",
    shortDescription: {
      en: "🎰 𝑆𝑙𝑜𝑡 𝑚𝑎𝑐ℎ𝑖𝑛𝑒 𝑔𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑏𝑒𝑡𝑡𝑖𝑛𝑔"
    },
    longDescription: {
      en: "𝑃𝑙𝑎𝑦 𝑠𝑙𝑜𝑡 𝑚𝑎𝑐ℎ𝑖𝑛𝑒 𝑔𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑟𝑒𝑎𝑙 𝑚𝑜𝑛𝑒𝑦 𝑏𝑒𝑡𝑡𝑖𝑛𝑔 𝑎𝑛𝑑 𝑤𝑖𝑛𝑛𝑖𝑛𝑔 𝑝𝑎𝑦𝑜𝑢𝑡𝑠"
    },
    guide: {
      en: "{p}slot [𝑏𝑒𝑡_𝑎𝑚𝑜𝑢𝑛𝑡]"
    },
    countDown: 5
  },

  langs: {
    "en": {
      "missingInput": "❌ 𝐵𝑒𝑡 𝑚𝑢𝑠𝑡 𝑏𝑒 𝑎 𝑝𝑜𝑠𝑖𝑡𝑖𝑣𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 𝑎𝑛𝑑 𝑛𝑜𝑡 𝑒𝑚𝑝𝑡𝑦",
      "moneyBetNotEnough": "❌ 𝑇ℎ𝑒 𝑏𝑒𝑡 𝑦𝑜𝑢 𝑝𝑙𝑎𝑐𝑒𝑑 𝑖𝑠 𝑚𝑜𝑟𝑒 𝑡ℎ𝑎𝑛 𝑦𝑜𝑢𝑟 𝑏𝑎𝑙𝑎𝑛𝑐𝑒!",
      "limitBet": "❌ 𝑌𝑜𝑢𝑟 𝑏𝑒𝑡 𝑖𝑠 𝑡𝑜𝑜 𝑠𝑚𝑎𝑙𝑙, 𝑚𝑖𝑛𝑖𝑚𝑢𝑚 50$",
      "returnWin": "🎰 %1 | %2 | %3 🎰\n✅ 𝑌𝑜𝑢 𝑤𝑜𝑛 %4$",
      "returnLose": "🎰 %1 | %2 | %3 🎰\n❌ 𝑌𝑜𝑢 𝑙𝑜𝑠𝑡 %4$"
    }
  },

  onStart: async function ({ api, event, args, message, usersData, getText }) {
    try {
      const { threadID, messageID, senderID } = event;

      // slot items
      const slotItems = ["🍇", "🍉", "🍊", "🍏", "7⃣", "🍓", "🍒", "🍌", "🥝", "🥑", "🌽"];

      // sanitize and parse input
      const rawArg = args && args[0] ? String(args[0]) : "";
      const sanitized = rawArg.replace(/[^0-9]/g, "");
      const moneyBetInput = parseInt(sanitized, 10);

      // get user's money
      const userData = await usersData.get(senderID);
      const moneyUser = (userData && typeof userData.money === "number") ? userData.money : 0;

      // validations
      if (isNaN(moneyBetInput) || moneyBetInput <= 0) {
        return message.reply(getText("missingInput"));
      }
      if (moneyBetInput > moneyUser) {
        return message.reply(getText("moneyBetNotEnough"));
      }
      if (moneyBetInput < 50) {
        return message.reply(getText("limitBet"));
      }

      // perform slot roll
      const number = [];
      for (let i = 0; i < 3; i++) number[i] = Math.floor(Math.random() * slotItems.length);

      // determine win/lose
      let win = false;
      let payout = moneyBetInput;
      
      if (number[0] === number[1] && number[1] === number[2]) {
        payout = moneyBetInput * 9;
        win = true;
      } else if (number[0] === number[1] || number[0] === number[2] || number[1] === number[2]) {
        payout = moneyBetInput * 2;
        win = true;
      }

      // apply result
      if (win) {
        await usersData.increaseMoney(senderID, payout);
        return message.reply(
          getText("returnWin")
            .replace("%1", slotItems[number[0]])
            .replace("%2", slotItems[number[1]])
            .replace("%3", slotItems[number[2]])
            .replace("%4", payout)
        );
      } else {
        await usersData.decreaseMoney(senderID, moneyBetInput);
        return message.reply(
          getText("returnLose")
            .replace("%1", slotItems[number[0]])
            .replace("%2", slotItems[number[1]])
            .replace("%3", slotItems[number[2]])
            .replace("%4", moneyBetInput)
        );
      }
    } catch (error) {
      console.error("Slot command error:", error);
      return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑟𝑢𝑛𝑛𝑖𝑛𝑔 𝑡ℎ𝑒 𝑠𝑙𝑜𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
