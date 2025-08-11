module.exports.config = {
  name: 'listbox',
  version: '1.0.0',
  credits: '𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅',
  hasPermssion: 2,
  description: '𝑩𝒐𝒕 𝒋𝒆 𝒈𝒓𝒐𝒖𝒑 𝒆 𝒂𝒄𝒉𝒆 𝒕𝒂𝒓 𝒍𝒊𝒔𝒕',
  commandCategory: '𝑺𝒚𝒔𝒕𝒆𝒎',
  usages: 'listbox',
  cooldowns: 15
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;

  const arg = event.body.split(" ");
  const idgr = handleReply.groupid[arg[1] - 1];

  switch (handleReply.type) {
    case "reply":
      if (arg[0].toLowerCase() === "ban") {
        const data = (await Threads.getData(idgr)).data || {};
        data.banned = 1;
        await Threads.setData(idgr, { data });
        global.data.threadBanned.set(parseInt(idgr), 1);
        api.sendMessage(`[${idgr}] 𝑩𝒂𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆! ✅`, event.threadID, event.messageID);
        break;
      }

      if (arg[0].toLowerCase() === "out") {
        api.removeUserFromGroup(api.getCurrentUserID(), idgr);
        const groupName = (await Threads.getData(idgr)).name;
        api.sendMessage(`𝑬𝒊 𝒈𝒓𝒐𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒆𝒓 𝒉𝒐𝒚𝒆 𝒋𝒂𝒐𝒂:\n𝑰𝑫: ${idgr}\n𝑵𝒂𝒎: ${groupName}`, event.threadID, event.messageID);
        break;
      }
  }
};

module.exports.run = async function({ api, event, Threads }) {
  const inbox = await api.getThreadList(100, null, ['INBOX']);
  const list = [...inbox].filter(group => group.isSubscribed && group.isGroup);
  const listthread = [];

  for (const groupInfo of list) {
    const data = await api.getThreadInfo(groupInfo.threadID);
    listthread.push({
      id: groupInfo.threadID,
      name: groupInfo.name,
      memberCount: data.userInfo.length,
    });
  }

  const sortedList = listthread.sort((a, b) => b.memberCount - a.memberCount);
  let msg = '══════════════════\n📋 𝑩𝑶𝑻 𝑮𝑹𝑶𝑼𝑷 𝑳𝑰𝑺𝑻\n══════════════════\n\n';
  const groupid = [];
  
  sortedList.forEach((group, i) => {
    msg += `${i+1}. ${group.name}\n🧩 𝑮𝒓𝒐𝒖𝒑 𝑰𝑫: ${group.id}\n👥 𝑺𝒐𝒎𝒐𝒏𝒌𝒉𝒚𝒂: ${group.memberCount}\n\n`;
    groupid.push(group.id);
  });

  msg += '══════════════════\n𝑲𝒐𝒏𝒐 𝒈𝒓𝒐𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒆𝒓 𝒉𝒐𝒘𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 "𝒐𝒖𝒕" 𝒍𝒆𝒌𝒉𝒆 𝒏𝒖𝒎𝒃𝒆𝒓 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒖𝒏\n𝑩𝒂𝒏 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 "𝒃𝒂𝒏" 𝒍𝒆𝒌𝒉𝒆 𝒏𝒖𝒎𝒃𝒆𝒓 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒖𝒏\n\n𝑬𝒙𝒂𝒎𝒑𝒍𝒆: 𝒃𝒂𝒏 2\n𝒂𝒕𝒉𝒂𝒃𝒂 𝒐𝒖𝒕 3';

  api.sendMessage(msg, event.threadID, (e, data) => {
    global.client.handleReply.push({
      name: this.config.name,
      author: event.senderID,
      messageID: data.messageID,
      groupid,
      type: 'reply'
    });
  });
};
