const child_process = require('child_process');

// Auto-install helper: tries to require a package, if missing it installs via npm and requires again.
function autoRequire(pkg) {
	try {
		return require(pkg);
	} catch (e) {
		console.log(`Package '${pkg}' not found. Attempting to install...`);
		try {
			// install synchronously so the bot can continue only after installation finishes
			child_process.execSync(`npm i ${pkg} --no-save`, { stdio: 'inherit' });
			console.log(`Successfully installed ${pkg}`);
			return require(pkg);
		} catch (err) {
			console.error(`Automatic install failed for ${pkg}.`, err);
			throw err; // let the loader know
		}
	}
}

// Try to auto-require modules used by this command. If the environment cannot install them
// (missing build tools for canvas etc.), the error will be logged and the command will not crash silently.
let fs, createCanvas, loadImage, DIG;
try {
	fs = autoRequire('fs-extra');
	const canvasModule = autoRequire('canvas');
	// node-canvas exports createCanvas, loadImage
	createCanvas = canvasModule.createCanvas;
	loadImage = canvasModule.loadImage;
	DIG = autoRequire('discord-image-generation');
} catch (err) {
	// If any of these fail, we still export the module — some features will fallback to text-only.
	console.warn('Some optional dependencies failed to load. Menu will use text fallback.');
}

module.exports.config = {
	name: "menu",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑺𝒐𝒃 𝒌𝒐𝒎𝒂𝒏𝒅 𝒆𝒓 𝒍𝒊𝒔𝒕 𝒅𝒆𝒌𝒉𝒂𝒏𝒐",
	usages: "[all/-a] [number of pages]",
	commandCategory: "system",
	cooldowns: 5,
	dependencies: {
		"canvas": "^2.11.0",
		"discord-image-generation": "^2.0.0",
		"fs-extra": "^11.1.1"
	}
};

module.exports.onLoad = function () {
	// Ensure cache dir exists
	try {
		const cacheDir = __dirname + '/cache';
		if (!fs) {
			// fs-extra not available for some reason; try to require again (will install if missing)
			fs = autoRequire('fs-extra');
		}
		if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
		console.log('menu command loaded.');
	} catch (e) {
		console.error('onLoad error for menu command:', e);
	}
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
	try {
		const commands = global.client.commands;
		let body = (event.body || event.message || "").toString().trim();
		let num = parseInt(body.split(" ")[0], 10);
		if (isNaN(num)) return api.sendMessage("𝑬𝒌𝒕𝒊 𝒏𝒖𝒎𝒃𝒆𝒓 𝒏𝒂 😒", event.threadID, event.messageID);
		if (handleReply.bonus) num -= handleReply.bonus;
		if (!handleReply.content || num > handleReply.content.length || num <= 0) return api.sendMessage("𝑼𝒑𝒂𝒍𝒂𝒃𝒅𝒉𝒐 𝒏𝒂 😕", event.threadID, event.messageID);

		const data = handleReply.content;
		const selected = data[num - 1];
		let msg = "";

		if (handleReply.type === "cmd_info") {
			const commandName = selected;
			if (!commands.has(commandName)) return api.sendMessage("Command not found.", event.threadID, event.messageID);
			const cfg = commands.get(commandName).config || {};
			msg += `╭─── •◈• ────
`;
			msg += `│ ⦿ 𝑵𝒂𝒎: ${commandName}
`;
			msg += `│ ⦿ 𝑩𝒆𝒔𝒄𝒉𝒐𝒏𝒂: ${cfg.description || "𝑵𝒂𝒊"}
`;
			msg += `│ ⦿ 𝑩𝒂𝒃𝒐𝒉𝒂𝒓: ${cfg.usages || "𝑵𝒂𝒊"}
`;
			msg += `│ ⦿ 𝑺𝒐𝒎𝒐𝒚 𝑶𝒏𝒕𝒐𝒓: ${cfg.cooldowns || 5}s
`;
			const perm = (cfg.hasPermssion == 0) ? "𝑼𝒔𝒆𝒓" : (cfg.hasPermssion == 1) ? "𝑮𝒓𝒐𝒖𝒑 𝑨𝒅𝒎𝒊𝒏" : "𝑩𝒐𝒕 𝑨𝒅𝒎𝒊𝒏";
			msg += `│ ⦿ 𝑷𝒆𝒓𝒎𝒊𝒔𝒊𝒐𝒏: ${perm}
`;
			msg += `╰─── •◈• ────

`;
			msg += `» 𝑴𝒐𝒅𝒖𝒍𝒆 𝒄𝒐𝒅𝒆 𝒃𝒚 ${cfg.credits || "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅"} «`;
			return api.sendMessage(msg, event.threadID, event.messageID);
		} else {
			const groupObj = selected;
			msg += `╭─⌈ ${groupObj.group.toUpperCase()} ⌋
`;
			let count = 0;
			for (const cmdName of groupObj.cmds) {
				const desc = (commands.has(cmdName) && commands.get(cmdName).config && commands.get(cmdName).config.description) ? commands.get(cmdName).config.description : "—";
				msg += `│ ${++count}. ${cmdName}: ${desc}
`;
			}
			msg += `╰────────────

`;
			msg += "» 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝒆𝒓 𝒅𝒆𝒕𝒂𝒊𝒍𝒔 𝒅𝒆𝒌𝒉𝒂𝒓 𝒋𝒐𝒏𝒏𝒚 𝒏𝒖𝒎𝒃𝒆𝒓 𝒅𝒊𝒚𝒆 𝒓𝒆𝒑𝒍𝒚 𝒅𝒆𝒏 «";
			return api.sendMessage(msg, event.threadID, (err, info) => {
				if (err) return console.error(err);
				global.client.handleReply.push({
					type: "cmd_info",
					name: module.exports.config.name,
					messageID: info.messageID,
					content: groupObj.cmds
				});
			}, event.messageID);
		}
	} catch (e) {
		console.error(e);
		return api.sendMessage("An error occurred while processing your reply.", event.threadID, event.messageID);
	}
};

