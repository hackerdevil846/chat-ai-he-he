const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports.config = {
	name: "schoolid",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑭𝒆𝒌 𝑺𝒌𝒖𝒍 𝑰𝑫 𝑩𝒂𝒏𝒂𝒐 🏫",
	category: "image",
	usages: "@mention",
	cooldowns: 3,
	dependencies: {
		"axios": "",
		"fs-extra": "",
		"canvas": ""
	}
};

module.exports.wrapText = (ctx, name, maxWidth) => {
	return new Promise(resolve => {
		if (ctx.measureText(name).width < maxWidth) return resolve([name]);
		if (ctx.measureText('W').width > maxWidth) return resolve(null);
		const words = name.split(' ');
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

module.exports.onStart = async function ({ api, event, Users }) {
	try {
		let pathImg = __dirname + "/cache/background.png";
		let pathAvt1 = __dirname + "/cache/Avtmot.png";

		// Target user
		var id = Object.keys(event.mentions)[0] || event.senderID;
		var name = await Users.getNameUser(id);

		// Background template
		var background = [
			"https://i.imgur.com/xJRXL3l.png"
		];
		var rd = background[Math.floor(Math.random() * background.length)];

		// Fetch avatar
		let getAvtmot = (
			await axios.get(
				`https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
				{ responseType: "arraybuffer" }
			)
		).data;
		fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));

		// Fetch background
		let getbackground = (
			await axios.get(`${rd}`, { responseType: "arraybuffer" })
		).data;
		fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));

		// Canvas draw
		let baseImage = await loadImage(pathImg);
		let baseAvt1 = await loadImage(pathAvt1);
		let canvas = createCanvas(baseImage.width, baseImage.height);
		let ctx = canvas.getContext("2d");

		ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

		// Name text
		ctx.font = "400 23px Arial";
		ctx.fillStyle = "#1878F3";
		ctx.textAlign = "start";

		const lines = await this.wrapText(ctx, name, 2000);
		ctx.fillText(lines.join('\n'), 270, 790);

		// Avatar
		ctx.drawImage(baseAvt1, 168, 225, 360, 360);

		// Save final
		const imageBuffer = canvas.toBuffer();
		fs.writeFileSync(pathImg, imageBuffer);
		fs.removeSync(pathAvt1);

		// Send result
		return api.sendMessage({
			body: "✅ সাফল্যের সাথে Fake School ID তৈরি হয়েছে! 🎓",
			attachment: fs.createReadStream(pathImg)
		}, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);

	} catch (e) {
		console.error(e);
		return api.sendMessage("❌ Error: কিছু সমস্যা হয়েছে!", event.threadID, event.messageID);
	}
};
