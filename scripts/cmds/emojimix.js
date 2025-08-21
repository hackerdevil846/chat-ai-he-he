const axios = require("axios");

module.exports = {
	config: {
		name: "emojimix",
		version: "1.4",
	author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",",
		countDown: 5,
		role: 0,
		description: {
			vi: "Mix 2 emoji lại với nhau",
			en: "Mix 2 emoji together"
		},
		guide: {
			vi: "   {pn} <emoji1> <emoji2>"
				+ "\n   Ví dụ:  {pn} 🤣 🥰",
			en: "   {pn} <emoji1> <emoji2>"
				+ "\n   Example:  {pn} 🤣 🥰"
		},
		category: "fun"
	},

	langs: {
		vi: {
			error: "Rất tiếc, emoji %1 và %2 không mix được",
			success: "Emoji %1 và %2 mix được %3 ảnh",
			goat_error: "🐐 Oh no! It seems like the emojis %1 and %2 are not a match made in heaven. 💔 They can't be mixed. Please try different emojis!",
			goat_success: "🎉 Success! Emojis %1 and %2 have been beautifully mixed! 🎨 You've got %3 amazing new emoji creations!"
		},
		en: {
			error: "Sorry, emoji %1 and %2 can't mix",
			success: "Emoji %1 and %2 mix %3 images",
			goat_error: "🐐 Oh no! It seems like the emojis %1 and %2 are not a match made in heaven. 💔 They can't be mixed. Please try different emojis!",
			goat_success: "🎉 Success! Emojis %1 and %2 have been beautifully mixed! 🎨 You've got %3 amazing new emoji creations!"
		}
	},

	onStart: async function ({ message, args, getLang }) {
		const readStream = [];
		const emoji1 = args[0];
		const emoji2 = args[1];

		if (!emoji1 || !emoji2)
			return message.SyntaxError();

		const generate1 = await generateEmojimix(emoji1, emoji2);
		const generate2 = await generateEmojimix(emoji2, emoji1);

		if (generate1)
			readStream.push(generate1);
		if (generate2)
			readStream.push(generate2);

		if (readStream.length == 0)
			return message.reply(getLang("goat_error", emoji1, emoji2));

		message.reply({
			body: getLang("goat_success", emoji1, emoji2, readStream.length),
			attachment: readStream
		});
	}
};



async function generateEmojimix(emoji1, emoji2) {
	try {
const { data: response } = await axios.get(`https://emojik.vercel.app/s/${emoji1}_${emoji2}?size=128`, { responseType: "stream" });
		response.path = `emojimix${Date.now()}.png`;
		return response;
	}
		catch (e) {
		return null;
	}
}

