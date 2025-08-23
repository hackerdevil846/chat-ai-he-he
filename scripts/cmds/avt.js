module.exports.config = {
  name: "avt",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑼𝒔𝒆𝒓 𝒆𝒓 𝒂𝒗𝒂𝒕𝒂𝒓 𝒑𝒂𝒘𝒂 𝒋𝒂𝒃𝒆",
  category: "𝒕𝒐𝒐𝒍𝒔",
  cooldowns: 0
};

module.exports.run = async function({ api, event, args, Threads }) {
const request = require("request");
const fs = require("fs")
const axios = require("axios")
const threadSetting = (await Threads.getData(String(event.threadID))).data || {};
const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
const mn = this.config.name

if (!args[0]) {
  const helpMessage = `🎭=== 𝑭𝑨𝑪𝑬𝑩𝑶𝑶𝑲 𝑨𝑽𝑻𝑨𝑹 ===🎭

🎭→ ${prefix}${mn} box - 𝒈𝒓𝒐𝒖𝒑 𝒆𝒓 𝒂𝒗𝒂𝒕𝒂𝒓 𝒑𝒂𝒘𝒂
🎭→ ${prefix}${mn} id [𝒊𝒅] - 𝒊𝒅 𝒅𝒊𝒚𝒆 𝒂𝒗𝒂𝒕𝒂𝒓 𝒑𝒂𝒘𝒂
🎭→ ${prefix}${mn} link [𝒍𝒊𝒏𝒌] - 𝒍𝒊𝒏𝒌 𝒅𝒊𝒚𝒆 𝒂𝒗𝒂𝒕𝒂𝒓 𝒑𝒂𝒘𝒂
🎭→ ${prefix}${mn} user - 𝒏𝒊𝒋𝒆𝒓 𝒂𝒗𝒂𝒕𝒂𝒓 𝒑𝒂𝒘𝒂
🎭→ ${prefix}${mn} user [@𝒎𝒆𝒏𝒕𝒊𝒐𝒏] - 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒌𝒐𝒓𝒂 𝒖𝒔𝒆𝒓 𝒆𝒓 𝒂𝒗𝒂𝒕𝒂𝒓 𝒑𝒂𝒘𝒂

𝑪𝒓𝒆𝒂𝒕𝒆𝒅 𝒃𝒚: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒎𝒖𝒅`;
  return api.sendMessage(helpMessage, event.threadID, event.messageID);
}

if (args[0] == "box") {
  try {
    let threadID = event.threadID;
    let threadName = event.threadName;
    
    if (args[1]) {
      threadID = args[1];
      const threadInfo = await api.getThreadInfo(threadID);
      threadName = threadInfo.threadName;
    } else {
      const threadInfo = await api.getThreadInfo(threadID);
      threadName = threadInfo.threadName;
    }
    
    const callback = () => api.sendMessage({
      body: `✅ 𝑮𝒓𝒐𝒖𝒑 𝒆𝒓 𝒂𝒗𝒂𝒕𝒂𝒓: ${threadName}`,
      attachment: fs.createReadStream(__dirname + "/cache/avt.png")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/avt.png"), event.messageID);
    
    const imgURL = `https://graph.facebook.com/${threadID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    return request(encodeURI(imgURL)).pipe(fs.createWriteStream(__dirname + '/cache/avt.png')).on('close', callback);
  } catch (e) {
    return api.sendMessage("❌ 𝑮𝒓𝒐𝒖𝒑 𝒂𝒗𝒂𝒕𝒂𝒓 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂", event.threadID, event.messageID);
  }
}
else if (args[0] == "id") {
  try {
    const id = args[1];
    if (!id) return api.sendMessage("❌ 𝑼𝒔𝒆𝒓 𝑰𝑫 𝒅𝒊𝒚𝒆𝒏 𝒑𝒍𝒆𝒂𝒔𝒆", event.threadID, event.messageID);
    
    const callback = () => api.sendMessage({
      body: `✅ 𝑼𝒔𝒆𝒓 𝒂𝒗𝒂𝒕𝒂𝒓: ${id}`,
      attachment: fs.createReadStream(__dirname + "/cache/avt.png")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/avt.png"), event.messageID);
    
    return request(encodeURI(`https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
      .pipe(fs.createWriteStream(__dirname + '/cache/avt.png'))
      .on('close', callback);
  } catch (e) {
    return api.sendMessage("❌ 𝑼𝒔𝒆𝒓 𝒆𝒓 𝒇𝒐𝒕𝒐 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂", event.threadID, event.messageID);
  }
}
else if (args[0] == "link") {
  try {
    const link = args[1];
    if (!link) return api.sendMessage("❌ 𝑨𝒗𝒂𝒕𝒂𝒓 𝒑𝒆𝒕𝒆 𝒍𝒊𝒏𝒌 𝒅𝒊𝒚𝒆𝒏", event.threadID, event.messageID);
    
    const tool = require("fb-tools");
    const id = await tool.findUid(link);
    
    const callback = () => api.sendMessage({
      body: `✅ 𝑼𝒔𝒆𝒓 𝒂𝒗𝒂𝒕𝒂𝒓: ${id}`,
      attachment: fs.createReadStream(__dirname + "/cache/avt.png")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/avt.png"), event.messageID);
    
    return request(encodeURI(`https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
      .pipe(fs.createWriteStream(__dirname + '/cache/avt.png'))
      .on('close', callback);
  } catch (e) {
    return api.sendMessage("❌ 𝑼𝒔𝒆𝒓 𝒌𝒉𝒖𝒋𝒆 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂", event.threadID, event.messageID);
  }
}
else if (args[0] == "user") {
  try {
    let id = event.senderID;
    let name = "𝒀𝒐𝒖𝒓";
    
    if (args[1] && event.mentions) {
      id = Object.keys(event.mentions)[0];
      name = `@${event.mentions[id].replace('@', '')}`;
    }
    
    const callback = () => api.sendMessage({
      body: `✅ ${name} 𝒆𝒓 𝒂𝒗𝒂𝒕𝒂𝒓`,
      attachment: fs.createReadStream(__dirname + "/cache/avt.png")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/avt.png"), event.messageID);
    
    return request(encodeURI(`https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
      .pipe(fs.createWriteStream(__dirname + '/cache/avt.png'))
      .on('close', callback);
  } catch (e) {
    return api.sendMessage("❌ 𝑨𝒗𝒂𝒕𝒂𝒓 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂", event.threadID, event.messageID);
  }
}
else {
  return api.sendMessage(`❌ 𝑺𝒂𝒊 𝒐𝒓𝒅𝒆𝒓. 𝑺𝒐𝒃 𝒌𝒐𝒎𝒂𝒏𝒅 𝒅𝒆𝒌𝒉𝒂𝒓 𝒋𝒐𝒏𝒏𝒐: ${prefix}${mn}`, event.threadID, event.messageID);
}
};
