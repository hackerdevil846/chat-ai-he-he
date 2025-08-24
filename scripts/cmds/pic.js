const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
	name: "pic",
	version: "1.3.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🖼️ | Search images from Pinterest",
	category: "media-search",
	usages: "[search query]-[number of images]",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"fs-extra": ""
	},
	envConfig: {}
};

module.exports.languages = {
	"en": {
		"invalidFormat": "🖼️ | Invalid format! Please use:\npic [search term]-[number]\nExample: pic beautiful sunset-5",
		"missingKeyword": "🔍 | Please provide a search keyword",
		"apiError": "❌ | Failed to get image data from API",
		"noImages": "❌ | No images found for your search",
		"downloadError": "⚠️ Failed to download some images",
		"resultSuccess": "✅ | Found %1 image(s) for: \"%2\"",
		"noImagesDownloaded": "❌ | Failed to download any images"
	}
};

module.exports.run = async function({ api, event, args, getText }) {
	try {
		const input = args.join(" ");
		
		if (!input.includes("-")) {
			return api.sendMessage(getText("invalidFormat"), event.threadID, event.messageID);
		}

		const parts = input.split("-").map(p => p.trim());
		const keyword = parts[0];
		let imageCount = parseInt(parts[1]) || 5;
		imageCount = Math.min(Math.max(imageCount, 1), 10);

		if (!keyword) {
			return api.sendMessage(getText("missingKeyword"), event.threadID, event.messageID);
		}

		// Prepare temporary directory
		const tempDir = path.join(__dirname, 'pic_temp');
		await fs.ensureDir(tempDir);
		
		// Clean previous files
		const files = await fs.readdir(tempDir);
		for (const file of files) {
			if (file.startsWith(`${event.senderID}_`) && file.endsWith('.jpg')) {
				await fs.unlink(path.join(tempDir, file));
			}
		}

		// Fetch images from API
		const apiUrl = 'https://api.easy0.repl.co/v1/pinterest';
		const response = await axios.get(`${apiUrl}?search=${encodeURIComponent(keyword)}`, {
			timeout: 30000
		});
		
		if (!response.data?.data) {
			return api.sendMessage(getText("apiError"), event.threadID, event.messageID);
		}
		
		const imageUrls = response.data.data.slice(0, imageCount);
		
		if (imageUrls.length === 0) {
			return api.sendMessage(getText("noImages"), event.threadID, event.messageID);
		}

		// Download images
		const imgPaths = [];
		let downloadErrors = 0;
		
		for (let i = 0; i < imageUrls.length; i++) {
			try {
				const imagePath = path.join(tempDir, `${event.senderID}_${Date.now()}_${i}.jpg`);
				const imageRes = await axios.get(imageUrls[i], {
					responseType: 'arraybuffer',
					timeout: 30000
				});
				await fs.writeFile(imagePath, Buffer.from(imageRes.data));
				imgPaths.push(imagePath);
			} catch (error) {
				downloadErrors++;
				console.error(`Image ${i+1} download error:`, error.message);
			}
		}

		// Send results
		if (imgPaths.length > 0) {
			const attachments = imgPaths.map(path => fs.createReadStream(path));
			let successMessage = getText("resultSuccess", imgPaths.length, keyword);
			
			if (downloadErrors > 0) {
				successMessage += `\n⚠️ | ${getText("downloadError")} (${downloadErrors} failed)`;
			}
			
			await api.sendMessage({
				body: successMessage,
				attachment: attachments
			}, event.threadID, async (error) => {
				if (error) console.error("Send error:", error);
				
				// Cleanup after sending
				for (const filePath of imgPaths) {
					if (fs.existsSync(filePath)) {
						await fs.unlink(filePath).catch(e => console.error("Cleanup error:", e));
					}
				}
			});
		} else {
			api.sendMessage(getText("noImagesDownloaded"), event.threadID, event.messageID);
		}

	} catch (error) {
		console.error("Command Error:", error);
		api.sendMessage(`⚠️ | An error occurred: ${error.message}`, event.threadID, event.messageID);
	}
};
