module.exports.config = {
  name: "match",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "⚡ 2 জনের মধ্যে ম্যাচ রেটিং দেখুন",
  commandCategory: "𝑮𝒂𝒎𝒆",
  usages: "[@ব্যাক্তি]",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async function ({ api, event, Users }) {
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];

  try {
    const mentionId = Object.keys(event.mentions)[0];
    if (!mentionId) {
      return api.sendMessage(
        "✨ 𝟏 𝐣𝐨𝐧 𝐟𝐫𝐢𝐞𝐧𝐝 𝐤𝐞 𝐓𝐚𝐠 𝐤𝐨𝐫𝐮𝐧\n𝐉𝐚𝐝𝐞𝐫 𝐬𝐚𝐭𝐡𝐞 𝐦𝐚𝐭𝐜𝐡 𝐝𝐞𝐤𝐡𝐭𝐞 𝐜𝐚𝐧!",
        event.threadID,
        event.messageID
      );
    }

    fs.ensureDirSync(__dirname + "/cache");

    const [mentioned, sender] = await Promise.all([
      Users.getData(mentionId),
      Users.getData(event.senderID)
    ]);
    
    const name = mentioned?.name || mentionId;
    const namee = sender?.name || event.senderID;
    const tle = Math.floor(Math.random() * 101);

    const arraytag = [
      { id: mentionId, tag: name },
      { id: event.senderID, tag: namee }
    ];

    const avatarURL1 = `https://graph.facebook.com/${mentionId}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const avatarURL2 = `https://graph.facebook.com/${event.senderID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    const [Avatar, Avatar2] = await Promise.all([
      axios.get(avatarURL1, { responseType: "arraybuffer" }),
      axios.get(avatarURL2, { responseType: "arraybuffer" })
    ]);

    fs.writeFileSync(__dirname + "/cache/avt.png", Buffer.from(Avatar.data));
    fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(Avatar2.data));

    const imglove = [
      fs.createReadStream(__dirname + "/cache/avt2.png"),
      fs.createReadStream(__dirname + "/cache/avt.png")
    ];

    const loveMessage = 
      `💌 𝐌𝐚𝐭𝐜𝐡 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥!\n\n` +
      `🧑‍💼 ➠ ${namee}\n` +
      `👩‍💼 ➠ ${name}\n\n` +
      `💘 𝐌𝐚𝐭𝐜𝐡 𝐑𝐚𝐭𝐢𝐧𝐠 ➠ ${tle}%\n\n` +
      `${tle >= 80 ? "🌟 𝐏𝐞𝐫𝐟𝐞𝐜𝐭 𝐌𝐚𝐭𝐜𝐡! 𝐘𝐨𝐮 𝐚𝐫𝐞 𝐦𝐚𝐝𝐞 𝐟𝐨𝐫 𝐞𝐚𝐜𝐡 𝐨𝐭𝐡𝐞𝐫!" : 
        tle >= 60 ? "💖 𝐆𝐨𝐨𝐝 𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐢𝐨𝐧! 𝐖𝐨𝐫𝐭𝐡 𝐞𝐱𝐩𝐥𝐨𝐫𝐢𝐧𝐠!" : 
        tle >= 40 ? "🤔 𝐀𝐯𝐞𝐫𝐚𝐠𝐞 𝐌𝐚𝐭𝐜𝐡! 𝐆𝐢𝐯𝐞 𝐢𝐭 𝐚 𝐬𝐡𝐨𝐭!" : 
        "😢 𝐋𝐨𝐰 𝐂𝐨𝐦𝐩𝐚𝐭𝐢𝐛𝐢𝐥𝐢𝐭𝐲! 𝐁𝐞𝐭𝐭𝐞𝐫 𝐥𝐮𝐜𝐤 𝐧𝐞𝐱𝐭 𝐭𝐢𝐦𝐞!"}`;

    return api.sendMessage({
      body: loveMessage,
      mentions: arraytag,
      attachment: imglove
    }, event.threadID, event.messageID);

  } catch (e) {
    console.error(e);
    return api.sendMessage("❌ 𝐄𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐦𝐚𝐭𝐜𝐡 𝐫𝐞𝐪𝐮𝐞𝐬𝐭!", event.threadID);
  }
};
