const fs = require("fs-extra");

module.exports.config = {
    name: "cave",
    aliases: ["mine", "work"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑒𝑐𝑜𝑛𝑜𝑚𝑦",
    shortDescription: {
        en: "💰 𝑆𝑒𝑙𝑙 𝑦𝑜𝑢𝑟 𝑜𝑤𝑛 𝑐𝑎𝑝𝑖𝑡𝑎𝑙 𝑎𝑛𝑑 𝑒𝑎𝑟𝑛 𝑟𝑒𝑤𝑎𝑟𝑑𝑠!"
    },
    longDescription: {
        en: "𝑀𝑖𝑛𝑒 𝑟𝑒𝑠𝑜𝑢𝑟𝑐𝑒𝑠 𝑎𝑛𝑑 𝑒𝑎𝑟𝑛 𝑚𝑜𝑛𝑒𝑦 𝑓𝑟𝑜𝑚 𝑦𝑜𝑢𝑟 𝑐𝑎𝑣𝑒"
    },
    guide: {
        en: "{p}cave"
    },
    dependencies: {
        "fs-extra": ""
    },
    envConfig: {
        cooldownTime: 1000000
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
        "cooldown": toMathBoldItalic("⏳ 𝑌𝑜𝑢 ℎ𝑎𝑣𝑒 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑤𝑜𝑟𝑘𝑒𝑑 𝑡𝑜𝑑𝑎𝑦. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑖𝑛: %1 𝑚𝑖𝑛𝑢𝑡𝑒(𝑠) %2 𝑠𝑒𝑐𝑜𝑛𝑑(𝑠) 🛏"),
        "rewarded": toMathBoldItalic("💸 𝑌𝑜𝑢 𝑤𝑜𝑟𝑘𝑒𝑑 𝑎𝑡 %1 𝑎𝑛𝑑 𝑒𝑎𝑟𝑛𝑒𝑑: %2$"),
        "job1": toMathBoldItalic("𝐶𝑎𝑣𝑒"),
    }
};

module.exports.onStart = async function({ message, event, usersData }) {
    try {
        const { threadID, messageID, senderID } = event;
        const cooldown = global.configModule[this.config.name].cooldownTime;

        const userData = await usersData.get(senderID);
        const userCustomData = userData.data || {};
        
        if (userCustomData.workTime && cooldown - (Date.now() - userCustomData.workTime) > 0) {
            const time = cooldown - (Date.now() - userCustomData.workTime);
            const minutes = Math.floor(time / 60000);
            const seconds = Math.floor((time % 60000) / 1000);

            return message.reply(
                this.languages.en.cooldown
                    .replace("%1", toMathBoldItalic(minutes.toString()))
                    .replace("%2", toMathBoldItalic((seconds < 10 ? "0" + seconds : seconds).toString()))
            );
        } else {
            const job = this.languages.en.job1;
            const amount = Math.floor(Math.random() * 10000);
            const amountText = toMathBoldItalic(amount.toString());

            await message.reply(
                this.languages.en.rewarded
                    .replace("%1", job)
                    .replace("%2", amountText)
            );

            await usersData.increaseMoney(senderID, amount);
            userCustomData.workTime = Date.now();
            await usersData.setData(senderID, { data: userCustomData });
        }

    } catch (error) {
        console.error("𝐶𝑎𝑣𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑚𝑖𝑛𝑖𝑛𝑔.");
    }
};
