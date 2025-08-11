module.exports.config = {
  name: "top",
  version: "0.0.5",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑺𝒆𝒓𝒗𝒆𝒓 𝒆𝒓 𝒕𝒐𝒑 𝒄𝒉𝒂𝒓𝒕!",
  commandCategory: "𝒈𝒓𝒐𝒖𝒑",
  usages: "[𝒕𝒉𝒓𝒆𝒂𝒅/𝒖𝒔𝒆𝒓/𝒎𝒐𝒏𝒆𝒚/𝒍𝒆𝒗𝒆𝒍]",
  cooldowns: 5
};

module.exports.run = async ({ event, api, args, Currencies, Users }) => {
    const { threadID, messageID } = event;

  ///////////////////////////////////////////
  //===== 𝒍𝒊𝒔𝒕 𝒆𝒓 𝒅𝒐𝒊𝒓𝒈𝒉𝒐 𝒆𝒌𝒕𝒊 𝒔𝒐𝒏𝒌𝒉𝒂 𝒉𝒐𝒕𝒆 𝒉𝒐𝒃𝒆 =====//
  if (args[1] && isNaN(args[1]) || parseInt(args[1]) <= 0) return api.sendMessage("𝑳𝒊𝒔𝒕 𝒆𝒓 𝒅𝒐𝒊𝒓𝒈𝒉𝒐 𝒆𝒌𝒕𝒊 𝒔𝒐𝒏𝒌𝒉𝒂 𝒉𝒐𝒕𝒆 𝒉𝒐𝒃𝒆 𝒂𝒓 𝒕𝒂 0 𝒕𝒉𝒆𝒌𝒆 𝒃𝒆𝒔𝒊 𝒉𝒐𝒕𝒆 𝒉𝒐𝒃𝒆", event.threadID, event.messageID);
  var option = parseInt(args[1] || 10);
  var data, msg = "";

  ///////////////////////////////////////
  //===== 𝒌𝒊𝒔 𝒄𝒉𝒊𝒛 𝒆𝒓 𝒕𝒐𝒑 𝒅𝒆𝒌𝒉𝒂𝒃𝒆 =====//
  var fs = require("fs-extra");
  var request = require("request");
  
  // 𝒆𝒙𝒑 𝒕𝒐 𝒍𝒆𝒗𝒆𝒍 𝒄𝒐𝒏𝒗𝒆𝒓𝒔𝒊𝒐𝒏
  function expToLevel(point) {
    if (point < 0) return 0;
    return Math.floor((Math.sqrt(1 + (4 * point) / 3) + 1) / 2);
  }

  // 𝒍𝒆𝒗𝒆𝒍 𝒕𝒐𝒑
  if (args[0] == "user" || args[0] == "level") { 
    let all = await Currencies.getAll(['userID', 'exp']);
    all.sort((a, b) => b.exp - a.exp);
    let num = 0;
    let topMsg = {
      body: '𝑺𝒂𝒓𝒃𝒆𝒓 𝒆𝒓 𝒔𝒃𝒐𝒄𝒄𝒉𝒂 𝒖𝒄𝒄𝒉 𝒍𝒆𝒗𝒆𝒍𝒆𝒓 10 𝒋𝒂𝒏:',
    }
    for (var i = 0; i < 10; i++) {
      try {
        let level = expToLevel(all[i].exp);
        var userInfo = await Users.getData(all[i].userID);
        var name = userInfo.name || "𝑨𝒏𝒐𝒏𝒚𝒎𝒐𝒖𝒔";
        num += 1;
        topMsg.body += '\n' + num + '. ' + name + ' - 𝒍𝒆𝒗𝒆𝒍 ' + level;
      } catch (error) {
        console.error("𝑼𝒔𝒆𝒓 𝒊𝒏𝒇𝒐 𝒑𝒂𝒐𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂: ", error);
      }
    }
    api.sendMessage(topMsg, event.threadID, event.messageID);
  }

  // 𝒈𝒓𝒐𝒖𝒑 𝒕𝒐𝒑
  else if (args[0] == "thread") {
    var threadList = [];
    
    //////////////////////////////////////////////
    //===== 𝒔𝒐𝒃 𝒈𝒓𝒐𝒖𝒑 𝒂𝒃𝒐𝒏𝒈 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒔𝒂𝒏𝒌𝒉𝒚𝒂 =====//
    try {
      data = await api.getThreadList(option + 10, null, ["INBOX"]);
    } catch (e) {
      console.log(e);
      return api.sendMessage("𝑮𝒓𝒐𝒖𝒑 𝒍𝒊𝒔𝒕 𝒑𝒂𝒐𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂", threadID, messageID);
    }

    for (const thread of data) {
      if (thread.isGroup == true) {
        threadList.push({ 
          threadName: thread.name, 
          threadID: thread.threadID, 
          messageCount: thread.messageCount 
        });
      }
    }
    
    /////////////////////////////////////////////////////
    //===== 𝒔𝒃𝒐𝒄𝒄𝒉𝒂 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒘𝒂𝒍𝒂 𝒈𝒓𝒐𝒖𝒑 𝒔𝒂𝒋𝒂𝒐 =====//
    threadList.sort((a, b) => b.messageCount - a.messageCount);

    ///////////////////////////////////////////////////////////////
    //===== 𝒓𝒆𝒔𝒖𝒍𝒕 𝒔𝒂𝒋𝒂𝒏𝒐 =====//
    var i = 0;
    msg = "𝑺𝒂𝒓𝒃𝒐𝒄𝒄𝒉𝒂 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒔𝒐𝒎𝒖𝒅𝒓𝒊 𝒕𝒐𝒑 " + threadList.length + " 𝒈𝒓𝒐𝒖𝒑:\n";
    for(const dataThread of threadList) {
      if (i == option) break;
      msg += `\n${i+1}. ${dataThread.threadName || "𝑵𝒂𝒎 𝒏𝒆𝒊"}\n𝑻𝒉𝒓𝒆𝒂𝒅 𝑰𝑫: ${dataThread.threadID}\n𝑴𝒆𝒔𝒔𝒂𝒈𝒆𝒓 𝒔𝒂𝒏𝒌𝒉𝒚𝒂: ${dataThread.messageCount}\n`;
      i += 1;
    }
    
    return api.sendMessage(msg, threadID, messageID);
  }
  
  // 𝒎𝒐𝒏𝒆𝒚 𝒕𝒐𝒑
  else if (args[0] == "money") { 
    let all = await Currencies.getAll(['userID', 'money']);
    all.sort((a, b) => b.money - a.money);
    let num = 0;
    let topMsg = {
      body: '𝑺𝒂𝒓𝒃𝒆𝒓 𝒆𝒓 𝒔𝒃𝒐𝒄𝒄𝒉𝒂 𝒅𝒉𝒂𝒏𝒊 10 𝒋𝒂𝒏:',
    }
    for (var i = 0; i < 10; i++) {
      try {
        let money = all[i].money;
        var userInfo = await Users.getData(all[i].userID);
        var name = userInfo.name || "𝑨𝒏𝒐𝒏𝒚𝒎𝒐𝒖𝒔";
        num += 1;
        topMsg.body += '\n' + num + '. ' + name + ': ' + money + " 💵";
      } catch (error) {
        console.error("𝑼𝒔𝒆𝒓 𝒊𝒏𝒇𝒐 𝒑𝒂𝒐𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂: ", error);
      }
    }
    api.sendMessage(topMsg, event.threadID, event.messageID);
  }

  // 𝒆𝒓𝒓𝒐𝒓 𝒉𝒂𝒏𝒅𝒍𝒊𝒏𝒈
  else {
    return api.sendMessage(
      "𝑼𝒔𝒂𝒈𝒆: 𝒕𝒐𝒑 [𝒕𝒉𝒓𝒆𝒂𝒅/𝒖𝒔𝒆𝒓/𝒎𝒐𝒏𝒆𝒚/𝒍𝒆𝒗𝒆𝒍]\n\n" +
      "𝑬𝒙𝒂𝒎𝒑𝒍𝒆:\n" +
      "𝒕𝒐𝒑 𝒕𝒉𝒓𝒆𝒂𝒅 5\n" +
      "𝒕𝒐𝒑 𝒎𝒐𝒏𝒆𝒚\n" +
      "𝒕𝒐𝒑 𝒖𝒔𝒆𝒓",
      threadID,
      messageID
    );
  }
};
