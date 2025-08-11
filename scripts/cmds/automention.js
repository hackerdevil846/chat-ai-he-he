module.exports.config = {
	name: "automention",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝒂𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒂𝒍𝒍𝒚 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒖𝒔𝒆𝒓𝒔",
	commandCategory: "𝒐𝒕𝒉𝒆𝒓",
	cooldowns: 5
};

module.exports.run = function({ api, event }) {
	if (Object.keys(event.mentions).length === 0) {
		return api.sendMessage(`𝑨𝒑𝒏𝒂𝒌𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏: @[${event.senderID}:0]`, event.threadID, event.messageID);
	}
	else {
		for (var i = 0; i < Object.keys(event.mentions).length; i++) {
			const name = Object.values(event.mentions)[i].replace('@', '');
			const uid = Object.keys(event.mentions)[i];
			api.sendMessage(`𝑴𝒆𝒏𝒕𝒊𝒐𝒏𝒊𝒏𝒈: ${name}\n➺ @[${uid}:0]`, event.threadID);
		}
		return;
	}
}
