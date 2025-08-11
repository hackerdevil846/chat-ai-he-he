module.exports = {
  config: {
    name: "flop",
    version: "1.0.1",
    hasPermssion: 1,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑮𝒓𝒐𝒖𝒑 𝒆𝒓 𝒔𝒐𝒃 𝒎𝒆𝒎𝒃𝒆𝒓 𝒌𝒆 𝒓𝒆𝒎𝒐𝒗𝒆 𝒌𝒐𝒓𝒂 𝒂𝒓 𝒈𝒓𝒐𝒖𝒑 𝒕𝒉𝒆𝒌𝒆 𝒃𝒆𝒓𝒊𝒆 𝒋𝒂𝒐𝒘𝒂",
    commandCategory: "𝑮𝒓𝒐𝒖𝒑",
    usages: "𝒇𝒍𝒐𝒑",
    cooldowns: 1
  },

  onStart: async function({ api, event }) {
    const { threadID } = event;
    
    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
      const botID = api.getCurrentUserID();
      
      if (!adminIDs.includes(botID)) {
        return api.sendMessage(
          "𝑩𝒐𝒕 𝒌𝒆 𝒂𝒅𝒎𝒊𝒏 𝒑𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏 𝒅𝒊𝒏 𝒂𝒈𝒆 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒄𝒂𝒍𝒂𝒏𝒐𝒓 𝒂𝒈𝒆", 
          threadID
        );
      }
      
      const participantIDs = threadInfo.participantIDs;
      
      const removalPromises = participantIDs
        .filter(userID => userID !== botID)
        .map(userID => 
          api.removeUserFromGroup(userID, threadID)
             .catch(err => console.error(`𝑬𝒓𝒓𝒐𝒓: ${err}`))
        );
      
      await Promise.all(removalPromises);
      
      const updatedInfo = await api.getThreadInfo(threadID);
      
      if (updatedInfo.participantIDs.length === 1) {
        await api.removeUserFromGroup(botID, threadID);
        return;
      }
      
      api.sendMessage(
        "𝑮𝒓𝒐𝒖𝒑 𝒇𝒍𝒐𝒑 𝒉𝒐𝒍𝒆 𝒈𝒆𝒍𝒆! 𝑺𝒐𝒃 𝒎𝒆𝒎𝒃𝒆𝒓 𝒌𝒆 𝒓𝒆𝒎𝒐𝒗𝒆 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒆 𝒈𝒆𝒄𝒉𝒆!",
        threadID
      );
    } 
    catch (error) {
      console.error("𝑭𝒍𝒐𝒑 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒆𝒓𝒓𝒐𝒓:", error);
      api.sendMessage(
        "𝑬𝒓𝒓𝒐𝒓 𝒉𝒐𝒄𝒄𝒉𝒆! 𝑨𝒃𝒂𝒓 𝒄𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏",
        threadID
      );
    }
  }
};
