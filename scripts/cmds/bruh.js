const fs = require("fs");

module.exports.config = {
	name: "bruh",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", 
	description: "𝑩𝒓𝒖𝒉 𝒔𝒐𝒖𝒏𝒅 𝒆𝒇𝒇𝒆𝒄𝒕",
	commandCategory: "𝑵𝒐-𝒑𝒓𝒆𝒇𝒊𝒙 𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔",
	usages: "𝑩𝒓𝒖𝒉",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
    let bot = global.config.OTHERBOT;
	
	if (
        (event.body.indexOf("bruh") == 0 || 
        event.body.indexOf("Bruh") == 0) &&
        !bot.includes(event.senderID)
    ) {
		var msg = {
				body: "𝑩𝒓𝒖𝒉 𝑩𝒓𝒖𝒖𝒉 😏",
				attachment: fs.createReadStream(__dirname + "/noprefix/xxx.mp3")
			};
		api.sendMessage(msg, threadID, messageID);
	}
}

module.exports.run = function({ api, event, client, __GLOBAL }) {
  // 𝑵𝒐 𝒂𝒄𝒕𝒊𝒐𝒏 𝒏𝒆𝒆𝒅𝒆𝒅
}
