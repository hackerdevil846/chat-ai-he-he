module.exports.config = {
  name: "siesta",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑹𝒂𝒏𝒅𝒐𝒎 𝑺𝒊𝒆𝒔𝒕𝒂 𝒆𝒓 𝒑𝒉𝒐𝒕𝒐 𝒂𝒏𝒔𝒆𝒏",
  category: "𝑹𝒂𝒏𝒅𝒐𝒎-𝑰𝑴𝑮",
  usages: "siesta",
  cooldowns: 3
};

module.exports.run = async ({ api, event }) => {
  const axios = require('axios');
  const request = require('request');
  const fs = require("fs");
  
  axios.get('https://api.waifu.im/search?included_tags=waifu').then(res => {
    let imgUrl = res.data.images[0].url;
    let ext = imgUrl.substring(imgUrl.lastIndexOf(".") + 1);
    let callback = function () {
      api.sendMessage({
        body: "𝑺𝒊𝒆𝒔𝒕𝒂 𝒆𝒓 𝒑𝒉𝒐𝒕𝒐 𝑼𝒘𝑼",
        attachment: fs.createReadStream(__dirname + `/cache/siesta.${ext}`)
      }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/siesta.${ext}`), event.messageID);
    };
    request(imgUrl).pipe(fs.createWriteStream(__dirname + `/cache/siesta.${ext}`)).on("close", callback);
  }).catch(err => {
    api.sendMessage("❌ 𝑺𝒊𝒆𝒔𝒕𝒂 𝒆𝒓 𝒑𝒉𝒐𝒕𝒐 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂!", event.threadID, event.messageID);
  });
}

