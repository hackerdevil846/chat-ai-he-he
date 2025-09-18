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
    throw new Error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑠𝑡𝑟𝑒𝑎𝑚 𝑓𝑟𝑜𝑚 𝑈𝑅𝐿.");
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

module.exports = {
  config: {
    name: "video",
    aliases: ["ytdl", "downloadvideo"],
    version: "1.1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    category: "media",
    shortDescription: {
      en: "𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑣𝑖𝑑𝑒𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑟𝑜𝑚 𝑈𝑅𝐿 𝑜𝑟 𝑠𝑒𝑎𝑟𝑐ℎ"
    },
    longDescription: {
      en: "𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑣𝑖𝑑𝑒𝑜𝑠 𝑢𝑠𝑖𝑛𝑔 𝑈𝑅𝐿 𝑜𝑟 𝑠𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑦"
    },
    guide: {
      en: "{p}video [𝑈𝑅𝐿 𝑜𝑟 𝑠𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑦]"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "yt-search": ""
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      let videoID;
      const url = args[0];

      if (url && (url.includes("youtube.com") || url.includes("youtu.be"))) {
        videoID = getVideoID(url);
        if (!videoID) {
          return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑈𝑅𝐿 𝑝𝑟𝑜𝑣𝑖𝑑𝑒𝑑!");
        }
      } else {
        const query = args.join(" ");
        if (!query) return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑈𝑅𝐿 𝑜𝑟 𝑠𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑦!");

        const processingMsg = await message.reply(`🔍 𝑆𝑒𝑎𝑟𝑐ℎ𝑖𝑛𝑔: "${query}"`);
        const r = await yts(query);
        const videos = r.videos.slice(0, 30);
        
        if (videos.length === 0) {
          await api.unsendMessage(processingMsg.messageID);
          return message.reply("❌ 𝑁𝑜 𝑣𝑖𝑑𝑒𝑜𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝑦𝑜𝑢𝑟 𝑠𝑒𝑎𝑟𝑐ℎ 𝑞𝑢𝑒𝑟𝑦!");
        }
        
        const selected = videos[Math.floor(Math.random() * videos.length)];
        videoID = selected.videoId;
        await api.unsendMessage(processingMsg.messageID);
      }

      const { data } = await axios.get(`${global.apis.diptoApi}/ytDl3?link=${videoID}&format=mp4`);
      
      if (!data || !data.downloadLink) {
        throw new Error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑙𝑖𝑛𝑘 𝑓𝑟𝑜𝑚 𝑎𝑝𝑖");
      }

      const { title, quality, downloadLink } = data;

      const shortenedLink = (await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(downloadLink)}`)).data;

      await message.reply({
        body: `🎬 𝑇𝑖𝑡𝑙𝑒: ${title}\n📺 𝑄𝑢𝑎𝑙𝑖𝑡𝑦: ${quality}\n📥 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑: ${shortenedLink}`,
        attachment: await global.utils.getStreamFromURL(downloadLink, `${title}.mp4`)
      });

    } catch (err) {
      console.error("𝑉𝑖𝑑𝑒𝑜 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", err);
      return message.reply("⚠️ 𝐸𝑟𝑟𝑜𝑟: " + (err.message || "𝐴𝑛 𝑢𝑛𝑘𝑛𝑜𝑤𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑."));
    }
  }
};
