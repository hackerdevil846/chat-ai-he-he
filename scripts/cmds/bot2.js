const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
    name: "goibot2",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🎵 Music Bot Auto-Respond System",
    category: "system",
    usages: "[]",
    cooldowns: 3,
    dependencies: {
        "moment-timezone": "",
        "fs-extra": ""
    },
    envConfig: {
        timezone: "Asia/Dhaka"
    }
};

module.exports.languages = {
    "en": {
        "welcome": "🎵 Music Bot Activated",
        "response": "✨ Auto-Responder Active"
    },
    "bn": {
        "welcome": "🎵 মিউজিক বট চালু হয়েছে",
        "response": "✨ অটো-রেসপন্ডার সক্রিয় হয়েছে"
    }
};

module.exports.onLoad = function () {
    console.log('\x1b[36m%s\x1b[0m', '🎵 Music Bot Module Loaded Successfully');
};

// Utility function: Convert normal text to Mathematical Bold Italic
function toMathBoldItalic(text) {
    const map = {
        'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱',
        'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻',
        'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
        'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋',
        'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕',
        'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛'
    };
    return text.split('').map(char => map[char] || char).join('');
}

module.exports.handleEvent = async function ({ api, event, Users }) {
    try {
        const { threadID, messageID, senderID, body } = event;
        const time = moment.tz("Asia/Dhaka").format("DD/MM/YYYY ║ HH:mm:ss");

        if (body && body.toLowerCase().includes("song")) {
            const name = await Users.getNameUser(senderID);

            const tl = [
                "🎶 Tumi amar hoye thako na, ami tomak bhalobashi bolbo na 🌹",
                "💔 Tumi je amar hobe, tahole tobo sob kichu dine parbo na 🎵",
                "🌟 Amar praner majhe tumi, tumi chara kono gan nei 🎤",
                "🌠 Tumi amar sondhan, amar sob kichu, amar shesh obidhan 🎶",
                "🌹 Tumi eka bar fire aso, ami tomake nijer kore nebo 💫",
                "🎵 Amar diba rati tumi, amar sob sokho tumi 🌙",
                "✨ Tumi jokhon amar kache, tokhon sob kichu pai 🌟",
                "🎶 Amar moner kotha shuno, tumi chara keu nei 💭",
                "🌌 Tumi amar hoye thakle, ami bechete pari ni 💖",
                "🎵 Amar priyo hobo tumi, ami sob cheye priyo 🌟"
            ];

            const rand = tl[Math.floor(Math.random() * tl.length)];
            const creditName = toMathBoldItalic("Asif") + " " + toMathBoldItalic("Mahmud");

            const msg = {
                body: `╔═════ஜ۩۞۩ஜ═════╗
🎵 Hello ${name} 💖
╚═════ஜ۩۞۩ஜ═════╝

『 ${rand} 』

✦⋆⋅☆⋅⋆✦⋆⋅☆⋅⋆✦⋆⋅☆⋅⋆✦

📌 Credits » ${creditName}
⏰ Time » ${time}
✦⋆⋅☆⋅⋆✦⋆⋅☆⋅⋆✦⋆⋅☆⋅⋆✦`
            };

            return api.sendMessage(msg, threadID, messageID);
        }
    } catch (error) {
        console.error('Error in handleEvent:', error);
    }
};

// Fixed the function name to onStart
module.exports.onStart = function ({ api, event }) {
    api.sendMessage(
        "🎵 Music Bot Is Active\n\n💬 Send 'song' to trigger auto-response",
        event.threadID,
        event.messageID
    );
};
