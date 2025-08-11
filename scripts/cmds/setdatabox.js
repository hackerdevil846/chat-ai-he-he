module.exports.config = {
    name: "setdatabox",
    version: "1.1",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑺𝒆𝒕 𝒏𝒆𝒘 𝒅𝒂𝒕𝒂 𝒐𝒇 𝒃𝒐𝒙𝒆𝒔 𝒊𝒏𝒕𝒐 𝒅𝒂𝒕𝒂𝒃𝒂𝒔𝒆",
    commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
    usages: "",
    cooldowns: 5,
};

module.exports.run = async function ({ event, api, Threads }) {
    const { threadID } = event;
    
    try {
        const inbox = await api.getThreadList(100, null, ['INBOX']);
        const list = inbox.filter(group => group.isSubscribed && group.isGroup);
        const totalGroups = list.length;
        
        if (totalGroups === 0) {
            return api.sendMessage("❌ 𝑵𝒐 𝒈𝒓𝒐𝒖𝒑 𝒃𝒐𝒙𝒆𝒔 𝒇𝒐𝒖𝒏𝒅 𝒊𝒏 𝒚𝒐𝒖𝒓 𝑰𝑵𝑩𝑶𝑿", threadID);
        }

        let successCount = 0;
        let failedCount = 0;
        const failedBoxes = [];

        for (const group of list) {
            try {
                const threadInfo = await api.getThreadInfo(group.threadID);
                await Threads.setData(group.threadID, { threadInfo });
                successCount++;
            } catch (error) {
                failedCount++;
                failedBoxes.push(group.threadID);
                console.error(`❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒖𝒑𝒅𝒂𝒕𝒆 𝒃𝒐𝒙 𝑰𝑫: ${group.threadID}`, error);
            }
        }

        const resultMessage = `✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒖𝒑𝒅𝒂𝒕𝒆𝒅 ${successCount}/${totalGroups} 𝒈𝒓𝒐𝒖𝒑 𝒃𝒐𝒙𝒆𝒔`;
        console.log(resultMessage);
        
        if (failedCount > 0) {
            api.sendMessage(`${resultMessage}\n❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒖𝒑𝒅𝒂𝒕𝒆 ${failedCount} 𝒃𝒐𝒙𝒆𝒔:\n${failedBoxes.join('\n')}`, threadID);
        } else {
            api.sendMessage(resultMessage, threadID);
        }
        
    } catch (error) {
        console.error("❌ 𝑪𝒓𝒊𝒕𝒊𝒄𝒂𝒍 𝑬𝑹𝑹𝑶𝑹:", error);
        api.sendMessage("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒃𝒐𝒙𝒆𝒔", threadID);
    }
};
