module.exports = {
  config: {
    name: "adduser",
    version: "2.4.3",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
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

  onStart: async function({ message, event, args, api }) {
    try {
      if (!args[0]) {
        return message.reply("𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒖𝒔𝒆𝒓 𝑰𝑫 𝒐𝒓 𝒑𝒓𝒐𝒇𝒊𝒍𝒆 𝒍𝒊𝒏𝒌");
      }

      const threadInfo = await api.getThreadInfo(event.threadID);
      const participantIDs = threadInfo.participantIDs.map(id => id.toString());
      const adminIDs = threadInfo.adminIDs.map(admin => admin.id.toString());

      let targetID;
      let userName = "𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝒖𝒔𝒆𝒓";

      // Check if input is a numeric ID
      if (!isNaN(args[0])) {
        targetID = args[0].toString();
        try {
          const userInfo = await api.getUserInfo(targetID);
          userName = userInfo[targetID]?.name || userName;
        } catch (error) {
          console.error("Error getting user info:", error);
        }
      } 
      // Check if input is a Facebook profile URL
      else if (args[0].includes("facebook.com") || args[0].includes("fb.com")) {
        try {
          // Extract ID from URL (simple approach)
          const url = args[0];
          let extractedID = url.match(/(?:\/|id=)(\d+)/);
          
          if (extractedID && extractedID[1]) {
            targetID = extractedID[1];
            const userInfo = await api.getUserInfo(targetID);
            userName = userInfo[targetID]?.name || userName;
          } else {
            return message.reply("𝑪𝒐𝒖𝒍𝒅 𝒏𝒐𝒕 𝒆𝒙𝒕𝒓𝒂𝒄𝒕 𝑰𝑫 𝒇𝒓𝒐𝒎 𝒕𝒉𝒆 𝒑𝒓𝒐𝒇𝒊𝒍𝒆 𝒍𝒊𝒏𝒌");
          }
        } catch (error) {
          return message.reply("𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒑𝒓𝒐𝒇𝒊𝒍𝒆 𝒍𝒊𝒏𝒌 𝒐𝒓 𝑰𝑫 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅");
        }
      } 
      else {
        return message.reply("𝑷𝒍𝒆𝒂𝒔𝒆 𝒑𝒓𝒐𝒗𝒊𝒅𝒆 𝒂 𝒗𝒂𝒍𝒊𝒅 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝑰𝑫 𝒐𝒓 𝒑𝒓𝒐𝒇𝒊𝒍𝒆 𝒍𝒊𝒏𝒌");
      }

      // Check if user is already in the group
      if (participantIDs.includes(targetID)) {
        return message.reply("𝑻𝒉𝒊𝒔 𝒖𝒔𝒆𝒓 𝒊𝒔 𝒂𝒍𝒓𝒆𝒂𝒅𝒚 𝒊𝒏 𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑");
      }

      // Try to add the user to the group
      try {
        await api.addUserToGroup(targetID, event.threadID);
        return message.reply(`✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒂𝒅𝒅𝒆𝒅 ${userName} 𝒕𝒐 𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑`);
      } catch (error) {
        console.error("Add user error:", error);
        
        if (error.message.includes("approval")) {
          return message.reply(`📝 ${userName} 𝒉𝒂𝒔 𝒃𝒆𝒆𝒏 𝒂𝒅𝒅𝒆𝒅 𝒕𝒐 𝒕𝒉𝒆 𝒂𝒑𝒑𝒓𝒐𝒗𝒂𝒍 𝒍𝒊𝒔𝒕. 𝑻𝒉𝒆𝒚 𝒏𝒆𝒆𝒅 𝒕𝒐 𝒂𝒄𝒄𝒆𝒑𝒕 𝒕𝒉𝒆 𝒊𝒏𝒗𝒊𝒕𝒆.`);
        } else if (error.message.includes("friend")) {
          return message.reply(`❌ 𝑪𝒂𝒏'𝒕 𝒂𝒅𝒅 ${userName}. 𝑻𝒉𝒆 𝒃𝒐𝒕 𝒏𝒆𝒆𝒅𝒔 𝒕𝒐 𝒃𝒆 𝒇𝒓𝒊𝒆𝒏𝒅𝒔 𝒘𝒊𝒕𝒉 𝒕𝒉𝒆 𝒖𝒔𝒆𝒓 𝒇𝒊𝒓𝒔𝒕.`);
        } else if (error.message.includes("privacy")) {
          return message.reply(`🔒 ${userName}'𝒔 𝒑𝒓𝒊𝒗𝒂𝒄𝒚 𝒔𝒆𝒕𝒕𝒊𝒏𝒈𝒔 𝒑𝒓𝒆𝒗𝒆𝒏𝒕 𝒂𝒅𝒅𝒊𝒏𝒈 𝒕𝒐 𝒈𝒓𝒐𝒖𝒑𝒔.`);
        } else {
          return message.reply(`❌ 𝑪𝒐𝒖𝒍𝒅 𝒏𝒐𝒕 𝒂𝒅𝒅 ${userName}: ${error.message}`);
        }
      }

    } catch (error) {
      console.error("AddUser Error:", error);
      return message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.");
    }
  }
};
