module.exports.config = {
	name: "callad",
	version: "2.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🛠️ 𝑨𝒅𝒎𝒊𝒏 𝒌𝒆 𝒃𝒐𝒕 𝒆𝒓 𝒃𝒖𝒈 𝒓𝒆𝒑𝒐𝒓𝒕 𝒌𝒐𝒓𝒖𝒏 𝒃𝒂 𝒄𝒐𝒎𝒎𝒆𝒏𝒕",
	category: "🍀 𝑮𝒓𝒐𝒖𝒑 𝑼𝒕𝒊𝒍𝒊𝒕𝒚",
	usages: "[💬 𝑴𝒆𝒔𝒔𝒂𝒈𝒆]",
	cooldowns: 5,
	dependencies: {
		"fs-extra": "",
		"axios": "",
		"moment-timezone": "",
		"form-data": ""
	},
	envConfig: {
		maxFileSize: 50 // MB
	}
};

module.exports.languages = {
	"en": {
		"missingMessage": "📝 | Please provide a message to report",
		"reportSent": "✅ | Your report has been sent to %1 admin(s)",
		"errorOccurred": "❌ | An error occurred while processing your request",
		"adminNotification": "📢 | 𝑵𝑬𝑾 𝑹𝑬𝑷𝑶𝑹𝑻",
		"userFeedback": "📩 | 𝑭𝒆𝒆𝒅𝒃𝒂𝒄𝒌 𝒇𝒓𝒐𝒎 %1",
		"adminResponse": "📌 | 𝑨𝒅𝒎𝒊𝒏 %1'𝒔 𝒓𝒆𝒔𝒑𝒐𝒏𝒔𝒆"
	}
}

module.exports.onLoad = function() {
	console.log('🔄 | CallAd command loaded successfully');
}

module.exports.handleReply = async function({ api, event, handleReply, Users }) {
	try {
		const { getTime, createReadStream, unlinkSync } = global.nodemodule["fs-extra"];
		const axios = global.nodemodule["axios"];
		const { join } = global.nodemodule["path"];
		const formData = global.nodemodule["form-data"];
		
		const name = (await Users.getData(event.senderID)).name || "User";
		const attachments = [];
		const tempFiles = [];

		// Process attachments
		if (event.attachments.length > 0) {
			for (const attachment of event.attachments) {
				const randomString = Math.random().toString(36).substring(2, 15);
				let extension = "txt";
				
				switch (attachment.type) {
					case 'photo': extension = 'jpg'; break;
					case 'video': extension = 'mp4'; break;
					case 'audio': extension = 'mp3'; break;
					case 'animated_image': extension = 'gif'; break;
				}

				const filePath = join(__dirname, 'cache', `${randomString}.${extension}`);
				const fileData = (await axios.get(encodeURI(attachment.url), { 
					responseType: "arraybuffer" 
				})).data;
				
				getTime(filePath, Buffer.from(fileData, "utf-8"));
				tempFiles.push(filePath);
				attachments.push(createReadStream(filePath));
			}
		}

		switch (handleReply.type) {
			case "reply": {
				const adminIDs = global.config.ADMINBOT;
				const messageContent = event.body || this.languages.en.noMessage;
				
				for (const adminID of adminIDs) {
					const messageData = {
						body: `📩 | ${this.languages.en.userFeedback.replace('%1', name)}\n┏━━━━━━━━━━━━━━━━━━\n┣➤ 💬 𝑪𝒐𝒏𝒕𝒆𝒏𝒕: ${messageContent}\n┗━━━━━━━━━━━━━━━━━━`,
						mentions: [{ id: event.senderID, tag: name }],
						attachment: attachments.length > 0 ? attachments : undefined
					};

					api.sendMessage(messageData, adminID, (error, info) => {
						if (!error) {
							global.client.handleReply.push({
								name: this.config.name,
								messageID: info.messageID,
								messID: event.messageID,
								author: event.senderID,
								id: event.threadID,
								type: "calladmin"
							});
						}
					});
				}
				break;
			}

			case "calladmin": {
				const messageContent = event.body || this.languages.en.noMessage;
				const messageData = {
					body: `📌 | ${this.languages.en.adminResponse.replace('%1', name)}\n┏━━━━━━━━━━━━━━━━━━\n┣➤ 💬 𝑪𝒐𝒏𝒕𝒆𝒏𝒕: ${messageContent}\n┗━━━━━━━━━━━━━━━━━━\n\n🔁 𝑹𝒆𝒑𝒍𝒚 𝒕𝒐 𝒄𝒐𝒏𝒕𝒊𝒏𝒖𝒆 𝒄𝒐𝒏𝒗𝒆𝒓𝒔𝒂𝒕𝒊𝒐𝒏`,
					mentions: [{ tag: name, id: event.senderID }],
					attachment: attachments.length > 0 ? attachments : undefined
				};

				api.sendMessage(messageData, handleReply.id, (error, info) => {
					if (!error) {
						global.client.handleReply.push({
							name: this.config.name,
							author: event.senderID,
							messageID: info.messageID,
							type: "reply"
						});
					}
				}, handleReply.messID);
				break;
			}
		}

		// Clean up temporary files
		tempFiles.forEach(file => {
			try {
				unlinkSync(file);
			} catch (e) {
				console.error("Error deleting file:", e);
			}
		});

	} catch (error) {
		console.error("❌ | Error in handleReply:", error);
	}
};

