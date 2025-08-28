module.exports = {
  config: {
    name: "antiout",
    version: "1.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 5,
    role: 1,
    shortDescription: {
      en: "𝑬𝒏𝒂𝒃𝒍𝒆 𝒐𝒓 𝒅𝒊𝒔𝒂𝒃𝒍𝒆 𝒂𝒏𝒕𝒊𝒐𝒖𝒕"
    },
    longDescription: {
      en: "𝑷𝒓𝒆𝒗𝒆𝒏𝒕𝒔 𝒖𝒔𝒆𝒓𝒔 𝒇𝒓𝒐𝒎 𝒍𝒆𝒂𝒗𝒊𝒏𝒈 𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑 𝒂𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒂𝒍𝒍𝒚"
    },
    category: "group",
    guide: {
      en: "{p}antiout [on | off]"
    }
  },

  onStart: async function({ message, event, args, threadsData }) {
    try {
      if (!["on", "off"].includes(args[0])) {
        return message.reply("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒖𝒔𝒆 '𝒐𝒏' 𝒐𝒓 '𝒐𝒇𝒇' 𝒂𝒔 𝒂𝒏 𝒂𝒓𝒈𝒖𝒎𝒆𝒏𝒕");
      }

      const isEnabled = args[0] === "on";
      await threadsData.set(event.threadID, isEnabled, "settings.antiout");
      
      return message.reply(`✅ 𝑨𝒏𝒕𝒊𝒐𝒖𝒕 𝒉𝒂𝒔 𝒃𝒆𝒆𝒏 ${isEnabled ? "𝒆𝒏𝒂𝒃𝒍𝒆𝒅" : "𝒅𝒊𝒔𝒂𝒃𝒍𝒆𝒅"}`);
      
    } catch (error) {
      console.error("Antiout command error:", error);
      return message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.");
    }
  },

  onEvent: async function({ api, event, threadsData }) {
    try {
      if (event.logMessageType !== "log:unsubscribe") {
        return;
      }

      const antioutEnabled = await threadsData.get(event.threadID, "settings.antiout");
      
      if (antioutEnabled && event.logMessageData && event.logMessageData.leftParticipantFbId) {
        const userId = event.logMessageData.leftParticipantFbId;
        
        // Add a small delay to ensure the user has actually left
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
          // Try to add the user back
          await api.addUserToGroup(userId, event.threadID);
          console.log(`✅ 𝑼𝒔𝒆𝒓 ${userId} 𝒘𝒂𝒔 𝒂𝒅𝒅𝒆𝒅 𝒃𝒂𝒄𝒌 𝒕𝒐 𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑`);
          
          // Send a notification message
          await api.sendMessage(
            `⚠️ 𝑨𝒏𝒕𝒊𝒐𝒖𝒕 𝑺𝒚𝒔𝒕𝒆𝒎\n\n` +
            `𝑼𝒔𝒆𝒓 𝒕𝒓𝒊𝒆𝒅 𝒕𝒐 𝒍𝒆𝒂𝒗𝒆 𝒃𝒖𝒕 𝒘𝒂𝒔 𝒂𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒂𝒍𝒍𝒚 𝒂𝒅𝒅𝒆𝒅 𝒃𝒂𝒄𝒌!\n` +
            `𝑺𝒚𝒔𝒕𝒆𝒎: 𝑨𝒄𝒕𝒊𝒗𝒂𝒕𝒆𝒅`,
            event.threadID
          );
          
        } catch (addError) {
          console.error("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒂𝒅𝒅 𝒖𝒔𝒆𝒓 𝒃𝒂𝒄𝒌:", addError);
        }
      }
    } catch (error) {
      console.error("Antiout event error:", error);
    }
  }
};
