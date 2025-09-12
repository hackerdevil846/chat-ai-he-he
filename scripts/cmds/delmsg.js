module.exports.config = {
    name: "delmsg",
    aliases: ["clearchat", "deleteall"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 0,
    role: 2,
    category: "system",
    shortDescription: {
        en: "𝐷𝑒𝑙𝑒𝑡𝑒 𝑎𝑙𝑙 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑜𝑟 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠"
    },
    longDescription: {
        en: "𝐷𝑒𝑙𝑒𝑡𝑒 𝑎𝑙𝑙 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑖𝑛 𝑖𝑛𝑏𝑜𝑥 𝑜𝑟 𝑔𝑟𝑜𝑢𝑝 𝑐ℎ𝑎𝑡𝑠"
    },
    guide: {
        en: "{p}delmsg [𝑡ℎ𝑟𝑒𝑎𝑑/𝑎𝑙𝑙]"
    }
};

module.exports.onStart = async function({ message, args, api, event }) {
    try {
        if (args[0] == "all") {
            const threadList = await api.getThreadList(1000, null, ["INBOX"]);
            let deletedCount = 0;
            
            for (const item of threadList) {
                if (item.threadID !== event.threadID) {
                    try {
                        await api.deleteThread(item.threadID);
                        deletedCount++;
                    } catch (error) {
                        console.error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑒𝑙𝑒𝑡𝑒 𝑡ℎ𝑟𝑒𝑎𝑑 ${item.threadID}:`, error);
                    }
                }
            }
            message.reply(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑑𝑒𝑙𝑒𝑡𝑒𝑑 ${deletedCount} 𝑡ℎ𝑟𝑒𝑎𝑑𝑠!`);
        } else {
            const threadList = await api.getThreadList(1000, null, ["INBOX"]);
            let deletedCount = 0;
            
            for (const item of threadList) {
                if (item.isGroup && item.threadID !== event.threadID) {
                    try {
                        await api.deleteThread(item.threadID);
                        deletedCount++;
                    } catch (error) {
                        console.error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑒𝑙𝑒𝑡𝑒 𝑔𝑟𝑜𝑢𝑝 ${item.threadID}:`, error);
                    }
                }
            }
            message.reply(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑑𝑒𝑙𝑒𝑡𝑒𝑑 ${deletedCount} 𝑔𝑟𝑜𝑢𝑝 𝑡ℎ𝑟𝑒𝑎𝑑𝑠!`);
        }
    } catch (error) {
        console.error("𝐷𝑒𝑙𝑒𝑡𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑒𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑑𝑒𝑙𝑒𝑡𝑖𝑛𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠.");
    }
};
