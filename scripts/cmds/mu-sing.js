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
description: "𝒌𝒆𝒚𝒘𝒐𝒓𝒅 𝒔𝒆𝒂𝒓𝒄𝒉 𝒆𝒃𝒐𝒏𝒈 𝒍𝒊𝒏𝒌 𝒕𝒉𝒆𝒌𝒆 𝒀𝒐𝒖𝑻𝒖𝒃𝒆 𝒈𝒂𝒏 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒖𝒏",
commandCategory: "Media",
usages: "[𝒔𝒐𝒏𝒈𝑵𝒂𝒎𝒆] [𝒕𝒚𝒑𝒆]",
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

const processingMessage = await api.sendMessage(
  "⌛ 𝒂𝒑𝒏𝒂𝒓 𝒓𝒊𝒌𝒖𝒆𝒔𝒕 𝒑𝒓𝒐𝒔𝒆𝒔 𝒌𝒐𝒓𝒄𝒉𝒊. 𝒅𝒆𝒓𝒊 𝒌𝒐𝒓𝒖𝒏...",
  event.threadID,
  null,
  event.messageID
);

try {
  const searchResults = await ytSearch(songName);
  if (!searchResults || !searchResults.videos.length) {
    throw new Error("𝒂𝒑𝒏𝒂𝒓 𝒔𝒆𝒂𝒓𝒄𝒉 𝒌𝒆𝒚𝒘𝒐𝒓𝒅 𝒆𝒓 𝒌𝒐𝒏𝒐 𝒓𝒊𝒛𝒂𝒍𝒕 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂.");
  }

  const topResult = searchResults.videos[0];
  const videoId = topResult.videoId;

  const apiKey = "priyansh-here";
  const apiUrl = `https://priyanshuapi.xyz/youtube?id=${videoId}&type=${type}&apikey=${apiKey}`;

  api.setMessageReaction("⌛", event.messageID, () => {}, true);

  const downloadResponse = await axios.get(apiUrl);
  const downloadUrl = downloadResponse.data.downloadUrl;

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
      body: `🖤 𝒕𝒂𝒊𝒕𝒆𝒍: ${topResult.title}\n\n𝒆𝒊 𝒉𝒐𝒍𝒐 𝒂𝒑𝒏𝒂𝒓 ${type === "audio" ? "𝒂𝒖𝒅𝒊𝒐" : "𝒗𝒊𝒅𝒆𝒐"} 🎧:`,
    },
    event.threadID,
    () => {
      fs.unlinkSync(downloadPath);
      api.unsendMessage(processingMessage.messageID);
    },
    event.messageID
  );
} catch (error) {
  console.error(`𝒈𝒂𝒏𝒂 𝒅𝒂𝒖𝒏𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓: ${error.message}`);
  api.sendMessage(
    `𝒈𝒂𝒏𝒂 𝒅𝒂𝒖𝒏𝒍𝒐𝒂𝒅 𝒌𝒂𝒓𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊 𝒏𝒂: ${error.message}`,
    event.threadID,
    event.messageID
  );
}
},
};
