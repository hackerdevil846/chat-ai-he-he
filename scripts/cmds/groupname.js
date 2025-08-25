module.exports.config = {
	name: "groupname",
	version: "2.0.0",
	hasPermssion: 1,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "✨ 𝐂𝐡𝐚𝐧𝐠𝐞 𝐲𝐨𝐮𝐫 𝐠𝐫𝐨𝐮𝐩'𝐬 𝐧𝐚𝐦𝐞 𝐰𝐢𝐭𝐡 𝐬𝐭𝐲𝐥𝐞 ✨",
	category: "🅶🆁🅾🆄🅿",
	usages: "[𝐧𝐞𝐰 𝐧𝐚𝐦𝐞]",
	cooldowns: 3,
	dependencies: {}
};

module.exports.onStart = async function({ api, event, args }) {
	try {
		const { threadID, messageID, senderID } = event;
		const newName = args.join(" ");
		
		if (!newName) {
			return api.sendMessage(`🎯 | 𝐏𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐭𝐞𝐫 𝐚 𝐧𝐞𝐰 𝐧𝐚𝐦𝐞 𝐟𝐨𝐫 𝐭𝐡𝐞 𝐠𝐫𝐨𝐮𝐩!\n💡 | 𝐔𝐬𝐚𝐠𝐞: 𝐠𝐫𝐨𝐮𝐩𝐧𝐚𝐦𝐞 [𝐧𝐞𝐰 𝐧𝐚𝐦𝐞]`, threadID, messageID);
		}
		if (newName.length > 200) {
			return api.sendMessage("❌ | 𝐆𝐫𝐨𝐮𝐩 𝐧𝐚𝐦𝐞 𝐜𝐚𝐧𝐧𝐨𝐭 𝐞𝐱𝐜𝐞𝐞𝐝 𝟐𝟎𝟎 𝐜𝐡𝐚𝐫𝐚𝐜𝐭𝐞𝐫𝐬!", threadID, messageID);
		}
		await api.setTitle(newName, threadID);
		
		return api.sendMessage({
			body: `✅ | 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐜𝐡𝐚𝐧𝐠𝐞𝐝 𝐠𝐫𝐨𝐮𝐩 𝐧𝐚𝐦𝐞!\n\n✨ | 𝐍𝐞𝐰 𝐍𝐚𝐦𝐞: 「 ${newName} 」\n👤 | 𝐂𝐡𝐚𝐧𝐠𝐞𝐝 𝐁𝐲: @${(await api.getUserInfo(senderID))[senderID].name}`,
			mentions: [{
				tag: `@${(await api.getUserInfo(senderID))[senderID].name}`,
				id: senderID
			}]
		}, threadID, messageID);
	} catch (error) {
		console.error("Group Name Error:", error);
		return api.sendMessage(`❌ | 𝐄𝐫𝐫𝐨𝐫 𝐜𝐡𝐚𝐧𝐠𝐢𝐧𝐠 𝐠𝐫𝐨𝐮𝐩 𝐧𝐚𝐦𝐞!\n🔧 | 𝐏𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐬𝐮𝐫𝐞 𝐈 𝐡𝐚𝐯𝐞 𝐚𝐝𝐦𝐢𝐧 𝐩𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧 𝐚𝐧𝐝 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧!`, event.threadID, event.messageID);
	}
};

module.exports.handleEvent = async function({ api, event }) {
	// Additional event handling if needed
};

module.exports.onLoad = function() {
	// Code that runs when the command is loaded
	console.log("Group Name Command Loaded Successfully!");
};
