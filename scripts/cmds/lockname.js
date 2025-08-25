const OWNER_UID = "61571630409265";

module.exports.config = {
	name: "lockname",
	version: "1.0.1",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🔒 𝐆𝐫𝐨𝐮𝐩 𝐍𝐚𝐦𝐞 𝐋𝐨𝐜𝐤 𝐒𝐲𝐬𝐭𝐞𝐦",
	category: "group",
	usages: "lockname [lock/unlock/reset] [name]",
	cooldowns: 3,
	envConfig: {
		autoUnlock: false
	}
};

const lockedGroups = new Map();

module.exports.onLoad = function() {
    console.log('🔒 Lockname Module Loaded Successfully');
}

module.exports.handleEvent = async function({ event, api }) {
    if (event.type === "event" && event.logMessageType === "log:thread-name") {
        const { threadID, logMessageData } = event;
        if (lockedGroups.has(threadID)) {
            const lockedName = lockedGroups.get(threadID);
            if (logMessageData.name !== lockedName) {
                await api.setTitle(lockedName, threadID);
                api.sendMessage(
                    `⚠️ 𝗡𝗮𝗺𝗲 𝗔𝘂𝘁𝗼-𝗥𝗲𝘀𝗲𝘁!\n𝐆𝐫𝐨𝐮𝐩 𝐧𝐚𝐦𝐞 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐫𝐞𝐬𝐞𝐭 𝐭𝐨: ${lockedName}`,
                    threadID
                );
            }
        }
    }
}

module.exports.onStart = async function({ api, event, args }) {
    const { threadID, senderID } = event;
    
    if (senderID !== OWNER_UID) {
        return api.sendMessage("⛔ 𝗔𝗰𝗰𝗲𝘀𝘀 𝗗𝗲𝗻𝗶𝗲𝗱!\n𝗢𝗻𝗹𝘆 𝗯𝗼𝘁 𝗼𝘄𝗻𝗲𝗿 𝗰𝗮𝗻 𝘂𝘀𝗲 𝘁𝗵𝗶𝘀 𝗰𝗼𝗺𝗺𝗮𝗻𝗱!", threadID);
    }

    const action = args[0]?.toLowerCase();
    const name = args.slice(1).join(" ");

    if (!action) {
        return api.sendMessage(
            "🔧 𝗨𝘀𝗮𝗴𝗲 𝗚𝘂𝗶𝗱𝗲:\n" +
            "• lockname lock [name]\n" +
            "• lockname unlock\n" +
            "• lockname reset",
            threadID
        );
    }

    switch (action) {
        case "lock":
            if (!name) return api.sendMessage("📛 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝗴𝗿𝗼𝘂𝗽 𝗻𝗮𝗺𝗲 𝘁𝗼 𝗹𝗼𝗰𝗸!", threadID);
            
            lockedGroups.set(threadID, name);
            await api.setTitle(name, threadID);
            api.sendMessage(
                `✅ 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗟𝗼𝗰𝗸𝗲𝗱\n𝐆𝐫𝐨𝐮𝐩 𝐧𝐚𝐦𝐞 𝐥𝐨𝐜𝐤𝐞𝐝 𝐚𝐬: ${name}`,
                threadID
            );
            break;

        case "unlock":
            if (!lockedGroups.has(threadID)) {
                return api.sendMessage("🔓 𝗔𝗹𝗿𝗲𝗮𝗱𝘆 𝗨𝗻𝗹𝗼𝗰𝗸𝗲𝗱!\n𝐆𝐫𝐨𝐮𝐩 𝐧𝐚𝐦𝐞 𝐢𝐬 𝐧𝐨𝐭 𝐥𝐨𝐜𝐤𝐞𝐝.", threadID);
            }
            
            lockedGroups.delete(threadID);
            api.sendMessage(
                "✅ 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗨𝗻𝗹𝗼𝗰𝗸𝗲𝗱\n𝐆𝐫𝐨𝐮𝐩 𝐧𝐚𝐦𝐞 𝐥𝐨𝐜𝐤 𝐫𝐞𝐦𝐨𝐯𝐞𝐝.",
                threadID
            );
            break;

        case "reset":
            if (!lockedGroups.has(threadID)) {
                return api.sendMessage("⚠️ 𝗡𝗼 𝗟𝗼𝗰𝗸 𝗙𝗼𝘂𝗻𝗱!\n𝐍𝐨 𝐥𝐨𝐜𝐤𝐞𝗱 𝐧𝐚𝗺𝐞 𝐟𝐨𝐮𝗻𝗱 𝐟𝐨𝗿 𝐭𝐡𝐢𝐬 𝐠𝐫𝐨𝐮𝐩.", threadID);
            }
            
            const lockedName = lockedGroups.get(threadID);
            await api.setTitle(lockedName, threadID);
            api.sendMessage(
                `🔁 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗥𝗲𝘀𝗲𝘁\n𝐆𝐫𝐨𝐮𝐩 𝐧𝐚𝐦𝐞 𝐫𝐞𝐬𝐞𝐭 𝐭𝐨: ${lockedName}`,
                threadID
            );
            break;

        default:
            api.sendMessage(
                "❌ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗔𝗰𝘁𝗶𝗼𝗻!\n𝐔𝐬𝐞: lockname [lock/unlock/reset]",
                threadID
            );
    }
};
