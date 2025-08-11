module.exports.config = {
	name: "banner",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑶𝒏𝒆𝒌 𝒈𝒖𝒍𝒐 𝒄𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓 𝒅𝒊𝒚𝒆 𝒃𝒂𝒏𝒏𝒆𝒓 𝒕𝒐𝒊𝒓𝒊 𝒌𝒐𝒓𝒆",
	commandCategory: "game",
	usages: "{𝒏𝒖𝒎𝒃𝒆𝒓}|{𝒏𝒂𝒎𝒆𝟭}|{𝒏𝒂𝒎𝒆𝟮}|{𝒏𝒂𝒎𝒆𝟯}|{𝒄𝒐𝒍𝒐𝒓}",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
	// 𝑯𝒆𝒍𝒑𝒆𝒓 𝒇𝒖𝒏𝒄𝒕𝒊𝒐𝒏 𝒕𝒐 𝒄𝒐𝒏𝒗𝒆𝒓𝒕 𝒕𝒆𝒙𝒕 𝒕𝒐 𝑴𝒂𝒕𝒉𝒆𝒎𝒂𝒕𝒊𝒄𝒂𝒍 𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄
	const toMathBoldItalic = (text) => {
		const map = {
			'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆',
			'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋',
			'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐',
			'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕',
			'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
			'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬',
			'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱',
			'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶',
			'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻',
			'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁'
		};
		return text.replace(/[a-zA-Z]/g, char => map[char] || char);
	};

	// 𝑷𝒂𝒓𝒔𝒆 𝒊𝒏𝒑𝒖𝒕 𝒂𝒓𝒈𝒖𝒎𝒆𝒏𝒕𝒔
	const inputs = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|");
	const text1 = inputs[0] || "21";
	const text2 = inputs[1] || "";
	const text3 = inputs[2] || "";
	const text4 = inputs[3] || "";
	const color = inputs[4] || "";
	
	try {
		const { loadImage, createCanvas } = require("canvas");
		const fs = require('fs');
		const request = require('request');
		const path = require('path');
		const axios = require('axios');
		
		// 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒄𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓 𝒅𝒂𝒕𝒂
		const lengthchar = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864')).data;
		
		// 𝑽𝒂𝒍𝒊𝒅𝒂𝒕𝒆 𝒄𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓 𝒏𝒖𝒎𝒃𝒆𝒓
		const charNum = parseInt(text1);
		if (isNaN(charNum) || charNum < 1 || charNum > lengthchar.length) {
			const errorMsg = toMathBoldItalic(`𝑴𝒂𝒂𝒇 𝒌𝒐𝒓𝒖𝒏, 𝒂𝒑𝒏𝒂𝒓 𝒅𝒆𝒐𝒘𝒂 𝒏𝒖𝒎𝒃𝒆𝒓 𝒕𝒊 𝒕𝒉𝒊𝒌 𝒏𝒆𝒊. 𝑫𝒂𝒚𝒂 𝒌𝒐𝒓𝒆 1 𝒕𝒉𝒆𝒌𝒆 ${lengthchar.length} 𝒆𝒓 𝒎𝒐𝒅𝒅𝒉𝒆 𝒆𝒌𝒕𝒂 𝒏𝒖𝒎𝒃𝒆𝒓 𝒅𝒊𝒏.`);
			return api.sendMessage(errorMsg, event.threadID, event.messageID);
		}
		
		const Canvas = require('canvas');
		let pathImg = __dirname + `/tad/avatar_1.png`;
		let pathAva = __dirname + `/tad/avatar_2.png`;
		
		// 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒄𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓 𝒊𝒎𝒂𝒈𝒆
		let avtAnime = (await axios.get(encodeURI(lengthchar[charNum - 1].imgAnime), { responseType: "arraybuffer" })).data;
		fs.writeFileSync(pathAva, Buffer.from(avtAnime, "utf-8"));
		
		// 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒃𝒂𝒄𝒌𝒈𝒓𝒐𝒖𝒏𝒅
		let background = (await axios.get(encodeURI(`https://imgur.com/Ch778s2.png`), { responseType: "arraybuffer" })).data;
		fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));
		
		// 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒇𝒐𝒏𝒕𝒔 𝒊𝒇 𝒎𝒊𝒔𝒔𝒊𝒏𝒈
		const fontFiles = {
			'PastiOblique-7B0wK.otf': 'https://github.com/hanakuUwU/font/raw/main/PastiOblique-7B0wK.otf',
			'gantellinesignature-bw11b.ttf': 'https://github.com/hanakuUwU/font/raw/main/gantellinesignature-bw11b.ttf',
			'UTM Bebas.ttf': 'https://github.com/hanakuUwU/font/blob/main/UTM%20Bebas.ttf?raw=true'
		};
		
		for (const [fontName, fontUrl] of Object.entries(fontFiles)) {
			const fontPath = __dirname + `/tad/${fontName}`;
			if (!fs.existsSync(fontPath)) {
				const fontData = (await axios.get(fontUrl, { responseType: "arraybuffer" })).data;
				fs.writeFileSync(fontPath, Buffer.from(fontData, "utf-8"));
			}
		}
		
		// 𝑺𝒆𝒕 𝒃𝒂𝒄𝒌𝒈𝒓𝒐𝒖𝒏𝒅 𝒄𝒐𝒍𝒐𝒓
		const color_ = (color === "no" || color === "No" || color === "") 
			? lengthchar[charNum - 1].colorBg 
			: color;
		
		let a = await loadImage(pathImg);
		let ab = await loadImage(pathAva);
		let canvas = createCanvas(a.width, a.height);
		let ctx = canvas.getContext("2d");
		
		// 𝑫𝒓𝒂𝒘 𝒃𝒂𝒄𝒌𝒈𝒓𝒐𝒖𝒏𝒅
		ctx.fillStyle = "#e6b030";
		ctx.drawImage(a, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(ab, 1500, -400, 1980, 1980);
		
		// 𝑹𝒆𝒈𝒊𝒔𝒕𝒆𝒓 𝒇𝒐𝒏𝒕𝒔
		Canvas.registerFont(__dirname + `/tad/PastiOblique-7B0wK.otf`, { family: "Pasti" });
		Canvas.registerFont(__dirname + `/tad/gantellinesignature-bw11b.ttf`, { family: "Gantelline" });
		Canvas.registerFont(__dirname + `/tad/UTM Bebas.ttf`, { family: "Bebas" });
		
		// 𝑫𝒓𝒂𝒘 𝒕𝒆𝒙𝒕 1
		ctx.textAlign = "start";
		ctx.fillStyle = color_;
		ctx.font = "370px Pasti";
		ctx.fillText(text2, 500, 750);
		
		// 𝑫𝒓𝒂𝒘 𝒕𝒆𝒙𝒕 2
		ctx.textAlign = "start";
		ctx.fillStyle = "#fff";
		ctx.font = "350px Gantelline";
		ctx.fillText(text3, 500, 680);
		
		// 𝑫𝒓𝒂𝒘 𝒕𝒆𝒙𝒕 3
		ctx.save();
		ctx.textAlign = "end";
		ctx.fillStyle = "#f56236";
		ctx.font = "145px Pasti";
		ctx.fillText(text4, 2100, 870);
		
		// 𝑺𝒂𝒗𝒆 𝒊𝒎𝒂𝒈𝒆
		const imageBuffer = canvas.toBuffer();
		fs.writeFileSync(pathImg, imageBuffer);
		
		// 𝑺𝒆𝒏𝒅 𝒓𝒆𝒔𝒖𝒍𝒕
		return api.sendMessage({
			body: toMathBoldItalic("𝑨𝒑𝒏𝒂𝒓 𝒃𝒂𝒏𝒏𝒆𝒓 𝒕𝒂𝒊𝒓𝒊 𝒉𝒐𝒚𝒆 𝒈𝒆𝒄𝒉𝒆! 𝑵𝒊𝒄𝒉𝒆 𝒅𝒆𝒌𝒉𝒖𝒏:"),
			attachment: fs.createReadStream(pathImg)
		}, event.threadID, () => {
			fs.unlinkSync(pathImg);
			fs.unlinkSync(pathAva);
		}, event.messageID);
		
	} catch (error) {
		console.error(error);
		const errorMsg = toMathBoldItalic("𝑴𝒂𝒂𝒇 𝒌𝒐𝒓𝒖𝒏, 𝒃𝒂𝒏𝒏𝒆𝒓 𝒃𝒂𝒏𝒂𝒕𝒆 𝒔𝒐𝒎𝒐𝒚 𝒑𝒓𝒐𝒃𝒍𝒆𝒎 𝒉𝒐𝒚𝒆𝒄𝒉𝒆. 𝑨𝒃𝒂𝒓 𝒄𝒉𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏.");
		return api.sendMessage(errorMsg, event.threadID, event.messageID);
	}
};
