module.exports.config = {
	name: "echo",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "📣 𝑷𝒂𝒕𝒉𝒂𝒏𝒐 𝒕𝒆𝒙𝒕 𝒕𝒂 𝒑𝒉𝒊𝒓𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐",
	category: "utility",
	usages: "[text]",
	cooldowns: 0,
	dependencies: {}
};

module.exports.onStart = async function({ api, event, args }) {
	try {
		const inputText = args.join(" ");
		
		if (!inputText) {
			return api.sendMessage("✨ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐭𝐞𝐱𝐭 𝐭𝐨 𝐞𝐜𝐡𝐨!\n💡 𝐔𝐬𝐚𝐠𝐞: echo [text]", event.threadID, event.messageID);
		}

		return api.sendMessage(`📢 ${inputText}`, event.threadID, event.messageID);
		
	} catch (error) {
		console.error("🔴 Error in echo command:", error);
		return api.sendMessage("❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐭𝐡𝐞 𝐫𝐞𝐪𝐮𝐞𝐬𝐭.", event.threadID);
	}
};
