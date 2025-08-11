module.exports.config = {
    name: "slot",
    version: "1.0.1",
    permission: 0,
    credits: "asif",
    prefix: false,
    description: "slot game",
    category: "without prefix",
    usages: "slot (amount)",
    cooldowns: 5,
};

module.exports.languages = {
    "vi": {
        "missingInput": "[ SLOT ] повідомлення исти відділено або є негативним номером.",
        "moneyBetNotEnough": "[ SLOT ] необхідно підправити сумуneurona, що велика чи дорівнює залишок!",
        "limitBet": "[ SLOT ] було замало зміни для nut, мінімальна є 50$!",
        "returnWin": "🎰 %1 | %2 | %3 🎰\nви виграли з %4$",
        "returnLose": "🎰 %1 | %2 | %3 🎰\nви програли y9 і втратили %4$"
    },
    "en": {
        "missingInput": "the bet money must not be blank or a negative number.",
        "moneyBetNotEnough": "the money you betted is bigger than your balance.",
        "limitBet": "your bet is too low, the minimum is 50 pesos.",
        "returnWin": "%1 | %2 | %3 \nyou won %4$",
        "returnLose": "%1 | %2 | %3\nyou loss %4$"
    }
};

module.exports.onStart = function() {
    // This empty function is required to prevent the undefined error
};

module.exports.run = async function({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID } = event;
    const { getData, increaseMoney, decreaseMoney } = Currencies;
    const slotItems = ["🖕", "❤️", "👉", "👌", "🥀", "🍓", "🍒", "🍌", "🥝", "🥑", "🌽"];
    const moneyUser = (await getData(senderID)).money;
    var moneyBet = parseInt(args[0]);

    if (isNaN(moneyBet) || moneyBet <= 0) {
        return api.sendMessage(getText("missingInput"), threadID, messageID);
    }

    if (moneyBet > moneyUser) {
        return api.sendMessage(getText("moneyBetNotEnough"), threadID, messageID);
    }

    if (moneyBet < 50) {
        return api.sendMessage(getText("limitBet"), threadID, messageID);
    }

    var number = [], win = false;

    // Fill the number array with random slot items
    for (let i = 0; i < 3; i++) {
        if (i === 0) {
            number[i] = Math.floor(Math.random() * slotItems.length);
        } else {
            number[i] = number[i-1];
        }
    }

    // Check for winning combinations
    if (number[0] === number[1] && number[1] === number[2]) {
        moneyBet *= 9;
        win = true;
    } else if (number[0] === number[1] || number[0] === number[2] || number[1] === number[2]) {
        moneyBet *= 2;
        win = true;
    }

    // Send appropriate message and update user's balance
    let message;
    if (win) {
        message = getText("returnWin", slotItems[number[0]], slotItems[number[1]], slotItems[number[2]], moneyBet);
        await increaseMoney(senderID, moneyBet);
    } else {
        message = getText("returnLose", slotItems[number[0]], slotItems[number[1]], slotItems[number[2]], moneyBet);
        await decreaseMoney(senderID, moneyBet);
    }

    // Send the result message
    return api.sendMessage(message, threadID, messageID);
};
