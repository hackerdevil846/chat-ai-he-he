const fs = require("fs");
module.exports.config = {
	name: "women",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", 
	description: "𝑴𝒐𝒉𝒊𝒍𝒂𝒅𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒆𝒌𝒕𝒂 𝒇𝒖𝒏𝒏𝒚 𝒄𝒐𝒎𝒎𝒂𝒏𝒅",
	commandCategory: "no prefix",
	usages: "𝑾𝒐𝒎𝒆𝒏",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("Women")==0 || event.body.indexOf("women")==0 || event.body.indexOf("WOMEN")==0 || event.body.indexOf("☕")==0) {
		var msg = {
				body: "Hahaha Mohila 🤣☕",
				attachment: fs.createReadStream(__dirname + `/noprefix/wn.mp4`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("☕", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
