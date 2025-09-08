const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "bank",
    aliases: ["banking", "economy"],
    version: "1.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 15,
    role: 0,
    shortDescription: {
        en: "💰 | 𝐷𝑒𝑝𝑜𝑠𝑖𝑡 𝑜𝑟 𝑤𝑖𝑡ℎ𝑑𝑟𝑎𝑤 𝑚𝑜𝑛𝑒𝑦 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑏𝑎𝑛𝑘 𝑎𝑛𝑑 𝑒𝑎𝑟𝑛 𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡"
    },
    longDescription: {
        en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑦𝑜𝑢𝑟 𝑏𝑎𝑛𝑘 𝑎𝑐𝑐𝑜𝑢𝑛𝑡, 𝑑𝑒𝑝𝑜𝑠𝑖𝑡, 𝑤𝑖𝑡ℎ𝑑𝑟𝑎𝑤, 𝑒𝑎𝑟𝑛 𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡, 𝑡𝑟𝑎𝑛𝑠𝑓𝑒𝑟 𝑓𝑢𝑛𝑑𝑠, 𝑎𝑛𝑑 𝑚𝑜𝑟𝑒"
    },
    category: "𝑒𝑐𝑜𝑛𝑜𝑚𝑦",
    guide: {
        en: "{p}bank deposit/withdraw/balance/interest/transfer/richest/loan/payloan [𝑎𝑚𝑜𝑢𝑛𝑡] [𝑟𝑒𝑐𝑖𝑝𝑖𝑒𝑛𝑡𝐼𝐷]"
    },
    dependencies: {
        "fs": "",
        "path": ""
    }
};

