const request = global.nodemodule["request"];

module.exports.config = {
	name: "urdu",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Text translation to Urdu (or other language by code)",
	category: "media",
	usages: "[text] -> <language code>\nReply a message with: urdu -> <language code>",
	cooldowns: 5,
	dependencies: {
		"request": ""
	}
};

module.exports.run = async function ({ api, event, args }) {
	const content = args.join(" ");

	if (content.length === 0 && event.type !== "message_reply") {
		return api.sendMessage("❌ Kishui text dao ba kono message e reply koro.", event.threadID, event.messageID);
	}

	let translateThis = "";
	let lang = "ur"; // default Urdu

	if (event.type === "message_reply") {
		translateThis = event.messageReply?.body || "";
		if (content.indexOf("->") !== -1) {
			lang = content.substring(content.indexOf("->") + 2).trim();
		}
	} else if (content.indexOf("->") !== -1) {
		translateThis = content.slice(0, content.indexOf("->")).trim();
		lang = content.substring(content.indexOf("->") + 2).trim();
	} else {
		translateThis = content;
	}

	if (!translateThis) {
		return api.sendMessage("❌ Translate korar jonno text dao.", event.threadID, event.messageID);
	}

	return request(
		encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${translateThis}`),
		(err, response, body) => {
			if (err) {
				return api.sendMessage("⚠️ Translate korte problem hoyeche.", event.threadID, event.messageID);
			}

			try {
				const retrieve = JSON.parse(body);
				let text = "";
				if (Array.isArray(retrieve[0])) {
					retrieve[0].forEach(item => {
						if (item && item[0]) text += item[0];
					});
				}

				let fromLang = "auto";
				try {
					fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0];
				} catch {}

				api.sendMessage(
					`🌐 Translated Text:\n\n📖 ${text}\n\n🔄 From: ${fromLang.toUpperCase()} ➝ ${lang.toUpperCase()}`,
					event.threadID,
					event.messageID
				);
			} catch (e) {
				api.sendMessage("❌ Translation process e error hoyeche.", event.threadID, event.messageID);
			}
		}
	);
};
