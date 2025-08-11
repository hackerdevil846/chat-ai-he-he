module.exports.config = {
    name: "hololive",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑯𝒐𝒍𝒐𝒍𝒊𝒗𝒆 𝑽𝑻𝒖𝒃𝒆𝒓 𝑷𝒉𝒐𝒕𝒐 𝑮𝒂𝒍𝒍𝒆𝒓𝒚",
    commandCategory: "𝑽𝑻𝒖𝒃𝒆𝒓",
    usages: "[𝒓𝒖𝒔𝒉𝒊𝒂/𝒑𝒆𝒌𝒐𝒓𝒂/𝒄𝒐𝒄𝒐/𝒈𝒖𝒓𝒂/𝒎𝒂𝒓𝒊𝒏𝒆]",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const axios = require('axios');
  const request = require('request');
  const fs = require("fs");
  const { threadID, messageID } = event;
  
  let type;
  switch(args[0]?.toLowerCase()) {
    case "rushia":
      type = "rushia";
      break;
    case "pekora":
    case "peko":
      type = "pekora";
      break;
    case "coco": 
      type = "coco";
      break;
    case "gura":
    case "gawr":
      type = "gura";
      break;
    case "marine":
    case "marin":
      type = "marine";
      break;
    default:
      const tags = "𝑻𝒂𝒈𝒔: 𝒓𝒖𝒔𝒉𝒊𝒂, 𝒈𝒖𝒓𝒂, 𝒄𝒐𝒄𝒐, 𝒎𝒂𝒓𝒊𝒏𝒆, 𝒑𝒆𝒌𝒐𝒓𝒂";
      return api.sendMessage(`===== 𝑯𝒐𝒍𝒐𝒍𝒊𝒗𝒆 𝑽𝑻𝒖𝒃𝒆𝒓𝒔 =====\n${tags}`, threadID, messageID);
  }

  try {
    const res = await axios.get(`https://api.randvtuber-saikidesu.ml?character=${type}`);
    const ext = res.data.url.substring(res.data.url.lastIndexOf(".") + 1);
    const path = __dirname + `/cache/${type}_${Date.now()}.${ext}`;
    
    const callback = () => {
      api.sendMessage({
        body: `🌸 𝑵𝒂𝒎𝒆: ${res.data.name}\n📂 𝑨𝒗𝒂𝒊𝒍𝒂𝒃𝒍𝒆: ${res.data.count}\n👤 𝑨𝒖𝒕𝒉𝒐𝒓: ${res.data.author}`,
        attachment: fs.createReadStream(path)
      }, threadID, () => fs.unlinkSync(path), messageID);
      api.setMessageReaction("✅", messageID, (err) => {}, true);
    };

    request(res.data.url)
      .pipe(fs.createWriteStream(path))
      .on("close", callback);
  } 
  catch (err) {
    api.sendMessage("𝑷𝒓𝒐𝒃𝒍𝒆𝒎 𝒉𝒐𝒄𝒄𝒉𝒆 𝒑𝒉𝒐𝒕𝒐 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒆 𝒌𝒐𝒓𝒕𝒆, 𝒂𝒃𝒂𝒓 𝒄𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏! 😢", threadID, messageID);
    api.setMessageReaction("☹️", messageID, (err) => {}, true);
  }
}
