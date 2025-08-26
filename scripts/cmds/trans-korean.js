module.exports.config = {
  name: "trans-korean",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝙏𝙚𝙭𝙩 𝙩𝙧𝙖𝙣𝙨𝙡𝙖𝙩𝙞𝙤𝙣",
  category: "𝙢𝙚𝙙𝙞𝙖",
  usages: "[𝙏𝙚𝙭𝙩]",
  cooldowns: 5,
  dependencies: {
    "request": ""
  }
};

module.exports.onStart = async ({ api, event, args }) => {
  const request = global.nodemodule["request"];
  let content = (args.join(" ") || "").trim();

  if (content.length === 0 && event.type !== "message_reply") {
    return global.utils.throwError(this.config.name, event.threadID, event.messageID);
  }

  let translateThis = content.slice(0, content.indexOf(" ->"));
  let lang = content.substring(content.indexOf(" -> ") + 4);

  if (event.type === "message_reply") {
    translateThis = event.messageReply.body;
    if (content.indexOf("-> ") !== -1) {
      lang = content.substring(content.indexOf("-> ") + 3);
    } else {
      lang = global.config.language;
    }
  } else if (content.indexOf(" -> ") === -1) {
    translateThis = content.slice(0, content.length);
    lang = global.config.language;
  }

  const url = encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ko&dt=t&q=${translateThis}`);

  return request(url, (err, response, body) => {
    if (err) {
      return api.sendMessage("𝘼𝙣 𝙚𝙧𝙧𝙤𝙧 𝙝𝙖𝙨 𝙤𝙘𝙘𝙪𝙧𝙧𝙚𝙙!", event.threadID, event.messageID);
    }

    try {
      const retrieve = JSON.parse(body);
      let text = "";
      const segments = Array.isArray(retrieve[0]) ? retrieve[0] : [];
      segments.forEach(item => { if (item && item[0]) text += item[0]; });

      let fromLang = "auto";
      if (retrieve[2]) fromLang = retrieve[2];
      if (retrieve[8] && retrieve[8][0] && retrieve[8][0][0]) {
        fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0];
      }

      return api.sendMessage(
        ` ${text}\n━━━━━━━━━━━━━━━━\n𝙏𝙧𝙖𝙣𝙨𝙡𝙖𝙩𝙚𝙙 𝙛𝙧𝙤𝙢 ${fromLang} 𝙩𝙤 𝙆𝙤𝙧𝙚𝙖𝙣`,
        event.threadID,
        event.messageID
      );
    } catch (e) {
      return api.sendMessage("𝙏𝙧𝙖𝙣𝙨𝙡𝙖𝙩𝙞𝙤𝙣 𝙚𝙧𝙧𝙤𝙧: 𝙄𝙣𝙫𝙖𝙡𝙞𝙙 𝙧𝙚𝙨𝙥𝙤𝙣𝙨𝙚 𝙛𝙧𝙤𝙢 𝙨𝙚𝙧𝙫𝙚𝙧", event.threadID, event.messageID);
    }
  });
};
