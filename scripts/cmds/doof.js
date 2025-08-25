module.exports.config = {
	name: "doof",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🖼️ | 𝑩𝒐𝒂𝒓𝒅 𝒆 𝒄𝒐𝒎𝒎𝒆𝒏𝒕 𝒌𝒐𝒓𝒖𝒏 ( ͡° ͜ʖ ͡°)",
	category: "🖼️ | 𝑬𝒅𝒊𝒕-𝑰𝒎𝒂𝒈𝒆",
	usages: "𝒅𝒐𝒐𝒇 [𝒕𝒆𝒙𝒕]",
	cooldowns: 5,
	dependencies: {
		"canvas": "",
		"axios": "",
		"fs-extra": ""
	}
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

module.exports.onStart = async function({ api, event, args }) {
	const { threadID, messageID } = event;
	const { loadImage, createCanvas } = require("canvas");
	const fs = require("fs-extra");
	const axios = require("axios");
	
	let pathImg = __dirname + '/cache/doof.png';
	let text = args.join(" ");
	
	if (!text) return api.sendMessage("❌ | 𝑩𝒐𝒂𝒓𝒅 𝒆 𝒄𝒐𝒎𝒎𝒆𝒏𝒕 𝒍𝒊𝒌𝒉𝒂𝒏 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒖𝒏", threadID, messageID);
	
	try {
		let getPorn = (await axios.get(`https://i.imgur.com/bMxrqTL.png`, { responseType: 'arraybuffer' })).data;
		fs.writeFileSync(pathImg, Buffer.from(getPorn, 'utf-8'));
		
		let baseImage = await loadImage(pathImg);
		let canvas = createCanvas(baseImage.width, baseImage.height);
		let ctx = canvas.getContext("2d");
		
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
		ctx.fillText(lines.join('\n'), 42, 79);
		
		ctx.beginPath();
		const imageBuffer = canvas.toBuffer();
		fs.writeFileSync(pathImg, imageBuffer);
		
		return api.sendMessage({ 
			body: "✅ | 𝑫𝒐𝒏𝒆 𝒚𝒐𝒖𝒓 𝒃𝒐𝒂𝒓𝒅 𝒄𝒐𝒎𝒎𝒆𝒏𝒕!",
			attachment: fs.createReadStream(pathImg) 
		}, threadID, () => fs.unlinkSync(pathImg), messageID);
		
	} catch (error) {
		console.error(error);
		return api.sendMessage("❌ | 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒕𝒉𝒆 𝒊𝒎𝒂𝒈𝒆", threadID, messageID);
	}
};
