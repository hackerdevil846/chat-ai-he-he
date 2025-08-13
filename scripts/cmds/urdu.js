module.exports = {
  config: {
    name: "urdu",
    version: "1.0.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    shortDescription: "𝙏𝙚𝙭𝙩 𝙩𝙧𝙖𝙣𝙨𝙡𝙖𝙩𝙞𝙤𝙣 𝙩𝙤 𝙐𝙧𝙙𝙪",
    longDescription: "𝙏𝙚𝙭𝙩 𝙩𝙧𝙖𝙣𝙨𝙡𝙖𝙩𝙞𝙤𝙣 𝙩𝙤 𝙐𝙧𝙙𝙪",
    category: "𝙢𝙚𝙙𝙞𝙖",
    countDown: 5,
    role: 0,
    guide: "{pn} [𝙏𝙚𝙭𝙩]\nReply a message with: {pn} -> <language code>",
    dependencies: {
      "request": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const request = global.nodemodule["request"];
    const content = args.join(" ");

    if (content.length === 0 && event.type !== "message_reply") {
      return message.reply("❌ 𝙆𝙞𝙨𝙝𝙪 𝙩𝙚𝙭𝙩 �𝙖𝙩𝙝𝙖𝙤 𝙣𝙖 𝙠𝙞 𝙧𝙚𝙥𝙡𝙖𝙞 𝙠𝙤𝙧𝙤");
    }

    let translateThis = "";
    let lang = "ur";

    if (event.type === "message_reply") {
      translateThis = event.messageReply?.body || "";
      if (content.indexOf("->") !== -1) {
        lang = content.substring(content.indexOf("->") + 2).trim();
      }
    } else if (content.indexOf("->") !== -1) {
      translateThis = content.slice(0, content.indexOf("->")).trim();
      lang = content.substring(content.indexOf("->") + 2).trim();
    } else {
      translateThis = content;
    }

    if (!translateThis) {
      return message.reply("❌ 𝙏𝙧𝙖𝙣𝙨𝙡𝙖𝙩𝙚 𝙠𝙤𝙧𝙖𝙧 𝙟𝙤𝙣𝙮𝙤 �𝙤𝙮𝙚𝙘𝙝𝙚 �𝙖𝙩𝙝𝙖𝙤 �𝙤𝙧𝙩𝙚");
    }

    return request(
      encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${translateThis}`),
      (err, response, body) => {
        if (err) {
          return message.reply("❌ 𝙏𝙧𝙖𝙣𝙨𝙡𝙖𝙩𝙚 𝙠𝙤𝙧𝙩𝙚 𝙥𝙧𝙤𝙗𝙡𝙚𝙢 𝙝𝙤𝙮𝙚𝙘𝙝𝙚");
        }

        try {
          const retrieve = JSON.parse(body);
          let text = "";
          if (Array.isArray(retrieve[0])) {
            retrieve[0].forEach(item => {
              if (item && item[0]) text += item[0];
            });
          }

          let fromLang = "auto";
          try {
            fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0];
          } catch {}

          message.reply(`📜 𝙏𝙧𝙖𝙣𝙨𝙡𝙖𝙩𝙚𝙙 𝙏𝙚𝙭𝙩:\n${text}\n\n📌 ${fromLang} 𝙩𝙝𝙚𝙠𝙚 ${lang} 𝙩𝙚 𝙗𝙖𝙙𝙝𝙖𝙣𝙤 𝙝𝙤𝙮𝙚𝙘𝙝𝙚`);
        } catch (e) {
          message.reply("❌ 𝙏𝙧𝙖𝙣𝙨𝙡𝙖𝙩𝙞𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨 𝙚𝙧𝙧𝙤𝙧");
        }
      }
    );
  }
};
```
