module.exports.config = {
    name: "antirobbery",
    aliases: ["antirob", "guard"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 1,
    category: "admin",
    shortDescription: {
        en: "𝑃𝑟𝑒𝑣𝑒𝑛𝑡 𝑐ℎ𝑎𝑛𝑔𝑖𝑛𝑔 𝑔𝑟𝑜𝑢𝑝 𝑎𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑡𝑜𝑟𝑠"
    },
    longDescription: {
        en: "𝑃𝑟𝑜𝑡𝑒𝑐𝑡 𝑔𝑟𝑜𝑢𝑝 𝑓𝑟𝑜𝑚 𝑢𝑛𝑎𝑢𝑡ℎ𝑜𝑟𝑖𝑧𝑒𝑑 𝑎𝑑𝑚𝑖𝑛 𝑐ℎ𝑎𝑛𝑔𝑒𝑠"
    },
    guide: {
        en: "{p}antirobbery"
    }
};

module.exports.onStart = async function({ message, event, threadsData, api }) {
    try {
        const info = await api.getThreadInfo(event.threadID);
        
        // Check if bot is admin
        if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) {
            return message.reply(
                '❌ 𝑁𝑒𝑒𝑑 𝑔𝑟𝑜𝑢𝑝 𝑎𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑡𝑜𝑟 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛𝑠, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑎𝑑𝑑 𝑏𝑜𝑡 𝑎𝑠 𝑎𝑑𝑚𝑖𝑛 𝑎𝑛𝑑 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛!'
            );
        }
        
        const data = (await threadsData.get(event.threadID)).data || {};
        
        // Toggle the guard setting
        if (typeof data.guard == "undefined" || data.guard == false) {
            data.guard = true;
            await message.reply("✅ 𝐴𝑛𝑡𝑖-𝑅𝑜𝑏𝑏𝑒𝑟𝑦 𝑠𝑦𝑠𝑡𝑒𝑚 𝑎𝑐𝑡𝑖𝑣𝑎𝑡𝑒𝑑\n\n🛡️ 𝐺𝑟𝑜𝑢𝑝 𝑤𝑖𝑙𝑙 𝑛𝑜𝑤 𝑏𝑒 𝑝𝑟𝑜𝑡𝑒𝑐𝑡𝑒𝑑 𝑓𝑟𝑜𝑚 𝑢𝑛𝑎𝑢𝑡ℎ𝑜𝑟𝑖𝑧𝑒𝑑 𝑎𝑑𝑚𝑖𝑛 𝑐ℎ𝑎𝑛𝑔𝑒𝑠");
        } else {
            data.guard = false;
            await message.reply("✅ 𝐴𝑛𝑡𝑖-𝑅𝑜𝑏𝑏𝑒𝑟𝑦 𝑠𝑦𝑠𝑡𝑒𝑚 𝑑𝑒𝑎𝑐𝑡𝑖𝑣𝑎𝑡𝑒𝑑\n\n⚠️ 𝐺𝑟𝑜𝑢𝑝 𝑝𝑟𝑜𝑡𝑒𝑐𝑡𝑖𝑜𝑛 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑑𝑖𝑠𝑎𝑏𝑙𝑒𝑑");
        }
        
        // Save the settings
        await threadsData.set(event.threadID, { data });
        
        // Update global data if it exists
        if (global.data && global.data.threadData) {
            global.data.threadData.set(parseInt(event.threadID), { data });
        }

    } catch (error) {
        console.error("𝐴𝑛𝑡𝑖𝑟𝑜𝑏𝑏𝑒𝑟𝑦 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
