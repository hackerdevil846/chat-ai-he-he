module.exports = {
	config: {
		name: "fistfight",
		version: "1.0.0",
		role: 0,
		author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
		countDown: 5,
		guide: "[tag]",
		dependencies: {
			"request": "",
			"fs-extra": ""
		}
	},

	onStart: async function({ api, event }) {
		// Dependency check
		try {
			const request = global.nodemodule["request"];
			const fs = global.nodemodule["fs-extra"];
		} catch (e) {
			return api.sendMessage("❌ | Missing dependencies: request and fs-extra", event.threadID, event.messageID);
		}

		const request = global.nodemodule["request"];
		const fs = global.nodemodule["fs-extra"];

		var link = [    
			"https://i.postimg.cc/SNX8pD8Z/13126.gif",
			"https://i.postimg.cc/TYZb2gJT/1467506881-1016b5fd386cf30488508cf6f0a2bee5.gif",
			"https://i.postimg.cc/fyV3DR33/anime-punch.gif",
			"https://i.postimg.cc/P5sLnhdx/onehit-30-5-2016-3.gif",
		];

		var mention = Object.keys(event.mentions);
		if (!mention[0]) return api.sendMessage("Please tag 1 person", event.threadID, event.messageID);
		
		let tag = event.mentions[mention].replace("@", "");
		
		var callback = () => api.sendMessage({
			body: `${tag}` + ` Take this punch right in your face! Stop talking nonsense! 👿`,
			mentions: [{ tag: tag, id: Object.keys(event.mentions)[0] }],
			attachment: fs.createReadStream(__dirname + "/cache/puch.gif")
		}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/puch.gif"));  

		return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname + "/cache/puch.gif")).on("close", () => callback());
	}
};
