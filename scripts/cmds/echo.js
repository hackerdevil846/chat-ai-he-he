module.exports.config = {
  name: "echo",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑷𝒂𝒕𝒉𝒂𝒏𝒐 𝒕𝒆𝒙𝒕 𝒕𝒂 𝒑𝒉𝒊𝒓𝒆 𝒑𝒂𝒕𝒉𝒂𝒏𝒐",
  commandCategory: "𝑨𝒏𝒚𝒐",
  cooldowns: 0,
};

module.exports.run = async function({ api, event, args }) {
  let juswa = args.join(" ");
  return api.sendMessage(`📢 ${juswa}`, event.threadID, event.messageID);
}
