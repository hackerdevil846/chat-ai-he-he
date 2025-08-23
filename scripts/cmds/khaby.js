const axios = require('axios');
const request = require('request');
const fs = require('fs');

module.exports.config = {
	name: "khaby",
	version: "1.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // Changed credits as requested
	description: "✨ Create Khaby Lame memes with custom text",
	category: "🎭 fun",
	usages: "[text1] | [text2]",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"request": ""
	},
	envConfig: {}
};

module.exports.languages = {
	"en": {
		"missingInput": "❌ Please use the correct format: %1 <text1> | <text2>\nExample: %1 Can't believe | It's that easy"
	}
}

module.exports.run = async function ({ api, event, args, getText }) {
	const { threadID, messageID } = event;
	const content = args.join(" ");

	if (!content || !content.includes("|")) {
		return api.sendMessage(getText("missingInput", this.config.name), threadID, messageID);
	}

	const [text1, text2] = content.split("|").map(text => text.trim());
	
	if (!text1 || !text2) {
		return api.sendMessage(getText("missingInput", this.config.name), threadID, messageID);
	}

	try {
		const callback = () => {
			api.sendMessage({
				body: `✅ Here's your Khaby meme!`,
				attachment: fs.createReadStream(__dirname + "/assets/khaby_meme.png")
			}, threadID, () => fs.unlinkSync(__dirname + "/assets/khaby_meme.png"), messageID);
		};

		request(encodeURI(`https://api.memegen.link/images/khaby-lame/${text1}/${text2}.png`))
			.pipe(fs.createWriteStream(__dirname + '/assets/khaby_meme.png'))
			.on('close', callback);

	} catch (error) {
		console.error(error);
		api.sendMessage("❌ Error generating meme. Please try again later.", threadID, messageID);
	}
};
