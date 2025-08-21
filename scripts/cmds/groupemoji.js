module.exports.config = {
	name: "groupemoji",
	version: "1.0.0", 
	hasPermssion: 1,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "Change group emoji", 
	commandCategory: "Group", 
	usages: "[emoji]", 
	cooldowns: 5,
	dependencies: {} 
};

module.exports.run = async function({ api, event, args }) {
	try {
		const emoji = args.join(" ");
		
		if (!emoji) {
			return api.sendMessage("❓ | Please enter an emoji to set for the group!", event.threadID, event.messageID);
		}
		
		await api.changeThreadEmoji(emoji, event.threadID);
		return api.sendMessage(`✅ | Successfully changed group emoji to: ${emoji}`, event.threadID);
		
	} catch (error) {
		console.error(error);
		return api.sendMessage("❌ | Failed to change group emoji. Please try again later.", event.threadID, event.messageID);
	}
};
