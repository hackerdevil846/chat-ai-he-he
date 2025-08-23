module.exports.config = {
	name: "elon",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🚀 𝑬𝒍𝒐𝒏 𝑴𝒖𝒔𝒌 𝒔𝒕𝒚𝒍𝒆 𝒃𝒐𝒂𝒓𝒅 𝒄𝒐𝒎𝒎𝒆𝒏𝒕 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒐𝒓",
	category: "🖼️ 𝑬𝒅𝒊𝒕-𝑰𝒎𝒂𝒈𝒆",
	usages: "[𝒕𝒆𝒙𝒕]",
	cooldowns: 10,
	dependencies: {
		"canvas": "",
		"axios": "",
		"fs-extra": ""
	}
};

module.exports.run = async function({ api, event, args }) {
	const { loadImage, createCanvas } = require("canvas");
	const fs = global.nodemodule["fs-extra"];
	const axios = global.nodemodule["axios"];
	
	let pathImg = __dirname + '/cache/elon.png';
	const text = args.join(" ");

	if (!text) return api.sendMessage("✨ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒚𝒐𝒖𝒓 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒇𝒐𝒓 𝑬𝒍𝒐𝒏'𝒔 𝒃𝒐𝒂𝒓𝒅!", event.threadID, event.messageID);

	try {
		const getPorn = (await axios.get(`https://i.imgur.com/GGmRov3.png`, { responseType: 'arraybuffer' })).data;
		fs.writeFileSync(pathImg, Buffer.from(getPorn, 'utf-8'));
		
		const baseImage = await loadImage(pathImg);
		const canvas = createCanvas(baseImage.width, baseImage.height);
		const ctx = canvas.getContext("2d");
		
		ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
		ctx.font = "320 30px Arial";
		ctx.fillStyle = "#000000";
		ctx.textAlign = "start";
		
		let fontSize = 220;
		while (ctx.measureText(text).width > 2600) {
			fontSize--;
			ctx.font = `320 ${fontSize}px Arial, sans-serif`;
		}
		
		const lines = await wrapText(ctx, text, 1160);
		ctx.fillText(lines.join('\n'), 40, 115);
		
		const imageBuffer = canvas.toBuffer();
		fs.writeFileSync(pathImg, imageBuffer);

		return api.sendMessage({ 
			body: "🚀 𝑬𝒍𝒐𝒏 𝑴𝒖𝒔𝒌'𝒔 𝒃𝒐𝒂𝒓𝒅 𝒄𝒐𝒎𝒎𝒆𝒏𝒕!",
			attachment: fs.createReadStream(pathImg) 
		}, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);

	} catch (error) {
		console.error(error);
		return api.sendMessage("❌ 𝑬𝒓𝒓𝒐𝒓 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒊𝒎𝒂𝒈𝒆", event.threadID, event.messageID);
	}
};

async function wrapText(ctx, text, maxWidth) {
	if (ctx.measureText(text).width < maxWidth) return [text];
	if (ctx.measureText('W').width > maxWidth) return null;
	
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
		
		if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
			line += `${words.shift()} `;
		} else {
			lines.push(line.trim());
			line = '';
		}
		
		if (words.length === 0) lines.push(line.trim());
	}
	return lines;
}
