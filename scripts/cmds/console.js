module.exports.config = {
    name: "console",
    version: "1.0.0",
    hasPermssion: 3,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑴𝒂𝒌𝒆 𝒕𝒉𝒆 𝒄𝒐𝒏𝒔𝒐𝒍𝒆 𝒎𝒐𝒓𝒆 𝒃𝒆𝒂𝒖𝒕𝒊𝒇𝒖𝒍",
    commandCategory: "𝑨𝒅𝒎𝒊𝒏-𝒃𝒐𝒕 𝒔𝒚𝒔𝒕𝒆𝒎",
    usages: "𝒄𝒐𝒏𝒔𝒐𝒍𝒆",
    cooldowns: 0
};

module.exports.handleEvent = async function ({ api, args, Users, event, Threads, utils, client }) {
    let { messageID, threadID, senderID, mentions } = event;
    const chalk = require('chalk');
    const moment = require("moment-timezone");
    var time = moment.tz("Asia/Dhaka").format("LLLL");   
    const thread = global.data.threadData.get(event.threadID) || {};
    if (typeof thread["console"] !== "undefined" && thread["console"] == true) return;
    if (event.senderID == global.data.botID) return;
    var nameBox = global.data.threadInfo.get(event.threadID).threadName || "𝑵𝒂𝒎𝒆 𝒅𝒐𝒆𝒔 𝒏𝒐𝒕 𝒆𝒙𝒊𝒔𝒕";
    var nameUser = await Users.getNameUser(event.senderID);
    var msg = event.body || "𝑷𝒉𝒐𝒕𝒐𝒔, 𝒗𝒊𝒅𝒆𝒐𝒔 𝒐𝒓 𝒔𝒑𝒆𝒄𝒊𝒂𝒍 𝒄𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓𝒔";
    var job = ["FF9900", "FFFF33", "33FFFF", "FF99FF", "FF3366", "FFFF66", "FF00FF", "66FF99", "00CCFF", "FF0099", "FF0066", "7900FF", "93FFD8", "CFFFDC", "FF5B00", "3B44F6", "A6D1E6", "7F5283", "A66CFF", "F05454", "FCF8E8", "94B49F", "47B5FF", "B8FFF9", "42C2FF", "FF7396"];
    var random = job[Math.floor(Math.random() * job.length)];
    var random1 = job[Math.floor(Math.random() * job.length)];
    var random2 = job[Math.floor(Math.random() * job.length)];
    var random3 = job[Math.floor(Math.random() * job.length)];
    var random4 = job[Math.floor(Math.random() * job.length)];
    var random5 = job[Math.floor(Math.random() * job.length)];
    var random6 = job[Math.floor(Math.random() * job.length)];
    
    console.log(chalk.hex("#" + random)(`[💓]→ 𝑮𝒓𝒐𝒖𝒑 𝒏𝒂𝒎𝒆: ${nameBox}`) + 
                `\n` + chalk.hex("#" + random5)(`[🔎]→ 𝑮𝒓𝒐𝒖𝒑 𝑰𝑫: ${event.threadID}`) + 
                `\n` + chalk.hex("#" + random6)(`[🔱]→ 𝑼𝒔𝒆𝒓 𝒏𝒂𝒎𝒆: ${nameUser}`) + 
                `\n` + chalk.hex("#" + random1)(`[📝]→ 𝑼𝒔𝒆𝒓 𝑰𝑫: ${event.senderID}`) + 
                `\n` + chalk.hex("#" + random2)(`[📩]→ 𝑪𝒐𝒏𝒕𝒆𝒏𝒕: ${msg}`) + 
                `\n` + chalk.hex("#" + random3)(`[ ${time} ]`) + 
                `\n` + chalk.hex("#" + random4)(`◆━━━━━━━━━◆ 𝑨𝒔𝒊𝒇 𝑩𝒐𝒕 🐧 ◆━━━━━━━━◆\n`)); 
}

module.exports.languages = {
  "vi": {
    "on": "𝑩𝒂̣̂𝒕",
    "off": "𝑻𝒂̆́𝒕",
    "successText": "𝒄𝒐𝒏𝒔𝒐𝒍𝒆 𝒕𝒉𝒂̀𝒏𝒉 𝒄𝒐̂𝒏𝒈"
  },
  "en": {
    "on": "𝒐𝒏",
    "off": "𝒐𝒇𝒇",
    "successText": "𝒄𝒐𝒏𝒔𝒐𝒍𝒆 𝒔𝒖𝒄𝒄𝒆𝒔𝒔!"
  }
}

module.exports.run = async function ({ api, event, Threads, getText }) {
  const { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data;
  if (typeof data["console"] == "undefined" || data["console"] == true) 
      data["console"] = false;
  else 
      data["console"] = true;
  
  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);
  
  const status = data["console"] == false ? getText("on") : getText("off");
  const message = `${status} ${getText("successText")}`;
  
  // Convert message to Mathematical Bold Italic
  const boldItalicMap = {
    'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋',
    'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕',
    'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
    'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱',
    'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻',
    'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁'
  };
  
  const formattedMessage = message.replace(/[a-zA-Z]/g, char => boldItalicMap[char] || char);
  
  return api.sendMessage(formattedMessage, threadID, messageID);
}
