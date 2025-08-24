module.exports.config = {
  name: "trans-pashto",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝙏𝙚𝙭𝙩 𝙥𝙖𝙨𝙝𝙩𝙤 𝙩𝙖𝙮 𝙗𝙖𝙙𝙖𝙡𝙚𝙣",
  category: "𝙢𝙚𝙙𝙞𝙖",
  usages: "[𝙏𝙚𝙭𝙩]",
  cooldowns: 5,
  dependencies: {
    "request": ""
  }
};

module.exports.run = async ({ api, event, args }) => {
  const request = global.nodemodule["request"];
  const content = args.join(" ").trim();

  if ((content.length === 0) && event.type !== "message_reply") {
    return global.utils.throwError(this.config.name, event.threadID, event.messageID);
  }

  let translateThis = "";
  let lang = (global.config && global.config.language) ? global.config.language : "auto";

  if (event.type === "message_reply") {
    translateThis = (event.messageReply && event.messageReply.body) ? event.messageReply.body : "";
    if (content.indexOf("-> ") !== -1) {
      lang = content.substring(content.indexOf("-> ") + 3).trim();
    }
  } else {
    if (content.includes(" -> ")) {
      translateThis = content.slice(0, content.indexOf(" -> ")).trim();
      lang = content.substring(content.indexOf(" -> ") + 4).trim();
    } else {
      translateThis = content;
    }
  }

  return request(
    encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ps&dt=t&q=${translateThis}`),
    (err, response, body) => {
      if (err || !body) {
        return api.sendMessage("❌ 𝙥𝙧𝙤𝙗𝙡𝙚𝙢 𝙝𝙤𝙮𝙚𝙘𝙝𝙚!", event.threadID, event.messageID);
      }

      let retrieve;
      try {
        retrieve = JSON.parse(body);
      } catch (e) {
        return api.sendMessage("❌ 𝙥𝙧𝙤𝙗𝙡𝙚𝙢 𝙝𝙤𝙮𝙚𝙘𝙝𝙚!", event.threadID, event.messageID);
      }

      let text = "";
      if (Array.isArray(retrieve) && Array.isArray(retrieve[0])) {
        retrieve[0].forEach(item => {
          if (item && item[0]) text += item[0];
        });
      }

      let fromLang = "auto";
      try {
        const src1 = retrieve[2];
        const src2 = retrieve[8] && retrieve[8][0] && retrieve[8][0][0];
        fromLang = src2 || src1 || "auto";
      } catch (e) {
        fromLang = "auto";
      }

      return api.sendMessage(
        ` ${text}\n - 🍂🍂 ${fromLang} 𝙧𝙖 𝙋𝙖𝙨𝙝𝙩𝙤 𝙩𝙖𝙮 𝙗𝙖𝙙𝙖𝙡𝙖 𝙝𝙤𝙮𝙚𝙘𝙝𝙚 🍂🍂`,
        event.threadID,
        event.messageID
      );
    }
  );
};
