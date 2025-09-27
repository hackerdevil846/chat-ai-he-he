'use strict';

module.exports.config = {
    name: "filter",
    aliases: ["fbclean", "cleanfb"],
    version: "2.1.0",
    author: "𝗔𝘀𝗶𝗳 𝗠𝗮𝗵𝗺𝘂𝗱",
    countDown: 300,
    role: 1,
    shortDescription: {
        en: "🚫 𝐅𝐈𝐋𝐓𝐄𝐑 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐔𝐒𝐄𝐑𝐒 𝐅𝐑𝐎𝐌 𝐆𝐑𝐎𝐔𝐏"
    },
    longDescription: {
        en: "𝐑𝐄𝐌𝐎𝐕𝐄 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐔𝐒𝐄𝐑𝐒 𝐖𝐈𝐓𝐇 𝐂𝐎𝐌𝐏𝐑𝐄𝐇𝐄𝐍𝐒𝐈𝐕𝐄 𝐑𝐄𝐏𝐎𝐑𝐓𝐈𝐍𝐆"
    },
    category: "𝐆𝐑𝐎𝐔𝐏",
    guide: {
        en: "{p}filter [𝐀𝐋𝐋/𝐋𝐈𝐒𝐓]"
    },
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ api, event, args }) {
    try {
        const threadInfo = await api.getThreadInfo(event.threadID);
        const userInfo = threadInfo.userInfo;
        const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
        const isBotAdmin = adminIDs.some(id => id === api.getCurrentUserID());
        
        if (args[0] === "list" || args[0] === "view") {
            const facebookUsers = userInfo.filter(user => user.gender === undefined);
            
            if (facebookUsers.length === 0) {
                return api.sendMessage("🌟 | 𝐍𝐎 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐔𝐒𝐄𝐑𝐒 𝐅𝐎𝐔𝐍𝐃 𝐈𝐍 𝐓𝐇𝐈𝐒 𝐆𝐑𝐎𝐔𝐏!", event.threadID);
            }
            
            let message = `📋 | 𝐅𝐎𝐔𝐍𝐃 ${facebookUsers.length} 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐔𝐒𝐄𝐑𝐒:\n\n`;
            facebookUsers.forEach((user, index) => {
                message += `${index + 1}. ${user.name || '𝐔𝐍𝐊𝐍𝐎𝐖𝐍 𝐔𝐒𝐄𝐑'} (${user.id})\n`;
            });
            
            message += "\n💡 | 𝐔𝐒𝐄 '𝐅𝐈𝐋𝐓𝐄𝐑 𝐀𝐋𝐋' 𝐓𝐎 𝐑𝐄𝐌𝐎𝐕𝐄 𝐀𝐋𝐋 𝐓𝐇𝐄𝐒𝐄 𝐔𝐒𝐄𝐑𝐒";
            return api.sendMessage(message, event.threadID);
        }
        
        if (args[0] === "all") {
            const facebookUsers = userInfo.filter(user => user.gender === undefined);
            
            if (facebookUsers.length === 0) {
                return api.sendMessage("🌟 | 𝐍𝐎 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐔𝐒𝐄𝐑𝐒 𝐅𝐎𝐔𝐍𝐃 𝐓𝐎 𝐅𝐈𝐋𝐓𝐄𝐑!", event.threadID);
            }
            
            if (!isBotAdmin) {
                return api.sendMessage("❌ | 𝐈 𝐍𝐄𝐄𝐃 𝐀𝐃𝐌𝐈𝐍 𝐏𝐄𝐑𝐌𝐈𝐒𝐒𝐈𝐎𝐍𝐒 𝐓𝐎 𝐅𝐈𝐋𝐓𝐄𝐑 𝐔𝐒𝐄𝐑𝐒!", event.threadID);
            }
            
            api.sendMessage(
                `⚠️ | 𝐖𝐀𝐑𝐍𝐈𝐍𝐆: 𝐓𝐇𝐈𝐒 𝐖𝐈𝐋𝐋 𝐑𝐄𝐌𝐎𝐕𝐄 ${facebookUsers.length} 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐔𝐒𝐄𝐑𝐒!\n` +
                "𝐑𝐄𝐀𝐂𝐓 𝐖𝐈𝐓𝐇 👍 𝐓𝐎 𝐂𝐎𝐍𝐅𝐈𝐑𝐌 𝐎𝐑 👎 𝐓𝐎 𝐂𝐀𝐍𝐂𝐄𝐋 𝐖𝐈𝐓𝐇𝐈𝐍 𝟑𝟎 𝐒𝐄𝐂𝐎𝐍𝐃𝐒.",
                event.threadID,
                (err, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        users: facebookUsers,
                        type: "confirmation"
                    });
                    
                    setTimeout(() => {
                        const index = global.client.handleReply.findIndex(item => item.messageID === info.messageID);
                        if (index !== -1) {
                            global.client.handleReply.splice(index, 1);
                            api.sendMessage("⏰ | 𝐅𝐈𝐋𝐓𝐄𝐑 𝐂𝐎𝐍𝐅𝐈𝐑𝐌𝐀𝐓𝐈𝐎𝐍 𝐓𝐈𝐌𝐄𝐃 𝐎𝐔𝐓.", event.threadID);
                        }
                    }, 30000);
                }
            );
            
            return;
        }
        
        const facebookUsers = userInfo.filter(user => user.gender === undefined);
        
        if (facebookUsers.length === 0) {
            return api.sendMessage("✨ | 𝐓𝐇𝐈𝐒 𝐆𝐑𝐎𝐔𝐏 𝐈𝐒 𝐂𝐋𝐄𝐀𝐍! 𝐍𝐎 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐔𝐒𝐄𝐑𝐒 𝐃𝐄𝐓𝐄𝐂𝐓𝐄𝐃.", event.threadID);
        }
        
        if (!isBotAdmin) {
            return api.sendMessage("🔒 | 𝐈 𝐍𝐄𝐄𝐃 𝐀𝐃𝐌𝐈𝐍 𝐏𝐄𝐑𝐌𝐈𝐒𝐒𝐈𝐎𝐍𝐒 𝐓𝐎 𝐅𝐈𝐋𝐓𝐄𝐑 𝐔𝐒𝐄𝐑𝐒!", event.threadID);
        }
        
        let successCount = 0;
        let failCount = 0;
        const failedUsers = [];
        
        api.sendMessage(
            `🔍 | 𝐅𝐎𝐔𝐍𝐃 ${facebookUsers.length} 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐔𝐒𝐄𝐑(𝐒)...\n` +
            "🔄 | 𝐒𝐓𝐀𝐑𝐓𝐈𝐍𝐆 𝐅𝐈𝐋𝐓𝐑𝐀𝐓𝐈𝐎𝐍 𝐏𝐑𝐎𝐂𝐄𝐒𝐒...\n\n" +
            "⏳ | 𝐓𝐇𝐈𝐒 𝐌𝐀𝐘 𝐓𝐀𝐊𝐄 𝐀 𝐖𝐇𝐈𝐋𝐄 𝐃𝐄𝐏𝐄𝐍𝐃𝐈𝐍𝐆 𝐎𝐍 𝐓𝐇𝐄 𝐍𝐔𝐌𝐁𝐄𝐑 𝐎𝐅 𝐔𝐒𝐄𝐑𝐒.",
            event.threadID
        );
        
        for (let i = 0; i < facebookUsers.length; i++) {
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                await api.removeUserFromGroup(facebookUsers[i].id, event.threadID);
                successCount++;
                
                if ((i + 1) % 5 === 0 || i === facebookUsers.length - 1) {
                    api.sendMessage(
                        `📊 | 𝐏𝐑𝐎𝐆𝐑𝐄𝐒𝐒: ${i + 1}/${facebookUsers.length} 𝐔𝐒𝐄𝐑𝐒 𝐏𝐑𝐎𝐂𝐄𝐒𝐒𝐄𝐃\n` +
                        `✅ | 𝐒𝐔𝐂𝐂𝐄𝐒𝐒: ${successCount}\n` +
                        `❌ | 𝐅𝐀𝐈𝐋𝐄𝐃: ${failCount}`,
                        event.threadID
                    );
                }
            } catch (error) {
                failCount++;
                failedUsers.push(facebookUsers[i].name || facebookUsers[i].id);
            }
        }
        
        let resultMessage = 
            `🎉 | 𝐅𝐈𝐋𝐓𝐑𝐀𝐓𝐈𝐎𝐍 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐄!\n\n` +
            `✅ | 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘 𝐑𝐄𝐌𝐎𝐕𝐄𝐃: ${successCount} 𝐔𝐒𝐄𝐑(𝐒)\n` +
            `❌ | 𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 𝐑𝐄𝐌𝐎𝐕𝐄: ${failCount} 𝐔𝐒𝐄𝐑(𝐒)`;
        
        if (failCount > 0) {
            resultMessage += `\n📋 | 𝐅𝐀𝐈𝐋𝐄𝐃 𝐔𝐒𝐄𝐑𝐒: ${failedUsers.join(', ')}`;
        }
        
        resultMessage += `\n\n🏆 | 𝐌𝐀𝐃𝐄 𝐁𝐘 𝗔𝘀𝗶𝗳 𝗠𝗮𝗵𝗺𝘂𝗱`;
        
        api.sendMessage(resultMessage, event.threadID);
        
    } catch (error) {
        console.error("𝐅𝐈𝐋𝐓𝐄𝐑 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐄𝐑𝐑𝐎𝐑:", error);
        api.sendMessage(
            "⚠️ | 𝐀𝐍 𝐄𝐑𝐑𝐎𝐑 𝐎𝐂𝐂𝐔𝐑𝐑𝐄𝐃 𝐖𝐇𝐈𝐋𝐄 𝐏𝐑𝐎𝐂𝐄𝐒𝐒𝐈𝐍𝐆 𝐓𝐇𝐄 𝐂𝐎𝐌𝐌𝐀𝐍𝐃. 𝐏𝐋𝐄𝐀𝐒𝐄 𝐓𝐑𝐘 𝐀𝐆𝐀𝐈𝐍 𝐋𝐀𝐓𝐄𝐑.",
            event.threadID
        );
    }
};

