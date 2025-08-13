module.exports.config = {
  name: "trans-bangali",
  version: "1.0.1",
  hasPermssion: 0,
  role: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑻𝒆𝒙𝒕 𝒕𝒓𝒂𝒏𝒔𝒍𝒂𝒕𝒊𝒐𝒏 𝒕𝒐 𝑩𝒂𝒏𝒈𝒍𝒂",
  category: "𝒎𝒆𝒅𝒊𝒂",
  usages: "[𝑻𝒆𝒙𝒕]",
  cooldowns: 5,
  countDown: 5,
  dependencies: { "request": "" }
};

// Goat Bot compatibility: use onStart; keep run for broader compatibility
module.exports.onStart = async function ({ api, event, args, message }) {
  return handleTranslate({ api, event, args, message });
};

module.exports.run = async function ({ api, event, args, message }) {
  return handleTranslate({ api, event, args, message });
};

function handleTranslate({ api, event, args, message }) {
  const request = global.nodemodule["request"];
  let content = (args || []).join(" ").trim();

  if ((!content || content.length === 0) && event.type !== "message_reply") {
    const reply = message && typeof message.reply === "function" ? message.reply : (text) => api.sendMessage(text, event.threadID, event.messageID);
    return reply("𝑻𝒆𝒙𝒕 𝒅𝒊𝒏 𝒃𝒂 𝒌𝒐𝒏𝒐 𝒎𝒆𝒔𝒔𝒆𝒋𝒆 𝒓𝒆𝒑𝒍𝒂𝒊 𝒌𝒐𝒓𝒖𝒏।");
  }

  let translateThis = "";
  let lang = "bn"; // default target Bangla

  if (event.type === "message_reply" && event.messageReply && event.messageReply.body) {
    translateThis = event.messageReply.body;
    if (content.includes("->")) {
      lang = content.split("->").pop().trim() || "bn";
    }
  } else {
    if (content.includes("->")) {
      const parts = content.split("->");
      translateThis = (parts[0] || "").trim();
      lang = (parts[1] || "").trim() || "bn";
    } else {
      translateThis = content;
    }
  }

  const url = encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${translateThis}`);

  return request(url, (err, response, body) => {
    if (err) return api.sendMessage("𝑬𝒓𝒓𝒐𝒓 𝒉𝒐𝒊𝒔𝒆!", event.threadID, event.messageID);
    try {
      const retrieve = JSON.parse(body);

      let text = "";
      if (Array.isArray(retrieve[0])) {
        retrieve[0].forEach(item => {
          if (item && item[0]) text += item[0];
        });
      }

      const fromLang =
        (retrieve && retrieve[2]) ||
        (retrieve && retrieve[8] && retrieve[8][0] && retrieve[8][0][0]) ||
        "auto";

      api.sendMessage(
        `❏ ${text}\n\n➤ 𝑨𝒏𝒖𝒃𝒂𝒅 𝒉𝒐𝒊𝒔𝒆: ${fromLang} 𝒕𝒉𝒆𝒌𝒆 𝑩𝒂𝒏𝒈𝒍𝒂`,
        event.threadID,
        event.messageID
      );
    } catch (e) {
      api.sendMessage("𝑨𝒏𝒖𝒃𝒂𝒅 𝒆𝒓𝒓𝒐𝒓 𝒉𝒐𝒊𝒔𝒆. 𝒑𝒖𝒏𝒐𝒓𝒊 𝒄𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏...", event.threadID, event.messageID);
    }
  });
}
