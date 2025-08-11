module.exports.config = {
	name: "outall",
	version: "1.0.1",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝒔𝒐𝒃 𝒈𝒓𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒐𝒕 𝒌𝒆 𝒃𝒂𝒉𝒊𝒓 𝒏𝒊𝒚𝒆 𝒋𝒂𝒐𝒂",
	commandCategory: "𝒂𝒅𝒎𝒊𝒏",
	usages: "𝒐𝒖𝒕𝒂𝒍𝒍",
	cooldowns: 5,
	info: [
		{
			key: "Text",
			prompt: "𝒔𝒐𝒃 𝒈𝒓𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒐𝒕 𝒌𝒆 𝒃𝒂𝒉𝒊𝒓 𝒏𝒊𝒚𝒆 𝒋𝒂𝒃𝒆",
			type: 'Document',
			example: 'outall'
		}
	]
};

module.exports.run = async ({ api, event, args }) => {
    try {
        const list = await api.getThreadList(100, null, ["INBOX"]);
        const botID = api.getCurrentUserID();
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const thread of list) {
            if (thread.isGroup && thread.threadID !== event.threadID) {
                try {
                    await api.removeUserFromGroup(botID, thread.threadID);
                    successCount++;
                    // Add delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (error) {
                    errorCount++;
                    console.error(`Error leaving group ${thread.threadID}:`, error);
                }
            }
        }
        
        const resultMessage = `✅ 𝒔𝒐𝒎𝒑𝒖𝒓𝒏𝒐 𝒃𝒂𝒉𝒊𝒓 𝒉𝒐𝒍𝒂!\n\n` +
                              `✔️ ${successCount} 𝒈𝒓𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒂𝒉𝒊𝒓 𝒉𝒐𝒍𝒂\n` +
                              `❌ ${errorCount} 𝒈𝒓𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒂𝒉𝒊𝒓 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒂𝒏𝒊`;
        
        api.sendMessage(resultMessage, event.threadID);
    } catch (error) {
        console.error(error);
        api.sendMessage("❌ 𝒆𝒓𝒓𝒐𝒓: 𝒔𝒐𝒃 𝒈𝒓𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒂𝒉𝒊𝒓 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒂𝒏𝒊", event.threadID);
    }
};
