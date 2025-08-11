const fs = require("fs");
module.exports.config = {
  name: "tea",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
  description: "𝑻𝒆𝒂 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒆𝒗𝒆𝒏𝒕 𝒉𝒂𝒏𝒅𝒍𝒆𝒓",
  commandCategory: "𝒏𝒐 𝒑𝒓𝒆𝒇𝒊𝒙",
  usages: "𝒕𝒆𝒂/𝑻𝒆𝒂/𝑪𝒉𝒂𝒊/𝑪𝑯𝑨𝑰/𝑪𝒉𝒂/𝑪𝑯𝑨",
  cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
  var { threadID, messageID } = event;
  const triggers = ["tea", "Tea", "Chai", "CHAI", "Cha", "CHA"];
  
  if (triggers.some(word => event.body.indexOf(word) === 0)) {
    var msg = {
      body: "𝒂𝒊𝒊 𝒍𝒐 𝒃𝒂𝒃𝒚 ☕", // Updated to "aii lo bby"
      attachment: fs.createReadStream(__dirname + `/noprefix/tea.mp4`)
    }
    api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🫖", event.messageID, (err) => {}, true);
  }
}

module.exports.run = function({ api, event, client, __GLOBAL }) {
  // No changes needed here
}
