const axios = require("axios");
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "sing",
  version: "3.1.0",
  aliases: ["music", "play"],
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  countDown: 10,
  hasPermssion: 0,
  description: "🎵 Download high-quality audio from YouTube",
  category: "media",
  usages: "[song name | YouTube link]",
  cooldowns: 20,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  },
  envConfig: {}
};

module.exports.onLoad = function({ configValue }) {
  // ensure cache folder exists
  try {
    const cacheDir = path.join(__dirname, 'cache');
    fs.ensureDirSync(cacheDir);
  } catch (e) {
    console.error("sing onLoad - could not ensure cache dir:", e);
  }

  // ensure global reply map exists (safe-guard)
  if (!global.GoatBot) global.GoatBot = {};
  if (!global.GoatBot.onReply || typeof global.GoatBot.onReply.set !== 'function') {
    global.GoatBot.onReply = new Map();
  }
};

module.exports.run = async function({ api, event, args, Users, Threads, Currencies, models }) {
  // This function acts as the command entry (like onStart)
  try {
    const youtubeRegex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
    const query = args.join(" ").trim();

    // Show help if no query
    if (!query) {
      const helpMessage = "🎵 Music Player Help:\n\n" +
        "• Play by name: sing <song name>\n" +
        "• Play by link: sing <youtube link>\n\n" +
        "Examples:\n" +
        "  sing chipi chipi chapa chapa\n" +
        "  sing https://youtu.be/dQw4w9WgXcQ\n\n" +
        "⏱️ Cooldown: 20 seconds";
      return api.sendMessage(helpMessage, event.threadID, event.messageID);
    }

    // Handle YouTube links
    if (youtubeRegex.test(query)) {
      const videoID = query.match(youtubeRegex)[1];
      return await this._handleDirectLink(api, event, videoID);
    }

    // Handle search queries
    await this._handleSearch(api, event, query);
  } catch (error) {
    console.error("Sing Command Error:", error);
    api.sendMessage(
      "❌ An error occurred: " + (error.message || "Please try again later"),
      event.threadID,
      event.messageID
    );
  }
};

module.exports._handleDirectLink = async function(api, event, videoID) {
  try {
    api.sendMessage("⬇️ Downloading audio... Please wait 10-30 seconds!", event.threadID, event.messageID);

    const apiUrl = "https://api--dipto.repl.co"; // <-- kept exactly as requested
    const { data } = await axios.get(`${apiUrl}/ytDl3?link=${videoID}&format=mp3`, {
      timeout: 30000
    });

    if (!data || !data.downloadLink) {
      throw new Error("No download link found");
    }

    // ensure cache dir
    const cacheDir = path.join(__dirname, 'cache');
    fs.ensureDirSync(cacheDir);

    const audioPath = path.join(cacheDir, `audio_${Date.now()}.mp3`);
    await this._downloadFile(data.downloadLink, audioPath);

    // Check file size (25MB limit)
    const fileSize = fs.statSync(audioPath).size;
    if (fileSize > 25 * 1024 * 1024) {
      try { fs.unlinkSync(audioPath); } catch (e) { /* ignore */ }
      throw new Error("File size exceeds 25MB limit");
    }

    const messageBody = `🎵 Now Playing: ${data.title || "Unknown Title"}\n🎚️ Quality: ${data.quality || "Unknown"}\n⏱️ Duration: ${data.duration || "Unknown"}`;

    api.sendMessage({
      body: messageBody,
      attachment: fs.createReadStream(audioPath)
    }, event.threadID, (err, info) => {
      // cleanup after sent (best-effort)
      try {
        if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
      } catch (cleanError) {
        console.error("Cleanup error:", cleanError);
      }

      if (err) console.error("Send audio error:", err);
    }, event.messageID);
  } catch (error) {
    console.error("Direct Link Error:", error);
    api.sendMessage(
      `❌ Failed to download audio: ${error.message || "Server might be busy"}`,
      event.threadID,
      event.messageID
    );
  }
};

module.exports._handleSearch = async function(api, event, query) {
  try {
    api.sendMessage(`🔍 Searching for "${query}"...`, event.threadID, event.messageID);

    const apiUrl = "https://api--dipto.repl.co"; // <-- unchanged
    const response = await axios.get(`${apiUrl}/ytFullSearch?songName=${encodeURIComponent(query)}`, {
      timeout: 20000
    });

    const results = Array.isArray(response.data) ? response.data.slice(0, 6) : (response.data && response.data.items ? response.data.items.slice(0,6) : []);

    if (!results || results.length === 0) {
      return api.sendMessage(
        `🔍 No results found for: "${query}"`,
        event.threadID,
        event.messageID
      );
    }

    let messageBody = "🎵 Search Results:\n\n";
    const choices = [];

    for (const [index, result] of results.entries()) {
      // accommodate different shapes
      const title = result.title || result.name || "Unknown Title";
      const time = result.time || result.duration || "Unknown";
      const channelName = (result.channel && result.channel.name) ? result.channel.name : (result.channelName || "Unknown Channel");
      const id = result.id || result.videoId || result.link || result.url || null;

      messageBody += `${index + 1}. ${title}\n⏱️ ${time} | 👤 ${channelName}\n\n`;
      choices.push({
        title,
        id,
        duration: time
      });
    }

    messageBody += "Reply with the number (1-6) to play the song";

    api.sendMessage(messageBody, event.threadID, (error, info) => {
      if (error) {
        console.error("send search results error:", error);
        return;
      }

      // register reply handler
      global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        choices
      });
    }, event.messageID);
  } catch (error) {
    console.error("Search Error:", error);
    api.sendMessage(
      "❌ Failed to search for songs. The service might be down or you're offline.",
      event.threadID,
      event.messageID
    );
  }
};

// reply handler (GoatBot will call this when someone replies to the search result)
module.exports.handleReply = async function({ api, event, Reply }) {
  try {
    // Reply is the object stored in global.GoatBot.onReply
    const choice = parseInt(event.body);
    const { choices, messageID } = Reply;

    if (isNaN(choice) || choice < 1 || choice > (choices ? choices.length : 0)) {
      return api.sendMessage(
        "🔢 Please reply with a number between 1 and " + (choices ? choices.length : 6),
        event.threadID,
        event.messageID
      );
    }

    // remove the search result message
    try { api.unsendMessage(messageID); } catch (e) { /* ignore if fails */ }

    const selected = choices[choice - 1];
    api.sendMessage(
      `⏳ Preparing: ${selected.title}\n⏱️ Duration: ${selected.duration || "Unknown"}`,
      event.threadID,
      event.messageID
    );

    // selected.id should be the video id — pass to direct handler
    return await this._handleDirectLink(api, event, selected.id);
  } catch (error) {
    console.error("Reply Error:", error);
    api.sendMessage(
      "❌ Failed to process your selection. The audio might be too large (max 25MB) or unavailable.",
      event.threadID,
      event.messageID
    );
  }
};

// alias for older systems that call onReply
module.exports.onReply = module.exports.handleReply;

module.exports._downloadFile = async function(url, outputPath) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'arraybuffer',
    timeout: 60000
  });

  await fs.writeFile(outputPath, response.data);
  return outputPath;
};
