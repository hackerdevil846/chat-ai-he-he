const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "bank",
        aliases: ["banking", "economy"],
        version: "1.2",
        author: "Asif Mahmud",
        countDown: 15,
        role: 0,
        category: "economy",
        shortDescription: {
            en: "💰 | Deposit or withdraw money from the bank and earn interest"
        },
        longDescription: {
            en: "Manage your bank account, deposit, withdraw, earn interest, transfer funds, and more"
        },
        guide: {
            en: "{p}bank [deposit/withdraw/balance/interest/transfer/richest/loan/payloan] [amount] [recipientID]"
        },
        dependencies: {
            "fs": "",
            "path": ""
        }
    },

    onStart: async function ({ message, args, event, usersData }) {
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
                        return message.reply("╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ Please enter a valid amount to deposit 🔁\n\n╚═════════════════╝");
                    }

                    if (bankBalance >= 1e104) {
                        return message.reply("╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ You cannot deposit money when your bank balance is already at $1e104 ✖️\n\n╚═════════════════╝");
                    }

                    if (userMoney < amount) {
                        return message.reply("╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ You don't have the required amount to deposit ✖️\n\n╚═════════════════╝");
                    }

                    bankData[user].bank += amount;
                    await usersData.set(event.senderID, {
                        money: userMoney - amount
                    });
                    fs.writeFileSync(bankDataPath, JSON.stringify(bankData), "utf8");

                    return message.reply(`╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ Successfully deposited $${amount} into your bank account ✅\n\n╚═════════════════╝`);

                case "withdraw":
                    const balance = bankData[user].bank || 0;

                    if (isNaN(amount) || amount <= 0) {
                        return message.reply("╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ Please enter the correct amount to withdraw 😪\n\n╚═════════════════╝");
                    }

                    if (userMoney >= 1e104) {
                        return message.reply("╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ You cannot withdraw money when your balance is already at 1e104 😒\n\n╚═════════════════╝");
                    }

                    if (amount > balance) {
                        return message.reply("╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ The requested amount is greater than the available balance in your bank account 🗿\n\n╚═════════════════╝");
                    }

                    bankData[user].bank = balance - amount;
                    await usersData.set(event.senderID, {
                        money: userMoney + amount
                    });
                    fs.writeFileSync(bankDataPath, JSON.stringify(bankData), "utf8");
                    return message.reply(`╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ Successfully withdrew $${amount} from your bank account ✅\n\n╚═════════════════╝`);

                case "balance":
                    const formattedBankBalance = parseFloat(bankBalance);
                    if (!isNaN(formattedBankBalance)) {
                        return message.reply(`╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ Your bank balance is: $${formatNumberWithFullForm(formattedBankBalance)}\n\n╚═════════════════╝`);
                    } else {
                        return message.reply("╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ Error: Your bank balance is not a valid number 🥲\n\n╚═════════════════╝");
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

                        return message.reply(`╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ You can claim interest again in ${remainingHours} hours and ${remainingMinutes} minutes 😉\n\n╚═════════════════╝`);
                    }

                    const interestEarned = bankData[user].bank * (interestRate / 970) * timeDiffInSeconds;

                    if (bankData[user].bank <= 0) {
                        return message.reply("╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ You don't have any money in your bank account to earn interest 💸🥱\n\n╚═════════════════╝");
                    }

                    bankData[user].lastInterestClaimed = currentTime;
                    bankData[user].bank += interestEarned;

                    fs.writeFileSync(bankDataPath, JSON.stringify(bankData), "utf8");

                    return message.reply(`╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ You have earned interest of $${formatNumberWithFullForm(interestEarned)}\n\nIt has been successfully added to your account balance ✅\n\n╚═════════════════╝`);

                case "transfer":
                    if (isNaN(amount) || amount <= 0) {
                        return message.reply("╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ Please enter a valid amount to transfer 🔁\n\n╚═════════════════╝");
                    }

                    if (!recipientUID || !bankData[recipientUID]) {
                        return message.reply("╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ Recipient not found in the bank database. Please check the recipient's ID ✖️\n\n╚═════════════════╝");
                    }

                    if (recipientUID === user) {
                        return message.reply("╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ You cannot transfer money to yourself 😹\n\n╚═════════════════╝");
                    }

                    const senderBankBalance = parseFloat(bankData[user].bank) || 0;
                    const recipientBankBalance = parseFloat(bankData[recipientUID].bank) || 0;

                    if (recipientBankBalance >= 1e104) {
                        return message.reply("╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ The recipient's bank balance is already $1e104. You cannot transfer money to them 🗿\n\n╚═════════════════╝");
                    }

                    if (amount > senderBankBalance) {
                        return message.reply("╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ You don't have enough money in your bank account for this transfer ✖️\n\n╚═════════════════╝");
                    }

                    bankData[user].bank -= amount;
                    bankData[recipientUID].bank += amount;
                    fs.writeFileSync(bankDataPath, JSON.stringify(bankData), "utf8");

                    return message.reply(`╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ Successfully transferred $${amount} to the recipient with UID: ${recipientUID} ✅\n\n╚═════════════════╝`);

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

                    return message.reply("╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ Top 10 richest people according to their bank balance 👑🤴:\n" + output + "\n\n╚═════════════════╝");

                case "loan":
                    const maxLoanAmount = 100000000;
                    const userLoan = bankData[user].loan || 0;
                    const loanPayed = bankData[user].loanPayed !== undefined ? bankData[user].loanPayed : true;

                    if (!amount) {
                        return message.reply("╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ Please enter a valid loan amount ✖️\n\n╚═════════════════╝");
                    }

                    if (amount > maxLoanAmount) {
                        return message.reply("╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ The maximum loan amount is $100000000 ❗\n\n╚═════════════════╝");
                    }

                    if (!loanPayed && userLoan > 0) {
                        return message.reply(`╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ You cannot take a new loan until you pay off your current loan.\n\nYour current loan to pay: $${userLoan} 😑\n\n╚═════════════════╝`);
                    }

                    bankData[user].loan = userLoan + amount;
                    bankData[user].loanPayed = false;
                    bankData[user].bank += amount;

                    fs.writeFileSync(bankDataPath, JSON.stringify(bankData), "utf8");

                    return message.reply(`╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ You have successfully taken a loan of $${amount}. Please note that loans must be repaid within a certain period 😉\n\n╚═════════════════╝`);

                case "payloan":
                    const loanBalance = bankData[user].loan || 0;

                    if (isNaN(amount) || amount <= 0) {
                        return message.reply("╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ Please enter a valid amount to repay your loan ✖️\n\n╚═════════════════╝");
                    }

                    if (loanBalance <= 0) {
                        return message.reply("╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ You don't have any pending loan payments\n\n✧⁺⸜(●˙▾˙●)⸝⁺✧ʸᵃʸ\n\n╚═════════════════╝");
                    }

                    if (amount > loanBalance) {
                        return message.reply(`╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ The amount required to pay off the loan is greater than your due amount. Please pay the exact amount 😊\nYour total loan: $${loanBalance}\n\n╚═════════════════╝`);
                    }

                    if (amount > userMoney) {
                        return message.reply(`╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ You do not have $${amount} in your balance to repay the loan 😢\n\n╚═════════════════╝`);
                    }

                    bankData[user].loan = loanBalance - amount;

                    if (loanBalance - amount === 0) {
                        bankData[user].loanPayed = true;
                    }

                    await usersData.set(event.senderID, {
                        money: userMoney - amount
                    });

                    fs.writeFileSync(bankDataPath, JSON.stringify(bankData), "utf8");

                    return message.reply(`╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ Successfully repaid $${amount} towards your loan. Your current loan to pay: $${bankData[user].loan} ✅\n\n╚═════════════════╝`);

                default:
                    return message.reply("╔═════════════════╗\n\n[🏦 BANK 🏦]\n\n❏ Please use one of the following valid commands: deposit, withdraw, balance, interest, transfer, richest, loan, payloan\n\n╚═════════════════╝");
            }
        } catch (error) {
            console.error("Bank Error:", error);
            // Don't send error message to avoid spam
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
