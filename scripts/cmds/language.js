module.exports.config = {
	name: "language",
	version: "1.0.1",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Change bot's language between Bengali and English",
	category: "system",
	usages: "[bn | en]",
	cooldowns: 5,
	envConfig: {
		defaultLanguage: "en"
	}
};

module.exports.languages = {
	"bn": {
		"success": "🤖 বটের ভাষা বাংলাতে পরিবর্তন করা হলো 🇧🇩"
	},
	"en": {
		"success": "🤖 Bot language changed to English 🇬🇧"
	}
}

module.exports.run = function({ api, event, args, getText }) {
	const { threadID, messageID } = event;

	if (!args[0]) {
		return api.sendMessage(
			`⚠️ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗨𝘀𝗮𝗴𝗲\n━━━━━━━━━━━━━━━━━━\n✨ 𝗘𝘅𝗮𝗺𝗽𝗹𝗲:\n• ${global.config.PREFIX}language bn\n• ${global.config.PREFIX}language en`,
			threadID,
			messageID
		);
	}

	const selectedLanguage = args[0].toLowerCase();
	
	if (selectedLanguage === "bn" || selectedLanguage === "bangla") {
		global.config.language = "bn";
		return api.sendMessage(getText("success"), threadID);
	}
	else if (selectedLanguage === "en" || selectedLanguage === "english") {
		global.config.language = "en";
		return api.sendMessage(getText("success"), threadID);
	}
	else {
		return api.sendMessage(
			`❌ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗟𝗮𝗻𝗴𝘂𝗮𝗴𝗲\n━━━━━━━━━━━━━━━━━━\n📌 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗢𝗽𝘁𝗶𝗼𝗻𝘀:\n• bn - Bengali/Bangla\n• en - English`,
			threadID,
			messageID
		);
	}
};
