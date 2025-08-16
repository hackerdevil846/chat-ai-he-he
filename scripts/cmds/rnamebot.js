module.exports.config = {
	name: "rnamebot",
	version: "1.0.1",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "📛 | Change bot's nickname in all groups",
	commandCategory: "⚙️ System",
	usages: "[name]",
	cooldowns: 20,
	dependencies: {}
};

module.exports.run = async ({ event, api, args, Threads }) => {
    const customName = args.join(" ");
    const allThread = await Threads.getAll(["threadID"]);
    const botID = api.getCurrentUserID();
    
    let threadError = [];
    let count = 0;
    
    try {
        if (customName) {
            // Custom name mode
            for (const thread of allThread) {
                try {
                    await api.changeNickname(customName, thread.threadID, botID);
                    count++;
                    await new Promise(resolve => setTimeout(resolve, 300));
                } catch (err) {
                    threadError.push(thread.threadID);
                }
            }
            
            let msg = `✅ | Successfully changed bot name in ${count} groups!`;
            if (threadError.length) {
                msg += `\n⚠️ | Failed in ${threadError.length} groups`;
            }
            return api.sendMessage(msg, event.threadID);
        } else {
            // Reset to default mode
            for (const thread of allThread) {
                try {
                    const threadSetting = global.client.threadData.get(thread.threadID) || {};
                    const prefix = threadSetting.PREFIX || global.config.PREFIX;
                    const botName = global.config.BOTNAME || "Goat Bot";
                    
                    await api.changeNickname(
                        `[ ${prefix} ] • ${botName}`,
                        thread.threadID,
                        botID
                    );
                    count++;
                    await new Promise(resolve => setTimeout(resolve, 300));
                } catch (err) {
                    threadError.push(thread.threadID);
                }
            }
            
            let msg = `🔄 | Successfully reset bot name in ${count} groups!`;
            if (threadError.length) {
                msg += `\n⚠️ | Failed in ${threadError.length} groups`;
            }
            return api.sendMessage(msg, event.threadID);
        }
    } catch (error) {
        console.error(error);
        return api.sendMessage("❌ | An error occurred while processing your request", event.threadID);
    }
};
