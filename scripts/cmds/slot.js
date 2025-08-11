module.exports.config = {
    name: "slot",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑓𝒂𝒊𝒓 𝑝𝒍𝒂𝒚",
    commandCategory: "𝑔𝒂�𝓂𝑒-𝓈𝓅",
    usages: "[𝓃𝓊𝓂𝒷𝑒𝓇 𝒸𝑜𝒾𝓃 𝓇𝑒𝓆𝓊𝒾𝓇𝑒𝒹]",
    cooldowns: 5,
};

module.exports.languages = {
    "en": {
        "missingInput": "[ 𝑺𝑳𝑶𝑻 ] 𝑩𝒆𝒕 𝒆𝒓 𝒕𝒂𝒌𝒂 𝒌𝒉𝒂𝒍𝒊 𝒃𝒂 𝒏𝒆𝒈𝒂𝒕𝒊𝒗𝒆 𝒏𝒖𝒎𝒃𝒆𝒓 𝒉𝒐𝒕𝒆 𝒑𝒂𝒓𝒃𝒆 𝒏𝒂",
        "moneyBetNotEnough": "[ 𝑺𝑳𝑶𝑻 ] 𝑨𝒑𝒏𝒊 𝒋𝒆 𝒕𝒂𝒌𝒂 𝒃𝒆𝒕 𝒌𝒐𝒓𝒆𝒄𝒉𝒆𝒏, 𝒔𝒆𝒕𝒂 𝒂𝒑𝒏𝒂𝒓 𝒃𝒂𝒍𝒂𝒏𝒄𝒆 𝒆𝒓 𝒄𝒉𝒆𝒚𝒆 𝒃𝒆𝒔𝒉𝒊!",
        "limitBet": "[ 𝑺𝑳𝑶𝑻 ] 𝑨𝒑𝒏𝒂𝒓 𝒃𝒆𝒕 𝒌𝒉𝒂𝒓𝒂𝒑, 𝒎𝒊𝒏𝒊𝒎𝒖𝒎 50$",
        "returnWin": "🎰 %1 | %2 | %3 🎰\n𝑨𝒑𝒏𝒊 𝒋𝒊𝒕𝒔𝒆 %4$ 𝒏𝒊𝒚𝒆",
        "returnLose": "🎰 %1 | %2 | %3 🎰\n𝑨𝒑𝒏𝒊 𝒉𝒂𝒓𝒔𝒆 𝒆𝒃𝒐𝒏𝒈 𝒌𝒉𝒐𝒄𝒉𝒆 %4$"
    }
}

module.exports.run = async function({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID } = event;
    const { getData, increaseMoney, decreaseMoney } = Currencies;
    const slotItems = ["🍇", "🍉", "🍊", "🍏", "7⃣", "🍓", "🍒", "🍌", "🥝", "🥑", "🌽"];
    const moneyUser = (await getData(senderID)).money;

    var moneyBet = parseInt(args[0]);
    if (isNaN(moneyBet) || moneyBet <= 0) return api.sendMessage(getText("missingInput"), threadID, messageID);
    if (moneyBet > moneyUser) return api.sendMessage(getText("moneyBetNotEnough"), threadID, messageID);
    if (moneyBet < 50) return api.sendMessage(getText("limitBet"), threadID, messageID);
    
    var number = [], win = false;
    for (let i = 0; i < 3; i++) number[i] = Math.floor(Math.random() * slotItems.length);
    
    if (number[0] === number[1] && number[1] === number[2]) {
        moneyBet *= 9;
        win = true;
    }
    else if (number[0] === number[1] || number[0] === number[2] || number[1] === number[2]) {
        moneyBet *= 2;
        win = true;
    }
    
    if (win) {
        await increaseMoney(senderID, moneyBet);
        return api.sendMessage(getText("returnWin", slotItems[number[0]], slotItems[number[1]], slotItems[number[2]], moneyBet), threadID, messageID);
    } else {
        await decreaseMoney(senderID, moneyBet);
        return api.sendMessage(getText("returnLose", slotItems[number[0]], slotItems[number[1]], slotItems[number[2]], moneyBet), threadID, messageID);
    }
}
