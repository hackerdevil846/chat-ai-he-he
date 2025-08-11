module.exports.config = {
  name: "korean",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝙏𝙚𝙭𝙩 𝙩𝙧𝙖𝙣𝙨𝙡𝙖𝙩𝙞𝙤𝙣",
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
  
  if (content.length == 0 && event.type != "message_reply") 
    return global.utils.throwError(this.config.name, event.threadID, event.messageID);
  
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

  return request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ko&dt=t&q=${translateThis}`), (err, response, body) => {
    if (err) return api.sendMessage("𝘼𝙣 𝙚𝙧𝙧𝙤𝙧 𝙝𝙖𝙨 𝙤𝙘𝙘𝙪𝙧𝙧𝙚𝙙!", event.threadID, event.messageID);
    
    try {
      var retrieve = JSON.parse(body);
      var text = '';
      retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
      var fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0];
      
      api.sendMessage(` ${text}\n━━━━━━━━━━━━━━━━\n𝙏𝙧𝙖𝙣𝙨𝙡𝙖𝙩𝙚𝙙 𝙛𝙧𝙤𝙢 ${fromLang} 𝙩𝙤 𝙆𝙤𝙧𝙚𝙖𝙣`, event.threadID, event.messageID);
    } catch (e) {
      api.sendMessage("𝙏𝙧𝙖𝙣𝙨𝙡𝙖𝙩𝙞𝙤𝙣 𝙚𝙧𝙧𝙤𝙧: 𝙄𝙣𝙫𝙖𝙡𝙞𝙙 𝙧𝙚𝙨𝙥𝙤𝙣𝙨𝙚 𝙛𝙧𝙤𝙢 𝙨𝙚𝙧𝙫𝙚𝙧", event.threadID, event.messageID);
    }
  });
};
