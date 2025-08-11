const fs = require("fs");
const request = require("request");

module.exports = {
  config: {
    name: "npx",
    version: "1.0.1",
    prefix: false,
    permission: 0,  // Fixed typo: permssion -> permission
    credits: "asif",
    description: "Fun",
    category: "no prefix",
    usages: "😒",
    cooldowns: 5,
  },
  onStart: function({ nayan }) {
    // Empty implementation to satisfy the command loader
  },
  handleEvent: async function({ api, event, client, __GLOBAL }) {
    var { threadID, messageID } = event;
    const content = event.body ? event.body : '';
    const body = content.toLowerCase();
    const NAYAN = ['https://i.imgur.com/LLucP15.mp4', 'https://i.imgur.com/DEBRSER.mp4'];
    var rndm = NAYAN[Math.floor(Math.random() * NAYAN.length)];

    const media = await new Promise((resolve, reject) => {
      request.get(
        `${rndm}`,
        { encoding: null },
        (error, response, body) => {
          if (error) {
            reject(error);
          } else {
            resolve(body);
          }
        }
      );
    });
    if (
      body.indexOf("🥰") == 0 ||
      body.indexOf("🤩") == 0 ||
      body.indexOf("😍") == 0 ||
      body.indexOf(" ") == 0 ||
      body.indexOf(" ") == 0 ||
      body.indexOf(" ") == 0 ||
      body.indexOf(" ") == 0 ||
      body.indexOf(" ") == 0 ||
      body.indexOf(" ") == 0
    ) {
      var msg = {
        body: "🖤🥀",
        attachment: media,
      };
      api.sendMessage(msg, threadID, messageID);
      api.setMessageReaction("🖤", event.messageID, (err) => {}, true);
    }
  }
};
