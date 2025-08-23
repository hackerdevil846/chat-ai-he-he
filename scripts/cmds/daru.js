const fs = require("fs");

module.exports.config = {
	name: "daru",
	version: "1.1.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑫𝒂𝒓𝒖 𝒑𝒊𝒕𝒆 𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒃𝒉𝒂𝒍𝒐𝒃𝒂𝒔𝒉𝒂 💖",
	category: "noprefix",
	usages: "daru",
	cooldowns: 3,
	envConfig: {
		autoUnsend: true,
		unsendDelay: 60000
	}
};

module.exports.handleEvent = async function({ api, event }) {
	const { threadID, messageID, body } = event;
	const triggers = ["daru", "drink", "sharab", "party", "beer", "alcohol", "whisky", "vodka", "rum", "🍻", "🍺", "🍷"];
	
	if (triggers.some(trigger => body.toLowerCase().includes(trigger))) {
		const msg = {
			body: `🍻 𝑪𝒉𝒐𝒍𝒐 𝒎𝒊𝒍𝒂 𝒅𝒂𝒓𝒖 𝒌𝒉𝒂𝒊! 🥂\n` + 
				  `▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂\n` +
				  `🍷 𝑨𝒑𝒏𝒊 𝒑𝒆𝒉𝒍𝒆 𝒔𝒖𝒓𝒖 𝒌𝒐𝒓𝒆𝒏\n` +
				  `🍾 𝑨𝒎𝒊 𝒂𝒔𝒄𝒉𝒊 𝒕𝒉𝒊𝒌 𝒆𝒌𝒉𝒐𝒏𝒆\n` +
				  `▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂\n` +
				  `💖 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`,
			attachment: fs.createReadStream(__dirname + '/noprefix/daru.mp4')
		};
		
		api.sendMessage(msg, threadID, messageID);
		api.setMessageReaction("🍻", messageID, (err) => {}, true);
	}
};

module.exports.run = function({ api, event }) {
	// No action needed for command call
};
