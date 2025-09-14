const chalk = require('chalk');

module.exports.config = {
    name: "join",
    aliases: ["joingroup", "addme"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "𝑠𝑦𝑠𝑡𝑒𝑚",
    shortDescription: {
        en: "𝐵𝑜𝑡 𝑗𝑜𝑖𝑛𝑠 𝑢𝑠𝑒𝑟 𝑡𝑜 𝑔𝑟𝑜𝑢𝑝𝑠"
    },
    longDescription: {
        en: "𝐴𝑙𝑙𝑜𝑤𝑠 𝑢𝑠𝑒𝑟𝑠 𝑡𝑜 𝑗𝑜𝑖𝑛 𝑏𝑜𝑡'𝑠 𝑔𝑟𝑜𝑢𝑝𝑠 𝑡ℎ𝑟𝑜𝑢𝑔ℎ 𝑎 𝑙𝑖𝑠𝑡"
    },
    guide: {
        en: "{p}join"
    },
    dependencies: {
        "chalk": ""
    }
};

module.exports.onLoad = function() {
    console.log(chalk.bold.hex("#00c300")("╔════════════════════════════════════════╗"));
    console.log(chalk.bold.hex("#00c300")("│          𝐽𝑂𝐼𝑁 𝐶𝑂𝑀𝑀𝐴𝑁𝐷 𝐿𝑂𝐴𝐷𝐸𝐷          │"));
    console.log(chalk.bold.hex("#00c300")("│       𝐷𝑒𝑣𝑒𝑙𝑜𝑝𝑒𝑑 𝑏𝑦 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑       │"));
    console.log(chalk.bold.hex("#00c300")("╚════════════════════════════════════════╝"));
};

module.exports.onReply = async function({ api, event, handleReply, threadsData }) {
    const { threadID, messageID, senderID, body } = event;
    const { ID } = handleReply;

    if (!body || !parseInt(body)) {
        return api.sendMessage('🔢 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑛𝑢𝑚𝑏𝑒𝑟!', threadID, messageID);
    }

    const selectedIndex = parseInt(body) - 1;
    if (selectedIndex < 0 || selectedIndex >= ID.length) {
        return api.sendMessage("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑠𝑒𝑙𝑒𝑐𝑡𝑖𝑜𝑛 𝑛𝑢𝑚𝑏𝑒𝑟!", threadID, messageID);
    }

    try {
        const threadInfo = await threadsData.get(ID[selectedIndex]);
        const { participantIDs, approvalMode, adminIDs } = threadInfo;

        if (participantIDs.includes(senderID)) {
            return api.sendMessage(`✅ 𝑌𝑜𝑢'𝑟𝑒 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝!`, threadID, messageID);
        }

        await api.addUserToGroup(senderID, ID[selectedIndex]);

        if (approvalMode && !adminIDs.some(admin => admin.id === api.getCurrentUserID())) {
            return api.sendMessage("📩 𝐴𝑑𝑑𝑒𝑑 𝑡𝑜 𝑎𝑝𝑝𝑟𝑜𝑣𝑎𝑙 𝑞𝑢𝑒𝑢𝑒. 𝑊𝑎𝑖𝑡𝑖𝑛𝑔 𝑓𝑜𝑟 𝑎𝑑𝑚𝑖𝑛 𝑎𝑝𝑝𝑟𝑜𝑣𝑎𝑙...", threadID, messageID);
        } else {
            return api.sendMessage(`✨ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑗𝑜𝑖𝑛𝑒𝑑 "${threadInfo.threadName}"\n💫 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑠𝑝𝑎𝑚 𝑓𝑜𝑙𝑑𝑒𝑟 𝑖𝑓 𝑦𝑜𝑢 𝑑𝑜𝑛'𝑡 𝑠𝑒𝑒 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝`, threadID, messageID);
        }
    } catch (error) {
        console.error("𝐽𝑜𝑖𝑛 𝐸𝑟𝑟𝑜𝑟:", error);
        return api.sendMessage(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑗𝑜𝑖𝑛 𝑔𝑟𝑜𝑢𝑝:\n${error.message}`, threadID, messageID);
    }
};

module.exports.onStart = async function({ api, event, threadsData }) {
    const { threadID, messageID, senderID } = event;
    
    try {
        const allThreads = await threadsData.getAll();
        const availableThreads = allThreads.filter(thread => 
            thread.threadID && thread.threadInfo && thread.threadInfo.threadName
        );

        if (availableThreads.length === 0) {
            return api.sendMessage("❌ 𝑁𝑜 𝑔𝑟𝑜𝑢𝑝𝑠 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑡𝑜 𝑗𝑜𝑖𝑛.", threadID, messageID);
        }

        let msg = `🎯 𝐴𝑉𝐴𝐼𝐿𝐴𝐵𝐿𝐸 𝐺𝑅𝑂𝑈𝑃𝑆 𝐿𝐼𝑆𝑇\n\n`;
        const ID = [];
        
        availableThreads.forEach((thread, index) => {
            msg += `${index + 1}. ${thread.threadInfo.threadName || '𝑈𝑛𝑛𝑎𝑚𝑒𝑑 𝐺𝑟𝑜𝑢𝑝'}\n`;
            ID.push(thread.threadID);
        });

        msg += `\n💭 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 𝑡𝑜 𝑗𝑜𝑖𝑛 𝑡ℎ𝑎𝑡 𝑔𝑟𝑜𝑢𝑝`;
        
        return api.sendMessage(msg, threadID, (error, info) => {
            if (error) {
                console.error("𝑆𝑒𝑛𝑑 𝑀𝑒𝑠𝑠𝑎𝑔𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
                return api.sendMessage("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑖𝑠𝑝𝑙𝑎𝑦 𝑔𝑟𝑜𝑢𝑝 𝑙𝑖𝑠𝑡", threadID, messageID);
            }
            
            global.client.handleReply.push({
                name: this.config.name,
                author: senderID,
                messageID: info.messageID,
                ID: ID      
            });
        }, messageID);
        
    } catch (error) {
        console.error("𝑀𝑎𝑖𝑛 𝐸𝑟𝑟𝑜𝑟:", error);
        return api.sendMessage("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑟𝑒𝑡𝑟𝑖𝑒𝑣𝑒 𝑔𝑟𝑜𝑢𝑝 𝑙𝑖𝑠𝑡", threadID, messageID);
    }
};
