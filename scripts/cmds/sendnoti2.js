module.exports.config = {
	name: "sendnoti2",
	version: "1.0.2",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "✨ 𝑮𝒓𝒐𝒖𝒑 𝒈𝒖𝒍𝒐 𝒕𝒆 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 (𝒑𝒉𝒐𝒕𝒐/𝒗𝒊𝒅𝒆𝒐 𝒂𝒕𝒕𝒂𝒄𝒉 𝒔𝒖𝒑𝒑𝒐𝒓𝒕𝒆𝒅) ✨",
	category: "⚙️ 𝑺𝒚𝒔𝒕𝒆𝒎",
	usages: "[𝑻𝒆𝒙𝒕]",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"request": ""
	}
};

module.exports.languages = {
	"bn": {
		"sendSuccess": "✅ %1 𝒕𝒊 𝒈𝒓𝒐𝒖𝒑𝒆 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒉𝒐𝒍𝒐!",
		"sendFail": "❌ %1 𝒕𝒊 𝒈𝒓𝒐𝒖𝒑𝒆 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒋𝒂𝒎𝒆 𝒏𝒊"
	},
	"en": {
		"sendSuccess": "✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒔𝒆𝒏𝒕 𝒕𝒐 %1 𝒕𝒉𝒓𝒆𝒂𝒅𝒔!",
		"sendFail": "❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒔𝒆𝒏𝒅 𝒕𝒐 %1 𝒕𝒉𝒓𝒆𝒂𝒅𝒔"
	}
};

module.exports.onStart = async ({ api, event, args, getText }) => {
	const fs = require("fs");
	const axios = require("axios");
	const { threadID, messageReply } = event;
	
	// Custom notification header
	const header = "🔔 »✦𝑨𝒅𝒎𝒊𝒏 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 𝒆𝒓 𝒕𝒂𝒓𝒂𝒇 𝒕𝒉𝒆𝒌𝒆 𝒆𝒌𝒕𝒊 𝒔𝒂𝒎𝒃𝒂𝒅𝒉𝒂𝒏✦« 🔔\n\n";
	const messageBody = args.join(" ") || "";
	const fullMessage = header + messageBody;
	
	const allThreads = global.data.allThreadID || [];
	let successCount = 0;
	let failCount = 0;
	
	// Attachment handling
	const handleAttachment = async () => {
		const ext = messageReply.attachments[0].type;
		const fileName = `${__dirname}/cache/snoti.${ext === 'photo' ? 'jpg' : ext === 'video' ? 'mp4' : 'png'}`;
		const file = fs.createWriteStream(fileName);
		
		await axios({
			method: "GET",
			url: messageReply.attachments[0].url,
			responseType: "stream"
		}).then(res => {
			res.data.pipe(file);
			return new Promise((resolve) => {
				file.on("finish", resolve);
			});
		});
		return fileName;
	};
	
	// Send message to threads
	const sendToThread = async (threadID) => {
		try {
			await api.sendMessage({
				body: fullMessage,
				attachment: event.type === "message_reply" ? fs.createReadStream(await handleAttachment()) : null
			}, threadID);
			successCount++;
		} catch {
			failCount++;
		}
		await new Promise(resolve => setTimeout(resolve, 500));
	};
	
	// Process all threads
	for (const thread of allThreads) {
		if (isNaN(thread) || thread === threadID) continue;
		await sendToThread(thread);
	}
	
	// Send summary
	const successText = `✅ ${getText("sendSuccess", successCount)}`;
	const failText = `❌ ${getText("sendFail", failCount)}`;
	
	api.sendMessage(
		`${successText}\n${failCount > 0 ? failText : ""}`,
		threadID
	);
};
