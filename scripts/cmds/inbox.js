module.exports.config = {
	name: "inbox",
	aliases: ["in"],
	version: "1.7",
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	hasPermssion: 0,
	description: "Sends a friendly inbox notification with emojis ✨",
	category: "system",
	usages: "[text]",
	cooldowns: 5,
	envConfig: {}
};

module.exports.onStart = async function({ api, event, args }) {
	try {
		const expectedAuthor = "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅";
		if (this.config.credits !== expectedAuthor) {
			return api.sendMessage("❌ Authorization failed: Invalid credits configuration", event.threadID, event.messageID);
		}

		const query = encodeURIComponent(args.join(' '));
		api.sendMessage("💌 𝐛𝐚𝐛𝐲 𝐜𝐡𝐞𝐜𝐤 𝐲𝐨𝐮𝐫 𝐢𝐧𝐛𝐨𝐱 🐤", event.threadID);
		api.sendMessage("😘 𝐡𝐢 𝐛𝐚𝐛𝐲", event.senderID);
	} catch (error) {
		console.error("❌ Error:", error);
		api.sendMessage("😢 An error occurred while processing your request", event.threadID);
	}
};
