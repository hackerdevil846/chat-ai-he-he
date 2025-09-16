module.exports = {
  config: {
    name: "leave",
    aliases: ["botleave", "removebot"],
    version: "1.0.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 3,
    role: 2,
    category: "🛡️ 𝑨𝒅𝒎𝒊𝒏",
    shortDescription: {
      en: "🚪 𝑩𝒐𝒕 𝒌𝒐 𝒈𝒓𝒐𝒖𝒑 𝒔𝒆 𝒃𝒂𝒉𝒂𝒓 𝒌𝒂𝒓𝒏𝒆 𝒌𝒂 𝒄𝒐𝒎𝒎𝒂𝒏𝒅"
    },
    longDescription: {
      en: "🚪 𝑩𝒐𝒕 𝒌𝒐 𝒈𝒓𝒐𝒖𝒑 𝒔𝒆 𝒃𝒂𝒉𝒂𝒓 𝒌𝒂𝒓𝒏𝒆 𝒌𝒂 𝒄𝒐𝒎𝒎𝒂𝒏𝒅"
    },
    guide: {
      en: "{𝑝}leave [𝒕𝒉𝒓𝒆𝒂𝒅𝑰𝑫]"
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      const { threadID, messageID } = event;
      const targetID = args[0];
      
      // 🌟 Current group leave
      if (!targetID) {
        try {
          const threadInfo = await api.getThreadInfo(threadID);
          const groupName = threadInfo.threadName || "𝑨𝒏𝒐𝒏𝒚𝒎𝒐𝒖𝒔 𝑮𝒓𝒐𝒖𝒑";
          
          await api.sendMessage({
            body: `😢 𝑩𝒐𝒕 𝒊𝒔 𝒍𝒆𝒂𝒗𝒊𝒏𝒈 𝒕𝒉𝒊𝒔 𝒈𝒓𝒐𝒖𝒑:\n"${groupName}"\n\n𝑮𝒐𝒐𝒅𝒃𝒚𝒆 𝒆𝒗𝒆𝒓𝒚𝒐𝒏𝒆! 𝑺𝒂𝒚𝒐𝒏𝒂𝒓𝒂~ ✨`,
            mentions: [{
              tag: "@𝑩𝒐𝒕 𝑳𝒆𝒂𝒗𝒆",
              id: api.getCurrentUserID()
            }]
          }, threadID);
          
          await new Promise(resolve => setTimeout(resolve, 2000));
          return api.removeUserFromGroup(api.getCurrentUserID(), threadID);
        } catch (error) {
          return api.sendMessage({
            body: `❌ 𝑬𝒓𝒓𝒐𝒓 𝒍𝒆𝒂𝒗𝒊𝒏𝒈 𝒈𝒓𝒐𝒖𝒑: ${error.message}`
          }, threadID, messageID);
        }
      }
      
      // ✈️ Specific group leave
      try {
        const threadInfo = await api.getThreadInfo(targetID);
        const groupName = threadInfo.threadName || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑮𝒓𝒐𝒖𝒑";
        
        await api.removeUserFromGroup(api.getCurrentUserID(), targetID);
        return api.sendMessage({
          body: `✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒍𝒆𝒇𝒕:\n"${groupName}"\n𝑰𝑫: ${targetID}\n\n𝑩𝒐𝒕 𝒉𝒂𝒔 𝒃𝒆𝒆𝒏 𝒓𝒆𝒎𝒐𝒗𝒆𝒅 𝒇𝒓𝒐𝒎 𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑!`,
          mentions: [{
            tag: "@𝑮𝒓𝒐𝒖𝒑 𝑳𝒆𝒂𝒗𝒆",
            id: api.getCurrentUserID()
          }]
        }, threadID, messageID);
        
      } catch (error) {
        return api.sendMessage({
          body: `❌ 𝑬𝒓𝒓𝒐𝒓 𝒍𝒆𝒂𝒗𝒊𝒏𝒈 𝒔𝒑𝒆𝒄𝒊𝒇𝒊𝒄 𝒈𝒓𝒐𝒖𝒑: ${error.message}\n\n𝑷𝒍𝒆𝒂𝒔𝒆 𝒄𝒉𝒆𝒄𝒌 𝒕𝒉𝒓𝒆𝒂𝒅 𝑰𝑫 𝒂𝒏𝒅 𝒑𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏𝒔!`
        }, threadID, messageID);
      }
      
    } catch (error) {
      api.sendMessage({
        body: `❌ 𝑼𝒏𝒆𝒙𝒑𝒆𝒄𝒕𝒆𝒅 𝒆𝒓𝒓𝒐𝒓:\n${error.message}\n\n𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓!`
      }, event.threadID, event.messageID);
    }
  }
};
