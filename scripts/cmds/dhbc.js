const axios = require("axios");

module.exports.config = {
    name: "dhbc",
    aliases: ["wordgame", "guessword"],
    version: "1.3",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "game",
    shortDescription: {
        en: "🎮 𝙿𝚕𝚊𝚢 𝚐𝚊𝚖𝚎 - 𝚌𝚊𝚝𝚌𝚑 𝚝𝚑𝚎 𝚠𝚘𝚛𝚍 𝚏𝚛𝚘𝚖 𝚒𝚖𝚊𝚐𝚎𝚜"
    },
    longDescription: {
        en: "🎮 𝙿𝚕𝚊𝚢 𝚊 𝚏𝚞𝚗 𝚠𝚘𝚛𝚍 𝚐𝚞𝚎𝚜𝚜𝚒𝚗𝚐 𝚐𝚊𝚖𝚎 𝚠𝚒𝚝𝚑 𝚛𝚊𝚗𝚍𝚘𝚖 𝚒𝚖𝚊𝚐𝚎𝚜"
    },
    guide: {
        en: "{p}dhbc"
    },
    dependencies: {
        "axios": ""
    },
    envConfig: {
        "reward": 1000
    }
};

module.exports.languages = {
    "en": {
        "reply": "🖼️ | 𝙿𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚝𝚑𝚒𝚜 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚠𝚒𝚝𝚑 𝚢𝚘𝚞𝚛 𝚊𝚗𝚜𝚠𝚎𝚛!\n%1",
        "notPlayer": "⚠️ | 𝚈𝚘𝚞 𝚊𝚛𝚎 𝚗𝚘𝚝 𝚝𝚑𝚎 𝚙𝚕𝚊𝚢𝚎𝚛 𝚘𝚏 𝚝𝚑𝚒𝚜 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗!",
        "correct": "🎉 | 𝙲𝚘𝚗𝚐𝚛𝚊𝚝𝚞𝚕𝚊𝚝𝚒𝚘𝚗𝚜! 𝚈𝚘𝚞 𝚊𝚗𝚜𝚠𝚎𝚛𝚎𝚍 𝚌𝚘𝚛𝚛𝚎𝚌𝚝𝚕𝚢 𝚊𝚗𝚍 𝚛𝚎𝚌𝚎𝚒𝚟𝚎𝚍 %1$",
        "wrong": "❌ | 𝙸𝚗𝚌𝚘𝚛𝚛𝚎𝚌𝚝 𝚊𝚗𝚜𝚠𝚎𝚛! 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗."
    }
};

module.exports.onStart = async function ({ api, event, getText }) {
    try {
        // Random image
        const imageUrl = "https://picsum.photos/1280/720";

        // Random word
        const wordData = (await axios.get("https://random-word-api.herokuapp.com/word")).data;
        const wordcomplete = wordData[0];

        // Hide word with █
        const bodyMsg = getText("reply", wordcomplete.replace(/\S/g, "█ "));

        // Send message with image
        const attachment = await global.utils.getStreamFromURL(imageUrl);

        api.sendMessage({
            body: bodyMsg,
            attachment: attachment
        }, event.threadID, (error, info) => {
            if (error) return console.error(error);
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                wordcomplete
            });
        });
    } catch (error) {
        console.error(error);
        api.sendMessage("❌ | 𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚜𝚝𝚊𝚛𝚝𝚒𝚗𝚐 𝚝𝚑𝚎 𝚐𝚊𝚖𝚎!", event.threadID, event.messageID);
    }
};

module.exports.onReply = async function ({ api, event, handleReply, getText, Currencies }) {
    const { author, wordcomplete, messageID } = handleReply;
    
    // Check if the responder is the original player
    if (event.senderID !== author) {
        return api.sendMessage(getText("notPlayer"), event.threadID, event.messageID);
    }

    // Check if answer is correct
    if (formatText(event.body) === formatText(wordcomplete)) {
        // Remove from handleReply
        global.client.handleReply = global.client.handleReply.filter(item => item.messageID !== messageID);
        
        const reward = module.exports.config.envConfig.reward;
        await Currencies.increaseMoney(event.senderID, reward);
        api.sendMessage(getText("correct", reward), event.threadID, event.messageID);
    } 
    // Wrong answer
    else {
        api.sendMessage(getText("wrong"), event.threadID, event.messageID);
    }
};

// Format text for comparison
function formatText(text) {
    return text.normalize("NFD")
        .toLowerCase()
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đ|Đ]/g, (x) => x == "đ" ? "d" : "D");
}
