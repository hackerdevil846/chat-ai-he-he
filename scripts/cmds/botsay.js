module.exports.config = {
	name: "bot-say",
	version: "1.1.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑩𝒐𝒕 𝒕𝒐𝒎𝒂𝒓 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒓𝒆𝒑𝒆𝒂𝒕 𝒌𝒐𝒓𝒃𝒆 📣",
	category: "ai",
	usages: "[message]",
	cooldowns: 5
};

module.exports.onStart = async function({ api, event, args }) {
	const say = args.join(" ");
	
	if (!say) {
		return api.sendMessage(
			"❗ দয়া করে একটা message লিখো, যাতে আমি repeat করতে পারি!",
			event.threadID,
			event.messageID
		);
	}

	return api.sendMessage(
		`🗨️ ${say}`,
		event.threadID,
		event.messageID
	);
};
