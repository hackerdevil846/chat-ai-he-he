const num = 10 // 𝙎𝙥𝙖𝙢 𝙠𝙤𝙧𝙖𝙧 𝙥𝙤𝙧𝙞𝙢𝙖𝙣 𝙮𝙚𝙩𝙚 𝙗𝙖𝙣 𝙝𝙤𝙗𝙚 -1, 𝙢𝙖𝙣𝙚 𝙙𝙚𝙠𝙝𝙚 5 𝙗𝙖𝙧 6 𝙗𝙖𝙧 𝙨𝙥𝙖𝙢 𝙠𝙤𝙧𝙡𝙚 𝙗𝙖𝙣 𝙝𝙤𝙗𝙚
const timee = 120 // 𝙔𝙚 𝙨𝙤𝙢𝙤𝙮𝙚𝙧 𝙢𝙤𝙙𝙙𝙝𝙚 `timee` 𝙗𝙖𝙧 `num` 𝙗𝙖𝙧 𝙨𝙥𝙖𝙢 𝙠𝙤𝙧𝙡𝙚 𝙗𝙖𝙣 𝙝𝙤𝙗𝙚

module.exports.config = {
  name: "spamban",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: `𝘼𝙪𝙩𝙤𝙢𝙖𝙩𝙞𝙘 𝙗𝙖𝙣 𝙪𝙨𝙚𝙧 𝙟𝙤𝙙𝙞 ${num} 𝘽𝘼𝙍/${timee} 𝙎𝙀𝘾𝙊𝙉𝘿 𝙢𝙖𝙟𝙝𝙚 𝙨𝙥𝙖𝙢 𝙠𝙤𝙧𝙚`,
  commandCategory: "𝙎𝙮𝙨𝙩𝙚𝙢",
  usages: "x",
  cooldowns: 5
};

module.exports.run = async function ({api, event})  {
  return api.sendMessage(`𝘼𝙪𝙩𝙤𝙢𝙖𝙩𝙞𝙘 𝙗𝙖𝙣 𝙪𝙨𝙚𝙧 𝙟𝙤𝙙𝙞 𝙠𝙚𝙪 ${num} 𝘽𝘼𝙍/${timee} 𝙎𝙀𝘾𝙊𝙉𝘿 𝙢𝙖𝙟𝙝𝙚 𝙨𝙥𝙖𝙢 𝙠𝙤𝙧𝙚`, event.threadID, event.messageID);
};

module.exports.handleEvent = async function ({ Users, Threads, api, event})  {
  let { senderID, messageID, threadID } = event;
  var datathread = (await Threads.getData(event.threadID)).threadInfo;
  
  if (!global.client.autoban) global.client.autoban = {};
  
  if (!global.client.autoban[senderID]) {
    global.client.autoban[senderID] = {
      timeStart: Date.now(),
      number: 0
    }
  };
  
  const threadSetting = global.data.threadData.get(threadID) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;
  if (!event.body || event.body.indexOf(prefix) != 0) return;
  
  if ((global.client.autoban[senderID].timeStart + (timee*1000)) <= Date.now()) {
    global.client.autoban[senderID] = {
      timeStart: Date.now(),
      number: 0
    }
  }
  else {
    global.client.autoban[senderID].number++;
    if (global.client.autoban[senderID].number >= num) {
      var namethread = datathread.threadName;
      const moment = require("moment-timezone");
      const timeDate = moment.tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss");
      let dataUser = await Users.getData(senderID) || {};
      let data = dataUser.data || {};
      if (data && data.banned == true) return;
      data.banned = true;
      data.reason = `𝙎𝙥𝙖𝙢 𝙗𝙤𝙩 ${num} 𝘽𝘼𝙍/${timee} 𝙎𝙀𝘾𝙊𝙉𝘿` || null;
      data.dateAdded = timeDate;
      await Users.setData(senderID, { data });
      global.data.userBanned.set(senderID, { reason: data.reason, dateAdded: data.dateAdded });
      global.client.autoban[senderID] = {
        timeStart: Date.now(),
        number: 0
      };
      api.sendMessage(
        `😻 https://www.facebook.com/profile.php?id=61571630409265\n` +
        `😻 𝑰𝑫: ${senderID}\n` +
        `😻 𝑵𝑨𝑴𝑬: ${dataUser.name}\n` +
        `😻 𝑹𝑬𝑨𝑺𝑺𝑶𝑵: ${num} 𝘽𝘼𝙍/${timee} 𝙎𝙀𝘾𝙊𝙉𝘿 𝙎𝙋𝘼𝙈\n\n` +
        `✔️ 𝘼𝘿𝙈𝙄𝙉 𝘽𝙊𝙏𝙀 𝙍𝙀𝙋𝙊𝙍𝙏 𝙃𝙊𝙇𝙊`, 
        threadID,
        () => {
          var idad = global.config.ADMINBOT;
          for(let ad of idad) {
            api.sendMessage(
              `😻 𝙎𝙋𝘼𝙈 𝙆𝙊𝙍𝘼𝙍 𝙆𝘼𝙍𝙊𝙉𝙀 𝘽𝘼𝙉\n` +
              `😻 𝑵𝑨𝑴𝑬: ${dataUser.name}\n` +
              `😻 𝑰𝑫: ${senderID}\n` +
              `😻 𝘽𝙊𝙓 𝑰𝑫: ${threadID}\n` +
              `😻 𝘽𝙊𝙓 𝙉𝘼𝙈𝙀: ${namethread}\n` +
              `😻 𝙎𝙊𝙈𝙊𝙔: ${timeDate}`, 
              ad
            );
          }
        }
      );
    }
  }
};
