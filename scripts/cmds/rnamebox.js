module.exports.config = {
	name: "rnamebox",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑮𝒓𝒖𝒑 𝒆𝒓 𝒔𝒐𝒃 𝒎𝒆𝒎𝒃𝒆𝒓𝒅𝒆𝒓 𝒆𝒓 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒂𝒏 𝒌𝒐𝒓𝒆𝒏",
	commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
	usages: "[𝑵𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒅𝒊𝒕𝒆 𝒉𝒐𝒃𝒆]",
	cooldowns: 20,
};

module.exports.run = async ({ event, api, args, Threads }) => {
    const custom = args.join(" "),
            allThread = await Threads.getAll(["threadID"]);
    var threadError = [],
        count = 0;
    if (custom.length != 0) {
        for (const idThread of allThread) {
            api.setTitle(custom, idThread.threadID, (err) => (err) ? threadError.push(idThread.threadID) : '');
            count+=1;
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        return api.sendMessage(`𝑺𝒂𝒑𝒉𝒂𝒍𝒃𝒉𝒂𝒃𝒆 ${count} 𝒕𝒊 𝒈𝒓𝒖𝒑𝒆𝒓 𝒏𝒂𝒎 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒂𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐`, event.threadID, () => {
            if (threadError.length != 0) return api.sendMessage(`[!] 𝑲𝒊𝒄𝒉𝒖 𝒈𝒓𝒖𝒑𝒆𝒓 𝒏𝒂𝒎 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒂𝒏 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊 𝒏𝒂: ${threadError.length} 𝒕𝒊`, event.threadID, event.messageID)
        }, event.messageID);
    }
    else {
        return api.sendMessage("[!] 𝑨𝒑𝒏𝒊 𝒆𝒌𝒕𝒊 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒅𝒊𝒕𝒆 𝒉𝒐𝒃𝒆", event.threadID, event.messageID);
    }
}
