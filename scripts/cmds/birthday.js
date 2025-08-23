const fs = require("fs-extra");
const request = require("request");
const axios = require("axios");

module.exports.config = {
	name: "bday",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑨𝒅𝒎𝒊𝒏'𝒔 𝒃𝒊𝒓𝒕𝒉𝒅𝒂𝒚 𝒄𝒐𝒖𝒏𝒕𝒅𝒐𝒘𝒏",
	usePrefix: false,
	category: "system",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"request": "",
		"fs-extra": ""
	}
};

module.exports.run = function ({ api, event }) {
	const targetDate = Date.parse("June 27, 2024 00:00:00");
	const now = Date.parse(new Date());
	const t = targetDate - now;

	if (t <= 0) {
		return api.sendMessage("🎉 আজকে Admin এর Birthday! শুভ জন্মদিন 🎂❤️", event.threadID, event.messageID);
	}

	const seconds = Math.floor((t / 1000) % 60);
	const minutes = Math.floor((t / 1000 / 60) % 60);
	const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
	const days = Math.floor(t / (1000 * 60 * 60 * 24));

	// সুন্দর Bold Italic ফন্ট কনভার্টার
	const mathBoldItalic = text => {
		return text.replace(/[a-zA-Z]/g, char => {
			const code = char.charCodeAt(0);
			if (char >= 'A' && char <= 'Z') {
				return String.fromCodePoint(0x1D468 + (code - 65));
			} else if (char >= 'a' && char <= 'z') {
				return String.fromCodePoint(0x1D482 + (code - 97));
			}
			return char;
		});
	};

	const message = 
		`🎂 ${mathBoldItalic("Admin's Birthday Countdown")} 🎂\n\n` +
		`📆 ${days} days\n` +
		`⏰ ${hours} hours\n` +
		`⏱️ ${minutes} minutes\n` +
		`⏲️ ${seconds} seconds\n\n` +
		`❤️ ${mathBoldItalic("Best wishes from all members!")} ❤️`;

	const callback = () => api.sendMessage({
		body: message,
		attachment: fs.createReadStream(__dirname + "/cache/1.png")
	}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));

	// Avatar fetch (Link untouched)
	return request(encodeURI(`https://graph.facebook.com/100037743553265/picture?height=720&width=720&access_token=66262`))
		.pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
		.on('close', () => callback());
};
