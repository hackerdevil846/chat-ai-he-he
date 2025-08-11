module.exports.config = {
	name: "bhojpuri",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑻𝒆𝒙𝒕 𝒌𝒆 𝑩𝒉𝒐𝒋𝒑𝒖𝒓𝒊 𝒕𝒂𝒚 𝒂𝒏𝒖𝒃𝒂𝒅 𝒌𝒂𝒓𝒂",
	commandCategory: "𝑴𝒆𝒅𝒊𝒂",
	usages: "[𝑻𝒆𝒙𝒕]",
	cooldowns: 5,
	dependencies: {
		"request":  ""
	}
};

module.exports.run = async ({ api, event, args }) => {
	const request = global.nodemodule["request"];
	var content = args.join(" ");
	if (content.length == 0 && event.type != "message_reply") return global.utils.throwError(this.config.name, event.threadID,event.messageID);
	var translateThis = content.slice(0, content.indexOf(" ->"));
	var lang = content.substring(content.indexOf(" -> ") + 4);
	if (event.type == "message_reply") {
		translateThis = event.messageReply.body
		if (content.indexOf("-> ") !== -1) lang = content.substring(content.indexOf("-> ") + 3);
		else lang = global.config.language;
	}
	else if (content.indexOf(" -> ") == -1) {
		translateThis = content.slice(0, content.length)
		lang = global.config.language;
	}
  
	return request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=bho&dt=t&q=${translateThis}`), (err, response, body) => {
		if (err) return api.sendMessage("𝑬𝒓𝒓𝒐𝒓 𝒉𝒐𝒚𝒆𝒄𝒉𝒆!", event.threadID, event.messageID);
		var retrieve = JSON.parse(body);
		var text = '';
		retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
		var fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0]
		api.sendMessage(` ${text}\n -🍂🍂 ${fromLang} 𝒕𝒆𝒌𝒆 𝑩𝒉𝒐𝒋𝒑𝒖𝒓𝒊 𝒕𝒂𝒚 𝒌𝒂𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆 🍂`, event.threadID, event.messageID);
	});
};
