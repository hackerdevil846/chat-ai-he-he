module.exports.config = {
    name: "changelang",
    aliases: ["setlang", "language"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "admin",
    shortDescription: {
        en: "𝐶ℎ𝑎𝑛𝑔𝑒 𝑏𝑜𝑡 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒"
    },
    longDescription: {
        en: "𝐶ℎ𝑎𝑛𝑔𝑒 𝑡ℎ𝑒 𝑏𝑜𝑡'𝑠 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒 𝑝𝑟𝑒𝑓𝑒𝑟𝑒𝑛𝑐𝑒"
    },
    guide: {
        en: "{p}changelang [en|bn]"
    },
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, args, event }) {
    try {
        // Check if fs-extra is available
        const fs = require("fs-extra");
    } catch (e) {
        return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎", event.threadID, event.messageID);
    }

    const { threadID, messageID } = event;

    if (!args[0]) {
        return message.reply("𝑆𝑦𝑛𝑡𝑎𝑥 𝑒𝑟𝑟𝑜𝑟, 𝑢𝑠𝑒: 𝑐ℎ𝑎𝑛𝑔𝑒𝑙𝑎𝑛𝑔 [𝑒𝑛 | 𝑏𝑛]", threadID, messageID);
    }

    const language = args[0].toLowerCase();

    switch (language) {
        case "english":
        case "en":
            {
                global.config.language = "en";
                return message.reply("✅ 𝐿𝑎𝑛𝑔𝑢𝑎𝑔𝑒 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑐ℎ𝑎𝑛𝑔𝑒𝑑 𝑡𝑜 𝐸𝑛𝑔𝑙𝑖𝑠ℎ", threadID); 
            }
            break;
        
        case "bangla":
        case "bn":
            {
                global.config.language = "bn";
                return message.reply("✅ 𝐿𝑎𝑛𝑔𝑢𝑎𝑔𝑒 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑐ℎ𝑎𝑛𝑔𝑒𝑑 𝑡𝑜 𝐵𝑎𝑛𝑔𝑙𝑎", threadID); 
            }
            break;
    
        default:
            {
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒. 𝑈𝑠𝑒: 𝑒𝑛 (𝐸𝑛𝑔𝑙𝑖𝑠ℎ) 𝑜𝑟 𝑏𝑛 (𝐵𝑎𝑛𝑔𝑙𝑎)", threadID, messageID);
            }   
            break;
    }	
};
