module.exports.config = {
  name: "minionlanguage",
  version: "1.0.1", 
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🍌 𝒎𝒊𝒏𝒊𝒐𝒏𝒆𝒓 𝒃𝒉𝒂𝒔𝒉𝒂𝒚 𝒌𝒐𝒕𝒉𝒂 𝒃𝒐𝒍𝒐!",
  commandCategory: "🎮 Fun",
  usages: "[text]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "request": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  const { createReadStream, unlinkSync } = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  
  try {
    const minionImages = [
      "https://i.imgur.com/IIv809H.jpeg"
    ];
    
    const randomImage = minionImages[Math.floor(Math.random() * minionImages.length)];
    
    const callback = () => api.sendMessage({
      body: `🍌 𝒎𝒖𝒂𝒌 𝒎𝒖𝒂𝒌 𝒎𝒖𝒂𝒌... 😘\n\n"𝑴𝒊𝒏𝒊𝒐𝒏 𝑳𝒂𝒏𝒈𝒖𝒂𝒈𝒆 𝑨𝒄𝒕𝒊𝒗𝒂𝒕𝒆𝒅!"`,
      attachment: createReadStream(__dirname + "/cache/minion.jpg")
    }, event.threadID, () => unlinkSync(__dirname + "/cache/minion.jpg"));
    
    request(encodeURI(randomImage))
      .pipe(createWriteStream(__dirname + "/cache/minion.jpg"))
      .on("close", callback);
    
  } catch (error) {
    api.sendMessage(`❌ 𝑬𝒓𝒓𝒐𝒓 𝒊𝒏 𝑴𝒊𝒏𝒊𝒐𝒏 𝑳𝒂𝒏𝒈𝒖𝒂𝒈𝒆:\n${error.message}`, event.threadID);
  }
};
