module.exports.config = {
	name: "nameCommand",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "✨ 𝑩𝒍𝒂 𝒃𝒍𝒂 𝒃𝒐𝒍𝒃𝒐 𝒆𝒌𝒉𝒂𝒏𝒆 ✨",
	category: "👥 𝒈𝒓𝒐𝒖𝒑",
	usages: "[🔄 𝒐𝒑𝒕𝒊𝒐𝒏] [📝 𝒕𝒆𝒙𝒕]",
	cooldowns: 5,
	dependencies: {
		"axios": ""
	},
	envConfig: {
		// 𝑬𝒏𝒗𝒊𝒓𝒐𝒏𝒎𝒆𝒏𝒕 𝒄𝒐𝒏𝒇𝒊𝒈𝒖𝒓𝒂𝒕𝒊𝒐𝒏𝒔
	}
};

module.exports.languages = {
	"en": {
		"message": "🌟 𝑻𝒉𝒊𝒔 𝒊𝒔 𝒂 𝒔𝒂𝒎𝒑𝒍𝒆 𝒎𝒆𝒔𝒔𝒂𝒈𝒆!"
	}
}

module.exports.onLoad = function() {
	// 𝑰𝒏𝒊𝒕𝒊𝒂𝒍𝒊𝒛𝒂𝒕𝒊𝒐𝒏 𝒄𝒐𝒅𝒆
	console.log("✅ 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝒍𝒐𝒂𝒅𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚");
}

module.exports.handleReaction = function({ event }) {
	// 𝑹𝒆𝒂𝒄𝒕𝒊𝒐𝒏 𝒉𝒂𝒏𝒅𝒍𝒆𝒓
}

module.exports.handleReply = function({ event }) {
	// 𝑹𝒆𝒑𝒍𝒚 𝒉𝒂𝒏𝒅𝒍𝒆𝒓
}

module.exports.handleEvent = function({ event }) {
	// 𝑬𝒗𝒆𝒏𝒕 𝒉𝒂𝒏𝒅𝒍𝒆𝒓
}

module.exports.handleSchedule = function({ scheduleItem }) {
	// 𝑺𝒄𝒉𝒆𝒅𝒖𝒍𝒆𝒅 𝒕𝒂𝒔𝒌𝒔
}

module.exports.run = async function({ api, event, args }) {
	try {
		const { message } = this.languages["en"];
		api.sendMessage(`🎉 ${message}\n📦 𝑨𝒓𝒈𝒖𝒎𝒆𝒏𝒕𝒔: ${args.join(" ")}\n🆔 𝑻𝒉𝒓𝒆𝒂𝒅𝑰𝑫: ${event.threadID}`, event.threadID, event.messageID);
	} catch (error) {
		console.log("❌ 𝑬𝒓𝒓𝒐𝒓:", error);
		api.sendMessage("😿 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅!", event.threadID, event.messageID);
	}
};
