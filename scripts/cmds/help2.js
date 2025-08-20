module.exports.config = {
	name: "help2",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑵𝒊𝒋𝒆𝒓 𝑩𝒐𝒕 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝑳𝒊𝒔𝒕",
	commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
	usages: "[𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝑵𝒂𝒎𝒆]",
	cooldowns: 1,
	envConfig: {
		autoUnsend: true,
		delayUnsend: 300
	}
};

module.exports.languages = {
	"en": {
		"moduleInfo": "╭───────────⭓\n│ ✦ %1\n│ ✦ %2\n│✦\n│ ❯ Usage: %3\n│ ❯ Category: %4\n│ ❯ Cooldown: %5s\n│ ❯ Permission: %6\n╰─────────────⭓\n\n✦ Module code by %7 ✦",
		"helpList": "╭───────⭓\n│ ✦ 𝗧𝗼𝘁𝗮𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: %1\n│ ✦ 𝗣𝗮𝗴𝗲: %2/%3\n╰─────────⭓\n\n%4\n\n✦ Use \"%5help <cmd>\" for details! ✦",
		"user": "👤 User",
		"adminGroup": "👥 Admin Group",
		"adminBot": "🤖 Bot Admin"
	}
};

module.exports.handleEvent = function ({ api, event, getText }) {
	const { commands } = global.client;
	const { threadID, messageID, body } = event;

	if (!body || body.indexOf("help") !== 0) return;
	const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
	if (splitBody.length === 1 || !commands.has(splitBody[1].toLowerCase())) return;
	
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	const command = commands.get(splitBody[1].toLowerCase());
	const prefix = threadSetting.PREFIX || global.config.PREFIX;
	
	return api.sendMessage(
		getText(
			"moduleInfo",
			command.config.name,
			command.config.description,
			`${prefix}${command.config.name} ${command.config.usages || ""}`,
			command.config.commandCategory,
			command.config.cooldowns,
			command.config.hasPermssion === 0 ? getText("user") : 
			command.config.hasPermssion === 1 ? getText("adminGroup") : getText("adminBot"),
			command.config.credits
		),
		threadID,
		messageID
	);
}

module.exports.run = function({ api, event, args, getText }) {
	const { commands } = global.client;
	const { threadID, messageID } = event;
	const command = commands.get((args[0] || "").toLowerCase());
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
	const prefix = threadSetting.PREFIX || global.config.PREFIX;

	if (!command) {
		const arrayInfo = Array.from(commands.keys());
		const page = parseInt(args[0]) || 1;
		const numberOfOnePage = 20;
		const totalPages = Math.ceil(arrayInfo.length / numberOfOnePage);
		
		if (page < 1 || page > totalPages) {
			return api.sendMessage("❌ Invalid page number!", threadID, messageID);
		}

		const startSlice = (page - 1) * numberOfOnePage;
		const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);
		
		let msg = returnArray.map((item, index) => 
			`${startSlice + index + 1}. ${prefix}${item}`
		).join("\n");

		return api.sendMessage(
			getText("helpList", arrayInfo.length, page, totalPages, msg, prefix),
			threadID,
			async (error, info) => {
				if (autoUnsend) {
					await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
					return api.unsendMessage(info.messageID);
				}
			}
		);
	}

	return api.sendMessage(
		getText(
			"moduleInfo",
			command.config.name,
			command.config.description,
			`${prefix}${command.config.name} ${command.config.usages || ""}`,
			command.config.commandCategory,
			command.config.cooldowns,
			command.config.hasPermssion === 0 ? getText("user") : 
			command.config.hasPermssion === 1 ? getText("adminGroup") : getText("adminBot"),
			command.config.credits
		),
		threadID,
		messageID
	);
};
