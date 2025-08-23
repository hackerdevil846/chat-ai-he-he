module.exports.config = {
	name: "help",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑩𝒐𝒕 𝒆𝒓 𝒔𝒐𝒃 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒆𝒓 𝒍𝒊𝒔𝒕",
	category: "𝒔𝒚𝒔𝒕𝒆𝒎",
	usages: "[𝑴𝒐𝒅𝒖𝒍𝒆 𝒏𝒂𝒎𝒆] or [page]",
	cooldowns: 1,
	envConfig: {
		autoUnsend: true,
		delayUnsend: 300
	}
};

module.exports.languages = {
	"en": {
		"moduleInfo": "「 %1 」\n%2\n\n❯ 𝑼𝒔𝒂𝒈𝒆: %3\n❯ 𝑪𝒂𝒕𝒆𝒈𝒐𝒓𝒚: %4\n❯ 𝑾𝒂𝒊𝒕𝒊𝒏𝒈 𝒕𝒊𝒎𝒆: %5 𝒔𝒆𝒄𝒐𝒏𝒅(𝒔)\n❯ 𝑷𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏: %6\n\n» 𝑴𝒐𝒅𝒖𝒍𝒆 𝒄𝒐𝒅𝒆 𝒃𝒚 %7 «",
		"helpList": "【 𝑻𝒐𝒕𝒂𝒍 %1 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 】\nUse: \"%2help (name)\" to get details.\n",
		"user": "𝑼𝒔𝒆𝒓",
        "adminGroup": "𝑨𝒅𝒎𝒊𝒏 𝒈𝒓𝒐𝒖𝒑",
        "adminBot": "𝑨𝒅𝒎𝒊𝒏 𝒃𝒐𝒕"
	}
};

module.exports.handleEvent = function ({ api, event, getText }) {
	try {
		const { commands } = global.client;
		const { threadID, messageID, body } = event;

		if (!body || typeof body === "undefined") return;
		// Only respond to messages that start with "help"
		// (keeps original behavior — do not change)
		if (body.indexOf("help") !== 0) return;

		const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
		if (splitBody.length === 1) return; // just "help" — leave to run() to show list
		const cmdName = splitBody[1].toLowerCase();

		if (!commands.has(cmdName)) return;

		const command = commands.get(cmdName);
		const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
		const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

		// build and send module info message
		const msg = getText(
			"moduleInfo",
			command.config.name,
			command.config.description || "No description.",
			`${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`,
			command.config.commandCategory || "system",
			command.config.cooldowns != null ? command.config.cooldowns : "0",
			command.config.credits || "Unknown"
		);

		// keep the same send signature as original (threadID, messageID)
		return api.sendMessage(msg, threadID, messageID);
	} catch (err) {
		// avoid throwing — original request: do not create problems
		// Log silently if available
		if (global && global.logger && typeof global.logger.error === "function") global.logger.error(err);
		return;
	}
};

module.exports.run = function({ api, event, args, getText }) {
	try {
		const { commands } = global.client;
		const { threadID, messageID } = event;
		const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
		const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

		// safe module config read (fall back to defaults)
		const moduleConfig = (global.configModule && global.configModule[this.config.name]) ? global.configModule[this.config.name] : {};
		const autoUnsend = (typeof moduleConfig.autoUnsend === "boolean") ? moduleConfig.autoUnsend : false;
		const delayUnsend = (typeof moduleConfig.delayUnsend === "number") ? moduleConfig.delayUnsend : 300;

		// if user asked for a specific module's help: show moduleInfo
		if (args && args.length >= 1) {
			const possibleName = args[0].toLowerCase();
			if (commands.has(possibleName)) {
				const command = commands.get(possibleName);
				const msg = getText(
					"moduleInfo",
					command.config.name,
					command.config.description || "No description.",
					`${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`,
					command.config.commandCategory || "system",
					command.config.cooldowns != null ? command.config.cooldowns : "0",
					command.config.credits || "Unknown"
				);
				return api.sendMessage(msg, threadID, messageID);
			}
		}

		// Otherwise: show paginated command list
		const arrayInfo = [];
		for (const [name] of commands) {
			arrayInfo.push(name);
		}

		// sort alphabetically
		arrayInfo.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

		const page = Math.max(1, parseInt(args[0]) || 1);
		const numberOfOnePage = 10;
		const totalPages = Math.max(1, Math.ceil(arrayInfo.length / numberOfOnePage));
		const startSlice = numberOfOnePage * (page - 1);
		let i = startSlice;
		const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);

		let msgList = "";
		for (let item of returnArray) {
			msgList += `🔹 「 ${++i} 」 ${prefix}${item}\n`;
		}

		const header = `📚 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝒍𝒊𝒔𝒕\n${getText("helpList", arrayInfo.length, prefix)}\n✨ 𝑷𝒂𝒈𝒆: (${page}/${totalPages})\n────────────────────\n`;
		const footer = `\n────────────────────\n🔎 Type: ${prefix}help (command name) to see details\n👑 Module credits: ${this.config.credits}`;

		const finalMessage = header + (msgList.length ? msgList : "No commands found.") + footer;

		// Send and optionally unsend (autoUnsend)
		return api.sendMessage(finalMessage, threadID, async (err, info) => {
			if (err) {
				// if send error, log silently and return
				if (global && global.logger && typeof global.logger.error === "function") global.logger.error(err);
				return;
			}
			// info.messageID is expected by many GoatBot wrappers — keep behavior
			if (autoUnsend) {
				await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
				try {
					return api.unsendMessage(info.messageID);
				} catch (e) {
					// ignore unsend errors
					if (global && global.logger && typeof global.logger.error === "function") global.logger.error(e);
					return;
				}
			} else return;
		}, messageID);
	} catch (err) {
		if (global && global.logger && typeof global.logger.error === "function") global.logger.error(err);
		return api.sendMessage("❗ 𝐇𝐚𝐨: An error occurred while processing help command.", threadID, messageID);
	}
};
