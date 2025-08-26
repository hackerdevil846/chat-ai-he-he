module.exports.config = {
	name: "nsfw2",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🥵 Get random NSFW content with multiple categories",
	category: "nsfw",
	usages: "[category]",
	cooldowns: 5,
	dependencies: {
		"axios": ""
	}
};

module.exports.onStart = async function({ api, event, args }) {
	const { threadID, messageID } = event;
	const axios = require("axios");
	
	// Available categories with their endpoints
	const categories = {
		'neko': 'https://api.waifu.pics/nsfw/neko',
		'waifu': 'https://api.waifu.pics/nsfw/waifu',
		'blowjob': 'https://api.waifu.pics/nsfw/blowjob',
		'hentai': 'https://nekobot.xyz/api/image?type=hentai',
		'anal': 'https://nekobot.xyz/api/image?type=anal',
		'pgif': 'https://nekobot.xyz/api/image?type=pgif'
	};

	let category = args[0] || 'random';
	
	if (category === 'random') {
		// Get random category from available options
		const keys = Object.keys(categories);
		category = keys[Math.floor(Math.random() * keys.length)];
	}

	if (!categories[category]) {
		const availableCategories = Object.keys(categories).join(', ');
		return api.sendMessage(`❌ Invalid category! Available categories: ${availableCategories}`, threadID, messageID);
	}

	try {
		api.sendMessage(`🔞 Loading ${category} NSFW content...`, threadID, messageID);

		const response = await axios.get(categories[category]);
		const imageUrl = response.data.url || response.data.message || response.data.image;

		if (!imageUrl) throw new Error("❌ No image found in API response");

		const form = {
			body: `🥵 ${category.toUpperCase()} NSFW Content\n━━━━━━━━━━━━━━\n✨ Credit: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`,
			attachment: await global.utils.getStreamFromURL(imageUrl)
		};

		api.sendMessage(form, threadID, messageID);
	} catch (error) {
		api.sendMessage("❌ Error fetching NSFW content: " + error.message, threadID, messageID);
	}
};
