module.exports.config = {
    name: "delthread",
    aliases: ["clearthreads", "deletegroups"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "system",
    shortDescription: {
        en: "🧹 𝐷𝑒𝑙𝑒𝑡𝑒𝑠 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝 𝑡ℎ𝑟𝑒𝑎𝑑𝑠 𝑒𝑥𝑐𝑒𝑝𝑡 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑜𝑛𝑒"
    },
    longDescription: {
        en: "𝐷𝑒𝑙𝑒𝑡𝑒𝑠 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝 𝑐𝑜𝑛𝑣𝑒𝑟𝑠𝑎𝑡𝑖𝑜𝑛𝑠 𝑒𝑥𝑐𝑒𝑝𝑡 𝑡ℎ𝑒 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑎𝑐𝑡𝑖𝑣𝑒 𝑜𝑛𝑒"
    },
    guide: {
        en: "{p}delthread"
    },
    envConfig: {
        allowBlockedThreads: false
    }
};

module.exports.onStart = async function({ message, event, api }) {
    try {
        const threadList = await api.getThreadList(100, null, ["INBOX"]);
        const currentThread = event.threadID;
        
        const deletionPromises = threadList.map(thread => {
            if (thread.isGroup && thread.threadID !== currentThread) {
                return api.deleteThread(thread.threadID);
            }
        });

        await Promise.all(deletionPromises);
        
        message.reply(`✅ | 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑑𝑒𝑙𝑒𝑡𝑒𝑑 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝 𝑡ℎ𝑟𝑒𝑎𝑑𝑠!\n╰┄➤ 𝐸𝑥𝑐𝑙𝑢𝑑𝑒𝑑 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑡ℎ𝑟𝑒𝑎𝑑: ${currentThread}`);
        
    } catch (error) {
        console.error("❌ | 𝐷𝑒𝑙𝑒𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ | 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑑𝑒𝑙𝑒𝑡𝑖𝑛𝑔 𝑡ℎ𝑟𝑒𝑎𝑑𝑠");
    }
};
