const axios = require("axios");

module.exports.config = {
    name: "anireact",
    aliases: ["anireact", "animereaction"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
        en: "𝐴𝑛𝑖𝑚𝑒 𝑟𝑒𝑎𝑐𝑡𝑖𝑜𝑛𝑠 𝑤𝑖𝑡ℎ 𝑒𝑚𝑜𝑗𝑖"
    },
    longDescription: {
        en: "𝑆𝑒𝑛𝑑𝑠 𝑎𝑛𝑖𝑚𝑒 𝑟𝑒𝑎𝑐𝑡𝑖𝑜𝑛𝑠 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑒𝑚𝑜𝑗𝑖"
    },
    guide: {
        en: "𝑆𝑖𝑚𝑝𝑙𝑦 𝑠𝑒𝑛𝑑 𝑎𝑛 𝑒𝑚𝑜𝑗𝑖 𝑖𝑛 𝑡ℎ𝑒 𝑐ℎ𝑎𝑡"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.onChat = async function({ message, event }) {
    try {
        const emojiReactions = {
            "😄": { apis: ["https://nekos.best/api/v2/happy", "https://api.waifu.pics/sfw/happy"], description: "happy" },
            "💃": { apis: ["https://nekos.best/api/v2/dance", "https://api.waifu.pics/sfw/dance"], description: "dance" },
            "😘": { apis: ["https://api.otakugifs.xyz/gif?reaction=kiss", "https://nekos.best/api/v2/kiss", "https://api.waifu.pics/sfw/kiss"], description: "kiss" },
            "😢": { apis: ["https://nekos.best/api/v2/cry", "https://api.waifu.pics/sfw/cry"], description: "cry" },
            "😬": { apis: ["https://nekos.best/api/v2/bite", "https://api.waifu.pics/sfw/bite"], description: "bite" },
            "😊": { apis: ["https://nekos.best/api/v2/blush", "https://api.waifu.pics/sfw/blush"], description: "blush" },
            "🤗": { apis: ["https://nekos.best/api/v2/cuddle", "https://api.waifu.pics/sfw/cuddle"], description: "cuddle" },
            "🤦": { apis: ["https://nekos.best/api/v2/facepalm"], description: "facepalm" },
            "🧑‍🤝‍🧑": { apis: ["https://nekos.best/api/v2/handhold", "https://api.waifu.pics/sfw/handhold"], description: "handhold" },
            "🫂": { apis: ["https://nekos.best/api/v2/hug", "https://api.waifu.pics/sfw/hug"], description: "hug" },
            "😂": { apis: ["https://nekos.best/api/v2/laugh"], description: "laugh" },
            "🍖": { apis: ["https://nekos.best/api/v2/nom", "https://api.waifu.pics/sfw/nom"], description: "nom" },
            "👋": { apis: ["https://nekos.best/api/v2/pat", "https://api.waifu.pics/sfw/pat"], description: "pat" },
            "👉": { apis: ["https://nekos.best/api/v2/poke", "https://api.waifu.pics/sfw/poke"], description: "poke" },
            "😤": { apis: ["https://nekos.best/api/v2/pout"], description: "pout" },
            "👊": { apis: ["https://nekos.best/api/v2/punch"], description: "punch" },
            "🏃": { apis: ["https://nekos.best/api/v2/run"], description: "run" },
            "🤷": { apis: ["https://nekos.best/api/v2/shrug"], description: "shrug" },
            "👋": { apis: ["https://nekos.best/api/v2/slap", "https://api.waifu.pics/sfw/slap"], description: "slap" },
            "😴": { apis: ["https://nekos.best/api/v2/sleep"], description: "sleep" },
            "😊": { apis: ["https://nekos.best/api/v2/smile", "https://api.waifu.pics/sfw/smile"], description: "smile" },
            "😏": { apis: ["https://nekos.best/api/v2/smug", "https://api.waifu.pics/sfw/smug"], description: "smug" },
            "👀": { apis: ["https://nekos.best/api/v2/stare"], description: "stare" },
            "👍": { apis: ["https://nekos.best/api/v2/thumbsup"], description: "thumbsup" },
            "🤣": { apis: ["https://nekos.best/api/v2/tickle"], description: "tickle" },
            "👋": { apis: ["https://nekos.best/api/v2/wave", "https://api.waifu.pics/sfw/wave"], description: "wave" },
            "😉": { apis: ["https://nekos.best/api/v2/wink", "https://api.waifu.pics/sfw/wink"], description: "wink" },
            "🥱": { apis: ["https://nekos.best/api/v2/yawn"], description: "yawn" },
            "👅": { apis: ["https://api.waifu.pics/sfw/lick"], description: "lick" },
            "🐱": { apis: ["https://nekos.life/api/v2/img/neko", "https://nekobot.xyz/api/image?type=neko"], description: "neko" },
            "🔥": { apis: ["https://nekos.life/api/v2/img/lewd"], description: "lewd" },
            "🎲": { apis: ["https://nekos.moe/api/v1/random/image?tags=neko"], description: "random" }
        };

        const body = event.body?.trim();
        
        if (body && emojiReactions[body]) {
            const reaction = emojiReactions[body];
            
            for (const apiUrl of reaction.apis) {
                try {
                    const response = await axios.get(apiUrl);
                    let imageUrl;

                    if (apiUrl.includes("nekos.best")) {
                        imageUrl = response.data.results[0]?.url;
                    } else if (apiUrl.includes("waifu.pics")) {
                        imageUrl = response.data.url;
                    } else if (apiUrl.includes("nekos.life")) {
                        imageUrl = response.data.url;
                    } else if (apiUrl.includes("nekobot.xyz")) {
                        imageUrl = response.data.message;
                    } else if (apiUrl.includes("otakugifs")) {
                        imageUrl = response.data.url;
                    } else if (apiUrl.includes("nekos.moe")) {
                        imageUrl = `https://nekos.moe/image/${response.data.images[0].id}`;
                    }

                    if (imageUrl) {
                        await message.reply({
                            body: `${body} ${reaction.description}!`,
                            attachment: await global.utils.getStreamFromURL(imageUrl)
                        });
                        return;
                    }
                } catch (error) {
                    console.log(`𝐴𝑃𝐼 ${apiUrl} 𝑓𝑎𝑖𝑙𝑒𝑑, 𝑡𝑟𝑦𝑖𝑛𝑔 𝑏𝑎𝑐𝑘𝑢𝑝...`);
                    continue;
                }
            }
            
            await message.reply(`${body} ${reaction.description}! (𝑁𝑜 𝑖𝑚𝑎𝑔𝑒 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒)`);
        }
    } catch (error) {
        console.error("𝐴𝑛𝑖𝑚𝑒 𝑒𝑚𝑜𝑗𝑖 𝑟𝑒𝑎𝑐𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", error);
    }
};

module.exports.onStart = async function({ message }) {
    const helpMessage = `🎭 𝑨𝑵𝑰𝑴𝑬 𝑹𝑬𝑨𝑪𝑻𝑰𝑶𝑵𝑺 𝑯𝑬𝑳𝑷 🎭

𝑆𝑖𝑚𝑝𝑙𝑦 𝑠𝑒𝑛𝑑 𝑎𝑛𝑦 𝑜𝑓 𝑡ℎ𝑒𝑠𝑒 𝑒𝑚𝑜𝑗𝑖𝑠 𝑖𝑛 𝑡ℎ𝑒 𝑐ℎ𝑎𝑡:

😄 - 𝐻𝑎𝑝𝑝𝑦
💃 - 𝐷𝑎𝑛𝑐𝑒
😘 - 𝐾𝑖𝑠𝑠
😢 - 𝐶𝑟𝑦
🤗 - 𝐻𝑢𝑔
😂 - 𝐿𝑎𝑢𝑔ℎ
👋 - 𝑃𝑎𝑡/𝑊𝑎𝑣𝑒/𝑆𝑙𝑎𝑝
🐱 - 𝑁𝑒𝑘𝑜
🎲 - 𝑅𝑎𝑛𝑑𝑜𝑚

...𝑎𝑛𝑑 𝑚𝑎𝑛𝑦 𝑚𝑜𝑟𝑒!

𝐽𝑢𝑠𝑡 𝑡𝑦𝑝𝑒 𝑡ℎ𝑒 𝑒𝑚𝑜𝑗𝑖 𝑎𝑛𝑑 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑤𝑖𝑙𝑙 𝑟𝑒𝑠𝑝𝑜𝑛𝑑 𝑤𝑖𝑡ℎ 𝑎𝑛 𝑎𝑛𝑖𝑚𝑒 𝑟𝑒𝑎𝑐𝑡𝑖𝑜𝑛!`;

    await message.reply(helpMessage);
};


/*
module.exports.config = {
	name: "anime2",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Send random anime reaction GIFs/images 🎭",
	category: "fun",
	usages: "[reaction]",
	cooldowns: 5,
	dependencies: {
		"axios": ""
	}
};

// Added to prevent "onStart of command undefined" error in loader
module.exports.onStart = async function() {
	// intentionally left empty to satisfy loader expectation
};

module.exports.run = async function({ api, event, args }) {
	const { threadID, messageID } = event;
	const axios = require("axios");
	
	// List of available reactions with emojis
	const reactions = {
		happy: { apis: [
			"https://nekos.best/api/v2/happy",
			"https://api.waifu.pics/sfw/happy"
		], emoji: "😄", description: "Happy and cheerful expressions" },
		dance: { apis: [
			"https://nekos.best/api/v2/dance",
			"https://api.waifu.pics/sfw/dance"
		], emoji: "💃", description: "Dancing animations" },
		kiss: { apis: [
			"https://api.otakugifs.xyz/gif?reaction=kiss",
			"https://nekos.best/api/v2/kiss",
			"https://api.waifu.pics/sfw/kiss"
		], emoji: "😘", description: "Romantic kissing scenes" },
		cry: { apis: [
			"https://nekos.best/api/v2/cry",
			"https://api.waifu.pics/sfw/cry"
		], emoji: "😢", description: "Sad and crying moments" },
		bite: { apis: [
			"https://nekos.best/api/v2/bite",
			"https://api.waifu.pics/sfw/bite"
		], emoji: "😬", description: "Playful biting actions" },
		blush: { apis: [
			"https://nekos.best/api/v2/blush",
			"https://api.waifu.pics/sfw/blush"
		], emoji: "😊", description: "Blushing and shy reactions" },
		cuddle: { apis: [
			"https://nekos.best/api/v2/cuddle",
			"https://api.waifu.pics/sfw/cuddle"
		], emoji: "🤗", description: "Warm cuddling moments" },
		facepalm: { apis: [
			"https://nekos.best/api/v2/facepalm"
		], emoji: "🤦", description: "Facepalm reactions" },
		handhold: { apis: [
			"https://nekos.best/api/v2/handhold",
			"https://api.waifu.pics/sfw/handhold"
		], emoji: "🧑‍🤝‍🧑", description: "Hand holding scenes" },
		hug: { apis: [
			"https://nekos.best/api/v2/hug",
			"https://api.waifu.pics/sfw/hug"
		], emoji: "🫂", description: "Warm hugs" },
		laugh: { apis: [
			"https://nekos.best/api/v2/laugh"
		], emoji: "😂", description: "Laughing out loud" },
		nom: { apis: [
			"https://nekos.best/api/v2/nom",
			"https://api.waifu.pics/sfw/nom"
		], emoji: "🍖", description: "Eating or nibbling" },
		pat: { apis: [
			"https://nekos.best/api/v2/pat",
			"https://api.waifu.pics/sfw/pat"
		], emoji: "👋", description: "Head pats" },
		poke: { apis: [
			"https://nekos.best/api/v2/poke",
			"https://api.waifu.pics/sfw/poke"
		], emoji: "👉", description: "Poking actions" },
		pout: { apis: [
			"https://nekos.best/api/v2/pout"
		], emoji: "😤", description: "Pouting expressions" },
		punch: { apis: [
			"https://nekos.best/api/v2/punch"
		], emoji: "👊", description: "Punching actions" },
		run: { apis: [
			"https://nekos.best/api/v2/run"
		], emoji: "🏃", description: "Running away" },
		shrug: { apis: [
			"https://nekos.best/api/v2/shrug"
		], emoji: "🤷", description: "Shrugging shoulders" },
		slap: { apis: [
			"https://nekos.best/api/v2/slap",
			"https://api.waifu.pics/sfw/slap"
		], emoji: "👋", description: "Slapping actions" },
		sleep: { apis: [
			"https://nekos.best/api/v2/sleep"
		], emoji: "😴", description: "Sleeping scenes" },
		smile: { apis: [
			"https://nekos.best/api/v2/smile",
			"https://api.waifu.pics/sfw/smile"
		], emoji: "😊", description: "Sweet smiles" },
		smug: { apis: [
			"https://nekos.best/api/v2/smug",
			"https://api.waifu.pics/sfw/smug"
		], emoji: "😏", description: "Smug expressions" },
		stare: { apis: [
			"https://nekos.best/api/v2/stare"
		], emoji: "👀", description: "Intense staring" },
		thumbsup: { apis: [
			"https://nekos.best/api/v2/thumbsup"
		], emoji: "👍", description: "Thumbs up approval" },
		tickle: { apis: [
			"https://nekos.best/api/v2/tickle"
		], emoji: "🤣", description: "Tickling actions" },
		wave: { apis: [
			"https://nekos.best/api/v2/wave",
			"https://api.waifu.pics/sfw/wave"
		], emoji: "👋", description: "Waving hello/goodbye" },
		wink: { apis: [
			"https://nekos.best/api/v2/wink",
			"https://api.waifu.pics/sfw/wink"
		], emoji: "😉", description: "Winking flirtily" },
		yawn: { apis: [
			"https://nekos.best/api/v2/yawn"
		], emoji: "🥱", description: "Yawning tiredly" },
		lick: { apis: [
			"https://api.waifu.pics/sfw/lick"
		], emoji: "👅", description: "Licking actions" },
		neko: { apis: [
			"https://nekos.life/api/v2/img/neko",
			"https://nekobot.xyz/api/image?type=neko"
		], emoji: "🐱", description: "Cute cat girls" },
		lewd: { apis: [
			"https://nekos.life/api/v2/img/lewd"
		], emoji: "🔥", description: "Suggestive content (use with caution)" },
		random: { apis: [
			"https://nekos.moe/api/v1/random/image?tags=neko"
		], emoji: "🎲", description: "Completely random anime image" }
	};

	// If no reaction specified, show available options
	if (args.length === 0) {
		let message = "🎭 𝗔𝗡𝗜𝗠𝗘 𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡𝗦 𝗠𝗘𝗡𝗨 🎭\n\n";
		message += "𝗨𝘀𝗮𝗴𝗲: /anime [reaction]\n\n";
		message += "𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗿𝗲𝗮𝗰𝘁𝗶𝗼𝗻𝘀:\n\n";
		
		// Create a formatted list of all reactions
		Object.keys(reactions).sort().forEach(reaction => {
			const info = reactions[reaction];
			message += `✨ ${info.emoji} ${reaction.charAt(0).toUpperCase() + reaction.slice(1)} - ${info.description}\n`;
		});
		
		message += "\n📝 𝗙𝗨𝗟𝗟 𝗘𝗫𝗔𝗠𝗣𝗟𝗘 𝗟𝗜𝗦𝗧:\n";
		message += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
		message += "❤️ 𝗔𝗳𝗳𝗲𝗰𝘁𝗶𝗼𝗻: /anime hug, /anime kiss, /anime cuddle, /anime handhold\n";
		message += "😊 𝗛𝗮𝗽𝗽𝘆: /anime happy, /anime smile, /anime blush, /anime laugh\n";
		message += "😭 𝗦𝗮𝗱: /anime cry, /anime pout\n";
		message += "🎉 𝗔𝗰𝘁𝗶𝗼𝗻: /anime dance, /anime wave, /anime run, /anime shrug\n";
		message += "👊 𝗔𝗴𝗴𝗿𝗲𝘀𝘀𝗶𝘃𝗲: /anime slap, /anime punch, /anime bite\n";
		message += "😴 𝗥𝗲𝗹𝗮𝘅𝗲𝗱: /anime sleep, /anime yawn\n";
		message += "🎲 𝗥𝗮𝗻𝗱𝗼𝗺: /anime random, /anime neko\n";
		message += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
		message += "💡 𝗧𝗶𝗽: Try these examples to get started!\n";
		message += "• /anime hug 🤗\n";
		message += "• /anime kiss 😘\n";
		message += "• /anime dance 💃\n";
		message += "• /anime neko 🐱\n\n";
		message += "🎨 𝗖𝗿𝗲𝗱𝗶𝘁𝘀: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅";
		
		return api.sendMessage(message, threadID, messageID);
	}

	const reactionName = args[0].toLowerCase();
	
	// Check if reaction exists
	if (!reactions[reactionName]) {
		let errorMessage = `❌ 𝗥𝗲𝗮𝗰𝘁𝗶𝗼𝗻 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱: "${reactionName}"\n\n`;
		errorMessage += "𝗨𝘀𝗲 𝗼𝗻𝗲 𝗼𝗳 𝘁𝗵𝗲𝘀𝗲 𝗿𝗲𝗮𝗰𝘁𝗶𝗼𝗻𝘀:\n";
		
		// Show some suggestions
		const availableReactions = Object.keys(reactions);
		for (let i = 0; i < Math.min(8, availableReactions.length); i++) {
			errorMessage += `• ${availableReactions[i]}\n`;
		}
		
		errorMessage += "\n💡 𝗧𝗶𝗽: Use /anime without any reaction to see all options";
		
		return api.sendMessage(errorMessage, threadID, messageID);
	}

	const reaction = reactions[reactionName];
	const apis = reaction.apis;
	const emoji = reaction.emoji;
	
	// Try each API until we get a valid response
	for (const apiUrl of apis) {
		try {
			let response;
			if (apiUrl.includes("otakugifs")) {
				response = await axios.get(apiUrl);
				const gifUrl = response.data.url;
				return api.sendMessage({ 
					body: `${emoji} ${reactionName.charAt(0).toUpperCase() + reactionName.slice(1)}!`,
					attachment: await global.utils.getStreamFromURL(gifUrl)
				}, threadID, messageID);
			} else if (apiUrl.includes("nekos.best")) {
				response = await axios.get(apiUrl);
				const imgUrl = response.data.results[0].url;
				return api.sendMessage({ 
					body: `${emoji} ${reactionName.charAt(0).toUpperCase() + reactionName.slice(1)}!`,
					attachment: await global.utils.getStreamFromURL(imgUrl)
				}, threadID, messageID);
			} else if (apiUrl.includes("waifu.pics")) {
				response = await axios.get(apiUrl);
				const imgUrl = response.data.url;
				return api.sendMessage({ 
					body: `${emoji} ${reactionName.charAt(0).toUpperCase() + reactionName.slice(1)}!`,
					attachment: await global.utils.getStreamFromURL(imgUrl)
				}, threadID, messageID);
			} else if (apiUrl.includes("nekos.life")) {
				response = await axios.get(apiUrl);
				const imgUrl = response.data.url;
				return api.sendMessage({ 
					body: `${emoji} ${reactionName.charAt(0).toUpperCase() + reactionName.slice(1)}!`,
					attachment: await global.utils.getStreamFromURL(imgUrl)
				}, threadID, messageID);
			} else if (apiUrl.includes("nekobot.xyz")) {
				response = await axios.get(apiUrl);
				const imgUrl = response.data.message;
				return api.sendMessage({ 
					body: `${emoji} ${reactionName.charAt(0).toUpperCase() + reactionName.slice(1)}!`,
					attachment: await global.utils.getStreamFromURL(imgUrl)
				}, threadID, messageID);
			} else if (apiUrl.includes("nekos.moe")) {
				response = await axios.get(apiUrl);
				const imgUrl = `https://nekos.moe/image/${response.data.images[0].id}`;
				return api.sendMessage({ 
					body: `${emoji} ${reactionName.charAt(0).toUpperCase() + reactionName.slice(1)}!`,
					attachment: await global.utils.getStreamFromURL(imgUrl)
				}, threadID, messageID);
			}
		} catch (error) {
			console.log(`API ${apiUrl} failed, trying next one...`);
		}
	}
	
	// If all APIs failed
	return api.sendMessage(`❌ Sorry, couldn't fetch a ${reactionName} reaction at the moment. Please try again later.`, threadID, messageID);
};
*/
