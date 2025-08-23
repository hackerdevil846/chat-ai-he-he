const fs = require("fs-extra");

module.exports.config = {
	name: "loadconfig",
	aliases: ["loadcf"],
	version: "1.4",
	hasPermssion: 2,        // bot owner/admins
	role: 2,                // kept for backward compatibility
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: {
		vi: "Tải lại (reload) file cấu hình của bot",
		en: "♻️ | Reload bot configuration"
	},
	category: "owner",
	usages: "{pn}",
	cooldowns: 5,
	countDown: 5,           // kept for backward compatibility
	guide: "{pn} - Reload toàn bộ config (config & configCommands)"
};

module.exports.languages = {
	vi: {
		success: "✅ | Config đã được load lại thành công. ♻️",
		error: "🔴 | Lỗi xảy ra khi load lại config."
	},
	en: {
		success: "✅ | Config has been reloaded successfully. ♻️",
		error: "🔴 | An error occurred while reloading config."
	}
};

/**
 * onLoad / onStart
 * Many GoatBot loaders expect an onStart or onLoad function to exist.
 * We provide both (onStart delegates to onLoad) to avoid "onStart of command undefined".
 */
module.exports.onLoad = function ({ api, logger } = {}) {
	// safe, non-blocking init code
	try {
		if (logger && typeof logger.info === "function") {
			logger.info(`[loadconfig] Module loaded: ${this.config.name} v${this.config.version}`);
		} else {
			console.info(`[loadconfig] Module loaded: ${this.config.name} v${this.config.version}`);
		}
	} catch (err) {
		// do not throw — keep loader happy
		console.error("[loadconfig] onLoad error:", err);
	}
};

// Provide onStart as many loaders call onStart specifically
module.exports.onStart = module.exports.onLoad;

/**
 * Main command runner
 * Keeps behavior identical: reads config files from global.client.dirConfig and global.client.dirConfigCommands
 * and updates global.GoatBot.config & global.GoatBot.configCommands.
 */
module.exports.run = async function ({ api, event, args, getText } = {}) {
	// safe fallback for getText
	const t = (key) => {
		try {
			if (typeof getText === "function") return getText(key);
		} catch (e) { /* ignore */ }
		// fallback to english messages from this module
		return (this.languages && this.languages.en && this.languages.en[key]) || key;
	};

	try {
		// Read the same paths you used originally (no path changes)
		global.GoatBot = global.GoatBot || {};
		global.GoatBot.config = fs.readJsonSync(global.client.dirConfig);
		global.GoatBot.configCommands = fs.readJsonSync(global.client.dirConfigCommands);

		// Send friendly success message
		const successMsg = t("success") || "✅ | Config has been reloaded successfully. ♻️";
		await api.sendMessage(successMsg, event.threadID, event.messageID);
	} catch (error) {
		// Log full error on console for debugging, but send a clean message to chat
		console.error("❌ | Error reloading config:", error);

		const errText = t("error") || "🔴 | An error occurred while reloading config.";
		// include short error snippet so owner can see what went wrong (keeps it readable)
		const shortErr = (error && error.message) ? `\n\n\`\`\`Error: ${error.message}\`\`\`` : "";
		await api.sendMessage(`${errText}${shortErr}`, event.threadID, event.messageID);
	}
};
