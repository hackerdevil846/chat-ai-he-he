const fs = require("fs");
module.exports.config = {
	name: "fyoutoo",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", 
	description: "𝑭𝒖𝒄𝒌 𝒚𝒐𝒖 𝒕𝒐𝒐 𝒓𝒆𝒔𝒑𝒐𝒏𝒔𝒆",
	commandCategory: "𝒏𝒐-𝒑𝒓𝒆𝒇𝒊𝒙",
	usages: "𝒇𝒖𝒄𝒌",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	const triggers = [
		"fuck", "Fuck", "fuck you", "Fuck you", 
		"pakyu", "Pakyu", "pak you", "Pak you", 
		"pak u", "Pak u", "pak yu", "Pak yu"
	];
	
	if (triggers.some(trigger => event.body.toLowerCase().includes(trigger.toLowerCase()))) {
		var msg = {
				body: "𝑻𝒖𝒎𝒂𝒌𝒆𝒐 𝒇𝒖𝒄𝒌 𝒌𝒐𝒓𝒊 😏",
				attachment: fs.createReadStream(__dirname + `/noprefix/fuck.gif`)
			}
		api.sendMessage(msg, threadID, messageID);
		api.setMessageReaction("😏", event.messageID, (err) => {}, true);
	}
}

module.exports.run = function({ api, event, client, __GLOBAL }) {
  // 𝒏𝒐 𝒂𝒄𝒕𝒊𝒐𝒏 𝒏𝒆𝒆𝒅𝒆𝒅
}
