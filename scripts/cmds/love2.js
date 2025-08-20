/**
 * @warn ❌ Do not edit code or edit credits ❌
 */

const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
const Jimp = require("jimp");

module.exports.config = {
	name: "love2",
	version: "1.0.1",
	hasPermssion: 0, 
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Create a romantic love image with two users ❤️",
	commandCategory: "edit-img",
	usages: "love2 @mention",
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
		const baseImagePath = path.join(cacheDir, "frtwb.png");

		// Create cache directory
		if (!fs.existsSync(cacheDir)) {
			fs.mkdirSync(cacheDir, { recursive: true });
		}

		// Download base image if not exists
		if (!fs.existsSync(baseImagePath)) {
			const response = await axios({
				method: "get",
				url: "https://drive.google.com/uc?export=download&id=1WLOoR7M6jfRRmSEOSePbzUwrLqb2fqWm",
				responseType: "arraybuffer",
				headers: {
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
				}
			});
			fs.writeFileSync(baseImagePath, response.data);
		}
	} catch (error) {
		console.error("⚠️ Error during onLoad:", error);
	}
};

module.exports.run = async function ({ event, api }) {
	const { threadID, messageID, senderID, mentions } = event;

	// If no mention
	if (!Object.keys(mentions).length) {
		return api.sendMessage("📍 Please tag 1 person!", threadID, messageID);
	}

	const [mentionId] = Object.keys(mentions);
	const mentionName = mentions[mentionId].replace(/@/g, "");

	try {
		api.sendMessage("💖 Creating your love image...", threadID, messageID);

		const imagePath = await createLoveImage(senderID, mentionId);

		const message = {
			body: `🫄 ${mentionName} love you so much 🤗🥀`,
			mentions: [
				{
					tag: mentionName,
					id: mentionId
				}
			],
			attachment: fs.createReadStream(imagePath)
		};

		api.sendMessage(message, threadID, () => {
			try {
				fs.unlinkSync(imagePath);
			} catch (e) {
				console.error("🗑 Cleanup error:", e);
			}
		}, messageID);
	} catch (error) {
		console.error("❌ Love command error:", error);
		return api.sendMessage("❌ Error generating the image. Please try again later.", threadID, messageID);
	}
};

// ================= Helper Functions ================= //

async function createLoveImage(user1Id, user2Id) {
	const cacheDir = path.join(__dirname, "cache");
	const baseImagePath = path.join(cacheDir, "frtwb.png");

	// Load base image
	const baseImage = await Jimp.read(baseImagePath);

	// Download and process avatars
	const [avatar1, avatar2] = await Promise.all([
		downloadAndProcessAvatar(user1Id),
		downloadAndProcessAvatar(user2Id)
	]);

	// Create output path
	const outputPath = path.join(cacheDir, `love_${user1Id}_${user2Id}.png`);

	// Resize base image
	const resizedBase = baseImage.resize(800, 800);

	// Positions
	const yPos = resizedBase.bitmap.height / 3;
	const pos1X = (resizedBase.bitmap.width / 2) - (avatar1.bitmap.width / 2);
	const pos2X = resizedBase.bitmap.width - (avatar2.bitmap.width / 2) - 30;

	// Composite
	resizedBase
		.composite(avatar1, pos1X, yPos)
		.composite(avatar2, pos2X, yPos);

	// Save final image
	await resizedBase.writeAsync(outputPath);

	return outputPath;
}

async function downloadAndProcessAvatar(userId) {
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
				headers: {
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
				}
			});
			if (response.data) {
				avatarBuffer = Buffer.from(response.data);
				break;
			}
		} catch (error) {
			continue;
		}
	}

	if (!avatarBuffer) {
		throw new Error(`Failed to download avatar for user ${userId}`);
	}

	// Process avatar
	let avatar = await Jimp.read(avatarBuffer);
	const size = Math.min(avatar.bitmap.width, avatar.bitmap.height);

	return avatar
		.crop(0, 0, size, size)
		.resize(200, 200, Jimp.RESIZE_BEZIER)
		.circle();
}
