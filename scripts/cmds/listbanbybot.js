module.exports.config = {
  name: "ban",
  version: "1.0.3",
  hasPermssion: 2,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑩𝒂𝒏/𝑼𝒏𝒃𝒂𝒏 𝒎𝒐𝒅𝒖𝒍𝒆 𝒇𝒐𝒓 𝒂𝒅𝒎𝒊𝒏𝒔",
  commandCategory: "𝑨𝒅𝒎𝒊𝒏",
  usages: "[𝒕𝒉𝒓𝒆𝒂𝒅/𝒖𝒔𝒆𝒓]",
  cooldowns: 5
};

module.exports.run = async function ({ event, api, Users, args, Threads }) {
  const { threadID, messageID } = event;
  let listBanned = [];
  let i = 1;
  
  switch (args[0]) {
    case "thread":
    case "t":
    case "-t": {
      const threadBanned = Array.from(global.data.threadBanned.keys());
      
      for (const singleThread of threadBanned) {
        const dataThread = await Threads.getData(singleThread);
        const threadInfo = dataThread.threadInfo || {};
        const nameT = threadInfo.threadName || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑮𝒓𝒐𝒖𝒑";
        listBanned.push(`${i++}. ${nameT}\n🍂 𝑻𝑰𝑫: ${singleThread}`);
      }

      if (listBanned.length === 0) {
        return api.sendMessage("𝑪𝒖𝒓𝒓𝒆𝒏𝒕𝒍𝒚 𝒏𝒐 𝒃𝒂𝒏𝒏𝒆𝒅 𝒈𝒓𝒐𝒖𝒑𝒔! ✅", threadID, messageID);
      }

      return api.sendMessage(
        `📋 𝑪𝒖𝒓𝒓𝒆𝒏𝒕𝒍𝒚 ${listBanned.length} 𝒃𝒂𝒏𝒏𝒆𝒅 𝒈𝒓𝒐𝒖𝒑𝒔:\n\n${listBanned.join("\n")}\n\n𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒐𝒓𝒅𝒆𝒓 𝒏𝒖𝒎𝒃𝒆𝒓 𝒕𝒐 𝒖𝒏𝒃𝒂𝒏`,
        threadID,
        (error, info) => {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: 'unbanthread',
            listBanned
          });
        },
        messageID
      );
    }

    case "user":
    case "u":
    case "-u": {
      const userBanned = Array.from(global.data.userBanned.keys());
      
      for (const singleUser of userBanned) {
        const name = global.data.userName.get(singleUser) || await Users.getNameUser(singleUser) || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑼𝒔𝒆𝒓";
        listBanned.push(`${i++}. ${name}\n🍁 𝑰𝑫: ${singleUser}`);
      }

      if (listBanned.length === 0) {
        return api.sendMessage("𝑪𝒖𝒓𝒓𝒆𝒏𝒕𝒍𝒚 𝒏𝒐 𝒃𝒂𝒏𝒏𝒆𝒅 𝒖𝒔𝒆𝒓𝒔! ✅", threadID, messageID);
      }

      return api.sendMessage(
        `📋 𝑪𝒖𝒓𝒓𝒆𝒏𝒕𝒍𝒚 ${listBanned.length} 𝒃𝒂𝒏𝒏𝒆𝒅 𝒖𝒔𝒆𝒓𝒔:\n\n${listBanned.join("\n")}\n\n𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒐𝒓𝒅𝒆𝒓 𝒏𝒖𝒎𝒃𝒆𝒓 𝒕𝒐 𝒖𝒏𝒃𝒂𝒏`,
        threadID,
        (error, info) => {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: 'unbanuser',
            listBanned
          });
        },
        messageID
      );
    }

    default: {
      const helpMessage = `» 𝑩𝒂𝒏 𝑴𝒐𝒅𝒖𝒍𝒆 «\n━━━━━━━━━━━━━━━━━━\n🔹 𝑼𝒔𝒂𝒈𝒆: ${global.config.PREFIX}𝒃𝒂𝒏 [𝒐𝒑𝒕𝒊𝒐𝒏]\n\n🔸 𝑶𝒑𝒕𝒊𝒐𝒏𝒔:\n  • 𝒕𝒉𝒓𝒆𝒂𝒅 - 𝑺𝒉𝒐𝒘 𝒃𝒂𝒏𝒏𝒆𝒅 𝒈𝒓𝒐𝒖𝒑𝒔\n  • 𝒖𝒔𝒆𝒓 - 𝑺𝒉𝒐𝒘 𝒃𝒂𝒏𝒏𝒆𝒅 𝒖𝒔𝒆𝒓𝒔`;
      return api.sendMessage(helpMessage, threadID, messageID);
    }
  }
};

