module.exports.config = {
	name: "rnamebot",
	version: "1.0.1",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝒃𝒐𝒕 𝒆𝒓 𝒏𝒂𝒎 𝒔𝒐𝒃 𝒈𝒓𝒖𝒑 𝒆 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒐𝒏 𝒌𝒐𝒓𝒐!",
	commandCategory: "𝒔𝒊𝒔𝒕𝒆𝒎",
	usages: "[𝒏𝒂𝒎]",
	cooldowns: 20,
};

module.exports.run = async ({ event, api, args, Threads }) => {
    const custom = args.join(" "),
            allThread = await Threads.getAll(["threadID"]),
            idBot = api.getCurrentUserID();
    var threadError = [],
        count = 0;
    if (custom.length != 0) {
        for (const idThread of allThread) {
            api.changeNickname(custom, idThread.threadID, idBot, (err) => (err) ? threadError.push(idThread.threadID) : '');
            count+=1;
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        return api.sendMessage(`𝒔𝒂𝒑𝒉𝒂𝒍𝒃𝒉𝒂𝒃𝒆 ${count} 𝒕𝒊 𝒈𝒓𝒖𝒑 𝒆 𝒃𝒐𝒕 𝒆𝒓 𝒏𝒂𝒎 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒐𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐!`, event.threadID, () => {
            if (threadError.length != 0) return api.sendMessage(`[!] 𝒔𝒐𝒎𝒐𝒌𝒌𝒉𝒆 ${threadError.length} 𝒕𝒊 𝒈𝒓𝒖𝒑 𝒆 𝒏𝒂𝒎 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒐𝒏 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂!`, event.threadID, event.messageID)
        }, event.messageID);
    }
    else {
        for (const idThread of allThread) {
            const threadSetting = global.client.threadData.get(idThread.threadID) || {};
            api.changeNickname(`[ ${(threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? "MrTomXxX" : global.config.BOTNAME}`, idThread.threadID, idBot, (err) => (err) ? threadError.push(idThread.threadID) : '');
            count+=1;
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        return api.sendMessage(`𝒔𝒂𝒑𝒉𝒂𝒍𝒃𝒉𝒂𝒃𝒆 ${count} 𝒕𝒊 𝒈𝒓𝒖𝒑 𝒆 𝒃𝒐𝒕 𝒆𝒓 𝒏𝒂𝒎 𝒑𝒖𝒓𝒐𝒏𝒐 𝒏𝒂𝒎 𝒆 𝒓𝒂𝒌𝒉𝒂 𝒉𝒐𝒍𝒐!`, event.threadID, () => {
            if (threadError.length != 0) return api.sendMessage(`[!] 𝒔𝒐𝒎𝒐𝒌𝒌𝒉𝒆 ${threadError.length} 𝒕𝒊 𝒈𝒓𝒖𝒑 𝒆 𝒏𝒂𝒎 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒐𝒏 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂!`, event.threadID, event.messageID)
        }, event.messageID);
    }
}
