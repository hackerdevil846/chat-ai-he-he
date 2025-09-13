const sleep = (ms) => new Promise(res => setTimeout(res, ms));

module.exports.config = {
    name: "filteruser",
    aliases: ["filter", "cleanmembers"],
    version: "1.6",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 1,
    category: "group",
    shortDescription: {
        en: "𝐹𝑖𝑙𝑡𝑒𝑟 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑏𝑦 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑐𝑜𝑢𝑛𝑡 𝑜𝑟 𝑙𝑜𝑐𝑘𝑒𝑑 𝑎𝑐𝑐𝑜𝑢𝑛𝑡𝑠"
    },
    longDescription: {
        en: "𝐹𝑖𝑙𝑡𝑒𝑟 𝑎𝑛𝑑 𝑟𝑒𝑚𝑜𝑣𝑒 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑐𝑜𝑢𝑛𝑡 𝑜𝑟 𝑙𝑜𝑐𝑘𝑒𝑑 𝑎𝑐𝑐𝑜𝑢𝑛𝑡𝑠"
    },
    guide: {
        en: "{p}filteruser [<𝑛𝑢𝑚𝑏𝑒𝑟> | 𝑑𝑖𝑒]"
    },
    dependencies: {
        "moment": ""
    }
};

module.exports.languages = {
    "en": {
        "needAdmin": "⚠️ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑎𝑑𝑑 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑎𝑠 𝑎 𝑔𝑟𝑜𝑢𝑝 𝑎𝑑𝑚𝑖𝑛 𝑡𝑜 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑",
        "confirm": "⚠️ | 𝐴𝑟𝑒 𝑦𝑜𝑢 𝑠𝑢𝑟𝑒 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑑𝑒𝑙𝑒𝑡𝑒 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑤𝑖𝑡ℎ 𝑙𝑒𝑠𝑠 𝑡ℎ𝑎𝑛 %1 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠?\n𝑅𝑒𝑎𝑐𝑡 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜 𝑐𝑜𝑛𝑓𝑖𝑟𝑚",
        "kickByBlock": "✅ | 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑟𝑒𝑚𝑜𝑣𝑒𝑑 %1 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑤𝑖𝑡ℎ 𝑙𝑜𝑐𝑘𝑒𝑑 𝑎𝑐𝑐𝑜𝑢𝑛𝑡𝑠 🔒",
        "kickByMsg": "✅ | 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑟𝑒𝑚𝑜𝑣𝑒𝑑 %1 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑤𝑖𝑡ℎ 𝑙𝑒𝑠𝑠 𝑡ℎ𝑎𝑛 %2 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 📊",
        "kickError": "❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑟𝑒𝑚𝑜𝑣𝑒 %1 𝑚𝑒𝑚𝑏𝑒𝑟𝑠:\n%2",
        "noBlock": "✅ | 𝑁𝑜 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑤𝑖𝑡ℎ 𝑙𝑜𝑐𝑘𝑒𝑑 𝑎𝑐𝑐𝑜𝑢𝑛𝑡𝑠 𝑓𝑜𝑢𝑛𝑑 🔍",
        "noMsg": "✅ | 𝑁𝑜 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑤𝑖𝑡ℎ 𝑙𝑒𝑠𝑠 𝑡ℎ𝑎𝑛 %1 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑓𝑜𝑢𝑛𝑑 📊",
        "usage": "❗️ | 𝑈𝑠𝑎𝑔𝑒: {p}filteruser [<𝑛𝑢𝑚𝑏𝑒𝑟> | 𝑑𝑖𝑒]"
    }
};

module.exports.onStart = async function({ message, event, args, threadsData, getLang }) {
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
        console.error("𝐹𝑖𝑙𝑡𝑒𝑟𝑈𝑠𝑒𝑟 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑");
    }
};

module.exports.onReply = async function({ event, api, Reply, threadsData, message, getLang }) {
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
        console.error("𝐹𝑖𝑙𝑡𝑒𝑟𝑈𝑠𝑒𝑟 𝑅𝑒𝑝𝑙𝑦 𝐸𝑟𝑟𝑜𝑟:", error);
    }
};
