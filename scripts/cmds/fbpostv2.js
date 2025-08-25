const sendWaiting = true;
const textWaiting = "𝑰𝒎𝒂𝒈𝒆 𝒑𝒓𝒆𝒑𝒂𝒓𝒂𝒕𝒊𝒐𝒏, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒘𝒂𝒊𝒕 𝒂 𝒎𝒐𝒎𝒆𝒏𝒕 🕐";
const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsLink = 20;
const fontsInfo = 28;
const colorName = "#00FFFF";

module.exports.config = {
	name: "tweet-tag",
	version: "7.3.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑪𝒓𝒆𝒂𝒕𝒆 𝒂 𝒔𝒕𝒚𝒍𝒊𝒔𝒉 𝑻𝒘𝒊𝒕𝒕𝒆𝒓 𝒑𝒐𝒔𝒕 🐦",
	category: "𝗘𝗗𝗜𝗧-𝗜𝗠𝗔𝗚𝗘",
	usages: "[text]",
	cooldowns: 5,
	dependencies: {
		"canvas": "",
		"axios": "",
		"fs-extra": ""
	},
	envConfig: {}
};

module.exports.languages = {
	"en": {
		"missingInput": "❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒕𝒉𝒆 𝒕𝒆𝒙𝒕 𝒚𝒐𝒖 𝒘𝒂𝒏𝒕 𝒕𝒐 𝒕𝒘𝒆𝒆𝒕!"
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

module.exports.circle = async (image) => {
	const jimp = global.nodemodule["jimp"];
	image = await jimp.read(image);
	image.circle();
	return await image.getBufferAsync("image/png");
};

module.exports.onStart = async function({ api, event, args, Users, Threads, Currencies, permssion }) {
	const { loadImage, createCanvas } = require("canvas");
	const fs = global.nodemodule["fs-extra"];
	const axios = global.nodemodule["axios"];
	const Canvas = global.nodemodule["canvas"];
	
	let { senderID, threadID, messageID } = event;
	
	if (sendWaiting) api.sendMessage(textWaiting, threadID, messageID);
	
	if (!args[0]) return api.sendMessage(this.languages.en.missingInput, threadID, messageID);
	
	let pathImg = __dirname + `/cache/tweet_${senderID}.png`;
	let pathAvata = __dirname + `/cache/avatar_${senderID}.png`;
	
	let text = args.join(" ");
	let uid = event.type === "message_reply" ? event.messageReply.senderID : senderID;
	
	try {
		const res = await api.getUserInfoV2(uid);
		let getAvatar = (await axios.get(`https://graph.facebook.com/${uid}/picture?width=1500&height=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
			responseType: 'arraybuffer'
		})).data;
		
		let bg = (await axios.get("https://i.ibb.co/xq3jLQm/Picsart-22-08-15-23-51-29-721.jpg", {
			responseType: "arraybuffer"
		})).data;
		
		fs.writeFileSync(pathAvata, Buffer.from(getAvatar, 'utf-8'));
		let avataruser = await this.circle(pathAvata);
		fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

		if (!fs.existsSync(__dirname + fonts)) {
			let getfont = (await axios.get(downfonts, { responseType: "arraybuffer" })).data;
			fs.writeFileSync(__dirname + fonts, Buffer.from(getfont, "utf-8"));
		}

		let baseImage = await loadImage(pathImg);
		let baseAvata = await loadImage(avataruser);
		let canvas = createCanvas(baseImage.width, baseImage.height);
		let ctx = canvas.getContext("2d");
		
		ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(baseAvata, 53, 35, 85, 85);
		
		ctx.font = "400 18px Arial";
		ctx.fillStyle = "#000000";
		ctx.textAlign = "start";
		let fontSize = 50;
		while (ctx.measureText(text).width > 1600) {
			fontSize--;
			ctx.font = `400 ${fontSize}px Arial`;
		}
		const lines = await this.wrapText(ctx, text, 650);
		ctx.fillText(lines.join('\n'), 56, 180);
		
		Canvas.registerFont(__dirname + fonts, { family: "Play-Bold" });
		ctx.font = `bold 400 14px Arial, sans-serif`;
		ctx.fillStyle = "#3A3B3C";
		ctx.textAlign = "start";
		ctx.fillText(`${res.name}`, 153, 99);
		
		const imageBuffer = canvas.toBuffer();
		fs.writeFileSync(pathImg, imageBuffer);
		fs.removeSync(pathAvata);
		
		return api.sendMessage({
			body: "✅ 𝑻𝒘𝒆𝒆𝒕 𝒄𝒓𝒆𝒂𝒕𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚! 🐦",
			attachment: fs.createReadStream(pathImg)
		}, threadID, () => fs.unlinkSync(pathImg), messageID);
		
	} catch (error) {
		console.log(error);
		return api.sendMessage("❌ 𝑬𝒓𝒓𝒐𝒓 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒊𝒎𝒂𝒈𝒆", threadID, messageID);
	}
};
