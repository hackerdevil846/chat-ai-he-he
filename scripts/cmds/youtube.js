const axios = require("axios");

module.exports.config = {
  name: "youtube",
  version: "2.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: 
    `Search & download YouTube video/audio with quality & reply select

Usage example:
!youtube mp3 love song 128kbps
!youtube mp4 BTS Dynamite 360p

How to use:
1. Type !youtube mp3|mp4 <search terms> [quality]
2. Bot shows 5-7 search results with numbers.
3. Reply with a number (1-7) to download selected file.
4. Bot sends the audio/video stream as attachment.`,

  category: "media",
  usages: "mp3|mp4 <search terms> [quality]",
  cooldowns: 5,
  usePrefix: true
};

const API_URL = "https://asif-youtube-api.onrender.com";  // তোমার API URL এখানে বসাবে
const API_KEY = "mysecret123";  // তোমার API KEY এখানে বসাবে

const MAX_RESULTS = 7;

let searchResults = {}; // store per threadID

module.exports.onStart = async function ({ api, event, args }) {
  try {
    const threadID = event.threadID;

    if (!args.length) {
      return api.sendMessage("❌ Usage: !youtube mp3|mp4 <search terms> [quality]", threadID, event.messageID);
    }

    const typeArg = args[0].toLowerCase();
    if (typeArg !== "mp3" && typeArg !== "mp4") {
      return api.sendMessage("❌ First argument must be 'mp3' or 'mp4'", threadID, event.messageID);
    }

    let qualityArg = "";
    if (args.length > 2) {
      const lastArg = args[args.length - 1].toLowerCase();
      if (/^\d+(p|kbps)$/.test(lastArg)) {
        qualityArg = lastArg;
        args.pop();
      }
    }

    const searchQuery = args.slice(1).join(" ");
    if (!searchQuery) {
      return api.sendMessage("❌ Please provide search terms.", threadID, event.messageID);
    }

    // Search YouTube videos via API
    const searchRes = await axios.get(`${API_URL}/search`, {
      params: { q: searchQuery, api_key: API_KEY }
    });

    if (!searchRes.data || !searchRes.data.videos || searchRes.data.videos.length === 0) {
      return api.sendMessage("❌ No videos found.", threadID, event.messageID);
    }

    const videos = searchRes.data.videos.slice(0, MAX_RESULTS);
    searchResults[threadID] = { videos, type: typeArg, quality: qualityArg };

    let msg = `🔍 Search results for "${searchQuery}":\n\n`;
    videos.forEach((v, i) => {
      msg += `${i + 1}. ${v.title} [${v.duration}]\n`;
    });
    msg += `\nReply with a number (1-${videos.length}) to download as ${typeArg.toUpperCase()} ${qualityArg || "default"}`;

    return api.sendMessage(msg, threadID, event.messageID);

  } catch (e) {
    console.error(e);
    return api.sendMessage("⚠️ Error: " + (e.message || "Unknown error"), event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function ({ api, event }) {
  try {
    const threadID = event.threadID;
    const message = event.body.trim();

    if (!searchResults[threadID]) return;

    const { videos, type, quality } = searchResults[threadID];

    if (!/^\d+$/.test(message)) return;

    const choice = parseInt(message, 10) - 1;
    if (choice < 0 || choice >= videos.length) {
      return api.sendMessage(`❌ Invalid choice. Please reply with a number between 1 and ${videos.length}`, threadID, event.messageID);
    }

    const video = videos[choice];
    const videoId = video.videoId;

    delete searchResults[threadID];

    // Fetch download info
    const downloadRes = await axios.get(`${API_URL}/download`, {
      params: {
        id: videoId,
        type,
        quality,
        api_key: API_KEY
      }
    });

    if (!downloadRes.data || !downloadRes.data.downloadLink) {
      return api.sendMessage("❌ Download link not found.", threadID, event.messageID);
    }

    const { title, downloadLink } = downloadRes.data;

    // Try to send stream as attachment
    try {
      const stream = await getStream(downloadLink, `${title}.${type}`);
      return api.sendMessage({ body: `🎬 ${title}`, attachment: stream }, threadID, event.messageID);
    } catch (err) {
      // On fail send download link as fallback
      return api.sendMessage(`🎬 ${title}\nDownload Link: ${downloadLink}`, threadID, event.messageID);
    }

  } catch (err) {
    console.error(err);
    return api.sendMessage("⚠️ Error: " + (err.message || "Unknown error"), event.threadID, event.messageID);
  }
};

const axiosStream = require("axios");

async function getStream(url, filename) {
  const response = await axiosStream.get(url, { responseType: "stream" });
  response.data.path = filename;
  return response.data;
}
