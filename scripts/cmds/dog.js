module.exports.config = {
	name: "dog",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🐶 𝑩𝒐𝒔𝒔 𝒌𝒆 𝒅𝒆𝒌𝒉𝒂𝒓 𝒋𝒐𝒏𝒏𝒐",
	category: "🖼️ 𝑷𝒊𝒄𝒕𝒖𝒓𝒆",
	usages: "🐾 𝒅𝒐𝒈",
	cooldowns: 1,
	dependencies: {
		"axios": "",
		"request": ""
	}
};

module.exports.onStart = async function({ api, event }) {
	const axios = require('axios');
	const request = require('request');
	const fs = require("fs");
	
	try {
		const response = await axios.get('https://nekos.life/api/v2/img/woof');
		const ext = response.data.url.substring(response.data.url.lastIndexOf(".") + 1);
		const path = __dirname + `/cache/dog.${ext}`;
		
		request(response.data.url).pipe(fs.createWriteStream(path)).on("close", () => {
			api.sendMessage({
				body: `🐕‍🦺 | 𝑫𝒐𝒈 𝑷𝒊𝒄 𝒇𝒐𝒓 𝒚𝒐𝒖 𝒃𝒐𝒔𝒔!`,
				attachment: fs.createReadStream(path)
			}, event.threadID, () => fs.unlinkSync(path), event.messageID);
		});
	} catch (error) {
		api.sendMessage("❌ | 𝑬𝒓𝒓𝒐𝒓 𝒇𝒆𝒕𝒄𝒉𝒊𝒏𝒈 𝒅𝒐𝒈 𝒊𝒎𝒂𝒈𝒆!", event.threadID, event.messageID);
	}
};
