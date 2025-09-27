const sleep = (ms) => new Promise(res => setTimeout(res, ms));

module.exports = {
    config: {
        name: "filteruser",
        aliases: ["filter", "cleanmembers"],
        version: "1.6",
        author: "Asif Mahmud",
        countDown: 5,
        role: 1,
        category: "group",
        shortDescription: {
            en: "Filter group members by message count or locked accounts"
        },
        longDescription: {
            en: "Filter and remove group members based on message count or locked accounts"
        },
        guide: {
            en: "{p}filteruser [<number> | die]"
        },
        dependencies: {
            "moment": ""
        }
    },

    languages: {
        "en": {
            "needAdmin": "⚠️ | Please add the bot as a group admin to use this command",
            "confirm": "⚠️ | Are you sure you want to delete group members with less than %1 messages?\nReact to this message to confirm",
            "kickByBlock": "✅ | Successfully removed %1 members with locked accounts 🔒",
            "kickByMsg": "✅ | Successfully removed %1 members with less than %2 messages 📊",
            "kickError": "❌ | Failed to remove %1 members:\n%2",
            "noBlock": "✅ | No members with locked accounts found 🔍",
            "noMsg": "✅ | No members with less than %1 messages found 📊",
            "usage": "❗️ | Usage: {p}filteruser [<number> | die]"
        }
    },

    onStart: async function({ message, event, args, threadsData, getLang, api }) {
        try {
            const threadID = event.threadID;
            const threadData = await threadsData.get(threadID);
            
            if (!threadData.adminIDs || !threadData.adminIDs.includes(api.getCurrentUserID())) {
                return message.reply(getLang("needAdmin"));
            }

            if (!args[0]) {
                return message.reply(getLang("usage"));
            }

            if (!isNaN(args[0])) {
                return message.reply(getLang("confirm", args[0]), (err, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        minimum: Number(args[0])
                    });
                });
            }

            if (args[0] === "die") {
                const threadInfo = await api.getThreadInfo(threadID);
                const membersBlocked = threadInfo.userInfo.filter(u => u.type !== "User");
                const errors = [], success = [];

                for (const user of membersBlocked) {
                    if (user.type !== "User" && !threadData.adminIDs.some(id => id == user.id)) {
                        try {
                            await api.removeUserFromGroup(user.id, threadID);
                            success.push(user.id);
                        } catch (e) {
                            errors.push(user.name || user.id);
                        }
                        await sleep(700);
                    }
                }

                let msg = "";
                if (success.length) msg += getLang("kickByBlock", success.length) + "\n";
                if (errors.length) msg += getLang("kickError", errors.length, errors.join("\n")) + "\n";
                if (!msg) msg = getLang("noBlock");
                
                return message.reply(msg);
            }

            return message.reply(getLang("usage"));

        } catch (error) {
            console.error("FilterUser Error:", error);
            message.reply("❌ An error occurred while processing the command");
        }
    },

    onReply: async function({ event, api, Reply, threadsData, message, getLang }) {
        try {
            const { minimum, author } = Reply;
            if (event.userID !== author) return;

            const threadID = event.threadID;
            const threadData = await threadsData.get(threadID);
            const botID = api.getCurrentUserID();

            const membersCountLess = (threadData.members || []).filter(m =>
                (m.count || 0) < minimum &&
                m.inGroup === true &&
                m.userID !== botID &&
                !threadData.adminIDs.some(id => id === m.userID)
            );

            const errors = [], success = [];
            
            for (const member of membersCountLess) {
                try {
                    await api.removeUserFromGroup(member.userID, threadID);
                    success.push(member.userID);
                } catch (e) {
                    errors.push(member.name || member.userID);
                }
                await sleep(700);
            }

            let msg = "";
            if (success.length) msg += getLang("kickByMsg", success.length, minimum) + "\n";
            if (errors.length) msg += getLang("kickError", errors.length, errors.join("\n")) + "\n";
            if (!msg) msg = getLang("noMsg", minimum);
            
            return message.reply(msg);

        } catch (error) {
            console.error("FilterUser Reply Error:", error);
        }
    }
};
