module.exports.config = {
	name: "bot-say",
	version: "1.1.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑩𝒐𝒕 𝒃𝒐𝒍𝒃𝒆 𝒕𝒐𝒎𝒂𝒓 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 📣",
	commandCategory: "𝒂𝒊",
	usages: "[𝒎𝒆𝒔𝒔𝒂𝒈𝒆]",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
	const say = args.join(" ");
	
	if (!say) {
		return api.sendMessage("❗ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒕𝒐 𝒓𝒆𝒑𝒆𝒂𝒕", event.threadID, event.messageID);
	}
	
	return api.sendMessage(`🗨️ ${say}`, event.threadID, event.messageID);
};
