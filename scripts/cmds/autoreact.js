module.exports.config = {
  name: "autoreact",
  version: "1.1.1",
  hasPermission: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑩𝒐𝒕 𝒂𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄 𝒓𝒆𝒂𝒄𝒕𝒊𝒐𝒏",
  commandCategory: "𝑵𝒐 𝑷𝒓𝒆𝒇𝒊𝒙",
  usages: '[]',
  cooldowns: 0,
};

const fs = require("fs");

module.exports.handleEvent = function({ api, event }) {
  var { threadID, messageID } = event;
  let react = event.body.toLowerCase();
  
  // 𝑺𝒐𝒖𝒍 𝒓𝒆𝒂𝒄𝒕𝒊𝒐𝒏
  if(react.includes("atma") || react.includes("roh")) {
    api.sendMessage({body: ""}, threadID, messageID);
    api.setMessageReaction("🖤", event.messageID, (err) => {}, true);
  };

  // 𝑳𝒐𝒗𝒆/𝑨𝒇𝒇𝒆𝒄𝒕𝒊𝒐𝒏 𝒓𝒆𝒂𝒄𝒕𝒊𝒐𝒏
  if(react.includes("bhalobasha") || react.includes("prem") || react.includes("maya") || 
     react.includes("ador") || react.includes("kiss") || react.includes("chumma") || 
     react.includes("shona") || react.includes("jaan") || react.includes("priyo")) {
    api.sendMessage({body: ""}, threadID, messageID);
    api.setMessageReaction("❤️", event.messageID, (err) => {}, true);
  };

  // 𝑺𝒂𝒅𝒏𝒆𝒔𝒔 𝒓𝒆𝒂𝒄𝒕𝒊𝒐𝒏
  if(react.includes("dukkho") || react.includes("kanna") || react.includes("kando") || 
     react.includes("ashru") || react.includes("mon kharap") || react.includes("bedona")) {
    api.sendMessage({body: ""}, threadID, messageID);
    api.setMessageReaction("😢", event.messageID, (err) => {}, true);
  };

  // 𝑩𝒂𝒏𝒈𝒍𝒂𝒅𝒆𝒔𝒉 𝒓𝒆𝒂𝒄𝒕𝒊𝒐𝒏 (replaced India)
  if(react.includes("bangladesh") || react.includes("bd") || react.includes("sonar bangla") || 
     react.includes("desh")) {
    api.sendMessage({body: ""}, threadID, messageID);
    api.setMessageReaction("🇧🇩", event.messageID, (err) => {}, true);
  };

  // 𝑮𝒓𝒆𝒆𝒕𝒊𝒏𝒈𝒔/𝑻𝒊𝒎𝒆 𝒓𝒆𝒂𝒄𝒕𝒊𝒐𝒏
  if(react.includes("shokal") || react.includes("bikal") || react.includes("sha") || 
     react.includes("rat") || react.includes("khabar") || react.includes("ghum")) {
    api.sendMessage({body: ""}, threadID, messageID);
    api.setMessageReaction("❤", event.messageID, (err) => {}, true);
  };

  // 𝑺𝒖𝒓𝒑𝒓𝒊𝒔𝒆 𝒓𝒆𝒂𝒄𝒕𝒊𝒐𝒏
  if(react.includes("wah") || react.includes("oshadharon") || react.includes("roboter")) {
    api.sendMessage({body: ""}, threadID, messageID);
    api.setMessageReaction("😮", event.messageID, (err) => {}, true);
  }
};

module.exports.run = function() {};
