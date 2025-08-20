const chalk = require('chalk');

module.exports.config = {
    name: "join",
    version: "1.0.1",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑩𝒐𝒕 𝒋𝒆 𝒃𝒐𝒙 𝒆 𝒂𝒔𝒆 𝒋𝒐𝒊𝒏 𝒌𝒐𝒓𝒖𝒏",
    commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
    usages: "",
    cooldowns: 5,
    dependencies: {
        "chalk": ""
    }
};

module.exports.onLoad = function() {
    console.log(chalk.bold.hex("#00c300")("╔════════════════════════════════════════╗"));
    console.log(chalk.bold.hex("#00c300")("│          JOIN COMMAND LOADED          │"));
    console.log(chalk.bold.hex("#00c300")("│       Developed by 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅       │"));
    console.log(chalk.bold.hex("#00c300")("╚════════════════════════════════════════╝"));
};

module.exports.handleReply = async function({ api, event, handleReply, Threads }) {
    const { threadID, messageID, senderID, body } = event;
    const { ID } = handleReply;

    if (!body || !parseInt(body)) {
        return api.sendMessage('🔢 Please reply with a valid number!', threadID, messageID);
    }

    const selectedIndex = parseInt(body) - 1;
    if (selectedIndex < 0 || selectedIndex >= ID.length) {
        return api.sendMessage("❌ Invalid selection number!", threadID, messageID);
    }

    try {
        const threadInfo = await Threads.getInfo(ID[selectedIndex]);
        const { participantIDs, approvalMode, adminIDs } = threadInfo;

        if (participantIDs.includes(senderID)) {
            return api.sendMessage(`✅ You're already in this group!`, threadID, messageID);
        }

        await api.addUserToGroup(senderID, ID[selectedIndex]);

        if (approvalMode && !adminIDs.some(admin => admin.id === api.getCurrentUserID())) {
            return api.sendMessage("📩 Added to approval queue. Waiting for admin approval...", threadID, messageID);
        } else {
            return api.sendMessage(`✨ Successfully joined "${threadInfo.threadName}"\n💫 Please check your spam folder if you don't see the group`, threadID, messageID);
        }
    } catch (error) {
        return api.sendMessage(`❌ Failed to join group:\n${error.message}`, threadID, messageID);
    }
};

module.exports.run = async function({ api, event, Threads }) {
    const { threadID, messageID, senderID } = event;
    let msg = `🎯 𝗔𝗩𝗔𝗜𝗟𝗔𝗕𝗟𝗘 𝗚𝗥𝗢𝗨𝗣𝗦 𝗟𝗜𝗦𝗧\n\n`;
    const ID = [];
    
    try {
        const allThreads = await Threads.getAll();
        
        allThreads.forEach((thread, index) => {
            msg += `${index + 1}. ${thread.threadInfo.threadName || 'Unnamed Group'}\n`;
            ID.push(thread.threadID);
        });

        msg += `\n💭 𝗥𝗲𝗽𝗹𝘆 𝘄𝗶𝘁𝗵 𝘁𝗵𝗲 𝗻𝘂𝗺𝗯𝗲𝗿 𝘁𝗼 𝗷𝗼𝗶𝗻 𝘁𝗵𝗮𝘁 𝗴𝗿𝗼𝘂𝗽`;
        
        return api.sendMessage(msg, threadID, (error, info) => {
            if (error) {
                return api.sendMessage("❌ Failed to display group list", threadID, messageID);
            }
            global.client.handleReply.push({
                name: this.config.name,
                author: senderID,
                messageID: info.messageID,
                ID: ID      
            });
        }, messageID);
    } catch (error) {
        return api.sendMessage("❌ Failed to retrieve group list", threadID, messageID);
    }
};
