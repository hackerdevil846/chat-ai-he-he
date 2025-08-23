const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
	name: "islamicvideo",
	version: "1.1.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Get random Islamic inspirational videos",
	category: "islam",
	usages: "[islamicvideo]",
	cooldowns: 15,
	dependencies: {
		"axios": "",
		"fs-extra": ""
	}
};

module.exports.languages = {
	"en": {
		"downloading": "📥 | Downloading Islamic content, please wait...",
		"error": "❌ | Could not retrieve Islamic content. Please try again later.",
		"message": "✨ السلام عليكم ورحمة الله وبركاته ✨\n\n📿 Here is an Islamic video for reflection and inspiration:\n\n🌙 May Allah bless you and guide us all to the right path 🕋"
	}
};

// minimal onStart to avoid loader errors
module.exports.onStart = function () {
	// no-op (keeps loaders that expect onStart happy)
};

module.exports.onLoad = function () {
	// ensure cache directory exists when the module loads (optional)
	const cacheDir = path.join(__dirname, 'cache');
	if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
};

module.exports.run = async function ({ api, event }) {
	const videoLinks = [
		"https://drive.usercontent.google.com/download?id=1Y5O3qRzxt-MFR4vVhz0QsMwHQmr-34iH",
		"https://drive.usercontent.google.com/download?id=1YDyNrN-rnzsboFmYm8Q5-FhzoJD9WV3O",
		"https://drive.usercontent.google.com/download?id=1XzgEzopoYBfuDzPsml5-RiRnItXVx4zW",
		"https://drive.usercontent.google.com/download?id=1YEeal83MYRI9sjHuEhJdjXZo9nVZmfHD",
		"https://drive.usercontent.google.com/download?id=1YMEDEKVXjnHE0KcCJHbcT2PSbu8uGSk4",
		"https://drive.usercontent.google.com/download?id=1YRb2k01n4rIdA9Vf69oxIOdv54JyAprD",
		"https://drive.usercontent.google.com/download?id=1YSQCTVhrHTNl6B9xSBCQ7frBJ3bp_KoA",
		"https://drive.usercontent.google.com/download?id=1Yc9Rwwdpqha1AWeEb5BXV-goFbag0441",
		"https://drive.usercontent.google.com/download?id=1YcwtkC5wRbbHsAFuEQYQuwQsH4-ZiBS8",
		"https://drive.usercontent.google.com/download?id=1YhfyPl8oGmsIAIOjWQyzQYkDdZUPSalo"
	];

	const cacheDir = path.join(__dirname, 'cache');
	if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

	const randomVideo = videoLinks[Math.floor(Math.random() * videoLinks.length)];
	const videoPath = path.join(cacheDir, `islamic_${Date.now()}.mp4`);

	try {
		api.sendMessage(module.exports.languages.en.downloading, event.threadID, event.messageID);

		const response = await axios({
			method: 'GET',
			url: randomVideo,
			responseType: 'stream',
			timeout: 120000
		});

		const writer = fs.createWriteStream(videoPath);
		response.data.pipe(writer);

		await new Promise((resolve, reject) => {
			writer.on('finish', resolve);
			writer.on('error', reject);
		});

		api.sendMessage({
			body: module.exports.languages.en.message,
			attachment: fs.createReadStream(videoPath)
		}, event.threadID, (err) => {
			// cleanup file after sending (ignore errors)
			try { if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath); } catch (e) {}
			if (err) console.error("Send message error:", err);
		}, event.messageID);

	} catch (error) {
		console.error("Error in islamicvideo:", error);
		// Attempt to remove partial file if exists
		try { if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath); } catch (e) {}
		api.sendMessage(module.exports.languages.en.error, event.threadID, event.messageID);
	}
};
