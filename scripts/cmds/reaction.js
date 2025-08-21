module.exports.config = {
	name: "reaction",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Send animated reaction GIFs",
	commandCategory: "fun",
	usages: "[reaction] [@mention]",
	cooldowns: 5,
	dependencies: {
		"axios": ""
	}
};

module.exports.run = async function({ api, event, args, Users }) {
	const axios = global.nodemodule["axios"];
	const fs = global.nodemodule["fs-extra"];
	const request = global.nodemodule["request"];
	
	const reactions = {
		happy: ["nekos.best", "waifu.pics"],
		dance: ["nekos.best", "waifu.pics"],
		kiss: ["nekos.best", "waifu.pics", "otakugifs.xyz"],
		cry: ["nekos.best", "waifu.pics"],
		bite: ["nekos.best", "waifu.pics"],
		blush: ["nekos.best", "waifu.pics"],
		cuddle: ["nekos.best", "waifu.pics"],
		facepalm: ["nekos.best"],
		handhold: ["nekos.best", "waifu.pics"],
		hug: ["nekos.best", "waifu.pics"],
		laugh: ["nekos.best"],
		nom: ["nekos.best", "waifu.pics"],
		pat: ["nekos.best", "waifu.pics"],
		poke: ["nekos.best", "waifu.pics"],
		pout: ["nekos.best"],
		punch: ["nekos.best"],
		run: ["nekos.best"],
		shrug: ["nekos.best"],
		slap: ["nekos.best", "waifu.pics"],
		sleep: ["nekos.best"],
		smile: ["nekos.best", "waifu.pics"],
		smug: ["nekos.best", "waifu.pics"],
		stare: ["nekos.best"],
		thumbsup: ["nekos.best"],
		tickle: ["nekos.best"],
		wave: ["nekos.best", "waifu.pics"],
		wink: ["nekos.best", "waifu.pics"],
		yawn: ["nekos.best"],
		lick: ["waifu.pics"],
		neko: ["nekos.life", "nekobot.xyz", "nekos.moe"]
	};

	const emojiMap = {
		happy: "😄",
		dance: "💃",
		kiss: "😘",
		cry: "😢",
		bite: "😈",
		blush: "😊",
		cuddle: "🤗",
		facepalm: "🤦",
		handhold: "🧑‍🤝‍🧑",
		hug: "🫂",
		laugh: "😂",
		nom: "🍜",
		pat: "👏",
		poke: "👉",
		pout: "😤",
		punch: "👊",
		run: "🏃",
		shrug: "🤷",
		slap: "✋",
		sleep: "😴",
		smile: "😊",
		smug: "😏",
		stare: "👀",
		thumbsup: "👍",
		tickle: "👆",
		wave: "👋",
		wink: "😉",
		yawn: "🥱",
		lick: "👅",
		neko: "🐱"
	};

	const reaction = args[0]?.toLowerCase();
	if (!reaction || !reactions[reaction]) {
		const availableReactions = Object.keys(reactions)
			.map(r => `✦ ${r} ${emojiMap[r] || ''}`)
			.join('\n');
		return api.sendMessage(
			`🎭 Available Reactions:\n\n${availableReactions}\n\nUsage: reaction [reaction] [@mention]`,
			event.threadID,
			event.messageID
		);
	}

	try {
		const APIs = {
			"nekos.best": `https://nekos.best/api/v2/${reaction}`,
			"waifu.pics": `https://api.waifu.pics/sfw/${reaction}`,
			"otakugifs.xyz": `https://api.otakugifs.xyz/gif?reaction=${reaction}`,
			"nekos.life": `https://nekos.life/api/v2/img/neko`,
			"nekobot.xyz": `https://nekobot.xyz/api/image?type=neko`,
			"nekos.moe": `https://nekos.moe/api/v1/random/image?tags=neko`
		};

		const targetAPI = reactions[reaction][Math.floor(Math.random() * reactions[reaction].length)];
		const apiUrl = APIs[targetAPI];

		const response = await axios.get(apiUrl);
		let imageUrl;

		switch(targetAPI) {
			case "nekos.best":
				imageUrl = response.data.results[0].url;
				break;
			case "waifu.pics":
				imageUrl = response.data.url;
				break;
			case "otakugifs.xyz":
				imageUrl = response.data.url;
				break;
			case "nekos.life":
				imageUrl = response.data.url;
				break;
			case "nekobot.xyz":
				imageUrl = response.data.message;
				break;
			case "nekos.moe":
				imageUrl = `https://nekos.moe/image/${response.data.images[0].id}`;
				break;
		}

		const target = Object.keys(event.mentions)[0] || event.senderID;
		const name = (await Users.getData(target)).name;
		const senderName = (await Users.getData(event.senderID)).name;

		const callback = () => {
			api.sendMessage({
				body: `${emojiMap[reaction]} | ${senderName} ${reaction} ${target !== event.senderID ? name : 'themselves'}`,
				mentions: [{
					tag: name,
					id: target
				}],
				attachment: fs.createReadStream(__dirname + '/tmp/reaction.gif')
			}, event.threadID, () => fs.unlinkSync(__dirname + '/tmp/reaction.gif'));
		};

		request(encodeURI(imageUrl))
			.pipe(fs.createWriteStream(__dirname + '/tmp/reaction.gif'))
			.on('close', callback);

	} catch (error) {
		api.sendMessage(
			`❌ Error fetching ${reaction} reaction. Please try again later.`,
			event.threadID,
			event.messageID
		);
	}
};
