const fs = require("fs");
const path = require("path");

module.exports.config = {
	name: "vineboom",
	version: "1.1.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🔊 𝑽𝒊𝒏𝒆 𝑩𝒐𝒐𝒎 𝒔𝒐𝒖𝒏𝒅 𝒆𝒇𝒇𝒆𝒄𝒕",
	category: "noprefix",
	usages: "[trigger_words]",
	cooldowns: 3,
	envConfig: {
		audioPath: path.join(__dirname, 'noprefix/vineboom.gif')
	}
};

module.exports.handleEvent = function({ api, event }) {
	const { threadID, messageID, senderID } = event;
	const botID = api.getCurrentUserID();
	
	if (senderID === botID) return;
	
	const triggerWords = [
		"vineboom", "vine boom", "therock", 
		"the rock", "darock", "dwaynejohnson"
	];
	
	if (triggerWords.some(word => 
		event.body?.toLowerCase().includes(word.toLowerCase())
	)) {
		const msg = {
			body: "🤨",
			attachment: fs.createReadStream(this.config.envConfig.audioPath)
		};
		
		api.sendMessage(msg, threadID, messageID);
		api.setMessageReaction("🤨", messageID, (err) => {}, true);
	}
};

module.exports.onStart = function({ api, event }) {
	api.sendMessage("✨ 𝑻𝒉𝒊𝒔 𝒊𝒔 𝒂𝒏 𝒂𝒖𝒕𝒐-𝒕𝒓𝒊𝒈𝒈𝒆𝒓𝒆𝒅 𝒄𝒐𝒎𝒎𝒂𝒏𝒅\n\n𝑱𝒖𝒔𝒕 𝒕𝒚𝒑𝒆: '𝒗𝒊𝒏𝒆𝒃𝒐𝒐𝒎' 𝒐𝒓 '𝒕𝒉𝒆 𝒓𝒐𝒄𝒌' 𝒊𝒏 𝒄𝒉𝒂𝒕!", event.threadID);
};
