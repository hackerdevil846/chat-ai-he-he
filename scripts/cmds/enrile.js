module.exports.config = {
	name: "enrile",
	version: "2.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "💬 𝑬𝒏𝒓𝒊𝒍𝒆'𝒔 𝒃𝒂𝒍𝒍𝒐𝒐𝒏 𝒄𝒐𝒎𝒎𝒆𝒏𝒕 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒐𝒓",
	commandCategory: "🎨 𝑬𝒅𝒊𝒕-𝑰𝒎𝒂𝒈𝒆",
	usages: "[𝒕𝒆𝒙𝒕]",
	cooldowns: 15,
	dependencies: {
		"canvas": "",
		"axios": "",
		"fs-extra": "",
		"discord-image-generation": ""
	},
	envConfig: {
		fontStyle: "bold 60px Arial",
		textColor: "#FFFFFF",
		textX: 500,
		textY: 450,
		maxWidth: 600
	}
};

module.exports.run = async function({ api, event, args, config }) {
	try {
		const { createCanvas, loadImage, registerFont } = require("canvas");
		const fs = global.nodemodule["fs-extra"];
		const axios = global.nodemodule["axios"];
		const { makeWanted } = global.nodemodule["discord-image-generation"];

		let pathImg = __dirname + '/cache/enrile_edit.png';
		const text = args.join(" ");
		
		if (!text) return api.sendMessage("✨ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒚𝒐𝒖𝒓 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒇𝒐𝒓 𝑬𝒏𝒓𝒊𝒍𝒆'𝒔 𝒃𝒂𝒍𝒍𝒐𝒐𝒏!", event.threadID, event.messageID);

		// Download base image
		const { data } = await axios.get("https://i.imgur.com/1plDf6o.png", { 
			responseType: 'arraybuffer' 
		});
		fs.writeFileSync(pathImg, Buffer.from(data, 'utf-8'));

		// Process image
		const baseImage = await loadImage(pathImg);
		const canvas = createCanvas(baseImage.width, baseImage.height);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
		
		// Text styling
		ctx.font = config.envConfig.fontStyle;
		ctx.fillStyle = config.envConfig.textColor;
		ctx.textAlign = "start";
		
		// Text wrapping
		const wrapText = (ctx, text, maxWidth) => {
			const words = text.split(' ');
			const lines = [];
			let line = '';

			while (words.length > 0) {
				let split = false;
				while (ctx.measureText(words[0]).width >= maxWidth) {
					const temp = words[0];
					words[0] = temp.slice(0, -1);
					split ? words[1] = `${temp.slice(-1)}${words[1]}` : words.splice(1, 0, temp.slice(-1));
					split = true;
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
		};

		const lines = wrapText(ctx, text, config.envConfig.maxWidth);
		ctx.fillText(lines.join('\n'), config.envConfig.textX, config.envConfig.textY);

		// Save and send
		const buffer = canvas.toBuffer();
		fs.writeFileSync(pathImg, buffer);
		
		await api.sendMessage({
			body: `🎈 𝑬𝒏𝒓𝒊𝒍𝒆'𝒔 𝒃𝒂𝒍𝒍𝒐𝒐𝒏 𝒄𝒐𝒎𝒎𝒆𝒏𝒕:\n"${text}"`,
			attachment: fs.createReadStream(pathImg)
		}, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);

	} catch (error) {
		console.error(error);
		api.sendMessage("❌ 𝑬𝒓𝒓𝒐𝒓 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒊𝒎𝒂𝒈𝒆", event.threadID, event.messageID);
	}
};
