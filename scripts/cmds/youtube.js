module.exports = {
  config: {
    name: "youtube",
    version: "1.0",
    role: 0,
    author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
    cooldowns: 40,
    shortDescription: {
      en: "𝗌𝖾𝗇𝖽 𝖸𝗈𝗎𝖳𝗎𝖻𝖾 𝗏𝗂𝖽𝖾𝗈"
    },
    longDescription: {
      en: "𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗇𝖽 𝗌𝖾𝗇𝖽 𝖸𝗈𝗎𝖳𝗎𝖻𝖾 𝗏𝗂𝖽𝖾𝗈𝗌"
    },
    category: "video",
    usages: "{pn} 𝗏𝗂𝖽𝖾𝗈 𝗇𝖺𝗆𝖾",
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "ytdl-core": "",
      "yt-search": ""
    }
  },

  onStart: async ({ api, event, args }) => {
    try {
      // Dependency check
      let fsAvailable, axiosAvailable, ytdlAvailable, ytsAvailable;
      try {
        require("fs-extra");
        require("axios");
        require("ytdl-core");
        require("yt-search");
        fsAvailable = axiosAvailable = ytdlAvailable = ytsAvailable = true;
      } catch (e) {
        return api.sendMessage("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗑𝗂𝗈𝗌, 𝗒𝗍𝖽𝗅-𝖼𝗈𝗋𝖾, 𝖺𝗇𝖽 𝗒𝗍-𝗌𝖾𝖺𝗋𝖼𝗁.", event.threadID);
      }

      const fs = require("fs-extra");
      const axios = require("axios");
      const ytdl = require("ytdl-core");
      const yts = require("yt-search");

      // Check if video name is provided
      if (!args[0]) {
        return api.sendMessage("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗌𝗉𝖾𝖼𝗂𝖿𝗒 𝖺 𝗏𝗂𝖽𝖾𝗈 𝗇𝖺𝗆𝖾.\n\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: /youtube 𝗍𝗎𝗍𝗈𝗋𝗂𝖺𝗅", event.threadID);
      }

      const videoName = args.join(" ");

      try {
        await api.sendMessage(`✅ | 𝖲𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝗏𝗂𝖽𝖾𝗈 𝖿𝗈𝗋 "${videoName}"...\n⏳ | 𝖯𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍...`, event.threadID);

        // Search for videos
        const searchResults = await yts(videoName);
        if (!searchResults.videos.length) {
          return api.sendMessage("❌ 𝖭𝗈 𝗏𝗂𝖽𝖾𝗈 𝖿𝗈𝗎𝗇𝖽.", event.threadID, event.messageID);
        }

        const video = searchResults.videos[0];
        const videoUrl = video.url;

        // Validate YouTube URL
        if (!ytdl.validateURL(videoUrl)) {
          return api.sendMessage("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖸𝗈𝗎𝖳𝗎𝖻𝖾 𝖴𝖱𝖫.", event.threadID);
        }

        // Create cache directory if it doesn't exist
        const cacheDir = __dirname + '/cache';
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir, { recursive: true });
        }

        const fileName = `${event.senderID}_${Date.now()}.mp4`;
        const filePath = __dirname + `/cache/${fileName}`;

        console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀: ${video.title}`);

        // Download video with error handling
        const stream = ytdl(videoUrl, { 
          filter: "audioandvideo",
          quality: "lowest"
        });

        stream.pipe(fs.createWriteStream(filePath));

        stream.on('response', () => {
          console.log('✅ 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗌𝗍𝖺𝗋𝗍𝖾𝖽');
        });

        stream.on('info', (info) => {
          console.log(`📹 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗏𝗂𝖽𝖾𝗈: ${info.videoDetails.title}`);
        });

        stream.on('error', (error) => {
          console.error('❌ 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:', error);
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          } catch (cleanupError) {
            console.warn('𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:', cleanupError);
          }
          api.sendMessage('❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗏𝗂𝖽𝖾𝗈. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.', event.threadID);
        });

        stream.on('end', async () => {
          console.log('✅ 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖼𝗈𝗆𝗉𝗅𝖾𝗍𝖾');

          try {
            // Check file size
            const stats = fs.statSync(filePath);
            const fileSizeMB = stats.size / (1024 * 1024);

            if (fileSizeMB > 25) {
              fs.unlinkSync(filePath);
              return api.sendMessage('❌ 𝖳𝗁𝖾 𝗏𝗂𝖽𝖾𝗈 𝖼𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖻𝖾 𝗌𝖾𝗇𝗍 𝖻𝖾𝖼𝖺𝗎𝗌𝖾 𝗂𝗍 𝗂𝗌 𝗅𝖺𝗋𝗀𝖾𝗋 𝗍𝗁𝖺𝗇 25𝖬𝖡.', event.threadID);
            }

            // Check if file is valid
            if (stats.size < 1000) {
              fs.unlinkSync(filePath);
              return api.sendMessage('❌ 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝖿𝗂𝗅𝖾 𝗂𝗌 𝗂𝗇𝗏𝖺𝗅𝗂𝖽 𝗈𝗋 𝖾𝗆𝗉𝗍𝗒.', event.threadID);
            }

            const message = {
              body: `📹 | 𝖧𝖾𝗋𝖾'𝗌 𝗒𝗈𝗎𝗋 𝗏𝗂𝖽𝖾𝗈\n\n🔮 | 𝖳𝗂𝗍𝗅𝖾: ${video.title}\n⏰ | 𝖣𝗎𝗋𝖺𝗍𝗂𝗈𝗇: ${video.duration.timestamp || '𝖭/𝖠'}\n👀 | 𝖵𝗂𝖾𝗐𝗌: ${video.views || '𝖭/𝖠'}`,
              attachment: fs.createReadStream(filePath)
            };

            await api.sendMessage(message, event.threadID, (err) => {
              // Clean up file after sending
              try {
                if (fs.existsSync(filePath)) {
                  fs.unlinkSync(filePath);
                  console.log('🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾');
                }
              } catch (cleanupError) {
                console.warn('𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:', cleanupError);
              }
              
              if (err) {
                console.error('❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖾𝗇𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:', err);
              }
            });

          } catch (fileError) {
            console.error('❌ 𝖥𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:', fileError);
            try {
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }
            } catch (cleanupError) {
              console.warn('𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:', cleanupError);
            }
            api.sendMessage('❌ 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗏𝗂𝖽𝖾𝗈 𝖿𝗂𝗅𝖾.', event.threadID);
          }
        });

      } catch (searchError) {
        console.error('❌ 𝖲𝖾𝖺𝗋𝖼𝗁 𝖾𝗋𝗋𝗈𝗋:', searchError);
        api.sendMessage('❌ 𝖤𝗋𝗋𝗈𝗋 𝗌𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝖿𝗈𝗋 𝗏𝗂𝖽𝖾𝗈. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.', event.threadID);
      }

    } catch (error) {
      console.error('💥 𝖸𝗈𝗎𝖳𝗎𝖻𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:', error);
      api.sendMessage('❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗍𝗁𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.', event.threadID);
    }
  }
};
