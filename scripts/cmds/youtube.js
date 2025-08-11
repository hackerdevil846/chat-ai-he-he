const axios = require("axios");
const fs = require("fs");
const path = require("path");

// এই ফাংশনটি নির্দিষ্ট সময় পর ফাইল ডিলিট করার জন্য ব্যবহৃত হয়।
function deleteAfterTimeout(filePath, timeout = 10000) {
  setTimeout(() => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (!err) {
          // console.log(`✅ 𝑫𝒆𝒍𝒆𝒕𝒆𝒅 𝒇𝒊𝒍𝒆: ${filePath}`);
        } else {
          console.error(`❌ 𝑬𝒓𝒓𝒐𝒓 𝒅𝒆𝒍𝒆𝒕𝒊𝒏𝒈 𝒇𝒊𝒍𝒆: ${err.message}`);
        }
      });
    }
  }, timeout);
}

// এই ফাংশনটি ইউটিউব ভিডিওর সময়কালকে ফরম্যাট করে।
function formatDuration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  return `${hours > 0 ? hours + "h " : ""}${minutes}m ${seconds}s`;
}

module.exports = {
  config: {
    name: "youtube",
    version: "2.2.4",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝒀𝒐𝒖𝑻𝒖𝒃𝒆 𝒗𝒊𝒅𝒆𝒐 𝒔𝒆𝒂𝒓𝒄𝒉 𝒌𝒐𝒓𝒖𝒏 𝒆𝒃𝒐𝒏 𝒃𝒊𝒔𝒉𝒐𝒅 𝒕𝒉𝒐𝒕𝒉𝒚𝒐 𝒑𝒂𝒂𝒏",
    commandCategory: "𝑺𝒆𝒂𝒓𝒄𝒉",
    usages: "[video_name]",
    cooldowns: 5,
  },

  run: async function ({ api, event, args }) {
    const API_KEY = "AIzaSyADpSxJUqNEFYA3idvoYjT2F_sWB3UjOSA"; // 𝑨𝑷𝑰 𝑲𝒆𝒚 𝒆𝒌𝒉𝒂𝒏𝒆 𝒅𝒊𝒃𝒆𝒏

    if (args.length === 0) {
      return api.sendMessage("⚠️ 𝑽𝒊𝒅𝒆𝒐 𝒏𝒂𝒎 𝒕𝒐 𝒅𝒂𝒐 𝒏𝒂! 😒", event.threadID, event.messageID);
    }

    const videoName = args.join(" ");

    try {
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(videoName)}&maxResults=7&type=video&key=${API_KEY}`;
      const searchResponse = await axios.get(searchUrl);

      if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
        throw new Error("❌ 𝑲𝒊𝒄𝒉𝒖 𝒑𝒂𝒘𝒂 𝒈𝒆𝒍𝒐 𝒏𝒂! 𝑽𝒊𝒅𝒆𝒐 𝒏𝒂𝒎 𝒔𝒂𝒕𝒉𝒊𝒌 𝒅𝒂𝒐. 😑");
      }

      let message = "🎬 **𝑺𝒆𝒂𝒓𝒄𝒉 𝑹𝒆𝒔𝒖𝒍𝒕𝒔:**\n";
      searchResponse.data.items.forEach((video, index) => {
        message += `\n${index + 1}. ${video.snippet.title}`;
      });

      message += "\n\n🧐 **𝟏-𝟕 𝒕𝒉𝒆𝒌𝒆 𝒆𝒌𝒕𝒂 𝒏𝒖𝒎𝒃𝒆𝒓 𝒃𝒂𝒄𝒉𝒂𝒊 𝒌𝒐𝒓𝒖𝒏 𝒗𝒊𝒅𝒆𝒐 𝒅𝒆𝒕𝒂𝒊𝒍𝒔 𝒑𝒂𝒂𝒓 𝒋𝒐𝒏𝒏𝒐.**";

      return api.sendMessage(message, event.threadID, (err, info) => {
        if (err) return console.error(err);
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          data: searchResponse.data.items,
          API_KEY: API_KEY
        });
      });

    } catch (error) {
      console.error(`❌ 𝑬𝒓𝒓𝒐𝒓: ${error.message}`);
      let errorMessage = `❌ একটি ত্রুটি ঘটেছে: ${error.message} 😢`;
      if (error.response && error.response.data && error.response.data.error.message) {
          errorMessage = `❌ API Error: ${error.response.data.error.message}`;
      }
      return api.sendMessage(errorMessage, event.threadID, event.messageID);
    }
  },

  handleReply: async function ({ api, event, handleReply }) {
    const { author, data, API_KEY } = handleReply;
    if (event.senderID !== author) return;

    const choice = parseInt(event.body.trim());
    if (isNaN(choice) || choice < 1 || choice > data.length) {
      return api.sendMessage("⚠️ 𝙎𝙖𝙩𝙝𝙞𝙠 𝙣𝙖𝙢𝙗𝙖𝙧 𝒅𝒂𝒐! (1 থেকে 7 এর মধ্যে) 😠", event.threadID, event.messageID);
    }
    
    api.unsendMessage(handleReply.messageID).catch(e => console.log(e));

    const video = data[choice - 1];
    const videoId = video.id.videoId;

    try {
      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoId}&key=${API_KEY}`;
      const detailsResponse = await axios.get(detailsUrl);
      const details = detailsResponse.data.items[0];

      const title = video.snippet.title;
      const channelTitle = video.snippet.channelTitle;
      const thumbnailUrl = video.snippet.thumbnails.high.url;
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const likes = details.statistics.likeCount ? Number(details.statistics.likeCount).toLocaleString() : "N/A";
      const comments = details.statistics.commentCount ? Number(details.statistics.commentCount).toLocaleString() : "N/A";
      const duration = formatDuration(details.contentDetails.duration);

      const ext = path.extname(thumbnailUrl) || ".jpg";
      const imgPath = path.join(__dirname, "cache", `${videoId}${ext}`);
      
      const imgRes = await axios({ url: thumbnailUrl, responseType: "stream" });
      const stream = fs.createWriteStream(imgPath);

      await new Promise((resolve, reject) => {
        imgRes.data.pipe(stream);
        stream.on("finish", resolve);
        stream.on("error", reject);
      });

      // প্রথম মেসেজ: শুধুমাত্র ভিডিওর লিঙ্ক
      await api.sendMessage(`🔗 ${videoUrl}`, event.threadID);

      // দ্বিতীয় মেসেজ: থাম্বনেইলসহ ভিডিওর বিস্তারিত তথ্য
      const messageBody = `🎬 **𝑻𝒊𝒕𝒍𝒆:** ${title}\n📺 **𝑪𝒉𝒂𝒏𝒏𝒆𝒍:** ${channelTitle}\n👍 **𝑳𝒊𝒌𝒆𝒔:** ${likes}\n💬 **𝑪𝒐𝒎𝒎𝒆𝒏𝒕𝒔:** ${comments}\n⏳ **𝑫𝒖𝒓𝒂𝒕𝒊𝒐𝒏:** ${duration}`;
      
      await api.sendMessage({
        body: messageBody,
        attachment: fs.createReadStream(imgPath),
      }, event.threadID);

      deleteAfterTimeout(imgPath, 10000); // ১০ সেকেন্ড পর ফাইল ডিলিট হবে

    } catch (err) {
      console.error("❌ 𝑫𝒆𝒕𝒂𝒊𝒍𝒔 𝑬𝒓𝒓𝒐𝒓:", err.message);
      return api.sendMessage("❌ 𝑽𝒊𝒅𝒆𝒐 𝒅𝒆𝒕𝒂𝒊𝒍𝒔 𝒏𝒊𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊 𝒏𝒂.", event.threadID);
    }
  }
};
