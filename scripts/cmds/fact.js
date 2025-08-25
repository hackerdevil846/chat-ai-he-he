module.exports.config = {
	name: "fact",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑹𝒂𝒏𝒅𝒐𝒎 𝒇𝒂𝒄𝒕𝒔 𝒋𝒂𝒏𝒂𝒏",
	category: "fun",
	usages: "[blank]",
	cooldowns: 5,
	dependencies: {
		"axios": ""
	}
};

module.exports.onStart = async function({ api, event, args }) {
	const axios = require("axios");
	try {
		const response = await axios.get('https://api.popcat.xyz/fact');
		const fact = response.data.fact;
		api.sendMessage(`🔮 | 𝐑𝐚𝐧𝐝𝐨𝐦 𝐅𝐚𝐜𝐭 𝐅𝐨𝐫 𝐘𝐨𝐮\n\n✨ | 𝐅𝐚𝐜𝐭: ${fact}\n\n💫 | 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`, event.threadID, event.messageID);
	} catch (error) {
		console.error(error);
		api.sendMessage("❌ | 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐟𝐞𝐭𝐜𝐡 𝐟𝐚𝐜𝐭. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.", event.threadID);
	}
};
