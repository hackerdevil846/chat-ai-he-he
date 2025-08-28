module.exports = {
  config: {
    name: "autoreset",
    version: "1.0.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "𝒔𝒚𝒔𝒕𝒆𝒎",
    shortDescription: {
      en: "𝑨𝑼𝑻𝑶 𝑹𝑬𝑺𝑻𝑨𝑹𝑻 𝑺𝒀𝑺𝑻𝑬𝑴"
    },
    longDescription: {
      en: "𝑨𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒂𝒍𝒍𝒚 𝒓𝒆𝒔𝒕𝒂𝒓𝒕𝒔 𝒕𝒉𝒆 𝒃𝒐𝒕 𝒂𝒕 𝒔𝒑𝒆𝒄𝒊𝒇𝒊𝒄 𝒕𝒊𝒎𝒆𝒔"
    },
    guide: {
      en: ""
    }
  },

  onStart: async function({ api, event }) {
    try {
      const moment = require("moment-timezone");
      const timeNow = moment.tz("Asia/Dhaka").format("HH:mm:ss");
      await api.sendMessage(`🕒 𝑨𝒌𝒉𝒏𝒆𝒓 𝒔𝒐𝒎𝒐𝒚: ${timeNow}`, event.threadID);
    } catch (error) {
      console.error("𝑨𝒖𝒕𝒐𝒓𝒆𝒔𝒕 𝑬𝒓𝒓𝒐𝒓:", error);
    }
  },

  onChat: async function({ api, event }) {
    try {
      const moment = require("moment-timezone");
      const timeNow = moment.tz("Asia/Dhaka").format("HH:mm:ss");
      const seconds = moment.tz("Asia/Dhaka").format("ss");
      const adminIDs = global.config.ADMINBOT;
      
      // 𝑪𝒓𝒆𝒂𝒕𝒆 𝒕𝒊𝒎𝒆 𝒔𝒕𝒓𝒊𝒏𝒈𝒔 𝒇𝒐𝒓 𝒆𝒂𝒄𝒉 𝒉𝒐𝒖𝒓
      const restartTimes = Array.from({length: 12}, (_, i) => 
          `${(i+1).toString().padStart(2, '0')}:00:${seconds}`
      );
      
      // 𝑪𝒉𝒆𝒄𝒌 𝒊𝒇 𝒄𝒖𝒓𝒓𝒆𝒏𝒕 𝒕𝒊𝒎𝒆 𝒎𝒂𝒕𝒄𝒉𝒆𝒔 𝒂𝒏𝒚 𝒓𝒆𝒔𝒕𝒂𝒓𝒕 𝒕𝒊𝒎𝒆
      if (restartTimes.includes(timeNow) && parseInt(seconds) < 6) {
          for (const adminID of adminIDs) {
              await api.sendMessage(
                  `⚡️ 𝑨𝒌𝒉𝒐𝒏 𝒔𝒐𝒎𝒐𝒚: ${timeNow}\n𝑩𝒂𝒃𝒚 𝒓𝒆𝒔𝒕𝒂𝒓𝒕 𝒉𝒐𝒄𝒄𝒉𝒆!!!`,
                  adminID
              );
          }
          process.exit(1);
      }
    } catch (error) {
      console.error("𝑨𝒖𝒕𝒐𝒓𝒆𝒔𝒕 𝑬𝒓𝒓𝒐𝒓:", error);
    }
  }
};
