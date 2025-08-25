const fs = require("fs-extra");

module.exports.config = {
	name: "getfbstate",
	version: "1.2",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: {
		en: "Get current fbstate in different formats",
		vi: "Lấy fbstate hiện tại ở các định dạng khác nhau"
	},
	category: "system",
	usages: "[cookies/string]",
	cooldowns: 5,
	dependencies: {
		"fs-extra": ""
	}
};

module.exports.languages = {
	"en": {
		"success": "✨ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐬𝐞𝐧𝐭 𝐟𝐛𝐬𝐭𝐚𝐭𝐞 𝐭𝐨 𝐲𝐨𝐮𝐫 𝐏𝐌!\n𝗣𝗹𝗲𝗮𝘀𝗲 𝗰𝗵𝗲𝗰𝗸 𝘆𝗼𝘂𝗿 𝗽𝗿𝗶𝘃𝗮𝘁𝗲 𝗺𝗲𝘀𝘀𝗮𝗴𝗲𝘀"
	},
	"vi": {
		"success": "✅ Đã gửi fbstate đến bạn, vui lòng kiểm tra tin nhắn riêng của bot"
	}
};

module.exports.onStart = async function ({ api, event, args, getText }) {
	try {
		let fbstate;
		let fileName;
		let message;

		const formatType = args[0]?.toLowerCase();

		if (["cookie", "cookies", "c"].includes(formatType)) {
			fbstate = JSON.stringify(api.getAppState().map(e => ({
				name: e.key,
				value: e.value
			})), null, 2);
			fileName = "𝗰𝗼𝗼𝗸𝗶𝗲𝘀.json";
			message = "🍪 𝗖𝗼𝗼𝗸𝗶𝗲𝘀 𝗙𝗼𝗿𝗺𝗮𝘁";
		}
		else if (["string", "str", "s"].includes(formatType)) {
			fbstate = api.getAppState().map(e => `${e.key}=${e.value}`).join("; ");
			fileName = "𝗰𝗼𝗼𝗸𝗶𝗲𝘀_𝘀𝘁𝗿𝗶𝗻𝗴.txt";
			message = "📝 𝗦𝘁𝗿𝗶𝗻𝗴 𝗙𝗼𝗿𝗺𝗮𝘁";
		}
		else {
			fbstate = JSON.stringify(api.getAppState(), null, 2);
			fileName = "𝗮𝗽𝗽𝗦𝘁𝗮𝘁𝗲.json";
			message = "🔐 𝗗𝗲𝗳𝗮𝘂𝗹𝘁 𝗔𝗽𝗽𝗦𝘁𝗮𝘁𝗲";
		}

		const pathSave = `${__dirname}/tmp/${fileName}`;
		await fs.outputFile(pathSave, fbstate);

		if (event.senderID !== event.threadID) {
			api.sendMessage(getText("success"), event.threadID);
		}

		api.sendMessage({
			body: `🪪 𝗙𝗕𝗦𝗧𝗔𝗧𝗘 𝗘𝗫𝗧𝗥𝗔𝗖𝗧𝗘𝗗\n━━━━━━━━━━━━━━\n${message}\n📦 𝗙𝗶𝗹𝗲𝗻𝗮𝗺𝗲: ${fileName}\n⏳ 𝗧𝗶𝗺𝗲: ${new Date().toLocaleString()}`,
			attachment: fs.createReadStream(pathSave)
		}, event.senderID, () => fs.unlinkSync(pathSave));

	} catch (error) {
		console.error(error);
		api.sendMessage("❌ 𝗘𝗿𝗿𝗼𝗿: Failed to generate fbstate file", event.threadID);
	}
};
