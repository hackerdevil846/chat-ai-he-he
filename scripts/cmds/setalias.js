module.exports.config = {
	name: "setalias",
	version: "1.8",
	author: "NTKhang",
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	countDown: 5,
	role: 0,
	description: {
		vi: "Thêm tên gọi khác cho 1 lệnh bất kỳ trong nhóm của bạn",
		en: "Add an alias for any command in your group"
	},
	commandCategory: "config",
	usages: "[add|rm|remove|list] <alias> <command> [-g]",
	cooldowns: 5
};

module.exports.languages = {
	vi: {
		commandNotExist: "❌ Lệnh \"%1\" không tồn tại",
		aliasExist: "❌ Tên gọi \"%1\" đã tồn tại cho lệnh \"%2\" trong hệ thống",
		addAliasSuccess: "✅ Đã thêm tên gọi \"%1\" cho lệnh \"%2\" trong hệ thống",
		noPermissionAdd: "❌ Bạn không có quyền thêm tên gọi \"%1\" cho lệnh \"%2\" trong hệ thống",
		aliasIsCommand: "❌ Tên gọi \"%1\" trùng với tên lệnh khác trong hệ thống bot",
		aliasExistInGroup: "❌ Tên gọi \"%1\" đã tồn tại cho lệnh \"%2\" trong nhóm này",
		addAliasToGroupSuccess: "✅ Đã thêm tên gọi \"%1\" cho lệnh \"%2\" trong nhóm chat của bạn",
		aliasNotExist: "❌ Tên gọi \"%1\" không tồn tại trong lệnh \"%2\"",
		removeAliasSuccess: "✅ Đã xóa tên gọi \"%1\" cho lệnh \"%2\" trong hệ thống",
		noPermissionDelete: "❌ Bạn không có quyền xóa tên gọi \"%1\" cho lệnh \"%2\" trong hệ thống",
		noAliasInGroup: "❌ Lệnh \"%1\" không có tên gọi khác nào trong nhóm của bạn",
		removeAliasInGroupSuccess: "✅ Đã xóa tên gọi \"%1\" khỏi lệnh \"%2\" trong nhóm chat của bạn",
		aliasList: "📜 Danh sách tên gọi khác của các lệnh trong hệ thống:\n%1",
		noAliasInSystem: "⚠️ Hiện tại không có tên gọi nào trong hệ thống",
		notExistAliasInGroup: "⚠️ Nhóm bạn chưa cài đặt tên gọi khác cho lệnh nào cả",
		aliasListInGroup: "📜 Dan sách tên gọi khác của các lệnh trong nhóm chat của bạn:\n%1"
	},
	en: {
		commandNotExist: "❌ Command \"%1\" does not exist",
		aliasExist: "❌ Alias \"%1\" already exists for command \"%2\" in the system",
		addAliasSuccess: "✅ Added alias \"%1\" for command \"%2\" in the system",
		noPermissionAdd: "❌ You do not have permission to add alias \"%1\" for command \"%2\" in the system",
		aliasIsCommand: "❌ Alias \"%1\" is the same as another command in the system",
		aliasExistInGroup: "❌ Alias \"%1\" already exists for command \"%2\" in this group",
		addAliasToGroupSuccess: "✅ Added alias \"%1\" for command \"%2\" in your group chat",
		aliasNotExist: "❌ Alias \"%1\" does not exist for command \"%2\"",
		removeAliasSuccess: "✅ Removed alias \"%1\" for command \"%2\" in the system",
		noPermissionDelete: "❌ You do not have permission to remove alias \"%1\" for command \"%2\" in the system",
		noAliasInGroup: "❌ Command \"%1\" does not have any other alias in your group",
		removeAliasInGroupSuccess: "✅ Removed alias \"%1\" for command \"%2\" in your group chat",
		aliasList: "📜 List of other aliases for commands in the system:\n%1",
		noAliasInSystem: "⚠️ There are no aliases in the system",
		notExistAliasInGroup: "⚠️ Your group has not set any other aliases for commands",
		aliasListInGroup: "📜 List of other aliases for commands in your group chat:\n%1"
	}
};

module.exports.onLoad = function () {
	// Nothing to do on load for this module.
	// This is left here so you can extend later if needed.
};

