module.exports.config = {
	name: "tikvideo",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝙏𝙞𝙠𝙏𝙤𝙠 𝙫𝙞𝙙𝙚𝙤 𝙙𝙖𝙪𝙣𝙡𝙤𝙖𝙙 𝙠𝙤𝙧𝙚",
	commandCategory: "𝙐𝙨𝙚𝙧 𝙡𝙖𝙜𝙚",
	usages: "",
	cooldowns: 5
};

module.exports.onLoad = function() {
	console.log("=== 𝙏𝙞𝙠𝙏𝙤𝙠 𝘿𝙖𝙪𝙣𝙡𝙤𝙖𝙙 𝙉𝙤 𝙒𝙖𝙩𝙚𝙧𝙢𝙖𝙧𝙠 ===")
};

module.exports.run = async function({ args, event, api }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const request = require("request");
  
  var img = [];
  if(!args[0]) {
    return api.sendMessage(`𝘼𝙥𝙣𝙞 𝙩𝙞𝙠𝙩𝙤𝙠 𝙡𝙞𝙣𝙠 𝙙𝙞𝙮𝙚𝙘𝙝𝙚𝙣 𝙣𝙖`, event.threadID, event.messageID)
  }
  
  try {
    const res = (await axios.get(`http://api.leanhtruong.net/api-no-key/tiktok?url=${encodeURI(args[0])}`)).data;
    let imga = (await axios.get(res.thumbail, { responseType: "arraybuffer" })).data; 
    fs.writeFileSync(__dirname + "/cache/tiktok.png", Buffer.from(imga, "utf-8"));
    img.push(fs.createReadStream(__dirname + "/cache/tiktok.png"));
    
    var msg = {
      body: `𝙏𝙖𝙞𝙩𝙡 : ${res.title}\n𝙇𝙚𝙠𝙝𝙖𝙠 : ${res.author_video}\n𝙂𝙖𝙣𝙚𝙧 𝙩𝙖𝙞𝙩𝙡 : ${res.data_music.title}\n\n1. 𝙑𝙞𝙙𝙚𝙤 𝙙𝙖𝙪𝙣𝙡𝙤𝙖𝙙\n2. 𝙂𝙖𝙣 𝙙𝙖𝙪𝙣𝙡𝙤𝙖𝙙\n\n𝙆𝙞𝙘𝙝𝙪 𝙥𝙖𝙩𝙝𝙖𝙩𝙚 𝙧𝙚𝙥𝙡𝙮 𝙠𝙤𝙧𝙪𝙣!`,
      attachment: img
    }
    
    return api.sendMessage(msg, event.threadID, (error, info) => {
      global.client.handleReply.push({
        type: "reply",
        name: this.config.name,
        author: event.senderID,
        messageID: info.messageID,
        video: res.data_nowatermark[0].url,
        mp3: res.data_music.url,
        title: res.title,
        authorvd: res.author_video,
        text: res.data_music.title
      })
    }) 
  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ 𝙀𝙧𝙧𝙤𝙧 𝙝𝙤𝙮𝙚𝙘𝙝𝙚, 𝙖𝙗𝙖𝙧 𝙘𝙝𝙚𝙨𝙩𝙖 𝙠𝙤𝙧𝙪𝙣", event.threadID);
  }
};

module.exports.handleReply = async function ({ args, event, Users, Currencies, api, handleReply }) {
  const fs = require("fs-extra");
  const request = require("request");
  
  let { author, video, mp3, title, authorvd, text, messageID } = handleReply;
  
  if (event.senderID != author) {
    return api.sendMessage("𝙍𝙖𝙨𝙝 ?", event.threadID, event.messageID);
  } 
  
  switch(handleReply.type) {
    case "reply": {
      switch(event.body) {
        case "1": {
          var callback = () => api.sendMessage({
            body: `𝙑𝙞𝙙𝙚𝙤 : ${authorvd}\n𝙏𝙖𝙞𝙩𝙡 : ${title}\n`,
            attachment: fs.createReadStream(__dirname + "/cache/toptop.mp4")
          }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/toptop.mp4"), event.messageID);
          
          return request(encodeURI(`${video}`))
            .pipe(fs.createWriteStream(__dirname + '/cache/toptop.mp4'))
            .on('close', () => callback());
        }
        case "2": {
          var callback = () => api.sendMessage({
            body: `𝙂𝙖𝙣 : ${text}`,
            attachment: fs.createReadStream(__dirname + "/cache/toptop.m4a")
          }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/toptop.m4a"), event.messageID);
          
          return request(encodeURI(`${mp3}`))
            .pipe(fs.createWriteStream(__dirname + '/cache/toptop.m4a'))
            .on('close', () => callback());
        }
      }
    }
  }
};
