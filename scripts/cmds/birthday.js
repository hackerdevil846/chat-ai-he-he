module.exports.config = {
	name: "bday",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑨𝒅𝒎𝒊𝒏'𝒔 𝒃𝒊𝒓𝒕𝒉𝒅𝒂𝒚 𝒄𝒐𝒖𝒏𝒕𝒅𝒐𝒘𝒏",
	usePrefix: false,
	commandCategory: "system",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"request": "",
		"fs-extra": ""
	}
};

module.exports.run = function({ api, event, args, Users, Threads, Currencies }) {
	const axios = global.nodemodule["axios"];
	const request = global.nodemodule["request"];
	const fs = global.nodemodule["fs-extra"];
	
	const t = Date.parse("June 27, 2024 00:00:00") - Date.parse(new Date());
	const seconds = Math.floor((t / 1000) % 60);
	const minutes = Math.floor((t / 1000 / 60) % 60);
	const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
	const days = Math.floor(t / (1000 * 60 * 60 * 24));
	
	const mathBoldItalic = text => text.replace(/[a-zA-Z]/g, char => 
		String.fromCodePoint(char.charCodeAt(0) + (char >= 'A' && char <= 'Z' 
			? 119808 - 65 
			: 119834 - 97) + char.charCodeAt(0)
	);
	
	const message = mathBoldItalic(
		`🎂 𝑨𝒅𝒎𝒊𝒏'𝒔 𝑩𝒊𝒓𝒕𝒉𝒅𝒂𝒚 𝑪𝒐𝒖𝒏𝒕𝒅𝒐𝒘𝒏:\n\n` +
		`📆 ${days} 𝒅𝒂𝒚𝒔\n` +
		`⏰ ${hours} 𝒉𝒐𝒖𝒓𝒔\n` +
		`⏱️ ${minutes} 𝒎𝒊𝒏𝒖𝒕𝒆𝒔\n` +
		`⏲️ ${seconds} 𝒔𝒆𝒄𝒐𝒏𝒅𝒔\n\n` +
		"𝑩𝒆𝒔𝒕 𝒘𝒊𝒔𝒉𝒆𝒔 𝒇𝒓𝒐𝒎 𝒂𝒍𝒍 𝒎𝒆𝒎𝒃𝒆𝒓𝒔! ❤️"
	);
	
	const callback = () => api.sendMessage({
		body: message,
		attachment: fs.createReadStream(__dirname + "/cache/1.png")
	}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));
	
	return request(encodeURI(`https://graph.facebook.com/100037743553265/picture?height=720&width=720&access_token=66262`))
		.pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
		.on('close', () => callback());
};
