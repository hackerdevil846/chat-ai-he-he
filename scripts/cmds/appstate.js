const fs = require('fs-extra');

module.exports.config = {
    name: "appstate",
    aliases: ["refreshapp", "token"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "admin",
    shortDescription: {
        en: "𝑅𝑒𝑓𝑟𝑒𝑠ℎ 𝑎𝑝𝑝𝑠𝑡𝑎𝑡𝑒.𝑗𝑠𝑜𝑛 𝑓𝑖𝑙𝑒"
    },
    longDescription: {
        en: "𝑅𝑒𝑓𝑟𝑒𝑠ℎ𝑒𝑠 𝑡ℎ𝑒 𝑎𝑝𝑝𝑠𝑡𝑎𝑡𝑒.𝑗𝑠𝑜𝑛 𝑓𝑖𝑙𝑒 𝑤𝑖𝑡ℎ 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑠𝑒𝑠𝑠𝑖𝑜𝑛 𝑑𝑎𝑡𝑎"
    },
    guide: {
        en: "{p}appstate"
    },
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, event, api }) {
    try {
        const permission = ["61571630409265"];
        
        if (!permission.includes(String(event.senderID))) {
            return message.reply("𝑌𝑜𝑢𝑟 𝑃𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝐷𝑒𝑛𝑖𝑒𝑑! 😾", event.threadID, event.messageID);
        }

        let appstate = api.getAppState();
        const data = JSON.stringify(appstate, null, 2);
        
        await fs.writeFile(`${__dirname}/../../appstate.json`, data, 'utf8');
        return message.reply("𝐴𝑝𝑝𝑠𝑡𝑎𝑡𝑒 𝑟𝑒𝑓𝑟𝑒𝑠ℎ𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦! 😸", event.threadID, event.messageID);
        
    } catch (err) {
        console.error("𝐴𝑝𝑝𝑠𝑡𝑎𝑡𝑒 𝐸𝑟𝑟𝑜𝑟:", err);
        return message.reply(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑟𝑒𝑓𝑟𝑒𝑠ℎ 𝑎𝑝𝑝𝑠𝑡𝑎𝑡𝑒: ${err.message}`, event.threadID, event.messageID);
    }
};
