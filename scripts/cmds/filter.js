'use strict';

module.exports.config = {
    name: "filter",
    aliases: ["fbclean", "cleanfb"],
    version: "2.1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 300,
    role: 1,
    shortDescription: {
        en: "🚫 𝐹𝑖𝑙𝑡𝑒𝑟 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑢𝑠𝑒𝑟𝑠 𝑓𝑟𝑜𝑚 𝑔𝑟𝑜𝑢𝑝 𝑤𝑖𝑡ℎ 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑟𝑒𝑝𝑜𝑟𝑡𝑖𝑛𝑔"
    },
    longDescription: {
        en: "𝑅𝑒𝑚𝑜𝑣𝑒 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑢𝑠𝑒𝑟𝑠 𝑓𝑟𝑜𝑚 𝑔𝑟𝑜𝑢𝑝 𝑤𝑖𝑡ℎ 𝑐𝑜𝑚𝑝𝑟𝑒ℎ𝑒𝑛𝑠𝑖𝑣𝑒 𝑟𝑒𝑝𝑜𝑟𝑡𝑖𝑛𝑔 𝑎𝑛𝑑 𝑐𝑜𝑛𝑡𝑟𝑜𝑙𝑠"
    },
    category: "𝑔𝑟𝑜𝑢𝑝",
    guide: {
        en: "{p}filter [𝑎𝑙𝑙/𝑙𝑖𝑠𝑡]"
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
                return api.sendMessage("🌟 | 𝑁𝑜 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑢𝑠𝑒𝑟𝑠 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝!", event.threadID);
            }
            
            let message = `📋 | 𝐹𝑜𝑢𝑛𝑑 ${facebookUsers.length} 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑢𝑠𝑒𝑟𝑠:\n\n`;
            facebookUsers.forEach((user, index) => {
                message += `${index + 1}. ${user.name || '𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟'} (${user.id})\n`;
            });
            
            message += "\n💡 | 𝑈𝑠𝑒 '𝑓𝑖𝑙𝑡𝑒𝑟 𝑎𝑙𝑙' 𝑡𝑜 𝑟𝑒𝑚𝑜𝑣𝑒 𝑎𝑙𝑙 𝑡ℎ𝑒𝑠𝑒 𝑢𝑠𝑒𝑟𝑠";
            return api.sendMessage(message, event.threadID);
        }
        
        if (args[0] === "all") {
            const facebookUsers = userInfo.filter(user => user.gender === undefined);
            
            if (facebookUsers.length === 0) {
                return api.sendMessage("🌟 | 𝑁𝑜 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑢𝑠𝑒𝑟𝑠 𝑓𝑜𝑢𝑛𝑑 𝑡𝑜 𝑓𝑖𝑙𝑡𝑒𝑟!", event.threadID);
            }
            
            if (!isBotAdmin) {
                return api.sendMessage("❌ | 𝐼 𝑛𝑒𝑒𝑑 𝑎𝑑𝑚𝑖𝑛 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛𝑠 𝑡𝑜 𝑓𝑖𝑙𝑡𝑒𝑟 𝑢𝑠𝑒𝑟𝑠!", event.threadID);
            }
            
            api.sendMessage(
                `⚠️ | 𝑊𝐴𝑅𝑁𝐼𝑁𝐺: 𝑇ℎ𝑖𝑠 𝑤𝑖𝑙𝑙 𝑟𝑒𝑚𝑜𝑣𝑒 ${facebookUsers.length} 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑢𝑠𝑒𝑟𝑠!\n` +
                "𝑅𝑒𝑎𝑐𝑡 𝑤𝑖𝑡ℎ 👍 𝑡𝑜 𝑐𝑜𝑛𝑓𝑖𝑟𝑚 𝑜𝑟 👎 𝑡𝑜 𝑐𝑎𝑛𝑐𝑒𝑙 𝑤𝑖𝑡ℎ𝑖𝑛 30 𝑠𝑒𝑐𝑜𝑛𝑑𝑠.",
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
                            api.sendMessage("⏰ | 𝐹𝑖𝑙𝑡𝑒𝑟 𝑐𝑜𝑛𝑓𝑖𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡.", event.threadID);
                        }
                    }, 30000);
                }
            );
            
            return;
        }
        
        const facebookUsers = userInfo.filter(user => user.gender === undefined);
        
        if (facebookUsers.length === 0) {
            return api.sendMessage("✨ | 𝑇ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝 𝑖𝑠 𝑐𝑙𝑒𝑎𝑛! 𝑁𝑜 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑢𝑠𝑒𝑟𝑠 𝑑𝑒𝑡𝑒𝑐𝑡𝑒𝑑.", event.threadID);
        }
        
        if (!isBotAdmin) {
            return api.sendMessage("🔒 | 𝐼 𝑛𝑒𝑒𝑑 𝑎𝑑𝑚𝑖𝑛 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛𝑠 𝑡𝑜 𝑓𝑖𝑙𝑡𝑒𝑟 𝑢𝑠𝑒𝑟𝑠!", event.threadID);
        }
        
        let successCount = 0;
        let failCount = 0;
        const failedUsers = [];
        
        api.sendMessage(
            `🔍 | 𝐹𝑜𝑢𝑛𝑑 ${facebookUsers.length} 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑢𝑠𝑒𝑟(𝑠)...\n` +
            "🔄 | 𝑆𝑡𝑎𝑟𝑡𝑖𝑛𝑔 𝑓𝑖𝑙𝑡𝑟𝑎𝑡𝑖𝑜𝑛 𝑝𝑟𝑜𝑐𝑒𝑠𝑠...\n\n" +
            "⏳ | 𝑇ℎ𝑖𝑠 𝑚𝑎𝑦 𝑡𝑎𝑘𝑒 𝑎 𝑤ℎ𝑖𝑙𝑒 𝑑𝑒𝑝𝑒𝑛𝑑𝑖𝑛𝑔 𝑜𝑛 𝑡ℎ𝑒 𝑛𝑢𝑚𝑏𝑒𝑟 𝑜𝑓 𝑢𝑠𝑒𝑟𝑠.",
            event.threadID
        );
        
        for (let i = 0; i < facebookUsers.length; i++) {
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                await api.removeUserFromGroup(facebookUsers[i].id, event.threadID);
                successCount++;
                
                if ((i + 1) % 5 === 0 || i === facebookUsers.length - 1) {
                    api.sendMessage(
                        `📊 | 𝑃𝑟𝑜𝑔𝑟𝑒𝑠𝑠: ${i + 1}/${facebookUsers.length} 𝑢𝑠𝑒𝑟𝑠 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑒𝑑\n` +
                        `✅ | 𝑆𝑢𝑐𝑐𝑒𝑠𝑠: ${successCount}\n` +
                        `❌ | 𝐹𝑎𝑖𝑙𝑒𝑑: ${failCount}`,
                        event.threadID
                    );
                }
            } catch (error) {
                failCount++;
                failedUsers.push(facebookUsers[i].name || facebookUsers[i].id);
            }
        }
        
        let resultMessage = 
            `🎉 | 𝐹𝐼𝐿𝑇𝑅𝐴𝑇𝐼𝑂𝑁 𝐶𝑂𝑀𝑃𝐿𝐸𝑇𝐸!\n\n` +
            `✅ | 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑟𝑒𝑚𝑜𝑣𝑒𝑑: ${successCount} 𝑢𝑠𝑒𝑟(𝑠)\n` +
            `❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑟𝑒𝑚𝑜𝑣𝑒: ${failCount} 𝑢𝑠𝑒𝑟(𝑠)`;
        
        if (failCount > 0) {
            resultMessage += `\n📋 | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑢𝑠𝑒𝑟𝑠: ${failedUsers.join(', ')}`;
        }
        
        resultMessage += `\n\n🏆 | 𝑀𝑎𝑑𝑒 𝑏𝑦 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`;
        
        api.sendMessage(resultMessage, event.threadID);
        
    } catch (error) {
        console.error("𝐹𝑖𝑙𝑡𝑒𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        api.sendMessage(
            "⚠️ | 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.",
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
                
                api.sendMessage("🔄 | 𝑆𝑡𝑎𝑟𝑡𝑖𝑛𝑔 𝑚𝑎𝑠𝑠 𝑓𝑖𝑙𝑡𝑟𝑎𝑡𝑖𝑜𝑛...", event.threadID);
                
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
                    `🎉 | 𝑀𝐴𝑆𝑆 𝐹𝐼𝐿𝑇𝑅𝐴𝑇𝐼𝑂𝑁 𝐶𝑂𝑀𝑃𝐿𝐸𝑇𝐸!\n\n` +
                    `✅ | 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑟𝑒𝑚𝑜𝑣𝑒𝑑: ${successCount} 𝑢𝑠𝑒𝑟(𝑠)\n` +
                    `❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑟𝑒𝑚𝑜𝑣𝑒: ${failCount} 𝑢𝑠𝑒𝑟(𝑠)\n\n` +
                    `🏆 | 𝑀𝑎𝑑𝑒 𝑏𝑦 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`;
                
                api.sendMessage(resultMessage, event.threadID);
                
                const index = global.client.handleReply.findIndex(item => item.messageID === handleReply.messageID);
                if (index !== -1) {
                    global.client.handleReply.splice(index, 1);
                }
                
            } else if (event.body === "👎") {
                api.sendMessage("❌ | 𝐹𝑖𝑙𝑡𝑟𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑛𝑐𝑒𝑙𝑙𝑒𝑑 𝑏𝑦 𝑢𝑠𝑒𝑟.", event.threadID);
                
                const index = global.client.handleReply.findIndex(item => item.messageID === handleReply.messageID);
                if (index !== -1) {
                    global.client.handleReply.splice(index, 1);
                }
            }
        }
    } catch (error) {
        console.error("𝐻𝑎𝑛𝑑𝑙𝑒 𝑟𝑒𝑝𝑙𝑦 𝑒𝑟𝑟𝑜𝑟:", error);
        api.sendMessage("⚠️ | 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒.", event.threadID);
    }
};
