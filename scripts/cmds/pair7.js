module.exports.config = {
	name: "pair7",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑬𝒌𝒕𝒖 𝒋𝒖𝒕𝒊 𝒃𝒂𝒏𝒅𝒉𝒂𝒓 𝒌𝒉𝒆𝒍𝒂 ✨",
	category: "romance",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"fs-extra": "",
		"jimp": ""
	}
};

module.exports.onLoad = async function() {
	const { resolve } = global.nodemodule["path"];
	const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
	const { downloadFile } = global.utils;
	const dirMaterial = __dirname + `/cache/canvas/`;
	const path = resolve(__dirname, 'cache/canvas', 'pairing.jpg');
	
	if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
	if (!existsSync(path)) {
		await downloadFile("https://i.pinimg.com/736x/15/fa/9d/15fa9d71cdd07486bb6f728dae2fb264.jpg", path);
	}
};

module.exports.onStart = async function({ api, event, Users }) {
	try {
		const fs = global.nodemodule["fs-extra"];
		const axios = global.nodemodule["axios"];
		const jimp = global.nodemodule["jimp"];
		const path = global.nodemodule["path"];
		
		const { threadID, messageID, senderID } = event;
		const __root = path.resolve(__dirname, "cache", "canvas");
		
		// Random compatibility percentages
		const tl = ['21%', '67%', '19%', '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', '99%', "0%", "48%"];
		const tle = tl[Math.floor(Math.random() * tl.length)];
		
		// Get sender info
		const senderInfo = await api.getUserInfo(senderID);
		const senderName = senderInfo[senderID].name;
		
		// Get random participant
		const threadInfo = await api.getThreadInfo(threadID);
		const participantID = threadInfo.participantIDs[Math.floor(Math.random() * threadInfo.participantIDs.length)];
		const participantInfo = await api.getUserInfo(participantID);
		const participantName = participantInfo[participantID].name;
		
		// Create image
		const resultPath = await createPairImage(senderID, participantID);
		
		// Send result
		api.sendMessage({
			body: `💞 𝐋𝐨𝐯𝐞 𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐢𝐨𝐧 💞\n\n╭───────────────◉\n│ ✨ ${senderName}\n│ 💘 𝐀𝐍𝐃\n│ ✨ ${participantName}\n╰───────────────◉\n\n𝐂𝐨𝐦𝐩𝐚𝐭𝐢𝐛𝐢𝐥𝐢𝐭𝐲: 🧪 ${tle}\n\n"𝑨𝒃𝒉𝒊𝒏𝒂𝒏𝒅𝒂𝒏 𝒕𝒖𝒎𝒊 𝒋𝒖𝒕𝒊 𝒃𝒂𝒏𝒅𝒉𝒍𝒆 𝒆𝒓 𝒔𝒂𝒕𝒉𝒆 ✨"`,
			mentions: [
				{ id: senderID, tag: senderName },
				{ id: participantID, tag: participantName }
			],
			attachment: fs.createReadStream(resultPath)
		}, threadID, () => fs.unlinkSync(resultPath), messageID);
		
	} catch (error) {
		console.error(error);
		api.sendMessage("❌ 𝐒𝐨𝐦𝐞𝐭𝐡𝐢𝐧𝐠 𝐰𝐞𝐧𝐭 𝐰𝐫𝐨𝐧𝐠 𝐢𝐧 𝐩𝐚𝐢𝐫𝐢𝐧𝐠!", threadID, messageID);
	}
};

async function createPairImage(uid1, uid2) {
	const fs = global.nodemodule["fs-extra"];
	const path = global.nodemodule["path"];
	const axios = global.nodemodule["axios"];
	const jimp = global.nodemodule["jimp"];
	const __root = path.resolve(__dirname, "cache", "canvas");
	
	const outputPath = path.join(__root, `pairing_${uid1}_${uid2}.png`);
	const bgPath = path.join(__root, 'pairing.jpg');
	
	// Download avatars
	const [avatar1, avatar2] = await Promise.all([
		downloadAvatar(uid1, path.join(__root, `avt_${uid1}.png`)),
		downloadAvatar(uid2, path.join(__root, `avt_${uid2}.png`))
	]);
	
	// Process images
	const bg = await jimp.read(bgPath);
	const circularAvatar1 = await createCircularImage(avatar1);
	const circularAvatar2 = await createCircularImage(avatar2);
	
	bg.composite(await jimp.read(circularAvatar1).then(img => img.resize(85, 85)), 355, 100)
	  .composite(await jimp.read(circularAvatar2).then(img => img.resize(75, 75)), 250, 140);
	
	await bg.writeAsync(outputPath);
	
	// Cleanup temp files
	fs.unlinkSync(avatar1);
	fs.unlinkSync(avatar2);
	
	return outputPath;
}

async function downloadAvatar(uid, savePath) {
	const axios = global.nodemodule["axios"];
	const fs = global.nodemodule["fs-extra"];
	
	const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
	const response = await axios.get(url, { responseType: 'arraybuffer' });
	
	fs.writeFileSync(savePath, Buffer.from(response.data, 'binary'));
	return savePath;
}

async function createCircularImage(imagePath) {
	const jimp = global.nodemodule["jimp"];
	const image = await jimp.read(imagePath);
	image.circle();
	return await image.getBufferAsync("image/png");
}
