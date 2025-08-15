module.exports.config = {
	name: "setleave",
	aliases: ["setl"],
	version: "1.7",
	author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	countDown: 5,
	role: 0,
	description: {
		vi: "Chỉnh sửa nội dung/bật/tắt tin nhắn tạm biệt thành viên rời khỏi nhóm chat của bạn",
		en: "Edit content/turn on/off leave message when member leave your group chat"
	},
	category: "custom",
	guide: {
		vi: {
			body: "   {pn} on: Bật tin nhắn tạm biệt"
				+ "\n   {pn} off: Tắt tin nhắn tạm biệt"
				+ "\n   {pn} text [<nội dung> | reset]: chỉnh sửa nội dung văn bản hoặc reset về mặc định, những shortcut có sẵn:"
				+ "\n  + {userName}: tên của thành viên rời khỏi nhóm"
				+ "\n  + {userNameTag}: tên của thành viên rời khỏi nhóm (tag)"
				+ "\n  + {boxName}:  tên của nhóm chat"
				+ "\n  + {type}: tự rời/bị qtv xóa khỏi nhóm"
				+ "\n  + {session}:  buổi trong ngày"
				+ "\n\n   Ví dụ:"
				+ "\n    {pn} text {userName} đã {type} khỏi nhóm, see you again 🤧"
				+ "\n"
				+ "\n   Reply (phản hồi) hoặc gửi kèm một tin nhắn có file với nội dung {pn} file: để thêm tệp đính kèm vào tin nhắn rời khỏi nhóm (ảnh, video, audio)"
				+ "\n\nVí dụ:"
				+ "\n   {pn} file reset: xóa gửi file",
			attachment: {
				[`${__dirname}/assets/guide/setleave/setleave_vi_1.png`]: "https://i.ibb.co/2FKJHJr/guide1.png"
			}
		},
		en: {
			body: "   {pn} on: Turn on leave message"
				+ "\n   {pn} off: Turn off leave message"
				+ "\n   {pn} text [<content> | reset]: edit text content or reset to default, available shortcuts:"
				+ "\n  + {userName}: name of member who leave group"
				+ "\n  + {userNameTag}: name of member who leave group (tag)"
				+ "\n  + {boxName}: name of group chat"
				+ "\n  + {type}: leave/kicked by admin"
				+ "\n  + {session}: session in day"
				+ "\n\n   Example:"
				+ "\n    {pn} text {userName} has {type} group, see you again 🤧"
				+ "\n"
				+ "\n   Reply or send a message with file with content {pn} file: to add attachment file to leave message (image, video, audio)"
				+ "\n\nExample:"
				+ "\n   {pn} file reset: reset file",
			attachment: {
				[`${__dirname}/assets/guide/setleave/setleave_en_1.png`]: "https://i.ibb.co/2FKJHJr/guide1.png"
			}
		}
	}
};

module.exports.languages = {
	vi: {
		turnedOn: "Bật tin nhắn tạm biệt thành công",
		turnedOff: "Tắt tin nhắn tạm biệt thành công",
		missingContent: "Vui lùng nhập nội dung tin nhắn",
		edited: "Đã chỉnh sửa nội dung tin nhắn tạm biệt của nhóm bạn thành:\n%1",
		reseted: "Đã reset nội dung tin nhắn tạm biệt",
		noFile: "Không có tệp đính kèm tin nhắn tạm biệt nào để xóa",
		resetedFile: "Đã reset tệp đính kèm thành công",
		missingFile: "Hãy phản hồi tin nhắn này kèm file ảnh/video/audio",
		addedFile: "Đã thêm %1 tệp đính kèm vào tin nhắn tạm biệt của nhóm bạn"
	},
	en: {
		turnedOn: "Turned on leave message successfully",
		turnedOff: "Turned off leave message successfully",
		missingContent: "Please enter content",
		edited: "Edited leave message content of your group to:\n%1",
		reseted: "Reseted leave message content",
		noFile: "No leave message attachment file to reset",
		resetedFile: "Reseted leave message attachment file successfully",
		missingFile: "Please reply this message with image/video/audio file",
		addedFile: "Added %1 attachment file to your leave message"
	}
};

