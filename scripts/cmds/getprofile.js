module.exports.config = {
    name: "getprofile",
    aliases: ["profile", "getid"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 0,
    role: 0,
    category: "utility",
    shortDescription: {
        en: "𝐺𝑒𝑡 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝐼𝐷 𝑜𝑟 𝑙𝑖𝑛𝑘"
    },
    longDescription: {
        en: "𝐺𝑒𝑡 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝐼𝐷 𝑜𝑟 𝑙𝑖𝑛𝑘 𝑓𝑟𝑜𝑚 𝑟𝑒𝑝𝑙𝑦, 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑜𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑈𝑅𝐿"
    },
    guide: {
        en: "{p}getprofile [𝑟𝑒𝑝𝑙𝑦|𝑚𝑒𝑛𝑡𝑖𝑜𝑛|𝑝𝑟𝑜𝑓𝑖𝑙𝑒_𝑢𝑟𝑙]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ api, event, args }) {
    try {
        // Check dependencies
        const axios = require("axios");
        const fs = require("fs-extra");
    } catch (e) {
        return api.sendMessage("❌ | 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠: 𝑎𝑥𝑖𝑜𝑠 𝑎𝑛𝑑 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎", event.threadID, event.messageID);
    }

    try {
        if (event.type === "message_reply") { 
            const uid = event.messageReply.senderID;
            return api.sendMessage(`https://www.facebook.com/profile.php?id=${uid}`, event.threadID, event.messageID);
        }
        
        if (!args[0]) {
            return api.sendMessage(`https://www.facebook.com/profile.php?id=${event.senderID}`, event.threadID, event.messageID);
        } else {
            if (args[0].includes(".com/")) {
                try {
                    const res_ID = await api.getUID(args[0]);  
                    return api.sendMessage(`${res_ID}`, event.threadID, event.messageID);
                } catch (error) {
                    return api.sendMessage("❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑈𝐼𝐷 𝑓𝑟𝑜𝑚 𝑙𝑖𝑛𝑘", event.threadID, event.messageID);
                }
            } else {
                if (Object.keys(event.mentions).length > 0) {
                    let message = "";
                    for (const [id, name] of Object.entries(event.mentions)) {
                        message += `${name.replace('@', '')}\n→ 𝑃𝑟𝑜𝑓𝑖𝑙𝑒: https://www.facebook.com/profile.php?id=${id}\n\n`;
                    }
                    return api.sendMessage(message, event.threadID, event.messageID);
                } else {
                    return api.sendMessage(`https://www.facebook.com/profile.php?id=${event.senderID}`, event.threadID, event.messageID);
                }
            }
        }
    } catch (error) {
        console.error("𝐺𝑒𝑡𝑃𝑟𝑜𝑓𝑖𝑙𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
        return api.sendMessage("❌ | 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑒𝑠𝑡", event.threadID, event.messageID);
    }
};
