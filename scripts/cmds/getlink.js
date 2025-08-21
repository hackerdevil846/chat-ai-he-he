module.exports.config = {
	name: "getlink",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑮𝒆𝒕 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒍𝒊𝒏𝒌𝒔 𝒇𝒐𝒓 𝒂𝒕𝒕𝒂𝒄𝒉𝒆𝒅 𝒎𝒆𝒅𝒊𝒂",
	commandCategory: "𝗧𝗢𝗢𝗟𝗦",
	usages: "[reply]",
	cooldowns: 5,
	dependencies: {}
};

module.exports.languages = {
	"en": {
		"invaidFormat": "❌ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗿𝗲𝗽𝗹𝘆! 𝗣𝗹𝗲𝗮𝘀𝗲 𝗿𝗲𝗽𝗹𝘆 𝘁𝗼 𝗮𝗻 𝗮𝘂𝗱𝗶𝗼, 𝘃𝗶𝗱𝗲𝗼, 𝗼𝗿 𝗶𝗺𝗮𝗴𝗲 𝗺𝗲𝘀𝘀𝗮𝗴𝗲",
		"multipleAttachments": "❌ 𝗧𝗼𝗼 𝗺𝗮𝗻𝘆 𝗮𝘁𝘁𝗮𝗰𝗵𝗺𝗲𝗻𝘁𝘀! 𝗣𝗹𝗲𝗮𝘀𝗲 𝗿𝗲𝗽𝗹𝘆 𝘁𝗼 𝗮 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝘄𝗶𝘁𝗵 𝗼𝗻𝗹𝘆 𝗼𝗻𝗲 𝗮𝘁𝘁𝗮𝗰𝗵𝗺𝗲𝗻𝘁",
		"success": "⬇️ 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗟𝗶𝗻𝗸:\n\n🔗 %1"
	}
}

module.exports.run = async function({ api, event, getText }) {
	const { messageReply } = event;
	
	if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
		return api.sendMessage(getText("invaidFormat"), event.threadID, event.messageID);
	}
	
	if (messageReply.attachments.length > 1) {
		return api.sendMessage(getText("multipleAttachments"), event.threadID, event.messageID);
	}
	
	const attachment = messageReply.attachments[0];
	return api.sendMessage({
		body: getText("success", attachment.url),
		attachment: await global.utils.getStreamFromURL(attachment.url)
	}, event.threadID, event.messageID);
}
