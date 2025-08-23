module.exports.config = {
	name: "board",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "📋 𝑩𝒐𝒂𝒓𝒅 𝒆 𝒄𝒐𝒎𝒎𝒆𝒏𝒕 𝒌𝒐𝒓𝒖𝒏 ( ͡° ͜ʖ ͡°)",
	category: "general",
	usages: "𝒃𝒐𝒂𝒓𝒅 [𝒕𝒆𝒙𝒕]",
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
	
	let pathImg = __dirname + '/cache/bang.png';
	let text = args.join(" ");
	
	if (!text) return api.sendMessage("📝 𝑩𝒐𝒂𝒓𝒅 𝒆 𝒄𝒐𝒎𝒎𝒆𝒏𝒕 𝒆𝒓 𝒄𝒐𝒏𝒕𝒆𝒏𝒕 𝒍𝒊𝒌𝒉𝒆𝒏", threadID, messageID);

	async function wrapText(ctx, text, maxWidth) {
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

	try {
		let getPorn = (await axios.get(`https://i.imgur.com/Jl7sYMm.jpeg`, { 
			responseType: 'arraybuffer' 
		})).data;
		
		fs.writeFileSync(pathImg, Buffer.from(getPorn, 'utf-8'));
		let baseImage = await loadImage(pathImg);
		let canvas = createCanvas(baseImage.width, baseImage.height);
		let ctx = canvas.getContext("2d");
		ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
		
		ctx.font = "bold 20px Arial";
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "start";
		
		let fontSize = 20;
		while (ctx.measureText(text).width > 2250) {
			fontSize--;
			ctx.font = `bold ${fontSize}px Arial, sans-serif`;
		}
		
		const lines = await wrapText(ctx, text, 440);
		ctx.fillText(lines.join('\n'), 85, 100);
		
		ctx.beginPath();
		const imageBuffer = canvas.toBuffer();
		fs.writeFileSync(pathImg, imageBuffer);
		
		return api.sendMessage({ 
			body: "✨ 𝑩𝒐𝒂𝒓𝒅 𝒆 𝒄𝒐𝒎𝒎𝒆𝒏𝒕 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐!",
			attachment: fs.createReadStream(pathImg) 
		}, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
		
	} catch (error) {
		console.log(error);
		return api.sendMessage("❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐭𝐡𝐞 𝐢𝐦𝐚𝐠𝐞", event.threadID);
	}
};
