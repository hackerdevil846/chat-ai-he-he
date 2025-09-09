module.exports.config = {
    name: "allgroups",
    aliases: ["groups", "grouplist"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "admin",
    shortDescription: {
        en: "𝐿𝑖𝑠𝑡 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝𝑠 𝑎𝑛𝑑 𝑚𝑎𝑛𝑎𝑔𝑒 𝑔𝑟𝑜𝑢𝑝 𝑎𝑐𝑡𝑖𝑜𝑛𝑠"
    },
    longDescription: {
        en: "𝐿𝑖𝑠𝑡 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝𝑠 𝑎𝑛𝑑 𝑎𝑙𝑙𝑜𝑤 𝑏𝑎𝑛𝑛𝑖𝑛𝑔 𝑜𝑟 𝑙𝑒𝑎𝑣𝑖𝑛𝑔 𝑔𝑟𝑜𝑢𝑝𝑠"
    },
    guide: {
        en: "{p}allgroups"
    }
};

module.exports.onStart = async function({ api, event, threadsData }) {
    try {
        // Get list of groups
        var inbox = await api.getThreadList(100, null, ['INBOX']);
        let list = [...inbox].filter(group => group.isSubscribed && group.isGroup);

        // Get detailed info for each group
        var listthread = [];
        for (var groupInfo of list) {
            let data = await api.getThreadInfo(groupInfo.threadID);
            listthread.push({
                id: groupInfo.threadID,
                name: groupInfo.name,
                sotv: data.userInfo.length,
            });
        }

        // Sort groups by member count (descending)
        var listbox = listthread.sort((a, b) => {
            if (a.sotv > b.sotv) return -1;
            if (a.sotv < b.sotv) return 1;
            return 0;
        });

        // Format the message with group info
        let msg = '𝐿𝑖𝑠𝑡 𝑜𝑓 𝑔𝑟𝑜𝑢𝑝𝑠 𝑦𝑜𝑢 𝑎𝑟𝑒 𝑖𝑛:\n\n';
        let i = 1;
        var groupid = [];
        for (var group of listbox) {
            msg += `${i++}. ${group.name}\n𝐺𝑟𝑜𝑢𝑝 𝐼𝐷: ${group.id}\n𝑀𝑒𝑚𝑏𝑒𝑟𝑠: ${group.sotv}\n\n`;
            groupid.push(group.id);
        }

        // Add instructions
        msg += '𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ "𝑏𝑎𝑛 [𝑛𝑢𝑚𝑏𝑒𝑟]" 𝑡𝑜 𝑏𝑎𝑛 𝑎 𝑔𝑟𝑜𝑢𝑝 𝑜𝑟 "𝑜𝑢𝑡 [𝑛𝑢𝑚𝑏𝑒𝑟]" 𝑡𝑜 𝑙𝑒𝑎𝑣𝑒 𝑎 𝑔𝑟𝑜𝑢𝑝.\n';
        msg += '𝑈𝑠𝑒 "𝑎𝑙𝑙" 𝑖𝑛𝑠𝑡𝑒𝑎𝑑 𝑜𝑓 𝑎 𝑛𝑢𝑚𝑏𝑒𝑟 𝑡𝑜 𝑎𝑝𝑝𝑙𝑦 𝑡𝑜 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝𝑠.\n';
        msg += '𝐸𝑥𝑎𝑚𝑝𝑙𝑒: "𝑏𝑎𝑛 3" 𝑡𝑜 𝑏𝑎𝑛 𝑡ℎ𝑒 3𝑟𝑑 𝑔𝑟𝑜𝑢𝑝 𝑖𝑛 𝑡ℎ𝑒 𝑙𝑖𝑠𝑡.\n';
        msg += '𝑂𝑟 "𝑜𝑢𝑡 𝑎𝑙𝑙" 𝑡𝑜 𝑙𝑒𝑎𝑣𝑒 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝𝑠.';

        // Send the message and set up reply handler
        await api.sendMessage(
            msg,
            event.threadID,
            (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    groupid: groupid
                });
            },
            event.messageID
        );

    } catch (error) {
        console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑎𝑙𝑙𝑔𝑟𝑜𝑢𝑝𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:", error);
        await api.sendMessage("𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑔𝑟𝑜𝑢𝑝 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛.", event.threadID, event.messageID);
    }
};

