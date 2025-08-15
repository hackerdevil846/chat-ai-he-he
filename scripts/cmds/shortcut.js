module.exports.config = {
	name: "shortcut",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑺𝒉𝒐𝒓𝒕𝒄𝒖𝒕 add, remove এবং list করার জন্য",
	commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
	usages: "[all/delete/empty]",
	cooldowns: 5,
	dependencies: {
		"fs-extra": "",
		"path": ""
	}
};

module.exports.languages = {
	"en": {
		"misingKeyword": "「𝑺𝒉𝒐𝒓𝒕𝒄𝒖𝒕」𝑲𝒆𝒚𝒘𝒐𝒓𝒅 𝒌𝒉𝒂𝒍𝒊 𝒓𝒂𝒌𝒉𝒂 𝒋𝒂𝒃𝒆 𝒏𝒂!",
		"shortcutExist": "「𝑺𝒉𝒐𝒓𝒕𝒄𝒖𝒕」𝑬𝒊 𝒊𝒏𝒑𝒖𝒕 𝒂𝒈𝒆 𝒕𝒉𝒆𝒌𝒆𝒊 𝒂𝒄𝒉𝒆!",
		"requestResponse": "「𝑺𝒉𝒐𝒓𝒕𝒄𝒖𝒕」𝑬𝒊 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒆𝒓 𝒓𝒆𝒑𝒍𝒚 𝒅𝒊𝒚𝒆 𝒌𝒆𝒚𝒘𝒐𝒓𝒅 𝒆𝒓 𝒋𝒂𝒘𝒂𝒂𝒃 𝒅𝒂𝒐",
		"addSuccess": "「𝑺𝒉𝒐𝒓𝒕𝒄𝒖𝒕」𝑵𝒐𝒕𝒖𝒏 𝒔𝒉𝒐𝒓𝒕𝒄𝒖𝒕 𝒂𝒅𝒅 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆, 𝒓𝒆𝒔𝒖𝒍𝒕:\n- 𝑰𝑫:%1\n- 𝑰𝒏𝒑𝒖𝒕: %2\n- 𝑶𝒖𝒕𝒑𝒖𝒕: %3",
		"listShortcutNull": "「𝑺𝒉𝒐𝒓𝒕𝒄𝒖𝒕」𝑨𝒑𝒏𝒂𝒓 𝒕𝒉𝒓𝒆𝒂𝒅 𝒆 𝒌𝒐𝒏𝒐 𝒔𝒉𝒐𝒓𝒕𝒄𝒖𝒕 𝒏𝒂𝒊!",
		"removeSuccess": "「𝑺𝒉𝒐𝒓𝒕𝒄𝒖𝒕」𝑺𝒉𝒐𝒓𝒕𝒄𝒖𝒕 𝒓𝒆𝒎𝒐𝒗𝒆 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆!",
		"returnListShortcut": "「𝑺𝒉𝒐𝒓𝒕𝒄𝒖𝒕」𝑬𝒊 𝒕𝒉𝒓𝒆𝒂𝒅 𝒆𝒓 𝒔𝒐𝒃 𝒔𝒉𝒐𝒓𝒕𝒄𝒖𝒕:\n[𝒔𝒕𝒕]/ [𝑰𝒏𝒑𝒖𝒕] => [𝑶𝒖𝒕𝒑𝒖𝒕]\n\n%1",
		"requestKeyword": "「𝑺𝒉𝒐𝒓𝒕𝒄𝒖𝒕」𝑬𝒊 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒆𝒓 𝒓𝒆𝒑𝒍𝒚 𝒅𝒊𝒚𝒆 𝒔𝒉𝒐𝒓𝒕𝒄𝒖𝒕 𝒆𝒓 𝒌𝒆𝒚𝒘𝒐𝒓𝒅 𝒅𝒂𝒐"
	}
};

module.exports.onLoad = function ({ configValue } = {}) {
	try {
		const { existsSync, writeFileSync, readFileSync } = global.nodemodule["fs-extra"];
		const { resolve } = global.nodemodule["path"];
		const path = resolve(__dirname, "cache", "shortcutdata.json");

		if (!global.moduleData) global.moduleData = {};
		if (!global.moduleData.shortcut) global.moduleData.shortcut = new Map();

		if (!existsSync(path)) writeFileSync(path, JSON.stringify([], null, 4), "utf-8");

		const dataRaw = readFileSync(path, "utf-8");
		let data = [];
		try { data = JSON.parse(dataRaw || "[]"); } catch (e) { data = []; }

		for (const threadData of data) {
			if (threadData && threadData.threadID) global.moduleData.shortcut.set(threadData.threadID, threadData.shortcuts || []);
		}
	} catch (e) {
		console.log(e);
	}
};

module.exports.handleEvent = async function ({ event, api } = {}) {
	try {
		const { threadID, messageID, body } = event;
		if (!global.moduleData || !global.moduleData.shortcut) return;
		if (!global.moduleData.shortcut.has(threadID)) return;

		const data = global.moduleData.shortcut.get(threadID) || [];
		if (!body) return; // only respond to text body

		// exact match only (same as original behavior)
		const matched = data.find(item => item.input == body);
		if (matched) return api.sendMessage(matched.output, threadID, messageID);
	} catch (e) {
		console.log("shortcut handleEvent error:", e);
	}
};

