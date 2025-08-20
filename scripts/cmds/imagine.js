module.exports.config = {
	name: "imagine",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Generate AI-powered images from text prompts",
	commandCategory: "𝗜𝗠𝗔𝗚𝗘",
	usages: "[prompt]",
	cooldowns: 2,
	dependencies: {
		"axios": "",
		"fs-extra": ""
	}
};

module.exports.run = async function({ api, event, args }) {
	const axios = require('axios');
	const fs = require('fs-extra');
	
	let { threadID, messageID } = event;
	let query = args.join(" ");

	if (!query) {
		return api.sendMessage("🎨 | Please provide an image description!\nExample: /imagine sunset at beach", threadID, messageID);
	}

	let path = __dirname + `/cache/imagine_${event.senderID}.png`;

	try {
		api.sendMessage("🖌️ | Generating your image... Please wait!", threadID, messageID);

		const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(query)}`, {
			responseType: "arraybuffer"
		});

		fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));

		api.sendMessage({
			body: `✨ | Image Generated Successfully!\n━━━━━━━━━━━━━━\n📝 Prompt: "${query}"`,
			attachment: fs.createReadStream(path)
		}, threadID, () => fs.unlinkSync(path), messageID);

	} catch (error) {
		console.error(error);
		api.sendMessage("❌ | Failed to generate image. Please try again later.", threadID, messageID);
	}
};
