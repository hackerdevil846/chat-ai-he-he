const request = global.nodemodule["request"];

module.exports.config = {
	name: "trans-english",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Text translation command",
	category: "media",
	usages: "[text -> lang] or reply with text",
	cooldowns: 5,
	dependencies: {
		"request": ""
	}
};

module.exports.run = async function ({ api, event, args }) {
	try {
		let content = args.join(" ");
		if (content.length == 0 && event.type != "message_reply") {
			return api.sendMessage("⚠️ Dhoron: text likhun ba reply korun.\n\n📝 Example:\ntrans-english Hello -> bn", event.threadID, event.messageID);
		}

		let translateThis, lang;

		// Jodi reply kora hoy
		if (event.type == "message_reply") {
			translateThis = event.messageReply.body;
			if (content.includes("->")) {
				lang = content.split("->")[1].trim();
			} else {
				lang = "en"; // default English
			}
		}
		// Normal input
		else {
			if (content.includes("->")) {
				translateThis = content.split("->")[0].trim();
				lang = content.split("->")[1].trim();
			} else {
				translateThis = content;
				lang = "en";
			}
		}

		// API call
		request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${translateThis}`), (err, response, body) => {
			if (err) {
				return api.sendMessage("❌ Error hoye geche! Please abar try korun.", event.threadID, event.messageID);
			}
			try {
				let retrieve = JSON.parse(body);
				let text = '';
				retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
				let fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0];

				api.sendMessage(
					`📜 𝐀𝐧𝐮𝐛𝐚𝐝:\n\n${text}\n\n🌍 ${fromLang} ➝ ${lang}`,
					event.threadID,
					event.messageID
				);
			} catch (error) {
				console.error(error);
				api.sendMessage("❌ Translation korte parlam na, punoray chesta korun.", event.threadID, event.messageID);
			}
		});
	} catch (e) {
		console.error(e);
		api.sendMessage("⚠️ Unexpected error!", event.threadID, event.messageID);
	}
};
