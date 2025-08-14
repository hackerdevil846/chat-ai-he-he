module.exports.config = {
  name: "sourchvideo",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Search and download YouTube videos (GoatBot structured)",
  usePrefix: false,
  category: "Media",
  usages: "user",
  cooldowns: 5,
  dependencies: {
    "ytdl-core": "",
    "simple-youtube-api": ""
  }
};

module.exports.onStart = function() {
  // initialization (keeps compatibility and prevents undefined errors)
  console.log("sourchvideo command started");
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  const axios = global.nodemodule.axios;
  const fs = global.nodemodule['fs-extra'];
  const { createReadStream, unlinkSync, statSync } = fs;

  try {
    // Re-fetch config list (keeps behavior same as original)
    const response = await axios.get('https://raw.githubusercontent.com/quyenkaneki/data/main/video.json');
    const randomVideo = response.data.keyVideo[Math.floor(Math.random() * response.data.keyVideo.length)];

    // Validate handleReply and links
    if (!handleReply || !handleReply.link || !Array.isArray(handleReply.link)) {
      return api.sendMessage("No valid video list found.", event.threadID, event.messageID);
    }

    const choice = parseInt(event.body);
    if (isNaN(choice) || choice < 1 || choice > handleReply.link.length) {
      return api.sendMessage(`choose from 1 -> ${handleReply.link.length} baby.uwu ❤️`, event.threadID, event.messageID);
    }

    // unsend the original choice message to keep chat clean
    try { api.unsendMessage(handleReply.messageID); } catch (e) { /* ignore */ }

    const videoId = handleReply.link[choice - 1];

    const requestParams = {
      method: 'GET',
      url: 'https://ytstream-download-youtube-videos.p.rapidapi.com/dl',
      params: { id: videoId },
      headers: {
        'x-rapidapi-host': 'ytstream-download-youtube-videos.p.rapidapi.com',
        'x-rapidapi-key': `${randomVideo.API_KEY}`
      }
    };

    const videoDetails = (await axios.request(requestParams)).data;

    if (videoDetails && videoDetails.status === 'fail') {
      return api.sendMessage('This file could not be sent..', event.threadID, event.messageID);
    }

    // Choose a stream quality robustly (if only one quality available, take first)
    const qualities = Object.keys(videoDetails.link || {});
    const streamQuality = qualities.length > 1 ? qualities[1] : qualities[0];
    const videoStreamUrl = videoDetails.link[streamQuality][0];

    const videoPath = __dirname + '/cache/1.mp4';
    const videoData = (await axios.get(videoStreamUrl, { responseType: 'arraybuffer' })).data;

    // Write binary buffer directly
    fs.writeFileSync(videoPath, Buffer.from(videoData));

    // Size check (25MB limit)
    if (fs.statSync(videoPath).size > 26 * 1024 * 1024) {
      try { unlinkSync(videoPath); } catch (e) {}
      return api.sendMessage("Can't send the file because of the larger size 25MB.", event.threadID, event.messageID);
    }

    // Send the video and cleanup after
    return api.sendMessage(
      {
        body: `✅ ${videoDetails.title}`,
        attachment: createReadStream(videoPath)
      },
      event.threadID,
      (err, info) => {
        try { fs.unlinkSync(videoPath); } catch (e) {}
      },
      event.messageID
    );

  } catch (error) {
    return api.sendMessage("Không thể gửi file này!", event.threadID, event.messageID);
  }
};