module.exports.run = async function ({ args, event, api, Threads, getLang }) {
	const { threadID, senderID, body } = event;
	const threadData = await Threads.getData(threadID);
	const { data, settings } = threadData;

	switch (args[0]) {
		case "text": {
			if (!args[1])
				return api.sendMessage(getLang("missingContent"), threadID);
			else if (args[1] == "reset")
				delete data.leaveMessage;
			else
				data.leaveMessage = body.slice(body.indexOf(args[0]) + args[0].length).trim();
			
			await Threads.setData(threadID, threadData);
			return api.sendMessage(
				data.leaveMessage ? getLang("edited", data.leaveMessage) : getLang("reseted"),
				threadID
			);
		}
		case "file": {
			if (args[1] == "reset") {
				const { leaveAttachment } = data;
				if (!leaveAttachment)
					return api.sendMessage(getLang("noFile"), threadID);
				try {
					const { drive } = global.utils;
					await Promise.all(data.leaveAttachment.map(fileId => drive.deleteFile(fileId)));
					delete data.leaveAttachment;
				}
				catch (e) { }
				await Threads.setData(threadID, threadData);
				return api.sendMessage(getLang("resetedFile"), threadID);
			}
			else if (event.attachments.length === 0 && (!event.messageReply || event.messageReply.attachments.length === 0)) {
				return api.sendMessage(getLang("missingFile"), threadID, (err, info) => {
					if (err) return;
					global.GoatBot.onReply.set(info.messageID, {
						messageID: info.messageID,
						author: senderID,
						commandName: this.config.name
					});
				});
			}
			else {
				await saveChanges({ api, event, Threads, threadID, senderID, getLang });
			}
			break;
		}
		case "on":
		case "off": {
			settings.sendLeaveMessage = args[0] == "on";
			await Threads.setData(threadID, threadData);
			return api.sendMessage(getLang(args[0] == "on" ? "turnedOn" : "turnedOff"), threadID);
		}
		default:
			const langCode = settings.language || "en";
			const guide = this.config.guide[langCode].body;
			const usage = guide.replace(/{pn}/g, global.GoatBot.config.prefix + this.config.name);
			return api.sendMessage(usage, threadID);
	}
};

module.exports.handleReply = async function ({ event, Reply, api, Threads, getLang }) {
	const { threadID, senderID } = event;
	if (senderID != Reply.author)
		return;

	if (event.attachments.length === 0 && (!event.messageReply || event.messageReply.attachments.length === 0))
		return api.sendMessage(getLang("missingFile"), threadID);
	
	await saveChanges({ api, event, Threads, threadID, senderID, getLang });
};

async function saveChanges({ api, event, Threads, threadID, senderID, getLang }) {
	const { drive, getStreamFromURL, getExtFromUrl, getTime } = global.utils;
	const threadData = await Threads.getData(threadID);
	const attachments = [...event.attachments, ...(event.messageReply?.attachments || [])].filter(item => 
		["photo", 'png', "animated_image", "video", "audio"].includes(item.type)
	);
	
	if (!threadData.data.leaveAttachment)
		threadData.data.leaveAttachment = [];

	await Promise.all(attachments.map(async attachment => {
		const { url } = attachment;
		const ext = getExtFromUrl(url);
		const fileName = `${getTime()}.${ext}`;
		const infoFile = await drive.uploadFile(`setleave_${threadID}_${senderID}_${fileName}`, await getStreamFromURL(url));
		threadData.data.leaveAttachment.push(infoFile.id);
	}));

	await Threads.setData(threadID, threadData);
	return api.sendMessage(getLang("addedFile", attachments.length), threadID);
}
