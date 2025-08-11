module.exports.config = {
    name: "antijoin",
    version: "1.0.0",
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    hasPermssion: 1,
    description: "𝑻𝒖𝒓𝒏 𝒐𝒏/𝒐𝒇𝒇 𝒂𝒏𝒕𝒊𝒋𝒐𝒊𝒏",
    usages: "𝒂𝒏𝒕𝒊𝒋𝒐𝒊𝒏 𝒐𝒏/𝒐𝒇𝒇",
    commandCategory: "𝒔𝒚𝒔𝒕𝒆𝒎",
    cooldowns: 0
};

module.exports.run = async({ api, event, Threads}) => {
    try {
        const info = await api.getThreadInfo(event.threadID);
        const botID = api.getCurrentUserID();
        
        if (!info.adminIDs.some(item => item.id == botID)) {
            return api.sendMessage(
                '「 𝑨𝑵𝑻𝑰 𝑱𝑶𝑰𝑵 」\n\n❌ 𝑩𝒐𝒕 𝒏𝒆𝒆𝒅𝒔 𝒂𝒅𝒎𝒊𝒏 𝒑𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏𝒔!\n𝑷𝒍𝒆𝒂𝒔𝒆 𝒂𝒅𝒅 𝒎𝒆 𝒂𝒔 𝒂𝒅𝒎𝒊𝒏 𝒂𝒏𝒅 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏',
                event.threadID,
                event.messageID
            );
        }
        
        const threadData = (await Threads.getData(event.threadID)).data || {};
        const currentStatus = threadData.newMember;
        
        if (currentStatus === undefined || currentStatus === false) {
            threadData.newMember = true;
        } else {
            threadData.newMember = false;
        }
        
        await Threads.setData(event.threadID, { data: threadData });
        global.data.threadData.set(parseInt(event.threadID), threadData);
        
        return api.sendMessage(
            `「 𝑨𝑵𝑻𝑰 𝑱𝑶𝑰𝑵 」\n\n✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 ${threadData.newMember ? "𝒆𝒏𝒂𝒃𝒍𝒆𝒅" : "𝒅𝒊𝒔𝒂𝒃𝒍𝒆𝒅"} 𝒂𝒏𝒕𝒊-𝒋𝒐𝒊𝒏 𝒔𝒚𝒔𝒕𝒆𝒎`,
            event.threadID,
            event.messageID
        );
    } catch (error) {
        console.error(error);
        return api.sendMessage(
            '「 𝑨𝑵𝑻𝑰 𝑱𝑶𝑰𝑵 」\n\n❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.',
            event.threadID,
            event.messageID
        );
    }
};
