module.exports = {
  config: {
    name: "antijoin",
    version: "1.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 1,
    category: "system",
    shortDescription: {
      en: "𝑻𝒖𝒓𝒏 𝒐𝒏/𝒐𝒇𝒇 𝒂𝒏𝒕𝒊𝒋𝒐𝒊𝒏"
    },
    longDescription: {
      en: "𝑬𝒏𝒂𝒃𝒍𝒆 𝒐𝒓 𝒅𝒊𝒔𝒂𝒃𝒍𝒆 𝒂𝒏𝒕𝒊-𝒋𝒐𝒊𝒏 𝒑𝒓𝒐𝒕𝒆𝒄𝒕𝒊𝒐𝒏 𝒇𝒐𝒓 𝒚𝒐𝒖𝒓 𝒈𝒓𝒐𝒖𝒑"
    },
    guide: {
      en: "{p}antijoin [on/off]"
    },
    cooldowns: 5
  },

  onStart: async function({ message, event, args, Threads }) {
    try {
      const { threadID } = event;
      
      // Check if user provided argument
      if (!args[0]) {
        return message.reply("🛡️ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒔𝒑𝒆𝒄𝒊𝒇𝒚 '𝒐𝒏' 𝒐𝒓 '𝒐𝒇𝒇':\n• {p}antijoin on - 𝑬𝒏𝒂𝒃𝒍𝒆 𝒂𝒏𝒕𝒊-𝒋𝒐𝒊𝒏\n• {p}antijoin off - 𝑫𝒊𝒔𝒂𝒃𝒍𝒆 𝒂𝒏𝒕𝒊-𝒋𝒐𝒊𝒏");
      }

      const action = args[0].toLowerCase();
      
      if (action !== 'on' && action !== 'off') {
        return message.reply("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒐𝒑𝒕𝒊𝒐𝒏. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒖𝒔𝒆 '𝒐𝒏' 𝒐𝒓 '𝒐𝒇𝒇'");
      }

      // Get thread info to check admin status
      const threadInfo = await api.getThreadInfo(threadID);
      const botID = api.getCurrentUserID();
      
      // Check if bot is admin
      if (!threadInfo.adminIDs.some(admin => admin.id === botID)) {
        return message.reply("❌ 𝑩𝒐𝒕 𝒏𝒆𝒆𝒅𝒔 𝒂𝒅𝒎𝒊𝒏 𝒑𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏𝒔 𝒕𝒐 𝒎𝒂𝒏𝒂𝒈𝒆 𝒂𝒏𝒕𝒊-𝒋𝒐𝒊𝒏 𝒔𝒆𝒕𝒕𝒊𝒏𝒈𝒔");
      }

      // Get current thread data
      const threadData = (await Threads.getData(threadID)).data || {};
      const currentStatus = threadData.antijoin || false;
      
      // Update the setting
      threadData.antijoin = action === 'on';
      
      // Save the updated data
      await Threads.setData(threadID, { data: threadData });
      
      // Update global cache if it exists
      if (global.data.threadData) {
        global.data.threadData.set(parseInt(threadID), threadData);
      }

      return message.reply(
        `🛡️ 𝑨𝑵𝑻𝑰-𝑱𝑶𝑰𝑵 𝑺𝑻𝑨𝑻𝑼𝑺\n\n` +
        `✅ ${action === 'on' ? '𝑬𝑵𝑨𝑩𝑳𝑬𝑫' : '𝑫𝑰𝑺𝑨𝑩𝑳𝑬𝑃'}\n\n` +
        `𝑨𝒏𝒕𝒊-𝒋𝒐𝒊𝒏 𝒑𝒓𝒐𝒕𝒆𝒄𝒕𝒊𝒐𝒏 𝒉𝒂𝒔 𝒃𝒆𝒆𝒏 ${action === 'on' ? '𝒆𝒏𝒂𝒃𝒍𝒆𝒅' : '𝒅𝒊𝒔𝒂𝒃𝒍𝒆𝒅'} 𝒇𝒐𝒓 𝒕𝒉𝒊𝒔 𝒈𝒓𝒐𝒖𝒑.`
      );

    } catch (error) {
      console.error("Antijoin command error:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.");
    }
  }
};
