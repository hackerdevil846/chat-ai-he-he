module.exports = {
	config: {
		name: "fuckyou",
		version: "2.0",
		author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
		hasPermssion: 0,
		credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
		description: "🖕 Auto-reply to 'fuck' trigger",
		category: "no-prefix",
		usages: "[auto-trigger]",
		cooldowns: 5,
		envConfig: {}
	},

	onLoad: function() {},

	onStart: async function({ event, message }) {
		try {
			if (event.body?.toLowerCase().trim() === "fuck") {
				message.reply({
					body: "🖕 *𝑭𝒖𝒄𝒌 𝒚𝒐𝒖 𝒕𝒐𝒐!*",
					attachment: [
						await global.utils.getStreamFromURL(
							"https://i.imgur.com/9bNeakd.gif"
						)
					]
				});
			}
		} catch (err) {
			console.error("❌ [FuckYou Error]", err);
			message.reply("❌ 𝑺𝒐𝒎𝒆𝒕𝒉𝒊𝒏𝒈 𝒘𝒆𝒏𝒕 𝒘𝒓𝒐𝒏𝒈! 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏.");
		}
	}
};
