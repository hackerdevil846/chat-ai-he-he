// TikTok video/music downloader for Goat Bot
// Keep functionality intact, paths and links unchanged.

module.exports.config = {
  name: "tikvideo",
  version: "1.0.0",
  role: 0, // Goat Bot structure
  hasPermssion: 0, // kept for compatibility
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝙏𝙞𝙠𝙏𝙤𝙠 𝙫𝙞𝙙𝙚𝙤 𝙙𝙖𝙪𝙣𝙡𝙤𝙖𝙙 𝙠𝙤𝙧𝙚",
  category: "𝙐𝙨𝙚𝙧 𝙡𝙖𝙜𝙚",
  usages: "",
  cooldowns: 5
};

module.exports.onLoad = function () {
  console.log("=== 𝙏𝙞𝙠𝙏𝙤𝙠 𝘿𝙖𝙪𝙣𝙡𝙤𝙖𝙙 𝙉𝙤 𝙒𝙖𝙩𝙚𝙧𝙢𝙖𝙧𝙠 ===");
};

module.exports.run = async function ({ args, event, api }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const request = require("request");

  const img = [];

  if (!args[0]) {
    return api.sendMessage(
      "𝘼𝙥𝙣𝙞 𝙩𝙞𝙠𝙩𝙤𝙠 𝙡𝙞𝙣𝙠 𝙙𝙞𝙮𝙚𝙘𝙝𝙚𝙣 𝙣𝙖",
      event.threadID,
      event.messageID
    );
  }

  try {
    const url = `http://api.leanhtruong.net/api-no-key/tiktok?url=${encodeURI(args[0])}`;
    const res = (await axios.get(url, { timeout: 20000 })).data;

    // Thumbnail fallback handling (kept API & paths unchanged)
    const thumbUrl =
      res.thumbail ||
      res.thumbnail ||
      res.cover ||
      (res.data_thumb ? res.data_thumb : null);

    if (thumbUrl) {
      const imga = (await axios.get(thumbUrl, { responseType: "arraybuffer", timeout: 20000 })).data;
      fs.writeFileSync(__dirname + "/cache/tiktok.png", Buffer.from(imga));
      img.push(fs.createReadStream(__dirname + "/cache/tiktok.png"));
    }

    const title = res.title || "Unknown";
    const author_video = res.author_video || "Unknown";
    const musicTitle = res?.data_music?.title || "Unknown";
    const videoUrl = res?.data_nowatermark?.[0]?.url;
    const mp3Url = res?.data_music?.url;

    if (!videoUrl || !mp3Url) {
      // If API didn’t return expected fields, inform gracefully
      if (thumbUrl) try { fs.unlinkSync(__dirname + "/cache/tiktok.png"); } catch {}
      return api.sendMessage(
        "❌ 𝘼𝙥𝙞 𝙗𝙖𝙡𝙤 𝙙𝙖𝙩𝙖 𝙛𝙞𝙧𝙚 𝙣𝙞, 𝙖𝙗𝙖𝙧 𝙘𝙝𝙚𝙨𝙩𝙖 𝙠𝙤𝙧𝙪𝙣",
        event.threadID,
        event.messageID
      );
    }

    const msg = {
      body:
        `𝙏𝙖𝙞𝙩𝙡 : ${title}\n` +
        `𝙇𝙚𝙠𝙝𝙖𝙠 : ${author_video}\n` +
        `𝙂𝙖𝙣𝙚𝙧 𝙩𝙖𝙞𝙩𝙡 : ${musicTitle}\n\n` +
        `1. 𝙑𝙞𝙙𝙚𝙤 𝙙𝙖𝙪𝙣𝙡𝙤𝙖𝙙\n` +
        `2. 𝙂𝙖𝙣 𝙙𝙖𝙪𝙣𝙡𝙤𝙖𝙙\n\n` +
        `𝙆𝙞𝙘𝙝𝙪 𝙥𝙖𝙩𝙝𝙖𝙩𝙚 𝙧𝙚𝙥𝙡𝙮 𝙠𝙤𝙧𝙪𝙣!`,
      attachment: img
    };

    return api.sendMessage(msg, event.threadID, (error, info) => {
      // Clean up thumbnail after sending prompt
      if (thumbUrl) {
        try { fs.unlinkSync(__dirname + "/cache/tiktok.png"); } catch {}
      }
      if (error) return;

      global.client.handleReply.push({
        type: "reply",
        name: module.exports.config.name,
        author: event.senderID,
        messageID: info.messageID,
        video: videoUrl,                // kept link unchanged
        mp3: mp3Url,                    // kept link unchanged
        title: title,
        authorvd: author_video,
        text: musicTitle
      });
    });
  } catch (error) {
    console.error("[tikvideo] Error:", error);
    return api.sendMessage(
      "❌ 𝙀𝙧𝙧𝙤𝙧 𝙝𝙤𝙮𝙚𝙘𝙝𝙚, 𝙖𝙗𝙖𝙧 𝙘𝙝𝙚𝙨𝙩𝙖 𝙠𝙤𝙧𝙪𝙣",
      event.threadID,
      event.messageID
    );
  }
};

