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
	aliases: ["eventmgr", "emgr"],
	version: "1.9",
	author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
	countDown: 5,
	role: 2,
	category: "owner",
	shortDescription: {
		en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑦𝑜𝑢𝑟 𝑒𝑣𝑒𝑛𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑓𝑖𝑙𝑒𝑠 🛠️"
	},
	longDescription: {
		en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑒𝑣𝑒𝑛𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑓𝑖𝑙𝑒𝑠 (𝑙𝑜𝑎𝑑, 𝑢𝑛𝑙𝑜𝑎𝑑, 𝑖𝑛𝑠𝑡𝑎𝑙𝑙) 📦"
	},
	guide: {
		en: "{p}event load <𝑓𝑖𝑙𝑒> | loadAll | unload <𝑓𝑖𝑙𝑒> | install <𝑢𝑟𝑙/𝑐𝑜𝑑𝑒> <𝑓𝑖𝑙𝑒>"
	},
	dependencies: {
		"axios": "",
		"cheerio": "",
		"fs-extra": ""
	}
};

module.exports.languages = {
	en: {
		missingFileName: "⚠️ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑛𝑎𝑚𝑒 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑟𝑒𝑙𝑜𝑎𝑑",
		loaded: "✅ | 𝐿𝑜𝑎𝑑𝑒𝑑 𝑒𝑣𝑒𝑛𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 \"%1\" 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 🎉",
		loadedError: "❌ | 𝐿𝑜𝑎𝑑𝑒𝑑 𝑒𝑣𝑒𝑛𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 \"%1\" 𝑓𝑎𝑖𝑙𝑒𝑑 𝑤𝑖𝑡ℎ 𝑒𝑟𝑟𝑜𝑟\n%2: %3",
		loadedSuccess: "✅ | 𝐿𝑜𝑎𝑑𝑒𝑑 \"%1\" 𝑒𝑣𝑒𝑛𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 📦",
		loadedFail: "❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 \"%1\" 𝑒𝑣𝑒𝑛𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠\n%2",
		missingCommandNameUnload: "⚠️ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑛𝑎𝑚𝑒 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑢𝑛𝑙𝑜𝑎𝑑",
		unloaded: "✅ | 𝑈𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑒𝑣𝑒𝑛𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 \"%1\" 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 🗑️",
		unloadedError: "❌ | 𝑈𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑒𝑣𝑒𝑛𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 \"%1\" 𝑓𝑎𝑖𝑙𝑒𝑑 𝑤𝑖𝑡ℎ 𝑒𝑟𝑟𝑜𝑟\n%2: %3",
		missingUrlCodeOrFileName: "⚠️ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡ℎ𝑒 𝑢𝑟𝑙 𝑜𝑟 𝑐𝑜𝑑𝑒 𝑎𝑛𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑓𝑖𝑙𝑒 𝑛𝑎𝑚𝑒 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑖𝑛𝑠𝑡𝑎𝑙𝑙",
		missingUrlOrCode: "⚠️ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡ℎ𝑒 𝑢𝑟𝑙 𝑜𝑟 𝑐𝑜𝑑𝑒 𝑜𝑓 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑓𝑖𝑙𝑒 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑖𝑛𝑠𝑡𝑎𝑙𝑙",
		missingFileNameInstall: "⚠️ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡ℎ𝑒 𝑓𝑖𝑙𝑒 𝑛𝑎𝑚𝑒 𝑡𝑜 𝑠𝑎𝑣𝑒 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 (𝑤𝑖𝑡ℎ .𝑗𝑠 𝑒𝑥𝑡𝑒𝑛𝑠𝑖𝑜𝑛) 📝",
		invalidUrlOrCode: "⚠️ | 𝑈𝑛𝑎𝑏𝑙𝑒 𝑡𝑜 𝑔𝑒𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑐𝑜𝑑𝑒",
		alreadExist: "⚠️ | 𝑇ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑓𝑖𝑙𝑒 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑒𝑥𝑖𝑠𝑡𝑠, 𝑎𝑟𝑒 𝑦𝑜𝑢 𝑠𝑢𝑟𝑒 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑜𝑣𝑒𝑟𝑤𝑟𝑖𝑡𝑒? 𝑅𝑒𝑎𝑐𝑡 𝑡𝑜 𝑐𝑜𝑛𝑓𝑖𝑟𝑚 🔄",
		installed: "✅ | 𝐼𝑛𝑠𝑡𝑎𝑙𝑙𝑒𝑑 𝑒𝑣𝑒𝑛𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 \"%1\" 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 📥\n𝑃𝑎𝑡ℎ: %2",
		installedError: "❌ | 𝐼𝑛𝑠𝑡𝑎𝑙𝑙𝑎𝑡𝑖𝑜𝑛 𝑓𝑎𝑖𝑙𝑒𝑑 𝑓𝑜𝑟 \"%1\"\n𝐸𝑟𝑟𝑜𝑟: %2: %3",
		missingFile: "⚠️ | 𝐹𝑖𝑙𝑒 \"%1\" 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 🔍",
		invalidFileName: "⚠️ | 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑓𝑖𝑙𝑒 𝑛𝑎𝑚𝑒",
		unloadedFile: "✅ | 𝑈𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 \"%1\" 🗑️"
	}
};

