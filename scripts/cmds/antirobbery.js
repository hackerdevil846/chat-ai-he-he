module.exports = {
  config: {
    name: "antirobbery",
    version: "1.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 1,
    category: "admin",
    shortDescription: {
      en: "𝑷𝒓𝒆𝒗𝒆𝒏𝒕 𝒄𝒉𝒂𝒏𝒈𝒊𝒏𝒈 𝒈𝒓𝒐𝒖𝒑 𝒂𝒅𝒎𝒊𝒏𝒊𝒔𝒕𝒓𝒂𝒕𝒐𝒓𝒔"
    },
    longDescription: {
      en: "𝑷𝒓𝒐𝒕𝒆𝒄𝒕 𝒈𝒓𝒐𝒖𝒑 𝒇𝒓𝒐𝒎 𝒖𝒏𝒂𝒖𝒕𝒉𝒐𝒓𝒊𝒛𝒆𝒅 𝒂𝒅𝒎𝒊𝒏 𝒄𝒉𝒂𝒏𝒈𝒆𝒔"
    },
    guide: {
      en: "{p}antirobbery"
    },
    cooldowns: 5
  },

  onStart: async function({ message, event, Threads }) {
    try {
      const info = await api.getThreadInfo(event.threadID);
      
      // Check if bot is admin
      if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) {
        return message.reply(
          '❌ 𝑵𝒆𝒆𝒅 𝒈𝒓𝒐𝒖𝒑 𝒂𝒅𝒎𝒊𝒏𝒊𝒔𝒕𝒓𝒂𝒕𝒐𝒓 𝒑𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏𝒔, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒂𝒅𝒅 𝒃𝒐𝒕 𝒂𝒔 𝒂𝒅𝒎𝒊𝒏 𝒂𝒏𝒅 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏!'
        );
      }
      
      const data = (await Threads.getData(event.threadID)).data || {};
      
      // Toggle the guard setting
      if (typeof data.guard == "undefined" || data.guard == false) {
        data.guard = true;
        await message.reply("✅ 𝑨𝒏𝒕𝒊-𝑹𝒐𝒃𝒃𝒆𝒓𝒚 𝒔𝒚𝒔𝒕𝒆𝒎 𝒂𝒄𝒕𝒊𝒗𝒂𝒕𝒆𝒅\n\n🛡️ 𝑮𝒓𝒐𝒖𝒑 𝒘𝒊𝒍𝒍 𝒏𝒐𝒘 𝒃𝒆 𝒑𝒓𝒐𝒕𝒆𝒄𝒕𝒆𝒅 𝒇𝒓𝒐𝒎 𝒖𝒏𝒂𝒖𝒕𝒉𝒐𝒓𝒊𝒛𝒆𝒅 𝒂𝒅𝒎𝒊𝒏 𝒄𝒉𝒂𝒏𝒈𝒆𝒔");
      } else {
        data.guard = false;
        await message.reply("✅ 𝑨𝒏𝒕𝒊-𝑹𝒐𝒃𝒃𝒆𝒓𝒚 𝒔𝒚𝒔𝒕𝒆𝒎 𝒅𝒆𝒂𝒄𝒕𝒊𝒗𝒂𝒕𝒆𝒅\n\n⚠️ 𝑮𝒓𝒐𝒖𝒑 𝒑𝒓𝒐𝒕𝒆𝒄𝒕𝒊𝒐𝒏 𝒉𝒂𝒔 𝒃𝒆𝒆𝒏 𝒅𝒊𝒔𝒂𝒃𝒍𝒆𝒅");
      }
      
      // Save the settings
      await Threads.setData(event.threadID, { data });
      
      // Update global data if it exists
      if (global.data && global.data.threadData) {
        global.data.threadData.set(parseInt(event.threadID), data);
      }

    } catch (error) {
      console.error("Antirobbery command error:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.");
    }
  }
};