module.exports.run = async function ({
	api,
	event,
	args = [],
	Threads, // may be available in your GoatBot env
	Users,
	Currencies,
	permssion, // some frameworks pass this (note spelling)
	role, // fallback
	threadsData, // original name used in older modules
	globalData, // original name used in older modules
	getLang, // function to get localized strings
	message // some GoatBot wrappers provide a message helper object (with reply/SyntaxError)
}) {
	// Use whichever role/permssion is provided by the runtime.
	const userRole = typeof permssion !== 'undefined' ? permssion : (typeof role !== 'undefined' ? role : 0);

	// Helper wrappers for thread/global storage - try to use provided objects but fallback gracefully.
	const threadID = event.threadID || (event.message && event.message.threadID) || (event.senderID ? event.senderID : null);

	const threadGet = async (tid, key, defaultValue) => {
		if (threadsData && typeof threadsData.get === "function") return await threadsData.get(tid, key, defaultValue);
		if (Threads && typeof Threads.get === "function") return await Threads.get(tid, key, defaultValue);
		// fallback to staying in-memory per-process (less persistent)
		global._goatbot_threads = global._goatbot_threads || {};
		return (global._goatbot_threads[tid] && global._goatbot_threads[tid][key]) || defaultValue;
	};
	const threadSet = async (tid, value, key) => {
		if (threadsData && typeof threadsData.set === "function") return await threadsData.set(tid, value, key);
		if (Threads && typeof Threads.set === "function") return await Threads.set(tid, value, key);
		global._goatbot_threads = global._goatbot_threads || {};
		global._goatbot_threads[tid] = global._goatbot_threads[tid] || {};
		global._goatbot_threads[tid][key] = value;
		return;
	};

	const globalGet = async (moduleName, key, defaultValue) => {
		if (globalData && typeof globalData.get === "function") return await globalData.get(moduleName, key, defaultValue);
		// fallback to global.GoatBotStorage
		global._goatbot_global = global._goatbot_global || {};
		return (global._goatbot_global[moduleName] && global._goatbot_global[moduleName][key]) || defaultValue;
	};
	const globalSet = async (moduleName, value, key) => {
		if (globalData && typeof globalData.set === "function") return await globalData.set(moduleName, value, key);
		global._goatbot_global = global._goatbot_global || {};
		global._goatbot_global[moduleName] = value;
		return;
	};

	// Helper to reply (message.reply preferred in many GoatBot wrappers)
	const reply = (text) => {
		if (message && typeof message.reply === "function") return message.reply(text);
		if (api && typeof api.sendMessage === "function") return api.sendMessage(text, threadID);
		// last resort - throw
		throw new Error(text);
	};

	// localize function
	const lang = (key, ...params) => {
		if (typeof getLang === "function") return getLang(key, ...params);
		// fallback using module.exports.languages if getLang not provided
		const locale = (event && event.language) || "en";
		const templates = (module.exports.languages[locale] || module.exports.languages.en) || {};
		let str = templates[key] || key;
		for (let i = 0; i < params.length; i++) str = str.replace(`%${i + 1}`, params[i]);
		return str;
	};

	// begin main logic (mirror of original onStart)
	const aliasesData = await threadGet(threadID, "data.aliases", {});

	switch ((args[0] || "").toLowerCase()) {
		case "add": {
			if (!args[2]) {
				// use message.SyntaxError if available
				if (message && typeof message.SyntaxError === "function") return message.SyntaxError();
				return reply(lang("commandNotExist", "")); // minimal fallback
			}
			const commandName = args[2].toLowerCase();
			if (!global.GoatBot || !global.GoatBot.commands || !global.GoatBot.commands.has(commandName))
				return reply(lang("commandNotExist", commandName));
			const alias = args[1].toLowerCase();

			if (args[3] == '-g') {
				if (userRole > 1) {
					const globalAliasesData = await globalGet('setalias', 'data', []);
					const globalAliasesExist = globalAliasesData.find(item => item.aliases.includes(alias));
					if (globalAliasesExist)
						return reply(lang("aliasExist", alias, globalAliasesExist.commandName));
					if (global.GoatBot.aliases && global.GoatBot.aliases.has(alias))
						return reply(lang("aliasExist", alias, global.GoatBot.aliases.get(alias)));
					const globalAliasesThisCommand = globalAliasesData.find(aliasData => aliasData.commandName == commandName);
					if (globalAliasesThisCommand)
						globalAliasesThisCommand.aliases.push(alias);
					else
						globalAliasesData.push({
							commandName,
							aliases: [alias]
						});
					await globalSet('setalias', globalAliasesData, 'data');
					if (global.GoatBot && global.GoatBot.aliases) global.GoatBot.aliases.set(alias, commandName);
					return reply(lang("addAliasSuccess", alias, commandName));
				}
				else {
					return reply(lang("noPermissionAdd", alias, commandName));
				}
			}

			if (global.GoatBot && global.GoatBot.commands && global.GoatBot.commands.get(alias))
				return reply(lang("aliasIsCommand", alias));
			if (global.GoatBot && global.GoatBot.aliases && global.GoatBot.aliases.has(alias))
				return reply(lang("aliasExist", alias, global.GoatBot.aliases.get(alias)));
			for (const cmdName in aliasesData)
				if (aliasesData[cmdName].includes(alias))
					return reply(lang("aliasExistInGroup", alias, cmdName));

			const oldAlias = aliasesData[commandName] || [];
			oldAlias.push(alias);
			aliasesData[commandName] = oldAlias;
			await threadSet(threadID, aliasesData, "data.aliases");
			return reply(lang("addAliasToGroupSuccess", alias, commandName));
		}
		case "remove":
		case "rm": {
			if (!args[2]) {
				if (message && typeof message.SyntaxError === "function") return message.SyntaxError();
				return reply(lang("commandNotExist", ""));
			}
			const commandName = args[2].toLowerCase();
			const alias = args[1].toLowerCase();

			if (!global.GoatBot || !global.GoatBot.commands || !global.GoatBot.commands.has(commandName))
				return reply(lang("commandNotExist", commandName));

			if (args[3] == '-g') {
				if (userRole > 1) {
					const globalAliasesData = await globalGet('setalias', 'data', []);
					const globalAliasesThisCommand = globalAliasesData.find(aliasData => aliasData.commandName == commandName);
					if (!globalAliasesThisCommand || !globalAliasesThisCommand.aliases.includes(alias))
						return reply(lang("aliasNotExist", alias, commandName));
					globalAliasesThisCommand.aliases.splice(globalAliasesThisCommand.aliases.indexOf(alias), 1);
					await globalSet('setalias', globalAliasesData, 'data');
					if (global.GoatBot && global.GoatBot.aliases) global.GoatBot.aliases.delete(alias);
					return reply(lang("removeAliasSuccess", alias, commandName));
				}
				else {
					return reply(lang("noPermissionDelete", alias, commandName));
				}
			}

			const oldAlias = aliasesData[commandName];
			if (!oldAlias)
				return reply(lang("noAliasInGroup", commandName));
			const index = oldAlias.indexOf(alias);
			if (index === -1)
				return reply(lang("aliasNotExist", alias, commandName));
			oldAlias.splice(index, 1);
			await threadSet(threadID, aliasesData, "data.aliases");
			return reply(lang("removeAliasInGroupSuccess", alias, commandName));
		}
		case "list": {
			if (args[1] == '-g') {
				const globalAliasesData = await globalGet('setalias', 'data', []);
				const globalAliases = globalAliasesData.map(aliasData => ({
					commandName: aliasData.commandName,
					aliases: aliasData.aliases.join(', ')
				}));
				return reply(
					globalAliases.length ?
						lang("aliasList", globalAliases.map(alias => `• ${alias.commandName}: ${alias.aliases}`).join('\n')) :
						lang("noAliasInSystem")
				);
			}

			if (!Object.keys(aliasesData).length)
				return reply(lang("notExistAliasInGroup"));
			const list = Object.keys(aliasesData).map(commandName => `\n• ${commandName}: ${aliasesData[commandName].join(", ")} `);
			return reply(lang("aliasListInGroup", list.join("\n")));
		}
		default: {
			if (message && typeof message.SyntaxError === "function") return message.SyntaxError();
			return reply("⚠️ Incorrect syntax. Use `add | rm | list`.");
		}
	}
};
