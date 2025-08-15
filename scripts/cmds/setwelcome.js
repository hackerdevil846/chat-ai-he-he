/**
 * GoatBot-compatible `setwelcome` command
 * - Preserves original functionality (text/file/on/off/reset)
 * - Keeps all original paths/links untouched
 * - Credits changed to "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅"
 *
 * This file exports both the original-style handlers (onStart/onReply)
 * and GoatBot-style wrappers (run/handleReply) so it should be copy/paste
 * friendly across common GoatBot setups.
 */

const { drive, getStreamFromURL, getExtFromUrl, getTime } = global.utils;

module.exports.config = {
	name: "setwelcome",
	aliases: ["setwc"],
	version: "1.7",
	hasPermssion: 1, // admin level
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	countDown: 5,
	role: 1, // kept for backwards compatibility with other setups
	description: {
		vi: "Chỉnh sửa nội dung tin nhắn chào mừng thành viên mới tham gia vào nhóm chat của bạn",
		en: "Edit welcome message content when new member join your group chat"
	},
	category: "custom",
	guide: {
		vi: {
			body: "   {pn} text [<nội dung> | reset]: chỉnh sửa nội dung văn bản hoặc reset về mặc định, với những shortcut có sẵn:"
				+ "\n  + {userName}: tên của thành viên mới"
				+ "\n  + {userNameTag}: tên của thành viên mới (tag)"
				+ "\n  + {boxName}:  tên của nhóm chat"
				+ "\n  + {multiple}: bạn || các bạn"
				+ "\n  + {session}:  buổi trong ngày"
				+ "\n\n   Ví dụ:"
				+ "\n    {pn} text Hello {userName}, welcome to {boxName}, chúc {multiple} một ngày mới vui vẻ"
				+ "\n"
				+ "\n   Reply (phản hồi) hoặc gửi kèm một tin nhắn có file với nội dung {pn} file: để thêm tệp đính kèm vào tin nhắn chào mừng (ảnh, video, audio)"
				+ "\n\n   Ví dụ:"
				+ "\n    {pn} file reset: xóa gửi file",
			attachment: {
				[`${__dirname}/assets/guide/setwelcome/setwelcome_vi_1.png`]: "https://i.ibb.co/vd6bQrW/setwelcome-vi-1.png"
			}
		},
		en: {
			body: "   {pn} text [<content> | reset]: edit text content or reset to default, with some shortcuts:"
				+ "\n  + {userName}: new member name"
				+ "\n  + {userNameTag}: new member name (tag)"
				+ "\n  + {boxName}:  group chat name"
				+ "\n  + {multiple}: you || you guys"
				+ "\n  + {session}:  session in day"
				+ "\n\n   Example:"
				+ "\n    {pn} text Hello {userName}, welcome to {boxName}, have a nice day {multiple}"
				+ "\n"
				+ "\n   Reply (phản hồi) or send a message with file with content {pn} file: to add file attachments to welcome message (image, video, audio)"
				+ "\n\n   Example:"
				+ "\n    {pn} file reset: delete file attachments",
			attachment: {
				[`${__dirname}/assets/guide/setwelcome/setwelcome_en_1.png`]: "https://i.ibb.co/vsCz0ks/setwelcome-en-1.png"
			}
		}
	}
};

module.exports.languages = {
	vi: {
		turnedOn: "Đã bật chức năng chào mừng thành viên mới",
		turnedOff: "Đã tắt chức năng chào mừng thành viên mới",
		missingContent: "Vui lùng nhập nội dung tin nhắn",
		edited: "Đã chỉnh sửa nội dung tin nhắn chào mừng của nhóm bạn thành: %1",
		reseted: "Đã reset nội dung tin nhắn chào mừng",
		noFile: "Không có tệp đính kèm tin nhắn chào mừng nào để xóa",
		resetedFile: "Đã reset tệp đính kèm thành công",
		missingFile: "Hãy phản hồi tin nhắn này kèm file ảnh/video/audio",
		addedFile: "Đã thêm %1 tệp đính kèm vào tin nhắn chào mừng của nhóm bạn"
	},
	en: {
		turnedOn: "Turned on welcome message",
		turnedOff: "Turned off welcome message",
		missingContent: "Please enter welcome message content",
		edited: "Edited welcome message content of your group to: %1",
		reseted: "Reseted welcome message content",
		noFile: "No file attachments to delete",
		resetedFile: "Reseted file attachments successfully",
		missingFile: "Please reply this message with image/video/audio file",
		addedFile: "Added %1 file attachments to your group welcome message"
	}
};

