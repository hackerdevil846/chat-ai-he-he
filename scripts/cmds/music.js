const fs = require("fs");
const path = require("path");
const axios = require("axios");
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

module.exports.config = {
  name: "music",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🎵 Download YouTube music/videos or playlist tracks",
  category: "media",
  usages: "[song name/YouTube link/playlist link] [audio/video]",
  cooldowns: 15,
  dependencies: {
    "ytdl-core": "",
    "axios": "",
    "yt-search": ""
  },
  envConfig: {}
};

module.exports.onLoad = async function() {
  // Ensure cache folder exists
  const cachePath = path.join(__dirname, "cache");
  if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });
};

module.exports.onStart = async function({ api, event, args }) {
  const { threadID, messageID } = event;

  const sendMessage = (msg) => api.sendMessage(msg, threadID, messageID);

  if (!args.length) {
    return sendMessage("❌ Please provide a song name, YouTube link, or playlist link\nExample: !music shape of you audio");
  }

  try {
    let query = args.join(" ");
    let type = "audio";
    let isPlaylist = false;
    let playlistId = null;

    const lastArg = args[args.length - 1].toLowerCase();
    if (lastArg === "audio" || lastArg === "video") {
      type = lastArg;
      query = args.slice(0, -1).join(" ");
    }

    const playlistRegex = /[?&]list=([^&]+)/i;
    const playlistMatch = query.match(playlistRegex);
    if (playlistMatch) {
      isPlaylist = true;
      playlistId = playlistMatch[1];
    }

    const processingMsg = await api.sendMessage(
      isPlaylist ? "🔍 Fetching playlist data..." : "🔍 Searching YouTube...",
      threadID
    );

    if (isPlaylist) {
      const playlistData = await getPlaylistVideos(playlistId);

      if (!playlistData.status || !playlistData.data || !playlistData.data.length) {
        await api.unsendMessage(processingMsg.messageID);
        return sendMessage("❌ No videos found in this playlist");
      }

      const maxVideos = 5;
      const videos = playlistData.data.slice(0, maxVideos);
      const totalVideos = Math.min(playlistData.data.length, maxVideos);

      await api.unsendMessage(processingMsg.messageID);
      await api.sendMessage(
        `📼 Found playlist with ${playlistData.data.length} videos\nDownloading first ${totalVideos} ${type} files...`,
        threadID
      );

      for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        try {
          const videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
          const sanitizedTitle = video.title.replace(/[^\w\s]/gi, '').trim().substring(0, 50);
          const filename = `${sanitizedTitle}.${type === "audio" ? "mp3" : "mp4"}`;
          const downloadPath = path.join(__dirname, "cache", filename);

          await new Promise((resolve) => {
            ytdl(videoUrl, {
              quality: type === 'audio' ? 'highestaudio' : 'highestvideo',
              filter: type === 'audio' ? 'audioonly' : 'videoandaudio'
            })
            .pipe(fs.createWriteStream(downloadPath))
            .on('finish', resolve);
          });

          await api.sendMessage(
            {
              body: `🎵 [${i+1}/${videos.length}] ${video.title}\n⏱️ Duration: ${video.duration}`,
              attachment: fs.createReadStream(downloadPath)
            },
            threadID
          );

          fs.unlinkSync(downloadPath);
        } catch (err) {
          console.error(`Error with video ${video.videoId}:`, err);
          api.sendMessage(`❌ Failed to download: ${video.title}`, threadID);
        }
      }
    } else {
      const searchResults = await ytSearch(query);

      if (!searchResults.videos.length) {
        await api.unsendMessage(processingMsg.messageID);
        return sendMessage("❌ No results found. Please try a different query.");
      }

      const video = searchResults.videos[0];
      const sanitizedTitle = video.title.replace(/[^\w\s]/gi, '').trim().substring(0, 50);
      const filename = `${sanitizedTitle}.${type === "audio" ? "mp3" : "mp4"}`;
      const downloadPath = path.join(__dirname, "cache", filename);

      await api.unsendMessage(processingMsg.messageID);
      await api.sendMessage(`⬇️ Downloading ${type === "audio" ? "audio" : "video"}...`, threadID);

      await new Promise((resolve) => {
        ytdl(video.url, {
          quality: type === 'audio' ? 'highestaudio' : 'highestvideo',
          filter: type === 'audio' ? 'audioonly' : 'videoandaudio'
        })
        .pipe(fs.createWriteStream(downloadPath))
        .on('finish', resolve);
      });

      const duration = video.duration.toString().includes(':') 
        ? video.duration 
        : new Date(video.duration * 1000).toISOString().substr(11, 8);

      await api.sendMessage(
        {
          body: `🎵 Title: ${video.title}\n⏱️ Duration: ${duration}\n👀 Views: ${video.views.toLocaleString()}\n📅 Uploaded: ${video.ago}`,
          attachment: fs.createReadStream(downloadPath)
        },
        threadID,
        () => fs.unlinkSync(downloadPath)
      );
    }
  } catch (error) {
    console.error("Music command error:", error);
    sendMessage(`❌ Error: ${error.message || "An error occurred"}`);
  }
};

async function getPlaylistVideos(playlistId) {
  const options = {
    method: 'GET',
    url: 'https://youtube-music-api-yt.p.rapidapi.com/get-playlist-videos',
    params: { playlistId },
    headers: {
      'x-rapidapi-key': '78186a3f74msh516a9d9dd0f051cp19fea6jsnac2a9d4351fb',
      'x-rapidapi-host': 'youtube-music-api-yt.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    throw new Error('❌ Failed to fetch playlist: ' + error.message);
  }
}
