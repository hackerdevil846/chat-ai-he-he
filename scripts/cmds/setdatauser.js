module.exports.config = {
    name: "setdatauser",
    version: "1.1",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "Set new data of users into database",
    category: "system",
    usages: "",
    cooldowns: 5
};

module.exports.languages = {
    "en": {
        noPermission: "❌ This command is restricted to 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 only",
        noUsers: "❌ No users found in this thread",
        criticalError: "❌ An error occurred while processing user data",
        success: (successCount, total) => `✅ Successfully updated ${successCount}/${total} user profiles`,
        failedUsers: (failedCount, failedUsers) => `❌ Failed to update ${failedCount} users:\n${failedUsers.join('\n')}`
    }
};

module.exports.onLoad = function() {
    // Nothing special to do on load
};

module.exports.run = async function({ api, event, Users, Threads }) {
    const allowedIDs = ["61571630409265"];
    const { senderID, threadID } = event;

    if (!allowedIDs.includes(senderID)) {
        return api.sendMessage(global.utils.getText("en", "noPermission"), threadID);
    }

    try {
        const threadInfo = await Threads.getInfo(threadID) || await api.getThreadInfo(threadID);
        const participantIDs = threadInfo.participantIDs;

        if (!participantIDs || participantIDs.length === 0) {
            return api.sendMessage(global.utils.getText("en", "noUsers"), threadID);
        }

        let successCount = 0;
        let failedCount = 0;
        const failedUsers = [];

        for (const id of participantIDs) {
            try {
                const userData = await api.getUserInfo(id);
                const userName = userData[id]?.name || "Unknown User";
                await Users.setData(id, { name: userName, data: {} });
                successCount++;
            } catch (err) {
                failedCount++;
                failedUsers.push(id);
                console.error(`❌ Failed to update user ID: ${id}`, err);
            }
        }

        const successMessage = global.utils.getText("en", "success")(successCount, participantIDs.length);

        if (failedCount > 0) {
            const failedMessage = global.utils.getText("en", "failedUsers")(failedCount, failedUsers);
            api.sendMessage(`${successMessage}\n${failedMessage}`, threadID);
        } else {
            api.sendMessage(successMessage, threadID);
        }

    } catch (err) {
        console.error("❌ Critical ERROR:", err);
        api.sendMessage(global.utils.getText("en", "criticalError"), threadID);
    }
};
