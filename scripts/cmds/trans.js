module.exports.config = {
	name: "translate",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑻𝒆𝒙𝒕 𝒕𝒓𝒂𝒏𝒔𝒍𝒂𝒕𝒊𝒐𝒏",
	commandCategory: "𝑴𝒆𝒅𝒊𝒂",
	usages: "[en/ko/hi/vi] [𝑻𝒆𝒙𝒕]",
	cooldowns: 5,
	dependencies: {
		"request":  ""
	}
};

module.exports.run = async ({ api, event, args }) => {
	const request = global.nodemodule["request"];
	var content = args.join(" ");
	
	if (content.length == 0 && event.type != "message_reply") {
		return api.sendMessage("❌ 𝑫𝒆𝒌𝒉𝒖𝒏: 𝑨𝒑𝒏𝒂𝒓 𝑲𝒐𝒎𝒂𝒏𝒅𝒆𝒓 𝑺𝒂𝒕𝒉𝒆 𝑻𝒆𝒙𝒕 𝑫𝒊𝒕𝒆 𝑯𝒐𝒃𝒆 𝑵𝒂 𝑲𝒐𝒏𝒐 𝑹𝒆𝒑𝒍𝒚 𝑫𝒊𝒍𝒆𝒏", event.threadID, event.messageID);
	}
	
	var translateThis = content.slice(0, content.indexOf(" ->"));
	var lang = content.substring(content.indexOf(" -> ") + 4);
	
	if (event.type == "message_reply") {
		translateThis = event.messageReply.body;
		if (content.indexOf("-> ") !== -1) lang = content.substring(content.indexOf("-> ") + 3);
		else lang = global.config.language;
	}
	else if (content.indexOf(" -> ") == -1) {
		translateThis = content.slice(0, content.length);
		lang = global.config.language;
	}
  
	return request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${translateThis}`), (err, response, body) => {
		if (err) return api.sendMessage("❌ 𝑬𝒓𝒓𝒐𝒓 𝑯𝒐𝒚𝒆𝒄𝒉𝒆!", event.threadID, event.messageID);
		
		try {
			var retrieve = JSON.parse(body);
			var text = '';
			retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
			var fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0];
			
			api.sendMessage(`𝑨𝒏𝒖𝒃𝒂𝒅: ${text}\n━━━━━━━━━━━━━━\n${fromLang} 𝒕𝒉𝒆𝒌𝒆 ${lang} 𝒆 𝒂𝒏𝒖𝒃𝒂𝒅 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆`, event.threadID, event.messageID);
		} catch (e) {
			api.sendMessage("❌ 𝑨𝒏𝒖𝒃𝒂𝒅 𝑲𝒐𝒓𝒕𝒆 𝑷𝒂𝒓𝒄𝒉𝒆 𝑵𝒂, 𝑨𝒃𝒂𝒓 𝑪𝒆𝒔𝒕𝒂 𝑲𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
		}
	});
}
