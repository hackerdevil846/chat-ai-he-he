const fs = require("fs");

module.exports.config = {
    name: "cave",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "💰 Sell your own capital and earn rewards!",
    category: "Economy",
    usages: "",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 1000000 // Cooldown in ms
    }
};

function toMathBoldItalic(text) {
    const map = {
        'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴',
        'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
        'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎',
        'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
        '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗',
        ' ': ' ', ':': ':', '>': '>', '<': '<', '(': '(', ')': ')', '[': '[', ']': ']', '{': '{', '}': '}', ',': ',', '.': '.', ';': ';', 
        '!': '!', '?': '?', "'": "'", '"': '"', '-': '-', '_': '_', '=': '=', '+': '+', '*': '*', '/': '/', '\\': '\\', '|': '|', '&': '&', 
        '^': '^', '%': '%', '$': '$', '#': '#', '@': '@'
    };
    return text.split('').map(char => map[char] || char).join('');
}

module.exports.languages = {
    "en": {
        "cooldown": toMathBoldItalic("⏳ You have already worked today. Try again in: %1 minute(s) %2 second(s) 🛏"),
        "rewarded": toMathBoldItalic("💸 You worked at %1 and earned: %2$"),
        "job1": toMathBoldItalic("Cave"),
    },
    "vi": {
        "cooldown": toMathBoldItalic("⏳ Apni aaj kaj korechen, abar kach korte parben: %1 minute(s) %2 second(s) 🛏"),
        "rewarded": toMathBoldItalic("💸 Apni kaj ta korechen: %1 ar peyechen: %2$"),
        "job1": toMathBoldItalic("Cave"),
    }
};

module.exports.onStart = async ({ api, event, Currencies, getText }) => {
    const { threadID, messageID, senderID } = event;
    const cooldown = global.configModule[this.config.name].cooldownTime;

    let userData = (await Currencies.getData(senderID)).data || {};
    if (userData.workTime && cooldown - (Date.now() - userData.workTime) > 0) {
        let time = cooldown - (Date.now() - userData.workTime);
        let minutes = Math.floor(time / 60000);
        let seconds = Math.floor((time % 60000) / 1000);

        return api.sendMessage(
            getText("cooldown", toMathBoldItalic(minutes.toString()), toMathBoldItalic((seconds < 10 ? "0" + seconds : seconds).toString())),
            threadID,
            messageID
        );
    } else {
        const job = getText("job1");
        const amount = Math.floor(Math.random() * 10000);
        const amountText = toMathBoldItalic(amount.toString());

        return api.sendMessage(
            getText("rewarded", job, amountText),
            threadID,
            async () => {
                await Currencies.increaseMoney(senderID, amount);
                userData.workTime = Date.now();
                await Currencies.setData(senderID, { data: userData });
            },
            messageID
        );
    }
};
