const fs = require("fs");

module.exports = {
  config: {
    name: "women",
    version: "1.0.1",
    Permssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑴𝒐𝒉𝒊𝒍𝒂𝒅𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒆𝒌𝒕𝒂 𝒇𝒖𝒏𝒏𝒚 𝒄𝒐𝒎𝒎𝒂𝒏𝒅",
    category: "no prefix",
    usages: "𝑾𝒐𝒎𝒆𝒏",
    cooldowns: 5
  },

  handleEvent: function({ api, event }) {
    const { threadID, messageID, body } = event;
    if (!body) return;

    if (
      body.indexOf("Women") === 0 ||
      body.indexOf("women") === 0 ||
      body.indexOf("WOMEN") === 0 ||
      body.indexOf("☕") === 0
    ) {
      const msg = {
        body: "Hahaha Mohila 🤣☕",
        attachment: fs.createReadStream(__dirname + "/noprefix/wn.mp4")
      };
      api.sendMessage(msg, threadID, messageID);
      api.setMessageReaction("☕", messageID, () => {}, true);
    }
  },

  onStart: function () {}
};
