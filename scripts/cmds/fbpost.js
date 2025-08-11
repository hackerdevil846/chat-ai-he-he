module.exports.config = {
	name: "fbpost",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑭𝒂𝒌𝒆 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒑𝒐𝒔𝒕 𝒃𝒂𝒏𝒂𝒐",
	commandCategory: "𝑬𝒅𝒊𝒕-𝑰𝒎𝒂𝒈𝒆",
	usages: "𝒇𝒃𝒑𝒐𝒔𝒕 [𝒕𝒆𝒙𝒕]",
	cooldowns: 10,
	dependencies: {"canvas": "", "axios": ""}
};

module.exports.circle = async (image) => {
    const jimp = global.nodemodule["jimp"];
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}

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
	let { senderID, threadID, messageID } = event;
	const { loadImage, createCanvas } = require("canvas");
	const fs = require("fs-extra");
	const axios = require("axios")
	
	let avatar = __dirname + '/cache/avt.png';
	let pathImg = __dirname + '/cache/fbpost.png';
	var text = args.join(" ");
	
	if (!text) return api.sendMessage(
		`𝑽𝒖𝒍 𝒇𝒐𝒓𝒎𝒂𝒕\n𝑼𝒔𝒆: ${global.config.PREFIX}${this.config.name} 𝒕𝒆𝒙𝒕`, 
		threadID, 
		messageID
	);
	
	const res = await api.getUserInfoV2(senderID);
	let getAvatar = (await axios.get(res.avatar, { responseType: 'arraybuffer' })).data;
	let getPostTemplate = (await axios.get(`https://i.imgur.com/VrcriZF.jpg`, { responseType: 'arraybuffer' })).data;
	
	fs.writeFileSync(avatar, Buffer.from(getAvatar, 'utf-8'));
	fs.writeFileSync(pathImg, Buffer.from(getPostTemplate, 'utf-8'));
	
	oms = await this.circle(avatar);
	let image = await loadImage(oms);
	let baseImage = await loadImage(pathImg);
	
	let canvas = createCanvas(baseImage.width, baseImage.height);
	let ctx = canvas.getContext("2d");
	ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
	ctx.drawImage(image, 17, 17, 104, 104);
	
	// User name
	ctx.font = "696 32px Sans-Serif";
	ctx.fillStyle = "#000000";
	ctx.textAlign = "start";
	ctx.fillText(res.name, 130, 55);
	
	// Post text
	ctx.font = "500 45px Arial";
	ctx.fillStyle = "#000000";
	ctx.textAlign = "start";
	
	let fontSize = 250;
	while (ctx.measureText(text).width > 2600) {
		fontSize--;
		ctx.font = `500 ${fontSize}px Arial`;
	}
	
	const lines = await this.wrapText(ctx, text, 650);
	ctx.fillText(lines.join('\n'), 17, 180);
	
	const imageBuffer = canvas.toBuffer();
	fs.writeFileSync(pathImg, imageBuffer);
	fs.removeSync(avatar);
	
	return api.sendMessage({
		body: "𝑨𝒑𝒏𝒂𝒓 𝑭𝒂𝒌𝒆 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝑷𝒐𝒔𝒕 ✨",
		attachment: fs.createReadStream(pathImg)
	}, threadID, () => fs.unlinkSync(pathImg), messageID);        
}
