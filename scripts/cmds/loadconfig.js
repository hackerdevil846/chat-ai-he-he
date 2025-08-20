const fs = require("fs-extra");

module.exports.config = {
	name: "loadconfig",
	aliases: ["loadcf"],
	version: "1.4",
	author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	countDown: 5,
	role: 2,
	description: {
		vi: "Load lại config của bot",
		en: "♻️ | Reload config of bot"
	},
	category: "owner",
	guide: "{pn}"
};

module.exports.languages = {
	vi: {
		success: "✅ | Config đã được load lại thành công"
	},
	en: {
		success: "✅ | Config has been reloaded successfully"
	}
};

module.exports.run = async function ({ api, event, getText }) {
	try {
		global.GoatBot.config = fs.readJsonSync(global.client.dirConfig);
		global.GoatBot.configCommands = fs.readJsonSync(global.client.dirConfigCommands);
		
		api.sendMessage(getText("success"), event.threadID, event.messageID);
	} catch (error) {
		console.error("❌ | Error reloading config:", error);
		api.sendMessage("🔴 | An error occurred while reloading config.", event.threadID, event.messageID);
	}
};
