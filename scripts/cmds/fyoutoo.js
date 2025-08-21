const fs = require("fs");
const path = require("path");

module.exports.config = {
	name: "fyoutoo",
	version: "1.0.1", 
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑭𝒖𝒄𝒌 𝒚𝒐𝒖 𝒕𝒐𝒐 𝒓𝒆𝒔𝒑𝒐𝒏𝒔𝒆 🖕",
	commandCategory: "𝒏𝒐-𝒑𝒓𝒆𝒇𝒊𝒙",
	usages: "𝒇𝒖𝒄𝒌",
	cooldowns: 5,
	envConfig: {
		// Environment configuration (if needed)
	}
};

module.exports.handleEvent = function({ api, event }) {
	const { threadID, messageID } = event;
	
	// Define trigger words
	const triggers = [
		"fuck", "Fuck", "fuck you", "Fuck you", 
		"pakyu", "Pakyu", "pak you", "Pak you", 
		"pak u", "Pak u", "pak yu", "Pak yu",
		"f*ck", "F*ck", "f*ck you", "F*ck you"
	];
	
	// Check if message contains any trigger word
	if (event.body && triggers.some(trigger => 
		event.body.toLowerCase().includes(trigger.toLowerCase()))) {
		
		// Create response
		const response = {
			body: "𝑻𝒖𝒎𝒂𝒌𝒆𝒐 𝒇𝒖𝒄𝒌 𝒌𝒐𝒓𝒊 😏",
			attachment: fs.createReadStream(path.join(__dirname, "noprefix", "fuck.gif"))
		};
		
		// Send response
		api.sendMessage(response, threadID, messageID);
		
		// Add reaction
		api.setMessageReaction("😏", messageID, (err) => {
			if (err) console.error("Error setting reaction:", err);
		}, true);
	}
};

module.exports.run = function({ api, event }) {
	// This command is event-based only, no run functionality needed
	api.sendMessage("⚠️ This command is triggered automatically when someone says specific words.", event.threadID, event.messageID);
};
