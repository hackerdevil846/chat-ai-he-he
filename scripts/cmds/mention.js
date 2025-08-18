module.exports.config = {
  name: "goiadmin",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🦋 𝑴𝒂𝒍𝒊𝒌 𝒌𝒆 𝒕𝒂𝒈 𝒌𝒐𝒓𝒍𝒆 𝒃𝒐𝒕 𝒂𝒖𝒕𝒐 𝒓𝒆𝒑𝒍𝒚 𝒅𝒊𝒃𝒆 🌺",
  commandCategory: "⚙️ 𝑺𝒚𝒔𝒕𝒆𝒎",
  usages: "",
  cooldowns: 1,
  envConfig: {
    adminUID: "61571630409265"
  }
};

module.exports.handleEvent = function({ api, event, envConfig }) {
  try {
    const { senderID, threadID, messageID, mentions } = event;
    const admin = envConfig.adminUID;
    
    // Check if someone mentions admin and it's not admin self
    if (senderID !== admin && mentions.hasOwnProperty(admin)) {
      const responses = [
        "🌷 𝑴𝒂𝒍𝒊𝒌 𝒃𝒊𝒔𝒚 𝒂𝒄𝒉𝒆, 𝒂𝒎𝒂𝒌𝒆 𝒃𝒐𝒍𝒖𝒏 𝒌𝒊 𝒃𝒐𝒍𝒕𝒆 𝒄𝒂𝒐? 🤔",
        "🌸 𝑲𝒊𝒆 𝒉𝒐𝒍𝒐? 𝑴𝒂𝒍𝒊𝒌 𝒌𝒆 𝒌𝒆𝒏 𝒅𝒂𝒌𝒂𝒕𝒆 𝒄𝒂𝒐? 😊",
        "🌹 𝑼𝒏𝒂𝒓 𝒃𝒊𝒔𝒚 𝒕𝒉𝒂𝒌𝒕𝒆 𝒑𝒂𝒓𝒆𝒏, 𝒑𝒐𝒓𝒆 𝒅𝒂𝒌𝒂𝒃𝒆𝒏 😌",
        "💐 𝑴𝒂𝒍𝒊𝒌 𝒆𝒌𝒉𝒐𝒏 𝒕𝒉𝒆𝒌𝒆 𝒏𝒆𝒊, 𝒑𝒐𝒓𝒆 𝒅𝒆𝒌𝒉𝒊 ⏳",
        "🌺 𝑨𝒑𝒏𝒊 𝒌𝒐𝒕𝒉𝒂 𝒃𝒐𝒍𝒖𝒏, 𝒎𝒂𝒍𝒊𝒌 𝒌𝒆 𝒋𝒊𝒈𝒂𝒚 𝒅𝒂𝒌𝒉𝒂𝒃𝒐! 😇"
      ];
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      api.sendMessage({
        body: `╔════ஜ۩۞۩ஜ═══╗\n\n${response}\n\n╚════ஜ۩۞۩ஜ═══╝`,
        mentions: [{
          tag: "@Malik",
          id: admin
        }]
      }, threadID, messageID);
    }
  } catch (error) {
    console.error("✨ 𝑬𝒓𝒓𝒐𝒓 𝒊𝒏 𝒈𝒐𝒊𝒂𝒅𝒎𝒊𝒏:", error);
  }
};

module.exports.run = async function({}) {
  // Intentionally empty
};
