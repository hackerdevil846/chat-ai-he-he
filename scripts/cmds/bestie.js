module.exports.config = {
	name: "bestie",
	version: "7.3.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑴𝒆𝒏𝒕𝒊𝒐𝒏 𝒚𝒐𝒖𝒓 𝒃𝒆𝒔𝒕𝒇𝒓𝒊𝒆𝒏𝒅 𝒑𝒂𝒊𝒓",
	category: "𝗜𝗠𝗔𝗚𝗘",
	usages: "[@mention]",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"fs-extra": "",
		"path": "",
		"jimp": ""
	}
};

module.exports.onLoad = async function() {
	const path = require("path");
	const fs = require("fs-extra");
	const axios = require("axios");
	
	const downloadFile = async (url, filePath) => {
		const response = await axios({
			method: 'GET',
			url: url,
			responseType: 'stream'
		});
		response.data.pipe(fs.createWriteStream(filePath));
		return new Promise((resolve, reject) => {
			response.data.on('end', () => resolve());
			response.data.on('error', reject);
		});
	};
	
	const dirMaterial = __dirname + `/cache/canvas/`;
	const imagePath = path.resolve(__dirname, 'cache/canvas', 'bestu.png');
	
	if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
	if (!fs.existsSync(imagePath)) await downloadFile("https://i.imgur.com/RloX16v.jpg", imagePath);
}

module.exports.onStart = async function({ event, api, args }) {
	const fs = require("fs-extra");
	const path = require("path");
	const axios = require("axios");
	const jimp = require("jimp");
	
	const { threadID, messageID, senderID } = event;
	const mention = Object.keys(event.mentions);
	
	if (!mention[0]) return api.sendMessage("✨ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐦𝐞𝐧𝐭𝐢𝐨𝐧 𝐚 𝐮𝐬𝐞𝐫 𝐭𝐨 𝐩𝐚𝐢𝐫 𝐰𝐢𝐭𝐡!", threadID, messageID);
	
	const one = senderID;
	const two = mention[0];
	
	const makeImage = async ({ one, two }) => {
		const __root = path.resolve(__dirname, "cache", "canvas");
		
		const circle = async (image) => {
			image = await jimp.read(image);
			image.circle();
			return await image.getBufferAsync("image/png");
		}
		
		let batgiam_img = await jimp.read(__root + "/bestu.png");
		let pathImg = __root + `/bestie_${one}_${two}.png`;
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
	
	return makeImage({ one, two }).then(path => {
		api.sendMessage({
			body: `🌸┋ 𝐁 𝐄 𝐒 𝐓 𝐈 𝐄 ┋🌸\n\n❖︎ 𝗬𝗼𝘂 𝗴𝘂𝘆𝘀 𝗮𝗿𝗲 𝗺𝗮𝗱𝗲 𝗳𝗼𝗿 𝗲𝗮𝗰𝗵 𝗼𝘁𝗵𝗲𝗿 💖\n\n❖︎ 𝗧𝗵𝗶𝘀 𝗶𝘀 𝘆𝗼𝘂𝗿 𝗯𝗲𝘀𝘁𝗳𝗿𝗶𝗲𝗻𝗱 𝗽𝗮𝗶𝗿𝗶𝗻𝗴 ✨`,
			attachment: fs.createReadStream(path)
		}, threadID, () => fs.unlinkSync(path), messageID);
	});
}
