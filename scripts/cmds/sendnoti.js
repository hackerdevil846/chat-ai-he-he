module.exports = {
	config: {
		name: "sendnoti",
		version: "1.0.2",
		hasPermssion: 2, // 𝑶𝒏𝒍𝒚 𝑨𝒅𝒎𝒊𝒏
		credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
		description: "✨ 𝑨𝒅𝒎𝒊𝒏-𝒐𝒏𝒍𝒚 𝒈𝒍𝒐𝒃𝒂𝒍 𝒏𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏 𝒔𝒚𝒔𝒕𝒆𝒎",
		category: "⚙️ 𝑨𝒅𝒎𝒊𝒏",
		usages: "[𝑻𝒆𝒙𝒕] 𝒐𝒓 [𝑹𝒆𝒑𝒍𝒚 𝒕𝒐 𝒊𝒎𝒂𝒈𝒆/𝒗𝒊𝒅𝒆𝒐 𝒘𝒊𝒕𝒉 𝒕𝒆𝒙𝒕]",
		cooldowns: 5,
		dependencies: {
			"axios": "",
			"moment-timezone": ""
		},
		longDescription: {
			en: "𝑺𝒆𝒏𝒅𝒔 𝒂 𝒈𝒍𝒐𝒃𝒂𝒍 𝒏𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏 𝒕𝒐 𝒂𝒍𝒍 𝒃𝒐𝒕'𝒔 𝒄𝒐𝒏𝒏𝒆𝒄𝒕𝒆𝒅 𝒈𝒓𝒐𝒖𝒑𝒔. 𝑺𝒖𝒑𝒑𝒐𝒓𝒕𝒔 𝒕𝒆𝒙𝒕-𝒐𝒏𝒍𝒚 𝒐𝒓 𝒕𝒆𝒙𝒕 𝒘𝒊𝒕𝒉 𝒂𝒕𝒕𝒂𝒄𝒉𝒎𝒆𝒏𝒕𝒔 𝒃𝒚 𝒓𝒆𝒑𝒍𝒚𝒊𝒏𝒈 𝒕𝒐 𝒂 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒘𝒊𝒕𝒉 𝒂𝒏 𝒂𝒕𝒕𝒂𝒄𝒉𝒎𝒆𝒏𝒕."
		},
		guide: {
			en: "{p}sendnoti [𝒚𝒐𝒖𝒓 𝒎𝒆𝒔𝒔𝒂𝒈𝒆]\n{p}sendnoti (𝒓𝒆𝒑𝒍𝒚 𝒕𝒐 𝒂𝒏 𝒊𝒎𝒂𝒈𝒆/𝒗𝒊𝒅𝒆𝒐) [𝒚𝒐𝒖𝒓 𝒎𝒆𝒔𝒔𝒂𝒈𝒆]"
		},
		role: 2 // 𝑺𝒆𝒕 𝒕𝒐 2 𝒇𝒐𝒓 𝑨𝒅𝒎𝒊𝒏 𝒑𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏 𝒐𝒏𝒍𝒚
	},

	languages: {
		"vi": {
			"sendSuccess": "✅ Đã gửi thông báo đến %1 nhóm!",
			"sendFail": "❌ Gửi thất bại đến %1 nhóm"
		},
		"en": {
			"sendSuccess": "✅ | 𝑴𝒆𝒔𝒔𝒂𝒈𝒆 𝒔𝒆𝒏𝒕 𝒕𝒐 %1 𝒕𝒉𝒓𝒆𝒂𝒅𝒔!",
			"sendFail": "❌ | 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒔𝒆𝒏𝒅 𝒊𝒏 %1 𝒕𝒉𝒓𝒆𝒂𝒅𝒔"
		}
	},

	onStart: async function({ api, event, args, getText, Users, message, global }) {
		const { threadID, messageReply, type } = event;
		const fs = require("fs");
		const axios = require("axios");
		const url = require("url");
		const moment = require("moment-timezone");
		
		try {
			const name = await Users.getNameUser(event.senderID);
			const time = moment.tz("Asia/Kolkata").format("📅 DD/MM/YYYY ⏰ HH:mm:s");
			
			// 𝑯𝒂𝒏𝒅𝒍𝒆 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒓𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒂𝒕𝒕𝒂𝒄𝒉𝒎𝒆𝒏𝒕
			if (type === "message_reply" && messageReply.attachments?.length > 0) {
				const attachment = messageReply.attachments[0];
				const parsedUrl = url.parse(attachment.url);
				const ext = parsedUrl.pathname.split('.').pop();
				const filePath = __dirname + `/cache/sendnoti.${ext}`; // 𝑲𝒆𝒆𝒑𝒊𝒏𝒈 𝒕𝒉𝒆 𝒐𝒓𝒊𝒈𝒊𝒏𝒂𝒍 𝒑𝒂𝒕𝒉
				
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
					attachment: fs.createReadStream(filePath),
					globalData: global.data // 𝑷𝒂𝒔𝒔 𝒈𝒍𝒐𝒃𝒂𝒍 𝒅𝒂𝒕𝒂
				});
				
				fs.unlinkSync(filePath);
				return;
			}
			
			// 𝑯𝒂𝒏𝒅𝒍𝒆 𝒕𝒆𝒙𝒕-𝒐𝒏𝒍𝒚 𝒎𝒆𝒔𝒔𝒂𝒈𝒆
			await sendGlobalMessage({
				api,
				event,
				message: args.join(" "),
				name,
				time,
				globalData: global.data // 𝑷𝒂𝒔𝒔 𝒈𝒍𝒐𝒃𝒂𝒍 𝒅𝒂𝒕𝒂
			});
			
		} catch (error) {
			console.error("❌ | 𝑬𝒓𝒓𝒐𝒓 𝒊𝒏 𝒔𝒆𝒏𝒅𝒏𝒐𝒕𝒊 𝒄𝒐𝒎𝒎𝒂𝒏𝒅:", error);
			await message.reply("⚠️ | 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒔𝒆𝒏𝒅𝒊𝒏𝒈 𝒏𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏𝒔.");
		}
	}
};

