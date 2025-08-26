const axios = require("axios");
const yts = require("yt-search");

async function baseApiUrl() {
  const base = await axios.get(`https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`);
  return base.data.api;
}

(async () => {
  global.apis = {
    diptoApi: await baseApiUrl()
  };
})();

async function getStreamFromURL(url, pathName) {
  try {
    const response = await axios.get(url, { responseType: "stream" });
    response.data.path = pathName;
    return response.data;
  } catch {
    throw new Error("𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒈𝒆𝒕 𝒔𝒕𝒓𝒆𝒂𝒎 𝒇𝒓𝒐𝒎 𝑼𝑹𝑳.");
  }
}

global.utils = {
  ...global.utils,
  getStreamFromURL: global.utils.getStreamFromURL || getStreamFromURL
};

function getVideoID(url) {
  const regex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

module.exports.config = {
  name: "video",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "𝒀𝒐𝒖𝑻𝒖𝒃𝒆 𝒗𝒊𝒅𝒆𝒐 𝒅𝒂𝒖𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒖𝒏 𝑼𝑹𝑳 𝒃𝒂 𝒏𝒂𝒎 𝒅𝒊𝒚𝒆",
  category: "media",
  usages: "[𝒖𝒓𝒍 | 𝒈𝒂𝒏𝒆𝒓 𝒏𝒂𝒎]",
  cooldowns: 5,
  usePrefix: true
};

module.exports.onStart = async function ({ api, args, event }) {
  try {
    let videoID;
    const url = args[0];

    if (url && (url.includes("youtube.com") || url.includes("youtu.be"))) {
      videoID = getVideoID(url);
      if (!videoID) {
        return api.sendMessage("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒀𝒐𝒖𝑻𝒖𝒃𝒆 𝑼𝑹𝑳 𝒅𝒆𝒘𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆!", event.threadID, event.messageID);
      }
    } else {
      const query = args.join(" ");
      if (!query) return api.sendMessage("❌ 𝑬𝒌𝒕𝒂 𝒈𝒂𝒏𝒆𝒓 𝒏𝒂𝒎 𝒃𝒂 𝒀𝒐𝒖𝑻𝒖𝒃𝒆 𝒍𝒊𝒏𝒌 𝒅𝒊𝒏!", event.threadID, event.messageID);

      var w = await api.sendMessage(`🔍 𝑺𝒆𝒂𝒓𝒄𝒉 𝒌𝒐𝒓𝒂 𝒉𝒐𝒄𝒄𝒉𝒆: "${query}"`, event.threadID);
      const r = await yts(query);
      const videos = r.videos.slice(0, 30);
      const selected = videos[Math.floor(Math.random() * videos.length)];
      videoID = selected.videoId;
    }

    const { data } = await axios.get(`${global.apis.diptoApi}/ytDl3?link=${videoID}&format=mp4`);
    const { title, quality, downloadLink } = data;

    if (w?.messageID) api.unsendMessage(w.messageID);

    const shortenedLink = (await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(downloadLink)}`)).data;

    return api.sendMessage({
      body: `🎬 𝑻𝒊𝒕𝒍𝒆: ${title}\n📺 𝑸𝒖𝒂𝒍𝒊𝒕𝒚: ${quality}\n📥 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅: ${shortenedLink}`,
      attachment: await global.utils.getStreamFromURL(downloadLink, `${title}.mp4`)
    }, event.threadID, event.messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("⚠️ 𝑬𝒓𝒓𝒐𝒓: " + (err.message || "𝑲𝒊𝒄𝒉𝒖 𝒆𝒌𝒕𝒂 𝒈𝒐𝒍𝒎𝒂𝒍 𝒉𝒐𝒚𝒆𝒄𝒉𝒆."), event.threadID, event.messageID);
  }
};
