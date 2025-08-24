const fs = require("fs");

module.exports.config = {
  name: "sus",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝒉𝒊𝒉𝒊𝒉𝒊𝒉𝒊",
  category: "𝒏𝒐 𝒑𝒓𝒆𝒇𝒊𝒙",
  usages: "𝒔𝒖𝒔",
  cooldowns: 5, 
};

module.exports.onStart = async function() {
  // খালি রাখা হলো, শুধু bot expect করার জন্য
};

module.exports.handleEvent = function({ api, event }) {
  const { threadID, messageID } = event;
  
  // List of trigger words (case-sensitive)
  const triggers = [
    "amogus", "Amogus", 
    "sus", "Sus", 
    "sussy", "Sussy",
    "ඞ"
  ];
  
  // Check if message starts with any trigger word
  if (triggers.some(trigger => event.body.indexOf(trigger) === 0)) {
    const msg = {
      body: "ඞ 𝑺𝑼𝑺𝑺𝒀 𝑩𝑨𝑲𝑨! 😱",
      attachment: fs.createReadStream(__dirname + "/noprefix/sus.mp3")
    };
    
    // Send SUS response
    api.sendMessage(msg, threadID, messageID);
    
    // Add reaction
    api.setMessageReaction("😱", event.messageID, (err) => {}, true);
  }
};

module.exports.run = function() {
  // No action needed when command is directly run
};