module.exports.onReply = async function({ api, event, handleReply }) {
    try {
        if (handleReply.type === "confirmation") {
            if (event.body === "👍") {
                const { users } = handleReply;
                let successCount = 0;
                let failCount = 0;
                
                api.sendMessage("🔄 | 𝐒𝐓𝐀𝐑𝐓𝐈𝐍𝐆 𝐌𝐀𝐒𝐒 𝐅𝐈𝐋𝐓𝐑𝐀𝐓𝐈𝐎𝐍...", event.threadID);
                
                for (let i = 0; i < users.length; i++) {
                    try {
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        await api.removeUserFromGroup(users[i].id, event.threadID);
                        successCount++;
                    } catch (error) {
                        failCount++;
                    }
                }
                
                let resultMessage = 
                    `🎉 | 𝐌𝐀𝐒𝐒 𝐅𝐈𝐋𝐓𝐑𝐀𝐓𝐈𝐎𝐍 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐄!\n\n` +
                    `✅ | 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘 𝐑𝐄𝐌𝐎𝐕𝐄𝐃: ${successCount} 𝐔𝐒𝐄𝐑(𝐒)\n` +
                    `❌ | 𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎 𝐑𝐄𝐌𝐎𝐕𝐄: ${failCount} 𝐔𝐒𝐄𝐑(𝐒)\n\n` +
                    `🏆 | 𝐌𝐀𝐃𝐄 𝐁𝐘 𝗔𝘀𝗶𝗳 𝗠𝗮𝗵𝗺𝘂𝗱`;
                
                api.sendMessage(resultMessage, event.threadID);
                
                const index = global.client.handleReply.findIndex(item => item.messageID === handleReply.messageID);
                if (index !== -1) {
                    global.client.handleReply.splice(index, 1);
                }
                
            } else if (event.body === "👎") {
                api.sendMessage("❌ | 𝐅𝐈𝐋𝐓𝐑𝐀𝐓𝐈𝐎𝐍 𝐂𝐀𝐍𝐂𝐄𝐋𝐋𝐄𝐃 𝐁𝐘 𝐔𝐒𝐄𝐑.", event.threadID);
                
                const index = global.client.handleReply.findIndex(item => item.messageID === handleReply.messageID);
                if (index !== -1) {
                    global.client.handleReply.splice(index, 1);
                }
            }
        }
    } catch (error) {
        console.error("𝐇𝐀𝐍𝐃𝐋𝐄 𝐑𝐄𝐏𝐋𝐘 𝐄𝐑𝐑𝐎𝐑:", error);
        api.sendMessage("⚠️ | 𝐀𝐍 𝐄𝐑𝐑𝐎𝐑 𝐎𝐂𝐂𝐔𝐑𝐑𝐄𝐃 𝐖𝐇𝐈𝐋𝐄 𝐏𝐑𝐎𝐂𝐄𝐒𝐒𝐈𝐍𝐆 𝐘𝐎𝐔𝐑 𝐑𝐄𝐒𝐏𝐎𝐍𝐒𝐄.", event.threadID);
    }
};