module.exports.onStart = async function ({ message, args, event, usersData }) {
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
                    return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑎𝑚𝑜𝑢𝑛𝑡 𝑡𝑜 𝑑𝑒𝑝𝑜𝑠𝑖𝑡 🔁•\n\n╚════ஜ۩۞۩ஜ═══╝");
                }

                if (bankBalance >= 1e104) {
                    return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑌𝑜𝑢 𝑐𝑎𝑛𝑛𝑜𝑡 𝑑𝑒𝑝𝑜𝑠𝑖𝑡 𝑚𝑜𝑛𝑒𝑦 𝑤ℎ𝑒𝑛 𝑦𝑜𝑢𝑟 𝑏𝑎𝑛𝑘 𝑏𝑎𝑙𝑎𝑛𝑐𝑒 𝑖𝑠 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑎𝑡 $1𝑒104 ✖️•\n\n╚════ஜ۩۞۩ஜ═══╝");
                }

                if (userMoney < amount) {
                    return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑡ℎ𝑒 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑎𝑚𝑜𝑢𝑛𝑡 𝑡𝑜 𝑑𝑒𝑝𝑜𝑠𝑖𝑡 ✖️•\n\n╚════ஜ۩۞۩ஜ═══╝");
                }

                bankData[user].bank += amount;
                await usersData.set(event.senderID, {
                    money: userMoney - amount
                });
                fs.writeFileSync(bankDataPath, JSON.stringify(bankData), "utf8");

                return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑑𝑒𝑝𝑜𝑠𝑖𝑡𝑒𝑑 $${amount} 𝑖𝑛𝑡𝑜 𝑦𝑜𝑢𝑟 𝑏𝑎𝑛𝑘 𝑎𝑐𝑐𝑜𝑢𝑛𝑡 ✅•\n\n╚════ஜ۩۞۩ஜ═══╝`);

            case "withdraw":
                const balance = bankData[user].bank || 0;

                if (isNaN(amount) || amount <= 0) {
                    return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡ℎ𝑒 𝑐𝑜𝑟𝑟𝑒𝑐𝑡 𝑎𝑚𝑜𝑢𝑛𝑡 𝑡𝑜 𝑤𝑖𝑡ℎ𝑑𝑟𝑎𝑤 😪•\n\n╚════ஜ۩۞۩ஜ═══╝");
                }

                if (userMoney >= 1e104) {
                    return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑌𝑜𝑢 𝑐𝑎𝑛𝑛𝑜𝑡 𝑤𝑖𝑡ℎ𝑑𝑟𝑎𝑤 𝑚𝑜𝑛𝑒𝑦 𝑤ℎ𝑒𝑛 𝑦𝑜𝑢𝑟 𝑏𝑎𝑙𝑎𝑛𝑐𝑒 𝑖𝑠 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑎𝑡 1𝑒104 😒•\n\n╚════ஜ۩۞۩ஜ═══╝");
                }

                if (amount > balance) {
                    return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑇ℎ𝑒 𝑟𝑒𝑞𝑢𝑒𝑠𝑡𝑒𝑑 𝑎𝑚𝑜𝑢𝑛𝑡 𝑖𝑠 𝑔𝑟𝑒𝑎𝑡𝑒𝑟 𝑡ℎ𝑎𝑛 𝑡ℎ𝑒 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑏𝑎𝑙𝑎𝑛𝑐𝑒 𝑖𝑛 𝑦𝑜𝑢𝑟 𝑏𝑎𝑛𝑘 𝑎𝑐𝑐𝑜𝑢𝑛𝑡 🗿•\n\n╚════ஜ۩۞۩ஜ═══╝");
                }

                bankData[user].bank = balance - amount;
                await usersData.set(event.senderID, {
                    money: userMoney + amount
                });
                fs.writeFileSync(bankDataPath, JSON.stringify(bankData), "utf8");
                return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑤𝑖𝑡ℎ𝑑𝑟𝑒𝑤 $${amount} 𝑓𝑟𝑜𝑚 𝑦𝑜𝑢𝑟 𝑏𝑎𝑛𝑘 𝑎𝑐𝑐𝑜𝑢𝑛𝑡 ✅•\n\n╚════ஜ۩۞۩ஜ═══╝`);

            case "balance":
                const formattedBankBalance = parseFloat(bankBalance);
                if (!isNaN(formattedBankBalance)) {
                    return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑌𝑜𝑢𝑟 𝑏𝑎𝑛𝑘 𝑏𝑎𝑙𝑎𝑛𝑐𝑒 𝑖𝑠: $${formatNumberWithFullForm(formattedBankBalance)}\n\n╚════ஜ۩۞۩ஜ═══╝`);
                } else {
                    return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝐸𝑟𝑟𝑜𝑟: 𝑌𝑜𝑢𝑟 𝑏𝑎𝑛𝑘 𝑏𝑎𝑙𝑎𝑛𝑐𝑒 𝑖𝑠 𝑛𝑜𝑡 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑛𝑢𝑚𝑏𝑒𝑟 🥲•\n\n╚════ஜ۩۞۩ஜ═══╝");
                }

            case "interest":
                const interestRate = 0.001;
                const lastInterestClaimed = bankData[user].lastInterestClaimed || 0;

                const currentTime = Date.now();
                const timeDiffInSeconds = (currentTime - lastInterestClaimed) / 1000;

                if (timeDiffInSeconds < 86400) {
                    const remainingTime = Math.ceil(86400 - timeDiffInSeconds);
                    const remainingHours = Math.floor(remainingTime / 3600);
                    const remainingMinutes = Math.floor((remainingTime % 3600) / 60);

                    return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑌𝑜𝑢 𝑐𝑎𝑛 𝑐𝑙𝑎𝑖𝑚 𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡 𝑎𝑔𝑎𝑖𝑛 𝑖𝑛 ${remainingHours} ℎ𝑜𝑢𝑟𝑠 𝑎𝑛𝑑 ${remainingMinutes} 𝑚𝑖𝑛𝑢𝑡𝑒𝑠 😉•\n\n╚════ஜ۩۞۩ஜ═══╝`);
                }

                const interestEarned = bankData[user].bank * (interestRate / 970) * timeDiffInSeconds;

                if (bankData[user].bank <= 0) {
                    return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑎𝑛𝑦 𝑚𝑜𝑛𝑒𝑦 𝑖𝑛 𝑦𝑜𝑢𝑟 𝑏𝑎𝑛𝑘 𝑎𝑐𝑐𝑜𝑢𝑛𝑡 𝑡𝑜 𝑒𝑎𝑟𝑛 𝑖𝑛𝑡𝑒𝑟𝑒𝑟𝑠𝑡 💸🥱•\n\n╚════ஜ۩۞۩ஜ═══╝");
                }

                bankData[user].lastInterestClaimed = currentTime;
                bankData[user].bank += interestEarned;

                fs.writeFileSync(bankDataPath, JSON.stringify(bankData), "utf8");

                return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑌𝑜𝑢 ℎ𝑎𝑣𝑒 𝑒𝑎𝑟𝑛𝑒𝑑 𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡 𝑜𝑓 $${formatNumberWithFullForm(interestEarned)}\n\n𝐼𝑡 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑎𝑑𝑑𝑒𝑑 𝑡𝑜 𝑦𝑜𝑢𝑟 𝑎𝑐𝑐𝑜𝑢𝑛𝑡 𝑏𝑎𝑙𝑎𝑛𝑐𝑒 ✅•\n\n╚════ஜ۩۞۩ஜ═══╝`);

            case "transfer":
                if (isNaN(amount) || amount <= 0) {
                    return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑎𝑚𝑜𝑢𝑛𝑡 𝑡𝑜 𝑡𝑟𝑎𝑛𝑠𝑓𝑒𝑟 🔁•\n\n╚════ஜ۩۞۩ஜ═══╝");
                }

                if (!recipientUID || !bankData[recipientUID]) {
                    return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑅𝑒𝑐𝑖𝑝𝑖𝑒𝑛𝑡 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑡ℎ𝑒 𝑏𝑎𝑛𝑘 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑡ℎ𝑒 𝑟𝑒𝑐𝑖𝑝𝑖𝑒𝑛𝑡'𝑠 𝐼𝐷 ✖️•\n\n╚════ஜ۩۞۩ஜ═══╝");
                }

                if (recipientUID === user) {
                    return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑌𝑜𝑢 𝑐𝑎𝑛𝑛𝑜𝑡 𝑡𝑟𝑎𝑛𝑠𝑓𝑒𝑟 𝑚𝑜𝑛𝑒𝑦 𝑡𝑜 𝑦𝑜𝑢𝑟𝑠𝑒𝑙𝑓 😹•\n\n╚════ஜ۩۞۩ஜ═══╝");
                }

                const senderBankBalance = parseFloat(bankData[user].bank) || 0;
                const recipientBankBalance = parseFloat(bankData[recipientUID].bank) || 0;

                if (recipientBankBalance >= 1e104) {
                    return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑇ℎ𝑒 𝑟𝑒𝑐𝑖𝑝𝑖𝑒𝑛𝑡'𝑠 𝑏𝑎𝑛𝑘 𝑏𝑎𝑙𝑎𝑛𝑐𝑒 𝑖𝑠 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 $1𝑒104. 𝑌𝑜𝑢 𝑐𝑎𝑛𝑛𝑜𝑡 𝑡𝑟𝑎𝑛𝑠𝑓𝑒𝑟 𝑚𝑜𝑛𝑒𝑦 𝑡𝑜 𝑡ℎ𝑒𝑚 🗿•\n\n╚════ஜ۩۞۩ஜ═══╝");
                }

                if (amount > senderBankBalance) {
                    return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑒𝑛𝑜𝑢𝑔ℎ 𝑚𝑜𝑛𝑒𝑦 𝑖𝑛 𝑦𝑜𝑢𝑟 𝑏𝑎𝑛𝑘 𝑎𝑐𝑐𝑜𝑢𝑛𝑡 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑡𝑟𝑎𝑛𝑠𝑓𝑒𝑟 ✖️•\n\n╚════ஜ۩۞۩ஜ═══╝");
                }

                bankData[user].bank -= amount;
                bankData[recipientUID].bank += amount;
                fs.writeFileSync(bankDataPath, JSON.stringify(bankData), "utf8");

                return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑡𝑟𝑎𝑛𝑠𝑓𝑒𝑟𝑟𝑒𝑑 $${amount} 𝑡𝑜 𝑡ℎ𝑒 𝑟𝑒𝑐𝑖𝑝𝑖𝑒𝑛𝑡 𝑤𝑖𝑡ℎ 𝑈𝐼𝐷: ${recipientUID} ✅•\n\n╚════ஜ۩۞۩ஜ═══╝`);

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

                return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑇𝑜𝑝 10 𝑟𝑖𝑐ℎ𝑒𝑠𝑡 𝑝𝑒𝑜𝑝𝑙𝑒 𝑎𝑐𝑐𝑜𝑟𝑑𝑖𝑛𝑔 𝑡𝑜 𝑡ℎ𝑒𝑖𝑟 𝑏𝑎𝑛𝑘 𝑏𝑎𝑙𝑎𝑛𝑐𝑒 👑🤴:\n" + output + "\n\n╚════ஜ۩۞۩ஜ═══╝");

            case "loan":
                const maxLoanAmount = 100000000;
                const userLoan = bankData[user].loan || 0;
                const loanPayed = bankData[user].loanPayed !== undefined ? bankData[user].loanPayed : true;

                if (!amount) {
                    return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑙𝑜𝑎𝑛 𝑎𝑚𝑜𝑢𝑛𝑡 ✖️•\n\n╚════ஜ۩۞۩ஜ═══╝");
                }

                if (amount > maxLoanAmount) {
                    return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑇ℎ𝑒 𝑚𝑎𝑥𝑖𝑚𝑢𝑚 𝑙𝑜𝑎𝑛 𝑎𝑚𝑜𝑢𝑛𝑡 𝑖𝑠 $100000000 ❗•\n\n╚════ஜ۩۞۩ஜ═══╝");
                }

                if (!loanPayed && userLoan > 0) {
                    return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑌𝑜𝑢 𝑐𝑎𝑛𝑛𝑜𝑡 𝑡𝑎𝑘𝑒 𝑎 𝑛𝑒𝑤 𝑙𝑜𝑎𝑛 𝑢𝑛𝑡𝑖𝑙 𝑦𝑜𝑢 𝑝𝑎𝑦 𝑜𝑓𝑓 𝑦𝑜𝑢𝑟 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑙𝑜𝑎𝑛.\n\n𝑌𝑜𝑢𝑟 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑙𝑜𝑎𝑛 𝑡𝑜 𝑝𝑎𝑦: $${userLoan} 😑•\n\n╚════ஜ۩۞۩ஜ═══╝`);
                }

                bankData[user].loan = userLoan + amount;
                bankData[user].loanPayed = false;
                bankData[user].bank += amount;

                fs.writeFileSync(bankDataPath, JSON.stringify(bankData), "utf8");

                return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑌𝑜𝑢 ℎ𝑎𝑣𝑒 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑡𝑎𝑘𝑒𝑛 𝑎 𝑙𝑜𝑎𝑛 𝑜𝑓 $${amount}. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑛𝑜𝑡𝑒 𝑡ℎ𝑎𝑡 𝑙𝑜𝑎𝑛𝑠 𝑚𝑢𝑠𝑡 𝑏𝑒 𝑟𝑒𝑝𝑎𝑖𝑑 𝑤𝑖𝑡ℎ𝑖𝑛 𝑎 𝑐𝑒𝑟𝑡𝑎𝑖𝑛 𝑝𝑒𝑟𝑖𝑜𝑑 😉•\n\n╚════ஜ۩۞۩ஜ═══╝`);

            case "payloan":
                const loanBalance = bankData[user].loan || 0;

                if (isNaN(amount) || amount <= 0) {
                    return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑎𝑚𝑜𝑢𝑛𝑡 𝑡𝑜 𝑟𝑒𝑝𝑎𝑦 𝑦𝑜𝑢𝑟 𝑙𝑜𝑎𝑛 ✖️•\n\n╚════ஜ۩۞۩ஜ═══╝");
                }

                if (loanBalance <= 0) {
                    return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑎𝑛𝑦 𝑝𝑒𝑛𝑑𝑖𝑛𝑔 𝑙𝑜𝑎𝑛 𝑝𝑎𝑦𝑚𝑒𝑛𝑡𝑠•\n\n✧⁺⸜(●˙▾˙●)⸝⁺✧ʸᵃʸ\n\n╚════ஜ۩۞۩ஜ═══╝");
                }

                if (amount > loanBalance) {
                    return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑇ℎ𝑒 𝑎𝑚𝑜𝑢𝑛𝑡 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑡𝑜 𝑝𝑎𝑦 𝑜𝑓𝑟 𝑡ℎ𝑒 𝑙𝑜𝑎𝑛 𝑖𝑠 𝑔𝑟𝑒𝑎𝑡𝑒𝑟 𝑡ℎ𝑎𝑛 𝑦𝑜𝑢𝑟 𝑑𝑢𝑒 𝑎𝑚𝑜𝑢𝑛𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑎𝑦 𝑡ℎ𝑒 𝑒𝑥𝑎𝑐𝑡 𝑎𝑚𝑜𝑢𝑛𝑡 😊•\n𝑌𝑜𝑢𝑟 𝑡𝑜𝑡𝑎𝑙 𝑙𝑜𝑎𝑛: $${loanBalance}\n\n╚════ஜ۩۞۩ஜ═══╝`);
                }

                if (amount > userMoney) {
                    return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑌𝑜𝑢 𝑑𝑜 𝑛𝑜𝑡 ℎ𝑎𝑣𝑒 $${amount} 𝑖𝑛 𝑦𝑜𝑢𝑟 𝑏𝑎𝑙𝑎𝑛𝑐𝑒 𝑡𝑜 𝑟𝑒𝑝𝑎𝑦 𝑡ℎ𝑒 𝑙𝑜𝑎𝑛 😢•\n\n╚════ஜ۩۞۩ஜ═══╝`);
                }

                bankData[user].loan = loanBalance - amount;

                if (loanBalance - amount === 0) {
                    bankData[user].loanPayed = true;
                }

                await usersData.set(event.senderID, {
                    money: userMoney - amount
                });

                fs.writeFileSync(bankDataPath, JSON.stringify(bankData), "utf8");

                return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑟𝑒𝑝𝑎𝑖𝑑 $${amount} 𝑡𝑜𝑤𝑎𝑟𝑑𝑠 𝑦𝑜𝑢𝑟 𝑙𝑜𝑎𝑛. 𝑌𝑜𝑢𝑟 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑙𝑜𝑎𝑛 𝑡𝑜 𝑝𝑎𝑦: $${bankData[user].loan} ✅•\n\n╚════ஜ۩۞۩ஜ═══╝`);

            default:
                return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 𝐵𝑎𝑛𝑘 🏦]\n\n❏𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒 𝑜𝑛𝑒 𝑜𝑓 𝑡ℎ𝑒 𝑓𝑜𝑙𝑙𝑜𝑤𝑖𝑛𝑔 𝑣𝑎𝑙𝑖𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠: 𝑑𝑒𝑝𝑜𝑠𝑖𝑡, 𝑤𝑖𝑡ℎ𝑑𝑟𝑎𝑤, 𝑏𝑎𝑙𝑎𝑛𝑐𝑒, 𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡, 𝑡𝑟𝑎𝑛𝑠𝑓𝑒𝑟, 𝑟𝑖𝑐ℎ𝑒𝑠𝑡, 𝑙𝑜𝑎𝑛, 𝑝𝑎𝑦𝑙𝑜𝑎𝑛\n\n╚════ஜ۩۞۩ஜ═══╝");
        }
    } catch (error) {
        console.error("𝐵𝑎𝑛𝑘 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑒𝑑: " + error.message);
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
