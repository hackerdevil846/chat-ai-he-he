module.exports.config = {
	name: "delmsg",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑨𝑪𝑪 𝑩𝒐𝒕 𝒆𝒓 𝒔𝒐𝒃 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒅𝒆𝒍𝒆𝒕𝒆 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐",
	commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
	usages: "[𝒕𝒉𝒓𝒆𝒂𝒅/𝒂𝒍𝒍]",
	cooldowns: 0
};

module.exports.run = function({ api, event, args }) {
if (args[0] == "all") {
 return api.getThreadList(1000, null, ["INBOX"], (err, list) => {
 	if (err) throw err;
 	list.forEach(item => (item.threadID != event.threadID) ? api.deleteThread(item.threadID) : "");
 	api.sendMessage("𝑺𝒐𝒃 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒅𝒆𝒍𝒆𝒕𝒆 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐", event.threadID)
 })
}
else return api.getThreadList(1000, null, ["INBOX"], (err, list) => {
 	if (err) throw err;
 	list.forEach(item => (item.isGroup == true && item.threadID != event.threadID) ? api.deleteThread(item.threadID) : "");
 	api.sendMessage("𝑺𝒐𝒃 𝒈𝒓𝒐𝒖𝒑 𝒆𝒓 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒅𝒆𝒍𝒆𝒕𝒆 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐", event.threadID)
 })
}
