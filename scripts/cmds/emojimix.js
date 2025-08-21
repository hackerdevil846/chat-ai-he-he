const axios = require("axios");

module.exports.config = {
	name: "emojimix",
	version: "1.4",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: {
		en: "Mix 2 emoji together 🎭"
	},
	commandCategory: "fun",
	usages: "[emoji1] [emoji2]",
	cooldowns: 5,
	dependencies: {
		"axios": ""
	}
};

module.exports.languages = {
	en: {
		error: "❌ Sorry, emoji %1 and %2 can't be mixed!",
		success: "✅ Successfully mixed %1 and %2! Generated %3 image(s)"
	}
};

module.exports.run = async function ({ api, event, args, getText }) {
	const { readFileSync, createReadStream } = require("fs");
	const { threadID, messageID } = event;

	if (!args[0] || !args[1]) {
		return api.sendMessage("✨ Usage: emojimix <emoji1> <emoji2>\nExample: emojimix 🤣 🥰", threadID, messageID);
	}

	const emoji1 = args[0];
	const emoji2 = args[1];
	const readStream = [];

	try {
		const generate1 = await generateEmojimix(emoji1, emoji2);
		const generate2 = await generateEmojimix(emoji2, emoji1);

		if (generate1) readStream.push(generate1);
		if (generate2) readStream.push(generate2);

		if (readStream.length === 0) {
			return api.sendMessage(getText("error", emoji1, emoji2), threadID, messageID);
		}

		const msg = getText("success", emoji1, emoji2, readStream.length);
		api.sendMessage({
			body: msg,
			attachment: readStream
		}, threadID, messageID);
	} catch (error) {
		api.sendMessage("❌ An error occurred while processing emojis!", threadID, messageID);
	}
};

async function generateEmojimix(emoji1, emoji2) {
	try {
		const { data } = await axios.get(`https://emojik.vercel.app/s/${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}?size=128`, {
			responseType: "stream"
		});
		data.path = `emojimix${Date.now()}.png`;
		return data;
	} catch (e) {
		return null;
	}
}