module.exports.handleReply = async function ({ event, api, handleReply }) {
  const fs = require("fs-extra");
  const request = require("request");

  const { author, video, mp3, title, authorvd, text } = handleReply;

  if (event.senderID != author) {
    return api.sendMessage("𝙍𝙖𝙨𝙝 ?", event.threadID, event.messageID);
  }

  if (handleReply.type !== "reply") return;

  const choice = String(event.body || "").trim();

  switch (choice) {
    case "1": {
      const filePath = __dirname + "/cache/toptop.mp4"; // path unchanged
      const callback = () =>
        api.sendMessage(
          {
            body: `𝙑𝙞𝙙𝙚𝙤 : ${authorvd}\n𝙏𝙖𝙞𝙩𝙡 : ${title}\n`,
            attachment: fs.createReadStream(filePath)
          },
          event.threadID,
          () => {
            try { fs.unlinkSync(filePath); } catch {}
          },
          event.messageID
        );

      return request(encodeURI(`${video}`))
        .pipe(fs.createWriteStream(filePath))
        .on("close", callback)
        .on("error", () => {
          try { fs.unlinkSync(filePath); } catch {}
          return api.sendMessage("❌ 𝙑𝙞𝙙𝙚𝙤 𝙙𝙖𝙪𝙣𝙡𝙤𝙖𝙙 𝙝𝙤𝙮 𝙣𝙞, 𝙖𝙗𝙖𝙧 𝙘𝙝𝙚𝙨𝙩𝙖 𝙠𝙤𝙧𝙪𝙣", event.threadID, event.messageID);
        });
    }

    case "2": {
      const filePath = __dirname + "/cache/toptop.m4a"; // path unchanged
      const callback = () =>
        api.sendMessage(
          {
            body: `𝙂𝙖𝙣 : ${text}`,
            attachment: fs.createReadStream(filePath)
          },
          event.threadID,
          () => {
            try { fs.unlinkSync(filePath); } catch {}
          },
          event.messageID
        );

      return request(encodeURI(`${mp3}`))
        .pipe(fs.createWriteStream(filePath))
        .on("close", callback)
        .on("error", () => {
          try { fs.unlinkSync(filePath); } catch {}
          return api.sendMessage("❌ 𝙂𝙖𝙣 𝙙𝙖𝙪𝙣𝙡𝙤𝙖𝙙 𝙝𝙤𝙮 𝙣𝙞, 𝙖𝙗𝙖𝙧 𝙘𝙝𝙚𝙨𝙩𝙖 𝙠𝙤𝙧𝙪𝙣", event.threadID, event.messageID);
        });
    }

    default: {
      return api.sendMessage("ℹ️ 𝟙 𝙗𝙖 𝟚 𝙙𝙞𝙣", event.threadID, event.messageID);
    }
  }
};