async function sendGlobalMessage({ api, event, message, name, time, attachment = null, globalData }) {
	const allThreads = globalData.allThreadID || [];
	const failedThreads = [];
	let successCount = 0;
	
	for (const thread of allThreads) {
		if (isNaN(thread) || thread == event.threadID) continue; // 𝑺𝒌𝒊𝒑 𝒄𝒖𝒓𝒓𝒆𝒏𝒕 𝒕𝒉𝒓𝒆𝒂𝒅 𝒂𝒏𝒅 𝒊𝒏𝒗𝒂𝒍𝒊𝒅 𝒕𝒉𝒓𝒆𝒂𝒅𝑰𝑫𝒔
		
		try {
			const msgBody = `📢 𝗡𝗼𝘁𝗶𝗰𝗲 𝗳𝗿𝗼𝗺 𝗮𝗱𝗺𝗶𝗻 📢\n━━━━━━━━━━━━━━━━━━\n${message || ""}\n\n👤 𝗔𝗱𝗺𝗶𝗻: ${name}\n${time}`;
			
			await api.sendMessage(
				attachment ? 
				{ body: msgBody, attachment } : 
				msgBody,
				thread
			);
			
			successCount++;
			await new Promise(resolve => setTimeout(resolve, 500)); // 𝑨𝒅𝒅 𝒂 𝒔𝒍𝒊𝒈𝒉𝒕 𝒅𝒆𝒍𝒂𝒚 𝒕𝒐 𝒂𝒗𝒐𝒊𝒅 𝑨𝑷𝑰 𝒍𝒊𝒎𝒊𝒕𝒔
		} catch (error) {
			console.error(`❌ | 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒔𝒆𝒏𝒅 𝒕𝒐 𝒕𝒉𝒓𝒆𝒂𝒅 ${thread}:`, error);
			failedThreads.push(thread);
		}
	}
	
	const resultMessage = `✅ | 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒔𝒆𝒏𝒕 𝒕𝒐:\n${successCount} 𝒈𝒓𝒐𝒖𝒑𝒔`;
	const failMessage = failedThreads.length > 0 ? 
		`\n❌ | 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒔𝒆𝒏𝒅 𝒕𝒐 ${failedThreads.length} 𝒈𝒓𝒐𝒖𝒑(𝒔).` : "";
	
	api.sendMessage(resultMessage + failMessage, event.threadID, event.messageID);
}
