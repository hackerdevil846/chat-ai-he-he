const axios = require("axios");

module.exports.config = {
	name: "nokia",
	aliases: ["nokiameme"],
	version: "2.0",
	author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "📱 Create Nokia meme with user's avatar",
	category: "fun",
	usages: "[mention/reply]",
	cooldowns: 10,
	dependencies: {
		"axios": ""
	},
	envConfig: {}
};

module.exports.languages = {
	"en": {
		"missingTarget": "⚠️ Please tag or reply to someone to create Nokia meme!",
		"apiError": "❌ Error generating meme. API might be down or invalid response.",
		"success": "📱 Nokia Filter Activated! Bitch I'm stylish 😂"
	}
};

module.exports.run = async function({ api, event, args, models, Users }) {
	try {
		const { threadID, messageID, messageReply, mentions } = event;
		let targetID;

		// Determine target user
		if (Object.keys(mentions).length > 0) {
			targetID = Object.keys(mentions)[0];
		} else if (messageReply) {
			targetID = messageReply.senderID;
		} else {
			return api.sendMessage(this.languages.en.missingTarget, threadID, messageID);
		}

		// Get avatar URL
		const avatarUrl = await Users.getAvatarUrl(targetID);
		if (!avatarUrl) throw new Error("Failed to get avatar URL");

		// Generate meme
		const memeUrl = `https://api.popcat.xyz/nokia?image=${encodeURIComponent(avatarUrl)}`;
		const response = await axios.get(memeUrl, { responseType: 'stream' });
		
		if (!response || !response.data) throw new Error(this.languages.en.apiError);

		return api.sendMessage({
			body: this.languages.en.success,
			attachment: response.data
		}, threadID, messageID);

	} catch (error) {
		console.error("Nokia Command Error:", error);
		return api.sendMessage(this.languages.en.apiError, event.threadID, event.messageID);
	}
};
