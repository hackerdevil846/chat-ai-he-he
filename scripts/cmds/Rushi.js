module.exports.config = {
  name: "rushia",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑", // Updated credits
  description: "𝑹𝒂𝒏𝒅𝒐𝒎 𝑹𝒖𝒔𝒉𝒊𝒂 𝒑𝒉𝒐𝒕𝒐 𝒅𝒆𝒌𝒉𝒂𝒏", // Banglish description
  commandCategory: "random-img",
  usages: "rushia",
  cooldowns: 3
};

module.exports.run = async ({ api, event }) => {
  const axios = require('axios');
  const request = require('request');
  const fs = require("fs");
  
  axios.get('https://saikiapi-v3-production.up.railway.app/holo/rushia').then(res => {
    let ext = res.data.url.substring(res.data.url.lastIndexOf(".") + 1);
    let callback = function () {
      api.sendMessage({
        attachment: fs.createReadStream(__dirname + `/cache/rushia.${ext}`)
      }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/rushia.${ext}`), event.messageID);
      api.setMessageReaction("✅", event.messageID, (err) => {}, true);
    };
    request(res.data.url).pipe(fs.createWriteStream(__dirname + `/cache/rushia.${ext}`)).on("close", callback);
  })
  .catch(err => {
    api.sendMessage("𝑷𝒉𝒐𝒕𝒐 𝒃𝒂𝒏𝒂𝒏𝒐𝒓 𝒔𝒐𝒎𝒐𝒚 𝒑𝒓𝒐𝒃𝒍𝒆𝒎 𝒉𝒐𝒚𝒆𝒄𝒉𝒆, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒂𝒃𝒂𝒓 𝒄𝒉𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏!", event.threadID, event.messageID);
    api.setMessageReaction("☹️", event.messageID, (err) => {}, true);
  })    
}
