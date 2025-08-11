module.exports.config = {
	name: "groupemoji",
	version: "1.0.0", 
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑮𝒓𝒐𝒖𝒑 𝒆𝒓 𝒆𝒎𝒐𝒋𝒊 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒂𝒏 𝒌𝒐𝒓𝒖𝒏", 
	commandCategory: "𝑩𝒐𝒙", 
	usages: "𝒈𝒓𝒐𝒖𝒑𝒆𝒎𝒐𝒋𝒊 [𝒆𝒎𝒐𝒋𝒊]", 
	cooldowns: 0,
	dependencies: [] 
};

module.exports.run = async function({ api, event, args }) {
	const emoji = args.join(" ");
	
	if (!emoji) {
		return api.sendMessage("𝑬𝒎𝒐𝒋𝒊 𝒏𝒂𝒎 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒊𝒏𝒊 😢", event.threadID, event.messageID);
	}
	
	try {
		await api.changeThreadEmoji(emoji, event.threadID);
		return api.sendMessage(`✅ 𝑮𝒓𝒐𝒖𝒑 𝒆𝒎𝒐𝒋𝒊 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒐 𝒉𝒐𝒍𝒆 𝒈𝒆𝒍𝒆: ${emoji}`, event.threadID, event.messageID);
	} catch (error) {
		console.error(error);
		return api.sendMessage("❌ 𝑬𝒎𝒐𝒋𝒊 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒂𝒏𝒐𝒓 𝒌𝒉𝒂𝒕𝒆 𝒉𝒐𝒄𝒄𝒉𝒆! 𝑨𝒃𝒂𝒓 𝒄𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
	}
}
