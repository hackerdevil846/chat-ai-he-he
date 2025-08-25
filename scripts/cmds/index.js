const { Innertube } = require('youtubei.js');
const https = require('https');
const http = require('http');

module.exports.config = {
  name: "shairi",
  version: "3.1.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🎬 Send a beautiful Shairi video from YouTube or any custom link",
  category: "media",
  usages: "[YouTube Link]",
  cooldowns: 10,
  dependencies: {
    "youtubei.js": ""
  },
  envConfig: {}
};

module.exports.languages = {
  "en": {
    downloading: "📥 Downloading video... Please wait!",
    errorNoFormat: "❌ No suitable video format found",
    errorDownload: "❌ Video download failed",
    sendingVideo: "🎬《 VIDEO READY 》\nEnjoy! 🌹",
    errorCatch: "❌ Error: {error}\n\nPlease try again later!",
    invalidLink: "❌ Invalid YouTube link!"
  }
};

let youtube;
const DEFAULT_URL = "https://youtu.be/v7v3TTWaaWU";

// Initialize YouTube client
async function initYouTube() {
  try {
    youtube = await Innertube.create();
    console.log('✅ YouTube client initialized successfully');
  } catch (err) {
    console.error('❌ Failed to initialize YouTube client:', err);
  }
}

async function getVideoInfo(videoId) {
  try {
    if (!youtube) await initYouTube();

    const info = await youtube.getInfo(videoId);
    const formats = info.streaming_data?.formats || [];
    const adaptive = info.streaming_data?.adaptive_formats || [];
    const allFormats = [...formats, ...adaptive];

    const videoFormats = allFormats.filter(f =>
      f.mime_type?.includes('video/mp4') && f.has_audio !== false
    );

    if (!videoFormats.length) throw new Error("No suitable video format found");

    videoFormats.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
    const selected = videoFormats[0];

    return {
      title: info.basic_info.title,
      duration: info.basic_info.duration?.seconds_total,
      thumbnail: info.basic_info.thumbnail?.[0]?.url,
      downloadUrl: await selected.decipher(youtube.session.player)
    };
  } catch (err) {
    console.error('❌ Error getting video info:', err);
    throw err;
  }
}

function extractVideoId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

module.exports.onStart = async function ({ api, event, args }) {
  try {
    // Use user-provided URL if available, else default
    const inputUrl = args[0] ? args[0] : DEFAULT_URL;
    const videoId = extractVideoId(inputUrl);

    if (!videoId)
      return api.sendMessage(module.exports.languages.en.invalidLink, event.threadID, event.messageID);

    // Send downloading message
    await api.sendMessage(module.exports.languages.en.downloading, event.threadID);

    // Fetch video info
    const videoInfo = await getVideoInfo(videoId);
    const protocol = videoInfo.downloadUrl.startsWith('https:') ? https : http;

    protocol.get(videoInfo.downloadUrl, (response) => {
      if (response.statusCode !== 200) {
        return api.sendMessage(module.exports.languages.en.errorDownload, event.threadID, event.messageID);
      }

      // Send video as attachment
      api.sendMessage({
        body: `🎬《 VIDEO READY 》\nTitle: ${videoInfo.title}\nDuration: ${videoInfo.duration}s\nEnjoy! 🌹`,
        attachment: response
      }, event.threadID);
    }).on('error', (err) => {
      console.error('❌ Video download error:', err);
      api.sendMessage(`${module.exports.languages.en.errorDownload}\n${err.message}`, event.threadID, event.messageID);
    });

  } catch (error) {
    console.error('❌ Shairi command error:', error);
    api.sendMessage(module.exports.languages.en.errorCatch.replace('{error}', error.message), event.threadID, event.messageID);
  }
};
