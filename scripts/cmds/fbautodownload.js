const axios = require("axios");
const fs = require("fs-extra");
const tempy = require("tempy");

module.exports.config = {
  name: "fbautodownload",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "✨ Automatically download Facebook videos from shared links (auto event handler)",
  commandCategory: "utility",
  category: "media",
  usages: "[fb_video_url] (or just send a facebook link to the chat)",
  cooldowns: 5,
  dependencies: {
    "priyansh-all-dl": "",
    "axios": "",
    "fs-extra": "",
    "tempy": ""
  }
};

module.exports.languages = {
  "en": {
    "noLink": "❌ | No Facebook link detected.",
    "downloading": "🔄 | Downloading your video... Please wait.",
    "noQuality": "❌ | No downloadable video quality found.",
    "success": "✨ Successfully downloaded video!",
    "failed": "❌ | Download failed!"
  },
  "bn": {
    "noLink": "❌ | Facebook লিংক পাওয়া যায়নি।",
    "downloading": "🔄 | ভিডিও ডাউনলোড করা হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন।",
    "noQuality": "❌ | ডাউনলোড করার মতো ভিডিও কোয়ালিটি পাওয়া যায়নি।",
    "success": "✨ সফলভাবে ভিডিও ডাউনলোড হয়েছে!",
    "failed": "❌ | ডাউনলোড ব্যর্থ হয়েছে!"
  }
};

module.exports.onLoad = function() {
  // Nothing special to do on load now, kept for future use.
  return;
};

/**
 * When user explicitly runs the command (optional). We keep behavior similar to original: tell user
 * they don't have to run it — just send a facebook link and the bot will auto-download.
 */
module.exports.run = async function({ api, event }) {
  try {
    const msg = `🎭 | This command is event-driven — just send a Facebook video link in the chat and I'll download it automatically!\n✦ Creator: ${module.exports.config.credits}`;
    return api.sendMessage(msg, event.threadID, event.messageID);
  } catch (e) {
    console.error(e);
  }
};

/**
 * Global event handler: listens for messages that contain Facebook links and downloads videos.
 * Uses dynamic import() for `priyansh-all-dl` so we don't `require()` an ESM module (avoids ERR_REQUIRE_ASYNC_MODULE).
 */
module.exports.handleEvent = async function({ api, event }) {
  try {
    if (!event || event.type !== "message" || !event.body) return;

    // Basic FB link detection (keeps same logic as original but supports more patterns)
    const fbRegex = /(https?:\/\/(?:www\.)?facebook\.com\/(?:watch|reel|video|videos|story|share)\/[\w\-\=\?&%#:\/.]+)/i;
    const match = event.body.match(fbRegex);
    if (!match) return; // not a facebook link

    const link = match[0];

    // Inform user
    await api.sendMessage(`🔄 | ${module.exports.languages.en.downloading}`, event.threadID, event.messageID);

    // Dynamic import to avoid ESM require issues (top-level-await in dependency)
    const dlModule = await import('priyansh-all-dl');
    // Support both default and named export
    const downloadVideo = dlModule.downloadVideo || dlModule.default?.downloadVideo || dlModule.default || dlModule;

    // If downloadVideo is a function on the import, call it appropriately
    let videoInfo;
    if (typeof downloadVideo === 'function') {
      videoInfo = await downloadVideo(link);
    } else if (typeof dlModule.default === 'function') {
      // fallback if module itself is the function
      videoInfo = await dlModule.default(link);
    } else if (typeof dlModule.downloadVideo === 'function') {
      videoInfo = await dlModule.downloadVideo(link);
    } else {
      throw new Error('downloadVideo function not found in priyansh-all-dl module');
    }

    // videoInfo expected structure: keys like "720p","480p" or direct url strings. Keep original priority.
    const qualityPriority = ["720p", "480p", "360p", "240p"];
    let chosenQualityKey = null;

    // If videoInfo is an object with quality keys
    if (videoInfo && typeof videoInfo === 'object') {
      chosenQualityKey = qualityPriority.find(q => videoInfo[q] && videoInfo[q] !== 'Not found');
    }

    // If not found, maybe videoInfo itself is a direct url string
    let downloadUrl = null;
    if (chosenQualityKey) {
      downloadUrl = videoInfo[chosenQualityKey];
    } else if (typeof videoInfo === 'string' && videoInfo.startsWith('http')) {
      downloadUrl = videoInfo;
      chosenQualityKey = 'direct';
    } else {
      // try to find any value in object that looks like a url
      if (videoInfo && typeof videoInfo === 'object') {
        for (const k of Object.keys(videoInfo)) {
          if (typeof videoInfo[k] === 'string' && videoInfo[k].startsWith('http')) {
            downloadUrl = videoInfo[k];
            chosenQualityKey = k;
            break;
          }
        }
      }
    }

    if (!downloadUrl) {
      return api.sendMessage(`❌ | ${module.exports.languages.en.noQuality}`, event.threadID, event.messageID);
    }

    // Stream download with axios
    const response = await axios.get(downloadUrl, {
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 60000
    });

    const tempPath = tempy.file({ extension: 'mp4' });
    const writer = fs.createWriteStream(tempPath);
    response.data.pipe(writer);

    // wait for finish
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
      response.data.on('error', reject);
    });

    // Send the video file to the thread
    await api.sendMessage({
      body: `✨ ${module.exports.languages.en.success}\n✦ Quality: ${chosenQualityKey}\n✦ Source: Facebook`,
      attachment: fs.createReadStream(tempPath)
    }, event.threadID);

    // Cleanup temp file
    try { fs.unlinkSync(tempPath); } catch (e) { /* ignore */ }

  } catch (error) {
    console.error('FB AutoDownload Error:', error);
    try {
      await api.sendMessage(`❌ | ${module.exports.languages.en.failed}\n✦ Error: ${error.message}`, event.threadID, event.messageID);
    } catch (err) {
      console.error('Failed to send error message to thread:', err);
    }
  }
};
