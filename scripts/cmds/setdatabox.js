module.exports.config = {
    name: "setdatabox",
    version: "1.1",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "Set new data of all group boxes into database",
    category: "system",
    usages: "",
    cooldowns: 5,
    dependencies: {}
};

module.exports.languages = {
    "en": {
        noGroups: "❌ No group boxes found in your INBOX",
        updateSuccess: "✅ Successfully updated %1/%2 group boxes",
        updateFailed: "❌ Failed to update %1 boxes:\n%2",
        criticalError: "❌ An error occurred while processing boxes"
    }
};

module.exports.onLoad = function () {
    // No special loading required
};

module.exports.onStart = async function({ api, event, Threads }) {
    const { threadID } = event;
    
    try {
        // Get inbox threads
        const inbox = await api.getThreadList(100, null, ['INBOX']);
        const groups = inbox.filter(g => g.isSubscribed && g.isGroup);
        const totalGroups = groups.length;

        if (totalGroups === 0) {
            return api.sendMessage(global.utils.languages.en.noGroups, threadID);
        }

        let successCount = 0;
        let failedCount = 0;
        const failedBoxes = [];

        for (const group of groups) {
            try {
                const threadInfo = await api.getThreadInfo(group.threadID);
                await Threads.setData(group.threadID, { threadInfo });
                successCount++;
            } catch (err) {
                failedCount++;
                failedBoxes.push(group.threadID);
                console.error(`❌ Failed to update box ID: ${group.threadID}`, err);
            }
        }

        const successMsg = global.utils.languages.en.updateSuccess
            .replace("%1", successCount)
            .replace("%2", totalGroups);

        if (failedCount > 0) {
            const failedMsg = global.utils.languages.en.updateFailed
                .replace("%1", failedCount)
                .replace("%2", failedBoxes.join('\n'));
            return api.sendMessage(`${successMsg}\n${failedMsg}`, threadID);
        } else {
            return api.sendMessage(successMsg, threadID);
        }

    } catch (error) {
        console.error("❌ Critical ERROR:", error);
        return api.sendMessage(global.utils.languages.en.criticalError, threadID);
    }
};
