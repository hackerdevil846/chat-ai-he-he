module.exports.config = {
	name: "delthread",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑺𝒐𝒃 𝒈𝒓𝒐𝒖𝒑 𝒆𝒓 𝒕𝒉𝒓𝒆𝒂𝒅 𝒅𝒆𝒍𝒆𝒕𝒆 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐",
	commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
	usages: "𝒅𝒆𝒍𝒕𝒉𝒓𝒆𝒂𝒅",
	cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
	return api.getThreadList(100, null, ["INBOX"], (err, list) => {
		if (err) throw err;
		list.forEach(item => (item.isGroup == true && item.threadID != event.threadID) ? api.deleteThread(item.threadID) : '');
		api.sendMessage('𝑺𝒐𝒃 𝒈𝒓𝒐𝒖𝒑 𝒆𝒓 𝒕𝒉𝒓𝒆𝒂𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒅𝒆𝒍𝒆𝒕𝒆 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐', event.threadID);
	});
}
