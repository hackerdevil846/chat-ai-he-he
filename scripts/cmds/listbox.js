module.exports.config = {
  name: 'listbox',
  version: '1.0.0',
  credits: '𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅',
  hasPermssion: 2,
  description: '𝑩𝒐𝒕 𝒋𝒆 𝒈𝒓𝒐𝒖𝒑 𝒆 𝒂𝒄𝒉𝒆 𝒕𝒂𝒓 𝒍𝒊𝒔𝒕',
  category: 'system',
  usages: 'listbox',
  cooldowns: 15,
  dependencies: {}
};

module.exports.languages = {
  "en": {
    "": ""
  }
};

module.exports.handleReply = async function({ api, event, handleReply, Threads }) {
  if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;
  
  const args = event.body.split(" ");
  const command = args[0].toLowerCase();
  const groupIndex = parseInt(args[1]) - 1;
  const groupId = handleReply.groupIds[groupIndex];

  if (isNaN(groupIndex) || groupIndex < 0 || !handleReply.groupIds[groupIndex]) {
    return api.sendMessage("❌ Invalid selection!", event.threadID, event.messageID);
  }

  switch (command) {
    case "ban":
      const data = (await Threads.getData(groupId)).data || {};
      data.banned = 1;
      await Threads.setData(groupId, { data });
      global.data.threadBanned.set(parseInt(groupId), 1);
      api.sendMessage(`🔨 Successfully banned group:\n${handleReply.groupNames[groupIndex]}\n(ID: ${groupId})`, event.threadID);
      break;

    case "out":
      api.removeUserFromGroup(api.getCurrentUserID(), groupId);
      api.sendMessage(`👋 Left group successfully:\n${handleReply.groupNames[groupIndex]}\n(ID: ${groupId})`, event.threadID);
      break;

    default:
      api.sendMessage("❌ Invalid command! Use 'ban' or 'out' followed by the number.", event.threadID);
  }
};

module.exports.onStart = async function({ api, event, Threads }) {
  try {
    const inbox = await api.getThreadList(100, null, ['INBOX']);
    const list = inbox.filter(group => group.isSubscribed && group.isGroup);
    const groupList = [];

    for (const group of list) {
      const data = await Threads.getData(group.threadID);
      groupList.push({
        id: group.threadID,
        name: group.name || "Unnamed Group",
        memberCount: data.participantIDs?.length || 0
      });
    }

    const sortedList = groupList.sort((a, b) => b.memberCount - a.memberCount);
    let msg = '╔═══════════════════════╗\n';
    msg += '          🤖 𝐁𝐎𝐓 𝐆𝐑𝐎𝐔𝐏 𝐋𝐈𝐒𝐓 🤖\n';
    msg += '╚═══════════════════════╝\n\n';
    
    const groupIds = [];
    const groupNames = [];
    
    sortedList.forEach((group, index) => {
      msg += `🔸 ${index + 1}. ${group.name}\n`;
      msg += `   ├─ 📍 𝐈𝐃: ${group.id}\n`;
      msg += `   └─ 👥 𝐌𝐞𝐦𝐛𝐞𝐫𝐬: ${group.memberCount}\n\n`;
      groupIds.push(group.id);
      groupNames.push(group.name);
    });

    msg += '╔═══════════════════════╗\n';
    msg += '          📝 𝐈𝐍𝐒𝐓𝐑𝐔𝐂𝐓𝐈𝐎𝐍𝐒 \n';
    msg += '╚═══════════════════════╝\n\n';
    msg += '• To 𝐛𝐚𝐧 a group: Reply "ban [number]"\n';
    msg += '• To 𝐥𝐞𝐚𝐯𝐞 a group: Reply "out [number]"\n\n';
    msg += '📌 Example:\n';
    msg += '   ban 2 → Bans group #2\n';
    msg += '   out 3 → Leaves group #3';

    api.sendMessage(msg, event.threadID, (error, info) => {
      if (!error) {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          groupIds: groupIds,
          groupNames: groupNames
        });
      }
    });
  } catch (error) {
    console.error(error);
    api.sendMessage("❌ An error occurred while fetching group list!", event.threadID);
  }
};
