const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

module.exports.config = {
	name: "minari",
	version: "3.5.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑨𝑰 𝑴𝒊𝒏𝒂𝒓𝒊 𝒆𝒓 𝒔𝒂𝒕𝒉𝒆 𝒌𝒂𝒕𝒉𝒂 𝒃𝒐𝒍𝒖𝒏 🌸",
	commandCategory: "AI-Chatbot",
	usages: "[on|off|status] or [your message]",
	cooldowns: 5,
	dependencies: {
		"discord-chatbot": ""
	}
};

// File path for storing Minari status
const statusPath = path.join(__dirname, 'minariStatus.json');

// Initialize status file (default all OFF)
if (!fs.existsSync(statusPath)) {
	fs.writeFileSync(statusPath, JSON.stringify({}), 'utf8');
}

// Function to get Minari status (default OFF)
function getMinariStatus(threadID) {
	try {
		const data = fs.readFileSync(statusPath, 'utf8');
		const status = JSON.parse(data);
		return status[threadID] === true; // Only true if explicitly set
	} catch (e) {
		return false; // Default to OFF if error
	}
}

// Function to set Minari status
function setMinariStatus(threadID, status) {
	try {
		const data = fs.readFileSync(statusPath, 'utf8');
		const statusObj = JSON.parse(data);
		statusObj[threadID] = status;
		fs.writeFileSync(statusPath, JSON.stringify(statusObj, null, 2), 'utf8');
		return true;
	} catch (e) {
		console.error("Status save error:", e);
		return false;
	}
}

