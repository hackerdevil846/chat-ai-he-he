module.exports.config = {
    name: "flop",
    version: "1.0.1",
    hasPermssion: 1,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🔄 Remove all group members and bot leaves group",
    category: "Group",
    usages: "flop",
    cooldowns: 1,
    dependencies: {},
    envConfig: {}
};

module.exports.languages = {
    "en": {
        noAdmin: "❌ Bot must be group admin to use this command!",
        startFlop: "🌀 Starting group flop operation...",
        success: "✅ Successfully removed all members! Bot will now leave the group.",
        error: "❌ Error occurred while floping group: %1"
    }
};

module.exports.onStart = async function({ api, event, Threads, Users }) {
    const { threadID, messageID } = event;

    try {
        // Fetch thread info
        const threadInfo = await api.getThreadInfo(threadID);
        const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
        const botID = api.getCurrentUserID();

        // Check if bot is admin
        if (!adminIDs.includes(botID)) {
            return api.sendMessage(
                "❌ Bot must be group admin to use this command!",
                threadID,
                messageID
            );
        }

        const participantIDs = threadInfo.participantIDs;

        // Notify start
        await api.sendMessage(
            "🌀 Starting group flop operation...",
            threadID,
            messageID
        );

        // Remove each member except bot
        for (const userID of participantIDs) {
            if (userID !== botID) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
                await api.removeUserFromGroup(userID, threadID);
            }
        }

        // Notify completion
        await api.sendMessage(
            "✅ Successfully removed all members! Bot will now leave the group.",
            threadID
        );

        await new Promise(resolve => setTimeout(resolve, 2000));
        await api.removeUserFromGroup(botID, threadID);

    } catch (error) {
        console.error("Flop Error:", error);
        await api.sendMessage(
            `❌ Error occurred while floping group: ${error.message}`,
            threadID,
            messageID
        );
    }
};
