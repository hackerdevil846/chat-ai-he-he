const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports.config = {
	name: "condom",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Make fun of your friends using crazy condom fails 😆",
	category: "fun",
	usages: "tag someone",
	cooldowns: 5,
	dependencies: {
		"axios": "latest",
		"jimp": "latest"
	},
	envConfig: {}
};

module.exports.languages = {
	"en": {
		MISSING_TAG: "❗ You must tag a person to use this command.",
		CREATING_IMAGE: "🔧 Creating crazy condom fail... please wait!",
		SEND_ERROR: "⚠️ An error occurred while sending the image.",
		GEN_ERROR: "⚠️ An error occurred while generating the image."
	},
	"bn": {
		MISSING_TAG: "❗ একজনকে ট্যাগ করতে হবে এই কমান্ড ব্যবহার করার জন্য।",
		CREATING_IMAGE: "🔧 ছবি তৈরির হচ্ছে... একটু অপেক্ষা করো!",
		SEND_ERROR: "⚠️ ছবি পাঠানোর সময় সমস্যা হয়েছে।",
		GEN_ERROR: "⚠️ ছবি তৈরির সময় সমস্যা হয়েছে।"
	}
};

module.exports.onLoad = function () {
	// No special setup required on load for this module.
};

module.exports.run = async function ({ api, event, args, getText }) {
	try {
		// getText helper fallback
		const t = (key) => {
			try {
				return getText(key);
			} catch {
				// fallback to english strings if getText not available
				const lang = module.exports.languages.en;
				return lang[key] || key;
			}
		};

		// Validate mentions
		const mentions = event.mentions || {};
		const mentionIds = Object.keys(mentions);
		if (!mentionIds.length) {
			return api.sendMessage({ body: t("MISSING_TAG"), threadID: event.threadID, replyTo: event.messageID });
		}

		// Choose first mention (keeps original behaviour)
		const targetId = mentionIds[0];

		// Inform user (optional short notice)
		await api.sendMessage({ body: t("CREATING_IMAGE"), threadID: event.threadID, replyTo: event.messageID });

		// Generate image
		const imagePath = await generateImageFor(targetId);

		// Send image to thread
		try {
			await api.sendMessage({
				body: `Ops Crazy Condom Fails 😆\nMade for: ${mentions[targetId] || targetId}\n\nCredits: ${module.exports.config.credits}`,
				attachment: fs.createReadStream(imagePath)
			}, event.threadID, event.messageID);
		} catch (sendErr) {
			console.error("Send error:", sendErr);
			await api.sendMessage({ body: t("SEND_ERROR"), threadID: event.threadID, replyTo: event.messageID });
		} finally {
			// cleanup - remove the generated file if exists
			try {
				if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
			} catch (e) {
				// non-fatal
				console.warn("Failed to delete temp file:", e);
			}
		}
	} catch (err) {
		console.error("Generation error:", err);
		await api.sendMessage({ body: module.exports.languages.en.GEN_ERROR, threadID: event.threadID, replyTo: event.messageID });
	}
};

/**
 * Generates the composite image and returns the local file path.
 * Keeps the original links/paths unchanged as requested.
 */
async function generateImageFor(userId) {
	const avatarUrl = `https://graph.facebook.com/${userId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
	const templateUrl = "https://i.imgur.com/cLEixM0.jpg";
	const outputPath = "condom.png"; // kept exactly as original request

	try {
		// Read avatar and template (jimp supports URLs)
		const avatar = await jimp.read(avatarUrl);
		const image = await jimp.read(templateUrl);

		// Compose exactly like original logic
		image.resize(512, 512);
		avatar.resize(263, 263);

		// Composite avatar onto template at the same coordinates as original
		image.composite(avatar, 256, 258);

		// Write file
		await image.writeAsync(outputPath);

		return outputPath;
	} catch (e) {
		// bubble up error to caller
		throw e;
	}
}
