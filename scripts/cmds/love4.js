const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
const Jimp = require("jimp");

module.exports.config = {
	name: "love4",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "দুইজন user এর romantic love image বানাও 💖",
	category: "edit-img",
	usages: "[tag]",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"fs-extra": "",
		"path": "",
		"jimp": ""
	}
};

module.exports.onLoad = async function () {
	try {
		const cacheDir = path.join(__dirname, "cache");
		const baseImagePath = path.join(cacheDir, "love_template.png");

		// cache dir না থাকলে তৈরি করো
		if (!fs.existsSync(cacheDir)) {
			fs.mkdirSync(cacheDir, { recursive: true });
		}

		// Template image cache করো
		if (!fs.existsSync(baseImagePath)) {
			const response = await axios({
				method: "get",
				url: "https://drive.google.com/uc?export=download&id=1ZGGhBH6ed8v4dku83G4NbxuPtNmN2iW9",
				responseType: "arraybuffer",
				headers: {
					"User-Agent": "Mozilla/5.0"
				}
			});
			fs.writeFileSync(baseImagePath, response.data);
		}
	} catch (error) {
		console.error("❌ Error during onLoad:", error);
	}
};

module.exports.run = async function ({ api, event }) {
	const { threadID, messageID, senderID, mentions } = event;

	// Tag না করলে error
	if (Object.keys(mentions).length === 0) {
		return api.sendMessage("📍 Please tag 1 person to create a love image!", threadID, messageID);
	}

	const [mentionId] = Object.keys(mentions);
	const mentionName = mentions[mentionId].replace(/@/g, "");

	try {
		api.sendMessage("💖 Creating your romantic love image...", threadID, messageID);

		// Image generate
		const imagePath = await generateLoveImage(senderID, mentionId);

		const message = {
			body: `💌 ${mentionName}, love you so much! 🥰`,
			mentions: [{
				tag: mentionName,
				id: mentionId
			}],
			attachment: fs.createReadStream(imagePath)
		};

		api.sendMessage(message, threadID, () => {
			try {
				fs.unlinkSync(imagePath);
			} catch (e) {
				console.error("⚠️ Cleanup error:", e);
			}
		}, messageID);
	} catch (error) {
		console.error("❌ Love4 command error:", error);
		api.sendMessage("❌ Error generating the image. Please try again later.", threadID, messageID);
	}
};

// ---------- Helper Functions ---------- //

async function generateLoveImage(user1ID, user2ID) {
	const cacheDir = path.join(__dirname, "cache");
	const baseImagePath = path.join(cacheDir, "love_template.png");

	// Load base image
	const baseImage = await Jimp.read(baseImagePath);

	// Process avatars
	const avatar1 = await processAvatar(user1ID);
	const avatar2 = await processAvatar(user2ID);

	// Output path
	const outputPath = path.join(cacheDir, `love4_${user1ID}_${user2ID}_${Date.now()}.png`);

	// Resize avatars
	avatar1.resize(200, 200);
	avatar2.resize(200, 200);

	// Composite
	baseImage
		.resize(1024, 800)
		.composite(avatar1, 300, 250) // প্রথম user এর জায়গা
		.composite(avatar2, 650, 250); // দ্বিতীয় user এর জায়গা

	// Save
	await baseImage.writeAsync(outputPath);
	return outputPath;
}

async function processAvatar(userId) {
	const avatarOptions = [
		`https://graph.facebook.com/${userId}/picture?width=512&height=512`,
		`https://graph.facebook.com/${userId}/picture?type=large`,
		`https://graph.facebook.com/${userId}/picture`,
		`https://graph.facebook.com/v12.0/${userId}/picture`
	];

	let avatarBuffer;
	for (const url of avatarOptions) {
		try {
			const response = await axios.get(url, {
				responseType: "arraybuffer",
				headers: { "User-Agent": "Mozilla/5.0" }
			});
			if (response.data) {
				avatarBuffer = Buffer.from(response.data);
				break;
			}
		} catch {
			continue;
		}
	}

	if (!avatarBuffer) throw new Error(`Failed to download avatar for user ${userId}`);

	// Circle crop
	const avatar = await Jimp.read(avatarBuffer);
	const size = Math.min(avatar.bitmap.width, avatar.bitmap.height);

	return avatar
		.crop(0, 0, size, size)
		.circle();
}
