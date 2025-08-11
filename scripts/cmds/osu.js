module.exports.config = {
	name: "osu",
	version: "1.0.3",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝒖𝒔𝒆𝒓𝒏𝒂𝒎𝒆 𝒅𝒊𝒚𝒆 𝒐𝒔𝒖! 𝒑𝒍𝒂𝒚𝒆𝒓 𝒊𝒏𝒇𝒐 𝒑𝒂𝒘𝒏",
	commandCategory: "𝑔𝑎𝑚𝑒",
	usages: "[𝒖𝒔𝒆𝒓𝒏𝒂𝒎𝒆]",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"fs-extra": ""
	}
};

module.exports.run = async function ({ api, event, args }) {
	const fs = global.nodemodule["fs-extra"];
	const axios = global.nodemodule["axios"];
	const path = __dirname + `/cache/${event.senderID}-osu.png`;

	if (!args[0]) {
		return api.sendMessage("⚡ 𝒖𝒔𝒆𝒓𝒏𝒂𝒎𝒆 𝒅𝒆𝒖𝒏 𝒑𝒍𝒆𝒂𝒔𝒆!", event.threadID, event.messageID);
	}

	try {
		const username = encodeURIComponent(args.join(" "));
		const url = `http://lemmmy.pw/osusig/sig.php?colour=hex8866ee&uname=${username}&pp=1&countryrank&rankedscore&onlineindicator=undefined&xpbar&xpbarhex`;
		
		const response = await axios({
			url,
			method: 'GET',
			responseType: 'stream'
		});

		const writer = fs.createWriteStream(path);
		response.data.pipe(writer);
		
		await new Promise((resolve, reject) => {
			writer.on('finish', resolve);
			writer.on('error', reject);
		});

		await api.sendMessage({
			body: `🎮 𝒐𝒔𝒖! 𝒑𝒍𝒂𝒚𝒆𝒓 𝒊𝒏𝒇𝒐 𝒇𝒐𝒓: ${args.join(" ")}`,
			attachment: fs.createReadStream(path)
		}, event.threadID);

		fs.unlinkSync(path);
		
	} catch (error) {
		console.error(error);
		return api.sendMessage("❌ 𝒆𝒓𝒓𝒐𝒓: 𝒑𝒍𝒆𝒂𝒔𝒆 𝒄𝒉𝒆𝒄𝒌 𝒖𝒔𝒆𝒓𝒏𝒂𝒎𝒆 𝒂𝒏𝒅 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏!", event.threadID, event.messageID);
	}
};
