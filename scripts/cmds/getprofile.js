module.exports = {
	config: {
		name: "getprofile",
		version: "1.0.0",
		role: 0,
		author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
		countDown: 0,
		guide: "[reply|mention|profile_url]",
		dependencies: {
			"axios": "",
			"request": "",
			"fs-extra": ""
		}
	},

	onStart: async function({ api, event, args }) {
		// Dependency check
		try {
			const axios = global.nodemodule["axios"];
			const request = global.nodemodule["request"];
			const fs = global.nodemodule["fs-extra"];
		} catch (e) {
			return api.sendMessage("❌ | Missing dependencies: axios, request and fs-extra", event.threadID, event.messageID);
		}

		const axios = global.nodemodule['axios']; 
		
		if (event.type == "message_reply") { 
			uid = event.messageReply.senderID;
			return api.sendMessage(`https://www.facebook.com/profile.php?id=${uid}`, event.threadID, event.messageID);
		}
		
		if (!args[0]) {
			return api.sendMessage(`https://www.facebook.com/profile.php?id=${event.senderID}`, event.threadID, event.messageID);
		} else {
			if (args[0].indexOf(".com/") !== -1) {
				const res_ID = await api.getUID(args[0]);  
				return api.sendMessage(`${res_ID}`, event.threadID, event.messageID);
			} else {
				for (var i = 0; i < Object.keys(event.mentions).length; i++) {
					api.sendMessage(`${Object.values(event.mentions)[i].replace('@', '')}\n→ Profile: https://www.facebook.com/profile.php?id=${Object.keys(event.mentions)[i]}`, event.threadID);
				}
				return;
			}
		}
	}
};
