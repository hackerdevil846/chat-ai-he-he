const fs = require("fs");
module.exports.config = {
	name: "𝑵𝒊𝒈𝒉𝒕",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", 
	description: "𝑮𝒐𝒐𝒅 𝒏𝒊𝒈𝒉𝒕 𝒘𝒊𝒔𝒉𝒆𝒓 𝒂𝒖𝒕𝒐-𝒓𝒆𝒔𝒑𝒐𝒏𝒔𝒆",
	commandCategory: "𝒏𝒐 𝒑𝒓𝒆𝒇𝒊𝒙",
	usages: "𝑵𝒊𝒈𝒉𝒕",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	const triggers = [
		"Good night", "good night", "Gud night", "Gud nini",
		"Shuvo ratri", "shuvo ratri", "Shubho ratri", "shubho ratri",
		"Ratri shuvo", "ratri shuvo", "Bhalo ratri", "bhalo ratri"
	];
	
	if (triggers.some(trigger => event.body.toLowerCase().includes(trigger.toLowerCase()))) {
		var msg = {
				body: "𝑺𝒉𝒖𝒗𝒐 𝒓𝒂𝒕𝒓𝒊 🌉✨ 𝑩𝒊𝒅𝒂 𝒏𝒆𝒊 💫🥀 𝑺𝒉𝒖𝒏𝒅𝒐𝒓 𝒔𝒉𝒐𝒑𝒏𝒐 😴",
				attachment: fs.createReadStream(__dirname + `/cache/night.jpg`)
			}
			api.sendMessage(msg, threadID, messageID);
    	api.setMessageReaction("😴", event.messageID, (err) => {}, true);
	}
}

module.exports.run = function({ api, event, client, __GLOBAL }) {
  // No additional code needed here
}
