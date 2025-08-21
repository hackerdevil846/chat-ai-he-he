module.exports.config = {
	name: "nsfgif",
	version: "1.0.0",
	hasPermssion: 1,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🔞 NSFW GIF command",
	commandCategory: "adult",
	usages: "[nsfgif]",
	cooldowns: 5,
	dependencies: {
		"axios": ""
	}
};

module.exports.run = async function({ api, event }) {
	const axios = require("axios");
	const { threadID, messageID } = event;
	
	try {
		const response = await axios.get('https://nekobot.xyz/api/image?type=pgif');
		const url = response.data.message;
		
		return api.sendMessage({
			body: `🔞 | 𝗡𝗦𝗙𝗪 𝗚𝗜𝗙\n━━━━━━━━━━━━━━\n\n✨ 𝗚𝗶𝗳 𝗳𝗼𝗿 𝘆𝗼𝘂 𝗯𝗮𝗯𝘆...`,
			attachment: (await global.utils.getStreamFromURL(url))
		}, threadID, messageID);
	} catch (error) {
		api.sendMessage("❌ | 𝗘𝗿𝗿𝗼𝗿 𝗳𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗡𝗦𝗙𝗪 𝗴𝗶𝗳!", threadID, messageID);
	}
};
