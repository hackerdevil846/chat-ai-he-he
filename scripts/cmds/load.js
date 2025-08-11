module.exports.config = {
	name: "load",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑪𝒐𝒏𝒇𝒊𝒈 𝒇𝒂𝒊𝒍 𝒓𝒆𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒖𝒏",
	commandCategory: "𝑨𝒅𝒎𝒊𝒏",
	usages: "[]",
	cooldowns: 30
};

module.exports.run = async function({ api, event }) {
	try {
		// Reload configuration file
		delete require.cache[require.resolve(global.client.configPath)];
		global.config = require(global.client.configPath);
		
		return api.sendMessage("🔄 𝑪𝒐𝒏𝒇𝒊𝒈 𝒇𝒂𝒊𝒍 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒓𝒆𝒍𝒐𝒂𝒅𝒆𝒅! ✅", event.threadID, event.messageID);
	} catch (error) {
		console.error("Config reload error:", error);
		return api.sendMessage("⚠️ 𝑪𝒐𝒏𝒇𝒊𝒈 𝒓𝒆𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊𝒏𝒊: " + error.message, event.threadID, event.messageID);
	}
};
