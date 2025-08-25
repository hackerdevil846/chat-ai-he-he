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
  // nothing required on load, but kept for compatibility
};

/**
 * Main onStart function
 * Receives the Threads controller if the bot framework passes it.
 * If not passed, it will attempt to fall back to common global locations safely.
 */
module.exports.onStart = async function ({ api, event, args, models, Users, Threads, Currencies, permssion }) {
  const { threadID, messageID } = event;

  // Safe resolution of Threads controller (accept passed Threads or fallback)
  const ThreadsController = Threads
    || (global && global.controllers && global.controllers.Threads)
    || (global && global.Threads)
    || null;

  if (!ThreadsController || typeof ThreadsController.getData !== "function") {
    // If Threads controller is not available, return an informative message (in Banglish + English)
    const errMsg = `⚠️ System error: Threads controller not found.\n` +
      `Please make sure your bot framework provides a Threads controller to commands.\n` +
      `(Threads.getData not available)`;
    return api.sendMessage(errMsg, threadID, messageID);
  }

  try {
    const dataThread = await ThreadsController.getData(threadID);
    const data = (dataThread && dataThread.data) ? dataThread.data : {};

    // Defaults kept as original logic (strings 'true'/'false' or booleans)
    const settingsRaw = {
      log: data.log ?? 'true',
      rankup: data.rankup ?? 'false',
      resend: data.resend ?? 'false',
      tagadmin: data.tagadmin ?? 'true',
      guard: data.guard ?? 'true',
      antiout: data.antiout ?? 'true'
    };

    // Normalize to friendly text
    const toStatus = (v) => {
      if (v === true || v === 'true' || String(v).toLowerCase() === 'true') return '✅ Enabled';
      if (v === false || v === 'false' || String(v).toLowerCase() === 'false') return '❌ Disabled';
      // fallback: show raw value
      return String(v);
    };

    const message = `
╭━━━━━━━━━━━━━━━━━━━━╮
┃   🧾  𝑺𝒀𝑺𝑻𝑬𝑴 𝑳𝑶𝑮𝑺   ┃
╰━━━━━━━━━━━━━━━━━━━━╯

╭───────────────────────
│ 📝 𝑳𝒐𝒈: ${toStatus(settingsRaw.log)}
│ ⬆️ 𝑹𝒂𝒏𝒌𝒖𝒑: ${toStatus(settingsRaw.rankup)}
│ 🔁 𝑹𝒆𝒔𝒆𝒏𝒅: ${toStatus(settingsRaw.resend)}
│ 👨‍💼 𝑻𝒂𝒈 𝑨𝒅𝒎𝒊𝒏: ${toStatus(settingsRaw.tagadmin)}
│ 🛡️ 𝑨𝒏𝒕𝒊𝒓𝒐𝒃𝒃𝒆𝒓𝒚: ${toStatus(settingsRaw.guard)}
│ 🚪 𝑨𝒏𝒕𝒊𝒐𝒖𝒕: ${toStatus(settingsRaw.antiout)}
╰───────────────────────

© ${module.exports.config.credits}
    `.trim();

    return api.sendMessage(message, threadID, messageID);
  } catch (error) {
    console.error('Log error:', error);
    return api.sendMessage(
      '⚠️ 𝑳𝒐𝒈 𝒔𝒆𝒕𝒕𝒊𝒏𝒈𝒔 𝒅𝒆𝒌𝒉𝒂𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊𝒏𝒊',
      threadID,
      messageID
    );
  }
};
