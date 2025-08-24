const axios = require("axios");

module.exports.config = {
	name: "setavt",
	version: "1.3",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Change bot avatar (URL or reply an image). Supports optional caption and temporary avatar (expiration in seconds).",
	category: "owner",
	usages: "[<image url> | reply image] [<caption>] [<expirationAfter (seconds)>]",
	cooldowns: 5,
	dependencies: {
		"axios": "^1.0.0"
	},
	envConfig: {}
};

module.exports.languages = {
	"vi": {
		"cannotGetImage": "❌ | Đã xảy ra lỗi khi truy vấn đến url hình ảnh",
		"invalidImageFormat": "❌ | Định dạng hình ảnh không hợp lệ",
		"changedAvatar": "✅ | Đã thay đổi avatar của bot thành công",
		"needImage": "❌ | Vui lòng gửi đường dẫn hình ảnh hoặc phản hồi 1 tin nhắn chứa ảnh.\nCách dùng: %1",
		"errorChanging": "❌ | Đã xảy ra lỗi khi thay đổi avatar:",
		"usage": "Cách dùng: %1"
	},
	"en": {
		"cannotGetImage": "❌ | An error occurred while querying the image url",
		"invalidImageFormat": "❌ | Invalid image format",
		"changedAvatar": "✅ | Changed bot avatar successfully",
		"needImage": "❌ | Please provide an image URL or reply to a message that contains an image.\nUsage: %1",
		"errorChanging": "❌ | An error occurred while changing avatar:",
		"usage": "Usage: %1"
	}
};

module.exports.onLoad = function () {
	// nothing needed on load for now, but placeholder kept for future enhancements
};

/**
 * run - main command handler
 * params: object destructured by GoatBot framework. We expect at least api, event, args, and getLang to be available.
 */
module.exports.run = async function ({ api, event, args, getLang }) {
	const threadID = event.threadID || event.senderID;
	// Determine language helper (getLang may not be provided by some GoatBot variants)
	const lang = (typeof getLang === "function") ? getLang : (key => {
		// fallback: default to English messages above
		const locale = "en";
		return module.exports.languages[locale][key] || module.exports.languages["en"][key] || key;
	});

	// Build usage string for fallback Syntax/Error messages
	const usageText = `${module.exports.config.usages}\nExamples:\n  ${module.exports.config.usages} https://example.com/image.jpg\n  ${module.exports.config.usages} https://example.com/image.jpg Hello 3600\n  Reply to an image with: ${module.exports.config.usages}`;

	// Resolve image URL:
	// 1) first arg if starts with http/https
	// 2) attachments sent with the command
	// 3) attachments in the replied-to message
	const maybeUrlArg = (args[0] || "");
	let imageURL = null;
	if (maybeUrlArg.startsWith("http")) {
		imageURL = args.shift();
	}
	// If not provided as arg, check attachments in the current event or the replied message
	if (!imageURL) {
		imageURL = event.attachments?.[0]?.url || event.messageReply?.attachments?.[0]?.url || null;
	}

	// If still no image, send usage/syntax error
	if (!imageURL) {
		return api.sendMessage(lang("needImage").replace("%1", usageText), threadID);
	}

	// expirationAfter: if last arg is a number, treat as expiration in seconds
	let expirationAfter = null;
	if (args.length > 0) {
		const last = args[args.length - 1];
		// allow numeric strings like "3600"
		if (!isNaN(last) && last !== "") {
			expirationAfter = parseInt(args.pop());
			// prevent negative values
			if (expirationAfter < 0) expirationAfter = null;
		}
	}

	// caption: remaining args joined
	const caption = args.join(" ").trim() || "";

	// Fetch image as stream
	let response;
	try {
		response = await axios.get(imageURL, { responseType: "stream", timeout: 20000 });
	} catch (err) {
		// network / axios error
		return api.sendMessage(lang("cannotGetImage"), threadID);
	}

	// Validate content-type header
	const contentType = (response.headers && (response.headers["content-type"] || response.headers["Content-Type"])) || "";
	if (!contentType.includes("image")) {
		return api.sendMessage(lang("invalidImageFormat"), threadID);
	}

	// Many bot frameworks expect a file-like object with .path, or accept streams directly.
	// Keep the original approach: set path so frameworks that rely on it can work.
	try {
		response.data.path = "avatar.jpg";
	} catch (e) {
		// ignore; response.data may be a stream object we can still pass
	}

	// Attempt to change avatar. Support both callback-style and promise-style api.changeAvatar implementations.
	try {
		// If api.changeAvatar expects a callback (node-style), wrap it in a Promise
		const changeAvatar = api.changeAvatar;
		if (typeof changeAvatar === "function") {
			// Try calling and detect whether it returns a Promise
			const result = changeAvatar(response.data, caption, expirationAfter ? expirationAfter * 1000 : null, (err) => {
				// If API uses callback, this callback will execute; we handle inside Promise below.
			});
			// If result is a Promise, await it
			if (result && typeof result.then === "function") {
				await result;
			} else {
				// Otherwise assume callback-style — wrap in a promise and wait for the callback to call back.
				await new Promise((resolve, reject) => {
					try {
						// call again but with our own callback to detect completion
						changeAvatar(response.data, caption, expirationAfter ? expirationAfter * 1000 : null, (err) => {
							if (err) return reject(err);
							return resolve();
						});
					} catch (err) {
						return reject(err);
					}
				});
			}
		} else {
			// If changeAvatar not available, throw
			throw new Error("api.changeAvatar is not a function");
		}
	} catch (err) {
		// Send a helpful error message with the underlying error text (trimmed)
		const errText = (err && err.message) ? ` ${err.message}` : "";
		return api.sendMessage(`${lang("errorChanging")} ${errText}`, threadID);
	}

	// Success
	return api.sendMessage(lang("changedAvatar"), threadID);
};
