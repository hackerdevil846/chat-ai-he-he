module.exports.config = {
	name: "pair6",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "✨ 𝑻𝒐𝒎𝒂𝒅𝒆𝒓 𝒎𝒐𝒏𝒐𝒓𝒐𝒏𝒋𝒐𝒏𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒌𝒉𝒆𝒍𝒂 ✨",
	commandCategory: "🎭 𝑷𝒊𝒄𝒕𝒖𝒓𝒆",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"fs-extra": "",
		"jimp": ""
	}
}

module.exports.onLoad = async function() {
	const { resolve } = global.nodemodule["path"];
	const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
	const { downloadFile } = global.utils;
	const dirMaterial = __dirname + `/cache/canvas/`;
	const path = resolve(__dirname, 'cache/canvas', 'pairing.png');
	if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
	if (!existsSync(path)) await downloadFile("https://i.postimg.cc/X7R3CLmb/267378493-3075346446127866-4722502659615516429-n.png", path);
}

module.exports.run = async function({ api, event, args, Users, Threads, Currencies }) {
	const axios = global.nodemodule["axios"];
	const fs = global.nodemodule["fs-extra"];
	const path = global.nodemodule["path"];
	const jimp = global.nodemodule["jimp"];
	const { threadID, messageID, senderID } = event;
	
	// Helper functions
	const circle = async (image) => {
		image = await jimp.read(image);
		image.circle();
		return await image.getBufferAsync("image/png");
	}

	const makeImage = async ({ one, two }) => {
		const __root = path.resolve(__dirname, "cache", "canvas");
		const pairing_img = await jimp.read(__root + "/pairing.png");
		const pathImg = __root + `/pairing_${one}_${two}.png`;
		const avatarOne = __root + `/avt_${one}.png`;
		const avatarTwo = __root + `/avt_${two}.png`;
		
		const getAvatar = async (uid) => {
			const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
			const response = await axios.get(url, { responseType: 'arraybuffer' });
			return response.data;
		}
		
		fs.writeFileSync(avatarOne, Buffer.from(await getAvatar(one), 'utf-8');
		fs.writeFileSync(avatarTwo, Buffer.from(await getAvatar(two), 'utf-8');
		
		const circleOne = await jimp.read(await circle(avatarOne));
		const circleTwo = await jimp.read(await circle(avatarTwo));
		
		pairing_img.composite(circleOne.resize(150, 150), 980, 200)
				  .composite(circleTwo.resize(150, 150), 140, 200);
		
		const raw = await pairing_img.getBufferAsync("image/png");
		fs.writeFileSync(pathImg, raw);
		fs.unlinkSync(avatarOne);
		fs.unlinkSync(avatarTwo);
		
		return pathImg;
	}

	// Main logic
	try {
		const tl = ['💘 21%', '💝 67%', '💔 19%', '❤️‍🔥 37%', '💖 17%', '💞 96%', '❣️ 52%', '💕 62%', '💓 76%', '💗 83%', '💯 100%', '💌 99%', "⚡ 0%", "💟 48%"];
		const tle = tl[Math.floor(Math.random() * tl.length)];
		
		const dataa = await api.getUserInfo(senderID);
		const namee = dataa[senderID].name;
		const loz = await api.getThreadInfo(threadID);
		const id = loz.participantIDs[Math.floor(Math.random() * loz.participantIDs.length)];
		const data = await api.getUserInfo(id);
		const name = data[id].name;
		
		const pathImg = await makeImage({ one: senderID, two: id });
		
		api.sendMessage({
			body: `🌸 𝑨𝒃𝒉𝒊𝒏𝒂𝒏𝒅𝒂𝒏 ${namee} 𝒋𝒖𝒕𝒊 𝒃𝒂𝒏𝒅𝒉𝒆𝒄𝒉𝒆 ${name} 𝒆𝒓 𝒔𝒂𝒕𝒉𝒆\n💌 𝑻𝒐𝒎𝒂𝒅𝒆𝒓 𝒎𝒊𝒍𝒂𝒏𝒆𝒓 𝒉𝒂𝒓: 〚 ${tle} 〛`,
			mentions: [
				{ id: senderID, tag: namee },
				{ id: id, tag: name }
			],
			attachment: fs.createReadStream(pathImg)
		}, threadID, () => fs.unlinkSync(pathImg), messageID);
		
	} catch (error) {
		console.error(error);
		api.sendMessage("❌ 𝑷𝒂𝒊𝒓𝒊𝒏𝒈 𝒆𝒓𝒓𝒐𝒓! 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.", threadID, messageID);
	}
}
