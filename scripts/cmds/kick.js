module.exports.config = {
    name: "kick",
    aliases: ["remove", "boot"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 1,
    category: "𝑎𝑑𝑚𝑖𝑛",
    shortDescription: {
        en: "𝐺𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑘𝑖𝑐𝑘 𝑐𝑜𝑚𝑚𝑎𝑛𝑑"
    },
    longDescription: {
        en: "𝐾𝑖𝑐𝑘 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝 𝑏𝑦 𝑡𝑎𝑔𝑔𝑖𝑛𝑔 𝑡ℎ𝑒𝑚"
    },
    guide: {
        en: "{p}kick [@𝑡𝑎𝑔]"
    },
    dependencies: {}
};

module.exports.languages = {
    "en": {
        "error": "❌ 𝐸𝑟𝑟𝑜𝑟! 𝑆𝑜𝑚𝑒𝑡ℎ𝑖𝑛𝑔 𝑤𝑒𝑛𝑡 𝑤𝑟𝑜𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛!",
        "needPermssion": "🔒 𝐵𝑜𝑡 𝑛𝑒𝑒𝑑𝑠 𝑎𝑑𝑚𝑖𝑛 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑡𝑜 𝑘𝑖𝑐𝑘 𝑚𝑒𝑚𝑏𝑒𝑟𝑠\n𝑃𝑙𝑒𝑎𝑠𝑒 𝑎𝑑𝑑 𝑏𝑜𝑡 𝑎𝑠 𝑎𝑑𝑚𝑖𝑛 𝑎𝑛𝑑 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛!",
        "missingTag": "📍 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑘𝑖𝑐𝑘 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝",
        "success": "🚫 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑘𝑖𝑐𝑘𝑒𝑑: @%1",
        "noPermission": "❌ 𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑡𝑜 𝑘𝑖𝑐𝑘 𝑚𝑒𝑚𝑏𝑒𝑟𝑠!"
    }
};

module.exports.onStart = async function({ message, event, api, getText }) {
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions);
    
    try {
        const threadInfo = await api.getThreadInfo(threadID);
        const botID = api.getCurrentUserID();
        
        // Check if bot is admin
        const isBotAdmin = threadInfo.adminIDs.some(admin => admin.id === botID);
        if (!isBotAdmin) {
            return message.reply(getText("needPermssion"));
        }
        
        // Check if user is admin
        const isUserAdmin = threadInfo.adminIDs.some(admin => admin.id === senderID);
        if (!isUserAdmin && senderID !== threadInfo.threadID) {
            return message.reply(getText("noPermission"));
        }
        
        if (!mention.length) {
            return message.reply(getText("missingTag"));
        }
        
        for (const id of mention) {
            // Don't kick admins or the bot itself
            if (threadInfo.adminIDs.some(admin => admin.id === id) || id === botID) {
                continue;
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            try {
                await api.removeUserFromGroup(id, threadID);
                message.reply({
                    body: getText("success", event.mentions[id].replace("@", "")),
                    mentions: [{
                        tag: event.mentions[id],
                        id: id
                    }]
                });
            } catch (kickError) {
                console.error("𝐾𝑖𝑐𝑘 𝑒𝑟𝑟𝑜𝑟:", kickError);
            }
        }
        
    } catch (error) {
        console.error("𝑀𝑎𝑖𝑛 𝑒𝑟𝑟𝑜𝑟:", error);
        return message.reply(getText("error"));
    }
};
