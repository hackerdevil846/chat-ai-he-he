module.exports.config = {
    name: "setdatauser",
    version: "1.1",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑺𝒆𝒕 𝒏𝒆𝒘 𝒅𝒂𝒕𝒂 𝒐𝒇 𝒖𝒔𝒆𝒓𝒔 𝒊𝒏𝒕𝒐 𝒅𝒂𝒕𝒂𝒃𝒂𝒔𝒆",
    commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
    usages: "",
    cooldowns: 5,
};

module.exports.run = async function ({ Users, event, api, Threads }) { 
    const permission = ["61571630409265"];
    if (!permission.includes(event.senderID)) {
        return api.sendMessage("❌ 𝑻𝒉𝒊𝒔 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒊𝒔 𝒓𝒆𝒔𝒕𝒓𝒊𝒄𝒕𝒆𝒅 𝒕𝒐 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 𝒐𝒏𝒍𝒚", event.threadID, event.messageID);
    }

    const { threadID } = event;
    
    try {
        const threadInfo = await Threads.getInfo(threadID) || await api.getThreadInfo(threadID);
        const participantIDs = threadInfo.participantIDs;
        
        if (!participantIDs || participantIDs.length === 0) {
            return api.sendMessage("❌ 𝑵𝒐 𝒖𝒔𝒆𝒓𝒔 𝒇𝒐𝒖𝒏𝒅 𝒊𝒏 𝒕𝒉𝒊𝒔 𝒕𝒉𝒓𝒆𝒂𝒅", threadID);
        }

        let successCount = 0;
        let failedCount = 0;
        const failedUsers = [];

        for (const id of participantIDs) {
            try {
                const userData = await api.getUserInfo(id);
                const userName = userData[id]?.name || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑼𝒔𝒆𝒓";
                await Users.setData(id, { name: userName, data: {} });
                successCount++;
            } catch (error) {
                failedCount++;
                failedUsers.push(id);
                console.error(`❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒖𝒑𝒅𝒂𝒕𝒆 𝒖𝒔𝒆𝒓 𝑰𝑫: ${id}`, error);
            }
        }

        const resultMessage = `✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒖𝒑𝒅𝒂𝒕𝒆𝒅 ${successCount}/${participantIDs.length} 𝒖𝒔𝒆𝒓 𝒑𝒓𝒐𝒇𝒊𝒍𝒆𝒔`;
        console.log(resultMessage);
        
        if (failedCount > 0) {
            api.sendMessage(`${resultMessage}\n❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒖𝒑𝒅𝒂𝒕𝒆 ${failedCount} 𝒖𝒔𝒆𝒓𝒔:\n${failedUsers.join('\n')}`, threadID);
        } else {
            api.sendMessage(resultMessage, threadID);
        }
        
    } catch (error) {
        console.error("❌ 𝑪𝒓𝒊𝒕𝒊𝒄𝒂𝒍 𝑬𝑹𝑹𝑶𝑹:", error);
        api.sendMessage("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒖𝒔𝒆𝒓 𝒅𝒂𝒕𝒂", threadID);
    }
};
