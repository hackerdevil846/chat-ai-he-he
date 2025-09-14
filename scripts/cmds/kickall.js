module.exports.config = {
    name: "kickall",
    aliases: ["removeall", "masskick"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 3,
    role: 2,
    category: "group",
    shortDescription: {
        en: "𝐾𝑖𝑐𝑘 𝑜𝑢𝑡 𝑎𝑙𝑙 𝑛𝑜𝑛-𝑎𝑑𝑚𝑖𝑛 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑖𝑛𝑠𝑖𝑑𝑒 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝 🚫👥"
    },
    longDescription: {
        en: "𝑅𝑒𝑚𝑜𝑣𝑒𝑠 𝑎𝑙𝑙 𝑛𝑜𝑛-𝑎𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑡𝑜𝑟 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑔𝑟𝑜𝑢𝑝"
    },
    guide: {
        en: "{p}kickall"
    },
    dependencies: {}
};

module.exports.languages = {
    "en": {
        "groupOnly": "❌ 𝑇ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑐𝑎𝑛 𝑜𝑛𝑙𝑦 𝑏𝑒 𝑢𝑠𝑒𝑑 𝑖𝑛 𝑔𝑟𝑜𝑢𝑝 𝑐ℎ𝑎𝑡𝑠!",
        "noMembersToKick": "⚠️ 𝐴𝑙𝑙 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑎𝑟𝑒 𝑒𝑖𝑡ℎ𝑒𝑟 𝑎𝑑𝑚𝑖𝑛𝑠 𝑜𝑟 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑖𝑡𝑠𝑒𝑙𝑓, 𝑛𝑜𝑡ℎ𝑖𝑛𝑔 𝑡𝑜 𝑘𝑖𝑐𝑘!",
        "preparingKick": (count, groupName) => `⏳ 𝑃𝑟𝑒𝑝𝑎𝑟𝑖𝑛𝑔 𝑡𝑜 𝑘𝑖𝑐𝑘 ${count} 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑓𝑟𝑜𝑚 "${groupName}". 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡...`,
        "kickCompleted": (count) => `✅ 𝐾𝑖𝑐𝑘𝑎𝑙𝑙 𝑝𝑟𝑜𝑐𝑒𝑠𝑠 𝑐𝑜𝑚𝑝𝑙𝑒𝑡𝑒𝑑. ${count} 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑤𝑒𝑟𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!`,
        "kickFailed": (userId) => `❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑘𝑖𝑐𝑘 𝑢𝑠𝑒𝑟 ${userId}. 𝐶𝑜𝑛𝑡𝑖𝑛𝑢𝑖𝑛𝑔 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑛𝑒𝑥𝑡 𝑢𝑠𝑒𝑟...`
    }
};

module.exports.onStart = async function({ message, event, api }) {
    try {
        // Check if command is used in a group
        if (!event.isGroup) {
            return message.reply(module.exports.languages.en.groupOnly);
        }

        // Fetch thread info
        const threadInfo = await api.getThreadInfo(event.threadID);
        const participantIDs = threadInfo.participantIDs;
        const adminIDs = threadInfo.adminIDs.map(admin => admin.id);

        // Get bot ID
        const botID = api.getCurrentUserID();

        // Filter users to kick (exclude bot, command sender, and admins)
        const usersToKick = participantIDs.filter(userId => {
            return userId !== botID &&
                   userId !== event.senderID &&
                   !adminIDs.includes(userId);
        });

        if (usersToKick.length === 0) {
            return message.reply(module.exports.languages.en.noMembersToKick);
        }

        // Send preparation message
        const confirmationMsg = await message.reply(
            module.exports.languages.en.preparingKick(usersToKick.length, threadInfo.threadName)
        );

        // Helper delay function
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        // Kick users one by one
        for (let i = 0; i < usersToKick.length; i++) {
            const userId = usersToKick[i];

            try {
                await delay(5000); // 5-second delay for safety
                await api.removeUserFromGroup(userId, event.threadID);
                console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑘𝑖𝑐𝑘𝑒𝑑: ${userId}`);
            } catch (error) {
                console.error(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑘𝑖𝑐𝑘 ${userId}:`, error.message);
                await message.reply(module.exports.languages.en.kickFailed(userId));
                await delay(2000); // Short delay if an error occurs
            }
        }

        // Completion message with auto-delete after 30 seconds
        await message.reply(
            module.exports.languages.en.kickCompleted(usersToKick.length),
            (error, info) => {
                if (!error) {
                    setTimeout(() => {
                        api.unsendMessage(info.messageID).catch(() => {});
                    }, 30000);
                }
            }
        );

    } catch (error) {
        console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑘𝑖𝑐𝑘𝑎𝑙𝑙 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑥𝑒𝑐𝑢𝑡𝑖𝑜𝑛:", error);
        return message.reply(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑒𝑥𝑒𝑐𝑢𝑡𝑒 𝑘𝑖𝑐𝑘𝑎𝑙𝑙 𝑐𝑜𝑚𝑚𝑎𝑛𝑑: ${error.message}`);
    }
};
