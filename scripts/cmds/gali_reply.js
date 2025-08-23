const fs = require("fs");

module.exports.config = {
	name: "gali",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑨𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄 𝒓𝒆𝒔𝒑𝒐𝒏𝒔𝒆 𝒕𝒐 𝒂𝒃𝒖𝒔𝒊𝒗𝒆 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔",
	category: "noprefix",
	usages: "[a𝒖𝒕𝒐𝒕𝒓𝒊𝒈𝒈𝒆𝒓]",
	cooldowns: 5,
	envConfig: {
		autoRespond: true
	}
};

module.exports.onLoad = function() {
	console.log("𝑮𝒂𝒍𝒊 𝒅𝒆𝒕𝒆𝒄𝒕𝒊𝒐𝒏 𝒎𝒐𝒅𝒖𝒍𝒆 𝒍𝒐𝒂𝒅𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚! 🛡️");
};

module.exports.handleEvent = function({ api, event }) {
	const triggers = [
		"fuck", "mc", "chod", "bal", "bc", "maa ki chut",
		"xod", "behen chod", "🖕", "madarchod", "chudi", "gala gali"
	];
	
	if (event.body && triggers.some(trigger => 
		event.body.toLowerCase().includes(trigger.toLowerCase()))) {
		
		const response = {
			body: "𝑩𝒐𝒔𝒔 𝑫𝒌, 𝑮𝒂𝒍𝒊 𝒌𝒆𝒏𝒐 𝒅𝒆𝒐? 𝑳𝒖𝒏𝒅 𝒌𝒂𝒕𝒌𝒆 𝒉𝒂𝒕𝒉 𝒆𝒓 𝒎𝒐𝒅𝒉𝒆 𝒓𝒂𝒌𝒉𝒃𝒐 😤",
			attachment: fs.createReadStream(__dirname + "/noprefix/gali.mp4")
		};
		
		api.sendMessage(response, event.threadID, event.messageID);
		api.setMessageReaction("😠", event.messageID, (err) => {}, true);
	}
};

module.exports.run = function({ api, event }) {
	api.sendMessage("🤖 𝑨𝒖𝒕𝒐 𝒈𝒂𝒍𝒊 𝒓𝒆𝒔𝒑𝒐𝒏𝒔𝒆 𝒔𝒚𝒔𝒕𝒆𝒎 𝒊𝒔 𝒂𝒄𝒕𝒊𝒗𝒆!\n- 𝑻𝒓𝒊𝒈𝒈𝒆𝒓 𝒘𝒐𝒓𝒅𝒔: fuck, mc, chod, bal, bc, etc...", event.threadID);
};
