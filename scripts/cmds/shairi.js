const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "shairi",
  version: "3.0.3",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 (Updated by Manus AI)",
  description: "Send a shairi video stream using Asif Shairi API",
  commandCategory: "entertainment",
  usages: "",
  cooldowns: 10,
};

module.exports.languages = {
  en: {
    fetching: "📥 Fetching shairi video... Please wait!",
    errorFetch: "❌ Failed to fetch video from API",
    sendingVideo: "🎬《 SHAIRI VIDEO 》\nEnjoy the video!",
    errorCatch: "❌ Error: {error}\n\nPlease try again later!",
    success: "✅ Video processed successfully!",
  },
};

module.exports.run = async function ({ api, event }) {
  try {
    // Notify user
    await api.sendMessage(
      module.exports.languages.en.fetching,
      event.threadID,
      event.messageID
    );

    const tempPath = path.join(__dirname, "shairi_temp.mp4");

    // Fetch video from API
    const response = await axios.get("https://asif-shairi-video-api.onrender.com", {
      responseType: "stream",
    });

    if (response.status !== 200) {
      throw new Error(module.exports.languages.en.errorFetch);
    }

    // Save video to temp path
    const writer = fs.createWriteStream(tempPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // Send video
    await api.sendMessage(
      {
        body: module.exports.languages.en.sendingVideo,
        attachment: fs.createReadStream(tempPath),
      },
      event.threadID,
      event.messageID
    );

    // Cleanup
    fs.unlink(tempPath, (err) => {
      if (err) console.error("Cleanup error:", err);
    });
  } catch (error) {
    console.error("Shairi Command Error:", error);
    api.sendMessage(
      module.exports.languages.en.errorCatch.replace(
        "{error}",
        error.message || "Unknown"
      ),
      event.threadID,
      event.messageID
    );
  }
};
