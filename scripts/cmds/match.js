module.exports.config = {
  name: "match",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "2 jon er moddhe match koto dekhte paren",
  commandCategory: "𝑮𝒂𝒎𝒆",
  usages: "[tag]",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "axios": ""
  }
}

module.exports.run = async function ({ api, args, Users, event }) {
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];

  try {
    // Require exactly one tagged friend
    const mentionId = Object.keys(event.mentions)[0];
    if (!mentionId) {
      return api.sendMessage(
        "𝑨𝒑𝒏𝒂𝒌𝒆 1 𝒋𝒐𝒏 𝒇𝒓𝒊𝒆𝒏𝒅 𝒌𝒆 𝒕𝒂𝒈 𝒌𝒐𝒓𝒕𝒆 𝒉𝒐𝒃𝒆 𝒋𝒂𝒅𝒆𝒓 𝒎𝒂𝒕𝒄𝒉 𝒓𝒂𝒕𝒊𝒐 𝒅𝒆𝒌𝒉𝒕𝒆 𝒄𝒉𝒂𝒏",
        event.threadID,
        event.messageID
      );
    }

    // Ensure cache directory exists (same path preserved)
    fs.ensureDirSync(__dirname + "/cache");

    // Resolve names
    const mentioned = await Users.getData(mentionId);
    const sender = await Users.getData(event.senderID);
    const name = mentioned?.name || mentionId;
    const namee = sender?.name || event.senderID;

    // Random match ratio (0–100)
    const tle = Math.floor(Math.random() * 101);

    // Mentions array
    const arraytag = [
      { id: mentionId, tag: name },
      { id: event.senderID, tag: namee }
    ];

    // Fetch avatars (links unchanged)
    const avatarURL1 = `https://graph.facebook.com/${mentionId}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const avatarURL2 = `https://graph.facebook.com/${event.senderID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    const [Avatar, Avatar2] = await Promise.all([
      axios.get(avatarURL1, { responseType: "arraybuffer" }).then(res => res.data),
      axios.get(avatarURL2, { responseType: "arraybuffer" }).then(res => res.data)
    ]);

    // Save avatars (paths unchanged)
    fs.writeFileSync(__dirname + "/cache/avt.png", Buffer.from(Avatar));
    fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(Avatar2));

    // Prepare attachments (order preserved: sender first, then mentioned)
    const imglove = [
      fs.createReadStream(__dirname + "/cache/avt2.png"),
      fs.createReadStream(__dirname + "/cache/avt.png")
    ];

    // Message body (unchanged text)
    const msg = {
      body: `⚡️${namee} 𝒆𝒃𝒐𝒏𝒈 ${name} 𝒆𝒓 𝒎𝒐𝒅𝒅𝒉𝒆 𝒎𝒂𝒕𝒄𝒉 𝒓𝒂𝒕𝒊𝒐 ${tle}% 🥰`,
      mentions: arraytag,
      attachment: imglove
    };

    return api.sendMessage(msg, event.threadID, event.messageID);
  } catch (e) {
    // Quiet fail-safe to avoid breaking other modules
    return api.sendMessage("⚠️ কিছু একটা সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।", event.threadID, event.messageID);
  }
}
```
