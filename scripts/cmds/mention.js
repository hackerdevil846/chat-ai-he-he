module.exports.config = {
  name: "goiadmin",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑴𝒂𝒍𝒊𝒌 𝒌𝒆 𝒕𝒂𝒈 𝒌𝒐𝒓𝒍𝒆 𝒃𝒐𝒕 𝒂𝒖𝒕𝒐 𝒓𝒆𝒑𝒍𝒚 𝒅𝒊𝒃𝒆",
  commandCategory: "𝑶𝒕𝒉𝒆𝒓",
  usages: "",
  cooldowns: 1
};

module.exports.handleEvent = function({ api, event }) {
  if (event.senderID !== "61571630409265") {
    const adminUID = "61571630409265";
    
    if (Object.keys(event.mentions).includes(adminUID)) {
      const responses = [
        "𝑴𝒂𝒍𝒊𝒌 𝒃𝒊𝒔𝒚 𝒂𝒄𝒉𝒆, 𝒂𝒎𝒂𝒌𝒆 𝒃𝒐𝒍𝒖𝒏 𝒌𝒊 𝒃𝒐𝒍𝒕𝒆 𝒄𝒂𝒐? 🤔",
        "𝑲𝒊𝒆 𝒉𝒐𝒍𝒐? 𝑴𝒂𝒍𝒊𝒌 𝒌𝒆 𝒌𝒆𝒏 𝒅𝒂𝒌𝒂𝒕𝒆 𝒄𝒂𝒐? 😊",
        "𝑼𝒏𝒂𝒓 𝒃𝒊𝒔𝒚 𝒕𝒉𝒂𝒌𝒕𝒆 𝒑𝒂𝒓𝒆𝒏, 𝒑𝒐𝒓𝒆 𝒅𝒂𝒌𝒂𝒃𝒆𝒏 😌",
        "𝑴𝒂𝒍𝒊𝒌 𝒆𝒌𝒉𝒐𝒏 𝒕𝒉𝒆𝒌𝒆 𝒏𝒆𝒊, 𝒑𝒐𝒓𝒆 𝒅𝒆𝒌𝒉𝒊 ⏳"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      return api.sendMessage({
        body: randomResponse
      }, event.threadID, event.messageID);
    }
  }
};

module.exports.run = async function({}) {
  // No action needed here
}
