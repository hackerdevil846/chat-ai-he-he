module.exports.config = {
	name: "otherbots",
	version: "1.1.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🛡️ 𝑶𝒕𝒉𝒆𝒓 𝑩𝒐𝒕𝒔 𝑫𝒆𝒕𝒆𝒄𝒕𝒊𝒐𝒏 & 𝑨𝒖𝒕𝒐-𝑩𝒂𝒏 𝑺𝒚𝒔𝒕𝒆𝒎",
	commandCategory: "🛡️ 𝑺𝒚𝒔𝒕𝒆𝒎 𝑪𝒐𝒏𝒇𝒊𝒈",
	usages: "[info|status]",
	cooldowns: 5,
	dependencies: {
		"moment-timezone": ""
	},
	envConfig: {
		autoBan: true,
		notifyAdmins: true,
		logBans: true
	}
};

module.exports.languages = {
	"en": {
		"banMessage": "🛡️ 𝗕𝗼𝘁 𝗗𝗲𝘁𝗲𝗰𝘁𝗲𝗱!\n\n%1, 𝑻𝒖𝒎𝒊 𝒆𝒌𝒕𝒂 𝒃𝒐𝒕 𝒃𝒐𝒍𝒆 𝒔𝒐𝒏𝒈𝒌𝒉𝒂 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒐! 𝑺𝒑𝒂𝒎 𝒕𝒉𝒆𝒌𝒆 𝒃𝒂𝒄𝒉𝒂𝒕𝒆 𝒕𝒐𝒎𝒂𝒓 𝒂𝒄𝒄𝒐𝒖𝒏𝒕 𝒃𝒂𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒃𝒆. 😔",
		"adminAlert": "⚠️ 𝗡𝗲𝘄 𝗕𝗼𝘁 𝗕𝗮𝗻𝗻𝗲𝗱 ⚠️\n\n👤 𝑵𝒂𝒎𝒆: %1\n🆔 𝑩𝒐𝒕 𝑼𝑰𝑫: %2\n📅 𝑫𝒂𝒕𝒆: %3\n\n𝑻𝒉𝒊𝒔 𝒖𝒔𝒆𝒓 𝒉𝒂𝒔 𝒃𝒆𝒆𝒏 𝒅𝒆𝒕𝒆𝒄𝒕𝒆𝒅 𝒂𝒔 𝒂𝒏 𝒐𝒕𝒉𝒆𝒓 𝒃𝒐𝒕 𝒂𝒏𝒅 𝒂𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒂𝒍𝒍𝒚 𝒃𝒂𝒏𝒏𝒆𝒅! 🔒",
		"infoMessage": "ℹ️ 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗜𝗻𝗳𝗼:\n\n𝑻𝒉𝒊𝒔 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒂𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒂𝒍𝒍𝒚 𝒅𝒆𝒕𝒆𝒄𝒕𝒔 𝒂𝒏𝒅 𝒃𝒂𝒏𝒔 𝒐𝒕𝒉𝒆𝒓 𝒃𝒐𝒕𝒔 𝒕𝒐 𝒑𝒓𝒆𝒗𝒆𝒏𝒕 𝒔𝒑𝒂𝒎𝒎𝒊𝒏𝒈. 𝑵𝒐 𝒂𝒅𝒅𝒊𝒕𝒊𝒐𝒏𝒂𝒍 𝒂𝒄𝒕𝒊𝒐𝒏 𝒊𝒔 𝒓𝒆𝒒𝒖𝒊𝒓𝒆𝒅. 🔍\n\n📊 𝑺𝒕𝒂𝒕𝒖𝒔: %1",
		"statusActive": "✅ 𝑨𝒄𝒕𝒊𝒗𝒆",
		"statusInactive": "❌ 𝑰𝒏𝒂𝒄𝒕𝒊𝒗𝒆",
		"errorMessage": "❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅: %1"
	}
};

