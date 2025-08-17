module.exports.config = {
	name: "pair2",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑬𝒌𝒕𝒊 𝒋𝒐𝒓𝒊 𝒃𝒂𝒏𝒅𝒉𝒂𝒓 𝒌𝒉𝒆𝒍𝒂",
	commandCategory: "𝑷𝒊𝒄𝒕𝒖𝒓𝒆",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"fs-extra": "",
		"jimp": ""
	},
	envConfig: {}
};

module.exports.onLoad = async function() {
	const { resolve } = global.nodemodule["path"];
	const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
	const { downloadFile } = global.utils;
	const dirMaterial = __dirname + `/cache/canvas/`;
	const path = resolve(__dirname, 'cache/canvas', 'pairing.png');
	
	if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
	if (!existsSync(path)) await downloadFile(
		"https://i.postimg.cc/X7R3CLmb/267378493-3075346446127866-4722502659615516429-n.png", 
		path
	);
};

module.exports.run = async function({ api, event, Users, Threads, Currencies }) {
	const { resolve } = global.nodemodule["path"];
	const fs = global.nodemodule["fs-extra"];
	const axios = global.nodemodule["axios"];
	const jimp = global.nodemodule["jimp"];
	const __root = resolve(__dirname, "cache", "canvas");
	
	async function circle(imagePath) {
		const img = await jimp.read(imagePath);
		img.circle();
		return await img.getBufferAsync("image/png");
	}

	async function makeImage(one, two) {
		const pathImg = __root + `/pairing_${one}_${two}.png`;
		const avatarOne = __root + `/avt_${one}.png`;
		const avatarTwo = __root + `/avt_${two}.png`;
		const pairingImg = await jimp.read(__root + "/pairing.png");
		
		const getAvatar = async (uid) => {
			const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
			const { data } = await axios.get(url, { responseType: 'arraybuffer' });
			return Buffer.from(data, 'utf-8');
		};
		
		fs.writeFileSync(avatarOne, await getAvatar(one));
		fs.writeFileSync(avatarTwo, await getAvatar(two));
		
		const circleOne = await jimp.read(await circle(avatarOne));
		const circleTwo = await jimp.read(await circle(avatarTwo));
		
		pairingImg.composite(circleOne.resize(150, 150), 980, 200)
		         .composite(circleTwo.resize(150, 150), 140, 200);
		
		const raw = await pairingImg.getBufferAsync("image/png");
		fs.writeFileSync(pathImg, raw);
		
		[avatarOne, avatarTwo].forEach(path => fs.existsSync(path) && fs.unlinkSync(path));
		return pathImg;
	}

	try {
		const tl = ['𝟮𝟭%', '𝟲𝟳%', '𝟭𝟵%', '𝟯𝟳%', '𝟭𝟳%', '𝟵𝟲%', '𝟱𝟮%', '𝟲𝟮%', '𝟳𝟲%', '𝟴𝟯%', '𝟭𝟬𝟬%', '𝟵𝟵%', "𝟬%", "𝟰𝟴%"];
		const tle = tl[Math.floor(Math.random() * tl.length)];
		const { senderID, threadID, messageID } = event;
		
		const namee = (await api.getUserInfo(senderID))[senderID].name;
		const threadInfo = await api.getThreadInfo(threadID);
		const randomID = threadInfo.participantIDs[Math.floor(Math.random() * threadInfo.participantIDs.length)];
		const name = (await api.getUserInfo(randomID))[randomID].name;
		
		const imagePath = await makeImage(senderID, randomID);
		const msg = `🎉 𝑨𝒃𝒉𝒊𝒏𝒂𝒏𝒅𝒂𝒏 ${namee}, 𝒕𝒖𝒎𝒊 𝒋𝒖𝒕𝒊 𝒃𝒂𝒏𝒅𝒉𝒍𝒆 ${name} 𝒆𝒓 𝒔𝒂𝒕𝒉𝒆! 💖\n💌 𝑺𝒂𝒎𝒂𝒏𝒏𝒋𝒐𝒔𝒚𝒂𝒓 𝒉𝒂𝒓: 〘${tle}〙`;
		const mentions = [
			{ id: senderID, tag: namee },
			{ id: randomID, tag: name }
		];
		
		return api.sendMessage({
			body: msg,
			mentions,
			attachment: fs.createReadStream(imagePath)
		}, threadID, () => fs.unlinkSync(imagePath), messageID);
		
	} catch (error) {
		console.error("Pair command error:", error);
		return api.sendMessage("❌ 𝑨𝒓𝒆 𝒌𝒉𝒂𝒍𝒂𝒕𝒊 𝒉𝒐𝒚𝒆𝒈𝒆𝒄𝒉𝒆! 𝒑𝒖𝒏𝒂𝒓𝒂𝒚 𝒄𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏...", event.threadID);
	}
};
