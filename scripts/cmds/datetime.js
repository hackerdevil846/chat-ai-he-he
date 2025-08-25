const moment = require('moment-timezone');

module.exports.config = {
	name: "datetime",
	version: "2.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🇧🇩 Show beautiful Bangladesh date and time with additional information",
	category: "utility",
	usages: "[datetime | bdtime | timebd]",
	cooldowns: 5,
	dependencies: {
		"moment-timezone": ""
	},
	envConfig: {
		timezone: "Asia/Dhaka"
	}
};

module.exports.onStart = async function ({ api, event, args }) {
	try {
		const bdTime = moment.tz("Asia/Dhaka");
		const date = bdTime.format("DD MMMM YYYY");
		const day = bdTime.format("dddd");
		const time = bdTime.format("hh:mm:ss A");
		const week = bdTime.week();
		const dayOfYear = bdTime.dayOfYear();
		const daysLeft = 365 - dayOfYear;
		
		const response = `✨ 𝗕𝗔𝗡𝗚𝗟𝗔𝗗𝗘𝗦𝗛 𝗧𝗜𝗠𝗘 𝗜𝗡𝗙𝗢 ✨
		
📅 𝗗𝗔𝗧𝗘: ${date}
🗓️ 𝗗𝗔𝗬: ${day}
⏰ 𝗧𝗜𝗠𝗘: ${time}
		
📊 𝗪𝗘𝗘𝗞 𝗡𝗨𝗠𝗕𝗘𝗥: ${week}
🌤️ 𝗗𝗔𝗬 𝗢𝗙 𝗬𝗘𝗔𝗥: ${dayOfYear}
⏳ 𝗗𝗔𝗬𝗦 𝗟𝗘𝗙𝗧: ${daysLeft}
		
🌏 𝗧𝗜𝗠𝗘𝗭𝗢𝗡𝗘: Asia/Dhaka (GMT+6)
🔮 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬: ${this.config.credits}
		
🇧🇩 𝗦𝗛𝗢𝗡𝗔𝗥 𝗕𝗔𝗡𝗚𝗟𝗔 𝗗𝗘𝗦𝗛 𝗧𝗜𝗠𝗘 🇧🇩`;

		return api.sendMessage({
			body: response,
		}, event.threadID, event.messageID);
	} 
	catch (error) {
		console.error("DateTime Error:", error);
		return api.sendMessage("❌ | An error occurred while fetching time data. Please try again later.", event.threadID, event.messageID);
	}
};

module.exports.handleEvent = async function ({ event, api }) {
	const lowerBody = event.body.toLowerCase();
	if (lowerBody.includes("time") && lowerBody.includes("bd")) {
		this.onStart({ api, event, args: [] });
	}
};
