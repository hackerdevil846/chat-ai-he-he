module.exports = {
  config: {
    name: "trace",
    version: "1.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: "𝙈𝙚𝙣𝙩𝙞𝙤𝙣 𝙠𝙖𝙧𝙖 𝙪𝙨𝙚𝙧𝙚𝙧 𝙚𝙧 𝙟𝙤𝙣𝙣𝙤 𝙩𝙧𝙖𝙘𝙠𝙞𝙣𝙜 𝙡𝙞𝙣𝙠 𝙗𝙖𝙣𝙖𝙤"
    },
    category: "𝙎𝙮𝙨𝙩𝙚𝙢"
  },

  onStart: async function ({ api, event, args }) {
    const mention = Object.keys(event.mentions)[0];
    if (!mention) return api.sendMessage("❌ 𝘿𝙖𝙮𝙖 𝙠𝙤𝙧𝙚 𝙠𝙖𝙧𝙤 𝙩𝙧𝙖𝙘𝙚 𝙠𝙤𝙧𝙩𝙚 𝙠𝙖𝙧𝙪 𝙢𝙚𝙣𝙩𝙞𝙤𝙣", event.threadID, event.messageID);

    const name = event.mentions[mention];
    const link = `https://tracker-rudra.onrender.com/?uid=${mention}`;
    const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    api.sendMessage({
      body: `🕵️‍♂️ 𝑨𝒔𝒊𝒇 𝑻𝒓𝒂𝒄𝒌𝒊𝒏𝒈 𝑺𝒚𝒔𝒕𝒆𝒎\n\n👤 𝙅𝙖𝙧 𝙪𝙥𝙚𝙧 𝙩𝙧𝙖𝙘𝙚: ${name}\n🔗 𝙏𝙧𝙖𝙘𝙠𝙞𝙣𝙜 𝙡𝙞𝙣𝙠: ${link}\n🕒 𝙎𝙝𝙤𝙢𝙤𝙮: ${time}`,
      mentions: [{ id: mention, tag: name }]
    }, event.threadID, event.messageID);
  }
};
