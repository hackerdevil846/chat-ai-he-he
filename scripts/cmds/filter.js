module.exports.config = {
    name: "filter",
    version: "2.1.0",
    hasPermssion: 1,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🚫 Filter Facebook users from group with detailed reporting",
    commandCategory: "group",
    usages: "[all/list]",
    cooldowns: 300,
    dependencies: {},
    envConfig: {}
};

module.exports.run = async function({ api, event, args }) {
    try {
        // Get thread information
        const threadInfo = await api.getThreadInfo(event.threadID);
        const userInfo = threadInfo.userInfo;
        const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
        const isBotAdmin = adminIDs.some(id => id === api.getCurrentUserID());
        
        // Check for list command
        if (args[0] === "list" || args[0] === "view") {
            const facebookUsers = userInfo.filter(user => user.gender === undefined);
            
            if (facebookUsers.length === 0) {
                return api.sendMessage("🌟 | No Facebook users found in this group!", event.threadID);
            }
            
            let message = `📋 | Found ${facebookUsers.length} Facebook users:\n\n`;
            facebookUsers.forEach((user, index) => {
                message += `${index + 1}. ${user.name || 'Unknown User'} (${user.id})\n`;
            });
            
            message += "\n💡 | Use 'filter all' to remove all these users";
            return api.sendMessage(message, event.threadID);
        }
        
        // Check for confirmation if using 'all' parameter
        if (args[0] === "all") {
            const facebookUsers = userInfo.filter(user => user.gender === undefined);
            
            if (facebookUsers.length === 0) {
                return api.sendMessage("🌟 | No Facebook users found to filter!", event.threadID);
            }
            
            if (!isBotAdmin) {
                return api.sendMessage("❌ | I need admin permissions to filter users!", event.threadID);
            }
            
            api.sendMessage(
                `⚠️ | WARNING: This will remove ${facebookUsers.length} Facebook users!\n` +
                "React with 👍 to confirm or 👎 to cancel within 30 seconds.",
                event.threadID,
                (err, info) => {
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        users: facebookUsers,
                        type: "confirmation"
                    });
                    
                    // Auto-remove reaction check after 30 seconds
                    setTimeout(() => {
                        if (global.GoatBot.onReply.has(info.messageID)) {
                            global.GoatBot.onReply.delete(info.messageID);
                            api.sendMessage("⏰ | Filter confirmation timed out.", event.threadID);
                        }
                    }, 30000);
                }
            );
            
            return;
        }
        
        // Standard filter process
        const facebookUsers = userInfo.filter(user => user.gender === undefined);
        
        if (facebookUsers.length === 0) {
            return api.sendMessage("✨ | This group is clean! No Facebook users detected.", event.threadID);
        }
        
        if (!isBotAdmin) {
            return api.sendMessage("🔒 | I need admin permissions to filter users!", event.threadID);
        }
        
        let successCount = 0;
        let failCount = 0;
        const failedUsers = [];
        
        api.sendMessage(
            `🔍 | Found ${facebookUsers.length} Facebook user(s)...\n` +
            "🔄 | Starting filtration process...\n\n" +
            "⏳ | This may take a while depending on the number of users.",
            event.threadID
        );
        
        // Process users with progress updates
        for (let i = 0; i < facebookUsers.length; i++) {
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                await api.removeUserFromGroup(facebookUsers[i].id, event.threadID);
                successCount++;
                
                // Send progress update every 5 users
                if ((i + 1) % 5 === 0 || i === facebookUsers.length - 1) {
                    api.sendMessage(
                        `📊 | Progress: ${i + 1}/${facebookUsers.length} users processed\n` +
                        `✅ | Success: ${successCount}\n` +
                        `❌ | Failed: ${failCount}`,
                        event.threadID
                    );
                }
            } catch (error) {
                failCount++;
                failedUsers.push(facebookUsers[i].name || facebookUsers[i].id);
            }
        }
        
        // Final result message
        let resultMessage = 
            `🎉 | FILTRATION COMPLETE!\n\n` +
            `✅ | Successfully removed: ${successCount} user(s)\n` +
            `❌ | Failed to remove: ${failCount} user(s)`;
        
        if (failCount > 0) {
            resultMessage += `\n📋 | Failed users: ${failedUsers.join(', ')}`;
        }
        
        resultMessage += `\n\n🏆 | Made by Asif Mahmud`;
        
        api.sendMessage(resultMessage, event.threadID);
        
    } catch (error) {
        console.error("Filter command error:", error);
        api.sendMessage(
            "⚠️ | An error occurred while processing the command. Please try again later.",
            event.threadID
        );
    }
};

module.exports.handleReply = async function({ api, event, handleReply }) {
    try {
        if (handleReply.type === "confirmation") {
            if (event.body === "👍") {
                // User confirmed, proceed with filtering
                const { users } = handleReply;
                let successCount = 0;
                let failCount = 0;
                
                api.sendMessage("🔄 | Starting mass filtration...", event.threadID);
                
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
                    `🎉 | MASS FILTRATION COMPLETE!\n\n` +
                    `✅ | Successfully removed: ${successCount} user(s)\n` +
                    `❌ | Failed to remove: ${failCount} user(s)\n\n` +
                    `🏆 | Made by Asif Mahmud`;
                
                api.sendMessage(resultMessage, event.threadID);
                global.GoatBot.onReply.delete(handleReply.messageID);
                
            } else if (event.body === "👎") {
                api.sendMessage("❌ | Filtration cancelled by user.", event.threadID);
                global.GoatBot.onReply.delete(handleReply.messageID);
            }
        }
    } catch (error) {
        console.error("Handle reply error:", error);
        api.sendMessage("⚠️ | An error occurred while processing your response.", event.threadID);
    }
};
