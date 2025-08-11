module.exports.config = {
	name: "pashto",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝙏𝙚𝙭𝙩 �𝙖𝙨𝙝𝙩𝙤 𝙩𝙖𝙮 𝙗𝙖𝙙𝙖𝙡𝙚𝙣",
	commandCategory: "𝙢𝙚𝙙𝙞𝙖",
	usages: "[𝙏𝙚𝙭𝙩]",
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
  
	return request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ps&dt=t&q=${translateThis}`), (err, response, body) => {
		if (err) return api.sendMessage("❌ �𝙧𝙤𝙗𝙡𝙚𝙢 𝙝𝙤𝙮𝙚𝙘𝙝𝙚!", event.threadID, event.messageID);
		var retrieve = JSON.parse(body);
		var text = '';
		retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
		var fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0]
		api.sendMessage(` ${text}\n - 🍂🍂 ${fromLang} 𝙧𝙖 𝙋𝙖𝙨𝙝𝙩𝙤 𝙩𝙖𝙮 𝙗𝙖𝙙𝙖𝙡𝙖 𝙝𝙤𝙮𝙚𝙘𝙝𝙚 🍂🍂`, event.threadID, event.messageID);
	});
};
