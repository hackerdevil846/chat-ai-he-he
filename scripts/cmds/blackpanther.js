const axios = require('axios');
const fs = require('fs-extra');
const request = require('request');

module.exports = {
	config: {
		name: "blackpanther",
		aliases: ["blackpanther"],
		version: "1.0",
		author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
		countDown: 5,
		role: 0,
		shortDescription: "Create Black Panther meme text",
		longDescription: "Generate custom Black Panther style text images with two text lines",
		category: "fun",
		guide: {
			en: "{pn} text1 | text2"
		}
	},

	onStart: async function ({ event, message, api, args }) {
		try {
			const text = args.join(" ");
			if (!text.includes(' | ')) {
				return message.reply("✨ Please use the correct format: {pn} text1 | text2");
			}

			const [text1, text2] = text.split(' | ').map(t => t.trim());
			
			if (!text1 || !text2) {
				return message.reply("🌸 Please provide both text1 and text2 separated by ' | '");
			}

			const callback = () => {
				api.sendMessage({
					body: `🖤 Black Panther Text Created! 🐾\n\n» Text 1: ${text1}\n» Text 2: ${text2}`,
					attachment: fs.createReadStream(__dirname + "/assets/blackpanther.png")
				}, event.threadID, () => fs.unlinkSync(__dirname + "/assets/blackpanther.png"), event.messageID);
			};

			request(encodeURI(`https://api.memegen.link/images/wddth/${text1}/${text2}.png`))
				.pipe(fs.createWriteStream(__dirname + '/assets/blackpanther.png'))
				.on('close', callback);

		} catch (error) {
			console.error(error);
			message.reply("❌ An error occurred while generating the image");
		}
	}
};
