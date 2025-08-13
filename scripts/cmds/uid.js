module.exports = {
  config: {
    name: "uid",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝙐𝙨𝙚𝙧𝙚𝙧 𝙄𝘿 𝙟𝙖𝙣𝙩𝙚 𝙥𝙖𝙧𝙗𝙚𝙣",
    commandCategory: "𝙏𝙤𝙤𝙡𝙨",
    cooldowns: 5
  },

  run: async function ({ api, event }) {
    if (Object.keys(event.mentions).length === 0) {
      return api.sendMessage(
        `𝘼𝙥𝙣𝙖𝙧 𝙐𝙨𝙚𝙧 𝙄𝘿: ${event.senderID}`,
        event.threadID,
        event.messageID
      );
    } else {
      let msg = "";
      for (const [id, name] of Object.entries(event.mentions)) {
        const cleanName = name.replace('@', '');
        msg += `${cleanName} - 𝙐𝙨𝙚𝙧 𝙄𝘿: ${id}\n`;
      }
      return api.sendMessage(msg, event.threadID, event.messageID);
    }
  }
};
