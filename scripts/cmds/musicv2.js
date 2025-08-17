const axios = require("axios");
const fs = require("fs");
const path = require("path");

function deleteAfterTimeout(filePath, timeout = 60000) {
  setTimeout(() => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (!err) console.log(`🧹 Deleted file: ${filePath}`);
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

function parseDuration(durationStr) {
  const hoursMatch = durationStr.match(/(\d+)H/);
  const minutesMatch = durationStr.match(/(\d+)M/);
  const secondsMatch = durationStr.match(/(\d+)S/);
  const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
  const seconds = secondsMatch ? parseInt(secondsMatch[1]) : 0;
  return hours * 3600 + minutes * 60 + seconds;
}

// Backup API keys
const RAPID_API_KEY = "44a0d41bb0msh7963185219ba506p117328jsned41eee4c796";
const YOUTUBE_API_KEY = "AIzaSyAGQrBQYworsR7T2gu0nYhLPSsi2WFVrgQ";

module.exports = {
  config: {
    name: "musicv2",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Asif Mahmud",
    description: "YouTube music downloader with thumbnail and info",
    commandCategory: "Media",
    usages: "music <query> | music video <query>",
    cooldowns: 5,
  },

  run: async function ({ api, event, args }) {
    if (!args[0]) return api.sendMessage("🎵 Please enter a song name!", event.threadID);

    const isVideo = args[0].toLowerCase() === "video";
    const query = isVideo ? args.slice(1).join(" ") : args.join(" ");
    const processingMessage = await api.sendMessage(`🔍 Searching for "${query}"...`, event.threadID);

    try {
      // Search YouTube for the video
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=1&type=video&key=${YOUTUBE_API_KEY}`;
      const searchRes = await axios.get(searchUrl);
      
      if (!searchRes.data.items || searchRes.data.items.length === 0) {
        throw new Error("❌ Song not found.");
      }

      const video = searchRes.data.items[0];
      const videoId = video.id.videoId;
      const videoUrl = `https://youtu.be/${videoId}`;

      // Get video details
      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`;
      const detailsRes = await axios.get(detailsUrl);
      
      if (!detailsRes.data.items || detailsRes.data.items.length === 0) {
        throw new Error("❌ Video details not found.");
      }

      const details = detailsRes.data.items[0];
      const snippet = details.snippet;
      const contentDetails = details.contentDetails;
      const statistics = details.statistics;

      const title = snippet.title;
      const thumbnail = snippet.thumbnails.high.url;
      const durationISO = contentDetails.duration;
      const seconds = parseDuration(durationISO);
      const author = snippet.channelTitle;
      const views = statistics.viewCount;

      // Download thumbnail
      const thumbExt = thumbnail.endsWith(".png") ? "png" : "jpg";
      const thumbPath = path.join(__dirname, "cache", `${videoId}.${thumbExt}`);
      const thumbResponse = await axios.get(thumbnail, { responseType: "stream" });
      const thumbWriter = fs.createWriteStream(thumbPath);
      thumbResponse.data.pipe(thumbWriter);
      
      await new Promise((resolve, reject) => {
        thumbWriter.on("finish", resolve);
        thumbWriter.on("error", reject);
      });

      // Send video info with thumbnail
      await api.sendMessage({
        body: `🎵 ${isVideo ? "Video" : "Audio"} Information:\n\n` +
              `📌 Title: ${title}\n` +
              `📺 Channel: ${author}\n` +
              `👁️ Views: ${formatNumber(views)}\n` +
              `⏱️ Duration: ${formatDuration(seconds)}\n\n` +
              `🔗 ${videoUrl}`,
        attachment: fs.createReadStream(thumbPath)
      }, event.threadID);
      deleteAfterTimeout(thumbPath);

      // Prepare download based on media type
      let fileUrl, fileName;
      if (isVideo) {
        // Primary video download API
        try {
          const videoOptions = {
            method: 'GET',
            url: 'https://yt-api.p.rapidapi.com/dl',
            params: { id: videoId },
            headers: {
              'X-RapidAPI-Key': RAPID_API_KEY,
              'X-RapidAPI-Host': 'yt-api.p.rapidapi.com'
            }
          };
          
          const videoRes = await axios.request(videoOptions);
          if (!videoRes.data || videoRes.data.status !== 'ok') {
            throw new Error("Primary video API failed");
          }
          
          const formats = videoRes.data.formats;
          const videoFormat = formats.find(f => 
            f.qualityLabel === '720p' && f.hasVideo && f.hasAudio
          ) || formats.find(f => 
            f.hasVideo && f.hasAudio
          );
          
          if (!videoFormat) throw new Error("No suitable video format found");
          fileUrl = videoFormat.url;
          fileName = `${title.replace(/[^\w\s]/gi, '_').slice(0, 30)}.mp4`;
        } catch (primaryError) {
          console.log("Using backup video API...");
          // Backup video API
          const backupVideoOptions = {
            method: 'GET',
            url: 'https://youtube-video-download-info.p.rapidapi.com/dl',
            params: { id: videoId },
            headers: {
              'X-RapidAPI-Key': RAPID_API_KEY,
              'X-RapidAPI-Host': 'youtube-video-download-info.p.rapidapi.com'
            }
          };
          
          const backupRes = await axios.request(backupVideoOptions);
          const formats = backupRes.data.formats;
          if (!formats || formats.length === 0) {
            throw new Error("Backup video API failed - no formats available");
          }
          
          // Filter and sort by quality
          const videoFormats = formats.filter(f => f.container === 'mp4' && f.quality);
          if (videoFormats.length === 0) {
            throw new Error("No MP4 format found");
          }
          
          const qualityScores = {
            'hd1080': 1080,
            'hd720': 720,
            'large': 480,
            'medium': 360,
            'small': 240,
            'tiny': 144
          };
          
          videoFormats.forEach(f => { 
            f.score = qualityScores[f.quality] || 0; 
          });
          videoFormats.sort((a, b) => b.score - a.score);
          
          fileUrl = videoFormats[0].url;
          fileName = `${title.replace(/[^\w\s]/gi, '_').slice(0, 30)}.mp4`;
        }
      } else {
        // Primary audio download API
        try {
          const audioOptions = {
            method: 'GET',
            url: 'https://youtube-mp36.p.rapidapi.com/dl',
            params: { id: videoId },
            headers: {
              'X-RapidAPI-Key': RAPID_API_KEY,
              'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
            }
          };
          
          const audioRes = await axios.request(audioOptions);
          if (audioRes.data.status !== 'ok') {
            throw new Error("Primary audio API failed: " + audioRes.data.msg);
          }
          
          fileUrl = audioRes.data.link;
          fileName = `${title.replace(/[^\w\s]/gi, '_').slice(0, 30)}.mp3`;
        } catch (primaryError) {
          console.log("Using backup audio API...");
          // Backup audio API
          const backupAudioOptions = {
            method: 'GET',
            url: 'https://youtube-mp3-download1.p.rapidapi.com/v2/download',
            params: { id: videoId },
            headers: {
              'X-RapidAPI-Key': RAPID_API_KEY,
              'X-RapidAPI-Host': 'youtube-mp3-download1.p.rapidapi.com'
            }
          };
          
          const backupRes = await axios.request(backupAudioOptions);
          if (backupRes.data.status !== 'ok') {
            throw new Error("Backup audio API failed: " + (backupRes.data.msg || ''));
          }
          
          fileUrl = backupRes.data.link;
          fileName = `${title.replace(/[^\w\s]/gi, '_').slice(0, 30)}.mp3`;
        }
      }

      // Download media file
      const filePath = path.join(__dirname, "cache", fileName);
      const mediaRes = await axios({
        url: fileUrl,
        method: 'GET',
        responseType: 'stream'
      });
      
      const fileWriter = fs.createWriteStream(filePath);
      mediaRes.data.pipe(fileWriter);
      
      await new Promise((resolve, reject) => {
        fileWriter.on("finish", resolve);
        fileWriter.on("error", reject);
      });

      // Send media file
      api.setMessageReaction("✅", event.messageID, (err) => {}, true);
      await api.sendMessage({
        body: `✅ ${isVideo ? "Video" : "Music"} downloaded successfully!`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID);
      
      deleteAfterTimeout(filePath);

    } catch (err) {
      console.error(err);
      api.sendMessage(`❌ Error: ${err.message}`, event.threadID);
    } finally {
      api.unsendMessage(processingMessage.messageID);
    }
  },
};
