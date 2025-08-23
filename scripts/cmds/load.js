module.exports.config = {
	name: "load",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🔄 𝑪𝒐𝒏𝒇𝒊𝒈 𝒇𝒂𝒊𝒍 𝒓𝒆𝒍𝒐𝒂𝒅 𝒔𝒚𝒔𝒕𝒆𝒎",
	category: "🛠️ 𝑺𝒚𝒔𝒕𝒆𝒎",
	usages: "[]",
	cooldowns: 30,
	dependencies: {}
};

module.exports.run = async function({ api, event }) {
	try {
		const configPath = global.client.configPath;
		delete require.cache[require.resolve(configPath)];
		global.config = require(configPath);
		
		return api.sendMessage("✅ | 𝑪𝒐𝒏𝒇𝒊𝒈 𝒇𝒂𝒊𝒍 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒓𝒆𝒍𝒐𝒂𝒅𝒆𝒅!\n🔄 | 𝑩𝒐𝒕 𝒄𝒐𝒏𝒇𝒊𝒈𝒖𝒓𝒂𝒕𝒊𝒐𝒏 𝒉𝒂𝒔 𝒃𝒆𝒆𝒏 𝒖𝒑𝒅𝒂𝒕𝒆𝒅!", event.threadID, event.messageID);
	} 
	catch (error) {
		console.error("𝑹𝒆𝒍𝒐𝒂𝒅 𝑬𝒓𝒓𝒐𝒓:", error);
		return api.sendMessage(`❌ | 𝑪𝒐𝒏𝒇𝒊𝒈 𝒓𝒆𝒍𝒐𝒂𝒅 𝒇𝒂𝒊𝒍𝒆𝒅!\n📄 | 𝑬𝒓𝒓𝒐𝒓: ${error.message}`, event.threadID, event.messageID);
	}
};
