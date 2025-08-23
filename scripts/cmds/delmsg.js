module.exports.config = {
	name: "delmsg",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🧹 𝐃𝐞𝐥𝐞𝐭𝐞 𝐚𝐥𝐥 𝐦𝐞𝐬𝐬𝐚𝐠𝐞𝐬 𝐨𝐫 𝐠𝐫𝐨𝐮𝐩 𝐦𝐞𝐬𝐬𝐚𝐠𝐞𝐬",
	category: "🛡️ 𝐒𝐲𝐬𝐭𝐞𝐦",
	usages: "[thread/all]",
	cooldowns: 0
};

module.exports.run = async function({ api, event, args }) {
    try {
        if (args[0] == "all") {
            const threadList = await api.getThreadList(1000, null, ["INBOX"]);
            for (const item of threadList) {
                if (item.threadID !== event.threadID) {
                    await api.deleteThread(item.threadID);
                }
            }
            api.sendMessage("✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐝𝐞𝐥𝐞𝐭𝐞𝐝 𝐚𝐥𝐥 𝐦𝐞𝐬𝐬𝐚𝐠𝐞𝐬!", event.threadID);
        } else {
            const threadList = await api.getThreadList(1000, null, ["INBOX"]);
            for (const item of threadList) {
                if (item.isGroup && item.threadID !== event.threadID) {
                    await api.deleteThread(item.threadID);
                }
            }
            api.sendMessage("✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐝𝐞𝐥𝐞𝐭𝐞𝐝 𝐚𝐥𝐥 𝐠𝐫𝐨𝐮𝐩 𝐦𝐞𝐬𝐬𝐚𝐠𝐞𝐬!", event.threadID);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐝𝐞𝐥𝐞𝐭𝐢𝐧𝐠 𝐦𝐞𝐬𝐬𝐚𝐠𝐞𝐬.", event.threadID);
    }
};
