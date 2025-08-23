module.exports.config = {
  name: "allbox",
  version: "1.0.0",
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  hasPermssion: 2,
  description: "𝑩𝒐𝒕 𝒋𝒐𝒊𝒏 𝒌𝒐𝒓𝒂 𝒈𝒓𝒐𝒖𝒑 𝒈𝒖𝒍𝒐𝒓 𝒍𝒊𝒔𝒕 [𝑫𝒂𝒕𝒂] - 𝑩𝒂𝒏/𝑼𝒏𝒃𝒂𝒏/𝑫𝒆𝒍/𝑹𝒆𝒎𝒐𝒗𝒆 𝒆𝒓 𝒌𝒂𝒋 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒆𝒏",
  category: "Admin",
  usages: "[page number/all]",
  cooldowns: 5
};

module.exports.handleReply = async function ({ api, event, args, Threads, handleReply }) {
  const { threadID, messageID, senderID } = event;
  if (parseInt(senderID) !== parseInt(handleReply.author)) return;
  
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Dhaka").format("HH:mm:ss L");
  const [action, index] = event.body.split(" ");
  const actionType = action.toLowerCase();
  
  const idgr = handleReply.groupid[index - 1];
  const groupName = handleReply.groupName[index - 1];

  if (!idgr || !groupName) {
    return api.sendMessage("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒔𝒆𝒍𝒆𝒄𝒕𝒊𝒐𝒏!", threadID, messageID);
  }

  switch (actionType) {
    case "ban":
      {
        const data = (await Threads.getData(idgr)).data || {};
        data.banned = 1;
        data.dateAdded = time;
        await Threads.setData(idgr, { data });
        global.data.threadBanned.set(idgr, { dateAdded: data.dateAdded });
        
        await api.sendMessage(`» 𝑨𝒔𝒊𝒇 𝑴𝒂𝒎𝒖𝒅 𝒆𝒓 𝒕𝒐𝒓𝒐𝒇 𝒕𝒉𝒆𝒌𝒆 𝒏𝒐𝒕𝒊𝒄𝒆 «\n\n❌ 𝑬𝒊 𝒈𝒓𝒐𝒖𝒑 𝒕𝒂𝒌𝒆 𝒃𝒐𝒕 𝒖𝒔𝒆 𝒌𝒐𝒓𝒕𝒆 𝒃𝒂𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐`, idgr);
        await api.sendMessage(`★★ 𝑩𝒂𝒏 𝑺𝒖𝒄𝒄𝒆𝒔𝒔 ★★\n\n🔷 ${groupName} \n🔰 𝑻𝑰𝑫: ${idgr}`, threadID);
        return api.unsendMessage(handleReply.messageID);
      }

    case "unban":
    case "ub":
      {
        const data = (await Threads.getData(idgr)).data || {};
        data.banned = 0;
        data.dateAdded = null;
        await Threads.setData(idgr, { data });
        global.data.threadBanned.delete(idgr);
        
        await api.sendMessage(`» 𝑨𝒔𝒊𝒇 𝑴𝒂𝒎𝒖𝒅 𝒆𝒓 𝒕𝒐𝒓𝒐𝒇 𝒕𝒉𝒆𝒌𝒆 𝒏𝒐𝒕𝒊𝒄𝒆 «\n\n✅ 𝑬𝒊 𝒈𝒓𝒐𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒂𝒏 𝒓𝒆𝒎𝒐𝒗𝒆 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐`, idgr);
        await api.sendMessage(`★★ 𝑼𝒏𝒃𝒂𝒏 𝑺𝒖𝒄𝒄𝒆𝒔𝒔 ★★\n\n🔷 ${groupName} \n🔰 𝑻𝑰𝑫: ${idgr}`, threadID);
        return api.unsendMessage(handleReply.messageID);
      }

    case "del":
      {
        await Threads.delData(idgr);
        api.sendMessage(`★★ 𝑫𝒆𝒍𝒆𝒕𝒆 𝑺𝒖𝒄𝒄𝒆𝒔𝒔 ★★\n\n🔷 ${groupName} \n🔰 𝑻𝑰𝑫: ${idgr}\n✅ 𝑫𝒂𝒕𝒂 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒅𝒆𝒍𝒆𝒕𝒆𝒅!`, threadID);
        return api.unsendMessage(handleReply.messageID);
      }

    case "out":
      {
        await api.sendMessage(`» 𝑨𝒔𝒊𝒇 𝑴𝒂𝒎𝒖𝒅 𝒆𝒓 𝒕𝒐𝒓𝒐𝒇 𝒕𝒉𝒆𝒌𝒆 𝒏𝒐𝒕𝒊𝒄𝒆 «\n\n⚠️ 𝑪𝒉𝒂𝒕 𝒈𝒓𝒐𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒅𝒆𝒍𝒆𝒕𝒆 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐`, idgr);
        await api.removeUserFromGroup(api.getCurrentUserID(), idgr);
        api.sendMessage(`★★ 𝑶𝒖𝒕 𝑺𝒖𝒄𝒄𝒆𝒔𝒔 ★★\n\n🔷 ${groupName} \n🔰 𝑻𝑰𝑫: ${idgr}`, threadID);
        return api.unsendMessage(handleReply.messageID);
      }
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  
  switch (args[0]) {
    case "all":
      {
        let threadList;
        try {
          threadList = await api.getThreadList(100, null, ["INBOX"]);
        } catch (e) {
          return api.sendMessage("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒇𝒆𝒕𝒄𝒉 𝒕𝒉𝒓𝒆𝒂𝒅 𝒍𝒊𝒔𝒕!", threadID, messageID);
        }

        const groups = threadList
          .filter(t => t.isGroup)
          .sort((a, b) => b.messageCount - a.messageCount);

        if (groups.length === 0) {
          return api.sendMessage("❌ 𝑵𝒐 𝒈𝒓𝒐𝒖𝒑𝒔 𝒇𝒐𝒖𝒏𝒅!", threadID, messageID);
        }

        const page = parseInt(args[1]) || 1;
        const limit = 100;
        const totalPages = Math.ceil(groups.length / limit);
        const startIdx = limit * (page - 1);
        const pageGroups = groups.slice(startIdx, startIdx + limit);

        let msg = "🎭 𝑮𝒓𝒐𝒖𝒑 𝑳𝒊𝒔𝒕 [𝑫𝒂𝒕𝒂] 🎭\n\n";
        const groupIds = [];
        const groupNames = [];

        pageGroups.forEach((group, i) => {
          const num = startIdx + i + 1;
          msg += `${num}. ${group.name}\n🔰 𝑻𝑰𝑫: ${group.threadID}\n💌 𝑴𝒔𝒈 𝑪𝒐𝒖𝒏𝒕: ${group.messageCount}\n\n`;
          groupIds.push(group.threadID);
          groupNames.push(group.name);
        });

        msg += `📄 𝑷𝒂𝒈𝒆 ${page}/${totalPages}\n` +
               `🔹 𝑼𝒔𝒆: ${global.config.PREFIX}allbox all <𝒑𝒂𝒈𝒆>\n\n` +
               "𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉:\n" +
               "• 𝑩𝒂𝒏 <𝒏𝒖𝒎𝒃𝒆𝒓> - 𝑩𝒂𝒏 𝒈𝒓𝒐𝒖𝒑\n" +
               "• 𝑼𝒃 <𝒏𝒖𝒎𝒃𝒆𝒓> - 𝑼𝒏𝒃𝒂𝒏 𝒈𝒓𝒐𝒖𝒑\n" +
               "• 𝑫𝒆𝒍 <𝒏𝒖𝒎𝒃𝒆𝒓> - 𝑫𝒆𝒍𝒆𝒕𝒆 𝒅𝒂𝒕𝒂\n" +
               "• 𝑶𝒖𝒕 <𝒏𝒖𝒎𝒃𝒆𝒓> - 𝑳𝒆𝒂𝒗𝒆 𝒈𝒓𝒐𝒖𝒑";

        return api.sendMessage(msg, threadID, (err, info) => {
          if (!err) {
            global.client.handleReply.push({
              name: this.config.name,
              author: event.senderID,
              messageID: info.messageID,
              groupid: groupIds,
              groupName: groupNames,
              type: 'reply'
            });
          }
        });
      }

    default:
      const allThreads = Array.from(global.data.allThreadID || []);
      if (allThreads.length === 0) {
        return api.sendMessage("❌ 𝑵𝒐 𝒈𝒓𝒐𝒖𝒑𝒔 𝒇𝒐𝒖𝒏𝒅!", threadID, messageID);
      }

      let listMsg = `🍄 𝑻𝒐𝒕𝒂𝒍 𝒈𝒓𝒐𝒖𝒑𝒔: ${allThreads.length}\n\n`;
      for (const [i, tid] of allThreads.entries()) {
        const name = (await global.data.threadInfo.get(tid))?.threadName || "𝑵𝒂𝒎𝒆 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅";
        listMsg += `${i+1}. ${name}\n🔰 𝑻𝑰𝑫: ${tid}\n\n`;
      }
      
      return api.sendMessage(listMsg, threadID, messageID);
  }
};
