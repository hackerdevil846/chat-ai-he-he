const axios = require("axios");

module.exports.config = {
    name: "joke",
    aliases: ["funny", "humor"],
    version: "2.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
        en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑗𝑜𝑘𝑒𝑠 𝑓𝑟𝑜𝑚 𝑜𝑓𝑓𝑖𝑐𝑖𝑎𝑙 𝐴𝑃𝐼"
    },
    longDescription: {
        en: "𝐹𝑒𝑡𝑐ℎ𝑒𝑠 𝑟𝑎𝑛𝑑𝑜𝑚 𝑗𝑜𝑘𝑒𝑠 𝑓𝑟𝑜𝑚 𝑜𝑓𝑓𝑖𝑐𝑖𝑎𝑙 𝑗𝑜𝑘𝑒 𝐴𝑃𝐼"
    },
    guide: {
        en: "{p}joke"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.languages = {
    "en": {
        "error": "❌ 𝑆𝑜𝑟𝑟𝑦, 𝑐𝑜𝑢𝑙𝑑𝑛'𝑡 𝑓𝑒𝑡𝑐ℎ 𝑗𝑜𝑘𝑒𝑠 𝑎𝑡 𝑡ℎ𝑒 𝑚𝑜𝑚𝑒𝑛𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟."
    }
};

module.exports.onStart = async function({ api, event, getText }) {
    try {
        const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
        const { setup, punchline } = response.data;
        
        const message = `🤡 | ${setup}\n\n💥 | ${punchline}\n\n✨ 𝐶𝑟𝑒𝑑𝑖𝑡: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`;
        
        await api.sendMessage(message, event.threadID, event.messageID);
    } 
    catch (error) {
        console.error("𝐽𝑜𝑘𝑒 𝐴𝑃𝐼 𝐸𝑟𝑟𝑜𝑟:", error);
        await api.sendMessage(getText("error"), event.threadID, event.messageID);
    }
};
