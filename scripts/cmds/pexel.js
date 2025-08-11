const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_KEY = "❌❌❌❌❌";

module.exports = {
  config: {
    name: "pexels",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑷𝒆𝒙𝒆𝒍𝒔 𝒕𝒉𝒆𝒌𝒆 𝒇𝒓𝒆𝒆 𝒇𝒐𝒕𝒐 𝒃𝒂 𝒗𝒊𝒅𝒆𝒐 𝒌𝒉𝒖𝒏𝒋𝒖𝒏",
    commandCategory: "media",
    usages: "pexels <query> | pexels video <query>",
    cooldowns: 3
  },

  run: async ({ api, event, args }) => {
    const isVideo = args[0] && args[0].toLowerCase() === "video";
    const query = isVideo ? args.slice(1).join(" ") : args.join(" ");
    if (!query) return api.sendMessage("🔎 𝑺𝒆𝒂𝒓𝒄𝒉 𝒌𝒆𝒚𝒘𝒐𝒓𝒅 𝒅𝒂𝒐 𝒃𝒉𝒂𝒊", event.threadID);

    const endpoint = isVideo
      ? `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=10`
      : `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5`;

    try {
      const res = await axios.get(endpoint, {
        headers: { Authorization: API_KEY }
      });

      if (isVideo) {
        const videos = res.data.videos;
        if (!videos.length) return api.sendMessage("❌ 𝑲𝒐𝒏𝒐 𝒗𝒊𝒅𝒆𝒐 𝒑𝒂𝒘𝒂 𝒈𝒆𝒍𝒐 𝒏𝒂𝒉𝒊", event.threadID);

        let msg = `🎬 𝑷𝒆𝒙𝒆𝒍𝒔 𝑽𝒊𝒅𝒆𝒐 𝑹𝒆𝒔𝒖𝒍𝒕𝒔:\n\n`;
        videos.forEach((vid, i) => {
          msg += `${i + 1}. 👤 ${vid.user.name || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏"}\n`;
        });
        msg += "\n👉 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 1–10 𝒓𝒆𝒑𝒍𝒚 𝒌𝒐𝒓𝒖𝒏";

        return api.sendMessage(msg, event.threadID, (err, info) => {
          global.client.handleReply.push({
            name: module.exports.config.name,
            type: "video",
            data: videos,
            messageID: info.messageID,
            author: event.senderID
          });
        });
      } else {
        const photos = res.data.photos;
        if (!photos.length) return api.sendMessage("❌ 𝑲𝒐𝒏𝒐 𝒇𝒐𝒕𝒐 𝒑𝒂𝒘𝒂 𝒈𝒆𝒍𝒐 𝒏𝒂𝒉𝒊", event.threadID);

        const files = [];

        for (let i = 0; i < photos.length; i++) {
          const pic = photos[i];
          const imageUrl = pic.src.medium;
          const ext = path.extname(imageUrl).split("?")[0] || ".jpg";
          const imagePath = path.join(__dirname, "cache", `pexels_${Date.now()}_${i}${ext}`);

          const imageRes = await axios({ url: imageUrl, responseType: "stream" });
          const writer = fs.createWriteStream(imagePath);

          await new Promise((resolve, reject) => {
            imageRes.data.pipe(writer);
            writer.on("finish", resolve);
            writer.on("error", reject);
          });

          files.push(fs.createReadStream(imagePath));
          setTimeout(() => fs.existsSync(imagePath) && fs.unlinkSync(imagePath), 10000);
        }

        return api.sendMessage({
          body: `📷 "${query}" 𝒆𝒓 𝒕𝒐𝒑 ${photos.length} 𝒕𝒊 𝒇𝒐𝒕𝒐`,
          attachment: files
        }, event.threadID);
      }

    } catch (err) {
      console.error(err);
      return api.sendMessage("❌ 𝑷𝒆𝒙𝒆𝒍𝒔 𝑨𝑷𝑰 𝒕𝒉𝒆𝒌𝒆 𝒆𝒓𝒓𝒐𝒓", event.threadID);
    }
  },

  handleReply: async ({ api, event, handleReply }) => {
    const { type, data, author } = handleReply;
    if (event.senderID !== author) return;

    const index = parseInt(event.body);
    if (isNaN(index) || index < 1 || index > data.length)
      return api.sendMessage("❗ 𝑺𝒂𝒕𝒊𝒌 𝒏𝒖𝒎𝒃𝒆𝒓 𝒅𝒂𝒐 (1–10)", event.threadID);

    const video = data[index - 1];
    const videoUrl = video.video_files.find(v => v.quality === "sd" || v.quality === "hd")?.link;
    const ext = ".mp4";
    const filePath = path.join(__dirname, "cache", `pexels_video_${Date.now()}${ext}`);

    try {
      const vidRes = await axios({ url: videoUrl, responseType: "stream" });
      const writer = fs.createWriteStream(filePath);

      await new Promise((resolve, reject) => {
        vidRes.data.pipe(writer);
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      await api.sendMessage({
        body: `🎬 𝑽𝒊𝒅𝒆𝒐 𝒃𝒚: ${video.user.name}`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => {
        setTimeout(() => fs.existsSync(filePath) && fs.unlinkSync(filePath), 10000);
      });
    } catch (err) {
      console.error("❌ 𝑽𝒊𝒅𝒆𝒐 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓:", err.message);
      api.sendMessage("❌ 𝑽𝒊𝒅𝒆𝒐 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓", event.threadID);
    }
  }
};
