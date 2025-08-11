const fs = require("fs");
module.exports.config = {
	name: "wednesday",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", 
	description: "𝑾𝒆𝒅𝒏𝒆𝒔𝒅𝒂𝒚 𝒍𝒊𝒌𝒉𝒍𝒆 𝒆𝒌𝒕𝒊 𝒗𝒊𝒅𝒆𝒐 𝒑𝒂𝒕𝒉𝒂𝒃𝒆",
	commandCategory: "no prefix",
	usages: "𝒘𝒆𝒅𝒏𝒆𝒔𝒅𝒂𝒚",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("Wednesday")==0 || event.body.indexOf("wednesday")==0 || event.body.indexOf("Wednesday")==0 || event.body.indexOf("wednesday")==0) {
		var msg = {
				body: "𝑾𝒆𝒅𝒏𝒆𝒔𝒅𝒂𝒚 🧛🏻‍♀️",
				attachment: fs.createReadStream(__dirname + `/noprefix/wednesday.mp4`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🧛🏻‍♀️", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
