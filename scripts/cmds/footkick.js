module.exports = {
	config: {
		name: "footkick",
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

		var links = [    
			"https://i.postimg.cc/65TSxJYD/2ce5a017f6556ff103bce87b273b89b7.gif",
			"https://i.postimg.cc/65SP9jPT/Anime-083428-6224795.gif",
			"https://i.postimg.cc/RFXP2XfS/jXOwoHx.gif",
			"https://i.postimg.cc/jSPMRsNk/tumblr-nyc5ygy2a-Z1uz35lto1-540.gif",
		];

		var mention = Object.keys(event.mentions);
		if (!mention[0]) return api.sendMessage("Please tag 1 person", event.threadID, event.messageID);
		
		let tag = event.mentions[mention].replace("@", "");
		
		var callback = () => api.sendMessage({
			body: `${tag}` + ` You're so weak, I'll kick you to death! 🎀`,
			mentions: [{ tag: tag, id: Object.keys(event.mentions)[0] }],
			attachment: fs.createReadStream(__dirname + "/cache/spair.gif")
		}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/spair.gif"));  

		return request(encodeURI(links[Math.floor(Math.random() * links.length)])).pipe(fs.createWriteStream(__dirname + "/cache/spair.gif")).on("close", () => callback());
	}
};