module.exports.handleReply = async function({ api, event, handleReply, Users, Threads }) {
  const { threadID, messageID, senderID, body } = event;
  
  // Validate authorization
  if (parseInt(senderID) !== parseInt(handleReply.author)) {
    return api.sendMessage("𝑶𝒏𝒍𝒚 𝒕𝒉𝒆 𝒊𝒏𝒊𝒕𝒊𝒂𝒕𝒐𝒓 𝒄𝒂𝒏 𝒖𝒔𝒆 𝒕𝒉𝒊𝒔 𝒄𝒐𝒎𝒎𝒂𝒏𝒅! ⚠️", threadID, messageID);
  }

  const orderNumber = parseInt(body.trim());
  if (isNaN(orderNumber) || orderNumber < 1 || orderNumber > handleReply.listBanned.length) {
    return api.sendMessage("𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒐𝒓𝒅𝒆𝒓 𝒏𝒖𝒎𝒃𝒆𝒓! ⚠️", threadID, messageID);
  }

  const selectedItem = handleReply.listBanned[orderNumber - 1];
  const idRegex = /(?:TID|ID): (\d+)/;
  const idMatch = selectedItem.match(idRegex);
  
  if (!idMatch) {
    return api.sendMessage("𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒆𝒙𝒕𝒓𝒂𝒄𝒕 𝑰𝑫! ⚠️", threadID, messageID);
  }

  const targetID = idMatch[1];
  const userName = await Users.getNameUser(senderID);
  let targetName = "𝑼𝒏𝒌𝒏𝒐𝒘𝒏";

  try {
    switch (handleReply.type) {
      case "unbanthread": {
        const threadInfo = await Threads.getInfo(targetID);
        targetName = threadInfo.threadName || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑮𝒓𝒐𝒖𝒑";
        
        const threadData = (await Threads.getData(targetID)).data || {};
        threadData.banned = false;
        threadData.reason = null;
        threadData.dateAdded = null;
        
        await Threads.setData(targetID, { data: threadData });
        global.data.threadBanned.delete(targetID);
        
        api.sendMessage(
          `» 𝑵𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏 «\n━━━━━━━━━━━━━━━━━━\n${userName} 𝒖𝒏𝒃𝒂𝒏𝒏𝒆𝒅 𝒚𝒐𝒖 𝒇𝒓𝒐𝒎 𝒂𝒅𝒎𝒊𝒏\n\n- 𝑻𝒉𝒆 𝒈𝒓𝒐𝒖𝒑 '${targetName}' 𝒉𝒂𝒔 𝒃𝒆𝒆𝒏 𝒖𝒏𝒃𝒂𝒏𝒏𝒆𝒅`,
          targetID
        );
        
        return api.sendMessage(
          `» 𝑺𝒖𝒄𝒄𝒆𝒔𝒔 «\n━━━━━━━━━━━━━━━━━━\n${userName} 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒖𝒏𝒃𝒂𝒏𝒏𝒆𝒅 𝒈𝒓𝒐𝒖𝒑: ${targetName}`,
          threadID
        );
      }
      
      case "unbanuser": {
        targetName = await Users.getNameUser(targetID) || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑼𝒔𝒆𝒓";
        
        const userData = (await Users.getData(targetID)).data || {};
        userData.banned = false;
        userData.reason = null;
        userData.dateAdded = null;
        
        await Users.setData(targetID, { data: userData });
        global.data.userBanned.delete(targetID);
        
        api.sendMessage(
          `» 𝑵𝒐𝒕𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏 «\n━━━━━━━━━━━━━━━━━━\n${userName} 𝒖𝒏𝒃𝒂𝒏𝒏𝒆𝒅 𝒚𝒐𝒖 𝒇𝒓𝒐𝒎 𝒂𝒅𝒎𝒊𝒏\n\n- 𝒀𝒐𝒖'𝒗𝒆 𝒃𝒆𝒆𝒏 𝒖𝒏𝒃𝒂𝒏𝒏𝒆𝒅 𝒇𝒓𝒐𝒎 𝒕𝒉𝒆 𝒃𝒐𝒕`,
          targetID
        );
        
        return api.sendMessage(
          `» 𝑺𝒖𝒄𝒄𝒆𝒔𝒔 «\n━━━━━━━━━━━━━━━━━━\n${userName} 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒖𝒏𝒃𝒂𝒏𝒏𝒆𝒅 𝒖𝒔𝒆𝒓: ${targetName}`,
          threadID
        );
      }
    }
  } catch (error) {
    console.error(error);
    return api.sendMessage("𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈! ⚠️", threadID, messageID);
  }
};
