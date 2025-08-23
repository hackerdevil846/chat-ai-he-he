const axios = require("axios");

module.exports.config = {
    name: "baybayin",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "Convert text to Baybayin script",
    category: "phontetic-conversion",
    usages: "baybayin [text]",
    cooldowns: 5,
    dependencies: {
        "axios": ""
    }
};

module.exports.languages = {
    "en": {
        "noText": "🌺 Please enter text to convert to Baybayin script!\n💡 Example: baybayin kamusta",
        "error": "❌ Error converting \"{text}\" to Baybayin. Please try again later."
    }
};

module.exports.run = async function({ api, event, args }) {
    try {
        if (!args[0]) {
            return api.sendMessage(module.exports.languages.en.noText, event.threadID, event.messageID);
        }

        const text = args.join(" ");
        const response = await axios.get(`https://api-baybayin-transliterator.vercel.app/?text=${encodeURIComponent(text)}`);
        const baybayinText = response.data.baybay;

        const formattedMessage = `
🪷 𝗕𝗮𝘆𝗯𝗮𝘆𝗶𝗻 𝗖𝗼𝗻𝘃𝗲𝗿𝘀𝗶𝗼𝗻 🪷

✨ 𝗢𝗿𝗶𝗴𝗶𝗻𝗮𝗹:
"${text}"

🏮 𝗕𝗮𝘆𝗯𝗮𝘆𝗶𝗻 𝗦𝗰𝗿𝗶𝗽𝘁:
"${baybayinText}"

📜 𝗔𝗯𝗼𝘂𝘁 𝗕𝗮𝘆𝗯𝗮𝘆𝗶𝗻:
Baybayin is an ancient Filipino script used before the Spanish era. 
It features flowing curves and diacritical marks to represent vowel sounds.`;

        return api.sendMessage(formattedMessage, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        const text = args.join(" ") || "";
        return api.sendMessage(module.exports.languages.en.error.replace("{text}", text), event.threadID, event.messageID);
    }
};
