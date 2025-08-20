module.exports.config = {
	name: "id",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑼𝒔𝒆𝒓 𝒆𝒓 𝑰𝑫 𝒊𝒏𝒇𝒐 𝒃𝒆𝒓 𝒌𝒐𝒓𝒆 𝒅𝒆𝒌𝒉𝒂𝒏𝒐",
	commandCategory: "utility",
	usages: "[reply/mention/url/uid]",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"fs-extra": "",
		"request": ""
	}
};

module.exports.run = async function({ api, event, args, Users }) {
	const { threadID, messageID, type, messageReply, mentions } = event;
	const fs = global.nodemodule["fs-extra"];
	const request = global.nodemodule["request"];
	const axios = global.nodemodule["axios"];

	let uid;
	let name;

	try {
		if (type === "message_reply") {
			uid = messageReply.senderID;
			name = await Users.getNameUser(uid);
		} else if (args.length === 0) {
			uid = event.senderID;
			const res = await axios.get(`https://www.nguyenmanh.name.vn/api/fbInfo?id=${uid}&apikey=LV7LWgAp`);
			name = res.data.result.name || await Users.getNameUser(uid);
		} else if (args[0].match(/(https?:\/\/)?(www\.)?facebook\.com\/.+/)) {
			uid = await api.getUID(args[0]);
			const userInfo = await api.getUserInfoV2(uid);
			name = userInfo.name;
		} else if (Object.keys(mentions).length > 0) {
			uid = Object.keys(mentions)[0];
			name = mentions[uid];
		} else {
			uid = args[0];
			name = await Users.getNameUser(uid) || "𝑵𝒂𝒎𝒆 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅";
		}

		const callback = () => {
			api.sendMessage({
				body: `🎭 𝗨𝗦𝗘𝗥 𝗜𝗡𝗙𝗢 𝗖𝗔𝗥𝗗\n━━━━━━━━━━━━━━\n✨ 𝗡𝗮𝗺𝗲: ${name}\n🔖 𝗨𝗜𝗗: ${uid}\n📨 𝗠𝗲𝘀𝘀𝗲𝗻𝗴𝗲𝗿: m.me/${uid}\n🔗 𝗣𝗿𝗼𝗳𝗶𝗹𝗲 𝗟𝗶𝗻𝗸: https://facebook.com/${uid}\n━━━━━━━━━━━━━━`,
				attachment: fs.createReadStream(__dirname + "/cache/1.png")
			}, threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), messageID);
		};

		request(encodeURI(`https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
			.pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
			.on('close', callback);

	} catch (error) {
		api.sendMessage("❌ 𝗘𝗿𝗿𝗼𝗿:\n" + error.message, threadID, messageID);
	}
};
