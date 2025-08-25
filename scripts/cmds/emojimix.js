const axios = require("axios");

module.exports.config = {
	name: "emojimix",
	version: "1.4",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Mix 2 emoji together 🎭",
	category: "fun",
	usages: "{pn} <emoji1> <emoji2>\nExample: {pn} 🤣 🥰",
	cooldowns: 5,
	dependencies: {
		"axios": ""
	}
};

module.exports.languages = {
	"vi": {
		error: "Rất tiếc, emoji %1 và %2 không mix được",
		success: "Emoji %1 và %2 mix được %3 ảnh",
		goat_error: "🐐 Oh no! Emojis %1 và %2 không mix được 💔",
		goat_success: "🎉 Thành công! Emoji %1 và %2 đã mix lại 🎨 Bạn có %3 ảnh mới!"
	},
	"en": {
		error: "Sorry, emoji %1 and %2 can't be mixed",
		success: "Emoji %1 and %2 mixed into %3 images",
		goat_error: "🐐 Oh no! Emojis %1 and %2 are not compatible 💔 Please try different ones!",
		goat_success: "🎉 Success! Emojis %1 and %2 have been beautifully mixed 🎨 You've got %3 amazing new creations!"
	},
	"bn": {
		error: "দুঃখিত 😢 emoji %1 আর %2 একসাথে মিক্স করা গেল না",
		success: "Emoji %1 আর %2 মিলে %3 টা ছবি পাওয়া গেছে 🎨",
		goat_error: "🐐 ওহ নো! %1 আর %2 একসাথে যায় না 💔 অন্য ইমোজি দিয়ে ট্রাই করুন!",
		goat_success: "🎉 সফল! %1 আর %2 সুন্দরভাবে মিক্স হয়েছে 🎨 আপনার জন্য %3 টা নতুন ইমোজি তৈরি হলো!"
	}
};

module.exports.onStart = async function ({ api, event, args, getText }) {
	const emoji1 = args[0];
	const emoji2 = args[1];
	const attachments = [];

	if (!emoji1 || !emoji2) {
		return api.sendMessage(
			`⚠️ ব্যবহার: ${this.config.usages.replace(/{pn}/g, this.config.name)}`,
			event.threadID,
			event.messageID
		);
	}

	const img1 = await generateEmojimix(emoji1, emoji2);
	const img2 = await generateEmojimix(emoji2, emoji1);

	if (img1) attachments.push(img1);
	if (img2) attachments.push(img2);

	if (attachments.length === 0) {
		return api.sendMessage(
			getText("goat_error", emoji1, emoji2),
			event.threadID,
			event.messageID
		);
	}

	return api.sendMessage(
		{
			body: getText("goat_success", emoji1, emoji2, attachments.length),
			attachment: attachments
		},
		event.threadID,
		event.messageID
	);
};

async function generateEmojimix(emoji1, emoji2) {
	try {
		const { data: stream } = await axios.get(
			`https://emojik.vercel.app/s/${emoji1}_${emoji2}?size=128`,
			{ responseType: "stream" }
		);
		stream.path = `emojimix_${Date.now()}.png`;
		return stream;
	} catch (e) {
		return null;
	}
}
