module.exports.config = {
	name: "getlink",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑽𝒊𝒅𝒆𝒐, 𝑨𝒖𝒅𝒊𝒐 𝒂𝒓 𝑰𝒎𝒂𝒈𝒆 𝒆𝒓 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝑼𝑹𝑳 𝒑𝒂𝒕𝒉𝒂𝒏𝒐",
	commandCategory: "𝑻𝒐𝒐𝒍",
	usages: "𝒈𝒆𝒕𝑳𝒊𝒏𝒌",
	cooldowns: 5,
};

module.exports.languages = {
	"vi": {
		"invaidFormat": "❌ 𝑻𝒖𝒎𝒊 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒆 𝒆𝒌𝒕𝒂 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒆𝒓 𝒔𝒂𝒕𝒉𝒆 𝒂𝒖𝒅𝒊𝒐, 𝒗𝒊𝒅𝒆𝒐 𝒂𝒕𝒉𝒂𝒃𝒂 𝒊𝒎𝒂𝒈𝒆 𝒕𝒉𝒂𝒌𝒕𝒆 𝒉𝒐𝒃𝒆"
	},
	"en": {
		"invaidFormat": "❌ 𝑨𝒑𝒏𝒊 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒕𝒆 𝒉𝒐𝒃𝒆 𝒆𝒌𝒕𝒂 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒋𝒆𝒌𝒉𝒂𝒏𝒆 𝒂𝒖𝒅𝒊𝒐, 𝒗𝒊𝒅𝒆𝒐 𝒂𝒕𝒉𝒂𝒃𝒂 𝒊𝒎𝒂𝒈𝒆 𝒂𝒄𝒉𝒆"
	}
}

module.exports.run = async ({ api, event, getText }) => {
	if (event.type !== "message_reply") {
		return api.sendMessage(getText("invaidFormat"), event.threadID, event.messageID);
	}
	
	if (!event.messageReply.attachments || event.messageReply.attachments.length === 0) {
		return api.sendMessage(getText("invaidFormat"), event.threadID, event.messageID);
	}
	
	if (event.messageReply.attachments.length > 1) {
		return api.sendMessage("❌ 𝑬𝒌𝒕𝒂𝒓 𝒃𝒆𝒔𝒊 𝒂𝒕𝒕𝒂𝒄𝒉𝒎𝒆𝒏𝒕 𝒑𝒂𝒕𝒉𝒂𝒏𝒐𝒓 𝒋𝒐𝒏𝒏𝒆 𝒆𝒌𝒕𝒂 𝒎𝒂𝒕𝒓𝒂 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
	}
	
	const attachment = event.messageReply.attachments[0];
	return api.sendMessage(`🔗 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝑳𝒊𝒏𝒌:\n${attachment.url}`, event.threadID, event.messageID);
}
