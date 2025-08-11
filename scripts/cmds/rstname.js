module.exports = {
  config: {
    name: "rstname",
    version: "1.0.0",
    hasPermission: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑮𝒓𝒐𝒖𝒑 𝒆 𝑩𝒐𝒕 𝒆𝒓 𝒏𝒂𝒎 𝑷𝒓𝒆𝒇𝒊𝒙 𝒅𝒊𝒚𝒆 𝒓𝒆𝒔𝒆𝒕 𝒌𝒐𝒓𝒆",
    commandCategory: "𝒈𝒓𝒐𝒖𝒑",
    usages: "",
    cooldowns: 5
  },

  run: async function ({ api, event }) {
    const threadID = event.threadID;

    // 𝒀𝒆 𝒌𝒐𝒎𝒂𝒏𝒅𝒕𝒂 𝒔𝒖𝒅𝒉𝒖 𝒈𝒓𝒐𝒖𝒑 𝒆 𝒌𝒂𝒋 𝒌𝒐𝒓𝒃𝒆
    if (event.isGroup === false) {
      return api.sendMessage("❌ 𝑬𝒊 𝒌𝒐𝒎𝒂𝒏𝒅𝒕𝒂 𝒔𝒖𝒅𝒉𝒖 𝒈𝒓𝒐𝒖𝒑 𝒆 𝒌𝒂𝒋 𝒌𝒐𝒓𝒃𝒆!", threadID);
    }

    // 𝑩𝑶𝑻𝑵𝑨𝑴𝑬 𝒂𝒃𝒐𝒏𝒈 𝑷𝑹𝑬𝑭𝑰𝑿 𝒌𝒐𝒏𝒇𝒊𝒈 𝒕𝒉𝒆𝒌𝒆 𝒏𝒊𝒃𝒆
    const botName = global.config.BOTNAME || "𝑩𝒐𝒕";
    const prefix = global.config.PREFIX || "!";

    // 𝑵𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒇𝒐𝒓𝒎𝒂𝒕: 𝑩𝑶𝑻𝑵𝑨𝑴𝑬 [ 𝑷𝑹𝑬𝑭𝑰𝑿 ]
    const newNick = `${botName} [ ${prefix} ]`;

    try {
      await api.changeNickname(newNick, threadID, api.getCurrentUserID());
      return api.sendMessage(`✅ 𝑵𝒂𝒎 𝒓𝒆𝒔𝒆𝒕 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐: ${newNick}`, threadID);
    } catch (error) {
      console.error(error);
      return api.sendMessage("❌ 𝑵𝒂𝒎 𝒑𝒂𝒓𝒊𝒃𝒂𝒓𝒕𝒂𝒏 𝒌𝒂𝒓𝒂𝒓 𝒔𝒐𝒎𝒐𝒚 𝒆𝒓𝒓𝒐𝒓 𝒉𝒐𝒍𝒐", threadID);
    }
  }
};
