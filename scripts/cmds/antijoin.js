module.exports.config = {
    name: "antijoin",
    aliases: ["antienter", "ajoin"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 1,
    category: "system",
    shortDescription: {
        en: "𝑇𝑢𝑟𝑛 𝑜𝑛/𝑜𝑓𝑓 𝑎𝑛𝑡𝑖𝑗𝑜𝑖𝑛"
    },
    longDescription: {
        en: "𝐸𝑛𝑎𝑏𝑙𝑒 𝑜𝑟 𝑑𝑖𝑠𝑎𝑏𝑙𝑒 𝑎𝑛𝑡𝑖-𝑗𝑜𝑖𝑛 𝑝𝑟𝑜𝑡𝑒𝑐𝑡𝑖𝑜𝑛 𝑓𝑜𝑟 𝑦𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝"
    },
    guide: {
        en: "{p}antijoin [on/off]"
    },
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, event, args, threadsData, api }) {
    try {
        const { threadID } = event;
        
        // Check if user provided argument
        if (!args[0]) {
            return message.reply("🛡️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑝𝑒𝑐𝑖𝑓𝑦 '𝑜𝑛' 𝑜𝑟 '𝑜𝑓𝑓':\n• {p}antijoin on - 𝐸𝑛𝑎𝑏𝑙𝑒 𝑎𝑛𝑡𝑖-𝑗𝑜𝑖𝑛\n• {p}antijoin off - 𝐷𝑖𝑠𝑎𝑏𝑙𝑒 𝑎𝑛𝑡𝑖-𝑗𝑜𝑖𝑛");
        }

        const action = args[0].toLowerCase();
        
        if (action !== 'on' && action !== 'off') {
            return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑜𝑝𝑡𝑖𝑜𝑛. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒 '𝑜𝑛' 𝑜𝑟 '𝑜𝑓𝑓'");
        }

        // Get thread info to check admin status
        const threadInfo = await api.getThreadInfo(threadID);
        const botID = api.getCurrentUserID();
        
        // Check if bot is admin
        if (!threadInfo.adminIDs.some(admin => admin.id === botID)) {
            return message.reply("❌ 𝐵𝑜𝑡 𝑛𝑒𝑒𝑑𝑠 𝑎𝑑𝑚𝑖𝑛 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛𝑠 𝑡𝑜 𝑚𝑎𝑛𝑎𝑔𝑒 𝑎𝑛𝑡𝑖-𝑗𝑜𝑖𝑛 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠");
        }

        // Get current thread data
        const threadData = await threadsData.get(threadID) || {};
        const currentStatus = threadData.antijoin || false;
        
        // Update the setting
        threadData.antijoin = action === 'on';
        
        // Save the updated data
        await threadsData.set(threadID, threadData);
        
        // Update global cache if it exists
        if (global.data.threadData) {
            global.data.threadData.set(parseInt(threadID), threadData);
        }

        return message.reply(
            `🛡️ 𝐴𝑁𝑇𝐼-𝐽𝑂𝐼𝑁 𝑆𝑇𝐴𝑇𝑈𝑆\n\n` +
            `✅ ${action === 'on' ? '𝐸𝑁𝐴𝐵𝐿𝐸𝐷' : '𝐷𝐼𝑆𝐴𝐵𝐿𝐸𝐷'}\n\n` +
            `𝐴𝑛𝑡𝑖-𝑗𝑜𝑖𝑛 𝑝𝑟𝑜𝑡𝑒𝑐𝑡𝑖𝑜𝑛 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 ${action === 'on' ? '𝑒𝑛𝑎𝑏𝑙𝑒𝑑' : '𝑑𝑖𝑠𝑎𝑏𝑙𝑒𝑑'} 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝.`
        );

    } catch (error) {
        console.error("Antijoin command error:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
