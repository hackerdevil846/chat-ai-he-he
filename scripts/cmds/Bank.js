const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "bank",
    version: "1.2",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "💰 | 𝑫𝒆𝒑𝒐𝒔𝒊𝒕 𝒐𝒓 𝒘𝒊𝒕𝒉𝒅𝒓𝒂𝒘 𝒎𝒐𝒏𝒆𝒚 𝒇𝒓𝒐𝒎 𝒕𝒉𝒆 𝒃𝒂𝒏𝒌 𝒂𝒏𝒅 𝒆𝒂𝒓𝒏 𝒊𝒏𝒕𝒆𝒓𝒆𝒔𝒕",
    category: "economy",
    usages: "{pn} deposit/withdraw/balance/interest/transfer/richest/loan/payloan [amount] [recipientID]",
    cooldowns: 15
  },

  onStart: async function ({ args, message, event, usersData }) {
    try {
      const userMoney = await usersData.get(event.senderID, "money");
      const user = parseInt(event.senderID);
      
      const bankDataPath = path.join(__dirname, 'bankData.json');

      if (!fs.existsSync(bankDataPath)) {
        const initialBankData = {};
        fs.writeFileSync(bankDataPath, JSON.stringify(initialBankData), "utf8");
      }

      const bankData = JSON.parse(fs.readFileSync(bankDataPath, "utf8"));

      if (!bankData[user]) {
        bankData[user] = { bank: 0, lastInterestClaimed: Date.now() };
        fs.writeFileSync(bankDataPath, JSON.stringify(bankData), "utf8");
      }

      const bankBalance = bankData[user].bank || 0;
      const command = args[0]?.toLowerCase();
      const amount = parseInt(args[1]);
      const recipientUID = parseInt(args[2]);

      switch (command) {
        case "deposit":
          if (isNaN(amount) || amount <= 0) {
            return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒗𝒂𝒍𝒊𝒅 𝒂𝒎𝒐𝒖𝒏𝒕 𝒕𝒐 𝒅𝒆𝒑𝒐𝒔𝒊𝒕 🔁•\n\n╚════ஜ۩۞۩ஜ═══╝");
          }

          if (bankBalance >= 1e104) {
            return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝒀𝒐𝒖 𝒄𝒂𝒏𝒏𝒐𝒕 𝒅𝒆𝒑𝒐𝒔𝒊𝒕 𝒎𝒐𝒏𝒆𝒚 𝒘𝒉𝒆𝒏 𝒚𝒐𝒖𝒓 𝒃𝒂𝒏𝒌 𝒃𝒂𝒍𝒂𝒏𝒄𝒆 𝒊𝒔 𝒂𝒍𝒓𝒆𝒂𝒅𝒚 𝒂𝒕 $1𝒆104 ✖️•\n\n╚════ஜ۩۞۩ஜ═══╝");
          }

          if (userMoney < amount) {
            return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝒀𝒐𝒖 𝒅𝒐𝒏'𝒕 𝒉𝒂𝒗𝒆 𝒕𝒉𝒆 𝒓𝒆𝒒𝒖𝒊𝒓𝒆𝒅 𝒂𝒎𝒐𝒖𝒏𝒕 𝒕𝒐 𝒅𝒆𝒑𝒐𝒔𝒊𝒕 ✖️•\n\n╚════ஜ۩۞۩ஜ═══╝");
          }

          bankData[user].bank += amount;
          await usersData.set(event.senderID, {
            money: userMoney - amount
          });
          fs.writeFileSync(bankDataPath, JSON.stringify(bankData), "utf8");

          return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒅𝒆𝒑𝒐𝒔𝒊𝒕𝒆𝒅 $${amount} 𝒊𝒏𝒕𝒐 𝒚𝒐𝒖𝒓 𝒃𝒂𝒏𝒌 𝒂𝒄𝒄𝒐𝒖𝒏𝒕 ✅•\n\n╚════ஜ۩۞۩ஜ═══╝`);
          break;

        case "withdraw":
          const balance = bankData[user].bank || 0;

          if (isNaN(amount) || amount <= 0) {
            return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒕𝒉𝒆 𝒄𝒐𝒓𝒓𝒆𝒄𝒕 𝒂𝒎𝒐𝒖𝒏𝒕 𝒕𝒐 𝒘𝒊𝒕𝒉𝒅𝒓𝒂𝒘 😪•\n\n╚════ஜ۩۞۩ஜ═══╝");
          }

          if (userMoney >= 1e104) {
            return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝒀𝒐𝒖 𝒄𝒂𝒏𝒏𝒐𝒕 𝒘𝒊𝒕𝒉𝒅𝒓𝒂𝒘 𝒎𝒐𝒏𝒆𝒚 𝒘𝒉𝒆𝒏 𝒚𝒐𝒖𝒓 𝒃𝒂𝒍𝒂𝒏𝒄𝒆 𝒊𝒔 𝒂𝒍𝒓𝒆𝒂𝒅𝒚 𝒂𝒕 1𝒆104 😒•\n\n╚════ஜ۩۞۩ஜ═══╝");
          }

          if (amount > balance) {
            return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝑻𝒉𝒆 𝒓𝒆𝒒𝒖𝒆𝒔𝒕𝒆𝒅 𝒂𝒎𝒐𝒖𝒏𝒕 𝒊𝒔 𝒈𝒓𝒆𝒂𝒕𝒆𝒓 𝒕𝒉𝒂𝒏 𝒕𝒉𝒆 𝒂𝒗𝒂𝒊𝒍𝒂𝒃𝒍𝒆 𝒃𝒂𝒍𝒂𝒏𝒄𝒆 𝒊𝒏 𝒚𝒐𝒖𝒓 𝒃𝒂𝒏𝒌 𝒂𝒄𝒄𝒐𝒖𝒏𝒕 🗿•\n\n╚════ஜ۩۞۩ஜ═══╝");
          }

          bankData[user].bank = balance - amount;
          await usersData.set(event.senderID, {
            money: userMoney + amount
          });
          fs.writeFileSync(bankDataPath, JSON.stringify(bankData), "utf8");
          return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒘𝒊𝒕𝒉𝒅𝒓𝒆𝒘 $${amount} 𝒇𝒓𝒐𝒎 𝒚𝒐𝒖𝒓 𝒃𝒂𝒏𝒌 𝒂𝒄𝒄𝒐𝒖𝒏𝒕 ✅•\n\n╚════ஜ۩۞۩ஜ═══╝`);
          break;

        case "balance":
          const formattedBankBalance = parseFloat(bankBalance);
          if (!isNaN(formattedBankBalance)) {
            return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝒀𝒐𝒖𝒓 𝒃𝒂𝒏𝒌 𝒃𝒂𝒍𝒂𝒏𝒄𝒆 𝒊𝒔: $${formatNumberWithFullForm(formattedBankBalance)}\n\n╚════ஜ۩۞۩ஜ═══╝`);
          } else {
            return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝑬𝒓𝒓𝒐𝒓: 𝒀𝒐𝒖𝒓 𝒃𝒂𝒏𝒌 𝒃𝒂𝒍𝒂𝒏𝒄𝒆 𝒊𝒔 𝒏𝒐𝒕 𝒂 𝒗𝒂𝒍𝒊𝒅 𝒏𝒖𝒎𝒃𝒆𝒓 🥲•\n\n╚════ஜ۩۞۩ஜ═══╝");
          }
          break;

        case "interest":
          const interestRate = 0.001;
          const lastInterestClaimed = bankData[user].lastInterestClaimed || 0;

          const currentTime = Date.now();
          const timeDiffInSeconds = (currentTime - lastInterestClaimed) / 1000;

          if (timeDiffInSeconds < 86400) {
            const remainingTime = Math.ceil(86400 - timeDiffInSeconds);
            const remainingHours = Math.floor(remainingTime / 3600);
            const remainingMinutes = Math.floor((remainingTime % 3600) / 60);

            return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝒀𝒐𝒖 𝒄𝒂𝒏 𝒄𝒍𝒂𝒊𝒎 𝒊𝒏𝒕𝒆𝒓𝒆𝒔𝒕 𝒂𝒈𝒂𝒊𝒏 𝒊𝒏 ${remainingHours} 𝒉𝒐𝒖𝒓𝒔 𝒂𝒏𝒅 ${remainingMinutes} 𝒎𝒊𝒏𝒖𝒕𝒆𝒔 😉•\n\n╚════ஜ۩۞۩ஜ═══╝`);
          }

          const interestEarned = bankData[user].bank * (interestRate / 970) * timeDiffInSeconds;

          if (bankData[user].bank <= 0) {
            return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝒀𝒐𝒖 𝒅𝒐𝒏'𝒕 𝒉𝒂𝒗𝒆 𝒂𝒏𝒚 𝒎𝒐𝒏𝒆𝒚 𝒊𝒏 𝒚𝒐𝒖𝒓 𝒃𝒂𝒏𝒌 𝒂𝒄𝒄𝒐𝒖𝒏𝒕 𝒕𝒐 𝒆𝒂𝒓𝒏 𝒊𝒏𝒕𝒆𝒓𝒆𝒔𝒕 💸🥱•\n\n╚════ஜ۩۞۩ஜ═══╝");
          }

          bankData[user].lastInterestClaimed = currentTime;
          bankData[user].bank += interestEarned;

          fs.writeFileSync(bankDataPath, JSON.stringify(bankData), "utf8");

          return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝒀𝒐𝒖 𝒉𝒂𝒗𝒆 𝒆𝒂𝒓𝒏𝒆𝒅 𝒊𝒏𝒕𝒆𝒓𝒆𝒔𝒕 𝒐𝒇 $${formatNumberWithFullForm(interestEarned)}\n\n𝑰𝒕 𝒉𝒂𝒔 𝒃𝒆𝒆𝒏 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒂𝒅𝒅𝒆𝒅 𝒕𝒐 𝒚𝒐𝒖𝒓 𝒂𝒄𝒄𝒐𝒖𝒏𝒕 𝒃𝒂𝒍𝒂𝒏𝒄𝒆 ✅•\n\n╚════ஜ۩۞۩ஜ═══╝`);
          break;

        case "transfer":
          if (isNaN(amount) || amount <= 0) {
            return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒗𝒂𝒍𝒊𝒅 𝒂𝒎𝒐𝒖𝒏𝒕 𝒕𝒐 𝒕𝒓𝒂𝒏𝒔𝒇𝒆𝒓 🔁•\n\n╚════ஜ۩۞۩ஜ═══╝");
          }

          if (!recipientUID || !bankData[recipientUID]) {
            return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝑹𝒆𝒄𝒊𝒑𝒊𝒆𝒏𝒕 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅 𝒊𝒏 𝒕𝒉𝒆 𝒃𝒂𝒏𝒌 𝒅𝒂𝒕𝒂𝒃𝒂𝒔𝒆. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒄𝒉𝒆𝒄𝒌 𝒕𝒉𝒆 𝒓𝒆𝒄𝒊𝒑𝒊𝒆𝒏𝒕'𝒔 𝑰𝑫 ✖️•\n\n╚════ஜ۩۞۩ஜ═══╝");
          }

          if (recipientUID === user) {
            return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝒀𝒐𝒖 𝒄𝒂𝒏𝒏𝒐𝒕 𝒕𝒓𝒂𝒏𝒔𝒇𝒆𝒓 𝒎𝒐𝒏𝒆𝒚 𝒕𝒐 𝒚𝒐𝒖𝒓𝒔𝒆𝒍𝒇 😹•\n\n╚════ஜ۩۞۩ஜ═══╝");
          }

          const senderBankBalance = parseFloat(bankData[user].bank) || 0;
          const recipientBankBalance = parseFloat(bankData[recipientUID].bank) || 0;

          if (recipientBankBalance >= 1e104) {
            return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝑻𝒉𝒆 𝒓𝒆𝒄𝒊𝒑𝒊𝒆𝒏𝒕'𝒔 𝒃𝒂𝒏𝒌 𝒃𝒂𝒍𝒂𝒏𝒄𝒆 𝒊𝒔 𝒂𝒍𝒓𝒆𝒂𝒅𝒚 $1𝒆104. 𝒀𝒐𝒖 𝒄𝒂𝒏𝒏𝒐𝒕 𝒕𝒓𝒂𝒏𝒔𝒇𝒆𝒓 𝒎𝒐𝒏𝒆𝒚 𝒕𝒐 𝒕𝒉𝒆𝒎 🗿•\n\n╚════ஜ۩۞۩ஜ═══╝");
          }

          if (amount > senderBankBalance) {
            return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝒀𝒐𝒖 𝒅𝒐𝒏'𝒕 𝒉𝒂𝒗𝒆 𝒆𝒏𝒐𝒖𝒈𝒉 𝒎𝒐𝒏𝒆𝒚 𝒊𝒏 𝒚𝒐𝒖𝒓 𝒃𝒂𝒏𝒌 𝒂𝒄𝒄𝒐𝒖𝒏𝒕 𝒇𝒐𝒓 𝒕𝒉𝒊𝒔 𝒕𝒓𝒂𝒏𝒔𝒇𝒆𝒓 ✖️•\n\n╚════ஜ۩۞۩ஜ═══╝");
          }

          bankData[user].bank -= amount;
          bankData[recipientUID].bank += amount;
          fs.writeFileSync(bankDataPath, JSON.stringify(bankData), "utf8");

          return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒕𝒓𝒂𝒏𝒔𝒇𝒆𝒓𝒓𝒆𝒅 $${amount} 𝒕𝒐 𝒕𝒉𝒆 𝒓𝒆𝒄𝒊𝒑𝒊𝒆𝒏𝒕 𝒘𝒊𝒕𝒉 𝑼𝑰𝑫: ${recipientUID} ✅•\n\n╚════ஜ۩۞۩ஜ═══╝`);
          break;

        case "richest":
          const bankDataCp = JSON.parse(fs.readFileSync(bankDataPath, 'utf8'));

          const topUsers = Object.entries(bankDataCp)
            .sort(([, a], [, b]) => b.bank - a.bank)
            .slice(0, 10);

          const output = (await Promise.all(topUsers.map(async ([userID, userData], index) => {
            const userInfo = await usersData.get(userID);
            const userName = userInfo.name || "Unknown User";
            const formattedBalance = formatNumberWithFullForm(userData.bank);
            return `[${index + 1}. ${userName} - $${formattedBalance}]`;
          }))).join('\n');

          return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝑻𝒐𝒑 10 𝒓𝒊𝒄𝒉𝒆𝒔𝒕 𝒑𝒆𝒐𝒑𝒍𝒆 𝒂𝒄𝒄𝒐𝒓𝒅𝒊𝒏𝒈 𝒕𝒐 𝒕𝒉𝒆𝒊𝒓 𝒃𝒂𝒏𝒌 𝒃𝒂𝒍𝒂𝒏𝒄𝒆 👑🤴:\n" + output + "\n\n╚════ஜ۩۞۩ஜ═══╝");
          break;

        case "loan":
          const maxLoanAmount = 100000000;
          const userLoan = bankData[user].loan || 0;
          const loanPayed = bankData[user].loanPayed !== undefined ? bankData[user].loanPayed : true;

          if (!amount) {
            return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒗𝒂𝒍𝒊𝒅 𝒍𝒐𝒂𝒏 𝒂𝒎𝒐𝒖𝒏𝒕 ✖️•\n\n╚════ஜ۩۞۩ஜ═══╝");
          }

          if (amount > maxLoanAmount) {
            return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝑻𝒉𝒆 𝒎𝒂𝒙𝒊𝒎𝒖𝒎 𝒍𝒐𝒂𝒏 𝒂𝒎𝒐𝒖𝒏𝒕 𝒊𝒔 $100000000 ❗•\n\n╚════ஜ۩۞۩ஜ═══╝");
          }

          if (!loanPayed && userLoan > 0) {
            return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝒀𝒐𝒖 𝒄𝒂𝒏𝒏𝒐𝒕 𝒕𝒂𝒌𝒆 𝒂 𝒏𝒆𝒘 𝒍𝒐𝒂𝒏 𝒖𝒏𝒕𝒊𝒍 𝒚𝒐𝒖 𝒑𝒂𝒚 𝒐𝒇𝒇 𝒚𝒐𝒖𝒓 𝒄𝒖𝒓𝒓𝒆𝒏𝒕 𝒍𝒐𝒂𝒏.\n\n𝒀𝒐𝒖𝒓 𝒄𝒖𝒓𝒓𝒆𝒏𝒕 𝒍𝒐𝒂𝒏 𝒕𝒐 𝒑𝒂𝒚: $${userLoan} 😑•\n\n╚════ஜ۩۞۩ஜ═══╝`);
          }

          bankData[user].loan = userLoan + amount;
          bankData[user].loanPayed = false;
          bankData[user].bank += amount;

          fs.writeFileSync(bankDataPath, JSON.stringify(bankData), "utf8");

          return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝒀𝒐𝒖 𝒉𝒂𝒗𝒆 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒕𝒂𝒌𝒆𝒏 𝒂 𝒍𝒐𝒂𝒏 𝒐𝒇 $${amount}. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒏𝒐𝒕𝒆 𝒕𝒉𝒂𝒕 𝒍𝒐𝒂𝒏𝒔 𝒎𝒖𝒔𝒕 𝒃𝒆 𝒓𝒆𝒑𝒂𝒊𝒅 𝒘𝒊𝒕𝒉𝒊𝒏 𝒂 𝒄𝒆𝒓𝒕𝒂𝒊𝒏 𝒑𝒆𝒓𝒊𝒐𝒅 😉•\n\n╚════ஜ۩۞۩ஜ═══╝`);
          break;

        case "payloan":
          const loanBalance = bankData[user].loan || 0;

          if (isNaN(amount) || amount <= 0) {
            return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒗𝒂𝒍𝒊𝒅 𝒂𝒎𝒐𝒖𝒏𝒕 𝒕𝒐 𝒓𝒆𝒑𝒂𝒚 𝒚𝒐𝒖𝒓 𝒍𝒐𝒂𝒏 ✖️•\n\n╚════ஜ۩۞۩ஜ═══╝");
          }

          if (loanBalance <= 0) {
            return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝒀𝒐𝒖 𝒅𝒐𝒏'𝒕 𝒉𝒂𝒗𝒆 𝒂𝒏𝒚 𝒑𝒆𝒏𝒅𝒊𝒏𝒈 𝒍𝒐𝒂𝒏 𝒑𝒂𝒚𝒎𝒆𝒏𝒕𝒔•\n\n✧⁺⸜(●˙▾˙●)⸝⁺✧ʸᵃʸ\n\n╚════ஜ۩۞۩ஜ═══╝");
          }

          if (amount > loanBalance) {
            return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝑻𝒉𝒆 𝒂𝒎𝒐𝒖𝒏𝒕 𝒓𝒆𝒒𝒖𝒊𝒓𝒆𝒅 𝒕𝒐 𝒑𝒂𝒚 𝒐𝒇𝒓 𝒕𝒉𝒆 𝒍𝒐𝒂𝒏 𝒊𝒔 𝒈𝒓𝒆𝒂𝒕𝒆𝒓 𝒕𝒉𝒂𝒏 𝒚𝒐𝒖𝒓 𝒅𝒖𝒆 𝒂𝒎𝒐𝒖𝒏𝒕. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒑𝒂𝒚 𝒕𝒉𝒆 𝒆𝒙𝒂𝒄𝒕 𝒂𝒎𝒐𝒖𝒏𝒕 😊•\n𝒀𝒐𝒖𝒓 𝒕𝒐𝒕𝒂𝒍 𝒍𝒐𝒂𝒏: $${loanBalance}\n\n╚════ஜ۩۞۩ஜ═══╝`);
          }

          if (amount > userMoney) {
            return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝒀𝒐𝒖 𝒅𝒐 𝒏𝒐𝒕 𝒉𝒂𝒗𝒆 $${amount} 𝒊𝒏 𝒚𝒐𝒖𝒓 𝒃𝒂𝒍𝒂𝒏𝒄𝒆 𝒕𝒐 𝒓𝒆𝒑𝒂𝒚 𝒕𝒉𝒆 𝒍𝒐𝒂𝒏 😢•\n\n╚════ஜ۩۞۩ஜ═══╝`);
          }

          bankData[user].loan = loanBalance - amount;

          if (loanBalance - amount === 0) {
            bankData[user].loanPayed = true;
          }

          await usersData.set(event.senderID, {
            money: userMoney - amount
          });

          fs.writeFileSync(bankDataPath, JSON.stringify(bankData), "utf8");

          return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒓𝒆𝒑𝒂𝒊𝒅 $${amount} 𝒕𝒐𝒘𝒂𝒓𝒅𝒔 𝒚𝒐𝒖𝒓 𝒍𝒐𝒂𝒏. 𝒀𝒐𝒖𝒓 𝒄𝒔𝒓𝒓𝒆𝒏𝒕 𝒍𝒐𝒂𝒏 𝒕𝒐 𝒑𝒂𝒚: $${bankData[user].loan} ✅•\n\n╚════ஜ۩۞۩ஜ═══╝`);
          break;

        default:
          return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝑩𝒂𝒏𝒌 🏦]\n\n❏𝑷𝒍𝒆𝒂𝒔𝒆 𝒖𝒔𝒆 𝒐𝒏𝒆 𝒐𝒇 𝒕𝒉𝒆 𝒇𝒐𝒍𝒍𝒐𝒘𝒊𝒏𝒈 𝒗𝒂𝒍𝒊𝒅 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒔: 𝒅𝒆𝒑𝒐𝒔𝒊𝒕, 𝒘𝒊𝒕𝒉𝒅𝒓𝒂𝒘, 𝒃𝒂𝒍𝒂𝒏𝒄𝒆, 𝒊𝒏𝒕𝒆𝒓𝒆𝒔𝒕, 𝒕𝒓𝒂𝒏𝒔𝒇𝒆𝒓, 𝒓𝒊𝒄𝒉𝒆𝒔𝒕, 𝒍𝒐𝒂𝒏, 𝒑𝒂𝒚𝒍𝒐𝒂𝒏\n\n╚════ஜ۩۞۩ஜ═══╝");
      }
    } catch (error) {
      console.error("𝑩𝒂𝒏𝒌 𝑬𝒓𝒓𝒐𝒓:", error);
      await message.reply("❌ 𝑬𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅: " + error.message);
    }
  }
};

function formatNumberWithFullForm(number) {
  const fullForms = [
    "", "Thousand", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", 
    "Sextillion", "Septillion", "Octillion", "Nonillion", "Decillion", "Undecillion", 
    "Duodecillion", "Tredecillion", "Quattuordecillion", "Quindecillion", "Sexdecillion", 
    "Septendecillion", "Octodecillion", "Novemdecillion", "Vigintillion", "Unvigintillion", 
    "Duovigintillion", "Tresvigintillion", "Quattuorvigintillion", "Quinvigintillion", 
    "Sesvigintillion", "Septemvigintillion", "Octovigintillion", "Novemvigintillion", 
    "Trigintillion", "Untrigintillion", "Duotrigintillion", "Googol"
  ];

  let fullFormIndex = 0;
  while (number >= 1000 && fullFormIndex < fullForms.length - 1) {
    number /= 1000;
    fullFormIndex++;
  }

  const formattedNumber = number.toFixed(2);
  return `${formattedNumber} ${fullForms[fullFormIndex]}`;
}
