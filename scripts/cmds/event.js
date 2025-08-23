const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

function getDomain(url) {
	const regex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/im;
	const match = url.match(regex);
	return match ? match[1] : null;
}

module.exports.config = {
	name: "event",
	version: "1.9",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Manage your event command files 🛠️",
	category: "owner",
	usages: "{pn} load <file> | loadAll | unload <file> | install <url/code> <file>",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"cheerio": "",
		"fs-extra": ""
	}
};

module.exports.languages = {
	en: {
		missingFileName: "⚠️ | Please enter the command name you want to reload",
		loaded: "✅ | Loaded event command \"%1\" successfully 🎉",
		loadedError: "❌ | Loaded event command \"%1\" failed with error\n%2: %3",
		loadedSuccess: "✅ | Loaded \"%1\" event commands successfully 📦",
		loadedFail: "❌ | Failed to load \"%1\" event commands\n%2",
		missingCommandNameUnload: "⚠️ | Please enter the command name you want to unload",
		unloaded: "✅ | Unloaded event command \"%1\" successfully 🗑️",
		unloadedError: "❌ | Unloaded event command \"%1\" failed with error\n%2: %3",
		missingUrlCodeOrFileName: "⚠️ | Please enter the url or code and command file name you want to install",
		missingUrlOrCode: "⚠️ | Please enter the url or code of the command file you want to install",
		missingFileNameInstall: "⚠️ | Please enter the file name to save the command (with .js extension) 📝",
		invalidUrlOrCode: "⚠️ | Unable to get command code",
		alreadExist: "⚠️ | The command file already exists, are you sure you want to overwrite? React to confirm 🔄",
		installed: "✅ | Installed event command \"%1\" successfully 📥\nPath: %2",
		installedError: "❌ | Installation failed for \"%1\"\nError: %2: %3",
		missingFile: "⚠️ | File \"%1\" not found 🔍",
		invalidFileName: "⚠️ | Invalid file name",
		unloadedFile: "✅ | Unloaded command \"%1\" 🗑️"
	}
};

