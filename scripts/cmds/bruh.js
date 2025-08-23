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

// Runs when the module is loaded: simple check to help avoid runtime crashes.
module.exports.onLoad = function () {
  try {
    const filePath = __dirname + "/noprefix/xxx.mp3";
    if (!fs.existsSync(filePath)) {
      // Do not throw — just warn in console so bot owner can fix the file.
      console.warn("[bruh] warning: sound file not found at:", filePath);
    }
  } catch (e) {
    console.warn("[bruh] onLoad check failed:", e);
  }
};

// Handle global events (no-prefix trigger)
module.exports.handleEvent = async function ({ event, api }) {
  try {
    if (!event || !event.body) return; // ignore non-text events

    const { threadID, messageID, senderID, body } = event;

    // Guard: ensure OTHERBOT is an array so .includes won't crash
    let otherBots = [];
    try {
      if (global.config && Array.isArray(global.config.OTHERBOT)) otherBots = global.config.OTHERBOT;
    } catch (err) {
      otherBots = [];
    }

    // Only trigger when message starts with "bruh" (case-insensitive)
    const firstWord = body.trim().split(/\s+/)[0] || "";
    if (firstWord.toLowerCase() !== "bruh") return;

    // don't react to other bot accounts
    if (otherBots.includes(senderID)) return;

    const filePath = __dirname + "/noprefix/xxx.mp3"; // <-- path preserved as requested

    // Build message
    const msg = {
      body: module.exports.languages.en.success,
    };

    if (fs.existsSync(filePath)) {
      // attach sound only if file exists to avoid crashes
      msg.attachment = fs.createReadStream(filePath);
    } else {
      // If file missing, send fallback text (safe) and log a warning
      msg.body = module.exports.languages.en.fileMissing + "\n" + module.exports.languages.en.success;
      console.warn("[bruh] sound file missing, sending text fallback. Expected:", filePath);
    }

    return api.sendMessage(msg, threadID, messageID);
  } catch (error) {
    console.error("[bruh] handleEvent error:", error);
  }
};

// Command run (not used for this no-prefix command, but kept for completeness)
module.exports.run = function ({ api, event }) {
  // No direct command execution required — this command is triggered via handleEvent (no-prefix)
  // But keeping this function prevents potential errors if the framework expects it.
  const { threadID, messageID } = event;
  return api.sendMessage(module.exports.languages.en.success, threadID, messageID);
};
