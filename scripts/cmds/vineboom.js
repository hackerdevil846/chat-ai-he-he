const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "vineboom",
    aliases: ["boom", "therock"],
    version: "1.1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 3,
    role: 0,
    category: "utility",
    shortDescription: {
        en: "🔊 𝑉𝑖𝑛𝑒 𝐵𝑜𝑜𝑚 𝑠𝑜𝑢𝑛𝑑 𝑒𝑓𝑓𝑒𝑐𝑡"
    },
    longDescription: {
        en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑝𝑙𝑎𝑦𝑠 𝑉𝑖𝑛𝑒 𝐵𝑜𝑜𝑚 𝑠𝑜𝑢𝑛𝑑 𝑤ℎ𝑒𝑛 𝑡𝑟𝑖𝑔𝑔𝑒𝑟 𝑤𝑜𝑟𝑑𝑠 𝑎𝑟𝑒 𝑑𝑒𝑡𝑒𝑐𝑡𝑒𝑑"
    },
    guide: {
        en: "𝐽𝑢𝑠𝑡 𝑡𝑦𝑝𝑒: '𝑣𝑖𝑛𝑒𝑏𝑜𝑜𝑚' 𝑜𝑟 '𝑡ℎ𝑒 𝑟𝑜𝑐𝑘' 𝑖𝑛 𝑐ℎ𝑎𝑡!"
    },
    dependencies: {
        "fs": "",
        "path": ""
    },
    envConfig: {
        audioPath: path.join(__dirname, 'noprefix/vineboom.gif')
    }
};

module.exports.onChat = async function({ api, event }) {
    try {
        const { threadID, messageID, senderID } = event;
        const botID = api.getCurrentUserID();
        
        if (senderID === botID) return;
        
        const triggerWords = [
            "vineboom", "vine boom", "therock", 
            "the rock", "darock", "dwaynejohnson"
        ];
        
        if (triggerWords.some(word => 
            event.body?.toLowerCase().includes(word.toLowerCase())
        )) {
            const msg = {
                body: "🤨",
                attachment: fs.createReadStream(this.config.envConfig.audioPath)
            };
            
            await api.sendMessage(msg, threadID, messageID);
            await api.setMessageReaction("🤨", messageID, (err) => {}, true);
        }
    } catch (error) {
        console.error("𝑉𝑖𝑛𝑒𝐵𝑜𝑜𝑚 𝐸𝑟𝑟𝑜𝑟:", error);
    }
};

module.exports.onStart = async function({ api, event }) {
    try {
        await api.sendMessage({
            body: "✨ 𝑇ℎ𝑖𝑠 𝑖𝑠 𝑎𝑛 𝑎𝑢𝑡𝑜-𝑡𝑟𝑖𝑔𝑔𝑒𝑟𝑒𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑\n\n𝐽𝑢𝑠𝑡 𝑡𝑦𝑝𝑒: '𝑣𝑖𝑛𝑒𝑏𝑜𝑜𝑚' 𝑜𝑟 '𝑡ℎ𝑒 𝑟𝑜𝑐𝑘' 𝑖𝑛 𝑐ℎ𝑎𝑡!"
        }, event.threadID);
    } catch (error) {
        console.error("𝑉𝑖𝑛𝑒𝐵𝑜𝑜𝑚 𝑂𝑛𝑆𝑡𝑎𝑟𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
    }
};
