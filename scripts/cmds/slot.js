module.exports.config = {
    name: "slot",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "fair play",
    category: "game-sp",
    usages: "[number coin required]",
    cooldowns: 5
};

module.exports.languages = {
    "en": {
        "missingInput": "[ SLOT ] Bet must be a positive number and not empty.",
        "moneyBetNotEnough": "[ SLOT ] The bet you placed is more than your balance!",
        "limitBet": "[ SLOT ] Your bet is too small, minimum 50$",
        "returnWin": "🎰 %1 | %2 | %3 🎰\nYou won %4$",
        "returnLose": "🎰 %1 | %2 | %3 🎰\nYou lost %4$"
    },
    // preserved original styled messages (if you prefer them instead, uncomment or move)
    "bn": {
        "missingInput": "[ 𝑺𝑳𝑶𝑻 ] 𝑩𝒆𝒕 𝒆𝒓 𝒕𝒂𝒌𝒂 𝒌𝒉𝒂𝒍𝒊 𝒃𝒂 𝒏𝒆𝒈𝒂𝒕𝒊𝒗𝒆 𝒏𝒖𝒎𝒃𝒆𝒓 𝒉𝒐𝒕𝒆 𝒑𝒂𝒓𝒃𝒆 𝒏𝒂",
        "moneyBetNotEnough": "[ 𝑺𝑳𝑶𝑻 ] 𝑨𝒑𝒏𝒊 𝒋𝒆 𝒕𝒂𝒌𝒂 𝒃𝒆𝒕 𝒌𝒐𝒓𝒆𝒄𝒉𝒆𝒏, 𝒔𝒆𝒕𝒂 𝒂𝒑𝒏𝒂𝒓 𝒃𝒂𝒍𝒂𝒏𝒄𝒆 𝒆𝒓 𝒄𝒉𝒆𝒚𝒆 𝒃𝒆𝒔𝒉𝒊!",
        "limitBet": "[ 𝑺𝑳𝑶𝑻 ] 𝑨𝒑𝒏𝒂𝒓 𝒃𝒆𝒕 𝒌𝒉𝒂𝒓𝒂𝒑, 𝒎𝒊𝒏𝒊𝒎𝒖𝒎 50$",
        "returnWin": "🎰 %1 | %2 | %3 🎰\n𝑨𝒑𝒏𝒊 𝒋𝒊𝒕𝒔𝒆 %4$ 𝒏𝒊𝒚𝒆",
        "returnLose": "🎰 %1 | %2 | %3 🎰\n𝑨𝒑𝒏𝒊 𝒉𝒂𝒓𝒔𝒆 𝒆𝒃𝒐𝒏𝒈 𝒌𝒉𝒐𝒄𝒉𝒆 %4$"
    }
};

module.exports.run = async function({ api, event, args, Currencies, getText }) {
    try {
        const { threadID, messageID, senderID } = event;
        const { getData, increaseMoney, decreaseMoney } = Currencies;

        // slot items
        const slotItems = ["🍇", "🍉", "🍊", "🍏", "7⃣", "🍓", "🍒", "🍌", "🥝", "🥑", "🌽"];

        // sanitize and parse input (allow users to type things like "100" or "$100" or "100$")
        const rawArg = args && args[0] ? String(args[0]) : "";
        const sanitized = rawArg.replace(/[^0-9]/g, "");
        const moneyBetInput = parseInt(sanitized, 10);

        // get user's money
        const userData = await getData(senderID);
        const moneyUser = (userData && typeof userData.money === "number") ? userData.money : 0;

        // validations
        if (isNaN(moneyBetInput) || moneyBetInput <= 0) {
            return api.sendMessage(getText("missingInput"), threadID, messageID);
        }
        if (moneyBetInput > moneyUser) {
            return api.sendMessage(getText("moneyBetNotEnough"), threadID, messageID);
        }
        if (moneyBetInput < 50) {
            return api.sendMessage(getText("limitBet"), threadID, messageID);
        }

        // perform slot roll
        const number = [];
        for (let i = 0; i < 3; i++) number[i] = Math.floor(Math.random() * slotItems.length);

        // determine win/lose
        let win = false;
        let payout = moneyBetInput; // amount to add/subtract (for win it's multiplied)
        if (number[0] === number[1] && number[1] === number[2]) {
            payout = moneyBetInput * 9;
            win = true;
        } else if (number[0] === number[1] || number[0] === number[2] || number[1] === number[2]) {
            payout = moneyBetInput * 2;
            win = true;
        }

        // apply result
        if (win) {
            await increaseMoney(senderID, payout);
            return api.sendMessage(getText("returnWin", slotItems[number[0]], slotItems[number[1]], slotItems[number[2]], payout), threadID, messageID);
        } else {
            await decreaseMoney(senderID, moneyBetInput);
            return api.sendMessage(getText("returnLose", slotItems[number[0]], slotItems[number[1]], slotItems[number[2]], moneyBetInput), threadID, messageID);
        }
    } catch (error) {
        // safe fallback error message (keeps behavior non-breaking)
        console.error("Slot command error:", error);
        return api.sendMessage("An error occurred while running the slot command. Please try again later.", event.threadID, event.messageID);
    }
};