/**
 * Helper: simple getLang fallback in case runner doesn't provide getLang.
 * Supports a single placeholder %1 for substitution.
 */
function makeGetLang(getLangProvided, langCode = "en") {
	if (typeof getLangProvided === "function") return getLangProvided;
	return function (key, ...args) {
		const pack = (module.exports.languages[langCode] || module.exports.languages.en) || {};
		let text = pack[key] || key;
		if (args && args.length) {
			args.forEach((val, i) => {
				text = text.replace(new RegExp(`%${i + 1}`, "g"), val);
			});
		}
		return text;
	};
}

/**
 * The original logic preserved as internal handlers.
 * Expects `threadsData` to be an object with get(threadID) and set(threadID, obj)
 * and `message` to be an object with reply(text, cb) method.
 */

/* ---------- START: internal handlers (preserve original code) ---------- */

async function startHandler({ args, threadsData, message, event, commandName, getLang }) {
	const { threadID, senderID, body } = event;
	const { data, settings } = await threadsData.get(threadID);

	switch (args[0]) {
		case "text": {
			if (!args[1])
				return message.reply(getLang("missingContent"));
			else if (args[1] == "reset")
				delete data.welcomeMessage;
			else
				data.welcomeMessage = body.slice(body.indexOf(args[0]) + args[0].length).trim();
			await threadsData.set(threadID, {
				data
			});
			message.reply(data.welcomeMessage ? getLang("edited", data.welcomeMessage) : getLang("reseted"));
			break;
		}
		case "file": {
			if (args[1] == "reset") {
				const { welcomeAttachment } = data;
				if (!welcomeAttachment)
					return message.reply(getLang("noFile"));
				try {
					await Promise.all(data.welcomeAttachment.map(fileId => drive.deleteFile(fileId)));
					delete data.welcomeAttachment;
				}
				catch (e) { /* ignore deletion errors */ }
				await threadsData.set(threadID, {
					data
				});
				message.reply(getLang("resetedFile"));
			}
			else if (event.attachments.length == 0 && (!event.messageReply || event.messageReply.attachments.length == 0))
				return message.reply(getLang("missingFile"), (err, info) => {
					/* Save reply listener so next reply can be handled */
					if (!err && info && info.messageID) {
						global.GoatBot.onReply.set(info.messageID, {
							messageID: info.messageID,
							author: senderID,
							commandName
						});
					}
				});
			else {
				await saveChanges(message, event, threadID, senderID, threadsData, getLang);
			}
			break;
		}
		case "on":
		case "off": {
			settings.sendWelcomeMessage = args[0] == "on";
			await threadsData.set(threadID, { settings });
			message.reply(settings.sendWelcomeMessage ? getLang("turnedOn") : getLang("turnedOff"));
			break;
		}
		default:
			// If framework doesn't provide message.SyntaxError, fallback to a message
			if (typeof message.SyntaxError === "function") message.SyntaxError();
			else message.reply(`Invalid syntax. Use: setwelcome text|file|on|off`);
			break;
	}
}

async function replyHandler({ event, Reply, message, threadsData, getLang }) {
	const { threadID, senderID } = event;
	if (senderID != Reply.author)
		return;

	if (event.attachments.length == 0 && (!event.messageReply || event.messageReply.attachments.length == 0))
		return message.reply(getLang("missingFile"));
	await saveChanges(message, event, threadID, senderID, threadsData, getLang);
}

/* ---------- END: internal handlers ---------- */

/**
 * Shared helper to upload attachments & update thread data
 */
async function saveChanges(message, event, threadID, senderID, threadsData, getLang) {
	const { data } = await threadsData.get(threadID);
	const attachments = [...event.attachments, ...(event.messageReply?.attachments || [])].filter(item => ["photo", 'png', "animated_image", "video", "audio"].includes(item.type));
	if (!data.welcomeAttachment)
		data.welcomeAttachment = [];

	await Promise.all(attachments.map(async attachment => {
		const { url } = attachment;
		const ext = getExtFromUrl(url);
		const fileName = `${getTime()}.${ext}`;
		const infoFile = await drive.uploadFile(`setwelcome_${threadID}_${senderID}_${fileName}`, await getStreamFromURL(url));
		data.welcomeAttachment.push(infoFile.id);
	}));

	await threadsData.set(threadID, {
		data
	});
	message.reply(getLang("addedFile", attachments.length));
}

/* --------------------------------------------------------------------- */
/* GoatBot wrappers: try to be compatible with common GoatBot runner APIs */
/* --------------------------------------------------------------------- */

