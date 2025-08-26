const axios = require("axios");
const fs = require("fs");
const path = require("path");
const util = require("util");

const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);

module.exports.config = {
  name: "shoti",
  version: "2.0.2",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Send random TikTok short videos",
  category: "entertainment",
  usages: "",
  cooldowns: 10,
  dependencies: { "axios": "" },
  envConfig: {}
};

module.exports.languages = {
  "en": {},
  "vi": {}
};

module.exports.onLoad = function () {
  // Optional: Initialization logic here if needed
};

module.exports.onStart = async function ({ api, event, args }) {
  try {
    // Fetch API config
    const apiConfig = await axios.get(
      "https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json",
      { timeout: 10000 }
    );

    const shotiAPI = apiConfig.data.alldl + "/api/shoti";
    const response = await axios.get(shotiAPI, { timeout: 15000 });
    let videoData = response.data;

    if (Array.isArray(videoData)) {
      if (videoData.length === 0)
        return api.sendMessage(
          "❌ Currently no videos available. Try again later.",
          event.threadID,
          event.messageID
        );
      videoData = videoData[Math.floor(Math.random() * videoData.length)];
    }

    const videoUrl = videoData.shotiurl || videoData.url;
    if (!videoUrl)
      return api.sendMessage(
        "⚠️ Invalid video API response. Please report this issue.",
        event.threadID,
        event.messageID
      );

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const fileName = `shoti_${Date.now()}.mp4`;
    const filePath = path.join(cacheDir, fileName);

    const videoRes = await axios.get(videoUrl, {
      responseType: "arraybuffer",
      timeout: 45000
    });

    await writeFile(filePath, Buffer.from(videoRes.data, "binary"));

    const caption = `✨ 𝗦𝗛𝗢𝗧𝗜 𝗩𝗜𝗗𝗘𝗢 ✨
━━━━━━━━━━━━━━━
🎬 𝗧𝗶𝘁𝗹𝗲: ${videoData.title || "N/A"}
👤 𝗨𝘀𝗲𝗿: @${videoData.username || "N/A"}
📛 𝗡𝗶𝗰𝗸𝗻𝗮𝗺𝗲: ${videoData.nickname || "N/A"}
🌍 𝗥𝗲𝗴𝗶𝗼𝗻: ${videoData.region || "N/A"}
⏱️ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${videoData.duration || "N/A"} seconds
━━━━━━━━━━━━━━━
💬 𝗖𝗼𝗺𝗺𝗲𝗻𝘁: "😍" to request more!`;

    await api.sendMessage(
      { body: caption, attachment: fs.createReadStream(filePath) },
      event.threadID,
      event.messageID
    );

    await unlink(filePath);
  } catch (error) {
    console.error("Shoti Command Error:", error);

    let userMessage = "❌ An error occurred while processing your request.";
    if (error.code === "ECONNABORTED")
      userMessage = "⚠️ The request timed out. Please try again later.";
    else if (error.response && error.response.status >= 500)
      userMessage = "❌ API server error. Please try again later.";
    else if (error.message.includes("ENOENT"))
      userMessage = "⚠️ File system error. Please contact admin.";

    api.sendMessage(userMessage, event.threadID, event.messageID);
  }
};
