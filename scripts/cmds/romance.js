module.exports = {
	config: {
		name: "romance",
		version: "1.0.0",
		role: 0,
		author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
		countDown: 5,
		guide: "[tag someone]",
		dependencies: {
			"request": "",
			"fs-extra": ""
		}
	},

	onStart: async function({ api, event, args }) {
		// Dependency check
		try {
			const request = global.nodemodule["request"];
			const fs = global.nodemodule["fs-extra"];
		} catch (e) {
			return api.sendMessage("❌ | Missing dependencies: request and fs-extra", event.threadID, event.messageID);
		}

		const request = global.nodemodule["request"];
		const fs = global.nodemodule["fs-extra"];

		if (!args.join(" ")) return api.sendMessage("You haven't entered a message", event.threadID, event.messageID);
		
		return request('https://nekos.life/api/v2/img/kiss', (err, response, body) => {
			let picData = JSON.parse(body);
			var mention = Object.keys(event.mentions)[0];
			let getURL = picData.url;
			let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
			let tag = event.mentions[mention].replace("@", "");
			
			let callback = function() {
				api.sendMessage({
					body: tag + ", I love you so much ❤️",
					mentions: [{
						tag: tag,
						id: Object.keys(event.mentions)[0]
					}],
					attachment: fs.createReadStream(__dirname + `/cache/anime.${ext}`)
				}, event.threadID, () => fs.unlinkSync(__dirname + `/cache/anime.${ext}`), event.messageID);
			};
			request(getURL).pipe(fs.createWriteStream(__dirname + `/cache/anime.${ext}`)).on("close", callback);
		});
	}
};