module.exports.onStart = async function ({ api, event, args, getLang }) {
	const { configCommands } = global.GoatBot;
	const { log, loadScripts, unloadScripts } = global.utils;

	switch (args[0]) {
		case "load": {
			if (!args[1]) return api.sendMessage(getLang("missingFileName"), event.threadID, event.messageID);

			const infoLoad = loadScripts("events", args[1], log, configCommands, api,
				global.GoatBot.threadModel,
				global.GoatBot.userModel,
				global.GoatBot.dashBoardModel,
				global.GoatBot.globalModel,
				global.GoatBot.threadsData,
				global.GoatBot.usersData,
				global.GoatBot.dashBoardData,
				global.GoatBot.globalData,
				getLang
			);

			api.sendMessage(
				infoLoad.status === "success"
					? getLang("loaded", infoLoad.name)
					: getLang("loadedError", infoLoad.name, infoLoad.error, infoLoad.message),
				event.threadID,
				event.messageID
			);
			break;
		}

		case "loadAll": {
			const allFile = fs.readdirSync(path.join(__dirname, "..", "events"))
				.filter(file => file.endsWith(".js") &&
					!file.match(/(eg)\.js$/g) &&
					(process.env.NODE_ENV === "development" ? true : !file.match(/(dev)\.js$/g)) &&
					!configCommands.commandEventUnload?.includes(file)
				)
				.map(item => item.split(".")[0]);

			const arraySucces = [];
			const arrayFail = [];

			for (const fileName of allFile) {
				const infoLoad = loadScripts("events", fileName, log, configCommands, api,
					global.GoatBot.threadModel,
					global.GoatBot.userModel,
					global.GoatBot.dashBoardModel,
					global.GoatBot.globalModel,
					global.GoatBot.threadsData,
					global.GoatBot.usersData,
					global.GoatBot.dashBoardData,
					global.GoatBot.globalData,
					getLang
				);

				infoLoad.status === "success"
					? arraySucces.push(fileName)
					: arrayFail.push(`${fileName} => ${infoLoad.error.name}: ${infoLoad.error.message}`);
			}

			let msg = "";
			if (arraySucces.length > 0) msg += getLang("loadedSuccess", arraySucces.length) + '\n';
			if (arrayFail.length > 0) msg += getLang("loadedFail", arrayFail.length, "❗" + arrayFail.join("\n❗ "));

			api.sendMessage(msg || "⚠️ No files processed", event.threadID, event.messageID);
			break;
		}

		case "unload": {
			if (!args[1]) return api.sendMessage(getLang("missingCommandNameUnload"), event.threadID, event.messageID);

			const infoUnload = unloadScripts("events", args[1], configCommands, getLang);
			api.sendMessage(
				infoUnload.status === "success"
					? getLang("unloaded", infoUnload.name)
					: getLang("unloadedError", infoUnload.name, infoUnload.error.name, infoUnload.error.message),
				event.threadID,
				event.messageID
			);
			break;
		}

		case "install": {
			if (!args[1] || !args[2]) return api.sendMessage(getLang("missingUrlCodeOrFileName"), event.threadID, event.messageID);

			let url = args[1];
			let fileName = args[2];
			let rawCode;

			if (url.endsWith(".js")) {
				[fileName, url] = [url, fileName];
			}

			if (url.match(/https?:\/\//)) {
				const domain = getDomain(url);
				if (!domain) return api.sendMessage(getLang("invalidUrlOrCode"), event.threadID, event.messageID);

				if (domain === "pastebin.com") {
					url = url.replace(/pastebin\.com\/(?!raw\/)/, "pastebin.com/raw/");
				} else if (domain === "github.com") {
					url = url.replace(/github\.com\/(.*)\/blob\//, "raw.githubusercontent.com/$1/");
				}

				try {
					const response = await axios.get(url);
					rawCode = response.data;

					if (domain === "savetext.net") {
						const $ = cheerio.load(rawCode);
						rawCode = $("#content").text();
					}
				} catch (error) {
					return api.sendMessage(getLang("invalidUrlOrCode"), event.threadID, event.messageID);
				}
			} else {
				rawCode = event.body.slice(event.body.indexOf(args[0]) + args[0].length + 1);
				rawCode = rawCode.split(' ').slice(1).join(' ');
			}

			if (!rawCode) return api.sendMessage(getLang("invalidUrlOrCode"), event.threadID, event.messageID);

			const filePath = path.join(__dirname, "..", "events", fileName);
			if (fs.existsSync(filePath)) {
				api.sendMessage(getLang("alreadExist"), event.threadID, (err, info) => {
					global.GoatBot.onReaction.set(info.messageID, {
						commandName: module.exports.config.name,
						messageID: info.messageID,
						type: "install",
						author: event.senderID,
						data: { fileName, rawCode }
					});
				});
			} else {
				const infoLoad = loadScripts("events", fileName, log, configCommands, api,
					global.GoatBot.threadModel,
					global.GoatBot.userModel,
					global.GoatBot.dashBoardModel,
					global.GoatBot.globalModel,
					global.GoatBot.threadsData,
					global.GoatBot.usersData,
					global.GoatBot.dashBoardData,
					global.GoatBot.globalData,
					getLang,
					rawCode
				);

				api.sendMessage(
					infoLoad.status === "success"
						? getLang("installed", infoLoad.name, filePath)
						: getLang("installedError", infoLoad.name, infoLoad.error.name, infoLoad.error.message),
					event.threadID,
					event.messageID
				);
			}
			break;
		}

		default:
			api.sendMessage(`⚠️ Invalid usage!\n\nGuide:\n${module.exports.config.usages}`, event.threadID, event.messageID);
	}
};

module.exports.handleReaction = async function ({ event, api, getLang, Reaction }) {
	const { author, messageID, data } = Reaction;
	if (event.userID !== author) return;

	const { fileName, rawCode } = data;
	const { configCommands } = global.GoatBot;
	const { log, loadScripts } = global.utils;

	const infoLoad = loadScripts("events", fileName, log, configCommands, api,
		global.GoatBot.threadModel,
		global.GoatBot.userModel,
		global.GoatBot.dashBoardModel,
		global.GoatBot.globalModel,
		global.GoatBot.threadsData,
		global.GoatBot.usersData,
		global.GoatBot.dashBoardData,
		global.GoatBot.globalData,
		getLang,
		rawCode
	);

	api.sendMessage(
		infoLoad.status === "success"
			? getLang("installed", infoLoad.name, path.join(__dirname, "..", "events", fileName))
			: getLang("installedError", infoLoad.name, infoLoad.error.name, infoLoad.error.message),
		event.threadID,
		() => api.unsend(messageID)
	);
};
