const fs = require("fs");

module.exports.config = {
  name: "admin2",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
  description: "hihihihi",
  commandCategory: "no prefix",
  usages: "admin",
  cooldowns: 5,
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
  var { threadID, messageID } = event;
  if (
    event.body.indexOf("ADMIN") === 0 ||
    event.body.indexOf("Admin") === 0 ||
    event.body.indexOf("/Admin") === 0 ||
    event.body.indexOf("#admin") === 0
  ) {
    var msg = {
      body: `╔════ஜ۞۞ஜ═══╗

🥀 𝐍𝐚𝐚𝐦 : 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑
⚜️ 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 : https://www.facebook.com/share/15yVioQQyq/
📱 𝐏𝐡𝐨𝐧 𝐧𝐮𝐦𝐛𝐞𝐫 : 01586400590

╚════ஜ۞۞ஜ═══╝

»»————-　★　————-««
🥀 𝐵𝑜𝓉 𝑒𝓇 𝑀𝒶𝓁𝒾𝓀 : 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑
»»————-　★　————-««`,
      attachment: fs.createReadStream(__dirname + '/noprefix/profile.png')
    };
    api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🫅", event.messageID, (err) => {}, true);
  }
};

module.exports.run = function({ api, event, client, __GLOBAL }) {
  // No action needed here
};
