const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytSearch = require("yt-search");

module.exports = {
  config: {
    name: "sing",
    version: "1.0.3",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝙆𝙚𝙮𝙬𝙤𝙧𝙙 𝙙𝙞𝙮𝙚 𝙗𝙖 𝙡𝙞𝙣𝙠 𝙩𝙝𝙚𝙠𝙚 𝙔𝙤𝙪𝙏𝙪𝙗𝙚 𝙜𝙖𝙖𝙣 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙠𝙤𝙧𝙪𝙣",
    commandCategory: "Media",
    usages: "[gaan_er_naam] [audio/video]",
    cooldowns: 5,
    dependencies: {
      "node-fetch": "",
      "yt-search": "",
    },
  },

  run: async function ({ api, event, args }) {
    let songName, type;

    if (
      args.length > 1 &&
      (args[args.length - 1] === "audio" || args[args.length - 1] === "video")
    ) {
      type = args.pop();
      songName = args.join(" ");
    } else {
      songName = args.join(" ");
      type = "audio";
    }

    if (!songName) {
        return api.sendMessage("❔ | 𝑫𝒐𝒚𝒂 𝒌𝒐𝒓𝒆 𝒆𝒌𝒕𝒊 𝒈𝒂𝒂𝒏𝒆𝒓 𝒏𝒂𝒂𝒎 𝒅𝒊𝒏.", event.threadID, event.messageID);
    }
    
    const processingMessage = await api.sendMessage(
      "✅ | 𝑨𝒑𝒏𝒂𝒓 𝒐𝒏𝒖𝒓𝒐𝒅𝒉 𝒑𝒓𝒐𝒔𝒆𝒔 𝒌𝒐𝒓𝒂 𝒉𝒐𝒄𝒄𝒉𝒆. 𝑫𝒐𝒚𝒂 𝒌𝒐𝒓𝒆 𝒐𝒑𝒆𝒌𝒌𝒉𝒂 𝒌𝒐𝒓𝒖𝒏...",
      event.threadID,
      null,
      event.messageID
    );

    try {
      const searchResults = await ytSearch(songName);
      if (!searchResults || !searchResults.videos.length) {
        throw new Error("𝑨𝒑𝒏𝒂𝒓 𝒌𝒉𝒐𝒋𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒌𝒐𝒏𝒐 𝒇𝒐𝒍𝒂𝒇𝒐𝒍 𝒑𝒂𝒐𝒂 𝒋𝒂𝒚𝒏𝒊.");
      }

      const topResult = searchResults.videos[0];
      const videoId = topResult.videoId;

      const apiKey = "priyansh-here"; 
      const apiUrl = `https://priyanshuapi.xyz/youtube?id=${videoId}&type=${type}&apikey=${apiKey}`;

      api.setMessageReaction("⌛", event.messageID, () => {}, true);

      const downloadResponse = await axios.get(apiUrl);
      const downloadUrl = downloadResponse.data.downloadUrl;

      if (!downloadUrl) {
          throw new Error("𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒍𝒊𝒏𝒌 𝒑𝒂𝒐𝒂 𝒋𝒂𝒚𝒏𝒊.");
      }
      
      const safeTitle = topResult.title.replace(/[^a-zA-Z0-9 \-_]/g, "");
      const filename = `${safeTitle}.${type === "audio" ? "mp3" : "mp4"}`;
      const downloadPath = path.join(__dirname, "cache", filename);

      if (!fs.existsSync(path.dirname(downloadPath))) {
        fs.mkdirSync(path.dirname(downloadPath), { recursive: true });
      }

      const response = await axios({
        url: downloadUrl,
        method: "GET",
        responseType: "stream",
      });

      const fileStream = fs.createWriteStream(downloadPath);
      response.data.pipe(fileStream);

      await new Promise((resolve, reject) => {
        fileStream.on("finish", resolve);
        fileStream.on("error", reject);
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      await api.sendMessage(
        {
          attachment: fs.createReadStream(downloadPath),
          body: `✨ 𝑻𝒊𝒕𝒍𝒆: ${topResult.title}\n\n🎶 𝑬𝒊 𝒏𝒊𝒏 𝒂𝒑𝒏𝒂𝒓 ${
            type === "audio" ? "audio" : "video"
          } 🎧`,
        },
        event.threadID,
        () => {
          fs.unlinkSync(downloadPath);
          api.unsendMessage(processingMessage.messageID);
        },
        event.messageID
      );
    } catch (error) {
      console.error(`❌ | 𝑮𝒂𝒂𝒏 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒃𝒐𝒏𝒈 𝒑𝒂𝒕𝒉𝒂𝒕𝒆 𝒃𝒚𝒂𝒓𝒕𝒉𝒐: ${error.message}`);
      api.unsendMessage(processingMessage.messageID);
      api.sendMessage(
        `❌ | 𝑮𝒂𝒂𝒏 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒕𝒆 𝒃𝒚𝒂𝒓𝒕𝒉𝒐: ${error.message}`,
        event.threadID,
        event.messageID
      );
    }
  },
};
