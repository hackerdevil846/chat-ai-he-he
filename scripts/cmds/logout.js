module.exports.config = {
	name: "logout",
	version: "1.0.1",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🔄 𝑩𝒐𝒕 𝒂𝒄𝒄𝒐𝒖𝒏𝒕 𝒍𝒐𝒈𝒐𝒖𝒕 𝒔𝒚𝒔𝒕𝒆𝒎",
	commandCategory: "⚙️ 𝑺𝒚𝒔𝒕𝒆𝒎",
	usages: "",
	cooldowns: 0,
	envConfig: {
		logoutTimeout: 1500
	}
};

module.exports.run = async function({ api, event, envConfig }) {
	try {
		api.sendMessage("🔒 | 𝑩𝒐𝒕 𝒊𝒔 𝒍𝒐𝒈𝒈𝒊𝒏𝒈 𝒐𝒖𝒕...\n\n🔄 𝑷𝒍𝒆𝒂𝒔𝒆 𝒘𝒂𝒊𝒕 𝒎𝒐𝒎𝒆𝒏𝒕𝒊𝒍𝒚...", event.threadID, event.messageID);
		
		setTimeout(() => {
			api.logout();
			console.log('✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒍𝒐𝒈𝒈𝒆𝒅 𝒐𝒖𝒕');
		}, envConfig.logoutTimeout || 1500);

	} catch (error) {
		console.log('❌ 𝑳𝒐𝒈𝒐𝒖𝒕 𝒆𝒓𝒓𝒐𝒓:', error);
		api.sendMessage("❌ | 𝑳𝒐𝒈𝒐𝒖𝒕 𝒇𝒂𝒊𝒍𝒆𝒅!\n\n" + error.message, event.threadID);
	}
};
