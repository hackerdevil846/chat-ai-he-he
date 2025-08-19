const path = require("path");

module.exports.config = {
	name: "markcmt",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑭𝒂𝒌𝒆 𝒄𝒐𝒎𝒎𝒆𝒏𝒕 𝒃𝒂𝒏𝒂𝒏𝒐",
	commandCategory: "𝑬𝒅𝒊𝒕-𝑰𝒎𝒂𝒈𝒆",
	usages: "𝒎𝒂𝒓𝒌𝒄𝒎𝒕 [𝒕𝒆𝒙𝒕]",
	cooldowns: 10,
	dependencies: {
		"canvas": "",
		"axios": "",
		"fs-extra": ""
	}
};

module.exports.languages = {
	"en": {
		"ERR_TEXT": "Please enter the comment text.",
		"SUCCESS": "Mark Zuckenberg's fake comment 📝"
	},
	"bn": {
		"ERR_TEXT": "𝑩𝒐𝒂𝒓𝒅 এ 𝒄𝒐𝒎𝒎𝒆𝒏𝒕 লিখতে enter করুন।",
		"SUCCESS": "𝑴𝒂𝒓𝒌 𝒁𝒖𝒄𝒌𝒆𝒓𝒃𝒆𝒓𝒈-এর কমেন্ট 📝"
	}
};

module.exports.onLoad = function () {
	const fs = global.nodemodule["fs-extra"];
	const cacheDir = path.join(__dirname, "cache");
	if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);
};

// Wrap text helper (returns array of lines)
module.exports.wrapText = (ctx, text, maxWidth) => {
	return new Promise(resolve => {
		if (!text) return resolve([]);
		if (ctx.measureText(text).width < maxWidth) return resolve([text]);
		if (ctx.measureText('W').width > maxWidth) return resolve(null);
		const words = text.split(' ');
		const lines = [];
		let line = '';
		while (words.length > 0) {
			let split = false;
			while (ctx.measureText(words[0]).width >= maxWidth) {
				const temp = words[0];
				words[0] = temp.slice(0, -1);
				if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
				else {
					split = true;
					words.splice(1, 0, temp.slice(-1));
				}
			}
			if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
			else {
				lines.push(line.trim());
				line = '';
			}
			if (words.length === 0 && line.length > 0) lines.push(line.trim());
		}
		return resolve(lines);
	});
};

module.exports.run = async function ({ api, event, args }) {
	const fs = global.nodemodule["fs-extra"];
	const axios = global.nodemodule["axios"];
	const { loadImage, createCanvas } = global.nodemodule["canvas"];

	const { threadID, messageID } = event;
	const text = args.join(" ").trim();
	const lang = "bn"; // default to Bangla messages; change to "en" if you prefer English strings

	if (!text) {
		return api.sendMessage(this.languages[lang].ERR_TEXT, threadID, messageID);
	}

	try {
		// ensure cache folder
		const cacheDir = path.join(__dirname, "cache");
		if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);

		const pathImg = path.join(cacheDir, "markcmt.png");

		// download base image (DO NOT CHANGE LINK)
		const res = await axios.get("https://i.postimg.cc/m2BW6tLy/test1.png", { responseType: "arraybuffer" });
		const imageBuffer = Buffer.from(res.data, "binary");
		fs.writeFileSync(pathImg, imageBuffer);

		// load and draw
		const baseImage = await loadImage(pathImg);
		const canvas = createCanvas(baseImage.width, baseImage.height);
		const ctx = canvas.getContext("2d");
		ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

		// setup font & style (use system-safe font for compatibility)
		let fontSize = 20;
		ctx.textBaseline = "top";
		ctx.textAlign = "start";
		ctx.fillStyle = "#000000";
		ctx.font = `${fontSize}px Arial`;

		// reduce font until it fits width threshold
		const maxTextWidth = 350;
		while (ctx.measureText(text).width > maxTextWidth && fontSize > 8) {
			fontSize--;
			ctx.font = `${fontSize}px Arial`;
		}

		// wrap text into lines
		const lines = await this.wrapText(ctx, text, maxTextWidth);

		// draw each line (multi-line support)
		const startX = 55;
		let startY = 60;
		const lineHeight = Math.round(fontSize * 1.25);

		for (let i = 0; i < lines.length; i++) {
			ctx.fillText(lines[i], startX, startY + i * lineHeight);
		}

		// write out final image
		const finalBuffer = canvas.toBuffer();
		fs.writeFileSync(pathImg, finalBuffer);

		// send message with image and cleanup
		return api.sendMessage({
			body: this.languages[lang].SUCCESS + " ✨\n\n© 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
			attachment: fs.createReadStream(pathImg)
		}, threadID, (err) => {
			// remove temp file
			try { if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg); } catch(e) { /* ignore */ }
			if (err) console.error(err);
		}, messageID);

	} catch (error) {
		console.error("markcmt error:", error);
		return api.sendMessage("⚠️ এরর হয়েছে — আবার চেষ্টা করুন। (Error occurred, please try again.)", threadID, messageID);
	}
};