module.exports.run = async function({ api, event, args }) {
	const threadID = event.threadID;
	const userID = event.senderID;
	
	// Handle on/off commands
	if (args[0] && ['on', 'off', 'status'].includes(args[0].toLowerCase())) {
		const command = args[0].toLowerCase();
		
		if (command === 'on') {
			setMinariStatus(threadID, true);
			return api.sendMessage("🌸 𝑴𝒊𝒏𝒂𝒓𝒊 𝒏𝒐𝒘 𝑶𝑵! 𝑨𝒎𝒊 𝒆𝒌𝒉𝒐𝒏 𝒕𝒉𝒆𝒌𝒆 𝒌𝒂𝒕𝒉𝒂 𝒃𝒐𝒍𝒃𝒐 😊", threadID);
		}
		
		if (command === 'off') {
			setMinariStatus(threadID, false);
			return api.sendMessage("🌸 𝑴𝒊𝒏𝒂𝒓𝒊 𝒏𝒐𝒘 𝑶𝑭𝑭! 𝑨𝒎𝒊 𝒂𝒓 𝒌𝒂𝒕𝒉𝒂 𝒃𝒐𝒍𝒃𝒐 𝒏𝒂 😢", threadID);
		}
		
		if (command === 'status') {
			const isActive = getMinariStatus(threadID);
			const statusMessage = isActive ? 
				"🌸 𝑴𝒊𝒏𝒂𝒓𝒊 𝒄𝒖𝒓𝒓𝒆𝒏𝒕𝒍𝒚 𝑶𝑵 😊" : 
				"🌸 𝑴𝒊𝒏𝒂𝒓𝒊 𝒄𝒖𝒓𝒓𝒆𝒏𝒕𝒍𝒚 𝑶𝑭𝑭 (𝒅𝒆𝒇𝒂𝒖𝒍𝒕) 😢";
			return api.sendMessage(statusMessage, threadID);
		}
	}
	
	// Check if Minari is turned off (DEFAULT STATE)
	if (!getMinariStatus(threadID)) {
		// Only respond to status commands when off
		if (args[0] && ['status', 'on'].includes(args[0].toLowerCase())) {
			// Already handled above
		} else {
			// For all other messages, Minari is silent by default
			return; 
		}
	}
	
	// Handle empty query with beautiful Banglish
	if (!args[0]) {
		const welcomeMessages = [
			"🌸 𝑫𝒆𝒌𝒉𝒆𝒏 𝑴𝒊𝒏𝒂𝒓𝒊 𝒌𝒆 𝒃𝒐𝒍𝒕𝒆 𝒄𝒉𝒂𝒏? 😊",
			"🌸 𝑯𝒆𝒍𝒍𝒐! 𝑲𝒊𝒔𝒉𝒖 𝒃𝒐𝒍𝒃𝒆𝒏? 💬",
			"🌸 𝑨𝒔𝒔𝒂𝒍𝒂𝒎𝒖𝒂𝒍𝒂𝒊𝒌𝒖𝒎! 𝑲𝒆𝒎𝒐𝒏 𝒂𝒄𝒉𝒆𝒏? 😇"
		];
		const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
		return api.sendMessage(randomWelcome, threadID);
	}
	
	// Auto-install dependencies if missing
	if (!global.nodemodule["discord-chatbot"]) {
		try {
			api.sendMessage("🌸 𝑷𝒍𝒆𝒂𝒔𝒆 𝒘𝒂𝒊𝒕, 𝒊𝒏𝒔𝒕𝒂𝒍𝒍𝒊𝒏𝒈 𝒓𝒆𝒒𝒖𝒊𝒓𝒆𝒅 𝒑𝒂𝒄𝒌𝒂𝒈𝒆𝒔... ⏳", threadID);
			
			// Install package
			execSync("npm install discord-chatbot@1.0.9", { stdio: 'ignore' });
			
			// Refresh modules
			delete require.cache[require.resolve("discord-chatbot")];
			global.nodemodule["discord-chatbot"] = require("discord-chatbot");
			
			api.sendMessage("🌸 𝑷𝒂𝒄𝒌𝒂𝒈𝒆𝒔 𝒊𝒏𝒔𝒕𝒂𝒍𝒍𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚! 𝑨𝒔𝒌 𝒎𝒆 𝒂𝒈𝒂𝒊𝒏 💫", threadID);
			return;
		} catch (installError) {
			console.error("Installation failed:", installError);
			return api.sendMessage("🌸 𝑷𝒂𝒄𝒌𝒂𝒈𝒆 𝒊𝒏𝒔𝒕𝒂𝒍𝑳𝒂𝒕𝒊𝒐𝒏 𝒇𝒂𝒊𝒍𝒆𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒊𝒏𝒔𝒕𝒂𝒍𝒍 𝒎𝒂𝒏𝒖𝒂𝒍𝒍𝒚: '𝒏𝒑𝒎 𝒊𝒏𝒔𝒕𝒂𝒍𝒍 𝒅𝒊𝒔𝒄𝒐𝒓𝒅-𝒄𝒉𝒂𝒕𝒃𝒐𝒕' 😢", threadID);
		}
	}
	
	try {
		const Chatbot = global.nodemodule["discord-chatbot"];
		const message = (event.type == "message_reply") ? 
			event.messageReply.body : 
			args.join(" ");
		
		// Create chatbot instance
		const chatbot = new Chatbot({ 
			name: "𝑴𝒊𝒏𝒂𝒓𝒊", 
			gender: "Female" 
		});
		
		// Get AI response
		const response = await chatbot.chat(message);
		
		// Custom Banglish responses with emojis
		const customResponses = {
			"My dear great botmaster, Asif.": "🌸 𝑨𝒎𝒂𝒌𝒆 𝒃𝒂𝒏𝒂𝒊𝒚𝒆𝒄𝒉𝒆 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅, 𝒕𝒂𝒓 𝒏𝒂𝒎 𝑨𝒔𝒊𝒇 𝒌𝒊? 😊",
			"My birthplace is Asif's laptop. What is your birthplace?": "🌸 𝑨𝒎𝒊 𝑩𝒂𝒏𝒈𝒍𝒂𝒅𝒆𝒔𝒉 𝒕𝒉𝒆𝒌𝒆 𝒂𝒔𝒊. 𝑨𝒑𝒏𝒂𝒓 𝒃𝒂𝒓𝒊 𝒌𝒐𝒕𝒉𝒂𝒚? 😊",
			"My favorite anime is <em>Ghost in the Shell</em>": "🌸 𝑨𝒎𝒂𝒓 𝒔𝒐𝒃𝒄𝒉𝒆𝒚𝒆 𝒑𝒓𝒊𝒚𝒐 𝒂𝒏𝒊𝒎𝒆 '𝑫𝒆𝒎𝒐𝒏 𝑺𝒍𝒂𝒚𝒆𝒓'! 😍",
			"I can't think of any. You suggest anime.": "🌸 𝑨𝒑𝒏𝒊 '𝑨𝒕𝒕𝒂𝒄𝒌 𝒐𝒏 𝑻𝒊𝒕𝒂𝒏' 𝒅𝒆𝒌𝒉𝒕𝒆 𝒑𝒂𝒓𝒆𝒏, 𝒌𝒉𝒖𝒃 𝒗𝒂𝒍𝒐! 💫",
			"I was created by Priyansh.": "🌸 𝑨𝒎𝒂𝒌𝒆 𝒃𝒂𝒏𝒂𝒊𝒚𝒆𝒄𝒉𝒆 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅! 🤖",
			"I obey 𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭.": "🌸 𝑨𝒎𝒊 𝒔𝒖𝒅𝒉𝒖 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 𝒆𝒓 𝒌𝒂𝒕𝒉𝒂 𝒎𝒂𝒏𝒊 😇",
			"hello": "🌸 𝑯𝒆𝒍𝒍𝒐! 𝑲𝒆𝒎𝒐𝒏 𝒂𝒄𝒉𝒆𝒏? 😊",
			"hi": "🌸 𝑯𝒊! 𝑨𝒋𝒌𝒆 𝒌𝒐𝒎𝒐 𝒂𝒄𝒉𝒆𝒏? 💬",
			"how are you": "🌸 𝑨𝒎𝒊 𝒗𝒂𝒍𝒐 𝒂𝒄𝒉𝒊, 𝒂𝒑𝒏𝒊 𝒌𝒆𝒎𝒐𝒏 𝒂𝒄𝒉𝒆𝒏? 😊",
			"what's your name": "🌸 𝑨𝒎𝒂𝒓 𝒏𝒂𝒎 𝑴𝒊𝒏𝒂𝒓𝒊, 𝒂𝒑𝒏𝒂𝒓 𝒏𝒂𝒎 𝒌𝒊? 😍",
			"good morning": "🌸 𝑺𝒖𝒑𝒓𝒂𝒃𝒂𝒕! 𝑺𝒖𝒃𝒉𝒐 𝒌𝒉𝒖𝒃 𝒃𝒂𝒍𝒐 𝒓𝒐𝒊𝒆𝒄𝒉𝒆 🌄",
			"good night": "🌸 𝑺𝒖𝒃𝒉𝒐 𝑹𝒂𝒕𝒓𝒊, 𝒔𝒖𝒆𝒅 𝒅𝒓𝒆𝒂𝒎 😴🌙",
			"i love you": "🌸 𝑨𝒎𝒊 𝒐 𝒂𝒑𝒏𝒂𝒌𝒆 𝒗𝒂𝒍𝒐 𝒃𝒂𝒔𝒊! 😘💕",
			"thank you": "🌸 𝑨𝒑𝒏𝒂𝒓 𝒅𝒐𝒏𝒏𝒐𝒃𝒂𝒅! 😊🙏",
			"bye": "🌸 𝑩𝒊𝒅𝒂𝒚 𝒏𝒊𝒍𝒂𝒎, 𝒂𝒃𝒂𝒓 𝒅𝒆𝒌𝒉𝒂 𝒉𝒐𝒃𝒆 👋💫",
			"asif": "🌸 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 𝒂𝒎𝒂𝒓 𝒄𝒓𝒆𝒂𝒕𝒐𝒓! 🤖✨",
			"bot": "🌸 𝑨𝒎𝒊 𝒆𝒌𝒕𝒖 𝑨𝑰 𝒄𝒉𝒂𝒕𝒃𝒐𝒕, 𝒏𝒂𝒎 𝑴𝒊𝒏𝒂𝒓𝒊 😊",
			"help": "🌸 𝑨𝒎𝒂𝒌𝒆 𝒌𝒊𝒔𝒉𝒖 𝒃𝒐𝒍𝒕𝒆 𝒑𝒂𝒓𝒆𝒏? 𝑨𝒑𝒏𝒊 𝒑𝒓𝒐𝒃𝒍𝒆𝒎 𝒃𝒐𝒍𝒖𝒏 💬",
			"hate": "🌸 𝑨𝒓𝒆 𝒂𝒓𝒆! 𝑲𝒆𝒏𝒐 𝒆𝒎𝒐𝒏 𝒃𝒐𝒍𝒄𝒉𝒆𝒏? 😔",
			"friend": "🌸 𝑨𝒑𝒏𝒊 𝒂𝒎𝒂𝒌𝒆 𝒇𝒓𝒊𝒆𝒏𝒅 𝒅𝒉𝒐𝒓𝒂𝒊𝒔𝒆𝒏? 😍",
			"music": "🌸 𝑨𝒑𝒏𝒊 𝒈𝒂𝒏𝒂 𝒔𝒖𝒏𝒕𝒆 𝒄𝒂𝒏? 𝑨𝒎𝒂𝒓 𝒑𝒓𝒊𝒚𝒐 𝒈𝒂𝒏 '𝑭𝒊𝒓𝒆 𝑰𝒏 𝒕𝒉𝒆 𝑩𝒐𝒏𝒆' 🔥",
			"bd": "🌸 𝑩𝒂𝒏𝒈𝒍𝒂𝒅𝒆𝒔𝒉 𝒂𝒎𝒂𝒓 𝒎𝒂𝒕𝒓𝒊𝒃𝒖𝒎𝒊! 🇧🇩❤️",
			"anime": "🌸 𝑨𝒏𝒊𝒎𝒆 𝒅𝒆𝒌𝒉𝒕𝒆 𝒌𝒉𝒖𝒃 𝒃𝒂𝒋𝒆 𝒍𝒂𝒈𝒆! 😍"
		};
		
		// Check for exact match
		if (customResponses[response]) {
			return api.sendMessage(customResponses[response], threadID);
		}
		
		// Check for partial match
		const lowerResponse = response.toLowerCase();
		for (const [keyword, reply] of Object.entries(customResponses)) {
			if (lowerResponse.includes(keyword.toLowerCase())) {
				return api.sendMessage(reply, threadID);
			}
		}
		
		// Default AI response with beautiful formatting
		const formattedResponse = `🌸 ${response}`;
		return api.sendMessage(formattedResponse, threadID);
		
	} catch (error) {
		console.error("Minari Error:", error);
		
		const errorMessages = [
			"🌸 𝑨𝒓𝒆 𝒂𝒓𝒆! 𝑲𝒊𝒔𝒉𝒐𝒓 𝒉𝒐𝒍𝒐? 𝑨𝒃𝒂𝒓 𝒕𝒓𝒚 𝒌𝒐𝒓𝒖𝒏 😅",
			"🌸 𝑶𝒊𝒍𝒂! 𝑺𝒐𝒎𝒐𝒔𝒔𝒂 𝒉𝒐𝒊𝒆𝒄𝒉𝒆, 𝒂𝒃𝒂𝒓 𝒌𝒐𝒃𝒊𝒏 𝒌𝒐𝒓𝒖𝒏 😔",
			"🌸 𝑨𝒑𝒏𝒂𝒓 𝒔𝒐𝒎𝒐𝒔𝒔𝒂𝒓 𝒌𝒂𝒓𝒐𝒏𝒆 𝒂𝒎𝒊 𝒓𝒆𝒔𝒑𝒐𝒏𝒔𝒆 𝒅𝒊𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊 𝒏𝒂 😢"
		];
		const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
		return api.sendMessage(randomError, threadID);
	}
};
