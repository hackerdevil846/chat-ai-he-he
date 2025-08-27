module.exports = {
  config: {
    name: "adduser",
    version: "2.4.3",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "group",
    shortDescription: {
      en: "𝑨𝒅𝒅 𝒖𝒔𝒆𝒓 𝒕𝒐 𝒈𝒓𝒐𝒖𝒑 𝒃𝒚 𝒍𝒊𝒏𝒌 𝒐𝒓 𝒊𝒅"
    },
    longDescription: {
      en: "𝑨𝒅𝒅 𝒖𝒔𝒆𝒓𝒔 𝒕𝒐 𝒚𝒐𝒖𝒓 𝒈𝒓𝒐𝒖𝒑 𝒖𝒔𝒊𝒏𝒈 𝒕𝒉𝒆𝒊𝒓 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝑰𝑫 𝒐𝒓 𝒑𝒓𝒐𝒇𝒊𝒍𝒆 𝒍𝒊𝒏𝒌"
    },
    guide: {
      en: "{p}adduser [Facebook ID or profile URL]"
    }
  },

  onStart: async function ({ message, event, args, api, usersData }) {
    try {
      const threadID = event.threadID;
      const botID = api.getCurrentUserID();
      
      if (!args[0]) {
        return message.reply("𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒖𝒔𝒆𝒓 𝑰𝑫 𝒐𝒓 𝒑𝒓𝒐𝒇𝒊𝒍𝒆 𝒍𝒊𝒏𝒌");
      }

      const threadInfo = await api.getThreadInfo(threadID);
      const participantIDs = threadInfo.participantIDs.map(e => parseInt(e));
      const approvalMode = threadInfo.approvalMode;
      const adminIDs = threadInfo.adminIDs.map(e => parseInt(e.id));

      let targetID;
      let userName;

      if (!isNaN(args[0])) {
        targetID = args[0];
        try {
          const userInfo = await api.getUserInfo(targetID);
          userName = userInfo[targetID]?.name || "𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒖𝒔𝒆𝒓";
        } catch {
          userName = "𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒖𝒔𝒆𝒓";
        }
      } else {
        const profileUrl = args[0];
        if (profileUrl.includes("facebook.com") || profileUrl.includes("fb.com")) {
          try {
            const res = await api.getUID(profileUrl);
            targetID = res;
            const userInfo = await api.getUserInfo(targetID);
            userName = userInfo[targetID]?.name || "𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒖𝒔𝒆𝒓";
          } catch (error) {
            return message.reply("𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒑𝒓𝒐𝒇𝒊𝒍𝒆 𝒍𝒊𝒏𝒌 𝒐𝒓 𝑰𝑫 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅");
          }
        } else {
          return message.reply("𝑷𝒍𝒆𝒂𝒔𝒆 𝒑𝒓𝒐𝒗𝒊𝒅𝒆 𝒂 𝒗𝒂𝒍𝒊𝒅 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒑𝒓𝒐𝒇𝒊𝒍𝒆 𝒍𝒊𝒏𝒌");
        }
      }

      targetID = parseInt(targetID);

      if (participantIDs.includes(targetID)) {
        return message.reply("𝑻𝒉𝒊𝒔 𝒖𝒔𝒆𝒓 𝒊𝒔 𝒂𝒍𝒓𝒆𝒂𝒅𝒚 𝒊𝒏 𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑");
      }

      try {
        await api.addUserToGroup(targetID, threadID);
      } catch (error) {
        return message.reply(`𝑪𝒂𝒏'𝒕 𝒂𝒅𝒅 ${userName} 𝒕𝒐 𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑. ${error.message}`);
      }

      if (approvalMode && !adminIDs.includes(botID)) {
        return message.reply(`𝑨𝒅𝒅𝒆𝒅 ${userName} 𝒕𝒐 𝒕𝒉𝒆 𝒂𝒑𝒑𝒓𝒐𝒗𝒂𝒍 𝒍𝒊𝒔𝒕`);
      } else {
        return message.reply(`𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒂𝒅𝒅𝒆𝒅 ${userName} 𝒕𝒐 𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑`);
      }

    } catch (error) {
      console.error("AddUser Error:", error);
      message.reply(`𝑬𝒓𝒓𝒐𝒓: ${error.message}`);
    }
  }
};
