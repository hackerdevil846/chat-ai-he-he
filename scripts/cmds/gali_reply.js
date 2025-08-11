const fs = require("fs");
module.exports.config = {
	name: "gali",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", 
	description: "𝑷𝒓𝒆𝒇𝒊𝒙 𝒏𝒂𝒊", 
	commandCategory: "𝒏𝒐-𝒑𝒓𝒆𝒇𝒊𝒙", 
	usages: "𝒈𝒂𝒍𝒊", 
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	const triggers = [
		"fuck", "mc", "chod", "bal", "bc", "maa ki chut", 
		"xod", "behen chod", "🖕", "madarchod", "chudi", "gala gali"
	];
	
	if (triggers.some(trigger => event.body.toLowerCase().includes(trigger))) {
		var msg = {
			body: "𝑩𝒐𝒔𝒔 𝑫𝒌, 𝑮𝒂𝒍𝒊 𝒌𝒆𝒏𝒐 𝒅𝒆𝒐? 𝑳𝒖𝒏𝒅 𝒌𝒂𝒕𝒌𝒆 𝒉𝒂𝒕𝒉 𝒆𝒓 𝒎𝒐𝒅𝒉𝒆 𝒓𝒂𝒌𝒉𝒃𝒐 😤",
			attachment: fs.createReadStream(__dirname + "/noprefix/gali.mp4")
		}
		api.sendMessage(msg, threadID, messageID);
    	api.setMessageReaction("😠", event.messageID, (err) => {}, true);
	}
}

module.exports.run = function({ api, event, client, __GLOBAL }) {
  // 𝑲𝒐𝒏𝒐 𝒂𝒄𝒕𝒊𝒐𝒏 𝒏𝒂𝒊
}
