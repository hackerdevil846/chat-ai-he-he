const fs = require('fs');
const axios = require('axios');
const request = require('request');

module.exports.config = {
  name: "rushia",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🎀 Random Rushia photo dekhano hoy",
  category: "random-img",
  usages: "rushia",
  cooldowns: 3,
  dependencies: {
    "axios": "^1.0.0",
    "request": "^2.88.2",
    "fs-extra": "^11.1.1"
  }
};

module.exports.run = async ({ api, event }) => {
  try {
    const res = await axios.get('https://saikiapi-v3-production.up.railway.app/holo/rushia');
    let ext = res.data.url.substring(res.data.url.lastIndexOf('.') + 1);
    let filePath = __dirname + `/cache/rushia.${ext}`;

    const callback = () => {
      api.sendMessage({
        body: `✨ Here is a cute Rushia image for you!`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
      api.setMessageReaction('✅', event.messageID, (err) => {}, true);
    };

    request(res.data.url).pipe(fs.createWriteStream(filePath)).on('close', callback);
  } catch (err) {
    api.sendMessage('❌ Photo load korte somossa hoyeche, abaro try korun!', event.threadID, event.messageID);
    api.setMessageReaction('☹️', event.messageID, (err) => {}, true);
  }
};
