const fs = require("fs-extra");

module.exports = {
	config: {
		name: "setlang",
		version: "1.5",
		author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
		countDown: 5,
		role: 0,
		description: {
			vi: "Cài đặt ngôn ngữ của bot cho nhóm chat hiện tại hoặc tất cả các nhóm chat",
			en: "Set default language of bot for current chat or all chats"
		},
		category: "owner",
		guide: {
			vi: "   {pn} <language code ISO 639-1"
				+ "\n   Ví dụ:"
				+ "\n    {pn} en"
				+ "\n    {pn} vi",
			en: "\n   {pn} <language code ISO 639-1"
				+ "\n   Example:"
				+ "\n    {pn} en"
				+ "\n    {pn} vi"
		}
	},

	languages: {
		vi: {
			setLangForAll: "Đã cài đặt ngôn ngữ mặc định cho bot là: %1",
			setLangForCurrent: "Đã cài đặt ngôn ngữ mặc định cho nhóm chat này là: %1",
			noPermission: "Chỉ admin bot mới có thể sử dụng lệnh này",
			langNotFound: "Không tìm thấy ngôn ngữ: %1",
			syntaxError: "⚠️ Vui lòng nhập mã ngôn ngữ (vd: en, vi)"
		},
		en: {
			setLangForAll: "✅ Successfully set default bot language to: %1",
			setLangForCurrent: "✅ Successfully set language for this chat to: %1",
			noPermission: "⛔ Only bot admins can use this feature",
			langNotFound: "❌ Language not found: %1",
			syntaxError: "⚠️ Please enter language code (ex: en, vi)"
		}
	},

	onStart: async function ({ message, args, threadsData, event, role, getLang }) {
		const { threadID } = event;
		const { languages } = this;

		if (!args[0]) {
			return message.reply(getLang("syntaxError"));
		}

		let langCode = args[0].toLowerCase();
		if (["default", "reset"].includes(langCode)) {
			langCode = null;
		}

		const globalFlag = ["-g", "-global", "all"].includes(args[1]?.toLowerCase());

		if (globalFlag) {
			if (role < 2) {
				return message.reply(getLang("noPermission"));
			}

			const pathLanguageFile = `${process.cwd()}/languages/${langCode}.lang`;
			if (!fs.existsSync(pathLanguageFile)) {
				return message.reply(getLang("langNotFound", langCode));
			}

			try {
				const readLanguage = fs.readFileSync(pathLanguageFile, "utf-8");
				const languageData = readLanguage
					.split(/\r?\n|\r/)
					.filter(line => line && !line.trim().startsWith("#") && !line.trim().startsWith("//") && line !== "");

				global.language = {};
				for (const sentence of languageData) {
					const getSeparator = sentence.indexOf('=');
					const itemKey = sentence.slice(0, getSeparator).trim();
					const itemValue = sentence.slice(getSeparator + 1, sentence.length).trim();
					const [head, ...keyParts] = itemKey.split('.');
					const key = keyParts.join('.');
					const value = itemValue.replace(/\\n/gi, '\n');
					
					if (!global.language[head]) {
						global.language[head] = {};
					}
					global.language[head][key] = value;
				}

				global.GoatBot.config.language = langCode;
				fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
				return message.reply(getLang("setLangForAll", langCode));
			}
			catch (err) {
				console.error("Error setting global language:", err);
				return message.reply("❌ An error occurred while updating language");
			}
		}

		await threadsData.set(threadID, langCode, "data.lang");
		const langName = langCode ? langCode.toUpperCase() : "default";
		return message.reply(getLang("setLangForCurrent", langName));
	}
};
