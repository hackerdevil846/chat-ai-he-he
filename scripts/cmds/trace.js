module.exports = {
  config: {
    name: "trace",
    version: "1.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "Mention kora user er jonno tracking link banay",
    category: "system",
    usages: "@mention",
    cooldowns: 5
  },

  onStart: async function({ api, event }) {
    const mentionIDs = Object.keys(event.mentions);
    const mention = mentionIDs[0];

    if (!mention) {
      return api.sendMessage(
        "❌ Dayakore jake trace korte chao take mention koro!",
        event.threadID,
        event.messageID
      );
    }

    const name = event.mentions[mention];
    const link = `https://tracker-rudra.onrender.com/?uid=${mention}`;
    const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    return api.sendMessage(
      {
        body:
          "🕵️‍♂️ 𝗔𝘀𝗶𝗳 𝗧𝗿𝗮𝗰𝗸𝗶𝗻𝗴 𝗦𝘆𝘀𝘁𝗲𝗺\n\n" +
          `👤 Trace target: ${name}\n` +
          `🔗 Tracking link: ${link}\n` +
          `🕒 Time: ${time}`,
        mentions: [{ id: mention, tag: name }]
      },
      event.threadID,
      event.messageID
    );
  }
};