/**
 * Utility: build a minimal `message` object with reply(text, cb) backed by api.
 */
function buildMessageWrapper(api, event) {
	return {
		reply: (text, cb) => {
			try {
				// api.sendMessage(content, threadID, callback)
				if (typeof api.sendMessage === "function") {
					api.sendMessage(text, event.threadID, (err, info) => {
						if (typeof cb === "function") cb(err, info);
					});
				} else if (typeof api.reply === "function") {
					// some frameworks provide api.reply
					api.reply(event.threadID, text, (err, info) => {
						if (typeof cb === "function") cb(err, info);
					});
				} else {
					// last fallback: print to console and call cb with fake info
					const info = { messageID: Date.now().toString() };
					if (typeof cb === "function") cb(null, info);
				}
			} catch (e) {
				if (typeof cb === "function") cb(e);
			}
		},
		// Optional: some places call message.SyntaxError()
		SyntaxError: (msg) => {
			if (typeof api.sendMessage === "function") api.sendMessage(msg || "Invalid syntax", event.threadID);
		}
	};
}

/**
 * Utility: normalize threadsData access across different frameworks.
 * Prefer provided `threadsData`; else try to adapt `Threads` model.
 */
function buildThreadsDataWrapper(threadsData, Threads) {
	if (threadsData && typeof threadsData.get === "function" && typeof threadsData.set === "function") return threadsData;

	// If Threads has getData/setData or get/set, adapt to { get, set }
	if (Threads) {
		const getter = async (threadID) => {
			// Try common method names
			if (typeof Threads.getData === "function") return await Threads.getData(threadID);
			if (typeof Threads.get === "function") return await Threads.get(threadID);
			// fallback: return empty data structure
			return { data: {}, settings: {} };
		};
		const setter = async (threadID, obj) => {
			if (typeof Threads.setData === "function") return await Threads.setData(threadID, obj);
			if (typeof Threads.set === "function") return await Threads.set(threadID, obj);
			if (typeof Threads.update === "function") return await Threads.update(threadID, obj);
			// no-op if none exist
			return null;
		};
		return { get: getter, set: setter };
	}

	// fallback to a minimal in-memory store (unlikely to be used in production)
	if (!global._setwelcome_inmem) global._setwelcome_inmem = {};
	return {
		get: async (threadID) => {
			if (!global._setwelcome_inmem[threadID]) global._setwelcome_inmem[threadID] = { data: {}, settings: {} };
			return global._setwelcome_inmem[threadID];
		},
		set: async (threadID, obj) => {
			if (!global._setwelcome_inmem[threadID]) global._setwelcome_inmem[threadID] = { data: {}, settings: {} };
			Object.assign(global._setwelcome_inmem[threadID], obj);
			return true;
		}
	};
}

/**
 * GoatBot-style run wrapper.
 * Typical runner will call run({ api, event, args, Threads, threadsData, getLang, ... })
 */
module.exports.run = async function ({ api, event, args = [], Threads = null, threadsData = null, getLang = null, lang = "en" }) {
	const threadID = event.threadID;
	const senderID = event.senderID || event.author || (event.message && event.message.senderID);

	const _threadsData = buildThreadsDataWrapper(threadsData, Threads);
	const message = buildMessageWrapper(api, event);
	const gl = makeGetLang(getLang, lang);

	// Compose parameters expected by startHandler
	await startHandler({
		args,
		threadsData: _threadsData,
		message,
		event,
		commandName: module.exports.config.name,
		getLang: gl
	});
};

/**
 * GoatBot-style reply handler wrapper.
 * Typical runner will call handleReply({ api, event, Reply, Threads, threadsData, getLang })
 *
 * `Reply` should be the saved on-reply record (author, messageID, commandName).
 */
module.exports.handleReply = async function ({ api, event, Reply = {}, Threads = null, threadsData = null, getLang = null, lang = "en" }) {
	const _threadsData = buildThreadsDataWrapper(threadsData, Threads);
	const message = buildMessageWrapper(api, event);
	const gl = makeGetLang(getLang, lang);

	await replyHandler({
		event,
		Reply,
		message,
		threadsData: _threadsData,
		getLang: gl
	});
};

/* Expose original handler names in case your bot loader expects them */
module.exports.onStart = async function (params) {
	// params expected: { args, threadsData, message, event, commandName, getLang }
	await startHandler(params);
};

module.exports.onReply = async function (params) {
	// params expected: { event, Reply, message, threadsData, getLang }
	await replyHandler(params);
};
