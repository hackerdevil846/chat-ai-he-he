const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
	name: "zuck",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Zuckerberg er board e apnar moner kotha likhun ( ͡° ͜ʖ ͡°)",
	commandCategory: "edit-img",
	usages: "zuck [likha]",
	cooldowns: 10
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
};

module.exports.onCall = async function ({ api, message, args }) {
	const { threadID, messageID } = message;
	const cachePath = path.join(__dirname, "cache");
	const pathImg = path.join(cachePath, "zuck.png");
	const text = args.join(" ");

	if (!text) {
		return api.sendMessage("❔ | 𝑫𝒐𝒚𝒂 𝒌𝒐𝒓𝒆 𝒃𝒐𝒂𝒓𝒅 𝒆 𝒌𝒊𝒄𝒉𝒖 𝒆𝒌𝒕𝒂 𝒍𝒊𝒌𝒉𝒖𝒏.", threadID, messageID);
	}

	try {
		// Ensure cache directory exists
		if (!fs.existsSync(cachePath)) {
			fs.mkdirSync(cachePath);
		}
		
		const imageResponse = await axios.get(`https://i.postimg.cc/gJCXgKv4/zucc.jpg`, { responseType: 'arraybuffer' });
		fs.writeFileSync(pathImg, Buffer.from(imageResponse.data));

		const baseImage = await loadImage(pathImg);
		const canvas = createCanvas(baseImage.width, baseImage.height);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
		ctx.font = "400 18px Arial";
		ctx.fillStyle = "#000000";
		ctx.textAlign = "start";

		let fontSize = 50;
		while (ctx.measureText(text).width > 1200) {
			fontSize--;
			ctx.font = `400 ${fontSize}px Arial`;
		}

		const lines = await this.wrapText(ctx, text, 470);
		ctx.fillText(lines.join('\n'), 15, 75);
		ctx.beginPath();

		const imageBuffer = canvas.toBuffer();
		fs.writeFileSync(pathImg, imageBuffer);

		return api.sendMessage({
			attachment: fs.createReadStream(pathImg)
		}, threadID, () => fs.unlinkSync(pathImg), messageID);

	} catch (error) {
		console.error("Error in zuck command:", error);
		return api.sendMessage("❌ | An error occurred while processing the command. Please try again later.", threadID, messageID);
	}
};
