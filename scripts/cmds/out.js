module.exports.config = {
  name: "leave",
  version: "1.0.1",
  hasPermssion: 2,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🚪 𝐁𝐨𝐭 𝐤𝐨 𝐠𝐫𝐨𝐮𝐩 𝐬𝐞 𝐛𝐚𝐡𝐚𝐫 𝐤𝐚𝐫𝐧𝐞 𝐤𝐚 𝐜𝐨𝐦𝐦𝐚𝐧𝐝",
  category: "🛡️ 𝐀𝐝𝐦𝐢𝐧",
  usages: "leave [threadID]",
  cooldowns: 3,
  dependencies: {}
};

module.exports.run = async function({ api, event, args }) {
  try {
    const { threadID, messageID } = event;
    const targetID = args[0];
    
    // 🌟 Current group leave
    if (!targetID) {
      const threadInfo = await api.getThreadInfo(threadID);
      const groupName = threadInfo.threadName || "𝐀𝐧𝐨𝐧𝐲𝐦𝐨𝐮𝐬 𝐆𝐫𝐨𝐮𝐩";
      
      await api.sendMessage({
        body: `😢 𝐁𝐨𝐭 𝐢𝐬 𝐥𝐞𝐚𝐯𝐢𝐧𝐠 𝐭𝐡𝐢𝐬 𝐠𝐫𝐨𝐮𝐩:\n"${groupName}"\n\n𝐆𝐨𝐨𝐝𝐛𝐲𝐞 𝐞𝐯𝐞𝐫𝐲𝐨𝐧𝐞! 𝐒𝐚𝐲𝐨𝐧𝐚𝐫𝐚~ ✨`,
        mentions: [{
          tag: "@𝐁𝐨𝐭 𝐋𝐞𝐚𝐯𝐞",
          id: api.getCurrentUserID()
        }]
      }, threadID);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      return api.removeUserFromGroup(api.getCurrentUserID(), threadID);
    }
    
    // ✈️ Specific group leave
    const threadInfo = await api.getThreadInfo(targetID);
    const groupName = threadInfo.threadName || "𝐔𝐧𝐤𝐧𝐨𝐰𝐧 𝐆𝐫𝐨𝐮𝐩";
    
    api.removeUserFromGroup(api.getCurrentUserID(), targetID);
    return api.sendMessage({
      body: `✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐥𝐞𝐟𝐭:\n"${groupName}"\n𝐈𝐃: ${targetID}\n\n𝐁𝐨𝐭 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐫𝐞𝐦𝐨𝐯𝐞𝐝 𝐟𝐫𝐨𝐦 𝐭𝐡𝐞 𝐠𝐫𝐨𝐮𝐩!`,
      mentions: [{
        tag: "@𝐆𝐫𝐨𝐮𝐩 𝐋𝐞𝐚𝐯𝐞",
        id: api.getCurrentUserID()
      }]
    }, threadID, messageID);
    
  } catch (error) {
    api.sendMessage({
      body: `❌ 𝐄𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝:\n${error.message}\n\n𝐏𝐥𝐞𝐚𝐬𝐞 𝐜𝐡𝐞𝐜𝐤 𝐭𝐡𝐫𝐞𝐚𝐝 𝐈𝐃 𝐚𝐧𝐝 𝐩𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧𝐬!`
    }, event.threadID, event.messageID);
  }
};
