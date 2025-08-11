module.exports.config = {
	name: "minari",
	version: "1.0.9",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑨𝑰 𝑴𝒊𝒏𝒂𝒓𝒊 𝒆𝒓 𝒔𝒂𝒕𝒉𝒆 𝒌𝒂𝒕𝒉𝒂 𝒃𝒐𝒍𝒖𝒏",
	commandCategory: "Ai - chatbot",
	usages: "[text/message/chat]",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
	const axios = global.nodemodule["axios"];
	const Chatbot = require("discord-chatbot");
	
	if (!args[0]) {
		return api.sendMessage("𝑫𝒆𝒌𝒉𝒆𝒏 𝒂𝒑𝒏𝒊 𝒌𝒊 𝒃𝒐𝒍𝒕𝒆 𝒄𝒉𝒂𝒏? 😊", event.threadID, event.messageID);
	}
	
	try {
		const mess = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");
		const chatbot = new Chatbot({ name: "Minari", gender: "Female" });
		const res = await chatbot.chat(mess);
		
		// Custom Banglish responses
		switch(res) {
			case "My dear great botmaster, Priyansh.":
				return api.sendMessage("𝑨𝒎𝒂𝒌𝒆 𝒃𝒂𝒏𝒂𝒊𝒚𝒆𝒄𝒉𝒆 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅, 𝒕𝒂𝒓 𝒏𝒂𝒎 𝑨𝒔𝒊𝒇 😊", event.threadID, event.messageID);
				
			case "My birthplace is Priyansh's laptop. What is your birthplace?":
				return api.sendMessage("𝑨𝒎𝒊 𝑩𝒂𝒏𝒈𝒍𝒂𝒅𝒆𝒔𝒉 𝒕𝒉𝒆𝒌𝒆 𝒂𝒔𝒊. 𝑨𝒑𝒏𝒂𝒓 𝒃𝒂𝒓𝒊 𝒌𝒐𝒕𝒉𝒂𝒚? 😊", event.threadID, event.messageID);
				
			case "My favorite anime is <em>Ghost in the Shell</em>":
				return api.sendMessage("𝑨𝒎𝒂𝒓 𝒔𝒐𝒃𝒄𝒉𝒆𝒚𝒆 𝒑𝒓𝒊𝒚𝒐 𝒂𝒏𝒊𝒎𝒆 '𝑫𝒆𝒎𝒐𝒏 𝑺𝒍𝒂𝒚𝒆𝒓' 😍", event.threadID, event.messageID);
				
			case "I can't think of any. You suggest anime.":
				return api.sendMessage("𝑨𝒑𝒏𝒊 '𝑨𝒕𝒕𝒂𝒄𝒌 𝒐𝒏 𝑻𝒊𝒕𝒂𝒏' 𝒅𝒆𝒌𝒉𝒕𝒆 𝒑𝒂𝒓𝒆𝒏, 𝒌𝒉𝒖𝒃 𝒗𝒂𝒍𝒐! 😊", event.threadID, event.messageID);
				
			case "I was created by Priyansh.":
				return api.sendMessage("𝑨𝒎𝒂𝒌𝒆 𝒃𝒂𝒏𝒂𝒊𝒚𝒆𝒄𝒉𝒆 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 🤖", event.threadID, event.messageID);
				
			case "I obey 𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭.":
				return api.sendMessage("𝑨𝒎𝒊 𝒔𝒖𝒅𝒉𝒖 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 𝒆𝒓 𝒌𝒂𝒕𝒉𝒂 𝒎𝒂𝒏𝒊 😇", event.threadID, event.messageID);
		}
		
		// Default response with Banglish translations
		const banglishResponses = {
			"hello": "𝑯𝒆𝒍𝒍𝒐! 𝑲𝒆𝒎𝒐𝒏 𝒂𝒄𝒉𝒆𝒏? 😊",
			"how are you": "𝑨𝒎𝒊 𝒗𝒂𝒍𝒐 𝒂𝒄𝒉𝒊, 𝒂𝒑𝒏𝒊 𝒌𝒆𝒎𝒐𝒏? 😊",
			"what's your name": "𝑨𝒎𝒂𝒓 𝒏𝒂𝒎 𝑴𝒊𝒏𝒂𝒓𝒊, 𝒂𝒑𝒏𝒂𝒓 𝒏𝒂𝒎 𝒌𝒊? 😍",
			"good morning": "𝑺𝒖𝒑𝒓𝒂𝒃𝒂𝒕! 𝑺𝒖𝒃𝒉𝒐 𝒌𝒉𝒖𝒃 𝒃𝒂𝒍𝒐 𝒓𝒐𝒊𝒆𝒄𝒉𝒆 🌄",
			"good night": "𝑺𝒖𝒃𝒉𝒐 𝑹𝒂𝒕𝒓𝒊, 𝒔𝒖𝒆𝒅 𝒅𝒓𝒆𝒂𝒎 😴",
			"i love you": "𝑨𝒎𝒊 𝒐 𝒂𝒑𝒏𝒂𝒌𝒆 𝒗𝒂𝒍𝒐 𝒃𝒂𝒔𝒊! 😘",
			"thank you": "𝑨𝒑𝒏𝒂𝒓 𝒅𝒐𝒏𝒏𝒐𝒃𝒂𝒅! 😊",
			"bye": "𝑩𝒊𝒅𝒂𝒚 𝒏𝒊𝒍𝒂𝒎, 𝒂𝒃𝒂𝒓 𝒅𝒆𝒌𝒉𝒂 𝒉𝒐𝒃𝒆 👋"
		};
		
		// Check if response matches common English phrases
		const lowerRes = res.toLowerCase();
		for (const [key, value] of Object.entries(banglishResponses)) {
			if (lowerRes.includes(key)) {
				return api.sendMessage(value, event.threadID, event.messageID);
			}
		}
		
		// Send original response if no custom match
		return api.sendMessage(res, event.threadID, event.messageID);
		
	} catch (error) {
		console.error(error);
		return api.sendMessage("𝑨𝒓𝒆 𝒂𝒓𝒆! 𝑲𝒊𝒔𝒉𝒐𝒓 𝒉𝒐𝒍𝒐? 𝑨𝒃𝒂𝒓 𝒕𝒓𝒚 𝒌𝒐𝒓𝒖𝒏 😅", event.threadID, event.messageID);
	}
}
