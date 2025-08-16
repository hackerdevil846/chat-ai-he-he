const { createReadStream, unlinkSync } = require("fs-extra");
const { resolve } = require("path");

module.exports.config = {
	name: "say", // Command name
	version: "2.0.0", // Version
	hasPermssion: 0, // Permission: 0 = All
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // Author
	description: "🎤 Bot text ta bolbe Google TTS diye (Hindi, Hinglish, English)", // Description
	commandCategory: "media", // Category
	usages: "[bn/en/auto] [Text]", // Usage
	cooldowns: 5, // Cooldown time (seconds)
	dependencies: {
		"path": "",
		"fs-extra": ""
	}
};

module.exports.languages = {
	"en": {
		missingText: "❌ Please provide some text.\nExample: say auto I love you",
		error: "🚫 An error occurred while speaking. Please try again."
	},
	"bn": {
		missingText: "❌ Doya kore text den\nUdaharon: +say auto ami tomake bhalobashi",
		error: "🚫 Bolar somoy error hoyeche. Abar chesta korun"
	}
};

module.exports.onLoad = function () {
	// Runs when command is loaded
};

module.exports.handleEvent = function () {
	// For global events if needed
};

module.exports.handleReply = function () {
	// For handling replies if needed
};

module.exports.handleReaction = function () {
	// For handling reactions if needed
};

module.exports.run = async function({ api, event, args }) {
	try {
		// Check if text is given
		if (!args[0]) {
			return api.sendMessage(
				global.utils.getText(module.exports.languages, "bn", "missingText"),
				event.threadID,
				event.messageID
			);
		}

		// If reply used, take that, otherwise take args
		const content = (event.type === "message_reply") ? event.messageReply.body : args.join(" ");
		let lang = "auto", msg = content;

		// Language detect
		const firstWord = args[0].toLowerCase();
		const supportedLangs = ["hi", "en", "ja", "ru", "tl"];
		if (supportedLangs.includes(firstWord)) {
			lang = firstWord;
			msg = args.slice(1).join(" ");
		}

		// Auto detect for Hindi/Hinglish
		if (lang === "auto") {
			const hindiPattern = /[क-हाि-ॣ़ा़ेैोौंःँ]/; // Hindi range
			lang = hindiPattern.test(msg) ? "hi" : "hi"; // Force Hindi for Hinglish too
		}

		// File path
		const filePath = resolve(__dirname, "cache", `${event.threadID}_${event.senderID}.mp3`);
		const ttsURL = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(msg)}&tl=${lang}&client=tw-ob`;

		// Download audio file
		await global.utils.downloadFile(ttsURL, filePath);

		// Send audio file
		return api.sendMessage(
			{ body: `🗣️ 𝗦𝗔𝗬 [${lang.toUpperCase()}]\n━━━━━━━━━━━━━━━\n${msg}`, attachment: createReadStream(filePath) },
			event.threadID,
			() => unlinkSync(filePath),
			event.messageID
		);

	} catch (err) {
		console.error("[ SAY ERROR ]", err);
		return api.sendMessage(
			global.utils.getText(module.exports.languages, "bn", "error"),
			event.threadID,
			event.messageID
		);
	}
};
