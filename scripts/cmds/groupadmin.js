module.exports.config = {
    name: "listadmin",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑮𝒓𝒐𝒖𝒑 𝒂𝒅𝒎𝒊𝒏𝒊𝒔𝒕𝒓𝒂𝒕𝒐𝒓𝒔 𝒍𝒊𝒔𝒕",
    category: "group",
    usages: "[dsqtv]",
    cooldowns: 5,
    dependencies: {}
};

module.exports.run = async function({ api, event }) {
    try {
        const threadInfo = await api.getThreadInfo(event.threadID);
        if (!threadInfo.adminIDs || threadInfo.adminIDs.length === 0) {
            return api.sendMessage("❌ 𝑵𝒐 𝒂𝒅𝒎𝒊𝒏𝒊𝒔𝒕𝒓𝒂𝒕𝒐𝒓𝒔 𝒇𝒐𝒖𝒏𝒅 𝒊𝒏 𝒕𝒉𝒊𝒔 𝒈𝒓𝒐𝒖𝒑", event.threadID);
        }

        const adminIDs = threadInfo.adminIDs;
        const adminNames = [];
        
        for (const admin of adminIDs) {
            const userInfo = await api.getUserInfo(admin.id);
            adminNames.push(userInfo[admin.id].name);
        }

        adminNames.sort((a, b) => a.localeCompare(b));
        
        let listMessage = `🌟 𝑮𝒓𝒐𝒖𝒑 𝑨𝒅𝒎𝒊𝒏𝒊𝒔𝒕𝒓𝒂𝒕𝒐𝒓𝒔 𝑳𝒊𝒔𝒕 (${adminNames.length}) 🌟\n\n`;
        
        adminNames.forEach((name, index) => {
            listMessage += `🌸 ${index + 1}. ${name}\n`;
        });

        listMessage += `\n💫 𝑻𝒐𝒕𝒂𝒍 ${adminNames.length} 𝒂𝒅𝒎𝒊𝒏𝒊𝒔𝒕𝒓𝒂𝒕𝒐𝒓𝒔 𝒊𝒏 𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑`;

        api.sendMessage(listMessage, event.threadID, event.messageID);

    } catch (error) {
        console.error(error);
        api.sendMessage(
            "❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒇𝒆𝒕𝒄𝒉𝒊𝒏𝒈 𝒂𝒅𝒎𝒊𝒏 𝒍𝒊𝒔𝒕. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.",
            event.threadID,
            event.messageID
        );
    }
};
