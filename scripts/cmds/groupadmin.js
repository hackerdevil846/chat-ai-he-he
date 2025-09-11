module.exports.config = {
    name: "listadmin",
    aliases: ["admins", "adminlist"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "group",
    shortDescription: {
        en: "𝐺𝑟𝑜𝑢𝑝 𝑎𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑡𝑜𝑟𝑠 𝑙𝑖𝑠𝑡"
    },
    longDescription: {
        en: "𝑆ℎ𝑜𝑤𝑠 𝑎𝑙𝑙 𝑎𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑡𝑜𝑟𝑠 𝑖𝑛 𝑡ℎ𝑒 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑔𝑟𝑜𝑢𝑝"
    },
    guide: {
        en: "{p}listadmin"
    },
    dependencies: {}
};

module.exports.onStart = async function({ message, event, api }) {
    try {
        const threadInfo = await api.getThreadInfo(event.threadID);
        
        if (!threadInfo.adminIDs || threadInfo.adminIDs.length === 0) {
            return message.reply("❌ 𝑁𝑜 𝑎𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑡𝑜𝑟𝑠 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝");
        }

        const adminIDs = threadInfo.adminIDs;
        const adminNames = [];
        
        for (const admin of adminIDs) {
            try {
                const userInfo = await api.getUserInfo(admin.id);
                if (userInfo[admin.id]) {
                    adminNames.push(userInfo[admin.id].name);
                }
            } catch (error) {
                console.error(`𝐸𝑟𝑟𝑜𝑟 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑢𝑠𝑒𝑟 ${admin.id}:`, error);
                adminNames.push(`𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟 (${admin.id})`);
            }
        }

        adminNames.sort((a, b) => a.localeCompare(b));
        
        let listMessage = `🌟 𝐺𝑟𝑜𝑢𝑝 𝐴𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑡𝑜𝑟𝑠 𝐿𝑖𝑠𝑡 (${adminNames.length}) 🌟\n\n`;
        
        adminNames.forEach((name, index) => {
            listMessage += `🌸 ${index + 1}. ${name}\n`;
        });

        listMessage += `\n💫 𝑇𝑜𝑡𝑎𝑙 ${adminNames.length} 𝑎𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑡𝑜𝑟𝑠 𝑖𝑛 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝`;

        await message.reply(listMessage);

    } catch (error) {
        console.error("𝐿𝑖𝑠𝑡𝐴𝑑𝑚𝑖𝑛 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply(
            "❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑎𝑑𝑚𝑖𝑛 𝑙𝑖𝑠𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟."
        );
    }
};
