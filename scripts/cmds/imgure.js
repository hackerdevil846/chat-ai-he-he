const axios = require('axios');

module.exports.config = {
	name: "imgur",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Upload image/video to Imgur",
	commandCategory: "tools",
	usages: "[reply to image/video]",
	cooldowns: 5,
	dependencies: {
		"axios": ""
	}
};

module.exports.run = async function({ api, event }) {
	try {
		const link = event.messageReply?.attachments[0]?.url || event.attachments[0]?.url;
		
		if (!link) {
			return api.sendMessage('📸 Please reply to an image or video to upload!', event.threadID, event.messageID);
		}

		api.sendMessage('🔄 Uploading to Imgur...', event.threadID, event.messageID);

		const res = await axios.get(`https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json`);
		const response = await axios.get(`${res.data.csb}/nazrul/imgur?link=${encodeURIComponent(link)}`);
		
		if (response.data.uploaded.image) {
			return api.sendMessage(`✅ Upload Successful!\n\n🔗 Imgur Link: ${response.data.uploaded.image}`, event.threadID, event.messageID);
		} else {
			return api.sendMessage('❌ Upload failed. Please try again later.', event.threadID, event.messageID);
		}
	} catch (error) {
		console.error("Imgur Error:", error);
		return api.sendMessage('⚠️ An error occurred while uploading. Please try again later.', event.threadID, event.messageID);
	}
};
