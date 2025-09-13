module.exports.config = {
    name: "flop",
    aliases: ["nuke", "cleargroup"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 1,
    role: 1,
    category: "group",
    shortDescription: {
        en: "🔄 𝑅𝑒𝑚𝑜𝑣𝑒 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑎𝑛𝑑 𝑏𝑜𝑡 𝑙𝑒𝑎𝑣𝑒𝑠 𝑔𝑟𝑜𝑢𝑝"
    },
    longDescription: {
        en: "𝑅𝑒𝑚𝑜𝑣𝑒𝑠 𝑎𝑙𝑙 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝 𝑎𝑛𝑑 𝑡ℎ𝑒𝑛 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑙𝑒𝑎𝑣𝑒𝑠"
    },
    guide: {
        en: "{p}flop"
    },
    dependencies: {}
};

module.exports.languages = {
    "en": {
        "noAdmin": "❌ 𝐵𝑜𝑡 𝑚𝑢𝑠𝑡 𝑏𝑒 𝑔𝑟𝑜𝑢𝑝 𝑎𝑑𝑚𝑖𝑛 𝑡𝑜 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑!",
        "startFlop": "🌀 𝑆𝑡𝑎𝑟𝑡𝑖𝑛𝑔 𝑔𝑟𝑜𝑢𝑝 𝑓𝑙𝑜𝑝 𝑜𝑝𝑒𝑟𝑎𝑡𝑖𝑜𝑛...",
        "success": "✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑟𝑒𝑚𝑜𝑣𝑒𝑑 𝑎𝑙𝑙 𝑚𝑒𝑚𝑏𝑒𝑟𝑠! 𝐵𝑜𝑡 𝑤𝑖𝑙𝑙 𝑛𝑜𝑤 𝑙𝑒𝑎𝑣𝑒 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝.",
        "error": "❌ 𝐸𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑙𝑜𝑝𝑖𝑛𝑔 𝑔𝑟𝑜𝑢𝑝: %1"
    }
};

module.exports.onStart = async function({ message, event, api }) {
    const { threadID, messageID } = event;

    try {
        // Fetch thread info
        const threadInfo = await api.getThreadInfo(threadID);
        const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
        const botID = api.getCurrentUserID();

        // Check if bot is admin
        if (!adminIDs.includes(botID)) {
            return message.reply(
                "❌ 𝐵𝑜𝑡 𝑚𝑢𝑠𝑡 𝑏𝑒 𝑔𝑟𝑜𝑢𝑝 𝑎𝑑𝑚𝑖𝑛 𝑡𝑜 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑!",
                threadID,
                messageID
            );
        }

        const participantIDs = threadInfo.participantIDs;

        // Notify start
        await message.reply(
            "🌀 𝑆𝑡𝑎𝑟𝑡𝑖𝑛𝑔 𝑔𝑟𝑜𝑢𝑝 𝑓𝑙𝑜𝑝 𝑜𝑝𝑒𝑟𝑎𝑡𝑖𝑜𝑛...",
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
        await message.reply(
            "✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑟𝑒𝑚𝑜𝑣𝑒𝑑 𝑎𝑙𝑙 𝑚𝑒𝑚𝑏𝑒𝑟𝑠! 𝐵𝑜𝑡 𝑤𝑖𝑙𝑙 𝑛𝑜𝑤 𝑙𝑒𝑎𝑣𝑒 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝.",
            threadID
        );

        await new Promise(resolve => setTimeout(resolve, 2000));
        await api.removeUserFromGroup(botID, threadID);

    } catch (error) {
        console.error("𝐹𝑙𝑜𝑝 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply(
            `❌ 𝐸𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑙𝑜𝑝𝑖𝑛𝑔 𝑔𝑟𝑜𝑢𝑝: ${error.message}`,
            threadID,
            messageID
        );
    }
};
