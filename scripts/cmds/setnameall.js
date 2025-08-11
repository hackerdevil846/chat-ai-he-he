module.exports.config = {
  name: "setall",
  version: "1.1.0",
  hasPermssion: 2,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑺𝒆𝒕 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆𝒔 𝒇𝒐𝒓 𝒂𝒍𝒍 𝒎𝒆𝒎𝒃𝒆𝒓𝒔 𝒊𝒏 𝒈𝒓𝒐𝒖𝒑",
  commandCategory: "𝑩𝒐𝒙 𝑪𝒉𝒂𝒕",
  usages: "[nickname]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  
  // Check if nickname is provided
  if (!args[0]) {
    return api.sendMessage("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒕𝒐 𝒔𝒆𝒕 𝒇𝒐𝒓 𝒂𝒍𝒍 𝒎𝒆𝒎𝒃𝒆𝒓𝒔!", threadID, messageID);
  }
  
  const nickname = args.join(" ");
  const maxNicknameLength = 20; // Facebook's nickname length limit
  
  // Validate nickname length
  if (nickname.length > maxNicknameLength) {
    return api.sendMessage(`❌ 𝑵𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒕𝒐𝒐 𝒍𝒐𝒏𝒈! 𝑴𝒂𝒙𝒊𝒎𝒖𝒎 ${maxNicknameLength} 𝒄𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓𝒔.`, threadID, messageID);
  }
  
  try {
    api.sendMessage(`🔄 𝑺𝒕𝒂𝒓𝒕𝒊𝒏𝒈 𝒕𝒐 𝒔𝒆𝒕 "${nickname}" 𝒂𝒔 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒇𝒐𝒓 𝒂𝒍𝒍 𝒎𝒆𝒎𝒃𝒆𝒓𝒔...`, threadID, messageID);
    
    const threadInfo = await api.getThreadInfo(threadID);
    const participantIDs = threadInfo.participantIDs.filter(id => id !== api.getCurrentUserID());
    const botID = api.getCurrentUserID();
    
    // Check if bot has admin permissions
    const botAsParticipant = threadInfo.adminIDs.find(admin => admin.id === botID);
    if (!botAsParticipant) {
      return api.sendMessage("❌ 𝑩𝒐𝒕 𝒎𝒖𝒔𝒕 𝒃𝒆 𝒂𝒏 𝒂𝒅𝒎𝒊𝒏 𝒕𝒐 𝒔𝒆𝒕 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆𝒔!", threadID, messageID);
    }
    
    let successCount = 0;
    let failedCount = 0;
    const failedUsers = [];
    
    for (const userID of participantIDs) {
      try {
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        // Set nickname
        await api.changeNickname(nickname, threadID, userID);
        successCount++;
      } catch (error) {
        failedCount++;
        failedUsers.push(userID);
        console.error(`❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒔𝒆𝒕 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒇𝒐𝒓 ${userID}:`, error);
      }
    }
    
    // Construct result message
    let resultMessage = `✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒔𝒆𝒕 "${nickname}" 𝒇𝒐𝒓 ${successCount} 𝒎𝒆𝒎𝒃𝒆𝒓𝒔`;
    
    if (failedCount > 0) {
      resultMessage += `\n❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒇𝒐𝒓 ${failedCount} 𝒎𝒆𝒎𝒃𝒆𝒓𝒔: ${failedUsers.join(', ')}`;
    }
    
    api.sendMessage(resultMessage, threadID, messageID);
    
  } catch (error) {
    console.error("❌ 𝑬𝑹𝑹𝑶𝑹:", error);
    api.sendMessage("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒓𝒆𝒒𝒖𝒆𝒔𝒕", threadID, messageID);
  }
};
