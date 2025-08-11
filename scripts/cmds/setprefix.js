module.exports.config = {
	name: "setprefix",
	version: "1.1.0",
	hasPermssion: 2,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑹𝒆𝒔𝒆𝒕 𝒈𝒓𝒐𝒖𝒑 𝒑𝒓𝒆𝒇𝒊𝒙",
	commandCategory: "𝑮𝒓𝒐𝒖𝒑",
	usages: "[prefix/reset]",
	cooldowns: 5
};

module.exports.languages = {
	"vi": {
		"successChange": "Đã chuyển đổi prefix của nhóm thành: %1",
		"missingInput": "Phần prefix cần đặt không được để trống",
		"resetPrefix": "Đã reset prefix về mặc định: %1",
		"confirmChange": "Bạn có chắc bạn muốn đổi prefix của nhóm thành: %1"
	},
	"en": {
		"successChange": "✅ 𝑷𝒓𝒆𝒇𝒊𝒙 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒄𝒉𝒂𝒏𝒈𝒆𝒅 𝒕𝒐: %1",
		"missingInput": "❌ 𝑷𝒓𝒆𝒇𝒊𝒙 𝒄𝒂𝒏𝒏𝒐𝒕 𝒃𝒆 𝒆𝒎𝒑𝒕𝒚!",
		"resetPrefix": "✅ 𝑷𝒓𝒆𝒇𝒊𝒙 𝒓𝒆𝒔𝒆𝒕 𝒕𝒐 𝒅𝒆𝒇𝒂𝒖𝒍𝒕: %1",
		"confirmChange": "❓ 𝑨𝒓𝒆 𝒚𝒐𝒖 𝒔𝒖𝒓𝒆 𝒚𝒐𝒖 𝒘𝒂𝒏𝒕 𝒕𝒐 𝒄𝒉𝒂𝒏𝒈𝒆 𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑 𝒑𝒓𝒆𝒇𝒊𝒙 𝒕𝒐: %1?\n\n𝑹𝒆𝒂𝒄𝒕 𝒕𝒐 𝒕𝒉𝒊𝒔 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒕𝒐 𝒄𝒐𝒏𝒇𝒊𝒓𝒎!"
	}
};

module.exports.handleReaction = async function({ api, event, Threads, handleReaction, getText }) {
	try {
		if (event.userID !== handleReaction.author) return;
		
		const { threadID } = event;
		const newPrefix = handleReaction.PREFIX;
		
		const threadData = await Threads.getData(threadID);
		threadData.data = threadData.data || {};
		threadData.data.PREFIX = newPrefix;
		
		await Threads.setData(threadID, threadData);
		await global.data.threadData.set(threadID.toString(), threadData.data);
		
		api.unsendMessage(handleReaction.messageID);
		return api.sendMessage(getText("successChange", newPrefix), threadID);
	} catch (error) {
		console.error("𝑷𝒓𝒆𝒇𝒊𝒙 𝑬𝒓𝒓𝒐𝒓:", error);
	}
};

module.exports.run = async ({ api, event, args, Threads, getText }) => {
	const { threadID, messageID } = event;
	
	if (!args[0]) {
		return api.sendMessage(getText("missingInput"), threadID, messageID);
	}
	
	const prefix = args[0].trim();
	
	if (!prefix) {
		return api.sendMessage(getText("missingInput"), threadID, messageID);
	}
	
	if (prefix === "reset") {
		const defaultPrefix = global.config.PREFIX;
		const threadData = await Threads.getData(threadID);
		threadData.data = threadData.data || {};
		threadData.data.PREFIX = defaultPrefix;
		
		await Threads.setData(threadID, threadData);
		await global.data.threadData.set(threadID.toString(), threadData.data);
		
		return api.sendMessage(getText("resetPrefix", defaultPrefix), threadID, messageID);
	}
	
	api.sendMessage(
		getText("confirmChange", prefix), 
		threadID, 
		(error, info) => {
			if (error) return console.error("𝑪𝒐𝒏𝒇𝒊𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝑬𝒓𝒓𝒐𝒓:", error);
			
			global.client.handleReaction.push({
				name: this.config.name,
				messageID: info.messageID,
				author: event.senderID,
				PREFIX: prefix
			});
		},
		messageID
	);
};
