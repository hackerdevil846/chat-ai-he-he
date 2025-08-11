const fs = require("fs");
module.exports.config = {
	name: "vineboom",
    version: "1.1.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", 
	description: "𝑽𝒊𝒏𝒆 𝑩𝒐𝒐𝒎 𝒔𝒐𝒖𝒏𝒅 𝒆𝒇𝒇𝒆𝒄𝒕",
	commandCategory: "𝑵𝒐 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒏𝒆𝒆𝒅𝒆𝒅",
	usages: "𝒗𝒊𝒏𝒆𝒃𝒐𝒐𝒎",
    cooldowns: 3, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
  	const botID = api.getCurrentUserID();
  	const triggerWords = [
    	"vineboom", "Vineboom", "vine boom", "Vine boom",
    	"therock", "Therock", "the rock", "The Rock",
    	"darock", "Darock", "dwaynejohnson", "Dwaynejohnson"
  	];
  
	if (triggerWords.some(word => event.body.toLowerCase().includes(word.toLowerCase())) {
    	if (event.senderID === botID) return;
    	
    	const msg = {
        	body: "🤨",
        	attachment: fs.createReadStream(__dirname + '/noprefix/vineboom.gif')
      	};
      	
    	api.sendMessage(msg, threadID, messageID);
    	api.setMessageReaction("🤨", event.messageID, (err) => {
        	if (err) console.error("𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒔𝒆𝒕 𝒓𝒆𝒂𝒄𝒕𝒊𝒐𝒏", err);
      	}, true);
	}
}

module.exports.run = function({ api, event, client, __GLOBAL }) {
  // 𝑬𝒎𝒑𝒕𝒚 𝒊𝒎𝒑𝒍𝒆𝒎𝒆𝒏𝒕𝒂𝒕𝒊𝒐𝒏 𝒂𝒔 𝒑𝒆𝒓 𝒐𝒓𝒊𝒈𝒊𝒏𝒂𝒍
}
