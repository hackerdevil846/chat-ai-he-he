module.exports.config = {
	name: "pair4",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🍓 𝑮𝒓𝒐𝒖𝒑 𝒎𝒆𝒎𝒃𝒆𝒓𝒔 𝒑𝒂𝒊𝒓𝒊𝒏𝒈 𝒇𝒆𝒂𝒕𝒖𝒓𝒆",
	category: "💞 𝒓𝒆𝒍𝒂𝒕𝒊𝒐𝒏𝒔𝒉𝒊𝒑",
	cooldowns: 5,
	usages: "[mention/reply/leave blank]",
	dependencies: {
		"axios": "",
		"fs-extra": "",
		"jimp": ""
	},
	envConfig: {}
};

module.exports.onLoad = async function() {
	const path = require("path");
	const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
	const { downloadFile } = global.utils;
	const dirMaterial = __dirname + `/cache/canvas/`;
	const pathFile = path.resolve(__dirname, 'cache/canvas', 'pairing.png');
	
	if (!existsSync(dirMaterial)) 
		mkdirSync(dirMaterial, { recursive: true });
	
	if (!existsSync(pathFile)) 
		await downloadFile("https://i.postimg.cc/X7R3CLmb/267378493-3075346446127866-4722502659615516429-n.png", pathFile);
}

async function makeImage({ one, two }) {
	const fs = global.nodemodule["fs-extra"];
	const path = require("path");
	const axios = global.nodemodule["axios"]; 
	const jimp = global.nodemodule["jimp"];
	const __root = path.resolve(__dirname, "cache", "canvas");

	let pairing_img = await jimp.read(__root + "/pairing.png");
	let pathImg = __root + `/pairing_${one}_${two}.png`;
	let avatarOne = __root + `/avt_${one}.png`;
	let avatarTwo = __root + `/avt_${two}.png`;
	
	let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
		responseType: 'arraybuffer' 
	})).data;
	fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));
	
	let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
		responseType: 'arraybuffer' 
	})).data;
	fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));
	
	let circleOne = await jimp.read(await circle(avatarOne));
	let circleTwo = await jimp.read(await circle(avatarTwo));
	pairing_img.composite(circleOne.resize(150, 150), 980, 200)
			  .composite(circleTwo.resize(150, 150), 140, 200);
	
	let raw = await pairing_img.getBufferAsync("image/png");
	fs.writeFileSync(pathImg, raw);
	fs.unlinkSync(avatarOne);
	fs.unlinkSync(avatarTwo);
	
	return pathImg;
}

async function circle(image) {
	const jimp = global.nodemodule["jimp"];
	image = await jimp.read(image);
	image.circle();
	return await image.getBufferAsync("image/png");
}

module.exports.onStart = async function({ api, event }) {
	const { threadID, messageID, senderID } = event;
	const fs = global.nodemodule["fs-extra"];
	
	// Compatibility percentages
	const tl = ['21%', '11%', '55%', '89%', '22%', '45%', '1%', '4%', 
				'78%', '15%', '91%', '77%', '41%', '32%', '67%', '19%', 
				'37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', 
				'99%', "0%", "48%"];
	const tle = tl[Math.floor(Math.random() * tl.length)];
	
	// Get sender info
	const senderInfo = await api.getUserInfo(senderID);
	const senderName = senderInfo[senderID].name;
	
	// Get random participant
	const threadInfo = await api.getThreadInfo(threadID);
	const participant = threadInfo.participantIDs[Math.floor(Math.random() * threadInfo.participantIDs.length)];
	const participantInfo = await api.getUserInfo(participant);
	const participantName = participantInfo[participant].name;
	
	// Create mention array
	const arraytag = [
		{ id: senderID, tag: senderName },
		{ id: participant, tag: participantName }
	];
	
	// Generate pairing image
	const path = await makeImage({ 
		one: senderID, 
		two: participant 
	});
	
	// Send result
	return api.sendMessage({ 
		body: `🌸┈┈┈┈┈┈┈┈┈┈┈┈🌸\n🍓 𝑨𝒃𝒉𝒊𝒏𝒂𝒏𝒅𝒂𝒏 ${senderName}, 𝒕𝒖𝒎𝒊 𝒑𝒂𝒊𝒓 𝒉𝒐𝒍𝒆 ${participantName} 𝒆𝒓 𝒔𝒂𝒕𝒉𝒆!\n💝 𝑻𝒐𝒎𝒂𝒅𝒆𝒓 𝒎𝒊𝒍𝒂𝒏𝒆𝒓 𝒉𝒂𝒓: ${tle}\n🌸┈┈┈┈┈┈┈┈┈┈┈┈🌸`,
		mentions: arraytag,
		attachment: fs.createReadStream(path) 
	}, threadID, () => fs.unlinkSync(path), messageID);
}
