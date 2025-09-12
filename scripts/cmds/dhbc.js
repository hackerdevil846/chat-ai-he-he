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
        en: "🎮 𝑃𝑙𝑎𝑦 𝑔𝑎𝑚𝑒 - 𝑐𝑎𝑡𝑐ℎ 𝑡ℎ𝑒 𝑤𝑜𝑟𝑑 𝑓𝑟𝑜𝑚 𝑖𝑚𝑎𝑔𝑒𝑠"
    },
    longDescription: {
        en: "🎮 𝑃𝑙𝑎𝑦 𝑎 𝑓𝑢𝑛 𝑤𝑜𝑟𝑑 𝑔𝑢𝑒𝑠𝑠𝑖𝑛𝑔 𝑔𝑎𝑚𝑒 𝑤𝑖𝑡ℎ 𝑟𝑎𝑛𝑑𝑜𝑚 𝑖𝑚𝑎𝑔𝑒𝑠"
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
        "reply": "🖼️ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑎𝑛𝑠𝑤𝑒𝑟!\n%1",
        "notPlayer": "⚠️ | 𝑌𝑜𝑢 𝑎𝑟𝑒 𝑛𝑜𝑡 𝑡ℎ𝑒 𝑝𝑙𝑎𝑦𝑒𝑟 𝑜𝑓 𝑡ℎ𝑖𝑠 𝑞𝑢𝑒𝑠𝑡𝑖𝑜𝑛!",
        "correct": "🎉 | 𝐶𝑜𝑛𝑔𝑟𝑎𝑡𝑢𝑙𝑎𝑡𝑖𝑜𝑛𝑠! 𝑌𝑜𝑢 𝑎𝑛𝑠𝑤𝑒𝑟𝑒𝑑 𝑐𝑜𝑟𝑟𝑒𝑐𝑡𝑙𝑦 𝑎𝑛𝑑 𝑟𝑒𝑐𝑒𝑖𝑣𝑒𝑑 %1$",
        "wrong": "❌ | 𝐼𝑛𝑐𝑜𝑟𝑟𝑒𝑐𝑡 𝑎𝑛𝑠𝑤𝑒𝑟! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛."
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
        api.sendMessage("❌ | 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑠𝑡𝑎𝑟𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑔𝑎𝑚𝑒!", event.threadID, event.messageID);
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
