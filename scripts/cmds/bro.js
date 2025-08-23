module.exports.config = {
	name: "bro",
	version: "7.3.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑴𝒆𝒏𝒕𝒊𝒐𝒏 𝒕𝒉𝒆𝒌𝒆 𝑱𝒖𝒕𝒊 𝑷𝒂𝒘𝒂 👬",
	commandCategory: "image-edit",
	usages: "[@mention]",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"fs-extra": "",
		"path": "",
		"jimp": ""
	},
	envConfig: {}
};

module.exports.languages = {
	"en": {
		"missingMention": "❌ | 𝑬𝒌𝒋𝒐𝒏𝒌𝒆 𝑴𝒆𝒏𝒕𝒊𝒐𝒏 𝑲𝒂𝒓𝒐, 𝑹𝒆 𝑩𝒐𝒌𝒂 😅"
	}
};

module.exports.onLoad = async function() {
	const { resolve } = global.nodemodule["path"];
	const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
	const { downloadFile } = global.utils;
	const dirMaterial = __dirname + `/cache/canvas/`;
	const path = resolve(__dirname, 'cache/canvas', 'sis.png');
	
	if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
	if (!existsSync(path)) await downloadFile("https://i.imgur.com/n2FGJFe.jpg", path);
}

async function makeImage({ one, two }) {
	const fs = global.nodemodule["fs-extra"];
	const path = global.nodemodule["path"];
	const axios = global.nodemodule["axios"];
	const jimp = global.nodemodule["jimp"];
	const __root = path.resolve(__dirname, "cache", "canvas");

	let batgiam_img = await jimp.read(__root + "/sis.png");
	let pathImg = __root + `/batman${one}_${two}.png`;
	let avatarOne = __root + `/avt_${one}.png`;
	let avatarTwo = __root + `/avt_${two}.png`;

	let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
	fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));

	let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
	fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));

	let circleOne = await jimp.read(await circle(avatarOne));
	let circleTwo = await jimp.read(await circle(avatarTwo));
	batgiam_img.composite(circleOne.resize(191, 191), 93, 111).composite(circleTwo.resize(190, 190), 434, 107);

	let raw = await batgiam_img.getBufferAsync("image/png");
	
	fs.writeFileSync(pathImg, raw);
	fs.unlinkSync(avatarOne);
	fs.unlinkSync(avatarTwo);

	return pathImg;
}

async function circle(image) {
	const jimp = require("jimp");
	image = await jimp.read(image);
	image.circle();
	return await image.getBufferAsync("image/png");
}

module.exports.run = async function({ event, api, args, Users }) {
	try {
		const fs = global.nodemodule["fs-extra"];
		const { threadID, messageID, senderID } = event;
		const mention = Object.keys(event.mentions);
		
		if (!mention[0]) return api.sendMessage(this.languages.en.missingMention, threadID, messageID);
		
		const one = senderID;
		const two = mention[0];
		
		return makeImage({ one, two }).then(path => {
			const body = `✧•❁𝑩𝒉𝒂𝒊-𝑩𝒐𝒏❁•✧

╔═══❖••° °••❖═══╗
   𝑺𝒂𝒑𝒉𝒂𝒍𝒂𝒃𝒂𝒔𝒂 𝑱𝒖𝒕𝒊
╚═══❖••° °••❖═══╝

   ✶⊶⊷⊷❍⊶⊷⊷✶
       👑𝑵𝒊𝒚𝒆 𝑷𝒆𝒍𝒆𝒏 𝑩𝒓𝒐❤
𝑻𝒐𝒎𝒂𝒓 𝑱𝒆𝒏𝒐 𝑩𝒉𝒂𝒊 🩷
   ✶⊶⊷⊷❍⊶⊷⊷✶`;
			
			api.sendMessage({
				body: body,
				attachment: fs.createReadStream(path)
			}, threadID, () => fs.unlinkSync(path), messageID);
		});
	} catch (error) {
		console.error(error);
	}
}
