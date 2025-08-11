module.exports.config = {
	name: "kick",
	version: "1.0.1", 
	hasPermssion: 1,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑮𝒓𝒐𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒕𝒂𝒈 𝒅𝒊𝒚𝒆 𝒋𝒂𝒓𝒆 𝒌𝒊𝒄𝒌 𝒌𝒐𝒓𝒖𝒏",
	commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎", 
	usages: "[𝒕𝒂𝒈]", 
	cooldowns: 0,
};

module.exports.languages = {
	"vi": {
		"error": "Đã có lỗi xảy ra, vui lòng thử lại sau",
		"needPermssion": "Cần quyền quản trị viên nhóm\nVui lòng thêm và thử lại!",
		"missingTag": "Bạn phải tag người cần kick"
	},
	"en": {
		"error": "𝑬𝒓𝒓𝒐𝒓! 𝑬𝒌𝒕𝒂 𝒑𝒓𝒐𝒃𝒍𝒆𝒎 𝒉𝒐𝒚𝒆𝒄𝒉𝒆. 𝑷𝒖𝒏𝒂𝒓𝒃𝒂𝒓 𝒄𝒉𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏!",
		"needPermssion": "𝑮𝒓𝒐𝒖𝒑 𝒆𝒓 𝒂𝒅𝒎𝒊𝒏 𝒅𝒂𝒌𝒉𝒕𝒆 𝒉𝒐𝒃𝒆\n𝑫𝒂𝒚𝒂 𝒌𝒐𝒓𝒆 𝒂𝒅𝒅 𝒌𝒐𝒓𝒆 𝒑𝒖𝒏𝒂𝒓𝒃𝒂𝒓 𝒄𝒉𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏!",
		"missingTag": "𝑲𝒊𝒄𝒌 𝒌𝒐𝒓𝒕𝒆 𝒕𝒖𝒎𝒊 𝒌𝒂𝒓𝒐 𝒔𝒐𝒎𝒆𝒐𝒏𝒆 𝒌𝒆 𝒕𝒂𝒈 𝒌𝒐𝒓𝒐"
	}
}

module.exports.run = async function({ api, event, getText, Threads }) {
	var mention = Object.keys(event.mentions);
	try {
		let dataThread = (await Threads.getData(event.threadID)).threadInfo;
		
		// Check if bot is admin
		if (!dataThread.adminIDs.some(item => item.id == api.getCurrentUserID())) 
			return api.sendMessage(getText("needPermssion"), event.threadID, event.messageID);
		
		// Check if user tagged someone
		if(!mention[0]) 
			return api.sendMessage(getText("missingTag"), event.threadID, event.messageID);
		
		// Check if user is admin
		if (dataThread.adminIDs.some(item => item.id == event.senderID)) {
			for (const o in mention) {
				setTimeout(() => {
					api.removeUserFromGroup(mention[o], event.threadID);
					api.sendMessage(`🚫 @${mention[o]} 𝒌𝒆 𝒌𝒊𝒄𝒌 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐!`, event.threadID);
				}, 3000);
			}
		} else {
			return api.sendMessage("❌ 𝑨𝒑𝒏𝒊 𝒑𝒂𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏 𝒏𝒆𝒊 𝒌𝒊𝒄𝒌 𝒌𝒐𝒓𝒕𝒆!", event.threadID, event.messageID);
		}
	} catch (err) {
		console.error(err);
		return api.sendMessage(getText("error"), event.threadID, event.messageID);
	}
}
