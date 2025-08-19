module.exports.config = {
	name: "mark",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑩𝒐𝒂𝒓𝒅 𝒆 𝒄𝒐𝒎𝒎𝒆𝒏𝒕 𝒌𝒐𝒓𝒖𝒏",
	commandCategory: "𝑮𝒂𝒎𝒆",
	usages: "[𝒕𝒆𝒙𝒕]",
	cooldowns: 5,
	dependencies: {
		"canvas": "",
		"axios": "",
		"fs-extra": ""
	}
};

module.exports.languages = {
	"en": {
		"noText": "✏️ Please enter the comment text to write on the board.",
		"done": "📝 Board e comment korlam!",
		"error": "❌ Kichu vul hoyeche. Try korun abar.",
	},
	"bn": {
		"noText": "✏️ Board e comment likhan enter korun.",
		"done": "📝 Board e comment korlam!",
		"error": "❌ কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।",
	}
};

module.exports.onLoad = function() {
	const fs = global.nodemodule["fs-extra"];
	const dir = __dirname + "/cache";
	if (!fs.existsSync(dir)) fs.mkdirSync(dir);
};

module.exports.wrapText = (ctx, text, maxWidth) => {
	return new Promise(resolve => {
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
			if (words.length === 0) lines.push(line.trim());
		}
		return resolve(lines);
	});
}

module.exports.run = async function({ api, event, args }) {
	const { threadID, messageID } = event;
	const fs = global.nodemodule["fs-extra"];
	const axios = global.nodemodule["axios"];
	const { loadImage, createCanvas } = global.nodemodule["canvas"];
	const pathImg = __dirname + '/cache/markngu.png';
	const text = args.join(" ");

	if (!text) return api.sendMessage(module.exports.languages['bn'].noText, threadID, messageID);

	try {
		// ensure cache folder exists
		await fs.ensureDir(__dirname + '/cache');

		// download base image (link kept unchanged as requested)
		const response = await axios.get('https://i.imgur.com/3j4GPdy.jpg', { responseType: 'arraybuffer' });
		fs.writeFileSync(pathImg, Buffer.from(response.data, 'binary'));

		// load image & prepare canvas
		const baseImage = await loadImage(pathImg);
		const canvas = createCanvas(baseImage.width, baseImage.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

		// initial font settings
		let fontSize = 45;
		ctx.fillStyle = '#000000';
		ctx.textAlign = 'start';
		ctx.font = `400 ${fontSize}px Arial, sans-serif`;

		// reduce font if the raw text is too wide overall
		while (ctx.measureText(text).width > 2250 && fontSize > 10) {
			fontSize--;
			ctx.font = `400 ${fontSize}px Arial, sans-serif`;
		}

		// wrap text into lines
		const lines = await this.wrapText(ctx, text, 440) || [text];

		// draw each line with proper line height (multiline support)
		const startX = 95;
		const startY = 420;
		const lineHeight = Math.floor(fontSize * 1.2);
		for (let i = 0; i < lines.length; i++) {
			ctx.fillText(lines[i], startX, startY + (i * lineHeight));
		}

		// write image back to file
		const imageBuffer = canvas.toBuffer();
		fs.writeFileSync(pathImg, imageBuffer);

		// send image
		return api.sendMessage({
			body: module.exports.languages['bn'].done + " ✅",
			attachment: fs.createReadStream(pathImg)
		}, threadID, () => fs.unlinkSync(pathImg), messageID);

	} catch (error) {
		console.error(error);
		return api.sendMessage(module.exports.languages['bn'].error + "\n" + error.message, threadID, messageID);
	}
};
