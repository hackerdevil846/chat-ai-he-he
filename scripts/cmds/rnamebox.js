module.exports.config = {
	name: "rnamebox",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🔄 𝑮𝒓𝒖𝒑 𝒆𝒓 𝒔𝒐𝒃 𝒎𝒆𝒎𝒃𝒆𝒓𝒅𝒆𝒓 𝒆𝒓 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒂𝒏 𝒌𝒐𝒓𝒆𝒏",
	category: "🛠️ 𝑺𝒚𝒔𝒕𝒆𝒎",
	usages: "[𝑵𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒅𝒊𝒕𝒆 𝒉𝒐𝒃𝒆]",
	cooldowns: 20,
	dependencies: {}
};

module.exports.onStart = async function({ event, api, args, Threads }) {
    try {
        const customName = args.join(" ");
        
        if (!customName) {
            return api.sendMessage("❌ | 𝑨𝒑𝒏𝒊 𝒆𝒌𝒕𝒊 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒅𝒊𝒕𝒆 𝒉𝒐𝒃𝒆!", event.threadID, event.messageID);
        }

        const allThreads = await Threads.getAll(["threadID"]);
        const failedThreads = [];
        let successCount = 0;

        for (const thread of allThreads) {
            try {
                await api.setTitle(customName, thread.threadID);
                successCount++;
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                failedThreads.push(thread.threadID);
            }
        }

        let msg = `✅ | 𝑺𝒂𝒑𝒉𝒂𝒍𝒃𝒉𝒂𝒃𝒆 ${successCount} 𝒕𝒊 𝒈𝒓𝒖𝒑𝒆𝒓 𝒏𝒂𝒎 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒂𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐!`;
        
        if (failedThreads.length > 0) {
            msg += `\n⚠️ | 𝑲𝒊𝒄𝒉𝒖 𝒈𝒓𝒖𝒑𝒆𝒓 𝒏𝒂𝒎 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒂𝒏 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊 𝒏𝒂: ${failedThreads.length} 𝒕𝒊`;
        }

        return api.sendMessage(msg, event.threadID, event.messageID);
    } catch (error) {
        console.error("🚫 | 𝑬𝒓𝒓𝒐𝒓:", error);
        return api.sendMessage("❌ | 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒓𝒆𝒒𝒖𝒆𝒔𝒕", event.threadID);
    }
};
