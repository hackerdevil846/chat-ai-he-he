const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
const Jimp = require("jimp");

module.exports.config = {
	name: "love3",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "দুইজন ইউজারের romantic love image তৈরি করবে 💖",
	category: "edit-img",
	usages: "love3 @mention",
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
		const baseImagePath = path.join(cacheDir, "lpwft.png");

		// cache dir create
		if (!fs.existsSync(cacheDir)) {
			fs.mkdirSync(cacheDir, { recursive: true });
		}

		// base image download if missing
		if (!fs.existsSync(baseImagePath)) {
			const response = await axios({
				method: "get",
				url: "https://drive.google.com/uc?export=download&id=1DYZWSDbcl8fD601uZxLglSuyPsxJzAZf",
				responseType: "arraybuffer",
				headers: {
					"User-Agent": "Mozilla/5.0"
				}
			});
			fs.writeFileSync(baseImagePath, response.data);
			console.log("✅ Base image downloaded successfully");
		}
	} catch (error) {
		console.error("❌ Error during onLoad:", error);
	}
};

module.exports.run = async function ({ event, api, args }) {
	const { threadID, messageID, senderID, mentions } = event;

	// যদি mention না করে
	if (Object.keys(mentions).length === 0) {
		return api.sendMessage("📍 Please tag 1 person to create a love image!", threadID, messageID);
	}

	const [mentionId] = Object.keys(mentions);
	const mentionName = mentions[mentionId].replace(/@/g, "");

	try {
		api.sendMessage("💖 Creating your romantic love image...", threadID, messageID);

		const imagePath = await makeImage(senderID, mentionId);

		const message = {
			body: `💌 ${mentionName}, love you so much! 🥰`,
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
				console.log("🧹 Temporary image cleaned up");
			} catch (e) {
				console.error("Cleanup error:", e);
			}
		}, messageID);

	} catch (error) {
		console.error("❌ Love3 command error:", error);
		return api.sendMessage("⚠️ Error generating the image. Please try again later.", threadID, messageID);
	}
};

// ================= IMAGE MAKER ================= //
async function makeImage(user1Id, user2Id) {
	const cacheDir = path.join(__dirname, "cache");
	const baseImagePath = path.join(cacheDir, "lpwft.png");

	// base image load
	const baseImage = await Jimp.read(baseImagePath);
	baseImage.resize(1278, 720);

	// output path create
	const outputPath = path.join(cacheDir, `love3_${user1Id}_${user2Id}_${Date.now()}.png`);

	// avatars process
	const avatar1 = await processAvatar(user1Id);
	const avatar2 = await processAvatar(user2Id);

	// resize avatars
	avatar1.resize(250, 250);
	avatar2.resize(250, 250);

	// composite
	baseImage
		.composite(avatar1, 159, 220)
		.composite(avatar2, 849, 220);

	// save
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
		} catch (error) {
			console.log(`⚠️ Trying next avatar source for ${userId}...`);
			continue;
		}
	}

	if (!avatarBuffer) {
		throw new Error(`❌ Failed to download avatar for user ${userId}`);
	}

	// circle crop
	const avatar = await Jimp.read(avatarBuffer);
	const size = Math.min(avatar.bitmap.width, avatar.bitmap.height);

	return avatar.crop(0, 0, size, size).circle();
}
