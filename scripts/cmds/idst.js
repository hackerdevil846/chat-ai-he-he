module.exports.config = {
  name: "idst",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑺𝒕𝒊𝒄𝒌𝒆𝒓 𝑰𝑫 𝒔𝒂𝒗𝒆 𝒌𝒐𝒓𝒖𝒏",
  commandCategory: "𝑺𝒕𝒊𝒄𝒌𝒆𝒓",
  usages: "[𝒓𝒆𝒑𝒍𝒚]",
  cooldowns: 5   
}

module.exports.run = async function ({ api, event, args }) {
  if (event.type == "message_reply") {
    if (event.messageReply.attachments[0].type == "sticker") {
      return api.sendMessage({
        body: `𝑺𝒕𝒊𝒄𝒌𝒆𝒓 𝑰𝑫: ${event.messageReply.attachments[0].ID}\n𝑪𝒂𝒑𝒕𝒊𝒐𝒏: ${event.messageReply.attachments[0].description || '𝑵𝒐 𝒄𝒂𝒑𝒕𝒊𝒐𝒏'}`
      }, event.threadID, event.messageID);
    }
    else return api.sendMessage("𝑺𝒕𝒊𝒄𝒌𝒆𝒓 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
  }
  else if (args[0]) {
    return api.sendMessage({
      body: "𝑵𝒊𝒋𝒆𝒓 𝑺𝒕𝒊𝒄𝒌𝒆𝒓 ✨",
      sticker: args[0]
    }, event.threadID, event.messageID);
  }
  else return api.sendMessage("𝑺𝒕𝒊𝒄𝒌𝒆𝒓 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
}
