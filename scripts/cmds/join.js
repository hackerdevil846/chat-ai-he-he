const chalk = require('chalk');
module.exports.config = {
    name: "join",
    version: "1.0.1",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑩𝒐𝒕 𝒋𝒆 𝒃𝒐𝒙 𝒆 𝒂𝒔𝒆 𝒋𝒐𝒊𝒏 𝒌𝒐𝒓𝒖𝒏",
    commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
    usages: "",
    cooldowns: 5
};

module.exports.onLoad = () => {
  console.log(chalk.bold.hex("#00c300").bold("============ 𝑱𝑶𝑰𝑵 𝑪𝑶𝑴𝑴𝑨𝑵𝑫 𝑺𝑼𝑪𝑪𝑬𝑺𝑺𝑭𝑼𝑳𝑳𝒀 𝑳𝑶𝑨𝑫𝑬𝑫 ============"));
}

module.exports.handleReply = async function({ api, event, handleReply, Threads }) {
  var { threadID, messageID, senderID, body } = event;
  var { ID } = handleReply;
  
  if (!body || !parseInt(body)) return api.sendMessage('𝑺𝒆𝒍𝒆𝒄𝒕𝒊𝒐𝒏 𝒆𝒌𝒕𝒂 𝒏𝒖𝒎𝒃𝒆𝒓 𝒉𝒐𝒕𝒆 𝒉𝒐𝒃𝒆!', threadID, messageID);
  
  if ((parseInt(body) - 1) > ID.length) return api.sendMessage("𝑨𝒑𝒏𝒂𝒓 𝒑𝒊𝒄𝒌 𝒍𝒊𝒔𝒕 𝒆 𝒏𝒂𝒊", threadID, messageID);
  
  try {
    var threadInfo = await Threads.getInfo(ID[body - 1]);
    var { participantIDs, approvalMode, adminIDs } = threadInfo;
    
    if (participantIDs.includes(senderID)) return api.sendMessage(`𝑨𝒑𝒏𝒊 𝒂𝒈𝒆𝒓 𝒆𝒊 𝒈𝒓𝒐𝒖𝒑 𝒆 𝒂𝒄𝒉𝒆𝒏!`, threadID, messageID);
    
    api.addUserToGroup(senderID, ID[body - 1]);
    
    if (approvalMode == true && !adminIDs.some(item => item.id) == api.getCurrentUserID()) {
      return api.sendMessage("𝑨𝒑𝒏𝒂𝒌𝒆 𝒈𝒓𝒐𝒖𝒑 𝒆𝒓 𝒂𝒑𝒑𝒓𝒐𝒗𝒂𝒍 𝒍𝒊𝒔𝒕 𝒆 𝒂𝒅𝒅 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐...", threadID, messageID);
    } else {
      return api.sendMessage(`𝑴𝒆𝒚𝒆 𝒂𝒑𝒏𝒂𝒌𝒆 \"${threadInfo.threadName}\" 𝒈𝒓𝒐𝒖𝒑 𝒆 𝒂𝒅𝒅 𝒌𝒐𝒓𝒆𝒄𝒉𝒊 💖\n𝑺𝒑𝒂𝒎 𝒃𝒐𝒙 𝒏𝒂 𝒑𝒂𝒍𝒆 𝒄𝒉𝒆𝒄𝒌 𝒌𝒐𝒓𝒖𝒏`, threadID, messageID);
    }
  } catch (error) {
    return api.sendMessage(`𝑨𝒑𝒏𝒂𝒌𝒆 𝒂𝒅𝒅 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊𝒏𝒊 😢\n\n${error}`, threadID, messageID);
  }
}

module.exports.run = async function({ api, event, Threads }) {
  var { threadID, messageID, senderID } = event;
  var msg = `📋  𝑩𝑶𝑿 𝑳𝑰𝑺𝑻  📋\n\n`, number = 0, ID = [];
  
  var allThreads = await Threads.getAll();
  for (var i of allThreads) {
    number++;
    msg += `${number}. ${i.threadInfo.threadName}\n`;
    ID.push(i.threadID)
  }
  
  msg += `\n👉 𝑨𝒑𝒏𝒊 𝒋𝒆 𝒈𝒓𝒐𝒖𝒑 𝒆 𝒋𝒐𝒊𝒏 𝒉𝒐𝒕𝒆 𝒄𝒂𝒏 𝒔𝒆𝒍𝒆𝒄𝒕𝒊𝒐𝒏 𝒆𝒓 𝒏𝒖𝒎𝒃𝒆𝒓 𝒅𝒊𝒚𝒆 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒖𝒏`
  return api.sendMessage(msg, threadID, (error, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      author: senderID,
      messageID: info.messageID,
      ID: ID      
    })
  }, messageID)
}
