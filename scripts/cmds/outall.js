module.exports.config = {
  name: "outall",
  version: "1.0.1",
  hasPermssion: 2,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🔄 𝐒𝐨𝐛 𝐠𝐫𝐮𝐩 𝐭𝐡𝐞𝐤𝐞 𝐁𝐨𝐭 𝐤𝐞 𝐛𝐚𝐡𝐢𝐫 𝐧𝐢𝐲𝐞 𝐣𝐚𝐨𝐚",
  commandCategory: "🛠️ 𝐀𝐝𝐦𝐢𝐧",
  usages: "outall",
  cooldowns: 5,
  info: [
    {
      key: "Text",
      prompt: "📝 𝐒𝐨𝐛 𝐠𝐫𝐮𝐩 𝐭𝐡𝐞𝐤𝐞 𝐁𝐨𝐭 𝐤𝐞 𝐛𝐚𝐡𝐢𝐫 𝐧𝐢𝐲𝐞 𝐣𝐚𝐛𝐞",
      type: 'Document',
      example: 'outall'
    }
  ]
};

module.exports.run = async function({ api, event, args }) {
  try {
    const botID = api.getCurrentUserID();
    const list = await api.getThreadList(100, null, ["INBOX"]);
    
    let successCount = 0;
    let errorCount = 0;
    let results = [];

    for (const thread of list) {
      if (thread.isGroup && thread.threadID !== event.threadID) {
        try {
          await api.removeUserFromGroup(botID, thread.threadID);
          successCount++;
          results.push(`✅ | ${thread.name || "𝐔𝐧𝐧𝐚𝐦𝐞𝐝 𝐆𝐫𝐨𝐮𝐩"} - 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐋𝐞𝐟𝐭!`);
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          errorCount++;
          results.push(`❌ | ${thread.name || "𝐔𝐧𝐧𝐚𝐦𝐞𝐝 𝐆𝐫𝐨𝐮𝐩"} - 𝐅𝐚𝐢𝐥𝐞𝐝: ${error.message}`);
        }
      }
    }

    const summary = 
      `╭──『 𝐎𝐔𝐓𝐀𝐋𝐋 𝐑𝐄𝐒𝐔𝐋𝐓 』──⊷\n` +
      `│\n` +
      `│ ✅ 𝐒𝐔𝐂𝐂𝐄𝐒𝐒: ${successCount} 𝐠𝐫𝐨𝐮𝐩𝐬\n` +
      `│ ❌ 𝐅𝐀𝐈𝐋𝐔𝐑𝐄: ${errorCount} 𝐠𝐫𝐨𝐮𝐩𝐬\n` +
      `│\n` +
      `╰──『 𝐁𝐨𝐭 𝐛𝐲 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 』──⊷`;

    api.sendMessage(summary, event.threadID);
    
    // Send detailed results if any
    if (results.length > 0) {
      const detailedReport = "📋 𝐃𝐞𝐭𝐚𝐢𝐥𝐞𝐝 𝐑𝐞𝐩𝐨𝐫𝐭:\n\n" + results.join("\n");
      api.sendMessage(detailedReport, event.threadID);
    }

  } catch (error) {
    console.error(error);
    api.sendMessage(
      `⚠️ 𝐄𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐞𝐝:\n${error.message}\n` +
      `𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫!`, 
      event.threadID
    );
  }
};
