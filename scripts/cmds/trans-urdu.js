module.exports.config = {
    name: "urdu",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝙏𝙚𝙭𝙩 𝙩𝙧𝙖𝙣𝙨𝙡𝙖𝙩𝙞𝙤𝙣 𝙩𝙤 𝙐𝙧𝙙𝙪",
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
    
    if (content.length == 0 && event.type != "message_reply") {
        return api.sendMessage("❌ 𝙆𝙞𝙨𝙝𝙪 𝙩𝙚𝙭𝙩 �𝙖𝙩𝙝𝙖𝙤 𝙣𝙖 𝙠𝙞 𝙧𝙚𝙥𝙡𝙖𝙞 𝙠𝙤𝙧𝙤", event.threadID, event.messageID);
    }
    
    var translateThis = "";
    var lang = "ur";
    
    if (event.type == "message_reply") {
        translateThis = event.messageReply.body;
        if (content.indexOf("->") !== -1) {
            lang = content.substring(content.indexOf("->") + 2).trim();
        }
    }
    else if (content.indexOf("->") !== -1) {
        translateThis = content.slice(0, content.indexOf("->"));
        lang = content.substring(content.indexOf("->") + 2).trim();
    }
    else {
        translateThis = content;
    }
    
    if (!translateThis) {
        return api.sendMessage("❌ 𝙏𝙧𝙖𝙣𝙨𝙡𝙖𝙩𝙚 𝙠𝙤𝙧𝙖𝙧 𝙟𝙤𝙣𝙮𝙤 �𝙤𝙮𝙚𝙘𝙝𝙚 �𝙖𝙩𝙝𝙖𝙤 �𝙤𝙧𝙩𝙚", event.threadID, event.messageID);
    }

    return request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${translateThis}`), (err, response, body) => {
        if (err) {
            return api.sendMessage("❌ 𝙏𝙧𝙖𝙣𝙨𝙡𝙖𝙩𝙚 𝙠𝙤𝙧𝙩𝙚 𝙥𝙧𝙤𝙗𝙡𝙚𝙢 𝙝𝙤𝙮𝙚𝙘𝙝𝙚", event.threadID, event.messageID);
        }
        
        try {
            var retrieve = JSON.parse(body);
            var text = '';
            retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
            var fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0];
            
            api.sendMessage(`📜 𝙏𝙧𝙖𝙣𝙨𝙡𝙖𝙩𝙚𝙙 𝙏𝙚𝙭𝙩:\n${text}\n\n📌 ${fromLang} 𝙩𝙝𝙚𝙠𝙚 ${lang} 𝙩𝙚 𝙗𝙖𝙙𝙝𝙖𝙣𝙤 𝙝𝙤𝙮𝙚𝙘𝙝𝙚`, event.threadID, event.messageID);
        } catch (e) {
            api.sendMessage("❌ 𝙏𝙧𝙖𝙣𝙨𝙡𝙖𝙩𝙞𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨 𝙚𝙧𝙧𝙤𝙧", event.threadID, event.messageID);
        }
    });
};
