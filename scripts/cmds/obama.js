module.exports.config = {
	name: "obama",
	version: "1.1.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🇺🇸 Create presidential Obama-style tweet images",
	category: "image",
	usages: "[text]",
	cooldowns: 10,
	dependencies: {
		"canvas": "",
		"axios": "",
		"fs-extra": ""
	},
	envConfig: {}
};

module.exports.languages = {
	"en": {
		"missingText": "✍️ Please provide text for Obama's tweet\nExample: obama Yes we can! Change is coming.",
		"processing": "🔄 President Obama is composing your tweet...",
		"readyMessage": "🇺🇸 Obama Tweet command ready! Type 'obama [text]' to create your presidential tweet",
		"resultMessage": "🇺🇸 Presidential Tweet:",
		"error": "❌ Failed to create tweet. Error: %1"
	}
};

module.exports.onLoad = function() {};

module.exports.onStart = async function({ api, event, args, languages }) {
	const { createCanvas, loadImage } = require("canvas");
	const axios = require("axios");
	const fs = require("fs-extra");
	const path = require("path");
	
	const wrapText = async (ctx, text, maxWidth) => {
		return new Promise(resolve => {
			if (ctx.measureText(text).width <= maxWidth) return resolve([text]);
			
			const words = text.split(' ');
			const lines = [];
			let currentLine = '';
			
			for (let i = 0; i < words.length; i++) {
				const word = words[i];
				const testLine = currentLine ? `${currentLine} ${word}` : word;
				const testWidth = ctx.measureText(testLine).width;
				
				if (testWidth <= maxWidth) {
					currentLine = testLine;
				} else {
					if (currentLine) lines.push(currentLine);
					currentLine = word;
				}
				
				if (i === words.length - 1 && currentLine) {
					lines.push(currentLine);
				}
			}
			
			return resolve(lines);
		});
	};

	const sendMessage = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
	
	if (args.length === 0) {
		return sendMessage(languages.en.readyMessage);
	}
	
	const text = args.join(" ");
	if (!text.trim()) {
		return sendMessage(languages.en.missingText);
	}

	try {
		const processingMsg = await sendMessage(languages.en.processing);
		const cacheDir = path.join(__dirname, 'cache');
		await fs.ensureDir(cacheDir);
		
		// Download template
		const templateUrl = 'https://i.imgur.com/6fOxdex.png';
		const templatePath = path.join(cacheDir, 'obama_template.png');
		const { data } = await axios.get(templateUrl, { responseType: 'arraybuffer' });
		await fs.writeFile(templatePath, Buffer.from(data, 'binary'));
		
		// Create canvas
		const baseImage = await loadImage(templatePath);
		const canvas = createCanvas(baseImage.width, baseImage.height);
		const ctx = canvas.getContext("2d");
		
		// Draw template
		ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
		
		// Text styling
		ctx.font = "500 45px 'Helvetica Neue', Arial, sans-serif";
		ctx.fillStyle = "#14171a";
		ctx.textBaseline = "top";
		ctx.textAlign = "left";

		// Dynamic font sizing
		let fontSize = 45;
		while (ctx.measureText(text).width > 1160 && fontSize > 24) {
			fontSize -= 1;
			ctx.font = `500 ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
		}

		// Multi-line text rendering
		const lines = await wrapText(ctx, text, 1160);
		const lineHeight = fontSize * 1.4;
		const startY = 165;
		
		for (let i = 0; i < lines.length; i++) {
			ctx.fillText(lines[i], 60, startY + (i * lineHeight));
		}

		// Add verification badge
		ctx.fillStyle = "#1da1f2";
		ctx.beginPath();
		ctx.arc(60 + ctx.measureText(lines[0]).width + 30, startY + 10, 15, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = "#ffffff";
		ctx.font = "bold 24px Arial";
		ctx.fillText("✓", 60 + ctx.measureText(lines[0]).width + 22, startY + 15);

		// Save image
		const outputPath = path.join(cacheDir, `obama_${Date.now()}.png`);
		const buffer = canvas.toBuffer('image/png');
		await fs.writeFile(outputPath, buffer);
		
		// Send result
		await api.sendMessage({
			body: languages.en.resultMessage,
			attachment: fs.createReadStream(outputPath)
		}, event.threadID, event.messageID);
		
		// Cleanup
		await fs.unlink(templatePath);
		await fs.unlink(outputPath);
		await api.unsendMessage(processingMsg.messageID);

	} catch (error) {
		console.error("Obama Command Error:", error);
		sendMessage(languages.en.error.replace("%1", error.message));
	}
};