module.exports.run = async function ({ api, event, args }) {
	const { commands } = global.client;
	const { threadID, messageID } = event;
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

	const allCommandsIterator = commands.values();
	let group = [];
	for (const commandConfig of allCommandsIterator) {
		const category = (commandConfig.config.commandCategory || "other").toString().toLowerCase();
		if (!group.some(item => item.group.toLowerCase() === category)) {
			group.push({ group: category, cmds: [commandConfig.config.name] });
		} else {
			const g = group.find(item => item.group.toLowerCase() === category);
			g.cmds.push(commandConfig.config.name);
		}
	}

	let msg = "╭───⌈ 𝑪𝑶𝑴𝑴𝑨𝑵𝑫 𝑳𝑰𝑺𝑻 ⌋───╮
";
	let check = true;
	let page_num_input = null;
	let bonus = 0;

	if (args[0] && ["all", "-a"].includes(args[0].trim())) {
		let allCommands = [];
		group.forEach(g => g.cmds.forEach(c => allCommands.push(c)));
		const page_num_total = Math.ceil(allCommands.length / 10) || 1;
		if (args[1]) {
			check = false;
			page_num_input = parseInt(args[1], 10);
			if (isNaN(page_num_input)) msg = "𝑬𝒌𝒕𝒊 𝒏𝒖𝒎𝒃𝒆𝒓 𝒏𝒂 😒";
			else if (page_num_input > page_num_total || page_num_input <= 0) msg = "𝑼𝒑𝒂𝒍𝒂𝒃𝒅𝒉𝒐 𝒏𝒂 😕";
			else check = true;
		}
		if (check) {
			const index_start = page_num_input ? (page_num_input * 10) - 10 : 0;
			bonus = index_start;
			const index_end = (index_start + 10 > allCommands.length) ? allCommands.length : index_start + 10;
			const slice = allCommands.slice(index_start, index_end);
			let idx = index_start;
			slice.forEach(e => {
				msg += `│ ${++idx}. ${e}: ${commands.get(e).config.description || "—"}
`;
			});
			msg += `╰──────────────────

`;
			msg += `» 𝑷𝒂𝒈𝒆 (${page_num_input || 1}/${page_num_total})
`;
			msg += `» 𝑶𝒏𝒏𝒐 𝒑𝒂𝒈𝒆 𝒅𝒆𝒌𝒉𝒂𝒓 𝒋𝒐𝒏𝒏𝒚: ${prefix}menu [all/-a] [page number]
`;
			msg += "» 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝒆𝒓 𝒅𝒆𝒕𝒂𝒊𝒍𝒔 𝒅𝒆𝒌𝒉𝒂𝒓 𝒋𝒐𝒏𝒏𝒚 𝒏𝒖𝒎𝒃𝒆𝒓 𝒅𝒊𝒚𝒆 𝒓𝒆𝒑𝒍𝒚 𝒅𝒆𝒏 «";
			return api.sendMessage(msg, threadID, (error, info) => {
				if (error) console.error(error);
				if (!error) {
					global.client.handleReply.push({
						type: "cmd_info",
						bonus: bonus,
						name: module.exports.config.name,
						messageID: info.messageID,
						content: slice
					});
				}
			}, messageID);
		}
	}

	const page_num_total = Math.ceil(group.length / 10) || 1;
	if (args[0]) {
		check = false;
		page_num_input = parseInt(args[0], 10);
		if (isNaN(page_num_input)) msg = "𝑬𝒌𝒕𝒊 𝒏𝒖𝒎𝒃𝒆𝒓 𝒏𝒂 😒";
		else if (page_num_input > page_num_total || page_num_input <= 0) msg = "𝑼𝒑𝒂𝒍𝒂𝒃𝒅𝒉𝒐 𝒏𝒂 😕";
		else check = true;
	}

	if (check) {
		const index_start = page_num_input ? (page_num_input * 10) - 10 : 0;
		bonus = index_start;
		const index_end = (index_start + 10 > group.length) ? group.length : index_start + 10;
		const slice = group.slice(index_start, index_end);
		slice.forEach(g => msg += `│ ${++index_start}. ${g.group.toLowerCase()}
`);
		msg += `╰──────────────────

`;
		msg += `» 𝑷𝒂𝒈𝒆 (${page_num_input || 1}/${page_num_total})
`;
		msg += `» 𝑶𝒏𝒏𝒐 𝒑𝒂𝒈𝒆 𝒅𝒆𝒌𝒉𝒂𝒓 𝒋𝒐𝒏𝒏𝒚: ${prefix}menu [page number]
`;
		msg += "» 𝑪𝒂𝒕𝒆𝒈𝒐𝒓𝒚 𝒆𝒓 𝒌𝒐𝒎𝒂𝒏𝒅 𝒅𝒆𝒌𝒉𝒂𝒓 𝒋𝒐𝒏𝒏𝒚 𝒏𝒖𝒎𝒃𝒆𝒓 𝒅𝒊𝒚𝒆 𝒓𝒆𝒑𝒍𝒚 𝒅𝒆𝒏 «";
		return api.sendMessage(msg, threadID, async (error, info) => {
			if (error) return console.error(error);
			global.client.handleReply.push({
				name: module.exports.config.name,
				bonus: bonus,
				messageID: info.messageID,
				content: slice
			});
		}, messageID);
	}
};