module.exports.run = async function({ api, event, args }) {
  const axios = global.nodemodule.axios;
  const fs = global.nodemodule['fs-extra'];
  const SimpleYouTubeApi = global.nodemodule['simple-youtube-api'];
  const { createReadStream, unlinkSync } = fs;

  try {
    const response = await axios.get('https://raw.githubusercontent.com/quyenkaneki/data/main/video.json');
    const videoListLength = response.data.keyVideo.length;
    const randomVideoConfig = response.data.keyVideo[Math.floor(Math.random() * videoListLength)];

    // YouTube API keys fallback list (kept from original)
    const youtubeApiKeys = [
      'AIzaSyB5A3Lum6u5p2Ki2btkGdzvEqtZ8KNLeXo',
      'AIzaSyAyjwkjc0w61LpOErHY_vFo6Di5LEyfLK0',
      'AIzaSyBY5jfFyaTNtiTSBNCvmyJKpMIGlpCSB4w',
      'AIzaSyCYCg9qpFmJJsEcr61ZLV5KsmgT1RE5aI4'
    ];

    const apiKey = youtubeApiKeys[Math.floor(Math.random() * youtubeApiKeys.length)];
    const youtube = new SimpleYouTubeApi(apiKey);

    if (!args.length || !args[0]) {
      return api.sendMessage("» The search section can't be done. Blank! ", event.threadID, event.messageID);
    }

    const searchQuery = args.join(' ');

    // If user passed a direct URL, handle with URL handler
    if (searchQuery.indexOf('https://') === 0 || searchQuery.indexOf('http://') === 0) {
      await handleUrlRequest(api, event, youtube, randomVideoConfig);
      return;
    }

    // Search for videos (limit 12)
    const searchResults = await youtube.searchVideos(searchQuery, 12);

    if (!searchResults || !searchResults.length) {
      return api.sendMessage('No results found.', event.threadID, event.messageID);
    }

    const videoIds = [];
    let messageText = '';
    const attachments = [];
    const tempImagePaths = [];
    let counter = 0;

    for (const video of searchResults) {
      if (!video || !video.id) continue;
      videoIds.push(video.id);

      counter++;
      const imagePath = __dirname + `/cache/${counter}.png`;
      const imageUrl = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;

      // getDuration and getChannelTitle use the same apiKey as above
      const duration = await getDuration(apiKey, video.id);
      const channelTitle = await getChannelTitle(apiKey, video.id);

      const imageData = (await axios.get(imageUrl, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(imagePath, Buffer.from(imageData));
      tempImagePaths.push(imagePath);
      attachments.push(createReadStream(imagePath));

      // number prefixes (kept style from original)
      const prefixes = ["⓵","⓶","⓷","⓸","⓹","⓺","➐","➑","➒","❿","⓫","⓬"];
      const numberPrefix = prefixes[counter - 1] || `${counter}.`;

      messageText += `${numberPrefix} 《${duration}》 ${video.title}\n\n`;
    }

    const helpMessage = `»🔎 There's ${videoIds.length} list that coincides with your search keyword:\n\n\n${messageText}» Reply(reply in order number) select one of the searches above`;

    // Send message with attachments and push handleReply
    api.sendMessage(
      { attachment: attachments, body: helpMessage },
      event.threadID,
      (err, info) => {
        // cleanup temporary thumbnails
        try {
          for (const p of tempImagePaths) {
            try { unlinkSync(p); } catch (e) {}
          }
        } catch (e) {}

        // register handleReply so next reply maps to the correct video IDs
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          link: videoIds
        });
      },
      event.messageID
    );

  } catch (error) {
    api.sendMessage("Không thể xử lý request do đã phát sinh lỗi modul: " + (error && error.message ? error.message : error), event.threadID, event.messageID);
  }
};

// Helper function to get video duration (kept original approach)
async function getDuration(apiKey, videoId) {
  const axios = global.nodemodule.axios;
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`);
    const content = response.data.items && response.data.items[0] && response.data.items[0].contentDetails;
    if (!content || !content.duration) return '0:00';
    const durationStr = content.duration.slice(2).replace('S', '').replace('M', ':');
    return durationStr;
  } catch (e) {
    return '0:00';
  }
}

// Helper function to get channel title
async function getChannelTitle(apiKey, videoId) {
  const axios = global.nodemodule.axios;
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`);
    return response.data.items[0].snippet.channelTitle || '';
  } catch (e) {
    return '';
  }
}

// Helper function to handle direct URL requests (kept behavior and paths same)
async function handleUrlRequest(api, event, youtube, randomVideoConfig) {
  const axios = global.nodemodule.axios;
  const fs = global.nodemodule['fs-extra'];
  const { unlinkSync } = fs;

  try {
    const videoUrl = event.args && event.args[0] ? event.args[0] : '';
    const videoIdMatch = videoUrl.match(/^.*(youtu.be\/|v\/|embed\/|watch\?|youtube.com\/user\/[^#]*#([^\/]*?\/)*?)\??v=?([^#\&\?]*).*/);
    const videoId = videoIdMatch ? videoIdMatch[3] : null;
    if (!videoId) return api.sendMessage('Invalid YouTube URL.', event.threadID, event.messageID);

    const requestParams = {
      method: 'GET',
      url: 'https://ytstream-download-youtube-videos.p.rapidapi.com/dl',
      params: { id: videoId },
      headers: {
        'x-rapidapi-host': 'ytstream-download-youtube-videos.p.rapidapi.com',
        'x-rapidapi-key': `${randomVideoConfig.API_KEY}`
      }
    };

    const videoDetails = (await axios.request(requestParams)).data;
    if (videoDetails && videoDetails.status === 'fail') {
      return api.sendMessage('This file could not be sent..', event.threadID, event.messageID);
    }

    const qualities = Object.keys(videoDetails.link || {});
    const streamQuality = qualities.length > 1 ? qualities[1] : qualities[0];
    const videoStreamUrl = videoDetails.link[streamQuality][0];

    const videoPath = __dirname + '/cache/1.mp4';
    const videoData = (await axios.get(videoStreamUrl, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(videoPath, Buffer.from(videoData));

    if (fs.statSync(videoPath).size > 26 * 1024 * 1024) {
      try { unlinkSync(videoPath); } catch (e) {}
      return api.sendMessage("Can't send the file because of the larger size 25MB.", event.threadID, event.messageID);
    }

    api.sendMessage(
      { body: `» ${videoDetails.title}`, attachment: fs.createReadStream(videoPath) },
      event.threadID,
      (err, info) => { try { unlinkSync(videoPath); } catch (e) {} },
      event.messageID
    );

  } catch (error) {
    api.sendMessage('Không thể gửi file này!', event.threadID, event.messageID);
  }
}