module.exports.onReply = async function({ api, event, Reply, threadsData }) {
    try {
        if (parseInt(event.senderID) !== parseInt(Reply.author)) return;

        const commandArgs = event.body.split(" ");
        const action = commandArgs[0].toLowerCase();
        const target = commandArgs[1];

        if (!['ban', 'out'].includes(action)) {
            return api.sendMessage(
                '𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒 𝑒𝑖𝑡ℎ𝑒𝑟 "𝑏𝑎𝑛 [𝑛𝑢𝑚𝑏𝑒𝑟|𝑎𝑙𝑙]" 𝑜𝑟 "𝑜𝑢𝑡 [𝑛𝑢𝑚𝑏𝑒𝑟|𝑎𝑙𝑙]"',
                event.threadID,
                event.messageID
            );
        }

        // Handle "all" case
        if (target === 'all') {
            let successCount = 0;
            let failCount = 0;
            
            for (const idgr of Reply.groupid) {
                try {
                    if (action === 'ban') {
                        const data = (await threadsData.get(idgr)).data || {};
                        data.banned = true;
                        await threadsData.set(idgr, { data });
                        if (global.data && global.data.threadBanned) {
                            global.data.threadBanned.set(parseInt(idgr), 1);
                        }
                        successCount++;
                    } else if (action === 'out') {
                        await api.removeUserFromGroup(api.getCurrentUserID(), idgr);
                        successCount++;
                    }
                } catch (e) {
                    console.error(`𝐸𝑟𝑟𝑜𝑟 ${action}𝑖𝑛𝑔 𝑔𝑟𝑜𝑢𝑝 ${idgr}:`, e);
                    failCount++;
                }
            }
            
            return api.sendMessage(
                `𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 ${action === 'ban' ? '𝑏𝑎𝑛𝑛𝑒𝑑' : '𝑙𝑒𝑓𝑡'} ${successCount} 𝑔𝑟𝑜𝑢𝑝𝑠.${failCount > 0 ? ` 𝐹𝑎𝑖𝑙𝑒𝑑: ${failCount}` : ''}`,
                event.threadID,
                event.messageID
            );
        }

        // Handle specific group case
        const groupNumber = parseInt(target);
        if (isNaN(groupNumber) || groupNumber < 1 || groupNumber > Reply.groupid.length) {
            return api.sendMessage(
                `𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑔𝑟𝑜𝑢𝑝 𝑛𝑢𝑚𝑏𝑒𝑟 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 1 𝑎𝑛𝑑 ${Reply.groupid.length}`,
                event.threadID,
                event.messageID
            );
        }

        const idgr = Reply.groupid[groupNumber - 1];

        try {
            if (action === 'ban') {
                const data = (await threadsData.get(idgr)).data || {};
                data.banned = true;
                await threadsData.set(idgr, { data });
                if (global.data && global.data.threadBanned) {
                    global.data.threadBanned.set(parseInt(idgr), 1);
                }
                return api.sendMessage(
                    `𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑏𝑎𝑛𝑛𝑒𝑑 𝑔𝑟𝑜𝑢𝑝: ${idgr}`,
                    event.threadID,
                    event.messageID
                );
            } else if (action === 'out') {
                await api.removeUserFromGroup(api.getCurrentUserID(), idgr);
                const groupData = await threadsData.get(idgr);
                return api.sendMessage(
                    `𝐿𝑒𝑓𝑡 𝑔𝑟𝑜𝑢𝑝: ${groupData.name || '𝑈𝑛𝑘𝑛𝑜𝑤𝑛'}\n(𝐺𝑟𝑜𝑢𝑝 𝐼𝐷: ${idgr})`,
                    event.threadID,
                    event.messageID
                );
            }
        } catch (error) {
            console.error(`𝐸𝑟𝑟𝑜𝑟 ${action}𝑖𝑛𝑔 𝑔𝑟𝑜𝑢𝑝 ${idgr}:`, error);
            return api.sendMessage(
                `𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 ${action} 𝑔𝑟𝑜𝑢𝑝 ${idgr}: ${error.message}`,
                event.threadID,
                event.messageID
            );
        }
    } catch (error) {
        console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑎𝑙𝑙𝑔𝑟𝑜𝑢𝑝𝑠 𝑟𝑒𝑝𝑙𝑦 ℎ𝑎𝑛𝑑𝑙𝑒𝑟:", error);
        api.sendMessage(
            "𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡.",
            event.threadID,
            event.messageID
        );
    }
};
