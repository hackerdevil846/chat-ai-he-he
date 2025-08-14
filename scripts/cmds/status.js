const fs = global.nodemodule["fs-extra"];

module.exports = {
  config: {
    name: "status",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑩𝒐𝒕 𝒆𝒓 𝒔𝒂𝒕𝒕𝒐 𝒅𝒆𝒌𝒉𝒂",
    commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
    usages: "",
    cooldowns: 3,
    dependencies: {}
  },

  run: async function({ api, event, Threads }) {
    try {
      const { threadID, messageID } = event;

      // Thread data fetch
      const dataThread = await Threads.getData(threadID);
      const data = dataThread.data || {};

      // Status variables with default fallback
      const log = data.log != null ? `${data.log}` : "𝒕𝒓𝒖𝒆";
      const rankup = data.rankup != null ? `${data.rankup}` : "𝒇𝒂𝒍𝒔𝒆";
      const resend = data.resend != null ? `${data.resend}` : "𝒇𝒂𝒍𝒔𝒆";
      const tagadmin = data.tagadmin != null ? `${data.tagadmin}` : "𝒕𝒓𝒖𝒆";
      const guard = data.guard != null ? `${data.guard}` : "𝒕𝒓𝒖𝒆";
      const antiout = data.antiout != null ? `${data.antiout}` : "𝒕𝒓𝒖𝒆";

      // Message construction
      const statusMessage =
        `☣️ 𝑺𝒂𝒕𝒕𝒐 𝑻𝒂𝒃𝒍𝒆 ☣️\n\n` +
        `🍄────•🦋•────🍄\n` +
        `❯ 🍉 𝑳𝒐𝒈: ${log}\n` +
        `❯ 🍇 𝑹𝒂𝒏𝒌𝒖𝒑: ${rankup}\n` +
        `❯ 🍓 𝑹𝒆𝒔𝒆𝒏𝒅: ${resend}\n` +
        `❯ 🥕 𝑻𝒂𝒈 𝑨𝒅𝒎𝒊𝒏: ${tagadmin}\n` +
        `❯ 🛡️ 𝑨𝒏𝒕𝒊𝒓𝒐𝒃𝒃𝒆𝒓𝒚: ${guard}\n` +
        `❯ 🍒 𝑨𝒏𝒕𝒊𝒐𝒖𝒕: ${antiout}\n` +
        `🍄────•🦋•────🍄`;

      // Send message
      return api.sendMessage(statusMessage, threadID, messageID);

    } catch (error) {
      console.error("Error in status command:", error);
      return api.sendMessage("⚠️ Status command এ কিছু সমস্যা হয়েছে।", event.threadID, event.messageID);
    }
  }
};
