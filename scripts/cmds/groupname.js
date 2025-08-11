module.exports.config = {
	name: "groupname",
	version: "1.0.0", 
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑨𝒑𝒏𝒂𝒓 𝒈𝒓𝒐𝒖𝒑 𝒆𝒓 𝒏𝒂𝒎 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒂𝒏 𝒌𝒐𝒓𝒖𝒏", 
	commandCategory: "𝑩𝒐𝒙", 
	usages: "𝒈𝒓𝒐𝒖𝒑𝒏𝒂𝒎𝒆 [𝒏𝒂𝒎]", 
	cooldowns: 0,
	dependencies: [] 
};

module.exports.run = async function({ api, event, args }) {
	const name = args.join(" ");
	
	if (!name) {
		return api.sendMessage(
			"❌ 𝑨𝒑𝒏𝒊 𝒈𝒓𝒐𝒖𝒑 𝒆𝒓 𝒏𝒂𝒎 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒆𝒏 𝒏𝒊", 
			event.threadID, 
			event.messageID
		);
	}
	
	try {
		await api.setTitle(name, event.threadID);
		return api.sendMessage(
			`✅ 𝑮𝒓𝒐𝒖𝒑 𝒆𝒓 𝒏𝒂𝒎 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒂𝒏 𝒉𝒐𝒍𝒆 𝒈𝒆𝒄𝒉𝒆:\n"${name}"`,
			event.threadID,
			event.messageID
		);
	} catch (error) {
		console.error(error);
		return api.sendMessage(
			"❌ 𝑮𝒓𝒐𝒖𝒑 𝒏𝒂𝒎 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒂𝒏 𝒌𝒉𝒂𝒕𝒆 𝒉𝒐𝒄𝒄𝒉𝒆! 𝑨𝒃𝒂𝒓 𝒄𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏",
			event.threadID,
			event.messageID
		);
	}
};