module.exports.onStart = async function ({ api, event, args, getText }) {
	try {
		const { configCommands } = global.GoatBot;
		const { log, loadScripts, unloadScripts } = global.utils;

		switch (args[0]) {
			case "load": {
				if (!args[1]) return api.sendMessage(getText("missingFileName"), event.threadID, event.messageID);

				const infoLoad = loadScripts("events", args[1], log, configCommands, api,
					global.GoatBot.threadModel,
					global.GoatBot.userModel,
					global.GoatBot.dashBoardModel,
					global.GoatBot.globalModel,
					global.GoatBot.threadsData,
					global.GoatBot.usersData,
					global.GoatBot.dashBoardData,
					global.GoatBot.globalData,
					getText
				);

				api.sendMessage(
					infoLoad.status === "success"
						? getText("loaded", infoLoad.name)
						: getText("loadedError", infoLoad.name, infoLoad.error, infoLoad.message),
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
						getText
					);

					infoLoad.status === "success"
						? arraySucces.push(fileName)
						: arrayFail.push(`${fileName} => ${infoLoad.error.name}: ${infoLoad.error.message}`);
				}

				let msg = "";
				if (arraySucces.length > 0) msg += getText("loadedSuccess", arraySucces.length) + '\n';
				if (arrayFail.length > 0) msg += getText("loadedFail", arrayFail.length, "❗" + arrayFail.join("\n❗ "));

				api.sendMessage(msg || "⚠️ 𝑁𝑜 𝑓𝑖𝑙𝑒𝑠 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑒𝑑", event.threadID, event.messageID);
				break;
			}

			case "unload": {
				if (!args[1]) return api.sendMessage(getText("missingCommandNameUnload"), event.threadID, event.messageID);

				const infoUnload = unloadScripts("events", args[1], configCommands, getText);
				api.sendMessage(
					infoUnload.status === "success"
						? getText("unloaded", infoUnload.name)
						: getText("unloadedError", infoUnload.name, infoUnload.error.name, infoUnload.error.message),
					event.threadID,
					event.messageID
				);
				break;
			}

			case "install": {
				if (!args[1] || !args[2]) return api.sendMessage(getText("missingUrlCodeOrFileName"), event.threadID, event.messageID);

				let url = args[1];
				let fileName = args[2];
				let rawCode;

				if (url.endsWith(".js")) {
					[fileName, url] = [url, fileName];
				}

				if (url.match(/https?:\/\//)) {
					const domain = getDomain(url);
					if (!domain) return api.sendMessage(getText("invalidUrlOrCode"), event.threadID, event.messageID);

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
						return api.sendMessage(getText("invalidUrlOrCode"), event.threadID, event.messageID);
					}
				} else {
					rawCode = event.body.slice(event.body.indexOf(args[0]) + args[0].length + 1);
					rawCode = rawCode.split(' ').slice(1).join(' ');
				}

				if (!rawCode) return api.sendMessage(getText("invalidUrlOrCode"), event.threadID, event.messageID);

				const filePath = path.join(__dirname, "..", "events", fileName);
				if (fs.existsSync(filePath)) {
					api.sendMessage(getText("alreadExist"), event.threadID, (err, info) => {
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
						getText,
						rawCode
					);

					api.sendMessage(
						infoLoad.status === "success"
							? getText("installed", infoLoad.name, filePath)
							: getText("installedError", infoLoad.name, infoLoad.error.name, infoLoad.error.message),
						event.threadID,
						event.messageID
					);
				}
				break;
			}

			default:
				api.sendMessage(`⚠️ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑢𝑠𝑎𝑔𝑒!\n\n𝐺𝑢𝑖𝑑𝑒:\n${module.exports.config.guide.en}`, event.threadID, event.messageID);
		}
	} catch (error) {
		console.error("𝐸𝑣𝑒𝑛𝑡 𝑀𝑎𝑛𝑎𝑔𝑒𝑟 𝐸𝑟𝑟𝑜𝑟:", error);
		api.sendMessage("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑐𝑜𝑚𝑚𝑎𝑛𝑑", event.threadID, event.messageID);
	}
};

module.exports.handleReaction = async function ({ event, api, getText, Reaction }) {
	try {
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
			getText,
			rawCode
		);

		api.sendMessage(
			infoLoad.status === "success"
				? getText("installed", infoLoad.name, path.join(__dirname, "..", "events", fileName))
				: getText("installedError", infoLoad.name, infoLoad.error.name, infoLoad.error.message),
			event.threadID,
			() => api.unsend(messageID)
		);
	} catch (error) {
		console.error("𝑅𝑒𝑎𝑐𝑡𝑖𝑜𝑛 𝐻𝑎𝑛𝑑𝑙𝑒𝑟 𝐸𝑟𝑟𝑜𝑟:", error);
	}
};