module.exports.onStart = async function({ api, event, args, Threads, Users }) {
	try {
		const { getTime, createReadStream, unlinkSync } = global.nodemodule["fs-extra"];
		const axios = global.nodemodule["axios"];
		const moment = global.nodemodule["moment-timezone"];
		const { join } = global.nodemodule["path"];
		
		// Check if user provided a message or attachment
		if (args.length === 0 && !event.messageReply) {
			return api.sendMessage(this.languages.en.missingMessage, event.threadID, event.messageID);
		}

		const attachments = [];
		const tempFiles = [];

		// Process replied message attachments
		if (event.messageReply && event.messageReply.attachments) {
			for (const attachment of event.messageReply.attachments) {
				const randomString = Math.random().toString(36).substring(2, 15);
				let extension = "txt";
				
				switch (attachment.type) {
					case 'photo': extension = 'jpg'; break;
					case 'video': extension = 'mp4'; break;
					case 'audio': extension = 'mp3'; break;
					case 'animated_image': extension = 'gif'; break;
				}

				const filePath = join(__dirname, 'cache', `${randomString}.${extension}`);
				const fileData = (await axios.get(encodeURI(attachment.url), { 
					responseType: "arraybuffer" 
				})).data;
				
				getTime(filePath, Buffer.from(fileData, "utf-8"));
				tempFiles.push(filePath);
				attachments.push(createReadStream(filePath));
			}
		}

		const name = (await Users.getData(event.senderID)).name || "User";
		const threadData = (await Threads.getData(event.threadID)).threadInfo;
		const threadName = threadData.threadName;
		const userID = event.senderID;
		const threadID = event.threadID;
		const timestamp = moment.tz("Asia/Dhaka").format("HH:mm:ss DD/MM/YYYY");
		const adminCount = global.config.ADMINBOT.length;

		// Send confirmation to user
		api.sendMessage(
			`✅ | ${this.languages.en.reportSent.replace('%1', adminCount)}\n⏰ | 𝑻𝒊𝒎𝒆: ${timestamp}`, 
			event.threadID, 
			event.messageID
		);

		// Prepare and send message to admins
		const messageContent = args.join(" ") || (attachments.length > 0 ? 
			"📎 𝑨𝒕𝒕𝒂𝒄𝒉𝒎𝒆𝒏𝒕 𝒘𝒊𝒕𝒉𝒐𝒖𝒕 𝒕𝒆𝒙𝒕" : "🌸 𝑲𝒐𝒏𝒐 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒏𝒂𝒊");

		for (const adminID of global.config.ADMINBOT) {
			const messageData = {
				body: `📢 | ${this.languages.en.adminNotification}\n┏━━━━━━━━━━━━━━━━━━\n┣➤ 👤 𝑼𝒔𝒆𝒓: ${name}\n┣➤ 🆔 𝑼𝑰𝑫: ${userID}\n┣➤ 💬 𝑩𝒐𝒙: ${threadName}\n┣➤ 🆔 𝑩𝒐𝒙 𝑰𝑫: ${threadID}\n┣➤ 📝 𝑴𝒆𝒔𝒔𝒂𝒈𝒆: ${messageContent}\n┣➤ ⏰ 𝑻𝒊𝒎𝒆: ${timestamp}\n┗━━━━━━━━━━━━━━━━━━`,
				mentions: [{ id: event.senderID, tag: name }],
				attachment: attachments.length > 0 ? attachments : undefined
			};

			api.sendMessage(messageData, adminID, (error, info) => {
				if (!error) {
					global.client.handleReply.push({
						name: this.config.name,
						messageID: info.messageID,
						author: event.senderID,
						messID: event.messageID,
						id: threadID,
						type: "calladmin"
					});
				}
			});
		}

		// Clean up temporary files
		tempFiles.forEach(file => {
			try {
				unlinkSync(file);
			} catch (e) {
				console.error("Error deleting file:", e);
			}
		});

	} catch (error) {
		console.error("❌ | Error in onStart:", error);
		api.sendMessage(
			this.languages.en.errorOccurred, 
			event.threadID, 
			event.messageID
		);
	}
};