module.exports.onLoad = function() {
	console.log('🛡️ 𝑶𝒕𝒉𝒆𝒓𝑩𝒐𝒕𝒔 𝑫𝒆𝒕𝒆𝒄𝒕𝒊𝒐𝒏 𝑺𝒚𝒔𝒕𝒆𝒎 𝑳𝒐𝒂𝒅𝒆𝒅 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚!');
};

module.exports.handleEvent = async function({ event, api, Users }) {
	try {
		const { threadID, messageID, senderID, body } = event;
		
		// Ignore messages from the bot itself
		if (senderID === api.getCurrentUserID()) return;
		
		// Check if auto-ban is enabled
		if (!this.config.envConfig.autoBan) return;

		const botTriggers = [
			"your keyboard level has reached level",
			"Command not found",
			"The command you used",
			"Uy may lumipad",
			"Unsend this message",
			"You are unable to use bot",
			"»» NOTICE «« Update user nicknames",
			"just removed 1 Attachments",
			"message removedcontent",
			"The current preset is",
			"Here Is My Prefix",
			"just removed 1 attachment.",
			"Unable to re-add members",
			"removed 1 message content:",
			"Here's your music, enjoy!🥰",
			"Ye Raha Aapka Music, enjoy!🥰",
			"your keyboard Power level Up",
			"bot ki mc",
			"your keyboard hero level has reached level"
		];

		// Check if message contains any bot trigger
		if (botTriggers.some(trigger => body && body.includes(trigger))) {
			const userName = await Users.getNameUser(senderID);
			const moment = require("moment-timezone");
			const time = moment.tz("Asia/Dhaka").format("HH:MM:ss DD/MM/YYYY");

			// Get user data and update ban status
			const userData = await Users.getData(senderID);
			userData.banned = 1;
			userData.reason = "𝑶𝒕𝒉𝒆𝒓 𝑩𝒐𝒕 𝑫𝒆𝒕𝒆𝒄𝒕𝒆𝒅";
			userData.dateAdded = time;
			await Users.setData(senderID, userData);

			// Update global banned list
			if (!global.data.userBanned) global.data.userBanned = new Map();
			global.data.userBanned.set(senderID, {
				reason: userData.reason,
				dateAdded: userData.dateAdded
			});

			// Send ban message to the group
			api.sendMessage({
				body: this.languages.en.banMessage.replace("%1", userName)
			}, threadID, messageID);

			// Notify admins if enabled
			if (this.config.envConfig.notifyAdmins && global.config.ADMINBOT) {
				global.config.ADMINBOT.forEach(adminID => {
					api.sendMessage(
						this.languages.en.adminAlert
							.replace("%1", userName)
							.replace("%2", senderID)
							.replace("%3", time),
						adminID
					);
				});
			}

			// Log the ban if enabled
			if (this.config.envConfig.logBans) {
				console.log(`[🛡️ 𝑩𝑶𝑻 𝑩𝑨𝑵𝑵𝑬𝑫] ${userName} (${senderID}) at ${time}`);
			}
		}
	} catch (error) {
		console.error("❌ 𝑬𝒓𝒓𝒐𝒓 𝒊𝒏 𝒉𝒂𝒏𝒅𝒍𝒆𝑬𝒗𝒆𝒏𝒕:", error);
	}
};

module.exports.run = function({ api, event, args }) {
	try {
		const status = this.config.envConfig.autoBan ? 
			this.languages.en.statusActive : 
			this.languages.en.statusInactive;
			
		return api.sendMessage(
			this.languages.en.infoMessage.replace("%1", status),
			event.threadID,
			event.messageID
		);
	} catch (error) {
		console.error("❌ 𝑬𝒓𝒓𝒐𝒓 𝒊𝒏 𝒓𝒖𝒏:", error);
		api.sendMessage(
			this.languages.en.errorMessage.replace("%1", error.message),
			event.threadID,
			event.messageID
		);
	}
};
