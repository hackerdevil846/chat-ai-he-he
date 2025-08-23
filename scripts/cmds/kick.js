module.exports.config = {
	name: "kick",
	version: "1.0.1", 
	hasPermssion: 1,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "🚫 𝑮𝒓𝒐𝒖𝒑 𝒎𝒆𝒎𝒃𝒆𝒓𝒔 𝒌𝒊𝒄𝒌 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒄𝒐𝒎𝒎𝒂𝒏𝒅", 
	category: "⚙️ 𝑺𝒚𝒔𝒕𝒆𝒎", 
	usages: "[@𝒕𝒂𝒈]", 
	cooldowns: 5,
	dependencies: {},
	envConfig: {}
};

module.exports.languages = {
	"en": {
		"error": "❌ 𝑬𝒓𝒓𝒐𝒓! 𝑬𝒌𝒕𝒂 𝒑𝒓𝒐𝒃𝒍𝒆𝒎 𝒉𝒐𝒚𝒆𝒄𝒉𝒆. 𝑷𝒖𝒏𝒂𝒓𝒃𝒂𝒓 𝒄𝒉𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏!",
		"needPermssion": "🔒 𝑮𝒓𝒐𝒖𝒑 𝒆𝒓 𝒂𝒅𝒎𝒊𝒏 𝒅𝒂𝒌𝒉𝒕𝒆 𝒉𝒐𝒃𝒆\n𝑫𝒂𝒚𝒂 𝒌𝒐𝒓𝒆 𝒂𝒅𝒅 𝒌𝒐𝒓𝒆 𝒑𝒖𝒏𝒂𝒓𝒃𝒂𝒓 𝒄𝒉𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏!",
		"missingTag": "📍 𝑲𝒊𝒄𝒌 𝒌𝒐𝒓𝒕𝒆 𝒕𝒖𝒎𝒊 𝒌𝒂𝒓𝒐 𝒔𝒐𝒎𝒆𝒐𝒏𝒆 𝒌𝒆 𝒕𝒂𝒈 𝒌𝒐𝒓𝒐",
		"success": "🚫 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒌𝒊𝒄𝒌𝒆𝒅: @%1"
	}
};

module.exports.run = async function({ api, event, getText, Threads, Users }) {
	const { threadID, messageID, senderID } = event;
	const mention = Object.keys(event.mentions);
	
	try {
		const dataThread = (await Threads.getData(threadID)).threadInfo;
		
		// Check bot admin permission
		if (!dataThread.adminIDs.some(item => item.id == api.getCurrentUserID())) 
			return api.sendMessage(getText("needPermssion"), threadID, messageID);
		
		if (!mention.length) 
			return api.sendMessage(getText("missingTag"), threadID, messageID);
		
		// Check user admin permission
		if (!dataThread.adminIDs.some(item => item.id == senderID)) 
			return api.sendMessage("❌ 𝑨𝒑𝒏𝒊 𝒑𝒂𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏 𝒏𝒆𝒊 𝒌𝒊𝒄𝒌 𝒌𝒐𝒓𝒕𝒆!", threadID, messageID);
		
		for (const id of mention) {
			await new Promise(resolve => setTimeout(resolve, 1000));
			api.removeUserFromGroup(id, threadID);
			api.sendMessage({
				body: getText("success", event.mentions[id].replace("@", "")),
				mentions: [{
					tag: event.mentions[id],
					id: id
				}]
			}, threadID);
		}
		
	} catch (error) {
		console.error(error);
		return api.sendMessage(getText("error"), threadID, messageID);
	}
};

module.exports.onLoad = function() {};
module.exports.handleReaction = function() {};
module.exports.handleReply = function() {};
module.exports.handleEvent = function() {};
module.exports.handleSchedule = function() {};
