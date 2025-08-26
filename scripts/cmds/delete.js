module.exports.config = {
	name: "delete",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑫𝒆𝒍𝒆𝒕𝒆 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 🖱️",
	category: "𝗠𝗘𝗗𝗜𝗔",
	usages: "[tag]",
	cooldowns: 5,
	dependencies: {
		"fs-extra": "",
		"axios": "",
		"jimp": ""
	},
	envConfig: {}
};

module.exports.languages = {
	"en": {
		"message": "𝑫𝒂𝒚𝒂 𝒌𝒐𝒓𝒆 𝒆𝒌𝒋𝒐𝒏 𝒌𝒆 𝒕𝒂𝒈 𝒌𝒐𝒓𝒖𝒏! 🖱️"
	}
};

module.exports.onLoad = async function() {
	const path = require("path");
	const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
	const { downloadFile } = global.utils;
	const dirMaterial = __dirname + `/cache/`;
	const imagePath = path.resolve(__dirname, 'cache', 'toilet1.png');
	
	if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
	if (!existsSync(imagePath)) await downloadFile("https://i.imgur.com/vsJYfw5.png", imagePath);
};

module.exports.onStart = async function({ event, api, args, Currencies }) {
	const fs = global.nodemodule["fs-extra"];
	const axios = global.nodemodule["axios"];
	const jimp = global.nodemodule["jimp"];
	const path = require("path");
	
	const { threadID, messageID, senderID } = event;
	const mention = Object.keys(event.mentions);
	
	if (!mention[0]) return api.sendMessage(this.languages.en.message, threadID, messageID);
	
	const hc = Math.floor(Math.random() * 101);
	const rd = Math.floor(Math.random() * 100000) + 100000;
	await Currencies.increaseMoney(senderID, parseInt(hc * rd));

	const one = senderID;
	const two = mention[0];
	const __root = path.resolve(__dirname, "cache");

	async function circle(image) {
		const img = await jimp.read(image);
		img.circle();
		return await img.getBufferAsync("image/png");
	}

	async function makeImage() {
		const hon_img = await jimp.read(__root + "/toilet1.png");
		const pathImg = __root + `/toilet1_${one}_${two}.png`;
		const avatarOne = __root + `/avt_${one}.png`;
		const avatarTwo = __root + `/avt_${two}.png`;
		
		const getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
		fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));
		
		const getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
		fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));
		
		const circleOne = await jimp.read(await circle(avatarOne));
		const circleTwo = await jimp.read(await circle(avatarTwo));
		
		hon_img.resize(748, 356)
			   .composite(circleOne.resize(100, 100), 30, 65)
			   .composite(circleTwo.resize(100, 100), 30, 65);
		
		const raw = await hon_img.getBufferAsync("image/png");
		fs.writeFileSync(pathImg, raw);
		
		fs.unlinkSync(avatarOne);
		fs.unlinkSync(avatarTwo);
		
		return pathImg;
	}

	return makeImage().then(pathImg => 
		api.sendMessage({
			body: `🧹 𝑫𝒆𝒍𝒆𝒕𝒆 𝒌𝒐𝒓𝒕𝒆 𝒄𝒂𝒊𝒔𝒐 𝒆𝒊 𝒕𝒂? +${hc*rd}💵!`,
			attachment: fs.createReadStream(pathImg)
		}, threadID, () => fs.unlinkSync(pathImg), messageID)
	);
};
