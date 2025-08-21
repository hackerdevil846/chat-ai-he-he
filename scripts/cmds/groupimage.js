const fs = require("fs");
const axios = require("axios");

module.exports.config = {
	name: "groupimage",
	version: "1.0.0",
	hasPermssion: 1,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Change group image by replying to an image",
	commandCategory: "group",
	usages: "[reply to image]",
	cooldowns: 5,
	dependencies: {
		"axios": ""
	},
	envConfig: {}
};

module.exports.languages = {
	"en": {
		"noReply": "❌ Please reply to an image to change group avatar",
		"noAttachment": "❌ No image attachment found in the reply",
		"multipleAttachments": "❌ Please reply with only one image",
		"success": "✅ Group image changed successfully!",
		"failure": "❌ Failed to change group image. Please try again"
	}
};

module.exports.run = async function({ api, event, languages }) {
	if (event.type !== "message_reply") {
		return api.sendMessage(languages.noReply, event.threadID, event.messageID);
	}
	
	if (!event.messageReply.attachments || event.messageReply.attachments.length === 0) {
		return api.sendMessage(languages.noAttachment, event.threadID, event.messageID);
	}
	
	if (event.messageReply.attachments.length > 1) {
		return api.sendMessage(languages.multipleAttachments, event.threadID, event.messageID);
	}
	
	try {
		const imageUrl = event.messageReply.attachments[0].url;
		const pathImg = __dirname + '/cache/group_image_' + Date.now() + '.png';
		
		const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
		fs.writeFileSync(pathImg, Buffer.from(response.data, 'utf-8'));
		
		await api.changeGroupImage(
			fs.createReadStream(pathImg), 
			event.threadID,
			() => fs.unlinkSync(pathImg)
		);
		
		return api.sendMessage(languages.success, event.threadID);
	} catch (error) {
		console.error(error);
		return api.sendMessage(languages.failure, event.threadID, event.messageID);
	}
};
