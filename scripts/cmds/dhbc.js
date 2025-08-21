const axios = require("axios");
const { getStreamFromURL } = global.utils;

module.exports.config = {
	name: "dhbc",
	version: "1.3",
	author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	countDown: 5,
	role: 0,
	description: {
		en: "🎮 Play game catch the word from images"
	},
	category: "game",
	guide: {
		en: "{pn}"
	},
	envConfig: {
		reward: 1000
	}
};

module.exports.languages = {
	en: {
		reply: "🖼️ | Please reply to this message with your answer!\n%1",
		isSong: "🎵 | This is a song title from singer: %1",
		notPlayer: "⚠️ | You are not the player of this question!",
		correct: "🎉 | Congratulations! You answered correctly and received %1$",
		wrong: "❌ | Incorrect answer! Please try again."
	}
};

module.exports.run = async function ({ api, event, getLang }) {
	try {
		const imageUrl = "https://picsum.photos/1280/720"; // Random image from Lorem Picsum
		const wordData = (await axios.get("https://random-word-api.herokuapp.com/word")).data;
		const wordcomplete = wordData[0]; // The API returns an array, take the first word

		const bodyMsg = getLang("reply", wordcomplete.replace(/\S/g, "█ "));

		const attachments = [
			await getStreamFromURL(imageUrl)
		];

		api.sendMessage({
			body: bodyMsg,
			attachment: attachments
		}, event.threadID, (err, info) => {
			if (err) return console.error(err);
			global.GoatBot.onReply.set(info.messageID, {
				commandName: this.config.name,
				messageID: info.messageID,
				author: event.senderID,
				wordcomplete
			});
		});
	} catch (error) {
		console.error(error);
		api.sendMessage("❌ | An error occurred while starting the game!", event.threadID);
	}
};

module.exports.handleReply = async function ({ api, event, handleReply, getLang, Currencies }) {
	const { author, wordcomplete, messageID } = handleReply;
	
	if (event.senderID !== author) {
		return api.sendMessage(getLang("notPlayer"), event.threadID);
	}

	if (formatText(event.body) === formatText(wordcomplete)) {
		global.GoatBot.onReply.delete(messageID);
		const reward = this.config.envConfig.reward;
		await Currencies.increaseMoney(event.senderID, reward);
		api.sendMessage(getLang("correct", reward), event.threadID);
	} else {
		api.sendMessage(getLang("wrong"), event.threadID);
	}
};

function formatText(text) {
	return text.normalize("NFD")
		.toLowerCase()
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[đ|Đ]/g, (x) => x == "đ" ? "d" : "D");
}

