const axios = require("axios");

module.exports.config = {
	name: "cmdstore",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: {
		en: "Commands Store of Dipto - Browse available commands"
	},
	category: "system",
	usages: "[command name | single character | page number]",
	cooldowns: 5,
	dependencies: {
		"axios": ""
	}
};

module.exports.run = async function({ api, event, args }) {
	const availableCmdsUrl = "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/availableCmds.json";
	const cmdUrlsJson = "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/cmdUrls.json";
	const ITEMS_PER_PAGE = 10;

	const query = args.join(" ").trim().toLowerCase();
	
	try {
		const response = await axios.get(availableCmdsUrl);
		let cmds = response.data.cmdName;
		let finalArray = cmds;
		let page = 1;

		if (query) {
			if (!isNaN(query)) {
				page = parseInt(query);
			} else if (query.length === 1) {
				finalArray = cmds.filter(cmd => cmd.cmd.toLowerCase().startsWith(query));
				if (finalArray.length === 0) {
					return api.sendMessage(`❌ No commands found starting with "${query}"`, event.threadID, event.messageID);
				}
			} else {
				finalArray = cmds.filter(cmd => cmd.cmd.toLowerCase().includes(query));
				if (finalArray.length === 0) {
					return api.sendMessage(`❌ Command "${query}" not found`, event.threadID, event.messageID);
				}
			}
		}

		const totalPages = Math.ceil(finalArray.length / ITEMS_PER_PAGE);
		if (page < 1 || page > totalPages) {
			return api.sendMessage(
				`📄 Invalid page number. Please enter a number between 1 and ${totalPages}.`,
				event.threadID,
				event.messageID
			);
		}

		const startIndex = (page - 1) * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;
		const cmdsToShow = finalArray.slice(startIndex, endIndex);
		
		let msg = `╔═════〖 📦 CMD STORE 〗═════╗\n`;
		msg += `📑 Page: ${page}/${totalPages}\n`;
		msg += `📊 Total: ${finalArray.length} commands\n`;
		msg += `╟─────────────────────────╢\n`;

		cmdsToShow.forEach((cmd, index) => {
			msg += `🔹 ${startIndex + index + 1}. ${cmd.cmd}\n`;
			msg += `👤 Author: ${cmd.author}\n`;
			msg += `🔄 Update: ${cmd.update || 'N/A'}\n`;
			msg += `╰─────────────────────────╯\n`;
		});

		if (page < totalPages) {
			msg += `\n📩 Type "${this.config.name} ${page + 1}" for next page`;
		}

		api.sendMessage(msg, event.threadID, (error, info) => {
			global.GoatBot.onReply.set(info.messageID, {
				commandName: this.config.name,
				messageID: info.messageID,
				author: event.senderID,
				cmdName: finalArray,
				page: page
			});
		});
	} catch (error) {
		api.sendMessage("❌ Failed to retrieve commands", event.threadID, event.messageID);
		console.error(error);
	}
};

module.exports.handleReply = async function({ event, api, handleReply }) {
	if (handleReply.author !== event.senderID) {
		return api.sendMessage("🚫 You are not allowed to use this response", event.threadID, event.messageID);
	}

	const { cmdName, page } = handleReply;
	const reply = parseInt(event.body);
	const startIndex = (page - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;

	if (isNaN(reply) || reply < startIndex + 1 || reply > endIndex) {
		return api.sendMessage(
			`❌ Please reply with a number between ${startIndex + 1} and ${Math.min(endIndex, cmdName.length)}`,
			event.threadID,
			event.messageID
		);
	}

	try {
		const cmdNameSelected = cmdName[reply - 1].cmd;
		const { status } = cmdName[reply - 1];
		const response = await axios.get(cmdUrlsJson);
		const selectedCmdUrl = response.data[cmdNameSelected];

		if (!selectedCmdUrl) {
			return api.sendMessage("❌ Command URL not found", event.threadID, event.messageID);
		}

		api.unsendMessage(handleReply.messageID);
		
		const msg = 
			`╔═════〖 🔍 COMMAND INFO 〗════╗\n` +
			`📛 Command: ${cmdNameSelected}\n` +
			`📊 Status: ${status || 'N/A'}\n` +
			`🔗 URL: ${selectedCmdUrl}\n` +
			`╚══════════════════════════════╝`;
		
		api.sendMessage(msg, event.threadID, event.messageID);
	} catch (error) {
		api.sendMessage("❌ Failed to retrieve command information", event.threadID, event.messageID);
		console.error(error);
	}
};
