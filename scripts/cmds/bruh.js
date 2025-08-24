const fs = require("fs");

module.exports.config = {
  name: "bruh",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝑩𝒓𝒖𝒉 𝒔𝒐𝒖𝒏𝒅 𝒆𝒇𝒇𝒆𝒄𝒕",
  category: "𝑵𝒐-𝒑𝒓𝒆𝒇𝒊𝒙 𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔",
  usages: "𝑩𝒓𝒖𝒉",
  cooldowns: 5,
};

module.exports.languages = {
  en: {
    success: "𝑩𝒓𝒖𝒉 𝑩𝒓𝒖𝒖𝒉 😏",
    fileMissing: "(⚠) 𝑩𝒓𝒖𝒉 sound file not found. Sending text fallback..."
  },
  bn: {
    success: "𝑩𝒓𝒖𝒉 𝑩𝒓𝒖𝒖𝒉 😏",
    fileMissing: "(⚠) 𝑩𝒓𝒖𝒉 sound file পাওয়া যায়নি. টেক্সট পাঠানো হচ্ছে..."
  }
};

module.exports.onLoad = function () {
  try {
    const filePath = __dirname + "/noprefix/xxx.mp3";
    if (!fs.existsSync(filePath)) {
      console.warn("[bruh] warning: sound file not found at:", filePath);
    }
  } catch (e) {
    console.warn("[bruh] onLoad check failed:", e);
  }
};

module.exports.handleEvent = async function ({ event, api }) {
  try {
    if (!event || !event.body) return;

    const { threadID, messageID, senderID, body } = event;

    let otherBots = [];
    try {
      if (global.config && Array.isArray(global.config.OTHERBOT)) otherBots = global.config.OTHERBOT;
    } catch (err) {
      otherBots = [];
    }

    const firstWord = body.trim().split(/\s+/)[0] || "";
    if (firstWord.toLowerCase() !== "bruh") return;

    if (otherBots.includes(senderID)) return;

    const filePath = __dirname + "/noprefix/xxx.mp3";

    const msg = {
      body: module.exports.languages.en.success,
    };

    if (fs.existsSync(filePath)) {
      msg.attachment = fs.createReadStream(filePath);
    } else {
      msg.body = module.exports.languages.en.fileMissing + "\n" + module.exports.languages.en.success;
      console.warn("[bruh] sound file missing, sending text fallback. Expected:", filePath);
    }

    return api.sendMessage(msg, threadID, messageID);
  } catch (error) {
    console.error("[bruh] handleEvent error:", error);
  }
};

module.exports.onStart = function ({ api, event }) {
  const { threadID, messageID } = event;
  return api.sendMessage(module.exports.languages.en.success, threadID, messageID);
};
