const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const Jimp = require('jimp');

module.exports.config = {
	name: "fuck",
	version: "3.1.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "😂 Create a funny meme with you and the mentioned user!",
	commandCategory: "edit-img",
	usages: "fuck @mention",
	cooldowns: 5,
	dependencies: {
		"fs-extra": "",
		"path": "",
		"axios": "",
		"jimp": ""
	}
};

module.exports.onLoad = async function () {
	const dirMaterial = path.join(__dirname, 'cache', 'canvas');
	const pathToImage = path.join(dirMaterial, 'fuckv3.png');

	try {
		if (!fs.existsSync(dirMaterial)) {
			await fs.mkdirp(dirMaterial);
		}

		if (!fs.existsSync(pathToImage)) {
			await module.exports.downloadFile(
				"https://i.ibb.co/TW9Kbwr/images-2022-08-14-T183542-356.jpg",
				pathToImage
			);
		}
	} catch (error) {
		console.error("❌ Error during onLoad:", error);
	}
};

module.exports.run = async function ({ event, api, args }) {
	const { threadID, messageID, senderID } = event;

	try {
		// Check for mentions
		if (!event.mentions || Object.keys(event.mentions).length === 0) {
			return api.sendMessage("⚠️ Please mention someone to use this command!", threadID, messageID);
		}

		const one = senderID;
		const two = Object.keys(event.mentions)[0];

		// Prevent self-mention
		if (one === two) {
			return api.sendMessage("😂 You can't mention yourself!", threadID, messageID);
		}

		// Send processing message
		api.sendMessage("⏳ Creating your meme... Please wait!", threadID, messageID);

		// Generate meme
		const imagePath = await module.exports.makeImage({ one, two });

		// Send result
		return api.sendMessage({
			body: "🤣 Here's your special meme moment! 💖",
			attachment: fs.createReadStream(imagePath)
		}, threadID, () => {
			// Cleanup temp files
			try {
				fs.unlinkSync(imagePath);
				fs.unlinkSync(path.join(__dirname, 'cache', 'canvas', `avt_${one}.png`));
				fs.unlinkSync(path.join(__dirname, 'cache', 'canvas', `avt_${two}.png`));
			} catch (cleanupError) {
				console.error("⚠️ Cleanup error:", cleanupError);
			}
		}, messageID);

	} catch (error) {
		console.error("❌ Command error:", error);
		return api.sendMessage("🚫 Failed to generate the meme. Please try again later.", threadID, messageID);
	}
};

module.exports.makeImage = async function ({ one, two }) {
	const canvasDir = path.join(__dirname, 'cache', 'canvas');
	const outputPath = path.join(canvasDir, `fuck_${one}_${two}.png`);
	const avatarOnePath = path.join(canvasDir, `avt_${one}.png`);
	const avatarTwoPath = path.join(canvasDir, `avt_${two}.png`);

	try {
		// Load template
		const templatePath = path.join(canvasDir, 'fuckv3.png');
		const memeTemplate = await Jimp.read(templatePath);

		// Process first avatar
		const avatarOne = await module.exports.downloadAvatar(one, avatarOnePath);
		const circleOne = await module.exports.createCircularImage(avatarOne);
		memeTemplate.composite(
			await Jimp.read(circleOne).resize(100, 100),
			20, 300
		);

		// Process second avatar
		const avatarTwo = await module.exports.downloadAvatar(two, avatarTwoPath);
		const circleTwo = await module.exports.createCircularImage(avatarTwo);
		memeTemplate.composite(
			await Jimp.read(circleTwo).resize(150, 150),
			100, 20
		);

		// Save final image
		await memeTemplate.writeAsync(outputPath);
		return outputPath;

	} catch (error) {
		console.error("❌ Image creation error:", error);
		throw new Error("Failed to create meme image");
	}
};

module.exports.downloadAvatar = async function (userID, savePath) {
	try {
		const url = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
		const response = await axios.get(url, {
			responseType: 'arraybuffer',
			timeout: 10000
		});

		await fs.writeFile(savePath, Buffer.from(response.data, 'binary'));
		return savePath;
	} catch (error) {
		console.error(`❌ Avatar download failed for ${userID}:`, error);
		throw new Error("Failed to download profile picture");
	}
};

module.exports.createCircularImage = async function (imagePath) {
	try {
		const image = await Jimp.read(imagePath);
		image.circle();
		return image;
	} catch (error) {
		console.error(`❌ Image processing failed for ${imagePath}:`, error);
		throw new Error("Failed to create circular avatar");
	}
};

module.exports.downloadFile = async function (url, savePath) {
	try {
		const response = await axios.get(url, { responseType: 'stream' });
		const writer = fs.createWriteStream(savePath);
		response.data.pipe(writer);

		return new Promise((resolve, reject) => {
			writer.on('finish', resolve);
			writer.on('error', reject);
		});
	} catch (error) {
		console.error(`❌ File download failed from ${url}:`, error);
		throw new Error("Failed to download template image");
	}
};
