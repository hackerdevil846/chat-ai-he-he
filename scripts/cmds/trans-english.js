module.exports.config = {
	name: "trans",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑻𝒆𝒙𝒕 𝒕𝒓𝒂𝒏𝒔𝒍𝒂𝒕𝒊𝒐𝒏 𝒄𝒐𝒎𝒎𝒂𝒏𝒅",
	commandCategory: "𝑴𝒆𝒅𝒊𝒂",
	usages: "[𝒆𝒏/𝒃𝒏/𝒌𝒐/𝒋𝒂/𝒗𝒊] [𝑻𝒆𝒙𝒕]",
	cooldowns: 5,
	dependencies: {
		"request":  ""
	}
};

module.exports.run = async ({ api, event, args }) => {
	const request = global.nodemodule["request"];
	var content = args.join(" ");
	if (content.length == 0 && event.type != "message_reply") return global.utils.throwError(this.config.name, event.threadID, event.messageID);
	
	var translateThis = content.slice(0, content.indexOf("->"));
	var lang = content.substring(content.indexOf("->") + 2).trim();
	
	if (event.type == "message_reply") {
		translateThis = event.messageReply.body;
		if (content.indexOf("->") !== -1) lang = content.substring(content.indexOf("->") + 2).trim();
		else lang = "en";
	}
	else if (content.indexOf("->") == -1) {
		translateThis = content;
		lang = "en";
	}
	
	return request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${translateThis}`), (err, response, body) => {
		if (err) return api.sendMessage("❌ 𝑬𝒓𝒓𝒐𝒓 𝒉𝒐𝒚𝒆𝒄𝒉𝒆! 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏", event.threadID, event.messageID);
		
		try {
			var retrieve = JSON.parse(body);
			var text = '';
			retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
			var fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0];
			
			api.sendMessage(`📜 𝑨𝒏𝒖𝒃𝒂𝒅:\n${text}\n\n🌏 ${fromLang} 𝒕𝒉𝒆𝒌𝒆 ${lang} 𝒆 𝒕𝒓𝒂𝒏𝒔𝒍𝒂𝒕𝒆𝒅`, event.threadID, event.messageID);
		} catch (error) {
			console.error(error);
			api.sendMessage("❌ 𝑨𝒏𝒖𝒃𝒂𝒅 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊 𝒏𝒂, 𝒑𝒖𝒏𝒐𝒓𝒊 𝒄𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
		}
	});
}
