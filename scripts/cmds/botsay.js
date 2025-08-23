module.exports.config = {
	name: "bot-say", // Command name
	version: "1.1.1", // Version
	hasPermssion: 0, // 0 = All users
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // Author
	description: "𝑩𝒐𝒕 𝒕𝒐𝒎𝒂𝒓 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒓𝒆𝒑𝒆𝒂𝒕 𝒌𝒐𝒓𝒃𝒆 📣", 
	commandCategory: "ai", // Category
	usages: "[message]", // Usage format
	cooldowns: 5 // Cooldown (sec)
};

module.exports.run = async function ({ api, event, args }) {
	// Join all arguments into one string
	const say = args.join(" ");

	// If no message was given
	if (!say) {
		return api.sendMessage(
			"❗ দয়া করে একটা message লিখো, যাতে আমি repeat করতে পারি!",
			event.threadID,
			event.messageID
		);
	}

	// Send the repeated message with formatting
	return api.sendMessage(
		`🗨️ ${say}`,
		event.threadID,
		event.messageID
	);
};
