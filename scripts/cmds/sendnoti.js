module.exports.config = {
	name: "sendnoti",
	version: "1.0.2",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "✨ 𝑨𝒅𝒎𝒊𝒏-𝒐𝒏𝒍𝒚 𝒈𝒍𝒐𝒃𝒂𝒍 𝒏𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏 𝒔𝒚𝒔𝒕𝒆𝒎",
	commandCategory: "⚙️ 𝑨𝒅𝒎𝒊𝒏",
	usages: "[𝑻𝒆𝒙𝒕]",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"moment-timezone": ""
	}
};

module.exports.languages = {
	"vi": {
		"sendSuccess": "✅ Đã gửi thông báo đến %1 nhóm!",
		"sendFail": "❌ Gửi thất bại đến %1 nhóm"
	},
	"en": {
		"sendSuccess": "✅ | 𝑴𝒆𝒔𝒔𝒂𝒈𝒆 𝒔𝒆𝒏𝒕 𝒕𝒐 %1 𝒕𝒉𝒓𝒆𝒂𝒅𝒔!",
		"sendFail": "❌ | 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒔𝒆𝒏𝒅 𝒊𝒏 %1 𝒕𝒉𝒓𝒆𝒂𝒅𝒔"
	}
};

module.exports.run = async ({ api, event, args, getText, Users }) => {
	const { threadID, messageReply, type } = event;
	const fs = require("fs");
	const axios = require("axios");
	const url = require("url");
	const moment = require("moment-timezone");
	
	try {
		const name = await Users.getNameUser(event.senderID);
		const time = moment.tz("Asia/Kolkata").format("📅 DD/MM/YYYY ⏰ HH:mm:s");
		
		// Handle message reply with attachment
		if (type === "message_reply" && messageReply.attachments?.length > 0) {
			const attachment = messageReply.attachments[0];
			const parsedUrl = url.parse(attachment.url);
			const ext = parsedUrl.pathname.split('.').pop();
			const filePath = __dirname + `/cache/sendnoti.${ext}`;
			
			const response = await axios.get(attachment.url, { 
				responseType: 'arraybuffer' 
			});
			fs.writeFileSync(filePath, Buffer.from(response.data, 'binary'));
			
			await sendGlobalMessage({
				api,
				event,
				message: args.join(" "),
				name,
				time,
				attachment: fs.createReadStream(filePath)
			});
			
			fs.unlinkSync(filePath);
			return;
		}
		
		// Handle text-only message
		await sendGlobalMessage({
			api,
			event,
			message: args.join(" "),
			name,
			time
		});
		
	} catch (error) {
		console.error("❌ | 𝑬𝒓𝒓𝒐𝒓:", error);
		api.sendMessage("⚠️ | 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒔𝒆𝒏𝒅𝒊𝒏𝒈 𝒏𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏𝒔", threadID);
	}
};

async function sendGlobalMessage({ api, event, message, name, time, attachment = null }) {
	const allThreads = global.data.allThreadID || [];
	const failedThreads = [];
	let successCount = 0;
	
	for (const thread of allThreads) {
		if (isNaN(thread) || thread == event.threadID) continue;
		
		try {
			const msgBody = `📢 𝗡𝗼𝘁𝗶𝗰𝗲 𝗳𝗿𝗼𝗺 𝗮𝗱𝗺𝗶𝗻 📢\n━━━━━━━━━━━━━━━━━━\n${message || ""}\n\n👤 𝗔𝗱𝗺𝗶𝗻: ${name}\n${time}`;
			
			await api.sendMessage(
				attachment ? 
				{ body: msgBody, attachment } : 
				msgBody,
				thread
			);
			
			successCount++;
			await new Promise(resolve => setTimeout(resolve, 500));
		} catch (error) {
			failedThreads.push(thread);
		}
	}
	
	const resultMessage = `✅ | 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝘀𝗲𝗻𝘁 𝘁𝗼:\n${successCount} 𝗴𝗿𝗼𝘂𝗽𝘀`;
	const failMessage = failedThreads.length > 0 ? 
		`\n❌ | 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗴𝗿𝗼𝘂𝗽𝘀:\n${failedThreads.length}` : "";
	
	api.sendMessage(resultMessage + failMessage, event.threadID, event.messageID);
}
