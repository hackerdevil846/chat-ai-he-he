const fs = require('fs');
const path = require('path');
const { Innertube } = require('youtubei.js');

// Initialize YouTube client
let youtube;

async function initYouTube() {
  try {
    if (!youtube) {
      youtube = await Innertube.create();
      console.log('YouTube client initialized successfully');
    }
    return youtube;
  } catch (error) {
    console.error('Failed to initialize YouTube client:', error);
    throw error;
  }
}

module.exports.config = {
  name: "shairi",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Send a shairi video stream using youtubei.js",
  commandCategory: "entertainment",
  usages: "",
  cooldowns: 10,
  dependencies: {
    "youtubei.js": "^15.0.1"
  }
};

module.exports.languages = {
  "en": {
    downloading: "📥 Downloading shairi video... Please wait!",
    errorNoFormat: "❌ No suitable video format found",
    errorDownload: "❌ Video download failed",
    sendingVideo: "🎬《 SHAIRI VIDEO 》\nEnjoy the video!",
    errorCatch: "❌ Error: {error}\n\nPlease try again later!",
    success: "✅ Video processed successfully!"
  }
};

// Extract video ID from YouTube URL
function extractVideoId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Helper function to get video info and download URL
async function getVideoDownloadInfo(videoId) {
  try {
    const yt = await initYouTube();
    
    const info = await yt.getInfo(videoId);
    
    // Get the best quality format
    const formats = info.streaming_data?.formats || [];
    const adaptiveFormats = info.streaming_data?.adaptive_formats || [];
    
    // Combine all formats and find the best video format
    const allFormats = [...formats, ...adaptiveFormats];
    
    // Filter for video formats with audio (mp4 preferred)
    const videoFormats = allFormats.filter(format => 
      format.mime_type?.includes('video/mp4') && 
      format.has_audio !== false
    );
    
    if (videoFormats.length === 0) {
      throw new Error('No suitable video format found');
    }
    
    // Sort by quality (higher quality first)
    videoFormats.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
    
    const selectedFormat = videoFormats[0];
    
    return {
      title: info.basic_info.title,
      duration: info.basic_info.duration?.seconds_total,
      downloadUrl: selectedFormat.decipher(yt.session.player),
      format: selectedFormat,
      thumbnail: info.basic_info.thumbnail?.[0]?.url
    };
  } catch (error) {
    console.error('Error getting video info:', error);
    throw error;
  }
}

module.exports.run = async function({ api, event }) {
  try {
    const videoURL = "https://youtu.be/v7v3TTWaaWU";
    const tempPath = path.join(__dirname, 'shairi_temp.mp4');

    // Notify user
    await api.sendMessage(module.exports.languages.en.downloading, event.threadID, event.messageID);

    // Extract video ID
    const videoId = extractVideoId(videoURL);
    if (!videoId) {
      throw new Error('Invalid video URL');
    }

    // Get video info and download URL
    const videoInfo = await getVideoDownloadInfo(videoId);

    // Progress tracking
    let downloaded = 0;
    let progressSent = 0;

    // Download the video
    const https = require('https');
    const http = require('http');
    
    const protocol = videoInfo.downloadUrl.startsWith('https:') ? https : http;
    const fileStream = fs.createWriteStream(tempPath);

    await new Promise((resolve, reject) => {
      const request = protocol.get(videoInfo.downloadUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
          return;
        }

        const totalBytes = parseInt(response.headers['content-length'], 10) || 0;

        response.on('data', chunk => {
          downloaded += chunk.length;
          if (totalBytes) {
            const percent = Math.floor((downloaded / totalBytes) * 100);
            if (percent >= progressSent + 20 && percent <= 100) {
              progressSent = percent;
              api.sendMessage(`⬇️ Downloading... ${percent}% complete`, event.threadID);
            }
          }
        });

        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });

        fileStream.on('error', reject);
        response.on('error', reject);
      });

      request.on('error', reject);
    });

    if (!fs.existsSync(tempPath)) {
      throw new Error(module.exports.languages.en.errorDownload);
    }

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
    api.sendMessage(
      module.exports.languages.en.errorCatch.replace("{error}", error.message || "Unknown"), 
      event.threadID, 
      event.messageID
    );
  }
};

// Additional utility functions for direct use
module.exports.getVideoInfo = getVideoDownloadInfo;
module.exports.extractVideoId = extractVideoId;
module.exports.initYouTube = initYouTube;

