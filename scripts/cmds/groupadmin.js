module.exports.config = {
    name: "listadmin",
    version: '1.0.0',
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑮𝒓𝒐𝒖𝒑 𝒆𝒓 𝒂𝒅𝒎𝒊𝒏 𝒅𝒆𝒓 𝒍𝒊𝒔𝒕",
    commandCategory: "𝑩𝒐𝒙 𝑪𝒉𝒂𝒕",
    usages: "𝒅𝒔𝒒𝒕𝒗",
    cooldowns: 5,
    dependencies: []
};

module.exports.run = async function({ api, event }) {
    try {
        const threadInfo = await api.getThreadInfo(event.threadID);
        const qtv = threadInfo.adminIDs.length;
        let listad = '';
        
        // Sort admins by name
        const adminInfo = await Promise.all(
            threadInfo.adminIDs.map(async admin => {
                const userInfo = await api.getUserInfo(admin.id);
                return { id: admin.id, name: userInfo[admin.id].name };
            })
        );
        
        adminInfo.sort((a, b) => a.name.localeCompare(b.name));
        
        // Create admin list with beautiful numbering
        adminInfo.forEach((admin, index) => {
            listad += `🌸 ${index + 1}. ${admin.name}\n`;
        });

        api.sendMessage(
            `📋 𝑮𝒓𝒐𝒖𝒑 𝑨𝒅𝒎𝒊𝒏 𝑳𝒊𝒔𝒕 (${qtv}):\n\n${listad}`,
            event.threadID,
            event.messageID
        );
    } catch (error) {
        console.error(error);
        api.sendMessage(
            "❌ 𝑳𝒊𝒔𝒕 𝒑𝒂𝒕𝒉𝒂𝒏𝒐𝒓 𝒌𝒉𝒂𝒕𝒆 𝒉𝒐𝒄𝒄𝒉𝒆! 𝑨𝒃𝒂𝒓 𝒄𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏",
            event.threadID,
            event.messageID
        );
    }
};
