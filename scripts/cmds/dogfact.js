module.exports.config = {
	name: "dogfact",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🐕 Random dog images with interesting facts",
	category: "random-img",
	usages: "[dogfact]",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"request": "",
		"fs-extra": ""
	}
};

module.exports.run = async function({ api, event }) {
	try {
		const axios = global.nodemodule["axios"];
		const fs = global.nodemodule["fs-extra"];
		const request = global.nodemodule["request"];
		const { threadID, messageID } = event;

		const res = await axios.get(`https://some-random-api.ml/animal/dog`);
		const data = res.data;

		const callback = () => api.sendMessage({
			body: `🐶 | Dog Fact:\n${data.fact}`,
			attachment: fs.createReadStream(__dirname + '/cache/dog_image.png')
		}, threadID, () => fs.unlinkSync(__dirname + '/cache/dog_image.png'), messageID);

		request(encodeURI(data.image))
			.pipe(fs.createWriteStream(__dirname + '/cache/dog_image.png'))
			.on('close', callback);
			
	} catch (error) {
		api.sendMessage("❌ | Failed to fetch dog fact. Please try again later.", event.threadID, event.messageID);
		console.error(error);
	}
};
