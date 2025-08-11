const axios = require("axios");
const fs = require("fs");
const path = require("path");

function deleteAfterTimeout(filePath, timeout = 60000) {
  setTimeout(() => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (!err) console.log(`🧹 𝐷𝑒𝑙𝑒𝑡𝑒𝑑 𝑓𝑖𝑙𝑒: ${filePath}`);
      });
    }
  }, timeout);
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}𝑚 ${secs}𝑠`;
}

module.exports = {
  config: {
    name: "music",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝒀𝒐𝒖𝑻𝒖𝒃𝒆 𝒕𝒉𝒆𝒌𝒆 𝒎𝒖𝒔𝒊𝒄 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒆𝒏 𝒘𝒊𝒕𝒉 𝒕𝒉𝒖𝒎𝒃𝒏𝒂𝒊𝒍 𝒂𝒏𝒅 𝒊𝒏𝒇𝒐",
    commandCategory: "𝑀𝑒𝑑𝑖𝑎",
    usages: "𝒎𝒖𝒔𝒊𝒄 <𝒒𝒖𝒆𝒓𝒚> | 𝒎𝒖𝒔𝒊𝒄 𝒗𝒊𝒅𝒆𝒐 <𝒒𝒖𝒆𝒓𝒚>",
    cooldowns: 5,
  },

  run: async function ({ api, event, args }) {
    if (!args[0]) return api.sendMessage("🎵 𝒈𝒂𝒏𝒂 𝒌𝒂 𝒏𝒂𝒂𝒎 𝒕𝒐 𝒍𝒊𝒌𝒉𝒐! 😑", event.threadID);

    const isVideo = args[0].toLowerCase() === "video";
    const query = isVideo ? args.slice(1).join(" ") : args.join(" ");
    const processingMessage = await api.sendMessage(`🔍 "${query}" 𝒌𝒉𝒖𝒋𝒕𝒆𝒔𝒆...`, event.threadID);

    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=1&type=video&key=AIzaSyAGQrBQYworsR7T2gu0nYhLPSsi2WFVrgQ`;

    try {
      const searchRes = await axios.get(searchUrl);
      if (!searchRes.data.items.length) throw new Error("❌ 𝒈𝒂𝒂𝒏 𝒑𝒂𝒐𝒂 𝒋𝒂𝒚𝒏𝒊.");

      const video = searchRes.data.items[0];
      const videoId = video.id.videoId;
      const videoUrl = `https://youtu.be/${videoId}`;

      const apiUrl = isVideo
        ? `https://dev-priyanshi.onrender.com/api/ytmp4dl?url=${encodeURIComponent(videoUrl)}&quality=480`
        : `https://dev-priyanshi.onrender.com/api/ytmp3dl?url=${encodeURIComponent(videoUrl)}&quality=128`;

      const dataRes = await axios.get(apiUrl);
      const { metadata, download } = dataRes.data.data;

      const {
        title,
        thumbnail,
        duration,
        author,
        views,
        seconds
      } = metadata;

      const thumbUrl = thumbnail;
      const thumbExt = thumbUrl.endsWith(".png") ? "png" : "jpg";
      const thumbPath = path.join(__dirname, "cache", `${videoId}.${thumbExt}`);

      const thumbStream = fs.createWriteStream(thumbPath);
      const thumbDownload = await axios({ url: thumbUrl, responseType: "stream" });
      await new Promise((resolve, reject) => {
        thumbDownload.data.pipe(thumbStream);
        thumbStream.on("finish", resolve);
        thumbStream.on("error", reject);
      });

      await api.sendMessage({
        body:
          `🎵 ${isVideo ? "𝒗𝒊𝒅𝒆𝒐" : "𝒂𝒖𝒅𝒊𝒐"} 𝒋𝒂𝒏𝒌𝒂𝒓𝒊:\n\n` +
          `📌 𝒔𝒉𝒊𝒓𝒔𝒉𝒐𝒌: ${title}\n` +
          `📺 𝒄𝒉𝒂𝒏𝒏𝒆𝒍: ${author.name}\n` +
          `👁️ 𝒅𝒆𝒌𝒉𝒂: ${formatNumber(views)}\n` +
          `⏱️ 𝒔𝒐𝒎𝒐𝒚: ${formatDuration(seconds)}\n\n` +
          `🔗 ${videoUrl}`,
        attachment: fs.createReadStream(thumbPath),
      }, event.threadID, () => deleteAfterTimeout(thumbPath), event.messageID);

      const fileUrl = download.url;
      const format = isVideo ? "mp4" : "mp3";
      const safeTitle = title.replace(/[^\w\s]/gi, "_").slice(0, 30);
      const filePath = path.join(__dirname, "cache", `${safeTitle}.${format}`);

      const mediaRes = await axios({
        url: fileUrl,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(filePath);
      mediaRes.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      await api.sendMessage({
        attachment: fs.createReadStream(filePath),
      }, event.threadID, event.messageID);

      deleteAfterTimeout(filePath, 60000);

    } catch (err) {
      console.error(err.message);
      api.sendMessage(`❌ 𝒆𝒓𝒓𝒐𝒓: ${err.message}`, event.threadID, event.messageID);
    }
  },
};