module.exports.handleReply = async function ({ event, api, handleReply, getText } = {}) {
	try {
		if (!handleReply) return;
		if (handleReply.author != event.senderID) return;

		const { readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
		const { resolve } = global.nodemodule["path"];
		const { threadID, messageID, senderID, body } = event;
		const name = this.config.name;
		const path = resolve(__dirname, "cache", "shortcutdata.json");

		switch (handleReply.type) {
			case "requireInput": {
				if (!body || body.length == 0) return api.sendMessage(getText("misingKeyword"), threadID, messageID);
				const data = global.moduleData.shortcut.get(threadID) || [];
				if (data.some(item => item.input == body)) return api.sendMessage(getText("shortcutExist"), threadID, messageID);

				// ask for response (output)
				api.unsendMessage(handleReply.messageID);
				return api.sendMessage(getText("requestResponse"), threadID, (error, info) => {
					return global.client.handleReply.push({
						type: "final",
						name,
						author: senderID,
						messageID: info.messageID,
						input: body
					});
				}, messageID);
			}

			case "final": {
				// create new shortcut entry
				const id = global.utils ? global.utils.randomString(10) : Math.random().toString(36).slice(2, 12);
				const readData = readFileSync(path, "utf-8");
				let data = [];
				try { data = JSON.parse(readData || "[]"); } catch (e) { data = []; }

				let dataThread = data.find(item => item.threadID == threadID);
				if (!dataThread) dataThread = { threadID, shortcuts: [] };

				const dataGlobal = global.moduleData.shortcut.get(threadID) || [];

				const object = { id, input: handleReply.input, output: body || "empty" };

				dataThread.shortcuts.push(object);
				dataGlobal.push(object);

				// update data array (persist)
				const index = data.findIndex(item => item.threadID == threadID);
				if (index == -1) data.push(dataThread);
				else data[index] = dataThread;

				// update runtime map + save file
				global.moduleData.shortcut.set(threadID, dataGlobal);
				writeFileSync(path, JSON.stringify(data, null, 4), "utf-8");

				return api.sendMessage(getText("addSuccess", id, handleReply.input, body || "empty"), threadID, messageID);
			}
		}
	} catch (e) {
		console.log("shortcut handleReply error:", e);
	}
};

module.exports.run = function ({ api, event, args, getText } = {}) {
	try {
		const { readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
		const { resolve } = global.nodemodule["path"];
		const { threadID, messageID, senderID } = event;
		const name = this.config.name;
		const path = resolve(__dirname, "cache", "shortcutdata.json");

		const sub = args[0] ? args[0].toLowerCase() : "";

		switch (sub) {
			case "remove":
			case "delete":
			case "del":
			case "-d": {
				// remove by index OR by exact input OR by id
				const readData = readFileSync(path, "utf-8");
				let data = [];
				try { data = JSON.parse(readData || "[]"); } catch (e) { data = []; }

				const indexData = data.findIndex(item => item.threadID == threadID);
				if (indexData == -1) return api.sendMessage(getText("listShortcutNull"), threadID, messageID);

				let dataThread = data.find(item => item.threadID == threadID) || { threadID, shortcuts: [] };
				let dataGlobal = global.moduleData.shortcut.get(threadID) || [];

				if (!dataThread.shortcuts || dataThread.shortcuts.length == 0) return api.sendMessage(getText("listShortcutNull"), threadID, messageID);

				if (!args[1]) return api.sendMessage(getText("requestKeyword"), threadID, messageID);

				// determine removal index
				let indexNeedRemove = -1;
				const maybeIndex = parseInt(args[1]);
				if (!isNaN(maybeIndex)) {
					// user provided a number (1-based in list)
					const idx0 = maybeIndex - 1;
					if (idx0 >= 0 && idx0 < dataThread.shortcuts.length) indexNeedRemove = idx0;
				}

				if (indexNeedRemove === -1) {
					// try to find by input (exact) or id
					const key = args.slice(1).join(" ");
					indexNeedRemove = dataThread.shortcuts.findIndex(item => item.input == key || item.id == key);
				}

				if (indexNeedRemove === -1 || indexNeedRemove < 0 || indexNeedRemove >= dataThread.shortcuts.length) {
					return api.sendMessage(getText("listShortcutNull"), threadID, messageID);
				}

				// remove from both arrays
				dataThread.shortcuts.splice(indexNeedRemove, 1);
				dataGlobal.splice(indexNeedRemove, 1);

				global.moduleData.shortcut.set(threadID, dataGlobal);
				data[indexData] = dataThread;
				writeFileSync(path, JSON.stringify(data, null, 4), "utf-8");

				return api.sendMessage(getText("removeSuccess"), threadID, messageID);
			}

			case "list":
			case "all":
			case "-a": {
				const data = global.moduleData.shortcut.get(threadID) || [];
				if (!data || data.length == 0) return api.sendMessage(getText("listShortcutNull"), threadID, messageID);

				const array = [];
				let n = 1;
				for (const single of data) array.push(`${n++}/ ${single.input} => ${single.output}`);
				return api.sendMessage(getText("returnListShortcut", array.join("\n")), threadID, messageID);
			}

			default: {
				// start flow for adding (ask for keyword)
				return api.sendMessage(getText("requestKeyword"), threadID, (error, info) => {
					return global.client.handleReply.push({
						type: "requireInput",
						name,
						author: senderID,
						messageID: info.messageID
					});
				}, messageID);
			}
		}
	} catch (e) {
		console.log("shortcut run error:", e);
	}
};
