const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytdl = require("ytdl-core");
const ffmpegPath = require("ffmpeg-static");
const cp = require("child_process");

module.exports = {
  config: {
    name: "music-play",
    version: "1.0.4",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🎶 𝙆𝙚𝙮𝙬𝙤𝙧𝙙 𝙙𝙞𝙮𝙚 𝙗𝙖 𝙡𝙞𝙣𝙠 𝙩𝙝𝙚𝙠𝙚 𝙔𝙤𝙪𝙏𝙪𝙗𝙚 𝙜𝙖𝙖𝙣 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙠𝙤𝙧𝙪𝙣 🎧",
    commandCategory: "Media",
    usages: "[song_name_or_link] [audio/video]",
    cooldowns: 5,
    dependencies: {
      "ytdl-core": "",
      "ffmpeg-static": "",
      "axios": "",
      "yt-search": ""
    },
  },

  run: async function ({ api, event, args }) {
    let query, type;

    if (args.length > 1 && (args[args.length - 1] === "audio" || args[args.length - 1] === "video")) {
      type = args.pop();
      query = args.join(" ");
    } else {
      query = args.join(" ");
      type = "audio";
    }

    if (!query) {
        return api.sendMessage("❔ | 𝑫𝒐𝒚𝒂 𝒌𝒐𝒓𝒆 𝒆𝒌𝒕𝒊 𝒈𝒂𝒂𝒏𝒆𝒓 𝒏𝒂𝒂𝒎 𝒃𝒂 𝒍𝒊𝒏𝒌 𝒅𝒊𝒏. 🎶", event.threadID, event.messageID);
    }
    
    const processingMessage = await api.sendMessage(
      "✅ | 𝑨𝒑𝒏𝒂𝒓 𝒐𝒏𝒖𝒓𝒐𝒅𝒉 𝒑𝒓𝒐𝒔𝒆𝒔 𝒌𝒐𝒓𝒂 𝒉𝒐𝒄𝒄𝒉𝒆. 𝑫𝒐𝒚𝒂 𝒌𝒐𝒓𝒆 𝒐𝒑𝒆𝒌𝒌𝒉𝒂 𝒌𝒐𝒓𝒖𝒏... ⏳",
      event.threadID,
      null,
      event.messageID
    );

    try {
      let videoId;
      if (ytdl.validateURL(query)) {
        videoId = ytdl.getURLVideoID(query);
      } else {
        const searchResults = await ytSearch(query);
        if (!searchResults || !searchResults.videos.length) {
          throw new Error("𝑨𝒑𝒏𝒂𝒓 𝒌𝒉𝒐𝒋𝒂𝒓 𝒋𝒐ᱱ𝒏𝒐 𝒌𝒐ᱱ𝒐 𝒇𝒐𝒍𝒂𝒇𝒐𝒍 𝒑𝒂𝒐𝒂 𝒋𝒂𝒚𝒏𝒊. 😔");
        }
        videoId = searchResults.videos[0].videoId;
      }

      const info = await ytdl.getInfo(videoId);
      const title = info.videoDetails.title.replace(/[^a-zA-Z0-9\s\-_]/g, "");
      const filename = `${title}.${type === "audio" ? "mp3" : "mp4"}`;
      const downloadPath = path.join(__dirname, "cache", filename);

      if (!fs.existsSync(path.dirname(downloadPath))) {
        fs.mkdirSync(path.dirname(downloadPath), { recursive: true });
      }

      api.setMessageReaction("⌛", event.messageID, () => {}, true);

      if (type === "audio") {
        const audio = ytdl(videoId, { quality: 'highestaudio' });
        cp.exec(`"${ffmpegPath}" -i pipe:0 -b:a 192K ${downloadPath}`, { windowsHide: true, stdio: ['pipe', 'ignore', 'ignore'] }, (err) => {
          if (err) {
            console.error(`FFmpeg error: ${err.message}`);
            api.unsendMessage(processingMessage.messageID);
            return api.sendMessage("❌ | 𝑨udio 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒕𝒆 𝒃𝒚𝒂𝒓𝒕𝒉𝒐. 😞", event.threadID, event.messageID);
          }
          api.setMessageReaction("✅", event.messageID, () => {}, true);
          api.sendMessage(
            {
              attachment: fs.createReadStream(downloadPath),
              body: `✨ 𝑻𝒊𝒕𝒍𝒆: ${info.videoDetails.title}\n\n🎶 𝑬𝒊 𝒏𝒊𝒏 𝒂𝒑𝒏𝒂𝒓 𝒂𝒖𝒅𝒊𝒐 🎧`,
            },
            event.threadID,
            () => {
              fs.unlinkSync(downloadPath);
              api.unsendMessage(processingMessage.messageID);
            },
            event.messageID
          );
        }).stdin.end(audio.read());
      } else {
        ytdl(videoId, { quality: 'highestvideo' })
          .pipe(fs.createWriteStream(downloadPath))
          .on('finish', () => {
            api.setMessageReaction("✅", event.messageID, () => {}, true);
            api.sendMessage(
              {
                attachment: fs.createReadStream(downloadPath),
                body: `✨ 𝑻𝒊𝒕𝒍𝒆: ${info.videoDetails.title}\n\n🎬 𝑬𝒊 𝒏𝒊𝒏 𝒂𝒑𝒏𝒂𝒓 𝒗𝒊𝒅𝒆𝒐 🎥`,
              },
              event.threadID,
              () => {
                fs.unlinkSync(downloadPath);
                api.unsendMessage(processingMessage.messageID);
              },
              event.messageID
            );
          })
          .on('error', (err) => {
            console.error(`Video download error: ${err.message}`);
            api.unsendMessage(processingMessage.messageID);
            api.sendMessage("❌ | 𝑽ideo 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒕𝒆 𝒃𝒚𝒂𝒓𝒕𝒉𝒐. 😞", event.threadID, event.messageID);
          });
      }
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

