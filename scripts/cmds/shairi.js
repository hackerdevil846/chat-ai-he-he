const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');

module.exports.config = {
  name: "shairi",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Send a shairi video stream",
  commandCategory: "entertainment",
  usages: "",
  cooldowns: 10,
  dependencies: {
    "ytdl-core": ""
  }
};

module.exports.languages = {
  "en": {
    downloading: "📥 Downloading shairi video... Please wait 10-20 seconds!",
    errorNoFormat: "❌ No suitable video format found",
    errorDownload: "❌ Video download failed",
    sendingVideo: "🎬《 SHAIRI VIDEO 》\nEnjoy the video!",
    errorCatch: "❌ Error: {error}\n\nPlease try again later!"
  }
};

module.exports.run = async function({ api, event }) {
  try {
    const videoURL = "https://youtu.be/v7v3TTWaaWU";
    const tempPath = path.join(__dirname, 'shairi_temp.mp4');

    // Notify user
    await api.sendMessage(module.exports.languages.en.downloading, event.threadID, event.messageID);

    // Get video info
    const info = await ytdl.getInfo(videoURL);
    const format = ytdl.chooseFormat(info.formats, { 
      quality: 'highest',
      filter: f => f.container === 'mp4' && f.hasVideo
    });

    if (!format) throw new Error(module.exports.languages.en.errorNoFormat);

    // Create write stream
    const fileStream = fs.createWriteStream(tempPath);
    const videoStream = ytdl.downloadFromInfo(info, { format: format });

    // Progress tracking
    let downloaded = 0;
    const totalBytes = parseInt(format.contentLength, 10) || 0;
    videoStream.on('data', chunk => {
      downloaded += chunk.length;
      if (totalBytes) {
        const percent = Math.floor((downloaded / totalBytes) * 100);
        if (percent % 20 === 0) {
          api.sendMessage(`⬇️ Downloading... ${percent}% complete`, event.threadID);
        }
      }
    });

    videoStream.pipe(fileStream);

    await new Promise((resolve, reject) => {
      fileStream.on('finish', resolve);
      fileStream.on('error', reject);
      videoStream.on('error', reject);
    });

    if (!fs.existsSync(tempPath)) throw new Error(module.exports.languages.en.errorDownload);

    // Send video
    await api.sendMessage({
      body: module.exports.languages.en.sendingVideo,
      attachment: fs.createReadStream(tempPath)
    }, event.threadID, event.messageID);

    // Cleanup
    fs.unlink(tempPath, err => {
      if (err) console.error("Cleanup error:", err);
    });

  } catch (error) {
    console.error("Shairi Command Error:", error);
    api.sendMessage(module.exports.languages.en.errorCatch.replace("{error}", error.message || "Unknown"), event.threadID, event.messageID);
  }
};
