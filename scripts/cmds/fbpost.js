module.exports.config = {
	name: "fbpost",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "✨ Create fake Facebook posts with your text",
	commandCategory: "🖼️ Edit-Image",
	usages: "[text]",
	cooldowns: 10,
	dependencies: {
		"canvas": "",
		"axios": "",
		"fs-extra": ""
	}
};

module.exports.run = async function({ api, event, args }) {
	const { createCanvas, loadImage } = require("canvas");
	const fs = require("fs-extra");
	const axios = require("axios");
	
	// Helper functions
	const circle = async (image) => {
		const jimp = global.nodemodule["jimp"];
		image = await jimp.read(image);
		image.circle();
		return await image.getBufferAsync("image/png");
	};

	const wrapText = (ctx, text, maxWidth) => {
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

	try {
		const { senderID, threadID, messageID } = event;
		const avatarPath = __dirname + '/cache/avt.png';
		const outputPath = __dirname + '/cache/fbpost.png';
		const text = args.join(" ");

		if (!text) return api.sendMessage("❌ Please provide text to create post!\n💡 Example: fbpost Hello world", threadID, messageID);

		// Get user info and avatar
		const userInfo = await api.getUserInfoV2(senderID);
		const avatarBuffer = (await axios.get(userInfo.avatar, { responseType: 'arraybuffer' })).data;
		const templateBuffer = (await axios.get("https://i.imgur.com/VrcriZF.jpg", { responseType: 'arraybuffer' })).data;

		// Save files to cache
		await fs.writeFile(avatarPath, Buffer.from(avatarBuffer, 'utf-8'));
		await fs.writeFile(outputPath, Buffer.from(templateBuffer, 'utf-8'));

		// Process images
		const roundedAvatar = await circle(avatarPath);
		const avatarImage = await loadImage(roundedAvatar);
		const templateImage = await loadImage(outputPath);

		const canvas = createCanvas(templateImage.width, templateImage.height);
		const ctx = canvas.getContext("2d");

		// Draw template and avatar
		ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(avatarImage, 17, 17, 104, 104);

		// Draw username
		ctx.font = "600 32px Sans-Serif";
		ctx.fillStyle = "#000000";
		ctx.fillText(userInfo.name, 130, 55);

		// Draw post text
		ctx.font = "500 45px Arial";
		let fontSize = 250;
		while (ctx.measureText(text).width > 2600) {
			fontSize--;
			ctx.font = `500 ${fontSize}px Arial`;
		}
		const lines = await wrapText(ctx, text, 650);
		ctx.fillText(lines.join('\n'), 17, 180);

		// Save and send result
		const resultBuffer = canvas.toBuffer();
		await fs.writeFile(outputPath, resultBuffer);
		
		api.sendMessage({
			body: "✅ Your fake Facebook post has been created!",
			attachment: fs.createReadStream(outputPath)
		}, threadID, () => fs.unlinkSync(outputPath), messageID);

		// Clean up avatar
		await fs.unlink(avatarPath);

	} catch (error) {
		console.error(error);
		api.sendMessage("❌ Error creating post. Please try again later.", event.threadID, event.messageID);
	}
};
