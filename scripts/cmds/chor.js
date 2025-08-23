const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const jimp = require("jimp");

module.exports.config = {
	name: "chor",
	version: "1.2.0",
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	hasPermssion: 0,
	category: "image",
	description: "🖼️ Create Scooby-Doo 'got caught' memes",
	usages: "[@mention]",
	cooldowns: 15,
	dependencies: {
		"fs-extra": "",
		"axios": "",
		"canvas": "",
		"jimp": ""
	},
	envConfig: {}
};

module.exports.languages = {
	"en": {
		"processing": "🖌️ Creating %1 caught meme... Please wait!",
		"success": "🚨 %1 got caught red-handed!",
		"error": "😿 Failed to create meme. Please try again later or mention someone else."
	}
}

module.exports.run = async function({ api, event, args, Users }) {
	const { threadID, messageID } = event;
	
	try {
		// Determine target user
		let targetID, targetName;
		
		if (Object.keys(event.mentions).length > 0) {
			targetID = Object.keys(event.mentions)[0];
			targetName = event.mentions[targetID];
		} else {
			targetID = event.senderID;
			const userInfo = await Users.getInfo(targetID);
			targetName = userInfo.name;
		}

		// Create cache directory
		const cacheDir = path.join(__dirname, "chor-cache");
		if (!fs.existsSync(cacheDir)) {
			fs.mkdirSync(cacheDir, { recursive: true });
		}
		
		const outputPath = path.join(cacheDir, `chor_${targetID}_${Date.now()}.jpg`);
		
		// Show processing message
		const processingMsg = await api.sendMessage(
			global.module.exports.languages.en.processing.replace("%1", targetName),
			threadID
		);

		// Create the meme
		await createMeme(targetID, outputPath);
		
		// Send result
		await api.sendMessage({
			body: global.module.exports.languages.en.success.replace("%1", targetName),
			attachment: fs.createReadStream(outputPath)
		}, threadID, messageID);
		
		// Delete processing message
		api.unsendMessage(processingMsg.messageID);
		
		// Clean up generated image
		fs.unlinkSync(outputPath);

	} catch (error) {
		console.error("❌ Chor Command Error:", error);
		api.sendMessage(
			global.module.exports.languages.en.error,
			threadID,
			messageID
		);
	}
};

async function createMeme(userID, outputPath) {
	try {
		// Background template URL
		const templateURL = "https://i.imgur.com/ES28alv.png";
		
		// Load background
		const bgResponse = await axios.get(templateURL, { responseType: 'arraybuffer' });
		const background = await loadImage(Buffer.from(bgResponse.data, 'binary'));
		
		// Create canvas
		const canvas = createCanvas(background.width, background.height);
		const ctx = canvas.getContext('2d');
		
		// Draw background
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		
		// Process and draw avatar
		const avatarPath = await processAvatar(userID);
		const avatar = await loadImage(avatarPath);
		
		// Draw circular avatar (position adjusted for template)
		ctx.save();
		ctx.beginPath();
		ctx.arc(103, 465, 55, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(avatar, 48, 410, 111, 111);
		ctx.restore();
		
		// Add watermark
		ctx.font = "14px Arial";
		ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
		ctx.fillText("✨ Created by 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", 10, canvas.height - 10);
		
		// Save as JPEG
		const out = fs.createWriteStream(outputPath);
		const stream = canvas.createJPEGStream({ quality: 0.95 });
		stream.pipe(out);
		
		// Wait for image to finish saving
		await new Promise((resolve, reject) => {
			out.on('finish', resolve);
			out.on('error', reject);
		});
		
		// Clean up avatar
		fs.unlinkSync(avatarPath);
		
		return outputPath;
		
	} catch (error) {
		console.error("🖼️ Meme Creation Error:", error);
		throw error;
	}
}

async function processAvatar(userID) {
	const cacheDir = path.join(__dirname, "chor-cache");
	const avatarPath = path.join(cacheDir, `avt_${userID}_${Date.now()}.png`);
	
	try {
		// Download avatar
		const avatarURL = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
		const { data } = await axios.get(avatarURL, { responseType: "arraybuffer" });
		await fs.writeFile(avatarPath, Buffer.from(data, "binary"));
		
		// Circle crop using Jimp
		const image = await jimp.read(avatarPath);
		await image.circle();
		await image.writeAsync(avatarPath);
		
		return avatarPath;
		
	} catch (error) {
		console.error("👤 Avatar Processing Error:", error);
		throw error;
	}
}
