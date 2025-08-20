const { Threads } = global.controllers; // Assuming your GoatBot Threads controller is in global.controllers

module.exports.config = {
  name: "log",
  version: "1.0.0",
  hasPermssion: 0, // 0 = all members
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑺𝒚𝒔𝒕𝒆𝒎 𝒔𝒆𝒕𝒕𝒊𝒏𝒈𝒔 𝒅𝒆𝒌𝒉𝒂𝒏",
  commandCategory: "system",
  usages: "",
  cooldowns: 3,
  dependencies: {}
};

module.exports.languages = {
  "en": {},
  "bn": {}
};

module.exports.onLoad = async function () {
  // Runs when the command is loaded
};

module.exports.run = async function ({ api, event, Threads }) {
  const { threadID, messageID } = event;

  try {
    const dataThread = await Threads.getData(threadID);
    const data = dataThread.data;

    const settings = {
      log: data.log ?? 'true',
      rankup: data.rankup ?? 'false',
      resend: data.resend ?? 'false',
      tagadmin: data.tagadmin ?? 'true',
      guard: data.guard ?? 'true',
      antiout: data.antiout ?? 'true'
    };

    const message = `
╭━━━━━━━━━━━━━━╮
┃  🧾 𝑺𝒀𝑺𝑻𝑬𝑴 𝑳𝑶𝑮𝑺  ┃
╰━━━━━━━━━━━━━━╯

╭─────────────────
│ 📝 𝑳𝒐𝒈: ${settings.log}
│ ⬆️ 𝑹𝒂𝒏𝒌𝒖𝒑: ${settings.rankup}
│ 🔁 𝑹𝒆𝒔𝒆𝒏𝒅: ${settings.resend}
│ 👨‍💼 𝑻𝒂𝒈 𝑨𝒅𝒎𝒊𝒏: ${settings.tagadmin}
│ 🛡️ 𝑨𝒏𝒕𝒊𝒓𝒐𝒃𝒃𝒆𝒓𝒚: ${settings.guard}
│ 🚪 𝑨𝒏𝒕𝒊𝒐𝒖𝒕: ${settings.antiout}
╰─────────────────
    `.trim();

    return api.sendMessage(message, threadID, messageID);
  } catch (error) {
    console.error('𝑳𝒐𝒈 𝒆𝒓𝒓𝒐𝒓:', error);
    return api.sendMessage(
      '⚠️ 𝑳𝒐𝒈 𝒔𝒆𝒕𝒕𝒊𝒏𝒈𝒔 𝒅𝒆𝒌𝒉𝒂𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊𝒏𝒊',
      threadID,
      messageID
    );
  }
};
