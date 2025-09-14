module.exports.config = {
    name: "listbox",
    aliases: ["grouplist", "botgroups"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 15,
    role: 2,
    category: "system",
    shortDescription: {
        en: "𝐵𝑜𝑡'𝑠 𝑔𝑟𝑜𝑢𝑝 𝑙𝑖𝑠𝑡 𝑚𝑎𝑛𝑎𝑔𝑒𝑚𝑒𝑛𝑡"
    },
    longDescription: {
        en: "𝑆ℎ𝑜𝑤𝑠 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝𝑠 𝑤ℎ𝑒𝑟𝑒 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑖𝑠 𝑝𝑟𝑒𝑠𝑒𝑛𝑡 𝑎𝑛𝑑 𝑎𝑙𝑙𝑜𝑤𝑠 𝑚𝑎𝑛𝑎𝑔𝑒𝑚𝑒𝑛𝑡"
    },
    guide: {
        en: "{p}listbox"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.onReply = async function({ api, event, handleReply, threadsData }) {
    if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;
    
    const args = event.body.split(" ");
    const command = args[0].toLowerCase();
    const groupIndex = parseInt(args[1]) - 1;
    const groupId = handleReply.groupIds[groupIndex];

    if (isNaN(groupIndex) || groupIndex < 0 || !handleReply.groupIds[groupIndex]) {
        return api.sendMessage("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑠𝑒𝑙𝑒𝑐𝑡𝑖𝑜𝑛!", event.threadID, event.messageID);
    }

    switch (command) {
        case "ban":
            const data = (await threadsData.get(groupId)).data || {};
            data.banned = 1;
            await threadsData.set(groupId, { data });
            global.data.threadBanned.set(parseInt(groupId), 1);
            api.sendMessage(`🔨 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑏𝑎𝑛𝑛𝑒𝑑 𝑔𝑟𝑜𝑢𝑝:\n${handleReply.groupNames[groupIndex]}\n(𝐼𝐷: ${groupId})`, event.threadID);
            break;

        case "out":
            api.removeUserFromGroup(api.getCurrentUserID(), groupId);
            api.sendMessage(`👋 𝐿𝑒𝑓𝑡 𝑔𝑟𝑜𝑢𝑝 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦:\n${handleReply.groupNames[groupIndex]}\n(𝐼𝐷: ${groupId})`, event.threadID);
            break;

        default:
            api.sendMessage("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑! 𝑈𝑠𝑒 '𝑏𝑎𝑛' 𝑜𝑟 '𝑜𝑢𝑡' 𝑓𝑜𝑙𝑙𝑜𝑤𝑒𝑑 𝑏𝑦 𝑡ℎ𝑒 𝑛𝑢𝑚𝑏𝑒𝑟.", event.threadID);
    }
};

module.exports.onStart = async function({ api, event, threadsData }) {
    try {
        const inbox = await api.getThreadList(100, null, ['INBOX']);
        const list = inbox.filter(group => group.isSubscribed && group.isGroup);
        const groupList = [];

        for (const group of list) {
            const data = await threadsData.get(group.threadID);
            groupList.push({
                id: group.threadID,
                name: group.name || "𝑈𝑛𝑛𝑎𝑚𝑒𝑑 𝐺𝑟𝑜𝑢𝑝",
                memberCount: data.participantIDs?.length || 0
            });
        }

        const sortedList = groupList.sort((a, b) => b.memberCount - a.memberCount);
        let msg = '╔═══════════════════════╗\n';
        msg += '          🤖 𝐵𝑂𝑇 𝐺𝑅𝑂𝑈𝑃 𝐿𝐼𝑆𝑇 🤖\n';
        msg += '╚═══════════════════════╝\n\n';
        
        const groupIds = [];
        const groupNames = [];
        
        sortedList.forEach((group, index) => {
            msg += `🔸 ${index + 1}. ${group.name}\n`;
            msg += `   ├─ 📍 𝐼𝐷: ${group.id}\n`;
            msg += `   └─ 👥 𝑀𝑒𝑚𝑏𝑒𝑟𝑠: ${group.memberCount}\n\n`;
            groupIds.push(group.id);
            groupNames.push(group.name);
        });

        msg += '╔═══════════════════════╗\n';
        msg += '          📝 𝐼𝑁𝑆𝑇𝑅𝑈𝐶𝑇𝐼𝑂𝑁𝑆 \n';
        msg += '╚═══════════════════════╝\n\n';
        msg += '• 𝑇𝑜 𝑏𝑎𝑛 𝑎 𝑔𝑟𝑜𝑢𝑝: 𝑅𝑒𝑝𝑙𝑦 "𝑏𝑎𝑛 [𝑛𝑢𝑚𝑏𝑒𝑟]"\n';
        msg += '• 𝑇𝑜 𝑙𝑒𝑎𝑣𝑒 𝑎 𝑔𝑟𝑜𝑢𝑝: 𝑅𝑒𝑝𝑙𝑦 "𝑜𝑢𝑡 [𝑛𝑢𝑚𝑏𝑒𝑟]"\n\n';
        msg += '📌 𝐸𝑥𝑎𝑚𝑝𝑙𝑒:\n';
        msg += '   𝑏𝑎𝑛 2 → 𝐵𝑎𝑛𝑠 𝑔𝑟𝑜𝑢𝑝 #2\n';
        msg += '   𝑜𝑢𝑡 3 → 𝐿𝑒𝑎𝑣𝑒𝑠 𝑔𝑟𝑜𝑢𝑝 #3';

        api.sendMessage(msg, event.threadID, (error, info) => {
            if (!error) {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    groupIds: groupIds,
                    groupNames: groupNames
                });
            }
        });
    } catch (error) {
        console.error(error);
        api.sendMessage("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑔𝑟𝑜𝑢𝑝 𝑙𝑖𝑠𝑡!", event.threadID);
    }
};
