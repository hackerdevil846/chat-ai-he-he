const fs = require("fs");
const moment = require("moment-timezone");

module.exports.config = {
	name: "night", // Command name in Bengali-styled font
	version: "1.0.2",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // Bengali-styled font
	description: "✨ 𝑨𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄 𝑮𝒐𝒐𝒅 𝑵𝒊𝒈𝒉𝒕 𝑾𝒊𝒔𝒉𝒆𝒓 ✨",
	commandCategory: "𝑵𝒐 𝑷𝒓𝒆𝒇𝒊𝒙", // Bengali-styled font
	usages: "𝑵𝒐𝒏𝒆 (𝑨𝒖𝒕𝒐-𝒓𝒆𝒔𝒑𝒐𝒏𝒔𝒆)", // Bengali-styled font
	cooldowns: 3,
	dependencies: {
		"moment-timezone": ""
	},
	envConfig: {
		timezone: "Asia/Dhaka"
	}
};

module.exports.handleEvent = async function({ api, event, __GLOBAL }) {
	const { threadID, messageID, body } = event;
	const triggers = [
		"Good night", "good night", "Gud night", "Gud nini",
		"Shuvo ratri", "shuvo ratri", "Shubho ratri", "shubho ratri",
		"Ratri shuvo", "ratri shuvo", "Bhalo ratri", "bhalo ratri",
		"শুভ রাত্রি", "শুভ রাত", "গুড নাইট", "গুড নাইট"
	];
	
	// Check if any trigger exists in the message
	const triggerFound = triggers.some(trigger => 
		body.toLowerCase().includes(trigger.toLowerCase())
	);
	
	if (triggerFound) {
		const now = moment().tz(__GLOBAL.timezone || "Asia/Dhaka");
		const hour = now.hour();
		
		// Only respond between 6PM to 5AM
		if (hour >= 18 || hour < 5) {
			const msg = {
				body: `🌙✨ 𝑺𝒉𝒖𝒗𝒐 𝒓𝒂𝒕𝒓𝒊 ${getRandomEmoji()} 𝑩𝒊𝒅𝒂 𝒏𝒆𝒊 💫\n\n"${getRandomQuote()}"`,
				attachment: fs.createReadStream(__dirname + "/cache/night.jpg")
			};
			
			api.sendMessage(msg, threadID, messageID);
			api.setMessageReaction("😴", messageID, (err) => {}, true);
		}
	}
};

// Helper functions
function getRandomEmoji() {
	const emojis = ["💤", "🌌", "🌠", "🛌", "🪔", "🌉", "🌃", "😴", "✨"];
	return emojis[Math.floor(Math.random() * emojis.length)];
}

function getRandomQuote() {
	const quotes = [
		"ঘুমন্ত রাতের স্বপ্নগুলো তোমার জন্য হোক সুখময়",
		"চাঁদ-তারা যেন তোমার জন্য রূপকথা বুনে",
		"সারাদিনের ক্লান্তি যেন রাতের বেলায় দূর হয়",
		"প্রতিটি রাত তোমার জীবনে বয়ে আনুক শান্তির পরশ",
		"স্বপ্নিল রাতের পরশে ঘুম হোক শান্তির",
		"রাতের আঁধারে ডানা মেলুক সুখের স্বপ্ন",
		"তোমার প্রতিটি রাত হোক শুভ আর সুন্দর",
		"নিশীথের তারা যেন তোমার জন্য আশীর্বাদ বয়ে আনে"
	];
	return quotes[Math.floor(Math.random() * quotes.length)];
}
