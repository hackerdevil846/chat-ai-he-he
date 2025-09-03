module.exports = {
	config: {
		name: "changelang",
		version: "1.0.0",
		role: 2,
		author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
		countDown: 5,
		guide: "[en] [bn]",
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

		const { threadID, messageID } = event;

		switch (args[0]) {
			case "english":
			case "en":
				{
					return api.sendMessage(`Language has been converted to English`, threadID, () => global.config.language = "en"); 
				}
				break;
			
			case "bangla":
			case "bn":
				{
					return api.sendMessage(`Language has been converted to Bangla`, threadID, () => global.config.language = "bn"); 
				}
				break;
		
			default:
				{
					return api.sendMessage("Syntax error, use: changelang [en / bn]", threadID, messageID);
				}   
				break;
		}	
	}
};
