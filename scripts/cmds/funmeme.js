const fs = require('fs');
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');

module.exports.config = {
	name: "funmeme", // Command name
	version: "1.0.2", // Version
	hasPermssion: 0, // Permission level (0 = everyone)
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // Owner of the module
	description: "😂 Create meme with user's profile picture", 
	category: "image", // Category
	usages: "[@mention]", // Usage example
	cooldowns: 5, // Cooldown (seconds)
	dependencies: {
		"axios": "",
		"canvas": ""
	}
};

module.exports.languages = {
	"en": {
		processing: "⏳ Creating your meme...",
		success: "🎉 Meme Created Successfully! 😂",
		fail: "❌ Failed to create meme. Please try again later."
	},
	"bn": {
		processing: "⏳ আপনার মিম তৈরি হচ্ছে...",
		success: "🎉 মিম তৈরি সম্পন্ন! 😂",
		fail: "❌ মিম তৈরি করা যায়নি। পরে আবার চেষ্টা করুন।"
	}
};

module.exports.onLoad = function () {
	console.log("[✅] Fun Meme command loaded successfully!");
};

module.exports.run = async function ({ event, api, getText }) {
	const { threadID, messageID, senderID } = event;
	const mentions = Object.keys(event.mentions);
	const targetID = mentions[0] || senderID;

	try {
		// Send processing message
		api.sendMessage(getText("processing"), threadID, messageID);

		// Create canvas
		const canvas = createCanvas(700, 500);
		const ctx = canvas.getContext('2d');

		// Load template
		const template = await loadImage("https://i.imgur.com/jHrYZ5Y.jpg");
		ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

		// Get avatar
		const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512`;
		const avatarResponse = await axios.get(avatarUrl, { responseType: "arraybuffer" });
		const avatar = await loadImage(Buffer.from(avatarResponse.data));

		// Draw circular avatar
		ctx.save();
		ctx.beginPath();
		ctx.arc(350, 250, 100, 0, Math.PI * 2);
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(avatar, 250, 150, 200, 200);
		ctx.restore();

		// Save image
		const path = __dirname + `/cache/islamic_meme_${Date.now()}.png`;
		const buffer = canvas.toBuffer("image/png");
		fs.writeFileSync(path, buffer);

		// Send result
		api.sendMessage({
			body: getText("success"),
			attachment: fs.createReadStream(path)
		}, threadID, () => {
			// Cleanup
			try {
				fs.unlinkSync(path);
			} catch (err) {
				console.error("Cleanup error:", err);
			}
		}, messageID);

	} catch (error) {
		console.error("meme error:", error);
		api.sendMessage(getText("fail"), threadID, messageID);
	}
};
